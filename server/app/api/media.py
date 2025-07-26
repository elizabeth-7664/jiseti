from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.schemas.media import MediaOut
from app.services.media_service import save_media
from app.core.security import get_current_user
from app.models.user import User
from uuid import UUID
from typing import Optional

router = APIRouter(prefix="/media", tags=["Media"])

@router.post("/upload", response_model=MediaOut)
async def upload_media(
    file: UploadFile = File(...),
    report_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await save_media(file, current_user.id, db, report_id)