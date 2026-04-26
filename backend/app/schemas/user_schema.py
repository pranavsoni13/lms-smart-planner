from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    email: str
    password: str = Field(..., max_length=72)