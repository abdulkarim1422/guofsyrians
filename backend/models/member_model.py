from datetime import datetime, timezone
from beanie import Document
from pydantic import Field
from bson import ObjectId
from typing import List, Dict

class Member(Document):
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ar_name: str
    team_id: ObjectId
    role: str # default: member
    membership_number: str
    email: str
    phone: str
    university: str
    major: str
    year: int
    sex: str
    birthdate: datetime
    country: str
    city: str
    district: str
    bio: str
    skills: List[str] = Field(default=[])
    interests: List[str] = Field(default=[])
    social_media: Dict[str, str] = Field(default={})
    
