/**
 * Pause Menu System
 * Provides pause functionality and menu overlay
 */

class PauseMenuSystem {
    constructor(videoElement) {
        this.video = videoElement;
        this.isPaused = false;
        this.pauseButton = null;
        this.menuOverlay = null;
        
        this.init();
    }
    
    init() {
        this.createPauseButton();
        this.createMenuOverlay();
        this.setupKeyboardShortcuts();
    }
    
    /**
     * Create pause button (top left)
     */
    createPauseButton() {
        const button = document.createElement('button');
        button.id = 'pause-button';
        button.innerHTML = '⏸';
        button.title = 'Pause (Space)';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #00ffff;
            border-radius: 8px;
            color: #00ffff;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 9999;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        button.onmouseenter = () => {
            button.style.background = 'rgba(0, 255, 255, 0.2)';
            button.style.transform = 'scale(1.1)';
        };
        
        button.onmouseleave = () => {
            button.style.background = 'rgba(0, 0, 0, 0.8)';
            button.style.transform = 'scale(1)';
        };
        
        button.onclick = () => this.togglePause();
        
        document.body.appendChild(button);
        this.pauseButton = button;
    }
    
    /**
     * Get correct path for assets (localhost vs production)
     */
    getAssetPath(relativePath) {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/videos/eli/')) {
            return `../../${relativePath}`;
        }
        
        if (currentPath.includes('/videos/')) {
            return `../${relativePath}`;
        }
        
        return relativePath;
    }
    
    /**
     * Play sound effect
     */
    playSound(soundName, volume = 0.5) {
        try {
            const audio = new Audio(this.getAssetPath(`videos/eli/audio/gameplay/${soundName}.wav`));
            audio.volume = volume;
            audio.play().catch(err => console.log('Sound play prevented:', err.message));
        } catch (error) {
            console.log('Sound error:', error.message);
        }
    }
    
    /**
     * Create menu overlay using Eli Dashboard design with LIVE game data
     */
    createMenuOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'pause-menu-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
            display: none;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-family: 'JetBrains Mono', monospace;
            overflow-y: auto;
        `;
        
        // Import fonts
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
        
        overlay.innerHTML = `
            <style>
                .terminal-grid {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                
                .main-terminal {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 500px;
                    background: rgba(0, 0, 0, 0.95);
                    border: 3px solid #00d4ff;
                    border-radius: 12px;
                    padding: 40px;
                    box-shadow: 
                        0 0 50px rgba(0, 212, 255, 0.4),
                        inset 0 0 20px rgba(0, 212, 255, 0.1);
                }
                
                .terminal-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .terminal-title {
                    font-family: 'Orbitron', monospace;
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: #00d4ff;
                    text-shadow: 0 0 20px #00d4ff;
                    margin-bottom: 10px;
                    letter-spacing: 3px;
                }
                
                .terminal-subtitle {
                    font-size: 1rem;
                    color: #7fb3d3;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                
                .session-status {
                    background: rgba(0, 212, 255, 0.1);
                    border: 1px solid #00d4ff;
                    border-radius: 6px;
                    padding: 15px;
                    margin-bottom: 30px;
                    text-align: center;
                }
                
                .status-line {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    font-size: 0.9rem;
                }
                
                .menu-options {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .menu-btn {
                    background: transparent;
                    border: 2px solid #00d4ff;
                    color: #00d4ff;
                    padding: 15px 25px;
                    font-family: 'Orbitron', monospace;
                    font-size: 1.1rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .menu-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }
                
                .menu-btn:hover {
                    background: rgba(0, 212, 255, 0.1);
                    box-shadow: 0 0 25px rgba(0, 212, 255, 0.5);
                    transform: translateY(-2px);
                }
                
                .menu-btn:hover::before {
                    left: 100%;
                }
                
                .menu-btn.danger {
                    border-color: #ff4757;
                    color: #ff4757;
                }
                
                .menu-btn.danger:hover {
                    background: rgba(255, 71, 87, 0.1);
                    box-shadow: 0 0 25px rgba(255, 71, 87, 0.5);
                }
            </style>
            
            <div class="terminal-grid"></div>
            
            <div class="main-terminal">
                <div class="terminal-header">
                    <div class="terminal-title">DATA_BLEED</div>
                    <div class="terminal-subtitle">Session Suspended</div>
                </div>
                
                <div class="session-status">
                    <div class="status-line">
                        <span>ENCRYPTION:</span>
                        <span style="color: #00d4ff;">AES-256</span>
                    </div>
                    <div class="status-line">
                        <span>CONNECTION:</span>
                        <span style="color: #00ff00;">SECURE</span>
                    </div>
                    <div class="status-line">
                        <span>DATA STREAM:</span>
                        <span style="color: #ff4757;">ACTIVE</span>
                    </div>
                    <div class="status-line">
                        <span>NEURAL PATTERN:</span>
                        <span style="color: #ff4757;">COMPROMISED</span>
                    </div>
                </div>
                
                <div class="menu-options">
                    <button class="menu-btn" id="resume-btn">
                        > RESUME_SESSION
                    </button>
                    <button class="menu-btn" id="access-settings-btn">
                        > ACCESS_SETTINGS
                    </button>
                    <button class="menu-btn danger" id="exit-btn">
                        > TERMINATE_CONNECTION
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.menuOverlay = overlay;
        
        // Button handlers - matching Eli_Pause_Screen.html functionality
        overlay.querySelector('#resume-btn').onclick = () => this.resume();
        overlay.querySelector('#access-settings-btn').onclick = () => this.restart();
        overlay.querySelector('#exit-btn').onclick = () => this.exit();
    }
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.togglePause();
            } else if (e.code === 'Escape' && this.isPaused) {
                this.resume();
            }
        });
    }
    
    /**
     * Toggle pause state
     */
    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }
    
    /**
     * Pause video and show menu
     */
    pause() {
        if (this.video) {
            this.video.pause();
            // Store the onended handler and remove it during pause
            this.storedOnEnded = this.video.onended;
            this.video.onended = null;
        }
        
        // Pause audio narration if playing
        if (window.audioManager) {
            window.audioManager.pauseNarration();
            console.log('🎙️ Audio narration paused');
        }
        
        // Pause heartbeat corruption if playing
        if (window.chromaBotCorruptionSequence && window.chromaBotCorruptionSequence.heartbeatInterval) {
            window.chromaBotCorruptionSequence.pauseHeartbeat();
            console.log('💔 Heartbeat corruption paused');
        }
        
        // Play pause sound
        this.playSound('video_pause', 0.4);
        
        this.isPaused = true;
        this.pauseButton.innerHTML = '▶';
        this.pauseButton.title = 'Resume (Space)';
        
        // Disable decision overlay interactions
        const decisionOverlay = document.getElementById('decision-overlay');
        if (decisionOverlay) {
            decisionOverlay.style.pointerEvents = 'none';
        }
        
        this.menuOverlay.style.display = 'flex';
        setTimeout(() => {
            this.menuOverlay.style.opacity = '1';
        }, 10);
        
        // Dispatch pause event for other systems
        window.dispatchEvent(new CustomEvent('gamePaused'));
        
        console.log('⏸ Surveillance paused');
    }
    
    /**
     * Resume video and hide menu
     */
    resume() {
        if (this.video) {
            this.video.play();
            // Restore the onended handler
            if (this.storedOnEnded) {
                this.video.onended = this.storedOnEnded;
            }
        }
        
        // Resume audio narration if it was playing
        if (window.audioManager) {
            window.audioManager.resumeNarration();
            console.log('🎙️ Audio narration resumed');
        }
        
        // Resume heartbeat corruption if it was paused
        if (window.chromaBotCorruptionSequence && window.chromaBotCorruptionSequence.isPausedHeartbeat) {
            window.chromaBotCorruptionSequence.resumeHeartbeat();
            console.log('💔 Heartbeat corruption resumed');
        }
        
        // Play resume sound
        this.playSound('video_resume', 0.4);
        
        this.isPaused = false;
        this.pauseButton.innerHTML = '⏸';
        this.pauseButton.title = 'Pause (Space)';
        
        // Re-enable decision overlay interactions
        const decisionOverlay = document.getElementById('decision-overlay');
        if (decisionOverlay) {
            decisionOverlay.style.pointerEvents = 'auto';
        }
        
        this.menuOverlay.style.opacity = '0';
        setTimeout(() => {
            this.menuOverlay.style.display = 'none';
        }, 300);
        
        // Dispatch resume event for other systems
        window.dispatchEvent(new CustomEvent('gameResumed'));
        
        console.log('▶ Surveillance resumed');
    }
    
    /**
     * Restart assessment
     */
    restart() {
        if (confirm('Restart assessment from beginning? All progress will be lost.')) {
            window.location.reload();
        }
    }
    
    /**
     * Exit to menu
     */
    exit() {
        if (confirm('Exit to character selection? Progress will not be saved.')) {
            const exitPath = this.getAssetPath('Enhanced_Login_System/enhanced-character-selector.html');
            window.location.href = exitPath;
        }
    }
    
    /**
     * Destroy pause menu
     */
    destroy() {
        if (this.pauseButton) this.pauseButton.remove();
        if (this.menuOverlay) this.menuOverlay.remove();
    }
}

// Export
if (typeof window !== 'undefined') {
    window.PauseMenuSystem = PauseMenuSystem;
}
