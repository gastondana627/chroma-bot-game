/**
 * Evidence Database Management System
 * Manages evidence storage, retrieval, and organization for investigation scenarios
 */

class EvidenceDatabase {
    constructor() {
        this.evidence = new Map();
        this.scenarios = new Map();
        this.categories = new Map();
        
        // Initialize with default evidence categories
        this.initializeCategories();
        
        // Load default evidence sets
        this.loadDefaultEvidence();
    }

    /**
     * Store evidence in the database
     * @param {Object} evidenceData - Evidence object to store
     * @returns {string} Evidence ID
     */
    storeEvidence(evidenceData) {
        const evidenceId = this.generateEvidenceId();
        const evidence = {
            id: evidenceId,
            ...evidenceData,
            created: Date.now(),
            accessed: 0,
            lastAccessed: null
        };

        this.evidence.set(evidenceId, evidence);
        this.categorizeEvidence(evidenceId, evidence.type);
        
        return evidenceId;
    }

    /**
     * Retrieve evidence by ID
     * @param {string} evidenceId - Evidence identifier
     * @returns {Object|null} Evidence object or null if not found
     */
    getEvidence(evidenceId) {
        const evidence = this.evidence.get(evidenceId);
        if (evidence) {
            evidence.accessed++;
            evidence.lastAccessed = Date.now();
        }
        return evidence;
    }

    /**
     * Get evidence by scenario
     * @param {string} scenarioId - Scenario identifier
     * @returns {Array} Array of evidence objects
     */
    getEvidenceByScenario(scenarioId) {
        const scenario = this.scenarios.get(scenarioId);
        if (!scenario) return [];

        return scenario.evidenceIds.map(id => this.getEvidence(id)).filter(Boolean);
    }

    /**
     * Get evidence by category
     * @param {string} category - Evidence category
     * @returns {Array} Array of evidence objects
     */
    getEvidenceByCategory(category) {
        const categoryData = this.categories.get(category);
        if (!categoryData) return [];

        return categoryData.evidenceIds.map(id => this.getEvidence(id)).filter(Boolean);
    }

    /**
     * Create investigation scenario
     * @param {Object} scenarioConfig - Scenario configuration
     * @returns {string} Scenario ID
     */
    createScenario(scenarioConfig) {
        const scenarioId = this.generateScenarioId();
        const scenario = {
            id: scenarioId,
            character: scenarioConfig.character,
            title: scenarioConfig.title,
            description: scenarioConfig.description,
            difficulty: scenarioConfig.difficulty || 'medium',
            evidenceIds: [],
            objectives: scenarioConfig.objectives || [],
            educationalGoals: scenarioConfig.educationalGoals || [],
            created: Date.now()
        };

        // Store evidence for this scenario
        if (scenarioConfig.evidence) {
            scenarioConfig.evidence.forEach(evidenceData => {
                const evidenceId = this.storeEvidence({
                    ...evidenceData,
                    scenarioId: scenarioId
                });
                scenario.evidenceIds.push(evidenceId);
            });
        }

        this.scenarios.set(scenarioId, scenario);
        return scenarioId;
    }

    /**
     * Get scenario by ID
     * @param {string} scenarioId - Scenario identifier
     * @returns {Object|null} Scenario object or null if not found
     */
    getScenario(scenarioId) {
        return this.scenarios.get(scenarioId);
    }

    /**
     * Get scenarios by character
     * @param {string} character - Character name
     * @returns {Array} Array of scenario objects
     */
    getScenariosByCharacter(character) {
        return Array.from(this.scenarios.values()).filter(
            scenario => scenario.character === character
        );
    }

    /**
     * Search evidence by criteria
     * @param {Object} criteria - Search criteria
     * @returns {Array} Array of matching evidence objects
     */
    searchEvidence(criteria) {
        const results = [];
        
        for (const evidence of this.evidence.values()) {
            if (this.matchesCriteria(evidence, criteria)) {
                results.push(evidence);
            }
        }

        return results;
    }

    /**
     * Initialize evidence categories
     * @private
     */
    initializeCategories() {
        const categories = [
            'digital_communication',
            'profile_data',
            'image_evidence',
            'document_evidence',
            'network_data',
            'metadata',
            'behavioral_pattern',
            'financial_record',
            'social_media',
            'gaming_data'
        ];

        categories.forEach(category => {
            this.categories.set(category, {
                name: category,
                evidenceIds: [],
                description: this.getCategoryDescription(category)
            });
        });
    }

