"""Add v2 resume API endpoints for frontend integration."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId

from app.api.v2.deps import get_current_user, get_admin_user
from app.repositories.resume_repository import serialize_resume
from app.crud import member_crud
from app.models.user_model import User

router = APIRouter()


class ResumeCreateRequest(BaseModel):
    name: str
    professional_title: Optional[str] = None
    birthdate: Optional[str] = None
    sex: Optional[str] = None
    city: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    image: Optional[str] = None
    relocateToSyria: Optional[str] = None
    bio: Optional[str] = None
    skills: List[str] = []
    interests: List[str] = []
    social_media: dict = {}
    works: List[dict] = []
    academic: List[dict] = []
    projects: List[dict] = []


@router.post("/submit")
async def submit_resume_v2(payload: ResumeCreateRequest):
    """Submit resume without authentication (legacy compatibility)."""
    try:
        # Convert payload to legacy format for existing CRUD
        member_data = {
            "name": payload.name,
            "professional_title": payload.professional_title,
            "birthdate": payload.birthdate,
            "sex": payload.sex,
            "city": payload.city,
            "email": payload.email,
            "phone": payload.phone,
            "image": payload.image,
            "relocateToSyria": payload.relocateToSyria,
            "bio": payload.bio,
            "skills": payload.skills,
            "interests": payload.interests,
            "social_media": payload.social_media,
        }
        
        # Use existing resume submission logic
        from app.routers.resume_routers import submit_resume
        # Create a mock request object
        class MockRequest:
            def __init__(self, data):
                self.__dict__.update(data)
        
        mock_req = MockRequest({
            **member_data,
            "works": payload.works,
            "academic": payload.academic,
            "projects": payload.projects,
        })
        
        result = await submit_resume(mock_req)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume submission failed: {str(e)}")


@router.get("/by-user-id/{user_id}")
async def get_resume_by_user_id_v2(user_id: str):
    """Get resume by user ID (supports v2 normalized responses)."""
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user_id")
    
    member = await member_crud.get_member_by_user_id(obj_id)
    if not member:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    member_id = member.id
    work_experiences = await member_crud.get_all_work_experiences_by_member_id(member_id)
    education = await member_crud.get_all_educations_by_member_id(member_id)
    projects = await member_crud.get_all_projects_by_member_id(member_id)
    
    return serialize_resume(member, work_experiences, education, projects)


@router.put("/{member_id}")
async def update_resume_v2(member_id: str, payload: ResumeCreateRequest, user: User = Depends(get_current_user)):
    """Update existing resume (authenticated)."""
    try:
        obj_id = ObjectId(member_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid member_id")
    
    member = await member_crud.get_member_by_member_id(obj_id)
    if not member:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Check ownership or admin privileges
    is_admin = getattr(user, "is_admin", False) or getattr(user, "role", "") == "admin"
    is_owner = str(member.user_id) == str(user.id)
    
    if not (is_admin or is_owner):
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # Update member data
    update_data = {
        "name": payload.name,
        "professional_title": payload.professional_title,
        "birthdate": payload.birthdate,
        "sex": payload.sex,
        "city": payload.city,
        "email": payload.email,
        "phone": payload.phone,
        "image": payload.image,
        "relocateToSyria": payload.relocateToSyria,
        "bio": payload.bio,
        "skills": payload.skills,
        "interests": payload.interests,
        "social_media": payload.social_media,
    }
    
    for key, value in update_data.items():
        if value is not None:
            setattr(member, key, value)
    
    await member.save()
    
    # TODO: Update work experiences, education, projects
    # For now, return updated member data
    work_experiences = await member_crud.get_all_work_experiences_by_member_id(obj_id)
    education = await member_crud.get_all_educations_by_member_id(obj_id)
    projects = await member_crud.get_all_projects_by_member_id(obj_id)
    
    return serialize_resume(member, work_experiences, education, projects)
