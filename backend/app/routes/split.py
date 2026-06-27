from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List

router = APIRouter(prefix="/splits", tags=["splits"])

def get_user_id(email: str, db: Session):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.id

@router.get("/", response_model=List[schemas.SharedExpenseResponse])
def get_splits(email: str, db: Session = Depends(get_db)):
    user_id = get_user_id(email, db)
    return db.query(models.SharedExpense).filter(
        models.SharedExpense.user_id == user_id
    ).order_by(models.SharedExpense.created_at.desc()).all()

@router.post("/", response_model=schemas.SharedExpenseResponse)
def create_split(email: str, data: schemas.SharedExpenseCreate, db: Session = Depends(get_db)):
    user_id = get_user_id(email, db)
    split = models.SharedExpense(
        user_id=user_id,
        description=data.description,
        total_amount=data.total_amount,
        friend_name=data.friend_name,
        amount_owed=data.amount_owed,
        is_settled=False
    )
    db.add(split)
    db.commit()
    db.refresh(split)
    return split

@router.put("/{split_id}/settle", response_model=schemas.SharedExpenseResponse)
def settle_split(split_id: int, email: str, db: Session = Depends(get_db)):
    user_id = get_user_id(email, db)
    split = db.query(models.SharedExpense).filter(
        models.SharedExpense.id == split_id,
        models.SharedExpense.user_id == user_id
    ).first()
    if not split:
        raise HTTPException(status_code=404, detail="Split not found")
    split.is_settled = True
    db.commit()
    db.refresh(split)
    return split

@router.delete("/{split_id}")
def delete_split(split_id: int, email: str, db: Session = Depends(get_db)):
    user_id = get_user_id(email, db)
    split = db.query(models.SharedExpense).filter(
        models.SharedExpense.id == split_id,
        models.SharedExpense.user_id == user_id
    ).first()
    if not split:
        raise HTTPException(status_code=404, detail="Split not found")
    db.delete(split)
    db.commit()
    return {"detail": "Split expense deleted"}
