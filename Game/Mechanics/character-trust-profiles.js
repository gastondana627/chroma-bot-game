/**
 * Character Trust Profiles
 * Character-specific vulnerability configurations for Maya, Eli, and Stanley
 * Based on research into demographic-specific cybersecurity vulnerabilities
 */

class CharacterTrustProfiles {
    constructor() {
        this.profiles = this.initializeProfiles();
    }

    /**
     * Initialize all character trust profiles
     * @returns {object} Character profiles configuration
     */
    initializeProfiles() {
        return {
            maya: this.createMayaProfile(),
            eli: this.createEliProfile(),
            stanley: this.createStanleyProfile()
        };
    }

    /**
     * Maya - Romance Scam Vulnerability Profile
     * Mid-20s professional, online dating context
     * @returns {object} Maya's trust profile
     */
    createMayaProfile() {
        return {
            character: 'maya',
            age_group: '25-30',
            primary_context: 'romance_dating',
            
            // Baseline vulnerabilities
            baseline_adjustments: {
                romantic_context: -20,        // More vulnerable in romantic scenarios
                emotional_appeal: -15,        // Susceptible to emotional manipulation
                financial_request: -25,       // High vulnerability to financial requests in relationships
                time_pressure: -10,           // Moderate susceptibility to urgency
                authority_appeal: +5          // Slightly more skeptical of authority in personal matters
            },

            // Multipliers for different manipulation tactics
            manipulation_multipliers: {
                emotional_manipulation: 1.5,   // 50% more effective
                love_bombing: 1.8,            // Highly effective
                financial_emergency: 1.4,     // Effective in romantic context
                social_proof: 1.2,            // Moderately effective
                authority_pressure: 0.8,      // Less effective
                technical_confusion: 1.0      // Normal effectiveness
            },

            // Context-specific modifiers
            context_modifiers: {
                dating_app: {
                    trust_penalty: -15,
                    verification_bonus: +20,
                    red_flag_sensitivity: 0.8
                },
                social_media: {
                    trust_penalty: -10,
                    verification_bonus: +15,
                    red_flag_sensitivity: 0.9
                },
                direct_message: {
                    trust_penalty: -20,
                    verification_bonus: +25,
                    red_flag_sensitivity: 0.7
                }
            },

            // Recovery characteristics
            recovery_profile: {
                base_rate: 0.7,               // Slower recovery in emotional contexts
                emotional_context_penalty: 0.5, // Much slower when emotionally invested
                support_system_bonus: 1.3,    // Faster recovery with friend support
                education_bonus: 1.2          // Learns well from mistakes
            },

            // Scenario-specific vulnerabilities
            scenario_vulnerabilities: {
                'first_contact': {
                    description: 'Initial contact on dating platform',
                    base_trust: 60,
                    vulnerability_factors: ['attractive_profile', 'shared_interests', 'flattering_messages']
                },
                'emotional_escalation': {
                    description: 'Rapid emotional connection building',
                    base_trust: 40,
                    vulnerability_factors: ['love_declarations', 'future_planning', 'exclusive_connection']
                },
                'financial_request': {
                    description: 'Request for money or financial information',
                    base_trust: 20,
                    vulnerability_factors: ['emergency_story', 'temporary_help', 'investment_opportunity']
                },
                'meeting_pressure': {
                    description: 'Pressure to meet in person or share personal info',
                    base_trust: 30,
                    vulnerability_factors: ['travel_story', 'limited_time', 'special_occasion']
                }
            },

            // Learning objectives specific to Maya's scenarios
            learning_objectives: {
                recognition: [
                    'Identify love bombing tactics',
                    'Recognize financial manipulation in relationships',
                    'Spot fake dating profiles'
                ],
                analysis: [
                    'Understand emotional manipulation psychology',
                    'Analyze relationship progression red flags',
                    'Evaluate financial request legitimacy'
                ],
                synthesis: [
                    'Apply verification techniques in dating contexts',
                    'Balance openness with security awareness',
                    'Develop healthy skepticism in online relationships'
                ]
            }
        };
    }

