/**
 * Narrative Branching System
 * Implements dynamic story branching based on player choices and mode selection
 * Tracks story branches, visualizes consequences, and generates educational summaries
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */

class NarrativeBranchingSystem {
    constructor(storyTracker, decisionSystem) {
        this.storyTracker = storyTracker;
        this.decisionSystem = decisionSystem;
        
        // Story branch tracking
        this.storyBranches = new Map();
        this.branchHistory = [];
        this.currentBranch = null;
        
        // Branch templates and outcomes
        this.branchTemplates = new Map();
        this.outcomeDatabase = new Map();
        
        // Educational summary system
        this.educationalSummaries = new Map();
        this.impactAnalyzer = new ImpactAnalyzer();
        
        // Dashboard integration
        this.dashboardIntegration = new DashboardIntegration();
        
        // Initialize branch templates
        this.initializeBranchTemplates();
        
        // Bind methods
        this.trackBranch = this.trackBranch.bind(this);
        this.generateEducationalSummary = this.generateEducationalSummary.bind(this);
        this.visualizeConsequences = this.visualizeConsequences.bind(this);
    }

    /**
     * Initialize story branch templates for each character
     */
    initializeBranchTemplates() {
        // Guardian mode branches - positive cybersecurity outcomes
        this.registerBranchTemplate('guardian', 'eli', {
            id: 'eli_guardian_path',
            name: 'Gaming Guardian Path',
            description: 'Eli learns to protect himself and others in gaming environments',
            branches: {
                security_focused: {
                    name: 'Security-First Gaming',
                    description: 'Prioritizes account security and safe gaming practices',
                    outcomes: ['secure_gaming_setup', 'peer_education', 'tournament_safety'],
                    educationalGoals: ['account_security', 'social_engineering_awareness', 'community_protection']
                },
                community_leader: {
                    name: 'Gaming Community Leader',
                    description: 'Becomes a leader in promoting safe gaming practices',
                    outcomes: ['community_leadership', 'scam_prevention', 'mentor_role'],
                    educationalGoals: ['leadership_skills', 'community_safety', 'peer_influence']
                },
                balanced_approach: {
                    name: 'Balanced Gaming Approach',
                    description: 'Balances competitive gaming with security awareness',
                    outcomes: ['competitive_success', 'security_awareness', 'healthy_gaming'],
                    educationalGoals: ['risk_assessment', 'balanced_decision_making', 'sustainable_practices']
                }
            }
        });

        this.registerBranchTemplate('guardian', 'maya', {
            id: 'maya_guardian_path',
            name: 'Dating Safety Guardian Path',
            description: 'Maya becomes an expert in online dating safety and helps others',
            branches: {
                investigation_expert: {
                    name: 'Digital Investigation Expert',
                    description: 'Masters digital forensics for dating safety',
                    outcomes: ['forensics_mastery', 'scam_detection', 'evidence_compilation'],
                    educationalGoals: ['digital_forensics', 'evidence_analysis', 'verification_techniques']
                },
                community_protector: {
                    name: 'Community Safety Advocate',
                    description: 'Protects others from romance scams and manipulation',
                    outcomes: ['victim_support', 'scam_reporting', 'awareness_campaigns'],
                    educationalGoals: ['victim_advocacy', 'community_education', 'prevention_strategies']
                },
                relationship_counselor: {
                    name: 'Safe Relationship Guide',
                    description: 'Helps others build healthy, secure online relationships',
                    outcomes: ['healthy_relationships', 'trust_building', 'communication_skills'],
                    educationalGoals: ['relationship_safety', 'communication_security', 'trust_verification']
                }
            }
        });

        this.registerBranchTemplate('guardian', 'stanley', {
            id: 'stanley_guardian_path',
            name: 'Elder Protection Guardian Path',
            description: 'Stanley becomes a champion for elder cybersecurity protection',
            branches: {
                identity_guardian: {
                    name: 'Identity Protection Expert',
                    description: 'Specializes in preventing identity theft and fraud',
                    outcomes: ['identity_protection', 'fraud_prevention', 'security_systems'],
                    educationalGoals: ['identity_security', 'fraud_detection', 'protection_systems']
                },
                community_educator: {
                    name: 'Community Cybersecurity Educator',
                    description: 'Educates other seniors about digital safety',
                    outcomes: ['peer_education', 'workshop_leadership', 'safety_networks'],
                    educationalGoals: ['peer_teaching', 'community_building', 'knowledge_sharing']
                },
                family_protector: {
                    name: 'Family Digital Safety Leader',
                    description: 'Protects family members from various cyber threats',
                    outcomes: ['family_security', 'intergenerational_teaching', 'protective_measures'],
                    educationalGoals: ['family_safety', 'cross_generational_education', 'protective_strategies']
                }
            }
        });

        // Shadow Observer mode branches - demonstrate cybersecurity failures
        this.registerBranchTemplate('shadow_observer', 'eli', {
            id: 'eli_shadow_path',
            name: 'Gaming Exploitation Path',
            description: 'Demonstrates how gaming vulnerabilities can be exploited',
            branches: {
                account_compromise: {
                    name: 'Account Takeover Scenario',
                    description: 'Shows consequences of poor account security',
                    outcomes: ['account_loss', 'financial_damage', 'reputation_harm'],
                    educationalGoals: ['account_security_importance', 'two_factor_authentication', 'password_management']
                },
                social_manipulation: {
                    name: 'Gaming Community Manipulation',
                    description: 'Demonstrates social engineering in gaming contexts',
                    outcomes: ['peer_exploitation', 'scam_victimization', 'community_harm'],
                    educationalGoals: ['social_engineering_recognition', 'peer_pressure_resistance', 'community_verification']
                },
                financial_exploitation: {
                    name: 'Gaming Financial Scams',
                    description: 'Shows how gaming can lead to financial exploitation',
                    outcomes: ['financial_loss', 'gambling_addiction', 'debt_accumulation'],
                    educationalGoals: ['financial_safety', 'gambling_awareness', 'spending_controls']
                }
            }
        });

        this.registerBranchTemplate('shadow_observer', 'maya', {
            id: 'maya_shadow_path',
            name: 'Romance Scam Victim Path',
            description: 'Demonstrates the progression and impact of romance scams',
            branches: {
                emotional_manipulation: {
                    name: 'Emotional Exploitation Scenario',
                    description: 'Shows how emotional manipulation progresses',
                    outcomes: ['emotional_damage', 'isolation', 'trust_destruction'],
                    educationalGoals: ['emotional_manipulation_recognition', 'healthy_boundaries', 'support_systems']
                },
                financial_exploitation: {
                    name: 'Financial Romance Scam',
                    description: 'Demonstrates financial exploitation through fake relationships',
                    outcomes: ['financial_loss', 'debt_creation', 'family_impact'],
                    educationalGoals: ['financial_boundaries', 'verification_importance', 'scam_recognition']
                },
                identity_theft: {
                    name: 'Identity Theft Through Dating',
                    description: 'Shows how personal information can be stolen through dating apps',
                    outcomes: ['identity_compromise', 'privacy_violation', 'long_term_consequences'],
                    educationalGoals: ['information_protection', 'privacy_settings', 'personal_data_security']
                }
            }
        });

        this.registerBranchTemplate('shadow_observer', 'stanley', {
            id: 'stanley_shadow_path',
            name: 'Elder Fraud Victim Path',
            description: 'Demonstrates various elder-targeted fraud scenarios',
            branches: {
                companionship_scam: {
                    name: 'Companionship Fraud Scenario',
                    description: 'Shows how loneliness can be exploited',
                    outcomes: ['emotional_exploitation', 'financial_loss', 'social_isolation'],
                    educationalGoals: ['companionship_scam_recognition', 'healthy_social_connections', 'verification_techniques']
                },
                authority_impersonation: {
                    name: 'Authority Figure Scam',
                    description: 'Demonstrates government/authority impersonation scams',
                    outcomes: ['authority_deception', 'compliance_exploitation', 'financial_damage'],
                    educationalGoals: ['authority_verification', 'official_communication_recognition', 'skeptical_thinking']
                },
                family_emergency_scam: {
                    name: 'Family Emergency Exploitation',
                    description: 'Shows how family concerns can be weaponized',
                    outcomes: ['family_manipulation', 'emergency_exploitation', 'trust_violation'],
                    educationalGoals: ['family_verification', 'emergency_protocols', 'communication_security']
                }
            }
        });

        console.log('📖 Narrative branching templates initialized');
    }

