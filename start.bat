@echo off
REM Startup script for Training Employment Platform (Windows)

echo 🚀 Starting Training Employment Platform...
echo ======================================

cd /d "%~dp0"

REM Start MongoDB via Docker Compose
echo 📦 Starting MongoDB database...
docker-compose up -d db
if %errorlevel% neq 0 (
    echo ❌ Failed to start MongoDB
    pause
    exit /b 1
)
echo ✅ MongoDB started successfully

REM Wait for MongoDB to be ready
echo ⏳ Waiting for MongoDB to be ready...
timeout /t 3 /nobreak >nul

REM Start Backend Server
echo 🔧 Starting FastAPI backend server...
cd backend
start "Backend Server" cmd /k "C:/Users/hp/AppData/Local/Microsoft/WindowsApps/python3.11.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8222"

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Start Frontend Development Server  
echo 🎨 Starting Vite frontend server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

REM Wait for frontend to start
echo ⏳ Waiting for frontend to start...
timeout /t 3 /nobreak >nul

echo.
echo 🎉 Training Employment Platform is now running!
echo ======================================
echo Frontend: http://localhost:5173 or http://localhost:5174
echo Backend API: http://localhost:8222  
echo API Documentation: http://localhost:8222/docs
echo.
echo Check the opened terminal windows for server logs
echo Press any key to exit...
pause >nul
