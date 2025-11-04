/**
 * Action Sequence Controller
 * Manages character-specific action sequences with rapid response systems
 * and educational feedback for cybersecurity scenarios
 */

class ActionSequenceController {
    constructor() {
        this.activeSequences = new Map();
        this.sequenceTemplates = new Map();
        this.responseTools = new Map();
        this.educationalFeedback = new Map();
        this.performanceMetrics = new Map();
        
        this.initializeSequenceTemplates();
        this.initializeResponseTools();
        this.initializeEducationalContent();
    }

    /**
     * Initialize sequence templates for each character domain
     */
    initializeSequenceTemplates() {
        // Maya's romance scam intervention sequences
        this.sequenceTemplates.set('maya_romance_intervention', {
            type: 'romance_intervention',
            character: 'maya',
            phases: [
                {
                    id: 'evidence_compilation',
                    name: 'Evidence Compilation',
                    duration: 45000, // 45 seconds
                    tools: ['screenshot_tool', 'message_analyzer', 'profile_verifier'],
                    objectives: ['collect_suspicious_messages', 'verify_profile_authenticity', 'document_red_flags']
                },
                {
                    id: 'confrontation_preparation',
                    name: 'Confrontation Preparation',
                    duration: 30000, // 30 seconds
                    tools: ['safety_planner', 'support_network', 'evidence_organizer'],
                    objectives: ['plan_safe_confrontation', 'prepare_evidence', 'alert_support_network']
                },
                {
                    id: 'intervention_execution',
                    name: 'Intervention Execution',
                    duration: 60000, // 60 seconds
                    tools: ['communication_blocker', 'report_system', 'victim_support'],
                    objectives: ['block_scammer', 'report_to_authorities', 'provide_victim_support']
                }
            ],
            successCriteria: {
                evidence_quality: 0.8,
                response_time: 0.7,
                safety_measures: 0.9
            }
        });

        // Eli's gaming account security sequences
        this.sequenceTemplates.set('eli_account_security', {
            type: 'account_security',
            character: 'eli',
            phases: [
                {
                    id: 'threat_assessment',
                    name: 'Threat Assessment',
                    duration: 30000, // 30 seconds
                    tools: ['login_analyzer', 'ip_tracker', 'device_checker'],
                    objectives: ['identify_unauthorized_access', 'check_login_history', 'verify_device_integrity']
                },
                {
                    id: 'security_lockdown',
                    name: 'Security Lockdown',
                    duration: 45000, // 45 seconds
                    tools: ['password_changer', 'two_factor_setup', 'session_killer'],
                    objectives: ['change_passwords', 'enable_2fa', 'terminate_suspicious_sessions']
                },
                {
                    id: 'recovery_verification',
                    name: 'Recovery Verification',
                    duration: 30000, // 30 seconds
                    tools: ['account_verifier', 'asset_checker', 'security_audit'],
                    objectives: ['verify_account_integrity', 'check_asset_status', 'audit_security_settings']
                }
            ],
            successCriteria: {
                security_level: 0.9,
                response_speed: 0.8,
                asset_protection: 0.85
            }
        });

        // Stanley's identity theft response sequences
        this.sequenceTemplates.set('stanley_identity_response', {
            type: 'identity_response',
            character: 'stanley',
            phases: [
                {
                    id: 'damage_assessment',
                    name: 'Damage Assessment',
                    duration: 60000, // 60 seconds
                    tools: ['credit_monitor', 'account_scanner', 'identity_checker'],
                    objectives: ['check_credit_reports', 'scan_financial_accounts', 'verify_identity_usage']
                },
                {
                    id: 'containment_actions',
                    name: 'Containment Actions',
                    duration: 90000, // 90 seconds
                    tools: ['fraud_alert', 'account_freezer', 'document_replacer'],
                    objectives: ['place_fraud_alerts', 'freeze_accounts', 'replace_compromised_documents']
                },
                {
                    id: 'community_protection',
                    name: 'Community Protection',
                    duration: 45000, // 45 seconds
                    tools: ['warning_system', 'report_generator', 'support_network'],
                    objectives: ['warn_community', 'file_reports', 'activate_support_network']
                }
            ],
            successCriteria: {
                containment_speed: 0.8,
                community_protection: 0.9,
                documentation_quality: 0.85
            }
        });
    }

