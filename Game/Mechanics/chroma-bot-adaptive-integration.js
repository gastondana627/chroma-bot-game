/**
 * Chroma Bot Adaptive Integration
 * Integrates the Adaptive AI Deception Engine with existing Chroma Bot system
 * Provides seamless character-themed AI responses with escalating sophistication
 */

class ChromaBotAdaptiveIntegration {
    constructor() {
        this.deceptionEngine = new AdaptiveAIDeceptionEngine();
        this.trustScoreUI = null; // Will be set when trust system is available
        this.timePressureSystem = new TimePressureSystem();
        this.currentCharacter = null;
        this.sessionHistory = [];
        
        // Integration state
        this.isInitialized = false;
        this.lastResponse = null;
        this.escalationWarnings = [];
        
        this.init();
    }

    /**
     * Initialize the adaptive integration system
     */
    init() {
        console.log('🤖 Chroma Bot Adaptive Integration initializing...');
        
        // Try to connect to existing trust score system
        this.connectToTrustSystem();
        
        // Set up message interception
        this.setupMessageInterception();
        
        this.isInitialized = true;
        console.log('✅ Chroma Bot Adaptive Integration ready');
    }

    /**
     * Connect to existing trust score system if available
     */
    connectToTrustSystem() {
        // Check if TrustScoreUI is available globally
        if (typeof window !== 'undefined' && window.TrustScoreUI) {
            try {
                this.trustScoreUI = new window.TrustScoreUI();
                console.log('🔗 Connected to Trust Score UI system');
            } catch (error) {
                console.warn('⚠️ Could not connect to Trust Score UI:', error);
            }
        }
    }

    /**
     * Set up message interception for existing chat systems
     */
    setupMessageInterception() {
        // Intercept existing chat functions if they exist
        if (typeof window !== 'undefined') {
            // Store original functions
            this.originalFunctions = {
                getBotResponse: window.getBotResponse || null,
                sendMessage: window.sendMessage || null,
                addMessage: window.addMessage || null
            };

            // Override with adaptive versions
            if (window.getBotResponse) {
                window.getBotResponse = this.adaptiveGetBotResponse.bind(this);
            }
        }
    }

    /**
     * Set current character for context-aware responses
     * @param {string} character - Character name (maya, eli, stanley)
     */
    setCharacter(character) {
        this.currentCharacter = character;
        
        // Update trust UI if available
        if (this.trustScoreUI) {
            this.trustScoreUI.setCharacter(character);
        }
        
        console.log(`🎭 Character set to: ${character}`);
    }

    /**
     * Start time pressure scenario for current character
     * @param {object} scenarioConfig - Optional scenario configuration
     */
    startTimePressure(scenarioConfig = {}) {
        if (!this.currentCharacter) {
            console.warn('⚠️ No character set for time pressure scenario');
            return;
        }

        // Add callbacks for pressure events
        this.timePressureSystem.addCallback('onPressureChange', (data) => {
            this.handlePressureChange(data);
        });

        this.timePressureSystem.addCallback('onCriticalThreshold', (data) => {
            this.handleCriticalPressure(data);
        });

        this.timePressureSystem.addCallback('onTimeExpired', (data) => {
            this.handleTimeExpired(data);
        });

        // Start scenario
        this.timePressureSystem.startScenario(this.currentCharacter, scenarioConfig);
    }

    /**
     * Handle pressure level changes
     * @param {object} data - Pressure change data
     */
    handlePressureChange(data) {
        // Adjust AI behavior based on pressure level
        if (data.level > 0.7) {
            // High pressure - AI becomes more aggressive
            this.deceptionEngine.escalationEngine.currentLevel = Math.min(5, 
                this.deceptionEngine.escalationEngine.currentLevel + 1);
        }
    }

    /**
     * Handle critical pressure threshold
     * @param {object} data - Critical pressure data
     */
    handleCriticalPressure(data) {
        console.log('🚨 Critical time pressure reached');
        
        // Show educational warning about time pressure tactics
        this.showEducationalWarning({
            escalation_risk: 'CRITICAL',
            educational_notes: 'Scammers often create false urgency to prevent you from thinking clearly. Take time to verify before acting, even under pressure.',
            tactic: { name: 'time_pressure_manipulation' }
        });
    }

