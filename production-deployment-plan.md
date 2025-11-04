# Data_Bleed Production Deployment Plan

## 🎯 Deployment Architecture Overview

### Current State Analysis
- **Frontend**: Static HTML/CSS/JS with advanced gaming mechanics
- **Backend**: Dual server architecture (FastAPI + Node.js)
- **AI Integration**: OpenAI GPT-4 with adaptive deception engine
- **Gaming Systems**: Trust scores, time pressure, tactic escalation
- **3D Systems**: Three.js with character emergence and cinematic effects

### Recommended Production Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Setup                          │
├─────────────────────────────────────────────────────────────┤
│  Frontend (CDN)     │  Backend Services    │  Database      │
│  ├─ Static Assets   │  ├─ FastAPI (Main)   │  ├─ Redis      │
│  ├─ Game Files      │  ├─ Node.js (3D)     │  ├─ PostgreSQL │
│  ├─ 3D Assets       │  └─ Load Balancer    │  └─ Analytics  │
│  └─ Gaming Mechanics│                      │                │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Phase 1: Immediate Production Deployment (Railway)

### 1.1 Backend Deployment (FastAPI Primary)

**Railway Service 1: Main API Server**
```yaml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "python main.py"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"

[env]
OPENAI_API_KEY = "${{OPENAI_API_KEY}}"
ENVIRONMENT = "production"
PORT = "8001"
```

**Railway Service 2: Chroma Bot 3D Server**
```yaml
# chroma-bot/railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/3d/capabilities"

[env]
OPENAI_API_KEY = "${{OPENAI_API_KEY}}"
PORT = "3001"
```

### 1.2 Frontend Deployment Options

**Option A: Railway Static Site**
- Deploy frontend as separate Railway service
- Use Railway's static site hosting
- Configure custom domain

**Option B: CDN Deployment (Recommended)**
- Deploy to Vercel/Netlify for better performance
- Configure API endpoints to point to Railway backend
- Enable global CDN for faster loading

### 1.3 Environment Configuration

**Production Environment Variables:**
```bash
# Backend Services
OPENAI_API_KEY=your_openai_key
ENVIRONMENT=production
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
DATABASE_URL=postgresql://... (if needed later)
REDIS_URL=redis://... (for session management)

# Frontend Configuration
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_CHROMA_BOT_URL=https://your-chromabot.railway.app
VITE_ENVIRONMENT=production
```

## 🔧 Phase 2: Production Optimization

### 2.1 Performance Enhancements

**Backend Optimizations:**
```python
# Add to main.py for production
import asyncio
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

# Add middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["your-domain.com", "*.railway.app"]
)

# Connection pooling for OpenAI
from openai import AsyncOpenAI
async_client = AsyncOpenAI(api_key=api_key)
```

**Frontend Optimizations:**
- Implement lazy loading for 3D assets
- Add service worker for offline capability
- Optimize Three.js bundle size
- Implement progressive loading for gaming mechanics

### 2.2 Database Integration

**Session Management (Redis):**
```python
# Add Redis for production session management
import redis
import json

redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

def get_session(session_id: str, character: str) -> Dict[str, Any]:
    try:
        session_data = redis_client.get(f"session:{session_id}")
        if session_data:
            return json.loads(session_data)
    except:
        pass
    
    # Create new session
    session = {
        "character": character,
        "wrong_count": 0,
        "logo_stage": 1,
        "trust_score": 0,
        "created_at": time.time()
    }
    
    redis_client.setex(f"session:{session_id}", 3600, json.dumps(session))
    return session
```

**Analytics Database (PostgreSQL):**
```sql
-- Game analytics tables
CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL,
    character VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    final_trust_score INTEGER,
    total_interactions INTEGER,
    success_rate FLOAT
);

CREATE TABLE player_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    trust_delta INTEGER,
    sophistication_level INTEGER,
    tactic_used VARCHAR(100),
    timestamp TIMESTAMP DEFAULT NOW()
);
```

### 2.3 Monitoring and Analytics

**Health Monitoring:**
```python
# Enhanced health check
@app.get("/api/health/detailed")
async def detailed_health():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "services": {
            "openai": await check_openai_health(),
            "redis": check_redis_health(),
            "database": check_db_health()
        },
        "metrics": {
            "active_sessions": get_active_session_count(),
            "total_interactions": get_total_interactions(),
            "avg_response_time": get_avg_response_time()
        }
    }
```

