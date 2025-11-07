from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
from typing import Optional, Dict, Any, List
import os, json, re, logging, time, traceback
from openai import OpenAI
from dotenv import load_dotenv
import datetime

# ---------- Logging Configuration ----------
def setup_logging():
    """Configure logging for production monitoring"""
    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)
    
    # Configure logging format
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Set up file handler for production logs
    file_handler = logging.FileHandler("logs/production.log")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter(log_format))
    
    # Set up console handler for development
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter(log_format))
    
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        handlers=[file_handler, console_handler],
        format=log_format
    )
    
    # Create specific loggers
    api_logger = logging.getLogger("api")
    error_logger = logging.getLogger("error")
    openai_logger = logging.getLogger("openai")
    
    return api_logger, error_logger, openai_logger

# Initialize loggers
api_logger, error_logger, openai_logger = setup_logging()

# ---------- Error Response Models ----------
class ErrorResponse(BaseModel):
    error: str
    message: str
    timestamp: str
    request_id: Optional[str] = None

class APIErrorDetail(BaseModel):
    type: str
    message: str
    code: Optional[str] = None

# ---------- Env loading (root or chroma-bot) ----------
def try_load_env():
    # 1) CWD .env
    if os.path.exists(".env"):
        load_dotenv(".env")
    # 2) chroma-bot/.env
    cb_env = os.path.join("chroma-bot", ".env")
    if os.path.exists(cb_env):
        load_dotenv(cb_env)

try_load_env()
api_key = os.getenv("OPENAI_API_KEY")
client = None

if not api_key:
    print("❌ OPENAI_API_KEY not found! Put it in .env or chroma-bot/.env")
    print("🔄 Server will run in demo mode without AI features")
else:
    print("✅ OPENAI_API_KEY loaded successfully.")
    try:
        client = OpenAI(api_key=api_key)
        print("✅ OpenAI client initialized")
    except Exception as e:
        print(f"❌ OpenAI client initialization failed: {e}")
        client = None

# ---------- Config loading (characters.json from either layout) ----------
def load_json_from_candidates(candidates: List[str]) -> Dict[str, Any]:
    for p in candidates:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                return json.load(f)
    raise FileNotFoundError(f"Could not find any of: {candidates}")

CHAR_PATHS = [
    os.path.join("chroma-bot", "assets", "config", "characters.json"),
    "characters.json",
]
try:
    CHARACTERS = load_json_from_candidates(CHAR_PATHS)
    print(f"✅ Loaded characters config from one of {CHAR_PATHS}")
except Exception as e:
    print("❌ Failed to load characters.json:", e)
    CHARACTERS = {}

# ---------- Global knowledge (Shadow Observers etc.) ----------
GLOBAL_KNOWLEDGE = CHARACTERS.get("global_knowledge", {})

def match_global_knowledge(user_msg: str) -> Optional[str]:
    msg = user_msg.lower().strip()
    for key, value in GLOBAL_KNOWLEDGE.items():
        if key.lower() in msg:
            return value
    return None

# ---------- In-memory session state (dev) ----------
# NOTE: for production, move this to Redis or a DB.
session_state: Dict[str, Dict[str, Any]] = {}

def get_session(session_id: str, character: str) -> Dict[str, Any]:
    if session_id not in session_state:
        session_state[session_id] = {
            "character": character,
            "wrong_count": 0,
            "logo_stage": 1,  # 1..5
        }
    # If character switched mid-session, reset isolation
    if session_state[session_id]["character"] != character:
        session_state[session_id] = {"character": character, "wrong_count": 0, "logo_stage": 1}
    return session_state[session_id]

# ---------- Helpers ----------
def contains_any(text: str, keywords: List[str]) -> bool:
    t = text.lower()
    return any(k.lower() in t for k in keywords)

def match_knowledge(user_msg: str, knowledge: List[Dict[str, str]]) -> Optional[str]:
    """Very light retrieval: substring match on 'q' field."""
    msg = user_msg.lower().strip()
    for item in knowledge:
        q = item.get("q", "").lower()
        if q and q in msg:
            return item.get("a", None)
    return None

