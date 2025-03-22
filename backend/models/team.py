from datetime import datetime, timezone
from beanie import Document
from pydantic import Field
from bson import ObjectId
from typing import List, Dict

class Team(Document):
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    logo: str
    intro: str
    website: str
    country: str
    city: str
    district: str
    leadership: List[Dict[str, str]] = Field(default=[]) # role and member_id
    number_of_members: int = 0

