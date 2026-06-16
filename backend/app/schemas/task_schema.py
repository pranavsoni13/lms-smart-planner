from pydantic import BaseModel
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    course_id: int | None = None
    priority: int = 2
    deadline: datetime
