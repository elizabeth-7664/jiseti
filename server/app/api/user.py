from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import get_db
from ..core.security import get_current_user, get_password_hash
from ..models.user import User
from ..schemas.user import User as UserSchema, UserUpdate

router = APIRouter(tags=["Users"])

@router.get("/users/me", response_model=UserSchema)
async def read_current_user(
    db: AsyncSession = Depends(get_db),
    current_user_email: str = Depends(get_current_user)
):
    """
    Retrieve the currently authenticated user's profile using their email.
    """
    result = await db.execute(select(User).where(User.email == current_user_email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/users/me", response_model=UserSchema)
async def update_current_user(
    updates: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user_email: str = Depends(get_current_user)
):
    """
    Allow a user to update their own profile.
    """
    result = await db.execute(select(User).where(User.email == current_user_email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if updates.username is not None:
        user.username = updates.username
    if updates.avatar is not None:
        user.avatar = updates.avatar
    if updates.password is not None:
        user.password = get_password_hash(updates.password)

    await db.commit()
    await db.refresh(user)
    return user

@router.get("/users/{user_id}", response_model=UserSchema)
async def read_user_by_id(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
):
    """
    Admin-only: Retrieve a user by their ID.
    Role check to be added.
    """
    # Placeholder for admin role check (optional logic to be added)
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
