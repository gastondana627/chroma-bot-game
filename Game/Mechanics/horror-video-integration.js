/**
 * Horror Video Integration System
 * Bridges interactive video player with horror atmosphere engine and trust score system
 * Applies dynamic horror effects based on player decisions during video playback
 */

class HorrorVideoIntegration {
    constructor(options = {}) {
        this.character = options.character || 'eli';
        this.debugMode = options.debugMode || false;
        
        // Core system references
        this.horrorEngine = null;
        this.trustEngine = null;
        this.videoPlayer = null;
        
        // State tracking
        this.state = {
            currentScene: 0,
            totalScenes: 6,
            cumulativeTrustScore: 100,
            horrorIntensity: 0,
            badDecisionStreak: 0,
            goodDecisionStreak: 0,
            sceneHistory: []
        };
        
        // Horror effect configurations per scene
        this.sceneHorrorProfiles = this.getSceneHorrorProfiles();
        
        // Initialize
        this._initialize();
    }
    
    /**
     * Initialize integration system
     * @private
     */
    _initialize() {
        // Initialize trust engine
        this.trustEngine = new BayesianTrustEngine();
        
        // Initialize horror engine with proper options
        this.horrorEngine = new HorrorAtmosphereEngine({
            character: this.character,
            debugMode: this.debugMode,
            testMode: false,
            accessibilitySettings: {
                intensityMultiplier: 1.0,
                flashingEnabled: true,
                motionReduced: false
            }
        });
        
        // Listen for horror intensity changes
        this.horrorEngine.addEventListener('horrorIntensityChanged', (data) => {
            this._onHorrorIntensityChanged(data);
        });
        
        if (this.debugMode) {
            console.log('[HorrorVideoIntegration] Initialized for character:', this.character);
        }
    }
    
    /**
     * Get horror profiles for each scene
     * Defines how horror escalates/de-escalates per scene
     * @returns {Object} Scene horror configurations
     */
    getSceneHorrorProfiles() {
        return {
            'eli': {
                1: { // Suspicious Mod Offer
                    baseIntensity: 0,
                    badDecisionEffects: ['subtle-flicker', 'screen-glitch'],
                    goodDecisionEffects: ['relief-glow'],
                    ambientSound: 'gaming-room-normal',
                    tensionMusic: 'subtle-unease'
                },
                2: { // Friend's Request
                    baseIntensity: 1,
                    badDecisionEffects: ['text-distortion', 'friend-face-glitch'],
                    goodDecisionEffects: ['clarity-restore'],
                    ambientSound: 'discord-notification-distorted',
                    tensionMusic: 'peer-pressure-theme'
                },
                3: { // Tempting Purchase
                    baseIntensity: 2,
                    badDecisionEffects: ['currency-drain-visual', 'wallet-empty-flash'],
                    goodDecisionEffects: ['financial-stability-glow'],
                    ambientSound: 'purchase-sound-warped',
                    tensionMusic: 'gambling-tension'
                },
                4: { // Stranger Reward Link
                    baseIntensity: 2,
                    badDecisionEffects: ['link-virus-spread', 'screen-corruption'],
                    goodDecisionEffects: ['firewall-shield-visual'],
                    ambientSound: 'malware-detected',
                    tensionMusic: 'cyber-threat'
                },
                5: { // Peer Pressure
                    baseIntensity: 3,
                    badDecisionEffects: ['crowd-pressure-visual', 'isolation-effect'],
                    goodDecisionEffects: ['independence-aura'],
                    ambientSound: 'voices-overlapping',
                    tensionMusic: 'social-anxiety'
                },
                6: { // Reflection
                    baseIntensity: 'dynamic', // Based on cumulative choices
                    badDecisionEffects: ['consequence-montage', 'regret-visual'],
                    goodDecisionEffects: ['redemption-light', 'clarity-achieved'],
                    ambientSound: 'reflective-silence',
                    tensionMusic: 'resolution-theme'
                }
            }
        };
    }
    
    /**
     * Initialize video player with horror integration
     * @param {HTMLVideoElement} videoElement - Video element
     * @param {Object} videoConfig - Video configuration
     * @returns {InteractiveVideoPlayer} Enhanced video player
     */
    initializeVideoPlayer(videoElement, videoConfig) {
        // Enhance video config with horror callbacks
        const enhancedConfig = {
            ...videoConfig,
            onDecisionShow: (decision) => this._onDecisionShow(decision),
            onDecisionMade: (decision, choice, outcome) => this._onDecisionMade(decision, choice, outcome),
            onSceneComplete: (sceneData) => this._onSceneComplete(sceneData)
        };
        
        // Create video player
        this.videoPlayer = new InteractiveVideoPlayer(videoElement, enhancedConfig);
        
        // Override handleChoice to integrate horror effects
        this._enhanceVideoPlayer();
        
        return this.videoPlayer;
    }
    
