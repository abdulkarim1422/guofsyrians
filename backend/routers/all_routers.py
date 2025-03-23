from fastapi import APIRouter

from routers import team_routers, member_routers

router = APIRouter()

router.include_router(team_routers.router, tags=["Team"])
router.include_router(member_routers.router, tags=["Member"])
