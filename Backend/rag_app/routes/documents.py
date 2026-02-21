from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.models import Document, DocumentChunk
from schema.document import (
    DocumentCreate,
    DocumentOutput,
    DocumentChunkCreate,
    DocumentChunkOutput,
)
from repo.document_repo import DocumentRepo, DocumentChunkRepo

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/", response_model=DocumentOutput)
async def create_document(doc_data: DocumentCreate, db: Session = Depends(get_db)):
    doc_repo = DocumentRepo(db)
    document = Document(**doc_data.model_dump())
    return doc_repo.add(document)


@router.get("/", response_model=List[DocumentOutput])
async def list_documents(user_id: int, db: Session = Depends(get_db)):
    doc_repo = DocumentRepo(db)
    return doc_repo.get_by_user(user_id)


@router.get("/{doc_id}", response_model=DocumentOutput)
async def get_document(doc_id: int, user_id: int, db: Session = Depends(get_db)):
    doc_repo = DocumentRepo(db)
    document = doc_repo.get_by_id_and_user(doc_id, user_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.delete("/{doc_id}")
async def delete_document(doc_id: int, user_id: int, db: Session = Depends(get_db)):
    doc_repo = DocumentRepo(db)
    chunk_repo = DocumentChunkRepo(db)

    document = doc_repo.get_by_id_and_user(doc_id, user_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    chunk_repo.delete_by_document(doc_id)
    doc_repo.delete(document)
    return {"message": "Document deleted successfully"}


@router.post("/{doc_id}/chunks", response_model=DocumentChunkOutput)
async def add_chunk(
    doc_id: int, chunk_data: DocumentChunkCreate, db: Session = Depends(get_db)
):
    doc_repo = DocumentRepo(db)
    document = doc_repo.get_by_id("id", doc_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    chunk_repo = DocumentChunkRepo(db)
    chunk = DocumentChunk(**chunk_data.model_dump())
    return chunk_repo.add(chunk)


@router.get("/{doc_id}/chunks", response_model=List[DocumentChunkOutput])
async def list_chunks(doc_id: int, db: Session = Depends(get_db)):
    chunk_repo = DocumentChunkRepo(db)
    return chunk_repo.get_by_document(doc_id)


@router.patch("/{doc_id}/status")
async def update_status(
    doc_id: int, status: str, user_id: int, db: Session = Depends(get_db)
):
    doc_repo = DocumentRepo(db)
    document = doc_repo.get_by_id_and_user(doc_id, user_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    document.status = status
    doc_repo.update(document)
    return {"message": "Status updated", "status": status}
