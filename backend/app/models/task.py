from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    status = Column(String, default="pending")
    priority = Column(Integer, default=1)
    deadline = Column(DateTime)
    course_id = Column(Integer, ForeignKey("courses.id"))