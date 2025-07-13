from pydantic import BaseModel
from schema import session


class ChatInput(BaseModel):
    session_id: int
    message_type: str
    message: str


class ChatOutput(BaseModel):
    id: int
    session_id: int
    message_type: str
    message: str
    owner: session.SessionInput

    class Config:
        from_attributes = True
