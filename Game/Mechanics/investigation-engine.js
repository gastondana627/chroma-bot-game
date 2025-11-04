/**
 * Investigation Engine Core
 * Provides realistic digital forensics and evidence analysis capabilities
 * for cybersecurity education through interactive gameplay
 */

class InvestigationEngine {
    constructor() {
        this.evidenceDatabase = new Map();
        this.analysisTools = new ToolRegistry();
        this.investigationState = new Map();
        this.activeInvestigations = new Map();
        this.characterToolsManager = null;
        
        // Initialize with default tools
        this.initializeAnalysisTools();
        
        // Initialize character-specific tools
        this.initializeCharacterTools();
    }

    /**
     * Initialize character-specific tools integration
     * @private
     */
    async initializeCharacterTools() {
        try {
            // Import and initialize character tools manager
            if (typeof window !== 'undefined' && window.characterToolsManager) {
                this.characterToolsManager = window.characterToolsManager;
            } else if (typeof require !== 'undefined') {
                const { characterToolsManager } = require('./character-tools-integration.js');
                this.characterToolsManager = characterToolsManager;
            }
            
            if (this.characterToolsManager) {
                await this.characterToolsManager.initialize();
                console.log('Character-specific investigation tools integrated successfully');
            }
        } catch (error) {
            console.warn('Character-specific tools not available:', error.message);
            // Continue without character-specific tools
        }
    }

    /**
     * Initialize investigation scenario
     * @param {string} scenarioId - Unique scenario identifier
     * @param {string} character - Character name (eli, maya, stanley)
     * @param {Object} scenarioConfig - Scenario configuration
     * @returns {Object} Investigation session data
     */
    startInvestigation(scenarioId, character, scenarioConfig) {
        const investigation = {
            id: scenarioId,
            character: character,
            startTime: Date.now(),
            evidence: this.loadEvidence(scenarioConfig),
            availableTools: this.getAvailableTools(character),
            objectives: this.getInvestigationObjectives(scenarioConfig),
            progress: {
                evidenceAnalyzed: [],
                toolsUsed: [],
                findingsCompiled: [],
                completionPercentage: 0
            },
            state: 'active'
        };

        this.activeInvestigations.set(scenarioId, investigation);
        this.investigationState.set(scenarioId, {
            currentEvidence: null,
            selectedTool: null,
            analysisResults: [],
            educationalFeedback: []
        });

        return {
            investigationId: scenarioId,
            evidence: investigation.evidence,
            tools: investigation.availableTools,
            objectives: investigation.objectives,
            initialGuidance: this.getInitialGuidance(character, scenarioConfig)
        };
    }

    /**
     * Process evidence analysis using specified tool
     * @param {string} investigationId - Investigation session ID
     * @param {string} evidenceId - Evidence to analyze
     * @param {string} toolId - Analysis tool to use
     * @param {Object} userInput - User's analysis input
     * @returns {Object} Analysis result with feedback
     */
    analyzeEvidence(investigationId, evidenceId, toolId, userInput = {}) {
        const investigation = this.activeInvestigations.get(investigationId);
        const state = this.investigationState.get(investigationId);
        
        if (!investigation || investigation.state !== 'active') {
            throw new Error('Investigation not found or not active');
        }

        const evidence = investigation.evidence.find(e => e.id === evidenceId);
        const tool = this.analysisTools.getTool(toolId);
        
        if (!evidence || !tool) {
            throw new Error('Evidence or tool not found');
        }

        // Process the analysis
        const analysisResult = this.processAnalysis(evidence, tool, userInput);
        
        // Update investigation state
        state.analysisResults.push(analysisResult);
        if (!investigation.progress.evidenceAnalyzed.includes(evidenceId)) {
            investigation.progress.evidenceAnalyzed.push(evidenceId);
        }
        if (!investigation.progress.toolsUsed.includes(toolId)) {
            investigation.progress.toolsUsed.push(toolId);
        }

        // Generate educational feedback
        const feedback = this.generateEducationalFeedback(analysisResult, investigation.character);
        state.educationalFeedback.push(feedback);

        // Update progress
        this.updateInvestigationProgress(investigationId);

        return {
            result: analysisResult,
            feedback: feedback,
            progress: investigation.progress,
            nextSuggestions: this.getNextSuggestions(investigationId)
        };
    }

