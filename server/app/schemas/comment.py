from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID


class CommentBase(BaseModel):
    content: str


class CommentCreate(CommentBase):
    content: str 


class CommentUpdate(BaseModel):
    content: Optional[str] = None


class CommentOut(CommentBase):
    id: UUID
    report_id: UUID
    created_by: Optional[UUID]
    created_at: datetime

    class Config:
        orm_mode = True
