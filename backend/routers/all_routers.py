from fastapi import APIRouter

from routers import team_routers, member_routers, auth_routers, resume_routers, mail_router

router = APIRouter()

router.include_router(auth_routers.router, tags=["Authentication"])
router.include_router(team_routers.router, tags=["Team"])
router.include_router(member_routers.router, tags=["Member"])
router.include_router(resume_routers.router, tags=["Resume"])
router.include_router(mail_router.router, tags=["Mail"])