    /**
     * Compile investigation findings
     * @param {string} investigationId - Investigation session ID
     * @param {Array} selectedFindings - User-selected key findings
     * @returns {Object} Compilation result with recommendations
     */
    compileFindings(investigationId, selectedFindings) {
        const investigation = this.activeInvestigations.get(investigationId);
        const state = this.investigationState.get(investigationId);
        
        if (!investigation) {
            throw new Error('Investigation not found');
        }

        const compilation = {
            investigationId: investigationId,
            character: investigation.character,
            findings: selectedFindings,
            recommendations: this.generateRecommendations(selectedFindings, investigation.character),
            educationalSummary: this.generateEducationalSummary(state.educationalFeedback),
            completionTime: Date.now() - investigation.startTime,
            accuracyScore: this.calculateAccuracyScore(selectedFindings, investigation.objectives)
        };

        investigation.progress.findingsCompiled = selectedFindings;
        investigation.progress.completionPercentage = 100;
        investigation.state = 'completed';

        return compilation;
    }

    /**
     * Get investigation progress
     * @param {string} investigationId - Investigation session ID
     * @returns {Object} Current progress data
     */
    getProgress(investigationId) {
        const investigation = this.activeInvestigations.get(investigationId);
        return investigation ? investigation.progress : null;
    }

    /**
     * Initialize analysis tools registry
     * @private
     */
    initializeAnalysisTools() {
        // Metadata analysis tools
        this.analysisTools.registerTool('metadata_viewer', {
            name: 'Metadata Viewer',
            description: 'Extract and analyze file metadata',
            supportedTypes: ['image', 'document', 'video'],
            analyze: (evidence, userInput) => this.analyzeMetadata(evidence, userInput)
        });

        // Reverse image search
        this.analysisTools.registerTool('reverse_image_search', {
            name: 'Reverse Image Search',
            description: 'Search for image origins and duplicates',
            supportedTypes: ['image'],
            analyze: (evidence, userInput) => this.performReverseImageSearch(evidence, userInput)
        });

        // Communication pattern analysis
        this.analysisTools.registerTool('communication_analyzer', {
            name: 'Communication Pattern Analyzer',
            description: 'Analyze communication patterns and language',
            supportedTypes: ['message', 'email', 'chat'],
            analyze: (evidence, userInput) => this.analyzeCommunicationPatterns(evidence, userInput)
        });

        // Profile verification
        this.analysisTools.registerTool('profile_verifier', {
            name: 'Profile Verification Tool',
            description: 'Cross-reference profile information',
            supportedTypes: ['profile', 'account'],
            analyze: (evidence, userInput) => this.verifyProfile(evidence, userInput)
        });

        // Network analysis
        this.analysisTools.registerTool('network_analyzer', {
            name: 'Network Connection Analyzer',
            description: 'Analyze network connections and IP information',
            supportedTypes: ['network', 'connection'],
            analyze: (evidence, userInput) => this.analyzeNetwork(evidence, userInput)
        });

        // Document verification
        this.analysisTools.registerTool('document_verifier', {
            name: 'Document Verification Tool',
            description: 'Verify document authenticity and detect forgeries',
            supportedTypes: ['document', 'certificate', 'id'],
            analyze: (evidence, userInput) => this.verifyDocument(evidence, userInput)
        });
    }

    /**
     * Load evidence for investigation scenario
     * @private
     */
    loadEvidence(scenarioConfig) {
        return scenarioConfig.evidence || [];
    }

    /**
     * Get available tools for character
     * @private
     */
    getAvailableTools(character) {
        // Import character-specific tools
        const characterSpecificTools = this.getCharacterSpecificTools(character);
        
        const characterTools = {
            maya: ['metadata_viewer', 'reverse_image_search', 'communication_analyzer', 'profile_verifier', 
                   'dating_profile_verifier', 'advanced_reverse_image_search', 'romance_communication_analyzer'],
            eli: ['metadata_viewer', 'network_analyzer', 'profile_verifier', 'communication_analyzer',
                  'gaming_trade_verifier', 'account_security_analyzer', 'gaming_scam_detector'],
            stanley: ['document_verifier', 'profile_verifier', 'communication_analyzer', 'metadata_viewer',
                      'identity_theft_detector', 'document_verifier_advanced', 'elder_fraud_detector']
        };

        const toolIds = characterTools[character] || [];
        const standardTools = toolIds.filter(id => this.analysisTools.getTool(id)).map(id => this.analysisTools.getTool(id));
        
        return [...standardTools, ...characterSpecificTools];
    }

