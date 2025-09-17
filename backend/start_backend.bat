@echo off
echo 🚀 Starting Training Employment Backend Server
echo.
echo 📋 Prerequisites:
echo    • MongoDB running on localhost:27017
echo    • Python 3.11+ installed
echo    • All dependencies installed (pip install -r requirements.txt)
echo.

cd /d "%~dp0"

echo 🔍 Checking MongoDB connection...
docker ps | findstr mongo >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB container is running
) else (
    echo ⚠️  MongoDB container not found, starting it...
    docker-compose up -d db
    if %errorlevel% neq 0 (
        echo ❌ Failed to start MongoDB. Please ensure Docker Desktop is running.
        pause
        exit /b 1
    )
    echo ✅ MongoDB started successfully
)

echo.
echo 🌐 Starting backend server on http://localhost:8222
echo 📱 Frontend should be accessible at http://localhost:5173
echo 🛑 Press Ctrl+C to stop the server
echo.

python -m uvicorn app.main:app --host 0.0.0.0 --port 8222 --reload --log-level info

pause
