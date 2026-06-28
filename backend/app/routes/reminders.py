from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.database import SessionLocal
from app.models import PaymentReminder, User
from app.schemas import PaymentReminderCreate, PaymentReminderResponse
from app.services.auth import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/reminders", response_model=List[PaymentReminderResponse])
def get_reminders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reminders = (
        db.query(PaymentReminder)
        .filter(PaymentReminder.user_id == current_user.id)
        .order_by(PaymentReminder.due_date)
        .all()
    )
    today = date.today()
    result = []
    for r in reminders:
        days_left = (r.due_date - today).days
        urgency = "overdue" if days_left < 0 else ("urgent" if days_left <= 3 else ("soon" if days_left <= 7 else "ok"))
        result.append({
            "id": r.id,
            "name": r.name,
            "amount": r.amount,
            "due_date": r.due_date,
            "category": r.category,
            "is_paid": r.is_paid,
            "days_left": days_left,
            "urgency": urgency
        })
    return result


@router.post("/reminders", response_model=PaymentReminderResponse)
def create_reminder(
    data: PaymentReminderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reminder = PaymentReminder(
        user_id=current_user.id,
        name=data.name,
        amount=data.amount,
        due_date=data.due_date,
        category=data.category,
        is_paid=False
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)

    today = date.today()
    days_left = (reminder.due_date - today).days
    urgency = "overdue" if days_left < 0 else ("urgent" if days_left <= 3 else ("soon" if days_left <= 7 else "ok"))

    return {
        "id": reminder.id,
        "name": reminder.name,
        "amount": reminder.amount,
        "due_date": reminder.due_date,
        "category": reminder.category,
        "is_paid": reminder.is_paid,
        "days_left": days_left,
        "urgency": urgency
    }


@router.put("/reminders/{reminder_id}/pay")
def mark_reminder_paid(
    reminder_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reminder = (
        db.query(PaymentReminder)
        .filter(PaymentReminder.id == reminder_id, PaymentReminder.user_id == current_user.id)
        .first()
    )
    if not reminder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")
    reminder.is_paid = True
    db.commit()
    return {"message": "Marked as paid"}


@router.delete("/reminders/{reminder_id}")
def delete_reminder(
    reminder_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reminder = (
        db.query(PaymentReminder)
        .filter(PaymentReminder.id == reminder_id, PaymentReminder.user_id == current_user.id)
        .first()
    )
    if not reminder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")
    db.delete(reminder)
    db.commit()
    return {"message": "Reminder deleted"}
