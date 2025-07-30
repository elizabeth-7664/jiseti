from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID


class NotificationBase(BaseModel):
    message: str
    type: str  
    sent: Optional[bool] = False
    user_id: UUID
    report_id: UUID


class NotificationCreate(NotificationBase):
    pass


class NotificationOut(NotificationBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True