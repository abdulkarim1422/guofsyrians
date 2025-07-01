from crud import member_crud
from fastapi import APIRouter, HTTPException, File, UploadFile
from models import member_model
from services import resume_services
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
import uuid
from pathlib import Path

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
    sex: str  # Required field
    # Education fields
    university: Optional[str] = None
    major: Optional[str] = None
    year: Optional[str] = None
    graduation_date: Optional[str] = None
    image: Optional[str] = None

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

@router.get("/members/skills")
async def get_all_skills():
    """
    Get all unique skills from all members
    """
    # Get all members
    members = await member_crud.get_all_members_from_all_teams()
    
    # Collect all skills
    all_skills = set()
    for member in members:
        if member.skills:
            for skill in member.skills:
                if skill and skill.strip():  # Only add non-empty skills
                    all_skills.add(skill.strip())
    
    # Return sorted list of unique skills
    return sorted(list(all_skills))

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
            sex=member.sex or "male",  # Default to male if not set (for backward compatibility)
            university=education.institution if education else None,
            major=education.field_of_study if education else None,
            year=education.degree if education else None,
            graduation_date=education.end_date.strftime("%Y-%m-%d") if education and education.end_date else None,
            image=member.image
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

@router.post("/member/{member_id}/upload-image")
async def upload_member_image(member_id: str, file: UploadFile = File(...)):
    """
    Upload an image for a member
    """
    # Check if member exists
    member = await member_crud.get_member_by_id(member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, JPG, and WebP are allowed.")
    
    # Create uploads directory if it doesn't exist
    uploads_dir = Path("uploads")
    uploads_dir.mkdir(exist_ok=True)
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{member_id}_{uuid.uuid4().hex}.{file_extension}"
    file_path = uploads_dir / unique_filename
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Update member with image path
    image_url = f"/uploads/{unique_filename}"
    
    # Create updated member data
    member_dict = member.dict()
    member_dict["image"] = image_url
    updated_member_data = member_model.Member(**member_dict)
    
    # Update the member in database
    updated_member = await member_crud.update_member_by_string_id(member_id, updated_member_data)
    
    if not updated_member:
        # Clean up uploaded file if update failed
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail="Failed to update member with image")
    
    return {"message": "Image uploaded successfully", "image_url": image_url}