    /**
     * Register a branch template
     * @param {string} mode - Guardian or shadow_observer
     * @param {string} character - Character name
     * @param {Object} template - Branch template
     */
    registerBranchTemplate(mode, character, template) {
        const key = `${mode}_${character}`;
        this.branchTemplates.set(key, template);
    }

    /**
     * Track story branch based on decision and mode
     * @param {string} character - Character name
     * @param {string} mode - Current mode (guardian/shadow_observer)
     * @param {Object} decision - Decision made
     * @param {Object} context - Additional context
     */
    trackBranch(character, mode, decision, context = {}) {
        console.log(`📖 Tracking story branch for ${character} in ${mode} mode`, decision);

        // Get or create current branch
        const branchKey = `${character}_${mode}`;
        let currentBranch = this.storyBranches.get(branchKey);

        if (!currentBranch) {
            currentBranch = this.initializeBranch(character, mode);
            this.storyBranches.set(branchKey, currentBranch);
        }

        // Update branch with decision
        this.updateBranchWithDecision(currentBranch, decision, context);

        // Determine branch direction
        const branchDirection = this.determineBranchDirection(currentBranch, decision);
        if (branchDirection) {
            currentBranch.currentPath = branchDirection;
            currentBranch.pathHistory.push({
                path: branchDirection,
                decision: decision.id,
                timestamp: Date.now(),
                context
            });
        }

        // Update dashboard integration
        this.dashboardIntegration.updateBranchVisualization(character, currentBranch);

        // Check for branch completion
        if (this.isBranchComplete(currentBranch)) {
            this.completeBranch(currentBranch);
        }

        return currentBranch;
    }

