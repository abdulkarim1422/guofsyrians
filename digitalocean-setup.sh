#!/bin/bash

# DigitalOcean Droplet Setup Script
# This script prepares a fresh Ubuntu droplet for the Training Employment application

set -e

echo "🌊 Starting DigitalOcean Droplet Setup for Training Employment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python 3.11
echo "🐍 Installing Python 3.11..."
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.11 python3.11-pip python3.11-venv python3.11-dev

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/training-employment
sudo chown $USER:$USER /var/www/training-employment

# Clone repository
echo "📥 Cloning repository..."
cd /var/www/training-employment
git clone https://github.com/mamdouhal/training-employment.git .

# Setup Python virtual environment
echo "🐍 Setting up Python virtual environment..."
cd /var/www/training-employment/backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install frontend dependencies
echo "⚛️ Installing frontend dependencies..."
cd /var/www/training-employment/frontend
npm ci

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Create systemd service files
echo "⚙️ Creating systemd services..."

# Backend service
sudo tee /etc/systemd/system/training-employment-backend.service > /dev/null << EOF
[Unit]
Description=Training Employment Backend API
After=network.target

[Service]
Type=exec
User=www-data
Group=www-data
WorkingDirectory=/var/www/training-employment/backend
Environment=PATH=/var/www/training-employment/backend/venv/bin
ExecStart=/var/www/training-employment/backend/venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8222
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable training-employment-backend
sudo systemctl start training-employment-backend

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/training-employment > /dev/null << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend - Serve static files
    location / {
        root /var/www/training-employment/frontend/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8222;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/training-employment /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup MongoDB
echo "🍃 Setting up MongoDB..."
docker run -d \
  --name mongodb \
  --restart unless-stopped \
  -p 127.0.0.1:27017:27017 \
  -v mongodb_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secure_password_here \
  mongo:5

# Create environment file
echo "🔐 Creating environment configuration..."
sudo tee /var/www/training-employment/backend/.env.production > /dev/null << EOF
ENVIRONMENT=production
MONGO_URL=mongodb://admin:secure_password_here@localhost:27017/training_employment?authSource=admin
JWT_SECRET=your-super-secure-jwt-secret-for-production-make-it-long
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
FRONTEND_URL=https://your-domain.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
PORT=8222
EOF

# Set proper permissions
sudo chown -R www-data:www-data /var/www/training-employment
sudo chmod 644 /var/www/training-employment/backend/.env.production

echo "✅ DigitalOcean Droplet setup complete!"
echo "📋 Next steps:"
echo "1. Update domain name in Nginx config: sudo nano /etc/nginx/sites-available/training-employment"
echo "2. Update environment variables: sudo nano /var/www/training-employment/backend/.env.production"
echo "3. Setup SSL certificate: sudo certbot --nginx -d your-domain.com"
echo "4. Test the application: systemctl status training-employment-backend"

newgrp docker