    /**
     * Load default evidence sets for each character
     * @private
     */
    loadDefaultEvidence() {
        // Maya's dating/romance scam evidence
        this.createScenario({
            character: 'maya',
            title: 'Suspicious Dating Profile Investigation',
            description: 'Investigate a potentially fake dating profile with multiple red flags',
            difficulty: 'medium',
            evidence: [
                {
                    type: 'profile_data',
                    title: 'Dating Profile',
                    content: {
                        name: 'Alex Johnson',
                        age: 28,
                        profession: 'Military Engineer',
                        photos: ['profile1.jpg', 'profile2.jpg'],
                        bio: 'Looking for serious relationship. Currently deployed overseas.'
                    },
                    profile: {
                        consistent: false,
                        verified: false,
                        anomalies: ['Military claims without verification', 'Professional photos'],
                        suspicious: ['Deployment story', 'Limited personal details']
                    },
                    metadata: {
                        created: '2024-01-15',
                        location: 'Unknown',
                        device: 'Unknown',
                        suspicious: ['No location data', 'Generic device info']
                    }
                },
                {
                    type: 'image_evidence',
                    title: 'Profile Photos',
                    content: {
                        images: ['military_uniform.jpg', 'casual_photo.jpg'],
                        quality: 'Professional'
                    },
                    reverseSearch: {
                        source: 'Stock photo website',
                        duplicates: 15,
                        firstSeen: '2020-03-10',
                        contexts: ['Dating sites', 'Social media', 'Romance scams'],
                        suspicious: ['Multiple dating profiles', 'Stock photo origin']
                    }
                },
                {
                    type: 'digital_communication',
                    title: 'Chat Messages',
                    content: {
                        messages: [
                            'Hello beautiful, I saw your profile and felt instant connection',
                            'I am military engineer deployed in Syria, looking for true love',
                            'Can you help me with small financial emergency? Will pay back soon'
                        ]
                    },
                    communication: {
                        patterns: ['Love bombing', 'Sob story', 'Financial request'],
                        urgency: 'high',
                        tactics: ['Emotional manipulation', 'False emergency'],
                        authentic: false,
                        suspicious: ['Quick progression to love', 'Financial request', 'Military deployment story']
                    }
                }
            ],
            objectives: [
                {
                    id: 'verify_identity',
                    description: 'Verify the authenticity of the dating profile',
                    requiredEvidence: ['profile_data', 'image_evidence'],
                    successCriteria: { accuracy: 80 }
                },
                {
                    id: 'identify_scam_tactics',
                    description: 'Identify social engineering tactics used',
                    requiredEvidence: ['digital_communication'],
                    successCriteria: { tactics_identified: 3 }
                }
            ],
            educationalGoals: [
                'Recognize fake dating profiles',
                'Identify romance scam tactics',
                'Learn reverse image search techniques'
            ]
        });

        // Eli's gaming fraud evidence
        this.createScenario({
            character: 'eli',
            title: 'Gaming Account Takeover Investigation',
            description: 'Investigate suspicious activity on gaming accounts and trading platforms',
            difficulty: 'medium',
            evidence: [
                {
                    type: 'gaming_data',
                    title: 'Account Activity Log',
                    content: {
                        account: 'ProGamer2024',
                        recentLogins: [
                            { time: '2024-01-20 03:00', location: 'Russia', ip: '185.220.101.5' },
                            { time: '2024-01-20 15:30', location: 'USA', ip: '192.168.1.100' }
                        ],
                        trades: [
                            { item: 'Rare Skin', value: '$500', buyer: 'QuickCash99' },
                            { item: 'Tournament Pass', value: '$200', buyer: 'FastTrade2024' }
                        ]
                    },
                    network: {
                        ip: '185.220.101.5',
                        location: 'Moscow, Russia',
                        provider: 'Unknown VPN',
                        reputation: 'suspicious',
                        suspicious: ['VPN usage', 'Known fraud IP range', 'Unusual location']
                    }
                },
                {
                    type: 'digital_communication',
                    title: 'Trading Messages',
                    content: {
                        messages: [
                            'Hey bro, want to trade rare skins? I give you good deal!',
                            'Send me your items first, I am trusted trader with many vouches',
                            'Hurry up! This offer expires in 10 minutes!'
                        ]
                    },
                    communication: {
                        patterns: ['Urgency creation', 'Trust claims', 'Advance fee'],
                        urgency: 'high',
                        tactics: ['False scarcity', 'Social proof claims'],
                        authentic: false,
                        suspicious: ['Pressure tactics', 'Unverified trust claims', 'Advance payment request']
                    }
                },
                {
                    type: 'profile_data',
                    title: 'Trader Profile',
                    content: {
                        username: 'TrustedTrader2024',
                        reputation: '5 stars (50 reviews)',
                        joinDate: '2024-01-01',
                        trades: 'Over 1000 successful trades'
                    },
                    profile: {
                        consistent: false,
                        verified: false,
                        anomalies: ['New account with high reputation', 'Generic reviews'],
                        suspicious: ['Account age vs reputation mismatch', 'Fake review patterns']
                    }
                }
            ],
            objectives: [
                {
                    id: 'detect_account_compromise',
                    description: 'Identify signs of account compromise',
                    requiredEvidence: ['gaming_data', 'network_data'],
                    successCriteria: { indicators_found: 3 }
                },
                {
                    id: 'identify_trading_scam',
                    description: 'Recognize trading scam tactics',
                    requiredEvidence: ['digital_communication', 'profile_data'],
                    successCriteria: { scam_indicators: 4 }
                }
            ],
            educationalGoals: [
                'Recognize account takeover signs',
                'Identify gaming scam tactics',
                'Learn secure trading practices'
            ]
        });

        // Stanley's identity theft evidence
        this.createScenario({
            character: 'stanley',
            title: 'Identity Theft Investigation',
            description: 'Investigate suspicious documents and communications targeting seniors',
            difficulty: 'medium',
            evidence: [
                {
                    type: 'document_evidence',
                    title: 'Government Letter',
                    content: {
                        sender: 'Social Security Administration',
                        subject: 'Urgent: Account Verification Required',
                        content: 'Your benefits will be suspended unless you verify your information immediately'
                    },
                    document: {
                        authentic: false,
                        issuer: 'Fake government agency',
                        marks: ['Missing official seal', 'Incorrect formatting'],
                        altered: true,
                        suspicious: ['Urgency language', 'Unofficial contact methods', 'Spelling errors']
                    }
                },
                {
                    type: 'digital_communication',
                    title: 'Phone Call Transcript',
                    content: {
                        caller: 'Medicare Representative',
                        message: 'This is urgent call about your Medicare benefits. We need to verify your Social Security number to prevent suspension.'
                    },
                    communication: {
                        patterns: ['Authority impersonation', 'Urgency creation', 'Information harvesting'],
                        urgency: 'critical',
                        tactics: ['Fear tactics', 'False authority'],
                        authentic: false,
                        suspicious: ['Unsolicited call', 'SSN request', 'Threat of suspension']
                    }
                },
                {
                    type: 'financial_record',
                    title: 'Bank Statement Anomaly',
                    content: {
                        transactions: [
                            { date: '2024-01-18', amount: '$50', description: 'Medicare Verification Fee' },
                            { date: '2024-01-19', amount: '$200', description: 'Account Protection Service' }
                        ]
                    },
                    metadata: {
                        suspicious: ['Unusual charges', 'Non-standard descriptions', 'Unauthorized transactions']
                    }
                }
            ],
            objectives: [
                {
                    id: 'verify_document_authenticity',
                    description: 'Determine if government documents are authentic',
                    requiredEvidence: ['document_evidence'],
                    successCriteria: { authenticity_determined: true }
                },
                {
                    id: 'identify_elder_fraud',
                    description: 'Recognize elder fraud tactics',
                    requiredEvidence: ['digital_communication', 'financial_record'],
                    successCriteria: { fraud_indicators: 5 }
                }
            ],
            educationalGoals: [
                'Recognize fake government documents',
                'Identify elder fraud tactics',
                'Learn verification procedures'
            ]
        });
    }

