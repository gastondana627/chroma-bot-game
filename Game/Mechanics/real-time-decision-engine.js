/**
 * Real-Time Decision Engine
 * Manages time-pressured cybersecurity scenarios with realistic urgency levels
 * Implements requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6
 */

class RealTimeDecisionEngine {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        
        // Active scenarios management
        this.activeScenarios = new Map();
        this.scenarioHistory = [];
        this.currentScenarioId = null;
        
        // Timer management
        this.timerManager = new TimerManager();
        
        // Threat scenario database
        this.threatDatabase = new ThreatDatabase();
        
        // Configuration
        this.config = {
            defaultTimeLimit: 30, // seconds
            urgencyLevels: {
                low: { timeLimit: 60, multiplier: 1.0 },
                medium: { timeLimit: 30, multiplier: 1.2 },
                high: { timeLimit: 15, multiplier: 1.5 },
                critical: { timeLimit: 10, multiplier: 2.0 }
            },
            enableAudio: true,
            enableVisualEffects: true
        };
        
        // Event callbacks
        this.eventCallbacks = new Map();
        
        // Bind methods
        this.startRealTimeScenario = this.startRealTimeScenario.bind(this);
        this.processDecision = this.processDecision.bind(this);
        this.handleTimeout = this.handleTimeout.bind(this);
        
