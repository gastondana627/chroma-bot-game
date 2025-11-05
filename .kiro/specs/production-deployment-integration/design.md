# Production Deployment Integration Design

## Overview

The production deployment integration connects the Data Bleed game's frontend (Vercel) and backend (Railway) into a cohesive system. The design implements a client-server architecture where the static frontend communicates with the FastAPI backend through secure HTTP requests, enabling full game functionality in production.

## Architecture

### High-Level Architecture

```
[User Browser] 
    ↓ HTTPS
[Vercel Frontend] ← Static Files (HTML/CSS/JS)
    ↓ API Calls (HTTPS)
[Railway Backend] ← FastAPI + OpenAI Integration
    ↓ External API
[OpenAI API]
```

### Component Interaction Flow

1. **Initial Load**: User accesses Vercel URL → Frontend serves static game files
2. **Game Initialization**: Frontend JavaScript detects production environment → Sets API base URL to Railway endpoint
3. **Character Interaction**: User chats with character → Frontend sends POST to Railway `/api/chat` → Backend processes with OpenAI → Response returned to frontend
4. **Session Management**: Backend maintains session state → Frontend receives trust scores and persona updates

## Components and Interfaces

### Frontend System (Vercel)

**Purpose**: Serve static game files and handle user interactions

**Key Files**:
- `index.html` - Main game entry point
- `eli_login.html` - Character interaction interface  
- `js/` - Game logic and API communication
- `Game/Mechanics/` - Gaming system integration

**API Integration**:
```javascript
// Environment detection
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8001' 
  : 'https://your-railway-app.railway.app';

// API calls
fetch(`${API_BASE_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message, character, sessionId })
});
```

### Backend System (Railway)

**Purpose**: Handle API requests, OpenAI integration, and game logic

**Key Components**:
- FastAPI application (`main.py`)
- OpenAI client integration
- Character configuration system
- Session state management
- CORS middleware for cross-origin requests

**API Endpoints**:
- `GET /api/health` - System health check
- `GET /api/characters` - Available character list
- `POST /api/chat` - Character interaction
- `POST /api/reset` - Session reset

### Environment Configuration

**Frontend Environment Variables** (Vercel):
```javascript
// Auto-detected based on hostname
const PRODUCTION_API_URL = 'https://your-railway-app.railway.app';
const DEVELOPMENT_API_URL = 'http://localhost:8001';
```

**Backend Environment Variables** (Railway):
```
OPENAI_API_KEY=your_openai_key
PORT=8001
```

## Data Models

### API Request/Response Models

**Chat Request**:
```json
{
  "message": "string",
  "character": "maya|eli|stanley", 
  "sessionId": "string (optional)"
}
```

**Chat Response**:
```json
{
  "reply": "string",
  "trust_score": "number",
  "persona": "guardian|deceiver"
}
```

**Health Check Response**:
```json
{
  "ok": true,
  "characters_loaded": ["maya", "eli", "stanley"],
  "openai_configured": true,
  "status": "healthy"
}
```

## Error Handling

### Frontend Error Handling

1. **Network Errors**: Display user-friendly messages for connection issues
2. **API Errors**: Handle 4xx/5xx responses with appropriate feedback
3. **Timeout Handling**: Implement request timeouts with retry logic
4. **Fallback Behavior**: Graceful degradation when backend is unavailable

### Backend Error Handling

1. **OpenAI API Failures**: Return fallback responses when AI service is down
2. **Invalid Requests**: Validate input and return proper HTTP status codes
3. **Rate Limiting**: Implement request throttling for production stability
4. **Logging**: Comprehensive error logging for debugging

## Testing Strategy

### Deployment Verification Tests

1. **Frontend Deployment Test**:
   - Verify Vercel URL loads correctly
   - Check all static assets load without errors
   - Validate JavaScript executes properly

2. **Backend Deployment Test**:
   - Test Railway health endpoint
   - Verify OpenAI API key configuration
   - Check CORS headers are properly set

3. **Integration Tests**:
   - End-to-end character chat functionality
   - Session management across requests
   - Error handling scenarios

### Production Monitoring

1. **Health Checks**: Automated monitoring of both deployments
2. **Performance Metrics**: Response time and error rate tracking
3. **Uptime Monitoring**: Continuous availability verification
4. **Log Analysis**: Error pattern detection and alerting

## Security Considerations

### CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-vercel-app.vercel.app",
        "http://localhost:3000"  # Development only
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
```

### API Key Security

- OpenAI API keys stored as Railway environment variables
- No sensitive credentials exposed to frontend
- Secure transmission over HTTPS only

### Session Security

- Session IDs generated securely
- No persistent storage of sensitive user data
- Stateless session management for scalability