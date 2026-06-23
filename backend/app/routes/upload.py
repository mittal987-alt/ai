from fastapi import APIRouter, UploadFile, File, Depends, Header
from sqlalchemy.orm import Session
import pdfplumber
import tempfile
import os
from datetime import date

from app.database import SessionLocal
from app.models import Transaction, User
from app.services.parser import extract_transactions
from jose import jwt

router = APIRouter()

SECRET_KEY = "finance_secret_key"
ALGORITHM = "HS256"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/upload-statement")
async def upload_statement(
    file: UploadFile = File(...),
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):

    if not file.filename.lower().endswith(".pdf"):
        return {
            "success": False,
            "message": "Only PDF files are allowed"
        }

    # Get user from JWT
    try:
        token = authorization.split(" ")[1]

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload["sub"]

        user = db.query(User).filter(
            User.email == email
        ).first()

        if not user:
            return {
                "success": False,
                "message": "User not found"
            }

    except Exception:
        return {
            "success": False,
            "message": "Invalid token"
        }

    contents = await file.read()

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as tmp:

        tmp.write(contents)
        tmp_path = tmp.name

    try:

        extracted_text = ""

        with pdfplumber.open(tmp_path) as pdf:

            for page in pdf.pages:

                text = page.extract_text()

                if text:
                    extracted_text += text + "\n"

        if not extracted_text.strip():
            return {
                "success": False,
                "message": "No text found inside PDF"
            }

        transactions = extract_transactions(
            extracted_text
        )

        if len(transactions) == 0:
            return {
                "success": False,
                "message": (
                    "No transactions found. "
                    "Please upload a valid bank statement."
                ),
                "sample_text": extracted_text[:500]
            }

        saved_count = 0

        for tx in transactions:

            transaction = Transaction(
                user_id=user.id,
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
            "success": True,
            "filename": file.filename,
            "transactions_found": len(transactions),
            "transactions_saved": saved_count,
            "message": "Bank statement processed successfully"
        }

    except Exception as e:

        db.rollback()

        return {
            "success": False,
            "message": str(e)
        }

    finally:

        if os.path.exists(tmp_path):
            os.remove(tmp_path)