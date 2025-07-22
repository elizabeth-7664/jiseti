# import uuid
# import datetime
# from sqlalchemy import ForeignKey, String
# from sqlalchemy.orm import Mapped, mapped_column, relationship
# from typing import Optional
# from app.db import Base
# # from app.models.report import Report

# class Media(Base):
#     __tablename__ = "media"

#     id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
#     file_url: Mapped[str] = mapped_column(String, nullable=False)
#     file_type: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g., image/jpeg, video/mp4
#     uploaded_at: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.utcnow)

#     report_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("reports.id"), nullable=False)
#     report: Mapped["Report"] = relationship("Report", back_populates="media")