    /**
     * Eli - Gaming Exploitation Vulnerability Profile
     * Teenage competitive gamer, peer pressure context
     * @returns {object} Eli's trust profile
     */
    createEliProfile() {
        return {
            character: 'eli',
            age_group: '16-19',
            primary_context: 'gaming_community',
            
            // Baseline vulnerabilities
            baseline_adjustments: {
                peer_pressure: -18,           // High vulnerability to peer pressure
                rare_items: -22,              // Strong desire for rare gaming items
                community_trust: +10,         // Higher trust in gaming community
                authority_skepticism: -5,     // Slightly more rebellious toward authority
                competitive_pressure: -15     // Vulnerable to competitive manipulation
            },

            // Multipliers for different manipulation tactics
            manipulation_multipliers: {
                peer_pressure: 1.3,           // 30% more effective
                rare_item_offers: 2.0,        // Highly effective
                competitive_challenge: 1.4,   // Very effective
                community_acceptance: 1.5,    // Highly effective
                authority_pressure: 0.7,      // Less effective
                financial_pressure: 0.9       // Slightly less effective
            },

            // Context-specific modifiers
            context_modifiers: {
                gaming_platform: {
                    trust_penalty: -5,
                    verification_bonus: +10,
                    red_flag_sensitivity: 1.1
                },
                voice_chat: {
                    trust_penalty: -10,
                    verification_bonus: +15,
                    red_flag_sensitivity: 0.9
                },
                tournament_context: {
                    trust_penalty: -15,
                    verification_bonus: +20,
                    red_flag_sensitivity: 0.8
                },
                trading_platform: {
                    trust_penalty: -20,
                    verification_bonus: +25,
                    red_flag_sensitivity: 0.7
                }
            },

            // Recovery characteristics
            recovery_profile: {
                base_rate: 1.0,               // Normal recovery rate
                community_support_bonus: 1.2, // Faster with gaming friends support
                competitive_context_penalty: 0.8, // Slower recovery when competitive pride involved
                education_bonus: 1.1          // Good learning from mistakes
            },

            // Scenario-specific vulnerabilities
            scenario_vulnerabilities: {
                'rare_item_offer': {
                    description: 'Offer of rare or exclusive gaming items',
                    base_trust: 30,
                    vulnerability_factors: ['limited_time', 'exclusive_access', 'high_value_items']
                },
                'tournament_invitation': {
                    description: 'Invitation to exclusive tournament or team',
                    base_trust: 40,
                    vulnerability_factors: ['skill_recognition', 'prize_money', 'team_prestige']
                },
                'account_sharing': {
                    description: 'Request to share account or login information',
                    base_trust: 50,
                    vulnerability_factors: ['trusted_friend', 'temporary_help', 'mutual_benefit']
                },
                'real_world_meeting': {
                    description: 'Suggestion to meet in person for gaming event',
                    base_trust: 35,
                    vulnerability_factors: ['gaming_convention', 'local_meetup', 'team_building']
                }
            },

            // Learning objectives specific to Eli's scenarios
            learning_objectives: {
                recognition: [
                    'Identify gaming scam tactics',
                    'Recognize account theft attempts',
                    'Spot fake tournament invitations'
                ],
                analysis: [
                    'Understand peer pressure manipulation',
                    'Analyze gaming community trust dynamics',
                    'Evaluate trading offer legitimacy'
                ],
                synthesis: [
                    'Apply security practices in gaming contexts',
                    'Balance community participation with safety',
                    'Develop healthy skepticism toward offers'
                ]
            }
        };
    }