    /**
     * Generate unique evidence ID
     * @private
     */
    generateEvidenceId() {
        return 'evidence_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate unique scenario ID
     * @private
     */
    generateScenarioId() {
        return 'scenario_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Categorize evidence by type
     * @private
     */
    categorizeEvidence(evidenceId, type) {
        const category = this.categories.get(type);
        if (category) {
            category.evidenceIds.push(evidenceId);
        }
    }

    /**
     * Check if evidence matches search criteria
     * @private
     */
    matchesCriteria(evidence, criteria) {
        for (const [key, value] of Object.entries(criteria)) {
            if (key === 'type' && evidence.type !== value) return false;
            if (key === 'character' && evidence.scenarioId) {
                const scenario = this.scenarios.get(evidence.scenarioId);
                if (scenario && scenario.character !== value) return false;
            }
            if (key === 'title' && !evidence.title.toLowerCase().includes(value.toLowerCase())) return false;
        }
        return true;
    }

    /**
     * Get category description
     * @private
     */
    getCategoryDescription(category) {
        const descriptions = {
            'digital_communication': 'Messages, emails, and chat logs',
            'profile_data': 'User profiles and account information',
            'image_evidence': 'Photos and visual evidence',
            'document_evidence': 'Official documents and certificates',
            'network_data': 'IP addresses and network information',
            'metadata': 'File and system metadata',
            'behavioral_pattern': 'User behavior and activity patterns',
            'financial_record': 'Financial transactions and records',
            'social_media': 'Social media posts and interactions',
            'gaming_data': 'Gaming accounts and activity logs'
        };
        return descriptions[category] || 'Evidence category';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EvidenceDatabase };
} else if (typeof window !== 'undefined') {
    window.EvidenceDatabase = EvidenceDatabase;
}