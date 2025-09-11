@echo off
echo 🌊 DigitalOcean Deployment Script for Windows

REM Configuration
set "DROPLET_IP=%DROPLET_IP%"
set "DROPLET_USER=%DROPLET_USER%"
set "DOMAIN=%DOMAIN%"

if "%DROPLET_IP%"=="" (
    echo ❌ Please set DROPLET_IP environment variable
    echo Example: set DROPLET_IP=your.droplet.ip.address
    pause
    exit /b 1
)

if "%DROPLET_USER%"=="" set "DROPLET_USER=root"
if "%DOMAIN%"=="" set "DOMAIN=your-domain.com"

echo 📦 Building frontend...
cd frontend
call npm ci
if %errorlevel% neq 0 (
    echo ❌ Frontend dependency installation failed
    pause
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
cd ..

echo 📤 Uploading to DigitalOcean droplet...
echo Please ensure you have SSH access to %DROPLET_IP%

REM You can use WinSCP, FileZilla, or scp if available
echo 📋 Manual steps:
echo 1. Upload the entire project folder to /var/www/training-employment/
echo 2. SSH to your droplet: ssh %DROPLET_USER%@%DROPLET_IP%
echo 3. Run: cd /var/www/training-employment
echo 4. Run: chmod +x digitalocean-setup.sh
echo 5. Run: ./digitalocean-setup.sh
echo 6. Run: docker-compose -f docker-compose.production.yml up -d

echo.
echo ✅ Build complete! Please follow the manual steps above.
echo 🌐 Your app will be available at: https://%DOMAIN%

pause
