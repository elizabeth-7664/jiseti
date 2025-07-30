# app/schemas/report.py

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import uuid
from datetime import datetime
from app.models.report import ReportStatus, RecordType # Ensure ReportStatus and RecordType are correctly imported
from app.schemas.media import MediaOut
# Your existing schemas
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
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ReportOut(ReportBase):
    id: uuid.UUID
    status: ReportStatus = Field(..., example="draft") # Using the ReportStatus enum
    created_at: datetime
    updated_at: datetime
    media: List[MediaOut] = []

    class Config:
        orm_mode = True
        use_enum_values = True # Important for serializing enum values correctly

# --- NEW SCHEMA FOR ADMIN STATUS UPDATE ---
class ReportStatusUpdate(BaseModel):
    status: ReportStatus = Field(..., example=ReportStatus.UNDER_INVESTIGATION.value)
    # You can add an optional field for admin notes/comments if needed
    # admin_notes: Optional[str] = Field(None, example="Investigation initiated.")

    class Config:
        use_enum_values = True # Ensure enum value is used in request body