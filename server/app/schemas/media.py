from pydantic import BaseModel
from datetime import datetime

class MediaOut(BaseModel):
    id: int
    image_url: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True