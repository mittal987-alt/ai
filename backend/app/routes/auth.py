from fastapi import APIRouter, HTTPException, Depends , Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.schemas import UserCreate, UserLogin
from app.models import User
from app.database import SessionLocal

from passlib.context import CryptContext
from jose import jwt, JWTError

router = APIRouter()

SECRET_KEY = "finance_secret_key"
ALGORITHM = "HS256"

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
# SIGNUP
# -------------------------
@router.post("/signup")
def signup(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = pwd_context.hash(
        user.password
    )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


# -------------------------
# LOGIN
# -------------------------
@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    valid = pwd_context.verify(
        user.password,
        db_user.password
    )

    if not valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = jwt.encode(
        {"sub": db_user.email},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# -------------------------
# PROFILE
@router.get("/profile")
def profile(authorization: str = Header(None)):

    if authorization is None:
        raise HTTPException(
            status_code=401,
            detail="Authorization token missing"
        )

    token = authorization.replace("Bearer ", "")

    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )

    return {
        "email": payload["sub"]
    }