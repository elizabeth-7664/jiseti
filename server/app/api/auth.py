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
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import EmailStr
from app.db import get_db
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

@router.get("/verify-email")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    return await verify_user_email(token, db)


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    return await login_user(form_data, db)

@router.post("/forgot-password")
async def forgot_password(email: EmailStr, db: AsyncSession = Depends(get_db)):
    return await send_password_reset_email(email, db)


@router.post("/reset-password")
async def reset_password(token: str, new_password: str, db: AsyncSession = Depends(get_db)):
    return await reset_user_password(token, new_password, db)


@router.get("/check-db")
async def check_db_connection():
    return await check_db_status()
