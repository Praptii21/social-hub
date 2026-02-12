from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    bio: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    bio: str
    created_at: datetime

class Config:
    from_attributes = True
