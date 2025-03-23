from crud import member_crud
from fastapi import APIRouter, HTTPException
from models import member_model

router = APIRouter()

@router.post("/member")
async def create_member(member: member_model.Member):
    return await member_crud.create_member(member)

@router.get("/member/{member_id}")
async def get_member_by_id(member_id: str):
    member = await member_crud.get_member_by_id(member_id)
    if member:
        return member
    raise HTTPException(status_code=404, detail="Member not found")

@router.put("/member/{member_id}")
async def update_member(member_id: str, member: member_model.Member):
    member = await member_crud.update_member(member_id, member)
    if member:
        return member
    raise HTTPException(status_code=404, detail="Member not found")

@router.delete("/member/{member_id}")
async def delete_member(member_id: str):
    member = await member_crud.delete_member(member_id)
    if member:
        return member
    raise HTTPException(status_code=404, detail="Member not found")

@router.get("/members")
async def get_all_members_from_all_teams():
    return await member_crud.get_all_members_from_all_teams()

@router.get("/members/{team_id}")
async def get_all_members_from_one_team(team_id: str):
    return await member_crud.get_all_members_from_one_team(team_id)

