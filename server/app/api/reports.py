from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.db import get_db
from app.schemas.report import ReportCreate, ReportOut
from app.models.user import User
from app.core.security import get_current_user
from app.services import report_service

router = APIRouter()

# Create a new report
@router.post("/", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
async def create_report(
    report_in: ReportCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await report_service.create_report(db, report_in, current_user)

# Get all reports
@router.get("/", response_model=list[ReportOut])
async def get_reports(db: AsyncSession = Depends(get_db)):
    return await report_service.get_all_reports(db)

# Get a single report by ID
@router.get("/{report_id}", response_model=ReportOut)
async def get_report(report_id: UUID, db: AsyncSession = Depends(get_db)):
    return await report_service.get_report_by_id(db, report_id)

# Update report status (admin only)
@router.patch("/{report_id}/status", response_model=ReportOut)
async def update_status(
    report_id: UUID,
    status_str: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await report_service.update_report_status(db, report_id, status_str, current_user)
