from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import uuid

class TokenBase(BaseModel):
    token: str = Field(..., description="Access or reset token")

class UserBase(BaseModel):
    username: str = Field(..., max_length=50)
    email: EmailStr

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: uuid.UUID
    username: str
    email: EmailStr
    avatar: Optional[str] = None
    is_verified: bool
    is_admin: bool
    

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str]
    password: Optional[str]
    avatar: Optional[str]

class FullUser(UserOut):
    posts: Optional[List] = []
    comments: Optional[List] = []
    notifications: Optional[List] = []