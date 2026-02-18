from langchain_ollama import ChatOllama, OllamaEmbeddings


def call_langchain_ollama(model_name: str, prompt: str):

    model = ChatOllama(model=model_name)
    return model.invoke(prompt)
