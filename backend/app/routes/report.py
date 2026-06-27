import csv
import io
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from fastapi import HTTPException

router = APIRouter(prefix="/reports", tags=["reports"])

def get_user_id(email: str, db: Session):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.id

@router.get("/csv")
def export_csv(email: str, db: Session = Depends(get_db)):
    user_id = get_user_id(email, db)
    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == user_id
    ).order_by(models.Transaction.transaction_date.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Date", "Description", "Category", "Type", "Amount (INR)"])
    for t in transactions:
        writer.writerow([
            t.transaction_date,
            t.description,
            t.category,
            t.transaction_type,
            t.amount
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=finance_report.csv"}
    )
