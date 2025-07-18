from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta
from sqlalchemy import text

from app.core.config.settings import settings
from app.core.security import (
    create_access_token,
    create_verify_token,
    confirm_verify_token,
    get_password_hash,
    verify_password
)
from app.db import get_db
from app.schemas.user import UserCreate
from app.models.user import User
from app.utils.email_utils import send_email

from pydantic import EmailStr
from jose import JWTError, jwt

router = APIRouter(tags=["Authentication"])

@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password, is_verified=False)

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    
    token = create_verify_token(user.email)
    verify_url = f"http://localhost:8000/api/verify-email?token={token}"

    await send_email(
        email_to=user.email,
        subject="Verify Your Email",
        body=f"<p>Welcome! Please verify your email by clicking the link: <a href='{verify_url}'>Verify Email</a></p>"
    )

    return {"msg": "User registered successfully. Check your email to verify."}


@router.get("/verify-email")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    try:
        email = confirm_verify_token(token)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_verified = True
    await db.commit()
    return {"msg": "Email verified successfully"}


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password")
async def forgot_password(email: EmailStr, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    reset_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(hours=1))

    reset_url = f"http://localhost:8000/api/reset-password?token={reset_token}"
    await send_email(
        email_to=user.email,
        subject="Reset Your Password",
        body=f"<p>Click the link below to reset your password:<br><a href='{reset_url}'>Reset Password</a></p>"
    )

    return {"msg": "Reset link sent to email"}


@router.post("/reset-password")
async def reset_password(token: str, new_password: str, db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = get_password_hash(new_password)
    await db.commit()

    return {"msg": "Password reset successful"}

@router.get("/check-db")
async def check_db_connection():
    try:
        async with AsyncSession(bind=async_engine) as session:
            await session.execute(text("SELECT 1"))
        return {"connected": True}
    except Exception as e:
        return {"connected": False, "error": str(e)}