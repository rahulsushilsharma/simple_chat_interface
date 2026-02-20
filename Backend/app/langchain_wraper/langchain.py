from langchain.messages import AIMessage, HumanMessage, SystemMessage
from langchain_ollama import ChatOllama, OllamaEmbeddings
from schema.chat import ChatInput, ChatOutput


def create_llm(model: str, vendor: str):
    if vendor == "ollama":
        return ChatOllama(model=model)


def parse_history(history: list[ChatOutput]):
    chat_history = []
    for chat in history:
        if chat.message_type == "assistant":
            chat_history.append(AIMessage(chat.message))
        elif chat.message_type == "system":
            chat_history.append(SystemMessage(chat.message))
        elif chat.message_type == "user":
            chat_history.append(HumanMessage(chat.message))
        return chat_history


async def chat_langchain(model_name: str, history: list[ChatOutput]):
    model = create_llm(model=model_name, vendor="ollama")
    if model is None:
        return
    messages = parse_history(history=history)
    if messages is None:
        return

    # Use astream() for async
    async for chunk in model.astream(messages):
        yield chunk
