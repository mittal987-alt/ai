
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date
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