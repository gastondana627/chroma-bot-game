# DATA_BLEED CODEBASE COMPREHENSIVE GLOSSARY

## PROJECT OVERVIEW
**Data_Bleed** is an interactive narrative cybersecurity awareness game featuring three characters (Maya, Eli, Stanley) who guide players through different online safety scenarios. The game uses AI-powered conversations, dynamic state management, and immersive multimedia to teach digital safety.

---

## 🏗️ CORE ARCHITECTURE FILES

### **index.html** - Main Application Entry Point
**Path:** `/index.html`
**Purpose:** Primary game orchestrator and UI controller
**Key Functions:**
- `handleExternalConnect(characterKey, gamertag)` - Manages login-to-gameplay transitions
- `switchTheme(character)` - Changes audio and visual themes
- `showGameView(character)` - Transitions to gameplay state with orb and HUD
- `showDashboardView(character)` - Shows character-specific dashboard
- `createFirework(x, y, mode)` - Generates interactive particle effects
- `getBotResponse(userMessage)` - Handles Chroma bot chat interactions
- `addMessage(sender, text)` - Adds messages to chat interface

**Key DOM Elements:**
- `#intro-screen` - Start screen container
- `#login-screen` - Character selection and login forms
- `#gameplay-area` - Main gameplay container (two-state system)
- `#dashboard-view` - Full character dashboard view
- `#game-view` - Minimal HUD + Chroma orb view
- `#video-container` - Chroma bot orb container
- `#chat-box` - Chat interface
- `#fireworks` - Canvas for particle effects

**State Management:**
- Login State → Gameplay State transition system
- Character-specific UI switching
- Session data storage in sessionStorage
- Audio theme management

### **main.py** - FastAPI Backend Server
**Path:** `/main.py`
**Purpose:** AI-powered conversation engine and game state management
**Key Functions:**
- `chat(req: ChatRequest)` - Main chat endpoint with character AI
- `get_session(session_id, character)` - Session state management
- `match_global_knowledge(user_msg)` - Global knowledge retrieval
- `decide_outcome_and_update()` - Game outcome logic
- `build_system_prompt()` - Dynamic AI persona system

**API Endpoints:**
- `POST /api/chat` - Character conversation endpoint
- `GET /api/health` - Server health check
- `GET /api/characters` - Available characters list
- `POST /api/reset` - Reset session state

**AI System:**
- Guardian vs Deceiver persona switching based on trust score
- Character-specific personality engines
- Trust score mechanics (-100 to +100 range)
- Intent rules for success/fail keyword detection

---

## 🎭 CHARACTER SYSTEM

### **Maya - Cybersecurity/Dating App Expert**
**Dashboard:** `Main_Dashboards/Maya_Dashboard_V2.html`
**Login:** `Log_in_formats/Maya.html`
**Theme Audio:** `Main_Login_Audio/Maya_The_Connection_Trap.mp3`
**Pipeline:** `Game/Mechanics/maya_pipeline.js`
**Config:** `chroma-bot/characters/maya.json`

**Key Functions in Maya Pipeline:**
- `sendChoice(message)` - Sends user choices to backend API
- `renderMayaReply(userMsg, data)` - Renders chat responses
- `updateDashboardUI(data)` - Updates trust metrics and UI
- `showNotification(title, subtitle, icon)` - Shows security alerts

**UI Elements:**
- Trust & Security panel with progress bar
- Suspicious DMs counter
- Blocked Profiles counter
- Background check and encryption buttons
- Maya's Guidance chatbot interface

### **Eli - Gaming/Peer Pressure Specialist**
**Dashboard:** `Main_Dashboards/Eli_Dashboard_V2.html`
**Login:** `Log_in_formats/Eli.html`
**Theme Audio:** `Main_Login_Audio/Eli_Rage_Glitch.mp3`

**Character Traits:**
- Gaming-focused personality
- Deals with competitive pressure and exploitation
- Neon gaming-inspired color scheme
- Rank: Diamond, Peer Pressure Meter: 67%

