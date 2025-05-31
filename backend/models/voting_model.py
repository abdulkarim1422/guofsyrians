from datetime import datetime, timezone
from beanie import Document
from pydantic import Field
from bson import ObjectId

class Poll(Document):
    title: str
    description: str
    start_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    end_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by_id: ObjectId # user_id of the creator

class PollChoice(Document):
    poll_id: ObjectId
    choice_text: str
    description: str = None
    image: str = None
    
class Vote(Document):
    poll_id: ObjectId
    choice_id: ObjectId

class VoterRecord(Document):
    poll_id: ObjectId
    user_id: ObjectId
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
