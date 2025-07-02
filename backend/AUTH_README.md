# JWT Authentication System for GuofSyrians Backend

This document describes the complete JWT authentication system implemented for your FastAPI application.

## Overview

The authentication system provides:
- User registration and login
- JWT token-based authentication
- Role-based access control (member, team_leader, admin)
- Password hashing with bcrypt
- User management endpoints
- Admin-only operations

## Features

### 🔐 Authentication Features
- **JWT Token Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt hashing for secure password storage
- **Role-based Access Control**: Different permission levels
- **Email Validation**: Proper email format validation
- **User Status Management**: Active/inactive and verified/unverified users

### 👤 User Roles
- **member**: Basic user role (default)
- **team_leader**: Team management permissions
- **admin**: Full system access

## API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Register User
```
POST /api/auth/register
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "member"
}
```

#### 2. Login (OAuth2 Form)
```
POST /api/auth/login
```
**Form Data:**
- `username`: email
- `password`: password

#### 3. Login (JSON)
```
POST /api/auth/login-json
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Protected Endpoints (Authentication Required)

#### 4. Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

#### 5. Update Current User
```
PUT /api/auth/me
Authorization: Bearer <token>
```
**Body:**
```json
{
  "name": "Updated Name",
  "role": "team_leader"
}
```

#### 6. Change Password
```
PUT /api/auth/change-password
Authorization: Bearer <token>
```
**Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword"
}
```

### Admin Only Endpoints

#### 7. Get All Users
```
GET /api/auth/users?skip=0&limit=100
Authorization: Bearer <admin_token>
```

#### 8. Get User by ID
```
GET /api/auth/users/{user_id}
Authorization: Bearer <admin_token>
```

#### 9. Update User by ID
```
PUT /api/auth/users/{user_id}
Authorization: Bearer <admin_token>
```

#### 10. Delete User
```
DELETE /api/auth/users/{user_id}
Authorization: Bearer <admin_token>
```

#### 11. Verify User Account
```
PUT /api/auth/users/{user_id}/verify
Authorization: Bearer <admin_token>
```

#### 12. Deactivate User Account
```
PUT /api/auth/users/{user_id}/deactivate
Authorization: Bearer <admin_token>
```

## Setup Instructions

### 1. Environment Variables
Create a `.env` file (copy from `.env.example`):
```bash
MONGODB_URI=mongodb://localhost:27017
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Create Admin User
```bash
python create_admin.py
```
This creates an admin user:
- Email: `admin@guofsyrians.com`
- Password: `admin123`
- **⚠️ Change this password after first login!**

### 4. Start the Server
```bash
uvicorn app.main:app --reload
```

## Usage Examples

### 1. Register a New User
```bash
curl -X POST "http://localhost:8222/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword",
    "name": "John Doe",
    "role": "member"
  }'
```

### 2. Login and Get Token
```bash
curl -X POST "http://localhost:8222/api/auth/login-json" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

### 3. Access Protected Endpoint
```bash
curl -X GET "http://localhost:8222/api/auth/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Features

### 🔒 Password Security
- Passwords are hashed using bcrypt
- Minimum security standards enforced
- Original passwords are never stored

### 🎫 JWT Token Security
- Tokens have configurable expiration time
- Signed with a secret key
- Include user identification and expiration

### 🛡️ Authorization Levels
- **Public**: Registration, login
- **Authenticated**: User profile management
- **Admin**: User management, system administration

## Database Models

### User Model
```python
class User(Document):
    email: EmailStr           # Unique email address
    password: str            # Hashed password
    name: str               # User's full name
    role: str               # member, team_leader, admin
    is_active: bool         # Account status
    is_verified: bool       # Email verification status
    created_at: datetime    # Registration timestamp
    updated_at: datetime    # Last update timestamp
```

## Integration with Existing Code

The authentication system has been integrated with your existing application:

1. **Database**: Added User model to database initialization
2. **Routers**: Added auth routes to main router
3. **Dependencies**: All auth dependencies are available for use in other routes

### Protecting Your Existing Routes

To protect your existing team and member routes, add authentication:

```python
from app.services.auth_services import get_current_active_user, get_admin_user
from app.models.user_model import User

# Require authentication
@router.get("/teams")
async def get_teams(current_user: User = Depends(get_current_active_user)):
    # Your existing code here
    pass

# Require admin role
@router.delete("/teams/{team_id}")
async def delete_team(
    team_id: str,
    admin_user: User = Depends(get_admin_user)
):
    # Your existing code here
    pass
```

## API Documentation

Visit `http://localhost:8222/docs` to see the interactive API documentation with all authentication endpoints.

## Files Created/Modified

### New Files
- `schemas/auth_schemas.py` - Pydantic schemas for authentication
- `services/auth_services.py` - Authentication utilities and dependencies
- `routers/auth_routers.py` - Authentication endpoints
- `create_admin.py` - Script to create admin user
- `.env.example` - Environment variables template

### Modified Files
- `models/user_model.py` - Enhanced user model for authentication
- `crud/user_crud.py` - User CRUD operations with authentication features
- `config/database.py` - Added User model to database initialization
- `routers/all_routers.py` - Added authentication routes
- `requirements.txt` - Added JWT and security dependencies

## Security Considerations

1. **Change Default Admin Password**: The default admin password should be changed immediately
2. **Use Strong Secret Key**: Generate a strong, random secret key for JWT signing
3. **HTTPS in Production**: Always use HTTPS in production environments
4. **Token Expiration**: Configure appropriate token expiration times
5. **Environment Variables**: Store sensitive configuration in environment variables

## Next Steps

1. Set up proper environment variables
2. Create your admin user
3. Test the authentication endpoints
4. Integrate authentication into your existing routes
5. Consider adding email verification functionality
6. Set up proper logging for security events

Your JWT authentication system is now complete and ready to use! 🚀
