from datetime import datetime, timezone
from beanie import Document, PydanticObjectId
from pydantic import Field
from typing import Optional

class Poll(Document):
    title: str
    description: str
    start_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    end_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by_id: PydanticObjectId  # user_id of the creator
    
    class Settings:
        name = "polls"

class PollChoice(Document):
    poll_id: PydanticObjectId
    choice_text: str
    description: Optional[str] = None
    image: Optional[str] = None
    
    class Settings:
        name = "poll_choices"
    
class Vote(Document):
    poll_id: PydanticObjectId
    choice_id: PydanticObjectId
    
    class Settings:
        name = "votes"

class VoterRecord(Document):
    poll_id: PydanticObjectId
    user_id: PydanticObjectId
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Settings:
        name = "voter_records"
