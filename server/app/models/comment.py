from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_edited: Mapped[bool] = mapped_column(default=False)

    created_by: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=True)
    report_id: Mapped[UUID] = mapped_column(ForeignKey("reports.id", ondelete="CASCADE"))
    parent_id: Mapped[UUID] = mapped_column(ForeignKey("comments.id", ondelete="CASCADE"), nullable=True)

    user: Mapped["User"] = relationship(back_populates="comments")
    report: Mapped["Report"] = relationship(back_populates="comments")
    replies: Mapped[list["Comment"]] = relationship("Comment", back_populates="parent", cascade="all, delete-orphan")
    parent: Mapped["Comment"] = relationship("Comment", back_populates="replies", remote_side=[id])
