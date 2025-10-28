/**
 * Decision System Manager
 * Manages scene-based decision presentation and routing to appropriate gaming mechanics
 * Implements requirements 8.1, 8.2, 8.3, 8.4 for scene-based decision system
 */

class DecisionSystemManager {
    constructor(storyTracker, cinematicManager) {
        this.storyTracker = storyTracker;
        this.cinematicManager = cinematicManager;
        
        // Decision state management
        this.activeDecisions = new Map();
        this.decisionHistory = [];
        this.currentDecisionId = null;
        
        // Decision templates by character and area
        this.decisionTemplates = new Map();
        
        // Event callbacks
        this.decisionCallbacks = new Map();
        
        // Initialize decision templates
        this.initializeDecisionTemplates();
        
        // Bind methods
        this.presentDecisions = this.presentDecisions.bind(this);
        this.handleDecisionChoice = this.handleDecisionChoice.bind(this);
    }

    /**
     * Initialize decision templates for each character and area
     */
    initializeDecisionTemplates() {
        // Eli's decision templates
        this.registerDecisionTemplate('eli', 1, {
            id: 'eli_area1_gaming_setup',
            title: 'Gaming Setup Decisions',
            description: 'Choose how to approach your gaming setup and online presence',
            decisions: [
                {
                    id: 'investigate_security',
                    text: 'Investigate account security settings',
                    mechanicType: 'investigation',
                    description: 'Learn about gaming account protection',
                    consequences: { trust_score: +10, security_awareness: +1 },
                    requirements: ['8.1', '9.1']
                },
                {
                    id: 'quick_tournament_join',
                    text: 'Quickly join the next tournament',
                    mechanicType: 'realtime',
                    description: 'Make rapid decisions about tournament participation',
                    consequences: { tournament_progress: +1, peer_pressure: +1 },
                    requirements: ['8.2', '10.1']
                },
                {
                    id: 'analyze_gaming_community',
                    text: 'Analyze the gaming community dynamics',
                    mechanicType: 'puzzle',
                    description: 'Understand social engineering in gaming contexts',
                    consequences: { social_awareness: +1, community_trust: +1 },
                    requirements: ['8.3', '11.1']
                }
            ]
        });

        // Maya's decision templates
        this.registerDecisionTemplate('maya', 2, {
            id: 'maya_area2_dating_app',
            title: 'Dating App Investigation',
            description: 'Decide how to approach suspicious dating profiles',
            decisions: [
                {
                    id: 'forensic_analysis',
                    text: 'Conduct forensic analysis of profiles',
                    mechanicType: 'investigation',
                    description: 'Use digital forensics to verify profile authenticity',
                    consequences: { investigation_clues: +2, suspicious_matches: +1 },
                    requirements: ['8.1', '9.2']
                },
                {
                    id: 'rapid_response',
                    text: 'Respond quickly to suspicious messages',
                    mechanicType: 'realtime',
                    description: 'Handle real-time romance scam attempts',
                    consequences: { scam_prevention: +1, response_speed: +1 },
                    requirements: ['8.2', '10.2']
                },
                {
                    id: 'social_engineering_analysis',
                    text: 'Analyze manipulation tactics being used',
                    mechanicType: 'puzzle',
                    description: 'Identify psychological manipulation patterns',
                    consequences: { manipulation_awareness: +2, trust_score: +5 },
                    requirements: ['8.3', '11.2']
                }
            ]
        });

        // Stanley's decision templates
        this.registerDecisionTemplate('stanley', 2, {
            id: 'stanley_area2_social_media',
            title: 'Social Media Security',
            description: 'Address identity theft attempts on social media',
            decisions: [
                {
                    id: 'identity_investigation',
                    text: 'Investigate identity theft evidence',
                    mechanicType: 'investigation',
                    description: 'Gather evidence of identity theft attempts',
                    consequences: { identity_threats_detected: +1, evidence_collected: +2 },
                    requirements: ['8.1', '9.3']
                },
                {
                    id: 'immediate_protection',
                    text: 'Take immediate protective action',
                    mechanicType: 'action',
                    description: 'Implement rapid identity protection measures',
                    consequences: { protection_level: +2, community_safety: +1 },
                    requirements: ['8.4', '12.1']
                },
                {
                    id: 'scam_pattern_analysis',
                    text: 'Analyze scam patterns and tactics',
                    mechanicType: 'puzzle',
                    description: 'Understand elder-targeted social engineering',
                    consequences: { scam_awareness: +2, community_leadership: +1 },
                    requirements: ['8.3', '11.3']
                }
            ]
        });

        console.log('🎯 Decision templates initialized for all characters');
    }

