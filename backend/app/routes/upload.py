from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import pdfplumber
import tempfile
import os
from datetime import date

from app.database import SessionLocal
from app.models import Transaction
from app.services.parser import (
    categorize_transaction,
    extract_transactions
)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/upload-statement")
async def upload_statement(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    if not file.filename.endswith(".pdf"):
        return {
            "error": "Only PDF files are allowed"
        }

    contents = await file.read()

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as tmp:

        tmp.write(contents)
        tmp_path = tmp.name

    extracted_text = ""

    try:

        with pdfplumber.open(tmp_path) as pdf:

            for page in pdf.pages:

                text = page.extract_text()

                if text:
                    extracted_text += text + "\n"

        # Extract transactions from text
        transactions = extract_transactions(
            extracted_text
        )

        saved_count = 0

        for tx in transactions:

            transaction = Transaction(
                user_id=1,
                transaction_date=date.today(),
                description=tx["description"],
                amount=tx["amount"],
                category=tx["category"],
                transaction_type="expense"
            )

            db.add(transaction)
            saved_count += 1

        db.commit()

        return {
            "filename": file.filename,
            "transactions_found": len(transactions),
            "transactions_saved": saved_count,
            "sample_text": extracted_text[:500],
            "message": "Uploaded successfully"
        }

    finally:

        if os.path.exists(tmp_path):
            os.remove(tmp_path)