from models.models import Session as S
from sqlalchemy.orm import Session

from repo.base_repo import BaseRepo


class SessionRepo(BaseRepo[S]):
    def __init__(self, db: Session):
        super().__init__(db, S)
