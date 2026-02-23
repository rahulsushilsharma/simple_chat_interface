import asyncio
import hashlib

from database.database import get_db
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from langchain_wraper.rag import ingest, similarity_search
from models import models
from repo.file_repo import FileRepo
from repo.session_repo import SessionRepo
from schema.file import FileInput, FileOut
from sqlalchemy.orm import Session
from utils.config_vars import FILE_URL

router = APIRouter(prefix="/file", tags=["files"])


@router.get("/files", response_model=list[FileOut])
def list_files(user_id: int, db: Session = Depends(get_db)):
    try:
        file_repo = FileRepo(db)
        files = file_repo.get_by_id("user_id", user_id, all=True)
        return files
    except Exception as e:
        raise HTTPException(500, detail=f"Error fetching files {str(e)}")


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
    file_repo = FileRepo(db)

    file_data = file_repo.get_by_id("md5", file_hash)

    if file_data and file_data.user_id == user_id:  # type: ignore
        return file_data
    else:
        await write_file(file, file_path)
        file_data = FileInput(
            file_name=file.filename,
            file_path=file_path,
            user_id=user_id,
            md5=file_hash,
            file_type=file.filename.split(".")[-1],
            status="processing",
        )
        file_data = save_file(file_data, db)
        asyncio.create_task(ingest(file_data, user_id=user_id))  # type: ignore
    return file_data


@router.get("/list_doc_data")
def doc_data(file_id: int, db: Session = Depends(get_db)):
    # file = db.query(models.File).filter(models.File.id == file_id).first()
    # if not file:
    # return HTTPException(404, "file not found")

    return {"some", "data"}


@router.get("/similarity_search")
def similarity(file_id: int, querry: str, k: int, db=Depends(get_db)):
    file_repo = FileRepo(db)
    file = file_repo.get_by_id("id", file_id)
    return similarity_search(file, file.user_id, querry, k)  # type: ignore
