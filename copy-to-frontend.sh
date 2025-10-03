#!/bin/bash

# Frontend Repository Copy Script
# This copies all necessary files for the frontend deployment

# Check if destination directory is provided
if [ -z "$1" ]; then
    echo "Usage: ./copy-to-frontend.sh /path/to/frontend-repo"
    echo "Example: ./copy-to-frontend.sh ../data-bleed-frontend"
    exit 1
fi

FRONTEND_REPO="$1"

# Check if destination exists
if [ ! -d "$FRONTEND_REPO" ]; then
    echo "❌ Directory $FRONTEND_REPO does not exist"
    echo "Please clone your new frontend repository first:"
    echo "git clone https://github.com/yourusername/data-bleed-frontend.git"
    exit 1
fi

echo "🚀 Copying frontend files to $FRONTEND_REPO..."

# Copy main HTML files
echo "📄 Copying HTML files..."
cp index.html "$FRONTEND_REPO/" 2>/dev/null || echo "⚠️  index.html not found"
cp eli_login.html "$FRONTEND_REPO/" 2>/dev/null || echo "⚠️  eli_login.html not found"
cp *.html "$FRONTEND_REPO/" 2>/dev/null

# Copy CSS files
echo "🎨 Copying CSS files..."
cp style.css "$FRONTEND_REPO/" 2>/dev/null || echo "⚠️  style.css not found"
cp themes.css "$FRONTEND_REPO/" 2>/dev/null || echo "⚠️  themes.css not found"

# Copy configuration files
echo "⚙️  Copying configuration files..."
cp package-frontend.json "$FRONTEND_REPO/package.json" 2>/dev/null || echo "⚠️  package-frontend.json not found"
cp railway-frontend.json "$FRONTEND_REPO/railway.json" 2>/dev/null || echo "⚠️  railway-frontend.json not found"
cp .env.frontend.template "$FRONTEND_REPO/.env" 2>/dev/null || echo "⚠️  .env.frontend.template not found"

# Copy directories
echo "📁 Copying directories..."

directories=(
    "chroma-bot"
    "js"
    "gameplay-areas"
    "Main_Dashboards"
    "Log_in_formats"
    "Game"
    "tests"
    "docs"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "  📂 Copying $dir/..."
        cp -r "$dir" "$FRONTEND_REPO/"
    else
        echo "  ⚠️  Directory $dir not found"
    fi
done

# Copy test files
echo "🧪 Copying test files..."
cp test-*.html "$FRONTEND_REPO/" 2>/dev/null

# Create a simple README for the frontend
echo "📝 Creating frontend README..."
cat > "$FRONTEND_REPO/README.md" << 'EOF'
# Data Bleed - Frontend

Interactive narrative game with 3D characters exploring digital safety.

## Quick Start

```bash
npm install
npm start
```

Visit: http://localhost:3000

## Environment Variables

```env
BACKEND_URL=https://your-backend-name.up.railway.app
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=production
```

## Game Features

- **Character Chat**: `/eli_login.html` - Chat with Eli, Maya, or Stanley
- **Performance Tests**: `/test-3d-performance-benchmarks.html`
- **Main Game**: `/` - Full interactive experience

## Architecture

This frontend connects to a separate Python FastAPI backend for AI chat functionality.

Backend Repository: [chroma-bot-game](https://github.com/yourusername/chroma-bot-game)
EOF

# Create .gitignore for frontend
echo "🚫 Creating .gitignore..."
cat > "$FRONTEND_REPO/.gitignore" << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~
EOF

echo ""
echo "✅ Frontend files copied successfully!"
echo ""
echo "📋 Next steps:"
echo "1. cd $FRONTEND_REPO"
echo "2. Update .env with your actual backend URL and API key"
echo "3. git add ."
echo "4. git commit -m 'Initial frontend setup with game files'"
echo "5. git push origin main"
echo "6. Connect to Railway and deploy"
echo ""
echo "🔗 Your URLs will be:"
echo "   Backend:  https://your-backend-name.up.railway.app"
echo "   Frontend: https://your-frontend-name.up.railway.app"
echo "   Chat:     https://your-frontend-name.up.railway.app/eli_login.html"
echo "   Tests:    https://your-frontend-name.up.railway.app/test-3d-performance-benchmarks.html"