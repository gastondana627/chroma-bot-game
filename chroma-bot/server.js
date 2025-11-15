// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');
const Response3DFormatter = require('./3d-response-formatter');

const app = express();
const port = process.env.PORT || 3001;

// --- Middleware ---
// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5500',
    'https://data-bleed.vercel.app',
    'https://chroma-bot-game.vercel.app',
    'https://*.vercel.app'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Allows requests from your frontend
app.use(express.json()); // Parses incoming JSON requests

// This line serves all files from the parent directory (Data_Bleed_VSC).
// This is how your index.html, video, and assets will be accessible.
app.use(express.static(path.join(__dirname, '..')));

// --- OpenAI Client ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- 3D Response Formatter ---
const formatter3D = new Response3DFormatter();

// --- Dynamic Character Loader ---
function loadCharacterConfig(character) {
  const filePath = path.join(__dirname, 'characters', `${character}.json`);
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Could not load character config for: ${character}`, error);
    return null;
  }
}



// --- API Endpoint ---
app.post("/api/chat", async (req, res) => {
  const { message, character, sessionId, mode, storyTrigger } = req.body;
  
  if (!message || !character) {
    return res.status(400).json({ error: "Message and character are required." });
  }

  let systemPrompt = "You are Chroma Bot, a helpful AI assistant.";
  const characterConfig = loadCharacterConfig(character);

  if (characterConfig) {
    systemPrompt = `${characterConfig.name} is a ${characterConfig.role}. Style: ${characterConfig.style}. Lore: ${characterConfig.lore.join(" ")}. If the user makes unsafe decisions, trigger failure mode: ${characterConfig.failure}`;
  }

  // Enhanced system prompt for 3D cinematic mode
  if (mode === "3d_cinematic" && storyTrigger) {
    systemPrompt += ` You are now in a cinematic 3D moment during "${storyTrigger}". Deliver impactful, memorable dialogue that matches this key story beat. Keep responses concise but emotionally resonant.`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });
    
    const reply = completion.choices[0].message.content;
    
    // Use 3D formatter to create enhanced response
    const response = formatter3D.formatResponse(reply, character, storyTrigger, mode);
    response.sessionId = sessionId || "default";

    res.json(response);

  } catch (err) {
    console.error("OpenAI API Error:", err);
    
    // Use formatter for error responses too
    const errorResponse = formatter3D.formatResponse(
      "⚠️ System glitch. My connection to the AI brain is down.",
      character,
      storyTrigger,
      mode
    );
    errorResponse.sessionId = sessionId || "default";
    
    res.status(500).json(errorResponse);
  }
});

// --- 3D Integration Validation Endpoint ---
app.get("/api/3d/validate/:character/:trigger", (req, res) => {
  const { character, trigger } = req.params;
  
  const isValid = formatter3D.isValidCinematicTrigger(character, trigger);
  const availableTriggers = formatter3D.getAvailableTriggers(character);
  
  res.json({
    character,
    trigger,
    isValid,
    availableTriggers,
    animationData: isValid ? formatter3D.getAnimationData(character, trigger) : null
  });
});

// --- 3D Capabilities Info Endpoint ---
app.get("/api/3d/capabilities", (req, res) => {
  const capabilities = {
    supportedCharacters: ["eli", "maya", "stanley"],
    supportedModes: ["standard", "3d_cinematic"],
    cinematicTriggers: {
      eli: formatter3D.getAvailableTriggers("eli"),
      maya: formatter3D.getAvailableTriggers("maya"),
      stanley: formatter3D.getAvailableTriggers("stanley")
    },
    apiVersion: "1.0.0",
    features: [
      "3d_character_emergence",
      "cinematic_animations",
      "dynamic_lighting",
      "gesture_expressions",
      "story_trigger_detection"
    ]
  };
  
  res.json(capabilities);
});

// --- Health Check Endpoint ---
app.get("/api/health", (req, res) => {
  const healthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "production",
    services: {
      openai: !!process.env.OPENAI_API_KEY,
      server: true,
      formatter3D: !!formatter3D
    },
    version: "1.0.0"
  };
  
  res.status(200).json(healthStatus);
});

// --- Root Health Check (for Railway) ---
app.get("/", (req, res) => {
  res.status(200).json({
    message: "DATA_BLEED Backend API",
    status: "running",
    endpoints: [
      "POST /api/chat",
      "GET /api/health",
      "GET /api/3d/capabilities",
      "GET /api/3d/validate/:character/:trigger"
    ]
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`Serving static files from the root project directory.`);
  console.log(`3D Chat API enhanced with cinematic capabilities`);
});