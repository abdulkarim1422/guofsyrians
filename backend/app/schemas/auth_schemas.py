from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Literal

VALID_ROLES = ["member", "admin", "team_leader", "employer", "sub_admin"]

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Literal["member", "admin", "team_leader", "employer", "sub_admin"] = "member"
    
    @validator('role')
    def validate_role(cls, v):
        if v not in VALID_ROLES:
            raise ValueError(f'Role must be one of: {", ".join(VALID_ROLES)}')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    is_active: bool
    is_verified: bool

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

class PasswordReset(BaseModel):
    email: EmailStr

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[Literal["member", "admin", "team_leader", "employer", "sub_admin"]] = None
    is_active: Optional[bool] = None
    
    @validator('role')
    def validate_role(cls, v):
        if v is not None and v not in VALID_ROLES:
            raise ValueError(f'Role must be one of: {", ".join(VALID_ROLES)}')
        return v
