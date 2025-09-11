from datetime import datetime, timezone
from beanie import Document
from pydantic import BaseModel, Field
from bson import ObjectId
from typing import List, Dict, Optional

class Member(Document):
    name: str
    user_id: Optional[str] = None  # Made optional for standalone resumes # TODO: make it required
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ar_name: Optional[str] = None
    team_id: Optional[str] = None  # Made optional for standalone resumes # TODO: add teams
    membership_number: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    sex: str # male, female
    birthdate: Optional[datetime] = None
    nationality: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    bio: Optional[str] = None
    professional_title: Optional[str] = None # e.g., Software Engineer, Mechanical Engineer, Doctor
    skills: Optional[List[str]] = Field(default_factory=list)
    interests: Optional[List[str]] = Field(default_factory=list)
    social_media: Dict[str, str] = Field(default={})
    image: Optional[str] = None
    relocateToSyria: Optional[str] = None
    # Removed works, academic, projects fields to avoid duplication

class MemberWorkExperience(Document):
    member_id: str
    job_title: str # e.g., Full Stack Developer, Mechanical Designer, Data Scientist
    company: str
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    responsibilities: Optional[str] = None  # Mandatory responsibilities field
    achievements: Optional[str] = None      # Optional achievements field
    # Kept description for backward compatibility, will be migrated to responsibilities
    description: Optional[str] = None

class MemberProject(Document):
    member_id: str
    project_name: str
    project_type: Optional[str] = None      # Personal, Professional, Academic, Open Source, etc.
    tools: Optional[List[str]] = Field(default_factory=list)  # Technologies/tools used
    role: Optional[str] = None              # Role in the project
    responsibilities: Optional[str] = None   # What the member did
    outcomes: Optional[str] = None          # Results/achievements
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    # Kept description for backward compatibility, will be migrated to responsibilities/outcomes
    description: Optional[str] = None

class MemberEducation(Document):
    member_id: str
    institution: str
    degree: str # e.g., Bachelor, Master, PhD
    field_of_study: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    grade: Optional[str] = None
    gpa: Optional[float] = None             # GPA on 4.0 scale
    rank: Optional[str] = None              # Academic honors/rank
    academic_standing: Optional[str] = None # e.g., 1, 2, graduate
