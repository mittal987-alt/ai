from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base

# Routers
from app.routes.auth import router as auth_router
from app.routes.insights import router as insights_router
from app.routes.upload import router as upload_router
from app.routes.dashboard import router as dashboard_router
from app.routes.transaction import router as transaction_router
from app.routes.budget import router as budget_router
from app.routes.chat import router as chat_router
from app.routes.goal import router as goal_router
from app.routes.subscription import router as subscription_router
from app.routes.analytics import router as analytics_router
from app.routes.account import router as account_router
from app.routes.split import router as split_router
from app.routes.report import router as report_router

# Auto-create tables (e.g. budgets table)
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(insights_router)
app.include_router(upload_router)
app.include_router(dashboard_router)
app.include_router(transaction_router)
app.include_router(budget_router)
app.include_router(chat_router)
app.include_router(goal_router)
app.include_router(subscription_router)
app.include_router(analytics_router)
app.include_router(account_router)
app.include_router(split_router)
app.include_router(report_router)


@app.get("/")
def root():
    return {
        "message": "Finance AI Coach Backend Running"
    }