"""
Script to create an admin user for the GuofSyrians application
Run this script to create your first admin user
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models.user_model import User
from services.auth_services import get_password_hash

async def create_admin_user():
    # Initialize database connection
    client = AsyncIOMotorClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017'))
    db = client.guofsyrians_db
    
    # Initialize beanie
    await init_beanie(database=db, document_models=[User])
    
    # Check if admin already exists
    existing_admin = await User.find_one(User.email == "admin@guofsyrians.com")
    if existing_admin:
        print("Admin user already exists!")
        return
    
    # Create admin user
    admin_user = User(
        email="admin@guofsyrians.com",
        password=get_password_hash("admin123"),  # Change this password!
        name="Admin User",
        role="admin",
        is_active=True,
        is_verified=True
    )
    
    await admin_user.save()
    print("Admin user created successfully!")
    print("Email: admin@guofsyrians.com")
    print("Password: admin123")
    print("⚠️  IMPORTANT: Change the password after first login!")

if __name__ == "__main__":
    asyncio.run(create_admin_user())
