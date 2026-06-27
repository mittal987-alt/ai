
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date, Boolean
from sqlalchemy.sql import func

from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(255))
    created_at = Column(DateTime(timezone=True),
                        server_default=func.now())
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)

    transaction_date = Column(Date)
    description = Column(String(255))
    amount = Column(Float)

    category = Column(String(100))
    transaction_type = Column(String(20))  # income/expense

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"

    id = Column(Integer, primary_key=True)
    filename = Column(String(255))
    extracted_text = Column(String)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String(100))
    amount = Column(Float)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100))
    target_amount = Column(Float)
    current_amount = Column(Float, default=0.0)
    target_date = Column(Date)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100))
    amount = Column(Float)
    category = Column(String(100))
    billing_cycle = Column(String(50))  # e.g., Monthly, Yearly
    next_due_date = Column(Date)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100))
    account_type = Column(String(50))  # Bank, Credit Card, Cash, UPI Wallet
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SharedExpense(Base):
    __tablename__ = "shared_expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    description = Column(String(255))
    total_amount = Column(Float)
    friend_name = Column(String(100))
    amount_owed = Column(Float)  # Amount the friend owes the user
    is_settled = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
