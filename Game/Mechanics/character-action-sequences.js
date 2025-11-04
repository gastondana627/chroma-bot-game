/**
 * Character-Specific Action Sequences
 * Implements domain-specific action mechanics for Maya, Eli, and Stanley
 * with realistic cybersecurity tools and protocols
 */

class CharacterActionSequences {
    constructor(actionController) {
        this.actionController = actionController;
        this.characterDomains = new Map();
        this.scenarioDatabase = new Map();
        this.toolIntegrations = new Map();
        
        this.initializeCharacterDomains();
        this.initializeScenarios();
        this.initializeToolIntegrations();
    }

    /**
     * Initialize character domain configurations
     */
    initializeCharacterDomains() {
        // Maya's romance/dating domain
        this.characterDomains.set('maya', {
            primaryDomain: 'romance_security',
            expertise: ['dating_app_safety', 'romance_scam_detection', 'catfish_identification'],
            commonThreats: ['romance_scams', 'catfishing', 'emotional_manipulation', 'financial_exploitation'],
            responseProtocols: ['evidence_compilation', 'confrontation_preparation', 'victim_support'],
            educationalFocus: 'Protecting emotional and financial well-being in online relationships'
        });

        // Eli's gaming domain
        this.characterDomains.set('eli', {
            primaryDomain: 'gaming_security',
            expertise: ['account_security', 'trade_verification', 'tournament_safety'],
            commonThreats: ['account_takeover', 'gaming_scams', 'peer_pressure_exploitation', 'virtual_asset_theft'],
            responseProtocols: ['rapid_lockdown', 'asset_protection', 'community_warning'],
            educationalFocus: 'Maintaining security while enjoying competitive gaming'
        });

        // Stanley's elder/identity domain
        this.characterDomains.set('stanley', {
            primaryDomain: 'identity_protection',
            expertise: ['identity_theft_response', 'elder_fraud_prevention', 'community_protection'],
            commonThreats: ['identity_theft', 'elder_fraud', 'companionship_scams', 'authority_impersonation'],
            responseProtocols: ['damage_assessment', 'containment_actions', 'community_alerts'],
            educationalFocus: 'Protecting personal identity and helping community members stay safe'
        });
    }

