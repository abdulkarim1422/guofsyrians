from fastapi import APIRouter, Query
from typing import Optional, List
from app.models.job import Job
from app.repositories.jobs_repository import serialize_job

router = APIRouter()


def _to_list(v):
    if v is None: return []
    if isinstance(v, list): return [str(i).strip() for i in v if str(i).strip()]
    # legacy multiline string
    return [line.strip() for line in str(v).splitlines() if line.strip()]


@router.get("", response_model=List[dict])
async def list_jobs_v2(q: str = "", is_active: Optional[bool] = None, limit: int = Query(25, ge=1, le=100)):
    query = {}
    if is_active is not None:
        query["is_active"] = is_active
    if q:
        query["title"] = {"$regex": q, "$options": "i"}
    cur = Job.find(query).sort(-Job.created_at).limit(limit)
    docs = await cur.to_list()
    return [serialize_job(d) for d in docs]
