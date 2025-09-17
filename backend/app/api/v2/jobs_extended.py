"""Enhanced jobs API with create/update endpoints for v2."""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel

from app.models.job import Job
from app.repositories.jobs_repository import serialize_job
from app.api.v2.deps import get_admin_user, get_current_user

router = APIRouter()


class JobCreateRequest(BaseModel):
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    employment_type: str = "full_time"
    workplace_type: str = "onsite"
    description: Optional[str] = None
    responsibilities: List[str] = []
    requirements: List[str] = []
    benefits: List[str] = []
    application_url: Optional[str] = None
    max_applicants: int = 0
    is_active: bool = True


class JobUpdateRequest(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    workplace_type: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    requirements: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    application_url: Optional[str] = None
    max_applicants: Optional[int] = None
    is_active: Optional[bool] = None


@router.get("")
async def list_jobs_v2(
    q: str = "",
    is_active: Optional[bool] = None,
    limit: int = Query(25, ge=1, le=100)
):
    """List jobs with normalized array responses."""
    query = {}
    if is_active is not None:
        query["is_active"] = is_active
    if q:
        query["title"] = {"$regex": q, "$options": "i"}
    
    cur = Job.find(query).sort(-Job.created_at).limit(limit)
    docs = await cur.to_list()
    return [serialize_job(d) for d in docs]


@router.post("")
async def create_job_v2(payload: JobCreateRequest, admin = Depends(get_admin_user)):
    """Create new job (admin only)."""
    try:
        # Convert lists to strings for storage (legacy compatibility)
        def _list_to_string(v):
            if v is None:
                return ""
            if isinstance(v, list):
                return "\n".join(s for s in (str(i).strip() for i in v) if s)
            return str(v)
        
        job_data = {
            "title": payload.title,
            "company": payload.company,
            "location": payload.location,
            "employment_type": payload.employment_type,
            "workplace_type": payload.workplace_type,
            "description": payload.description or "",
            "responsibilities": _list_to_string(payload.responsibilities),
            "requirements": _list_to_string(payload.requirements),
            "benefits": _list_to_string(payload.benefits),
            "application_url": payload.application_url,
            "max_applicants": payload.max_applicants,
            "is_active": payload.is_active,
            "owner_id": str(admin.id),
        }
        
        job = Job(**job_data)
        await job.insert()
        return serialize_job(job)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job creation failed: {str(e)}")


@router.get("/{job_id}")
async def get_job_v2(job_id: str):
    """Get single job by ID."""
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return serialize_job(job)


@router.patch("/{job_id}")
async def update_job_v2(job_id: str, payload: JobUpdateRequest, user = Depends(get_current_user)):
    """Update job (admin or owner only)."""
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check permissions
    is_admin = getattr(user, "is_admin", False) or getattr(user, "role", "") == "admin"
    is_owner = str(user.id) == job.owner_id
    
    if not (is_admin or is_owner):
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # Apply updates
    def _list_to_string(v):
        if v is None:
            return None
        if isinstance(v, list):
            return "\n".join(s for s in (str(i).strip() for i in v) if s)
        return str(v)
    
    update_data = payload.model_dump(exclude_unset=True)
    
    for field in ["responsibilities", "requirements", "benefits"]:
        if field in update_data:
            update_data[field] = _list_to_string(update_data[field])
    
    for key, value in update_data.items():
        setattr(job, key, value)
    
    await job.save()
    return serialize_job(job)


@router.delete("/{job_id}")
async def delete_job_v2(job_id: str, user = Depends(get_current_user)):
    """Delete job (admin or owner only)."""
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check permissions
    is_admin = getattr(user, "is_admin", False) or getattr(user, "role", "") == "admin"
    is_owner = str(user.id) == job.owner_id
    
    if not (is_admin or is_owner):
        raise HTTPException(status_code=403, detail="Permission denied")
    
    await job.delete()
    return {"message": "Job deleted successfully"}
