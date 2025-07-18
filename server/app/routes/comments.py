from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import models, schemas, auth

router = APIRouter(
    prefix="/comments",
    tags=["Comments"]
)

get_db = auth.get_db

# Add a Comment to a Report
@router.post("/report/{report_id}", response_model=schemas.CommentOut)
def add_comment(report_id: int, comment: schemas.CommentCreate,
                db: Session = Depends(get_db),
                current_user: models.User = Depends(auth.get_current_user)):

    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    new_comment = models.Comment(
        content=comment.content,
        user_id=current_user.id,
        report_id=report_id
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

# Get Comments for a Report
@router.get("/report/{report_id}", response_model=List[schemas.CommentOut])
def get_report_comments(report_id: int, db: Session = Depends(get_db)):
    comments = db.query(models.Comment).filter(models.Comment.report_id == report_id).order_by(models.Comment.created_at.desc()).all()
    return comments

# Delete a Comment
@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(comment_id: int, db: Session = Depends(get_db),
                   current_user: models.User = Depends(auth.get_current_user)):

    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    db.delete(comment)
    db.commit()