    /**
     * Initialize a new story branch
     * @param {string} character - Character name
     * @param {string} mode - Mode (guardian/shadow_observer)
     * @returns {Object} New branch object
     */
    initializeBranch(character, mode) {
        const template = this.branchTemplates.get(`${mode}_${character}`);
        
        return {
            id: `${character}_${mode}_${Date.now()}`,
            character,
            mode,
            template,
            currentPath: null,
            pathHistory: [],
            decisions: [],
            consequences: [],
            startTime: Date.now(),
            status: 'active',
            educationalProgress: {
                goalsAchieved: [],
                lessonsLearned: [],
                skillsGained: []
            }
        };
    }

    /**
     * Update branch with new decision
     * @param {Object} branch - Story branch
     * @param {Object} decision - Decision made
     * @param {Object} context - Decision context
     */
    updateBranchWithDecision(branch, decision, context) {
        // Add decision to branch
        branch.decisions.push({
            id: decision.id,
            mechanicType: decision.mechanicType,
            consequences: decision.consequences,
            timestamp: Date.now(),
            context
        });

        // Apply consequences
        if (decision.consequences) {
            Object.entries(decision.consequences).forEach(([key, value]) => {
                branch.consequences.push({
                    type: key,
                    value,
                    source: decision.id,
                    timestamp: Date.now()
                });
            });
        }

        // Update educational progress
        this.updateEducationalProgress(branch, decision);
    }

    /**
     * Determine branch direction based on decision pattern
     * @param {Object} branch - Story branch
     * @param {Object} decision - Latest decision
     * @returns {string|null} Branch direction
     */
    determineBranchDirection(branch, decision) {
        if (!branch.template || !branch.template.branches) return null;

        const branchOptions = Object.keys(branch.template.branches);
        const decisionHistory = branch.decisions;

        // Analyze decision patterns
        const mechanicCounts = {};
        decisionHistory.forEach(d => {
            mechanicCounts[d.mechanicType] = (mechanicCounts[d.mechanicType] || 0) + 1;
        });

        // Determine dominant pattern
        const dominantMechanic = Object.keys(mechanicCounts)
            .reduce((a, b) => mechanicCounts[a] > mechanicCounts[b] ? a : b);

        // Map mechanic patterns to branch directions
        const mechanicToBranch = {
            investigation: branchOptions[0], // Usually investigation/analysis focused
            realtime: branchOptions[2], // Usually balanced/action focused
            puzzle: branchOptions[1], // Usually community/social focused
            action: branchOptions[2] // Usually action/response focused
        };

        return mechanicToBranch[dominantMechanic] || branchOptions[0];
    }

    /**
     * Update educational progress based on decision
     * @param {Object} branch - Story branch
     * @param {Object} decision - Decision made
     */
    updateEducationalProgress(branch, decision) {
        const branchPath = branch.template.branches[branch.currentPath];
        if (!branchPath) return;

        // Add educational goals from current path
        branchPath.educationalGoals.forEach(goal => {
            if (!branch.educationalProgress.goalsAchieved.includes(goal)) {
                branch.educationalProgress.goalsAchieved.push(goal);
            }
        });

        // Add mechanic-specific lessons
        const mechanicLessons = this.getMechanicLessons(decision.mechanicType, branch.character);
        mechanicLessons.forEach(lesson => {
            if (!branch.educationalProgress.lessonsLearned.includes(lesson)) {
                branch.educationalProgress.lessonsLearned.push(lesson);
            }
        });
    }

    /**
     * Get educational lessons for a mechanic type
     * @param {string} mechanicType - Type of mechanic
     * @param {string} character - Character name
     * @returns {Array} Educational lessons
     */
    getMechanicLessons(mechanicType, character) {
        const lessonMap = {
            investigation: [
                'digital_forensics_basics',
                'evidence_verification',
                'pattern_recognition'
            ],
            realtime: [
                'quick_threat_assessment',
                'emergency_response',
                'decision_under_pressure'
            ],
            puzzle: [
                'social_engineering_recognition',
                'manipulation_tactics',
                'psychological_awareness'
            ],
            action: [
                'incident_response',
                'protective_measures',
                'community_safety'
            ]
        };

        return lessonMap[mechanicType] || [];
    }

    /**
     * Check if branch is complete
     * @param {Object} branch - Story branch
     * @returns {boolean} Whether branch is complete
     */
    isBranchComplete(branch) {
        // Branch is complete if:
        // 1. Has made at least 3 decisions
        // 2. Has established a clear path
        // 3. Has achieved educational goals
        return branch.decisions.length >= 3 && 
               branch.currentPath && 
               branch.educationalProgress.goalsAchieved.length >= 2;
    }

