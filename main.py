from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import os, json, re
from openai import OpenAI
from dotenv import load_dotenv

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
if not api_key:
    print("❌ OPENAI_API_KEY not found! Put it in .env or chroma-bot/.env")
else:
    print("✅ OPENAI_API_KEY loaded successfully.")

client = OpenAI(api_key=api_key)

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

# Root endpoint removed - will be handled by static files

# ✅ --- THIS IS THE FINAL, CORRECTED CORS CONFIGURATION ---
# It uses your specific origins and explicitly allows the methods needed
# for the browser's preflight check to succeed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8080", 
        "http://localhost:8080",
        "http://127.0.0.1:3001",
        "http://localhost:3001",    # This is what's missing!
        "http://localhost:3000",
        "https://data-bleed-backend.up.railway.app",
        "null"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"], 
    allow_headers=["*"],
)




class ChatRequest(BaseModel):
    message: str
    character: str
    sessionId: Optional[str] = "default"  # frontend can pass a UUID later

@app.get("/api/health")
def health():
    return {
        "ok": True, 
        "characters_loaded": list(CHARACTERS.keys()),
        "openai_configured": bool(api_key),
        "status": "healthy"
    }

@app.get("/api/characters")
def list_characters():
    return {"characters": list(CHARACTERS.keys())}

@app.post("/api/reset")
def reset_session(sessionId: Optional[str] = "default"):
    session_state.pop(sessionId, None)
    return {"ok": True}

# ---------- Persona Prompts ----------
GUARDIAN_PROMPT = "You are a calm, empathetic guide. Your goal is to help the player spot red flags and stay safe."
DECEIVER_PROMPT = "You are manipulative, deceptive, and persuasive. Your goal is to lure the player into making risky decisions."


@app.post("/api/chat")
async def chat(req: ChatRequest):
    character = (req.character or "").lower().strip()
    user_message = req.message.strip()
    session_id = req.sessionId or "default"

    if character not in CHARACTERS:
        return {
            "reply": "Unknown character. Choose Maya, Eli, or Stanley.",
            "trust_score": 0,
            "persona": None
        }

    char_cfg = CHARACTERS[character]
    session = get_session(session_id, character)
    trust_score = session.get("trust_score", 0)

    # --- Update trust_score based on intent_rules ---
    rules = char_cfg.get("intent_rules", {})
    if contains_any(user_message, rules.get("success_keywords", [])):
        trust_score -= 20
    elif contains_any(user_message, rules.get("fail_keywords", [])):
        trust_score += 20
    session["trust_score"] = trust_score

    # --- Select persona based on trust_score ---
    if trust_score >= 0:
        persona_prompt = DECEIVER_PROMPT
        persona = "deceiver"
    else:
        persona_prompt = GUARDIAN_PROMPT
        persona = "guardian"

    # --- Build system prompt with persona ---
    system_prompt = build_system_prompt(character, char_cfg, persona_prompt)

    # --- Call GPT ---
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=220,
            temperature=0.6
        )
        reply_text = response.choices[0].message.content
    except Exception as e:
        print("❌ Error calling OpenAI:", e)
        reply_text = "⚠️ Backend error, please try again later."

    return {
        "reply": reply_text,
        "trust_score": trust_score,
        "persona": persona
    }
# ---------- Static File Serving ----------
# Serve the game files (HTML, CSS, JS, assets)
# This allows the same server to handle both API calls and serve the game

# Mount static files AFTER API routes to avoid conflicts
# The "/" mount must come last so API routes work
app.mount("/", StaticFiles(directory=".", html=True), name="static")

print("🎮 Game files will be served from the root directory")
print("🌐 Access the game at the Railway URL")
print("🧪 Performance tests at: /test-3d-performance-benchmarks.html")
print("💬 Character chat at: /eli_login.html")