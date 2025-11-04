/**
 * Character-Specific Real-Time Scenarios
 * Implements detailed real-time scenarios for Maya, Eli, and Stanley
 * Requirements: 12.2, 12.3, 12.4, 12.5, 12.6
 */

class CharacterRealTimeScenarios {
    constructor() {
        this.scenarios = new Map();
        this.initialized = false;
        
        // Initialize character-specific scenarios
        this.initializeScenarios();
    }

    /**
     * Initialize all character-specific scenarios
     */
    initializeScenarios() {
        this.initializeMayaScenarios();
        this.initializeEliScenarios();
        this.initializeStanleyScenarios();
        
        this.initialized = true;
        console.log('📱 Character Real-Time Scenarios initialized');
    }

    /**
     * Initialize Maya's romance scam and catfish scenarios
     */
    initializeMayaScenarios() {
        // Maya Scenario 1: Romance Scam Detection
        this.addScenario('romance_scam_detection', 'maya', {
            id: 'maya_romance_scam_realtime',
            title: 'Emergency Romance Scam',
            description: 'Your online match is claiming a medical emergency and needs immediate financial help.',
            urgencyLevel: 'high',
            timeLimit: 20,
            threatType: 'romance_fraud',
            phases: [
                {
                    id: 'initial_contact',
                    title: 'Urgent Message Received',
                    description: 'Your match "Alex" sent a frantic message about being in a hospital abroad and needing money for treatment.',
                    timeAllowed: 8,
                    context: {
                        message: "Maya, I'm in the hospital in London. My wallet was stolen and I need $2000 for emergency surgery. Can you help? I'll pay you back as soon as I get home. Please hurry, they won't treat me without payment!",
                        profile_inconsistencies: ['Says from New York but now in London', 'No previous mention of travel', 'Professional photos but claims to be broke'],
                        red_flags: ['Urgent financial request', 'Emotional manipulation', 'Vague medical details']
                    },
                    decisions: [
                        {
                            id: 'verify_identity',
                            text: 'Demand video call verification before any help',
                            correctness: 'optimal',
                            consequences: { scam_detection: +3, safety_awareness: +2 },
                            explanation: 'Always verify identity before financial assistance, especially in emergencies'
                        },
                        {
                            id: 'ask_details',
                            text: 'Ask for specific hospital details and documentation',
                            correctness: 'acceptable',
                            consequences: { verification_attempt: +2, caution: +1 },
                            explanation: 'Requesting details is good, but scammers often have fake documentation ready'
                        },
                        {
                            id: 'send_money',
                            text: 'Send money immediately to help',
                            correctness: 'dangerous',
                            consequences: { financial_loss: -3, vulnerability: +2 },
                            explanation: 'Sending money without verification is extremely risky and likely a scam'
                        }
                    ]
                },
                {
                    id: 'escalation',
                    title: 'Pressure Intensifies',
                    description: 'Alex becomes more desperate and starts using emotional manipulation tactics.',
                    timeAllowed: 12,
                    context: {
                        escalation_message: "Maya, please! I thought you cared about me. The doctors are threatening to discharge me. I'm scared and alone. You're the only person I can trust. I promise I'll make it up to you.",
                        manipulation_tactics: ['Guilt tripping', 'Isolation claims', 'Trust exploitation', 'Fear induction'],
                        warning_signs: ['Emotional blackmail', 'Urgency pressure', 'Trust manipulation']
                    },
                    decisions: [
                        {
                            id: 'block_contact',
                            text: 'Block the contact and report as scam',
                            correctness: 'optimal',
                            consequences: { scam_prevention: +3, self_protection: +2 },
                            explanation: 'Blocking and reporting protects you and helps prevent others from being scammed'
                        },
                        {
                            id: 'demand_proof',
                            text: 'Demand hospital contact information for verification',
                            correctness: 'acceptable',
                            consequences: { verification_skills: +2, persistence: +1 },
                            explanation: 'Demanding proof is good, but be prepared for fake documentation'
                        },
                        {
                            id: 'compromise_offer',
                            text: 'Offer to send a smaller amount',
                            correctness: 'poor',
                            consequences: { partial_loss: -1, continued_vulnerability: +1 },
                            explanation: 'Any money sent to scammers is lost and encourages further attempts'
                        }
                    ]
                }
            ],
            educationalGoals: [
                'Recognize romance scam urgency tactics',
                'Understand emotional manipulation in online relationships',
                'Learn proper verification methods for online contacts',
                'Develop resistance to guilt-based manipulation'
            ],
            realWorldMapping: 'Romance scams cost victims an average of $2,600 each, with emergency scenarios being the most common tactic'
        });

        // Maya Scenario 2: Catfish Identification
        this.addScenario('catfish_identification', 'maya', {
            id: 'maya_catfish_realtime',
            title: 'Suspicious Profile Investigation',
            description: 'Multiple red flags suggest your match might be using a fake identity. You need to investigate quickly.',
            urgencyLevel: 'medium',
            timeLimit: 25,
            threatType: 'identity_fraud',
            phases: [
                {
                    id: 'profile_analysis',
                    title: 'Profile Red Flags Detected',
                    description: 'You notice several inconsistencies in your match\'s profile and behavior patterns.',
                    timeAllowed: 10,
                    context: {
                        profile_issues: [
                            'Only professional-quality photos',
                            'Refuses video calls with various excuses',
                            'Stories about job and location keep changing',
                            'Limited social media presence with recent creation date'
                        ],
                        behavioral_flags: [
                            'Avoids specific questions about local area',
                            'Photos seem too perfect/professional',
                            'Quick to move conversation off dating platform'
                        ]
                    },
                    decisions: [
                        {
                            id: 'reverse_image_search',
                            text: 'Perform reverse image search on profile photos',
                            correctness: 'optimal',
                            consequences: { investigation_skills: +3, catfish_detection: +2 },
                            explanation: 'Reverse image search is the most effective way to detect stolen photos'
                        },
                        {
                            id: 'confront_directly',
                            text: 'Confront them about the inconsistencies',
                            correctness: 'acceptable',
                            consequences: { directness: +1, potential_alert: -1 },
                            explanation: 'Direct confrontation may cause catfish to become more careful or disappear'
                        },
                        {
                            id: 'ignore_flags',
                            text: 'Give them benefit of the doubt',
                            correctness: 'poor',
                            consequences: { vulnerability: +2, missed_detection: +1 },
                            explanation: 'Ignoring red flags allows catfish to continue their deception'
                        }
                    ]
                },
                {
                    id: 'verification_attempt',
                    title: 'Identity Verification Challenge',
                    description: 'You decide to test their identity with specific verification requests.',
                    timeAllowed: 15,
                    context: {
                        verification_methods: [
                            'Request live video call',
                            'Ask for photo with specific pose/item',
                            'Ask detailed questions about claimed location',
                            'Request social media connections'
                        ],
                        expected_responses: [
                            'More excuses to avoid video',
                            'Delayed or refused photo requests',
                            'Vague answers about local details',
                            'Claims of privacy concerns'
                        ]
                    },
                    decisions: [
                        {
                            id: 'multiple_verification',
                            text: 'Use multiple verification methods simultaneously',
                            correctness: 'optimal',
                            consequences: { thorough_verification: +3, catfish_exposure: +2 },
                            explanation: 'Multiple verification methods make it impossible for catfish to maintain deception'
                        },
                        {
                            id: 'single_test',
                            text: 'Focus on one verification method',
                            correctness: 'acceptable',
                            consequences: { basic_verification: +2, partial_detection: +1 },
                            explanation: 'Single tests can be circumvented by experienced catfish'
                        },
                        {
                            id: 'accept_excuses',
                            text: 'Accept their excuses and continue relationship',
                            correctness: 'dangerous',
                            consequences: { continued_deception: +2, emotional_investment: +1 },
                            explanation: 'Accepting excuses allows catfish to deepen emotional manipulation'
                        }
                    ]
                }
            ],
            educationalGoals: [
                'Learn to identify catfish warning signs',
                'Master reverse image search techniques',
                'Understand identity verification methods',
                'Recognize excuse patterns used by catfish'
            ],
            realWorldMapping: 'Studies show 1 in 10 dating profiles are fake, with catfish operations often targeting multiple victims simultaneously'
        });

        console.log('💕 Maya real-time scenarios initialized');
    }