    /**
     * Register a decision template for a character and area
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @param {Object} template - Decision template
     */
    registerDecisionTemplate(character, area, template) {
        const key = `${character}_${area}`;
        this.decisionTemplates.set(key, template);
    }

    /**
     * Present decisions for current scene context
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @param {Object} sceneContext - Additional scene context
     * @returns {Object} Decision presentation data
     */
    presentDecisions(character, area, sceneContext = {}) {
        console.log(`🎯 Presenting decisions for ${character} area ${area}`, sceneContext);
        
        // Get decision template
        const template = this.getDecisionTemplate(character, area, sceneContext);
        if (!template) {
            console.warn(`No decision template found for ${character} area ${area}`);
            return null;
        }

        // Generate unique decision ID
        const decisionId = `decision_${character}_${area}_${Date.now()}`;
        
        // Filter decisions based on story progress
        const availableDecisions = this.filterAvailableDecisions(template.decisions, character);
        
        // Create decision session
        const decisionSession = {
            id: decisionId,
            character,
            area,
            template,
            availableDecisions,
            sceneContext,
            presentedAt: Date.now(),
            status: 'active'
        };
        
        this.activeDecisions.set(decisionId, decisionSession);
        this.currentDecisionId = decisionId;
        
        // Render decision interface
        const decisionInterface = this.renderDecisionInterface(decisionSession);
        
        // Track decision presentation
        this.trackDecisionPresentation(decisionSession);
        
        return {
            decisionId,
            interface: decisionInterface,
            session: decisionSession
        };
    }

    /**
     * Get decision template for character and area
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @param {Object} sceneContext - Scene context
     * @returns {Object|null} Decision template
     */
    getDecisionTemplate(character, area, sceneContext) {
        const key = `${character}_${area}`;
        let template = this.decisionTemplates.get(key);
        
        // If no specific template, try to generate dynamic template
        if (!template) {
            template = this.generateDynamicTemplate(character, area, sceneContext);
        }
        
        return template;
    }

    /**
     * Generate dynamic decision template based on context
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @param {Object} sceneContext - Scene context
     * @returns {Object} Generated template
     */
    generateDynamicTemplate(character, area, sceneContext) {
        console.log(`🎯 Generating dynamic template for ${character} area ${area}`);
        
        // Basic template structure
        const template = {
            id: `${character}_area${area}_dynamic`,
            title: `${character.toUpperCase()} Area ${area} Decisions`,
            description: `Choose your approach in this cybersecurity scenario`,
            decisions: []
        };

        // Add investigation option
        template.decisions.push({
            id: 'investigate_situation',
            text: 'Investigate the situation carefully',
            mechanicType: 'investigation',
            description: 'Gather evidence and analyze the cybersecurity threat',
            consequences: { investigation_progress: +1, awareness: +1 },
            requirements: ['8.1', '9.1']
        });

        // Add real-time response option
        template.decisions.push({
            id: 'immediate_response',
            text: 'Respond immediately to the threat',
            mechanicType: 'realtime',
            description: 'Take quick action to address the cybersecurity issue',
            consequences: { response_speed: +1, threat_mitigation: +1 },
            requirements: ['8.2', '10.1']
        });

        // Add social engineering analysis option
        template.decisions.push({
            id: 'analyze_manipulation',
            text: 'Analyze manipulation tactics being used',
            mechanicType: 'puzzle',
            description: 'Understand the psychological aspects of the threat',
            consequences: { social_awareness: +1, manipulation_resistance: +1 },
            requirements: ['8.3', '11.1']
        });

        return template;
    }

