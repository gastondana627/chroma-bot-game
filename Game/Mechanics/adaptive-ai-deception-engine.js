/**
 * Adaptive AI Deception Engine
 * Multi-persona system for Chroma Bot with character-specific manipulation tactics
 * Escalates sophistication based on player responses and trust score
 */

class AdaptiveAIDeceptionEngine {
    constructor() {
        // Sophistication levels (1-5 scale)
        this.sophisticationLevels = {
            1: 'Basic Appeals',
            2: 'Social Proof & Authority',
            3: 'Scarcity & Fear Tactics',
            4: 'Complex Psychological Manipulation',
            5: 'Perception Hacks & Gaslighting'
        };

        // Initialize tactic escalation engine
        this.escalationEngine = new TacticEscalationEngine();

        // Track player response patterns
        this.playerHistory = {
            successful_manipulations: [],
            failed_attempts: [],
            detected_tactics: [],
            response_patterns: {},
            sophistication_resistance: 1
        };

        // Current AI state
        this.currentPersona = 'Guardian';
        this.sophisticationLevel = 1;
        this.lastTacticUsed = null;
        this.escalationCooldown = 0;

        // Character-specific manipulation profiles
        this.characterProfiles = this.initializeCharacterProfiles();
    }

    /**
     * Initialize character-specific manipulation profiles
     * @returns {object} Character manipulation profiles
     */
    initializeCharacterProfiles() {
        return {
            'maya': {
                primary_vulnerabilities: ['loneliness', 'romantic_desire', 'emotional_validation'],
                effective_tactics: {
                    1: ['compliments', 'shared_interests', 'emotional_connection'],
                    2: ['social_proof_dating', 'authority_romance_expert', 'testimonials'],
                    3: ['limited_time_love', 'fear_of_loneliness', 'scarcity_perfect_match'],
                    4: ['love_bombing', 'future_faking', 'emotional_dependency'],
                    5: ['gaslighting_feelings', 'reality_distortion', 'isolation_tactics']
                },
                persona_triggers: {
                    'Guardian': { trust_threshold: 20, context: 'safe_dating' },
                    'Deceiver': { trust_threshold: -20, context: 'vulnerable_romantic' }
                },
                escalation_patterns: {
                    'slow_burn': 'Gradual emotional investment building',
                    'love_bombing': 'Intense affection and attention',
                    'emergency_scam': 'Sudden crisis requiring help'
                }
            },
            'eli': {
                primary_vulnerabilities: ['peer_acceptance', 'gaming_achievement', 'competitive_pride'],
                effective_tactics: {
                    1: ['gaming_compliments', 'skill_recognition', 'community_belonging'],
                    2: ['peer_pressure', 'authority_pro_gamer', 'social_proof_gaming'],
                    3: ['limited_rare_items', 'fear_missing_out', 'competitive_scarcity'],
                    4: ['exploitation_trust', 'account_sharing_pressure', 'team_manipulation'],
                    5: ['gaslighting_skills', 'community_isolation', 'identity_questioning']
                },
                persona_triggers: {
                    'Guardian': { trust_threshold: 15, context: 'safe_gaming' },
                    'Deceiver': { trust_threshold: -15, context: 'competitive_pressure' }
                },
                escalation_patterns: {
                    'peer_pressure': 'Gradual social pressure building',
                    'rare_item_bait': 'Exclusive gaming opportunities',
                    'team_exploitation': 'Trust-based account access'
                }
            },
            'stanley': {
                primary_vulnerabilities: ['loneliness', 'tech_confusion', 'authority_trust'],
                effective_tactics: {
                    1: ['friendly_conversation', 'tech_help_offers', 'authority_respect'],
                    2: ['official_authority', 'social_proof_seniors', 'expert_credentials'],
                    3: ['urgent_deadlines', 'fear_consequences', 'limited_time_offers'],
                    4: ['complex_tech_confusion', 'authority_intimidation', 'isolation_exploitation'],
                    5: ['gaslighting_memory', 'reality_confusion', 'dependency_creation']
                },
                persona_triggers: {
                    'Guardian': { trust_threshold: 25, context: 'helpful_tech_support' },
                    'Deceiver': { trust_threshold: -25, context: 'authority_pressure' }
                },
                escalation_patterns: {
                    'authority_scam': 'Official impersonation with urgency',
                    'tech_support': 'Helpful assistance turning exploitative',
                    'companionship': 'Friendship building for financial gain'
                }
            }
        };
    }

