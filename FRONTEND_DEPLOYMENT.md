# Frontend Deployment Instructions

## Quick Setup

1. **Copy these files to your new frontend repository:**
   - Copy `package-frontend.json` as `package.json`
   - Copy `railway-frontend.json` as `railway.json`
   - Copy all game files (HTML, JS, CSS, assets)

2. **Set environment variables in Railway:**
   ```
   BACKEND_URL=https://your-backend-name.up.railway.app
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=production
   ```

3. **Deploy to Railway:**
   - Connect your new repository to Railway
   - Railway will automatically detect Node.js and deploy

## Testing Your Deployment

### Main Game:
`https://your-frontend-name.up.railway.app`

### Character Chat Test:
`https://your-frontend-name.up.railway.app/eli_login.html`

### Performance Tests:
`https://your-frontend-name.up.railway.app/test-3d-performance-benchmarks.html`

## Character Chat Integration

The 3-character chat system (Eli, Maya, Stanley) will automatically connect to your backend:

```javascript
// This is already configured in your game files
const response = await fetch(`${BACKEND_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    character: 'eli', // or 'maya', 'stanley'
    sessionId: sessionId
  })
});
```

## Performance Testing Best Practices

Run performance tests after each production update:

1. **Automated Testing:**
   `https://your-frontend-name.up.railway.app/test-3d-performance-benchmarks.html`

2. **Quick Validation:**
   `https://your-frontend-name.up.railway.app/test-local-performance.html`

3. **Monitor these metrics:**
   - FPS during character emergence
   - Memory usage during gameplay
   - Asset loading times
   - Cross-browser compatibility
