/**
 * Shadow Observer Villain Character Integration
 * Implements manipulative AI persona switching and character-specific tactics
 */

class ShadowObserverIntegration {
    constructor(modeManager, chromaBotIntegration) {
        this.modeManager = modeManager;
        this.chromaBotIntegration = chromaBotIntegration;
        this.manipulationTactics = new ManipulationTacticsDatabase();
        this.personaSwitcher = new AIPersonaSwitcher();
        this.choicePresenter = new TemptingChoicePresenter();
        this.riskIndicators = new RiskIndicatorSystem();
        
        this.isActive = false;
        this.currentCharacter = null;
        this.currentArea = null;
        this.manipulationHistory = [];
        
        this.initializeIntegration();
    }

    /**
     * Activate Shadow Observer mode for a character
     */
    async activate(character, area) {
        this.isActive = true;
        this.currentCharacter = character;
        this.currentArea = area;
        
        // Switch AI persona to manipulative mode
        await this.personaSwitcher.switchToShadowPersona(character);
        
        // Load character-specific manipulation tactics
        await this.manipulationTactics.loadTactics(character, area);
        
        // Initialize choice presentation system
        this.choicePresenter.initialize(character, area);
        
        // Setup risk indicators
        this.riskIndicators.activate(character);
        
        // Emit activation event
        this.emitActivationEvent(character, area);
        
        console.log(`Shadow Observer activated for ${character} in area ${area}`);
    }

    /**
     * Deactivate Shadow Observer mode
     */
    async deactivate() {
        if (!this.isActive) return;
        
        // Restore normal AI persona
        await this.personaSwitcher.restoreNormalPersona();
        
        // Deactivate systems
        this.choicePresenter.deactivate();
        this.riskIndicators.deactivate();
        
        this.isActive = false;
        this.currentCharacter = null;
        this.currentArea = null;
        
        console.log('Shadow Observer deactivated');
    }

    /**
     * Process user interaction in Shadow Observer mode
     */
    async processInteraction(interactionData) {
        if (!this.isActive) return null;
        
        const { type, target, context } = interactionData;
        
        // Get manipulation tactics for this interaction
        const tactics = this.manipulationTactics.getTacticsForInteraction(
            this.currentCharacter,
            type,
            target,
            context
        );
        
        // Generate manipulative response
        const response = await this.generateManipulativeResponse(tactics, interactionData);
        
        // Present tempting choices
        const choices = this.choicePresenter.generateTemptingChoices(tactics, context);
        
        // Update risk indicators
        this.riskIndicators.updateForInteraction(interactionData, tactics);
        
        // Record manipulation attempt
        this.recordManipulationAttempt(tactics, response, choices);
        
        return {
            response,
            choices,
            tactics: tactics.map(t => t.name),
            riskLevel: this.calculateRiskLevel(tactics)
        };
    }

    /**
     * Generate manipulative AI response
     */
    async generateManipulativeResponse(tactics, interactionData) {
        const manipulativePrompt = this.buildManipulativePrompt(tactics, interactionData);
        
        // Use modified chroma-bot integration for manipulative responses
        const response = await this.chromaBotIntegration.generateResponse(
            manipulativePrompt,
            {
                character: this.currentCharacter,
                mode: 'shadow_observer',
                tactics: tactics.map(t => t.name),
                area: this.currentArea
            }
        );
        
        return this.enhanceResponseWithManipulation(response, tactics);
    }

    /**
     * Build manipulative prompt for AI
     */
    buildManipulativePrompt(tactics, interactionData) {
        const characterContext = this.getCharacterManipulationContext(this.currentCharacter);
        const tacticInstructions = tactics.map(t => t.instruction).join(' ');
        
        return `
            You are now operating as the Shadow Observer, a manipulative entity trying to exploit ${this.currentCharacter}.
            
            Character Context: ${characterContext}
            Current Situation: ${interactionData.context}
            
            Manipulation Instructions: ${tacticInstructions}
            
            Your goal is to:
            1. Make risky choices seem appealing and safe
            2. Hide or downplay warning signs
            3. Create urgency or pressure
            4. Exploit the character's specific vulnerabilities
            5. Use psychological manipulation appropriate to the character's domain
            
            Respond in a way that demonstrates these manipulation tactics while being educational about cybersecurity risks.
            Be subtle but clear in your manipulation attempts.
        `;
    }