def decide_outcome_and_update(session: Dict[str, Any], char_cfg: Dict[str, Any], user_msg: str, used_ai_fallback: bool) -> str:
    """Returns 'success', 'fail', or 'neutral'. Updates wrong_count/logo_stage."""
    rules = char_cfg.get("intent_rules", {})
    thresholds = char_cfg.get("thresholds", {"warn_after": 2, "fail_after": 4})

    # Keyword overrides first
    if contains_any(user_msg, rules.get("success_keywords", [])):
        session["wrong_count"] = max(0, session.get("wrong_count", 0) - 1)
        session["logo_stage"] = 1
        return "success"

    if contains_any(user_msg, rules.get("fail_keywords", [])):
        session["wrong_count"] = session.get("wrong_count", 0) + 1
        session["logo_stage"] = min(5, session.get("logo_stage", 1) + 1)
        if session["wrong_count"] >= thresholds.get("fail_after", 4):
            return "fail"
        return "neutral"

    # If fallback AI was used, nudge wrong count
    if used_ai_fallback:
        session["wrong_count"] = session.get("wrong_count", 0) + 1
        if session["wrong_count"] >= thresholds.get("warn_after", 2):
            session["logo_stage"] = min(5, session.get("logo_stage", 1) + 1)
        if session["wrong_count"] >= thresholds.get("fail_after", 4):
            return "fail"
        return "neutral"

    return "neutral"





def build_system_prompt(character: str, char_cfg: Dict[str, Any], persona_prompt: str) -> str:
    # The 'base' is now the dynamic persona we've chosen
    base = persona_prompt
    lore = char_cfg.get("lore", "")
    guardrails = (
        "Stay strictly in-character. Be concise. Your goal is to advance the narrative of the Data_Bleed game."
    )
    return f"{base}\n\nGame Lore Context:\n{lore}\n\nRules:\n{guardrails}"



# ---------- FastAPI ----------
app = FastAPI(title="Data_Bleed API", version="1.0.0")

# ---------- Request Logging Middleware ----------
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests for production monitoring"""
    start_time = time.time()
    request_id = f"{int(time.time())}-{hash(str(request.url)) % 10000}"
    
    # Log request details
    api_logger.info(f"Request {request_id}: {request.method} {request.url}")
    api_logger.info(f"Request {request_id}: Headers: {dict(request.headers)}")
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Log response details
        api_logger.info(f"Request {request_id}: Status {response.status_code} - {process_time:.3f}s")
        
        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id
        
        return response
        
    except Exception as e:
        process_time = time.time() - start_time
        error_logger.error(f"Request {request_id}: Exception after {process_time:.3f}s - {str(e)}")
        error_logger.error(f"Request {request_id}: Traceback: {traceback.format_exc()}")
        
        # Return structured error response
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal Server Error",
                "message": "An unexpected error occurred",
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
                "request_id": request_id
            }
        )

# ---------- Global Exception Handler ----------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions"""
    request_id = getattr(request.state, 'request_id', 'unknown')
    
    error_logger.error(f"Unhandled exception in request {request_id}: {str(exc)}")
    error_logger.error(f"Traceback: {traceback.format_exc()}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "request_id": request_id
        }
    )

# ---------- Validation Error Handler ----------
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    """Handle Pydantic validation errors"""
    request_id = getattr(request.state, 'request_id', 'unknown')
    
    error_logger.warning(f"Validation error in request {request_id}: {str(exc)}")
    
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "message": "Invalid request data",
            "details": exc.errors(),
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "request_id": request_id
        }
    )

