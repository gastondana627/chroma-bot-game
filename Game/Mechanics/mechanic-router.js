/**
 * Mechanic Router
 * Routes decisions to appropriate gaming mechanics and manages mechanic activation
 * Integrates with the gaming mechanics engine to activate the correct gameplay systems
 */

class MechanicRouter {
    constructor(gamingEngine) {
        this.gamingEngine = gamingEngine;
        
        // Routing configuration
        this.routingRules = new Map();
        this.mechanicPriorities = new Map();
        this.activeRoutes = new Map();
        
        // Performance tracking
        this.routingStats = {
            totalRoutes: 0,
            successfulRoutes: 0,
            failedRoutes: 0,
            routesByMechanic: {}
        };
        
        // Initialize routing rules
        this.initializeRoutingRules();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Bind methods
        this.routeDecision = this.routeDecision.bind(this);
        this.routeToMechanic = this.routeToMechanic.bind(this);
    }

    /**
     * Initialize routing rules for different mechanic types
     */
    initializeRoutingRules() {
        // Investigation mechanic routing rules
        this.routingRules.set('investigation', {
            mechanicId: 'investigation',
            priority: 1,
            conditions: {
                requiresEvidence: true,
                timeConstraint: 'none',
                complexity: ['moderate', 'complex']
            },
            contextMapping: {
                eli: ['account_security', 'trade_verification', 'tournament_legitimacy'],
                maya: ['profile_verification', 'communication_analysis', 'evidence_compilation'],
                stanley: ['identity_verification', 'document_analysis', 'scam_detection']
            }
        });

        // Real-time decision mechanic routing rules
        this.routingRules.set('realtime', {
            mechanicId: 'realtime',
            priority: 2,
            conditions: {
                requiresSpeed: true,
                timeConstraint: 'urgent',
                complexity: ['simple', 'moderate']
            },
            contextMapping: {
                eli: ['tournament_decisions', 'peer_pressure_response', 'account_protection'],
                maya: ['scam_response', 'catfish_detection', 'emergency_action'],
                stanley: ['fraud_prevention', 'identity_protection', 'community_warning']
            }
        });

        // Social engineering puzzle mechanic routing rules
        this.routingRules.set('puzzle', {
            mechanicId: 'puzzle',
            priority: 3,
            conditions: {
                requiresAnalysis: true,
                timeConstraint: 'flexible',
                complexity: ['moderate', 'complex']
            },
            contextMapping: {
                eli: ['gaming_manipulation', 'community_pressure', 'exploitation_recognition'],
                maya: ['romance_manipulation', 'trust_exploitation', 'emotional_tactics'],
                stanley: ['elder_targeting', 'authority_impersonation', 'companionship_scams']
            }
        });

        // Action sequence mechanic routing rules
        this.routingRules.set('action', {
            mechanicId: 'action',
            priority: 4,
            conditions: {
                requiresAction: true,
                timeConstraint: 'immediate',
                complexity: ['simple', 'moderate']
            },
            contextMapping: {
                eli: ['account_security_response', 'tournament_safety', 'competitive_integrity'],
                maya: ['evidence_compilation', 'confrontation_prep', 'victim_support'],
                stanley: ['community_protection', 'scam_reporting', 'network_building']
            }
        });

        // Set mechanic priorities
        this.mechanicPriorities.set('realtime', 1);    // Highest priority for urgent situations
        this.mechanicPriorities.set('action', 2);      // Second priority for immediate actions
        this.mechanicPriorities.set('investigation', 3); // Third priority for analysis
        this.mechanicPriorities.set('puzzle', 4);      // Lowest priority for learning

        console.log('🔀 Mechanic routing rules initialized');
    }

    /**
     * Set up event listeners for routing
     */
    setupEventListeners() {
        // Listen for route to mechanic events
        window.addEventListener('routeToMechanic', (event) => {
            const { mechanicType, context } = event.detail;
            this.routeToMechanic(mechanicType, context);
        });

        // Listen for decision made events
        window.addEventListener('decisionMade', (event) => {
            this.routeDecision(event.detail);
        });

        // Listen for mechanic completion events
        window.addEventListener('mechanicCompleted', (event) => {
            this.handleMechanicCompletion(event.detail);
        });

        console.log('🔀 Mechanic router event listeners set up');
    }

