from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime

class Application(Document):
    job_id: str
    user_id: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    status: str = "submitted"             # submitted|reviewed|accepted|rejected
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "applications"
        indexes = [
            # منع التقديم المكرر لنفس الوظيفة من نفس المستخدم
            [{"job_id": 1, "user_id": 1}],  # هنضيفه Unique عند تهيئة الفهارس
        ]
