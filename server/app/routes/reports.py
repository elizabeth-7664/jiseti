from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import schemas, models, auth, database

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

get_db = auth.get_db

# Create New Report
@router.post("/", response_model=schemas.ReportOut)
def create_report(
    report: schemas.ReportCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    new_report = models.Report(
        **report.dict(),
        user_id=current_user.id
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report
@router.get("/", response_model=List[schemas.ReportOut])
def get_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).all()

#Getting report by id
@router.get("/{report_id}", response_model=schemas.ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

#Updating
@router.put("/{report_id}", response_model=schemas.ReportOut)
def update_report(report_id: int, report: schemas.ReportUpdate, db: Session = Depends(get_db)):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    report_data = report.dict(exclude_unset=True)
    for key, value in report_data.items():
        setattr(db_report, key, value)
    db.commit()
    db.refresh(db_report)
    return db_report
#Deleting
@router.delete("/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"}