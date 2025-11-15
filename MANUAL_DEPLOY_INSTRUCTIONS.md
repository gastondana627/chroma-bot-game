# Manual Deployment Instructions

## The Problem
Vercel is returning `DEPLOYMENT_NOT_FOUND` which means:
- The GitHub integration isn't triggering deployments
- OR the project isn't properly connected
- OR deployments are failing silently

## Solution: Deploy Manually with Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
This will open a browser for authentication.

### Step 3: Deploy to Production
```bash
vercel --prod
```

This will:
1. Upload your files to Vercel
2. Build the project
3. Deploy to production
4. Give you the live URL

### Expected Output
```
Vercel CLI 33.0.0
🔍  Inspect: https://vercel.com/...
✅  Production: https://data-bleed-game.vercel.app [2s]
```

## Alternative: Fix Vercel Dashboard

If you prefer to fix the automatic deployment:

### 1. Go to Vercel Dashboard
https://vercel.com/dashboard

### 2. Find Your Project
Look for `data-bleed-game` or `chroma-bot-game`

### 3. Check Git Integration
- Click on your project
- Go to "Settings" → "Git"
- Verify it's connected to: `gastondana627/chroma-bot-game`
- Branch should be: `main`

### 4. Reconnect if Needed
If not connected:
- Click "Connect Git Repository"
- Select your GitHub repo
- Choose `main` branch
- Save settings

### 5. Trigger Manual Redeploy
- Go to "Deployments" tab
- Find the latest deployment
- Click "..." menu → "Redeploy"
- Check "Use existing Build Cache" is OFF
- Click "Redeploy"

## Verify Deployment

After deploying, check:

```bash
# Should return 200 OK
curl -I https://data-bleed-game.vercel.app/

# Should return 200 OK
curl -I https://data-bleed-game.vercel.app/index.html

# Should return 200 OK (critical asset)
curl -I https://data-bleed-game.vercel.app/chroma-bot/assets/vid/Chroma_Vid.mp4
```

## What We Fixed

The code changes are already committed:
- ✅ `.vercelignore` - Now includes `chroma-bot/assets/`
- ✅ `js/api-config.js` - Won't crash without backend
- ✅ `js/error-handler.js` - Fixed DOM timing
- ✅ `js/mobile-3d-support.js` - Graceful degradation

Once you deploy, these fixes will go live.

## Quick Deploy Command

```bash
# One command to deploy
vercel --prod
```

That's it! The deployment should work once Vercel actually deploys your code.