    /**
     * Enhance video player with horror integration
     * @private
     */
    _enhanceVideoPlayer() {
        const originalHandleChoice = this.videoPlayer.handleChoice.bind(this.videoPlayer);
        
        this.videoPlayer.handleChoice = (choice) => {
            const decision = this.videoPlayer.config.decisions[this.videoPlayer.currentDecisionIndex];
            const outcome = choice === 'yes' ? decision.yesOutcome : decision.noOutcome;
            
            // Apply horror effects BEFORE choice is processed
            this._applyDecisionHorrorEffects(decision, choice, outcome);
            
            // Call original handler
            originalHandleChoice(choice);
            
            // Update trust score with Bayesian engine
            this._updateTrustScore(decision, choice, outcome);
        };
    }
    
    /**
     * Called when decision overlay is shown
     * @param {Object} decision - Decision data
     * @private
     */
    _onDecisionShow(decision) {
        // Pause horror effects during decision
        this.horrorEngine.dispatchEvent('horrorPause', {
            reason: 'decision_overlay',
            scene: this.state.currentScene
        });
        
        // Apply decision-specific atmosphere
        const sceneProfile = this.sceneHorrorProfiles[this.character][this.state.currentScene + 1];
        if (sceneProfile) {
            this._applySceneAtmosphere(sceneProfile);
        }
    }
    
    /**
     * Apply horror effects based on player decision
     * @param {Object} decision - Decision data
     * @param {string} choice - Player choice ('yes' or 'no')
     * @param {Object} outcome - Decision outcome
     * @private
     */
    _applyDecisionHorrorEffects(decision, choice, outcome) {
        const isBadDecision = outcome.trustDelta < 0;
        const sceneProfile = this.sceneHorrorProfiles[this.character][this.state.currentScene + 1];
        
        if (!sceneProfile) return;
        
        if (isBadDecision) {
            // Bad decision: escalate horror
            this.state.badDecisionStreak++;
            this.state.goodDecisionStreak = 0;
            
            // Apply bad decision effects
            sceneProfile.badDecisionEffects.forEach(effect => {
                this._triggerHorrorEffect(effect, {
                    intensity: this._calculateEffectIntensity(outcome.trustDelta),
                    duration: 2000,
                    character: this.character
                });
            });
            
            // Update horror engine
            this.horrorEngine.update({
                trustScore: this.state.cumulativeTrustScore + outcome.trustDelta,
                sophistication: this._calculateSophistication(),
                immediate: true
            });
            
        } else {
            // Good decision: relief effects
            this.state.goodDecisionStreak++;
            this.state.badDecisionStreak = 0;
            
            // Apply good decision effects
            sceneProfile.goodDecisionEffects.forEach(effect => {
                this._triggerReliefEffect(effect, {
                    intensity: Math.abs(outcome.trustDelta) / 20,
                    duration: 1500,
                    character: this.character
                });
            });
            
            // Update horror engine (reduced intensity)
            this.horrorEngine.update({
                trustScore: this.state.cumulativeTrustScore + outcome.trustDelta,
                sophistication: this._calculateSophistication(),
                immediate: true
            });
        }
        
        if (this.debugMode) {
            console.log('[HorrorVideoIntegration] Decision effects applied:', {
                choice,
                isBadDecision,
                trustDelta: outcome.trustDelta,
                badStreak: this.state.badDecisionStreak,
                goodStreak: this.state.goodDecisionStreak
            });
        }
    }
    
    /**
     * Update trust score using Bayesian engine
     * @param {Object} decision - Decision data
     * @param {string} choice - Player choice
     * @param {Object} outcome - Decision outcome
     * @private
     */
    _updateTrustScore(decision, choice, outcome) {
        // Map decision to action type
        const actionType = this._mapDecisionToAction(decision, choice);
        
        // Get context from decision
        const context = {
            type: decision.contextType || 'gaming',
            involves_rare_items: decision.involvesRareItems || false,
            involves_gaming_community: decision.involvesGamingCommunity || false,
            supportive_community: choice === 'no' && decision.contextType === 'peer_pressure'
        };
        
        // Calculate trust delta using Bayesian engine
        const bayesianDelta = this.trustEngine.calculateTrustDelta(
            this.character,
            actionType,
            context,
            this.state.cumulativeTrustScore
        );
        
        // Update cumulative score
        this.state.cumulativeTrustScore = this.trustEngine.applyTrustChange(
            this.state.cumulativeTrustScore,
            bayesianDelta
        );
        
        // Dispatch trust score update event
        window.dispatchEvent(new CustomEvent('trustScoreUpdated', {
            detail: {
                character: this.character,
                newScore: this.state.cumulativeTrustScore,
                delta: bayesianDelta,
                sophistication: this._calculateSophistication(),
                scene: this.state.currentScene + 1
            }
        }));
        
        if (this.debugMode) {
            console.log('[HorrorVideoIntegration] Trust score updated:', {
                action: actionType,
                bayesianDelta,
                newScore: this.state.cumulativeTrustScore
            });
        }
    }
    
