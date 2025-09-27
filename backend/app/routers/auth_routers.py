from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List

from app.schemas.auth_schemas import (
    UserCreate, UserLogin, UserResponse, Token, 
    PasswordUpdate, UserUpdate, ChangePasswordViaAdmin
)
from app.crud.user_crud import UserCRUD
from app.services.auth_services import (
    authenticate_user, create_access_token, get_current_active_user,
    get_admin_user, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.models.user_model import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        user = await UserCRUD.create_user(user_data)
        return UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            role=user.role,
            is_active=user.is_active,
            is_verified=user.is_verified
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user and return access token"""
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user account"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        role=user.role,
        is_active=user.is_active,
        is_verified=user.is_verified
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@router.post("/login-json", response_model=Token)
async def login_with_json(user_login: UserLogin):
    """Login user with JSON data and return access token"""
    user = await authenticate_user(user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user account"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        role=user.role,
        is_active=user.is_active,
        is_verified=user.is_verified
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified
    )

@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update current user information"""
    updated_user = await UserCRUD.update_user(str(current_user.id), user_update)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(updated_user.id),
        email=updated_user.email,
        name=updated_user.name,
        role=updated_user.role,
        is_active=updated_user.is_active,
        is_verified=updated_user.is_verified
    )

@router.put("/change-password")
async def change_password(
    password_data: PasswordUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Change user password"""
    # Verify current password
    if not verify_password(password_data.current_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    # Update password
    await UserCRUD.update_password(current_user, password_data.new_password)
    return {"message": "Password updated successfully"}

@router.put("/change-password-via-admin")
async def change_password_via_admin(
    password_data: ChangePasswordViaAdmin,
    admin_user: User = Depends(get_admin_user)
):
    """Change user password (Admin only)"""
    user = await UserCRUD.get_user_by_id(password_data.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Update password
    await UserCRUD.update_password(user, password_data.new_password)
    return {"message": "Password updated successfully"}

# Admin routes
@router.post("/admin/users", response_model=UserResponse)
async def create_user_by_admin(
    user_data: UserCreate,
    admin_user: User = Depends(get_admin_user)
):
    """Create a new user (Admin only)"""
    try:
        user = await UserCRUD.create_user(user_data)
        return UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            role=user.role,
            is_active=user.is_active,
            is_verified=user.is_verified
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    admin_user: User = Depends(get_admin_user)
):
    """Get all users (Admin only)"""
    users = await UserCRUD.get_all_users(skip=skip, limit=limit)
    return [
        UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            role=user.role,
            is_active=user.is_active,
            is_verified=user.is_verified
        ) for user in users
    ]

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    admin_user: User = Depends(get_admin_user)
):
    """Get user by ID (Admin only)"""
    user = await UserCRUD.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        role=user.role,
        is_active=user.is_active,
        is_verified=user.is_verified
    )

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user_by_id(
    user_id: str,
    user_update: UserUpdate,
    admin_user: User = Depends(get_admin_user)
):
    """Update user by ID (Admin only)"""
    updated_user = await UserCRUD.update_user(user_id, user_update)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(updated_user.id),
        email=updated_user.email,
        name=updated_user.name,
        role=updated_user.role,
        is_active=updated_user.is_active,
        is_verified=updated_user.is_verified
    )

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    admin_user: User = Depends(get_admin_user)
):
    """Delete user by ID (Admin only)"""
    success = await UserCRUD.delete_user(user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User deleted successfully"}

@router.put("/users/{user_id}/verify")
async def verify_user(
    user_id: str,
    admin_user: User = Depends(get_admin_user)
):
    """Verify user account (Admin only)"""
    user = await UserCRUD.verify_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User verified successfully"}

@router.put("/users/{user_id}/deactivate")
async def deactivate_user(
    user_id: str,
    admin_user: User = Depends(get_admin_user)
):
    """Deactivate user account (Admin only)"""
    user = await UserCRUD.deactivate_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User deactivated successfully"}
