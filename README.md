
# Data_Bleed: An Interactive Narrative on Digital Safety

Data_Bleed is an immersive, educational horror game that explores the digital dangers faced by young people. Through branching narratives and a dynamic AI antagonist, players experience the risks of catfishing, online manipulation, and cybersecurity threats firsthand, learning digital resilience in a safe, interactive environment.

## 🚀 Core Features

-   **Branching Narrative:** Follow the stories of three unique characters—Eli, Maya, and Stanley—where player choices directly impact the story, leading to multiple outcomes.
-   **Dynamic AI Antagonist:** Powered by a **local-first `gpt-oss` model** (via LM Studio), the "Deception Engine" acts as an intelligent scammer, generating unique dialogue in real-time.
-   **Generative Story Arcs:** Key narrative moments are visualized with AI-generated "Dreamscapes" and "Nightmares" to represent the character's mental state.
-   **Immersive 3D Dioramas:** Key scenes are rendered as explorable 3D vignettes, built with a custom, in-project 3D constructor tool.

## 📂 Project Architecture: A Hybrid Backend Approach

This project is built on a sophisticated hybrid-backend architecture to separate concerns and optimize performance.

-   **Frontend Server (Node.js/Express):** A lightweight server (`server.js`) dedicated to serving the static game client (HTML, CSS, JS, and assets) efficiently.
-   **AI & Game Logic Server (Python/FastAPI):** A powerful backend (`main.py`) that acts as the "brain" of the game. It manages all complex game logic, character states, and orchestrates the calls to the AI models.
/
├── server.js # Node.js Frontend & Asset Server
├── main.py # Python AI & Game Logic Server
├── /js/ # Frontend game client logic
├── /characters/ # Character story data
└── /tools/
└── /3d_constructor/ # In-project tool for creating 3D assets


## 🧩 The Characters

-   **Eli (The Gamer):** Explores the dangers of toxic online influence and peer pressure.
-   **Maya (The Social Butterfly):** Navigates the risks of phishing and manipulative DMs on social media.
-   **Stanley (The Lonely Heart):** Becomes the target of a sophisticated catfishing and identity theft scheme.

## 🔑 Running Locally

This project requires **two separate terminal windows** to run the hybrid backend system.

### **Terminal 1: Start the AI & Game Logic Server**

This server powers the game's intelligence.

```bash
# Make sure your Python virtual environment is active
# (.venv)

# Run the FastAPI server
uvicorn main:app --reload --port 3001
URL: http://127.0.0.1:3001
Note: For the full AI experience, ensure LM Studio is running.
Terminal 2: Start the Frontend Server
This server delivers the game to your browser.



# Run the Node.js server
node server.js
URL: The server will tell you the address, typically http://localhost:3001 (or another port if 3001 is taken). You will need to adjust the port in this command if your Python server is using 3001.




#####Important 
Your Node.js Server (server.js): This is your Frontend & Asset Server. Its only job is to serve the static files (index.html, videos, images) quickly and efficiently. This is what live-server was doing, but you've correctly built your own for more control.
Your Python Server (main.py): This is your AI Brain & Game Logic Server. Its only job is to handle the complex, computationally intensive tasks of running the game logic and communicating with the AI models.