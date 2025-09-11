@echo off
echo ====================================
echo   TRAINING EMPLOYMENT APPLICATION
echo ====================================
echo.
echo 🚀 STARTING ALL SERVICES...
echo.

cd /d "%~dp0"

echo 📋 STEP 1: Starting MongoDB...
docker-compose up -d db
if %errorlevel% neq 0 (
    echo ❌ Failed to start MongoDB
    echo Please ensure Docker Desktop is running
    pause
    exit /b 1
)
echo ✅ MongoDB started successfully
echo.

echo 📋 STEP 2: Installing backend dependencies...
cd backend
pip install -r requirements.txt >nul 2>&1
echo ✅ Backend dependencies ready
echo.

echo 📋 STEP 3: Installing frontend dependencies...
cd ../frontend
call npm install >nul 2>&1
echo ✅ Frontend dependencies ready
echo.

echo 📋 STEP 4: Starting Backend Server...
cd ../backend
start /min cmd /c "python -m uvicorn app.main:app --host 0.0.0.0 --port 8222 --reload"
echo ✅ Backend starting on http://localhost:8222
echo.

echo 📋 STEP 5: Waiting for backend to be ready...
timeout /t 5 /nobreak >nul
echo ✅ Backend should be ready
echo.

echo 📋 STEP 6: Starting Frontend Server...
cd ../frontend
start cmd /c "npm run dev"
echo ✅ Frontend starting on http://localhost:5173
echo.

echo ====================================
echo   🎉 APPLICATION STARTED!
echo ====================================
echo.
echo 📱 Frontend: http://localhost:5173
echo 🌐 Backend:  http://localhost:8222  
echo 📚 API Docs: http://localhost:8222/docs
echo.
echo 🛑 Close this window to stop all services
echo    (Or use Ctrl+C in individual terminal windows)
echo.
pause
