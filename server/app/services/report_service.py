from uuid import UUID
from typing import List

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload


from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportCreate, ReportUpdate, LocationUpdate


# CREATE report
async def create_report(
    db: AsyncSession,
    report_in: ReportCreate,
    current_user: User
) -> Report:
    report = Report(
        title=report_in.title,
        description=report_in.description,
        category=report_in.category,
        location=report_in.location,
        longitude=report_in.longitude,
        latitude=report_in.latitude,
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

    if report.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to update this report"
        )

    if report.status != "draft":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update report after it's been processed"
        )

    for field, value in report_in.dict(exclude_unset=True).items():
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
) -> None:
    report = await get_report_by_id(db, report_id)

    if report.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own report"
        )

    if report.status != "draft":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete report once it is under investigation or resolved"
        )

    await db.delete(report)
    await db.commit()
