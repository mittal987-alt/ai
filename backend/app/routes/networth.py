from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User, Account, SavingsGoal, SharedExpense
from app.services.auth import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/networth")
def get_net_worth(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Computes the user's net worth:
    Assets  = Account balances + Savings Goals (current amounts saved)
    Liabilities = Unsettled shared expenses (money owed to user)
    Net Worth = Total Assets - Total Liabilities
    """
    # ── Assets ──────────────────────────────────────────────────
    accounts = db.query(Account).filter(Account.user_id == current_user.id).all()
    account_total = sum(a.balance for a in accounts)

    goals = db.query(SavingsGoal).filter(SavingsGoal.user_id == current_user.id).all()
    goals_saved = sum(g.current_amount for g in goals)

    total_assets = account_total + goals_saved

    # ── Liabilities (money owed BY user to others via splits) ────
    # In our model, amount_owed = friend owes user. So liabilities = 0 from splits.
    # We treat total SharedExpense total_amount - amount_owed as user's share spent.
    shared_expenses = db.query(SharedExpense).filter(
        SharedExpense.user_id == current_user.id,
        SharedExpense.is_settled == False
    ).all()

    # User's share = total_amount - amount_owed (friend's share)
    user_share_unsettled = sum(
        max(0.0, s.total_amount - s.amount_owed) for s in shared_expenses
    )

    total_liabilities = user_share_unsettled

    net_worth = total_assets - total_liabilities

    # Breakdown for UI
    asset_breakdown = []
    for a in accounts:
        asset_breakdown.append({
            "name": a.name,
            "type": a.account_type,
            "amount": round(a.balance, 2),
            "category": "account"
        })
    for g in goals:
        if g.current_amount > 0:
            asset_breakdown.append({
                "name": g.name,
                "type": "Savings Goal",
                "amount": round(g.current_amount, 2),
                "category": "goal"
            })

    liability_breakdown = []
    for s in shared_expenses:
        user_share = max(0.0, s.total_amount - s.amount_owed)
        if user_share > 0:
            liability_breakdown.append({
                "name": s.description,
                "type": "Unsettled Split",
                "amount": round(user_share, 2),
                "friend": s.friend_name,
                "category": "split"
            })

    return {
        "total_assets": round(total_assets, 2),
        "total_liabilities": round(total_liabilities, 2),
        "net_worth": round(net_worth, 2),
        "account_total": round(account_total, 2),
        "goals_saved": round(goals_saved, 2),
        "asset_breakdown": asset_breakdown,
        "liability_breakdown": liability_breakdown,
    }
