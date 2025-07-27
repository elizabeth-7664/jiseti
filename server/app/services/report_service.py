from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status

from app.models.report import Report
from app.schemas.report import ReportCreate
from app.models.user import User
from typing import List


async def create_report(
    db: AsyncSession,
    report_in: ReportCreate,
    current_user: User
) -> Report:
    report = Report(
        title=report_in.title,
        description=report_in.description,
        category=report_in.category,
        location = report_in.location,
        longitude=report_in.longitude,
        latitude=report_in.latitude,
        author_id=current_user.id
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report


async def get_all_reports(db: AsyncSession) -> List[Report]:
    result = await db.execute(select(Report))
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


async def update_report_status(
    db: AsyncSession,
    report_id: UUID,
    status_str: str,
    current_user: User
) -> Report:
    report = await get_report_by_id(db, report_id)

    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update report status"
        )

    report.status = status_str
    await db.commit()
    await db.refresh(report)
    return report