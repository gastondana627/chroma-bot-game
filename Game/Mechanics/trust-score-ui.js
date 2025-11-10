/**
 * Trust Score UI System
 * Real-time animated feedback and visualization for trust score changes
 * Integrates with Bayesian Trust Engine for educational horror experience
 */

class TrustScoreUI {
    constructor(containerId = 'trust-score-container') {
        this.containerId = containerId;
        this.trustEngine = new BayesianTrustEngine();
        this.currentScore = 50; // Starting neutral
        this.currentCharacter = null;
        this.animationQueue = [];
        this.isAnimating = false;
        
        // UI state
        this.uiCorruption = 0; // 0-1 scale of UI corruption
        this.particleSystem = null;
        
        this.init();
    }

    /**
     * Initialize the trust score UI system
     */
    init() {
        this.createTrustMeter();
        this.createParticleSystem();
        this.setupEventListeners();
        
        console.log('Trust Score UI initialized');
    }

    /**
     * Create the main trust meter UI element
     */
    createTrustMeter() {
        // Remove existing meter if present
        const existing = document.getElementById(this.containerId);
        if (existing) {
            existing.remove();
        }

        // Create container
        const container = document.createElement('div');
        container.id = this.containerId;
        container.className = 'trust-score-container';
        
        container.innerHTML = `
            <div class="trust-meter-wrapper">
                <div class="trust-meter-label">Security Awareness</div>
                <div class="trust-meter-bar">
                    <div class="trust-meter-fill" id="trust-meter-fill"></div>
                    <div class="trust-meter-indicator" id="trust-meter-indicator"></div>
                </div>
                <div class="trust-score-value" id="trust-score-value">${this.currentScore}</div>
                <div class="trust-level-text" id="trust-level-text">CAUTIOUS</div>
            </div>
            <div class="trust-feedback" id="trust-feedback"></div>
        `;

        // Add CSS styles
        this.addTrustMeterStyles();
        
        // Append to body (positioned fixed)
        document.body.appendChild(container);
        
        // Initial update
        this.updateTrustMeter(this.currentScore, false);
    }

