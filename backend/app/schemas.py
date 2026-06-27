
from pydantic import BaseModel, EmailStr
from pydantic import BaseModel
from datetime import date

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

class TransactionUpdate(BaseModel):
    transaction_date: date
    description: str
    amount: float
    category: str
    transaction_type: str

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