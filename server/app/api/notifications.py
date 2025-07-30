from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.notification import NotificationCreate, NotificationOut
from app.services.notification_service import create_notification, get_notifications_for_user
from app.db import get_db
from typing import List
from uuid import UUID

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.post("/", response_model=NotificationOut)
async def create(notification: NotificationCreate, db: AsyncSession = Depends(get_db)):
    return await create_notification(db, notification)

@router.get("/user/{user_id}", response_model=List[NotificationOut])
async def get_user_notifications(user_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_notifications_for_user(db, user_id)