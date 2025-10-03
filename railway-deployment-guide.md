# Railway Deployment Guide for Data Bleed Game

This guide will help you deploy both the Python backend and the static frontend on Railway.

## Architecture Overview

You need **TWO separate Railway deployments**:

1. **Python FastAPI Backend** - Handles AI chat functionality
2. **Static Frontend** - Serves the main game files

## Deployment 1: Python Backend (Current Repository)

### Step 1: Fix Current Deployment

The current deployment is failing due to Nix configuration issues. We've switched to Docker for more reliable deployment.

**Files Updated:**
- `Dockerfile` - New Docker configuration
- `railway.json` - Updated to use Docker builder
- `nixpacks.toml` - Simplified (backup)

### Step 2: Environment Variables

In your Railway dashboard, add these environment variables:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=8000
PYTHONUNBUFFERED=1
```

### Step 3: Deploy

Push the current changes:
```bash
git add .
git commit -m "Fix Railway deployment with Docker configuration"
git push origin main
```

**Expected Backend URL:** `https://your-backend-name.up.railway.app`
**Health Check:** `https://your-backend-name.up.railway.app/api/health`

## Deployment 2: Static Frontend (New Repository)

### Step 1: Create New Repository

Create a new repository for the frontend with these files:

**package.json:**
```json
{
  "name": "data-bleed-frontend",
  "version": "1.0.0",
  "description": "Data Bleed Game Frontend",
  "main": "chroma-bot/server.js",
  "scripts": {
    "start": "node chroma-bot/server.js",
    "build": "echo 'No build step required'",
    "dev": "node chroma-bot/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "openai": "^4.20.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**railway.json:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node chroma-bot/server.js",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "environments": {
    "production": {
      "variables": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Step 2: Copy Game Files

Copy these directories/files to the new repository:
- All HTML files (`index.html`, `eli_login.html`, etc.)
- `js/` directory
- `css/` files (`style.css`, `themes.css`)
- `chroma-bot/` directory
- `Game/` directory
- `gameplay-areas/` directory
- `Main_Dashboards/` directory
- `Log_in_formats/` directory
- All other game assets and directories

### Step 3: Update API URLs

In the frontend code, update API calls to point to your backend:

**In `chroma-bot/server.js` and other API calling files:**
```javascript
const BACKEND_URL = process.env.BACKEND_URL || 'https://your-backend-name.up.railway.app';

// Update API calls to use BACKEND_URL
fetch(`${BACKEND_URL}/api/chat`, {
  // ... rest of the fetch call
});
```

### Step 4: Environment Variables

In the frontend Railway dashboard, add:
```
BACKEND_URL=https://your-backend-name.up.railway.app
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

## Alternative: Single Static Deployment

If you prefer a simpler approach, you can deploy just the static files without the Node.js server:

### Create `_redirects` file:
```
/*    /index.html   200
```

### Create `static.json`:
```json
{
  "root": ".",
  "clean_urls": false,
  "https_only": true,
  "routes": {
    "/**": "index.html"
  }
}
```

## Testing Your Deployments

### Backend Testing:
```bash
curl https://your-backend-name.up.railway.app/api/health
```

Expected response:
```json
{
  "ok": true,
  "characters_loaded": ["eli", "maya", "stanley"],
  "openai_configured": true,
  "status": "healthy"
}
```

### Frontend Testing:
Visit `https://your-frontend-name.up.railway.app` and verify:
- Game loads properly
- Character selection works
- Chat functionality connects to backend

## Performance Benchmarks

The performance benchmarking system we just implemented can be tested at:
- `https://your-frontend-name.up.railway.app/test-3d-performance-benchmarks.html`

## Troubleshooting

### Common Issues:

1. **CORS Errors:** Make sure backend includes frontend URL in CORS origins
2. **API Connection:** Verify BACKEND_URL environment variable
3. **Build Failures:** Check logs in Railway dashboard
4. **Missing Assets:** Ensure all game files are copied to frontend repo

### Debug Commands:
```bash
# Check backend health
curl https://your-backend-name.up.railway.app/api/health

# Check frontend
curl https://your-frontend-name.up.railway.app

# Test chat API
curl -X POST https://your-backend-name.up.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "character": "eli"}'
```

## Final URLs

After successful deployment, you'll have:

- **Backend API:** `https://your-backend-name.up.railway.app`
- **Main Game:** `https://your-frontend-name.up.railway.app`
- **Performance Tests:** `https://your-frontend-name.up.railway.app/test-3d-performance-benchmarks.html`

## Next Steps

1. Deploy the backend with the Docker configuration
2. Create a new repository for the frontend
3. Update API URLs to connect frontend to backend
4. Test both deployments
5. Update any hardcoded URLs in the game code