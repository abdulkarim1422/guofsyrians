from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from pydantic import BaseModel
from typing import List
import os

client = AsyncIOMotorClient(os.getenv('MONGODB_URI'))
db = client.guofsyrians_db

# Function to initialize the database connection and bind models
from models import team_model, member_model

async def init_db():
    await init_beanie(database=db, document_models=[team_model.Team, member_model.Member])  # Add all your models here