    /**
     * Complete a story branch and generate summary
     * @param {Object} branch - Story branch to complete
     */
    completeBranch(branch) {
        console.log(`📖 Completing story branch: ${branch.id}`);

        branch.status = 'completed';
        branch.completionTime = Date.now();

        // Generate educational summary
        const summary = this.generateEducationalSummary(branch);
        this.educationalSummaries.set(branch.id, summary);

        // Add to branch history
        this.branchHistory.push(branch);

        // Visualize consequences
        this.visualizeConsequences(branch);

        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('narrativeBranchCompleted', {
            detail: {
                branch,
                summary,
                character: branch.character,
                mode: branch.mode
            }
        }));
    }

    /**
     * Generate educational summary for completed branch
     * @param {Object} branch - Completed story branch
     * @returns {Object} Educational summary
     */
    generateEducationalSummary(branch) {
        const branchPath = branch.template.branches[branch.currentPath];
        const impactAnalysis = this.impactAnalyzer.analyzeBranchImpact(branch);

        const summary = {
            id: `summary_${branch.id}`,
            character: branch.character,
            mode: branch.mode,
            pathTaken: branch.currentPath,
            pathName: branchPath ? branchPath.name : 'Unknown Path',
            pathDescription: branchPath ? branchPath.description : '',
            
            // Decision analysis
            decisionsAnalysis: {
                totalDecisions: branch.decisions.length,
                mechanicBreakdown: this.analyzeMechanicUsage(branch.decisions),
                keyDecisions: this.identifyKeyDecisions(branch.decisions)
            },

            // Educational outcomes
            educationalOutcomes: {
                goalsAchieved: branch.educationalProgress.goalsAchieved,
                lessonsLearned: branch.educationalProgress.lessonsLearned,
                skillsGained: branch.educationalProgress.skillsGained,
                competencyLevel: this.calculateCompetencyLevel(branch)
            },

            // Impact analysis
            impactAnalysis: {
                positiveOutcomes: impactAnalysis.positive,
                negativeOutcomes: impactAnalysis.negative,
                learningOpportunities: impactAnalysis.learning,
                realWorldApplications: impactAnalysis.applications
            },

            // Recommendations
            recommendations: this.generateRecommendations(branch, impactAnalysis),

            // Replay suggestions
            replaySuggestions: this.generateReplaySuggestions(branch),

            generatedAt: Date.now()
        };

        console.log(`📖 Generated educational summary for ${branch.character}`, summary);
        return summary;
    }

    /**
     * Analyze mechanic usage in decisions
     * @param {Array} decisions - Branch decisions
     * @returns {Object} Mechanic usage breakdown
     */
    analyzeMechanicUsage(decisions) {
        const breakdown = {};
        decisions.forEach(decision => {
            breakdown[decision.mechanicType] = (breakdown[decision.mechanicType] || 0) + 1;
        });
        return breakdown;
    }

    /**
     * Identify key decisions that shaped the branch
     * @param {Array} decisions - Branch decisions
     * @returns {Array} Key decisions
     */
    identifyKeyDecisions(decisions) {
        // Return decisions that had significant consequences
        return decisions.filter(decision => 
            decision.consequences && 
            Object.keys(decision.consequences).length > 1
        ).slice(0, 3); // Top 3 key decisions
    }

    /**
     * Calculate competency level based on branch performance
     * @param {Object} branch - Story branch
     * @returns {string} Competency level
     */
    calculateCompetencyLevel(branch) {
        const goalsAchieved = branch.educationalProgress.goalsAchieved.length;
        const lessonsLearned = branch.educationalProgress.lessonsLearned.length;
        const totalScore = goalsAchieved + lessonsLearned;

        if (totalScore >= 8) return 'Expert';
        if (totalScore >= 6) return 'Advanced';
        if (totalScore >= 4) return 'Intermediate';
        if (totalScore >= 2) return 'Beginner';
        return 'Novice';
    }

    /**
     * Generate recommendations based on branch performance
     * @param {Object} branch - Story branch
     * @param {Object} impactAnalysis - Impact analysis results
     * @returns {Array} Recommendations
     */
    generateRecommendations(branch, impactAnalysis) {
        const recommendations = [];

        // Mode-specific recommendations
        if (branch.mode === 'guardian') {
            recommendations.push({
                type: 'reinforcement',
                title: 'Continue Protective Practices',
                description: 'Your guardian approach helped protect against cyber threats. Continue applying these safety practices in real life.'
            });
        } else {
            recommendations.push({
                type: 'learning',
                title: 'Learn from Consequences',
                description: 'The shadow observer path showed potential risks. Apply these lessons to avoid similar threats in reality.'
            });
        }

        // Mechanic-specific recommendations
        const dominantMechanic = Object.keys(this.analyzeMechanicUsage(branch.decisions))
            .reduce((a, b) => branch.decisions.filter(d => d.mechanicType === a).length > 
                            branch.decisions.filter(d => d.mechanicType === b).length ? a : b);

        const mechanicRecommendations = {
            investigation: {
                type: 'skill_development',
                title: 'Develop Investigation Skills',
                description: 'Practice digital forensics and evidence analysis in safe environments.'
            },
            realtime: {
                type: 'response_training',
                title: 'Improve Response Speed',
                description: 'Practice quick decision-making for cybersecurity incidents.'
            },
            puzzle: {
                type: 'awareness_building',
                title: 'Build Social Engineering Awareness',
                description: 'Study manipulation tactics to better recognize and resist them.'
            },
            action: {
                type: 'preparedness',
                title: 'Enhance Incident Preparedness',
                description: 'Develop action plans for various cybersecurity scenarios.'
            }
        };

        if (mechanicRecommendations[dominantMechanic]) {
            recommendations.push(mechanicRecommendations[dominantMechanic]);
        }

        return recommendations;
    }

    /**
     * Generate replay suggestions for alternative paths
     * @param {Object} branch - Completed story branch
     * @returns {Array} Replay suggestions
     */
    generateReplaySuggestions(branch) {
        const suggestions = [];
        const template = branch.template;

        if (!template || !template.branches) return suggestions;

        // Suggest alternative mode
        const alternativeMode = branch.mode === 'guardian' ? 'shadow_observer' : 'guardian';
        suggestions.push({
            type: 'mode_switch',
            title: `Try ${alternativeMode === 'guardian' ? 'Guardian' : 'Shadow Observer'} Mode`,
            description: `Experience the story from the ${alternativeMode === 'guardian' ? 'protective' : 'antagonistic'} perspective to see different outcomes.`,
            mode: alternativeMode,
            character: branch.character
        });

        // Suggest alternative paths within same mode
        const availablePaths = Object.keys(template.branches);
        const alternativePaths = availablePaths.filter(path => path !== branch.currentPath);

        alternativePaths.forEach(path => {
            const pathInfo = template.branches[path];
            suggestions.push({
                type: 'path_alternative',
                title: `Try ${pathInfo.name}`,
                description: pathInfo.description,
                mode: branch.mode,
                character: branch.character,
                suggestedPath: path
            });
        });

        return suggestions;
    }

    /**
     * Visualize consequences through character-specific storytelling
     * @param {Object} branch - Story branch
     */
    visualizeConsequences(branch) {
        const visualization = this.createConsequenceVisualization(branch);
        this.dashboardIntegration.displayConsequenceVisualization(branch.character, visualization);
    }

    /**
     * Create consequence visualization
     * @param {Object} branch - Story branch
     * @returns {Object} Visualization data
     */
    createConsequenceVisualization(branch) {
        const consequences = branch.consequences;
        const positiveConsequences = consequences.filter(c => c.value > 0);
        const negativeConsequences = consequences.filter(c => c.value < 0);

        return {
            character: branch.character,
            mode: branch.mode,
            pathName: branch.template.branches[branch.currentPath]?.name || 'Unknown Path',
            
            // Consequence summary
            summary: {
                totalPositive: positiveConsequences.length,
                totalNegative: negativeConsequences.length,
                netImpact: positiveConsequences.length - negativeConsequences.length
            },

            // Visual elements
            visualElements: {
                progressBars: this.createProgressBars(consequences),
                impactChart: this.createImpactChart(consequences),
                timelineEvents: this.createTimelineEvents(branch.pathHistory)
            },

            // Storytelling elements
            narrative: {
                opening: this.generateNarrativeOpening(branch),
                keyMoments: this.generateKeyMoments(branch),
                conclusion: this.generateNarrativeConclusion(branch)
            }
        };
    }

    /**
     * Create progress bars for consequence visualization
     * @param {Array} consequences - Branch consequences
     * @returns {Array} Progress bar data
     */
    createProgressBars(consequences) {
        const progressData = {};
        
        consequences.forEach(consequence => {
            if (!progressData[consequence.type]) {
                progressData[consequence.type] = 0;
            }
            progressData[consequence.type] += consequence.value;
        });

        return Object.entries(progressData).map(([type, value]) => ({
            label: type.replace(/_/g, ' ').toUpperCase(),
            value: Math.max(0, Math.min(100, value * 10)), // Scale to 0-100
            color: value > 0 ? '#00FF00' : '#FF0000'
        }));
    }

    /**
     * Create impact chart data
     * @param {Array} consequences - Branch consequences
     * @returns {Object} Chart data
     */
    createImpactChart(consequences) {
        const timelineData = [];
        let cumulativeImpact = 0;

        consequences.forEach(consequence => {
            cumulativeImpact += consequence.value;
            timelineData.push({
                timestamp: consequence.timestamp,
                impact: cumulativeImpact,
                source: consequence.source
            });
        });

        return {
            type: 'line',
            data: timelineData,
            xAxis: 'timestamp',
            yAxis: 'impact',
            title: 'Cumulative Impact Over Time'
        };
    }

    /**
     * Create timeline events for visualization
     * @param {Array} pathHistory - Branch path history
     * @returns {Array} Timeline events
     */
    createTimelineEvents(pathHistory) {
        return pathHistory.map(event => ({
            timestamp: event.timestamp,
            title: `Path: ${event.path}`,
            description: `Decision: ${event.decision}`,
            type: 'path_change'
        }));
    }

    /**
     * Generate narrative opening for storytelling
     * @param {Object} branch - Story branch
     * @returns {string} Narrative opening
     */
    generateNarrativeOpening(branch) {
        const character = branch.character.charAt(0).toUpperCase() + branch.character.slice(1);
        const mode = branch.mode === 'guardian' ? 'protective guardian' : 'shadow observer';
        
        return `${character}'s journey as a ${mode} began with a series of critical decisions that would shape their cybersecurity story...`;
    }

    /**
     * Generate key moments in the narrative
     * @param {Object} branch - Story branch
     * @returns {Array} Key narrative moments
     */
    generateKeyMoments(branch) {
        const keyDecisions = this.identifyKeyDecisions(branch.decisions);
        
        return keyDecisions.map((decision, index) => ({
            moment: index + 1,
            title: `Critical Decision: ${decision.id}`,
            description: `This ${decision.mechanicType} decision led to significant consequences in the story.`,
            impact: Object.keys(decision.consequences || {}).length
        }));
    }

    /**
     * Generate narrative conclusion
     * @param {Object} branch - Story branch
     * @returns {string} Narrative conclusion
     */
    generateNarrativeConclusion(branch) {
        const pathInfo = branch.template.branches[branch.currentPath];
        const competency = this.calculateCompetencyLevel(branch);
        
        return `Through the ${pathInfo?.name || 'chosen path'}, ${branch.character} achieved ${competency} level cybersecurity awareness and learned valuable lessons about digital safety.`;
    }

    /**
     * Get current story branch for character
     * @param {string} character - Character name
     * @param {string} mode - Current mode
     * @returns {Object|null} Current story branch
     */
    getCurrentBranch(character, mode) {
        const branchKey = `${character}_${mode}`;
        return this.storyBranches.get(branchKey) || null;
    }

    /**
     * Get branch history for character
     * @param {string} character - Character name
     * @returns {Array} Branch history
     */
    getBranchHistory(character) {
        return this.branchHistory.filter(branch => branch.character === character);
    }

    /**
     * Get educational summary for branch
     * @param {string} branchId - Branch ID
     * @returns {Object|null} Educational summary
     */
    getEducationalSummary(branchId) {
        return this.educationalSummaries.get(branchId) || null;
    }

    /**
     * Reset branch for character (for replay functionality)
     * @param {string} character - Character name
     * @param {string} mode - Mode to reset
     */
    resetBranch(character, mode) {
        const branchKey = `${character}_${mode}`;
        const existingBranch = this.storyBranches.get(branchKey);
        
        if (existingBranch) {
            // Archive existing branch
            this.branchHistory.push({
                ...existingBranch,
                status: 'archived',
                archivedAt: Date.now()
            });
            
            // Remove from active branches
            this.storyBranches.delete(branchKey);
        }
        
        console.log(`📖 Reset story branch for ${character} in ${mode} mode`);
    }
}