    /**
     * Initialize Eli's gaming scam and peer pressure scenarios
     */
    initializeEliScenarios() {
        // Eli Scenario 1: Gaming Scam Prevention
        this.addScenario('gaming_scam_prevention', 'eli', {
            id: 'eli_gaming_scam_realtime',
            title: 'Fake Tournament Alert',
            description: 'A suspicious gaming tournament with huge prizes is pressuring you to register immediately.',
            urgencyLevel: 'high',
            timeLimit: 18,
            threatType: 'gaming_fraud',
            phases: [
                {
                    id: 'tournament_offer',
                    title: 'Suspicious Tournament Invitation',
                    description: 'You received an email about a tournament with a $100,000 prize pool, but registration closes in minutes.',
                    timeAllowed: 8,
                    context: {
                        tournament_details: {
                            prize_pool: '$100,000',
                            entry_fee: '$50',
                            organizer: 'ProGaming Elite (unknown)',
                            registration_deadline: 'Next 10 minutes',
                            requirements: 'Immediate payment and account details'
                        },
                        red_flags: [
                            'Unverified organizer',
                            'Extremely short registration window',
                            'Upfront payment required',
                            'Requests gaming account credentials',
                            'No official gaming platform endorsement'
                        ]
                    },
                    decisions: [
                        {
                            id: 'verify_organizer',
                            text: 'Research the tournament organizer and legitimacy',
                            correctness: 'optimal',
                            consequences: { scam_detection: +3, research_skills: +2 },
                            explanation: 'Legitimate tournaments have verifiable organizers and official endorsements'
                        },
                        {
                            id: 'ask_community',
                            text: 'Ask gaming community about the tournament',
                            correctness: 'acceptable',
                            consequences: { community_verification: +2, social_validation: +1 },
                            explanation: 'Gaming communities often know about legitimate tournaments and can spot scams'
                        },
                        {
                            id: 'register_immediately',
                            text: 'Register quickly to not miss the opportunity',
                            correctness: 'dangerous',
                            consequences: { financial_loss: -2, account_compromise: -1 },
                            explanation: 'Rushing into unverified tournaments often results in financial loss and account theft'
                        }
                    ]
                },
                {
                    id: 'pressure_tactics',
                    title: 'Escalating Pressure',
                    description: 'The organizers are using high-pressure tactics and claiming spots are filling up fast.',
                    timeAllowed: 10,
                    context: {
                        pressure_messages: [
                            'Only 3 spots left!',
                            'This is a once-in-a-lifetime opportunity',
                            'Pro players are already registered',
                            'Registration fee increases in 5 minutes'
                        ],
                        manipulation_tactics: [
                            'Artificial scarcity',
                            'Social proof claims',
                            'Time pressure',
                            'Fear of missing out (FOMO)'
                        ]
                    },
                    decisions: [
                        {
                            id: 'ignore_pressure',
                            text: 'Ignore pressure tactics and continue verification',
                            correctness: 'optimal',
                            consequences: { pressure_resistance: +3, scam_avoidance: +2 },
                            explanation: 'Legitimate tournaments don\'t use high-pressure sales tactics'
                        },
                        {
                            id: 'partial_verification',
                            text: 'Do quick verification while considering registration',
                            correctness: 'acceptable',
                            consequences: { rushed_decision: +1, partial_protection: +1 },
                            explanation: 'Quick verification is better than none, but thorough research is safer'
                        },
                        {
                            id: 'succumb_pressure',
                            text: 'Register due to fear of missing out',
                            correctness: 'poor',
                            consequences: { fomo_vulnerability: +2, hasty_decision: -1 },
                            explanation: 'FOMO is a common manipulation tactic used by scammers'
                        }
                    ]
                }
            ],
            educationalGoals: [
                'Recognize gaming tournament scam tactics',
                'Learn to verify tournament legitimacy',
                'Resist high-pressure sales tactics',
                'Understand FOMO manipulation in gaming contexts'
            ],
            realWorldMapping: 'Gaming fraud increased 60% in recent years, with fake tournaments being a primary attack vector'
        });

        // Eli Scenario 2: Peer Pressure Resistance
        this.addScenario('peer_pressure_resistance', 'eli', {
            id: 'eli_peer_pressure_realtime',
            title: 'Team Account Sharing Pressure',
            description: 'Your gaming team is pressuring you to share account details for "team optimization" before a big match.',
            urgencyLevel: 'medium',
            timeLimit: 22,
            threatType: 'social_engineering',
            phases: [
                {
                    id: 'team_request',
                    title: 'Team Account Sharing Request',
                    description: 'Your team captain says everyone needs to share account details for "performance optimization" before tonight\'s match.',
                    timeAllowed: 10,
                    context: {
                        team_pressure: {
                            captain_message: 'Everyone needs to share login details so I can optimize all accounts for tonight\'s tournament. It\'s standard practice for pro teams.',
                            peer_claims: [
                                'Other team members already shared',
                                'Pro teams always do this',
                                'It\'s just for optimization',
                                'You\'re holding the team back'
                            ]
                        },
                        security_risks: [
                            'Account theft potential',
                            'Cheating accusations',
                            'Permanent account bans',
                            'Loss of game progress and items'
                        ]
                    },
                    decisions: [
                        {
                            id: 'refuse_sharing',
                            text: 'Refuse to share account details and explain security risks',
                            correctness: 'optimal',
                            consequences: { security_awareness: +3, peer_resistance: +2 },
                            explanation: 'Account sharing violates terms of service and creates serious security risks'
                        },
                        {
                            id: 'suggest_alternatives',
                            text: 'Suggest alternative team coordination methods',
                            correctness: 'acceptable',
                            consequences: { problem_solving: +2, compromise_attempt: +1 },
                            explanation: 'Offering alternatives shows team spirit while maintaining security'
                        },
                        {
                            id: 'share_reluctantly',
                            text: 'Share details reluctantly to avoid team conflict',
                            correctness: 'dangerous',
                            consequences: { account_vulnerability: +2, peer_compliance: -1 },
                            explanation: 'Sharing account details can lead to theft, cheating accusations, and bans'
                        }
                    ]
                },
                {
                    id: 'team_confrontation',
                    title: 'Team Confrontation',
                    description: 'The team is getting angry and threatening to replace you if you don\'t comply.',
                    timeAllowed: 12,
                    context: {
                        escalation_tactics: [
                            'Threats of team removal',
                            'Claims you don\'t trust the team',
                            'Accusations of being selfish',
                            'Pressure from other team members'
                        ],
                        manipulation_methods: [
                            'Group pressure',
                            'Loyalty testing',
                            'Isolation threats',
                            'Authority pressure from captain'
                        ]
                    },
                    decisions: [
                        {
                            id: 'stand_firm',
                            text: 'Stand firm on security principles despite pressure',
                            correctness: 'optimal',
                            consequences: { integrity: +3, security_principles: +2 },
                            explanation: 'Maintaining security principles is more important than team approval'
                        },
                        {
                            id: 'seek_mediation',
                            text: 'Suggest involving a gaming platform moderator',
                            correctness: 'acceptable',
                            consequences: { conflict_resolution: +2, external_validation: +1 },
                            explanation: 'External mediation can help resolve conflicts while maintaining security'
                        },
                        {
                            id: 'give_in',
                            text: 'Give in to avoid losing your team position',
                            correctness: 'poor',
                            consequences: { peer_pressure_failure: +2, security_compromise: -2 },
                            explanation: 'Giving in to peer pressure compromises security and enables future manipulation'
                        }
                    ]
                }
            ],
            educationalGoals: [
                'Resist peer pressure in gaming contexts',
                'Understand account sharing risks',
                'Recognize group manipulation tactics',
                'Maintain security principles under pressure'
            ],
            realWorldMapping: 'Account sharing in competitive gaming leads to 40% of account theft cases and permanent bans'
        });

        console.log('🎮 Eli real-time scenarios initialized');
    }

