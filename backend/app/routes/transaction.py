from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date

from app.database import SessionLocal
from app.models import Transaction, User
from app.schemas import TransactionCreate, TransactionUpdate
from app.services.auth import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/transactions")
def get_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .order_by(Transaction.transaction_date.desc(), Transaction.id.desc())
        .all()
    )


@router.post("/transactions")
def create_transaction(
    tx_data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_tx = Transaction(
        user_id=current_user.id,
        transaction_date=tx_data.transaction_date,
        description=tx_data.description,
        amount=tx_data.amount,
        category=tx_data.category,
        transaction_type=tx_data.transaction_type
    )
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx


@router.put("/transactions/{tx_id}")
def update_transaction(
    tx_id: int,
    tx_data: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tx = (
        db.query(Transaction)
        .filter(Transaction.id == tx_id, Transaction.user_id == current_user.id)
        .first()
    )

    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )

    tx.transaction_date = tx_data.transaction_date
    tx.description = tx_data.description
    tx.amount = tx_data.amount
    tx.category = tx_data.category
    tx.transaction_type = tx_data.transaction_type

    db.commit()
    db.refresh(tx)
    return tx


@router.delete("/transactions/{tx_id}")
def delete_transaction(
    tx_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tx = (
        db.query(Transaction)
        .filter(Transaction.id == tx_id, Transaction.user_id == current_user.id)
        .first()
    )

    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )

    db.delete(tx)
    db.commit()
    return {"message": "Transaction deleted successfully"}


@router.post("/seed")
def seed(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    t1 = Transaction(
        user_id=current_user.id,
        transaction_date=date(2026, 6, 1),
        description="Salary",
        amount=50000,
        category="Income",
        transaction_type="income"
    )

    t2 = Transaction(
        user_id=current_user.id,
        transaction_date=date(2026, 6, 3),
        description="Amazon",
        amount=2500,
        category="Shopping",
        transaction_type="expense"
    )

    t3 = Transaction(
        user_id=current_user.id,
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