from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes.documents import router as documents_router

app = FastAPI(title="RAG Application")

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

app.include_router(documents_router)
Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {"message": "RAG Application API"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
