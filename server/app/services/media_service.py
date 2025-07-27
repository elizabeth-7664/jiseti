import uuid
from uuid import uuid4, UUID
from pathlib import Path
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.media import Media
from app.models.user import User
from typing import Optional


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

async def save_media(file: UploadFile, user_id: UUID, db: AsyncSession, report_id: Optional[UUID] = None):
    if file.content_type not in ["image/jpeg", "image/png", "video/mp4"]:
        raise HTTPException(status_code=400, detail="Invalid file type")

    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = UPLOAD_DIR / filename

    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)

    file_url = f"/uploads/{filename}"

    media = Media(
        file_url=file_url,
        file_type=file.content_type,
        user_id=user_id,
        report_id=report_id
    )
    db.add(media)
    await db.commit()
    await db.refresh(media)

    return media