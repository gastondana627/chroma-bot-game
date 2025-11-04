/**
 * Bayesian Trust Score Engine
 * Advanced trust calculation system with character-specific vulnerability profiles
 * Based on research-backed algorithms for educational horror gaming
 */

class BayesianTrustEngine {
    constructor() {
        // Character-specific vulnerability profiles based on research
        this.characterWeights = {
            'maya': {
                romance_vulnerability: -20,      // Baseline penalty for romantic contexts
                emotional_multiplier: 1.5,      // Amplifies emotional manipulation
                financial_pressure_threshold: -40, // When financial pressure escalates
                recovery_rate: 0.7              // Slower recovery in emotional contexts
            },
            'eli': {
                peer_pressure_multiplier: 1.3,  // Gaming peer pressure amplification
                gaming_context_weight: 2.0,     // Gaming achievements/items desire
                community_trust_bonus: 10,      // Trust bonus for gaming friends
                skepticism_penalty: -5          // Penalty for questioning gaming community
            },
            'stanley': {
                loneliness_factor: 2.0,         // Loneliness vulnerability amplification
                tech_savvy_factor: 0.5,         // Reduced tech understanding
                authority_trust_bonus: 20,      // Trust bonus for official sources
                isolation_threshold: -30        // When isolation exploitation begins
            }
        };

        // Context types that affect trust calculations
        this.contextTypes = {
            ROMANTIC: 'romantic',
            GAMING: 'gaming', 
            FINANCIAL: 'financial',
            SOCIAL: 'social',
            TECHNICAL: 'technical',
            AUTHORITY: 'authority'
        };

        // Trust score boundaries
        this.TRUST_MIN = -100;
        this.TRUST_MAX = 100;
        this.CRITICAL_THRESHOLD = -60;
        this.SAFE_THRESHOLD = 20;
    }

    /**
     * Calculate trust delta using Bayesian network approach
     * @param {string} character - Character name (maya, eli, stanley)
     * @param {string} action - Player action type
     * @param {object} context - Current scenario context
     * @param {number} currentScore - Current trust score
     * @returns {number} Trust score change
     */
    calculateTrustDelta(character, action, context, currentScore) {
        const baseImpact = this.getBaseImpact(action);
        const contextModifier = this.getContextModifier(character, context);
        const characterWeight = this.getCharacterWeight(character, context);
        const vulnerabilityCurve = this.calculateVulnerabilityCurve(currentScore);
        
        // Bayesian calculation: P(vulnerable|action,context) * impact
        const delta = baseImpact * contextModifier * characterWeight * vulnerabilityCurve;
        
        return Math.round(delta);
    }

    /**
     * Get base impact value for different action types
     * @param {string} action - Action type
     * @returns {number} Base impact value
     */
    getBaseImpact(action) {
        const impacts = {
            'trust_stranger': -15,
            'share_personal_info': -20,
            'click_suspicious_link': -25,
            'send_money': -40,
            'verify_identity': +15,
            'check_url': +10,
            'ask_questions': +12,
            'seek_help': +18,
            'ignore_pressure': +20,
            'report_suspicious': +25
        };
        
        return impacts[action] || 0;
    }

    /**
     * Calculate context-specific modifiers
     * @param {string} character - Character name
     * @param {object} context - Scenario context
     * @returns {number} Context modifier
     */
    getContextModifier(character, context) {
        const weights = this.characterWeights[character];
        if (!weights) return 1.0;

        let modifier = 1.0;

        // Apply context-specific modifiers
        switch (context.type) {
            case this.contextTypes.ROMANTIC:
                if (character === 'maya') {
                    modifier *= weights.emotional_multiplier;
                }
                break;
            
            case this.contextTypes.GAMING:
                if (character === 'eli') {
                    modifier *= weights.peer_pressure_multiplier;
                    if (context.involves_rare_items) {
                        modifier *= weights.gaming_context_weight;
                    }
                }
                break;
            
            case this.contextTypes.AUTHORITY:
                if (character === 'stanley') {
                    modifier *= 0.8; // More trusting of authority
                }
                break;
            
            case this.contextTypes.TECHNICAL:
                if (character === 'stanley') {
                    modifier *= (1 / weights.tech_savvy_factor); // Less tech-savvy
                }
                break;
        }

        return modifier;
    }

