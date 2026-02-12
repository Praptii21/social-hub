import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models.post import Post
from app.models.user import User
from app.models.like import Like
from app.schemas.post import PostCreate
from app.core.jwt import get_current_user

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)
@router.post("/")
def create_post(
    data: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = Post(
        content=data.content,
        user_id=current_user.id
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

@router.get("/")
def get_posts(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Post.id,
            Post.content,
            Post.created_at,
            Post.user_id,
            User.username.label("username"),
            func.count(Like.id).label("likes_count"),
        )
        .join(User, User.id == Post.user_id)
        .outerjoin(Like, Like.post_id == Post.id)
        .group_by(Post.id, User.username)
        .order_by(Post.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "content": r.content,
            "created_at": r.created_at,
            "user_id": r.user_id,
            "username": r.username,
            "likes_count": r.likes_count,
        }
        for r in rows
    ]


@router.get("/user/{user_id}")
def get_posts_by_user(user_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(
            Post.id,
            Post.content,
            Post.created_at,
            Post.user_id,
            User.username.label("username"),
            func.count(Like.id).label("likes_count"),
        )
        .join(User, User.id == Post.user_id)
        .outerjoin(Like, Like.post_id == Post.id)
        .filter(Post.user_id == user_id)
        .group_by(Post.id, User.username)
        .order_by(Post.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "content": r.content,
            "created_at": r.created_at,
            "user_id": r.user_id,
            "username": r.username,
            "likes_count": r.likes_count,
        }
        for r in rows
    ]

@router.put("/{post_id}")
def update_post(
    post_id: int,
    data: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to edit this post")

    post.content = data.content
    db.commit()
    db.refresh(post)
    return post

@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this post")

    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}
