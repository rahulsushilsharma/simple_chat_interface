from langchain.agents import create_agent
from langchain.messages import AIMessage, HumanMessage, SystemMessage
from langchain.tools import tool
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_wraper.rag import create_vectorstore
from models.models import File
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


async def rag_chat(
    model_name: str, history: list[ChatOutput], file: File, user_id: int
):
    vector_store = create_vectorstore(file, user_id)

    @tool(response_format="content_and_artifact")
    def retrieve_context(query: str):
        """Retrieve information to help answer a query."""
        # Search your vector store
        retrieved_docs = vector_store.similarity_search(query, k=2)

        # Format documents as text
        serialized = "\n\n".join(
            (f"Source: {doc.metadata}\nContent: {doc.page_content}")
            for doc in retrieved_docs
        )
        return serialized, retrieved_docs

    tools = [retrieve_context]
    agent = create_agent(
        model=model_name,
        tools=tools,
        system_prompt="you have retrival tool for documents",
    )

    # Use the agent
    response = await agent.ainvoke(
        {"messages": [{"role": "user", "content": "what is this file about?"}]}
    )
    return response
