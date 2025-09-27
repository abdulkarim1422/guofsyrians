from app.crud import member_crud
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from app.models import member_model
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
from bson import ObjectId
from app.services import resume_services, auth_services
from app.models.user_model import User
import asyncio

router = APIRouter()

# SCHEMAS -------------------------------------------------------------
class WorkExperienceRequest(BaseModel):
    title: str
    period: str
    company: str
    description: List[str]  # Kept for backward compatibility
    responsibilities: Optional[str] = None  # New field for responsibilities
    achievements: Optional[str] = None      # New field for achievements

class AcademicEntryRequest(BaseModel):
    degreeLevel: str
    major: str
    date: str
    institution: str
    gpa: Optional[float] = None      # New field for GPA (0-4 scale)
    rank: Optional[str] = None       # New field for academic honors/rank

class ProjectEntryRequest(BaseModel):
    name: str
    company: str  # Kept for backward compatibility
    period: str
    description: List[str]  # Kept for backward compatibility
    project_type: Optional[str] = None      # New field for project type
    tools: Optional[List[str]] = []         # New field for tools/technologies
    role: Optional[str] = None              # New field for role in project
    responsibilities: Optional[str] = None   # New field for responsibilities
    outcomes: Optional[str] = None          # New field for outcomes/achievements

class ResumeFormRequest(BaseModel):
    # Profile data - using backend field names
    name: str
    professional_title: Optional[str] = None
    birthdate: Optional[str] = None
    sex: str  # Required field: "male" or "female"
    city: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    image: Optional[str] = None
    relocateToSyria: Optional[str] = None
    
    # About Me
    bio: Optional[str] = None
    
    # Skills
    skills: Optional[List[str]] = []
    
    # Interests
    interests: Optional[List[str]] = []
    
    # Social Media - using dict structure
    social_media: Optional[dict] = {}
    
    # Work Experience - will be stored in separate MemberWorkExperience documents
    works: Optional[List[WorkExperienceRequest]] = []
    
    # Academic - will be stored in separate MemberEducation documents
    academic: Optional[List[AcademicEntryRequest]] = []
    
    # Projects - will be stored in separate MemberProject documents
    projects: Optional[List[ProjectEntryRequest]] = []

