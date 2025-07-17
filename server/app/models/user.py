import uuid
from sqlalchemy import String, Boolean
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
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


    # Relationships 
    posts: Mapped[list["Report"]] = relationship(back_populates="author", cascade="all, delete")
    comments: Mapped[list["Comment"]] = relationship(back_populates="user", cascade="all, delete")
    donations: Mapped[list["Donation"]] = relationship(back_populates="user", cascade="all, delete")
    notifications: Mapped[list["Notification"]] = relationship(back_populates="user", cascade="all, delete")