    /**
     * Handle time expiration
     * @param {object} data - Time expiration data
     */
    handleTimeExpired(data) {
        console.log('⏰ Time pressure scenario ended');
        
        // Reset AI to guardian mode
        this.deceptionEngine.currentPersona = 'Guardian';
        this.deceptionEngine.sophisticationLevel = 1;
    }

    /**
     * Adaptive bot response function that replaces existing getBotResponse
     * @param {string} userMessage - User's message
     * @param {object} options - Additional options
     * @returns {Promise<string>} AI response
     */
    async adaptiveGetBotResponse(userMessage, options = {}) {
        if (!this.currentCharacter) {
            console.warn('⚠️ No character set, using default response');
            return this.getDefaultResponse(userMessage);
        }

        try {
            // Get current trust score
            const currentTrustScore = this.getCurrentTrustScore();
            
            // Get current context
            const context = this.buildCurrentContext(options);
            
            // Generate adaptive response
            const aiResponse = this.deceptionEngine.generateAdaptiveResponse(
                this.currentCharacter,
                userMessage,
                currentTrustScore,
                context
            );

            // Update trust score based on AI's prediction
            if (aiResponse.trust_impact_prediction) {
                this.updateTrustScore(aiResponse.trust_impact_prediction, context);
            }

            // Record session history
            this.recordInteraction(userMessage, aiResponse);

            // Handle escalation warnings
            this.handleEscalationWarnings(aiResponse);

            // Return the response text
            return this.formatResponse(aiResponse);

        } catch (error) {
            console.error('❌ Error in adaptive response generation:', error);
            return this.getDefaultResponse(userMessage);
        }
    }

    /**
     * Get current trust score from UI system or fallback
     * @returns {number} Current trust score
     */
    getCurrentTrustScore() {
        if (this.trustScoreUI) {
            return this.trustScoreUI.getCurrentScore();
        }
        
        // Fallback: estimate from session history
        return this.estimateTrustFromHistory();
    }

    /**
     * Build current context for AI decision making
     * @param {object} options - Additional context options
     * @returns {object} Context object
     */
    buildCurrentContext(options = {}) {
        // Get time pressure data
        const pressureState = this.timePressureSystem.getCurrentState();
        const timePressure = pressureState.is_active ? pressureState.pressure_level : 0.3;

        const baseContext = {
            type: this.inferContextType(),
            platform: this.inferPlatform(),
            emotional_investment: this.calculateEmotionalInvestment(),
            time_pressure: timePressure,
            session_length: this.sessionHistory.length,
            trust_score: this.getCurrentTrustScore()
        };

        // Add character-specific context
        if (this.currentCharacter === 'maya') {
            baseContext.involves_romance = true;
            baseContext.dating_context = true;
        } else if (this.currentCharacter === 'eli') {
            baseContext.involves_gaming_community = true;
            baseContext.involves_rare_items = Math.random() > 0.5;
        } else if (this.currentCharacter === 'stanley') {
            baseContext.isolation_level = 0.7;
            baseContext.tech_confusion = true;
        }

        return { ...baseContext, ...options };
    }

    /**
     * Infer context type from character and recent messages
     * @returns {string} Context type
     */
    inferContextType() {
        const characterContexts = {
            'maya': 'romantic',
            'eli': 'gaming',
            'stanley': 'authority'
        };

        return characterContexts[this.currentCharacter] || 'social';
    }

    /**
     * Infer platform from character
     * @returns {string} Platform type
     */
    inferPlatform() {
        const characterPlatforms = {
            'maya': 'dating_app',
            'eli': 'gaming_platform',
            'stanley': 'social_media'
        };

        return characterPlatforms[this.currentCharacter] || 'direct_message';
    }

