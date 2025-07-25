from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..schemas.user import UserOut as UserSchema
from typing import List
from uuid import UUID


router = APIRouter(prefix="/admin", tags=["admin"])


async def get_admin_user(current_user_email: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == current_user_email.email))
    user = result.scalars().first()
    if not user or not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/users", response_model=List[UserSchema])
async def list_all_users(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Admin-only: List all users in the system.
    """
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Admin-only: Delete a user by ID.
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.delete(user)
    await db.commit()
    return {"detail": f"User {user_id} deleted successfully"}
admin = router
