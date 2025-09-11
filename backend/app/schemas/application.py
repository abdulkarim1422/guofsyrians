from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ApplicationCreate(BaseModel):
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None

class ApplicationOut(BaseModel):
    id: str
    job_id: str
    user_id: str
    cover_letter: Optional[str]
    resume_url: Optional[str]
    status: str
    created_at: datetime
