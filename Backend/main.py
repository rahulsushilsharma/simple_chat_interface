from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
from globel_logger.logging import setup_logging
import utils
import utils.custom_httpx
from models.models import Base
from database.database import db_engine
from routes import user, chats, session, files


setup_logging()
Base.metadata.create_all(db_engine)

app = FastAPI()


http_client = utils.custom_httpx.CustomHttpx()
# http_client = httpx.AsyncClient()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost:5173",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(chats.router)
app.include_router(session.router)
app.include_router(files.router)
