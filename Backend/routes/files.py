from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from models import models
from sqlalchemy.orm import Session
from database.database import get_db
from utils.config_vars import FILE_URL
from schema.file import FileOut, FileInput
import hashlib
import os
from langchain_wraper.file import load_files

router = APIRouter(prefix="/file", tags=["files"])


@router.get("/files", response_model=list[FileOut])
def list_files(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.File).filter(models.File.user_id == user_id).all()


def save_file(file: FileInput, db: Session):
    db_session = models.File(**file.model_dump())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


async def create_hash(file: UploadFile):
    md5_hash = hashlib.md5()
    while chunk := await file.read(8192):
        md5_hash.update(chunk)

    await file.seek(0)
    return md5_hash.hexdigest()


async def write_file(file: File, file_path: str):
    with open(file_path, "wb") as out_file:
        while chunk := await file.read(8192):
            out_file.write(chunk)


@router.post("/upload")
async def upload_file(
    user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)
):

    file_hash = await create_hash(file)
    file_path = FILE_URL + "/" + file_hash + "." + file.filename.split(".")[-1]

    file_data = db.query(models.File).filter(models.File.md5 == file_hash).first()

    if file_data:
        raise HTTPException(400, "File alredy present")
    else:
        # BackgroundTasks.add_task(write_file, file, file_path)

        write_file(file, file_path)
        file_data = FileInput(
            file_name=file.filename,
            file_path=file_path,
            user_id=user_id,
            md5=file_hash,
            file_type=file.filename.split(".")[-1],
            embedding_status="processing",
            chunking_status="processing",
        )
        save_file(file_data, db)

    return {"message": "File uploaded succesfully"}


@router.get("list_doc_data")
def doc_data(file_id: int, db: Session = Depends(get_db)):
    file = db.query(models.File).filter(models.File.id == file_id).first()
    return load_files(file.file_path)