    /**
     * Initialize realistic cybersecurity scenarios
     */
    initializeScenarios() {
        // Maya's Romance Scam Intervention Scenarios
        this.scenarioDatabase.set('maya_romance_intervention_basic', {
            id: 'maya_romance_intervention_basic',
            character: 'maya',
            title: 'Suspicious Dating Profile Investigation',
            description: 'A friend shows you a dating profile that seems too good to be true. Help them investigate.',
            context: {
                urgency: 'medium',
                complexity: 'moderate',
                riskLevel: 'high'
            },
            phases: [
                {
                    id: 'evidence_compilation',
                    scenario: 'Your friend Sarah has been talking to someone online for weeks. The photos look professional, the stories are elaborate, but something feels off.',
                    challenges: [
                        {
                            type: 'reverse_image_search',
                            description: 'Use reverse image search to verify profile photos',
                            tools: ['google_images', 'tineye', 'yandex_images'],
                            successCriteria: 'Find original source of photos or stock photo usage'
                        },
                        {
                            type: 'communication_analysis',
                            description: 'Analyze message patterns and language inconsistencies',
                            tools: ['message_analyzer', 'language_detector', 'pattern_finder'],
                            successCriteria: 'Identify suspicious patterns or inconsistencies'
                        },
                        {
                            type: 'profile_verification',
                            description: 'Cross-reference profile information across platforms',
                            tools: ['social_media_scanner', 'profile_cross_checker', 'verification_tool'],
                            successCriteria: 'Find discrepancies or lack of authentic presence'
                        }
                    ]
                },
                {
                    id: 'confrontation_preparation',
                    scenario: 'Evidence suggests this is a scammer. Help Sarah prepare for a safe confrontation.',
                    challenges: [
                        {
                            type: 'safety_planning',
                            description: 'Create a safety plan for confronting the suspected scammer',
                            tools: ['safety_planner', 'support_network_builder', 'emergency_contacts'],
                            successCriteria: 'Comprehensive safety plan with support network'
                        },
                        {
                            type: 'evidence_organization',
                            description: 'Organize collected evidence for presentation',
                            tools: ['evidence_organizer', 'screenshot_compiler', 'timeline_builder'],
                            successCriteria: 'Clear, organized evidence package'
                        }
                    ]
                },
                {
                    id: 'intervention_execution',
                    scenario: 'Time to help Sarah confront the scammer and protect herself.',
                    challenges: [
                        {
                            type: 'scammer_confrontation',
                            description: 'Guide Sarah through confronting the scammer safely',
                            tools: ['communication_blocker', 'conversation_recorder', 'emotional_support'],
                            successCriteria: 'Safe confrontation with evidence presented'
                        },
                        {
                            type: 'reporting_action',
                            description: 'Report the scammer to appropriate authorities',
                            tools: ['platform_reporter', 'fraud_reporter', 'evidence_submitter'],
                            successCriteria: 'Successful reports filed with evidence'
                        }
                    ]
                }
            ]
        });

        // Eli's Gaming Account Security Scenarios
        this.scenarioDatabase.set('eli_account_security_breach', {
            id: 'eli_account_security_breach',
            character: 'eli',
            title: 'Gaming Account Compromise Response',
            description: 'Your gaming account shows suspicious activity. Respond quickly to secure it.',
            context: {
                urgency: 'high',
                complexity: 'high',
                riskLevel: 'critical'
            },
            phases: [
                {
                    id: 'threat_assessment',
                    scenario: 'You notice unfamiliar login locations and missing items from your gaming inventory.',
                    challenges: [
                        {
                            type: 'login_analysis',
                            description: 'Analyze recent login history for suspicious activity',
                            tools: ['login_analyzer', 'ip_tracker', 'location_mapper'],
                            successCriteria: 'Identify unauthorized access attempts and locations'
                        },
                        {
                            type: 'asset_inventory',
                            description: 'Check gaming assets and inventory for theft',
                            tools: ['inventory_scanner', 'asset_tracker', 'trade_history_analyzer'],
                            successCriteria: 'Complete assessment of stolen or compromised assets'
                        },
                        {
                            type: 'device_verification',
                            description: 'Verify which devices have accessed your account',
                            tools: ['device_checker', 'session_analyzer', 'browser_fingerprinter'],
                            successCriteria: 'Identify all devices and sessions accessing account'
                        }
                    ]
                },
                {
                    id: 'security_lockdown',
                    scenario: 'Unauthorized access confirmed. Implement immediate security lockdown.',
                    challenges: [
                        {
                            type: 'password_security',
                            description: 'Change passwords and enable strong authentication',
                            tools: ['password_generator', 'password_changer', 'strength_tester'],
                            successCriteria: 'Strong, unique password implemented'
                        },
                        {
                            type: 'two_factor_setup',
                            description: 'Configure two-factor authentication on all accounts',
                            tools: ['2fa_configurator', 'authenticator_app', 'backup_codes_generator'],
                            successCriteria: '2FA enabled with secure backup options'
                        },
                        {
                            type: 'session_termination',
                            description: 'Terminate all active sessions and unauthorized access',
                            tools: ['session_killer', 'device_deauthorizer', 'access_revoker'],
                            successCriteria: 'All unauthorized sessions terminated'
                        }
                    ]
                },
                {
                    id: 'recovery_verification',
                    scenario: 'Security measures implemented. Verify account recovery and prevent future attacks.',
                    challenges: [
                        {
                            type: 'account_verification',
                            description: 'Verify complete account control and integrity',
                            tools: ['account_verifier', 'integrity_checker', 'ownership_confirmer'],
                            successCriteria: 'Confirmed complete account control'
                        },
                        {
                            type: 'security_audit',
                            description: 'Audit all security settings and configurations',
                            tools: ['security_auditor', 'settings_scanner', 'vulnerability_checker'],
                            successCriteria: 'All security settings optimized'
                        }
                    ]
                }
            ]
        });

        // Stanley's Identity Theft Response Scenarios
        this.scenarioDatabase.set('stanley_identity_theft_response', {
            id: 'stanley_identity_theft_response',
            character: 'stanley',
            title: 'Identity Theft Emergency Response',
            description: 'You discover someone has been using your identity. Take immediate action to protect yourself and others.',
            context: {
                urgency: 'critical',
                complexity: 'high',
                riskLevel: 'severe'
            },
            phases: [
                {
                    id: 'damage_assessment',
                    scenario: 'You receive a credit alert about accounts you never opened. Assess the full scope of identity theft.',
                    challenges: [
                        {
                            type: 'credit_monitoring',
                            description: 'Check all credit reports for unauthorized accounts',
                            tools: ['credit_report_puller', 'account_scanner', 'credit_analyzer'],
                            successCriteria: 'Complete picture of credit damage identified'
                        },
                        {
                            type: 'financial_audit',
                            description: 'Audit all financial accounts for unauthorized activity',
                            tools: ['bank_scanner', 'transaction_analyzer', 'account_monitor'],
                            successCriteria: 'All unauthorized financial activity documented'
                        },
                        {
                            type: 'identity_verification',
                            description: 'Check where your identity information is being misused',
                            tools: ['identity_scanner', 'ssn_monitor', 'personal_info_tracker'],
                            successCriteria: 'Full scope of identity misuse documented'
                        }
                    ]
                },
                {
                    id: 'containment_actions',
                    scenario: 'Identity theft confirmed across multiple accounts. Implement immediate containment.',
                    challenges: [
                        {
                            type: 'fraud_alerts',
                            description: 'Place fraud alerts on all credit reports',
                            tools: ['fraud_alert_system', 'credit_bureau_notifier', 'alert_manager'],
                            successCriteria: 'Fraud alerts active on all credit reports'
                        },
                        {
                            type: 'account_freezing',
                            description: 'Freeze compromised accounts and credit files',
                            tools: ['account_freezer', 'credit_freezer', 'security_freeze_tool'],
                            successCriteria: 'All vulnerable accounts and credit frozen'
                        },
                        {
                            type: 'document_replacement',
                            description: 'Replace compromised identity documents',
                            tools: ['document_replacer', 'id_renewal_system', 'secure_document_tracker'],
                            successCriteria: 'All compromised documents flagged for replacement'
                        }
                    ]
                },
                {
                    id: 'community_protection',
                    scenario: 'Your identity is secured. Now help protect your community from similar attacks.',
                    challenges: [
                        {
                            type: 'community_warning',
                            description: 'Warn community members about the identity theft method',
                            tools: ['community_alerter', 'warning_broadcaster', 'education_sharer'],
                            successCriteria: 'Community warned about specific threat vector'
                        },
                        {
                            type: 'report_filing',
                            description: 'File comprehensive reports with law enforcement',
                            tools: ['police_reporter', 'ftc_reporter', 'evidence_compiler'],
                            successCriteria: 'Complete reports filed with all evidence'
                        },
                        {
                            type: 'support_network',
                            description: 'Activate support network for ongoing protection',
                            tools: ['support_activator', 'monitoring_network', 'community_protector'],
                            successCriteria: 'Support network activated for continued monitoring'
                        }
                    ]
                }
            ]
        });
    }

