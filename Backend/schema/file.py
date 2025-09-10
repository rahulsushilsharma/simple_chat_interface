from pydantic import BaseModel


class FileInput(BaseModel):
    file_name: str
    file_type: str
    md5: str
    user_id: int
    file_path: str
    chunking_status: str
    embedding_status: str


class FileOut(BaseModel):
    id: int
    file_name: str
    file_type: str
    md5: str
    user_id: int
    file_path: str
    chunking_status: str
    embedding_status: str

    class Config:
        from_attributes = True
