@echo off
echo 🚀 Starting Training Employment Frontend
echo.
echo 📋 Prerequisites:
echo    • Node.js 18+ installed
echo    • Backend running on localhost:8222
echo    • Dependencies installed (npm install)
echo.

cd /d "%~dp0"

echo 🔍 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🌐 Starting development server...
echo 📱 Frontend will be available at http://localhost:5173
echo 🔄 Hot reload enabled - changes will auto-refresh
echo 🛑 Press Ctrl+C to stop the server
echo.

call npm run dev

pause
