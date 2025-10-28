/**
 * Mode System Integration
 * Integrates the Guardian/Shadow Observer mode system with existing gaming mechanics
 */

class ModeSystemIntegration {
    constructor() {
        this.modeManager = null;
        this.modeSelectionInterface = null;
        this.shadowObserverIntegration = null;
        this.gamingMechanicsEngine = null;
        this.chromaBotIntegration = null;
        
        this.isInitialized = false;
        this.currentGameplaySession = null;
    }

    /**
     * Initialize the mode system integration
     */
    async initialize(dependencies = {}) {
        try {
            // Initialize core components
            this.modeManager = new ModeManager();
            this.modeSelectionInterface = new ModeSelectionInterface(this.modeManager);
            
            // Get existing system references
            this.gamingMechanicsEngine = dependencies.gamingMechanicsEngine || window.gamingMechanicsEngine;
            this.chromaBotIntegration = dependencies.chromaBotIntegration || window.chromaBotIntegration;
            
            // Initialize Shadow Observer integration
            this.shadowObserverIntegration = new ShadowObserverIntegration(
                this.modeManager,
                this.chromaBotIntegration
            );
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Integrate with existing systems
            await this.integrateWithExistingSystems();
            
            this.isInitialized = true;
            console.log('Mode System Integration initialized successfully');
            
            // Emit initialization event
            this.emitInitializationEvent();
            
        } catch (error) {
            console.error('Failed to initialize Mode System Integration:', error);
            throw error;
        }
    }

    /**
     * Start gameplay session with mode selection
     */
    async startGameplaySession(character, area, options = {}) {
        if (!this.isInitialized) {
            throw new Error('Mode System Integration not initialized');
        }
        
        try {
            // Show mode selection interface
            const modeSelection = await this.modeSelectionInterface.show(character, area, options);
            
            if (modeSelection.skipped) {
                // Continue without mode selection
                return this.startSessionWithoutMode(character, area);
            }
            
            // Initialize gameplay session with selected mode
            this.currentGameplaySession = {
                character,
                area,
                mode: modeSelection.mode,
                startTime: Date.now(),
                interactions: [],
                decisions: []
            };
            
            // Integrate with gaming mechanics engine
            if (this.gamingMechanicsEngine) {
                await this.gamingMechanicsEngine.initializeForMode(
                    character,
                    area,
                    modeSelection.mode
                );
            }
            
            // Emit session start event
            this.emitSessionStartEvent(this.currentGameplaySession);
            
            return this.currentGameplaySession;
            
        } catch (error) {
            console.error('Failed to start gameplay session:', error);
            throw error;
        }
    }

    /**
     * Start session without mode selection
     */
    async startSessionWithoutMode(character, area) {
        this.currentGameplaySession = {
            character,
            area,
            mode: null,
            startTime: Date.now(),
            interactions: [],
            decisions: []
        };
        
        return this.currentGameplaySession;
    }

    /**
     * Handle user interaction in current mode
     */
    async handleInteraction(interactionData) {
        if (!this.currentGameplaySession) {
            console.warn('No active gameplay session for interaction');
            return null;
        }
        
        const { mode, character, area } = this.currentGameplaySession;
        
        // Add session context to interaction
        const enhancedInteraction = {
            ...interactionData,
            sessionId: this.currentGameplaySession.startTime,
            character,
            area,
            mode,
            timestamp: Date.now()
        };
        
        let result = null;
        
        // Process interaction based on current mode
        if (mode === 'shadowObserver') {
            result = await this.shadowObserverIntegration.processInteraction(enhancedInteraction);
        } else if (mode === 'guardian') {
            result = await this.processGuardianInteraction(enhancedInteraction);
        } else {
            result = await this.processNeutralInteraction(enhancedInteraction);
        }
        
        // Record interaction in session
        this.currentGameplaySession.interactions.push({
            ...enhancedInteraction,
            result
        });
        
        // Emit interaction event
        this.emitInteractionEvent(enhancedInteraction, result);
        
        return result;
    }

    /**
     * Process Guardian mode interaction
     */
    async processGuardianInteraction(interactionData) {
        // Guardian mode focuses on safety and protection
        const guardianResponse = {
            type: 'guardian',
            guidance: 'protective',
            warnings: this.generateSafetyWarnings(interactionData),
            recommendations: this.generateSafetyRecommendations(interactionData),
            educationalContent: this.generateEducationalContent(interactionData)
        };
        
        // Integrate with chroma-bot for Guardian responses
        if (this.chromaBotIntegration) {
            const aiResponse = await this.chromaBotIntegration.generateResponse(
                this.buildGuardianPrompt(interactionData),
                {
                    character: interactionData.character,
                    mode: 'guardian',
                    area: interactionData.area
                }
            );
            guardianResponse.aiResponse = aiResponse;
        }
        
        return guardianResponse;
    }

