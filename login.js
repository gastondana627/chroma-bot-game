/**
 * DATA_BLEED Authentication Module
 * Centralized login and state management system
 */

class DataBleedAuth {
    constructor() {
        this.gameState = {
            gamertag: "",
            character: "maya",
            password: "",
            isLoggedIn: false,
            loginMethod: "direct" // "direct" or "iframe"
        };
        
        this.characters = {
            maya: {
                name: "Maya",
                displayName: "Gaming Interface",
                credentials: { gamertag: "Gamertag", password: "Password" },
                responses: [
                    "Ready for the next mission! 🎮",
                    "Let's level up together!",
                    "System status: All green!",
                    "What's our objective?"
                ]
            },
            eli: {
                name: "Eli", 
                displayName: "Advanced Terminal",
                credentials: { gamertag: "Access ID", password: "One-Time Key" },
                responses: [
                    "ACCESSING DATASTREAM...",
                    "NEURAL LINK ESTABLISHED", 
                    "QUANTUM ENCRYPTION ACTIVE",
                    "READY FOR DATA ANALYSIS"
                ]
            },
            stanley: {
                name: "Stanley",
                displayName: "Corporate Access", 
                credentials: { gamertag: "Employee ID", password: "Access Key" },
                responses: [
                    "Corporate protocols engaged.",
                    "Security clearance verified.",
                    "Standing by for instructions.",
                    "All systems operational."
                ]
            }
        };

        this.eventListeners = new Map();
        this.init();
    }

    init() {
        this.setupMessageListener();
        this.setupCharacterSwitching();
        this.setupLoginHandlers();
    }

    // Event system for cross-component communication
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    emit(event, data = {}) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // Setup iframe message communication
    setupMessageListener() {
        window.addEventListener("message", (event) => {
            if (event.data.action === "eli-connected") {
                this.handleSuccessfulLogin(event.data.gamertag, "eli", "iframe");
            }
        });
    }

    // Setup character selection dropdown
    setupCharacterSwitching() {
        const characterSelect = document.getElementById("character");
        if (!characterSelect) return;

        characterSelect.addEventListener("change", () => {
            this.switchCharacter(characterSelect.value);
        });

        // Initialize with default character
        this.switchCharacter(this.gameState.character);
    }

    switchCharacter(characterKey) {
        this.gameState.character = characterKey;
        
        // Hide all login forms
        ["eli", "maya", "stanley"].forEach(char => {
            const loginEl = document.getElementById(`${char}-login`);
            if (loginEl) loginEl.style.display = "none";
        });

        // Show selected character login
        const activeLogin = document.getElementById(`${characterKey}-login`);
        if (activeLogin) {
            activeLogin.style.display = "block";
            
            // Special handling for Eli's iframe
            if (characterKey === "eli") {
                this.setupEliIframe();
            }
        }

        this.emit("characterChanged", { 
            character: characterKey, 
            characterData: this.characters[characterKey] 
        });
    }

    // Setup Eli's advanced terminal iframe
    setupEliIframe() {
        const eliContainer = document.getElementById("eli-login");
        if (!eliContainer) return;

        // Check if iframe already exists
        if (eliContainer.querySelector('iframe')) return;

        const iframe = document.createElement('iframe');
        iframe.src = './eli.html'; // Assuming eli.html is in same directory
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.style.background = 'transparent';

        // Clear container and add iframe
        eliContainer.innerHTML = '';
        eliContainer.appendChild(iframe);
    }

    // Setup direct login handlers for Maya and Stanley
    setupLoginHandlers() {
        ["maya", "stanley"].forEach(character => {
            const button = document.getElementById(`${character}-connect`);
            if (button) {
                button.addEventListener("click", () => {
                    this.handleDirectLogin(character);
                });
            }
        });
    }

    // Handle direct login (Maya, Stanley)
    async handleDirectLogin(characterKey) {
        const gamertagInput = document.getElementById(`${characterKey}-gamertag`);
        const passwordInput = document.getElementById(`${characterKey}-password`);
        const button = document.getElementById(`${characterKey}-connect`);

        if (!gamertagInput || !passwordInput || !button) {
            console.error(`Login elements not found for ${characterKey}`);
            return;
        }

        const gamertag = gamertagInput.value.trim();
        const password = passwordInput.value.trim();

        if (!gamertag || !password) {
            this.showError("Please enter both credentials!");
            return;
        }

        // Animate login process
        await this.animateLogin(button, characterKey);

        // Complete login
        this.handleSuccessfulLogin(gamertag, characterKey, "direct", password);
    }

