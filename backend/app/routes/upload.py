from fastapi import APIRouter, UploadFile, File, Depends, Form
from sqlalchemy.orm import Session
from datetime import date
import pdfplumber
import tempfile
import os
import numpy as np
import easyocr
from pdf2image import convert_from_path
from pypdf import PdfReader, PdfWriter  # Added for password handling

from app.database import SessionLocal
from app.models import Transaction, User
from app.services.parser import extract_transactions
from app.services.auth import get_current_user

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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # ---------- Validate File ----------
    if not file.filename:
        return {"success": False, "message": "No file selected."}

    if not file.filename.lower().endswith(".pdf"):
        return {"success": False, "message": "Only PDF files are allowed."}

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

        saved = 0
        skipped = 0

        for tx in transactions:
            tx_date = tx.get("date") or date.today()

            duplicate = (
                db.query(Transaction)
                .filter(
                    Transaction.user_id == current_user.id,
                    Transaction.description == tx["description"],
                    Transaction.amount == tx["amount"],
                    Transaction.transaction_date == tx_date
                )
                .first()
            )

            if duplicate:
                skipped += 1
                continue

            transaction_type = "expense"
            desc = tx["description"].upper()
            if any(k in desc for k in ["/CR/", "SALARY", "CREDIT", "DEPOSIT"]):
                transaction_type = "income"

            # Clean and parse amount safely
            clean_amount = str(tx["amount"]).replace(",", "").replace("₹", "").strip()

            transaction = Transaction(
                user_id=current_user.id,
                transaction_date=tx_date,
                description=tx["description"],
                amount=float(clean_amount),
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
            "message": "Bank statement processed successfully."
        }

    except Exception as e:
        db.rollback()
        return {"success": False, "message": f"Server Error: {str(e)}"}

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)