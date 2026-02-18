from typing import Optional

from database.database import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import models
from schema.session import JsonResponse, SessionInput, SessionOut
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

router = APIRouter(prefix="/session", tags=["session"])


@router.get("/session", response_model=list[SessionOut])
def get_session(
    user_id: int, limit: Optional[int] = None, db: Session = Depends(get_db)
):
    if limit:
        return (
            db.query(models.Session)
            .filter(models.Session.user_id == user_id)
            .limit(limit=limit)
            .order_by(asc(models.Session.id))
        )
    else:
        return db.query(models.Session).filter(models.Session.user_id == user_id).all()


@router.post("/create_session", response_model=SessionOut)
def add_session(session: SessionInput, db: Session = Depends(get_db)):
    db_session = models.Session(**session.model_dump())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


@router.delete("/delete_session", response_model=JsonResponse)
def delete_session(session_id: int, db: Session = Depends(get_db)):
    db_session = (
        db.query(models.Session).filter(models.Session.id == session_id).first()
    )
    if db_session is None:
        raise HTTPException(404, detail="Session not found")

    db.delete(db_session)
    db.commit()

    return {"message": "session deleted successfully"}
