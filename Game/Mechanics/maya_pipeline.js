// /Game/Mechanics/maya_pipeline.js

function getSessionId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("sessionId") || "default_maya";
}

const sessionId = getSessionId();
// Use the same API base logic as index.html
const API_BASE = window.location.hostname === "localhost"
    ? "http://127.0.0.1:3001"
    : "https://data-bleed-backend.up.railway.app";
const apiUrl = `${API_BASE}/api/chat`;

async function sendChoice(message) {
    console.log("📡 Sending to API:", { message, sessionId });
    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, character: "maya", sessionId: sessionId })
        });

        if (!res.ok) throw new Error("Backend response not OK: " + res.status);
        const data = await res.json();
        console.log("✅ Backend replied:", data);
        renderMayaReply(message, data); // Pass the whole data object
        return data;
    } catch (err) {
        console.error("❌ Pipeline fetch error:", err);
        renderMayaReply(message, { reply: "Connection error — Maya is silent.", persona: "Guardian", trust_score: 0 });
    }
}

function renderMayaReply(userMsg, data) {
    const chatBox = document.getElementById("chatOutput");
    if (!chatBox) {
        console.error("CRITICAL: #chatOutput element not found in HTML!");
        return;
    }

    // User's Message
    const userDiv = document.createElement("div");
    userDiv.className = "p-2 bg-gray-800 rounded-lg text-right";
    userDiv.innerHTML = `<span class="text-gray-400">${userMsg}</span> :<span class="text-pink-300 font-bold"> You</span>`;
    chatBox.appendChild(userDiv);

    // Maya's Reply
    const mayaDiv = document.createElement("div");
    const personaColor = data.persona === "Guardian" ? "bg-green-900/40" : "bg-red-900/40";
    mayaDiv.className = `p-2 rounded-lg mt-1 ${personaColor}`;
    mayaDiv.innerHTML = `<span class="text-pink-400 font-bold">Maya:</span> <span class="text-gray-300">${data.reply}</span>`;
    chatBox.appendChild(mayaDiv);

    // Auto-scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Bind send button and input field when the page loads
window.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Maya's Pipeline Loaded. Session:", sessionId);
    const input = document.getElementById("mayaInput");
    const sendBtn = document.getElementById("mayaSendBtn");

    if (sendBtn && input) {
        sendBtn.addEventListener("click", () => {
            const msg = input.value.trim();
            if (msg) {
                sendChoice(msg);
                input.value = "";
            }
        });

        input.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault(); // Prevent form submission
                sendBtn.click();
            }
        });
    } else {
        console.error("CRITICAL: #mayaInput or #mayaSendBtn not found in HTML!");
    }
});