## 🔒 Phase 3: Security and Compliance

### 3.1 Security Hardening

**API Security:**
```python
from fastapi.security import HTTPBearer
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

# Force HTTPS in production
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(HTTPSRedirectMiddleware)

# Rate limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/chat")
@limiter.limit("30/minute")  # Limit chat requests
async def chat(request: Request, req: ChatRequest):
    # ... existing chat logic
```

**Data Privacy:**
```python
# Add data retention policies
@app.post("/api/gdpr/delete")
async def delete_user_data(session_id: str):
    # Delete all user data for GDPR compliance
    redis_client.delete(f"session:{session_id}")
    # Delete from analytics DB
    return {"status": "deleted"}
```

### 3.2 Content Safety

**AI Response Filtering:**
```python
import re

def filter_response(response: str) -> str:
    # Remove potentially harmful content
    # Add content moderation
    # Ensure educational context is maintained
    return response

# Add to chat endpoint
reply_text = filter_response(response.choices[0].message.content)
```

## 📊 Phase 4: Analytics and Optimization

### 4.1 Game Analytics

**Player Behavior Tracking:**
```javascript
// Frontend analytics
class GameAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.events = [];
    }
    
    trackTrustScoreChange(character, oldScore, newScore, trigger) {
        this.events.push({
            type: 'trust_score_change',
            character,
            oldScore,
            newScore,
            trigger,
            timestamp: Date.now()
        });
    }
    
    trackTimePressureResponse(character, pressureLevel, responseTime) {
        this.events.push({
            type: 'time_pressure_response',
            character,
            pressureLevel,
            responseTime,
            timestamp: Date.now()
        });
    }
    
    async sendBatch() {
        await fetch('/api/analytics/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.sessionId,
                events: this.events
            })
        });
        this.events = [];
    }
}
```

### 4.2 A/B Testing Framework

**Adaptive Mechanics Testing:**
```python
# A/B test different trust score algorithms
@app.post("/api/chat")
async def chat(req: ChatRequest):
    # Determine test group
    test_group = hash(req.sessionId) % 100
    
    if test_group < 50:
        # Group A: Current algorithm
        trust_algorithm = "bayesian_v1"
    else:
        # Group B: Enhanced algorithm
        trust_algorithm = "bayesian_v2"
    
    # Apply different logic based on test group
    # Track results for analysis
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] API keys secured
- [ ] CORS origins updated for production domain
- [ ] Database migrations ready (if using DB)
- [ ] SSL certificates configured
- [ ] CDN configured for static assets

### Deployment Steps
1. **Deploy Backend Services to Railway**
   ```bash
   # Deploy main API
   railway login
   railway link your-main-api-project
   railway up
   
   # Deploy Chroma Bot service
   cd chroma-bot
   railway link your-chromabot-project
   railway up
   ```

2. **Deploy Frontend**
   ```bash
   # If using Vercel
   vercel --prod
   
   # If using Railway static
   railway up
   ```

3. **Configure DNS and SSL**
   - Point custom domain to Railway/Vercel
   - Verify SSL certificates
   - Test all endpoints

### Post-Deployment
- [ ] Health checks passing
- [ ] All game mechanics functional
- [ ] 3D systems working
- [ ] Analytics tracking
- [ ] Performance monitoring active
- [ ] Error tracking configured

## 🔄 Continuous Deployment

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway/cli@v2
        with:
          command: up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## 📈 Scaling Considerations

### Traffic Growth
- **Load Balancing**: Use Railway's built-in load balancing
- **Caching**: Implement Redis caching for frequent requests
- **CDN**: Use global CDN for static assets and API responses
- **Database Scaling**: Move to managed PostgreSQL for persistence

### Feature Expansion
- **Microservices**: Split gaming mechanics into separate services
- **Real-time Features**: Add WebSocket support for live interactions
- **Mobile Support**: Progressive Web App (PWA) configuration
- **Internationalization**: Multi-language support

This deployment plan provides a robust foundation for taking Data_Bleed from development to production while maintaining the sophisticated gaming mechanics and educational effectiveness you've built.