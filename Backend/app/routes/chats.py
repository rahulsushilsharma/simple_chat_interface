import json

from database.database import get_db
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from langchain_wraper.langchain import chat_langchain
from models import models
from repo.chat_repo import ChatRepo
from repo.session_repo import SessionRepo
from schema import chat
from sqlalchemy.orm import Session
from utils.custom_httpx import CustomHttpx

router = APIRouter(prefix="/chat", tags=["chats"])
client = CustomHttpx()


@router.get("/get_chat", response_model=list[chat.ChatOutput])
def get_chat(session_id: int, db: Session = Depends(get_db)):
    try:
        chat_repo = ChatRepo(db)
        return chat_repo.get_history(session_id)
    except Exception as e:
        raise HTTPException(500, detail=f"Error getting chats {str(e)}")


def add_chats(chat: chat.ChatInput, db: Session):
    try:
        db_chat_history = models.ChatHistory(**chat.model_dump())
        chat_repo = ChatRepo(db)
        return chat_repo.add(db_chat_history)
    except Exception as e:
        raise HTTPException(500, detail=f"Error adding chats {str(e)}")


@router.post("/chat", response_model=chat.ChatOutput)
async def chats(user_chat: chat.ChatInput, db: Session = Depends(get_db)):
    try:
        add_chats(user_chat, db)
        chat_repo = ChatRepo(db)
        chats = chat_repo.get_history(user_chat.session_id)
        if chats is None:
            raise Exception("Error getting history")
        session_repo = SessionRepo(db)
        cur_session = session_repo.get_by_id("id", user_chat.session_id)
        if cur_session is None:
            raise Exception("Error getting current session details")
        content = ""
        chat_schema = [chat.ChatOutput.model_validate(c) for c in chats]

        async def call_ollama_api():
            nonlocal content

            async for chunk in chat_langchain(
                model_name=str(cur_session.model_name), history=chat_schema
            ):
                content += str(chunk.content)

                yield chunk
            yield json.dumps(
                {
                    "model": "gemma3n:latest",
                    "created_at": "2025-07-14T13:58:12.771225Z",
                    "message": {"role": "assistant", "content": "content"},
                    "done": True,
                }
            )
            data = chat.ChatInput(
                session_id=user_chat.session_id,
                message_type="assistant",
                message=content,
            )
            add_chats(data, db)

        return StreamingResponse(call_ollama_api(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(500, detail=f"Error generating response {str(e)}")


def db_to_ollama(chats: list[chat.ChatOutput]):
    ollama_chats = []
    for chat_ in chats:
        temp_chat = {}
        temp_chat["role"] = chat_.message_type
        temp_chat["content"] = chat_.message
        ollama_chats.append(temp_chat)

    return ollama_chats
