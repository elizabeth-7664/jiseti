from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from app.db import get_db
from app.models.user import User
from app.models.report import Report, ReportStatus
from app.schemas.user import UserOut as UserSchema
from app.schemas.report import ReportOut
from app.core.security import get_current_user


router = APIRouter(prefix="/api/admin", tags=["Admin"])



async def get_admin_user(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> User:
    result = await db.execute(select(User).where(User.id == current_user.id))
    user = result.scalar_one_or_none()
    if not user or not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user



@router.get("/users", response_model=List[UserSchema])
async def list_all_users(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Admin-only: Get all users in the system.
    """
    result = await db.execute(select(User))
    return result.scalars().all()



@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Admin-only: Delete a specific user by ID.
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()
    return {"detail": f"User {user_id} deleted successfully"}



@router.patch("/reports/{report_id}/status", response_model=ReportOut)
async def update_report_status(
    report_id: UUID,
    new_status: ReportStatus,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Admin-only: Change the status of a report.
    Allowed statuses: under-investigation, rejected, resolved
    """
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if report.status in [ReportStatus.RESOLVED, ReportStatus.REJECTED]:
        raise HTTPException(status_code=400, detail="This report is already closed.")

    report.status = new_status
    await db.commit()
    await db.refresh(report)
    return report