# HELPER FUNCTIONS -----------------------------------------------------
async def create_education_entries(member_id: str, academic: List[AcademicEntryRequest]):
    """Create education documents for a member using CRUD functions"""
    for edu in academic:
        # Parse graduation date if provided
        graduation_date = None
        if edu.date:
            try:
                graduation_date = datetime.strptime(edu.date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            except ValueError:
                # If date parsing fails, continue without the date
                pass
        
        education = member_model.MemberEducation(
            member_id=member_id,
            institution=edu.institution,
            degree=edu.degreeLevel,
            field_of_study=edu.major,
            end_date=graduation_date,  # Using end_date as graduation date
            gpa=edu.gpa,              # New GPA field
            rank=edu.rank,            # New rank field
        )
        await member_crud.create_member_education(education)

async def create_work_experiences(member_id: str, works: List[WorkExperienceRequest]):
    """Create work experience documents for a member using CRUD functions"""
    for work in works:
        # Parse period string to extract start and end dates if available
        start_date = None
        end_date = None

        if work.period: # TODO correct the frontend to provide xx.xx.xxxx format instead of "Jan 2020 - Present"
            try:
                # Handle different period formats
                if " - " in work.period:
                    parts = work.period.split(" - ")
                    if len(parts) == 2:
                        start_str, end_str = parts
                        
                        # Parse start date
                        try:
                            start_date = datetime.strptime(start_str, "%b %Y").replace(tzinfo=timezone.utc)
                        except ValueError:
                            # Try other formats if needed
                            pass
                        
                        # Parse end date (handle "Present" and "Ongoing")
                        if end_str.lower() not in ["present", "ongoing"]:
                            try:
                                end_date = datetime.strptime(end_str, "%b %Y").replace(tzinfo=timezone.utc)
                            except ValueError:
                                # Try other formats if needed
                                pass
                        # If end_str is "Present" or "Ongoing", end_date remains None
            except Exception:
                # If parsing fails, continue without dates
                pass

        work_experience = member_model.MemberWorkExperience(
            member_id=member_id,
            job_title=work.title,
            company=work.company,
            description="; ".join(work.description),  # Join descriptions into a single string - kept for backward compatibility
            responsibilities=work.responsibilities,   # New responsibilities field
            achievements=work.achievements,         # New achievements field
            start_date=start_date,
            end_date=end_date,
        )
        await member_crud.create_member_work_experience(work_experience)

async def create_project_entries(member_id: str, projects: List[ProjectEntryRequest]):
    """Create project documents for a member using CRUD functions"""
    for proj in projects:
        # Parse period string to extract start and end dates if available
        start_date = None
        end_date = None
        
        if proj.period:
            try:
                # Handle different period formats
                if " - " in proj.period:
                    parts = proj.period.split(" - ")
                    if len(parts) == 2:
                        start_str, end_str = parts
                        
                        # Parse start date
                        try:
                            start_date = datetime.strptime(start_str, "%b %Y").replace(tzinfo=timezone.utc)
                        except ValueError:
                            # Try other formats if needed
                            pass
                        
                        # Parse end date (handle "Present" and "Ongoing")
                        if end_str.lower() not in ["present", "ongoing"]:
                            try:
                                end_date = datetime.strptime(end_str, "%b %Y").replace(tzinfo=timezone.utc)
                            except ValueError:
                                # Try other formats if needed
                                pass
                        # If end_str is "Present" or "Ongoing", end_date remains None
            except Exception:
                # If parsing fails, continue without dates
                pass
        
        project = member_model.MemberProject(
            member_id=member_id,
            project_name=proj.name,
            description="; ".join(proj.description),  # Join descriptions into a single string - kept for backward compatibility
            project_type=proj.project_type,         # New project type field
            tools=proj.tools,                      # New tools field
            role=proj.role or proj.company,        # Use new role field or fallback to company
            responsibilities=proj.responsibilities, # New responsibilities field
            outcomes=proj.outcomes,                # New outcomes field
            start_date=start_date,
            end_date=end_date
        )
        await member_crud.create_member_project(project)

# ROUTERS -------------------------------------------------------------

@router.post("/resume/submit")
async def submit_resume(resume_data: ResumeFormRequest):
    """
    Submit a resume form - no authentication required
    Creates a Member document and related Work Experience, Education, and Project documents
    """
    print("backend -- Received resume data:", resume_data)
    try:
        # create or reuse user with resume form data
        user = None
        if resume_data.email:
            from app.crud.user_crud import UserCRUD
            existing_user = await UserCRUD.get_user_by_email(resume_data.email)
            if existing_user:
                user = existing_user
            else:
                user = await resume_services.create_user_with_resume_form_and_send_welcome_email(
                    mail=resume_data.email, name=resume_data.name
                )

        user_id = str(getattr(user, "id", None)) if getattr(user, "id", None) is not None else None
        print("backend -- User created with ID:", user_id)

        # Convert birthdate string to datetime if provided
        birthdate_obj = None
        if resume_data.birthdate:
            try:
                birthdate_obj = datetime.strptime(resume_data.birthdate, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid birthdate format. Use YYYY-MM-DD")
        
        # Create member object (only with fields that belong to Member)
        member = member_model.Member(
            name=resume_data.name,
            user_id=user_id,
            professional_title=resume_data.professional_title,
            birthdate=birthdate_obj,
            sex=resume_data.sex,
            city=resume_data.city,
            email=resume_data.email,
            phone=resume_data.phone,
            image=resume_data.image,
            relocateToSyria=resume_data.relocateToSyria,
            bio=resume_data.bio,
            skills=resume_data.skills or [],
            interests=resume_data.interests or [],
            social_media=resume_data.social_media or {}
        )
        
        # Save member to database
        created_member = await member_crud.create_resume_member(member)
        member_id = str(created_member.id)
        
        # Create related documents if data exists
        if resume_data.works:
            await create_work_experiences(member_id, resume_data.works)
        
        if resume_data.academic:
            await create_education_entries(member_id, resume_data.academic)
            
        if resume_data.projects:
            await create_project_entries(member_id, resume_data.projects)
        
        print("backend -- Resume submitted successfully for member:", resume_data.name)
        
        return {
            "message": "Resume submitted successfully",
            "member_id": member_id,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit resume: {str(e)}")

@router.get("/resumes")
async def get_all_resumes():
    """
    Get all submitted resumes
    Returns basic member information for all members
    """
    try:
        members = await member_crud.get_all_members_from_all_teams()
        return members
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve resumes: {str(e)}")

@router.get("/resume/{member_id}")
async def get_resume_by_member_id(member_id: str):
    """Get a complete resume by member ID with normalized description fields."""
    from bson.errors import InvalidId
    try:
        obj_id = ObjectId(member_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail="Invalid member_id format")

    try:
        member = await member_crud.get_member_by_member_id(obj_id)
        if not member:
            member = await member_crud.get_member_by_user_id(member_id) # perhaps a user_id was provided
            obj_id = ObjectId(member.id) if member else None
            if not member:
                raise HTTPException(status_code=404, detail="Resume not found")

        work_experiences = await member_crud.get_all_work_experiences_by_member_id(obj_id)
        education = await member_crud.get_all_educations_by_member_id(obj_id)
        projects = await member_crud.get_all_projects_by_member_id(obj_id)

        def _split_legacy(desc: str):
            if not desc:
                return []
            # legacy stored either "; " joined or newlines
            parts = [p.strip() for p in desc.replace("\n", "; ").split("; ") if p.strip()]
            return parts

        # Produce normalized copies (avoid mutating DB objects)
        normalized_work = []
        for w in work_experiences:
            d = w.model_dump() if hasattr(w, "model_dump") else w.dict()
            d["description_list"] = _split_legacy(d.get("description", ""))
            normalized_work.append(d)

        normalized_projects = []
        for p in projects:
            d = p.model_dump() if hasattr(p, "model_dump") else p.dict()
            d["description_list"] = _split_legacy(d.get("description", ""))
            normalized_projects.append(d)

        return {
            "member": member,
            "work_experiences": normalized_work,
            "education": education,
            "projects": normalized_projects,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve resume: {e}")

@router.get("/resume/by-user-id/{user_id}")
async def get_resume_by_user_id(user_id: str):
    """Get a complete resume by user ID with normalized description fields."""
    try:
        member = await member_crud.get_member_by_user_id(user_id)
        if not member:
            raise HTTPException(status_code=404, detail="Resume not found")

        member_id = str(member.id)
        obj_id = ObjectId(member_id)

        work_experiences = await member_crud.get_all_work_experiences_by_member_id(obj_id)
        education = await member_crud.get_all_educations_by_member_id(obj_id)
        projects = await member_crud.get_all_projects_by_member_id(obj_id)

        def _split_legacy(desc: str):
            if not desc:
                return []
            parts = [p.strip() for p in desc.replace("\n", "; ").split("; ") if p.strip()]
            return parts

        normalized_work = []
        for w in work_experiences:
            d = w.model_dump() if hasattr(w, "model_dump") else w.dict()
            d["description_list"] = _split_legacy(d.get("description", ""))
            normalized_work.append(d)

        normalized_projects = []
        for p in projects:
            d = p.model_dump() if hasattr(p, "model_dump") else p.dict()
            d["description_list"] = _split_legacy(d.get("description", ""))
            normalized_projects.append(d)

        return {
            "member": member,
            "work_experiences": normalized_work,
            "education": education,
            "projects": normalized_projects,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve resume by user id: {e}")


@router.put("/resume/{member_id}")
async def update_resume(member_id: str, resume_data: ResumeFormRequest, current_user: User = Depends(auth_services.get_current_user)):
    """
    Update an existing resume
    Updates member data and replaces all related work experience, education, and project documents
    """
    try:
        # Get existing member
        existing_member = await member_crud.get_member_by_member_id(ObjectId(member_id))
        if not existing_member:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Convert birthdate string to datetime if provided
        birthdate_obj = None
        if resume_data.birthdate:
            try:
                birthdate_obj = datetime.strptime(resume_data.birthdate, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid birthdate format. Use YYYY-MM-DD")
        
        # Authorization: only owner (linked by user_id) or admin can update
        if existing_member.user_id and str(existing_member.user_id) != str(current_user.id) and current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized to modify this resume")

        # Update member fields
        existing_member.name = resume_data.name
        existing_member.professional_title = resume_data.professional_title
        existing_member.birthdate = birthdate_obj
        existing_member.sex = resume_data.sex
        existing_member.city = resume_data.city
        existing_member.email = resume_data.email
        existing_member.phone = resume_data.phone
        existing_member.image = resume_data.image
        existing_member.relocateToSyria = resume_data.relocateToSyria
        existing_member.bio = resume_data.bio
        existing_member.skills = resume_data.skills or []
        existing_member.interests = resume_data.interests or []
        existing_member.social_media = resume_data.social_media or {}
        existing_member.updated_at = datetime.now(timezone.utc)
        
        # Save updated member
        await existing_member.replace()
        
        # Delete existing related documents using CRUD functions
        await member_crud.delete_all_work_experiences_by_member_id(member_id)
        await member_crud.delete_all_educations_by_member_id(member_id)
        await member_crud.delete_all_projects_by_member_id(member_id)
        
        # Create new related documents
        if resume_data.works:
            await create_work_experiences(member_id, resume_data.works)
        
        if resume_data.academic:
            await create_education_entries(member_id, resume_data.academic)
            
        if resume_data.projects:
            await create_project_entries(member_id, resume_data.projects)
        
        return {
            "message": "Resume updated successfully",
            "member_id": member_id,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update resume: {str(e)}")

@router.delete("/resume/{member_id}")
async def delete_resume(member_id: str):
    """
    Delete a resume and all its related documents
    """
    try:
        # Delete member
        deleted_member = await member_crud.delete_member(ObjectId(member_id))
        if not deleted_member:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Delete all related documents using CRUD functions
        await member_crud.delete_all_work_experiences_by_member_id(member_id)
        await member_crud.delete_all_educations_by_member_id(member_id)
        await member_crud.delete_all_projects_by_member_id(member_id)
        
        return {
            "message": "Resume deleted successfully",
            "member_id": member_id,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete resume: {str(e)}")

# Public endpoint for getting skills for the resume form
@router.get("/members/skills", response_model=List[str])
async def get_public_skills():
    """
    Get all unique skills from all members - public endpoint for resume form
    No authentication required
    """
    try:
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
        
    except Exception as e:
        # Return empty list on error to prevent form breakage
        import logging
        logging.error(f"Error fetching skills: {e}")
        return []

# Public endpoint for getting interests for the resume form
@router.get("/members/interests", response_model=List[str])
async def get_public_interests():
    """
    Get all unique interests from all members - public endpoint for resume form
    No authentication required
    """
    try:
        # Get all members
        members = await member_crud.get_all_members_from_all_teams()
        
        # Collect all interests
        all_interests = set()
        for member in members:
            if member.interests:
                for interest in member.interests:
                    if interest and interest.strip():  # Only add non-empty interests
                        all_interests.add(interest.strip())
        
        # Return sorted list of unique interests
        return sorted(list(all_interests))
        
    except Exception as e:
        # Return empty list on error to prevent form breakage
        import logging
        logging.error(f"Error fetching interests: {e}")
        return []