    /**
     * Calculate emotional investment based on session history
     * @returns {number} Emotional investment level (0-1)
     */
    calculateEmotionalInvestment() {
        if (this.sessionHistory.length === 0) return 0.1;
        
        // Simple heuristic based on session length and character
        const sessionFactor = Math.min(this.sessionHistory.length / 10, 1);
        const characterFactor = this.currentCharacter === 'maya' ? 1.2 : 
                               this.currentCharacter === 'stanley' ? 0.8 : 1.0;
        
        return Math.min(sessionFactor * characterFactor, 1.0);
    }

    /**
     * Update trust score based on AI prediction
     * @param {number} predictedDelta - Predicted trust score change
     * @param {object} context - Current context
     */
    updateTrustScore(predictedDelta, context) {
        if (this.trustScoreUI) {
            const currentScore = this.trustScoreUI.getCurrentScore();
            const newScore = Math.max(-100, Math.min(100, currentScore + predictedDelta));
            
            // Generate feedback based on the change
            const feedback = this.generateTrustFeedback(predictedDelta, context);
            
            this.trustScoreUI.updateTrustScore(newScore, true, feedback);
        }
    }

    /**
     * Generate feedback for trust score changes
     * @param {number} delta - Trust score change
     * @param {object} context - Current context
     * @returns {object} Feedback object
     */
    generateTrustFeedback(delta, context) {
        const isPositive = delta > 0;
        const magnitude = Math.abs(delta);
        
        let message = '';
        let type = isPositive ? 'positive' : 'negative';
        
        if (isPositive) {
            message = 'You\'re showing good security awareness.';
        } else {
            if (magnitude >= 20) {
                message = 'Warning! That interaction significantly increased vulnerability.';
                type = 'critical';
            } else if (magnitude >= 10) {
                message = 'Be careful! That choice made you more vulnerable.';
            } else {
                message = 'That wasn\'t the most secure choice.';
            }
        }

        return {
            message,
            type,
            magnitude,
            character_specific: this.getCharacterSpecificTip(delta, context)
        };
    }

    /**
     * Get character-specific security tip
     * @param {number} delta - Trust score change
     * @param {object} context - Current context
     * @returns {string} Character-specific tip
     */
    getCharacterSpecificTip(delta, context) {
        const tips = {
            'maya': [
                'In online dating, verify identity through video calls before meeting.',
                'Be wary of anyone who quickly professes love or asks for money.',
                'Trust your instincts - if something feels off, it probably is.'
            ],
            'eli': [
                'Real gaming friends won\'t pressure you into risky trades.',
                'Verify rare item trades through official game channels only.',
                'Be skeptical of "exclusive" opportunities that require personal info.'
            ],
            'stanley': [
                'Legitimate companies won\'t ask for passwords over email.',
                'When in doubt, call the company directly using official numbers.',
                'Take time to think - scammers create false urgency.'
            ]
        };

        const characterTips = tips[this.currentCharacter] || tips['maya'];
        return characterTips[Math.floor(Math.random() * characterTips.length)];
    }

    /**
     * Record interaction for session history
     * @param {string} userMessage - User's message
     * @param {object} aiResponse - AI response object
     */
    recordInteraction(userMessage, aiResponse) {
        const interaction = {
            timestamp: Date.now(),
            user_message: userMessage,
            ai_response: aiResponse.response,
            persona: aiResponse.persona,
            sophistication: aiResponse.sophistication,
            tactic: aiResponse.tactic,
            trust_impact: aiResponse.trust_impact_prediction,
            escalation_risk: aiResponse.escalation_risk
        };

        this.sessionHistory.push(interaction);
        
        // Keep history manageable
        if (this.sessionHistory.length > 50) {
            this.sessionHistory = this.sessionHistory.slice(-30);
        }
    }

    /**
     * Handle escalation warnings and educational moments
     * @param {object} aiResponse - AI response object
     */
    handleEscalationWarnings(aiResponse) {
        if (aiResponse.escalation_risk === 'HIGH' || aiResponse.escalation_risk === 'CRITICAL') {
            this.escalationWarnings.push({
                timestamp: Date.now(),
                risk_level: aiResponse.escalation_risk,
                sophistication: aiResponse.sophistication,
                tactic: aiResponse.tactic,
                educational_note: aiResponse.educational_notes
            });

            // Show educational popup for high-risk situations
            if (aiResponse.escalation_risk === 'CRITICAL') {
                this.showEducationalWarning(aiResponse);
            }
        }
    }

