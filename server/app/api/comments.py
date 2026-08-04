from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.schemas.comment import CommentCreate, CommentOut, CommentUpdate
from app.services.comment_service import create_comment, get_comments_by_report, get_comment, update_comment, delete_comment
from app.core.security import get_current_user
from app.models.user import User
from typing import List
import datetime



from uuid import UUID

router = APIRouter(
    prefix="/api/comments",
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


@router.put("/{comment_id}", response_model=CommentOut)
async def edit_comment(
    comment_id: UUID,
    comment_data: CommentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = await get_comment(str(comment_id), db)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if str(comment.created_by) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to edit this comment")
    
    # Check if within 2 minutes
    time_diff = datetime.datetime.utcnow() - comment.created_at
    if time_diff.total_seconds() > 120:
        raise HTTPException(status_code=403, detail="Comments can only be edited within the first 2 minutes")

    return await update_comment(str(comment_id), comment_data, db)


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_comment(
    comment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = await get_comment(str(comment_id), db)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if str(comment.created_by) != str(current_user.id) and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    await delete_comment(str(comment_id), db)
    return None