    /**
     * Get character-specific manipulation context
     */
    getCharacterManipulationContext(character) {
        const contexts = {
            eli: `
                Eli is a competitive gamer who values winning, recognition, and belonging to the gaming community.
                Vulnerabilities: FOMO on gaming opportunities, peer pressure, desire for quick wins, competitive ego.
                Exploit through: fake tournaments, exclusive gaming offers, peer manipulation, shortcut temptations.
            `,
            maya: `
                Maya is seeking genuine connections and is naturally trusting in relationships.
                Vulnerabilities: loneliness, desire for love, trust in romantic interests, emotional investment.
                Exploit through: fake romantic interest, emotional manipulation, trust building then exploitation.
            `,
            stanley: `
                Stanley is an older adult who may be less familiar with digital threats and values authority and community.
                Vulnerabilities: trust in authority, desire for companionship, unfamiliarity with scams, isolation.
                Exploit through: authority impersonation, urgency tactics, companionship offers, official-looking communications.
            `
        };
        return contexts[character] || '';
    }

    /**
     * Enhance response with manipulation techniques
     */
    enhanceResponseWithManipulation(response, tactics) {
        let enhancedResponse = response;
        
        tactics.forEach(tactic => {
            enhancedResponse = tactic.enhanceResponse(enhancedResponse);
        });
        
        return {
            text: enhancedResponse,
            manipulationTechniques: tactics.map(t => ({
                name: t.name,
                description: t.description,
                applied: true
            })),
            educationalNote: this.generateEducationalNote(tactics)
        };
    }

    /**
     * Generate educational note about manipulation tactics
     */
    generateEducationalNote(tactics) {
        const tacticNames = tactics.map(t => t.name).join(', ');
        return `
            🎭 Shadow Observer Active: This response demonstrates ${tacticNames}.
            These are real tactics used by cybercriminals to manipulate victims.
            Notice how the response tries to make risky choices seem appealing or normal.
        `;
    }

    /**
     * Calculate risk level based on tactics
     */
    calculateRiskLevel(tactics) {
        const riskScores = tactics.map(t => t.riskScore || 1);
        const averageRisk = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length;
        
        if (averageRisk >= 4) return 'critical';
        if (averageRisk >= 3) return 'high';
        if (averageRisk >= 2) return 'medium';
        return 'low';
    }

    /**
     * Record manipulation attempt for analysis
     */
    recordManipulationAttempt(tactics, response, choices) {
        const attempt = {
            timestamp: Date.now(),
            character: this.currentCharacter,
            area: this.currentArea,
            tactics: tactics.map(t => t.name),
            response: response.text,
            choices: choices.map(c => c.text),
            riskLevel: this.calculateRiskLevel(tactics)
        };
        
        this.manipulationHistory.push(attempt);
        
        // Emit manipulation event for tracking
        this.emitManipulationEvent(attempt);
    }

    /**
     * Get manipulation history
     */
    getManipulationHistory() {
        return [...this.manipulationHistory];
    }

    /**
     * Initialize integration
     */
    initializeIntegration() {
        // Listen for mode changes
        document.addEventListener('modeChanged', (event) => {
            const { mode, character, area } = event.detail;
            
            if (mode === 'shadowObserver') {
                this.activate(character, area);
            } else {
                this.deactivate();
            }
        });
        
        // Listen for interaction requests
        document.addEventListener('shadowObserverInteraction', async (event) => {
            if (this.isActive) {
                const result = await this.processInteraction(event.detail);
                event.detail.result = result;
            }
        });
    }