### **Stanley - Identity Theft/Catfishing Expert**
**Dashboard:** `Main_Dashboards/Stanley_Dashboard_V1.html`
**Login:** `Log_in_formats/Stanley.html`
**Theme Audio:** `Main_Login_Audio/Stanely_The Digital Doppelganger.mp3`

**Character Traits:**
- Paranoid, investigative personality
- Focuses on identity protection
- Dark, surveillance-themed colors
- Doppelganger Alerts: 2, Fake Profiles: 5

---

## 🤖 CHROMA BOT SYSTEM

### **Core Components**
**Location:** `chroma-bot/` directory
**Video Asset:** `chroma-bot/assets/vid/Chroma_Vid.mp4`
**Chat Interface:** Floating chat window with AI integration

**Key Files:**
- `chroma-bot/chatbot.js` - Chat interface logic
- `chroma-bot/chatbot.html` - Chat UI template
- `chroma-bot/server.js` - Node.js server (alternative backend)
- `chroma-bot/openai.js` - OpenAI integration utilities

**Functions:**
- Continuous loop video with hover effects
- Context-aware responses based on active character
- Fireworks animation triggers on interaction
- Integration with main game state

---

## 🎨 STYLING & THEMES

### **themes.css** - Character Theme System
**Path:** `/themes.css`
**Purpose:** Character-specific color schemes and visual themes

**CSS Variables:**
```css
:root {
  --bg-color: #000;
  --text-color: #fff;
  --accent: #00FFFF;
  --warning: #FF0080;
}
```

**Character Themes:**
- **Maya:** Pink/Cyan gradient (`--accent: #00FFFF`, `--warning: #FF69B4`)
- **Eli:** Orange/Gold gaming colors (`--accent: #FF4500`, `--warning: #FFD700`)
- **Stanley:** Green/Red surveillance colors (`--accent: #32CD32`, `--warning: #8B0000`)

**Key Classes:**
- `.character-ui` - Character dashboard styling
- `.hidden` - Display none utility
- `.fade-out` / `.fade-in` - Transition animations
- `.glass` - Glassmorphism effect (in dashboards)

### **style.css** - Global Styling
**Path:** `/style.css`
**Purpose:** Global layout and component styles

---

## 🎵 AUDIO SYSTEM

### **Audio Assets**
**Location:** `Main_Login_Audio/`
- `Maya_The_Connection_Trap.mp3` - Maya's theme
- `Eli_Rage_Glitch.mp3` - Eli's theme
- `Stanely_The Digital Doppelganger.mp3` - Stanley's theme
- `Start_Here_Screen/The_Corrupted_Lullaby.mp3` - Intro audio

**Audio Functions:**
- `switchTheme(character)` - Changes background music
- Auto-play management with browser compatibility
- Loop and fade controls
- Character-specific audio switching

---

## 🎬 ANIMATION SYSTEM

### **Video Assets**
**Location:** `Main_Animations/`
- `DataBleed_Logo_Animation_Adobe_Take_10.mp4` - Main logo animation
- `DataBleed_X_GasMan.mp4` - Alternative animation
- `GasMan_X_DataBleed_V2.mp4` - Secondary animation

### **Fireworks Engine**
**Location:** Canvas-based particle system in `index.html`
**Key Classes:**
- `class Firework` - Individual particle object
- `createFirework(x, y, mode)` - Particle generation
- `animate()` - Animation loop
- Modes: "explode" and "implode" effects

**Animation Functions:**
- Canvas-based particle system
- Metallic color palette
- Click-triggered visual effects
- Smooth fade animations

---

## 🔧 UTILITY & HELPER FILES

### **api_client.js** - Centralized API Communication
**Path:** `/api_client.js`
**Purpose:** Single source of truth for backend communication

**Functions:**
- `callApi(endpoint, body)` - Generic API call wrapper
- `window.apiClient.sendChatMessage()` - Chat message sender
- Error handling and response parsing
- CORS and network error management

### **login.js** - Authentication System
**Path:** `/login.js`
**Purpose:** Centralized login and state management

**Key Classes:**
- `class DataBleedAuth` - Main authentication controller
- Event system for cross-component communication
- Character switching logic
- Session management utilities