    /**
     * Initialize tool integrations for realistic cybersecurity tools
     */
    initializeToolIntegrations() {
        // Maya's Romance Scam Tools
        this.toolIntegrations.set('reverse_image_search', {
            name: 'Reverse Image Search Suite',
            character: 'maya',
            description: 'Search for the original source of profile photos',
            implementation: {
                google_images: 'Search Google Images for photo matches',
                tineye: 'Use TinEye for comprehensive reverse search',
                yandex_images: 'Leverage Yandex for international photo sources'
            },
            educationalValue: 'Learn how scammers steal photos and how to verify authenticity',
            realWorldMapping: 'Actual reverse image search tools used by investigators'
        });

        this.toolIntegrations.set('communication_analysis', {
            name: 'Message Pattern Analyzer',
            character: 'maya',
            description: 'Analyze communication patterns for manipulation tactics',
            implementation: {
                language_inconsistencies: 'Detect grammar and language pattern changes',
                emotional_manipulation: 'Identify emotional pressure tactics',
                urgency_creation: 'Spot artificial urgency and pressure techniques'
            },
            educationalValue: 'Recognize psychological manipulation in digital communications',
            realWorldMapping: 'Techniques used by fraud investigators and psychologists'
        });

        // Eli's Gaming Security Tools
        this.toolIntegrations.set('login_security_analysis', {
            name: 'Gaming Account Security Suite',
            character: 'eli',
            description: 'Comprehensive gaming account security analysis',
            implementation: {
                login_pattern_analysis: 'Analyze login times, locations, and devices',
                session_monitoring: 'Monitor active sessions and unauthorized access',
                trade_verification: 'Verify legitimacy of trades and transactions'
            },
            educationalValue: 'Master gaming account security and threat detection',
            realWorldMapping: 'Security practices used by professional gamers and esports'
        });

        this.toolIntegrations.set('rapid_response_security', {
            name: 'Gaming Emergency Response Kit',
            character: 'eli',
            description: 'Rapid response tools for gaming security incidents',
            implementation: {
                instant_password_change: 'Quickly change passwords across gaming platforms',
                session_termination: 'Immediately terminate all active sessions',
                asset_protection: 'Secure virtual assets and prevent further theft'
            },
            educationalValue: 'Learn incident response for gaming security breaches',
            realWorldMapping: 'Cybersecurity incident response adapted for gaming'
        });

        // Stanley's Identity Protection Tools
        this.toolIntegrations.set('identity_monitoring_suite', {
            name: 'Comprehensive Identity Monitor',
            character: 'stanley',
            description: 'Monitor identity usage across multiple systems',
            implementation: {
                credit_monitoring: 'Real-time credit report and score monitoring',
                ssn_tracking: 'Track Social Security Number usage',
                personal_info_scanning: 'Scan for personal information exposure'
            },
            educationalValue: 'Understand comprehensive identity protection strategies',
            realWorldMapping: 'Tools used by identity theft protection services'
        });

        this.toolIntegrations.set('elder_fraud_protection', {
            name: 'Elder Fraud Prevention Toolkit',
            character: 'stanley',
            description: 'Specialized tools for elder fraud prevention and response',
            implementation: {
                scam_call_detection: 'Identify and block scam phone calls',
                financial_monitoring: 'Monitor for unusual financial activity',
                community_alert_system: 'Alert community about new scam tactics'
            },
            educationalValue: 'Learn specialized elder fraud prevention techniques',
            realWorldMapping: 'Tools and techniques used by elder protection services'
        });
    }

