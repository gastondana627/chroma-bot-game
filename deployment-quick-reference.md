# Deployment Quick Reference

**Last Updated**: November 5, 2025  
**Overall Status**: 🟡 PARTIAL

## 📊 Current Status

**Frontend (Vercel)**: ✅ WORKING
- URL: https://chroma-bot-game.vercel.app
- Test: `node test-vercel-frontend-deployment.js`

**Backend (Railway)**: ⚠️ NEEDS ATTENTION
- URL: https://data-bleed-backend.up.railway.app
- Issue: API endpoints returning 404
- Test: `python3 verify-railway-deployment.py`

**Integration**: ⚠️ BLOCKED (waiting for backend fix)

## 🚀 Quick Commands

### Check Status
```bash
# Overall deployment status
python3 check-deployment-status.py

# Railway backend specific
python3 verify-railway-deployment.py

# End-to-end testing
node end-to-end-production-test.js

# Interactive validation
open validate-production-deployment.html
```

### Deploy Changes
```bash
# Deploy to both platforms
./deploy-to-production.sh

# Manual deployment
git add .
git commit -m "Your message"
git push origin main
```

## 🌐 Production URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://data-bleed-vsc-game.vercel.app | ✅ Working |
| **Backend** | https://data-bleed-backend.up.railway.app | ⚠️ Needs Fix |
| **Health Check** | https://data-bleed-backend.up.railway.app/api/health | ❌ 404 Error |

## 🔧 Troubleshooting

### Backend API 404 Error (Current Issue)
```bash
# 1. Check Railway logs
# Go to Railway dashboard → Project → Deployments → View Logs

# 2. Verify environment variables
# Railway dashboard → Project → Variables
# Ensure OPENAI_API_KEY is set

# 3. Force redeploy
git commit --allow-empty -m "Force Railway redeploy"
git push origin main

# 4. Check startup script
# Verify start.py and main.py are correct
```

### Frontend Issues
```bash
# Check Vercel deployment
# Go to Vercel dashboard → Project → Deployments

# Test locally
python3 -m http.server 8000
# Visit http://localhost:8000
```

## 📊 Health Checks

### Expected Responses

**Frontend (Working):**
```
GET https://data-bleed-vsc-game.vercel.app
Status: 200 OK
Content: HTML with "Data_Bleed"
```

**Backend Health (Currently Broken):**
```
GET https://data-bleed-backend.up.railway.app/api/health
Expected: 200 OK with JSON
Current: 404 Not Found
```

**Backend Characters (Currently Broken):**
```
GET https://data-bleed-backend.up.railway.app/api/characters
Expected: 200 OK with character list
Current: 404 Not Found
```

## 🛠️ Environment Variables

### Railway (Backend)
| Variable | Required | Status |
|----------|----------|--------|
| `OPENAI_API_KEY` | ✅ Yes | ❓ Check Dashboard |
| `PORT` | ✅ Auto | ✅ Set by Railway |
| `PYTHONPATH` | ⚪ Optional | ❓ Recommended |

### Vercel (Frontend)
| Variable | Required | Status |
|----------|----------|--------|
| None required | - | ✅ Working |

## 📁 Key Files

### Deployment Configuration
- `Dockerfile` - Railway container setup
- `start.py` - Railway startup script
- `railway.json` - Railway configuration
- `vercel.json` - Vercel configuration

### Testing Scripts
- `check-deployment-status.py` - Overall status
- `verify-railway-deployment.py` - Railway specific
- `end-to-end-production-test.js` - Full E2E testing
- `validate-production-deployment.html` - Interactive testing

### Documentation
- `production-access-guide.md` - Complete guide
- `railway-deployment-troubleshooting.md` - Backend troubleshooting
- `deployment-quick-reference.md` - This file

## 🚨 Emergency Procedures

### Frontend Down
1. Check Vercel status page
2. Redeploy from Vercel dashboard
3. Verify DNS settings

### Backend Down
1. Check Railway status page
2. Check Railway deployment logs
3. Verify environment variables
4. Force redeploy

### API Endpoints 404 (Current Issue)
1. Check Railway logs for startup errors
2. Verify FastAPI app is starting
3. Check environment variables
4. Review `start.py` and `main.py`
5. See `railway-deployment-troubleshooting.md`

## 📞 Support Resources

### Platform Dashboards
- **Vercel**: https://vercel.com/dashboard
- **Railway**: https://railway.app/dashboard

### Documentation
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **FastAPI Docs**: https://fastapi.tiangolo.com

### Status Pages
- **Vercel Status**: https://vercel-status.com
- **Railway Status**: https://status.railway.app

---
**Quick Tip**: Bookmark this file for fast access to deployment commands and URLs!