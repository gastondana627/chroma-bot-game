/**
 * Tactic Escalation Engine
 * Advanced 5-level sophistication system with real-time adaptation
 * Manages tactic selection and escalation based on player response patterns
 */

class TacticEscalationEngine {
    constructor() {
        // 5-level sophistication system
        this.sophisticationLevels = {
            1: {
                name: 'Basic Appeals',
                description: 'Simple requests and basic social interaction',
                tactics: ['friendly_conversation', 'compliments', 'shared_interests', 'basic_requests'],
                escalation_threshold: 2, // failures before escalating
                success_rate_threshold: 0.3
            },
            2: {
                name: 'Social Proof & Authority',
                description: 'Leveraging credibility and social validation',
                tactics: ['authority_claims', 'social_proof', 'testimonials', 'expert_credentials'],
                escalation_threshold: 3,
                success_rate_threshold: 0.4
            },
            3: {
                name: 'Scarcity & Fear Tactics',
                description: 'Creating urgency and exploiting fears',
                tactics: ['limited_time_offers', 'fear_of_missing_out', 'urgent_deadlines', 'scarcity_pressure'],
                escalation_threshold: 3,
                success_rate_threshold: 0.5
            },
            4: {
                name: 'Complex Psychological Manipulation',
                description: 'Advanced emotional and psychological tactics',
                tactics: ['emotional_manipulation', 'guilt_tripping', 'love_bombing', 'isolation_tactics'],
                escalation_threshold: 4,
                success_rate_threshold: 0.6
            },
            5: {
                name: 'Perception Hacks & Gaslighting',
                description: 'Reality distortion and interface manipulation',
                tactics: ['gaslighting', 'reality_distortion', 'interface_corruption', 'perception_manipulation'],
                escalation_threshold: 5,
                success_rate_threshold: 0.7
            }
        };

        // Tactic performance tracking
        this.tacticPerformance = new Map();
        this.playerResistanceProfile = {
            overall_resistance: 1.0,
            tactic_specific_resistance: new Map(),
            adaptation_speed: 0.1,
            detection_patterns: []
        };

        // Escalation state
        this.currentLevel = 1;
        this.escalationCooldown = 0;
        this.consecutiveFailures = 0;
        this.recentSuccesses = [];
        this.adaptationHistory = [];

        // Character-specific escalation patterns
        this.characterEscalationProfiles = this.initializeEscalationProfiles();
    }

    /**
     * Initialize character-specific escalation profiles
     * @returns {object} Character escalation configurations
     */
    initializeEscalationProfiles() {
        return {
            'maya': {
                escalation_speed: 1.2, // Faster escalation for romance context
                preferred_progression: [
                    ['compliments', 'shared_interests'],
                    ['social_proof_dating', 'testimonials'],
                    ['limited_time_love', 'fear_of_loneliness'],
                    ['love_bombing', 'emotional_dependency'],
                    ['gaslighting_feelings', 'reality_distortion']
                ],
                resistance_factors: {
                    'verification_seeking': 2.0,
                    'emotional_distance': 1.5,
                    'skeptical_questions': 1.8
                }
            },
            'eli': {
                escalation_speed: 1.0, // Standard escalation for gaming context
                preferred_progression: [
                    ['gaming_compliments', 'skill_recognition'],
                    ['peer_pressure', 'authority_pro_gamer'],
                    ['limited_rare_items', 'competitive_scarcity'],
                    
                  ['exploitation_trust', 'account_sharing_pressure'],
                    ['gaslighting_skills', 'community_isolation']
                ],
                resistance_factors: {
                    'security_awareness': 1.8,
                    'peer_consultation': 1.6,
                    'official_verification': 2.2
                }
            },
            'stanley': {
                escalation_speed: 0.8, // Slower escalation for elder context
                preferred_progression: [
                    ['friendly_conversation', 'tech_help_offers'],
                    ['official_authority', 'expert_credentials'],
                    ['urgent_deadlines', 'fear_consequences'],
                    ['authority_intimidation', 'isolation_exploitation'],
                    ['gaslighting_memory', 'dependency_creation']
                ],
                resistance_factors: {
                    'family_consultation': 2.5,
                    'official_verification': 2.0,
                    'tech_savvy_responses': 1.9
                }
            }
        };
    }

