from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.models.application import Application
from app.models.job import Job
from app.schemas.application import ApplicationCreate, ApplicationOut
from app.services.auth_services import get_current_active_user, get_admin_user

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("/jobs/{job_id}", response_model=ApplicationOut)
async def apply_to_job(job_id: str, payload: ApplicationCreate, user=Depends(get_current_active_user)):
    job = await Job.get(job_id)
    if not job or not job.is_active:
        raise HTTPException(status_code=404, detail="Job not available")

    # منع التقديم المكرر
    exists = await Application.find_one({"job_id": job_id, "user_id": str(user.id)})
    if exists:
        raise HTTPException(status_code=400, detail="Already applied")

    app = Application(job_id=job_id, user_id=str(user.id), **payload.model_dump(exclude_unset=True))
    await app.insert()
    
    # Use model_dump() to properly serialize with string IDs
    return ApplicationOut(
        id=str(app.id),
        job_id=app.job_id,
        user_id=app.user_id,
        cover_letter=app.cover_letter,
        resume_url=app.resume_url,
        status=app.status,
        created_at=app.created_at
    )

@router.get("/admin", response_model=List[ApplicationOut])
async def list_applications_admin(
    job_id: Optional[str] = Query(None),
    admin=Depends(get_admin_user)
):
    query = {}
    if job_id:
        query["job_id"] = job_id
    apps = await Application.find(query).sort(-Application.created_at).to_list()
    
    # Convert to ApplicationOut with proper string IDs
    return [
        ApplicationOut(
            id=str(app.id),
            job_id=app.job_id,
            user_id=app.user_id,
            cover_letter=app.cover_letter,
            resume_url=app.resume_url,
            status=app.status,
            created_at=app.created_at
        )
        for app in apps
    ]
