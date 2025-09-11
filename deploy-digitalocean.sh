#!/bin/bash

# DigitalOcean Deployment Script
# This script deploys the Training Employment application to a DigitalOcean droplet

set -e

echo "🌊 Starting DigitalOcean Deployment..."

# Configuration
DROPLET_IP="${DROPLET_IP:-your.droplet.ip.address}"
DROPLET_USER="${DROPLET_USER:-root}"
DOMAIN="${DOMAIN:-your-domain.com}"
APP_DIR="/var/www/training-employment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required variables are set
if [ "$DROPLET_IP" = "your.droplet.ip.address" ]; then
    print_error "Please set DROPLET_IP environment variable"
    exit 1
fi

# Build frontend locally
print_status "Building frontend locally..."
cd frontend
npm ci
npm run build
cd ..

# Upload application to droplet
print_status "Uploading application to droplet..."
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'data' \
    ./ $DROPLET_USER@$DROPLET_IP:$APP_DIR/

# Deploy on droplet
print_status "Deploying on droplet..."
ssh $DROPLET_USER@$DROPLET_IP << EOF
set -e

cd $APP_DIR

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration"
fi

# Start services with Docker Compose
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Test services
docker-compose -f docker-compose.production.yml ps
curl -f http://localhost:8222/health || echo "❌ Backend health check failed"

echo "✅ Deployment complete!"
echo "🌐 Your application should be available at: https://$DOMAIN"
echo "📊 Check logs with: docker-compose -f docker-compose.production.yml logs"

EOF

print_status "Deployment completed successfully!"
print_warning "Don't forget to:"
print_warning "1. Update your domain DNS to point to $DROPLET_IP"
print_warning "2. Set up SSL certificate: ssh $DROPLET_USER@$DROPLET_IP 'certbot --nginx -d $DOMAIN'"
print_warning "3. Update .env file with your actual configuration"
