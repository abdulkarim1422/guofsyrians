# 🌊 DigitalOcean Deployment Guide

Complete guide for deploying Training Employment Platform to DigitalOcean.

## 🚀 **Quick Deployment Options**

### Option 1: DigitalOcean App Platform (Recommended)
- **Pros**: Fully managed, automatic scaling, built-in monitoring
- **Cons**: Slightly more expensive than Droplets

### Option 2: DigitalOcean Droplet with Docker
- **Pros**: Full control, cost-effective, customizable
- **Cons**: Requires manual server management

---

## 🎯 **Option 1: App Platform Deployment**

### 1. Prerequisites
- DigitalOcean account
- GitHub repository with your code
- Domain name (optional)

### 2. Setup Steps

1. **Push code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Production ready for DigitalOcean"
   git push origin main
   ```

2. **Create App on DigitalOcean**:
   - Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect your GitHub repository
   - Choose `training-employment` repository

3. **Configure App** using the `.do/app.yaml` file:
   - DigitalOcean will automatically detect the configuration
   - Review and customize as needed

4. **Set Environment Variables**:
   ```
   JWT_SECRET=your-super-secure-jwt-secret-here
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-gmail-app-password
   ```

5. **Deploy**:
   - Click "Create Resources"
   - Wait for deployment (5-10 minutes)

### 3. Post-Deployment
- Your app will be available at: `https://your-app-name.ondigitalocean.app`
- Configure custom domain if needed
- Monitor via DigitalOcean dashboard

---

## 🖥️ **Option 2: Droplet Deployment**

### 1. Create Droplet

1. **Create Ubuntu Droplet**:
   - OS: Ubuntu 22.04 LTS
   - Size: Basic - $12/month (2GB RAM, 1 CPU)
   - Region: Choose closest to your users
   - Add SSH key for secure access

2. **Point Domain to Droplet** (optional):
   - Add A record: `your-domain.com` → `droplet_ip_address`
   - Add A record: `www.your-domain.com` → `droplet_ip_address`

### 2. Initial Server Setup

SSH into your droplet and run the setup script:

```bash
# SSH to your droplet
ssh root@your_droplet_ip

# Download and run setup script
wget https://raw.githubusercontent.com/mamdouhal/training-employment/main/digitalocean-setup.sh
chmod +x digitalocean-setup.sh
./digitalocean-setup.sh
```

Or manually follow these steps:

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Create app directory
mkdir -p /var/www/training-employment
cd /var/www/training-employment
```

### 3. Deploy Application

```bash
# Clone repository
git clone https://github.com/mamdouhal/training-employment.git .

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Update .env with your values**:
```env
ENVIRONMENT=production
MONGO_ROOT_PASSWORD=your_secure_mongodb_password
JWT_SECRET=your-super-secure-jwt-secret
FRONTEND_URL=https://your-domain.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
```

```bash
# Start services
docker-compose -f docker-compose.production.yml up -d

# Check services
docker-compose -f docker-compose.production.yml ps
```

### 4. Configure SSL (Let's Encrypt)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
certbot renew --dry-run
```

### 5. Configure Firewall

```bash
# Configure UFW firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 🔧 **Configuration Details**

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ENVIRONMENT` | Deployment environment | `production` |
| `MONGO_ROOT_PASSWORD` | MongoDB root password | `secure_password_123` |
| `JWT_SECRET` | JWT signing secret | `your-32-char-secret` |
| `FRONTEND_URL` | Frontend domain | `https://your-domain.com` |
| `MAIL_USERNAME` | SMTP username | `your-email@gmail.com` |
| `MAIL_PASSWORD` | SMTP password | `app-specific-password` |

### Domain Configuration

Update these files with your actual domain:
- `nginx/sites-enabled/training-employment.conf`
- `backend/app/core/settings.py` (CORS_ORIGINS)
- `.env` (FRONTEND_URL)

---

## 📊 **Monitoring & Maintenance**

### Health Checks

```bash
# Check application health
curl https://your-domain.com/health

# Check Docker containers
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs
```

### Database Backup

```bash
# Backup MongoDB
docker exec mongodb mongodump --host localhost --port 27017 --out /backup

# Copy backup from container
docker cp mongodb:/backup ./mongodb-backup-$(date +%Y%m%d)
```

### Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d --build
```

---

## 🚨 **Troubleshooting**

### Common Issues

1. **502 Bad Gateway**
   ```bash
   # Check backend status
   docker logs training-employment-backend
   
   # Restart backend
   docker-compose -f docker-compose.production.yml restart backend
   ```

2. **Database Connection Issues**
   ```bash
   # Check MongoDB logs
   docker logs training-employment-mongodb
   
   # Verify connection string in .env
   ```

3. **SSL Certificate Issues**
   ```bash
   # Renew certificate
   certbot renew
   
   # Check certificate status
   certbot certificates
   ```

### Performance Optimization

1. **Enable Gzip** (already configured in Nginx)
2. **Setup CDN** for static assets
3. **Monitor resources** with DigitalOcean monitoring
4. **Setup log rotation**

---

## 💰 **Cost Estimation**

### App Platform
- **Basic**: ~$12/month (0.5GB RAM, 1 vCPU)
- **Professional**: ~$24/month (1GB RAM, 1 vCPU)
- **Database**: ~$15/month (MongoDB cluster)

### Droplet + Managed Database
- **Droplet**: $12/month (2GB RAM, 1 vCPU)
- **Managed MongoDB**: $15/month (1GB RAM)
- **Load Balancer**: $12/month (optional)

### Self-Managed Droplet
- **Single Droplet**: $12-24/month (all services)
- **Most cost-effective option**

---

## 🎯 **Production Checklist**

- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] Database backup strategy
- [ ] Monitoring setup
- [ ] Error logging configured
- [ ] Performance optimization
- [ ] Security headers enabled
- [ ] Firewall configured

---

## 📞 **Support**

If you encounter issues:

1. Check the troubleshooting section above
2. Review DigitalOcean documentation
3. Check application logs
4. Contact DigitalOcean support for platform issues

**Happy deploying!** 🚀
