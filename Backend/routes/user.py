from fastapi import APIRouter, Depends
from database.database import get_db
from schema.user import UserOut, UserCreate
from sqlalchemy.orm import Session

from models import models

router = APIRouter(prefix="/user", tags=["users"])


@router.get("/users", response_model=list[UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.Users).all()


@router.post("/add_users", response_model=UserOut)
def add_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = models.Users(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
