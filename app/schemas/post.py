from pydantic import BaseModel
from datetime import datetime


class PostCreate(BaseModel):
    content: str

class PostOut(BaseModel):
    id: int
    content: str
    created_at: datetime
    username: str
    likes: int
