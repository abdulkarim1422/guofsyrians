@echo off
echo 🔍 Checking deployment readiness...
echo ==================================

REM Check Node.js version
echo 📋 Node.js version:
node --version
for /f "tokens=1 delims=v" %%i in ('node --version') do set NODE_FULL=%%i
for /f "tokens=1 delims=." %%i in ("%NODE_FULL:v=%") do set NODE_MAJOR=%%i

if %NODE_MAJOR% GEQ 18 (
    if %NODE_MAJOR% LEQ 20 (
        echo ✅ Node.js version is compatible
    ) else (
        echo ⚠️  Node.js version works but production recommends 18-20
    )
) else (
    echo ❌ Node.js version too old, need 18+
    echo    Download from: https://nodejs.org/
)

echo.

REM Check npm version
echo 📦 NPM version:
npm --version
echo ✅ NPM is available

echo.

REM Check if frontend dependencies are installed
if exist "frontend\node_modules\.package-lock.json" (
    echo ✅ Frontend dependencies installed
) else (
    echo ⚠️  Frontend dependencies not installed
    echo    Run: cd frontend ^&^& npm ci
)

echo.

REM Test frontend build
echo 🏗️  Testing frontend build...
cd frontend
npm run build > build.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend build successful!
    if exist "dist" (
        for /f %%i in ('dir /s "dist" ^| find "bytes"') do echo    Build created
    )
) else (
    echo ❌ Frontend build failed
    echo    Check: npm run build
    echo    Last few lines of error:
    tail -5 build.log 2>nul || (
        powershell "Get-Content build.log | Select-Object -Last 5"
    )
)
cd ..

echo.

REM Check deployment files
echo 📁 Deployment configuration:

if exist ".do\app.yaml" (
    echo ✅ DigitalOcean App Platform config
) else (
    echo ❌ Missing .do\app.yaml
)

if exist ".github\workflows\deploy.yml" (
    echo ✅ GitHub Actions workflow
) else (
    echo ❌ Missing GitHub Actions workflow
)

if exist "docker-compose.yml" (
    echo ✅ Docker Compose config
) else (
    echo ❌ Missing docker-compose.yml
)

echo.

REM Check backend requirements
echo 🐍 Backend status:
if exist "backend\requirements.txt" (
    echo ✅ Python requirements available
) else (
    echo ❌ Missing backend\requirements.txt
)

if exist "backend\Dockerfile" (
    echo ✅ Backend Dockerfile ready
) else (
    echo ❌ Missing backend\Dockerfile
)

echo.

REM Summary
echo 📊 DEPLOYMENT READINESS SUMMARY
echo ================================

set READY=true

REM Critical checks
if %NODE_MAJOR% LSS 18 (
    echo ❌ Node.js version needs upgrade
    set READY=false
)

if not exist "frontend\node_modules\.package-lock.json" (
    echo ⚠️  Run: cd frontend ^&^& npm ci
)

if not exist ".do\app.yaml" (
    echo ❌ DigitalOcean config missing
    set READY=false
)

if "%READY%"=="true" (
    echo.
    echo 🎉 PROJECT IS READY FOR DEPLOYMENT!
    echo.
    echo Next steps:
    echo 1. Push code to GitHub: git push origin main
    echo 2. Create DigitalOcean App Platform app
    echo 3. Connect to GitHub repository
    echo 4. App Platform will auto-deploy using .do\app.yaml
    echo.
    echo 🔗 DigitalOcean App Platform: https://cloud.digitalocean.com/apps
) else (
    echo.
    echo ⚠️  Fix the issues above before deploying
)

pause
