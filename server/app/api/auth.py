from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta
from sqlalchemy import text
from app.db import async_engine
from app.core.config.settings import settings
from app.core.security import (
    create_access_token,
    create_verify_token,
    confirm_verify_token,
    get_password_hash,
    verify_password
)
from app.db import get_db
from app.services.auth_service import register_user, login_user
from app.schemas.user import UserCreate

from app.services.auth_service import (
    register_user,
    verify_user_email,
    login_user,
    send_password_reset_email,
    reset_user_password,
    check_db_status
)

router = APIRouter(tags=["Authentication"])

@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await register_user(user, db)
    result = await db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalars().first()
    if existing_user:
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

    await send_email(
        email_to=user.email,
        subject="Verify Your Email",
        body=f"<p>Welcome! Please verify your email by clicking the link: <a href='{verify_url}'>Verify Email</a></p>"
    )

    return {"msg": "User registered successfully. Check your email to verify."}


@router.get("/verify-email")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    return await verify_user_email(token, db)

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    return await login_user(form_data, db)
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "username":user.username}


@router.post("/forgot-password")
async def forgot_password(email: EmailStr, db: AsyncSession = Depends(get_db)):
    return await send_password_reset_email(email, db)

@router.post("/reset-password")
async def reset_password(token: str, new_password: str, db: AsyncSession = Depends(get_db)):
    return await reset_user_password(token, new_password, db)

@router.get("/check-db")
async def check_db_connection():
    return await check_db_status()
