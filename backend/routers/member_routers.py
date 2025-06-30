from crud import member_crud
from fastapi import APIRouter, HTTPException
from models import member_model
from services import resume_services
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter()

class MemberWithEducation(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    professional_title: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    social_media: dict = {}
    country: Optional[str] = None
    city: Optional[str] = None
    # Education fields
    university: Optional[str] = None
    major: Optional[str] = None
    year: Optional[str] = None
    graduation_date: Optional[str] = None
    avatar: int = 0

# Member routers
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

@router.get("/members/with-education", response_model=List[MemberWithEducation])
async def get_all_members_with_education():
    """
    Get all members with their education information combined
    """
    # Get all members
    members = await member_crud.get_all_members_from_all_teams()
    
    result = []
    for member in members:
        # Get education for this member
        education = await member_crud.get_member_education_by_member_id(str(member.id))
        
        # Create combined data
        member_data = MemberWithEducation(
            id=str(member.id),
            name=member.name,
            email=member.email,
            phone=member.phone,
            professional_title=member.professional_title,
            bio=member.bio,
            skills=member.skills or [],
            interests=member.interests or [],
            social_media=member.social_media or {},
            country=member.country,
            city=member.city,
            university=education.institution if education else None,
            major=education.field_of_study if education else None,
            year=education.degree if education else None,
            graduation_date=education.end_date.strftime("%Y-%m-%d") if education and education.end_date else None,
            avatar=hash(member.name) % 8  # Generate avatar index based on name
        )
        result.append(member_data)
    
    return result

@router.get("/members/{team_id}")
async def get_all_members_from_one_team(team_id: str):
    return await member_crud.get_all_members_from_one_team(team_id)

# Resume routers
class ResumeFormData(BaseModel):
    name: str
    email: str
    occupation: Optional[str] = None
    location: Optional[str] = None
    telephone: Optional[str] = None
    aboutDescription: Optional[str] = None
    technicalSkills: Optional[str] = None
    softSkills: Optional[str] = None
    linkedinUrl: Optional[str] = None
    githubUrl: Optional[str] = None

@router.post("/member/resume-form/{user_id}", response_model=member_model.Member)
async def update_member_resume_form(user_id: str, form_data: ResumeFormData):
    """
    Update member profile with resume form data
    """
    return await resume_services.member_resume_form(user_id, form_data.dict())

@router.post("/member/resume-form", response_model=member_model.Member)
async def update_member_resume_form_by_email(form_data: ResumeFormData):
    """
    Update member profile with resume form data using email to identify the member
    """
    # Find member by email
    member = await member_crud.get_member_by_email(form_data.email)
    
    if not member:
        raise HTTPException(status_code=404, detail="Member not found with this email")
    
    return await resume_services.member_resume_form(member.user_id, form_data.dict())

