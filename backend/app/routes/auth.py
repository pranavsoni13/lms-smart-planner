from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.utils.hash import hash_password,verify_password
from app.utils.jwt import create_token
from app.schemas.user_schema import UserCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        new_user = User(
            email=user.email,
            password=hash_password(user.password)
        )
        db.add(new_user)
        db.commit()
        return {"message": "User created"}
    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}

@router.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        return {"error": "Invalid credentials"}

    return {"message": "Login success"}