/**
 * Impact Analyzer
 * Analyzes the impact of story branches for educational purposes
 */
class ImpactAnalyzer {
    /**
     * Analyze branch impact
     * @param {Object} branch - Story branch
     * @returns {Object} Impact analysis
     */
    analyzeBranchImpact(branch) {
        const consequences = branch.consequences;
        const decisions = branch.decisions;

        return {
            positive: this.analyzePositiveImpacts(consequences, branch.mode),
            negative: this.analyzeNegativeImpacts(consequences, branch.mode),
            learning: this.analyzeLearningOpportunities(decisions, branch.mode),
            applications: this.analyzeRealWorldApplications(branch)
        };
    }

    /**
     * Analyze positive impacts
     * @param {Array} consequences - Branch consequences
     * @param {string} mode - Branch mode
     * @returns {Array} Positive impacts
     */
    analyzePositiveImpacts(consequences, mode) {
        const positiveConsequences = consequences.filter(c => c.value > 0);
        
        return positiveConsequences.map(consequence => ({
            type: consequence.type,
            value: consequence.value,
            description: this.getImpactDescription(consequence.type, consequence.value, mode, 'positive')
        }));
    }

    /**
     * Analyze negative impacts
     * @param {Array} consequences - Branch consequences
     * @param {string} mode - Branch mode
     * @returns {Array} Negative impacts
     */
    analyzeNegativeImpacts(consequences, mode) {
        const negativeConsequences = consequences.filter(c => c.value < 0);
        
        return negativeConsequences.map(consequence => ({
            type: consequence.type,
            value: consequence.value,
            description: this.getImpactDescription(consequence.type, consequence.value, mode, 'negative')
        }));
    }

