import sqlalchemy
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.like import Like
from app.models.user import User
from app.core.jwt import get_current_user
router = APIRouter(
    prefix="/likes",
    tags=["Likes"]
)


@router.post("/{post_id}")
def toggle_like(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    like = db.query(Like).filter_by(
        post_id=post_id,
        user_id=current_user.id
    ).first()

    if like:
        db.delete(like)
        db.commit()
        return {"liked": False}

    new_like = Like(
        post_id=post_id,
        user_id=current_user.id
    )
    db.add(new_like)
    db.commit()
    return {"liked": True}


@router.get("/{post_id}/count")
def get_likes_count(
    post_id: int, 
    db: Session = Depends(get_db)
):
    # Query the count of likes for the specific post_id
    count = db.query(Like).filter(Like.post_id == post_id).count()
    
    return {
        "post_id": post_id, 
        "likes_count": count
    }