
from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TransactionCreate(BaseModel):
    transaction_date: date
    description: str
    amount: float
    category: str
    transaction_type: str
    account_id: Optional[int] = None

class TransactionUpdate(BaseModel):
    transaction_date: date
    description: str
    amount: float
    category: str
    transaction_type: str
    account_id: Optional[int] = None

class BudgetCreate(BaseModel):
    category: str
    amount: float

class BudgetResponse(BaseModel):
    id: int
    category: str
    amount: float

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str

class SavingsGoalCreate(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0
    target_date: date

class SavingsGoalResponse(BaseModel):
    id: int
    name: str
    target_amount: float
    current_amount: float
    target_date: date

    class Config:
        from_attributes = True

class SubscriptionCreate(BaseModel):
    name: str
    amount: float
    category: str
    billing_cycle: str
    next_due_date: date

class SubscriptionResponse(BaseModel):
    id: int
    name: str
    amount: float
    category: str
    billing_cycle: str
    next_due_date: date

    class Config:
        from_attributes = True

class AccountCreate(BaseModel):
    name: str
    account_type: str
    balance: float = 0.0

class AccountResponse(BaseModel):
    id: int
    name: str
    account_type: str
    balance: float

    class Config:
        from_attributes = True

class SharedExpenseCreate(BaseModel):
    description: str
    total_amount: float
    friend_name: str
    amount_owed: float

class SharedExpenseResponse(BaseModel):
    id: int
    description: str
    total_amount: float
    friend_name: str
    amount_owed: float
    is_settled: bool

    class Config:
        from_attributes = True
