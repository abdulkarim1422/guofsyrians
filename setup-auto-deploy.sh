#!/bin/bash

# Auto-deployment setup script for DigitalOcean
# This script helps fix the "deploy cluster proxy not ready" error

set -e

echo "🔧 Setting up auto-deployment for DigitalOcean..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Validating project structure..."

# Check required files
required_files=(
    ".do/app.yaml"
    ".github/workflows/deploy.yml"
    "backend/Dockerfile"
    "backend/requirements.txt"
    "frontend/package.json"
    "docker-compose.production.yml"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Missing required file: $file"
        exit 1
    fi
done

print_status "✅ All required files found"

# Validate App Platform configuration
print_status "Validating App Platform configuration..."

if ! grep -q "health_check:" .do/app.yaml; then
    print_warning "No health check found in app.yaml"
fi

if ! grep -q "initial_delay_seconds:" .do/app.yaml; then
    print_warning "Consider adding initial_delay_seconds to health check"
fi

# Check frontend build
print_status "Testing frontend build..."
cd frontend
if ! npm ci; then
    print_error "Frontend dependency installation failed"
    exit 1
fi

if ! npm run build; then
    print_error "Frontend build failed"
    exit 1
fi
cd ..

print_status "✅ Frontend builds successfully"

# Check backend dependencies
print_status "Testing backend dependencies..."
cd backend
if ! python3 -m pip install -r requirements.txt --dry-run > /dev/null 2>&1; then
    print_warning "Some backend dependencies might have issues"
fi
cd ..

# Test Docker build
print_status "Testing Docker build..."
if ! docker build -f backend/Dockerfile backend/ -t training-employment-test > /dev/null 2>&1; then
    print_error "Docker build failed"
    exit 1
fi

# Clean up test image
docker rmi training-employment-test > /dev/null 2>&1 || true

print_status "✅ Docker build successful"

# Create deployment checklist
cat > DEPLOYMENT_CHECKLIST.md << 'EOF'
# 🚀 Deployment Checklist

## Before Deploying

- [ ] All tests pass locally
- [ ] Frontend builds without errors
- [ ] Backend Docker image builds successfully
- [ ] Environment variables are set correctly
- [ ] Database connection string is valid
- [ ] CORS origins include your domain

## App Platform Specific

- [ ] Repository is connected to DigitalOcean
- [ ] `.do/app.yaml` is in the root directory
- [ ] Health check endpoint (`/health`) works
- [ ] Initial delay is set for health checks (60s+)
- [ ] All required environment variables are set in DO dashboard

## Common Issues & Solutions

### "Deploy cluster proxy not ready"
- Increase `initial_delay_seconds` in health check to 60+
- Ensure health check endpoint returns 200 status
- Check if backend port matches `http_port` in config
- Verify all environment variables are set

### Build Failures
- Check build logs in DigitalOcean dashboard
- Ensure all dependencies are in requirements.txt/package.json
- Verify Dockerfile syntax is correct

### Database Connection Issues
- Check MongoDB connection string format
- Ensure database is created and accessible
- Verify authentication credentials

## Deployment Commands

```bash
# Test locally first
npm run dev

# Deploy via Git push (if auto-deploy enabled)
git add .
git commit -m "Deploy: <description>"
git push origin main

# Manual deploy via doctl
doctl apps create-deployment $APP_ID --wait
```

## Monitoring

- Check logs: DigitalOcean Dashboard → Apps → Your App → Runtime Logs
- Health check: https://your-app.ondigitalocean.app/health
- API docs: https://your-app.ondigitalocean.app/docs
EOF

# GitHub secrets template
cat > .github/SECRETS_TEMPLATE.md << 'EOF'
# Required GitHub Secrets

Set these in your GitHub repository settings → Secrets and variables → Actions:

## For App Platform Deployment
- `DIGITALOCEAN_ACCESS_TOKEN`: Your DO API token
- `DO_APP_ID`: Your App Platform app ID (optional, for automated deployments)

## For Droplet Deployment
- `DROPLET_HOST`: Your droplet IP address
- `DROPLET_USER`: SSH username (usually 'root')
- `DROPLET_SSH_KEY`: Private SSH key content

## Application Secrets
- `JWT_SECRET`: Secure JWT signing key
- `MAIL_USERNAME`: SMTP username
- `MAIL_PASSWORD`: SMTP password

## How to get App ID
```bash
doctl apps list
```
EOF

print_status "✅ Auto-deployment setup complete!"
print_status ""
print_status "📋 Next steps:"
print_status "1. Check DEPLOYMENT_CHECKLIST.md for required setup"
print_status "2. Set up GitHub secrets (see .github/SECRETS_TEMPLATE.md)"
print_status "3. Push to main branch to trigger deployment"
print_status ""
print_warning "To fix 'deploy cluster proxy not ready' error:"
print_warning "- Ensure health check has initial_delay_seconds: 60+"
print_warning "- Verify /health endpoint returns 200 status"
print_warning "- Check all environment variables are set in DO dashboard"
