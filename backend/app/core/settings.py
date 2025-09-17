from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List, Optional
import os


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Training Employment API"
    API_V2_PREFIX: str = "/api/v2"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Database
    MONGODB_URI: str = os.getenv("MONGO_URL", "mongodb://localhost:27017/training_employment")
    
    # JWT Configuration
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET", "change-me-dev")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRATION_HOURS", "24")) * 60
    
    # URLs
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8222")
    
    # Email Configuration
    MAIL_USERNAME: Optional[str] = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD: Optional[str] = os.getenv("MAIL_PASSWORD")
    MAIL_FROM: str = os.getenv("MAIL_FROM", "noreply@trainingemployment.com")
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", "587"))
    MAIL_SERVER: str = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_STARTTLS: bool = os.getenv("MAIL_STARTTLS", "True").lower() == "true"
    MAIL_SSL_TLS: bool = os.getenv("MAIL_SSL_TLS", "False").lower() == "true"
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://your-domain.com",
        "https://www.your-domain.com"
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    
    # Security
    ALLOWED_HOSTS: List[str] = ["*"] if ENVIRONMENT == "development" else ["your-domain.com", "www.your-domain.com", "api.your-domain.com"]
    
    # File Upload
    MAX_UPLOAD_SIZE: int = int(os.getenv("MAX_UPLOAD_SIZE", "20971520"))  # 20MB
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    
    # DigitalOcean Spaces (optional)
    DO_SPACES_KEY: Optional[str] = os.getenv("DO_SPACES_KEY")
    DO_SPACES_SECRET: Optional[str] = os.getenv("DO_SPACES_SECRET")
    DO_SPACES_ENDPOINT: Optional[str] = os.getenv("DO_SPACES_ENDPOINT")
    DO_SPACES_BUCKET: Optional[str] = os.getenv("DO_SPACES_BUCKET")
    
    # Monitoring
    SENTRY_DSN: Optional[str] = os.getenv("SENTRY_DSN")

    model_config = {
        "env_file": f".env.{os.getenv('ENVIRONMENT', 'development')}",
        "extra": "ignore",
    }


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()  # type: ignore[arg-type]
