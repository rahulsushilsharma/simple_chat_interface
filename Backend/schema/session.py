from typing import Optional
from pydantic import BaseModel
from schema import user


class SessionInput(BaseModel):
    user_id: int
    temperature: float
    session_name: str
    session_type: str
    model_name: str


class SessionOut(BaseModel):
    id: int
    user_id: int
    temperature: float
    session_name: str
    session_type: str
    model_name: str
    owner: Optional[user.UserCreate]

    class Config:
        from_attributes = True
