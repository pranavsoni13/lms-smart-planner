from fastapi import FastAPI
from app.database import Base, engine
from app.routes.auth import router as auth_router
from app.routes.course import router as course_router
from app.routes.task import router as task_router
from app.models import user, course, task
from app.routes.planner import router as planner_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(course_router)
app.include_router(task_router)
app.include_router(planner_router)