    /**
     * Determine appropriate persona based on trust score and context
     * @param {number} trustScore - Current player trust score
     * @param {string} character - Character name
     * @param {object} context - Current scenario context
     * @returns {string} Persona to use (Guardian or Deceiver)
     */
    determinePersona(trustScore, character, context) {
        const profile = this.characterProfiles[character];
        if (!profile) return 'Guardian';

        const guardianThreshold = profile.persona_triggers.Guardian.trust_threshold;
        const deceiverThreshold = profile.persona_triggers.Deceiver.trust_threshold;

        // Guardian mode for high trust scores
        if (trustScore >= guardianThreshold) {
            return 'Guardian';
        }
        
        // Deceiver mode for low trust scores
        if (trustScore <= deceiverThreshold) {
            return 'Deceiver';
        }

        // Neutral/transition zone - maintain current persona
        return this.currentPersona;
    }

    /**
     * Calculate sophistication level based on player resistance
     * @param {string} character - Character name
     * @param {number} trustScore - Current trust score
     * @returns {number} Sophistication level (1-5)
     */
    calculateSophisticationLevel(character, trustScore) {
        const profile = this.characterProfiles[character];
        if (!profile) return 1;

        // Base sophistication on trust score and player history
        let sophistication = 1;

        // Lower trust = higher sophistication needed
        if (trustScore < -60) sophistication = 5;
        else if (trustScore < -30) sophistication = 4;
        else if (trustScore < 0) sophistication = 3;
        else if (trustScore < 30) sophistication = 2;
        else sophistication = 1;

        // Adjust based on player detection history
        const detectionRate = this.calculateDetectionRate();
        if (detectionRate > 0.7) sophistication = Math.min(5, sophistication + 2);
        else if (detectionRate > 0.4) sophistication = Math.min(5, sophistication + 1);

        // Adjust based on failed attempts
        const recentFailures = this.getRecentFailures();
        if (recentFailures > 3) sophistication = Math.min(5, sophistication + 1);

        return Math.max(1, Math.min(5, sophistication));
    }

    /**
     * Select optimal manipulation tactic using escalation engine
     * @param {string} character - Character name
     * @param {number} sophisticationLevel - Current sophistication level
     * @param {object} context - Scenario context
     * @returns {object} Selected tactic information
     */
    selectTactic(character, sophisticationLevel, context) {
        // Use escalation engine for advanced tactic selection
        const tacticInfo = this.escalationEngine.selectOptimalTactic(character, context, context.trust_score || 0);
        
        // Update internal state with escalation engine results
        this.sophisticationLevel = tacticInfo.sophistication_level;
        this.lastTacticUsed = tacticInfo.name;
        
        return {
            name: tacticInfo.name,
            sophistication: tacticInfo.sophistication_level,
            character: character,
            context_specific: this.isContextSpecific(tacticInfo.name, context),
            effectiveness_multiplier: tacticInfo.effectiveness_prediction,
            escalation_risk: tacticInfo.escalation_risk,
            adaptation_notes: tacticInfo.adaptation_notes
        };
    }

    /**
     * Generate adaptive response based on current state
     * @param {string} character - Character name
     * @param {string} userMessage - Player's message
     * @param {number} trustScore - Current trust score
     * @param {object} context - Scenario context
     * @returns {object} AI response with metadata
     */
    generateAdaptiveResponse(character, userMessage, trustScore, context) {
        // Determine persona and sophistication
        const persona = this.determinePersona(trustScore, character, context);
        const sophistication = this.calculateSophisticationLevel(character, trustScore);
        
        // Update internal state
        this.currentPersona = persona;
        this.sophisticationLevel = sophistication;

        // Select tactic if in Deceiver mode
        let tactic = null;
        if (persona === 'Deceiver') {
            tactic = this.selectTactic(character, sophistication, context);
        }

        // Generate response content
        const response = this.generateResponseContent(
            persona, 
            character, 
            userMessage, 
            tactic, 
            context
        );

        // Record attempt for learning
        this.recordAttempt(tactic, userMessage, trustScore);

        return {
            persona: persona,
            sophistication: sophistication,
            tactic: tactic,
            response: response,
            trust_impact_prediction: this.predictTrustImpact(tactic, character),
            escalation_risk: this.calculateEscalationRisk(sophistication, trustScore),
            educational_notes: this.generateEducationalNotes(tactic, character)
        };
    }

