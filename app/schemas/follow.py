from pydantic import BaseModel

class FollowStatus(BaseModel):
    following: bool

class FollowCount(BaseModel):
    followers: int
    following: int
