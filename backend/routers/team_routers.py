from crud import team_crud
from fastapi import APIRouter, HTTPException
from models import team_model

router = APIRouter()

@router.post("/team")
async def create_team(team: team_model.Team):
    return await team_crud.create_team(team)

@router.get("/team/{team_id}")
async def get_team_by_id(team_id: str):
    team = await team_crud.get_team_by_id(team_id)
    if team:
        return team
    raise HTTPException(status_code=404, detail="Team not found")