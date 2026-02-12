from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.jwt import get_current_user
from app.models.user import User
from app.db.database import get_db
from app.schemas.user import UserUpdate

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "bio": current_user.bio
    }

@router.get("/search")
def search_users(q: str, db: Session = Depends(get_db)):
    results = (
        db.query(User)
        .filter(User.username.ilike(f"%{q}%"))
        .limit(10)
        .all()
    )
    return [
        {
            "id": u.id,
            "username": u.username,
            "bio": u.bio
        }
        for u in results
    ]

@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "username": user.username,
        "bio": user.bio,
        "created_at": user.created_at
    }
@router.put("/me")
def update_user(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.bio = data.bio
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Bio updated",
        "bio": current_user.bio
    }
