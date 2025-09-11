# 🚀 Quick DigitalOcean Deployment Commands

## Prerequisites
- DigitalOcean account
- Domain name (optional but recommended)
- SSH key pair

## Method 1: App Platform (Managed) - Recommended for Beginners

```bash
# 1. Push code to GitHub
git add .
git commit -m "Ready for DigitalOcean deployment"
git push origin main

# 2. Go to DigitalOcean App Platform
# https://cloud.digitalocean.com/apps

# 3. Create new app from GitHub repo
# - Select: training-employment repository
# - Use: .do/app.yaml configuration
# - Set environment variables in the dashboard
```

**Environment Variables to Set:**
```
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
```

**Cost:** ~$27/month (App + Database)

## Method 2: Droplet (Self-Managed) - Cost Effective

### Step 1: Create Droplet
```bash
# Create Ubuntu 22.04 droplet ($12/month, 2GB RAM)
# Add your SSH key during creation
# Note the IP address
```

### Step 2: Initial Setup
```bash
# SSH to droplet
ssh root@YOUR_DROPLET_IP

# Run automated setup
curl -sSL https://raw.githubusercontent.com/mamdouhal/training-employment/main/digitalocean-setup.sh | bash
```

### Step 3: Deploy Application
```bash
# Clone and configure
cd /var/www/training-employment
git clone https://github.com/mamdouhal/training-employment.git .

# Copy and edit environment
cp .env.example .env
nano .env  # Update with your values

# Start services
docker-compose -f docker-compose.production.yml up -d
```

### Step 4: Configure Domain (Optional)
```bash
# Update domain in Nginx config
nano /etc/nginx/sites-enabled/training-employment.conf
# Replace 'your-domain.com' with your actual domain

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com
```

**Cost:** ~$12/month

## Method 3: Local Deployment Build

For preparing files locally before upload:

```bash
# Build frontend
cd frontend
npm ci
npm run build

# Create production environment
cp .env.example .env
# Edit .env with production values

# Test Docker configuration
docker-compose -f docker-compose.production.yml config

# Build containers
docker-compose -f docker-compose.production.yml build
```

## Quick Health Check

After deployment, verify everything works:

```bash
# Check services
docker-compose -f docker-compose.production.yml ps

# Test API
curl https://your-domain.com/health

# View logs
docker-compose -f docker-compose.production.yml logs
```

## Troubleshooting

```bash
# Restart all services
docker-compose -f docker-compose.production.yml restart

# Check specific service logs
docker logs training-employment-backend
docker logs training-employment-mongodb

# Update application
git pull origin main
docker-compose -f docker-compose.production.yml up -d --build
```

## 🎯 URLs After Deployment

- **App Platform**: `https://your-app-name.ondigitalocean.app`
- **Custom Domain**: `https://your-domain.com`
- **API Health**: `https://your-domain.com/health`
- **API Docs**: `https://your-domain.com/docs` (if enabled)

Choose your preferred method and follow the steps! 🌊