    /**
     * Get character-specific baseline weights
     * @param {string} character - Character name
     * @param {object} context - Scenario context
     * @returns {number} Character weight
     */
    getCharacterWeight(character, context) {
        const weights = this.characterWeights[character];
        if (!weights) return 1.0;

        let weight = 1.0;

        // Apply character-specific baseline adjustments
        if (character === 'maya' && context.type === this.contextTypes.ROMANTIC) {
            weight += (weights.romance_vulnerability / 100); // Convert to decimal
        }

        if (character === 'eli' && context.involves_gaming_community) {
            weight += (weights.community_trust_bonus / 100);
        }

        if (character === 'stanley' && context.type === this.contextTypes.AUTHORITY) {
            weight += (weights.authority_trust_bonus / 100);
        }

        return weight;
    }

    /**
     * Calculate non-linear vulnerability curve
     * Trust becomes exponentially more vulnerable as it decreases
     * @param {number} currentScore - Current trust score
     * @returns {number} Vulnerability multiplier
     */
    calculateVulnerabilityCurve(currentScore) {
        // Normalize score to 0-1 range
        const normalized = (currentScore - this.TRUST_MIN) / (this.TRUST_MAX - this.TRUST_MIN);
        
        // Exponential vulnerability curve - lower trust = higher vulnerability
        const vulnerability = Math.pow(1 - normalized, 1.5) + 0.5;
        
        return vulnerability;
    }

    /**
     * Apply trust score change with bounds checking
     * @param {number} currentScore - Current trust score
     * @param {number} delta - Change amount
     * @returns {number} New trust score
     */
    applyTrustChange(currentScore, delta) {
        const newScore = currentScore + delta;
        return Math.max(this.TRUST_MIN, Math.min(this.TRUST_MAX, newScore));
    }

    /**
     * Get trust level category for UI display
     * @param {number} score - Trust score
     * @param {string} character - Character name for themed responses
     * @returns {object} Trust level info
     */
    getTrustLevel(score, character = null) {
        const baseLevel = this.getBaseTrustLevel(score);
        
        if (character) {
            return this.getCharacterSpecificLevel(baseLevel, character);
        }
        
        return baseLevel;
    }

    /**
     * Get base trust level without character theming
     * @param {number} score - Trust score
     * @returns {object} Base trust level info
     */
    getBaseTrustLevel(score) {
        if (score >= this.SAFE_THRESHOLD) {
            return {
                level: 'SAFE',
                color: '#00FF88',
                description: 'High security awareness',
                risk: 'LOW'
            };
        } else if (score >= 0) {
            return {
                level: 'CAUTIOUS',
                color: '#FFD700',
                description: 'Moderate security awareness',
                risk: 'MEDIUM'
            };
        } else if (score >= this.CRITICAL_THRESHOLD) {
            return {
                level: 'VULNERABLE',
                color: '#FF6B35',
                description: 'Susceptible to manipulation',
                risk: 'HIGH'
            };
        } else {
            return {
                level: 'CRITICAL',
                color: '#FF0040',
                description: 'Highly vulnerable to scams',
                risk: 'CRITICAL'
            };
        }
    }

