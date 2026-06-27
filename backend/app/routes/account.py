from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from fastapi import HTTPException

router = APIRouter(prefix="/accounts", tags=["accounts"])

def get_user_id(email: str, db: Session):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.id

@router.get("/")
def get_accounts(email: str, db: Session = Depends(get_db)):
    user_id = get_user_id(email, db)
    accounts = db.query(models.Account).filter(models.Account.user_id == user_id).all()
    return accounts

@router.post("/", response_model=schemas.AccountResponse)
def create_account(email: str, data: schemas.AccountCreate, db: Session = Depends(get_db)):
    user_id = get_user_id(email, db)
    account = models.Account(
        user_id=user_id,
        name=data.name,
        account_type=data.account_type,
        balance=data.balance
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account

@router.put("/{account_id}", response_model=schemas.AccountResponse)
def update_account(account_id: int, email: str, data: schemas.AccountCreate, db: Session = Depends(get_db)):
    user_id = get_user_id(email, db)
    account = db.query(models.Account).filter(
        models.Account.id == account_id,
        models.Account.user_id == user_id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    account.name = data.name
    account.account_type = data.account_type
    account.balance = data.balance
    db.commit()
    db.refresh(account)
    return account

@router.delete("/{account_id}")
def delete_account(account_id: int, email: str, db: Session = Depends(get_db)):
    user_id = get_user_id(email, db)
    account = db.query(models.Account).filter(
        models.Account.id == account_id,
        models.Account.user_id == user_id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    db.delete(account)
    db.commit()
    return {"detail": "Account deleted"}
