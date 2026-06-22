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
def dashboard(
    db: Session = Depends(get_db)
):

    transactions = db.query(Transaction).all()

    income = 0
    expense = 0

    category_breakdown = {}

    for t in transactions:

        if t.transaction_type == "income":
            income += t.amount
        else:
            expense += t.amount

        category_breakdown[t.category] = (
            category_breakdown.get(
                t.category,
                0
            ) + t.amount
        )

    return {
        "income": income,
        "expense": expense,
        "savings": income - expense,
        "total_transactions": len(transactions),
        "category_breakdown": category_breakdown
    }