    /**
     * Initialize cybersecurity response tools
     */
    initializeResponseTools() {
        // Maya's tools
        this.responseTools.set('screenshot_tool', {
            name: 'Evidence Screenshot Tool',
            character: 'maya',
            usage: 'Capture and annotate suspicious communications',
            effectiveness: 0.9,
            educationalValue: 'Learn to document digital evidence properly'
        });

        this.responseTools.set('profile_verifier', {
            name: 'Profile Verification System',
            character: 'maya',
            usage: 'Cross-reference profile information across platforms',
            effectiveness: 0.85,
            educationalValue: 'Understand how to verify online identities'
        });

        // Eli's tools
        this.responseTools.set('login_analyzer', {
            name: 'Login History Analyzer',
            character: 'eli',
            usage: 'Analyze login patterns and detect anomalies',
            effectiveness: 0.9,
            educationalValue: 'Learn to monitor account access patterns'
        });

        this.responseTools.set('two_factor_setup', {
            name: '2FA Configuration Tool',
            character: 'eli',
            usage: 'Rapidly configure two-factor authentication',
            effectiveness: 0.95,
            educationalValue: 'Master multi-factor authentication setup'
        });

        // Stanley's tools
        this.responseTools.set('credit_monitor', {
            name: 'Credit Monitoring System',
            character: 'stanley',
            usage: 'Real-time credit report analysis',
            effectiveness: 0.9,
            educationalValue: 'Understand credit monitoring importance'
        });

        this.responseTools.set('fraud_alert', {
            name: 'Fraud Alert System',
            character: 'stanley',
            usage: 'Place immediate fraud alerts on accounts',
            effectiveness: 0.95,
            educationalValue: 'Learn fraud alert procedures'
        });
    }

    /**
     * Initialize educational feedback content
     */
    initializeEducationalContent() {
        this.educationalFeedback.set('maya_romance_intervention', {
            success: {
                title: 'Romance Scam Successfully Prevented!',
                content: 'You effectively identified the scammer, compiled evidence, and took protective action. Key learning points:',
                points: [
                    'Documentation is crucial - screenshots and message logs provide evidence',
                    'Profile verification across platforms reveals inconsistencies',
                    'Safety planning prevents emotional manipulation during confrontation',
                    'Support networks provide emotional and practical assistance'
                ]
            },
            partial: {
                title: 'Good Response, Room for Improvement',
                content: 'You took positive action but missed some opportunities:',
                improvements: [
                    'Collect more comprehensive evidence before confrontation',
                    'Use multiple verification tools for stronger proof',
                    'Involve support network earlier in the process'
                ]
            },
            failure: {
                title: 'Learning Opportunity',
                content: 'This scenario shows why rapid response is crucial:',
                lessons: [
                    'Delayed action allows scammers to cause more damage',
                    'Incomplete evidence makes confrontation less effective',
                    'Isolation makes victims more vulnerable to manipulation'
                ]
            }
        });

        this.educationalFeedback.set('eli_account_security', {
            success: {
                title: 'Account Security Breach Contained!',
                content: 'Excellent rapid response to the security threat. You demonstrated:',
                points: [
                    'Quick threat identification prevents further compromise',
                    'Systematic security lockdown protects all access points',
                    'Verification ensures complete account recovery',
                    'Proactive security measures prevent future attacks'
                ]
            },
            partial: {
                title: 'Security Improved, But Vulnerabilities Remain',
                content: 'Your response was good but left some gaps:',
                improvements: [
                    'Faster password changes prevent ongoing access',
                    'Complete session termination stops active attacks',
                    'Thorough asset verification ensures nothing was stolen'
                ]
            },
            failure: {
                title: 'Security Breach Consequences',
                content: 'Slow response allowed the attack to succeed:',
                lessons: [
                    'Every second counts in security incidents',
                    'Incomplete lockdown leaves attack vectors open',
                    'Poor verification misses ongoing compromise'
                ]
            }
        });

        this.educationalFeedback.set('stanley_identity_response', {
            success: {
                title: 'Identity Theft Response Executed Successfully!',
                content: 'Outstanding systematic response to identity theft. You showed:',
                points: [
                    'Comprehensive damage assessment reveals full scope',
                    'Rapid containment prevents further misuse',
                    'Community protection helps prevent others from victimization',
                    'Proper documentation supports legal action'
                ]
            },
            partial: {
                title: 'Good Response, Some Areas Missed',
                content: 'Your response helped but could be more comprehensive:',
                improvements: [
                    'More thorough damage assessment finds hidden issues',
                    'Faster containment reduces ongoing damage',
                    'Better community warnings prevent spread'
                ]
            },
            failure: {
                title: 'Identity Theft Consequences',
                content: 'Inadequate response allowed continued damage:',
                lessons: [
                    'Incomplete assessment misses ongoing theft',
                    'Slow containment allows more accounts to be compromised',
                    'Poor community protection enables more victims'
                ]
            }
        });
    }

