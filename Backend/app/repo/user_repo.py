from typing import Type

from models.models import Users
from sqlalchemy.orm import Session

from repo.base_repo import BaseRepo


class UserRepo(BaseRepo[Users]):
    def __init__(self, db: Session):
        super().__init__(db, Users)
