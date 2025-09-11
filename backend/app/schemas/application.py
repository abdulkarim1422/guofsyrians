from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class ApplicationCreate(BaseModel):
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None

class ApplicationOut(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    job_id: str
    user_id: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    status: str
    created_at: datetime
