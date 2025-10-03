#!/usr/bin/env node

/**
 * Setup script for frontend deployment
 * This creates the necessary files for deploying the frontend to Railway
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up frontend deployment files...\n');

// 1. Create package.json for frontend
const frontendPackageJson = {
  "name": "data-bleed-frontend",
  "version": "1.0.0",
  "description": "Data Bleed Game Frontend - Interactive narrative game with 3D characters",
  "main": "chroma-bot/server.js",
  "scripts": {
    "start": "node chroma-bot/server.js",
    "build": "echo 'No build step required for static assets'",
    "dev": "node chroma-bot/server.js",
    "test": "echo 'Frontend tests run in browser'"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "openai": "^4.20.1"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": ["game", "interactive", "narrative", "3d", "education", "safety"],
  "author": "Data Bleed Team",
  "license": "MIT"
};

fs.writeFileSync('package-frontend.json', JSON.stringify(frontendPackageJson, null, 2));
console.log('✅ Created package-frontend.json');

// 2. Create railway.json for frontend
const frontendRailwayJson = {
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
};

fs.writeFileSync('railway-frontend.json', JSON.stringify(frontendRailwayJson, null, 2));
console.log('✅ Created railway-frontend.json');

// 3. Create .env template for frontend
const frontendEnvTemplate = `# Frontend Environment Variables
BACKEND_URL=https://your-backend-name.up.railway.app
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
PORT=3000
`;

fs.writeFileSync('.env.frontend.template', frontendEnvTemplate);
console.log('✅ Created .env.frontend.template');

// 4. Update chroma-bot/server.js to use backend URL
const serverJsPath = 'chroma-bot/server.js';
if (fs.existsSync(serverJsPath)) {
  let serverContent = fs.readFileSync(serverJsPath, 'utf8');
  
  // Add backend URL configuration at the top
  const backendConfig = `
// Backend API configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
console.log('🔗 Backend URL configured:', BACKEND_URL);

`;
  
  // Insert after the requires
  const requiresEnd = serverContent.indexOf('const app = express();');
  if (requiresEnd !== -1) {
    serverContent = serverContent.slice(0, requiresEnd) + backendConfig + serverContent.slice(requiresEnd);
    fs.writeFileSync(serverJsPath + '.updated', serverContent);
    console.log('✅ Created updated chroma-bot/server.js with backend configuration');
  }
}

// 5. Create deployment instructions
const deploymentInstructions = `# Frontend Deployment Instructions

## Quick Setup

1. **Copy these files to your new frontend repository:**
   - Copy \`package-frontend.json\` as \`package.json\`
   - Copy \`railway-frontend.json\` as \`railway.json\`
   - Copy all game files (HTML, JS, CSS, assets)

2. **Set environment variables in Railway:**
   \`\`\`
   BACKEND_URL=https://your-backend-name.up.railway.app
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=production
   \`\`\`

3. **Deploy to Railway:**
   - Connect your new repository to Railway
   - Railway will automatically detect Node.js and deploy

## Testing Your Deployment

### Main Game:
\`https://your-frontend-name.up.railway.app\`

### Character Chat Test:
\`https://your-frontend-name.up.railway.app/eli_login.html\`

### Performance Tests:
\`https://your-frontend-name.up.railway.app/test-3d-performance-benchmarks.html\`

## Character Chat Integration

The 3-character chat system (Eli, Maya, Stanley) will automatically connect to your backend:

\`\`\`javascript
// This is already configured in your game files
const response = await fetch(\`\${BACKEND_URL}/api/chat\`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    character: 'eli', // or 'maya', 'stanley'
    sessionId: sessionId
  })
});
\`\`\`

## Performance Testing Best Practices

Run performance tests after each production update:

1. **Automated Testing:**
   \`https://your-frontend-name.up.railway.app/test-3d-performance-benchmarks.html\`

2. **Quick Validation:**
   \`https://your-frontend-name.up.railway.app/test-local-performance.html\`

3. **Monitor these metrics:**
   - FPS during character emergence
   - Memory usage during gameplay
   - Asset loading times
   - Cross-browser compatibility
`;

fs.writeFileSync('FRONTEND_DEPLOYMENT.md', deploymentInstructions);
console.log('✅ Created FRONTEND_DEPLOYMENT.md');

console.log('\n🎉 Frontend deployment setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Create a new repository for your frontend');
console.log('2. Copy the generated files to the new repository');
console.log('3. Follow the instructions in FRONTEND_DEPLOYMENT.md');
console.log('4. Deploy to Railway');
console.log('\n🔗 Your architecture will be:');
console.log('   Backend:  https://your-backend-name.up.railway.app (AI chat API)');
console.log('   Frontend: https://your-frontend-name.up.railway.app (main game)');
console.log('   Tests:    https://your-frontend-name.up.railway.app/test-3d-performance-benchmarks.html');