from fastapi import APIRouter, UploadFile, File, Depends, Form
from sqlalchemy.orm import Session
from datetime import date
import pdfplumber
import tempfile
import os
import re
import numpy as np
import easyocr
from PIL import Image
from pdf2image import convert_from_path
from pypdf import PdfReader, PdfWriter  # Added for password handling

from app.database import SessionLocal
from app.models import Transaction, User, UploadedDocument
from app.services.parser import extract_transactions
from app.services.auth import get_current_user
from app.services.currency_service import convert_currency_logic

router = APIRouter()
reader = easyocr.Reader(['en'])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def ocr_extract_text(pdf_path: str) -> str:
    text = ""
    pages = convert_from_path(pdf_path)
    for page in pages:
        image = np.array(page)
        results = reader.readtext(image)
        for result in results:
            text += result[1] + "\n"
    return text

@router.post("/upload-statement")
async def upload_statement(
    file: UploadFile = File(...),
    password: str = Form(None),  # <-- Added optional password form field
    currency: str = Form("INR"),  # <-- Currency the statement is denominated in
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # ---------- Validate File ----------
    if not file.filename:
        return {"success": False, "message": "No file selected."}

    if not file.filename.lower().endswith(".pdf"):
        return {"success": False, "message": "Only PDF files are allowed."}

    # ---------- Resolve currency rate once (a statement is one currency) ----------
    statement_currency = (currency or "INR").upper()
    exchange_rate = 1.0
    if statement_currency != "INR":
        try:
            conv = await convert_currency_logic(1.0, statement_currency, "INR")
            exchange_rate = conv["rate"]
        except ValueError:
            # Unsupported currency code -- fall back to treating it as INR
            # rather than failing the whole upload.
            statement_currency = "INR"
            exchange_rate = 1.0

    # ---------- Save uploaded PDF ----------
    contents = await file.read()
    tmp_path = None 

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        # ---------- Handle Password Protection ----------
        pdf_reader = PdfReader(tmp_path)
        
        if pdf_reader.is_encrypted:
            if not password:
                return {
                    "success": False,
                    "requires_password": True,
                    "message": "This PDF is encrypted. Please provide the file password."
                }
            
            # Attempt to decrypt
            decryption_status = pdf_reader.decrypt(password)
            if decryption_status == 0:  # 0 indicates failure
                return {
                    "success": False,
                    "requires_password": True,
                    "message": "Incorrect password. Unable to unlock the bank statement."
                }
            
            # Save the decrypted version over the temp file for pdfplumber/easyocr
            pdf_writer = PdfWriter()
            for page in pdf_reader.pages:
                pdf_writer.add_page(page)
            with open(tmp_path, "wb") as f:
                pdf_writer.write(f)

        # ---------- Text Extraction ----------
        extracted_text = ""

        with pdfplumber.open(tmp_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text += page_text + "\n"

        if extracted_text.strip() == "":
            print("No digital text found. Running OCR...")
            extracted_text = ocr_extract_text(tmp_path)

        if extracted_text.strip() == "":
            return {"success": False, "message": "Unable to extract text from this PDF."}

        # ---------- Extract & Parse Transactions ----------
        transactions = extract_transactions(extracted_text)

        if len(transactions) == 0:
            return {
                "success": False,
                "message": "No transactions found. Please upload a valid bank statement.",
                "sample_text": extracted_text[:500]
            }

        # ---------- Save Uploaded Document ----------
        doc = UploadedDocument(
            user_id=current_user.id,
            filename=file.filename,
            extracted_text=extracted_text
        )
        db.add(doc)

        saved = 0
        skipped = 0

        for tx in transactions:
            tx_date = tx.get("date") or date.today()

            # Clean and parse amount safely (this is in the statement's own currency)
            clean_amount = str(tx["amount"]).replace(",", "").replace("₹", "").strip()
            original_amount_val = float(clean_amount)

            if statement_currency == "INR":
                final_amount = original_amount_val
                stored_original_amount = None
            else:
                final_amount = round(original_amount_val * exchange_rate, 2)
                stored_original_amount = original_amount_val

            duplicate = (
                db.query(Transaction)
                .filter(
                    Transaction.user_id == current_user.id,
                    Transaction.description == tx["description"],
                    Transaction.amount == final_amount,
                    Transaction.transaction_date == tx_date
                )
                .first()
            )

            if duplicate:
                skipped += 1
                continue

            transaction_type = "expense"
            desc = tx["description"].upper()
            
            # Robust check for credit/deposit/income indicators
            is_income = (
                any(k in desc for k in ["SALARY", "CREDIT", "DEPOSIT", "INTEREST", "REFUND", "DIVIDEND"]) or
                "/CR/" in desc or
                desc.endswith("/CR") or
                desc.startswith("CR/") or
                re.search(r"\bCR\b", desc) is not None or
                re.search(r"\b(NEFT|IMPS|RTGS|UPI|CHG|INT)?CR\b", desc) is not None or
                re.search(r"\b(NEFT|IMPS|RTGS|UPI|CHG|INT)?CR-", desc) is not None
            )
            
            if is_income:
                transaction_type = "income"

            transaction = Transaction(
                user_id=current_user.id,
                transaction_date=tx_date,
                description=tx["description"],
                amount=final_amount,
                currency=statement_currency,
                original_amount=stored_original_amount,
                exchange_rate=exchange_rate,
                category=tx.get("category", "Others"),
                transaction_type=transaction_type
            )
            db.add(transaction)
            saved += 1

        db.commit()

        return {
            "success": True,
            "filename": file.filename,
            "transactions_found": len(transactions),
            "transactions_saved": saved,
            "duplicates_skipped": skipped,
            "currency": statement_currency,
            "exchange_rate": exchange_rate,
            "message": "Bank statement processed successfully."
        }

    except Exception as e:
        db.rollback()
        return {"success": False, "message": f"Server Error: {str(e)}"}

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


# ---------------------------------------------------------------------------
#  Receipt photo scan helpers
# ---------------------------------------------------------------------------

# Keywords that suggest a "grand total" line (highest priority)
_TOTAL_LABELS = re.compile(
    r"(grand\s*total|total\s*amount|net\s*amount|amount\s*payable|total\s*payable"
    r"|total\s*due|balance\s*due|subtotal|total)",
    re.IGNORECASE,
)

# Match currency amounts: optional ₹/Rs., digits, optional comma-separated groups, optional decimal
_AMOUNT_PATTERN = re.compile(r"(?:₹|Rs\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)")

# Common date formats found on Indian receipts
_DATE_PATTERNS = [
    re.compile(r"\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b"),   # DD/MM/YY or MM/DD/YYYY
    re.compile(r"\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{2,4})\b", re.IGNORECASE),
    re.compile(r"\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})\b", re.IGNORECASE),
]

_MONTH_MAP = {m: i + 1 for i, m in enumerate(["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"])}

# Keyword → category mapping (checked against description in order)
_CATEGORY_RULES = [
    (re.compile(r"zomato|swiggy|cafe|restaurant|hotel|dhaba|food|pizza|burger|bakery|bake|biryani", re.I), "Food"),
    (re.compile(r"amazon|flipkart|myntra|ajio|nykaa|mall|mart|shop|store|supermarket|big\s*bazaar|reliance\s*smart", re.I), "Shopping"),
    (re.compile(r"uber|ola|rapido|cab|taxi|metro|irctc|railway|bus|flight|airline|redbus", re.I), "Travel"),
    (re.compile(r"fuel|petrol|diesel|hp|bharat\s*petroleum|iocl|essar|reliance\s*petrol", re.I), "Fuel"),
    (re.compile(r"netflix|spotify|amazon\s*prime|hotstar|disney|jio\s*cinema|youtube\s*premium|apple", re.I), "Subscription"),
    (re.compile(r"airtel|jio|bsnl|vodafone|vi\s*mobile|recharge|broadband|internet|wifi", re.I), "Utilities"),
    (re.compile(r"rent|maintenance|society|housing|property", re.I), "Rent"),
    (re.compile(r"doctor|hospital|clinic|pharmacy|chemist|medic|health|diagnostic|lab\s*test", re.I), "Others"),
]


def parse_receipt_fields(ocr_text: str) -> dict:
    """
    Given raw OCR text from a receipt, heuristically extract:
      - amount  (float | None)  — the most prominent "total" figure
      - description (str | None) — likely merchant / store name
      - date (str | None)       — ISO date YYYY-MM-DD if found
      - category (str)          — best-guess category label
    """
    lines = [ln.strip() for ln in ocr_text.splitlines() if ln.strip()]

    # ---- Amount: prefer lines that contain a "total" keyword ----
    amount: float | None = None
    for line in lines:
        if _TOTAL_LABELS.search(line):
            nums = _AMOUNT_PATTERN.findall(line)
            if nums:
                try:
                    candidate = float(nums[-1].replace(",", ""))
                    if amount is None or candidate > amount:
                        amount = candidate
                except ValueError:
                    pass

    # Fallback: largest number in the whole text (likely the total)
    if amount is None:
        all_nums = _AMOUNT_PATTERN.findall(ocr_text)
        parsed = []
        for n in all_nums:
            try:
                parsed.append(float(n.replace(",", "")))
            except ValueError:
                pass
        if parsed:
            amount = max(parsed)

    # ---- Description: first non-trivial line that isn't a date or pure number ----
    description: str | None = None
    for line in lines[:6]:  # Merchant name is almost always in first 6 lines
        # Skip lines that look like pure amounts, dates, or very short tokens
        if _AMOUNT_PATTERN.fullmatch(line.replace(",", "")):
            continue
        if any(p.search(line) for p in _DATE_PATTERNS):
            continue
        if len(line) < 3:
            continue
        # Skip lines that are ALL caps abbreviations / tax labels
        if re.fullmatch(r"[A-Z0-9\s/\-:]+", line) and len(line) < 5:
            continue
        description = line[:80]  # cap length
        break

    # ---- Date ----
    receipt_date: str | None = None
    for line in lines:
        for pat in _DATE_PATTERNS:
            m = pat.search(line)
            if not m:
                continue
            groups = m.groups()
            try:
                if len(groups) == 3:
                    g0, g1, g2 = groups
                    # Check if g1 is a month name
                    if isinstance(g1, str) and g1.lower()[:3] in _MONTH_MAP:
                        day, month, year = int(g0), _MONTH_MAP[g1.lower()[:3]], int(g2)
                    elif isinstance(g0, str) and g0.lower()[:3] in _MONTH_MAP:
                        month, day, year = _MONTH_MAP[g0.lower()[:3]], int(g1), int(g2)
                    else:
                        # Assume DD/MM/YYYY (Indian format)
                        day, month, year = int(g0), int(g1), int(g2)
                    if year < 100:
                        year += 2000
                    if 1 <= month <= 12 and 1 <= day <= 31 and 2000 <= year <= 2099:
                        receipt_date = f"{year:04d}-{month:02d}-{day:02d}"
                        break
            except (ValueError, TypeError):
                pass
        if receipt_date:
            break

    # ---- Category ----
    haystack = (description or "") + " " + ocr_text[:300]
    category = "Others"
    for pattern, label in _CATEGORY_RULES:
        if pattern.search(haystack):
            category = label
            break

    return {
        "amount": amount,
        "description": description,
        "date": receipt_date or date.today().isoformat(),
        "category": category,
    }


@router.post("/scan-receipt")
async def scan_receipt(
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    OCR a receipt photo and return extracted fields for the Add Transaction
    modal. Nothing is written to the database — the caller is expected to
    confirm and save via the normal POST /transactions endpoint.
    """
    # Validate that it's an image file
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif",
                     "image/bmp", "image/tiff", "image/heic"}
    content_type = (image.content_type or "").lower()
    filename_lower = (image.filename or "").lower()
    is_image = content_type in allowed_types or any(
        filename_lower.endswith(ext) for ext in (".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff", ".heic")
    )
    if not is_image:
        return {"success": False, "message": "Please upload an image file (JPEG, PNG, WebP, etc.)"}

    contents = await image.read()
    if not contents:
        return {"success": False, "message": "The uploaded file is empty."}

    tmp_path = None
    try:
        suffix = os.path.splitext(image.filename or ".jpg")[1] or ".jpg"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        # Convert to RGB numpy array (handles HEIC and other exotic formats via PIL)
        pil_image = Image.open(tmp_path).convert("RGB")
        img_array = np.array(pil_image)

        # Run OCR — detail=0 gives plain strings, paragraph=True merges lines
        ocr_results = reader.readtext(img_array, detail=1, paragraph=False)
        if not ocr_results:
            return {"success": False, "message": "Could not extract any text from the image. Please try a clearer photo."}

        # Reconstruct plain text preserving vertical order (sort by Y centroid)
        ocr_results.sort(key=lambda r: r[0][0][1])  # sort by top-left Y coordinate
        raw_text = "\n".join(r[1] for r in ocr_results)

        fields = parse_receipt_fields(raw_text)

        return {
            "success": True,
            "description": fields["description"],
            "amount": fields["amount"],
            "date": fields["date"],
            "category": fields["category"],
            "raw_text_sample": raw_text[:400],
        }

    except Exception as e:
        return {"success": False, "message": f"Scan failed: {str(e)}"}

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)