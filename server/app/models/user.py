from __future__ import annotations

import datetime
import uuid
from typing import List


from sqlalchemy import DateTime, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)


    # # ✅ Relationships with corrected typing
    # posts: Mapped[List["Report"]] = relationship("Report", back_populates="author", cascade="all, delete")
    # comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="user", cascade="all, delete")
    # donations: Mapped[List["Donation"]] = relationship("Donation", back_populates="user", cascade="all, delete")
    # notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="user", cascade="all, delete")

    posts: Mapped[List["Report"]] = relationship(
        "Report",
        back_populates="author",
        cascade="all, delete"
    )

    comments: Mapped[List["Comment"]] = relationship(
        "Comment",
        back_populates="user",
        cascade="all, delete",
        foreign_keys="Comment.created_by"
    )