        console.log('⏱️ Real-Time Decision Engine initialized');
    }

    /**
     * Initialize the real-time decision engine
     * @param {Object} options - Initialization options
     * @returns {Promise<boolean>} Success status
     */
    async initialize(options = {}) {
        if (this.initialized) {
            console.log('⏱️ Engine already initialized');
            return true;
        }

        try {
            // Merge configuration
            this.config = { ...this.config, ...options };
            
            // Initialize threat database
            await this.threatDatabase.initialize();
            
            // Set up event listeners
            this.setupEventListeners();
            
            this.initialized = true;
            console.log('⏱️ Real-Time Decision Engine initialized successfully');
            
            return true;
        } catch (error) {
            console.error('Failed to initialize Real-Time Decision Engine:', error);
            return false;
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for mechanic activation
        window.addEventListener('routeToMechanic', (event) => {
            if (event.detail.mechanicType === 'realtime') {
                this.handleMechanicActivation(event.detail.context);
            }
        });

        // Listen for timer events
        window.addEventListener('timerExpired', (event) => {
            this.handleTimeout(event.detail.scenarioId);
        });
    }

    /**
     * Handle mechanic activation from decision system
     * @param {Object} context - Activation context
     */
    async handleMechanicActivation(context) {
        const { character, area, decision } = context;
        
        // Determine scenario type based on character and context
        const scenarioType = this.determineScenarioType(character, area, decision);
        const urgencyLevel = this.determineUrgencyLevel(context);
        
        // Start real-time scenario
        await this.startRealTimeScenario(scenarioType, character, urgencyLevel, context);
    }

    /**
     * Start a real-time decision scenario
     * @param {string} scenarioType - Type of scenario
     * @param {string} character - Character name
     * @param {string} urgencyLevel - Urgency level (low, medium, high, critical)
     * @param {Object} context - Additional context
     * @returns {Promise<Object>} Scenario data
     */
    async startRealTimeScenario(scenarioType, character, urgencyLevel = 'medium', context = {}) {
        console.log(`⏱️ Starting real-time scenario: ${scenarioType} for ${character} (${urgencyLevel})`);
        
        // Generate scenario
        const scenario = await this.generateScenario(scenarioType, character, urgencyLevel, context);
        if (!scenario) {
            throw new Error(`Failed to generate scenario: ${scenarioType}`);
        }

        // Create scenario session
        const scenarioId = `realtime_${character}_${Date.now()}`;
        const scenarioSession = {
            id: scenarioId,
            character,
            scenarioType,
            urgencyLevel,
            scenario,
            context,
            startTime: Date.now(),
            timeLimit: scenario.timeLimit,
            status: 'active',
            decisions: [],
            currentPhase: 0
        };

        this.activeScenarios.set(scenarioId, scenarioSession);
        this.currentScenarioId = scenarioId;

        // Start timer
        this.timerManager.startTimer(scenarioId, scenario.timeLimit, () => {
            this.handleTimeout(scenarioId);
        });

        // Render scenario interface
        const scenarioInterface = this.renderScenarioInterface(scenarioSession);

        // Play audio cue if enabled
        if (this.config.enableAudio) {
            this.playUrgencyAudio(urgencyLevel);
        }

        // Dispatch scenario started event
        window.dispatchEvent(new CustomEvent('realTimeScenarioStarted', {
            detail: { scenarioId, scenario: scenarioSession }
        }));

        return {
            scenarioId,
            interface: scenarioInterface,
            session: scenarioSession
        };
    }

    /**
     * Generate a real-time scenario
     * @param {string} scenarioType - Type of scenario
     * @param {string} character - Character name
     * @param {string} urgencyLevel - Urgency level
     * @param {Object} context - Additional context
     * @returns {Promise<Object>} Generated scenario
     */
    async generateScenario(scenarioType, character, urgencyLevel, context) {
        // Get base scenario from threat database
        const baseScenario = await this.threatDatabase.getScenario(scenarioType, character);
        if (!baseScenario) {
            console.error(`No base scenario found for ${scenarioType} - ${character}`);
            return null;
        }

        // If scenario already has detailed phases, use them directly
        if (baseScenario.phases && baseScenario.phases.length > 0) {
            // Use pre-defined detailed scenario
            const scenario = {
                ...baseScenario,
                character,
                scenarioType,
                urgencyLevel: baseScenario.urgencyLevel || urgencyLevel,
                timeLimit: baseScenario.timeLimit || this.config.urgencyLevels[urgencyLevel].timeLimit
            };
            
            console.log(`⏱️ Using detailed scenario: ${scenario.title}`);
            return scenario;
        }

        // Fallback to generated phases for basic scenarios
        const urgencyConfig = this.config.urgencyLevels[urgencyLevel];
        const timeLimit = urgencyConfig.timeLimit;

        const scenario = {
            id: baseScenario.id,
            title: baseScenario.title,
            description: baseScenario.description,
            character,
            scenarioType,
            urgencyLevel,
            timeLimit,
            threatType: baseScenario.threatType,
            phases: this.generateScenarioPhases(baseScenario, urgencyLevel),
            educationalGoals: baseScenario.educationalGoals,
            realWorldMapping: baseScenario.realWorldMapping
        };

        return scenario;
    }

    /**
     * Generate scenario phases with time-pressured decisions
     * @param {Object} baseScenario - Base scenario data
     * @param {string} urgencyLevel - Urgency level
     * @returns {Array} Scenario phases
     */
    generateScenarioPhases(baseScenario, urgencyLevel) {
        const phases = [];
        const urgencyConfig = this.config.urgencyLevels[urgencyLevel];
        
        // Phase 1: Initial threat detection
        phases.push({
            id: 'detection',
            title: 'Threat Detection',
            description: baseScenario.situation.description,
            timeAllowed: Math.floor(urgencyConfig.timeLimit * 0.4), // 40% of total time
            decisions: [
                {
                    id: 'analyze_threat',
                    text: 'Analyze the threat indicators',
                    correctness: 'optimal',
                    consequences: { threat_analysis: +2, response_time: +1 },
                    explanation: 'Proper threat analysis is crucial for effective response'
                },
                {
                    id: 'immediate_action',
                    text: 'Take immediate protective action',
                    correctness: 'acceptable',
                    consequences: { protection_level: +1, hasty_response: +1 },
                    explanation: 'Quick action can prevent damage but may miss important details'
                },
                {
                    id: 'ignore_threat',
                    text: 'Ignore the warning signs',
                    correctness: 'dangerous',
                    consequences: { vulnerability: +2, threat_exposure: +1 },
                    explanation: 'Ignoring cybersecurity threats can lead to serious consequences'
                }
            ]
        });

        // Phase 2: Response execution
        phases.push({
            id: 'response',
            title: 'Response Execution',
            description: 'Execute your cybersecurity response plan',
            timeAllowed: Math.floor(urgencyConfig.timeLimit * 0.6), // 60% of remaining time
            decisions: baseScenario.responseOptions || [
                {
                    id: 'systematic_response',
                    text: 'Follow systematic security protocols',
                    correctness: 'optimal',
                    consequences: { protocol_adherence: +2, effectiveness: +2 },
                    explanation: 'Systematic approaches ensure comprehensive threat mitigation'
                },
                {
                    id: 'rapid_containment',
                    text: 'Focus on rapid threat containment',
                    correctness: 'acceptable',
                    consequences: { containment: +2, thoroughness: -1 },
                    explanation: 'Quick containment prevents spread but may miss root causes'
                }
            ]
        });

        return phases;
    }

    /**
     * Process a real-time decision
     * @param {string} scenarioId - Scenario ID
     * @param {string} decisionId - Decision ID
     * @param {number} timeRemaining - Time remaining when decision was made
     * @returns {Object} Decision result
     */
    processDecision(scenarioId, decisionId, timeRemaining) {
        const scenarioSession = this.activeScenarios.get(scenarioId);
        if (!scenarioSession) {
            throw new Error(`Scenario not found: ${scenarioId}`);
        }

        const currentPhase = scenarioSession.scenario.phases[scenarioSession.currentPhase];
        if (!currentPhase) {
            throw new Error(`Invalid phase for scenario: ${scenarioId}`);
        }

        const decision = currentPhase.decisions.find(d => d.id === decisionId);
        if (!decision) {
            throw new Error(`Decision not found: ${decisionId}`);
        }

        console.log(`⏱️ Processing decision: ${decisionId} with ${timeRemaining}s remaining`);

        // Calculate decision quality based on timing
        const timingScore = this.calculateTimingScore(timeRemaining, currentPhase.timeAllowed);
        
        // Create decision result
        const result = {
            decisionId,
            decision,
            timeRemaining,
            timingScore,
            correctness: decision.correctness,
            consequences: { ...decision.consequences },
            explanation: decision.explanation,
            timestamp: Date.now()
        };

        // Apply timing bonus/penalty
        if (timingScore > 0.8) {
            result.consequences.timing_bonus = +1;
        } else if (timingScore < 0.3) {
            result.consequences.timing_penalty = -1;
        }

        // Record decision
        scenarioSession.decisions.push(result);

        // Apply consequences
        this.applyDecisionConsequences(scenarioSession, result);

        // Check if scenario should continue to next phase
        if (scenarioSession.currentPhase < scenarioSession.scenario.phases.length - 1) {
            scenarioSession.currentPhase++;
            this.continueToNextPhase(scenarioSession);
        } else {
            this.completeScenario(scenarioSession, 'completed');
        }

        return result;
    }

    /**
     * Calculate timing score based on response time
     * @param {number} timeRemaining - Time remaining
     * @param {number} timeAllowed - Total time allowed
     * @returns {number} Timing score (0-1)
     */
    calculateTimingScore(timeRemaining, timeAllowed) {
        const timeUsed = timeAllowed - timeRemaining;
        const optimalTime = timeAllowed * 0.6; // 60% of time is optimal
        
        if (timeUsed <= optimalTime) {
            return 1.0; // Perfect timing
        } else {
            // Gradual decrease for slower responses
            const overtime = timeUsed - optimalTime;
            const maxOvertime = timeAllowed * 0.4;
            return Math.max(0, 1 - (overtime / maxOvertime));
        }
    }

    /**
     * Continue to next phase of scenario
     * @param {Object} scenarioSession - Scenario session
     */
    continueToNextPhase(scenarioSession) {
        const nextPhase = scenarioSession.scenario.phases[scenarioSession.currentPhase];
        
        console.log(`⏱️ Continuing to phase: ${nextPhase.title}`);
        
        // Update timer for next phase
        this.timerManager.updateTimer(scenarioSession.id, nextPhase.timeAllowed);
        
        // Update interface
        this.updateScenarioInterface(scenarioSession);
    }

    /**
     * Handle scenario timeout
     * @param {string} scenarioId - Scenario ID
     */
    handleTimeout(scenarioId) {
        const scenarioSession = this.activeScenarios.get(scenarioId);
        if (!scenarioSession) {
            return;
        }

        console.log(`⏱️ Scenario timeout: ${scenarioId}`);

        // Apply timeout consequences
        const timeoutResult = {
            decisionId: 'timeout',
            decision: { text: 'No decision made (timeout)' },
            timeRemaining: 0,
            timingScore: 0,
            correctness: 'poor',
            consequences: { timeout_penalty: -2, missed_opportunity: +1 },
            explanation: 'Delayed response in cybersecurity can lead to increased damage',
            timestamp: Date.now()
        };

        scenarioSession.decisions.push(timeoutResult);
        this.applyDecisionConsequences(scenarioSession, timeoutResult);
        
        // Complete scenario with timeout status
        this.completeScenario(scenarioSession, 'timeout');
    }

    /**
     * Complete a real-time scenario
     * @param {Object} scenarioSession - Scenario session
     * @param {string} completionType - How scenario was completed
     */
    completeScenario(scenarioSession, completionType) {
        console.log(`⏱️ Completing scenario: ${scenarioSession.id} (${completionType})`);

        scenarioSession.status = completionType;
        scenarioSession.completedAt = Date.now();
        scenarioSession.duration = scenarioSession.completedAt - scenarioSession.startTime;

        // Stop timer
        this.timerManager.stopTimer(scenarioSession.id);

        // Generate outcome summary
        const outcome = this.generateOutcome(scenarioSession);

        // Show results interface
        this.showResultsInterface(scenarioSession, outcome);

        // Add to history
        this.scenarioHistory.push({
            ...scenarioSession,
            outcome
        });

        // Clean up
        this.activeScenarios.delete(scenarioSession.id);
        if (this.currentScenarioId === scenarioSession.id) {
            this.currentScenarioId = null;
        }

        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('realTimeScenarioCompleted', {
            detail: {
                scenarioId: scenarioSession.id,
                completionType,
                outcome,
                session: scenarioSession
            }
        }));
    }

    /**
     * Generate scenario outcome summary
     * @param {Object} scenarioSession - Scenario session
     * @returns {Object} Outcome summary
     */
    generateOutcome(scenarioSession) {
        const decisions = scenarioSession.decisions;
        const totalDecisions = decisions.length;
        
        // Calculate performance metrics
        const correctDecisions = decisions.filter(d => d.correctness === 'optimal').length;
        const acceptableDecisions = decisions.filter(d => d.correctness === 'acceptable').length;
        const poorDecisions = decisions.filter(d => d.correctness === 'poor' || d.correctness === 'dangerous').length;
        
        const averageTimingScore = decisions.reduce((sum, d) => sum + d.timingScore, 0) / totalDecisions;
        
        // Determine overall performance
        let performance = 'poor';
        if (correctDecisions >= totalDecisions * 0.7) {
            performance = 'excellent';
        } else if (correctDecisions + acceptableDecisions >= totalDecisions * 0.6) {
            performance = 'good';
        } else if (correctDecisions + acceptableDecisions >= totalDecisions * 0.4) {
            performance = 'fair';
        }

        // Generate educational feedback
        const feedback = this.generateEducationalFeedback(scenarioSession, performance);

        return {
            performance,
            metrics: {
                totalDecisions,
                correctDecisions,
                acceptableDecisions,
                poorDecisions,
                averageTimingScore: Math.round(averageTimingScore * 100) / 100
            },
            feedback,
            educationalGoals: scenarioSession.scenario.educationalGoals,
            realWorldMapping: scenarioSession.scenario.realWorldMapping
        };
    }

    /**
     * Generate educational feedback based on performance
     * @param {Object} scenarioSession - Scenario session
     * @param {string} performance - Overall performance level
     * @returns {Object} Educational feedback
     */
    generateEducationalFeedback(scenarioSession, performance) {
        const feedback = {
            summary: '',
            strengths: [],
            improvements: [],
            keyLessons: []
        };

        // Performance-based summary
        switch (performance) {
            case 'excellent':
                feedback.summary = 'Outstanding cybersecurity response! You demonstrated excellent threat assessment and rapid decision-making skills.';
                break;
            case 'good':
                feedback.summary = 'Good cybersecurity response with room for improvement in timing and threat analysis.';
                break;
            case 'fair':
                feedback.summary = 'Fair response, but critical cybersecurity decisions need more careful consideration.';
                break;
            default:
                feedback.summary = 'This scenario highlights the importance of quick, informed decision-making in cybersecurity.';
        }

        // Analyze decisions for specific feedback
        scenarioSession.decisions.forEach(decision => {
            if (decision.correctness === 'optimal') {
                feedback.strengths.push(`Good choice: ${decision.decision.text}`);
            } else if (decision.correctness === 'dangerous' || decision.correctness === 'poor') {
                feedback.improvements.push(`Consider: ${decision.explanation}`);
            }
        });

        // Add key lessons from scenario
        if (scenarioSession.scenario.educationalGoals) {
            feedback.keyLessons = scenarioSession.scenario.educationalGoals;
        }

        return feedback;
    }

    /**
     * Render scenario interface
     * @param {Object} scenarioSession - Scenario session
     * @returns {HTMLElement} Scenario interface element
     */
    renderScenarioInterface(scenarioSession) {
        const container = document.createElement('div');
        container.id = `realtime-scenario-${scenarioSession.id}`;
        container.className = 'realtime-scenario-interface';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            font-family: 'JetBrains Mono', monospace;
            z-index: 10002;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        `;

        // Create timer display
        const timerDisplay = document.createElement('div');
        timerDisplay.id = `timer-${scenarioSession.id}`;
        timerDisplay.className = 'scenario-timer';
        timerDisplay.style.cssText = `
            position: absolute;
            top: 30px;
            right: 30px;
            font-size: 24px;
            color: #FF0080;
            font-weight: bold;
            text-shadow: 0 0 10px #FF0080;
        `;
        container.appendChild(timerDisplay);

        // Create main content area
        const contentArea = document.createElement('div');
        contentArea.id = `content-${scenarioSession.id}`;
        contentArea.className = 'scenario-content';
        contentArea.style.cssText = `
            max-width: 800px;
            padding: 40px;
            text-align: center;
        `;

        this.renderCurrentPhase(scenarioSession, contentArea);
        container.appendChild(contentArea);

        // Add to document
        document.body.appendChild(container);

        // Start timer display updates
        this.startTimerDisplay(scenarioSession.id);

        return container;
    }

    /**
     * Render current phase content
     * @param {Object} scenarioSession - Scenario session
     * @param {HTMLElement} contentArea - Content container
     */
    renderCurrentPhase(scenarioSession, contentArea) {
        const currentPhase = scenarioSession.scenario.phases[scenarioSession.currentPhase];
        
        contentArea.innerHTML = `
            <div class="urgency-indicator" style="
                color: ${this.getUrgencyColor(scenarioSession.urgencyLevel)};
                font-size: 14px;
                text-transform: uppercase;
                margin-bottom: 20px;
                letter-spacing: 2px;
            ">
                🚨 ${scenarioSession.urgencyLevel} PRIORITY THREAT
            </div>
            
            <h1 style="
                color: #00FFFF;
                margin-bottom: 15px;
                font-size: 28px;
            ">
                ${currentPhase.title}
            </h1>
            
            <p style="
                color: #CCCCCC;
                margin-bottom: 30px;
                font-size: 16px;
                line-height: 1.5;
            ">
                ${currentPhase.description}
            </p>
            
            <div class="phase-decisions" style="
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-top: 30px;
            ">
                ${currentPhase.decisions.map((decision, index) => `
                    <button 
                        class="decision-button" 
                        data-decision-id="${decision.id}"
                        style="
                            background: rgba(0, 255, 255, 0.1);
                            border: 2px solid #00FFFF;
                            color: white;
                            padding: 15px 25px;
                            border-radius: 8px;
                            font-family: inherit;
                            font-size: 16px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            text-align: left;
                        "
                        onmouseover="this.style.background='rgba(0, 255, 255, 0.2)'"
                        onmouseout="this.style.background='rgba(0, 255, 255, 0.1)'"
                    >
                        ${decision.text}
                    </button>
                `).join('')}
            </div>
        `;

        // Add click handlers for decision buttons
        contentArea.querySelectorAll('.decision-button').forEach(button => {
            button.addEventListener('click', () => {
                const decisionId = button.dataset.decisionId;
                const timeRemaining = this.timerManager.getTimeRemaining(scenarioSession.id);
                this.processDecision(scenarioSession.id, decisionId, timeRemaining);
            });
        });
    }

    /**
     * Update scenario interface for next phase
     * @param {Object} scenarioSession - Scenario session
     */
    updateScenarioInterface(scenarioSession) {
        const contentArea = document.getElementById(`content-${scenarioSession.id}`);
        if (contentArea) {
            this.renderCurrentPhase(scenarioSession, contentArea);
        }
    }

    /**
     * Show results interface
     * @param {Object} scenarioSession - Scenario session
     * @param {Object} outcome - Scenario outcome
     */
    showResultsInterface(scenarioSession, outcome) {
        // Remove scenario interface
        const scenarioInterface = document.getElementById(`realtime-scenario-${scenarioSession.id}`);
        if (scenarioInterface) {
            scenarioInterface.remove();
        }

        // Create results interface
        const resultsContainer = document.createElement('div');
        resultsContainer.id = `results-${scenarioSession.id}`;
        resultsContainer.className = 'scenario-results';
        resultsContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #00FFFF;
            border-radius: 15px;
            padding: 30px;
            color: white;
            font-family: 'JetBrains Mono', monospace;
            z-index: 10003;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            backdrop-filter: blur(10px);
        `;

        resultsContainer.innerHTML = `
            <h2 style="color: #00FFFF; text-align: center; margin-bottom: 20px;">
                📊 Scenario Results
            </h2>
            
            <div class="performance-summary" style="
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                text-align: center;
            ">
                <h3 style="color: ${this.getPerformanceColor(outcome.performance)}; margin-bottom: 10px;">
                    Performance: ${outcome.performance.toUpperCase()}
                </h3>
                <p style="color: #CCCCCC; font-size: 14px;">
                    ${outcome.feedback.summary}
                </p>
            </div>
            
            <div class="metrics" style="margin-bottom: 20px;">
                <h4 style="color: #FFD700; margin-bottom: 10px;">Metrics:</h4>
                <ul style="color: #CCCCCC; font-size: 14px;">
                    <li>Correct Decisions: ${outcome.metrics.correctDecisions}/${outcome.metrics.totalDecisions}</li>
                    <li>Average Response Time: ${Math.round((1 - outcome.metrics.averageTimingScore) * 100)}% of allowed time</li>
                    <li>Overall Timing Score: ${Math.round(outcome.metrics.averageTimingScore * 100)}%</li>
                </ul>
            </div>
            
            ${outcome.feedback.keyLessons.length > 0 ? `
                <div class="key-lessons" style="margin-bottom: 20px;">
                    <h4 style="color: #FFD700; margin-bottom: 10px;">Key Lessons:</h4>
                    <ul style="color: #CCCCCC; font-size: 14px;">
                        ${outcome.feedback.keyLessons.map(lesson => `<li>${lesson}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div class="actions" style="text-align: center; margin-top: 30px;">
                <button id="close-results-${scenarioSession.id}" style="
                    background: #FF0080;
                    border: none;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 16px;
                    margin-right: 10px;
                ">
                    Continue
                </button>
                <button id="replay-scenario-${scenarioSession.id}" style="
                    background: rgba(0, 255, 255, 0.2);
                    border: 1px solid #00FFFF;
                    color: #00FFFF;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 16px;
                ">
                    Try Again
                </button>
            </div>
        `;

        document.body.appendChild(resultsContainer);

        // Add button handlers
        document.getElementById(`close-results-${scenarioSession.id}`).addEventListener('click', () => {
            resultsContainer.remove();
        });

        document.getElementById(`replay-scenario-${scenarioSession.id}`).addEventListener('click', () => {
            resultsContainer.remove();
            // Restart scenario with same parameters
            this.startRealTimeScenario(
                scenarioSession.scenarioType,
                scenarioSession.character,
                scenarioSession.urgencyLevel,
                scenarioSession.context
            );
        });
    }

    /**
     * Start timer display updates
     * @param {string} scenarioId - Scenario ID
     */
    startTimerDisplay(scenarioId) {
        const updateTimer = () => {
            const timerDisplay = document.getElementById(`timer-${scenarioId}`);
            if (!timerDisplay) return;

            const timeRemaining = this.timerManager.getTimeRemaining(scenarioId);
            if (timeRemaining <= 0) {
                timerDisplay.textContent = '⏰ TIME UP!';
                timerDisplay.style.color = '#FF0000';
                return;
            }

            timerDisplay.textContent = `⏱️ ${timeRemaining}s`;
            
            // Change color based on remaining time
            if (timeRemaining <= 5) {
                timerDisplay.style.color = '#FF0000';
                timerDisplay.style.animation = 'blink 1s infinite';
            } else if (timeRemaining <= 10) {
                timerDisplay.style.color = '#FF8800';
            } else {
                timerDisplay.style.color = '#FF0080';
            }

            setTimeout(updateTimer, 1000);
        };

        updateTimer();
    }

    /**
     * Apply decision consequences to story state
     * @param {Object} scenarioSession - Scenario session
     * @param {Object} result - Decision result
     */
    applyDecisionConsequences(scenarioSession, result) {
        if (!result.consequences || !window.storyTracker) return;

        const { character } = scenarioSession;
        
        Object.entries(result.consequences).forEach(([key, value]) => {
            window.storyTracker.updateStoryState(character, key, value, true);
        });

        console.log(`⏱️ Applied consequences for ${character}:`, result.consequences);
    }

    /**
     * Determine scenario type based on context
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @param {Object} decision - Decision context
     * @returns {string} Scenario type
     */
    determineScenarioType(character, area, decision) {
        // Character-specific scenario types
        const scenarioMap = {
            eli: ['gaming_scam_detection', 'peer_pressure_resistance', 'account_protection'],
            maya: ['romance_scam_detection', 'catfish_identification', 'emotional_manipulation'],
            stanley: ['elder_fraud_prevention', 'suspicious_contact_assessment', 'financial_protection']
        };

        const characterScenarios = scenarioMap[character] || ['generic_threat_response'];
        return characterScenarios[Math.floor(Math.random() * characterScenarios.length)];
    }

    /**
     * Determine urgency level based on context
     * @param {Object} context - Context data
     * @returns {string} Urgency level
     */
    determineUrgencyLevel(context) {
        // Default to medium, but can be influenced by story state or area
        const urgencyLevels = ['low', 'medium', 'high', 'critical'];
        
        // Higher areas tend to have higher urgency
        if (context.area >= 5) return 'critical';
        if (context.area >= 4) return 'high';
        if (context.area >= 3) return 'medium';
        return 'low';
    }

    /**
     * Get urgency color for UI
     * @param {string} urgencyLevel - Urgency level
     * @returns {string} Color code
     */
    getUrgencyColor(urgencyLevel) {
        const colors = {
            low: '#00FF00',
            medium: '#FFD700',
            high: '#FF8800',
            critical: '#FF0000'
        };
        return colors[urgencyLevel] || '#FFD700';
    }

    /**
     * Get performance color for UI
     * @param {string} performance - Performance level
     * @returns {string} Color code
     */
    getPerformanceColor(performance) {
        const colors = {
            excellent: '#00FF00',
            good: '#FFD700',
            fair: '#FF8800',
            poor: '#FF0000'
        };
        return colors[performance] || '#FFD700';
    }

    /**
     * Play urgency audio cue
     * @param {string} urgencyLevel - Urgency level
     */
    playUrgencyAudio(urgencyLevel) {
        // Create audio context for urgency sounds
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Different frequencies for different urgency levels
            const frequencies = {
                low: 440,
                medium: 660,
                high: 880,
                critical: 1100
            };

            oscillator.frequency.setValueAtTime(frequencies[urgencyLevel], audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.warn('Audio not available:', error);
        }
    }

    /**
     * Get scenario statistics
     * @returns {Object} Statistics
     */
    getStatistics() {
        return {
            totalScenarios: this.scenarioHistory.length,
            activeScenarios: this.activeScenarios.size,
            averagePerformance: this.calculateAveragePerformance(),
            scenarioTypes: this.getScenarioTypeStats(),
            recentScenarios: this.scenarioHistory.slice(-5)
        };
    }

    /**
     * Calculate average performance across all scenarios
     * @returns {string} Average performance level
     */
    calculateAveragePerformance() {
        if (this.scenarioHistory.length === 0) return 'none';

        const performanceScores = {
            excellent: 4,
            good: 3,
            fair: 2,
            poor: 1
        };

        const totalScore = this.scenarioHistory.reduce((sum, scenario) => {
            return sum + (performanceScores[scenario.outcome.performance] || 1);
        }, 0);

        const averageScore = totalScore / this.scenarioHistory.length;

        if (averageScore >= 3.5) return 'excellent';
        if (averageScore >= 2.5) return 'good';
        if (averageScore >= 1.5) return 'fair';
        return 'poor';
    }

    /**
     * Get scenario type statistics
     * @returns {Object} Scenario type stats
     */
    getScenarioTypeStats() {
        const stats = {};
        this.scenarioHistory.forEach(scenario => {
            const type = scenario.scenarioType;
            if (!stats[type]) {
                stats[type] = { count: 0, averagePerformance: [] };
            }
            stats[type].count++;
            stats[type].averagePerformance.push(scenario.outcome.performance);
        });
        return stats;
    }
}

/**
 * Timer Manager
 * Handles countdown timers for real-time scenarios
 */
class TimerManager {
    constructor() {
        this.activeTimers = new Map();
    }

    /**
     * Start a countdown timer
     * @param {string} timerId - Timer ID
     * @param {number} duration - Duration in seconds
     * @param {Function} callback - Callback when timer expires
     */
    startTimer(timerId, duration, callback) {
        // Clear existing timer if any
        this.stopTimer(timerId);

        const timer = {
            id: timerId,
            startTime: Date.now(),
            duration: duration * 1000, // Convert to milliseconds
            callback,
            intervalId: null
        };

        // Set up interval to check timer
        timer.intervalId = setInterval(() => {
            const elapsed = Date.now() - timer.startTime;
            if (elapsed >= timer.duration) {
                this.stopTimer(timerId);
                if (callback) callback();
                
                // Dispatch timer expired event
                window.dispatchEvent(new CustomEvent('timerExpired', {
                    detail: { timerId }
                }));
            }
        }, 100); // Check every 100ms for accuracy

        this.activeTimers.set(timerId, timer);
        console.log(`⏱️ Timer started: ${timerId} (${duration}s)`);
    }

    /**
     * Stop a timer
     * @param {string} timerId - Timer ID
     */
    stopTimer(timerId) {
        const timer = this.activeTimers.get(timerId);
        if (timer) {
            clearInterval(timer.intervalId);
            this.activeTimers.delete(timerId);
            console.log(`⏱️ Timer stopped: ${timerId}`);
        }
    }

    /**
     * Update timer duration
     * @param {string} timerId - Timer ID
     * @param {number} newDuration - New duration in seconds
     */
    updateTimer(timerId, newDuration) {
        const timer = this.activeTimers.get(timerId);
        if (timer) {
            timer.startTime = Date.now();
            timer.duration = newDuration * 1000;
            console.log(`⏱️ Timer updated: ${timerId} (${newDuration}s)`);
        }
    }

    /**
     * Get remaining time for a timer
     * @param {string} timerId - Timer ID
     * @returns {number} Remaining time in seconds
     */
    getTimeRemaining(timerId) {
        const timer = this.activeTimers.get(timerId);
        if (!timer) return 0;

        const elapsed = Date.now() - timer.startTime;
        const remaining = Math.max(0, timer.duration - elapsed);
        return Math.ceil(remaining / 1000); // Convert to seconds and round up
    }

    /**
     * Check if timer is active
     * @param {string} timerId - Timer ID
     * @returns {boolean} Whether timer is active
     */
    isActive(timerId) {
        return this.activeTimers.has(timerId);
    }

    /**
     * Get all active timers
     * @returns {Array} Active timer IDs
     */
    getActiveTimers() {
        return Array.from(this.activeTimers.keys());
    }

    /**
     * Stop all timers
     */
    stopAllTimers() {
        this.activeTimers.forEach((timer, timerId) => {
            this.stopTimer(timerId);
        });
    }
}

/**
 * Threat Database
 * Manages cybersecurity threat scenarios and educational content
 */
class ThreatDatabase {
    constructor() {
        this.scenarios = new Map();
        this.initialized = false;
    }

    /**
     * Initialize threat database with scenarios
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.initialized) return;

        // Load threat scenarios
        this.loadThreatScenarios();
        
        this.initialized = true;
        console.log('⏱️ Threat Database initialized');
    }

    /**
     * Load threat scenarios for each character
     */
    loadThreatScenarios() {
        // Check if character-specific scenarios are available
        if (window.characterRealTimeScenarios) {
            // Use detailed character-specific scenarios
            const characterScenarios = window.characterRealTimeScenarios;
            
            // Copy all scenarios from character scenarios
            characterScenarios.scenarios.forEach((scenario, key) => {
                this.scenarios.set(key, scenario);
            });
            
            console.log(`⏱️ Loaded ${this.scenarios.size} detailed character scenarios`);
        } else {
            // Fallback to basic scenarios if character scenarios not available
            this.loadBasicScenarios();
        }
    }

    /**
     * Load basic fallback scenarios
     */
    loadBasicScenarios() {
        // Eli's gaming-related scenarios
        this.addScenario('gaming_scam_detection', 'eli', {
            id: 'eli_gaming_scam',
            title: 'Gaming Tournament Scam',
            description: 'A suspicious tournament invitation with unusually high prize money has appeared. You need to verify its legitimacy quickly.',
            threatType: 'gaming_fraud',
            situation: {
                description: 'You received an email about a gaming tournament with a $50,000 prize pool, but something feels off about the organizer.',
                context: { suspicious_email: true, high_stakes: true },
                threatIndicators: ['Unverified organizer', 'Upfront fee required', 'Pressure to register quickly']
            },
            educationalGoals: [
                'Learn to verify tournament legitimacy',
                'Recognize gaming scam red flags',
                'Understand safe gaming practices'
            ],
            realWorldMapping: 'Gaming fraud affects millions of players annually, with scammers targeting competitive gaming communities'
        });

        this.addScenario('peer_pressure_resistance', 'eli', {
            id: 'eli_peer_pressure',
            title: 'Gaming Community Pressure',
            description: 'Your gaming friends are pressuring you to share account details for a "team strategy". You need to respond appropriately.',
            threatType: 'social_engineering',
            situation: {
                description: 'Team members are asking for your account credentials to "optimize team performance" in an upcoming match.',
                context: { peer_pressure: true, account_security: true },
                threatIndicators: ['Credential sharing request', 'Time pressure', 'Group manipulation']
            },
            educationalGoals: [
                'Resist peer pressure in gaming contexts',
                'Protect account credentials',
                'Maintain gaming security boundaries'
            ],
            realWorldMapping: 'Account sharing in gaming leads to theft, cheating accusations, and permanent bans'
        });

        // Maya's dating/romance scenarios
        this.addScenario('romance_scam_detection', 'maya', {
            id: 'maya_romance_scam',
            title: 'Suspicious Dating Profile',
            description: 'A charming match is asking for personal information and financial help after just a few conversations.',
            threatType: 'romance_fraud',
            situation: {
                description: 'Your new match claims to be traveling and needs emergency financial assistance, but their story has inconsistencies.',
                context: { emotional_manipulation: true, financial_request: true },
                threatIndicators: ['Quick emotional attachment', 'Financial emergency', 'Avoids video calls']
            },
            educationalGoals: [
                'Identify romance scam tactics',
                'Verify online dating profiles',
                'Protect against emotional manipulation'
            ],
            realWorldMapping: 'Romance scams cost victims over $300 million annually, targeting emotional vulnerabilities'
        });

        this.addScenario('catfish_identification', 'maya', {
            id: 'maya_catfish',
            title: 'Profile Verification Challenge',
            description: 'Multiple red flags suggest your match might be using stolen photos and a fake identity.',
            threatType: 'identity_fraud',
            situation: {
                description: 'Your match has professional-quality photos but refuses video calls and their stories don\'t add up.',
                context: { fake_identity: true, stolen_photos: true },
                threatIndicators: ['Professional photos only', 'Refuses video verification', 'Inconsistent personal details']
            },
            educationalGoals: [
                'Use reverse image search effectively',
                'Verify identity through multiple methods',
                'Recognize catfishing techniques'
            ],
            realWorldMapping: 'Catfishing affects 1 in 10 online daters, often leading to emotional and financial harm'
        });

        // Stanley's elder-focused scenarios
        this.addScenario('elder_fraud_prevention', 'stanley', {
            id: 'stanley_elder_fraud',
            title: 'Social Security Scam Call',
            description: 'A caller claiming to be from Social Security says your benefits will be suspended unless you verify information immediately.',
            threatType: 'government_impersonation',
            situation: {
                description: 'The caller has some of your personal information and is creating urgency about your Social Security benefits.',
                context: { authority_impersonation: true, urgency_tactics: true },
                threatIndicators: ['Unsolicited call', 'Immediate action required', 'Requests sensitive information']
            },
            educationalGoals: [
                'Recognize government impersonation scams',
                'Verify caller identity properly',
                'Understand legitimate government communication methods'
            ],
            realWorldMapping: 'Elder fraud costs seniors $3 billion annually, with government impersonation being a top tactic'
        });

        this.addScenario('suspicious_contact_assessment', 'stanley', {
            id: 'stanley_suspicious_contact',
            title: 'Unexpected Friendship Request',
            description: 'A friendly stranger on social media is showing unusual interest in your personal life and daily routines.',
            threatType: 'social_engineering',
            situation: {
                description: 'A new social media friend is asking detailed questions about your schedule, family, and financial situation.',
                context: { information_gathering: true, social_manipulation: true },
                threatIndicators: ['Excessive personal questions', 'Interest in routines', 'Financial probing']
            },
            educationalGoals: [
                'Assess suspicious social contacts',
                'Protect personal information online',
                'Recognize information gathering tactics'
            ],
            realWorldMapping: 'Social engineering targets seniors through fake friendships to gather information for future scams'
        });

        console.log(`⏱️ Loaded ${this.scenarios.size} basic threat scenarios`);
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
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RealTimeDecisionEngine, TimerManager, ThreatDatabase };
}

// Make available globally
window.RealTimeDecisionEngine = RealTimeDecisionEngine;
window.TimerManager = TimerManager;
window.ThreatDatabase = ThreatDatabase;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.realTimeEngine) {
            window.realTimeEngine = new RealTimeDecisionEngine();
            await window.realTimeEngine.initialize();
        }
    });
} else {
    if (!window.realTimeEngine) {
        window.realTimeEngine = new RealTimeDecisionEngine();
        window.realTimeEngine.initialize();
    }
}