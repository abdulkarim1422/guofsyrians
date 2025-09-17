from fastapi import APIRouter
from . import auth, health, jobs, resumes, resumes_extended, jobs_extended

api_v2_router = APIRouter()

api_v2_router.include_router(auth.router, tags=["v2-auth"], prefix="/auth")
api_v2_router.include_router(health.router, tags=["v2-health"])
api_v2_router.include_router(jobs.router, tags=["v2-jobs"], prefix="/jobs")
api_v2_router.include_router(jobs_extended.router, tags=["v2-jobs-ext"], prefix="/jobs")
api_v2_router.include_router(resumes.router, tags=["v2-resumes"], prefix="/resumes")
api_v2_router.include_router(resumes_extended.router, tags=["v2-resumes-ext"], prefix="/resume")
