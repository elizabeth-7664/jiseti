from fastapi import APIRouter, Depends, HTTPException, Request, status, Form
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta
from sqlalchemy import text
from app.core.config.settings import settings
from app.db import get_db
from app.schemas.user import UserCreate

from app.services.auth_service import (
    register_user,
    login_user,
    send_password_reset_email,
    reset_user_password,
    check_db_status
)

router = APIRouter(tags=["Authentication"])

@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await register_user(user, db)

    
    # token = create_verify_token(user.email)
    # verify_url = f"http://localhost:8000/api/verify-email?token={token}"

    # await send_email(
    #     email_to=user.email,
    #     subject="Verify Your Email",
    #     body=f"<p>Welcome! Please verify your email by clicking the link: <a href='{verify_url}'>Verify Email</a></p>"
    # )

    # return {"msg": "User registered successfully. Check your email to verify."}


# @router.get("/verify-email")
# async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
#     try:
#         email = confirm_verify_token(token)
#     except Exception:
#         raise HTTPException(status_code=400, detail="Invalid or expired token")

#     result = await db.execute(select(User).where(User.email == email))
#     user = result.scalars().first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     user.is_verified = True
#     await db.commit()
#     return {"msg": "Email verified successfully"}


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    return await login_user(form_data, db)

@router.post("/forgot-password")
async def forgot_password(email: EmailStr, db: AsyncSession = Depends(get_db)):
    return await send_password_reset_email(email, db)

@router.post("/request-password-reset")
async def request_password_reset(email: str = Form(...), db: AsyncSession = Depends(get_db)):
    return await send_password_reset_email(email, db)

@router.post("/reset-password")
async def reset_password(
    token: str = Form(...),
    new_password: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    return await reset_user_password(token, new_password, db)

@router.get("/health-check")
async def health_check():
    return await check_db_status()
