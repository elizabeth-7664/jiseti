from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound
from fastapi import HTTPException, status

from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportCreate, ReportUpdate, LocationUpdate
from uuid import UUID


async def create_report(db: AsyncSession, report_in: ReportCreate, current_user: User):
    new_report = Report(
        title=report_in.title,
        description=report_in.description,
        category=report_in.category,  # Changed from report_type
        location=report_in.location,  # Changed from location_name
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        author_id=current_user.id,  # Changed from user_id
        #status=ReportStatus.DRAFT  # Explicitly set default status
    )
    db.add(new_report)
    await db.commit()
    # Handle media if provided
    if report_in.media:
        for media_item in report_in.media:
            media = Media(
                report_id=new_report.id,
                url=media_item.get("url"),
                type=media_item.get("type")
            )
            db.add(media)
    await db.commit()
    await db.refresh(new_report)
    return new_report

async def get_all_reports(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(
        select(Report)
        .order_by(Report.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


async def get_report_by_id(db: AsyncSession, report_id: UUID):
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


async def update_report(db: AsyncSession, report_id: UUID, report_in: ReportUpdate, current_user: User):
    report = await get_report_by_id(db, report_id)

    if report.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this report")

    for field, value in report_in.dict(exclude_unset=True).items():
        setattr(report, field, value)

    await db.commit()
    await db.refresh(report)
    return report


async def update_report_location(db: AsyncSession, report_id: UUID, location: LocationUpdate, current_user: User):
    report = await get_report_by_id(db, report_id)

    if report.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update location")

    report.location_name = location.location_name
    report.latitude = location.latitude
    report.longitude = location.longitude

    await db.commit()
    await db.refresh(report)
    return report


async def delete_report(db: AsyncSession, report_id: UUID, current_user: User):
    report = await get_report_by_id(db, report_id)

    if report.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this report")

    await db.delete(report)
    await db.commit()
