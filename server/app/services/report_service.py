from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from fastapi import HTTPException, status

from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportCreate
from datetime import datetime


# Create a new report
async def create_report(db: AsyncSession, report_in: ReportCreate, current_user: User) -> Report:
    new_report = Report(
        title=report_in.title,
        description=report_in.description,
        location=report_in.location,
        created_by_id=current_user.id,
        created_at=datetime.utcnow(),
        status="pending"
    )
    db.add(new_report)
    await db.commit()
    await db.refresh(new_report)
    return new_report


# Get all reports
async def get_all_reports(db: AsyncSession) -> list[Report]:
    result = await db.execute(select(Report).order_by(Report.created_at.desc()))
    return result.scalars().all()


# Get a report by ID
async def get_report_by_id(db: AsyncSession, report_id: UUID) -> Report:
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return report


# Admin: Update status of a report
async def update_report_status(
    db: AsyncSession,
    report_id: UUID,
    status_str: str,
    current_user: User
) -> Report:
    if not current_user.is_admin:  # Admin-only access
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access only")

    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()

    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    report.status = status_str
    await db.commit()
    await db.refresh(report)
    return report

async def delete_report(db: AsyncSession, report_id: UUID, current_user: User):
    if not current_user.is_admin:  # Admin-only access
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access only")

    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()

    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    await db.delete(report)
    await db.commit()
    return