// script.js (root)

import { setupSaveLoad } from "./save.js";

document.addEventListener("DOMContentLoaded", async () => {
  const chatBox = document.getElementById("chat-box");
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("userInput");
  const messages = document.getElementById("messages");
  const video = document.getElementById("chroma-video");
  const videoContainer = document.getElementById("video-container");

  let wrongCount = 0;

  // Gamertag + character from login/session
  const gamertag = sessionStorage.getItem("gamertag") || "Player";
  const character = sessionStorage.getItem("character") || "maya";

  const header = document.createElement("h3");
  header.textContent = `${gamertag} (${character})`;
  document.body.insertBefore(header, chatBox);

  // Setup save/load
  setupSaveLoad(messages);

  // Intro video → stop & reveal chat
  videoContainer.addEventListener("click", () => {
    video.loop = false;
    video.pause();
    videoContainer.style.display = "none";
    chatBox.style.display = "flex";
  });

  function addMessage(sender, text) {
    const msg = document.createElement("p");
    msg.innerHTML = `<b>${sender}:</b> ${text}`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = userInput.value.trim();
      if (!text) return;

      addMessage(gamertag, text);
      userInput.value = "";

      const reply = await getBotResponse(text);
      addMessage(character, reply.text);

      // Trigger glitch if needed
      if (reply.outcome === "fail") triggerGlitch("fail");
      else if (reply.outcome === "neutral" && reply.stage > 1) triggerGlitch("warn");
    });
  }

  async function getBotResponse(userMessage) {
    // Use the same API base logic as index.html
    const API_BASE = window.location.hostname === "localhost"
      ? "http://127.0.0.1:3001"
      : "https://data-bleed-backend.up.railway.app";
    
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          character: character,
          sessionId: gamertag
        })
      });
      const data = await res.json();
      return { text: data.reply || "…", outcome: data.outcome, stage: data.stage };
    } catch (err) {
      console.error("Backend error:", err);
      return { text: "⚠️ Could not reach server.", outcome: "neutral", stage: 1 };
    }
  }

  // Fireworks animation
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Firework {
    constructor(x, y, color, velocity) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.velocity = velocity;
      this.alpha = 1;
      this.radius = 2;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= 0.01;
      this.draw();
    }
  }

  let fireworks = [];
  function createFirework(x, y) {
    const colors = ["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff"];
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      fireworks.push(
        new Firework(x, y, colors[Math.floor(Math.random() * colors.length)], {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        })
      );
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((f, i) => {
      f.update();
      if (f.alpha <= 0) fireworks.splice(i, 1);
    });
  }

  window.addEventListener("click", (e) => {
    createFirework(e.clientX, e.clientY);
  });

  animate();

  // --- Glitch overlay ---
  function triggerGlitch(type) {
    const body = document.body;
    if (type === "warn") {
      body.classList.add("glitch-warn");
      setTimeout(() => body.classList.remove("glitch-warn"), 500);
    }
    if (type === "fail") {
      body.classList.add("glitch-fail");
      setTimeout(() => body.classList.remove("glitch-fail"), 1200);
    }
  }
});