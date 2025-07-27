from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


class ReportBase(BaseModel):
    title: str = Field(..., example="Corruption at Road Project")
    description: str = Field(..., example="Bribes were requested at checkpoint X.")
    location: Optional[str] = Field(None, example="Nairobi")
    latitude: Optional[float] = Field(None, example=-1.2921)
    longitude: Optional[float] = Field(None, example=36.8219)
    category: str = Field(..., example="bribery")


class ReportCreate(ReportBase):
    pass


class ReportUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    location: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    status: Optional[str] = Field(None, example="In Progress")
    category: Optional[str] = Field(None, example="bribery")


class ReportOut(ReportBase):
    id: UUID
    status: str = Field(..., example="Pending")
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
