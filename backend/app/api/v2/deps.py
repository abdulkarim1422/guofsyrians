from fastapi import Depends, HTTPException, status
from app.services import auth_services
from app.models.user_model import User


async def get_current_user(user: User = Depends(auth_services.get_current_user)) -> User:
    return user


async def get_admin_user(user: User = Depends(get_current_user)) -> User:
    if getattr(user, "role", None) != "admin" and not getattr(user, "is_admin", False):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    return user