    /**
     * Get character-specific investigation tools
     * @private
     */
    getCharacterSpecificTools(character) {
        if (this.characterToolsManager) {
            return this.characterToolsManager.getAvailableToolsForCharacter(character);
        }
        
        // Fallback to basic tool definitions if character tools manager is not available
        const basicTools = [];
        
        if (character === 'maya') {
            basicTools.push({
                id: 'dating_profile_verifier',
                name: 'Dating Profile Verifier',
                description: 'Specialized tool for verifying dating profile authenticity',
                character: 'maya',
                type: 'character_specific'
            });
        } else if (character === 'eli') {
            basicTools.push({
                id: 'gaming_trade_verifier',
                name: 'Gaming Trade Verifier',
                description: 'Verifies gaming trades for fraud and security risks',
                character: 'eli',
                type: 'character_specific'
            });
        } else if (character === 'stanley') {
            basicTools.push({
                id: 'identity_theft_detector',
                name: 'Identity Theft Detector',
                description: 'Comprehensive identity theft detection and prevention',
                character: 'stanley',
                type: 'character_specific'
            });
        }
        
        return basicTools;
    }

    /**
     * Get investigation objectives
     * @private
     */
    getInvestigationObjectives(scenarioConfig) {
        return scenarioConfig.objectives || [];
    }

