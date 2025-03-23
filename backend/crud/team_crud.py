from models import team_model
from bson import ObjectId

async def create_team(team) -> team_model.Team:
    await team.insert()
    return team

async def get_team_by_id(team_id: ObjectId) -> team_model.Team:
    return await team_model.Team.get(team_id)

