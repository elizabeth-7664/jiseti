from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.schemas.comment import CommentCreate, CommentOut
from app.services.comment_service import create_comment, get_comments_by_report
from app.core.security import get_current_user
from app.models.user import User
from typing import List



from uuid import UUID

router = APIRouter(
    prefix="/comments",
    tags=["Comments"]
)


@router.post("/{report_id}", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
async def post_comment(
    report_id: UUID,
    comment_data: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await create_comment(report_id=str(report_id), data=comment_data, db=db, user_id=current_user.id)


@router.get("/{report_id}", response_model=List[CommentOut])
async def fetch_comments(
    report_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    return await get_comments_by_report(str(report_id), db)
