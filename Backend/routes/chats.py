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


@router.get("/get_chat", response_model=list[chat.ChatOutput])
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
async def chats(user_chat: chat.ChatInput, db: Session = Depends(get_db)):
    add_chats(user_chat, db)
    chats = get_chat(user_chat.session_id, db)

    content = ""

    async def call_ollama_api():
        ollama_chats = db_to_ollama(chats=chats)
        nonlocal content
        body = json.dumps(
            {
                "messages": ollama_chats,
                "temperature": chats[0].owner.temperature,
                "model": chats[0].owner.model_name,
                "stream": True,
            }
        )
        print(body)
        async with client.stream(
            "POST",
            "http://localhost:11434/api/chat",
            content=body,
        ) as response:
            async for chunk in response.aiter_lines():
                data = json.loads(chunk)
                content += data["message"]["content"]
                print(content)

                yield chunk
            yield content
            data = chat.ChatInput(
                session_id=user_chat.session_id,
                message_type="assistant",
                message=content,
            )
            add_chats(data, db)

    return StreamingResponse(call_ollama_api(), media_type="text/stream")


def db_to_ollama(chats: list[chat.ChatInput]):
    ollama_chats = []
    for chat_ in chats:
        temp_chat = {}
        temp_chat["role"] = chat_.message_type
        temp_chat["content"] = chat_.message
        ollama_chats.append(temp_chat)

    return ollama_chats
