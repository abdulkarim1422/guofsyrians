from datetime import datetime, timezone
from beanie import Document
from pydantic import Field
from bson import ObjectId
from typing import List, Dict, Optional

class Member(Document):
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ar_name: Optional[str] = None
    team_id: str
    role: str = "member" # default: member
    membership_number: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    university: Optional[str] = None
    major: Optional[str] = None
    year: Optional[str] = None
    sex: Optional[str] = None
    birthdate: Optional[datetime] = None
    country: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = Field(default_factory=list)
    interests: Optional[List[str]] = Field(default_factory=list)
    social_media: Dict[str, str] = Field(default={})
    
