from datetime import datetime, timedelta, timezone
import jwt
from pwdlib import PasswordHash
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.config import settings
from app.models.user import User


password_hash = PasswordHash.recommended()


def create_user(
    db: Session,
    username: str,
    email: str,
    password: str,
) -> dict:
    username = username.strip()
    email = email.strip().lower()

    user = User(
        username=username,
        email=email,
        password_hash=password_hash.hash(password),
        created_at=datetime.now(timezone.utc),
    )

    db.add(user)

    try:
        db.commit()
        db.refresh(user)
    except IntegrityError as exc:
        db.rollback()
        raise ValueError(
            "Nome de usuário ou e-mail já existe"
        ) from exc

    return {
        "id": str(user.id),
        "username": user.username,
        "email": user.email,
    }


def authenticate_user(
    db: Session,
    identifier: str,
    password: str,
):
    identifier = identifier.strip()

    statement = select(User).where(
        or_(
            User.username == identifier,
            User.email == identifier.lower(),
        )
    )

    user = db.scalar(statement)

    if user is None:
        return None

    if not password_hash.verify(
        password,
        user.password_hash,
    ):
        return None

    return user


def create_access_token(
    user_id: str,
    expires_minutes: int = 30,
) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes
    )

    payload = {
        "sub": user_id,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm="HS256",
    )