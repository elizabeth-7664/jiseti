from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.db import get_db
from app.schemas.report import ReportCreate, ReportOut, ReportStatusUpdate
from app.services import report_service
from app.core.security import get_current_user, get_admin_user
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["Reports"])


# ========== Create Report ==========
@router.post("/", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
async def create_report(
    report_in: ReportCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await report_service.create_report(db, report_in, current_user)


# ========== Get All Reports ==========
@router.get("/", response_model=List[ReportOut])
async def get_reports(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await report_service.get_all_reports(db)


# ========== Get Single Report ==========
@router.get("/{report_id}", response_model=ReportOut)
async def get_report_by_id(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await report_service.get_report_by_id(db, report_id)


# ========== Admin: Update Report Status ==========
@router.patch("/{report_id}/status", response_model=ReportOut)
async def update_status(
    report_id: UUID,
    status_update: ReportStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await report_service.update_report_status(
        db, report_id, status_update.status, current_user
    )

# ========== Admin: Delete Report ==========
@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    return await report_service.delete_report(db, report_id, current_user)@router.patch("/{report_id}/status", response_model=ReportOut)
async def update_status(
    report_id: UUID,
    status_update: ReportStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    return await report_service.update_report_status(
        db, report_id, status_update.status, current_user
    )

# ========== Admin: Delete Report ==========
@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    return await report_service.delete_report(db, report_id, current_user)