**Functions:**
- `switchCharacter(characterKey)` - Character selection
- `handleDirectLogin(character)` - Direct login flow
- `handleSuccessfulLogin()` - Login success handler
- `transitionToMainInterface()` - UI transition
- `generateBotResponse()` - Chat integration

### **script.js** - Shared Utilities
**Path:** `/script.js`
**Purpose:** Utility functions and shared JavaScript logic

**Functions:**
- Save/load system integration
- Fireworks animation system
- Message handling utilities
- Glitch effect triggers

### **save.js** - Save System
**Path:** `/save.js`
**Purpose:** Game state persistence

**Functions:**
- `setupSaveLoad(messages)` - Initialize save system
- Session storage management
- Progress tracking utilities

---

## 🎮 GAME LOGIC & MECHANICS

### **Game Directory Structure**
**Location:** `Game/`
- `Game/Mechanics/` - Character-specific logic
- `Game/Arcs/` - Story progression files (JSON)
- `Game/Scenes/` - Individual scene definitions
- `Game/graphEngine.js` - Graph-based narrative engine

### **Maya Pipeline**
**Path:** `Game/Mechanics/maya_pipeline.js`
**Functions:**
- `getSessionId()` - Session ID extraction
- `sendChoice(message)` - Backend communication
- `renderMayaReply(userMsg, data)` - Chat rendering
- API integration with trust score system

### **Chroma Bot Injectors**
**Path:** `Game/Mechanics/chroma_bot_injectors.js`
**Purpose:** Inject Chroma bot into dashboards
- Cross-frame communication
- Bot integration utilities

---

## 📱 LOGIN SYSTEM

### **Login Format Files**
**Location:** `Log_in_formats/`
- `Maya.html` - FriendBleed dating app interface
- `Eli.html` - Gaming terminal interface
- `Stanley.html` - Corporate access interface

### **Maya Login Features**
**Path:** `Log_in_formats/Maya.html`
**Key Elements:**
- 3D perspective login container
- Animated border glow effects
- Security threat level indicator
- Glitch and corruption visual effects
- Character silhouettes around form
- Interactive 3D mouse movement

**Functions:**
- `updateThreatLevel()` - Cycles threat indicators
- `triggerGlitch()` - Random glitch effects
- Form validation and security simulation
- 3D animation system

---

## 🖥️ DASHBOARD SYSTEM

### **Maya Dashboard V2**
**Path:** `Main_Dashboards/Maya_Dashboard_V2.html`
**Key Features:**
- Trust & Security panel with progress bar
- Real-time threat monitoring
- Maya's Guidance chatbot integration
- Glassmorphism design with backdrop blur
- Responsive grid layout

**Functions:**
- `updateDashboardUI(data)` - Master UI update function
- `showNotification(title, subtitle, icon)` - Alert system
- Event listeners for security actions
- Resume Game button functionality

**UI Components:**
- Trust score visualization (percentage-based)
- Security status indicators (SECURE/VULNERABLE/AT RISK)
- Action buttons (background check, encrypt messages)
- Real-time clock and ambient updates

### **Dashboard Integration**
- Iframe-based embedding in main application
- PostMessage communication with parent window
- Character-specific styling and metrics
- Session data integration

---

## 🔗 IFRAME COMMUNICATION SYSTEM

### **Message Passing Architecture**
**Key Events:**
- `"start-clicked"` - Start button pressed
- `"eli-connected"` - Eli login success
- `"maya-connected"` - Maya login success  
- `"stanley-connected"` - Stanley login success
- `"resume-game"` - Resume game from dashboard

**Communication Flow:**
1. Login iframe → Parent window (login success)
2. Parent window → Dashboard iframe (session data)
3. Dashboard iframe → Parent window (resume game)
4. Parent window → Game state transition

---

## 📊 DATA MODELS & CONFIGURATION

### **Character Configuration**
**Path:** `character.json`
**Structure:**
```json
{
  "character_name": {
    "lore": "Character background",
    "system_prompt": "AI personality prompt",
    "knowledge": [{"q": "question", "a": "answer"}],
    "intent_rules": {
      "success_keywords": ["safe", "verify"],
      "fail_keywords": ["click", "send"]
    },
    "thresholds": {"warn_after": 2, "fail_after": 4},
    "story_arcs": {"success": {...}, "fail": {...}}
  }
}
```

### **Session State Model**
```javascript
{
  character: "maya" | "eli" | "stanley",
  gamertag: string,
  trust_score: number (-100 to +100),
  wrong_count: number,
  logo_stage: number (1-5),
  currentState: "login" | "gameplay"
}
```

---

## 🎯 STATE MANAGEMENT SYSTEM

### **Two-State Architecture**
1. **Login State** (`#login-screen`)
   - Character selection
   - Login forms (iframes)
   - Audio theme switching

2. **Gameplay State** (`#gameplay-area`)
   - Dashboard View (full character dashboard)
   - Game View (minimal HUD + Chroma orb)

### **State Transition Flow**
```
Start Screen → Logo Animation → Character Selection → Login → Dashboard View ⟷ Game View
```

### **Key State Functions**
- `handleExternalConnect()` - Login → Gameplay transition
- `showDashboardView()` - Switch to dashboard
- `showGameView()` - Switch to game view
- Session persistence via sessionStorage

---

## 🔧 DEVELOPMENT & BUILD SYSTEM

### **Package Management**
**Location:** `chroma-bot/package.json`
**Dependencies:**
- Express.js for Node server
- OpenAI SDK for AI integration
- CORS middleware
- dotenv for environment variables

### **Environment Configuration**
**Files:** `.env`, `chroma-bot/.env`
**Variables:**
- `OPENAI_API_KEY` - OpenAI API authentication
- Server configuration settings

---

## 🚀 DEPLOYMENT & HOSTING

### **API Base Configuration**
```javascript
const API_BASE = window.location.hostname === "localhost"
  ? "http://127.0.0.1:3001"
  : "https://data-bleed-backend.up.railway.app";
```

### **CORS Configuration**
**Allowed Origins:**
- `http://127.0.0.1:8080`
- `http://localhost:8080`
- `http://localhost:3001`
- `https://data-bleed-backend.up.railway.app`

---

## 🐛 CURRENT KNOWN ISSUES

### **Critical Issues (From Spec)**
1. **UI Element Bleed** - Character selection buttons remain visible after login
2. **Component Positioning** - Chroma Bot appears as static panel instead of floating orb
3. **Asset Path Resolution** - Orb video animation not loading consistently
4. **State Transition Failures** - Login UI doesn't properly fade to gameplay state

### **Technical Debt**
- Inline CSS styles should be moved to external files
- Missing viewport meta tag
- Accessibility improvements needed (iframe titles, button types)
- Performance optimization for CSS animations

---

## 📋 TESTING & VALIDATION

### **Manual Testing Checklist**
- [ ] Character selection and theme switching
- [ ] Login flow for all three characters
- [ ] Dashboard → Game view transitions
- [ ] Chroma bot orb functionality
- [ ] Chat system integration
- [ ] Audio theme switching
- [ ] Fireworks animation system

### **Browser Compatibility**
- Chrome/Chromium (primary)
- Firefox (video playsinline not supported)
- Safari (autoplay restrictions)
- Mobile browsers (responsive design)

---

## 🔮 FUTURE ENHANCEMENTS

### **Planned Features**
- Additional character paths (Eli and Stanley full implementation)
- Enhanced narrative branching system
- Multiplayer collaboration features
- Advanced analytics and progress tracking
- Mobile app version

### **Technical Improvements**
- State management refactoring (current spec focus)
- Performance optimization
- Accessibility compliance
- Progressive Web App features
- Offline functionality

---

## 📚 LEARNING RESOURCES

### **Cybersecurity Education Topics**
- Phishing identification
- Social engineering tactics
- Romance scams
- Financial fraud prevention
- Privacy protection
- Identity theft prevention

### **Game Mechanics**
- Interactive narrative design
- Trust score systems
- AI-powered character interactions
- Multimedia integration
- State machine architecture

---

*This glossary serves as a comprehensive reference for the Data_Bleed codebase. Each section provides both high-level architecture understanding and specific implementation details for developers working on the project.*