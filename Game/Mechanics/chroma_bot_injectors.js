// /Game/Mechanics/chroma_bot_injector.js

/**
 * A self-contained component that injects the pop-up Chroma Bot UI
 * onto any page and connects it to the main FastAPI backend.
 * Enhanced with 3D trigger detection system for cinematic moments.
 */

// Load required dependencies for 3D trigger system
function loadTriggerSystemDependencies() {
    const dependencies = [
        'Game/Mechanics/story-progression-tracker.js',
        'Game/Mechanics/cinematic-moments-config.js'
    ];
    
    dependencies.forEach(src => {
        if (!document.querySelector(`script[src*="${src}"]`)) {
            const script = document.createElement('script');
            script.src = `../../${src}`;
            script.async = false; // Ensure proper loading order
            document.head.appendChild(script);
        }
    });
}

// Load dependencies first
loadTriggerSystemDependencies();

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Get Character and Session Info from the Host Page ---
    const character = document.body.dataset.character || 'unknown';
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("sessionId") || `default_${character}_session`;
  
    if (character === 'unknown') {
      console.warn('Chroma Bot Injector: No "data-character" attribute found on <body> tag. Bot may not function correctly.');
    }
  
    // --- 2. Create and Inject the Bot's HTML and CSS ---
    const botContainer = document.createElement('div');
    botContainer.id = 'chroma-bot-component';
    botContainer.innerHTML = `
      <style>
        #chroma-icon-container { position: fixed; bottom: 20px; right: 20px; width: 80px; height: 80px; cursor: pointer; border-radius: 50%; overflow: hidden; box-shadow: 0 0 15px rgba(0, 255, 255, 0.6); z-index: 9998; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        #chroma-icon-container:hover { transform: scale(1.1); box-shadow: 0 0 25px rgba(0, 255, 255, 1); }
        #chroma-chat-box { font-family: 'JetBrains Mono', monospace; position: fixed; bottom: 20px; right: 20px; width: 320px; height: 450px; background: rgba(10, 10, 10, 0.9); border: 2px solid #00FFFF; border-radius: 12px; display: none; flex-direction: column; padding: 12px; z-index: 9999; backdrop-filter: blur(8px); }
        #chroma-messages { flex: 1; overflow-y: auto; font-size: 14px; padding-right: 5px; scrollbar-width: thin; scrollbar-color: #00FFFF #111; }
        #chroma-messages p { margin-bottom: 8px; line-height: 1.4; }
        #chroma-user-input { flex: 1; padding: 8px; border: 1px solid #7928CA; background: #222; color: white; border-radius: 6px; outline: none; }
        #chroma-chat-form button { margin-left: 8px; padding: 8px 14px; border: none; border-radius: 6px; background: #FF0080; color: white; cursor: pointer; }
        #chroma-close-btn { position: absolute; right: 8px; top: 0px; background: transparent; border: none; color: white; font-size: 24px; cursor: pointer; }
      </style>
  
      <div id="chroma-icon-container">
          <video autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover;">
              <source src="../chroma-bot/assets/vid/Chroma_Vid.mp4" type="video/mp4">
          </video>
      </div>
  
      <div id="chroma-chat-box">
          <header style="font-weight: bold; margin-bottom: 10px; text-align: center; position: relative;">
              💬 Chroma Bot
              <button id="chroma-close-btn">&times;</button>
          </header>
          <div id="chroma-messages">
              <p style="color: #00FFFF;"><b>Bot:</b> Hi! Click my icon anytime to chat.</p>
          </div>
          <form id="chroma-chat-form" style="display: flex; margin-top: 8px;">
              <input type="text" id="chroma-user-input" placeholder="Type a message..." required>
              <button type="submit">Send</button>
          </form>
      </div>
    `;
    document.body.appendChild(botContainer);
  
    // --- 3. Initialize 3D Trigger System Integration ---
    let triggerSystemReady = false;
    let pendingTriggers = [];
    
    // Initialize trigger system when dependencies are loaded
    function initializeTriggerSystem() {
        if (window.storyTracker && window.cinematicManager) {
            triggerSystemReady = true;
            
            // Set up trigger listeners for 3D cinematic moments
            window.addEventListener('storyTriggerFired', handleStoryTrigger);
            
            // Process any pending triggers
            pendingTriggers.forEach(trigger => handleStoryTrigger(trigger));
            pendingTriggers = [];
            
            console.log('🎬 3D Trigger System integrated with Chroma Bot');
        } else {
            // Retry after a short delay
            setTimeout(initializeTriggerSystem, 100);
        }
    }
    
    // Start initialization
    setTimeout(initializeTriggerSystem, 50);

    // --- 4. Wire Up the Bot's Interactive Logic ---
    const icon = document.getElementById('chroma-icon-container');
    const chatBox = document.getElementById('chroma-chat-box');
    const closeBtn = document.getElementById('chroma-close-btn');
    const chatForm = document.getElementById('chroma-chat-form');
    const userInput = document.getElementById('chroma-user-input');
    const messages = document.getElementById('chroma-messages');
  
    icon.addEventListener('click', () => {
      // Check for 3D trigger conditions before opening chat
      if (triggerSystemReady && should3DTriggerActivate()) {
        activate3DCinematicMode();
      } else {
        // Normal chat mode
        icon.style.display = 'none';
        chatBox.style.display = 'flex';
      }
    });
  
    closeBtn.addEventListener('click', () => {
      chatBox.style.display = 'none';
      icon.style.display = 'block';
    });
  
    // Chat form handler will be added later with enhanced functionality
  
    function addMessage(sender, text) {
      const p = document.createElement('p');
      p.style.color = sender === 'Bot' ? '#00FFFF' : '#FFFFFF';
      p.innerHTML = `<b>${sender}:</b> ${text}`;
      messages.appendChild(p);
      messages.scrollTop = messages.scrollHeight;
    }
    
    async function getChromaBotResponse(message) {
        try {
            // Use enhanced error handling system if available
            if (window.ErrorHandler) {
                const data = await window.ErrorHandler.makeAPIRequest('/api/chat', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message, character, sessionId })
                });
                return data.reply || "⚠️ No response from AI.";
            }

            // Fallback to original implementation
            let apiUrl;
            if (window.APIConfig) {
                apiUrl = window.APIConfig.getApiUrl('/api/chat');
            } else {
                const API_BASE = window.location.hostname === "localhost"
                    ? "http://127.0.0.1:3001"
                    : "https://data-bleed-backend.up.railway.app";
                apiUrl = `${API_BASE}/api/chat`;
            }
            
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, character, sessionId })
            });
            if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
            const data = await res.json();
            return data.reply || "⚠️ No response from AI.";
        } catch (err) {
            console.error("Chroma Bot API error:", err);
            
            // Enhanced error messages based on error type
            if (window.NetworkError && err instanceof window.NetworkError) {
                return "🌐 Network connection problem. Please check your internet connection.";
            } else if (window.TimeoutError && err instanceof window.TimeoutError) {
                return "⏱️ Request timed out. Please try again.";
            } else if (window.HTTPError && err instanceof window.HTTPError) {
                if (err.status >= 500) {
                    return "🔧 Server error. Please try again in a few moments.";
                } else if (err.status === 429) {
                    return "⏳ Too many requests. Please wait before trying again.";
                }
                return `❌ Request failed (Error ${err.status}). Please try again.`;
            }
            
            return "⚠️ Connection error, try again later.";
        }
    }

    // --- 5. 3D Trigger System Functions ---
    
    /**
     * Check if 3D cinematic mode should activate
     * @returns {boolean} Whether to activate 3D mode
     */
    function should3DTriggerActivate() {
        if (!triggerSystemReady || !window.storyTracker || !window.cinematicManager) {
            return false;
        }
        
        // Get current context
        const context = window.storyTracker.detectCurrentContext();
        if (!context.character || !context.area) {
            return false;
        }
        
        // Check if there are any available cinematic moments for this area
        const availableMoments = window.cinematicManager.getMomentsForArea(context.character, context.area);
        const progress = window.storyTracker.getProgress(context.character);
        
        if (!progress || availableMoments.length === 0) {
            return false;
        }
        
        // Check if any cinematic moment conditions are met
        return availableMoments.some(moment => {
            // Skip if already completed
            if (progress.completedTriggers.includes(moment.id)) {
                return false;
            }
            
            // Evaluate trigger conditions
            return window.storyTracker.evaluateTriggerCondition(
                moment.triggerConditions, 
                progress, 
                'manual_trigger', 
                { source: 'chroma_bot_click' }
            );
        });
    }
    
    /**
     * Activate 3D cinematic mode
     */
    function activate3DCinematicMode() {
        console.log('🎬 Activating 3D Cinematic Mode');
        
        const context = window.storyTracker.detectCurrentContext();
        const availableMoments = window.cinematicManager.getMomentsForArea(context.character, context.area);
        const progress = window.storyTracker.getProgress(context.character);
        
        // Find the first available moment that meets conditions
        const activeMoment = availableMoments.find(moment => {
            return !progress.completedTriggers.includes(moment.id) &&
                   window.storyTracker.evaluateTriggerCondition(
                       moment.triggerConditions, 
                       progress, 
                       'manual_trigger', 
                       { source: 'chroma_bot_click' }
                   );
        });
        
        if (activeMoment) {
            // Trigger the cinematic moment
            window.storyTracker.fireTrigger(activeMoment, context.character, context.area, {
                source: 'chroma_bot_click',
                timestamp: Date.now()
            });
        } else {
            // Fallback to normal chat if no moment available
            icon.style.display = 'none';
            chatBox.style.display = 'flex';
        }
    }
    
    /**
     * Handle story trigger events
     * @param {CustomEvent} event - Story trigger event
     */
    function handleStoryTrigger(event) {
        if (!triggerSystemReady) {
            pendingTriggers.push(event);
            return;
        }
        
        const { triggerId, character, areaNumber, trigger } = event.detail;
        
        console.log(`🎬 Handling story trigger: ${triggerId}`);
        
        // Get the cinematic moment configuration
        const moment = window.cinematicManager.getMoment(triggerId);
        if (!moment) {
            console.warn(`No cinematic moment found for trigger: ${triggerId}`);
            return;
        }
        
        // For now, show enhanced chat with cinematic context
        // This will be replaced with actual 3D rendering in later tasks
        showCinematicChat(moment, character, areaNumber);
    }
    
    /**
     * Show enhanced chat with cinematic context
     * @param {Object} moment - Cinematic moment configuration
     * @param {string} character - Character name
     * @param {number} areaNumber - Area number
     */
    function showCinematicChat(moment, character, areaNumber) {
        // Hide icon and show chat box
        icon.style.display = 'none';
        chatBox.style.display = 'flex';
        
        // Add cinematic styling to chat box
        chatBox.style.border = '3px solid #FFD700';
        chatBox.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
        
        // Update chat header to indicate cinematic mode
        const header = chatBox.querySelector('header');
        if (header) {
            header.innerHTML = `
                🎬 Cinematic Mode - ${moment.title}
                <button id="chroma-close-btn">&times;</button>
            `;
            header.style.color = '#FFD700';
        }
        
        // Add cinematic dialogue to messages
        const cinematicMessage = document.createElement('p');
        cinematicMessage.style.color = '#FFD700';
        cinematicMessage.style.fontWeight = 'bold';
        cinematicMessage.style.background = 'rgba(255, 215, 0, 0.1)';
        cinematicMessage.style.padding = '10px';
        cinematicMessage.style.borderRadius = '8px';
        cinematicMessage.style.margin = '10px 0';
        cinematicMessage.innerHTML = `
            <b>🎭 ${character.toUpperCase()}:</b><br>
            ${moment.cinematicConfig.dialogue.text}
        `;
        
        messages.appendChild(cinematicMessage);
        messages.scrollTop = messages.scrollHeight;
        
        // Re-wire close button
        const newCloseBtn = document.getElementById('chroma-close-btn');
        if (newCloseBtn) {
            newCloseBtn.addEventListener('click', () => {
                // Reset chat box styling
                chatBox.style.border = '2px solid #00FFFF';
                chatBox.style.boxShadow = 'none';
                
                // Reset header
                if (header) {
                    header.innerHTML = `
                        💬 Chroma Bot
                        <button id="chroma-close-btn">&times;</button>
                    `;
                    header.style.color = '#00FFFF';
                }
                
                // Close chat
                chatBox.style.display = 'none';
                icon.style.display = 'block';
            });
        }
        
        console.log(`🎬 Cinematic chat activated for: ${moment.title}`);
    }
    
    // --- 6. Enhanced Chat API Integration ---
    
    /**
     * Enhanced chat response function with 3D mode support
     */
    async function getEnhancedChromaBotResponse(message) {
        // Use centralized API configuration if available, otherwise fallback
        let apiUrl;
        if (window.APIConfig) {
            apiUrl = window.APIConfig.getApiUrl('/api/chat');
        } else {
            // Fallback for when APIConfig is not loaded
            const API_BASE = window.location.hostname === "localhost"
                ? "http://127.0.0.1:3001"
                : "https://data-bleed-backend.up.railway.app";
            apiUrl = `${API_BASE}/api/chat`;
        }
        
        // Detect current context for enhanced responses
        const context = triggerSystemReady ? window.storyTracker.detectCurrentContext() : {};
        const progress = triggerSystemReady && context.character ? 
                        window.storyTracker.getProgress(context.character) : null;
        
        try {
            const requestBody = {
                message,
                character,
                sessionId,
                // Enhanced context for 3D-aware responses
                context: {
                    area: context.area,
                    progress: progress ? {
                        currentArea: progress.currentArea,
                        visitedAreas: progress.visitedAreas,
                        storyState: progress.storyState
                    } : null,
                    triggerSystemActive: triggerSystemReady
                }
            };
            
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });
            
            if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
            const data = await res.json();
            return data.reply || "⚠️ No response from AI.";
        } catch (err) {
            console.error("Enhanced Chroma Bot API error:", err);
            return "⚠️ Connection error, try again later.";
        }
    }
    
    // Replace the original function call in the chat form handler
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = userInput.value.trim();
      if (!text) return;

      addMessage('You', text);
      userInput.value = '';
      
      // Use enhanced response function
      const aiResponse = await getEnhancedChromaBotResponse(text);
      addMessage('Bot', aiResponse);
    });
  });