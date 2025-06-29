from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os

client = AsyncIOMotorClient(os.getenv('MONGODB_URI'))
db = client.guofsyrians_db

# Function to initialize the database connection and bind models
from models import team_model, member_model, user_model, voting_model

async def init_db():
    await init_beanie(database=db, document_models=[
        # Member models
        member_model.Member,
        member_model.MemberWorkExperience,
        member_model.MemberProject,
        member_model.MemberEducation,

        # Team models
        team_model.Team, 

        # user models
        user_model.User,

        # Voting models
        voting_model.Poll,
        voting_model.PollChoice,
        voting_model.Vote,
        voting_model.VoterRecord
    ])
