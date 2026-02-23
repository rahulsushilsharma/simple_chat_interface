from database.database import Session
from globel_logger.logging import logging
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_ollama import OllamaEmbeddings
from langchain_pymupdf4llm import PyMuPDF4LLMLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from models.models import Users
from repo.file_repo import FileRepo
from schema.file import FileOut


def create_embedding(file: FileOut):

    embeddings = OllamaEmbeddings(
        model="nomic-embed-text:v1.5",
    )
    return embeddings


def create_vectorstore(file: FileOut, user_id: int):
    embeddings = create_embedding(file)
    collection_name = f"user_embedding_{user_id}"
    vector_store = Chroma(
        collection_name=collection_name,
        embedding_function=embeddings,
        persist_directory="./chroma_langchain_db",
    )
    return vector_store


async def parse_pdf(file: FileOut):

    parser = PyMuPDF4LLMLoader(file.file_path)
    return parser.alazy_load()


async def parse_image(file: FileOut):
    pass


async def parse_general(file: FileOut):
    pass


async def parse(file: FileOut):
    if file.file_type == "pdf":
        return await parse_pdf(file)


async def recursive_chunk(file: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = await text_splitter.atransform_documents(file)
    return texts


async def symantic_chunk(file):
    pass


async def chunk(file: list[Document], type="recursive"):
    if type == "recursive":
        return await recursive_chunk(file)


async def embed(file: FileOut, user: int, chunks: list[Document]):
    store = create_vectorstore(file, user)
    return await store.aadd_documents(chunks)


async def ingest(file_data: FileOut, user_id: int, chunking_type="recursive"):
    db = Session()

    try:
        file_repo = FileRepo(db)
        file = file_repo.get_by_id("id", file_data.id)
        if file is None:
            return None

        docs = await parse(file_data)
        if docs is None:
            return None
        all_docs = []
        async for doc in docs:
            all_docs.append(doc)

        file.status = "chunking"  # type: ignore

        chunks = await chunk(all_docs)
        if chunks is None:
            return None
        chunk_list = []
        for c in chunks:
            chunk_list.append(c)
        if chunks is None:
            return None
        print(chunks)
        file.status = "embedding"  # type: ignore

        db_ids = await embed(file_data, user_id, chunks=chunk_list)

        file.status = "done"  # type: ignore

        db.add(file)
        db.commit()
        db.flush()

        return db_ids
    except Exception as e:
        logging.error(f"error in ingestion {str(e)}")
        raise e
    finally:
        db.close()


def retrival(file_data: FileOut, history: list):
    pass


def similarity_search(file: FileOut, user_id: int, query: str, k: int, *args, **kwargs):
    try:
        store = create_vectorstore(file, user_id)
        return store.similarity_search(query, k, *args, **kwargs)
    except Exception as e:
        logging.error(f"Error at similarity_search() {str(e)}")
        raise e