    /**
     * Process neutral interaction (no mode selected)
     */
    async processNeutralInteraction(interactionData) {
        // Neutral mode provides balanced information
        return {
            type: 'neutral',
            guidance: 'informational',
            options: this.generateNeutralOptions(interactionData),
            information: this.generateContextualInformation(interactionData)
        };
    }

    /**
     * Generate safety warnings for Guardian mode
     */
    generateSafetyWarnings(interactionData) {
        const { character, type, target } = interactionData;
        
        const warningTemplates = {
            eli: {
                account_access: "⚠️ Be cautious about sharing account credentials",
                financial_transaction: "💰 Verify the legitimacy of gaming-related purchases",
                social_interaction: "👥 Be aware of social engineering in gaming communities"
            },
            maya: {
                personal_information: "🔒 Protect personal information in online dating",
                meeting_arrangement: "📍 Always meet in public places for safety",
                financial_request: "💳 Never send money to someone you haven't met"
            },
            stanley: {
                official_communication: "📧 Verify official communications independently",
                financial_decision: "🏦 Consult with trusted family before financial decisions",
                technology_assistance: "💻 Be cautious of unsolicited technical help"
            }
        };
        
        const characterWarnings = warningTemplates[character] || {};
        return Object.values(characterWarnings).filter(warning => 
            this.isWarningRelevant(warning, interactionData)
        );
    }

    /**
     * Generate safety recommendations
     */
    generateSafetyRecommendations(interactionData) {
        const { character, type } = interactionData;
        
        const recommendations = {
            eli: [
                "Use strong, unique passwords for gaming accounts",
                "Enable two-factor authentication",
                "Verify tournament legitimacy before participating",
                "Be cautious of too-good-to-be-true gaming offers"
            ],
            maya: [
                "Verify dating profiles through multiple methods",
                "Trust your instincts about suspicious behavior",
                "Keep personal information private initially",
                "Use reverse image search on profile photos"
            ],
            stanley: [
                "Verify caller identity through official channels",
                "Take time to think before making decisions",
                "Consult with family about important matters",
                "Be skeptical of urgent requests"
            ]
        };
        
        return recommendations[character] || [];
    }

    /**
     * Generate educational content
     */
    generateEducationalContent(interactionData) {
        const { character, type } = interactionData;
        
        return {
            concept: this.getRelevantCybersecurityConcept(character, type),
            explanation: this.getConceptExplanation(character, type),
            realWorldExample: this.getRealWorldExample(character, type),
            preventionTips: this.getPreventionTips(character, type)
        };
    }

    /**
     * Build Guardian mode prompt for AI
     */
    buildGuardianPrompt(interactionData) {
        const { character, type, context } = interactionData;
        
        return `
            You are operating in Guardian mode, helping to protect ${character} from cybersecurity threats.
            
            Current situation: ${context}
            Interaction type: ${type}
            
            Your role is to:
            1. Highlight potential security risks
            2. Provide protective guidance
            3. Suggest safe alternatives
            4. Educate about cybersecurity best practices
            5. Encourage verification and caution
            
            Respond in a helpful, protective manner that empowers the user with knowledge and safe practices.
        `;
    }

    /**
     * Switch modes during gameplay
     */
    async switchMode(newMode) {
        if (!this.currentGameplaySession) {
            throw new Error('No active gameplay session');
        }
        
        const { character, area } = this.currentGameplaySession;
        
        // Use mode manager to switch modes
        const result = await this.modeManager.setMode(newMode, character, area);
        
        // Update current session
        this.currentGameplaySession.mode = newMode;
        this.currentGameplaySession.modeChanges = this.currentGameplaySession.modeChanges || [];
        this.currentGameplaySession.modeChanges.push({
            timestamp: Date.now(),
            newMode,
            reason: 'user_request'
        });
        
        // Emit mode switch event
        this.emitModeSwitchEvent(newMode, result);
        
        return result;
    }