    /**
     * Initialize Stanley's elder fraud and suspicious contact scenarios
     */
    initializeStanleyScenarios() {
        // Stanley Scenario 1: Elder Fraud Prevention
        this.addScenario('elder_fraud_prevention', 'stanley', {
            id: 'stanley_elder_fraud_realtime',
            title: 'Social Security Scam Call',
            description: 'A caller claiming to be from Social Security says your benefits will be suspended unless you act immediately.',
            urgencyLevel: 'critical',
            timeLimit: 15,
            threatType: 'government_impersonation',
            phases: [
                {
                    id: 'scam_call',
                    title: 'Urgent Government Call',
                    description: 'A caller with your partial SSN claims your Social Security benefits will be suspended due to suspicious activity.',
                    timeAllowed: 7,
                    context: {
                        caller_script: 'Mr. Stanley, this is Agent Johnson from Social Security Administration. Your benefits will be suspended in 24 hours due to suspicious activity on your account ending in 1234. We need to verify your information immediately.',
                        pressure_tactics: [
                            'Immediate action required',
                            'Benefit suspension threat',
                            'Has partial personal information',
                            'Official-sounding title and agency'
                        ],
                        red_flags: [
                            'Unsolicited call about benefits',
                            'Immediate verification demanded',
                            'Threats of benefit suspension',
                            'Requests for full SSN verification'
                        ]
                    },
                    decisions: [
                        {
                            id: 'hang_up_verify',
                            text: 'Hang up and call Social Security directly',
                            correctness: 'optimal',
                            consequences: { scam_avoidance: +3, verification_skills: +2 },
                            explanation: 'Government agencies don\'t make unsolicited calls demanding immediate action'
                        },
                        {
                            id: 'ask_verification',
                            text: 'Ask for caller\'s badge number and department',
                            correctness: 'acceptable',
                            consequences: { skepticism: +2, partial_protection: +1 },
                            explanation: 'Asking for verification is good, but scammers often have fake credentials ready'
                        },
                        {
                            id: 'provide_information',
                            text: 'Provide requested information to resolve issue',
                            correctness: 'dangerous',
                            consequences: { identity_theft_risk: +3, financial_vulnerability: +2 },
                            explanation: 'Providing personal information to unverified callers leads to identity theft'
                        }
                    ]
                },
                {
                    id: 'escalation_pressure',
                    title: 'Increased Pressure Tactics',
                    description: 'The caller becomes more aggressive and threatens immediate legal action.',
                    timeAllowed: 8,
                    context: {
                        escalation_script: 'Sir, if you don\'t cooperate immediately, we\'ll have to send federal agents to your address. This is your final warning. Your benefits and Medicare will be suspended permanently.',
                        intimidation_tactics: [
                            'Threats of federal agents',
                            'Legal action warnings',
                            'Medicare suspension threats',
                            'Permanent benefit loss claims'
                        ],
                        psychological_pressure: [
                            'Fear of authority',
                            'Urgency creation',
                            'Catastrophic consequences',
                            'Isolation from help'
                        ]
                    },
                    decisions: [
                        {
                            id: 'document_and_report',
                            text: 'Document call details and report to authorities',
                            correctness: 'optimal',
                            consequences: { scam_reporting: +3, community_protection: +2 },
                            explanation: 'Documenting and reporting helps protect others from the same scam'
                        },
                        {
                            id: 'seek_help',
                            text: 'Ask family member or friend for advice',
                            correctness: 'acceptable',
                            consequences: { support_seeking: +2, verification_attempt: +1 },
                            explanation: 'Getting second opinions helps resist pressure tactics'
                        },
                        {
                            id: 'comply_fear',
                            text: 'Comply due to fear of legal consequences',
                            correctness: 'dangerous',
                            consequences: { fear_manipulation: +2, compliance_vulnerability: +1 },
                            explanation: 'Fear-based compliance is exactly what scammers rely on'
                        }
                    ]
                }
            ],
            educationalGoals: [
                'Recognize government impersonation scams',
                'Understand legitimate government communication methods',
                'Resist authority-based intimidation tactics',
                'Learn proper verification procedures for official contacts'
            ],
            realWorldMapping: 'Government impersonation scams target 3.2 million seniors annually, with Social Security scams being most common'
        });

        // Stanley Scenario 2: Suspicious Contact Assessment
        this.addScenario('suspicious_contact_assessment', 'stanley', {
            id: 'stanley_suspicious_contact_realtime',
            title: 'New Social Media Friend Investigation',
            description: 'A friendly stranger on social media is asking detailed questions about your personal life and routines.',
            urgencyLevel: 'medium',
            timeLimit: 20,
            threatType: 'social_engineering',
            phases: [
                {
                    id: 'friendly_approach',
                    title: 'Overly Friendly New Contact',
                    description: 'A new social media friend is showing unusual interest in your daily routines and personal information.',
                    timeAllowed: 10,
                    context: {
                        suspicious_questions: [
                            'What time do you usually go grocery shopping?',
                            'Do you live alone since your spouse passed?',
                            'What bank do you use for your retirement funds?',
                            'When do you typically leave for doctor appointments?'
                        ],
                        information_gathering: [
                            'Daily routine mapping',
                            'Financial institution probing',
                            'Vulnerability assessment',
                            'Social isolation evaluation'
                        ],
                        warning_signs: [
                            'Excessive personal interest from stranger',
                            'Financial and routine questions',
                            'Rapid friendship development',
                            'Probing for vulnerability indicators'
                        ]
                    },
                    decisions: [
                        {
                            id: 'limit_information',
                            text: 'Limit personal information sharing and assess motives',
                            correctness: 'optimal',
                            consequences: { information_protection: +3, threat_assessment: +2 },
                            explanation: 'Limiting information sharing protects against social engineering attacks'
                        },
                        {
                            id: 'redirect_conversation',
                            text: 'Redirect to general topics and observe behavior',
                            correctness: 'acceptable',
                            consequences: { conversation_control: +2, behavioral_observation: +1 },
                            explanation: 'Redirecting conversation can reveal suspicious motives'
                        },
                        {
                            id: 'share_openly',
                            text: 'Share information freely to be friendly',
                            correctness: 'dangerous',
                            consequences: { information_exposure: +2, vulnerability_increase: +1 },
                            explanation: 'Oversharing with strangers provides information for future scams'
                        }
                    ]
                },
                {
                    id: 'escalated_probing',
                    title: 'Intensified Information Gathering',
                    description: 'The contact becomes more persistent and starts asking about financial details and family.',
                    timeAllowed: 10,
                    context: {
                        financial_probing: [
                            'Questions about retirement savings',
                            'Interest in investment accounts',
                            'Probing about insurance policies',
                            'Questions about property ownership'
                        ],
                        family_mapping: [
                            'Questions about family proximity',
                            'Interest in family financial status',
                            'Probing about family relationships',
                            'Questions about emergency contacts'
                        ],
                        manipulation_tactics: [
                            'Expressing concern for your welfare',
                            'Offering financial advice',
                            'Suggesting investment opportunities',
                            'Creating sense of special friendship'
                        ]
                    },
                    decisions: [
                        {
                            id: 'block_and_report',
                            text: 'Block contact and report suspicious behavior',
                            correctness: 'optimal',
                            consequences: { threat_elimination: +3, reporting_action: +2 },
                            explanation: 'Blocking and reporting prevents further manipulation and protects others'
                        },
                        {
                            id: 'confront_directly',
                            text: 'Confront about suspicious questioning',
                            correctness: 'acceptable',
                            consequences: { direct_confrontation: +2, boundary_setting: +1 },
                            explanation: 'Direct confrontation can deter scammers but may lead to more sophisticated approaches'
                        },
                        {
                            id: 'continue_friendship',
                            text: 'Continue friendship but be more cautious',
                            correctness: 'poor',
                            consequences: { continued_vulnerability: +2, information_risk: +1 },
                            explanation: 'Continuing contact with suspicious individuals maintains vulnerability to manipulation'
                        }
                    ]
                }
            ],
            educationalGoals: [
                'Recognize social engineering information gathering',
                'Understand vulnerability assessment tactics',
                'Learn to protect personal information online',
                'Identify suspicious friendship patterns'
            ],
            realWorldMapping: 'Social engineering attacks on seniors often begin with fake friendships designed to gather information for future scams'
        });

        console.log('👴 Stanley real-time scenarios initialized');
    }

