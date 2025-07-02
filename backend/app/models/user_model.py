from datetime import datetime, timezone
from beanie import Document
from pydantic import Field, EmailStr, validator
from bson import ObjectId
from typing import List, Dict, Optional, Literal

VALID_ROLES = ["member", "admin", "team_leader", "employer", "sub_admin"]

class User(Document):
    email: EmailStr = Field(..., unique=True)
    password: str
    name: str
    role: Literal["member", "admin", "team_leader", "employer", "sub_admin"] = "member"
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    @validator('role')
    def validate_role(cls, v):
        if v not in VALID_ROLES:
            raise ValueError(f'Role must be one of: {", ".join(VALID_ROLES)}')
        return v
    
    class Settings:
        name = "users"
        indexes = [
            "email",
        ]