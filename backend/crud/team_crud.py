from models import team_model
from bson import ObjectId

async def create_team(team) -> team_model.Team:
    await team.insert()
    return team

async def get_team_by_id(team_id: ObjectId) -> team_model.Team:
    return await team_model.Team.get(team_id)

async def update_team(team_id: ObjectId, team: team_model.Team) -> team_model.Team:
    existing = await team_model.Team.get(team_id)
    if not existing:
        return None
    team.id = existing.id
    return await team.replace()

async def delete_team(team_id: ObjectId) -> team_model.Team:
    team = await team_model.Team.get(team_id)
    if team:
        await team.delete()
        return team
    return None

async def get_teams() -> list:
    return await team_model.Team.find({}).to_list()
