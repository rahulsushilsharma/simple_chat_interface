from langchain_pymupdf4llm import PyMuPDF4LLMLoader
from langchain_core.documents import Document


def load_files(file_path: str):
    loader = PyMuPDF4LLMLoader(file_path)
    docs = loader.load()
    print(docs[0])
    return docs


def generate_embedding(docs: list[Document]):
    for doc in docs:
        print(doc)
