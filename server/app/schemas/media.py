from pydantic import BaseModel, HttpUrl
from uuid import UUID
from typing import Optional

class MediaBase(BaseModel):
    file_url: str
    file_type: str
    user_id: UUID
    report_id: Optional[UUID]

class MediaCreate(BaseModel):
    report_id: Optional[UUID] = None

class MediaOut(MediaBase):
    id: UUID

    class Config:
        orm_mode = True