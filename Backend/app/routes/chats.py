import json
from collections.abc import AsyncGenerator
from tokenize import String

from database.database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer
from langchain_wraper.langchain import chat_langchain, rag_chat
from models import models
from repo.chat_repo import ChatRepo
from repo.file_repo import FileRepo
from repo.session_repo import SessionRepo
from schema import chat, session
from schema.file import FileOut
from sqlalchemy.orm import Session
from utils.custom_httpx import CustomHttpx

auth_schema = HTTPBearer()
router = APIRouter(prefix="/chat", tags=["chats"])
client = CustomHttpx()


@router.get("/get_chat", response_model=list[chat.ChatOutput])
def get_chat(session_id: int, db: Session = Depends(get_db), _=Depends(auth_schema)):
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
        session_schema = session.SessionOut.model_validate(cur_session)

        async def call_ollama_api() -> AsyncGenerator[str, None]:
            nonlocal content

            try:
                async for chunk in chat_langchain(
                    model_name=session_schema.model_name, history=chat_schema
                ):
                    token = str(chunk.content or "")
                    content += token

                    # VALID SSE FRAME
                    yield f"data: {chunk.model_dump()}\n\n"

            except Exception as ex:
                # VALID SSE ERROR EVENT
                yield f"event: error\ndata: {json.dumps({'error': str(ex)})}\n\n"
                return

            # save chat after stream completes
            data = chat.ChatInput(
                session_id=user_chat.session_id,
                message_type="assistant",
                message=content,
            )
            add_chats(data, db)

            # FINAL DONE EVENT (important for frontend)
            done_payload = {
                "type": "done",
                "model": session_schema.model_name,
                "content": content,
            }

            yield f"event: done\ndata: {json.dumps(done_payload, ensure_ascii=False)}\n\n"

        return StreamingResponse(
            call_ollama_api(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",  # nginx
            },
        )
    except Exception as e:
        raise HTTPException(500, detail=f"Error generating response {str(e)}")


@router.post("/rag_chat")
def rag(user_id: int, file_id: int, db=Depends(get_db)):

    file_repo = FileRepo(db)
    file = file_repo.get_by_id("id", file_id)

    if file is None:
        return HTTPException(status.HTTP_404_NOT_FOUND, detail="file not found")

    file_schema = FileOut.model_validate(file)

    return {
        "result": "success",
    }


def db_to_ollama(chats: list[chat.ChatOutput]):
    ollama_chats = []
    for chat_ in chats:
        temp_chat = {}
        temp_chat["role"] = chat_.message_type
        temp_chat["content"] = chat_.message
        ollama_chats.append(temp_chat)

    return ollama_chats
