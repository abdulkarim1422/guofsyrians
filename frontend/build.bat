@echo off
echo 🔧 Frontend Build Script
echo ========================

REM Check Node.js version
for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo 📦 Node.js version: %NODE_VERSION%

REM Extract major version (remove 'v' and get first number)
for /f "tokens=1 delims=." %%a in ("%NODE_VERSION:~1%") do set NODE_MAJOR=%%a
echo 🔍 Node.js major version: %NODE_MAJOR%

REM Check compatibility
if %NODE_MAJOR% LSS 18 (
    echo ❌ Error: Node.js version %NODE_VERSION% is not supported
    echo    Required: Node.js 18.x or 20.x
    echo    Please use a compatible Node.js version
    exit /b 1
)

if %NODE_MAJOR% EQU 24 (
    echo ❌ Error: Node.js 24.x is not supported by current Vite version
    echo    Please use Node.js 18.x or 20.x
    echo    Consider using nvm to switch versions
    exit /b 1
)

if %NODE_MAJOR% GTR 20 (
    echo ⚠️  Warning: Node.js version %NODE_VERSION% is newer than tested versions
    echo    Recommended: Node.js 18.x or 20.x
    echo    Continuing with build...
) else (
    echo ✅ Node.js version %NODE_VERSION% is compatible
)

REM Check npm version
for /f "tokens=1" %%i in ('npm --version') do set NPM_VERSION=%%i
echo 📦 npm version: %NPM_VERSION%

REM Install dependencies
echo 📥 Installing dependencies...
npm ci --prefer-offline --no-audit
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies with npm ci
    echo 🔧 Trying with npm install...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        exit /b 1
    )
)
echo ✅ Dependencies installed successfully

REM Build project
echo 🏗️  Building project...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    echo 🔧 Troubleshooting tips:
    echo    1. Check if all dependencies are installed
    echo    2. Verify Node.js version (should be 18.x or 20.x)
    echo    3. Clear node_modules and try again: rmdir /s node_modules ^&^& npm install
    echo    4. Check for syntax errors in source code
    exit /b 1
)

echo ✅ Build completed successfully
echo 📁 Output directory: dist/

if exist "dist" (
    echo 📊 Build statistics:
    dir /s dist
)

echo 🎉 Frontend build process completed successfully!
