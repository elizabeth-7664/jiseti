from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert
from app.models.comment import Comment
from app.schemas.comment import CommentCreate
from typing import List

from uuid import uuid4


async def create_comment(report_id: str, data: CommentCreate, db: AsyncSession, user_id: str) -> Comment:
    new_comment = Comment(
        id=str(uuid4()),
        content=data.content,
        report_id=report_id,
        created_by=user_id
    )
    db.add(new_comment)
    await db.commit()
    await db.refresh(new_comment)
    return new_comment


async def get_comments_by_report(report_id: str, db: AsyncSession) -> List[Comment]:
    result = await db.execute(select(Comment).where(Comment.report_id == report_id))
    return result.scalars().all()