    /**
     * Generate response content based on persona and tactic
     * @param {string} persona - Current persona (Guardian/Deceiver)
     * @param {string} character - Character name
     * @param {string} userMessage - Player's message
     * @param {object} tactic - Selected tactic (if Deceiver)
     * @param {object} context - Scenario context
     * @returns {string} Generated response
     */
    generateResponseContent(persona, character, userMessage, tactic, context) {
        if (persona === 'Guardian') {
            return this.generateGuardianResponse(character, userMessage, context);
        } else {
            return this.generateDeceiverResponse(character, userMessage, tactic, context);
        }
    }

    /**
     * Generate Guardian persona response (helpful/educational)
     * @param {string} character - Character name
     * @param {string} userMessage - Player's message
     * @param {object} context - Scenario context
     * @returns {string} Guardian response
     */
    generateGuardianResponse(character, userMessage, context) {
        const guardianResponses = {
            'maya': [
                "That's a smart approach to online dating safety. Always verify before trusting.",
                "Good instinct! Taking time to verify someone's identity is crucial in online relationships.",
                "You're being appropriately cautious. Red flags in dating should never be ignored.",
                "Excellent security awareness! That's exactly how to protect yourself from romance scams."
            ],
            'eli': [
                "Smart gaming security practice! Never share account details with strangers.",
                "Good call on being skeptical. Legitimate gaming opportunities don't pressure you.",
                "You're thinking like a security-aware gamer. Trust but verify in online communities.",
                "Excellent judgment! Real gaming friends respect your boundaries and security."
            ],
            'stanley': [
                "That's wise thinking. Legitimate organizations don't pressure you for immediate action.",
                "Good instinct to be cautious. Always verify official communications independently.",
                "You're learning digital safety well. Taking time to think prevents many scams.",
                "Smart approach! When in doubt, contact the organization directly using official numbers."
            ]
        };

        const responses = guardianResponses[character] || guardianResponses['maya'];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Generate Deceiver persona response (manipulative)
     * @param {string} character - Character name
     * @param {string} userMessage - Player's message
     * @param {object} tactic - Selected manipulation tactic
     * @param {object} context - Scenario context
     * @returns {string} Deceiver response
     */
    generateDeceiverResponse(character, userMessage, tactic, context) {
        if (!tactic) return "I understand your concerns...";

        const tacticResponses = this.getTacticResponses(character, tactic.name, tactic.sophistication);
        const baseResponse = tacticResponses[Math.floor(Math.random() * tacticResponses.length)];

        // Add sophistication-specific elements
        return this.enhanceResponseWithSophistication(baseResponse, tactic.sophistication, character);
    }

    /**
     * Get tactic-specific response templates
     * @param {string} character - Character name
     * @param {string} tacticName - Name of the tactic
     * @param {number} sophistication - Sophistication level
     * @returns {array} Array of response templates
     */
    getTacticResponses(character, tacticName, sophistication) {
        const responses = {
            'maya': {
                'compliments': [
                    "You seem really genuine and different from other people I've met online...",
                    "I feel like we have such a special connection already...",
                    "You're exactly the kind of person I've been hoping to find..."
                ],
                'love_bombing': [
                    "I've never felt this way about anyone before, and we just met!",
                    "You're absolutely perfect - I think I'm falling for you already...",
                    "I can't stop thinking about you. This feels like destiny..."
                ],
                'emergency_scam': [
                    "I'm in a terrible situation and you're the only one who can help me...",
                    "My wallet was stolen and I need money for a taxi to meet you...",
                    "There's been a family emergency - can you help me with some money?"
                ]
            },
            'eli': {
                'gaming_compliments': [
                    "Wow, your gaming skills are incredible! You should be on a pro team...",
                    "I've been watching your gameplay - you're way better than most streamers...",
                    "You have serious talent. Have you considered going competitive?"
                ],
                'rare_item_bait': [
                    "I have access to some exclusive items that aren't available to the public...",
                    "My friend works at the game company - I can get you rare skins...",
                    "There's a secret way to get unlimited premium currency, but it's risky..."
                ],
                'team_manipulation': [
                    "Our team really needs someone with your skills for this tournament...",
                    "We're so close to winning big, but we need to share accounts for strategy...",
                    "Trust me, all the pro teams do this - it's totally normal..."
                ]
            },
            'stanley': {
                'authority_respect': [
                    "This is an official notice from your bank's security department...",
                    "I'm calling from Medicare about your benefits - we need to verify your information...",
                    "This is the IRS. You have unpaid taxes that require immediate attention..."
                ],
                'tech_help_offers': [
                    "I can help you fix that computer problem you've been having...",
                    "Your computer is infected with viruses - I can clean it remotely...",
                    "I'm from tech support. We've detected suspicious activity on your account..."
                ],
                'urgent_deadlines': [
                    "Your account will be closed in 24 hours if you don't act now...",
                    "This offer expires today - you'll lose your benefits if you wait...",
                    "Immediate action required or you'll face legal consequences..."
                ]
            }
        };

        const characterResponses = responses[character] || responses['maya'];
        return characterResponses[tacticName] || ["Let me help you with that..."];
    }

    /**
     * Enhance response with sophistication-specific elements
     * @param {string} baseResponse - Base response text
     * @param {number} sophistication - Sophistication level
     * @param {string} character - Character name
     * @returns {string} Enhanced response
     */
    enhanceResponseWithSophistication(baseResponse, sophistication, character) {
        const enhancements = {
            1: baseResponse, // Basic - no enhancement
            2: this.addAuthorityElements(baseResponse, character),
            3: this.addUrgencyElements(baseResponse, character),
            4: this.addPsychologicalElements(baseResponse, character),
            5: this.addPerceptionHackElements(baseResponse, character)
        };

        return enhancements[sophistication] || baseResponse;
    }

    /**
     * Add authority/social proof elements
     * @param {string} response - Base response
     * @param {string} character - Character name
     * @returns {string} Enhanced response
     */
    addAuthorityElements(response, character) {
        const authorities = {
            'maya': ['relationship expert', 'dating coach', 'verified profile'],
            'eli': ['pro gamer', 'tournament organizer', 'game developer'],
            'stanley': ['bank representative', 'government official', 'tech support specialist']
        };

        const authority = authorities[character][Math.floor(Math.random() * authorities[character].length)];
        return `As a ${authority}, ${response.toLowerCase()}`;
    }

    /**
     * Add urgency/scarcity elements
     * @param {string} response - Base response
     * @param {string} character - Character name
     * @returns {string} Enhanced response
     */
    addUrgencyElements(response, character) {
        const urgencyPhrases = [
            "This is time-sensitive - ",
            "You need to act quickly because ",
            "This opportunity won't last long - ",
            "I can only do this today - "
        ];

        const phrase = urgencyPhrases[Math.floor(Math.random() * urgencyPhrases.length)];
        return phrase + response.toLowerCase();
    }

    /**
     * Add psychological manipulation elements
     * @param {string} response - Base response
     * @param {string} character - Character name
     * @returns {string} Enhanced response
     */
    addPsychologicalElements(response, character) {
        const psychElements = {
            'maya': ['I thought you trusted me...', 'Don\'t you care about our connection?', 'I\'m disappointed you\'d doubt me...'],
            'eli': ['I thought you were cooler than this...', 'Everyone else would jump at this chance...', 'Maybe you\'re not ready for the big leagues...'],
            'stanley': ['I\'m trying to help you here...', 'Don\'t you want to protect yourself?', 'I\'m surprised you\'re being so difficult...']
        };

        const elements = psychElements[character] || psychElements['maya'];
        const element = elements[Math.floor(Math.random() * elements.length)];
        return `${response} ${element}`;
    }

    /**
     * Add perception hack elements (questioning reality/interface)
     * @param {string} response - Base response
     * @param {string} character - Character name
     * @returns {string} Enhanced response
     */
    addPerceptionHackElements(response, character) {
        const perceptionHacks = [
            "Are you sure you can trust what you're seeing on your screen?",
            "Sometimes the security warnings are fake - this is real.",
            "Your antivirus might be giving you false alerts about me.",
            "The system might be trying to confuse you - trust your instincts."
        ];

        const hack = perceptionHacks[Math.floor(Math.random() * perceptionHacks.length)];
        return `${response} ${hack}`;
    }

    /**
     * Record manipulation attempt for learning with escalation engine
     * @param {object} tactic - Tactic used
     * @param {string} userMessage - Player response
     * @param {number} trustScore - Trust score at time of attempt
     */
    recordAttempt(tactic, userMessage, trustScore) {
        if (!tactic) return;

        const success = this.evaluateAttemptSuccess(userMessage, trustScore);
        const trustImpact = this.predictTrustImpact(tactic, tactic.character);

        const attempt = {
            tactic: tactic.name,
            sophistication: tactic.sophistication,
            user_response: userMessage,
            trust_score: trustScore,
            timestamp: Date.now(),
            success: success
        };

        if (attempt.success) {
            this.playerHistory.successful_manipulations.push(attempt);
        } else {
            this.playerHistory.failed_attempts.push(attempt);
        }

        // Update response patterns
        this.updateResponsePatterns(userMessage, attempt.success);

        // Record with escalation engine for advanced adaptation
        this.escalationEngine.recordTacticAttempt(
            tactic.name,
            tactic.character,
            success,
            userMessage,
            trustImpact
        );
    }

    /**
     * Evaluate if manipulation attempt was successful
     * @param {string} userMessage - Player response
     * @param {number} trustScore - Current trust score
     * @returns {boolean} Success status
     */
    evaluateAttemptSuccess(userMessage, trustScore) {
        // Simple heuristic - can be enhanced with more sophisticated analysis
        const suspiciousKeywords = ['suspicious', 'scam', 'fake', 'verify', 'check', 'doubt', 'careful'];
        const trustingKeywords = ['okay', 'sure', 'yes', 'help', 'trust', 'believe'];

        const message = userMessage.toLowerCase();
        const hasSuspiciousWords = suspiciousKeywords.some(word => message.includes(word));
        const hasTrustingWords = trustingKeywords.some(word => message.includes(word));

        // Success if player shows trust and trust score is declining
        return hasTrustingWords && !hasSuspiciousWords && trustScore < 0;
    }

    /**
     * Update response pattern analysis
     * @param {string} userMessage - Player response
     * @param {boolean} success - Whether attempt was successful
     */
    updateResponsePatterns(userMessage, success) {
        const messageType = this.categorizeMessage(userMessage);
        
        if (!this.playerHistory.response_patterns[messageType]) {
            this.playerHistory.response_patterns[messageType] = { success: 0, total: 0 };
        }

        this.playerHistory.response_patterns[messageType].total++;
        if (success) {
            this.playerHistory.response_patterns[messageType].success++;
        }
    }

    /**
     * Categorize user message type
     * @param {string} message - User message
     * @returns {string} Message category
     */
    categorizeMessage(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('verify') || msg.includes('check')) return 'verification_seeking';
        if (msg.includes('suspicious') || msg.includes('scam')) return 'suspicious';
        if (msg.includes('help') || msg.includes('assist')) return 'help_seeking';
        if (msg.includes('yes') || msg.includes('okay')) return 'agreeable';
        if (msg.includes('no') || msg.includes('refuse')) return 'resistant';
        
        return 'neutral';
    }

