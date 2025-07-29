import uuid
import datetime
from typing import List
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Text, String, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Enum as PgEnum


from app.db import Base

import enum

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.comment import Comment
    from app.models.media import Media
    from app.models.notification import Notification

class RecordType(enum.Enum):
    RED_FLAG = "red-flag"
    INTERVENTION = "intervention"

class ReportStatus(enum.Enum):
    DRAFT = "draft"
    UNDER_INVESTIGATION = "under-investigation"
    REJECTED = "rejected"
    RESOLVED = "resolved"

class Report(Base):
    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[RecordType] = mapped_column(PgEnum(RecordType, name="recordtype"), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)

    status: Mapped[ReportStatus] = mapped_column(PgEnum(ReportStatus, name="reportstatus"), default=ReportStatus.DRAFT)

    created_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.utcnow
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )

    author_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    author: Mapped["User"] = relationship("User", back_populates="posts")

    comments: Mapped[List["Comment"]] = relationship(
        "Comment", back_populates="report", cascade="all, delete"
    )
    notifications: Mapped[List["Notification"]] = relationship(
        "Notification", back_populates="report", cascade="all, delete-orphan"
    )
    media: Mapped[List["Media"]] = relationship(
        back_populates="report", cascade="all, delete", lazy="selectin"
    )
