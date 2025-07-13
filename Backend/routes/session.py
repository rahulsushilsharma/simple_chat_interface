from fastapi import APIRouter, Depends
from database.database import get_db
from schema.session import SessionOut, SessionInput
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc

from models import models

router = APIRouter(prefix="/session", tags=["session"])


@router.get("/session", response_model=list[SessionOut])
def get_session(limit: int = None, db: Session = Depends(get_db)):
    if limit:
        return (
            db.query(models.Session).limit(limit=limit).order_by(asc(models.Session.id))
        )
    else:
        return db.query(models.Session).all()


@router.post("/create_session", response_model=SessionOut)
def add_session(session: SessionInput, db: Session = Depends(get_db)):
    db_session = models.Session(**session.model_dump())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session