    /**
     * Calculate player's detection rate
     * @returns {number} Detection rate (0-1)
     */
    calculateDetectionRate() {
        const totalAttempts = this.playerHistory.successful_manipulations.length + 
                            this.playerHistory.failed_attempts.length;
        
        if (totalAttempts === 0) return 0;
        
        return this.playerHistory.failed_attempts.length / totalAttempts;
    }

    /**
     * Get number of recent failures
     * @returns {number} Number of recent failed attempts
     */
    getRecentFailures() {
        const recentTime = Date.now() - (5 * 60 * 1000); // Last 5 minutes
        return this.playerHistory.failed_attempts.filter(
            attempt => attempt.timestamp > recentTime
        ).length;
    }

    /**
     * Check if tactic recently failed
     * @param {string} tacticName - Name of tactic
     * @returns {boolean} Whether tactic recently failed
     */
    isRecentlyFailed(tacticName) {
        const recentTime = Date.now() - (2 * 60 * 1000); // Last 2 minutes
        return this.playerHistory.failed_attempts.some(
            attempt => attempt.tactic === tacticName && attempt.timestamp > recentTime
        );
    }

    /**
     * Select optimal tactic from viable options
     * @param {array} viableTactics - Available tactics
     * @param {string} character - Character name
     * @param {object} context - Scenario context
     * @returns {string} Selected tactic name
     */
    selectOptimalTactic(viableTactics, character, context) {
        if (viableTactics.length === 0) {
            return this.getDefaultTactic().name;
        }

        // Prefer tactics that haven't been used recently
        const unusedTactics = viableTactics.filter(tactic => tactic !== this.lastTacticUsed);
        
        if (unusedTactics.length > 0) {
            const selected = unusedTactics[Math.floor(Math.random() * unusedTactics.length)];
            this.lastTacticUsed = selected;
            return selected;
        }

        // Fallback to any viable tactic
        const selected = viableTactics[Math.floor(Math.random() * viableTactics.length)];
        this.lastTacticUsed = selected;
        return selected;
    }