    /**
     * Map decision to Bayesian action type
     * @param {Object} decision - Decision data
     * @param {string} choice - Player choice
     * @returns {string} Action type
     * @private
     */
    _mapDecisionToAction(decision, choice) {
        // Map based on decision type and choice
        const actionMap = {
            'mod_offer': {
                'yes': 'click_suspicious_link',
                'no': 'check_url'
            },
            'friend_request': {
                'yes': 'share_personal_info',
                'no': 'ask_questions'
            },
            'purchase': {
                'yes': 'trust_stranger',
                'no': 'verify_identity'
            },
            'stranger_link': {
                'yes': 'click_suspicious_link',
                'no': 'report_suspicious'
            },
            'peer_pressure': {
                'yes': 'trust_stranger',
                'no': 'ignore_pressure'
            },
            'reflection': {
                'yes': 'seek_help',
                'no': 'ignore_pressure'
            }
        };
        
        return actionMap[decision.type]?.[choice] || 'trust_stranger';
    }
    
    /**
     * Calculate AI sophistication based on scene progression
     * @returns {number} Sophistication level (1-5)
     * @private
     */
    _calculateSophistication() {
        // Sophistication increases with scene number
        const baseSophistication = Math.min(5, Math.floor(this.state.currentScene / 2) + 1);
        
        // Increase if player is making bad decisions
        const streakBonus = Math.floor(this.state.badDecisionStreak / 2);
        
        return Math.min(5, baseSophistication + streakBonus);
    }
    
    /**
     * Calculate effect intensity based on trust delta
     * @param {number} trustDelta - Trust score change
     * @returns {number} Effect intensity (0-1)
     * @private
     */
    _calculateEffectIntensity(trustDelta) {
        // Larger negative delta = higher intensity
        const magnitude = Math.abs(trustDelta);
        return Math.min(1, magnitude / 40);
    }
    
    /**
     * Trigger horror effect
     * @param {string} effectName - Effect name
     * @param {Object} options - Effect options
     * @private
     */
    _triggerHorrorEffect(effectName, options) {
        // Dispatch horror effect event
        this.horrorEngine.dispatchEvent('horrorEffectTrigger', {
            effect: effectName,
            ...options,
            timestamp: Date.now()
        });
        
        // Apply visual effect to video
        this._applyVideoEffect(effectName, options);
    }
    
    /**
     * Trigger relief effect (good decision)
     * @param {string} effectName - Effect name
     * @param {Object} options - Effect options
     * @private
     */
    _triggerReliefEffect(effectName, options) {
        // Dispatch relief effect event
        this.horrorEngine.dispatchEvent('horrorReliefEffect', {
            effect: effectName,
            ...options,
            timestamp: Date.now()
        });
        
        // Apply visual effect to video
        this._applyVideoEffect(effectName, options);
    }
    
    /**
     * Apply visual effect to video element
     * @param {string} effectName - Effect name
     * @param {Object} options - Effect options
     * @private
     */
    _applyVideoEffect(effectName, options) {
        if (!this.videoPlayer || !this.videoPlayer.video) return;
        
        const video = this.videoPlayer.video;
        const container = video.parentElement;
        
        // Effect implementations
        switch (effectName) {
            case 'subtle-flicker':
                this._applyFlickerEffect(video, options);
                break;
            case 'screen-glitch':
                this._applyGlitchEffect(container, options);
                break;
            case 'text-distortion':
                this._applyTextDistortion(container, options);
                break;
            case 'relief-glow':
                this._applyReliefGlow(video, options);
                break;
            case 'clarity-restore':
                this._applyClarityRestore(video, options);
                break;
            default:
                if (this.debugMode) {
                    console.warn('[HorrorVideoIntegration] Unknown effect:', effectName);
                }
        }
    }
    
