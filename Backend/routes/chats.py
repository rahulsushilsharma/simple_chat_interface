from fastapi import APIRouter, Depends
from database.database import get_db

from schema import chat
from sqlalchemy.orm import Session
from utils.custom_httpx import CustomHttpx
from models import models
import json
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/chat", tags=["chats"])
client = CustomHttpx()


@router.get("/get_chat", response_model=list[chat.ChatInput])
def get_chat(session_id: int, db: Session = Depends(get_db)):

    return db.query(models.ChatHistory).filter(
        models.ChatHistory.session_id == session_id
    )


def add_chats(chat: chat.ChatInput, db: Session):
    db_chat_history = models.ChatHistory(**chat.model_dump())
    db.add(db_chat_history)
    db.commit()
    db.refresh(db_chat_history)
    return db_chat_history


@router.post("/chat", response_model=chat.ChatOutput)
async def chats(chat: chat.ChatInput, db: Session = Depends(get_db)):
    chat = add_chats(chat, db)

    return StreamingResponse(call_ollama_api(chat), media_type="text/stream")


async def call_ollama_api(chat: chat.ChatInput):
    body = json.dumps(
        {
            "messages": [{"role": "user", "content": "hi"}],
            "temperature": 0,
            "model": "gemma3n:latest",
            "stream": True,
        }
    )
    async with client.stream(
        "POST",
        "http://localhost:11434/api/chat",
        content=body,
    ) as response:
        async for chunk in response.aiter_lines():
            print(chunk)
            yield chunk