    // Animate login button states
    async animateLogin(button, characterKey) {
        const originalText = button.textContent;
        
        button.textContent = "CONNECTING...";
        button.disabled = true;
        
        await this.delay(1500);
        
        button.textContent = "AUTHENTICATING...";
        
        await this.delay(1500);
        
        button.textContent = "AUTHENTICATED";
        
        await this.delay(1000);
        
        button.textContent = originalText;
        button.disabled = false;
    }

    // Handle successful login from any method
    handleSuccessfulLogin(gamertag, characterKey, method, password = "") {
        this.gameState = {
            gamertag: gamertag,
            character: characterKey,
            password: password,
            isLoggedIn: true,
            loginMethod: method
        };

        this.emit("loginSuccess", {
            ...this.gameState,
            characterData: this.characters[characterKey]
        });

        this.transitionToMainInterface();
    }

    // Transition from login to main interface
    transitionToMainInterface() {
        const loginScreen = document.getElementById("login-screen");
        const videoContainer = document.getElementById("video-container");
        
        if (loginScreen) loginScreen.style.display = "none";
        if (videoContainer) videoContainer.style.display = "block";

        // Add welcome message to chat
        this.addSystemMessage(`Welcome ${this.gameState.gamertag}! You are connected as ${this.gameState.character.toUpperCase()}.`);
    }

    // Chat system integration
    generateBotResponse(userMessage) {
        const character = this.characters[this.gameState.character];
        const gamertag = this.gameState.gamertag || "Player";
        
        let response;
        
        if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
            response = `Hello ${gamertag}! ${character.responses[Math.floor(Math.random() * character.responses.length)]}`;
        } else if (userMessage.toLowerCase().includes("status")) {
            response = `System Status: ONLINE | Character: ${this.gameState.character.toUpperCase()} | User: ${gamertag} | Method: ${this.gameState.loginMethod.toUpperCase()}`;
        } else if (userMessage.toLowerCase().includes("character")) {
            response = `Currently logged in as ${character.name} via ${character.displayName}`;
        } else {
            response = character.responses[Math.floor(Math.random() * character.responses.length)];
        }
        
        return response;
    }

    // Utility methods
    addSystemMessage(message) {
        this.emit("systemMessage", { message });
    }

    showError(message) {
        this.emit("error", { message });
        // Fallback to alert if no error handler
        setTimeout(() => alert(message), 100);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Getters for external access
    getGameState() {
        return { ...this.gameState };
    }

    getCurrentCharacter() {
        return this.characters[this.gameState.character];
    }

    isLoggedIn() {
        return this.gameState.isLoggedIn;
    }

    // Logout functionality
    logout() {
        this.gameState = {
            gamertag: "",
            character: "maya", 
            password: "",
            isLoggedIn: false,
            loginMethod: "direct"
        };

        this.emit("logout");
        
        const loginScreen = document.getElementById("login-screen");
        const videoContainer = document.getElementById("video-container");
        const chatBox = document.getElementById("chat-box");
        
        if (loginScreen) loginScreen.style.display = "flex";
        if (videoContainer) videoContainer.style.display = "none";
        if (chatBox) chatBox.style.display = "none";
    }

    // Advanced features for character-specific behavior
    getCharacterTheme(characterKey = null) {
        const char = characterKey || this.gameState.character;
        const themes = {
            maya: {
                primary: "#FF0080",
                secondary: "#7928CA", 
                accent: "#00FFFF",
                bg: "rgba(25, 0, 25, 0.9)"
            },
            eli: {
                primary: "#00FFFF",
                secondary: "#0A1A2A",
                accent: "#FFFFFF", 
                bg: "rgba(5, 20, 35, 0.9)"
            },
            stanley: {
                primary: "#4A90A4",
                secondary: "#2C3E50",
                accent: "#ECF0F1",
                bg: "rgba(44, 62, 80, 0.9)"
            }
        };
        return themes[char] || themes.maya;
    }

    // Security validation (can be expanded)
    validateCredentials(gamertag, password, character) {
        // Basic validation - expand as needed
        if (gamertag.length < 3) return { valid: false, error: "Gamertag too short" };
        if (password.length < 4) return { valid: false, error: "Password too short" };
        
        // Character-specific validation could go here
        return { valid: true };
    }

    // Debug methods
    debug() {
        console.log("=== DATA_BLEED AUTH DEBUG ===");
        console.log("Game State:", this.gameState);
        console.log("Event Listeners:", Array.from(this.eventListeners.keys()));
        console.log("Current Character Data:", this.getCurrentCharacter());
    }
}

// Initialize global auth system
window.DataBleedAuth = DataBleedAuth;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.authSystem = new DataBleedAuth();
    });
} else {
    window.authSystem = new DataBleedAuth();
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataBleedAuth;
}



