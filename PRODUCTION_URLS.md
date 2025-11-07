# Production URLs - Data Bleed Game

**Last Updated**: November 7, 2025

## Live Production URLs

### Frontend (Vercel)
```
https://chroma-bot-game.vercel.app
```
**Status**: ✅ OPERATIONAL

### Backend (Railway)
```
https://chroma-bot-game-production.up.railway.app
```
**Status**: 🔄 DEPLOYING (check logs)

## API Endpoints

Base URL: `https://chroma-bot-game-production.up.railway.app`

- **Health Check**: `/api/health`
- **Characters List**: `/api/characters`
- **Chat**: `/api/chat` (POST)
- **Reset Session**: `/api/reset` (POST)

## Testing Commands

```bash
# Test backend health
curl https://chroma-bot-game-production.up.railway.app/api/health

# Test frontend
curl https://chroma-bot-game.vercel.app

# Run automated tests
python3 verify-railway-deployment.py
node end-to-end-production-test.js
```

## Configuration Files Updated

- ✅ `js/api-config.js` - Frontend API configuration
- ✅ `main.py` - Backend CORS configuration
- ✅ `PRODUCTION_URLS.md` - This reference document

## Notes

- Railway URL changed from `data-bleed-backend.up.railway.app` to `chroma-bot-game-production.up.railway.app`
- Both Vercel URLs are supported in CORS for backward compatibility
- If you see 502 errors, the backend may be restarting (check Railway logs)
