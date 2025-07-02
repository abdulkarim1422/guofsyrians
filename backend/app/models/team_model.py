from datetime import datetime, timezone
from beanie import Document
from pydantic import Field
from bson import ObjectId
from typing import List, Dict, Optional

class Team(Document):
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    logo: Optional[str] = None
    cover: Optional[str] = None
    intro: Optional[str] = None
    website: Optional[str] = None
    social_media: Dict[str, str] = Field(default={})
    country: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    leadership: List[Dict[str, str]] = Field(default=[]) # role and member_id
    number_of_members: int = 0
    

