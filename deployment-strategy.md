# Single Codebase Deployment Strategy

## Current Repository Structure
```
chroma-bot-game/
├── main.py                    # Python FastAPI backend
├── chroma-bot/server.js       # Node.js frontend server
├── index.html                 # Main game entry
├── js/                        # All game JavaScript
├── gameplay-areas/            # Game content
├── tests/                     # Performance tests
└── test-3d-performance-benchmarks.html
```

## Deployment Strategy

### Backend Deployment (Current Railway Project)
**What it serves:** AI chat API only
**Files used:** 
- `main.py`, `start.py`, `requirements.txt`
- `Dockerfile`, `railway.json`

**URL:** `https://your-backend-name.up.railway.app`
**Endpoints:**
- `/api/health` - Health check
- `/api/chat` - AI chat for all characters
- `/api/characters` - List available characters

### Frontend Deployment (New Railway Project)
**What it serves:** Complete game + performance tests
**Files used:** Everything else (HTML, JS, CSS, assets)

**URL:** `https://your-frontend-name.up.railway.app`
**Pages:**
- `/` - Main game (index.html)
- `/eli_login.html` - Character login
- `/test-3d-performance-benchmarks.html` - Performance tests
- All gameplay areas and dashboards

## How They Connect

### Frontend → Backend Communication
```javascript
// In your frontend JavaScript files
const BACKEND_URL = 'https://your-backend-name.up.railway.app';

// Chat with any character (Eli, Maya, Stanley)
async function sendMessage(message, character) {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: message,
            character: character,  // 'eli', 'maya', or 'stanley'
            sessionId: 'player-session'
        })
    });
    return response.json();
}
```

### Environment Variables
**Backend (.env):**
```
OPENAI_API_KEY=your_same_api_key_here
PORT=8000
```

**Frontend (.env):**
```
BACKEND_URL=https://your-backend-name.up.railway.app
OPENAI_API_KEY=your_same_api_key_here  # For direct calls if needed
```