    /**
     * Add CSS styles for trust meter
     */
    addTrustMeterStyles() {
        if (document.getElementById('trust-meter-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'trust-meter-styles';
        styles.textContent = `
            .trust-score-container {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 1500;
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #00FFFF;
                border-radius: 12px;
                padding: 15px;
                min-width: 200px;
                font-family: 'Inter', sans-serif;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }

            /* Maya Theme - Romance/Cybersecurity */
            .trust-score-container.character-maya {
                background: linear-gradient(135deg, 
                    rgba(20, 10, 40, 0.9) 0%, 
                    rgba(40, 10, 60, 0.8) 50%, 
                    rgba(10, 30, 60, 0.9) 100%);
                border: 2px solid;
                border-image: linear-gradient(45deg, #ff1493, #00bfff, #ff1493) 1;
                border-radius: 25px;
                box-shadow: 
                    0 0 60px rgba(255, 20, 147, 0.3),
                    0 0 80px rgba(0, 191, 255, 0.2);
                font-family: 'JetBrains Mono', monospace;
            }

            .trust-score-container.character-maya::before {
                content: '';
                position: absolute;
                top: -3px;
                left: -3px;
                right: -3px;
                bottom: -3px;
                background: linear-gradient(45deg, #ff1493, #00bfff, #ff1493, #00bfff);
                border-radius: 25px;
                z-index: -1;
                animation: borderRotate 4s linear infinite;
                filter: blur(2px);
            }

            /* Eli Theme - Gaming Terminal */
            .trust-score-container.character-eli {
                background: rgba(5, 20, 35, 0.85);
                border: 2px solid #00ffff;
                border-radius: 0;
                box-shadow: 
                    0 0 50px rgba(0, 255, 255, 0.3),
                    0 25px 50px rgba(0, 0, 0, 0.5);
                font-family: 'Orbitron', monospace;
                clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
            }

            .trust-score-container.character-eli::before {
                content: '';
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                background: linear-gradient(45deg, #00ffff, transparent, #00ffff, transparent, #00ffff);
                z-index: -1;
                border-radius: 0;
                animation: borderPulse 3s linear infinite;
                opacity: 0.7;
            }

            /* Stanley Theme - Social Media Corruption */
            .trust-score-container.character-stanley {
                background: linear-gradient(145deg, #e5e7eb 0%, #d1d5db 100%);
                border: 2px solid #9ca3af;
                border-radius: 12px;
                color: #1f2937;
                box-shadow: 
                    0 20px 40px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                font-family: 'Inter', sans-serif;
                transition: all 0.5s ease;
            }

            .trust-score-container.character-stanley.corrupted {
                background: linear-gradient(145deg, #374151 0%, #1f2937 100%);
                border-color: #7f1d1d;
                color: #e5e7eb;
                box-shadow: 
                    0 20px 40px rgba(139, 0, 0, 0.3),
                    inset 0 1px 0 rgba(220, 38, 38, 0.2);
                animation: glitch 0.3s infinite;
            }

            .trust-meter-wrapper {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .trust-meter-label {
                color: #00FFFF;
                font-size: 12px;
                font-weight: bold;
                text-align: center;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            /* Character-specific label colors */
            .character-maya .trust-meter-label {
                color: #ff1493;
                text-shadow: 0 0 8px rgba(255, 20, 147, 0.6);
                animation: titleGlitch 3s ease-in-out infinite;
            }

            .character-eli .trust-meter-label {
                color: #00ffff;
                text-shadow: 
                    0 0 20px rgba(0, 255, 255, 0.8),
                    0 0 40px rgba(0, 255, 255, 0.4);
                animation: titleGlow 2s ease-in-out infinite alternate;
            }

            .character-stanley .trust-meter-label {
                color: #374151;
                font-weight: 500;
            }

            .character-stanley.corrupted .trust-meter-label {
                color: #dc2626;
                text-shadow: 0 0 8px rgba(220, 38, 38, 0.4);
            }

            .trust-meter-bar {
                position: relative;
                width: 100%;
                height: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .trust-meter-fill {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                background: linear-gradient(90deg, #FF0040 0%, #FF6B35 25%, #FFD700 50%, #00FF88 100%);
                border-radius: 10px;
                transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            }

            /* Character-specific trust meter fills */
            .character-maya .trust-meter-fill {
                background: linear-gradient(90deg, #ff1493 0%, #ff69b4 25%, #00bfff 50%, #ff1493 100%);
                box-shadow: 0 0 15px rgba(255, 20, 147, 0.5);
                animation: mayaGlow 2s ease-in-out infinite alternate;
            }

            .character-eli .trust-meter-fill {
                background: linear-gradient(90deg, #ff4500 0%, #ffd700 25%, #00ffff 50%, #00ff88 100%);
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
                animation: eliPulse 1.5s ease-in-out infinite;
            }

            .character-stanley .trust-meter-fill {
                background: linear-gradient(90deg, #dc2626 0%, #f59e0b 25%, #10b981 50%, #3b82f6 100%);
                box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
            }

            .character-stanley.corrupted .trust-meter-fill {
                background: linear-gradient(90deg, #7f1d1d 0%, #991b1b 50%, #dc2626 100%);
                box-shadow: 0 0 15px rgba(220, 38, 38, 0.5);
                animation: stanleyCorrupt 0.5s ease-in-out infinite;
            }

            .trust-meter-indicator {
                position: absolute;
                top: -2px;
                width: 4px;
                height: 24px;
                background: white;
                border-radius: 2px;
                box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
                transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .trust-score-value {
                color: white;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                text-shadow: 0 0 10px currentColor;
                transition: color 0.3s ease;
            }

            .trust-level-text {
                color: #00FFFF;
                font-size: 10px;
                font-weight: bold;
                text-align: center;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: color 0.3s ease;
            }

            .trust-feedback {
                margin-top: 10px;
                padding: 8px;
                border-radius: 6px;
                font-size: 12px;
                text-align: center;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease;
            }

            .trust-feedback.show {
                opacity: 1;
                transform: translateY(0);
            }

            .trust-feedback.positive {
                background: rgba(0, 255, 136, 0.2);
                border: 1px solid #00FF88;
                color: #00FF88;
            }

            .trust-feedback.negative {
                background: rgba(255, 107, 53, 0.2);
                border: 1px solid #FF6B35;
                color: #FF6B35;
            }

            .trust-feedback.critical {
                background: rgba(255, 0, 64, 0.2);
                border: 1px solid #FF0040;
                color: #FF0040;
                animation: pulse 1s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            /* Corruption effects */
            .trust-score-container.corrupted {
                border-color: #FF0040;
                animation: glitch 0.3s infinite;
            }

            .trust-score-container.corrupted .trust-meter-fill {
                background: linear-gradient(90deg, #FF0040 0%, #8B0000 100%);
                animation: flicker 0.5s infinite;
            }

            @keyframes glitch {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }

            @keyframes flicker {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.8; }
            }

            /* Character-specific animations */
            @keyframes titleGlitch {
                0%, 90%, 100% { 
                    text-shadow: 0 0 8px rgba(255, 20, 147, 0.6);
                    transform: translateX(0);
                }
                92% { 
                    text-shadow: 
                        2px 0 rgba(255, 20, 147, 0.8),
                        -2px 0 rgba(0, 191, 255, 0.8);
                    transform: translateX(2px);
                }
                94% { 
                    text-shadow: 
                        -2px 0 rgba(255, 20, 147, 0.8),
                        2px 0 rgba(0, 191, 255, 0.8);
                    transform: translateX(-2px);
                }
            }

            @keyframes titleGlow {
                from { 
                    text-shadow: 
                        0 0 20px rgba(0, 255, 255, 0.8),
                        0 0 40px rgba(0, 255, 255, 0.4);
                }
                to { 
                    text-shadow: 
                        0 0 30px rgba(0, 255, 255, 1),
                        0 0 60px rgba(0, 255, 255, 0.6);
                }
            }

            @keyframes mayaGlow {
                0%, 100% { 
                    box-shadow: 0 0 15px rgba(255, 20, 147, 0.5);
                }
                50% { 
                    box-shadow: 0 0 25px rgba(255, 20, 147, 0.8);
                }
            }

            @keyframes eliPulse {
                0%, 100% { 
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
                    transform: scaleY(1);
                }
                50% { 
                    box-shadow: 0 0 25px rgba(0, 255, 255, 0.8);
                    transform: scaleY(1.05);
                }
            }

            @keyframes stanleyCorrupt {
                0%, 100% { 
                    opacity: 1;
                    transform: translateX(0);
                }
                25% { 
                    opacity: 0.8;
                    transform: translateX(-1px);
                }
                75% { 
                    opacity: 0.9;
                    transform: translateX(1px);
                }
            }

            @keyframes borderRotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes borderPulse {
                0% { background-position: 0% 50%; }
                100% { background-position: 200% 50%; }
            }

            /* Particle effects */
            .trust-particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: #00FFFF;
                border-radius: 50%;
                pointer-events: none;
                z-index: 2000;
            }

            .trust-particle.positive {
                background: #00FF88;
                box-shadow: 0 0 6px #00FF88;
            }

            .trust-particle.negative {
                background: #FF6B35;
                box-shadow: 0 0 6px #FF6B35;
            }

            .trust-particle.critical {
                background: #FF0040;
                box-shadow: 0 0 8px #FF0040;
            }

            /* Character-specific particles */
            .character-maya .trust-particle.positive {
                background: #ff1493;
                box-shadow: 0 0 8px #ff1493;
            }

            .character-maya .trust-particle.negative {
                background: #ff69b4;
                box-shadow: 0 0 6px #ff69b4;
            }

            .character-eli .trust-particle.positive {
                background: #00ffff;
                box-shadow: 0 0 8px #00ffff;
            }

            .character-eli .trust-particle.negative {
                background: #ffd700;
                box-shadow: 0 0 6px #ffd700;
            }

            .character-stanley .trust-particle.positive {
                background: #3b82f6;
                box-shadow: 0 0 6px #3b82f6;
            }

            .character-stanley .trust-particle.negative {
                background: #dc2626;
                box-shadow: 0 0 6px #dc2626;
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Create particle system for trust changes
     */
    createParticleSystem() {
        this.particleSystem = {
            particles: [],
            canvas: null,
            ctx: null
        };

        // Create canvas for particles if needed
        if (!document.getElementById('trust-particles-canvas')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'trust-particles-canvas';
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1999;
            `;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            document.body.appendChild(canvas);
            
            this.particleSystem.canvas = canvas;
            this.particleSystem.ctx = canvas.getContext('2d');
            
            // Start particle animation loop
            this.animateParticles();
        }
    }

    /**
     * Update trust score with animation
     * @param {number} newScore - New trust score
     * @param {boolean} animate - Whether to animate the change
     * @param {object} feedback - Feedback object from trust engine
     */
    updateTrustScore(newScore, animate = true, feedback = null) {
        const oldScore = this.currentScore;
        const delta = newScore - oldScore;
        
        this.currentScore = newScore;
        
        if (animate) {
            this.animateTrustChange(oldScore, newScore, delta);
        } else {
            this.updateTrustMeter(newScore, false);
        }
        
        // Show feedback if provided
        if (feedback) {
            this.showFeedback(feedback);
        }
        
        // Create particles for significant changes
        if (Math.abs(delta) >= 10) {
            this.createTrustParticles(delta);
        }
        
        // Update UI corruption based on trust level
        this.updateUICorruption(newScore);

        // Dispatch trust score update event for Horror Atmosphere Engine
        this.dispatchTrustScoreEvent(oldScore, newScore, delta);
    }

    /**
     * Dispatch trust score update event
     * @param {number} oldScore - Previous trust score
     * @param {number} newScore - New trust score
     * @param {number} delta - Change amount
     */
    dispatchTrustScoreEvent(oldScore, newScore, delta) {
        const event = new CustomEvent('trustScoreUpdated', {
            detail: {
                oldScore: oldScore,
                newScore: newScore,
                trustScore: newScore,
                delta: delta,
                character: this.currentCharacter,
                timestamp: Date.now()
            },
            bubbles: true,
            cancelable: false
        });

        window.dispatchEvent(event);
    }

    /**
     * Animate trust score change
     * @param {number} fromScore - Starting score
     * @param {number} toScore - Ending score
     * @param {number} delta - Change amount
     */
    animateTrustChange(fromScore, toScore, delta) {
        const duration = 600; // ms
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Eased progress for smooth animation
            const easedProgress = this.easeOutCubic(progress);
            const currentScore = fromScore + (delta * easedProgress);
            
            this.updateTrustMeter(currentScore, true);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Update the visual trust meter
     * @param {number} score - Current score
     * @param {boolean} isAnimating - Whether currently animating
     */
    updateTrustMeter(score, isAnimating) {
        const fill = document.getElementById('trust-meter-fill');
        const indicator = document.getElementById('trust-meter-indicator');
        const value = document.getElementById('trust-score-value');
        const levelText = document.getElementById('trust-level-text');
        
        if (!fill || !indicator || !value || !levelText) return;
        
        // Calculate percentage (0-100 scale to 0-200 scale)
        const percentage = ((score + 100) / 200) * 100;
        
        // Update fill width and indicator position
        fill.style.width = `${percentage}%`;
        indicator.style.left = `calc(${percentage}% - 2px)`;
        
        // Update score value
        value.textContent = Math.round(score);
        
        // Get trust level info with character theming
        const levelInfo = this.trustEngine.getTrustLevel(score, this.currentCharacter);
        
        // Update colors and text
        value.style.color = levelInfo.color;
        levelText.textContent = levelInfo.level;
        levelText.style.color = levelInfo.color;
        
        // Update container border color
        const container = document.getElementById(this.containerId);
        if (container) {
            container.style.borderColor = levelInfo.color;
        }
    }

    /**
     * Show feedback message
     * @param {object} feedback - Feedback object
     */
    showFeedback(feedback) {
        const feedbackEl = document.getElementById('trust-feedback');
        if (!feedbackEl) return;
        
        // Clear existing classes
        feedbackEl.className = 'trust-feedback';
        
        // Set content and type
        feedbackEl.textContent = feedback.message;
        feedbackEl.classList.add(feedback.type);
        
        // Show with animation
        feedbackEl.classList.add('show');
        
        // Hide after delay
        setTimeout(() => {
            feedbackEl.classList.remove('show');
        }, 3000);
    }

    /**
     * Create particle effects for trust changes
     * @param {number} delta - Trust change amount
     */
    createTrustParticles(delta) {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const particleCount = Math.min(Math.abs(delta), 20);
        const type = delta > 0 ? 'positive' : (delta < -20 ? 'critical' : 'negative');
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(centerX, centerY, type);
        }
    }

    /**
     * Create individual particle
     * @param {number} x - Starting X position
     * @param {number} y - Starting Y position
     * @param {string} type - Particle type (positive, negative, critical)
     */
    createParticle(x, y, type) {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1.0,
            decay: 0.02,
            type: type,
            size: Math.random() * 3 + 2
        };
        
        this.particleSystem.particles.push(particle);
    }

