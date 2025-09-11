# Data_Bleed Game Bot

An experimental interactive narrative game where player choices shape the story, powered by character-specific lore and frontend animations.

## 🚀 Current Features
- **Multi-character AI bot** (Maya, Eli, Stanley).
- **Lore-driven responses** from `characters.json`.
- **Outcome-based story arcs** (success, fail).
- **Frontend animation hooks** (logo break on failure).
- **Non-intrusive login illusion**: no personal data leaves the client.
- **GDPR-safe session**: gamertag + password stored in `sessionStorage` only.

## 📂 Project Structure



DATA_BLEED_VSC_GAME/
├── chroma-bot/
│   └── assets/
│       ├── config/              # config + JSON
│       └── img/eli/             # Eli login screen art
│
├── characters/                  # per-character JSON (legacy testing)
├── chatbot.html                 # chatbot UI
├── eli_login.html               # new login flow
├── save.js                      # save/load chatlog logic
├── script.js                    # main frontend logic
├── main.py                      # backend (FastAPI + lore integration)
├── server.js                    # static server
├── knowledge.json               # shared knowledge base
└── README.md



## 🧩 Characters
- **Maya**: cryptic desert wanderer, guides with calm hints.
- **Eli**: paranoid hacker, terse and technical.
- **Stanley**: whistleblower, sharp and friendly.
- **Global Lore**: Data_Bleed world, Chroma Awards, Shadow Observers.

## ✨ New Additions
1. **Global Knowledge Integration**  
   - `main.py` checks `global_knowledge` first (e.g., “Shadow Observers”).  
   - Ensures consistent lore across characters.

2. **Eli Login Flow**  
   - `eli_login.html` overlays text inputs on Eli’s login art.  
   - Stores gamertag + session in local sessionStorage.  
   - Auto-passes “eli” into `/api/chat`.  

3. **Session Save/Load**  
   - `save.js` adds Save Game / Load Game.  
   - Saves chat log as JSON locally (download).  
   - Load restores previous session.  

## 🔑 Usage
- Run backend:
  ```bash
  uvicorn main:app --reload --port 3001



	•	Run frontend server:
  node server.js or live server



