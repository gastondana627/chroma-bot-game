/**
 * Time Pressure and Urgency Mechanics System
 * Implements quintic easing for pressure buildup with audio and visual feedback
 * Creates realistic urgency scenarios for educational cybersecurity training
 */

class TimePressureSystem {
    constructor() {
        // Pressure configuration
        this.pressureConfig = {
            base_duration: 300000, // 5 minutes base scenario time
            warning_threshold: 0.7, // Start warnings at 70% time elapsed
            critical_threshold: 0.9, // Critical warnings at 90% time elapsed
            quintic_intensity: 2.5, // Quintic easing intensity multiplier
            max_pressure_level: 1.0
        };

        // Current pressure state
        this.currentScenario = null;
        this.startTime = null;
        this.duration = null;
        this.pressureLevel = 0;
        this.isActive = false;
        
        // Audio system
        this.audioContext = null;
        this.audioNodes = {
            heartbeat: null,
            urgency_tone: null,
            countdown_beep: null,
            ambient_tension: null
        };
        
        // Visual elements
        this.visualElements = {
            pressure_overlay: null,
            countdown_display: null,
            urgency_indicators: [],
            screen_effects: null
        };

        // Character-specific pressure profiles
        this.characterProfiles = this.initializeCharacterProfiles();
        
        // Pressure event callbacks
        this.callbacks = {
            onPressureChange: [],
            onWarningThreshold: [],
            onCriticalThreshold: [],
            onTimeExpired: []
        };

        this.init();
    }

    /**
     * Initialize the time pressure system
     */
    init() {
        this.setupAudioContext();
        this.createVisualElements();
        console.log('⏰ Time Pressure System initialized');
    }

    /**
     * Initialize character-specific pressure profiles
     * @returns {object} Character pressure configurations
     */
    initializeCharacterProfiles() {
        return {
            'maya': {
                scenario_duration: 420000, // 7 minutes for romance scenarios
                pressure_multiplier: 1.3, // Higher emotional pressure
                audio_profile: {
                    heartbeat_intensity: 1.5,
                    urgency_frequency: 800, // Hz
                    ambient_type: 'romantic_tension'
                },
                visual_profile: {
                    color_scheme: ['#ff1493', '#ff69b4', '#dc143c'],
                    effect_type: 'romantic_glitch',
                    countdown_style: 'elegant'
                },
                pressure_triggers: [
                    { time_percent: 0.3, message: 'He seems really interested...', intensity: 0.2 },
                    { time_percent: 0.6, message: 'Don\'t keep him waiting too long...', intensity: 0.5 },
                    { time_percent: 0.8, message: 'He might lose interest if you don\'t respond soon!', intensity: 0.8 },
                    { time_percent: 0.95, message: 'Last chance to respond!', intensity: 1.0 }
                ]
            },
            'eli': {
                scenario_duration: 360000, // 6 minutes for gaming scenarios
                pressure_multiplier: 1.1, // Moderate competitive pressure
                audio_profile: {
                    heartbeat_intensity: 1.2,
                    urgency_frequency: 1000, // Hz
                    ambient_type: 'competitive_tension'
                },
                visual_profile: {
                    color_scheme: ['#00ffff', '#0080ff', '#ff4500'],
                    effect_type: 'gaming_glitch',
                    countdown_style: 'digital'
                },
                pressure_triggers: [
                    { time_percent: 0.4, message: 'The tournament starts soon...', intensity: 0.3 },
                    { time_percent: 0.7, message: 'Other players are already signing up!', intensity: 0.6 },
                    { time_percent: 0.85, message: 'Registration closes in minutes!', intensity: 0.9 },
                    { time_percent: 0.98, message: 'FINAL SECONDS!', intensity: 1.0 }
                ]
            },
            'stanley': {
                scenario_duration: 480000, // 8 minutes for elder scenarios
                pressure_multiplier: 0.9, // Lower but persistent pressure
                audio_profile: {
                    heartbeat_intensity: 1.0,
                    urgency_frequency: 600, // Hz
                    ambient_type: 'authority_tension'
                },
                visual_profile: {
                    color_scheme: ['#9ca3af', '#ef4444', '#dc2626'],
                    effect_type: 'authority_corruption',
                    countdown_style: 'official'
                },
                pressure_triggers: [
                    { time_percent: 0.25, message: 'Please respond promptly to avoid delays...', intensity: 0.15 },
                    { time_percent: 0.5, message: 'Immediate action required...', intensity: 0.4 },
                    { time_percent: 0.75, message: 'Your account will be suspended if you don\'t act now!', intensity: 0.7 },
                    { time_percent: 0.9, message: 'URGENT: Final warning before account closure!', intensity: 1.0 }
                ]
            }
        };
    }