    /**
     * Analyze learning opportunities
     * @param {Array} decisions - Branch decisions
     * @param {string} mode - Branch mode
     * @returns {Array} Learning opportunities
     */
    analyzeLearningOpportunities(decisions, mode) {
        const opportunities = [];
        
        decisions.forEach(decision => {
            const mechanicLearning = this.getMechanicLearningOpportunity(decision.mechanicType, mode);
            if (mechanicLearning) {
                opportunities.push(mechanicLearning);
            }
        });

        return opportunities;
    }

    /**
     * Analyze real-world applications
     * @param {Object} branch - Story branch
     * @returns {Array} Real-world applications
     */
    analyzeRealWorldApplications(branch) {
        const applications = [];
        const character = branch.character;
        const pathInfo = branch.template.branches[branch.currentPath];

        if (pathInfo && pathInfo.educationalGoals) {
            pathInfo.educationalGoals.forEach(goal => {
                const application = this.getGoalApplication(goal, character);
                if (application) {
                    applications.push(application);
                }
            });
        }

        return applications;
    }

    /**
     * Get impact description
     * @param {string} type - Impact type
     * @param {number} value - Impact value
     * @param {string} mode - Branch mode
     * @param {string} polarity - positive or negative
     * @returns {string} Impact description
     */
    getImpactDescription(type, value, mode, polarity) {
        const descriptions = {
            trust_score: {
                positive: 'Increased trust and credibility in digital interactions',
                negative: 'Decreased trust, making future interactions more difficult'
            },
            security_awareness: {
                positive: 'Enhanced understanding of cybersecurity threats and protections',
                negative: 'Reduced awareness of security risks and vulnerabilities'
            },
            investigation_clues: {
                positive: 'Gathered valuable evidence for threat analysis',
                negative: 'Missed important clues that could prevent future attacks'
            },
            community_leadership: {
                positive: 'Developed skills to help protect others in the community',
                negative: 'Lost opportunities to contribute to community safety'
            }
        };

        return descriptions[type]?.[polarity] || `${polarity} impact on ${type}`;
    }