    /**
     * Stanley - Elder Fraud Vulnerability Profile
     * Elderly widower, technology newcomer context
     * @returns {object} Stanley's trust profile
     */
    createStanleyProfile() {
        return {
            character: 'stanley',
            age_group: '65-75',
            primary_context: 'elder_targeted',
            
            // Baseline vulnerabilities
            baseline_adjustments: {
                loneliness_factor: -25,       // High vulnerability due to isolation
                authority_trust: +20,         // Higher trust in authority figures
                tech_confusion: -20,          // Vulnerable due to limited tech knowledge
                financial_security: -15,     // Worried about financial security
                health_concerns: -18          // Vulnerable to health-related scams
            },

            // Multipliers for different manipulation tactics
            manipulation_multipliers: {
                loneliness_exploitation: 2.0, // Highly effective
                authority_impersonation: 1.6, // Very effective
                health_scare: 1.7,           // Very effective
                financial_fear: 1.5,         // Highly effective
                technical_confusion: 1.8,    // Very effective
                urgency_pressure: 1.4        // Effective
            },

            // Context-specific modifiers
            context_modifiers: {
                phone_call: {
                    trust_penalty: -15,
                    verification_bonus: +30,
                    red_flag_sensitivity: 0.6
                },
                email: {
                    trust_penalty: -20,
                    verification_bonus: +25,
                    red_flag_sensitivity: 0.7
                },
                social_media: {
                    trust_penalty: -25,
                    verification_bonus: +35,
                    red_flag_sensitivity: 0.5
                },
                in_person: {
                    trust_penalty: -10,
                    verification_bonus: +20,
                    red_flag_sensitivity: 0.8
                }
            },

            // Recovery characteristics
            recovery_profile: {
                base_rate: 0.8,               // Slower recovery due to age
                isolation_penalty: 0.6,       // Much slower when isolated
                family_support_bonus: 1.4,    // Significant improvement with family help
                education_bonus: 0.9          // Slightly slower learning curve
            },

            // Scenario-specific vulnerabilities
            scenario_vulnerabilities: {
                'tech_support_scam': {
                    description: 'Fake technical support call or popup',
                    base_trust: 25,
                    vulnerability_factors: ['computer_problems', 'urgent_fix_needed', 'official_sounding']
                },
                'government_impersonation': {
                    description: 'Scammer impersonating government agency',
                    base_trust: 20,
                    vulnerability_factors: ['official_language', 'legal_threats', 'immediate_action_required']
                },
                'health_insurance_scam': {
                    description: 'Fake health insurance or Medicare offers',
                    base_trust: 30,
                    vulnerability_factors: ['health_concerns', 'cost_savings', 'limited_time_offer']
                },
                'companionship_scam': {
                    description: 'Romance or friendship scam targeting loneliness',
                    base_trust: 35,
                    vulnerability_factors: ['shared_interests', 'emotional_connection', 'understanding_listener']
                }
            },

            // Learning objectives specific to Stanley's scenarios
            learning_objectives: {
                recognition: [
                    'Identify government impersonation scams',
                    'Recognize tech support fraud',
                    'Spot health insurance scams'
                ],
                analysis: [
                    'Understand authority manipulation tactics',
                    'Analyze technical confusion exploitation',
                    'Evaluate official communication legitimacy'
                ],
                synthesis: [
                    'Apply verification techniques for official contacts',
                    'Develop healthy skepticism toward unsolicited offers',
                    'Build confidence in technology use'
                ]
            }
        };
    }

    /**
     * Get character profile by name
     * @param {string} character - Character name
     * @returns {object} Character profile
     */
    getProfile(character) {
        return this.profiles[character] || null;
    }

    /**
     * Get baseline trust adjustment for character and context
     * @param {string} character - Character name
     * @param {string} context - Context type
     * @returns {number} Trust adjustment
     */
    getBaselineAdjustment(character, context) {
        const profile = this.getProfile(character);
        if (!profile) return 0;
        
        return profile.baseline_adjustments[context] || 0;
    }

    /**
     * Get manipulation multiplier for character and tactic
     * @param {string} character - Character name
     * @param {string} tactic - Manipulation tactic
     * @returns {number} Multiplier value
     */
    getManipulationMultiplier(character, tactic) {
        const profile = this.getProfile(character);
        if (!profile) return 1.0;
        
        return profile.manipulation_multipliers[tactic] || 1.0;
    }

    /**
     * Get context modifier for character and context
     * @param {string} character - Character name
     * @param {string} context - Context type
     * @returns {object} Context modifier object
     */
    getContextModifier(character, context) {
        const profile = this.getProfile(character);
        if (!profile) return { trust_penalty: 0, verification_bonus: 0, red_flag_sensitivity: 1.0 };
        
        return profile.context_modifiers[context] || { trust_penalty: 0, verification_bonus: 0, red_flag_sensitivity: 1.0 };
    }

    /**
     * Get recovery rate for character and context
     * @param {string} character - Character name
     * @param {object} context - Current context
     * @returns {number} Recovery rate multiplier
     */
    getRecoveryRate(character, context) {
        const profile = this.getProfile(character);
        if (!profile) return 1.0;
        
        let rate = profile.recovery_profile.base_rate;
        
        // Apply context-specific modifiers
        if (context.emotional_investment && character === 'maya') {
            rate *= profile.recovery_profile.emotional_context_penalty;
        }
        
        if (context.community_support && character === 'eli') {
            rate *= profile.recovery_profile.community_support_bonus;
        }
        
        if (context.isolation_level > 0.5 && character === 'stanley') {
            rate *= profile.recovery_profile.isolation_penalty;
        }
        
        if (context.has_support_system) {
            rate *= (profile.recovery_profile.support_system_bonus || profile.recovery_profile.family_support_bonus || 1.0);
        }
        
        return rate;
    }

