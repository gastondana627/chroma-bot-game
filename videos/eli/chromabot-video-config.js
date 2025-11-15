/**
 * ChromaBot Video Integration
 * Connects existing ChromaBot system to video player decisions
 * Triggers glitch animations and AI responses based on player choices
 */

class ChromaBotVideoIntegration {
    constructor() {
        this.chromaBot = null;
        this.glitchAnimationPath = '../chroma-bot/assets/animations/'; // Your glitch animations folder
        this.isGlitching = false;
        this.badDecisionStreak = 0;
        
        this.init();
    }
    
    /**
     * Get correct asset path for both localhost and production
     */
    getAssetPath(relativePath) {
        // Check if we're in a subdirectory (like videos/eli/)
        const currentPath = window.location.pathname;
        
        // If in videos/eli/, use relative path going up two levels
        if (currentPath.includes('/videos/eli/')) {
            return `../../${relativePath}`;
        }
        
        // If in videos/, use relative path going up one level
        if (currentPath.includes('/videos/')) {
            return `../${relativePath}`;
        }
        
        // Otherwise, use direct path (for root level or production)
        return relativePath;
    }
    
    init() {
        // Connect to existing ChromaBot if available
        if (window.chromaBotAdaptive) {
            this.chromaBot = window.chromaBotAdaptive;
            this.chromaBot.setCharacter('eli');
            console.log('✅ ChromaBot connected to video player');
        } else {
            console.warn('⚠️ ChromaBot not found, will initialize when available');
        }
        
        // Create ChromaBot overlay container
        this.createChromaBotOverlay();
    }
    
    /**
     * Create ChromaBot visual overlay for video player
     * UNIFIED SYSTEM: One location, switches between clean/corrupted based on scene + decisions
     */
    createChromaBotOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'chromabot-video-overlay';
        overlay.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 120px;
            height: 120px;
            z-index: 9998;
            pointer-events: auto;
            opacity: 0.7;
            transition: opacity 0.5s ease;
        `;
        
        // Get the correct video path
        const videoPath = this.getAssetPath('chroma-bot/assets/vid/Chroma_Vid.mp4');
        
        overlay.innerHTML = `
            <div class="chromabot-container" style="
                width: 100%;
                height: 100%;
                border-radius: 50%;
                overflow: hidden;
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
                border: 3px solid #00ffff;
                cursor: pointer;
                transition: transform 0.3s ease;
                animation: orbPulse 3s ease-in-out infinite;
            ">
                <video id="chromabot-video" 
                       autoplay 
                       loop 
                       muted 
                       playsinline
                       style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;">
                    <source src="${videoPath}" type="video/mp4">
                </video>
            </div>
            