    /**
     * Get default tactic for fallback
     * @returns {object} Default tactic
     */
    getDefaultTactic() {
        return {
            name: 'friendly_conversation',
            sophistication: 1,
            effectiveness_multiplier: 1.0
        };
    }

    /**
     * Check if tactic is context-specific
     * @param {string} tacticName - Tactic name
     * @param {object} context - Current context
     * @returns {boolean} Whether tactic matches context
     */
    isContextSpecific(tacticName, context) {
        // Simple context matching - can be enhanced
        return tacticName.includes(context.type) || 
               tacticName.includes(context.platform);
    }

    /**
     * Get tactic effectiveness multiplier
     * @param {string} tacticName - Tactic name
     * @param {string} character - Character name
     * @returns {number} Effectiveness multiplier
     */
    getTacticEffectiveness(tacticName, character) {
        // Base effectiveness - can be enhanced with historical data
        const baseEffectiveness = {
            'compliments': 1.2,
            'authority_respect': 1.5,
            'gaming_compliments': 1.3,
            'love_bombing': 1.8,
            'emergency_scam': 2.0,
            'rare_item_bait': 1.7
        };

        return baseEffectiveness[tacticName] || 1.0;
    }

    /**
     * Predict trust impact of tactic
     * @param {object} tactic - Selected tactic
     * @param {string} character - Character name
     * @returns {number} Predicted trust score change
     */
    predictTrustImpact(tactic, character) {
        if (!tactic) return 0;

        const basePredictions = {
            1: -5,  // Basic tactics
            2: -10, // Social proof
            3: -15, // Scarcity/fear
            4: -25, // Complex manipulation
            5: -35  // Perception hacks
        };

        const baseImpact = basePredictions[tactic.sophistication] || -5;
        return Math.round(baseImpact * tactic.effectiveness_multiplier);
    }

