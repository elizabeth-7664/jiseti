from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.report import ReportStatus, RecordType


class ReportBase(BaseModel):
    title: str = Field(..., example="Corruption at Road Project")
    description: str = Field(..., example="Bribes were requested at checkpoint X.")
    location: Optional[str] = Field(None, example="Nairobi")
    latitude: Optional[float] = Field(None, example=-1.2921)
    longitude: Optional[float] = Field(None, example=36.8219)
    category: RecordType = Field(..., example="red-flag")


class ReportCreate(ReportBase):
    pass


class ReportUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    location: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    category: Optional[RecordType]

    class Config:
        orm_mode = True


class LocationUpdate(BaseModel):
    location: str
    latitude: float
    longitude: float


class ReportOut(ReportBase):
    id: UUID
    status: ReportStatus = Field(..., example="draft")
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        use_enum_values = True  
