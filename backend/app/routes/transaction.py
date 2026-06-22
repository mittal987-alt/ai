from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.database import SessionLocal
from app.models import Transaction

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/transactions")
def get_transactions(
    db: Session = Depends(get_db)
):
    return db.query(Transaction).all()


@router.post("/seed")
def seed(
    db: Session = Depends(get_db)
):

    t1 = Transaction(
        user_id=1,
        transaction_date=date(2026, 6, 1),
        description="Salary",
        amount=50000,
        category="Income",
        transaction_type="income"
    )

    t2 = Transaction(
        user_id=1,
        transaction_date=date(2026, 6, 3),
        description="Amazon",
        amount=2500,
        category="Shopping",
        transaction_type="expense"
    )

    t3 = Transaction(
        user_id=1,
        transaction_date=date(2026, 6, 5),
        description="Zomato",
        amount=600,
        category="Food",
        transaction_type="expense"
    )

    db.add(t1)
    db.add(t2)
    db.add(t3)

    db.commit()

    return {
        "message": "Transactions inserted successfully"
    }