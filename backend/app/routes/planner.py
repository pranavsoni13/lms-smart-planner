from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.task import Task
from app.services.planner import generate_plan

router = APIRouter(prefix="/planner")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_plan(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return generate_plan(tasks)