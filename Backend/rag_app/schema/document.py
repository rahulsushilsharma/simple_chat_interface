from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class DocumentCreate(BaseModel):
    user_id: int
    file_name: str
    file_path: str
    file_type: Optional[str] = None
    status: Optional[str] = "pending"

    class Config:
        from_attributes = True


class DocumentOutput(BaseModel):
    id: int
    user_id: int
    file_name: str
    file_path: str
    file_type: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentChunkCreate(BaseModel):
    document_id: int
    chunk_index: int
    content: str

    class Config:
        from_attributes = True


class DocumentChunkOutput(BaseModel):
    id: int
    document_id: int
    chunk_index: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
