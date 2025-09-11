import os
import logging
from urllib.parse import urlparse
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

logger = logging.getLogger("guof-backend")

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
parsed = urlparse(MONGODB_URI)
db_from_uri = parsed.path.strip("/") if parsed.path and parsed.path.strip("/") else None
MONGODB_DB = os.getenv("MONGODB_DB", db_from_uri or "guofsyrians_db")

client = AsyncIOMotorClient(MONGODB_URI)
db = client[MONGODB_DB]

# IMPORTANT: استورد الموديلات كلها بما فيها Job
from app.models import team_model, member_model, user_model, voting_model
from app.models.job import Job
from app.models.application import Application

async def init_db():
    logger.info(f"Connecting to MongoDB: {MONGODB_URI}")
    logger.info(f"Using database: {MONGODB_DB}")
    await init_beanie(
        database=db,
        document_models=[
            # Members
            member_model.Member,
            member_model.MemberWorkExperience,
            member_model.MemberProject,
            member_model.MemberEducation,

            # Teams
            team_model.Team,

            # Users
            user_model.User,

            # Voting
            voting_model.Poll,
            voting_model.PollChoice,
            voting_model.Vote,
            voting_model.VoterRecord,

            # Jobs (جديد ومهم)
            Job,

            # Applications (جديد ومهم)
            Application,
        ],
    )
    logger.info("Beanie initialized (Job and Application included).")
