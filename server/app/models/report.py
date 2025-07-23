from sqlalchemy import ForeignKey, Text, String, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base
import datetime
import uuid
from typing import List
from .comment import Comment
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.user import User
    from app.models.media import Media
class Report(Base):
    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    created_at: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.utcnow)
    
    author_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    author: Mapped["User"] = relationship("User", back_populates="posts")

    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="report", cascade="all, delete")
    # media: Mapped[List["Media"]] = relationship("Media", back_populates="report", cascade="all, delete")
