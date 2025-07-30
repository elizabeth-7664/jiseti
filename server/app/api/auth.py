from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr

from app.db import get_db
from app.services.auth_service import (
    register_user,
    login_user,
    send_password_reset_email,
    reset_user_password,
    check_db_status
)
from app.schemas.user import UserCreate

router = APIRouter(tags=["Authentication"])

@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await register_user(user, db)

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