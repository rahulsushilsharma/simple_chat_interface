from typing import Generic, List, Optional, Type, TypeVar
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)
T = TypeVar("T")


class BaseRepo(Generic[T]):
    def __init__(self, db: Session, model: Type[T]):
        self.db = db
        self.model = model

    def get_all(self) -> List[T]:
        try:
            rows = self.db.query(self.model).all()
            return rows
        except Exception as e:
            logger.error(f"error at get_all() BaseRepo {str(e)}")
            raise

    def get_by_id(self, key: str, val) -> Optional[T]:
        try:
            field = getattr(self.model, key)
            row = self.db.query(self.model).filter(field == val).first()
            return row
        except Exception as e:
            logger.error(f"error at get_by_id() BaseRepo {str(e)}")
            raise

    def get_all_by_field(self, key: str, val) -> List[T]:
        try:
            field = getattr(self.model, key)
            rows = self.db.query(self.model).filter(field == val).all()
            return rows
        except Exception as e:
            logger.error(f"error at get_all_by_field() BaseRepo {str(e)}")
            raise

    def add(self, obj: T) -> T:
        try:
            self.db.add(obj)
            self.db.commit()
            self.db.refresh(obj)
            return obj
        except Exception as e:
            self.db.rollback()
            logger.error(f"error add model to db add() BaseRepo {str(e)}")
            raise

    def delete(self, obj: T) -> bool:
        try:
            self.db.delete(obj)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"error delete model delete() BaseRepo {str(e)}")
            raise

    def update(self, obj: T) -> T:
        try:
            self.db.commit()
            self.db.refresh(obj)
            return obj
        except Exception as e:
            self.db.rollback()
            logger.error(f"error update model update() BaseRepo {str(e)}")
            raise
