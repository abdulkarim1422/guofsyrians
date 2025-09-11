# 🚨 DigitalOcean Deployment Troubleshooting

## "Deploy cluster proxy not ready" Error

This error occurs when DigitalOcean App Platform can't establish a connection to your application. Here's how to fix it:

### ✅ **Quick Fixes**

#### 1. **Update App Platform Configuration**
Ensure your `.do/app.yaml` has proper health check settings:

```yaml
health_check:
  http_path: /health
  initial_delay_seconds: 60  # Key fix: wait longer for app to start
  period_seconds: 10
  timeout_seconds: 5
  success_threshold: 1
  failure_threshold: 3
```

#### 2. **Check Health Endpoint**
Your `/health` endpoint must return HTTP 200:

```bash
# Test locally
curl http://localhost:8222/health

# Should return:
{
  "status": "healthy",
  "message": "Training Employment API is running",
  ...
}
```

#### 3. **Verify Port Configuration**
App Platform uses the `PORT` environment variable:

```yaml
# In .do/app.yaml
envs:
  - key: PORT
    value: "8080"
```

```python
# In your FastAPI app
port = int(os.getenv("PORT", "8080"))
```

#### 4. **Set Proper Environment Variables**
Missing environment variables cause startup failures:

**Required in DigitalOcean Dashboard:**
- `JWT_SECRET`: Strong secret key
- `MONGO_URL`: Database connection string
- `MAIL_USERNAME`: Email username
- `MAIL_PASSWORD`: Email password

### 🔍 **Debugging Steps**

#### Step 1: Check Build Logs
1. Go to DigitalOcean Dashboard
2. Apps → Your App → Activity
3. Click on latest deployment
4. Check "Build Logs" for errors

#### Step 2: Check Runtime Logs
1. Apps → Your App → Runtime Logs
2. Look for startup errors
3. Check health check failures

#### Step 3: Test Locally
```bash
# Test the exact configuration
docker build -f backend/Dockerfile backend/ -t test-app
docker run -p 8080:8080 -e PORT=8080 test-app

# Test health endpoint
curl http://localhost:8080/health
```

### 🛠️ **Common Issues & Solutions**

#### Issue: Health Check Timeout
```yaml
# Solution: Increase timeout and delay
health_check:
  initial_delay_seconds: 90  # Increase if app starts slowly
  timeout_seconds: 10        # Increase if health check is slow
```

#### Issue: Wrong Port
```dockerfile
# Make sure Dockerfile uses PORT env var
EXPOSE $PORT
CMD python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### Issue: Database Connection Failure
```python
# Add retry logic in your health check
try:
    await db.client.admin.command('ping')
    db_status = "connected"
except Exception as e:
    db_status = f"error: {str(e)}"
    # Return 503 in production if DB fails
```

#### Issue: Missing Dependencies
```txt
# Ensure all dependencies are in requirements.txt
# Check for missing system packages in Dockerfile
```

### 📋 **Deployment Checklist**

**Before Each Deployment:**
- [ ] All tests pass locally
- [ ] Health endpoint returns 200
- [ ] Environment variables are set
- [ ] Database connection works
- [ ] Frontend builds successfully
- [ ] Docker image builds locally

**App Platform Specific:**
- [ ] `.do/app.yaml` is in repository root
- [ ] Health check timeout ≥ 60 seconds
- [ ] Correct port configuration (8080)
- [ ] All environment variables set in DO dashboard
- [ ] GitHub repository connected correctly

### 🔄 **Auto-Deploy Setup**

#### 1. Enable Auto-Deploy
```yaml
# In .do/app.yaml
github:
  repo: your-username/training-employment
  branch: main
  deploy_on_push: true  # Enable auto-deploy
```

#### 2. GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml already created
# Set these GitHub secrets:
# - DIGITALOCEAN_ACCESS_TOKEN
# - DO_APP_ID (optional)
```

#### 3. Manual Deploy via CLI
```bash
# Install doctl
snap install doctl  # Ubuntu
brew install doctl  # macOS

# Login
doctl auth init

# Get app ID
doctl apps list

# Deploy
doctl apps create-deployment YOUR_APP_ID --wait
```

### 📊 **Monitoring After Deployment**

#### Health Checks
```bash
# Production health check
curl https://your-app.ondigitalocean.app/health

# API documentation
curl https://your-app.ondigitalocean.app/docs
```

#### Log Monitoring
```bash
# Using doctl
doctl apps logs YOUR_APP_ID --type=run

# Or check in DigitalOcean dashboard
```

### 🆘 **Still Having Issues?**

#### 1. **Enable Debug Mode**
```yaml
# Add to .do/app.yaml
envs:
  - key: DEBUG
    value: "true"
  - key: LOG_LEVEL
    value: "debug"
```

#### 2. **Minimal Test App**
Create a minimal test to isolate the issue:

```python
# minimal_test.py
from fastapi import FastAPI
import os

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "ok", "port": os.getenv("PORT", "8080")}

@app.get("/")
async def root():
    return {"message": "Test app running"}
```

#### 3. **Check Resource Limits**
- Upgrade to higher instance size if needed
- Monitor CPU/Memory usage in dashboard
- Check if app is crashing due to resource limits

#### 4. **Contact Support**
If all else fails:
- DigitalOcean Support (if you have a paid plan)
- Community forums
- GitHub issues for this project

---

## 📞 **Quick Support Commands**

```bash
# Get app status
doctl apps get YOUR_APP_ID

# Get deployment logs
doctl apps logs YOUR_APP_ID --type=build

# Force redeploy
doctl apps create-deployment YOUR_APP_ID --force-rebuild

# Update app from spec
doctl apps update YOUR_APP_ID --spec .do/app.yaml
```

**Remember:** Most "cluster proxy not ready" errors are fixed by increasing the `initial_delay_seconds` in the health check configuration! 🎯
