# app/services/auth_service.py

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta
from jose import jwt, JWTError
from app.core.security import (
    create_access_token, create_verify_token,
    confirm_verify_token, get_password_hash,
    verify_password
)
from app.utils.email_utils import send_email
from app.schemas.user import UserCreate
from app.models.user import User
from app.core.config.settings import settings
from sqlalchemy import text
from app.db import async_engine


async def register_user(user: UserCreate, db: AsyncSession):
    existing_user = await db.execute(select(User).where(User.email == user.email))
    if existing_user.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_verified=False
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token = create_verify_token(user.email)
    verify_url = f"http://localhost:8000/api/verify-email?token={token}"
    print(f"\n🚀 DEV ONLY: Email verification link for {user.email}:\n{verify_url}\n")
    await send_email(
        email_to=user.email,
        subject="Verify Your Email",
        body=f"<p>Click to verify: <a href='{verify_url}'>Verify</a></p>"
    )
    return {"msg": "User registered. Check email to verify."}

async def verify_user_email(token: str, db: AsyncSession):
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
    await db.refresh(user)
    return {"msg": "Email verified successfully"}


async def login_user(form_data, db: AsyncSession):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")
    
    # if not user.is_verified:
    #     raise HTTPException(status_code=403, detail="Email not verified")

    token = create_access_token(data={"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username  # Add this if needed in frontend
    }

async def send_password_reset_email(email: str, db: AsyncSession):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(hours=1))
    reset_url = f"http://localhost:8000/api/reset-password?token={token}"
    await send_email(
        email_to=user.email,
        subject="Reset Password",
        body=f"<p>Reset link: <a href='{reset_url}'>Reset</a></p>"
    )
    return {"msg": "Reset link sent"}

async def reset_user_password(token: str, new_password: str, db: AsyncSession):
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

async def check_db_status():
    try:
        async with AsyncSession(bind=async_engine) as session:
            await session.execute(text("SELECT 1"))
        return {"connected": True}
    except Exception as e:
        return {"connected": False, "error": str(e)}
