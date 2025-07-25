from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate
from uuid import uuid4, UUID
from datetime import datetime

def create_notification(db: Session, notification_data: NotificationCreate):
    notification = Notification(
        id=uuid4(),
        user_id=notification_data.user_id,
        message=notification_data.message,
        type=notification_data.type,
        report_id=notification_data.report_id,
        created_at=datetime.utcnow()
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification

def get_notifications_for_user(db: Session, user_id: UUID):
    return db.query(Notification).filter(Notification.user_id == user_id).all()
