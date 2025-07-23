from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class ReportBase(BaseModel):
    title: str = Field(..., example="Corruption at Road Project")
    description: str = Field(..., example="Bribes were requested at checkpoint X.")
    category: str = Field(..., example="Corruption")
    location: Optional[str] = Field(None, example="Nairobi")
    latitude: Optional[float] = Field(None, example=-1.2921)
    longitude: Optional[float] = Field(None, example=36.8219)


class ReportCreate(ReportBase):
    pass


class ReportUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    category: Optional[str]
    location: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    status: Optional[str] = Field(None, example="In Progress")  # e.g., Pending, Reviewed, Resolved

class ReportStatusEnum(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    resolved = "resolved"
    rejected = "rejected"

class ReportStatusUpdate(BaseModel):
    status: ReportStatusEnum
class ReportOut(ReportBase):
    id: int
    status: str = Field(..., example="Pending")
    # author: UserOut ->Commented this out for anonymity
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
