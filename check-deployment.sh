#!/bin/bash

# 🚀 Deployment Status Checker
# Checks if your project is ready for deployment

echo "🔍 Checking deployment readiness..."
echo "=================================="

# Check Node.js version
echo "📋 Node.js version:"
node --version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -ge 18 ] && [ "$NODE_VERSION" -le 20 ]; then
    echo "✅ Node.js version is compatible"
elif [ "$NODE_VERSION" -ge 18 ]; then
    echo "⚠️  Node.js version works but production recommends 18-20"
else
    echo "❌ Node.js version too old, need 18+"
    echo "   Run: nvm install 20 && nvm use 20"
fi

echo ""

# Check npm version
echo "📦 NPM version:"
npm --version
echo "✅ NPM is available"

echo ""

# Check if frontend dependencies are installed
if [ -f "frontend/node_modules/.package-lock.json" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "⚠️  Frontend dependencies not installed"
    echo "   Run: cd frontend && npm ci"
fi

echo ""

# Test frontend build
echo "🏗️  Testing frontend build..."
cd frontend
if npm run build > /tmp/build.log 2>&1; then
    echo "✅ Frontend build successful!"
    BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
    echo "   Build size: $BUILD_SIZE"
else
    echo "❌ Frontend build failed"
    echo "   Check: npm run build"
    tail -5 /tmp/build.log
fi

cd ..

echo ""

# Check deployment files
echo "📁 Deployment configuration:"

if [ -f ".do/app.yaml" ]; then
    echo "✅ DigitalOcean App Platform config"
else
    echo "❌ Missing .do/app.yaml"
fi

if [ -f ".github/workflows/deploy.yml" ]; then
    echo "✅ GitHub Actions workflow"
else
    echo "❌ Missing GitHub Actions workflow"
fi

if [ -f "docker-compose.yml" ]; then
    echo "✅ Docker Compose config"
else
    echo "❌ Missing docker-compose.yml"
fi

echo ""

# Check backend requirements
echo "🐍 Backend status:"
if [ -f "backend/requirements.txt" ]; then
    echo "✅ Python requirements available"
else
    echo "❌ Missing backend/requirements.txt"
fi

if [ -f "backend/Dockerfile" ]; then
    echo "✅ Backend Dockerfile ready"
else
    echo "❌ Missing backend/Dockerfile"
fi

echo ""

# Summary
echo "📊 DEPLOYMENT READINESS SUMMARY"
echo "================================"

READY=true

# Critical checks
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version needs upgrade"
    READY=false
fi

if [ ! -f "frontend/node_modules/.package-lock.json" ]; then
    echo "⚠️  Run: cd frontend && npm ci"
fi

if [ ! -f ".do/app.yaml" ]; then
    echo "❌ DigitalOcean config missing"
    READY=false
fi

if [ "$READY" = true ]; then
    echo ""
    echo "🎉 PROJECT IS READY FOR DEPLOYMENT!"
    echo ""
    echo "Next steps:"
    echo "1. Push code to GitHub: git push origin main"
    echo "2. Create DigitalOcean App Platform app"
    echo "3. Connect to GitHub repository"
    echo "4. App Platform will auto-deploy using .do/app.yaml"
    echo ""
    echo "🔗 DigitalOcean App Platform: https://cloud.digitalocean.com/apps"
else
    echo ""
    echo "⚠️  Fix the issues above before deploying"
fi
