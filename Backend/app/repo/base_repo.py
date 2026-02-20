from typing import Generic, List, Optional, Type, TypeVar

from globel_logger.logging import logging
from sqlalchemy.orm import Session

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
            logging.error(f"error at get_all() BaseRepo {str(e)}")
            raise

    def get_by_id(self, key: str, val) -> Optional[T]:
        try:
            field = getattr(self.model, key)
            row = self.db.query(self.model).filter(field == val).first()
            return row
        except Exception as e:
            logging.error(f"error at get_by_id() BaseRepo {str(e)}")
            raise

    def add(self, obj: T) -> T:
        try:
            self.db.add(obj)
            self.db.commit()
            self.db.refresh(obj)
            return obj
        except Exception as e:
            logging.error(f"error add model {obj} to db add() BaseRepo {str(e)}")
            raise
