from globel_logger.logging import logging
from models.models import ChatHistory
from sqlalchemy.orm import Session

from repo.base_repo import BaseRepo


class ChatRepo(BaseRepo[ChatHistory]):
    def __init__(self, db: Session):
        super().__init__(db, ChatHistory)

    def get_history(self, session_id):
        try:
            history = (
                self.db.query(self.model)
                .filter(self.model.session_id == session_id)
                .all()
            )
            print(history)
            return history
        except Exception as e:
            logging.error(f"error getting history {str(e)}")
            raise e