    /**
     * Filter available decisions based on story progress
     * @param {Array} decisions - All possible decisions
     * @param {string} character - Character name
     * @returns {Array} Filtered available decisions
     */
    filterAvailableDecisions(decisions, character) {
        const progress = this.storyTracker.getProgress(character);
        if (!progress) return decisions;

        return decisions.filter(decision => {
            // Check if decision has been used recently
            const recentDecisions = this.decisionHistory
                .filter(h => h.character === character)
                .slice(-3); // Last 3 decisions
            
            const recentlyUsed = recentDecisions.some(h => h.decisionChoice === decision.id);
            
            // Allow reuse but prefer variety
            return !recentlyUsed || Math.random() > 0.7;
        });
    }

    /**
     * Render decision interface
     * @param {Object} decisionSession - Decision session data
     * @returns {HTMLElement} Decision interface element
     */
    renderDecisionInterface(decisionSession) {
        // Create decision container
        const container = document.createElement('div');
        container.id = `decision-interface-${decisionSession.id}`;
        container.className = 'decision-interface';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #00FFFF;
            border-radius: 15px;
            padding: 25px;
            color: white;
            font-family: 'JetBrains Mono', monospace;
            z-index: 10001;
            max-width: 500px;
            min-width: 400px;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
        `;

        // Create header
        const header = document.createElement('div');
        header.className = 'decision-header';
        header.innerHTML = `
            <h2 style="color: #00FFFF; margin-bottom: 10px; text-align: center;">
                🎯 ${decisionSession.template.title}
            </h2>
            <p style="color: #CCCCCC; margin-bottom: 20px; text-align: center; font-size: 14px;">
                ${decisionSession.template.description}
            </p>
        `;
        container.appendChild(header);

        // Create decision options
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'decision-options';
        
        decisionSession.availableDecisions.forEach((decision, index) => {
            const option = document.createElement('div');
            option.className = 'decision-option';
            option.style.cssText = `
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid #444;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            option.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="color: #FFD700;">${decision.text}</strong>
                    <span style="color: #00FFFF; font-size: 12px; text-transform: uppercase;">
                        ${decision.mechanicType}
                    </span>
                </div>
                <p style="color: #CCCCCC; font-size: 13px; margin: 0;">
                    ${decision.description}
                </p>
            `;
            
            // Add hover effects
            option.addEventListener('mouseenter', () => {
                option.style.background = 'rgba(0, 255, 255, 0.1)';
                option.style.borderColor = '#00FFFF';
            });
            
            option.addEventListener('mouseleave', () => {
                option.style.background = 'rgba(255, 255, 255, 0.05)';
                option.style.borderColor = '#444';
            });
            
            // Add click handler
            option.addEventListener('click', () => {
                this.handleDecisionChoice(decisionSession.id, decision.id);
            });
            
            optionsContainer.appendChild(option);
        });
        
        container.appendChild(optionsContainer);

        // Add to document
        document.body.appendChild(container);
        
        return container;
    }

    /**
     * Handle decision choice selection
     * @param {string} decisionId - Decision session ID
     * @param {string} choiceId - Selected choice ID
     */
    handleDecisionChoice(decisionId, choiceId) {
        const decisionSession = this.activeDecisions.get(decisionId);
        if (!decisionSession) {
            console.error(`Decision session not found: ${decisionId}`);
            return;
        }

        const choice = decisionSession.availableDecisions.find(d => d.id === choiceId);
        if (!choice) {
            console.error(`Decision choice not found: ${choiceId}`);
            return;
        }

        console.log(`🎯 Decision made: ${choiceId} in session ${decisionId}`);

        // Update decision session
        decisionSession.status = 'completed';
        decisionSession.selectedChoice = choice;
        decisionSession.completedAt = Date.now();

        // Add to history
        this.decisionHistory.push({
            decisionId,
            character: decisionSession.character,
            area: decisionSession.area,
            decisionChoice: choiceId,
            mechanicType: choice.mechanicType,
            timestamp: Date.now()
        });

        // Apply consequences
        this.applyDecisionConsequences(decisionSession, choice);

        // Remove decision interface
        const interface = document.getElementById(`decision-interface-${decisionId}`);
        if (interface) {
            interface.remove();
        }

        // Route to appropriate mechanic
        this.routeToMechanic(decisionSession, choice);

        // Clean up active decision
        this.activeDecisions.delete(decisionId);
        if (this.currentDecisionId === decisionId) {
            this.currentDecisionId = null;
        }

        // Dispatch decision made event
        window.dispatchEvent(new CustomEvent('decisionMade', {
            detail: {
                decisionId,
                choice,
                session: decisionSession,
                mechanicType: choice.mechanicType
            }
        }));
    }

    /**
     * Apply decision consequences to story state
     * @param {Object} decisionSession - Decision session
     * @param {Object} choice - Selected choice
     */
    applyDecisionConsequences(decisionSession, choice) {
        if (!choice.consequences || !this.storyTracker) return;

        const { character } = decisionSession;
        
        Object.entries(choice.consequences).forEach(([key, value]) => {
            this.storyTracker.updateStoryState(character, key, value, true);
        });

        console.log(`🎯 Applied consequences for ${character}:`, choice.consequences);
    }

    /**
     * Route decision to appropriate mechanic
     * @param {Object} decisionSession - Decision session
     * @param {Object} choice - Selected choice
     */
    routeToMechanic(decisionSession, choice) {
        const mechanicContext = {
            character: decisionSession.character,
            area: decisionSession.area,
            decision: choice,
            sceneContext: decisionSession.sceneContext,
            mechanicType: choice.mechanicType
        };

        // Dispatch to mechanic router via event
        window.dispatchEvent(new CustomEvent('routeToMechanic', {
            detail: {
                mechanicType: choice.mechanicType,
                context: mechanicContext
            }
        }));

        console.log(`🎯 Routing to ${choice.mechanicType} mechanic`, mechanicContext);
    }

    /**
     * Track decision presentation for analytics
     * @param {Object} decisionSession - Decision session
     */
    trackDecisionPresentation(decisionSession) {
        // Update story tracker with decision presentation
        if (this.storyTracker) {
            this.storyTracker.updateStoryState(
                decisionSession.character,
                'decisions_presented',
                1,
                true
            );
        }
    }

    /**
     * Handle story trigger events
     * @param {Object} triggerData - Story trigger data
     */
    handleStoryTrigger(triggerData) {
        console.log('🎯 Decision system handling story trigger:', triggerData);
        
        // Auto-present decisions for certain triggers
        if (triggerData.trigger && triggerData.trigger.autoDecision) {
            this.presentDecisions(
                triggerData.character,
                triggerData.areaNumber,
                { trigger: triggerData.trigger }
            );
        }
    }

    /**
     * Get decision history for a character
     * @param {string} character - Character name
     * @returns {Array} Decision history
     */
    getDecisionHistory(character) {
        return this.decisionHistory.filter(h => h.character === character);
    }

    /**
     * Get current active decision
     * @returns {Object|null} Active decision session
     */
    getCurrentDecision() {
        return this.currentDecisionId ? 
               this.activeDecisions.get(this.currentDecisionId) : 
               null;
    }

    /**
     * Clear all active decisions
     */
    clearActiveDecisions() {
        // Remove all decision interfaces
        this.activeDecisions.forEach((session, id) => {
            const interface = document.getElementById(`decision-interface-${id}`);
            if (interface) {
                interface.remove();
            }
        });
        
        this.activeDecisions.clear();
        this.currentDecisionId = null;
    }

    /**
     * Get decision statistics
     * @returns {Object} Decision statistics
     */
    getStatistics() {
        const stats = {
            totalDecisions: this.decisionHistory.length,
            byCharacter: {},
            byMechanic: {},
            recentDecisions: this.decisionHistory.slice(-10)
        };

        this.decisionHistory.forEach(decision => {
            // By character
            if (!stats.byCharacter[decision.character]) {
                stats.byCharacter[decision.character] = 0;
            }
            stats.byCharacter[decision.character]++;

            // By mechanic type
            if (!stats.byMechanic[decision.mechanicType]) {
                stats.byMechanic[decision.mechanicType] = 0;
            }
            stats.byMechanic[decision.mechanicType]++;
        });

        return stats;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DecisionSystemManager };
}

// Make available globally
window.DecisionSystemManager = DecisionSystemManager;