    /**
     * Process analysis with specific tool
     * @private
     */
    processAnalysis(evidence, tool, userInput) {
        try {
            // Handle character-specific tools
            if (tool.type === 'character_specific') {
                return this.processCharacterSpecificAnalysis(evidence, tool, userInput);
            }
            
            // Handle standard tools
            return tool.analyze(evidence, userInput);
        } catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: Date.now()
            };
        }
    }

    /**
     * Process analysis with character-specific tools
     * @private
     */
    async processCharacterSpecificAnalysis(evidence, tool, userInput) {
        // Use character tools manager if available
        if (this.characterToolsManager) {
            try {
                return await this.characterToolsManager.executeToolAnalysis(
                    tool.character, 
                    tool.id, 
                    evidence, 
                    userInput
                );
            } catch (error) {
                console.error(`Error using character tools manager:`, error);
                // Fall back to basic implementation
            }
        }

        // Fallback implementation for basic functionality
        return this.processBasicCharacterAnalysis(evidence, tool, userInput);
    }

    /**
     * Basic character-specific analysis fallback
     * @private
     */
    processBasicCharacterAnalysis(evidence, tool, userInput) {
        const basicAnalysis = {
            success: true,
            timestamp: Date.now(),
            toolUsed: tool.id,
            character: tool.character,
            findings: {},
            educationalPoints: []
        };

        // Basic analysis based on evidence type and character
        if (tool.character === 'maya') {
            basicAnalysis.findings = {
                profileRisk: evidence.profile?.suspicious?.length || 0,
                imageAuthenticity: evidence.reverseSearch ? 'questionable' : 'unknown',
                communicationRisk: evidence.communication?.suspicious?.length || 0
            };
            basicAnalysis.educationalPoints = [
                'Always verify dating profiles through multiple methods',
                'Use reverse image search to check photo authenticity',
                'Be cautious of rapid emotional escalation in online relationships'
            ];
        } else if (tool.character === 'eli') {
            basicAnalysis.findings = {
                accountSecurity: evidence.network?.reputation === 'suspicious' ? 'compromised' : 'secure',
                tradingRisk: evidence.profile?.suspicious?.length || 0,
                scamIndicators: evidence.communication?.suspicious?.length || 0
            };
            basicAnalysis.educationalPoints = [
                'Monitor account login locations for unauthorized access',
                'Use official trading platforms with escrow services',
                'Be suspicious of deals that seem too good to be true'
            ];
        } else if (tool.character === 'stanley') {
            basicAnalysis.findings = {
                documentAuthenticity: evidence.document?.authentic === false ? 'forged' : 'authentic',
                identityRisk: evidence.communication?.suspicious?.length || 0,
                fraudType: 'government_impersonation'
            };
            basicAnalysis.educationalPoints = [
                'Government agencies do not make threatening phone calls',
                'Official documents have specific security features',
                'Take time to verify before taking any action'
            ];
        }

        return basicAnalysis;
    }



    /**
     * Generate educational feedback
     * @private
     */
    generateEducationalFeedback(analysisResult, character) {
        const feedback = {
            timestamp: Date.now(),
            character: character,
            analysisType: analysisResult.type,
            educationalPoints: [],
            realWorldApplication: '',
            nextSteps: []
        };

        // Add character-specific educational content
        if (character === 'maya') {
            feedback.educationalPoints.push('Dating profile verification is crucial for online safety');
            feedback.realWorldApplication = 'This technique helps identify fake dating profiles and romance scams';
        } else if (character === 'eli') {
            feedback.educationalPoints.push('Account verification prevents gaming fraud and identity theft');
            feedback.realWorldApplication = 'These skills protect against gaming scams and account takeovers';
        } else if (character === 'stanley') {
            feedback.educationalPoints.push('Document verification prevents identity theft and fraud');
            feedback.realWorldApplication = 'These methods help seniors avoid common fraud schemes';
        }

        return feedback;
    }

    /**
     * Update investigation progress
     * @private
     */
    updateInvestigationProgress(investigationId) {
        const investigation = this.activeInvestigations.get(investigationId);
        const totalEvidence = investigation.evidence.length;
        const analyzedCount = investigation.progress.evidenceAnalyzed.length;
        
        investigation.progress.completionPercentage = Math.round((analyzedCount / totalEvidence) * 100);
    }

    /**
     * Generate recommendations based on findings
     * @private
     */
    generateRecommendations(findings, character) {
        const recommendations = [];
        
        findings.forEach(finding => {
            if (finding.riskLevel === 'high') {
                recommendations.push({
                    priority: 'urgent',
                    action: `Immediately address ${finding.type} vulnerability`,
                    explanation: finding.recommendation
                });
            }
        });

        return recommendations;
    }

    /**
     * Generate educational summary
     * @private
     */
    generateEducationalSummary(feedbackList) {
        const keyLearnings = [];
        const realWorldApplications = [];
        
        feedbackList.forEach(feedback => {
            keyLearnings.push(...feedback.educationalPoints);
            if (feedback.realWorldApplication) {
                realWorldApplications.push(feedback.realWorldApplication);
            }
        });

        return {
            keyLearnings: [...new Set(keyLearnings)],
            realWorldApplications: [...new Set(realWorldApplications)],
            skillsAcquired: this.identifySkillsAcquired(feedbackList)
        };
    }

    /**
     * Calculate accuracy score
     * @private
     */
    calculateAccuracyScore(findings, objectives) {
        if (!objectives.length) return 100;
        
        let correctFindings = 0;
        objectives.forEach(objective => {
            const matchingFinding = findings.find(f => f.objectiveId === objective.id);
            if (matchingFinding && matchingFinding.correct) {
                correctFindings++;
            }
        });

        return Math.round((correctFindings / objectives.length) * 100);
    }

    /**
     * Get next suggestions for investigation
     * @private
     */
    getNextSuggestions(investigationId) {
        const investigation = this.activeInvestigations.get(investigationId);
        const unanalyzedEvidence = investigation.evidence.filter(
            e => !investigation.progress.evidenceAnalyzed.includes(e.id)
        );

        return unanalyzedEvidence.slice(0, 3).map(evidence => ({
            evidenceId: evidence.id,
            suggestedTool: this.suggestBestTool(evidence, investigation.character),
            reason: `Analyze ${evidence.type} for potential security indicators`
        }));
    }

    /**
     * Suggest best tool for evidence type
     * @private
     */
    suggestBestTool(evidence, character) {
        const toolMapping = {
            image: 'reverse_image_search',
            profile: 'profile_verifier',
            message: 'communication_analyzer',
            document: 'document_verifier',
            network: 'network_analyzer'
        };

        return toolMapping[evidence.type] || 'metadata_viewer';
    }

    /**
     * Get initial guidance for character
     * @private
     */
    getInitialGuidance(character, scenarioConfig) {
        const guidance = {
            maya: 'Start by examining dating profiles and messages for inconsistencies and red flags.',
            eli: 'Begin with account verification and look for signs of gaming fraud or manipulation.',
            stanley: 'Focus on document authenticity and communication patterns that suggest fraud.'
        };

        return guidance[character] || 'Begin your investigation by examining the available evidence.';
    }

    /**
     * Identify skills acquired during investigation
     * @private
     */
    identifySkillsAcquired(feedbackList) {
        const skills = new Set();
        
        feedbackList.forEach(feedback => {
            if (feedback.analysisType === 'metadata') skills.add('Digital Forensics');
            if (feedback.analysisType === 'profile') skills.add('Identity Verification');
            if (feedback.analysisType === 'communication') skills.add('Social Engineering Detection');
            if (feedback.analysisType === 'document') skills.add('Document Authentication');
        });

        return Array.from(skills);
    }

    // Analysis method implementations
    analyzeMetadata(evidence, userInput) {
        return {
            type: 'metadata',
            success: true,
            findings: {
                creationDate: evidence.metadata?.created || 'Unknown',
                location: evidence.metadata?.location || 'Not available',
                device: evidence.metadata?.device || 'Unknown device',
                modifications: evidence.metadata?.modified || false
            },
            riskIndicators: evidence.metadata?.suspicious || [],
            timestamp: Date.now()
        };
    }

    performReverseImageSearch(evidence, userInput) {
        return {
            type: 'reverse_search',
            success: true,
            findings: {
                originalSource: evidence.reverseSearch?.source || 'Unknown',
                duplicates: evidence.reverseSearch?.duplicates || 0,
                firstSeen: evidence.reverseSearch?.firstSeen || 'Unknown',
                contexts: evidence.reverseSearch?.contexts || []
            },
            riskIndicators: evidence.reverseSearch?.suspicious || [],
            timestamp: Date.now()
        };
    }

    analyzeCommunicationPatterns(evidence, userInput) {
        return {
            type: 'communication',
            success: true,
            findings: {
                languagePatterns: evidence.communication?.patterns || [],
                urgencyLevel: evidence.communication?.urgency || 'normal',
                manipulationTactics: evidence.communication?.tactics || [],
                authenticity: evidence.communication?.authentic || true
            },
            riskIndicators: evidence.communication?.suspicious || [],
            timestamp: Date.now()
        };
    }

    verifyProfile(evidence, userInput) {
        return {
            type: 'profile',
            success: true,
            findings: {
                consistency: evidence.profile?.consistent || true,
                verificationStatus: evidence.profile?.verified || false,
                crossReferences: evidence.profile?.references || [],
                anomalies: evidence.profile?.anomalies || []
            },
            riskIndicators: evidence.profile?.suspicious || [],
            timestamp: Date.now()
        };
    }

    analyzeNetwork(evidence, userInput) {
        return {
            type: 'network',
            success: true,
            findings: {
                ipAddress: evidence.network?.ip || 'Unknown',
                location: evidence.network?.location || 'Unknown',
                provider: evidence.network?.provider || 'Unknown',
                reputation: evidence.network?.reputation || 'clean'
            },
            riskIndicators: evidence.network?.suspicious || [],
            timestamp: Date.now()
        };
    }

    verifyDocument(evidence, userInput) {
        return {
            type: 'document',
            success: true,
            findings: {
                authenticity: evidence.document?.authentic || true,
                issuer: evidence.document?.issuer || 'Unknown',
                validationMarks: evidence.document?.marks || [],
                alterations: evidence.document?.altered || false
            },
            riskIndicators: evidence.document?.suspicious || [],
            timestamp: Date.now()
        };
    }
}

/**
 * Tool Registry for managing analysis tools
 */
class ToolRegistry {
    constructor() {
        this.tools = new Map();
    }

    registerTool(id, toolConfig) {
        this.tools.set(id, {
            id: id,
            ...toolConfig,
            registered: Date.now()
        });
    }

    getTool(id) {
        return this.tools.get(id);
    }

    getAllTools() {
        return Array.from(this.tools.values());
    }

    getToolsByType(type) {
        return Array.from(this.tools.values()).filter(
            tool => tool.supportedTypes.includes(type)
        );
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InvestigationEngine, ToolRegistry };
} else if (typeof window !== 'undefined') {
    window.InvestigationEngine = InvestigationEngine;
    window.ToolRegistry = ToolRegistry;
}