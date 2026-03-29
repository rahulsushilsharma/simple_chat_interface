from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_ollama import OllamaEmbeddings
from langchain_pymupdf4llm import PyMuPDF4LLMLoader

embeddings = OllamaEmbeddings(
    model="nomic-embed-text:v1.5",
)
vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings,
    persist_directory="./chroma_langchain_db",
)


def load_files(file_path: str):
    loader = PyMuPDF4LLMLoader(file_path)
    docs = loader.load()
    print(docs[0])
    return docs


def generate_embedding(docs: list[Document]):
    for doc in docs:
        print(doc)