    /**
     * Add a scenario to the database
     * @param {string} scenarioType - Scenario type
     * @param {string} character - Character name
     * @param {Object} scenarioData - Scenario data
     */
    addScenario(scenarioType, character, scenarioData) {
        const key = `${scenarioType}_${character}`;
        this.scenarios.set(key, scenarioData);
    }

    /**
     * Get a scenario by type and character
     * @param {string} scenarioType - Scenario type
     * @param {string} character - Character name
     * @returns {Object|null} Scenario data
     */
    getScenario(scenarioType, character) {
        const key = `${scenarioType}_${character}`;
        return this.scenarios.get(key) || null;
    }

    /**
     * Get all scenarios for a character
     * @param {string} character - Character name
     * @returns {Array} Character scenarios
     */
    getCharacterScenarios(character) {
        const scenarios = [];
        this.scenarios.forEach((scenario, key) => {
            if (key.endsWith(`_${character}`)) {
                scenarios.push(scenario);
            }
        });
        return scenarios;
    }

    /**
     * Get random scenario for character
     * @param {string} character - Character name
     * @returns {Object|null} Random scenario
     */
    getRandomScenario(character) {
        const characterScenarios = this.getCharacterScenarios(character);
        if (characterScenarios.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * characterScenarios.length);
        return characterScenarios[randomIndex];
    }

