from fastapi import APIRouter

# Routers (استورد كل Router بالاسم)
from .auth_routers import router as auth_router
from .team_routers import router as team_router
from .member_routers import router as member_router
from .resume_routers import router as resume_router
from .mail_router import router as mail_router

from .jobs import router as jobs_router
from .applications import router as applications_router

router = APIRouter()

# سمّات للوضوح في الـ docs فقط
router.include_router(auth_router, tags=["Authentication"])
router.include_router(team_router, tags=["Team"])
router.include_router(member_router, tags=["Member"])
router.include_router(resume_router, tags=["Resume"])
router.include_router(mail_router, tags=["Mail"])

# مهم: ضُمّ وظائف وطلبات التوظيف مرة واحدة فقط
router.include_router(jobs_router, tags=["Jobs"])
router.include_router(applications_router, tags=["Applications"])
