from database.database import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import models
from repo.user_repo import UserRepo
from schema.user import UserCreate, UserOut
from sqlalchemy.orm import Session

router = APIRouter(prefix="/user", tags=["users"])


@router.get("/users", response_model=list[UserOut])
def get_users(db: Session = Depends(get_db)):
    try:
        user_repo = UserRepo(db)
        return user_repo.get_all()
    except Exception as e:
        raise HTTPException(500, detail=f"Error getting users {str(e)}")


@router.post("/add_users", response_model=UserOut)
def add_user(user: UserCreate, db: Session = Depends(get_db)):

    try:
        db_user = models.Users(**user.model_dump())
        user_repo = UserRepo(db)
        return user_repo.add(db_user)
    except Exception as e:
        raise HTTPException(500, detail=f"Error creating user {str(e)}")
