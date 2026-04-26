from pydantic import BaseModel
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    course_id: int
    priority: int
    deadline: datetime