from datetime import datetime, timezone
from beanie import Document
from pydantic import Field
from bson import ObjectId
from typing import List, Dict, Optional

class User(Document):
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email: str
    password: str
    member_id: str