    /**
     * Route a decision to the appropriate mechanic
     * @param {Object} decisionData - Decision event data
     * @returns {Promise<boolean>} Success status
     */
    async routeDecision(decisionData) {
        console.log('🔀 Routing decision:', decisionData);
        
        this.routingStats.totalRoutes++;
        
        try {
            const { choice, session } = decisionData;
            const mechanicType = choice.mechanicType;
            
            // Validate mechanic type
            if (!this.routingRules.has(mechanicType)) {
                throw new Error(`Unknown mechanic type: ${mechanicType}`);
            }
            
            // Create routing context
            const routingContext = this.createRoutingContext(session, choice);
            
            // Validate routing conditions
            if (!this.validateRoutingConditions(mechanicType, routingContext)) {
                throw new Error(`Routing conditions not met for ${mechanicType}`);
            }
            
            // Route to mechanic
            const success = await this.routeToMechanic(mechanicType, routingContext);
            
            if (success) {
                this.routingStats.successfulRoutes++;
                this.updateMechanicStats(mechanicType);
            } else {
                this.routingStats.failedRoutes++;
            }
            
            return success;
        } catch (error) {
            console.error('🔀 Routing failed:', error);
            this.routingStats.failedRoutes++;
            return false;
        }
    }

    /**
     * Route to a specific mechanic type
     * @param {string} mechanicType - Type of mechanic to activate
     * @param {Object} context - Routing context
     * @returns {Promise<boolean>} Success status
     */
    async routeToMechanic(mechanicType, context) {
        console.log(`🔀 Routing to ${mechanicType} mechanic`, context);
        
        try {
            // Get routing rule
            const rule = this.routingRules.get(mechanicType);
            if (!rule) {
                throw new Error(`No routing rule for mechanic: ${mechanicType}`);
            }
            
            // Enhance context with routing information
            const enhancedContext = this.enhanceContext(context, rule);
            
            // Check if gaming engine is available
            if (!this.gamingEngine) {
                throw new Error('Gaming engine not available');
            }
            
            // Activate the mechanic through the gaming engine
            const success = await this.gamingEngine.activateMechanic(rule.mechanicId, enhancedContext);
            
            if (success) {
                // Track active route
                const routeId = `route_${mechanicType}_${Date.now()}`;
                this.activeRoutes.set(routeId, {
                    mechanicType,
                    context: enhancedContext,
                    startTime: Date.now(),
                    status: 'active'
                });
                
                console.log(`🔀 Successfully routed to ${mechanicType} mechanic`);
            }
            
            return success;
        } catch (error) {
            console.error(`🔀 Failed to route to ${mechanicType} mechanic:`, error);
            return false;
        }
    }

    /**
     * Create routing context from decision session and choice
     * @param {Object} session - Decision session
     * @param {Object} choice - Selected choice
     * @returns {Object} Routing context
     */
    createRoutingContext(session, choice) {
        return {
            // Core context
            character: session.character,
            area: session.area,
            mechanicType: choice.mechanicType,
            
            // Decision context
            decision: choice,
            decisionId: session.id,
            sceneContext: session.sceneContext,
            
            // Routing metadata
            routedAt: Date.now(),
            requirements: choice.requirements || [],
            consequences: choice.consequences || {},
            
            // Character-specific context
            characterContext: this.getCharacterContext(session.character, choice),
            
            // Story context
            storyContext: this.getStoryContext(session.character, session.area)
        };
    }

    /**
     * Get character-specific context for routing
     * @param {string} character - Character name
     * @param {Object} choice - Selected choice
     * @returns {Object} Character context
     */
    getCharacterContext(character, choice) {
        const characterContexts = {
            eli: {
                domain: 'gaming',
                specialization: 'competitive_gaming',
                threats: ['gaming_scams', 'peer_pressure', 'account_takeover'],
                tools: ['trade_verification', 'account_security', 'tournament_analysis']
            },
            maya: {
                domain: 'dating_social',
                specialization: 'digital_investigation',
                threats: ['romance_scams', 'catfishing', 'identity_theft'],
                tools: ['profile_verification', 'reverse_image_search', 'communication_analysis']
            },
            stanley: {
                domain: 'elder_social',
                specialization: 'community_protection',
                threats: ['elder_fraud', 'identity_theft', 'companionship_scams'],
                tools: ['identity_verification', 'document_analysis', 'scam_detection']
            }
        };

        return characterContexts[character] || {};
    }