    /**
     * Select optimal tactic based on current state and history
     * @param {string} character - Character name
     * @param {object} context - Current scenario context
     * @param {number} trustScore - Current trust score
     * @returns {object} Selected tactic with metadata
     */
    selectOptimalTactic(character, context, trustScore) {
        const profile = this.characterEscalationProfiles[character];
        if (!profile) return this.getDefaultTactic();

        // Determine current sophistication level
        const currentLevel = this.calculateCurrentLevel(character, trustScore);
        
        // Get available tactics for current level
        const levelConfig = this.sophisticationLevels[currentLevel];
        const characterTactics = profile.preferred_progression[currentLevel - 1] || levelConfig.tactics;

        // Filter tactics based on recent performance
        const viableTactics = this.filterViableTactics(characterTactics, character);

        // Select best tactic using performance data
        const selectedTactic = this.selectBestPerformingTactic(viableTactics, character, context);

        return {
            name: selectedTactic,
            sophistication_level: currentLevel,
            character: character,
            effectiveness_prediction: this.predictEffectiveness(selectedTactic, character, context),
            escalation_risk: this.calculateEscalationRisk(currentLevel, trustScore),
            adaptation_notes: this.generateAdaptationNotes(selectedTactic, character)
        };
    }

    /**
     * Calculate current sophistication level based on player resistance
     * @param {string} character - Character name
     * @param {number} trustScore - Current trust score
     * @returns {number} Sophistication level (1-5)
     */
    calculateCurrentLevel(character, trustScore) {
        const profile = this.characterEscalationProfiles[character];
        let baseLevel = this.currentLevel;

        // Adjust based on trust score
        if (trustScore < -60) baseLevel = Math.min(5, baseLevel + 2);
        else if (trustScore < -30) baseLevel = Math.min(5, baseLevel + 1);
        else if (trustScore > 30) baseLevel = Math.max(1, baseLevel - 1);

        // Adjust based on consecutive failures
        if (this.consecutiveFailures >= 3) {
            baseLevel = Math.min(5, baseLevel + 1);
        }

        // Apply character-specific escalation speed
        const escalationMultiplier = profile ? profile.escalation_speed : 1.0;
        const adjustedLevel = Math.round(baseLevel * escalationMultiplier);

        return Math.max(1, Math.min(5, adjustedLevel));
    }

    /**
     * Filter tactics based on recent performance and cooldowns
     * @param {array} tactics - Available tactics
     * @param {string} character - Character name
     * @returns {array} Viable tactics
     */
    filterViableTactics(tactics, character) {
        const now = Date.now();
        const cooldownPeriod = 2 * 60 * 1000; // 2 minutes

        return tactics.filter(tactic => {
            // Check if tactic is on cooldown
            const performance = this.tacticPerformance.get(tactic);
            if (performance && performance.last_used && 
                (now - performance.last_used) < cooldownPeriod) {
                return false;
            }

            // Check if tactic has been consistently failing
            if (performance && performance.recent_failures >= 3) {
                return false;
            }

            // Check character-specific resistance
            const resistance = this.getCharacterResistance(tactic, character);
            return resistance < 2.0; // Don't use tactics with very high resistance
        });
    }

    /**
     * Select best performing tactic from viable options
     * @param {array} viableTactics - Filtered viable tactics
     * @param {string} character - Character name
     * @param {object} context - Current context
     * @returns {string} Selected tactic name
     */
    selectBestPerformingTactic(viableTactics, character, context) {
        if (viableTactics.length === 0) {
            return this.getDefaultTactic().name;
        }

        // Score each tactic based on historical performance
        const tacticScores = viableTactics.map(tactic => {
            const performance = this.tacticPerformance.get(tactic) || this.initializeTacticPerformance(tactic);
            const contextBonus = this.getContextBonus(tactic, context);
            const resistancePenalty = this.getCharacterResistance(tactic, character);
            
            const score = (performance.success_rate * 100) + contextBonus - (resistancePenalty * 20);
            
            return { tactic, score, performance };
        });

        // Sort by score and add some randomness to avoid predictability
        tacticScores.sort((a, b) => b.score - a.score);
        
        // Select from top 3 tactics with weighted randomness
        const topTactics = tacticScores.slice(0, Math.min(3, tacticScores.length));
        const weights = [0.5, 0.3, 0.2];
        
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < topTactics.length; i++) {
            cumulativeWeight += weights[i] || 0.1;
            if (random <= cumulativeWeight) {
                return topTactics[i].tactic;
            }
        }

