import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentUpdate
from typing import List

from uuid import uuid4


async def create_comment(report_id: str, data: CommentCreate, db: AsyncSession, user_id: str) -> Comment:
    new_comment = Comment(
        id=str(uuid4()),
        content=data.content,
        report_id=report_id,
        created_by=user_id,
        parent_id=str(data.parent_id) if data.parent_id else None
    )
    db.add(new_comment)
    await db.commit()
    await db.refresh(new_comment)
    return new_comment


async def get_comments_by_report(report_id: str, db: AsyncSession) -> List[Comment]:
    result = await db.execute(select(Comment).where(Comment.report_id == report_id).order_by(Comment.created_at.asc()))
    return result.scalars().all()


async def get_comment(comment_id: str, db: AsyncSession) -> Comment:
    result = await db.execute(select(Comment).where(Comment.id == comment_id))
    return result.scalars().first()


async def update_comment(comment_id: str, data: CommentUpdate, db: AsyncSession) -> Comment:
    comment = await get_comment(comment_id, db)
    if not comment:
        return None
    if data.content is not None:
        comment.content = data.content
    comment.is_edited = True
    await db.commit()
    await db.refresh(comment)
    return comment


async def delete_comment(comment_id: str, db: AsyncSession) -> bool:
    comment = await get_comment(comment_id, db)
    if not comment:
        return False
    await db.delete(comment)
    await db.commit()
    return True
