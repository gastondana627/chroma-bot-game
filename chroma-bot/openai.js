// /Users/gastondana/Downloads/Data_Bleed_VSC_Game/chroma-bot/openai.js

/**
 * This file has been updated to communicate with the main FastAPI backend.
 * Now uses centralized API configuration for production deployment integration.
 */

// Initialize API configuration if not already available
if (typeof window !== 'undefined' && !window.APIConfig) {
  // If APIConfig is not loaded, create a minimal version
  console.warn('⚠️ APIConfig not found, creating fallback configuration');
  window.APIConfig = {
    getApiUrl: function(endpoint) {
      const API_BASE = window.location.hostname === "localhost"
        ? "http://127.0.0.1:3001"
        : "https://data-bleed-backend.up.railway.app";
      return API_BASE + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
    },
    findWorkingApiUrl: async function() {
      return null; // Fallback doesn't support this feature
    }
  };
}

async function getAIResponse(userMessage, character = "maya", sessionId = "chroma_bot_session") {
  try {
    // Use the enhanced error handling system if available
    if (window.ErrorHandler) {
      const data = await window.ErrorHandler.makeAPIRequest('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage, 
          character: character,
          sessionId: sessionId 
        })
      });
      return data.reply || "⚠️ No response from AI.";
    }

    // Fallback to original implementation if ErrorHandler not available
    const apiUrl = window.APIConfig.getApiUrl('/api/chat');
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: userMessage, 
        character: character,
        sessionId: sessionId 
      })
    });

    if (!response.ok) {
      let errorMessage = `Server responded with status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage += ` - ${errorData.error}`;
        }
      } catch (e) {
        // Ignore JSON parsing errors for error responses
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.reply || "⚠️ No response from AI.";

  } catch (error) {
    console.error("Chroma Bot API request failed:", error);
    
    // Enhanced error handling with fallback URL detection
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.log("🔄 Network error in Chroma Bot, attempting fallback...");
      if (window.APIConfig && window.APIConfig.findWorkingApiUrl) {
        const workingUrl = await window.APIConfig.findWorkingApiUrl();
        if (workingUrl) {
          console.log("✅ Chroma Bot reconnected to:", workingUrl);
          return "🔄 Reconnected! Please try your message again.";
        }
      }
      return "❌ Unable to connect to chat service. Please check your connection.";
    }
    
    // Return user-friendly error message based on error type
    if (window.NetworkError && error instanceof window.NetworkError) {
      return "🌐 Network connection problem. Please check your internet connection.";
    } else if (window.TimeoutError && error instanceof window.TimeoutError) {
      return "⏱️ Request timed out. The server may be busy, please try again.";
    } else if (window.HTTPError && error instanceof window.HTTPError) {
      if (error.status >= 500) {
        return "🔧 Server error. Please try again in a few moments.";
      } else if (error.status === 429) {
        return "⏳ Too many requests. Please wait a moment before trying again.";
      }
      return `❌ Request failed (Error ${error.status}). Please try again.`;
    }
    
    return `⚠️ Chat temporarily unavailable: ${error.message}`;
  }
}