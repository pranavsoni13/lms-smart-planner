from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.task import Task
from app.schemas.task_schema import TaskCreate
from fastapi import APIRouter
from fastapi import Body
from datetime import datetime

router = APIRouter(prefix="/tasks")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(
    title=task.title,
    course_id=task.course_id,
    priority=task.priority,
    deadline=task.deadline
    )
    db.add(new_task)
    db.commit()
    return {"message": "Task created"}

@router.put("/{task_id}")
def update_task(task_id: int, updated_data: dict = Body(...)):
    db = SessionLocal()

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    if "task" in updated_data:
        task.title = updated_data["task"]

    if "priority" in updated_data:
        task.priority = updated_data["priority"]

    if "date" in updated_data:
        task.deadline = datetime.fromisoformat(updated_data["date"])

    db.commit()
    return {"message": "Task updated"}

@router.get("/")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@router.delete("/{task_id}")
def delete_task(task_id: int):
    db = SessionLocal()
    
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        return {"error": "Task not found"}

    db.delete(task)
    db.commit()

    return {"message": "Task deleted"}

@router.post("/ai-plan/")
def generate_plan(data: dict):
    subjects = data.get("subjects", [])
    
    plan = []
    for i, sub in enumerate(subjects):
        plan.append({
            "task": f"Study {sub}",
            "priority": i + 1
        })
    
    return plan