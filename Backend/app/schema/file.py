from pydantic import BaseModel


class FileInput(BaseModel):
    file_name: str
    file_type: str
    md5: str
    user_id: int
    file_path: str
    status: str

    class Config:
        from_attributes = True


class FileOut(FileInput):
    id: int
