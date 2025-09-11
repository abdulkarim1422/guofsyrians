@echo off
echo =====================================================
echo    Training Employment Platform - Development Setup
echo =====================================================
echo.

echo [1/5] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    exit /b 1
)

echo.
echo [2/5] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)

echo.
echo [3/5] Installing backend dependencies...
cd ..\backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)

echo.
echo [4/5] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or not running
    echo Please install Docker Desktop and start it before running the project
    exit /b 1
)

echo.
echo [5/5] Setting up MongoDB container...
cd ..
docker-compose up -d db
if %errorlevel% neq 0 (
    echo ❌ Failed to start MongoDB container
    exit /b 1
)

echo.
echo ✅ Setup complete! You can now run the project with:
echo    npm run dev
echo.
pause
