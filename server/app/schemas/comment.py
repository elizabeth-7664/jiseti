from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    content: Optional[str] = None

class CommentOut(CommentBase):
    id: int
    report_id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