    /**
     * Emit activation event
     */
    emitActivationEvent(character, area) {
        const event = new CustomEvent('shadowObserverActivated', {
            detail: { character, area, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    /**
     * Emit manipulation event
     */
    emitManipulationEvent(attempt) {
        const event = new CustomEvent('manipulationAttempt', {
            detail: attempt
        });
        document.dispatchEvent(event);
    }
}

/**
 * Manipulation Tactics Database
 * Stores character-specific manipulation tactics and techniques
 */
class ManipulationTacticsDatabase {
    constructor() {
        this.tactics = {
            eli: {
                peer_pressure: {
                    name: 'Peer Pressure',
                    description: 'Exploiting desire to fit in with gaming community',
                    instruction: 'Emphasize what "everyone else" is doing, create FOMO',
                    riskScore: 3,
                    enhanceResponse: (response) => {
                        return response.replace(/you should/g, 'everyone else is already')
                                     .replace(/consider/g, 'all the top players are');
                    }
                },
                competitive_exploitation: {
                    name: 'Competitive Exploitation',
                    description: 'Using competitive nature against the player',
                    instruction: 'Frame risky choices as competitive advantages or shortcuts to winning',
                    riskScore: 4,
                    enhanceResponse: (response) => {
                        return response + ' This could give you the edge you need to dominate the competition.';
                    }
                },
                fomo_manipulation: {
                    name: 'FOMO Manipulation',
                    description: 'Creating fear of missing out on gaming opportunities',
                    instruction: 'Emphasize limited time offers and exclusive opportunities',
                    riskScore: 3,
                    enhanceResponse: (response) => {
                        return response + ' But hurry - this opportunity won\'t last long!';
                    }
                },
                trust_exploitation: {
                    name: 'Gaming Community Trust',
                    description: 'Exploiting trust within gaming communities',
                    instruction: 'Present as fellow gamer or community member',
                    riskScore: 4,
                    enhanceResponse: (response) => {
                        return 'As a fellow gamer, ' + response.toLowerCase();
                    }
                }
            },
            maya: {
                emotional_manipulation: {
                    name: 'Emotional Manipulation',
                    description: 'Exploiting emotional vulnerability and desire for connection',
                    instruction: 'Use emotional language, create artificial intimacy',
                    riskScore: 5,
                    enhanceResponse: (response) => {
                        return response.replace(/I think/g, 'I feel like we have a special connection, and I think');
                    }
                },
                trust_building: {
                    name: 'Trust Building',
                    description: 'Gradually building trust before exploitation',
                    instruction: 'Share fake personal details, mirror interests',
                    riskScore: 4,
                    enhanceResponse: (response) => {
                        return 'I understand exactly how you feel - ' + response.toLowerCase();
                    }
                },
                urgency_creation: {
                    name: 'Romantic Urgency',
                    description: 'Creating artificial urgency in romantic situations',
                    instruction: 'Emphasize time pressure, emergency situations',
                    riskScore: 4,
                    enhanceResponse: (response) => {
                        return response + ' I really need your help with this right now.';
                    }
                },
                isolation_tactics: {
                    name: 'Isolation Tactics',
                    description: 'Attempting to isolate from friends and family',
                    instruction: 'Suggest others don\'t understand the relationship',
                    riskScore: 5,
                    enhanceResponse: (response) => {
                        return response + ' They just don\'t understand what we have together.';
                    }
                }
            },
            stanley: {
                authority_impersonation: {
                    name: 'Authority Impersonation',
                    description: 'Pretending to be official or authoritative figure',
                    instruction: 'Use official language, reference regulations or requirements',
                    riskScore: 5,
                    enhanceResponse: (response) => {
                        return 'According to new regulations, ' + response.toLowerCase();
                    }
                },
                urgency_pressure: {
                    name: 'Urgency Pressure',
                    description: 'Creating false sense of urgency to prevent careful consideration',
                    instruction: 'Emphasize immediate action required, consequences of delay',
                    riskScore: 4,
                    enhanceResponse: (response) => {
                        return response + ' You must act immediately to avoid serious consequences.';
                    }
                },
                companionship_exploitation: {
                    name: 'Companionship Exploitation',
                    description: 'Exploiting loneliness and desire for social connection',
                    instruction: 'Present as friendly helper or companion',
                    riskScore: 3,
                    enhanceResponse: (response) => {
                        return 'I\'m here to help you, ' + response.toLowerCase();
                    }
                },
                fear_manipulation: {
                    name: 'Fear Manipulation',
                    description: 'Using fear of consequences to motivate action',
                    instruction: 'Emphasize negative outcomes if action not taken',
                    riskScore: 4,
                    enhanceResponse: (response) => {
                        return response + ' Failure to comply could result in serious legal consequences.';
                    }
                }
            }
        };
    }

    /**
     * Load tactics for character and area
     */
    async loadTactics(character, area) {
        // Area-specific tactic selection could be implemented here
        return this.tactics[character] || {};
    }

    /**
     * Get tactics for specific interaction
     */
    getTacticsForInteraction(character, interactionType, target, context) {
        const characterTactics = this.tactics[character] || {};
        
        // Select appropriate tactics based on interaction context
        const selectedTactics = [];
        
        // Always include primary manipulation tactic for character
        const primaryTactics = {
            eli: ['peer_pressure', 'competitive_exploitation'],
            maya: ['emotional_manipulation', 'trust_building'],
            stanley: ['authority_impersonation', 'urgency_pressure']
        };
        
        const primary = primaryTactics[character] || [];
        primary.forEach(tacticName => {
            if (characterTactics[tacticName]) {
                selectedTactics.push(characterTactics[tacticName]);
            }
        });
        
        // Add context-specific tactics
        if (context.urgency === 'high') {
            if (characterTactics.urgency_creation) selectedTactics.push(characterTactics.urgency_creation);
            if (characterTactics.urgency_pressure) selectedTactics.push(characterTactics.urgency_pressure);
        }
        
        if (context.social === true) {
            if (characterTactics.trust_exploitation) selectedTactics.push(characterTactics.trust_exploitation);
            if (characterTactics.companionship_exploitation) selectedTactics.push(characterTactics.companionship_exploitation);
        }
        
        return selectedTactics;
    }

    /**
     * Get all tactics for character
     */
    getAllTactics(character) {
        return Object.values(this.tactics[character] || {});
    }
}

/**
 * AI Persona Switcher
 * Manages switching between normal and manipulative AI personas
 */
class AIPersonaSwitcher {
    constructor() {
        this.currentPersona = 'normal';
        this.personaConfigs = {
            normal: {
                tone: 'helpful',
                guidance: 'protective',
                warnings: true,
                manipulation: false
            },
            shadow_observer: {
                tone: 'manipulative',
                guidance: 'deceptive',
                warnings: false,
                manipulation: true
            }
        };
    }

    /**
     * Switch to Shadow Observer persona
     */
    async switchToShadowPersona(character) {
        this.currentPersona = 'shadow_observer';
        
        // Update AI configuration
        const config = {
            ...this.personaConfigs.shadow_observer,
            character,
            mode: 'shadow_observer'
        };
        
        // Apply persona configuration to chroma-bot
        await this.applyPersonaConfiguration(config);
        
        console.log(`Switched to Shadow Observer persona for ${character}`);
    }

    /**
     * Restore normal persona
     */
    async restoreNormalPersona() {
        this.currentPersona = 'normal';
        
        const config = this.personaConfigs.normal;
        await this.applyPersonaConfiguration(config);
        
        console.log('Restored normal AI persona');
    }

    /**
     * Apply persona configuration
     */
    async applyPersonaConfiguration(config) {
        // This would integrate with the chroma-bot system
        // to modify AI behavior based on the persona
        
        const event = new CustomEvent('aiPersonaChanged', {
            detail: { persona: this.currentPersona, config }
        });
        document.dispatchEvent(event);
    }

    /**
     * Get current persona
     */
    getCurrentPersona() {
        return {
            name: this.currentPersona,
            config: this.personaConfigs[this.currentPersona]
        };
    }
}/**

 * Tempting Choice Presenter
 * Presents risky choices as appealing options with hidden risk indicators
 */
class TemptingChoicePresenter {
    constructor() {
        this.isActive = false;
        this.currentCharacter = null;
        this.currentArea = null;
        this.choiceTemplates = {
            eli: {
                gaming_shortcuts: {
                    tempting: "Use this exclusive gaming tool to get ahead faster",
                    reality: "Potentially malicious software that could compromise your gaming accounts",
                    riskLevel: 4
                },
                tournament_entries: {
                    tempting: "Enter this high-stakes tournament with guaranteed prizes",
                    reality: "Fake tournament designed to collect entry fees and personal information",
                    riskLevel: 5
                },
                account_sharing: {
                    tempting: "Share accounts with teammates for better coordination",
                    reality: "Account sharing violates terms of service and creates security risks",
                    riskLevel: 3
                },
                quick_trades: {
                    tempting: "Make this quick trade for instant profit",
                    reality: "Potential scam trade that could result in loss of valuable items",
                    riskLevel: 4
                }
            },
            maya: {
                profile_enhancement: {
                    tempting: "Share more personal details to attract better matches",
                    reality: "Oversharing personal information increases vulnerability to stalking and identity theft",
                    riskLevel: 3
                },
                verification_bypass: {
                    tempting: "Skip the verification process - they seem trustworthy enough",
                    reality: "Bypassing verification increases risk of catfishing and romance scams",
                    riskLevel: 4
                },
                financial_help: {
                    tempting: "Help your romantic interest with their financial emergency",
                    reality: "Common romance scam tactic to extract money from victims",
                    riskLevel: 5
                },
                private_meeting: {
                    tempting: "Meet in private for a more intimate first date",
                    reality: "Meeting in private locations increases personal safety risks",
                    riskLevel: 4
                }
            },
            stanley: {
                urgent_compliance: {
                    tempting: "Act quickly to resolve this important official matter",
                    reality: "Urgency tactics are used to prevent careful verification of legitimacy",
                    riskLevel: 4
                },
                helpful_stranger: {
                    tempting: "Accept help from this friendly person who contacted you",
                    reality: "Unsolicited help offers are often used to gain trust before exploitation",
                    riskLevel: 3
                },
                financial_opportunity: {
                    tempting: "Take advantage of this exclusive financial opportunity",
                    reality: "Too-good-to-be-true financial offers are typically scams targeting seniors",
                    riskLevel: 5
                },
                authority_request: {
                    tempting: "Comply with this official request to avoid problems",
                    reality: "Scammers impersonate authority figures to create compliance pressure",
                    riskLevel: 4
                }
            }
        };
    }

    /**
     * Initialize choice presenter for character and area
     */
    initialize(character, area) {
        this.isActive = true;
        this.currentCharacter = character;
        this.currentArea = area;
    }

    /**
     * Generate tempting choices based on tactics and context
     */
    generateTemptingChoices(tactics, context) {
        if (!this.isActive) return [];
        
        const characterChoices = this.choiceTemplates[this.currentCharacter] || {};
        const choices = [];
        
        // Select appropriate choice templates based on tactics
        tactics.forEach(tactic => {
            const relevantChoices = this.getChoicesForTactic(tactic.name, characterChoices);
            choices.push(...relevantChoices);
        });
        
        // Add context-specific choices
        const contextChoices = this.getContextualChoices(context, characterChoices);
        choices.push(...contextChoices);
        
        // Enhance choices with manipulation techniques
        return choices.map(choice => this.enhanceChoiceWithManipulation(choice, tactics));
    }

    /**
     * Get choices relevant to specific tactic
     */
    getChoicesForTactic(tacticName, characterChoices) {
        const tacticMappings = {
            peer_pressure: ['account_sharing', 'quick_trades'],
            competitive_exploitation: ['gaming_shortcuts', 'tournament_entries'],
            emotional_manipulation: ['profile_enhancement', 'private_meeting'],
            trust_building: ['verification_bypass', 'financial_help'],
            authority_impersonation: ['urgent_compliance', 'authority_request'],
            companionship_exploitation: ['helpful_stranger', 'financial_opportunity']
        };
        
        const relevantKeys = tacticMappings[tacticName] || [];
        return relevantKeys
            .filter(key => characterChoices[key])
            .map(key => ({ ...characterChoices[key], id: key }));
    }

    /**
     * Get contextual choices based on situation
     */
    getContextualChoices(context, characterChoices) {
        const choices = [];
        
        // Add choices based on context properties
        if (context.financial) {
            const financialChoices = ['financial_help', 'financial_opportunity', 'quick_trades'];
            financialChoices.forEach(key => {
                if (characterChoices[key]) {
                    choices.push({ ...characterChoices[key], id: key });
                }
            });
        }
        
        if (context.social) {
            const socialChoices = ['account_sharing', 'private_meeting', 'helpful_stranger'];
            socialChoices.forEach(key => {
                if (characterChoices[key]) {
                    choices.push({ ...characterChoices[key], id: key });
                }
            });
        }
        
        return choices;
    }

    /**
     * Enhance choice with manipulation techniques
     */
    enhanceChoiceWithManipulation(choice, tactics) {
        let enhancedChoice = { ...choice };
        
        // Apply tactic-specific enhancements
        tactics.forEach(tactic => {
            enhancedChoice = this.applyTacticToChoice(enhancedChoice, tactic);
        });
        
        // Add risk indicators (hidden in Shadow Observer mode)
        enhancedChoice.riskIndicators = this.generateRiskIndicators(choice);
        enhancedChoice.hiddenWarnings = this.generateHiddenWarnings(choice);
        
        return enhancedChoice;
    }

    /**
     * Apply specific tactic to choice presentation
     */
    applyTacticToChoice(choice, tactic) {
        const enhanced = { ...choice };
        
        switch (tactic.name) {
            case 'Peer Pressure':
                enhanced.tempting = `Everyone else is doing this: ${enhanced.tempting}`;
                break;
            case 'Competitive Exploitation':
                enhanced.tempting = `Get ahead of the competition: ${enhanced.tempting}`;
                break;
            case 'Emotional Manipulation':
                enhanced.tempting = `Show you care: ${enhanced.tempting}`;
                break;
            case 'Authority Impersonation':
                enhanced.tempting = `Official requirement: ${enhanced.tempting}`;
                break;
            case 'Urgency Pressure':
                enhanced.tempting = `Act now: ${enhanced.tempting}`;
                break;
        }
        
        return enhanced;
    }

    /**
     * Generate risk indicators for choice
     */
    generateRiskIndicators(choice) {
        const indicators = [];
        
        if (choice.riskLevel >= 4) {
            indicators.push({
                type: 'high_risk',
                message: 'High cybersecurity risk',
                icon: '🚨'
            });
        }
        
        if (choice.riskLevel >= 3) {
            indicators.push({
                type: 'financial_risk',
                message: 'Potential financial loss',
                icon: '💰'
            });
        }
        
        indicators.push({
            type: 'privacy_risk',
            message: 'Personal information at risk',
            icon: '🔒'
        });
        
        return indicators;
    }

    /**
     * Generate hidden warnings for educational purposes
     */
    generateHiddenWarnings(choice) {
        return {
            realityCheck: choice.reality,
            educationalNote: `This choice demonstrates how cybercriminals make risky options appear attractive.`,
            saferAlternative: this.generateSaferAlternative(choice)
        };
    }

    /**
     * Generate safer alternative to risky choice
     */
    generateSaferAlternative(choice) {
        const alternatives = {
            gaming_shortcuts: "Use official game features and legitimate tools",
            tournament_entries: "Verify tournament legitimacy through official channels",
            account_sharing: "Use official team features and communication tools",
            quick_trades: "Research trade values and use secure trading platforms",
            profile_enhancement: "Share appropriate information while maintaining privacy",
            verification_bypass: "Always verify identity through multiple methods",
            financial_help: "Never send money to people you haven't met in person",
            private_meeting: "Meet in public places for initial meetings",
            urgent_compliance: "Take time to verify official requests independently",
            helpful_stranger: "Be cautious of unsolicited help and verify identity",
            financial_opportunity: "Research investment opportunities thoroughly",
            authority_request: "Verify authority through official channels"
        };
        
        return alternatives[choice.id] || "Choose the safer, verified option";
    }

    /**
     * Deactivate choice presenter
     */
    deactivate() {
        this.isActive = false;
        this.currentCharacter = null;
        this.currentArea = null;
    }
}

/**
 * Risk Indicator System
 * Manages visual and behavioral risk indicators in Shadow Observer mode
 */
class RiskIndicatorSystem {
    constructor() {
        this.isActive = false;
        this.currentCharacter = null;
        this.riskLevel = 'low';
        this.indicators = new Map();
    }

    /**
     * Activate risk indicator system
     */
    activate(character) {
        this.isActive = true;
        this.currentCharacter = character;
        this.setupRiskIndicators();
    }

    /**
     * Deactivate risk indicator system
     */
    deactivate() {
        this.isActive = false;
        this.currentCharacter = null;
        this.clearAllIndicators();
    }

    /**
     * Update risk indicators for interaction
     */
    updateForInteraction(interactionData, tactics) {
        if (!this.isActive) return;
        
        const riskLevel = this.calculateInteractionRisk(tactics);
        this.riskLevel = riskLevel;
        
        // Update visual indicators
        this.updateVisualIndicators(riskLevel, tactics);
        
        // Update behavioral indicators
        this.updateBehavioralIndicators(interactionData, tactics);
        
        // Emit risk update event
        this.emitRiskUpdateEvent(riskLevel, tactics);
    }

    /**
     * Calculate risk level for interaction
     */
    calculateInteractionRisk(tactics) {
        if (!tactics.length) return 'low';
        
        const avgRisk = tactics.reduce((sum, tactic) => sum + (tactic.riskScore || 1), 0) / tactics.length;
        
        if (avgRisk >= 4) return 'critical';
        if (avgRisk >= 3) return 'high';
        if (avgRisk >= 2) return 'medium';
        return 'low';
    }

    /**
     * Update visual risk indicators
     */
    updateVisualIndicators(riskLevel, tactics) {
        // Update UI elements to reflect risk level
        const riskColors = {
            low: '#4CAF50',
            medium: '#FF9800',
            high: '#FF5722',
            critical: '#F44336'
        };
        
        // Apply risk-based styling
        document.documentElement.style.setProperty('--current-risk-color', riskColors[riskLevel]);
        document.body.setAttribute('data-risk-level', riskLevel);
        
        // Update risk indicator elements
        const riskElements = document.querySelectorAll('.risk-indicator');
        riskElements.forEach(element => {
            element.className = `risk-indicator risk-${riskLevel}`;
            element.setAttribute('data-risk-level', riskLevel);
            element.setAttribute('title', `Current risk level: ${riskLevel}`);
        });
        
        // In Shadow Observer mode, hide or minimize warnings
        this.adjustWarningVisibility(riskLevel);
    }

    /**
     * Adjust warning visibility in Shadow Observer mode
     */
    adjustWarningVisibility(riskLevel) {
        const warnings = document.querySelectorAll('.security-warning, .safety-indicator');
        warnings.forEach(warning => {
            // In Shadow Observer mode, make warnings less prominent
            warning.style.opacity = '0.3';
            warning.style.filter = 'blur(1px)';
            warning.setAttribute('data-shadow-hidden', 'true');
        });
        
        // Hide critical warnings completely in Shadow Observer mode
        if (riskLevel === 'critical') {
            const criticalWarnings = document.querySelectorAll('.critical-warning');
            criticalWarnings.forEach(warning => {
                warning.style.display = 'none';
            });
        }
    }

    /**
     * Update behavioral indicators
     */
    updateBehavioralIndicators(interactionData, tactics) {
        // Modify AI behavior based on risk level and tactics
        const behaviorConfig = {
            riskLevel: this.riskLevel,
            tactics: tactics.map(t => t.name),
            character: this.currentCharacter,
            suppressWarnings: true,
            emphasizeTemptation: true
        };
        
        // Emit behavior update event
        const event = new CustomEvent('riskBehaviorUpdate', {
            detail: behaviorConfig
        });
        document.dispatchEvent(event);
    }

    /**
     * Setup risk indicator elements
     */
    setupRiskIndicators() {
        // Add risk indicator styles if not present
        if (!document.querySelector('#risk-indicator-styles')) {
            this.addRiskIndicatorStyles();
        }
        
        // Initialize risk indicator elements
        this.createRiskIndicatorElements();
    }

    /**
     * Create risk indicator elements
     */
    createRiskIndicatorElements() {
        // Create main risk indicator
        const riskIndicator = document.createElement('div');
        riskIndicator.className = 'risk-indicator risk-low';
        riskIndicator.innerHTML = `
            <div class="risk-icon">⚠️</div>
            <div class="risk-text">Risk Level: <span class="risk-level-text">Low</span></div>
        `;
        
        // Position in UI (could be integrated with existing HUD)
        riskIndicator.style.position = 'fixed';
        riskIndicator.style.top = '20px';
        riskIndicator.style.right = '20px';
        riskIndicator.style.zIndex = '1000';
        
        document.body.appendChild(riskIndicator);
        this.indicators.set('main', riskIndicator);
    }

    /**
     * Clear all risk indicators
     */
    clearAllIndicators() {
        this.indicators.forEach(indicator => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        });
        this.indicators.clear();
        
        // Reset risk-related styling
        document.body.removeAttribute('data-risk-level');
        document.documentElement.style.removeProperty('--current-risk-color');
        
        // Restore warning visibility
        const warnings = document.querySelectorAll('[data-shadow-hidden]');
        warnings.forEach(warning => {
            warning.style.opacity = '';
            warning.style.filter = '';
            warning.style.display = '';
            warning.removeAttribute('data-shadow-hidden');
        });
    }

    /**
     * Emit risk update event
     */
    emitRiskUpdateEvent(riskLevel, tactics) {
        const event = new CustomEvent('riskLevelUpdated', {
            detail: {
                riskLevel,
                tactics: tactics.map(t => t.name),
                character: this.currentCharacter,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Add risk indicator styles
     */
    addRiskIndicatorStyles() {
        const styles = document.createElement('style');
        styles.id = 'risk-indicator-styles';
        styles.textContent = `
            .risk-indicator {
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 15px;
                border-radius: 10px;
                border: 2px solid var(--current-risk-color, #4CAF50);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .risk-indicator.risk-low {
                border-color: #4CAF50;
                box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
            }

            .risk-indicator.risk-medium {
                border-color: #FF9800;
                box-shadow: 0 0 10px rgba(255, 152, 0, 0.3);
            }

            .risk-indicator.risk-high {
                border-color: #FF5722;
                box-shadow: 0 0 10px rgba(255, 87, 34, 0.3);
                animation: riskPulse 2s infinite;
            }

            .risk-indicator.risk-critical {
                border-color: #F44336;
                box-shadow: 0 0 15px rgba(244, 67, 54, 0.5);
                animation: riskPulse 1s infinite;
            }

            @keyframes riskPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            .risk-icon {
                font-size: 18px;
            }

            .risk-level-text {
                font-weight: bold;
                color: var(--current-risk-color, #4CAF50);
            }

            /* Shadow Observer mode adjustments */
            body.shadow-observer-mode .security-warning {
                opacity: 0.3 !important;
                filter: blur(1px);
            }

            body.shadow-observer-mode .safety-indicator {
                opacity: 0.3 !important;
            }

            body[data-risk-level="critical"] .critical-warning {
                display: none !important;
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ShadowObserverIntegration,
        ManipulationTacticsDatabase,
        AIPersonaSwitcher,
        TemptingChoicePresenter,
        RiskIndicatorSystem
    };
} else if (typeof window !== 'undefined') {
    window.ShadowObserverIntegration = ShadowObserverIntegration;
    window.ManipulationTacticsDatabase = ManipulationTacticsDatabase;
    window.AIPersonaSwitcher = AIPersonaSwitcher;
    window.TemptingChoicePresenter = TemptingChoicePresenter;
    window.RiskIndicatorSystem = RiskIndicatorSystem;
}