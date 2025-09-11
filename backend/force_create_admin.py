"""
Script to force recreate admin user
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.user_model import User
from app.services.auth_services import get_password_hash

async def create_admin_user():
    try:
        # Initialize database connection
        mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://db:27017/guofsyrians_db')
        client = AsyncIOMotorClient(mongodb_uri)
        
        # Extract database name from URI or use default
        from urllib.parse import urlparse
        parsed = urlparse(mongodb_uri)
        db_name = parsed.path.strip("/") if parsed.path and parsed.path.strip("/") else "guofsyrians_db"
        
        db = client[db_name]
        print(f"Using database: {db_name}")
        
        # Initialize beanie
        await init_beanie(database=db, document_models=[User])
        
        # Delete existing admin user if exists
        existing_admin = await User.find_one(User.email == "admin@guofsyrians.com")
        if existing_admin:
            await existing_admin.delete()
            print("🗑️  Deleted existing admin user")
        
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
        print("✅ Admin user created successfully!")
        print("📧 Email: admin@guofsyrians.com")
        print("🔑 Password: admin123")
        print("⚠️  IMPORTANT: Change the password after first login!")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    asyncio.run(create_admin_user())