    /**
     * Start a character-specific action sequence
     */
    startCharacterActionSequence(character, sequenceType, context = {}) {
        const domain = this.characterDomains.get(character);
        if (!domain) {
            throw new Error(`Unknown character: ${character}`);
        }

        // Get appropriate scenario
        const scenarioKey = `${character}_${sequenceType}`;
        const scenario = this.scenarioDatabase.get(scenarioKey) || 
                        this.scenarioDatabase.get(`${scenarioKey}_basic`);
        
        if (!scenario) {
            throw new Error(`No scenario found for ${character}_${sequenceType}`);
        }

        // Enhance context with character domain information
        const enhancedContext = {
            ...context,
            domain: domain,
            scenario: scenario,
            educationalFocus: domain.educationalFocus
        };

        // Start the action sequence using the controller
        return this.actionController.startActionSequence(sequenceType, character, enhancedContext);
    }

    /**
     * Get character-specific tool for an action
     */
    getCharacterTool(character, toolType, context = {}) {
        const tools = Array.from(this.toolIntegrations.values())
            .filter(tool => tool.character === character);
        
        // Find most appropriate tool based on context
        const appropriateTool = tools.find(tool => 
            tool.name.toLowerCase().includes(toolType.toLowerCase()) ||
            Object.keys(tool.implementation).some(key => 
                key.toLowerCase().includes(toolType.toLowerCase())
            )
        );

        if (!appropriateTool) {
            return null;
        }

        return {
            ...appropriateTool,
            contextualUsage: this.getContextualUsage(appropriateTool, context),
            effectiveness: this.calculateToolEffectiveness(appropriateTool, context)
        };
    }

