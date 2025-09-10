# app/schemas/report.py

from pydantic import BaseModel, Field, validator
from typing import Optional, List
import uuid
from datetime import datetime
from app.models.report import ReportStatus, RecordType
from app.schemas.media import MediaOut  # Import the media schema

class ReportBase(BaseModel):
    title: str = Field(..., example="Corruption at Road Project")
    description: str = Field(..., example="Bribes were requested at checkpoint X.")
    location: Optional[str] = Field(None, example="Nairobi")
    latitude: Optional[float] = Field(None, example=-1.2921)
    longitude: Optional[float] = Field(None, example=36.8219)
    category: RecordType = Field(..., example="red-flag")

    @validator("category", pre=True)
    def normalize_category(cls, v):
        if isinstance(v, str):
            return v.lower().replace("_", "-")
        return v


class ReportCreate(ReportBase):
     media: Optional[List[MediaOut]] = [] 


class ReportUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    location: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    category: Optional[RecordType]

    @validator("category", pre=True)
    def normalize_category(cls, v):
        if isinstance(v, str):
            return v.lower().replace("_", "-")
        return v

    class Config:
        orm_mode = True


class LocationUpdate(BaseModel):
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ReportOut(ReportBase):
    id: uuid.UUID
    status: ReportStatus = Field(..., example="draft")
    created_at: datetime
    updated_at: datetime
    media: List[MediaOut] = []  # ← include related media

    class Config:
        orm_mode = True
        use_enum_values = True


class ReportStatusUpdate(BaseModel):
    status: ReportStatus = Field(..., example=ReportStatus.UNDER_INVESTIGATION.value)

    class Config:
        use_enum_values = True