    /**
     * Apply flicker effect
     * @private
     */
    _applyFlickerEffect(video, options) {
        const intensity = options.intensity || 0.5;
        const duration = options.duration || 2000;
        
        let flickerCount = 0;
        const maxFlickers = Math.floor(intensity * 10);
        
        const flickerInterval = setInterval(() => {
            video.style.opacity = Math.random() > 0.5 ? '1' : '0.3';
            flickerCount++;
            
            if (flickerCount >= maxFlickers) {
                clearInterval(flickerInterval);
                video.style.opacity = '1';
            }
        }, 100);
    }
    
    /**
     * Apply glitch effect
     * @private
     */
    _applyGlitchEffect(container, options) {
        const intensity = options.intensity || 0.5;
        const duration = options.duration || 2000;
        
        container.classList.add('glitch-effect');
        container.style.setProperty('--glitch-intensity', intensity);
        
        setTimeout(() => {
            container.classList.remove('glitch-effect');
        }, duration);
    }
    
    /**
     * Apply text distortion effect
     * @private
     */
    _applyTextDistortion(container, options) {
        const overlay = container.querySelector('.decision-overlay');
        if (!overlay) return;
        
        overlay.classList.add('text-distortion');
        
        setTimeout(() => {
            overlay.classList.remove('text-distortion');
        }, options.duration || 2000);
    }
    
    /**
     * Apply relief glow effect (good decision)
     * @private
     */
    _applyReliefGlow(video, options) {
        const intensity = options.intensity || 0.5;
        const duration = options.duration || 1500;
        
        video.style.filter = `brightness(${1 + intensity * 0.3}) saturate(${1 + intensity * 0.5})`;
        video.style.transition = 'filter 0.5s ease';
        
        setTimeout(() => {
            video.style.filter = 'none';
        }, duration);
    }
    
    /**
     * Apply clarity restore effect (good decision)
     * @private
     */
    _applyClarityRestore(video, options) {
        video.style.filter = 'contrast(1.2) brightness(1.1)';
        video.style.transition = 'filter 1s ease';
        
        setTimeout(() => {
            video.style.filter = 'none';
        }, options.duration || 1500);
    }
    
    /**
     * Apply scene atmosphere
     * @param {Object} sceneProfile - Scene horror profile
     * @private
     */
    _applySceneAtmosphere(sceneProfile) {
        // Dispatch atmosphere change event
        this.horrorEngine.dispatchEvent('horrorAtmosphereChange', {
            scene: this.state.currentScene + 1,
            ambientSound: sceneProfile.ambientSound,
            tensionMusic: sceneProfile.tensionMusic,
            baseIntensity: sceneProfile.baseIntensity
        });
    }
    
    /**
     * Called when scene completes
     * @param {Object} sceneData - Scene completion data
     * @private
     */
    _onSceneComplete(sceneData) {
        // Record scene in history
        this.state.sceneHistory.push({
            scene: this.state.currentScene + 1,
            trustScore: this.state.cumulativeTrustScore,
            horrorIntensity: this.state.horrorIntensity,
            decisions: sceneData.decisions || []
        });
        
        // Advance scene
        this.state.currentScene++;
        
        // Reset streaks
        this.state.badDecisionStreak = 0;
        this.state.goodDecisionStreak = 0;
        
        if (this.debugMode) {
            console.log('[HorrorVideoIntegration] Scene complete:', {
                scene: this.state.currentScene,
                trustScore: this.state.cumulativeTrustScore,
                history: this.state.sceneHistory
            });
        }
    }
    
    /**
     * Called when horror intensity changes
     * @param {Object} data - Intensity change data
     * @private
     */
    _onHorrorIntensityChanged(data) {
        this.state.horrorIntensity = data.intensity;
        
        if (this.debugMode) {
            console.log('[HorrorVideoIntegration] Horror intensity changed:', data);
        }
    }
    
    /**
     * Get current integration status
     * @returns {Object} Status data
     */
    getStatus() {
        return {
            character: this.character,
            currentScene: this.state.currentScene,
            totalScenes: this.state.totalScenes,
            trustScore: this.state.cumulativeTrustScore,
            horrorIntensity: this.state.horrorIntensity,
            badDecisionStreak: this.state.badDecisionStreak,
            goodDecisionStreak: this.state.goodDecisionStreak,
            sceneHistory: this.state.sceneHistory
        };
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        if (this.horrorEngine) {
            this.horrorEngine.removeAllEventListeners();
        }
        
        this.videoPlayer = null;
        this.horrorEngine = null;
        this.trustEngine = null;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HorrorVideoIntegration;
} else if (typeof window !== 'undefined') {
    window.HorrorVideoIntegration = HorrorVideoIntegration;
}