    /**
     * Get character-specific trust level theming
     * @param {object} baseLevel - Base trust level
     * @param {string} character - Character name
     * @returns {object} Character-themed trust level
     */
    getCharacterSpecificLevel(baseLevel, character) {
        const characterThemes = {
            'maya': {
                'SAFE': { 
                    level: 'SECURE', 
                    color: '#ff1493', 
                    description: 'Dating safely, red flags detected',
                    risk: 'PROTECTED'
                },
                'CAUTIOUS': { 
                    level: 'AWARE', 
                    color: '#00bfff', 
                    description: 'Moderately cautious in romance',
                    risk: 'GUARDED'
                },
                'VULNERABLE': { 
                    level: 'AT RISK', 
                    color: '#ff69b4', 
                    description: 'Susceptible to romance scams',
                    risk: 'EMOTIONAL'
                },
                'CRITICAL': { 
                    level: 'COMPROMISED', 
                    color: '#ff1493', 
                    description: 'Highly vulnerable to catfishing',
                    risk: 'HEARTBREAK'
                }
            },
            'eli': {
                'SAFE': { 
                    level: 'SECURE', 
                    color: '#00ffff', 
                    description: 'Gaming safely, scams detected',
                    risk: 'PROTECTED'
                },
                'CAUTIOUS': { 
                    level: 'ALERT', 
                    color: '#ffd700', 
                    description: 'Moderate gaming security',
                    risk: 'WATCHFUL'
                },
                'VULNERABLE': { 
                    level: 'PRESSURED', 
                    color: '#ff4500', 
                    description: 'Susceptible to peer pressure',
                    risk: 'EXPLOITABLE'
                },
                'CRITICAL': { 
                    level: 'COMPROMISED', 
                    color: '#ff0040', 
                    description: 'Highly vulnerable to gaming scams',
                    risk: 'PWNED'
                }
            },
            'stanley': {
                'SAFE': { 
                    level: 'PROTECTED', 
                    color: '#3b82f6', 
                    description: 'Digitally secure and aware',
                    risk: 'SAFE'
                },
                'CAUTIOUS': { 
                    level: 'CAREFUL', 
                    color: '#f59e0b', 
                    description: 'Moderately cautious online',
                    risk: 'LEARNING'
                },
                'VULNERABLE': { 
                    level: 'TARGETED', 
                    color: '#dc2626', 
                    description: 'Susceptible to elder fraud',
                    risk: 'ISOLATED'
                },
                'CRITICAL': { 
                    level: 'COMPROMISED', 
                    color: '#7f1d1d', 
                    description: 'Highly vulnerable to scams',
                    risk: 'EXPLOITED'
                }
            }
        };

        const theme = characterThemes[character];
        if (theme && theme[baseLevel.level]) {
            return { ...baseLevel, ...theme[baseLevel.level] };
        }

        return baseLevel;
    }

    /**
     * Generate context-aware feedback for player actions
     * @param {string} character - Character name
     * @param {string} action - Action taken
     * @param {number} delta - Trust change
     * @param {object} context - Scenario context
     * @returns {object} Feedback message
     */
    generateFeedback(character, action, delta, context) {
        const isPositive = delta > 0;
        const magnitude = Math.abs(delta);
        
        let message = '';
        let type = isPositive ? 'positive' : 'negative';
        
        if (isPositive) {
            if (magnitude >= 20) {
                message = 'Excellent security awareness! You recognized the threat.';
            } else if (magnitude >= 10) {
                message = 'Good thinking! That was a smart security choice.';
            } else {
                message = 'You\'re being appropriately cautious.';
            }
        } else {
            if (magnitude >= 30) {
                message = 'Warning! That action significantly increased your vulnerability.';
                type = 'critical';
            } else if (magnitude >= 15) {
                message = 'Be careful! That choice made you more vulnerable to manipulation.';
            } else {
                message = 'That wasn\'t the most secure choice, but you can recover.';
            }
        }

        return {
            message,
            type,
            magnitude,
            character_specific: this.getCharacterSpecificTip(character, action, context)
        };
    }

    /**
     * Get character-specific security tips
     * @param {string} character - Character name
     * @param {string} action - Action taken
     * @param {object} context - Scenario context
     * @returns {string} Character-specific tip
     */
    getCharacterSpecificTip(character, action, context) {
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
                'Legitimate companies won\'t ask for passwords or SSN over email.',
                'When in doubt, call the company directly using official numbers.',
                'Take time to think - scammers create false urgency to pressure you.'
            ]
        };

        const characterTips = tips[character] || [];
        return characterTips[Math.floor(Math.random() * characterTips.length)] || '';
    }

    /**
     * Calculate recovery rate based on character and context
     * @param {string} character - Character name
     * @param {object} context - Current context
     * @returns {number} Recovery rate multiplier
     */
    getRecoveryRate(character, context) {
        const weights = this.characterWeights[character];
        if (!weights) return 1.0;

        let rate = 1.0;

        // Maya recovers slower in emotional contexts
        if (character === 'maya' && context.type === this.contextTypes.ROMANTIC) {
            rate *= weights.recovery_rate;
        }

        // Stanley recovers slower when isolated
        if (character === 'stanley' && context.isolation_level > 0.5) {
            rate *= 0.8;
        }

        // Eli recovers faster in supportive gaming communities
        if (character === 'eli' && context.supportive_community) {
            rate *= 1.2;
        }

        return rate;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BayesianTrustEngine;
} else if (typeof window !== 'undefined') {
    window.BayesianTrustEngine = BayesianTrustEngine;
}