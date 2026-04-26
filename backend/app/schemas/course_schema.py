from pydantic import BaseModel

class CourseCreate(BaseModel):
    name: str
    description: str