    /**
     * Start an action sequence for a character
     */
    startActionSequence(sequenceType, character, context = {}) {
        const template = this.sequenceTemplates.get(`${character}_${sequenceType}`);
        if (!template) {
            throw new Error(`No action sequence template found for ${character}_${sequenceType}`);
        }

        const sequenceId = this.generateSequenceId();
        const sequence = {
            id: sequenceId,
            type: sequenceType,
            character: character,
            template: template,
            currentPhase: 0,
            startTime: Date.now(),
            context: context,
            actions: [],
            performance: {
                speed: 0,
                accuracy: 0,
                completeness: 0
            },
            status: 'active'
        };

        this.activeSequences.set(sequenceId, sequence);
        this.performanceMetrics.set(sequenceId, {
            phaseStartTimes: [Date.now()],
            toolUsage: new Map(),
            objectivesCompleted: new Set(),
            errors: []
        });

        return {
            sequenceId: sequenceId,
            currentPhase: this.getCurrentPhaseInfo(sequence),
            availableTools: this.getAvailableTools(sequence),
            objectives: this.getCurrentObjectives(sequence)
        };
    }

    /**
     * Process an action within an active sequence
     */
    processAction(sequenceId, action) {
        const sequence = this.activeSequences.get(sequenceId);
        if (!sequence || sequence.status !== 'active') {
            throw new Error(`No active sequence found with ID: ${sequenceId}`);
        }

        const currentPhase = sequence.template.phases[sequence.currentPhase];
        const metrics = this.performanceMetrics.get(sequenceId);
        
        // Validate action against current phase
        const actionResult = this.validateAndExecuteAction(sequence, action, currentPhase);
        
        // Record action and update metrics
        sequence.actions.push({
            timestamp: Date.now(),
            phase: sequence.currentPhase,
            action: action,
            result: actionResult
        });

        this.updatePerformanceMetrics(sequenceId, action, actionResult);

        // Check if phase is complete
        if (this.isPhaseComplete(sequence, currentPhase)) {
            return this.advanceToNextPhase(sequenceId);
        }

        return {
            success: actionResult.success,
            feedback: actionResult.feedback,
            currentPhase: this.getCurrentPhaseInfo(sequence),
            progress: this.calculateProgress(sequence),
            timeRemaining: this.calculateTimeRemaining(sequence, currentPhase)
        };
    }

    /**
     * Validate and execute an action
     */
    validateAndExecuteAction(sequence, action, currentPhase) {
        const tool = this.responseTools.get(action.toolId);
        if (!tool) {
            return {
                success: false,
                feedback: `Unknown tool: ${action.toolId}`,
                effectiveness: 0
            };
        }

        // Check if tool is available in current phase
        if (!currentPhase.tools.includes(action.toolId)) {
            return {
                success: false,
                feedback: `Tool ${tool.name} is not available in this phase`,
                effectiveness: 0
            };
        }

        // Simulate tool effectiveness based on context and timing
        const effectiveness = this.calculateToolEffectiveness(tool, action, sequence);
        const success = effectiveness > 0.6; // 60% threshold for success

        return {
            success: success,
            effectiveness: effectiveness,
            feedback: success ? 
                `${tool.name} used effectively! ${tool.educationalValue}` :
                `${tool.name} usage could be improved. ${tool.educationalValue}`,
            educationalValue: tool.educationalValue
        };
    }

