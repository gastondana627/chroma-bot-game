from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

def build_system_prompt(character: str, char_cfg: Dict[str, Any]) -> str:
    base = char_cfg.get("system_prompt", "")
    lore = char_cfg.get("lore", "")
    guardrails = (
        "You are a game navigator. Stay strictly in-character. "
        "Never mention other characters unless the player is explicitly in a crossover arc. "
        "Only speak about the Chroma Awards, the Data_Bleed game, the player’s choices, and hints/clues. "
        "Be concise and game-guiding, not poetic unless your character’s style calls for it."
    )
    return f"{base}\n\nLore:\n{lore}\n\nRules:\n{guardrails}"

# ---------- FastAPI ----------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    character: str
    sessionId: Optional[str] = "default"  # frontend can pass a UUID later

@app.get("/api/health")
def health():
    return {"ok": True, "characters_loaded": list(CHARACTERS.keys())}

@app.get("/api/characters")
def list_characters():
    return {"characters": list(CHARACTERS.keys())}

@app.post("/api/reset")
def reset_session(sessionId: Optional[str] = "default"):
    session_state.pop(sessionId, None)
    return {"ok": True}

@app.post("/api/chat")
async def chat(req: ChatRequest):
    character = (req.character or "").lower().strip()
    user_message = req.message.strip()
    session_id = req.sessionId or "default"

    print(f"[{character}] User: {user_message}")

    if character not in CHARACTERS:
        return {"reply": "Unknown character. Choose Maya, Eli, or Stanley.", "outcome": "neutral", "stage": 1}

    char_cfg = CHARACTERS[character]
    session = get_session(session_id, character)
    knowledge = char_cfg.get("knowledge", [])

    # 1) Global knowledge override
    global_hit = match_global_knowledge(user_message)
    if global_hit:
        reply_text = global_hit
        used_ai_fallback = False
    else:
        # 2) Character knowledge
        used_ai_fallback = False
        kb_hit = match_knowledge(user_message, knowledge)
        if kb_hit:
            reply_text = kb_hit
        else:
            used_ai_fallback = True
            # 3) OpenAI fallback
            system_prompt = build_system_prompt(character, char_cfg)
            try:
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "system", "content": "Relevant facts:\n" + "\n".join([f"- {k.get('a','')}" for k in knowledge[:6]])},
                        {"role": "user", "content": user_message}
                    ],
                    max_tokens=220,
                    temperature=0.6
                )
                reply_text = response.choices[0].message.content
            except Exception as e:
                print("❌ Error calling OpenAI:", e)
                reply_text = "⚠️ Backend error, please try again later."

    # 4) Outcome logic
    outcome = decide_outcome_and_update(session, char_cfg, user_message, used_ai_fallback)
    stage = int(session.get("logo_stage", 1))

    print(f"[{character}] outcome={outcome} stage={stage}")
    print(f"[{character}] Bot: {reply_text}")
    return {"reply": reply_text, "outcome": outcome, "stage": stage}