    /**
     * Get story context for routing
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @returns {Object} Story context
     */
    getStoryContext(character, area) {
        if (!this.gamingEngine || !this.gamingEngine.storyTracker) {
            return {};
        }

        const progress = this.gamingEngine.storyTracker.getProgress(character);
        if (!progress) return {};

        return {
            currentArea: progress.currentArea,
            visitedAreas: progress.visitedAreas,
            completedTriggers: progress.completedTriggers,
            storyState: progress.storyState
        };
    }

    /**
     * Enhance context with routing rule information
     * @param {Object} context - Base context
     * @param {Object} rule - Routing rule
     * @returns {Object} Enhanced context
     */
    enhanceContext(context, rule) {
        const enhanced = { ...context };
        
        // Add routing rule information
        enhanced.routingRule = rule;
        enhanced.priority = this.mechanicPriorities.get(rule.mechanicId) || 999;
        
        // Add character-specific mapping
        const characterMapping = rule.contextMapping[context.character];
        if (characterMapping) {
            enhanced.characterSpecificContext = characterMapping;
        }
        
        // Add mechanic-specific configuration
        enhanced.mechanicConfig = this.getMechanicConfig(rule.mechanicId, context);
        
        return enhanced;
    }

    /**
     * Get mechanic-specific configuration
     * @param {string} mechanicId - Mechanic identifier
     * @param {Object} context - Routing context
     * @returns {Object} Mechanic configuration
     */
    getMechanicConfig(mechanicId, context) {
        const configs = {
            investigation: {
                enableForensics: true,
                evidenceTypes: ['digital', 'behavioral', 'technical'],
                analysisTools: this.getInvestigationTools(context.character),
                timeLimit: null
            },
            realtime: {
                urgencyLevel: this.calculateUrgencyLevel(context),
                timeLimit: this.calculateTimeLimit(context),
                threatLevel: this.assessThreatLevel(context),
                responseOptions: this.getResponseOptions(context.character)
            },
            puzzle: {
                difficultyLevel: this.calculateDifficulty(context),
                tacticTypes: this.getPuzzleTactics(context.character),
                educationalFocus: this.getEducationalFocus(context),
                hintsEnabled: true
            },
            action: {
                actionType: this.determineActionType(context),
                tools: this.getActionTools(context.character),
                timeConstraint: 'immediate',
                successCriteria: this.getSuccessCriteria(context)
            }
        };

        return configs[mechanicId] || {};
    }

    /**
     * Validate routing conditions
     * @param {string} mechanicType - Mechanic type
     * @param {Object} context - Routing context
     * @returns {boolean} Whether conditions are met
     */
    validateRoutingConditions(mechanicType, context) {
        const rule = this.routingRules.get(mechanicType);
        if (!rule) return false;

        const conditions = rule.conditions;
        
        // Check character-specific conditions
        if (rule.contextMapping && !rule.contextMapping[context.character]) {
            console.warn(`No context mapping for ${context.character} in ${mechanicType}`);
            return false;
        }
        
        // Check complexity requirements
        if (conditions.complexity && context.decision) {
            const decisionComplexity = context.decision.complexity || 'moderate';
            if (!conditions.complexity.includes(decisionComplexity)) {
                console.warn(`Complexity mismatch: ${decisionComplexity} not in ${conditions.complexity}`);
                return false;
            }
        }
        
        return true;
    }

    /**
     * Handle mechanic completion
     * @param {Object} completionData - Completion data
     */
    handleMechanicCompletion(completionData) {
        console.log('🔀 Handling mechanic completion:', completionData);
        
        // Find and update active route
        for (const [routeId, route] of this.activeRoutes.entries()) {
            if (route.mechanicType === completionData.mechanicType) {
                route.status = 'completed';
                route.endTime = Date.now();
                route.duration = route.endTime - route.startTime;
                
                // Clean up completed route after a delay
                setTimeout(() => {
                    this.activeRoutes.delete(routeId);
                }, 5000);
                
                break;
            }
        }
    }