    /**
     * Show educational warning for critical escalation
     * @param {object} aiResponse - AI response object
     */
    showEducationalWarning(aiResponse) {
        // Create educational overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(10px);
        `;

        const warning = document.createElement('div');
        warning.style.cssText = `
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        `;

        warning.innerHTML = `
            <h2>⚠️ CRITICAL MANIPULATION DETECTED</h2>
            <p><strong>Sophistication Level:</strong> ${aiResponse.sophistication}/5</p>
            <p><strong>Tactic:</strong> ${aiResponse.tactic?.name || 'Advanced Manipulation'}</p>
            <p style="margin: 20px 0; font-size: 14px; line-height: 1.4;">
                ${aiResponse.educational_notes}
            </p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="padding: 10px 20px; background: white; color: #dc2626; 
                           border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                I Understand
            </button>
        `;

        overlay.appendChild(warning);
        document.body.appendChild(overlay);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 10000);
    }

    /**
     * Format AI response for display
     * @param {object} aiResponse - AI response object
     * @returns {string} Formatted response text
     */
    formatResponse(aiResponse) {
        let response = aiResponse.response;

        // Add subtle indicators for educational purposes (in development mode)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const indicators = {
                'Guardian': '🛡️',
                'Deceiver': '🎭'
            };
            
            const indicator = indicators[aiResponse.persona] || '';
            if (indicator && aiResponse.sophistication > 1) {
                response = `${indicator} ${response}`;
            }
        }

        return response;
    }

    /**
     * Estimate trust score from session history (fallback)
     * @returns {number} Estimated trust score
     */
    estimateTrustFromHistory() {
        if (this.sessionHistory.length === 0) return 50;

        // Simple estimation based on recent interactions
        const recentInteractions = this.sessionHistory.slice(-5);
        const avgImpact = recentInteractions.reduce((sum, interaction) => 
            sum + (interaction.trust_impact || 0), 0) / recentInteractions.length;

        return Math.max(-100, Math.min(100, 50 + avgImpact * recentInteractions.length));
    }

    /**
     * Get default response for fallback situations
     * @param {string} userMessage - User's message
     * @returns {string} Default response
     */
    getDefaultResponse(userMessage) {
        const defaultResponses = [
            "I understand what you're saying.",
            "That's an interesting point.",
            "Tell me more about that.",
            "I see where you're coming from.",
            "What do you think about this situation?"
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    /**
     * Get current AI state for debugging
     * @returns {object} Current state information
     */
    getCurrentState() {
        return {
            character: this.currentCharacter,
            session_length: this.sessionHistory.length,
            escalation_warnings: this.escalationWarnings.length,
            deception_engine_state: this.deceptionEngine.getCurrentState(),
            trust_score: this.getCurrentTrustScore(),
            last_response: this.lastResponse
        };
    }

    /**
     * Reset session for new character or scenario
     */
    resetSession() {
        this.sessionHistory = [];
        this.escalationWarnings = [];
        this.deceptionEngine.resetPlayerHistory();
        
        // Stop time pressure if active
        this.timePressureSystem.stopScenario();
        
        if (this.trustScoreUI) {
            this.trustScoreUI.reset();
        }
        
        console.log('🔄 Session reset');
    }

    /**
     * Manual integration with existing chat systems
     * @param {string} userMessage - User message
     * @param {string} character - Character name
     * @param {object} options - Additional options
     * @returns {Promise<string>} AI response
     */
    async generateResponse(userMessage, character, options = {}) {
        this.setCharacter(character);
        return await this.adaptiveGetBotResponse(userMessage, options);
    }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
    // Wait for other systems to load
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (!window.chromaBotAdaptive) {
                window.chromaBotAdaptive = new ChromaBotAdaptiveIntegration();
                console.log('🚀 Chroma Bot Adaptive Integration auto-initialized');
            }
        }, 1000);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChromaBotAdaptiveIntegration;
} else if (typeof window !== 'undefined') {
    window.ChromaBotAdaptiveIntegration = ChromaBotAdaptiveIntegration;
}