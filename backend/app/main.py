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
# New Feature Routers
from app.routes.tax import router as tax_router
from app.routes.alerts import router as alerts_router
from app.routes.budget_planner import router as budget_planner_router
from app.routes.networth import router as networth_router
from app.routes.reminders import router as reminders_router
from app.routes.categorize import router as categorize_router
from app.routes.heatmap import router as heatmap_router
from app.routes.gamification import router as gamification_router
# High-Impact Feature Routers
from app.routes.recurring import router as recurring_router
from app.routes.investments import router as investments_router
from app.routes.loans import router as loans_router
from app.routes.currency import router as currency_router
from app.routes.pdf_report import router as pdf_report_router
from app.routes.import_csv import router as import_csv_router
# Daily automation
from app.routes.daily_brief import router as daily_brief_router
from app.services.scheduler import start_scheduler

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
# New Feature Routers
app.include_router(tax_router)
app.include_router(alerts_router)
app.include_router(budget_planner_router)
app.include_router(networth_router)
app.include_router(reminders_router)
app.include_router(categorize_router)
app.include_router(heatmap_router)
app.include_router(gamification_router)
# High-Impact Feature Routers
app.include_router(recurring_router)
app.include_router(investments_router)
app.include_router(loans_router)
app.include_router(currency_router)
app.include_router(pdf_report_router)
app.include_router(import_csv_router)
# Daily automation
app.include_router(daily_brief_router)


@app.on_event("startup")
def on_startup():
    start_scheduler()


@app.get("/")
def root():
    return {
        "message": "Finance AI Coach Backend Running"
    }