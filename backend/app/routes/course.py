from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.course import Course
from app.schemas.course_schema import CourseCreate

router = APIRouter(prefix="/courses")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    new_course = Course(
        name=course.name,
        description=course.description,
        user_id=1   # temporary
    )
    db.add(new_course)
    db.commit()
    return {"message": "Course created"}

@router.get("/")
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()