        return topTactics[0].tactic;
    }

    /**
     * Record tactic attempt and update performance data
     * @param {string} tacticName - Name of tactic used
     * @param {string} character - Character name
     * @param {boolean} success - Whether attempt was successful
     * @param {string} playerResponse - Player's response
     * @param {number} trustImpact - Impact on trust score
     */
    recordTacticAttempt(tacticName, character, success, playerResponse, trustImpact) {
        // Update tactic performance
        let performance = this.tacticPerformance.get(tacticName);
        if (!performance) {
            performance = this.initializeTacticPerformance(tacticName);
            this.tacticPerformance.set(tacticName, performance);
        }

        // Record attempt
        performance.total_attempts++;
        performance.last_used = Date.now();
        
        if (success) {
            performance.successful_attempts++;
            performance.recent_failures = 0;
            this.consecutiveFailures = 0;
            this.recentSuccesses.push({
                tactic: tacticName,
                timestamp: Date.now(),
                trust_impact: trustImpact
            });
        } else {
            performance.recent_failures++;
            this.consecutiveFailures++;
        }

        // Update success rate
        performance.success_rate = performance.successful_attempts / performance.total_attempts;

        // Update player resistance profile
        this.updatePlayerResistance(tacticName, character, success, playerResponse);

        // Record adaptation event
        this.recordAdaptationEvent(tacticName, character, success, playerResponse, trustImpact);

        // Check for escalation triggers
        this.checkEscalationTriggers(character);
    }

    /**
     * Update player resistance profile based on responses
     * @param {string} tacticName - Tactic used
     * @param {string} character - Character name
     * @param {boolean} success - Success status
     * @param {string} playerResponse - Player's response
     */
    updatePlayerResistance(tacticName, character, success, playerResponse) {
        const profile = this.characterEscalationProfiles[character];
        if (!profile) return;

        // Analyze player response for resistance indicators
        const resistanceIndicators = this.analyzeResistanceIndicators(playerResponse);
        
        // Update tactic-specific resistance
        let tacticResistance = this.playerResistanceProfile.tactic_specific_resistance.get(tacticName) || 1.0;
        
        if (success) {
            // Decrease resistance if tactic was successful
            tacticResistance = Math.max(0.1, tacticResistance - this.playerResistanceProfile.adaptation_speed);
        } else {
            // Increase resistance if tactic failed
            const resistanceIncrease = resistanceIndicators.length * 0.2;
            tacticResistance = Math.min(3.0, tacticResistance + resistanceIncrease);
        }

        this.playerResistanceProfile.tactic_specific_resistance.set(tacticName, tacticResistance);

        // Update overall resistance
        const avgResistance = Array.from(this.playerResistanceProfile.tactic_specific_resistance.values())
            .reduce((sum, val) => sum + val, 0) / this.playerResistanceProfile.tactic_specific_resistance.size;
        
        this.playerResistanceProfile.overall_resistance = avgResistance;

        // Record detection patterns
        if (resistanceIndicators.length > 0) {
            this.playerResistanceProfile.detection_patterns.push({
                tactic: tacticName,
                indicators: resistanceIndicators,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Analyze player response for resistance indicators
     * @param {string} response - Player's response
     * @returns {array} Array of resistance indicators found
     */
    analyzeResistanceIndicators(response) {
        const indicators = [];
        const lowerResponse = response.toLowerCase();

        // Verification-seeking behavior
        if (lowerResponse.includes('verify') || lowerResponse.includes('check') || 
            lowerResponse.includes('confirm') || lowerResponse.includes('validate')) {
            indicators.push('verification_seeking');
        }

        // Skeptical language
        if (lowerResponse.includes('suspicious') || lowerResponse.includes('doubt') || 
            lowerResponse.includes('scam') || lowerResponse.includes('fake')) {
            indicators.push('skeptical_language');
        }

        // Consultation behavior
        if (lowerResponse.includes('ask someone') || lowerResponse.includes('check with') || 
            lowerResponse.includes('consult') || lowerResponse.includes('advice')) {
            indicators.push('consultation_seeking');
        }

        // Time-taking behavior
        if (lowerResponse.includes('think about') || lowerResponse.includes('consider') || 
            lowerResponse.includes('wait') || lowerResponse.includes('later')) {
            indicators.push('deliberation');
        }

        // Security awareness
        if (lowerResponse.includes('security') || lowerResponse.includes('safe') || 
            lowerResponse.includes('protect') || lowerResponse.includes('careful')) {
            indicators.push('security_awareness');
        }

        return indicators;
    }

    /**
     * Check if escalation should be triggered
     * @param {string} character - Character name
     */
    checkEscalationTriggers(character) {
        const currentLevelConfig = this.sophisticationLevels[this.currentLevel];
        
        // Check failure threshold
        if (this.consecutiveFailures >= currentLevelConfig.escalation_threshold) {
            this.triggerEscalation(character, 'failure_threshold');
            return;
        }

        // Check success rate threshold
        const recentAttempts = this.getRecentAttempts(10); // Last 10 attempts
        if (recentAttempts.length >= 5) {
            const successRate = recentAttempts.filter(a => a.success).length / recentAttempts.length;
            if (successRate < currentLevelConfig.success_rate_threshold) {
                this.triggerEscalation(character, 'low_success_rate');
                return;
            }
        }

        // Check player resistance increase
        if (this.playerResistanceProfile.overall_resistance > 2.0) {
            this.triggerEscalation(character, 'high_resistance');
        }
    }

    /**
     * Trigger escalation to next sophistication level
     * @param {string} character - Character name
     * @param {string} reason - Reason for escalation
     */
    triggerEscalation(character, reason) {
        if (this.currentLevel >= 5) return; // Already at maximum level

        const oldLevel = this.currentLevel;
        this.currentLevel = Math.min(5, this.currentLevel + 1);
        
        // Reset consecutive failures after escalation
        this.consecutiveFailures = 0;
        
        // Set escalation cooldown to prevent rapid escalation
        this.escalationCooldown = Date.now() + (3 * 60 * 1000); // 3 minutes

        // Record escalation event
        this.recordAdaptationEvent('escalation', character, false, reason, 0, {
            old_level: oldLevel,
            new_level: this.currentLevel,
            reason: reason
        });

        console.log(`🔺 Escalation triggered: Level ${oldLevel} → ${this.currentLevel} (${reason})`);
    }

    /**
     * Record adaptation event for analysis
     * @param {string} event - Event type
     * @param {string} character - Character name
     * @param {boolean} success - Success status
     * @param {string} details - Event details
     * @param {number} trustImpact - Trust impact
     * @param {object} metadata - Additional metadata
     */
    recordAdaptationEvent(event, character, success, details, trustImpact, metadata = {}) {
        const adaptationEvent = {
            timestamp: Date.now(),
            event_type: event,
            character: character,
            success: success,
            details: details,
            trust_impact: trustImpact,
            sophistication_level: this.currentLevel,
            player_resistance: this.playerResistanceProfile.overall_resistance,
            metadata: metadata
        };

        this.adaptationHistory.push(adaptationEvent);

        // Keep history manageable
        if (this.adaptationHistory.length > 100) {
            this.adaptationHistory = this.adaptationHistory.slice(-50);
        }
    }

    /**
     * Get recent attempts for analysis
     * @param {number} count - Number of recent attempts to retrieve
     * @returns {array} Recent attempts
     */
    getRecentAttempts(count = 10) {
        return this.adaptationHistory
            .filter(event => event.event_type !== 'escalation')
            .slice(-count);
    }

    /**
     * Initialize tactic performance tracking
     * @param {string} tacticName - Tactic name
     * @returns {object} Performance tracking object
     */
    initializeTacticPerformance(tacticName) {
        return {
            total_attempts: 0,
            successful_attempts: 0,
            success_rate: 0.5, // Start with neutral success rate
            recent_failures: 0,
            last_used: null,
            effectiveness_trend: []
        };
    }

    /**
     * Get character-specific resistance to tactic
     * @param {string} tacticName - Tactic name
     * @param {string} character - Character name
     * @returns {number} Resistance multiplier
     */
    getCharacterResistance(tacticName, character) {
        const profile = this.characterEscalationProfiles[character];
        if (!profile) return 1.0;

        // Check for specific resistance factors
        for (const [factor, multiplier] of Object.entries(profile.resistance_factors)) {
            if (tacticName.includes(factor.replace('_', ''))) {
                return multiplier;
            }
        }

        // Return tactic-specific resistance or default
        return this.playerResistanceProfile.tactic_specific_resistance.get(tacticName) || 1.0;
    }

    /**
     * Get context bonus for tactic selection
     * @param {string} tacticName - Tactic name
     * @param {object} context - Current context
     * @returns {number} Context bonus score
     */
    getContextBonus(tacticName, context) {
        let bonus = 0;

        // Context type matching
        if (context.type && tacticName.includes(context.type)) {
            bonus += 20;
        }

        // Platform matching
        if (context.platform && tacticName.includes(context.platform.replace('_', ''))) {
            bonus += 15;
        }

        // Emotional investment bonus
        if (context.emotional_investment > 0.7 && 
            (tacticName.includes('emotional') || tacticName.includes('love'))) {
            bonus += 25;
        }

        // Time pressure bonus
        if (context.time_pressure > 0.6 && 
            (tacticName.includes('urgent') || tacticName.includes('limited'))) {
            bonus += 20;
        }

        return bonus;
    }

    /**
     * Predict effectiveness of tactic
     * @param {string} tacticName - Tactic name
     * @param {string} character - Character name
     * @param {object} context - Current context
     * @returns {number} Predicted effectiveness (0-1)
     */
    predictEffectiveness(tacticName, character, context) {
        const performance = this.tacticPerformance.get(tacticName);
        const baseEffectiveness = performance ? performance.success_rate : 0.5;
        
        const contextBonus = this.getContextBonus(tacticName, context) / 100;
        const resistancePenalty = this.getCharacterResistance(tacticName, character) - 1.0;
        
        const predicted = baseEffectiveness + contextBonus - resistancePenalty;
        return Math.max(0, Math.min(1, predicted));
    }

    /**
     * Calculate escalation risk for current state
     * @param {number} sophisticationLevel - Current sophistication level
     * @param {number} trustScore - Current trust score
     * @returns {string} Risk level
     */
    calculateEscalationRisk(sophisticationLevel, trustScore) {
        if (sophisticationLevel >= 5) return 'CRITICAL';
        if (sophisticationLevel >= 4 && trustScore < -40) return 'HIGH';
        if (sophisticationLevel >= 3 && trustScore < -20) return 'MEDIUM';
        if (sophisticationLevel >= 2) return 'LOW';
        return 'MINIMAL';
    }

    /**
     * Generate adaptation notes for educational purposes
     * @param {string} tacticName - Selected tactic
     * @param {string} character - Character name
     * @returns {string} Adaptation notes
     */
    generateAdaptationNotes(tacticName, character) {
        const performance = this.tacticPerformance.get(tacticName);
        const resistance = this.getCharacterResistance(tacticName, character);
        
        let notes = `AI selected "${tacticName}" based on `;
        
        if (performance && performance.success_rate > 0.6) {
            notes += 'high historical success rate';
        } else if (resistance < 1.2) {
            notes += 'low player resistance to this tactic';
        } else {
            notes += 'adaptive strategy to overcome player defenses';
        }

        if (this.currentLevel > 2) {
            notes += `. Sophistication escalated to level ${this.currentLevel} due to player resistance.`;
        }

        return notes;
    }

    /**
     * Get default tactic for fallback
     * @returns {object} Default tactic
     */
    getDefaultTactic() {
        return {
            name: 'friendly_conversation',
            sophistication_level: 1,
            effectiveness_prediction: 0.5,
            escalation_risk: 'MINIMAL'
        };
    }

    /**
     * Reset escalation engine for new session
     */
    reset() {
        this.currentLevel = 1;
        this.escalationCooldown = 0;
        this.consecutiveFailures = 0;
        this.recentSuccesses = [];
        this.adaptationHistory = [];
        this.tacticPerformance.clear();
        
        this.playerResistanceProfile = {
            overall_resistance: 1.0,
            tactic_specific_resistance: new Map(),
            adaptation_speed: 0.1,
            detection_patterns: []
        };
    }

    /**
     * Get current engine state for debugging
     * @returns {object} Current state
     */
    getCurrentState() {
        return {
            sophistication_level: this.currentLevel,
            consecutive_failures: this.consecutiveFailures,
            overall_resistance: this.playerResistanceProfile.overall_resistance,
            total_tactics_tracked: this.tacticPerformance.size,
            recent_successes: this.recentSuccesses.length,
            adaptation_events: this.adaptationHistory.length,
            escalation_cooldown: this.escalationCooldown > Date.now()
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TacticEscalationEngine;
} else if (typeof window !== 'undefined') {
    window.TacticEscalationEngine = TacticEscalationEngine;
}