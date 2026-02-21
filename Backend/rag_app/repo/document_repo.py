from typing import List, Optional

from models.models import Document, DocumentChunk
from sqlalchemy.orm import Session

from .base_repo import BaseRepo


class DocumentRepo(BaseRepo[Document]):
    def __init__(self, db: Session):
        super().__init__(db, Document)

    def get_by_user(self, user_id: int) -> List[Document]:
        return self.get_all_by_field("user_id", user_id)

    def get_by_id_and_user(self, doc_id: int, user_id: int) -> Optional[Document]:
        try:
            return (
                self.db.query(self.model)
                .filter(self.model.id == doc_id, self.model.user_id == user_id)
                .first()
            )
        except Exception as e:
            raise e


class DocumentChunkRepo(BaseRepo[DocumentChunk]):
    def __init__(self, db: Session):
        super().__init__(db, DocumentChunk)

    def get_by_document(self, document_id: int) -> List[DocumentChunk]:
        return self.get_all_by_field("document_id", document_id)

    def delete_by_document(self, document_id: int) -> bool:
        try:
            self.db.query(self.model).filter(
                self.model.document_id == document_id
            ).delete()
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise e
