from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Transaction, User
from app.services.auth import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Keyword → Category mapping (case-insensitive)
CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "Food": [
        "swiggy", "zomato", "restaurant", "cafe", "coffee", "tea", "food", "burger",
        "pizza", "dine", "eat", "meal", "breakfast", "lunch", "dinner", "bakery",
        "dominos", "kfc", "mcdonald", "subway", "starbucks", "hotel", "tiffin"
    ],
    "Travel": [
        "uber", "ola", "rapido", "metro", "bus", "train", "irctc", "flight", "airline",
        "indigo", "airasia", "spicejet", "makemytrip", "travel", "cab", "taxi",
        "petrol", "fuel", "toll", "parking", "redbus", "yatra"
    ],
    "Shopping": [
        "amazon", "flipkart", "myntra", "ajio", "nykaa", "meesho", "shop", "store",
        "mall", "retail", "purchase", "buy", "order", "bigbasket", "blinkit",
        "zepto", "grofers", "mart", "supermarket", "market", "bazaar", "snapdeal"
    ],
    "Utilities": [
        "electricity", "power", "water", "gas", "broadband", "internet", "wifi",
        "airtel", "jio", "vodafone", "vi", "bsnl", "recharge", "mobile", "phone",
        "bill", "utility", "tata sky", "dth", "cable", "maintenance"
    ],
    "Health": [
        "hospital", "clinic", "pharmacy", "medicine", "doctor", "health", "medical",
        "apollo", "diagnostic", "lab", "test", "chemist", "drug", "fitness",
        "gym", "yoga", "wellness", "insurance", "policy"
    ],
    "Entertainment": [
        "netflix", "amazon prime", "hotstar", "disney", "spotify", "youtube",
        "movie", "cinema", "theatre", "pvr", "inox", "game", "gaming", "steam",
        "bookmyshow", "concert", "event", "ticket", "subscription"
    ],
    "Education": [
        "school", "college", "university", "course", "udemy", "coursera", "byju",
        "unacademy", "education", "tuition", "coaching", "fees", "book", "stationery",
        "pen", "notebook", "library", "study"
    ],
    "Finance": [
        "emi", "loan", "credit card", "bank charge", "interest", "fee", "penalty",
        "investment", "sip", "mutual fund", "stock", "zerodha", "groww", "demat"
    ],
}


def classify_description(description: str) -> str | None:
    desc_lower = description.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in desc_lower:
                return category
    return None


@router.post("/transactions/auto-categorize")
def auto_categorize_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Scans all user transactions and re-categorizes those that are in 'Others'
    or have an unrecognized category using the keyword classification engine.
    Returns a count of how many were updated.
    """
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()

    updated = 0
    unchanged = 0
    details = []

    for t in transactions:
        new_category = classify_description(t.description)
        if new_category and new_category != t.category:
            old_cat = t.category
            t.category = new_category
            updated += 1
            details.append({
                "description": t.description,
                "old_category": old_cat,
                "new_category": new_category
            })
        else:
            unchanged += 1

    db.commit()

    return {
        "updated": updated,
        "unchanged": unchanged,
        "total": len(transactions),
        "details": details[:20],  # Return first 20 changes as preview
        "message": f"Auto-categorization complete. {updated} transaction(s) updated."
    }