    /**
     * Get mechanic learning opportunity
     * @param {string} mechanicType - Type of mechanic
     * @param {string} mode - Branch mode
     * @returns {Object|null} Learning opportunity
     */
    getMechanicLearningOpportunity(mechanicType, mode) {
        const opportunities = {
            investigation: {
                title: 'Digital Investigation Skills',
                description: 'Learn to analyze digital evidence and identify cybersecurity threats',
                realWorldApplication: 'Apply investigation techniques to verify online information and detect scams'
            },
            realtime: {
                title: 'Rapid Response Capabilities',
                description: 'Develop quick decision-making skills for cybersecurity incidents',
                realWorldApplication: 'Respond effectively to phishing attempts and social engineering attacks'
            },
            puzzle: {
                title: 'Social Engineering Recognition',
                description: 'Understand psychological manipulation tactics used by cybercriminals',
                realWorldApplication: 'Recognize and resist manipulation attempts in daily digital interactions'
            },
            action: {
                title: 'Incident Response Planning',
                description: 'Learn to take appropriate action when facing cybersecurity threats',
                realWorldApplication: 'Implement protective measures and help others during security incidents'
            }
        };

        return opportunities[mechanicType] || null;
    }

    /**
     * Get goal application
     * @param {string} goal - Educational goal
     * @param {string} character - Character name
     * @returns {Object|null} Goal application
     */
    getGoalApplication(goal, character) {
        const applications = {
            account_security: {
                title: 'Account Security Best Practices',
                description: 'Apply strong authentication and account protection measures',
                context: `Relevant for ${character}'s domain and general digital safety`
            },
            social_engineering_awareness: {
                title: 'Social Engineering Defense',
                description: 'Recognize and counter manipulation attempts',
                context: 'Essential for all online interactions and communications'
            },
            community_protection: {
                title: 'Community Cybersecurity Leadership',
                description: 'Help protect others from cyber threats',
                context: 'Build safer digital communities through education and support'
            }
        };

        return applications[goal] || null;
    }
}

/**
 * Dashboard Integration
 * Integrates narrative branching with character dashboards
 */
class DashboardIntegration {
    constructor() {
        this.visualizationElements = new Map();
    }

    /**
     * Update branch visualization on character dashboard
     * @param {string} character - Character name
     * @param {Object} branch - Story branch
     */
    updateBranchVisualization(character, branch) {
        const dashboardElement = this.findDashboardElement(character);
        if (!dashboardElement) return;

        // Create or update branch visualization
        let branchViz = dashboardElement.querySelector('.narrative-branch-visualization');
        if (!branchViz) {
            branchViz = this.createBranchVisualization(branch);
            dashboardElement.appendChild(branchViz);
        } else {
            this.updateBranchVisualizationContent(branchViz, branch);
        }

        this.visualizationElements.set(character, branchViz);
    }

    /**
     * Find dashboard element for character
     * @param {string} character - Character name
     * @returns {HTMLElement|null} Dashboard element
     */
    findDashboardElement(character) {
        // Try multiple selectors to find dashboard
        const selectors = [
            `#${character}-dashboard`,
            `.${character}-dashboard`,
            `[data-character="${character}"]`,
            '.character-dashboard'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }

        return null;
    }

