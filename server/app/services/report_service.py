import requests
from uuid import UUID
from typing import List

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload


from app.models.report import Report
from app.schemas.report import ReportCreate, ReportUpdate, LocationUpdate
from app.models.user import User
from typing import List, Optional


async def geocode_location(location_name: str) -> tuple[Optional[float], Optional[float]]:
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
async def create_report(
    db: AsyncSession,
    report_in: ReportCreate,
    current_user: User
) -> Report:
    # Use provided coordinates, or geocode if missing
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
        author_id=current_user.id
    )

    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report




async def get_all_reports(db: AsyncSession) -> List[Report]:
    result = await db.execute(
        select(Report)
        .options(
            selectinload(Report.author),
            selectinload(Report.media),
            selectinload(Report.comments)
        )
    )
    return result.scalars().all()

async def get_report_by_id(db: AsyncSession, report_id: UUID) -> Report:
    result = await db.execute(select(Report).where(Report.id == report_id))
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

    if report.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this report"
        )

    # Don't allow updates if status has been changed from 'pending'
    if report.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot update this report because its status has been changed"
        )

    for field, value in report_in.dict(exclude_unset=True).items():
        setattr(report, field, value)

    await db.commit()
    await db.refresh(report)
    return report



async def update_report_status(
    db: AsyncSession,
    report_id: UUID,
    location: LocationUpdate,
    current_user: User
) -> Report:
    report = await get_report_by_id(db, report_id)

    if report.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to update location"
        )

    if report.status != "draft":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change location of processed report"
        )

    report.latitude = location.latitude
    report.longitude = location.longitude
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
    # Only author or admin can delete
    if report.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this report"
        )

    await db.delete(report)
    await db.commit()

    return {"message": "Report deleted successfully"}
