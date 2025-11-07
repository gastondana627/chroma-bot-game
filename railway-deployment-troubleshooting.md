# Railway Deployment Troubleshooting Guide

## Current Issue: API Endpoints Returning 404

The Railway deployment is accessible but API endpoints are returning 404 errors. This indicates the FastAPI application is not running correctly.

## Diagnosis

✅ **Frontend (Vercel)**: Working correctly
✅ **Railway Server**: Accessible at https://data-bleed-backend.up.railway.app
❌ **API Endpoints**: Returning 404 (should return 200 for /api/health)

## Root Cause Analysis

The server header shows "railway-edge" instead of "uvicorn" or "fastapi", indicating:
1. The FastAPI app is not starting correctly
2. Railway is serving a default 404 page instead of our application
3. There may be a build or startup error

## Solution Steps

### Step 1: Check Railway Deployment Logs

1. Go to [Railway Dashboard](https://railway.app)
2. Navigate to your Data Bleed project
3. Click on the backend service
4. Check the "Deployments" tab for recent deployments
5. Click on the latest deployment to view logs

Look for:
- Build errors
- Python import errors
- Port binding issues
- Missing environment variables

### Step 2: Verify Environment Variables

Ensure these variables are set in Railway:

**Required:**
- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Should be automatically set by Railway

**Optional but recommended:**
- `PYTHONPATH`: `/app`
- `PYTHONUNBUFFERED`: `1`

### Step 3: Check Build Configuration

Verify these files are correct:

**Dockerfile:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["python", "start.py"]
```

**start.py:**
```python
import uvicorn
from main import app
import os

port = int(os.environ.get("PORT", 8000))
uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
```

### Step 4: Force Redeploy

If configuration looks correct:

1. Make a small change to trigger redeploy (add a comment to main.py)
2. Commit and push changes:
   ```bash
   git add .
   git commit -m "Force Railway redeploy"
   git push origin main
   ```
3. Monitor Railway deployment logs

### Step 5: Test Locally First

Before deploying, test the exact same configuration locally:

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY="your-key-here"
export PORT=8000

# Run the start script
python start.py
```

Then test:
```bash
curl http://localhost:8000/api/health
```

Should return JSON with health status.

## Common Issues and Fixes

### Issue: Import Errors
**Symptoms:** Build succeeds but app doesn't start
**Fix:** Check that all imports in main.py are available in requirements.txt

### Issue: Port Binding
**Symptoms:** App starts but not accessible
**Fix:** Ensure uvicorn binds to 0.0.0.0, not localhost

### Issue: Missing Environment Variables
**Symptoms:** App starts but health check fails
**Fix:** Set OPENAI_API_KEY in Railway dashboard

### Issue: File Path Problems
**Symptoms:** Character files not found
**Fix:** Ensure relative paths work from /app directory

## Verification Commands

After fixing, run these to verify:

```bash
# Check deployment status
python3 check-deployment-status.py

# Verify Railway specifically
python3 verify-railway-deployment.py

# Check environment configuration
python3 check-railway-environment.py
```

## Expected Results After Fix

✅ **Health Endpoint**: https://data-bleed-backend.up.railway.app/api/health
✅ **Characters Endpoint**: https://data-bleed-backend.up.railway.app/api/characters
✅ **CORS Headers**: Present in responses
✅ **Server Header**: Should show "uvicorn" or similar

## Manual Deployment Steps

If automatic deployment isn't working:

1. **Connect Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   railway link
   ```

2. **Deploy manually:**
   ```bash
   railway up
   ```

3. **Check logs:**
   ```bash
   railway logs
   ```

## Contact Information

If issues persist:
1. Check Railway documentation
2. Review FastAPI deployment guides
3. Verify all files are committed to git
4. Ensure Railway project is connected to correct GitHub repository

## Next Steps After Resolution

Once the Railway deployment is working:
1. Run the production validation tests
2. Test end-to-end functionality
3. Document the working configuration
4. Set up monitoring for future deployments