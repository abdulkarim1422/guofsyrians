from typing import Optional, List
from bson import ObjectId
from app.models.user_model import User
from app.schemas.auth_schemas import UserCreate, UserUpdate
from app.services.auth_services import get_password_hash
from fastapi import HTTPException, status
from datetime import datetime, timezone

class UserCRUD:
    
    @staticmethod
    async def create_user(user_data: UserCreate) -> User:
        """Create a new user"""
        # Check if user already exists
        existing_user = await User.find_one(User.email == user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user
        user = User(
            email=user_data.email,
            password=hashed_password,
            name=user_data.name,
            role=user_data.role
        )
        
        await user.save()
        return user
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[User]:
        """Get user by ID"""
        if not ObjectId.is_valid(user_id):
            return None
        return await User.get(ObjectId(user_id))
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        """Get user by email"""
        return await User.find_one(User.email == email)
    
    @staticmethod
    async def get_all_users(skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination"""
        return await User.find_all().skip(skip).limit(limit).to_list()
    
    @staticmethod
    async def update_user(user_id: str, user_data: UserUpdate) -> Optional[User]:
        """Update user by ID"""
        if not ObjectId.is_valid(user_id):
            return None
            
        user = await User.get(ObjectId(user_id))
        if not user:
            return None
        
        # Update fields
        update_data = user_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        user.updated_at = datetime.now(timezone.utc)
        await user.save()
        return user
    
    @staticmethod
    async def delete_user(user_id: str) -> bool:
        """Delete user by ID"""
        if not ObjectId.is_valid(user_id):
            return False
            
        user = await User.get(ObjectId(user_id))
        if not user:
            return False
        
        await user.delete()
        return True
    
    @staticmethod
    async def update_password(user: User, new_password: str) -> User:
        """Update user password"""
        hashed_password = get_password_hash(new_password)
        user.password = hashed_password
        user.updated_at = datetime.now(timezone.utc)
        await user.save()
        return user
    
    @staticmethod
    async def verify_user(user_id: str) -> Optional[User]:
        """Verify a user account"""
        if not ObjectId.is_valid(user_id):
            return None
            
        user = await User.get(ObjectId(user_id))
        if not user:
            return None
        
        user.is_verified = True
        user.updated_at = datetime.now(timezone.utc)
        await user.save()
        return user
    
    @staticmethod
    async def deactivate_user(user_id: str) -> Optional[User]:
        """Deactivate a user account"""
        if not ObjectId.is_valid(user_id):
            return None
            
        user = await User.get(ObjectId(user_id))
        if not user:
            return None
        
        user.is_active = False
        user.updated_at = datetime.now(timezone.utc)
        await user.save()
        return user

# Legacy functions for backward compatibility
async def create_user(user) -> User:
    await user.insert()
    return user

async def get_user_by_id(user_id: ObjectId) -> User:
    return await User.get(user_id)

async def update_user(user_id: ObjectId, user: User) -> User:
    existing = await User.get(user_id)
    if not existing:
        return None
    user.id = existing.id
    return await user.replace()

async def delete_user(user_id: ObjectId) -> User:
    user = await User.get(user_id)
    if user:
        await user.delete()
        return user
    return None

async def get_users() -> list:
    return await User.find({}).to_list()

async def get_user_by_email(email: str) -> User:
    return await User.find_one({"email": email})

async def get_user_by_username(username: str) -> User:
    return await User.find_one({"username": username})