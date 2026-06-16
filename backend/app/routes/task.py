from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.task import Task
from app.schemas.task_schema import TaskCreate
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
    db.refresh(new_task)
    return new_task

@router.put("/{task_id}")
def update_task(task_id: int, updated_data: dict = Body(...), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if "title" in updated_data:
        task.title = updated_data["title"]

    if "priority" in updated_data:
        task.priority = updated_data["priority"]

    if "deadline" in updated_data:
        task.deadline = datetime.fromisoformat(updated_data["deadline"].replace("Z", "+00:00"))

    db.commit()
    db.refresh(task)
    return task

@router.put("/{task_id}/toggle")
def toggle_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.status == "pending":
        task.status = "completed"
    else:
        task.status = "pending"

    db.commit()
    db.refresh(task)

    return task

@router.get("/")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

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
