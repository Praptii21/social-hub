from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.jwt import get_current_user
from app.models.comment import Comment
from app.models.user import User
from app.schemas.comment import CommentCreate


router = APIRouter(
    prefix="/comments",
    tags=["Comments"]
)


@router.post("/{post_id}")
def add_comment(
    post_id: int,
    data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = Comment(
        content=data.content,
        user_id=current_user.id,
        post_id=post_id
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return {
        "id": comment.id,
        "content": comment.content,
        "user_id": comment.user_id,
        "username": current_user.username,
        "post_id": comment.post_id,
        "created_at": comment.created_at,
    }


@router.get("/post/{post_id}")
def get_comments(post_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(Comment, User.username)
        .join(User, User.id == Comment.user_id)
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
        .all()
    )

    return [
        {
            "id": comment.id,
            "content": comment.content,
            "user_id": comment.user_id,
            "username": username,
            "post_id": comment.post_id,
            "created_at": comment.created_at,
        }
        for comment, username in rows
    ]


@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this comment")

    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}
