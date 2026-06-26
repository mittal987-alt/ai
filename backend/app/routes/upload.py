from fastapi import APIRouter, UploadFile, File, Depends, Header
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, date
import pdfplumber
import tempfile
import os
import numpy as np
import easyocr
from pdf2image import convert_from_path

from app.database import SessionLocal
from app.models import Transaction, User
from app.services.parser import extract_transactions

router = APIRouter()

SECRET_KEY = "finance_secret_key"
ALGORITHM = "HS256"

# Initialize EasyOCR reader once globally to save memory and processing time
reader = easyocr.Reader(['en'])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ocr_extract_text(pdf_path: str) -> str:
    text = ""
    # Note: Ensure Poppler is correctly installed at this path if running on Windows
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
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    # ---------- Validate File ----------
    if not file.filename:
        return {
            "success": False,
            "message": "No file selected."
        }

    if not file.filename.lower().endswith(".pdf"):
        return {
            "success": False,
            "message": "Only PDF files are allowed."
        }

    # ---------- Verify JWT ----------
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")
        if not email:
            raise JWTError()

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            return {
                "success": False,
                "message": "User not found."
            }

    except JWTError:
        return {
            "success": False,
            "message": "Invalid or expired token."
        }

    # ---------- Save uploaded PDF ----------
    contents = await file.read()
    tmp_path = None 

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        extracted_text = ""

        # Attempt to read digital text using pdfplumber
        with pdfplumber.open(tmp_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text += page_text + "\n"

        # Use OCR only if pdfplumber couldn't extract text (e.g., scanned PDF)
        if extracted_text.strip() == "":
            print("=" * 60)
            print("No digital text found. Running OCR...")
            print("=" * 60)

            extracted_text = ocr_extract_text(tmp_path)
            print("=" * 80)
            print("OCR OUTPUT")
            print("=" * 80)
            print(extracted_text)
            print("=" * 80)

        if extracted_text.strip() == "":
            return {
                "success": False,
                "message": "Unable to extract text from this PDF."
            }

        # ---------- Extract Transactions ----------
        transactions = extract_transactions(extracted_text)

        if len(transactions) == 0:
            return {
                "success": False,
                "message": "No transactions found. Please upload a valid bank statement.",
                "sample_text": extracted_text[:500]
            }

        saved = 0
        skipped = 0

        for tx in transactions:
            duplicate = (
                db.query(Transaction)
                .filter(
                    Transaction.user_id == user.id,
                    Transaction.description == tx["description"],
                    Transaction.amount == tx["amount"]
                )
                .first()
            )

            if duplicate:
                skipped += 1
                continue

            # Detect income or expense
            transaction_type = "expense"
            desc = tx["description"].upper()

            if any(k in desc for k in ["/CR/", "SALARY", "CREDIT", "DEPOSIT"]):
                transaction_type = "income"

            # Parse string date from parser safely into an actual SQL-compatible date object
            tx_date = date.today() 
            if tx.get("date"):
                clean_date_str = tx["date"].replace(".", "-").replace("/", "-")
                try:
                    if len(clean_date_str.split("-")[-1]) == 4:
                        tx_date = datetime.strptime(clean_date_str, "%d-%m-%Y").date()
                    else:
                        tx_date = datetime.strptime(clean_date_str, "%d-%m-%y").date()
                except ValueError:
                    pass

            transaction = Transaction(
                user_id=user.id,
                transaction_date=tx_date,
                description=tx["description"],
                amount=float(tx["amount"]),
                category=tx.get("category", "Others"),
                transaction_type=transaction_type
            )

            db.add(transaction)
            saved += 1

        db.commit()

        # Log statistics to console safely before processing the endpoint return
        print({
            "transactions_found": len(transactions),
            "transactions_saved": saved,
            "duplicates_skipped": skipped,
        })

        return {
            "success": True,
            "filename": file.filename,
            "transactions_found": len(transactions),
            "transactions_saved": saved,
            "duplicates_skipped": skipped,
            "sample_text": extracted_text[:1000],
            "message": "Bank statement processed successfully."
        }

    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": str(e)
        }

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)