    /**
     * Calculate tool effectiveness based on context and timing
     */
    calculateToolEffectiveness(tool, action, sequence) {
        let effectiveness = tool.effectiveness;
        
        // Time pressure factor
        const currentPhase = sequence.template.phases[sequence.currentPhase];
        const phaseElapsed = Date.now() - this.performanceMetrics.get(sequence.id).phaseStartTimes[sequence.currentPhase];
        const timeRatio = phaseElapsed / currentPhase.duration;
        
        if (timeRatio > 0.8) {
            effectiveness *= 0.8; // Reduced effectiveness under extreme time pressure
        } else if (timeRatio > 0.6) {
            effectiveness *= 0.9; // Slightly reduced effectiveness under time pressure
        }

        // Context appropriateness
        if (action.context && this.isContextAppropriate(action.context, currentPhase)) {
            effectiveness *= 1.1; // Bonus for appropriate context
        }

        // Previous tool usage (avoid repetition without purpose)
        const metrics = this.performanceMetrics.get(sequence.id);
        const toolUsageCount = metrics.toolUsage.get(action.toolId) || 0;
        if (toolUsageCount > 2) {
            effectiveness *= 0.9; // Diminishing returns for overuse
        }

        return Math.min(effectiveness, 1.0);
    }

    /**
     * Check if current phase is complete
     */
    isPhaseComplete(sequence, currentPhase) {
        const metrics = this.performanceMetrics.get(sequence.id);
        const completedObjectives = Array.from(metrics.objectivesCompleted);
        const phaseObjectives = currentPhase.objectives;
        
        // Phase is complete if at least 70% of objectives are met
        const completionRatio = completedObjectives.filter(obj => 
            phaseObjectives.includes(obj)
        ).length / phaseObjectives.length;
        
        return completionRatio >= 0.7;
    }

    /**
     * Advance to next phase or complete sequence
     */
    advanceToNextPhase(sequenceId) {
        const sequence = this.activeSequences.get(sequenceId);
        const metrics = this.performanceMetrics.get(sequenceId);
        
        sequence.currentPhase++;
        
        if (sequence.currentPhase >= sequence.template.phases.length) {
            // Sequence complete
            return this.completeSequence(sequenceId);
        }

        // Start next phase
        metrics.phaseStartTimes.push(Date.now());
        
        return {
            phaseComplete: true,
            newPhase: this.getCurrentPhaseInfo(sequence),
            availableTools: this.getAvailableTools(sequence),
            objectives: this.getCurrentObjectives(sequence),
            progress: this.calculateProgress(sequence)
        };
    }

    /**
     * Complete an action sequence and provide educational feedback
     */
    completeSequence(sequenceId) {
        const sequence = this.activeSequences.get(sequenceId);
        const metrics = this.performanceMetrics.get(sequenceId);
        
        sequence.status = 'completed';
        sequence.endTime = Date.now();
        
        // Calculate final performance
        const performance = this.calculateFinalPerformance(sequence, metrics);
        sequence.performance = performance;
        
        // Generate educational feedback
        const feedback = this.generateEducationalFeedback(sequence, performance);
        
        return {
            sequenceComplete: true,
            performance: performance,
            feedback: feedback,
            duration: sequence.endTime - sequence.startTime,
            achievements: this.calculateAchievements(sequence, performance)
        };
    }

    /**
     * Calculate final performance metrics
     */
    calculateFinalPerformance(sequence, metrics) {
        const totalDuration = sequence.endTime - sequence.startTime;
        const expectedDuration = sequence.template.phases.reduce((sum, phase) => sum + phase.duration, 0);
        
        // Speed score (faster is better, but not too fast)
        const speedRatio = totalDuration / expectedDuration;
        const speed = speedRatio > 1.2 ? 0.5 : // Too slow
                     speedRatio < 0.5 ? 0.7 : // Too fast (might have missed things)
                     1.0 - Math.abs(speedRatio - 0.8) * 2; // Optimal around 80% of expected time

        // Accuracy score based on successful actions
        const totalActions = sequence.actions.length;
        const successfulActions = sequence.actions.filter(action => action.result.success).length;
        const accuracy = totalActions > 0 ? successfulActions / totalActions : 0;

        // Completeness score based on objectives met
        const totalObjectives = sequence.template.phases.reduce((sum, phase) => sum + phase.objectives.length, 0);
        const completedObjectives = metrics.objectivesCompleted.size;
        const completeness = completedObjectives / totalObjectives;

        return {
            speed: Math.max(0, Math.min(1, speed)),
            accuracy: accuracy,
            completeness: completeness,
            overall: (speed * 0.3 + accuracy * 0.4 + completeness * 0.3)
        };
    }