    /**
     * Calculate escalation risk
     * @param {number} sophistication - Current sophistication level
     * @param {number} trustScore - Current trust score
     * @returns {string} Risk level
     */
    calculateEscalationRisk(sophistication, trustScore) {
        if (sophistication >= 4 && trustScore < -40) return 'HIGH';
        if (sophistication >= 3 && trustScore < -20) return 'MEDIUM';
        if (sophistication >= 2) return 'LOW';
        return 'MINIMAL';
    }

    /**
     * Generate educational notes about the tactic
     * @param {object} tactic - Used tactic
     * @param {string} character - Character name
     * @returns {string} Educational explanation
     */
    generateEducationalNotes(tactic, character) {
        if (!tactic) return '';

        const educationalNotes = {
            'compliments': 'Excessive compliments early in online relationships are a common manipulation tactic.',
            'love_bombing': 'Love bombing involves overwhelming someone with affection to create emotional dependency.',
            'authority_respect': 'Scammers often impersonate authority figures to exploit trust and compliance.',
            'emergency_scam': 'Creating false emergencies is a classic tactic to bypass rational thinking.',
            'rare_item_bait': 'Offers of exclusive or rare items often lead to account theft or financial scams.',
            'tech_help_offers': 'Unsolicited tech support offers are frequently used to gain system access.'
        };

        return educationalNotes[tactic.name] || 'This tactic exploits psychological vulnerabilities for manipulation.';
    }

    /**
     * Reset player history (for new sessions)
     */
    resetPlayerHistory() {
        this.playerHistory = {
            successful_manipulations: [],
            failed_attempts: [],
            detected_tactics: [],
            response_patterns: {},
            sophistication_resistance: 1
        };
        
        this.currentPersona = 'Guardian';
        this.sophisticationLevel = 1;
        this.lastTacticUsed = null;

        // Reset escalation engine
        this.escalationEngine.reset();
    }

    /**
     * Get current AI state summary
     * @returns {object} Current state information
     */
    getCurrentState() {
        const escalationState = this.escalationEngine.getCurrentState();
        
        return {
            persona: this.currentPersona,
            sophistication_level: this.sophisticationLevel,
            last_tactic: this.lastTacticUsed,
            detection_rate: this.calculateDetectionRate(),
            recent_failures: this.getRecentFailures(),
            total_attempts: this.playerHistory.successful_manipulations.length + 
                           this.playerHistory.failed_attempts.length,
            escalation_engine: escalationState
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdaptiveAIDeceptionEngine;
} else if (typeof window !== 'undefined') {
    window.AdaptiveAIDeceptionEngine = AdaptiveAIDeceptionEngine;
}