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

@router.put("/team/{team_id}")
async def update_team(team_id: str, team: team_model.Team):
    team = await team_crud.update_team(team_id, team)
    if team:
        return team
    raise HTTPException(status_code=404, detail="Team not found")

@router.delete("/team/{team_id}")
async def delete_team(team_id: str):
    team = await team_crud.delete_team(team_id)
    if team:
        return team
    raise HTTPException(status_code=404, detail="Team not found")

@router.get("/teams")
async def get_teams():
    return await team_crud.get_teams()