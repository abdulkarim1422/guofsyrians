from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.services import auth_services
from app.models.user_model import User
from datetime import timedelta
from app.core.settings import get_settings

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    user = await auth_services.authenticate_user(payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    settings = get_settings()
    expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = auth_services.create_access_token(subject=user.email, expires_delta=expires)
    return TokenResponse(access_token=token, expires_in=int(expires.total_seconds()))


class UserOut(BaseModel):
    id: str
    email: str
    name: str | None = None
    role: str | None = None

    @classmethod
    def from_model(cls, u: User):
        return cls(id=str(u.id), email=u.email, name=getattr(u, "name", None), role=getattr(u, "role", None))


@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(auth_services.get_current_user)):
    return UserOut.from_model(user)
