
from sqlalchemy import String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from uuid import UUID, uuid4

from app.db import Base
from app.models.user import User
from app.models.report import Report


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    message: Mapped[str] = mapped_column(String)
    type: Mapped[str] = mapped_column(String(10))  
    sent: Mapped[bool] = mapped_column(Boolean, default=False)

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    report_id: Mapped[UUID] = mapped_column(ForeignKey("reports.id", ondelete="CASCADE"))

    user: Mapped["User"] = relationship("User", back_populates="notifications")
    report: Mapped["Report"] = relationship("Report", back_populates="notifications")

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow
