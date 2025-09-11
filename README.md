# Data_Bleed: An Interactive Narrative on Digital Safety

Data_Bleed is an immersive, educational horror game that explores the digital dangers faced by young people. Through branching narratives and a dynamic AI antagonist, players experience the risks of catfishing, online manipulation, and cybersecurity threats firsthand, learning digital resilience in a safe, interactive environment.

## 🚀 Core Features

-   **Branching Narrative:** Follow the stories of three unique characters—Eli, Maya, and Stanley—where player choices directly impact the story.
-   **Dynamic AI Antagonist:** Powered by a **local-first `gpt-oss` model** (via LM Studio), the "Deception Engine" acts as an intelligent scammer, generating unique dialogue in real-time.
-   **Generative Story Arcs:** Key narrative moments are visualized with AI-generated "Dreamscapes" and "Nightmares."
-   **Immersive 3D Dioramas:** Key scenes are rendered as explorable 3D vignettes, built with the custom in-project tool below.

## 📂 Project Architecture: A Hybrid Backend Approach

This project is built on a sophisticated hybrid-backend architecture to separate concerns and optimize performance.

-   **Frontend Server (Node.js/Express):** A lightweight server (`server.js`) dedicated to serving the static game client (HTML, CSS, JS, and assets).
-   **AI & Game Logic Server (Python/FastAPI):** A powerful backend (`main.py`) that acts as the "brain" of the game, managing all complex game logic and AI model orchestration.

## 🛠️ In-Project Tool: The Character Constructor

Located in the `/tools/character_constructor` directory, this is a custom-built, standalone application for creating the game's 3D character models. It uses a superior "Production Studio" AI pipeline to transform a single 2D character image into a high-fidelity, interactive 3D asset.

## 🔑 Running the Project

This project requires running multiple servers.

### **1. The Main Game**

**Terminal 1: Start the AI & Game Logic Server (Python)**
```bash
# From the project root, activate your main venv
source .venv/bin/activate

# Start the FastAPI server
uvicorn main:app --reload --port 3001
URL: http://127.0.0.1:3001
Note: For the full AI chat experience, ensure LM Studio is running.
Terminal 2: Start the Frontend Server (Node.js)


# From the project root
node server.js
URL: http://localhost:3001 (or as specified in the terminal).
2. The Character Constructor Tool (Optional)
Terminal 3: Start the Constructor Backend (Python)


# Navigate to the tool's backend directory
cd tools/character_constructor/backend

# Activate the tool's dedicated venv
source venv_constructor/bin/activate

# Start the server on a different port
uvicorn constructor_server:app --reload --port 3002
To Use the Tool: Open the tools/character_constructor/constructor.html file in your browser.