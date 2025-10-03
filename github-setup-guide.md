# GitHub Repository Setup Guide

## Recommended Approach: Create New Repository

### Why Create a New Repo?
- **Cleaner deployments** - Each Railway project pulls only what it needs
- **Faster builds** - Frontend doesn't download Python dependencies
- **Better organization** - Clear separation of concerns
- **Easier maintenance** - Independent versioning and updates

## Step-by-Step Setup

### 1. Create New GitHub Repository
```bash
# On GitHub.com:
# 1. Click "New Repository"
# 2. Name: "data-bleed-frontend" (or similar)
# 3. Description: "Data Bleed Game Frontend - Interactive narrative with 3D characters"
# 4. Public or Private (your choice)
# 5. Don't initialize with README (we'll copy files)
```

### 2. Clone and Setup New Repository
```bash
# Clone the new empty repository
git clone https://github.com/yourusername/data-bleed-frontend.git
cd data-bleed-frontend

# Copy files from your current repository
# (Run this from your current chroma-bot-game directory)
```

### 3. Files to Copy to New Repository

**Essential Game Files:**
```
├── index.html                     # Main game entry
├── eli_login.html                 # Character login
├── package-frontend.json          # → rename to package.json
├── railway-frontend.json          # → rename to railway.json
├── .env.frontend.template         # → rename to .env
├── chroma-bot/                    # Complete directory
├── js/                           # Complete directory
├── css files (style.css, themes.css)
├── gameplay-areas/               # Complete directory
├── Main_Dashboards/              # Complete directory
├── Log_in_formats/               # Complete directory
├── Game/                         # Complete directory
├── tests/                        # Complete directory
├── test-*.html files             # All test files
├── docs/                         # Documentation
└── README.md                     # Update for frontend
```

**Files NOT to Copy (Backend only):**
```
❌ main.py
❌ start.py  
❌ requirements.txt
❌ Dockerfile
❌ nixpacks.toml
❌ .venv/
❌ __pycache__/
```

### 4. Quick Copy Script

Create this script in your current repository:
```bash
#!/bin/bash
# copy-to-frontend.sh

FRONTEND_REPO="../data-bleed-frontend"

echo "Copying frontend files to $FRONTEND_REPO..."

# Copy essential files
cp index.html $FRONTEND_REPO/
cp eli_login.html $FRONTEND_REPO/
cp *.css $FRONTEND_REPO/
cp test-*.html $FRONTEND_REPO/
cp package-frontend.json $FRONTEND_REPO/package.json
cp railway-frontend.json $FRONTEND_REPO/railway.json
cp .env.frontend.template $FRONTEND_REPO/.env

# Copy directories
cp -r chroma-bot/ $FRONTEND_REPO/
cp -r js/ $FRONTEND_REPO/
cp -r gameplay-areas/ $FRONTEND_REPO/
cp -r Main_Dashboards/ $FRONTEND_REPO/
cp -r Log_in_formats/ $FRONTEND_REPO/
cp -r Game/ $FRONTEND_REPO/
cp -r tests/ $FRONTEND_REPO/
cp -r docs/ $FRONTEND_REPO/

echo "✅ Files copied successfully!"
echo "Next: cd $FRONTEND_REPO && git add . && git commit -m 'Initial frontend setup'"
```

### 5. Update Environment Variables

**In your new frontend repository's .env:**
```env
BACKEND_URL=https://your-backend-name.up.railway.app
OPENAI_API_KEY=your_same_openai_api_key
NODE_ENV=production
```

### 6. Deploy to Railway

1. **Connect new repository to Railway**
2. **Set environment variables** in Railway dashboard
3. **Deploy automatically**

## Final Architecture

```
GitHub Repositories:
├── chroma-bot-game/              # Backend (Python FastAPI)
└── data-bleed-frontend/          # Frontend (Node.js + Static)

Railway Projects:
├── Backend: https://your-backend-name.up.railway.app
└── Frontend: https://your-frontend-name.up.railway.app
    ├── / (main game)
    ├── /eli_login.html (character chat)
    └── /test-3d-performance-benchmarks.html (performance tests)
```

## Testing the 3-Character Chat

Once deployed, test the chatbot at:
- `https://your-frontend-name.up.railway.app/eli_login.html`
- Select Eli, Maya, or Stanley
- Chat messages will go to your backend API
- Same OpenAI API key powers all characters

## Keeping Repositories in Sync

When you update game features:
1. **Update backend** if changing AI logic
2. **Update frontend** if changing game UI/mechanics
3. **Copy shared files** between repositories as needed

This approach gives you clean separation while keeping everything connected!