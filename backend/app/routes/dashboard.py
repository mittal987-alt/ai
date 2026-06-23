from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Transaction

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):

    transactions = db.query(Transaction).all()

    income = sum(
        t.amount
        for t in transactions
        if t.transaction_type == "income"
    )

    expense = sum(
        t.amount
        for t in transactions
        if t.transaction_type == "expense"
    )

    savings = income - expense

    return {
        "income": income,
        "expense": expense,
        "savings": savings,
        "total_transactions": len(transactions)
    }