    /**
     * Execute character-specific action with domain expertise
     */
    executeCharacterAction(character, action, context = {}) {
        const domain = this.characterDomains.get(character);
        if (!domain) {
            throw new Error(`Unknown character: ${character}`);
        }

        // Validate action against character expertise
        const isExpertiseMatch = domain.expertise.some(expertise => 
            action.type.includes(expertise) || expertise.includes(action.type)
        );

        // Get appropriate tool integration
        const tool = this.getCharacterTool(character, action.toolType, context);
        
        if (!tool) {
            return {
                success: false,
                message: `No appropriate tool found for ${action.toolType}`,
                educationalFeedback: `${character} specializes in ${domain.expertise.join(', ')}`
            };
        }

        // Execute action with character-specific enhancements
        const result = {
            success: true,
            effectiveness: tool.effectiveness,
            tool: tool,
            domainExpertise: isExpertiseMatch,
            educationalFeedback: tool.educationalValue,
            realWorldConnection: tool.realWorldMapping
        };

        // Add character-specific insights
        result.characterInsights = this.generateCharacterInsights(character, action, result);

        return result;
    }

    /**
     * Generate character-specific insights for educational value
     */
    generateCharacterInsights(character, action, result) {
        const domain = this.characterDomains.get(character);
        const insights = [];

        switch (character) {
            case 'maya':
                insights.push(`Maya's experience with dating apps helps identify ${action.type} patterns`);
                insights.push(`Romance scammers often use ${action.toolType} to exploit emotional vulnerabilities`);
                if (result.effectiveness > 0.8) {
                    insights.push('Strong evidence compilation is key to helping scam victims');
                }
                break;

            case 'eli':
                insights.push(`Eli's gaming background provides insight into ${action.type} security`);
                insights.push(`Gaming communities face unique ${action.toolType} challenges`);
                if (result.effectiveness > 0.8) {
                    insights.push('Rapid response prevents asset theft and account compromise');
                }
                break;

            case 'stanley':
                insights.push(`Stanley's experience helps protect against ${action.type} targeting elders`);
                insights.push(`Identity thieves often use ${action.toolType} to exploit trust`);
                if (result.effectiveness > 0.8) {
                    insights.push('Community protection prevents widespread victimization');
                }
                break;
        }

        return insights;
    }

    /**
     * Get contextual usage information for a tool
     */
    getContextualUsage(tool, context) {
        const usage = [];
        
        if (context.urgency === 'high' || context.urgency === 'critical') {
            usage.push('Use rapid response features for immediate threat containment');
        }
        
        if (context.complexity === 'high') {
            usage.push('Employ advanced analysis features for complex scenarios');
        }
        
        if (context.riskLevel === 'severe') {
            usage.push('Activate all available protective measures');
        }

        return usage;
    }

    /**
     * Calculate tool effectiveness based on context
     */
    calculateToolEffectiveness(tool, context) {
        let effectiveness = 0.8; // Base effectiveness
        
        // Context bonuses
        if (context.urgency && ['high', 'critical'].includes(context.urgency)) {
            effectiveness += 0.1; // Bonus for appropriate urgency response
        }
        
        if (context.complexity && tool.implementation) {
            const implementationCount = Object.keys(tool.implementation).length;
            effectiveness += (implementationCount * 0.02); // Bonus for comprehensive tools
        }
        
        return Math.min(effectiveness, 1.0);
    }

    /**
     * Get available action sequences for a character
     */
    getAvailableSequences(character) {
        const domain = this.characterDomains.get(character);
        if (!domain) {
            return [];
        }

        const sequences = Array.from(this.scenarioDatabase.values())
            .filter(scenario => scenario.character === character)
            .map(scenario => ({
                id: scenario.id,
                title: scenario.title,
                description: scenario.description,
                context: scenario.context,
                phases: scenario.phases.length,
                educationalFocus: domain.educationalFocus
            }));

        return sequences;
    }

    /**
     * Get character domain information
     */
    getCharacterDomain(character) {
        return this.characterDomains.get(character);
    }

    /**
     * Get scenario details
     */
    getScenario(scenarioId) {
        return this.scenarioDatabase.get(scenarioId);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterActionSequences;
} else if (typeof window !== 'undefined') {
    window.CharacterActionSequences = CharacterActionSequences;
}