    /**
     * Animate particle system
     */
    animateParticles() {
        if (!this.particleSystem.ctx) return;
        
        const ctx = this.particleSystem.ctx;
        const canvas = this.particleSystem.canvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        this.particleSystem.particles = this.particleSystem.particles.filter(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            // Draw particle
            if (particle.life > 0) {
                ctx.save();
                ctx.globalAlpha = particle.life;
                
                // Set color based on type
                const colors = {
                    positive: '#00FF88',
                    negative: '#FF6B35',
                    critical: '#FF0040'
                };
                
                ctx.fillStyle = colors[particle.type] || '#00FFFF';
                ctx.shadowBlur = 6;
                ctx.shadowColor = ctx.fillStyle;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
                
                return true;
            }
            
            return false;
        });
        
        requestAnimationFrame(() => this.animateParticles());
    }

    /**
     * Update UI corruption effects based on trust level
     * @param {number} score - Current trust score
     */
    updateUICorruption(score) {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        // Calculate corruption level (0-1)
        const corruptionLevel = Math.max(0, (20 - score) / 120);
        this.uiCorruption = corruptionLevel;
        
        // Apply corruption effects
        if (corruptionLevel > 0.5) {
            container.classList.add('corrupted');
        } else {
            container.classList.remove('corrupted');
        }
        
        // Adjust opacity and effects based on corruption
        container.style.opacity = Math.max(0.7, 1 - (corruptionLevel * 0.3));
    }

    /**
     * Set current character for context-aware display
     * @param {string} character - Character name
     */
    setCharacter(character) {
        this.currentCharacter = character;
        
        // Update UI theme based on character
        const container = document.getElementById(this.containerId);
        if (container) {
            container.className = `trust-score-container character-${character}`;
            
            // Update character-specific labels and terminology
            this.updateCharacterLabels(character);
        }
    }

    /**
     * Update labels and terminology to match character theme
     * @param {string} character - Character name
     */
    updateCharacterLabels(character) {
        const labelEl = document.querySelector('.trust-meter-label');
        if (!labelEl) return;

        const labels = {
            'maya': 'Dating Safety Score',
            'eli': 'Gaming Security Level', 
            'stanley': 'Digital Trust Status'
        };

        labelEl.textContent = labels[character] || 'Security Awareness';
    }

    /**
     * Easing function for smooth animations
     * @param {number} t - Progress (0-1)
     * @returns {number} Eased progress
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Handle window resize for particle canvas
        window.addEventListener('resize', () => {
            const canvas = this.particleSystem.canvas;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        });
    }

    /**
     * Process trust action and update UI
     * @param {string} character - Character name
     * @param {string} action - Action type
     * @param {object} context - Scenario context
     */
    processTrustAction(character, action, context) {
        const delta = this.trustEngine.calculateTrustDelta(
            character, 
            action, 
            context, 
            this.currentScore
        );
        
        const newScore = this.trustEngine.applyTrustChange(this.currentScore, delta);
        const feedback = this.trustEngine.generateFeedback(character, action, delta, context);
        
        this.updateTrustScore(newScore, true, feedback);
        
        return {
            oldScore: this.currentScore,
            newScore: newScore,
            delta: delta,
            feedback: feedback
        };
    }

    /**
     * Get current trust score
     * @returns {number} Current trust score
     */
    getCurrentScore() {
        return this.currentScore;
    }

    /**
     * Reset trust score to starting value
     * @param {number} startingScore - Starting score (default: 50)
     */
    reset(startingScore = 50) {
        this.currentScore = startingScore;
        this.updateTrustMeter(startingScore, false);
        this.uiCorruption = 0;
        
        const container = document.getElementById(this.containerId);
        if (container) {
            container.classList.remove('corrupted');
            container.style.opacity = 1;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrustScoreUI;
} else if (typeof window !== 'undefined') {
    window.TrustScoreUI = TrustScoreUI;
}