            <!-- Chat Box -->
            <div class="chromabot-chat-box" style="
                position: absolute;
                bottom: 170px;
                right: 0;
                width: 350px;
                height: 450px;
                background: rgba(10, 20, 30, 0.95);
                border: 2px solid #00ffff;
                border-radius: 12px;
                display: none;
                flex-direction: column;
                padding: 15px;
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
            ">
                <div class="chat-header" style="
                    font-weight: bold;
                    margin-bottom: 15px;
                    text-align: center;
                    position: relative;
                    color: #00ffff;
                    font-size: 1.1rem;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(0, 255, 255, 0.3);
                ">
                    💬 ChromaBot Assistant
                    <button class="close-chat" style="
                        position: absolute;
                        right: 0;
                        top: 0;
                        background: transparent;
                        border: none;
                        color: #00ffff;
                        font-size: 20px;
                        cursor: pointer;
                        transition: color 0.3s ease;
                    ">✖</button>
                </div>
                <div class="chat-messages" style="
                    flex: 1;
                    overflow-y: auto;
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.9);
                    line-height: 1.6;
                    padding-right: 5px;
                ">
                    <p style="margin-bottom: 10px;"><b style="color: #00ffff;">ChromaBot:</b> Hello! I'm here to help you understand the decisions in this story. Ask me anything!</p>
                </div>
                <form class="chat-form" style="
                    display: flex;
                    margin-top: 10px;
                    gap: 8px;
                ">
                    <input type="text" class="chat-input" placeholder="Ask about the story..." required style="
                        flex: 1;
                        padding: 10px;
                        border: 1px solid rgba(0, 255, 255, 0.5);
                        background: rgba(0, 0, 0, 0.5);
                        color: white;
                        border-radius: 6px;
                        font-family: 'Courier New', monospace;
                        font-size: 0.9rem;
                    ">
                    <button type="submit" class="chat-submit" style="
                        padding: 10px 20px;
                        border: none;
                        border-radius: 6px;
                        background: #00ffff;
                        color: #000;
                        cursor: pointer;
                        font-weight: bold;
                        font-family: 'Courier New', monospace;
                        transition: all 0.3s ease;
                    ">Send</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.overlay = overlay;
        this.container = overlay.querySelector('.chromabot-container');
        this.chatBox = overlay.querySelector('.chromabot-chat-box');
        this.chatMessages = overlay.querySelector('.chat-messages');
        this.chatForm = overlay.querySelector('.chat-form');
        this.chatInput = overlay.querySelector('.chat-input');
        this.closeButton = overlay.querySelector('.close-chat');
        this.video = overlay.querySelector('#chromabot-video');
        
        // Add click handler to open chat
        this.container.addEventListener('click', () => this.toggleChat());
        
        // Add close button handler
        this.closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleChat();
        });
        
        // Add form submit handler
        this.chatForm.addEventListener('submit', (e) => this.handleChatSubmit(e));
        
        // Add hover effect
        this.container.addEventListener('mouseenter', () => {
            this.container.style.transform = 'scale(1.1)';
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.container.style.transform = 'scale(1)';
        });
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes orbPulse {
                0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.5); }
                50% { box-shadow: 0 0 45px rgba(0, 255, 255, 0.8); }
            }
            .chat-submit:hover {
                background: #00cccc !important;
                transform: translateY(-2px);
            }
            .close-chat:hover {
                color: #ff0040 !important;
            }
            .chat-messages::-webkit-scrollbar {
                width: 6px;
            }
            .chat-messages::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 3px;
            }
            .chat-messages::-webkit-scrollbar-thumb {
                background: rgba(0, 255, 255, 0.5);
                border-radius: 3px;
            }
            .chat-messages::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 255, 255, 0.7);
            }
        `;
        document.head.appendChild(style);
        
        // Log the path for debugging
        console.log('🎥 ChromaBot video path:', videoPath);
        
        // Add error handler for video loading
        this.video.addEventListener('error', (e) => {
            console.error('❌ ChromaBot video failed to load:', videoPath);
            console.error('Error details:', e);
        });
        
        this.video.addEventListener('loadeddata', () => {
            console.log('✅ ChromaBot video loaded successfully');
        });
    }
    
    /**
     * Play sound effect
     */
    playSound(soundName, volume = 0.5) {
        try {
            const audio = new Audio(this.getAssetPath(`videos/eli/audio/chromabot/${soundName}.wav`));
            audio.volume = volume;
            audio.play().catch(err => console.log('Sound play prevented:', err.message));
        } catch (error) {
            console.log('Sound error:', error.message);
        }
    }
    
    /**
     * Toggle chat interface
     */
    toggleChat() {
        const storyVideo = document.getElementById('story-video');
        
        if (this.chatBox.style.display === 'flex') {
            // Closing chat - resume video only if not at end
            this.chatBox.style.display = 'none';
            
            // Play chat close sound
            this.playSound('chat_close', 0.4);
            
            // Resume the main story video only if it's not ended
            if (storyVideo && storyVideo.paused && !storyVideo.ended) {
                storyVideo.play().catch(err => {
                    console.log('Video play prevented:', err.message);
                });
                console.log('▶ Video resumed (chat closed)');
            } else if (storyVideo && storyVideo.ended) {
                console.log('⏹ Video has ended, not resuming');
            }
            
            // Resume ChromaBot video
            if (this.video) {
                this.video.play();
            }
            
            // DON'T resume corruption animation - it's already running continuously
            // The 16-second intervals work perfectly when not interrupted
            
            console.log('💬 Chat closed');
        } else {
            // Opening chat - pause video
            this.chatBox.style.display = 'flex';
            
            // Play chat open sound
            this.playSound('chat_open', 0.4);
            
            // Pause the main story video only if it's playing
            if (storyVideo && !storyVideo.paused && !storyVideo.ended) {
                storyVideo.pause();
                console.log('⏸ Video paused (chat opened)');
            }
            
            // Pause ChromaBot video
            if (this.video) {
                this.video.pause();
            }
            
            // DON'T pause corruption animation - let it run continuously at 16-second intervals
            // The slow timing (16s per frame) works perfectly when left alone
            
            this.chatInput.focus();
            console.log('💬 Chat opened');
        }
    }
    
    /**
     * Handle chat message submission
     */
    async handleChatSubmit(event) {
        event.preventDefault();
        const message = this.chatInput.value.trim();
        
        if (message) {
            // Add user message
            const userMsg = document.createElement('p');
            userMsg.style.marginBottom = '10px';
            userMsg.innerHTML = `<b style="color: #00ff88;">You:</b> ${message}`;
            this.chatMessages.appendChild(userMsg);
            
            // Clear input
            this.chatInput.value = '';
            
            // Scroll to bottom
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            
            // Get bot response
            const response = await this.generateResponse(message);
            
            // Add bot response
            setTimeout(() => {
                // Play message sound
                this.playSound('chromabot_message', 0.3);
                
                const botMsg = document.createElement('p');
                botMsg.style.marginBottom = '10px';
                botMsg.innerHTML = `<b style="color: #00ffff;">ChromaBot:</b> ${response}`;
                this.chatMessages.appendChild(botMsg);
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }, 800);
        }
    }
    
    /**
     * Generate bot response with context awareness
     * Tries scene-specific responses first, then API, then fallback
     */
    async generateResponse(message) {
        const messageLower = message.toLowerCase();
        
        // Get current scene number
        const currentScene = window.currentSceneIndex !== undefined ? window.currentSceneIndex + 1 : 1;
        
        // 1. Try scene-specific responses first (from chromabot-scene-training.js)
        if (window.getSceneChromaBotResponse) {
            const sceneResponse = window.getSceneChromaBotResponse(currentScene, messageLower);
            if (sceneResponse) {
                console.log('✅ Using scene-specific response');
                return sceneResponse;
            }
        }
        
        // 2. Check for direct character/story questions
        const directResponses = {
            'who is eli': "Eli is a young gamer facing peer pressure and online scams. He's learning to navigate digital dangers while staying true to himself.",
            'what is eli': "Eli is the main character in this story - a gamer who gets caught up in online manipulation and gambling schemes.",
            'tell me about eli': "Eli loves gaming but struggles with peer pressure and online scams. His journey teaches us about digital safety.",
            'who is maya': "Maya is a cybersecurity investigator who knows how to spot scams. She's smart, cautious, and always verifies information.",
            'who is stanley': "Stanley is a businessman who fell victim to identity theft. His story shows how even careful people can be scammed.",
            'what is this game': "This is Data_Bleed - an interactive experience that teaches scam awareness through psychological horror. Every choice matters!",
            'what is data bleed': "Data_Bleed is a training simulation for digital survival. It uses horror and storytelling to teach you how to spot and avoid scams.",
            'how do i play': "Watch the story unfold, make decisions when prompted, and learn from the consequences. Your trust score shows how vulnerable you are.",
            'what is trust score': "Your trust score (0-100) shows your vulnerability to scams. Higher = safer. Bad decisions lower it. Stay above 30!",
            'what happens if trust is low': "If your trust score drops too low, you become highly vulnerable to scams and manipulation. The game shows you the consequences.",
        };
        
        // Check for direct matches
        for (const [key, value] of Object.entries(directResponses)) {
            if (messageLower.includes(key)) {
                console.log('✅ Using direct response for:', key);
                return value;
            }
        }
        
        // 3. Try API call for contextual responses
        try {
            const apiUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:3001/api/chat'
                : 'https://data-bleed-vsc-production.up.railway.app/api/chat';
                
            const apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    character: 'eli',
                    sessionId: 'video-orb-chat',
                    mode: 'standard'
                })
            });
            
            if (apiResponse.ok) {
                const data = await apiResponse.json();
                console.log('✅ Using API response');
                return data.reply || this.getFallbackResponse();
            }
        } catch (error) {
            console.log('⚠️ API unavailable, using fallback');
        }
        
        // 4. Fallback to generic but helpful responses
        return this.getFallbackResponse();
    }
    
    /**
     * Get fallback response when API is unavailable
     */
    getFallbackResponse() {
        const responses = [
            "That's a great question! In this scenario, it's important to verify information before acting.",
            "Good thinking! Always be cautious with personal information online.",
            "Interesting point. Remember, scammers often create urgency to pressure victims.",
            "That's right! Trust your instincts when something feels off.",
            "Exactly! Legitimate organizations won't ask for sensitive info via email or text.",
            "Great observation! Look for red flags like poor grammar or suspicious links.",
            "You're on the right track! Always verify the sender's identity before responding.",
            "Smart thinking! Always double-check URLs and sender addresses before clicking.",
            "Good instinct! If an offer seems too good to be true, it probably is.",
            "Excellent point! Never share passwords or sensitive data through unsecured channels."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    /**
     * Show ChromaBot with message
     */
    show(message = null) {
        // ChromaBot is always visible, just show message if provided
        if (message) {
            this.messageText.textContent = message;
            this.messageBox.style.opacity = '1';
            
            // Auto-hide message after 5 seconds
            setTimeout(() => {
                this.messageBox.style.opacity = '0';
            }, 5000);
        }
    }
    
    /**
     * Hide ChromaBot message (but keep bot visible)
     */
    hide() {
        this.messageBox.style.opacity = '0';
    }
    
    /**
     * React to bad decision - NO VISUAL EFFECTS
     * Visual feedback is handled by ChromaBotCorruptionAnimator instead
     */
    onBadDecision(trustDelta, decisionContext) {
        this.badDecisionStreak++;
        
        // DISABLED: Video orb glitch effects (using image corruption instead)
        // this.triggerGlitch(Math.abs(trustDelta));
        
        // Optional: Generate AI response (currently not displayed)
        // const message = this.generateWarningMessage(trustDelta, decisionContext);
        
        console.log('📹 ChromaBot video orb: Bad decision registered (visual effects disabled)');
    }
    
    /**
     * React to good decision - NO VISUAL EFFECTS
     * Visual feedback is handled by ChromaBotCorruptionAnimator instead
     */
    onGoodDecision(trustDelta, decisionContext) {
        this.badDecisionStreak = Math.max(0, this.badDecisionStreak - 1);
        
        // DISABLED: Video orb stabilize effects (using image healing instead)
        // this.triggerStabilize();
        
        // Optional: Generate approval message (currently not displayed)
        // const message = this.generateApprovalMessage(trustDelta, decisionContext);
        
        console.log('📹 ChromaBot video orb: Good decision registered (visual effects disabled)');
    }
    
    /**
     * Trigger glitch animation
     */
    triggerGlitch(intensity) {
        if (this.isGlitching) return;
        this.isGlitching = true;
        
        const container = this.overlay.querySelector('.chromabot-container');
        
        // Apply glitch effects
        container.style.animation = 'chromaGlitch 0.5s ease-in-out';
        container.style.filter = `hue-rotate(${intensity * 10}deg) saturate(${1 + intensity / 10})`;
        container.style.borderColor = '#ff0040';
        container.style.boxShadow = '0 0 30px rgba(255, 0, 64, 0.8)';
        
        // Add glitch class for CSS animations
        container.classList.add('glitching');
        
        setTimeout(() => {
            this.isGlitching = false;
            container.classList.remove('glitching');
            container.style.animation = '';
            container.style.filter = '';
            container.style.borderColor = '#00ffff';
            container.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.5)';
        }, 2000);
    }
    
    /**
     * Trigger critical glitch (3+ bad decisions)
     */
    triggerCriticalGlitch() {
        const container = this.overlay.querySelector('.chromabot-container');
        
        // Intense glitch effect
        container.style.animation = 'chromaCriticalGlitch 1s ease-in-out';
        container.style.filter = 'hue-rotate(180deg) saturate(3) contrast(2)';
        
        // Show critical warning
        this.messageText.textContent = '⚠️ CRITICAL: Subject exhibiting high-risk behavior patterns';
        this.messageBox.style.borderColor = '#ff0040';
        this.messageBox.style.opacity = '1';
        
        setTimeout(() => {
            container.style.animation = '';
            container.style.filter = '';
            this.messageBox.style.borderColor = '#00ffff';
        }, 3000);
    }
    
    /**
     * Trigger stabilize effect (good decision)
     */
    triggerStabilize() {
        const container = this.overlay.querySelector('.chromabot-container');
        
        // Stabilize effect
        container.style.animation = 'chromaStabilize 0.8s ease-out';
        container.style.filter = 'brightness(1.2) saturate(1.2)';
        container.style.borderColor = '#00ff88';
        container.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.8)';
        
        setTimeout(() => {
            container.style.animation = '';
            container.style.filter = '';
            container.style.borderColor = '#00ffff';
            container.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.5)';
        }, 1500);
    }
    
    /**
     * Generate warning message based on decision
     */
    generateWarningMessage(trustDelta, context) {
        const severity = Math.abs(trustDelta);
        
        const warnings = {
            mild: [
                'Questionable decision detected.',
                'Subject showing vulnerability indicators.',
                'Risk assessment: Elevated.'
            ],
            moderate: [
                '⚠️ High-risk behavior observed.',
                'Subject susceptible to exploitation.',
                'Intervention recommended.'
            ],
            severe: [
                '🚨 CRITICAL: Dangerous decision pattern.',
                'Subject highly vulnerable to scams.',
                'Immediate intervention required.'
            ]
        };
        
        let category = 'mild';
        if (severity >= 25) category = 'severe';
        else if (severity >= 15) category = 'moderate';
        
        const messages = warnings[category];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    /**
     * Generate approval message for good decisions
     */
    generateApprovalMessage(trustDelta, context) {
        const approvals = [
            '✓ Secure decision confirmed.',
            'Subject demonstrating awareness.',
            'Risk mitigation successful.',
            'Positive security behavior noted.',
            'Assessment: Low vulnerability.'
        ];
        
        return approvals[Math.floor(Math.random() * approvals.length)];
    }
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes chromaGlitch {
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(-5px, 5px); }
        20% { transform: translate(5px, -5px); }
        30% { transform: translate(-5px, -5px); }
        40% { transform: translate(5px, 5px); }
        50% { transform: translate(-5px, 5px) scale(1.05); }
        60% { transform: translate(5px, -5px) scale(0.95); }
        70% { transform: translate(-5px, -5px); }
        80% { transform: translate(5px, 5px); }
        90% { transform: translate(-5px, 5px); }
    }
    
    @keyframes chromaCriticalGlitch {
        0%, 100% { transform: translate(0, 0) scale(1); }
        10% { transform: translate(-10px, 10px) scale(1.1); }
        20% { transform: translate(10px, -10px) scale(0.9); }
        30% { transform: translate(-10px, -10px) scale(1.1); }
        40% { transform: translate(10px, 10px) scale(0.9); }
        50% { transform: translate(-10px, 10px) scale(1.15); }
        60% { transform: translate(10px, -10px) scale(0.85); }
        70% { transform: translate(-10px, -10px) scale(1.1); }
        80% { transform: translate(10px, 10px) scale(0.9); }
        90% { transform: translate(-10px, 10px) scale(1.05); }
    }
    
    @keyframes chromaStabilize {
        0% { transform: scale(0.95); opacity: 0.8; }
        50% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .glitching {
        animation: chromaGlitch 0.1s infinite !important;
    }
`;
document.head.appendChild(style);

// Export
if (typeof window !== 'undefined') {
    window.ChromaBotVideoIntegration = ChromaBotVideoIntegration;
}