# ---------- HTTP Exception Handler ----------
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with enhanced logging"""
    request_id = getattr(request.state, 'request_id', 'unknown')
    
    if exc.status_code >= 500:
        error_logger.error(f"HTTP {exc.status_code} in request {request_id}: {exc.detail}")
    else:
        api_logger.warning(f"HTTP {exc.status_code} in request {request_id}: {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": f"HTTP {exc.status_code}",
            "message": exc.detail,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "request_id": request_id
        }
    )

@app.get("/")
def root():
    # This will be overridden by static files, but needed for health check routing
    return {"message": "Data_Bleed API is running", "version": "1.0.0"}

# ✅ --- CORS CONFIGURATION WITH ENVIRONMENT DETECTION ---
# Different origins for production vs development environments
def get_cors_origins():
    """Get CORS origins based on environment"""
    # Check if running in production (Railway sets PORT environment variable)
    is_production = os.getenv("RAILWAY_ENVIRONMENT") or os.getenv("PORT")
    
    if is_production:
        # Production-only origins for security
        return [
            "https://chroma-bot-game.vercel.app",  # Vercel frontend production URL
            "https://data-bleed-vsc-game.vercel.app",  # Legacy URL (if still in use)
        ]
    else:
        # Development origins
        return [
            "https://data-bleed-vsc-game.vercel.app",  # Also allow production URL in dev
            "http://127.0.0.1:8080", 
            "http://localhost:8080",
            "http://127.0.0.1:3001",
            "http://localhost:3001",
            "http://localhost:3000",
            "null"  # For local file:// protocol testing
        ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"], 
    allow_headers=["*"],
)




class ChatRequest(BaseModel):
    message: str
    character: str
    sessionId: Optional[str] = "default"  # frontend can pass a UUID later

@app.get("/api/health")
async def health(request: Request):
    """Enhanced health check with detailed configuration status and error reporting"""
    request_id = getattr(request.state, 'request_id', 'unknown')
    
    try:
        api_logger.info(f"Health check {request_id}: Starting comprehensive health assessment")
        
        # Check environment variables
        env_status = {
            "openai_api_key_set": bool(os.getenv("OPENAI_API_KEY")),
            "openai_api_key_length": len(os.getenv("OPENAI_API_KEY", "")),
            "railway_environment": os.getenv("RAILWAY_ENVIRONMENT"),
            "port": os.getenv("PORT"),
            "environment": "production" if (os.getenv("RAILWAY_ENVIRONMENT") or os.getenv("PORT")) else "development"
        }
        
        # Check OpenAI client status with detailed error reporting
        openai_status = {
            "client_initialized": bool(client),
            "api_key_valid": False,
            "last_test_time": None,
            "error_details": None
        }
        
        # Test OpenAI API key validity (quick test)
        if client:
            try:
                openai_logger.info(f"Health check {request_id}: Testing OpenAI API connectivity")
                start_time = time.time()
                
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": "health check"}],
                    max_tokens=1,
                    temperature=0,
                    timeout=10  # 10 second timeout for health check
                )
                
                test_duration = time.time() - start_time
                openai_status.update({
                    "api_key_valid": True,
                    "last_test_time": datetime.datetime.utcnow().isoformat() + "Z",
                    "test_duration_seconds": round(test_duration, 3),
                    "model_used": "gpt-4o-mini"
                })
                
                openai_logger.info(f"Health check {request_id}: OpenAI API test successful ({test_duration:.3f}s)")
                
            except Exception as e:
                error_str = str(e)
                openai_status.update({
                    "api_key_valid": False,
                    "error_details": {
                        "message": error_str[:200],  # Truncate long error messages
                        "type": type(e).__name__,
                        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
                    }
                })
                
                openai_logger.error(f"Health check {request_id}: OpenAI API test failed - {error_str}")
        
        # Check characters configuration
        characters_status = {
            "characters_loaded": list(CHARACTERS.keys()),
            "character_count": len(CHARACTERS),
            "global_knowledge_loaded": bool(GLOBAL_KNOWLEDGE),
            "config_file_found": bool(CHARACTERS)
        }
        
        # Check system resources and performance
        system_status = {
            "session_count": len(session_state),
            "uptime_check": True,  # If we're responding, we're up
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
        }
        
        # Determine overall status with detailed reasoning
        status_checks = {
            "openai_available": bool(client and openai_status["api_key_valid"]),
            "characters_loaded": bool(CHARACTERS),
            "environment_configured": bool(env_status["openai_api_key_set"]),
            "cors_configured": bool(get_cors_origins())
        }
        
        if all(status_checks.values()):
            overall_status = "healthy"
        elif not client:
            overall_status = "demo_mode"
        elif not openai_status["api_key_valid"]:
            overall_status = "api_key_invalid"
        elif not CHARACTERS:
            overall_status = "no_characters"
        else:
            overall_status = "partial"
        
        # Log health check result
        api_logger.info(f"Health check {request_id}: Status={overall_status}, Checks={status_checks}")
        
        return {
            "ok": True,
            "status": overall_status,
            "status_checks": status_checks,
            "environment": env_status,
            "openai": openai_status,
            "characters": characters_status,
            "system": system_status,
            "cors_origins": get_cors_origins(),
            "request_id": request_id,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
        }
        
    except Exception as e:
        error_logger.error(f"Health check {request_id}: Critical error - {str(e)}")
        error_logger.error(f"Health check traceback: {traceback.format_exc()}")
        
        # Return minimal health status even if detailed check fails
        return JSONResponse(
            status_code=503,
            content={
                "ok": False,
                "status": "error",
                "error": "Health check failed",
                "message": str(e)[:200],
                "request_id": request_id,
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
            }
        )

@app.get("/api/characters")
async def list_characters(request: Request):
    """List available characters with error handling"""
    request_id = getattr(request.state, 'request_id', 'unknown')
    
    try:
        api_logger.info(f"Characters request {request_id}: Listing available characters")
        
        if not CHARACTERS:
            api_logger.warning(f"Characters request {request_id}: No characters loaded")
            raise HTTPException(
                status_code=503, 
                detail="Character configuration not loaded. Please check server configuration."
            )
        
        characters_list = list(CHARACTERS.keys())
        api_logger.info(f"Characters request {request_id}: Returning {len(characters_list)} characters")
        
        return {
            "characters": characters_list,
            "count": len(characters_list),
            "request_id": request_id,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        error_logger.error(f"Characters request {request_id}: Unexpected error - {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve characters")

@app.post("/api/reset")
async def reset_session(request: Request, sessionId: Optional[str] = "default"):
    """Reset session with enhanced logging and validation"""
    request_id = getattr(request.state, 'request_id', 'unknown')
    
    try:
        api_logger.info(f"Reset request {request_id}: Resetting session {sessionId}")
        
        # Validate session ID
        if not sessionId or len(sessionId) > 100:  # Reasonable limit
            raise HTTPException(status_code=400, detail="Invalid session ID")
        
        # Check if session exists
        session_existed = sessionId in session_state
        
        # Remove session
        session_state.pop(sessionId, None)
        
        api_logger.info(f"Reset request {request_id}: Session {sessionId} reset (existed: {session_existed})")
        
        return {
            "ok": True,
            "session_id": sessionId,
            "session_existed": session_existed,
            "request_id": request_id,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        error_logger.error(f"Reset request {request_id}: Unexpected error - {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to reset session")

# ---------- Persona Prompts ----------
GUARDIAN_PROMPT = "You are a calm, empathetic guide. Your goal is to help the player spot red flags and stay safe."
DECEIVER_PROMPT = "You are manipulative, deceptive, and persuasive. Your goal is to lure the player into making risky decisions."


@app.post("/api/chat")
async def chat(req: ChatRequest, request: Request):
    """Enhanced chat endpoint with comprehensive error handling and fallbacks"""
    request_id = getattr(request.state, 'request_id', 'unknown')
    
    try:
        # Input validation and sanitization
        character = (req.character or "").lower().strip()
        user_message = req.message.strip()
        session_id = req.sessionId or "default"
        
        # Log chat request
        api_logger.info(f"Chat request {request_id}: character={character}, session={session_id}, message_length={len(user_message)}")
        
        # Validate character
        if not character:
            raise HTTPException(status_code=400, detail="Character is required")
        
        if character not in CHARACTERS:
            available_chars = ", ".join(CHARACTERS.keys())
            raise HTTPException(
                status_code=400, 
                detail=f"Unknown character '{character}'. Available characters: {available_chars}"
            )
        
        # Validate message
        if not user_message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        if len(user_message) > 1000:  # Reasonable limit
            raise HTTPException(status_code=400, detail="Message too long (max 1000 characters)")
        
        # Get character configuration and session
        char_cfg = CHARACTERS[character]
        session = get_session(session_id, character)
        trust_score = session.get("trust_score", 0)

        # Update trust_score based on intent_rules
        rules = char_cfg.get("intent_rules", {})
        if contains_any(user_message, rules.get("success_keywords", [])):
            trust_score -= 20
        elif contains_any(user_message, rules.get("fail_keywords", [])):
            trust_score += 20
        session["trust_score"] = trust_score

        # Select persona based on trust_score
        if trust_score >= 0:
            persona_prompt = DECEIVER_PROMPT
            persona = "deceiver"
        else:
            persona_prompt = GUARDIAN_PROMPT
            persona = "guardian"

        # Build system prompt with persona
        system_prompt = build_system_prompt(character, char_cfg, persona_prompt)

        # Generate AI response with enhanced error handling
        reply_text = await generate_ai_response(
            character, user_message, system_prompt, request_id
        )
        
        # Log successful response
        api_logger.info(f"Chat response {request_id}: success, reply_length={len(reply_text)}")

        return {
            "reply": reply_text,
            "trust_score": trust_score,
            "persona": persona,
            "request_id": request_id
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions (they're handled by the HTTP exception handler)
        raise
    except Exception as e:
        # Log unexpected errors
        error_logger.error(f"Unexpected error in chat {request_id}: {str(e)}")
        error_logger.error(f"Traceback: {traceback.format_exc()}")
        
        # Return fallback response
        return {
            "reply": "⚠️ I'm experiencing technical difficulties right now. Please try again in a moment.",
            "trust_score": 0,
            "persona": "guardian",
            "request_id": request_id,
            "error": "Technical difficulties"
        }

async def generate_ai_response(character: str, user_message: str, system_prompt: str, request_id: str) -> str:
    """Generate AI response with multiple fallback strategies"""
    
    # Strategy 1: Try OpenAI API if client is available
    if client:
        try:
            openai_logger.info(f"OpenAI request {request_id}: Calling GPT-4o-mini for character {character}")
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=220,
                temperature=0.6,
                timeout=30  # 30 second timeout
            )
            
            reply_text = response.choices[0].message.content
            openai_logger.info(f"OpenAI response {request_id}: Success, tokens used: {response.usage.total_tokens}")
            
            return reply_text
            
        except Exception as e:
            openai_logger.error(f"OpenAI API error {request_id}: {str(e)}")
            
            # Check specific error types for better fallbacks
            error_str = str(e).lower()
            
            if "rate limit" in error_str or "429" in error_str:
                openai_logger.warning(f"Rate limit hit {request_id}, using rate limit fallback")
                return get_rate_limit_fallback(character, user_message)
            
            elif "timeout" in error_str or "connection" in error_str:
                openai_logger.warning(f"Connection timeout {request_id}, using connection fallback")
                return get_connection_fallback(character, user_message)
            
            elif "invalid" in error_str or "400" in error_str:
                openai_logger.warning(f"Invalid request {request_id}, using invalid request fallback")
                return get_invalid_request_fallback(character, user_message)
            
            else:
                openai_logger.warning(f"Unknown OpenAI error {request_id}, using generic fallback")
                return get_generic_ai_fallback(character, user_message)
    
    # Strategy 2: No OpenAI client available - use demo mode
    openai_logger.info(f"Demo mode {request_id}: No OpenAI client available")
    return get_demo_mode_response(character, user_message)

def get_rate_limit_fallback(character: str, user_message: str) -> str:
    """Fallback for rate limit errors"""
    responses = {
        "maya": f"⏳ Maya here - I'm getting a lot of messages right now. Give me a moment to process your message about '{user_message[:30]}...' and I'll respond thoughtfully.",
        "eli": f"⏳ Eli speaking - Whoa, lots of activity! Let me catch up on your message about '{user_message[:30]}...' Just need a sec to think it through.",
        "stanley": f"⏳ Stanley here - I'm processing many conversations right now. Your message about '{user_message[:30]}...' is important, just give me a moment."
    }
    return responses.get(character, "⏳ I'm experiencing high traffic right now. Please try again in a moment.")

def get_connection_fallback(character: str, user_message: str) -> str:
    """Fallback for connection/timeout errors"""
    responses = {
        "maya": f"🔄 Maya here - I'm having some connection issues, but I caught your message about '{user_message[:30]}...' Let me give you a quick response while I reconnect.",
        "eli": f"🔄 Eli speaking - Network's being wonky, but I heard you mention '{user_message[:30]}...' Let me work with what I've got here.",
        "stanley": f"🔄 Stanley here - Technical difficulties on my end, but regarding your message about '{user_message[:30]}...' I can still help you out."
    }
    return responses.get(character, "🔄 I'm experiencing connection issues. Please try again shortly.")

def get_invalid_request_fallback(character: str, user_message: str) -> str:
    """Fallback for invalid request errors"""
    responses = {
        "maya": f"🤔 Maya here - Something about your message '{user_message[:30]}...' is causing me technical issues. Could you rephrase that?",
        "eli": f"🤔 Eli speaking - Your message '{user_message[:30]}...' is breaking my brain a bit. Mind trying a different way to say that?",
        "stanley": f"🤔 Stanley here - I'm having trouble processing '{user_message[:30]}...' Could you try asking that differently?"
    }
    return responses.get(character, "🤔 I'm having trouble understanding that request. Could you rephrase it?")

def get_generic_ai_fallback(character: str, user_message: str) -> str:
    """Generic fallback for unknown AI errors"""
    responses = {
        "maya": f"⚠️ Maya here - I'm having some technical difficulties, but I understand you're asking about '{user_message[:30]}...' Let me try to help despite the issues.",
        "eli": f"⚠️ Eli speaking - My AI systems are acting up, but I caught your message about '{user_message[:30]}...' I'll do my best to respond.",
        "stanley": f"⚠️ Stanley here - Technical problems on my end, but regarding '{user_message[:30]}...' I'll give you what I can."
    }
    return responses.get(character, "⚠️ I'm experiencing technical difficulties. Please try again later.")

def get_demo_mode_response(character: str, user_message: str) -> str:
    """Demo mode responses when no OpenAI client is available"""
    demo_responses = {
        "maya": f"👋 Hi! I'm Maya. I received your message: '{user_message[:50]}...' This is demo mode - add your OpenAI API key for full AI responses.",
        "eli": f"👋 Hey! Eli here. Got your message: '{user_message[:50]}...' Running in demo mode - need OpenAI API key for smart responses.",
        "stanley": f"👋 Hello! Stanley speaking. About your message: '{user_message[:50]}...' This is demo mode - please configure OpenAI API key."
    }
    return demo_responses.get(character, "👋 Demo mode - please configure OpenAI API key for full functionality.")
# ---------- Static File Serving ----------
# Serve the game files (HTML, CSS, JS, assets)
# Mount static files at /static to avoid conflicts with API routes
app.mount("/static", StaticFiles(directory=".", html=True), name="static")

# Also serve index.html at root for convenience
@app.get("/game")
def serve_game():
    from fastapi.responses import FileResponse
    return FileResponse("index.html")

print("🎮 Game files will be served at /static/")
print("🌐 Main game at: /static/index.html")
print("🧪 Performance tests at: /static/test-3d-performance-benchmarks.html")
print("💬 Character chat at: /static/eli_login.html")

# ---------- Server Startup ----------
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Data_Bleed FastAPI server...")
    uvicorn.run(app, host="0.0.0.0", port=8001)