import hashlib
import os

from database.database import get_db
from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile
from langchain_wraper.file import load_files
from models import models
from repo.session_repo import SessionRepo
from schema.file import FileInput, FileOut
from sqlalchemy.orm import Session
from utils.config_vars import FILE_URL

router = APIRouter(prefix="/file", tags=["files"])


@router.get("/files", response_model=list[FileOut])
def list_files(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.File).filter(models.File.user_id == user_id).all()


def save_file(file: FileInput, db: Session):
    db_session = models.File(**file.model_dump())
    session_repo = SessionRepo(db)
    return session_repo.add(db_session)


async def create_hash(file: UploadFile):
    md5_hash = hashlib.md5()
    while chunk := await file.read(8192):
        md5_hash.update(chunk)

    await file.seek(0)
    return md5_hash.hexdigest()


async def write_file(file: UploadFile, file_path: str):
    with open(file_path, "wb") as out_file:
        while chunk := await file.read(8192):
            out_file.write(chunk)


@router.post("/upload", response_model=FileOut)
async def upload_file(
    user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    if not file.filename:
        file.filename = ""
    file_hash = await create_hash(file)
    file_path = FILE_URL + "/" + file_hash + "." + file.filename.split(".")[-1]

    file_data = db.query(models.File).filter(models.File.md5 == file_hash).first()

    if file_data:
        return file_data
    else:
        # BackgroundTasks.add_task(write_file, file, file_path)

        await write_file(file, file_path)
        file_data = FileInput(
            file_name=file.filename,
            file_path=file_path,
            user_id=user_id,
            md5=file_hash,
            file_type=file.filename.split(".")[-1],
            embedding_status="processing",
            chunking_status="processing",
        )
        file_data = save_file(file_data, db)

    return file_data


@router.get("list_doc_data")
def doc_data(file_id: int, db: Session = Depends(get_db)):
    file = db.query(models.File).filter(models.File.id == file_id).first()
    if not file:
        return HTTPException(404, "file not found")
    return load_files(str(file.file_name))
