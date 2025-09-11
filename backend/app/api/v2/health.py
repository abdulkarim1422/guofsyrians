from fastapi import APIRouter
from app.core.settings import get_settings

router = APIRouter()


@router.get("/health")
async def health_v2():
    settings = get_settings()
    return {
        "status": "ok",
        "version": "v2",
        "app": settings.APP_NAME,
    }
