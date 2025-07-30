# app/services/report_service.py

from uuid import UUID
from typing import List, Optional, Tuple
import requests

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.models.report import Report, ReportStatus # Ensure ReportStatus is imported here
from app.models.user import User
from app.schemas.report import ReportCreate, ReportUpdate, LocationUpdate


# Geocode location using OpenStreetMap
async def geocode_location(location_name: str) -> Tuple[Optional[float], Optional[float]]:
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": location_name,
        "format": "json",
        "limit": 1
    }
    headers = {"User-Agent": "jiseti-app"}

    try:
        response = requests.get(url, params=params, headers=headers, timeout=5)
        response.raise_for_status()
        data = response.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"Geocoding failed: {e}")

    return None, None


# CREATE report
async def create_report(
    db: AsyncSession,
    report_in: ReportCreate,
    current_user: User
) -> Report:
    latitude = report_in.latitude
    longitude = report_in.longitude

    if latitude is None or longitude is None:
        latitude, longitude = await geocode_location(report_in.location)

    report = Report(
        title=report_in.title,
        description=report_in.description,
        category=report_in.category,
        location=report_in.location,
        latitude=latitude,
        longitude=longitude,
        author_id=current_user.id # <--- REVERTED to author_id
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report


async def get_all_reports(db: AsyncSession) -> List[Report]:
    result = await db.execute(
        select(Report)
        .options(
            selectinload(Report.author), # <--- REVERTED to Report.author
            selectinload(Report.comments),
            selectinload(Report.media) # <--- UNCOMMENTED and kept as Report.media
        )
    )
    return result.scalars().all()


async def get_report_by_id(db: AsyncSession, report_id: UUID) -> Report:
    result = await db.execute(
        select(Report)
        .where(Report.id == report_id)
        .options(
            selectinload(Report.author), # <--- REVERTED to Report.author
            selectinload(Report.comments),
            selectinload(Report.media) # <--- UNCOMMENTED and kept as Report.media
        )
    )
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    return report


async def update_report(
    db: AsyncSession,
    report_id: UUID,
    report_in: ReportUpdate,
    current_user: User
) -> Report:
    report = await get_report_by_id(db, report_id)

    # Use report.author_id to check ownership
    if report.author_id != current_user.id and not current_user.is_admin: # <--- REVERTED to author_id
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this report"
        )

    # Convert string status to Enum for comparison if 'status' is an Enum in model
    # Ensure 'draft' is a valid ReportStatus member if you're comparing against it
    if report.status != ReportStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update report after it's been processed"
        )

    # Use dict(exclude_unset=True) to update only provided fields
    update_data = report_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(report, field, value)

    await db.commit()
    await db.refresh(report)
    return report


async def update_report_location(
    db: AsyncSession,
    report_id: UUID,
    location: LocationUpdate,
    current_user: User
) -> Report:
    report = await get_report_by_id(db, report_id)

    # Use report.author_id to check ownership
    if report.author_id != current_user.id: # <--- REVERTED to author_id
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to update location"
        )

    if report.status != ReportStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change location of processed report"
        )

    latitude = location.latitude
    longitude = location.longitude

    if latitude is None or longitude is None:
        if location.location:
            latitude, longitude = await geocode_location(location.location)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Location name or coordinates must be provided for update."
            )

    report.latitude = latitude
    report.longitude = longitude
    report.location = location.location

    await db.commit()
    await db.refresh(report)
    return report

async def delete_report(
    db: AsyncSession,
    report_id: UUID,
    current_user: User
) -> dict:
    report = await get_report_by_id(db, report_id)

    # Use report.author_id to check ownership
    if report.author_id != current_user.id and not current_user.is_admin: # <--- REVERTED to author_id
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this report"
        )

    if report.status != ReportStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete report once it is under investigation or resolved"
        )

    await db.delete(report)
    await db.commit()

    return {"message": "Report deleted successfully"}


# --- NEW SERVICE FUNCTION FOR STATUS UPDATE ---
async def update_report_status(
    db: AsyncSession,
    report_id: UUID,
    new_status: ReportStatus # This will receive the Enum member directly from the API layer
) -> Report:
    """
    Updates the status of a specific report.
    This function assumes the permission check (admin status) is done in the API layer.
    """
    result = await db.execute(select(Report).filter(Report.id == report_id))
    report = result.scalar_one_or_none()

    if not report:
        return None # The API layer (app/api/admin.py) will handle the 404 HTTPException

    # Optional: Add specific business logic for status transitions if needed
    # For example, preventing a status change from 'resolved' to 'pending'
    # if report.status == ReportStatus.RESOLVED and new_status == ReportStatus.PENDING:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot change resolved report back to pending.")

    report.status = new_status # Assign the Enum member directly
    await db.commit()
    await db.refresh(report)
    return report