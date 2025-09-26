# GuofSyrians Project Setup Instructions

## Project Overview
This is a full-stack web application with:
- **Backend**: FastAPI (Python) running on port 8222
- **Frontend**: React/Vite running on port 5173
- **Database**: MongoDB running on port 27017

## Prerequisites
✅ **Verified on your system:**
- Python 3.11.9 ✅ 
- Node.js (with npm) ✅ 
- MongoDB Server (running as Windows service) ✅ 

## Setup Instructions

### 1. Environment Configuration
The project uses `.env` files for configuration. These have been created from the `.env.example` files:

- `backend/.env` - Backend configuration
- `frontend/.env` - Frontend configuration  
- `.env` - Root configuration

**Key configurations:**
- Backend runs on: `http://localhost:8222`
- Frontend runs on: `http://localhost:5173`
- MongoDB: `mongodb://localhost:27017/guofsyrians_db`

### 2. Backend Setup
```powershell
# Navigate to backend directory
cd "c:\Users\hp\Music\resume\guofsyrians\backend"

# Python dependencies are already installed ✅
# Dependencies include: FastAPI, uvicorn, beanie, pymongo, and more

# Set PYTHONPATH (important for module imports)
$env:PYTHONPATH = "c:\Users\hp\Music\resume\guofsyrians\backend"

# Start the backend server
C:/Users/hp/AppData/Local/Microsoft/WindowsApps/python3.11.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8222 --reload
```

### 3. Frontend Setup
```powershell
# Navigate to frontend directory (in a new terminal)
cd "c:\Users\hp\Music\resume\guofsyrians\frontend"

# Dependencies are already installed ✅
# Dependencies include: React, Vite, Tailwind CSS, and more

# Start the frontend development server
npm run dev
```

## Running the Application

### Start Everything (3 terminals needed):

**Terminal 1 - MongoDB:** 
MongoDB is running as a Windows service, so no action needed. ✅

**Terminal 2 - Backend:**
```powershell
cd "c:\Users\hp\Music\resume\guofsyrians\backend"
$env:PYTHONPATH = "c:\Users\hp\Music\resume\guofsyrians\backend"
C:/Users/hp/AppData/Local/Microsoft/WindowsApps/python3.11.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8222 --reload
```

**Terminal 3 - Frontend:**
```powershell
cd "c:\Users\hp\Music\resume\guofsyrians\frontend"
npm run dev
```

## Access the Application

- **Frontend (User Interface)**: http://localhost:5173/
- **Backend API**: http://localhost:8222/
- **API Documentation**: http://localhost:8222/docs
- **MongoDB**: localhost:27017

## Verification Steps

✅ **All systems verified working:**

1. **Backend Health Check**: http://localhost:8222/ returns `{"Hello":"World"}`
2. **Frontend Loading**: http://localhost:5173/ serves the React application
3. **Database Connection**: Backend successfully connects to MongoDB
4. **API Documentation**: http://localhost:8222/docs shows FastAPI interactive docs

## Project Structure
```
guofsyrians/
├── backend/                 # FastAPI backend
│   ├── app/                # Application code
│   ├── requirements.txt    # Python dependencies
│   ├── run_server.py      # Alternative startup script
│   └── .env               # Backend environment variables
├── frontend/               # React frontend
│   ├── src/               # Source code
│   ├── package.json       # Node.js dependencies
│   └── .env               # Frontend environment variables
├── docker-compose.yml      # Docker setup (not used in this setup)
└── README_SETUP.md        # This file
```

## Development Features

- **Hot Reload**: Both backend (`--reload` flag) and frontend (Vite) support hot reloading
- **CORS**: Backend is configured to accept requests from frontend
- **Environment Variables**: Proper separation between development and production configs
- **Database**: MongoDB with Beanie ODM for data modeling

## Troubleshooting

**If backend fails to start:**
- Ensure PYTHONPATH is set: `$env:PYTHONPATH = "c:\Users\hp\Music\resume\guofsyrians\backend"`
- Check MongoDB is running: MongoDB service should show as "Running"

**If frontend fails to start:**
- Ensure you're in the frontend directory
- Try `npm install` if dependencies are missing

**If database connection fails:**
- Check MongoDB service: `Get-Service -Name "MongoDB"`
- Verify MongoDB is accessible on port 27017

## Current Status: ✅ READY TO RUN
Both backend and frontend are currently running and accessible!