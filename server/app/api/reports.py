from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from app.db import get_db
from app.schemas.report import (
    ReportCreate, ReportOut, ReportUpdate, LocationUpdate
)
from app.schemas.report import ReportCreate, ReportOut, ReportUpdate
from app.models.user import User
from app.core.security import get_current_user
from app.services import report_service

router = APIRouter(prefix="/api/records", tags=["Records"])


@router.post("/", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
async def create_report(
    report_in: ReportCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await report_service.create_report(db, report_in, current_user)

@router.put("/{report_id}", response_model=ReportOut)
async def update_report(
    report_id: UUID,
    report_in: ReportUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await report_service.update_report(db, report_id, report_in, current_user)

# Get all reports
@router.get("/", response_model=List[ReportOut])
async def get_all_reports(db: AsyncSession = Depends(get_db)):
    return await report_service.get_all_reports(db)


@router.get("/{report_id}", response_model=ReportOut)
async def get_report(report_id: UUID, db: AsyncSession = Depends(get_db)):
    return await report_service.get_report_by_id(db, report_id)


@router.put("/{report_id}", response_model=ReportOut)
async def update_report(
    report_id: UUID,
    report_in: ReportUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await report_service.update_report(db, report_id, report_in, current_user)


@router.patch("/{report_id}/location", response_model=ReportOut)
async def update_location(
    report_id: UUID,
    location: LocationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await report_service.update_report_location(db, report_id, location, current_user)

@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await report_service.update_report_status(db, report_id, status_str, current_user)

# Delete a report
@router.delete("/{report_id}", status_code=status.HTTP_200_OK)
async def delete_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await report_service.delete_report(db, report_id, current_user)