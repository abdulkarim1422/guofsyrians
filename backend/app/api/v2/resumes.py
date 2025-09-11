from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.crud import member_crud
from app.repositories.resume_repository import serialize_resume, normalize_description

router = APIRouter()


def _normalize_description(desc: str | None):
    if not desc: return []
    return [p.strip() for p in desc.replace("\n", "; ").split("; ") if p.strip()]


@router.get("/{member_id}")
async def get_resume_v2(member_id: str):
    try:
        obj_id = ObjectId(member_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid member_id")
    member = await member_crud.get_member_by_member_id(obj_id)
    if not member:
        raise HTTPException(status_code=404, detail="Not found")
    work_experiences = await member_crud.get_all_work_experiences_by_member_id(obj_id)
    education = await member_crud.get_all_educations_by_member_id(obj_id)
    projects = await member_crud.get_all_projects_by_member_id(obj_id)
    return serialize_resume(member, work_experiences, education, projects)