    /**
     * Update mechanic statistics
     * @param {string} mechanicType - Mechanic type
     */
    updateMechanicStats(mechanicType) {
        if (!this.routingStats.routesByMechanic[mechanicType]) {
            this.routingStats.routesByMechanic[mechanicType] = 0;
        }
        this.routingStats.routesByMechanic[mechanicType]++;
    }

    // Helper methods for mechanic configuration
    getInvestigationTools(character) {
        const tools = {
            eli: ['account_analyzer', 'trade_verifier', 'tournament_checker'],
            maya: ['profile_verifier', 'image_search', 'communication_analyzer'],
            stanley: ['identity_checker', 'document_verifier', 'scam_detector']
        };
        return tools[character] || [];
    }

    calculateUrgencyLevel(context) {
        if (context.sceneContext && context.sceneContext.urgency) {
            return context.sceneContext.urgency;
        }
        return 'medium';
    }

    calculateTimeLimit(context) {
        const urgencyLimits = {
            low: 120,      // 2 minutes
            medium: 60,    // 1 minute
            high: 30,      // 30 seconds
            critical: 15   // 15 seconds
        };
        const urgency = this.calculateUrgencyLevel(context);
        return urgencyLimits[urgency] || 60;
    }

    assessThreatLevel(context) {
        // Assess based on story state and area
        if (context.area >= 5) return 'high';
        if (context.area >= 3) return 'medium';
        return 'low';
    }

    getResponseOptions(character) {
        const options = {
            eli: ['secure_account', 'report_scam', 'seek_help', 'ignore_threat'],
            maya: ['gather_evidence', 'confront_scammer', 'report_authorities', 'warn_others'],
            stanley: ['protect_identity', 'alert_community', 'contact_support', 'document_incident']
        };
        return options[character] || [];
    }

    calculateDifficulty(context) {
        // Base difficulty on area and story progress
        if (context.area >= 5) return 'advanced';
        if (context.area >= 3) return 'intermediate';
        return 'beginner';
    }

    getPuzzleTactics(character) {
        const tactics = {
            eli: ['peer_pressure', 'gaming_exploitation', 'competitive_manipulation'],
            maya: ['romance_scam', 'trust_exploitation', 'emotional_manipulation'],
            stanley: ['elder_targeting', 'authority_impersonation', 'companionship_scam']
        };
        return tactics[character] || [];
    }

    getEducationalFocus(context) {
        return `${context.character}_cybersecurity_${context.mechanicType}`;
    }

    determineActionType(context) {
        if (context.decision && context.decision.id.includes('protection')) return 'protection';
        if (context.decision && context.decision.id.includes('response')) return 'response';
        return 'general';
    }

    getActionTools(character) {
        const tools = {
            eli: ['account_security_tools', 'tournament_safety_protocols'],
            maya: ['evidence_compiler', 'confrontation_planner'],
            stanley: ['community_alert_system', 'scam_reporter']
        };
        return tools[character] || [];
    }

    getSuccessCriteria(context) {
        return {
            timeLimit: this.calculateTimeLimit(context),
            accuracyRequired: 0.8,
            educationalGoals: [`${context.character}_${context.mechanicType}_mastery`]
        };
    }

    /**
     * Get routing statistics
     * @returns {Object} Routing statistics
     */
    getStatistics() {
        return {
            ...this.routingStats,
            activeRoutes: this.activeRoutes.size,
            successRate: this.routingStats.totalRoutes > 0 ? 
                        (this.routingStats.successfulRoutes / this.routingStats.totalRoutes) : 0
        };
    }

    /**
     * Get active routes
     * @returns {Array} Active routes
     */
    getActiveRoutes() {
        return Array.from(this.activeRoutes.values());
    }

    /**
     * Clear all active routes
     */
    clearActiveRoutes() {
        this.activeRoutes.clear();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MechanicRouter };
}

// Make available globally
window.MechanicRouter = MechanicRouter;