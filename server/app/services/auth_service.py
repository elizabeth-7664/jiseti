# app/services/auth_service.py

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta
from jose import jwt, JWTError
from app.core.security import (
    create_access_token,
    get_password_hash,
    verify_password
)
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
        is_verified=True  # ✅ Automatically mark as verified
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {"msg": "User registered successfully."}


async def login_user(form_data, db: AsyncSession):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


async def send_password_reset_email(email: str, db: AsyncSession):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(hours=1))
    # 🛑 No email sending logic, just return the token or reset URL directly
    reset_url = f"http://localhost:8000/api/reset-password?token={token}"
    return {"reset_url": reset_url}


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