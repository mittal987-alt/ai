"""
Recurring Transactions Route
Supports CRUD + manual trigger to fire all due recurring transactions
into the actual transactions table.
"""
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import RecurringTransaction, Transaction, User
from app.schemas import RecurringTransactionCreate, RecurringTransactionResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/recurring", tags=["recurring"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _advance_date(d: date, frequency: str) -> date:
    if frequency == "daily":
        return d + timedelta(days=1)
    elif frequency == "weekly":
        return d + timedelta(weeks=1)
    elif frequency == "monthly":
        # Move to same day next month
        month = d.month + 1 if d.month < 12 else 1
        year = d.year + (1 if d.month == 12 else 0)
        import calendar
        max_day = calendar.monthrange(year, month)[1]
        return d.replace(year=year, month=month, day=min(d.day, max_day))
    elif frequency == "yearly":
        return d.replace(year=d.year + 1)
    return d


# ─── GET all recurring transactions ───────────────────────────────────────────
@router.get("/", response_model=list[RecurringTransactionResponse])
def list_recurring(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(RecurringTransaction)
        .filter(RecurringTransaction.user_id == current_user.id)
        .order_by(RecurringTransaction.next_date)
        .all()
    )


# ─── CREATE ───────────────────────────────────────────────────────────────────
@router.post("/", response_model=RecurringTransactionResponse)
def create_recurring(
    data: RecurringTransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rec = RecurringTransaction(
        user_id=current_user.id,
        description=data.description,
        amount=data.amount,
        category=data.category,
        transaction_type=data.transaction_type,
        frequency=data.frequency,
        next_date=data.next_date,
        is_active=data.is_active,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


# ─── UPDATE ───────────────────────────────────────────────────────────────────
@router.put("/{rec_id}", response_model=RecurringTransactionResponse)
def update_recurring(
    rec_id: int,
    data: RecurringTransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rec = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == rec_id,
        RecurringTransaction.user_id == current_user.id
    ).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recurring transaction not found")
    rec.description = data.description
    rec.amount = data.amount
    rec.category = data.category
    rec.transaction_type = data.transaction_type
    rec.frequency = data.frequency
    rec.next_date = data.next_date
    rec.is_active = data.is_active
    db.commit()
    db.refresh(rec)
    return rec


# ─── DELETE ───────────────────────────────────────────────────────────────────
@router.delete("/{rec_id}")
def delete_recurring(
    rec_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rec = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == rec_id,
        RecurringTransaction.user_id == current_user.id
    ).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recurring transaction not found")
    db.delete(rec)
    db.commit()
    return {"detail": "Deleted"}


# ─── TRIGGER: fire all due recurring transactions ─────────────────────────────
@router.post("/trigger")
def trigger_recurring(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Checks all active recurring transactions whose next_date <= today,
    creates actual Transaction records, and advances their next_date.
    """
    today = date.today()
    due = db.query(RecurringTransaction).filter(
        RecurringTransaction.user_id == current_user.id,
        RecurringTransaction.is_active == True,
        RecurringTransaction.next_date <= today,
    ).all()

    created_count = 0
    for rec in due:
        # Create actual transaction
        tx = Transaction(
            user_id=current_user.id,
            transaction_date=rec.next_date,
            description=f"[Auto] {rec.description}",
            amount=rec.amount,
            category=rec.category,
            transaction_type=rec.transaction_type,
        )
        db.add(tx)
        # Advance next_date
        rec.next_date = _advance_date(rec.next_date, rec.frequency)
        created_count += 1

    db.commit()
    return {"triggered": created_count, "message": f"Created {created_count} transaction(s) from recurring schedule."}
