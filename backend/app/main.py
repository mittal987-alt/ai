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

@app.get("/")
def root():
    return {
        "message": "Finance AI Coach Backend Running"
    }