    /**
     * Setup Web Audio API context and nodes
     */
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createAudioNodes();
        } catch (error) {
            console.warn('⚠️ Audio context not available:', error);
        }
    }

    /**
     * Create audio nodes for pressure effects
     */
    createAudioNodes() {
        if (!this.audioContext) return;

        // Heartbeat oscillator
        this.audioNodes.heartbeat = {
            oscillator: null,
            gainNode: this.audioContext.createGain(),
            filter: this.audioContext.createBiquadFilter()
        };

        // Urgency tone
        this.audioNodes.urgency_tone = {
            oscillator: null,
            gainNode: this.audioContext.createGain(),
            filter: this.audioContext.createBiquadFilter()
        };

        // Countdown beep
        this.audioNodes.countdown_beep = {
            oscillator: null,
            gainNode: this.audioContext.createGain()
        };

        // Ambient tension
        this.audioNodes.ambient_tension = {
            oscillator: null,
            gainNode: this.audioContext.createGain(),
            filter: this.audioContext.createBiquadFilter()
        };

        // Configure initial settings
        Object.values(this.audioNodes).forEach(node => {
            if (node.gainNode) {
                node.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                node.gainNode.connect(this.audioContext.destination);
            }
            if (node.filter) {
                node.filter.type = 'lowpass';
                node.filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
                node.filter.connect(node.gainNode);
            }
        });
    }

    /**
     * Create visual elements for pressure effects
     */
    createVisualElements() {
        // Pressure overlay
        this.visualElements.pressure_overlay = document.createElement('div');
        this.visualElements.pressure_overlay.id = 'pressure-overlay';
        this.visualElements.pressure_overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            background: radial-gradient(circle, transparent 60%, rgba(255, 0, 0, 0) 100%);
            opacity: 0;
            transition: opacity 0.5s ease;
        `;

        // Countdown display
        this.visualElements.countdown_display = document.createElement('div');
        this.visualElements.countdown_display.id = 'countdown-display';
        this.visualElements.countdown_display.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 18px;
            font-weight: bold;
            border: 2px solid #00FFFF;
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s ease;
        `;

        // Screen effects container
        this.visualElements.screen_effects = document.createElement('div');
        this.visualElements.screen_effects.id = 'screen-effects';
        this.visualElements.screen_effects.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0;
        `;

        // Add to document but keep hidden initially
        document.body.appendChild(this.visualElements.pressure_overlay);
        document.body.appendChild(this.visualElements.countdown_display);
        document.body.appendChild(this.visualElements.screen_effects);
    }

    /**
     * Start time pressure scenario
     * @param {string} character - Character name
     * @param {object} scenarioConfig - Scenario configuration
     */
    startScenario(character, scenarioConfig = {}) {
        if (this.isActive) {
            this.stopScenario();
        }

        const profile = this.characterProfiles[character];
        if (!profile) {
            console.warn(`⚠️ No pressure profile found for character: ${character}`);
            return;
        }

        // Configure scenario
        this.currentScenario = {
            character: character,
            profile: profile,
            custom_config: scenarioConfig
        };

        this.startTime = Date.now();
        this.duration = scenarioConfig.duration || profile.scenario_duration;
        this.pressureLevel = 0;
        this.isActive = true;

        // Setup visual theme
        this.setupVisualTheme(character);

        // Start audio if available
        this.startAudioEffects(character);

        // Start pressure loop
        this.pressureLoop();

        // Show countdown
        this.showCountdown();

        console.log(`⏰ Time pressure scenario started for ${character} (${this.duration / 1000}s)`);
        
        // Trigger callbacks
        this.triggerCallbacks('onPressureChange', { level: 0, character });
    }

    /**
     * Setup visual theme for character
     * @param {string} character - Character name
     */
    setupVisualTheme(character) {
        const profile = this.characterProfiles[character];
        const colors = profile.visual_profile.color_scheme;

        // Update pressure overlay gradient
        this.visualElements.pressure_overlay.style.background = 
            `radial-gradient(circle, transparent 60%, ${colors[0]}20 100%)`;

        // Update countdown display style
        const countdownStyle = profile.visual_profile.countdown_style;
        if (countdownStyle === 'elegant') {
            this.visualElements.countdown_display.style.borderColor = colors[0];
            this.visualElements.countdown_display.style.fontFamily = "'JetBrains Mono', monospace";
        } else if (countdownStyle === 'digital') {
            this.visualElements.countdown_display.style.borderColor = colors[0];
            this.visualElements.countdown_display.style.fontFamily = "'Orbitron', monospace";
            this.visualElements.countdown_display.style.textShadow = `0 0 10px ${colors[0]}`;
        } else if (countdownStyle === 'official') {
            this.visualElements.countdown_display.style.borderColor = colors[1];
            this.visualElements.countdown_display.style.fontFamily = "'Inter', sans-serif";
            this.visualElements.countdown_display.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        }
    }

    /**
     * Start audio effects for pressure
     * @param {string} character - Character name
     */
    startAudioEffects(character) {
        if (!this.audioContext) return;

        const profile = this.characterProfiles[character];
        const audioProfile = profile.audio_profile;

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        // Start heartbeat
        this.startHeartbeat(audioProfile.heartbeat_intensity);

        // Start ambient tension
        this.startAmbientTension(audioProfile.ambient_type);
    }

    /**
     * Start heartbeat audio effect
     * @param {number} intensity - Heartbeat intensity
     */
    startHeartbeat(intensity) {
        if (!this.audioContext) return;

        const heartbeat = this.audioNodes.heartbeat;
        
        // Create heartbeat pattern using scheduled oscillators
        const createHeartbeatPulse = (time, bpm = 60) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, time);
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(intensity * 0.1, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
            
            osc.connect(gain);
            gain.connect(heartbeat.gainNode);
            
            osc.start(time);
            osc.stop(time + 0.3);
            
            // Schedule next heartbeat
            const nextBeat = time + (60 / bpm);
            if (this.isActive) {
                setTimeout(() => createHeartbeatPulse(this.audioContext.currentTime, bpm), 
                          (nextBeat - this.audioContext.currentTime) * 1000);
            }
        };

        createHeartbeatPulse(this.audioContext.currentTime);
    }

    /**
     * Start ambient tension audio
     * @param {string} ambientType - Type of ambient tension
     */
    startAmbientTension(ambientType) {
        if (!this.audioContext) return;

        const ambient = this.audioNodes.ambient_tension;
        
        if (ambient.oscillator) {
            ambient.oscillator.stop();
        }

        ambient.oscillator = this.audioContext.createOscillator();
        ambient.oscillator.type = 'sawtooth';
        
        // Set frequency based on ambient type
        const frequencies = {
            'romantic_tension': 220,
            'competitive_tension': 330,
            'authority_tension': 110
        };
        
        ambient.oscillator.frequency.setValueAtTime(
            frequencies[ambientType] || 220, 
            this.audioContext.currentTime
        );
        
        ambient.oscillator.connect(ambient.filter);
        ambient.gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime);
        
        ambient.oscillator.start();
    }

    /**
     * Main pressure loop - calculates and applies pressure effects
     */
    pressureLoop() {
        if (!this.isActive) return;

        const elapsed = Date.now() - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        
        // Calculate pressure using quintic easing
        const quinticProgress = this.quinticEaseIn(progress);
        const profile = this.currentScenario.profile;
        this.pressureLevel = quinticProgress * profile.pressure_multiplier;

        // Update visual effects
        this.updateVisualEffects(this.pressureLevel, progress);

        // Update audio effects
        this.updateAudioEffects(this.pressureLevel, progress);

        // Check for pressure triggers
        this.checkPressureTriggers(progress);

        // Update countdown
        this.updateCountdown(this.duration - elapsed);

        // Check thresholds
        this.checkThresholds(progress);

        // Trigger callbacks
        this.triggerCallbacks('onPressureChange', { 
            level: this.pressureLevel, 
            progress: progress,
            character: this.currentScenario.character 
        });

        // Check if time expired
        if (progress >= 1) {
            this.handleTimeExpired();
            return;
        }

        // Continue loop
        requestAnimationFrame(() => this.pressureLoop());
    }

    /**
     * Quintic ease-in function for pressure buildup
     * @param {number} t - Time progress (0-1)
     * @returns {number} Eased value
     */
    quinticEaseIn(t) {
        return Math.pow(t, this.pressureConfig.quintic_intensity);
    }

    /**
     * Update visual effects based on pressure level
     * @param {number} pressureLevel - Current pressure level
     * @param {number} progress - Time progress
     */
    updateVisualEffects(pressureLevel, progress) {
        const profile = this.currentScenario.profile;
        const colors = profile.visual_profile.color_scheme;

        // Update pressure overlay opacity
        const overlayOpacity = Math.min(pressureLevel * 0.3, 0.3);
        this.visualElements.pressure_overlay.style.opacity = overlayOpacity;

        // Update pressure overlay color intensity
        const colorIntensity = Math.floor(pressureLevel * 40 + 10);
        this.visualElements.pressure_overlay.style.background = 
            `radial-gradient(circle, transparent 60%, ${colors[0]}${colorIntensity.toString(16).padStart(2, '0')} 100%)`;

        // Add screen effects at high pressure
        if (pressureLevel > 0.7) {
            this.addScreenGlitchEffects(pressureLevel, profile.visual_profile.effect_type);
        }

        // Pulse effect for critical pressure
        if (pressureLevel > 0.9) {
            this.addPulseEffect(colors[2]);
        }
    }

    /**
     * Add screen glitch effects
     * @param {number} intensity - Effect intensity
     * @param {string} effectType - Type of glitch effect
     */
    addScreenGlitchEffects(intensity, effectType) {
        const effects = this.visualElements.screen_effects;
        
        if (effectType === 'romantic_glitch') {
            effects.style.background = `
                linear-gradient(90deg, transparent 98%, #ff1493 100%),
                linear-gradient(180deg, transparent 97%, #ff69b4 100%)
            `;
        } else if (effectType === 'gaming_glitch') {
            effects.style.background = `
                repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 2px,
                    #00ffff${Math.floor(intensity * 20).toString(16)} 2px,
                    #00ffff${Math.floor(intensity * 20).toString(16)} 4px
                )
            `;
        } else if (effectType === 'authority_corruption') {
            effects.style.background = `
                linear-gradient(45deg, transparent 95%, #ef4444${Math.floor(intensity * 30).toString(16)} 100%)
            `;
        }

        effects.style.opacity = (intensity - 0.7) * 3; // Fade in from 0.7 to 1.0
    }

    /**
     * Add pulse effect for critical pressure
     * @param {string} color - Pulse color
     */
    addPulseEffect(color) {
        const overlay = this.visualElements.pressure_overlay;
        overlay.style.animation = `pressure-pulse 0.5s ease-in-out infinite alternate`;
        
        // Add keyframes if not already added
        if (!document.getElementById('pressure-pulse-keyframes')) {
            const style = document.createElement('style');
            style.id = 'pressure-pulse-keyframes';
            style.textContent = `
                @keyframes pressure-pulse {
                    0% { box-shadow: inset 0 0 0 0 ${color}20; }
                    100% { box-shadow: inset 0 0 50px 10px ${color}40; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Update audio effects based on pressure level
     * @param {number} pressureLevel - Current pressure level
     * @param {number} progress - Time progress
     */
    updateAudioEffects(pressureLevel, progress) {
        if (!this.audioContext) return;

        const profile = this.currentScenario.profile;

        // Increase heartbeat intensity and rate
        const heartbeatGain = this.audioNodes.heartbeat.gainNode;
        const baseHeartbeatVolume = profile.audio_profile.heartbeat_intensity * 0.1;
        const pressureHeartbeatVolume = baseHeartbeatVolume * (1 + pressureLevel * 2);
        
        heartbeatGain.gain.linearRampToValueAtTime(
            Math.min(pressureHeartbeatVolume, 0.3),
            this.audioContext.currentTime + 0.1
        );

        // Add urgency tone at high pressure
        if (pressureLevel > 0.6 && !this.audioNodes.urgency_tone.oscillator) {
            this.startUrgencyTone(profile.audio_profile.urgency_frequency, pressureLevel);
        }

        // Update urgency tone intensity
        if (this.audioNodes.urgency_tone.oscillator) {
            const urgencyGain = this.audioNodes.urgency_tone.gainNode;
            const urgencyVolume = Math.max(0, (pressureLevel - 0.6) * 0.15);
            urgencyGain.gain.linearRampToValueAtTime(
                urgencyVolume,
                this.audioContext.currentTime + 0.1
            );
        }

        // Increase ambient tension
        const ambientGain = this.audioNodes.ambient_tension.gainNode;
        const ambientVolume = 0.02 + (pressureLevel * 0.08);
        ambientGain.gain.linearRampToValueAtTime(
            Math.min(ambientVolume, 0.1),
            this.audioContext.currentTime + 0.1
        );
    }

    /**
     * Start urgency tone
     * @param {number} frequency - Tone frequency
     * @param {number} intensity - Initial intensity
     */
    startUrgencyTone(frequency, intensity) {
        if (!this.audioContext) return;

        const urgency = this.audioNodes.urgency_tone;
        
        urgency.oscillator = this.audioContext.createOscillator();
        urgency.oscillator.type = 'triangle';
        urgency.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        // Add slight frequency modulation for urgency effect
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(4, this.audioContext.currentTime); // 4 Hz modulation
        lfoGain.gain.setValueAtTime(20, this.audioContext.currentTime); // ±20 Hz modulation
        
        lfo.connect(lfoGain);
        lfoGain.connect(urgency.oscillator.frequency);
        
        urgency.oscillator.connect(urgency.filter);
        urgency.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        urgency.oscillator.start();
        lfo.start();
    }

    /**
     * Check and trigger pressure-specific messages
     * @param {number} progress - Time progress
     */
    checkPressureTriggers(progress) {
        const profile = this.currentScenario.profile;
        const triggers = profile.pressure_triggers;

        triggers.forEach(trigger => {
            if (progress >= trigger.time_percent && !trigger.triggered) {
                trigger.triggered = true;
                this.showPressureMessage(trigger.message, trigger.intensity);
            }
        });
    }

    /**
     * Show pressure message to user
     * @param {string} message - Message to display
     * @param {number} intensity - Message intensity
     */
    showPressureMessage(message, intensity) {
        // Create message overlay
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            z-index: 10001;
            border: 2px solid ${intensity > 0.7 ? '#ef4444' : '#f59e0b'};
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            animation: pressure-message-appear 0.5s ease-out;
        `;

        messageDiv.textContent = message;

        // Add animation keyframes
        if (!document.getElementById('pressure-message-keyframes')) {
            const style = document.createElement('style');
            style.id = 'pressure-message-keyframes';
            style.textContent = `
                @keyframes pressure-message-appear {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(messageDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'pressure-message-appear 0.3s ease-in reverse';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 3000);

        console.log(`💬 Pressure message: ${message} (intensity: ${intensity})`);
    }

    /**
     * Update countdown display
     * @param {number} timeRemaining - Time remaining in milliseconds
     */
    updateCountdown(timeRemaining) {
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        
        const display = this.visualElements.countdown_display;
        display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color based on time remaining
        if (timeRemaining < 60000) { // Less than 1 minute
            display.style.borderColor = '#ef4444';
            display.style.color = '#ef4444';
            display.style.animation = 'countdown-urgent 1s ease-in-out infinite alternate';
        } else if (timeRemaining < 120000) { // Less than 2 minutes
            display.style.borderColor = '#f59e0b';
            display.style.color = '#f59e0b';
        }

        // Add urgent countdown animation
        if (!document.getElementById('countdown-urgent-keyframes')) {
            const style = document.createElement('style');
            style.id = 'countdown-urgent-keyframes';
            style.textContent = `
                @keyframes countdown-urgent {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Show countdown display
     */
    showCountdown() {
        this.visualElements.countdown_display.style.opacity = '1';
    }

    /**
     * Hide countdown display
     */
    hideCountdown() {
        this.visualElements.countdown_display.style.opacity = '0';
    }

    /**
     * Check warning and critical thresholds
     * @param {number} progress - Time progress
     */
    checkThresholds(progress) {
        if (progress >= this.pressureConfig.critical_threshold && !this.criticalTriggered) {
            this.criticalTriggered = true;
            this.triggerCallbacks('onCriticalThreshold', { 
                progress, 
                character: this.currentScenario.character 
            });
            this.playCountdownBeeps();
        } else if (progress >= this.pressureConfig.warning_threshold && !this.warningTriggered) {
            this.warningTriggered = true;
            this.triggerCallbacks('onWarningThreshold', { 
                progress, 
                character: this.currentScenario.character 
            });
        }
    }

    /**
     * Play countdown beeps for critical time
     */
    playCountdownBeeps() {
        if (!this.audioContext) return;

        const playBeep = (time, frequency = 800) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(frequency, time);
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.1, time + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start(time);
            osc.stop(time + 0.1);
        };

        // Play beeps every second during critical time
        const beepInterval = setInterval(() => {
            if (!this.isActive) {
                clearInterval(beepInterval);
                return;
            }
            
            const elapsed = Date.now() - this.startTime;
            const progress = elapsed / this.duration;
            
            if (progress >= this.pressureConfig.critical_threshold) {
                playBeep(this.audioContext.currentTime, 1000);
            } else {
                clearInterval(beepInterval);
            }
        }, 1000);
    }

    /**
     * Handle time expiration
     */
    handleTimeExpired() {
        console.log('⏰ Time expired!');
        
        this.triggerCallbacks('onTimeExpired', { 
            character: this.currentScenario.character,
            final_pressure: this.pressureLevel
        });

        this.stopScenario();
        
        // Show time expired message
        this.showPressureMessage('TIME EXPIRED!', 1.0);
    }

    /**
     * Stop current scenario
     */
    stopScenario() {
        this.isActive = false;
        this.currentScenario = null;
        this.pressureLevel = 0;
        this.warningTriggered = false;
        this.criticalTriggered = false;

        // Stop audio
        this.stopAudioEffects();

        // Hide visual elements
        this.hideVisualEffects();

        console.log('⏰ Time pressure scenario stopped');
    }

    /**
     * Stop all audio effects
     */
    stopAudioEffects() {
        if (!this.audioContext) return;

        Object.values(this.audioNodes).forEach(node => {
            if (node.oscillator) {
                try {
                    node.oscillator.stop();
                    node.oscillator = null;
                } catch (error) {
                    // Oscillator might already be stopped
                }
            }
            if (node.gainNode) {
                node.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            }
        });
    }

    /**
     * Hide visual effects
     */
    hideVisualEffects() {
        this.visualElements.pressure_overlay.style.opacity = '0';
        this.visualElements.pressure_overlay.style.animation = '';
        this.visualElements.screen_effects.style.opacity = '0';
        this.visualElements.screen_effects.style.background = '';
        this.hideCountdown();
    }

    /**
     * Add callback for pressure events
     * @param {string} event - Event type
     * @param {function} callback - Callback function
     */
    addCallback(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    /**
     * Remove callback
     * @param {string} event - Event type
     * @param {function} callback - Callback function
     */
    removeCallback(event, callback) {
        if (this.callbacks[event]) {
            const index = this.callbacks[event].indexOf(callback);
            if (index > -1) {
                this.callbacks[event].splice(index, 1);
            }
        }
    }

    /**
     * Trigger callbacks for event
     * @param {string} event - Event type
     * @param {object} data - Event data
     */
    triggerCallbacks(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} callback:`, error);
                }
            });
        }
    }

    /**
     * Get current pressure state
     * @returns {object} Current state
     */
    getCurrentState() {
        return {
            is_active: this.isActive,
            character: this.currentScenario?.character || null,
            pressure_level: this.pressureLevel,
            time_remaining: this.isActive ? this.duration - (Date.now() - this.startTime) : 0,
            progress: this.isActive ? (Date.now() - this.startTime) / this.duration : 0
        };
    }

    /**
     * Pause scenario (for testing/debugging)
     */
    pause() {
        if (this.isActive) {
            this.isActive = false;
            this.pausedAt = Date.now();
            this.stopAudioEffects();
        }
    }

    /**
     * Resume scenario (for testing/debugging)
     */
    resume() {
        if (this.pausedAt && this.currentScenario) {
            const pauseDuration = Date.now() - this.pausedAt;
            this.startTime += pauseDuration;
            this.isActive = true;
            this.pausedAt = null;
            this.startAudioEffects(this.currentScenario.character);
            this.pressureLoop();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimePressureSystem;
} else if (typeof window !== 'undefined') {
    window.TimePressureSystem = TimePressureSystem;
}