    /**
     * End current gameplay session
     */
    async endGameplaySession() {
        if (!this.currentGameplaySession) {
            return null;
        }
        
        const session = {
            ...this.currentGameplaySession,
            endTime: Date.now(),
            duration: Date.now() - this.currentGameplaySession.startTime
        };
        
        // Deactivate mode-specific systems
        if (session.mode === 'shadowObserver') {
            await this.shadowObserverIntegration.deactivate();
        }
        
        // Reset mode manager
        this.modeManager.reset();
        
        // Clear current session
        this.currentGameplaySession = null;
        
        // Emit session end event
        this.emitSessionEndEvent(session);
        
        return session;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for mode selection requests
        document.addEventListener('requestModeSelection', async (event) => {
            const { character, area, options } = event.detail;
            try {
                const session = await this.startGameplaySession(character, area, options);
                event.detail.session = session;
            } catch (error) {
                event.detail.error = error;
            }
        });
        
        // Listen for interaction requests
        document.addEventListener('gamingMechanicsInteraction', async (event) => {
            try {
                const result = await this.handleInteraction(event.detail);
                event.detail.result = result;
            } catch (error) {
                event.detail.error = error;
            }
        });
        
        // Listen for mode switch requests
        document.addEventListener('requestModeSwitch', async (event) => {
            const { mode } = event.detail;
            try {
                const result = await this.switchMode(mode);
                event.detail.result = result;
            } catch (error) {
                event.detail.error = error;
            }
        });
    }

    /**
     * Integrate with existing systems
     */
    async integrateWithExistingSystems() {
        // Integrate with gaming mechanics engine
        if (this.gamingMechanicsEngine) {
            this.gamingMechanicsEngine.setModeSystemIntegration(this);
        }
        
        // Integrate with story progression tracker
        if (window.storyProgressionTracker) {
            window.storyProgressionTracker.setModeSystemIntegration(this);
        }
        
        // Integrate with cinematic moments
        if (window.cinematicMomentsManager) {
            window.cinematicMomentsManager.setModeSystemIntegration(this);
        }
    }

    /**
     * Get current session information
     */
    getCurrentSession() {
        return this.currentGameplaySession;
    }

    /**
     * Check if mode system is active
     */
    isActive() {
        return this.isInitialized && this.currentGameplaySession !== null;
    }

    /**
     * Emit initialization event
     */
    emitInitializationEvent() {
        const event = new CustomEvent('modeSystemInitialized', {
            detail: { timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    /**
     * Emit session start event
     */
    emitSessionStartEvent(session) {
        const event = new CustomEvent('gameplaySessionStarted', {
            detail: session
        });
        document.dispatchEvent(event);
    }

    /**
     * Emit interaction event
     */
    emitInteractionEvent(interaction, result) {
        const event = new CustomEvent('modeInteractionProcessed', {
            detail: { interaction, result }
        });
        document.dispatchEvent(event);
    }

    /**
     * Emit mode switch event
     */
    emitModeSwitchEvent(newMode, result) {
        const event = new CustomEvent('modeSwitched', {
            detail: { newMode, result, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    /**
     * Emit session end event
     */
    emitSessionEndEvent(session) {
        const event = new CustomEvent('gameplaySessionEnded', {
            detail: session
        });
        document.dispatchEvent(event);
    }

    // Helper methods for generating content
    isWarningRelevant(warning, interactionData) {
        // Simple relevance check - could be enhanced
        return true;
    }

    getRelevantCybersecurityConcept(character, type) {
        const concepts = {
            eli: 'Gaming Account Security',
            maya: 'Online Dating Safety',
            stanley: 'Elder Fraud Prevention'
        };
        return concepts[character] || 'General Cybersecurity';
    }

    getConceptExplanation(character, type) {
        // Return educational explanation based on character and interaction type
        return `Understanding cybersecurity risks specific to ${character}'s situation.`;
    }

    getRealWorldExample(character, type) {
        // Return real-world example relevant to the character
        return `Real-world cybersecurity incident relevant to ${character}.`;
    }

    getPreventionTips(character, type) {
        // Return prevention tips specific to character
        return [`Prevention tip for ${character}`];
    }

    generateNeutralOptions(interactionData) {
        // Generate balanced options for neutral mode
        return [
            { text: 'Learn more about this situation', type: 'educational' },
            { text: 'See safety recommendations', type: 'safety' },
            { text: 'Understand the risks', type: 'risk_analysis' }
        ];
    }

    generateContextualInformation(interactionData) {
        // Generate contextual information for the interaction
        return {
            context: interactionData.context,
            relevantConcepts: ['cybersecurity', 'digital_safety'],
            educationalResources: []
        };
    }
}

// Export the integration class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModeSystemIntegration };
} else if (typeof window !== 'undefined') {
    window.ModeSystemIntegration = ModeSystemIntegration;
}