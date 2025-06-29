from datetime import datetime, timezone
from beanie import Document
from pydantic import Field, EmailStr
from bson import ObjectId
from typing import List, Dict, Optional

class User(Document):
    email: EmailStr = Field(..., unique=True)
    password: str
    name: str
    role: str = "member"  # member, admin, team_leader
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Settings:
        name = "users"
        indexes = [
            "email",
        ]