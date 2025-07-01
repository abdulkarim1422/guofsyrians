# Authentication System Documentation

## Overview

This document describes the authentication system implemented for the GuofSyrians application, including the login page, authentication context, protected routes, and backend integration.

## Features Implemented

### 1. Login Page (`/login`)
- **Location**: `frontend/src/Pages/LoginPage.tsx`
- **Features**:
  - Modern, responsive design with gradient background
  - Form validation for email and password
  - Show/hide password functionality
  - Loading states during authentication
  - Error handling and display
  - Automatic redirect after successful login
  - Remember intended destination (redirect to original page)

### 2. Authentication Context
- **Location**: `frontend/src/contexts/AuthContext.tsx`
- **Features**:
  - Global authentication state management
  - Token storage in localStorage
  - Automatic token validation
  - User information management
  - Login/logout functionality
  - Axios interceptors for automatic token handling

### 3. Protected Routes
- **Location**: `frontend/src/components/ProtectedRoute.tsx`
- **Features**:
  - Route protection based on authentication status
  - Role-based access control (optional)
  - Loading states while checking authentication
  - Automatic redirect to login for unauthenticated users
  - Access denied page for insufficient permissions

### 4. API Integration
- **Location**: `frontend/src/utils/api.js`
- **Features**:
  - Centralized API configuration
  - Automatic token attachment to requests
  - Response interceptors for error handling
  - Environment-based URL configuration
  - Comprehensive auth API methods

### 5. Dashboard Integration
- **Updated**: `frontend/src/Pages/dashboard.jsx`
- **Features**:
  - User information display in sidebar
  - User dropdown menu with profile and logout options
  - Dynamic greeting with user name
  - Click-outside to close user menu
  - User avatar with initials

### 6. Backend Integration
- **Endpoints Used**:
  - `POST /api/auth/login-json` - User login
  - `POST /api/auth/register` - User registration (admin)
  - `GET /api/auth/me` - Get current user info
  - `PUT /api/auth/me` - Update user profile
  - `PUT /api/auth/change-password` - Change password

## Usage Instructions

### Testing the Authentication

1. **Start the Backend Server**:
   ```bash
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8222
   ```

2. **Create Admin User** (if not exists):
   ```bash
   cd backend
   python create_admin.py
   ```

3. **Start the Frontend Server**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Test Login**:
   - Navigate to `http://localhost:5174`
   - You'll be redirected to `/login` if not authenticated
   - Use admin credentials:
     - Email: `admin@guofsyrians.com`
     - Password: `admin123`

### Default Admin Credentials
- **Email**: admin@guofsyrians.com
- **Password**: admin123
- ⚠️ **Important**: Change this password after first login!

## Component Structure

```
frontend/src/
├── Pages/
│   └── LoginPage.tsx           # Main login page
├── contexts/
│   └── AuthContext.tsx         # Authentication context
├── components/
│   ├── ProtectedRoute.tsx      # Route protection
│   ├── LogoutButton.jsx        # Reusable logout button
│   ├── UserInfo.jsx           # User info display
│   ├── AuthTest.jsx           # Authentication testing component
│   └── RegisterForm.jsx       # User registration form
├── utils/
│   └── api.js                 # API configuration and methods
└── main.jsx                   # Updated with auth provider
```

## Authentication Flow

1. **Initial Load**:
   - Check localStorage for existing token
   - If token exists, validate with backend
   - Set user state and redirect to dashboard
   - If no token, redirect to login

2. **Login Process**:
   - User submits credentials
   - Frontend validates form
   - Send request to `/api/auth/login-json`
   - Store token and user info
   - Set axios authorization header
   - Redirect to intended page or dashboard

3. **Protected Route Access**:
   - Check authentication status
   - If authenticated, render component
   - If not authenticated, redirect to login
   - If insufficient role, show access denied

4. **Logout Process**:
   - Clear token from localStorage
   - Clear user state
   - Remove axios authorization header
   - Redirect to login page

## Security Features

- **JWT Token Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt hashing on backend
- **Token Expiration**: Automatic handling of expired tokens
- **CORS Configuration**: Proper CORS setup for cross-origin requests
- **Role-Based Access**: Support for different user roles
- **Input Validation**: Frontend and backend validation
- **Secure Storage**: Token stored in localStorage (consider httpOnly cookies for production)

## Error Handling

- **Network Errors**: Graceful handling of connection issues
- **Invalid Credentials**: Clear error messages for login failures
- **Token Expiration**: Automatic logout and redirect to login
- **Server Errors**: User-friendly error messages
- **Form Validation**: Client-side validation with error display

## Customization Options

### Styling
- Modern gradient design with glassmorphism effects
- Responsive layout for mobile and desktop
- Customizable color schemes
- Animation effects with react-spring

### Functionality
- Configurable token expiration
- Custom role-based permissions
- Optional "Remember Me" functionality
- Password strength requirements
- Email verification support

## Next Steps

1. **Password Reset**: Implement forgot password functionality
2. **Email Verification**: Add email verification for new users
3. **2FA Support**: Implement two-factor authentication
4. **Session Management**: Add session timeout warnings
5. **Audit Logging**: Track login attempts and user actions
6. **Social Login**: Add OAuth providers (Google, GitHub, etc.)

## Environment Configuration

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8222
```

### Backend (.env)
```env
SECRET_KEY=your-secret-key-change-in-production
MONGODB_URI=mongodb://localhost:27017
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure backend CORS is configured properly
   - Check API base URL in frontend

2. **Token Issues**:
   - Clear localStorage if authentication is broken
   - Check token expiration settings

3. **Route Protection Not Working**:
   - Ensure AuthProvider wraps the entire app
   - Check ProtectedRoute implementation

4. **Backend Connection Issues**:
   - Verify backend server is running on port 8222
   - Check database connection

### Debug Tools

- Use browser DevTools Network tab to inspect API calls
- Check localStorage for token storage
- Use React DevTools to inspect auth context state
- Monitor backend logs for authentication errors

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login-json` | User login | No |
| POST | `/api/auth/register` | Register new user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/me` | Update user profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/auth/users` | Get all users | Admin |
| GET | `/api/auth/users/{id}` | Get user by ID | Admin |
| PUT | `/api/auth/users/{id}` | Update user | Admin |
| DELETE | `/api/auth/users/{id}` | Delete user | Admin |
| PUT | `/api/auth/users/{id}/verify` | Verify user | Admin |
| PUT | `/api/auth/users/{id}/deactivate` | Deactivate user | Admin |
