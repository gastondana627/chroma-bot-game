# Railway Frontend Deployment Instructions

## Step 1: Create New Railway Project
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `chroma-bot-game` repository
5. Name it "data-bleed-frontend" or similar

## Step 2: Configure Environment Variables
In the Railway dashboard for your frontend project, add:
```
NODE_ENV=production
PORT=$PORT
OPENAI_API_KEY=your_openai_key_here
```

## Step 3: Configure Build Settings
In Railway project settings:
- **Root Directory**: Leave empty (uses repo root)
- **Build Command**: `npm install`
- **Start Command**: `node chroma-bot/server.js`

## Step 4: Add Custom nixpacks.toml for Frontend
Create a separate nixpacks configuration by renaming the current one and creating a Node.js version:

```toml
[phases.setup]
nixPkgs = ['nodejs_18', 'npm']

[phases.install]
cmds = ['npm install']

[phases.build]
cmds = ['echo "Frontend build complete"']

[start]
cmd = 'node chroma-bot/server.js'
```

## Step 5: Update CORS Settings
Make sure your backend (data-bleed-backend.up.railway.app) allows requests from your new frontend URL.

## Expected URLs:
- **Backend**: https://data-bleed-backend.up.railway.app (existing)
- **Frontend**: https://data-bleed-frontend-[random].up.railway.app (new)

## Alternative: Static Deployment
If you prefer a simpler static deployment, you can also deploy just the HTML/JS files without the Node.js server using Railway's static hosting or Netlify/Vercel.