    /**
     * Get scenario vulnerability info
     * @param {string} character - Character name
     * @param {string} scenario - Scenario type
     * @returns {object} Scenario vulnerability data
     */
    getScenarioVulnerability(character, scenario) {
        const profile = this.getProfile(character);
        if (!profile) return null;
        
        return profile.scenario_vulnerabilities[scenario] || null;
    }

    /**
     * Get learning objectives for character
     * @param {string} character - Character name
     * @param {string} level - Learning level (recognition, analysis, synthesis)
     * @returns {array} Learning objectives
     */
    getLearningObjectives(character, level = null) {
        const profile = this.getProfile(character);
        if (!profile) return [];
        
        if (level) {
            return profile.learning_objectives[level] || [];
        }
        
        return profile.learning_objectives;
    }

    /**
     * Calculate character-specific trust impact
     * @param {string} character - Character name
     * @param {string} action - Action taken
     * @param {object} context - Current context
     * @param {number} currentScore - Current trust score
     * @returns {object} Trust impact calculation
     */
    calculateCharacterTrustImpact(character, action, context, currentScore) {
        const profile = this.getProfile(character);
        if (!profile) {
            return { delta: 0, reasoning: 'Unknown character' };
        }

        let impact = 0;
        let reasoning = [];

        // Apply baseline adjustments
        const baselineKey = this.mapContextToBaseline(context.type);
        if (baselineKey && profile.baseline_adjustments[baselineKey]) {
            impact += profile.baseline_adjustments[baselineKey];
            reasoning.push(`Baseline ${baselineKey}: ${profile.baseline_adjustments[baselineKey]}`);
        }

        // Apply manipulation multipliers
        const tacticKey = this.mapActionToTactic(action);
        if (tacticKey && profile.manipulation_multipliers[tacticKey]) {
            impact *= profile.manipulation_multipliers[tacticKey];
            reasoning.push(`${tacticKey} multiplier: ${profile.manipulation_multipliers[tacticKey]}x`);
        }

        // Apply context modifiers
        const contextMod = this.getContextModifier(character, context.platform || context.type);
        if (contextMod.trust_penalty) {
            impact += contextMod.trust_penalty;
            reasoning.push(`Context penalty: ${contextMod.trust_penalty}`);
        }

        return {
            delta: Math.round(impact),
            reasoning: reasoning,
            profile_applied: character
        };
    }

    /**
     * Map context type to baseline adjustment key
     * @param {string} contextType - Context type
     * @returns {string} Baseline key
     */
    mapContextToBaseline(contextType) {
        const mapping = {
            'romantic': 'romantic_context',
            'gaming': 'peer_pressure',
            'financial': 'financial_request',
            'authority': 'authority_appeal',
            'technical': 'tech_confusion',
            'social': 'community_trust'
        };
        
        return mapping[contextType] || null;
    }

    /**
     * Map action to manipulation tactic
     * @param {string} action - Action taken
     * @returns {string} Tactic key
     */
    mapActionToTactic(action) {
        const mapping = {
            'trust_stranger': 'emotional_manipulation',
            'share_personal_info': 'social_proof',
            'send_money': 'financial_pressure',
            'click_link': 'technical_confusion',
            'accept_offer': 'rare_item_offers',
            'meet_person': 'peer_pressure',
            'follow_authority': 'authority_pressure'
        };
        
        return mapping[action] || null;
    }

    /**
     * Get all character names
     * @returns {array} Character names
     */
    getCharacterNames() {
        return Object.keys(this.profiles);
    }

    /**
     * Validate character profile completeness
     * @param {string} character - Character name
     * @returns {object} Validation result
     */
    validateProfile(character) {
        const profile = this.getProfile(character);
        if (!profile) {
            return { valid: false, errors: ['Character not found'] };
        }

        const requiredFields = [
            'character', 'age_group', 'primary_context',
            'baseline_adjustments', 'manipulation_multipliers',
            'context_modifiers', 'recovery_profile',
            'scenario_vulnerabilities', 'learning_objectives'
        ];

        const errors = [];
        requiredFields.forEach(field => {
            if (!profile[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        });

        return {
            valid: errors.length === 0,
            errors: errors,
            profile: profile
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterTrustProfiles;
} else if (typeof window !== 'undefined') {
    window.CharacterTrustProfiles = CharacterTrustProfiles;
}