from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate
from uuid import uuid4, UUID
from datetime import datetime

# Create a new notification
async def create_notification(db: AsyncSession, notification_data: NotificationCreate):
    notification = Notification(
        id=uuid4(),
        user_id=notification_data.user_id,
        message=notification_data.message,
        type=notification_data.type,
        report_id=notification_data.report_id,
        created_at=datetime.utcnow()
    )
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification

# Get all notifications for a given user
async def get_notifications_for_user(db: AsyncSession, user_id: UUID):
    stmt = select(Notification).where(Notification.user_id == user_id)
    result = await db.execute(stmt)
    return result.scalars().all()