    /**
     * Create branch visualization element
     * @param {Object} branch - Story branch
     * @returns {HTMLElement} Visualization element
     */
    createBranchVisualization(branch) {
        const container = document.createElement('div');
        container.className = 'narrative-branch-visualization';
        container.style.cssText = `
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #00FFFF;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            color: white;
            font-family: 'JetBrains Mono', monospace;
        `;

        this.updateBranchVisualizationContent(container, branch);
        return container;
    }

    /**
     * Update branch visualization content
     * @param {HTMLElement} element - Visualization element
     * @param {Object} branch - Story branch
     */
    updateBranchVisualizationContent(element, branch) {
        const pathInfo = branch.template?.branches[branch.currentPath];
        const progressPercent = Math.min(100, (branch.decisions.length / 5) * 100);

        element.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="color: #00FFFF; margin: 0;">📖 Story Branch</h4>
                <span style="color: #FFD700; font-size: 12px;">${branch.mode.toUpperCase()}</span>
            </div>
            
            <div style="margin-bottom: 10px;">
                <div style="color: #CCCCCC; font-size: 13px; margin-bottom: 5px;">
                    Current Path: <span style="color: #00FF00;">${pathInfo?.name || 'Determining...'}</span>
                </div>
                <div style="background: #333; border-radius: 4px; height: 6px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #00FFFF, #00FF00); height: 100%; width: ${progressPercent}%; transition: width 0.3s ease;"></div>
                </div>
                <div style="color: #888; font-size: 11px; margin-top: 2px;">
                    Progress: ${branch.decisions.length}/5 decisions
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 12px;">
                <div style="color: #00FF00;">
                    Goals: ${branch.educationalProgress.goalsAchieved.length}
                </div>
                <div style="color: #FFD700;">
                    Lessons: ${branch.educationalProgress.lessonsLearned.length}
                </div>
                <div style="color: #FF00FF;">
                    Decisions: ${branch.decisions.length}
                </div>
            </div>
        `;
    }

    /**
     * Display consequence visualization
     * @param {string} character - Character name
     * @param {Object} visualization - Visualization data
     */
    displayConsequenceVisualization(character, visualization) {
        const dashboardElement = this.findDashboardElement(character);
        if (!dashboardElement) return;

        // Create consequence visualization overlay
        const overlay = document.createElement('div');
        overlay.className = 'consequence-visualization-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10002;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-family: 'JetBrains Mono', monospace;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #00FFFF;
            border-radius: 15px;
            padding: 30px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        content.innerHTML = this.generateConsequenceVisualizationHTML(visualization);
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Add close functionality
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 10000);
    }

    /**
     * Generate consequence visualization HTML
     * @param {Object} visualization - Visualization data
     * @returns {string} HTML content
     */
    generateConsequenceVisualizationHTML(visualization) {
        const { character, mode, pathName, summary, narrative } = visualization;

        return `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #00FFFF; margin-bottom: 10px;">
                    📖 Story Complete: ${character.toUpperCase()}
                </h2>
                <h3 style="color: #FFD700; margin-bottom: 5px;">${pathName}</h3>
                <p style="color: #CCCCCC; font-size: 14px;">${mode === 'guardian' ? 'Guardian Path' : 'Shadow Observer Path'}</p>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="color: #00FF00; margin-bottom: 10px;">📊 Impact Summary</h4>
                <div style="display: flex; justify-content: space-around; margin-bottom: 15px;">
                    <div style="text-align: center;">
                        <div style="color: #00FF00; font-size: 24px; font-weight: bold;">${summary.totalPositive}</div>
                        <div style="color: #CCCCCC; font-size: 12px;">Positive Outcomes</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #FF0000; font-size: 24px; font-weight: bold;">${summary.totalNegative}</div>
                        <div style="color: #CCCCCC; font-size: 12px;">Negative Outcomes</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: ${summary.netImpact >= 0 ? '#00FF00' : '#FF0000'}; font-size: 24px; font-weight: bold;">${summary.netImpact >= 0 ? '+' : ''}${summary.netImpact}</div>
                        <div style="color: #CCCCCC; font-size: 12px;">Net Impact</div>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="color: #FFD700; margin-bottom: 10px;">📚 Your Story</h4>
                <p style="color: #CCCCCC; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                    ${narrative.opening}
                </p>
                <p style="color: #CCCCCC; font-size: 14px; line-height: 1.5;">
                    ${narrative.conclusion}
                </p>
            </div>

            <div style="text-align: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                    background: #00FFFF;
                    border: none;
                    color: black;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: inherit;
                    font-weight: bold;
                ">Continue Journey</button>
            </div>
        `;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NarrativeBranchingSystem, ImpactAnalyzer, DashboardIntegration };
}

// Make available globally
window.NarrativeBranchingSystem = NarrativeBranchingSystem;
window.ImpactAnalyzer = ImpactAnalyzer;
window.DashboardIntegration = DashboardIntegration;