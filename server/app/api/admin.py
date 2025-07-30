# app/api/admin.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from app.db import get_db
from app.models.user import User
from app.models.report import Report, ReportStatus # Keep ReportStatus for validation if needed
from app.schemas.user import UserOut as UserSchema
from app.schemas.report import ReportOut, ReportStatusUpdate # <--- IMPORT ReportStatusUpdate
from app.core.security import get_current_user as get_admin_user # Use get_admin_user alias for clarity
from app.services import report_service # <--- IMPORT report_service

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# Using get_current_user as get_admin_user for consistency with previous discussion
# This function ensures the user is authenticated and is an admin
# (Assuming it's defined elsewhere, e.g., app/core/security.py)
# If get_admin_user is defined in this file, keep it as is.
# async def get_admin_user(...): ... (your existing definition)


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


# --- UPDATED ENDPOINT FOR REPORT STATUS CHANGE ---
@router.patch("/reports/{report_id}/status", response_model=ReportOut)
async def update_report_status(
    report_id: UUID,
    status_update: ReportStatusUpdate, # <--- Use the new Pydantic schema
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Admin-only: Change the status of a report.
    Allowed statuses: "under investigation", "rejected", "resolved".
    """
    # Optional: Re-validate status if you want to ensure it's from the enum values
    # FastAPI/Pydantic will handle basic enum validation if ReportStatusUpdate.status is ReportStatus
    # but explicit check might be desired for custom error messages.
    # if status_update.status not in [ReportStatus.UNDER_INVESTIGATION, ReportStatus.REJECTED, ReportStatus.RESOLVED]:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status provided.")

    updated_report = await report_service.update_report_status(
        db, report_id, status_update.status # <--- Pass the enum value from the schema
    )

    if not updated_report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    return updated_report