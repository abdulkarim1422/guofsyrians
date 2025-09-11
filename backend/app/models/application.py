from beanie import Document, PydanticObjectId
from pydantic import Field
from typing import Optional
from datetime import datetime
from pymongo import IndexModel, ASCENDING

class Application(Document):
    job_id: str
    user_id: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    status: str = "submitted"             # submitted|reviewed|accepted|rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "applications"
        indexes = [
            # منع التقديم المكرر لنفس الوظيفة من نفس المستخدم - must be unique
            IndexModel([("job_id", ASCENDING), ("user_id", ASCENDING)], unique=True),
        ]
