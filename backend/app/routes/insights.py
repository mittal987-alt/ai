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


@router.get("/insights")
def insights(db: Session = Depends(get_db)):

    transactions = db.query(Transaction).all()

    food = sum(
        t.amount
        for t in transactions
        if t.category == "Food"
    )

    travel = sum(
        t.amount
        for t in transactions
        if t.category == "Travel"
    )

    shopping = sum(
        t.amount
        for t in transactions
        if t.category == "Shopping"
    )

    insights = []

    if food > 5000:
        insights.append(
            f"⚠ Food spending is high: ₹{food}"
        )

    if shopping > 5000:
        insights.append(
            f"⚠ Shopping spending is high: ₹{shopping}"
        )

    if travel > 2000:
        insights.append(
            f"⚠ Travel spending is high: ₹{travel}"
        )

    if not insights:
        insights.append(
            "✅ Spending looks healthy"
        )

    return {
        "food": food,
        "travel": travel,
        "shopping": shopping,
        "insights": insights
    }