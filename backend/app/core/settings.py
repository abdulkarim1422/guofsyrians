from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List
import os


class Settings(BaseSettings):
    APP_NAME: str = "Training Employment API"
    API_V2_PREFIX: str = "/api/v2"
    JWT_SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-dev")
    JWT_ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/guof_v2")

    CORS_ORIGINS: List[str] = []
    CORS_ALLOW_CREDENTIALS: bool = True

    model_config = {
        "env_file": ".env",
        "extra": "ignore",
    }


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()  # type: ignore[arg-type]
