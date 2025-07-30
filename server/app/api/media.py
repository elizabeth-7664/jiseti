from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from typing import Optional, List

from app.db import get_db
from app.schemas.media import MediaOut
from app.services.media_service import save_media, delete_media
from app.core.security import get_current_user
from app.models.user import User
from app.models.media import Media

router = APIRouter(prefix="/api/media", tags=["Media"])


@router.post("/upload", response_model=MediaOut)
async def upload_media(
    file: UploadFile = File(...),
    report_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await save_media(file, current_user.id, db, report_id)



@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_media(
    media_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await delete_media(
        media_id=media_id,
        user_id=current_user.id,
        db=db,
        is_admin=current_user.is_admin
    )
    return None



@router.get("/report/{report_id}", response_model=List[MediaOut])
async def list_report_media(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Media).where(Media.report_id == report_id)
    )
    return result.scalars().all()
