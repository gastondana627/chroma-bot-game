# Data Bleed Game - Production Access Guide

## Production URLs

### Frontend (Vercel)
- **Main URL**: https://data-bleed-vsc-game.vercel.app
- **Status**: ✅ **WORKING** - Fully deployed and accessible
- **Platform**: Vercel
- **Auto-deployment**: Enabled (triggers on git push to main branch)

### Backend (Railway)
- **Main URL**: https://data-bleed-backend.up.railway.app
- **API Health Check**: https://data-bleed-backend.up.railway.app/api/health
- **Status**: ⚠️ **PARTIAL** - Server accessible but API endpoints returning 404
- **Platform**: Railway
- **Auto-deployment**: Enabled (triggers on git push to main branch)

## Current Deployment Status

### ✅ Working Components
1. **Frontend Deployment**
   - Game interface loads correctly
   - Static assets served properly
   - API configuration included
   - Environment detection working

2. **Backend Server**
   - Railway deployment accessible
   - Server responding to requests
   - CORS configuration in place

### ❌ Known Issues
1. **API Endpoints Not Working**
   - All `/api/*` endpoints returning 404
   - FastAPI application not starting correctly
   - Requires Railway deployment troubleshooting

## Access Information

### For Developers

**Frontend Development:**
- Repository: Connected to GitHub (auto-deploy)
- Vercel Dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- Build logs: Available in Vercel dashboard
- Environment variables: Configured in Vercel project settings

**Backend Development:**
- Repository: Connected to GitHub (auto-deploy)
- Railway Dashboard: [https://railway.app/dashboard](https://railway.app/dashboard)
- Build logs: Available in Railway project dashboard
- Environment variables: Set in Railway project variables

### For Testing

**Automated Testing Tools:**
```bash
# Check overall deployment status
python3 check-deployment-status.py

# Verify Railway backend specifically
python3 verify-railway-deployment.py

# Check environment configuration
python3 check-railway-environment.py

# Run end-to-end tests (when backend is working)
node end-to-end-production-test.js
```

**Manual Testing:**
- Frontend: Visit https://data-bleed-vsc-game.vercel.app
- Backend Health: Visit https://data-bleed-backend.up.railway.app/api/health
- Interactive Testing: Open `validate-production-deployment.html` in browser

## Troubleshooting Guide

### Frontend Issues

**Problem**: Frontend not loading
**Solutions:**
1. Check Vercel deployment status in dashboard
2. Verify latest code is pushed to main branch
3. Check Vercel build logs for errors
4. Ensure all static assets are committed to git

**Problem**: API configuration not working
**Solutions:**
1. Verify `js/api-config.js` is included in HTML
2. Check environment detection logic
3. Confirm production backend URL is correct

### Backend Issues

**Problem**: API endpoints returning 404 (Current Issue)
**Solutions:**
1. Check Railway deployment logs for startup errors
2. Verify `OPENAI_API_KEY` environment variable is set
3. Ensure `start.py` and `main.py` are correct
4. Force redeploy by pushing a small change
5. See detailed troubleshooting: `railway-deployment-troubleshooting.md`

**Problem**: CORS errors
**Solutions:**
1. Verify Vercel URL is in CORS allowed origins
2. Check CORS middleware configuration in `main.py`
3. Test with browser developer tools

### Environment Variables

**Required for Railway:**
- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Automatically set by Railway

**Optional for Railway:**
- `PYTHONPATH`: `/app`
- `PYTHONUNBUFFERED`: `1`

## Deployment Procedures

### Manual Deployment

**Frontend (Vercel):**
```bash
# Commit changes
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys within 1-2 minutes
```

**Backend (Railway):**
```bash
# Commit changes
git add .
git commit -m "Update backend"
git push origin main
# Railway auto-deploys within 2-5 minutes
```

### Force Deployment

**If auto-deployment isn't working:**

**Vercel:**
1. Go to Vercel dashboard
2. Select the project
3. Go to Deployments tab
4. Click "Redeploy" on latest deployment

**Railway:**
1. Go to Railway dashboard
2. Select the project
3. Go to Deployments tab
4. Click "Deploy" to trigger manual deployment

### Deployment Status Checking

**Automated Checks:**
```bash
# Quick status check
python3 check-deployment-status.py

# Comprehensive validation
open validate-production-deployment.html
```

**Manual Checks:**
1. **Frontend**: Visit main URL, check for game content
2. **Backend**: Visit health endpoint, should return JSON
3. **Integration**: Test character chat functionality

## Monitoring and Alerts

### Health Check Endpoints

**Frontend Health:**
- URL: https://data-bleed-vsc-game.vercel.app
- Expected: HTTP 200, HTML content with "Data_Bleed"

**Backend Health:**
- URL: https://data-bleed-backend.up.railway.app/api/health
- Expected: HTTP 200, JSON with `{"ok": true, "openai_configured": true}`

### Performance Monitoring

**Tools Available:**
- `js/performance-tracker.js` - Frontend performance monitoring
- `js/deployment-monitor.js` - Deployment status monitoring
- `monitoring-dashboard.html` - Real-time monitoring interface

### Log Access

**Frontend Logs:**
- Vercel Dashboard → Project → Functions tab
- Browser Developer Tools → Console

**Backend Logs:**
- Railway Dashboard → Project → Deployments → View Logs
- Real-time logs: `railway logs` (if Railway CLI installed)

## Security Considerations

### API Keys
- OpenAI API key stored securely in Railway environment variables
- No sensitive credentials exposed to frontend
- CORS configured to allow only production frontend domain

### HTTPS
- Both frontend and backend use HTTPS in production
- Secure communication between services
- No mixed content warnings

### Environment Isolation
- Production environment variables separate from development
- Environment detection prevents localhost URLs in production

## Support and Maintenance

### Regular Maintenance Tasks
1. **Weekly**: Check deployment status and health endpoints
2. **Monthly**: Review performance metrics and error logs
3. **As needed**: Update dependencies and security patches

### Emergency Procedures
1. **Frontend Down**: Check Vercel status, redeploy if needed
2. **Backend Down**: Check Railway status, verify environment variables
3. **API Errors**: Check OpenAI API key and quota limits
4. **CORS Issues**: Verify frontend URL in backend CORS configuration

### Contact Information
- **Platform Support**: Vercel Support, Railway Support
- **Repository**: GitHub repository with deployment configurations
- **Documentation**: This guide and related troubleshooting documents

## Next Steps

### Immediate (Fix Current Issues)
1. ✅ Troubleshoot Railway API endpoints (see `railway-deployment-troubleshooting.md`)
2. ✅ Verify OpenAI API key configuration
3. ✅ Test end-to-end functionality once backend is working

### Short Term (Improvements)
1. Set up automated health check monitoring
2. Configure deployment notifications
3. Add performance monitoring dashboards
4. Create backup deployment procedures

### Long Term (Enhancements)
1. Implement CI/CD pipeline with automated testing
2. Add staging environment for testing before production
3. Set up comprehensive logging and analytics
4. Create disaster recovery procedures

---

**Last Updated**: November 5, 2024
**Status**: Frontend working, Backend needs troubleshooting
**Next Review**: After Railway backend issues are resolved