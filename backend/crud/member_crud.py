from models import member_model
from bson import ObjectId

async def create_member(member) -> member_model.Member:
    await member.insert()
    return member

async def get_member_by_id(member_id: ObjectId) -> member_model.Member:
    return await member_model.Member.get(member_id)

async def update_member(member_id: ObjectId, member: member_model.Member) -> member_model.Member:
    existing = await member_model.Member.get(member_id)
    if not existing:
        return None
    member.id = existing.id
    return await member.replace()

async def delete_member(member_id: ObjectId) -> member_model.Member:
    member = await member_model.Member.get(member_id)
    if member:
        await member.delete()
        return member
    return None

async def get_all_members_from_all_teams() -> list:
    return await member_model.Member.find({}).to_list()

async def get_all_members_from_one_team(team_id: ObjectId) -> list:
    return await member_model.Member.find({"team_id": team_id}).to_list()
