// /Game/Mechanics/chroma_bot_injector.js

/**
 * A self-contained component that injects the pop-up Chroma Bot UI
 * onto any page and connects it to the main FastAPI backend.
 */
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
  
    // --- 3. Wire Up the Bot's Interactive Logic ---
    const icon = document.getElementById('chroma-icon-container');
    const chatBox = document.getElementById('chroma-chat-box');
    const closeBtn = document.getElementById('chroma-close-btn');
    const chatForm = document.getElementById('chroma-chat-form');
    const userInput = document.getElementById('chroma-user-input');
    const messages = document.getElementById('chroma-messages');
  
    icon.addEventListener('click', () => {
      icon.style.display = 'none';
      chatBox.style.display = 'flex';
    });
  
    closeBtn.addEventListener('click', () => {
      chatBox.style.display = 'none';
      icon.style.display = 'block';
    });
  
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = userInput.value.trim();
      if (!text) return;
  
      addMessage('You', text);
      userInput.value = '';
      
      const aiResponse = await getChromaBotResponse(text);
      addMessage('Bot', aiResponse);
    });
  
    function addMessage(sender, text) {
      const p = document.createElement('p');
      p.style.color = sender === 'Bot' ? '#00FFFF' : '#FFFFFF';
      p.innerHTML = `<b>${sender}:</b> ${text}`;
      messages.appendChild(p);
      messages.scrollTop = messages.scrollHeight;
    }
    
    async function getChromaBotResponse(message) {
        try {
            const res = await fetch("http://127.0.0.1:3001/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, character, sessionId })
            });
            if (!res.ok) throw new Error("Server error");
            const data = await res.json();
            return data.reply;
        } catch (err) {
            return "⚠️ Connection error.";
        }
    }
  });