    /**
     * Get scenarios by urgency level
     * @param {string} urgencyLevel - Urgency level
     * @returns {Array} Matching scenarios
     */
    getScenariosByUrgency(urgencyLevel) {
        const scenarios = [];
        this.scenarios.forEach(scenario => {
            if (scenario.urgencyLevel === urgencyLevel) {
                scenarios.push(scenario);
            }
        });
        return scenarios;
    }

    /**
     * Get scenarios by threat type
     * @param {string} threatType - Threat type
     * @returns {Array} Matching scenarios
     */
    getScenariosByThreatType(threatType) {
        const scenarios = [];
        this.scenarios.forEach(scenario => {
            if (scenario.threatType === threatType) {
                scenarios.push(scenario);
            }
        });
        return scenarios;
    }

    /**
     * Get all available scenario types for a character
     * @param {string} character - Character name
     * @returns {Array} Available scenario types
     */
    getAvailableScenarioTypes(character) {
        const types = new Set();
        this.scenarios.forEach((scenario, key) => {
            if (key.endsWith(`_${character}`)) {
                const scenarioType = key.replace(`_${character}`, '');
                types.add(scenarioType);
            }
        });
        return Array.from(types);
    }

    /**
     * Get scenario statistics
     * @returns {Object} Scenario statistics
     */
    getStatistics() {
        const stats = {
            totalScenarios: this.scenarios.size,
            byCharacter: { maya: 0, eli: 0, stanley: 0 },
            byUrgency: { low: 0, medium: 0, high: 0, critical: 0 },
            byThreatType: {}
        };

        this.scenarios.forEach(scenario => {
            // Count by character
            if (scenario.id.includes('maya')) stats.byCharacter.maya++;
            if (scenario.id.includes('eli')) stats.byCharacter.eli++;
            if (scenario.id.includes('stanley')) stats.byCharacter.stanley++;

            // Count by urgency
            if (stats.byUrgency[scenario.urgencyLevel] !== undefined) {
                stats.byUrgency[scenario.urgencyLevel]++;
            }

            // Count by threat type
            if (!stats.byThreatType[scenario.threatType]) {
                stats.byThreatType[scenario.threatType] = 0;
            }
            stats.byThreatType[scenario.threatType]++;
        });

        return stats;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CharacterRealTimeScenarios };
}

// Make available globally
window.CharacterRealTimeScenarios = CharacterRealTimeScenarios;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.characterRealTimeScenarios) {
            window.characterRealTimeScenarios = new CharacterRealTimeScenarios();
        }
    });
} else {
    if (!window.characterRealTimeScenarios) {
        window.characterRealTimeScenarios = new CharacterRealTimeScenarios();
    }
}