    /**
     * Generate educational feedback based on performance
     */
    generateEducationalFeedback(sequence, performance) {
        const feedbackKey = `${sequence.character}_${sequence.type}`;
        const feedbackTemplate = this.educationalFeedback.get(feedbackKey);
        
        if (!feedbackTemplate) {
            return {
                title: 'Sequence Complete',
                content: 'You completed the action sequence.',
                points: []
            };
        }

        if (performance.overall >= 0.8) {
            return feedbackTemplate.success;
        } else if (performance.overall >= 0.6) {
            return feedbackTemplate.partial;
        } else {
            return feedbackTemplate.failure;
        }
    }

    /**
     * Helper methods
     */
    generateSequenceId() {
        return `seq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getCurrentPhaseInfo(sequence) {
        const phase = sequence.template.phases[sequence.currentPhase];
        return {
            id: phase.id,
            name: phase.name,
            duration: phase.duration,
            phaseNumber: sequence.currentPhase + 1,
            totalPhases: sequence.template.phases.length
        };
    }

    getAvailableTools(sequence) {
        const phase = sequence.template.phases[sequence.currentPhase];
        return phase.tools.map(toolId => ({
            id: toolId,
            ...this.responseTools.get(toolId)
        }));
    }

    getCurrentObjectives(sequence) {
        const phase = sequence.template.phases[sequence.currentPhase];
        return phase.objectives;
    }

    calculateProgress(sequence) {
        const totalPhases = sequence.template.phases.length;
        const currentPhase = sequence.currentPhase;
        return (currentPhase / totalPhases) * 100;
    }

    calculateTimeRemaining(sequence, currentPhase) {
        const metrics = this.performanceMetrics.get(sequence.id);
        const phaseStartTime = metrics.phaseStartTimes[sequence.currentPhase];
        const elapsed = Date.now() - phaseStartTime;
        return Math.max(0, currentPhase.duration - elapsed);
    }

    updatePerformanceMetrics(sequenceId, action, result) {
        const metrics = this.performanceMetrics.get(sequenceId);
        
        // Update tool usage
        const currentCount = metrics.toolUsage.get(action.toolId) || 0;
        metrics.toolUsage.set(action.toolId, currentCount + 1);
        
        // Update objectives if action was successful
        if (result.success && action.objective) {
            metrics.objectivesCompleted.add(action.objective);
        }
        
        // Record errors
        if (!result.success) {
            metrics.errors.push({
                timestamp: Date.now(),
                action: action,
                error: result.feedback
            });
        }
    }

    isContextAppropriate(context, phase) {
        // Simple context validation - can be expanded
        return context && typeof context === 'object' && Object.keys(context).length > 0;
    }

    calculateAchievements(sequence, performance) {
        const achievements = [];
        
        if (performance.speed >= 0.9) {
            achievements.push('Speed Demon - Completed sequence with exceptional speed');
        }
        
        if (performance.accuracy >= 0.95) {
            achievements.push('Precision Expert - Made almost no mistakes');
        }
        
        if (performance.completeness >= 0.9) {
            achievements.push('Thorough Investigator - Completed most objectives');
        }
        
        if (performance.overall >= 0.9) {
            achievements.push('Cybersecurity Hero - Outstanding overall performance');
        }
        
        return achievements;
    }

    /**
     * Get active sequence status
     */
    getSequenceStatus(sequenceId) {
        const sequence = this.activeSequences.get(sequenceId);
        if (!sequence) {
            return null;
        }

        return {
            id: sequence.id,
            type: sequence.type,
            character: sequence.character,
            status: sequence.status,
            currentPhase: this.getCurrentPhaseInfo(sequence),
            progress: this.calculateProgress(sequence),
            performance: sequence.performance
        };
    }

    /**
     * Cancel an active sequence
     */
    cancelSequence(sequenceId) {
        const sequence = this.activeSequences.get(sequenceId);
        if (sequence && sequence.status === 'active') {
            sequence.status = 'cancelled';
            sequence.endTime = Date.now();
            return true;
        }
        return false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ActionSequenceController;
} else if (typeof window !== 'undefined') {
    window.ActionSequenceController = ActionSequenceController;
}