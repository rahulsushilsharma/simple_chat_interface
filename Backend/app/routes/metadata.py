from fastapi import APIRouter, HTTPException
from utils.config_vars import OLLAMA_TAGS
from utils.custom_httpx import CustomHttpx

router = APIRouter(prefix="/metadata", tags=["metadata"])
client = CustomHttpx()


@router.get("/models")
async def get_avilable_models():
    try:
        ollama_tags = await client.get(OLLAMA_TAGS)
        ollama_tags = ollama_tags.json()

        return ollama_tags
    except Exception as e:
        raise HTTPException(500, e)
