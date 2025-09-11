# 🚀 Training Employment Application - Setup & Run Guide

## Quick Start (Windows)

### 1. Prerequisites ✅
- **Docker Desktop**: Running (for MongoDB)
- **Python 3.11+**: Installed with pip
- **Node.js 18+**: Installed with npm

### 2. Start MongoDB 🗄️
```bash
cd c:/Users/hp/Music/traininng/training-employment
docker-compose up -d db
```

### 3. Start Backend 🌐
**Option A: Using Batch Script (Recommended)**
```bash
cd backend
.\start_backend.bat
```

**Option B: Manual Start**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8222 --reload
```

### 4. Start Frontend 🎨
**Option A: Using Batch Script (Recommended)**
```bash
cd frontend  
.\start_frontend.bat
```

**Option B: Manual Start**
```bash
cd frontend
npm install
npm run dev
```

## 🎯 Application Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8222
- **API Documentation**: http://localhost:8222/docs (when backend is running)

## 🔧 Key Features Working

### ✅ Backend Services
- **Health Check**: `GET /health`
- **Legacy API**: `/api/*` endpoints
- **V2 API**: `/api/v2/*` endpoints (enhanced with array normalization)
- **Authentication**: JWT-based auth system
- **Database**: MongoDB with proper indexes

### ✅ Frontend Features
- **Resume Form**: Create/edit resumes with enhanced validation
- **Jobs Page**: List jobs with loading states and error handling
- **Projects Management**: Enhanced date validation and tools tracking
- **Responsive Design**: Mobile-friendly interface
- **API Integration**: V2 API with legacy fallbacks

## 🐛 Troubleshooting

### Backend Issues
```bash
# If MongoDB connection fails
docker-compose restart db

# If port 8222 is busy
netstat -ano | findstr :8222
# Kill the process and restart

# If dependencies missing
cd backend
pip install -r requirements.txt
```

### Frontend Issues
```bash
# If npm packages need update
cd frontend
npm install

# If Vite proxy fails
# Check VITE_API_URL in .env points to http://localhost:8222

# If port 5173 is busy
# Vite will automatically try 5174, 5175, etc.
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login-json` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Jobs (Legacy + V2)
- `GET /api/jobs/` - List all jobs
- `POST /api/jobs/` - Create job (admin)
- `GET /api/v2/jobs` - List jobs (normalized arrays)
- `POST /api/v2/jobs` - Create job V2 (enhanced)

### Resumes (Legacy + V2)  
- `POST /api/resume/submit` - Submit resume
- `GET /api/resume/by-user-id/{id}` - Get user's resume
- `PUT /api/resume/{id}` - Update resume
- `POST /api/v2/resume/submit` - Submit resume V2
- `GET /api/v2/resume/by-user-id/{id}` - Get resume V2

## 🔄 Development Workflow

### Making Changes
1. **Backend Changes**: Server auto-reloads with `--reload` flag
2. **Frontend Changes**: Vite hot-reloads automatically
3. **Database Changes**: Restart backend to reinitialize schemas

### Testing
```bash
# Backend unit tests
cd backend
python -m pytest tests/ -v

# Frontend API integration
# Navigate to http://localhost:5173 and test forms
```

## 🏗️ Architecture Overview

### Backend Stack
- **FastAPI**: Modern Python web framework
- **MongoDB**: Document database via Beanie ODM  
- **JWT**: Authentication tokens
- **V2 API**: Enhanced endpoints with normalized data

### Frontend Stack  
- **React**: UI library with hooks
- **Vite**: Fast development server with HMR
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client with interceptors

### Data Flow
```
Frontend (React) 
    ↓ HTTP Requests
Vite Proxy (/api → localhost:8222)
    ↓ Forwards to  
Backend (FastAPI)
    ↓ Queries
MongoDB (Docker Container)
```

## 🎉 Success Indicators

### ✅ All Working When You See:
- Backend: `INFO: Application startup complete.` 
- Frontend: `Local: http://localhost:5173/`  
- MongoDB: Container shows `Running` status
- Browser: Page loads without CORS/404 errors

### 🚨 Common Issues Resolved:
- ✅ Server auto-shutdown (fixed with proper lifespan management)
- ✅ CORS errors (configured properly)
- ✅ Data normalization (V2 API handles arrays correctly)
- ✅ Authentication flow (JWT tokens working)
- ✅ Database connectivity (indexes created automatically)

---

🎯 **The application should now be fully functional!** 

Navigate to http://localhost:5173 to start using the Training Employment platform.
