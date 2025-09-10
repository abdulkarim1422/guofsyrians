# app/routers/jobs.py
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
import logging

from app.models.job import Job
from app.schemas.job import JobCreate, JobOut, JobUpdate
from app.services.auth_services import get_admin_user, get_current_user

logger = logging.getLogger("guof-backend")

router = APIRouter(prefix="/jobs", tags=["jobs"])

# --- Helpers ---
def _to_list(v):
    """للاستجابة: رجّع دائمًا List[str] سواء المخزن نص أو قائمة"""
    if v is None:
        return []
    if isinstance(v, list):
        return [str(i).strip() for i in v if str(i).strip()]
    return [line.strip() for line in str(v).splitlines() if line.strip()]

def _list_to_string(v) -> str:
    """للتخزين: حوّل أي قيمة (List/str/None) إلى نص متعدد الأسطر"""
    if v is None:
        return ""
    if isinstance(v, list):
        return "\n".join(s for s in (str(i).strip() for i in v) if s)
    return str(v)

def dump_job(doc: Job) -> dict:
    # إلى dict
    try:
        data = doc.model_dump()
    except Exception:
        data = doc.dict()

    # id كسلسلة
    try:
        data["id"] = str(doc.id)
    except Exception:
        pass

    data.pop("revision_id", None)

    # نرجّع للفرونت قوائم دائمًا
    data["responsibilities"] = _to_list(data.get("responsibilities"))
    data["requirements"]     = _to_list(data.get("requirements"))
    data["benefits"]         = _to_list(data.get("benefits"))
    return data

# --- Routes ---

# إنشاء وظيفة: أدمن فقط
@router.post("/", response_model=JobOut)
async def create_job(payload: JobCreate, admin=Depends(get_admin_user)):
    try:
        body = payload.model_dump()
        # تطبيع للتخزين (حتى لو الواجهة أرسلت Array)
        for k in ("responsibilities", "requirements", "benefits"):
            body[k] = _list_to_string(body.get(k))

        job = Job(**body, owner_id=str(admin.id))
        await job.insert()
        return dump_job(job)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("create_job failed")
        raise HTTPException(status_code=500, detail=f"create_job error: {e}")

# عرض الوظائف (عام) — يدعم: الكل/نشطة/غير نشطة
@router.get("/", response_model=List[JobOut])
async def list_jobs(
    q: str = "",
    is_active: Optional[bool] = None,             # ← صارت اختيارية
    limit: Optional[int] = Query(None, ge=1, le=100),
):
    query = {}
    if is_active is not None:                      # ← فلترة عند التمرير فقط
        query["is_active"] = is_active
    if q:
        query["title"] = {"$regex": q, "$options": "i"}

    cur = Job.find(query).sort(-Job.created_at)
    if limit:
        cur = cur.limit(limit)

    jobs = await cur.to_list()
    return [dump_job(j) for j in jobs]

# جلب وظيفة واحدة (عام)
@router.get("/{job_id}", response_model=JobOut)
async def get_job(job_id: str):
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return dump_job(job)

# (قبول السلاش الأخيرة)
@router.get("/{job_id}/", response_model=JobOut)
async def get_job_trailing(job_id: str):
    return await get_job(job_id)

# تحديث: أدمن أو مالك الإعلان
@router.patch("/{job_id}", response_model=JobOut)
async def update_job(job_id: str, payload: JobUpdate, user=Depends(get_current_user)):
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    is_admin = bool(getattr(user, "is_admin", False))
    is_owner = (str(user.id) == job.owner_id)
    if not (is_admin or is_owner):
        raise HTTPException(status_code=403, detail="Admins or owner only")

    update_data = payload.model_dump(exclude_unset=True)
    # تطبيع للتخزين
    for k in ("responsibilities", "requirements", "benefits"):
        if k in update_data:
            update_data[k] = _list_to_string(update_data[k])

    for k, v in update_data.items():
        setattr(job, k, v)
    await job.save()
    return dump_job(job)

# (قبول السلاش الأخيرة)
@router.patch("/{job_id}/", response_model=JobOut)
async def update_job_trailing(job_id: str, payload: JobUpdate, user=Depends(get_current_user)):
    return await update_job(job_id, payload, user)

# حذف: أدمن أو مالك الإعلان
@router.delete("/{job_id}", status_code=204)
async def delete_job(job_id: str, user=Depends(get_current_user)):
    job = await Job.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    is_admin = bool(getattr(user, "is_admin", False))
    is_owner = (str(user.id) == job.owner_id)
    if not (is_admin or is_owner):
        raise HTTPException(status_code=403, detail="Admins or owner only")

    await job.delete()

# (قبول السلاش الأخيرة)
@router.delete("/{job_id}/", status_code=204)
async def delete_job_trailing(job_id: str, user=Depends(get_current_user)):
    return await delete_job(job_id, user)
