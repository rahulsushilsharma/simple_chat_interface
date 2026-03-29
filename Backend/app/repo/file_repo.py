from models.models import File
from sqlalchemy.orm import Session

from repo.base_repo import BaseRepo


class FileRepo(BaseRepo[File]):
    def __init__(self, db: Session):
        super().__init__(db, File)
