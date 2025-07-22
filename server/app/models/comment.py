from sqlalchemy import Column, Text, ForeignKey
from sqlalchemy.orm import relationship
from uuid import UUID, uuid4
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from app.db import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .report import Report
    from .user import User

class Comment(Base):
    __tablename__ = "comments"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    content = Column(Text, nullable=False)
    report_id = Column(PG_UUID(as_uuid=True), ForeignKey("reports.id"))
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"))

    report = relationship("Report", back_populates="comments")
    user = relationship("User", back_populates="comments")
