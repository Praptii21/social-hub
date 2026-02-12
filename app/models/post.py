from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.database import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String(500), nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", backref="posts")

    created_at = Column(DateTime, default=datetime.utcnow)
