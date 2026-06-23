from jose import jwt

SECRET_KEY = "finance_secret_key"
ALGORITHM = "HS256"

def get_email_from_token(token: str):

    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )

    return payload["sub"]