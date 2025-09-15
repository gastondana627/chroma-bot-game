// /Users/gastondana/Downloads/Data_Bleed_VSC_Game/chroma-bot/openai.js

/**
 * This file has been updated to communicate with the main FastAPI backend.
 */
async function getAIResponse(userMessage, character = "maya", sessionId = "chroma_bot_session") {
  try {
    // Use the same API base logic as index.html
    const API_BASE = window.location.hostname === "localhost"
      ? "http://127.0.0.1:3001"
      : "https://data-bleed-backend.up.railway.app";
    
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // The request body now matches what the FastAPI server expects
      body: JSON.stringify({ 
        message: userMessage, 
        character: character,
        sessionId: sessionId 
      })
    });

    if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply || "⚠️ No response from AI.";

  } catch (error) {
    console.error("Request failed:", error);
    // This is the error message you were seeing
    return "⚠️ Connection error, try again later.";
  }
}