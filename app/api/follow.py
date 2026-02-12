from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.jwt import get_current_user
from app.models.follow import Follow
from app.models.user import User

router = APIRouter(
    prefix="/follow",
    tags=["Follow"]
)
@router.post("/{user_id}")
def follow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    existing = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.following_id == user_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already following")

    follow_record = Follow(
        follower_id=current_user.id,
        following_id=user_id
    )

    db.add(follow_record)
    db.commit()
    return {"message": "Followed successfully"}

@router.delete("/{user_id}")
def unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    follow_record = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.following_id == user_id
    ).first()

    if not follow_record:
        raise HTTPException(status_code=404, detail="Not following")

    db.delete(follow_record)
    db.commit()
    return {"message": "Unfollowed successfully"}

@router.get("/count/{user_id}")
def follow_count(user_id: int, db: Session = Depends(get_db)):
    followers = db.query(Follow).filter(Follow.following_id == user_id).count()
    following = db.query(Follow).filter(Follow.follower_id == user_id).count()

    return {
        "followers": followers,
        "following": following
    }
@router.get("/is-following/{user_id}")
def is_following(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    follow_record = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.following_id == user_id
    ).first()

    return {"following": follow_record is not None}

