/**
 * Social Engineering Puzzle Engine
 * Creates puzzles that teach recognition of manipulation tactics and social engineering
 * Provides psychology-based evaluation and educational feedback
 */

class SocialEngineeringPuzzleEngine {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        
        // Core components
        this.manipulationTactics = new Map();
        this.puzzleGenerator = null;
        this.psychologyEngine = null;
        this.evaluationSystem = null;
        
        // Active puzzles
        this.activePuzzles = new Map();
        this.completedPuzzles = new Map();
        
        // Configuration
        this.config = {
            enableHints: true,
            adaptiveDifficulty: true,
            educationalFeedback: true,
            realismLevel: 'high'
        };
        
        // Statistics
        this.stats = {
            puzzlesGenerated: 0,
            puzzlesCompleted: 0,
            averageScore: 0,
            tacticRecognitionRates: {}
        };
        
        // Bind methods
        this.initialize = this.initialize.bind(this);
        this.generatePuzzle = this.generatePuzzle.bind(this);
        this.evaluateSolution = this.evaluateSolution.bind(this);
    }

    /**
     * Initialize the social engineering puzzle engine
     * @param {Object} options - Initialization options
     * @returns {Promise<boolean>} Success status
     */
    async initialize(options = {}) {
        if (this.initialized) {
            console.log('🧩 Social Engineering Puzzle Engine already initialized');
            return true;
        }

        try {
            console.log('🧩 Initializing Social Engineering Puzzle Engine...');
            
            // Merge configuration
            this.config = { ...this.config, ...options };
            
            // Initialize manipulation tactics database
            this.initializeManipulationTactics();
            
            // Initialize puzzle generator
            this.puzzleGenerator = new PuzzleGenerator(this.manipulationTactics);
            
            // Initialize psychology engine
            this.psychologyEngine = new PsychologyEngine();
            
            // Initialize evaluation system
            this.evaluationSystem = new PuzzleEvaluationSystem(this.psychologyEngine);
            
            // Set up event listeners
            this.setupEventListeners();
            
            this.initialized = true;
            console.log('🧩 Social Engineering Puzzle Engine initialized successfully');
            
            return true;
        } catch (error) {
            console.error('Failed to initialize Social Engineering Puzzle Engine:', error);
            return false;
        }
    }

    /**
     * Initialize manipulation tactics database with psychological patterns
     */
    initializeManipulationTactics() {
        // Authority manipulation tactics
        this.manipulationTactics.set('authority', {
            name: 'Authority Manipulation',
            description: 'Using perceived authority to pressure compliance',
            psychologyPrinciples: ['authority_bias', 'compliance_pressure'],
            commonTechniques: [
                'impersonating_officials',
                'using_official_language',
                'creating_urgency_with_authority',
                'threatening_consequences'
            ],
            warningSignsToTeach: [
                'unsolicited_contact_from_authority',
                'pressure_for_immediate_action',
                'requests_for_sensitive_information',
                'threats_of_consequences'
            ],
            realWorldExamples: [
                'fake_irs_calls',
                'phishing_emails_from_banks',
                'fake_tech_support',
                'impersonated_law_enforcement'
            ]
        });

        // Trust exploitation tactics
        this.manipulationTactics.set('trust', {
            name: 'Trust Exploitation',
            description: 'Building false trust to manipulate victims',
            psychologyPrinciples: ['reciprocity', 'liking_bias', 'social_proof'],
            commonTechniques: [
                'building_rapport',
                'sharing_personal_information',
                'creating_false_intimacy',
                'using_social_connections'
            ],
            warningSignsToTeach: [
                'rapid_relationship_development',
                'excessive_personal_sharing',
                'requests_for_trust_without_verification',
                'isolation_from_support_networks'
            ],
            realWorldExamples: [
                'romance_scams',
                'friendship_fraud',
                'fake_investment_advisors',
                'catfishing_schemes'
            ]
        });

        // Urgency and fear tactics
        this.manipulationTactics.set('urgency', {
            name: 'Urgency and Fear Manipulation',
            description: 'Creating artificial time pressure and fear to bypass rational thinking',
            psychologyPrinciples: ['scarcity_principle', 'loss_aversion', 'fear_response'],
            commonTechniques: [
                'creating_artificial_deadlines',
                'threatening_negative_consequences',
                'claiming_limited_availability',
                'exploiting_current_fears'
            ],
            warningSignsToTeach: [
                'pressure_for_immediate_decisions',
                'threats_of_account_closure',
                'claims_of_security_breaches',
                'limited_time_offers'
            ],
            realWorldExamples: [
                'account_suspension_scams',
                'fake_security_alerts',
                'limited_time_investment_scams',
                'emergency_family_scams'
            ]
        });

        // Reciprocity manipulation
        this.manipulationTactics.set('reciprocity', {
            name: 'Reciprocity Manipulation',
            description: 'Creating false sense of obligation through fake favors or gifts',
            psychologyPrinciples: ['reciprocity_principle', 'obligation_bias'],
            commonTechniques: [
                'offering_unsolicited_help',
                'providing_free_services',
                'sharing_valuable_information',
                'creating_debt_of_gratitude'
            ],
            warningSignsToTeach: [
                'unsolicited_offers_of_help',
                'free_services_with_hidden_costs',
                'pressure_to_return_favors',
                'guilt_trips_about_ingratitude'
            ],
            realWorldExamples: [
                'free_trial_scams',
                'fake_charity_requests',
                'advance_fee_fraud',
                'tech_support_scams'
            ]
        });

        // Social proof manipulation
        this.manipulationTactics.set('social_proof', {
            name: 'Social Proof Manipulation',
            description: 'Using fake social validation to influence behavior',
            psychologyPrinciples: ['social_proof_bias', 'conformity_pressure'],
            commonTechniques: [
                'fake_testimonials',
                'manufactured_popularity',
                'false_social_connections',
                'peer_pressure_tactics'
            ],
            warningSignsToTeach: [
                'unverifiable_testimonials',
                'pressure_to_join_others',
                'claims_of_widespread_participation',
                'fake_social_media_presence'
            ],
            realWorldExamples: [
                'pyramid_scheme_recruitment',
                'fake_investment_testimonials',
                'social_media_manipulation',
                'peer_to_peer_scams'
            ]
        });

        console.log('🧩 Manipulation tactics database initialized with', this.manipulationTactics.size, 'tactics');
    }

    /**
     * Set up event listeners for puzzle engine
     */
    setupEventListeners() {
        // Listen for puzzle activation requests
        window.addEventListener('activatePuzzleMechanic', (event) => {
            this.handleMechanicActivation(event.detail);
        });

        // Listen for puzzle solution submissions
        window.addEventListener('submitPuzzleSolution', (event) => {
            this.handleSolutionSubmission(event.detail);
        });

        // Listen for hint requests
        window.addEventListener('requestPuzzleHint', (event) => {
            this.handleHintRequest(event.detail);
        });

        console.log('🧩 Puzzle engine event listeners set up');
    }

    /**
     * Generate a social engineering puzzle
     * @param {string} character - Character name (eli, maya, stanley)
     * @param {string} difficultyLevel - Difficulty level (beginner, intermediate, advanced)
     * @param {string} tacticType - Type of manipulation tactic
     * @param {Object} context - Additional context
     * @returns {Object} Generated puzzle
     */
    generatePuzzle(character, difficultyLevel = 'intermediate', tacticType = null, context = {}) {
        console.log(`🧩 Generating puzzle for ${character}, difficulty: ${difficultyLevel}, tactic: ${tacticType}`);
        
        try {
            // Select appropriate tactic if not specified
            if (!tacticType) {
                tacticType = this.selectTacticForCharacter(character, context);
            }
            
            // Validate tactic exists
            if (!this.manipulationTactics.has(tacticType)) {
                throw new Error(`Unknown manipulation tactic: ${tacticType}`);
            }
            
            // Generate puzzle using puzzle generator
            const puzzle = this.puzzleGenerator.create({
                character,
                difficulty: difficultyLevel,
                tactic: tacticType,
                context,
                realism: this.config.realismLevel
            });
            
            // Wrap with interface and tracking
            const wrappedPuzzle = this.wrapWithInterface(puzzle);
            
            // Track active puzzle
            this.activePuzzles.set(wrappedPuzzle.id, wrappedPuzzle);
            
            // Update statistics
            this.stats.puzzlesGenerated++;
            
            console.log(`🧩 Generated puzzle ${wrappedPuzzle.id} for ${character}`);
            return wrappedPuzzle;
            
        } catch (error) {
            console.error('Failed to generate puzzle:', error);
            return null;
        }
    }

    /**
     * Select appropriate manipulation tactic for character
     * @param {string} character - Character name
     * @param {Object} context - Context information
     * @returns {string} Selected tactic type
     */
    selectTacticForCharacter(character, context) {
        const characterTactics = {
            eli: ['social_proof', 'reciprocity', 'urgency'], // Gaming community pressures
            maya: ['trust', 'authority', 'urgency'], // Romance and dating scams
            stanley: ['authority', 'trust', 'urgency'] // Elder-targeted scams
        };
        
        const availableTactics = characterTactics[character] || ['trust', 'urgency'];
        
        // Select based on area or random if no specific context
        if (context.area) {
            const areaIndex = (context.area - 1) % availableTactics.length;
            return availableTactics[areaIndex];
        }
        
        return availableTactics[Math.floor(Math.random() * availableTactics.length)];
    }

    /**
     * Wrap puzzle with interface and tracking
     * @param {Object} puzzle - Generated puzzle
     * @returns {Object} Wrapped puzzle with interface
     */
    wrapWithInterface(puzzle) {
        const puzzleId = `puzzle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return {
            id: puzzleId,
            ...puzzle,
            interface: {
                type: 'social_engineering_puzzle',
                version: this.version,
                createdAt: Date.now(),
                status: 'active'
            },
            tracking: {
                startTime: Date.now(),
                attempts: 0,
                hintsUsed: 0,
                timeSpent: 0
            },
            methods: {
                submit: (solution) => this.evaluateSolution(puzzleId, solution),
                requestHint: () => this.requestHint(puzzleId),
                getProgress: () => this.getPuzzleProgress(puzzleId)
            }
        };
    }

    /**
     * Evaluate puzzle solution
     * @param {string} puzzleId - Puzzle identifier
     * @param {Object} userResponse - User's response to the puzzle
     * @returns {Object} Evaluation result with educational feedback
     */
    evaluateSolution(puzzleId, userResponse) {
        console.log(`🧩 Evaluating solution for puzzle ${puzzleId}`);
        
        const puzzle = this.activePuzzles.get(puzzleId);
        if (!puzzle) {
            throw new Error(`Puzzle ${puzzleId} not found`);
        }
        
        try {
            // Update tracking
            puzzle.tracking.attempts++;
            puzzle.tracking.timeSpent = Date.now() - puzzle.tracking.startTime;
            
            // Evaluate using psychology engine
            const analysis = this.psychologyEngine.analyze(puzzle, userResponse);
            
            // Generate educational feedback
            const feedback = this.generateEducationalFeedback(puzzle, analysis);
            
            // Calculate score
            const score = this.calculateScore(analysis, puzzle.tracking);
            
            // Create evaluation result
            const result = {
                puzzleId,
                score,
                analysis,
                feedback,
                completed: analysis.correctnessLevel >= 0.7, // 70% threshold
                timeSpent: puzzle.tracking.timeSpent,
                attempts: puzzle.tracking.attempts,
                hintsUsed: puzzle.tracking.hintsUsed
            };
            
            // Handle completion
            if (result.completed) {
                this.completePuzzle(puzzleId, result);
            }
            
            // Update statistics
            this.updateStatistics(puzzle, result);
            
            console.log(`🧩 Puzzle ${puzzleId} evaluated, score: ${score}`);
            return result;
            
        } catch (error) {
            console.error(`Failed to evaluate puzzle ${puzzleId}:`, error);
            return {
                puzzleId,
                error: error.message,
                completed: false
            };
        }
    }

    /**
     * Generate educational feedback based on analysis
     * @param {Object} puzzle - Puzzle object
     * @param {Object} analysis - Psychology analysis
     * @returns {Object} Educational feedback
     */
    generateEducationalFeedback(puzzle, analysis) {
        const tactic = this.manipulationTactics.get(puzzle.tacticType);
        
        return {
            overall: this.generateOverallFeedback(analysis, tactic),
            tacticRecognition: this.generateTacticFeedback(analysis, tactic),
            warningSignsIdentified: this.generateWarningSignsFeedback(analysis, tactic),
            psychologyExplanation: this.generatePsychologyExplanation(analysis, tactic),
            realWorldApplication: this.generateRealWorldApplication(puzzle.character, tactic),
            improvementSuggestions: this.generateImprovementSuggestions(analysis, puzzle.tracking)
        };
    }

    /**
     * Generate overall feedback message
     * @param {Object} analysis - Psychology analysis
     * @param {Object} tactic - Manipulation tactic
     * @returns {string} Overall feedback
     */
    generateOverallFeedback(analysis, tactic) {
        const correctnessLevel = analysis.correctnessLevel;
        
        if (correctnessLevel >= 0.9) {
            return `Excellent work! You demonstrated strong recognition of ${tactic.name} tactics and showed clear understanding of the psychological manipulation at play.`;
        } else if (correctnessLevel >= 0.7) {
            return `Good job! You identified most of the ${tactic.name} tactics, though there are a few areas where you could strengthen your recognition skills.`;
        } else if (correctnessLevel >= 0.5) {
            return `You're on the right track with recognizing ${tactic.name}, but there are several key warning signs you missed. Let's review what to look for.`;
        } else {
            return `This ${tactic.name} scenario was challenging. Let's break down the manipulation tactics used and learn how to spot them in the future.`;
        }
    }

    /**
     * Generate tactic-specific feedback
     * @param {Object} analysis - Psychology analysis
     * @param {Object} tactic - Manipulation tactic
     * @returns {Object} Tactic feedback
     */
    generateTacticFeedback(analysis, tactic) {
        return {
            tacticName: tactic.name,
            recognized: analysis.tacticRecognition || false,
            explanation: `${tactic.name} works by ${tactic.description.toLowerCase()}. The key psychological principles involved are: ${tactic.psychologyPrinciples.join(', ')}.`,
            techniques: tactic.commonTechniques.map(technique => ({
                technique,
                identified: analysis.identifiedTechniques?.includes(technique) || false
            }))
        };
    }

    /**
     * Generate warning signs feedback
     * @param {Object} analysis - Psychology analysis
     * @param {Object} tactic - Manipulation tactic
     * @returns {Object} Warning signs feedback
     */
    generateWarningSignsFeedback(analysis, tactic) {
        return {
            totalWarningSigns: tactic.warningSignsToTeach.length,
            identifiedCount: analysis.identifiedWarningSigns?.length || 0,
            missedSigns: tactic.warningSignsToTeach.filter(sign => 
                !analysis.identifiedWarningSigns?.includes(sign)
            ),
            explanations: tactic.warningSignsToTeach.reduce((acc, sign) => {
                acc[sign] = this.getWarningSignExplanation(sign, tactic);
                return acc;
            }, {})
        };
    }

    /**
     * Generate psychology explanation
     * @param {Object} analysis - Psychology analysis
     * @param {Object} tactic - Manipulation tactic
     * @returns {Object} Psychology explanation
     */
    generatePsychologyExplanation(analysis, tactic) {
        return {
            principles: tactic.psychologyPrinciples.map(principle => ({
                name: principle,
                explanation: this.getPsychologyPrincipleExplanation(principle),
                howItWorks: this.getHowPrincipleWorks(principle, tactic)
            })),
            whyItWorks: `These tactics are effective because they exploit natural human tendencies and cognitive biases. Understanding these psychological principles helps you recognize when someone might be trying to manipulate you.`,
            protection: `The best protection is awareness. When you understand how these psychological tactics work, you can pause and think critically before responding to pressure or manipulation.`
        };
    }

    /**
     * Generate real-world application guidance
     * @param {string} character - Character name
     * @param {Object} tactic - Manipulation tactic
     * @returns {Object} Real-world application
     */
    generateRealWorldApplication(character, tactic) {
        const characterApplications = {
            eli: {
                context: 'gaming and competitive environments',
                examples: tactic.realWorldExamples.filter(ex => 
                    ex.includes('gaming') || ex.includes('peer') || ex.includes('competitive')
                ),
                protection: 'Always verify tournament legitimacy, be skeptical of too-good-to-be-true offers, and maintain healthy skepticism in gaming communities.'
            },
            maya: {
                context: 'dating and social relationships',
                examples: tactic.realWorldExamples.filter(ex => 
                    ex.includes('romance') || ex.includes('dating') || ex.includes('relationship')
                ),
                protection: 'Take time to verify online identities, be cautious of rapid relationship development, and trust your instincts about inconsistencies.'
            },
            stanley: {
                context: 'elder-targeted scams and community interactions',
                examples: tactic.realWorldExamples.filter(ex => 
                    ex.includes('elder') || ex.includes('authority') || ex.includes('community')
                ),
                protection: 'Verify authority figures independently, be skeptical of unsolicited contact, and consult trusted family or friends before making decisions.'
            }
        };

        return characterApplications[character] || {
            context: 'general cybersecurity',
            examples: tactic.realWorldExamples,
            protection: 'Stay alert, verify information independently, and trust your instincts when something feels wrong.'
        };
    }

    /**
     * Generate improvement suggestions
     * @param {Object} analysis - Psychology analysis
     * @param {Object} tracking - Puzzle tracking data
     * @returns {Array} Improvement suggestions
     */
    generateImprovementSuggestions(analysis, tracking) {
        const suggestions = [];
        
        if (analysis.correctnessLevel < 0.7) {
            suggestions.push('Practice identifying warning signs by reviewing the key indicators for this manipulation tactic.');
        }
        
        if (tracking.timeSpent < 30000) { // Less than 30 seconds
            suggestions.push('Take more time to carefully analyze the scenario. Rushing can cause you to miss important details.');
        }
        
        if (tracking.hintsUsed === 0 && analysis.correctnessLevel < 0.8) {
            suggestions.push('Don\'t hesitate to use hints when you\'re unsure. They\'re designed to help you learn.');
        }
        
        if (analysis.identifiedTechniques?.length < 2) {
            suggestions.push('Try to identify multiple manipulation techniques in each scenario. Scammers often use several tactics together.');
        }
        
        return suggestions;
    }

    /**
     * Complete a puzzle and move it to completed puzzles
     * @param {string} puzzleId - Puzzle identifier
     * @param {Object} result - Evaluation result
     */
    completePuzzle(puzzleId, result) {
        const puzzle = this.activePuzzles.get(puzzleId);
        if (puzzle) {
            puzzle.interface.status = 'completed';
            puzzle.result = result;
            
            this.completedPuzzles.set(puzzleId, puzzle);
            this.activePuzzles.delete(puzzleId);
            
            this.stats.puzzlesCompleted++;
            
            // Dispatch completion event
            window.dispatchEvent(new CustomEvent('puzzleCompleted', {
                detail: {
                    puzzleId,
                    character: puzzle.character,
                    tacticType: puzzle.tacticType,
                    score: result.score,
                    timeSpent: result.timeSpent
                }
            }));
        }
    }

    /**
     * Update engine statistics
     * @param {Object} puzzle - Puzzle object
     * @param {Object} result - Evaluation result
     */
    updateStatistics(puzzle, result) {
        // Update tactic recognition rates
        if (!this.stats.tacticRecognitionRates[puzzle.tacticType]) {
            this.stats.tacticRecognitionRates[puzzle.tacticType] = {
                attempts: 0,
                successes: 0,
                averageScore: 0
            };
        }
        
        const tacticStats = this.stats.tacticRecognitionRates[puzzle.tacticType];
        tacticStats.attempts++;
        
        if (result.completed) {
            tacticStats.successes++;
        }
        
        // Update average score
        tacticStats.averageScore = (tacticStats.averageScore * (tacticStats.attempts - 1) + result.score) / tacticStats.attempts;
        
        // Update overall average score
        this.stats.averageScore = (this.stats.averageScore * (this.stats.puzzlesGenerated - 1) + result.score) / this.stats.puzzlesGenerated;
    }

    /**
     * Request hint for a puzzle
     * @param {string} puzzleId - Puzzle identifier
     * @returns {Object} Hint information
     */
    requestHint(puzzleId) {
        const puzzle = this.activePuzzles.get(puzzleId);
        if (!puzzle) {
            throw new Error(`Puzzle ${puzzleId} not found`);
        }
        
        if (!this.config.enableHints) {
            return { available: false, message: 'Hints are disabled' };
        }
        
        puzzle.tracking.hintsUsed++;
        
        const hint = this.generateHint(puzzle, puzzle.tracking.hintsUsed);
        
        console.log(`🧩 Hint provided for puzzle ${puzzleId} (hint #${puzzle.tracking.hintsUsed})`);
        return hint;
    }

    /**
     * Generate hint for puzzle
     * @param {Object} puzzle - Puzzle object
     * @param {number} hintNumber - Which hint number this is
     * @returns {Object} Hint information
     */
    generateHint(puzzle, hintNumber) {
        const tactic = this.manipulationTactics.get(puzzle.tacticType);
        const hints = [
            `Look for signs of ${tactic.name.toLowerCase()} in the scenario. What psychological pressure is being applied?`,
            `Pay attention to these warning signs: ${tactic.warningSignsToTeach.slice(0, 2).join(', ')}.`,
            `This scenario uses ${tactic.psychologyPrinciples[0].replace('_', ' ')} to influence behavior. How is this principle being exploited?`
        ];
        
        const hintIndex = Math.min(hintNumber - 1, hints.length - 1);
        
        return {
            available: true,
            hintNumber,
            totalHints: hints.length,
            hint: hints[hintIndex],
            tacticType: puzzle.tacticType,
            focusArea: hintNumber === 1 ? 'recognition' : hintNumber === 2 ? 'warning_signs' : 'psychology'
        };
    }

    /**
     * Get puzzle progress
     * @param {string} puzzleId - Puzzle identifier
     * @returns {Object} Progress information
     */
    getPuzzleProgress(puzzleId) {
        const puzzle = this.activePuzzles.get(puzzleId);
        if (!puzzle) {
            return null;
        }
        
        return {
            puzzleId,
            status: puzzle.interface.status,
            timeSpent: Date.now() - puzzle.tracking.startTime,
            attempts: puzzle.tracking.attempts,
            hintsUsed: puzzle.tracking.hintsUsed,
            character: puzzle.character,
            tacticType: puzzle.tacticType,
            difficulty: puzzle.difficulty
        };
    }

    /**
     * Handle mechanic activation from gaming engine
     * @param {Object} context - Activation context
     * @returns {Object} Activation result
     */
    async handleMechanicActivation(context) {
        console.log('🧩 Handling puzzle mechanic activation', context);
        
        try {
            // Generate puzzle based on context
            const puzzle = this.generatePuzzle(
                context.character,
                context.mechanicConfig?.difficultyLevel || 'intermediate',
                context.mechanicConfig?.tacticTypes?.[0] || null,
                context
            );
            
            if (!puzzle) {
                throw new Error('Failed to generate puzzle');
            }
            
            // Create UI for puzzle
            const ui = this.createPuzzleUI(puzzle);
            
            return {
                type: 'social_engineering_puzzle',
                puzzle,
                ui,
                methods: {
                    submit: puzzle.methods.submit,
                    requestHint: puzzle.methods.requestHint,
                    getProgress: puzzle.methods.getProgress
                }
            };
            
        } catch (error) {
            console.error('Failed to activate puzzle mechanic:', error);
            return null;
        }
    }

    /**
     * Create puzzle UI
     * @param {Object} puzzle - Puzzle object
     * @returns {HTMLElement} Puzzle UI element
     */
    createPuzzleUI(puzzle) {
        const container = document.createElement('div');
        container.id = `puzzle-${puzzle.id}`;
        container.className = 'social-engineering-puzzle-container';
        
        // Apply character-specific styling
        const characterColors = {
            eli: { primary: '#FF6B35', secondary: '#4ECDC4' },
            maya: { primary: '#FF0080', secondary: '#00FFFF' },
            stanley: { primary: '#32CD32', secondary: '#808080' }
        };
        
        const colors = characterColors[puzzle.character] || characterColors.maya;
        
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'JetBrains Mono', monospace;
            color: white;
        `;
        
        container.innerHTML = `
            <div class="puzzle-content" style="
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid ${colors.primary};
                border-radius: 12px;
                padding: 30px;
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                backdrop-filter: blur(10px);
            ">
                <div class="puzzle-header" style="
                    text-align: center;
                    margin-bottom: 25px;
                    border-bottom: 1px solid ${colors.secondary};
                    padding-bottom: 15px;
                ">
                    <h2 style="color: ${colors.primary}; margin: 0 0 10px 0;">
                        🧩 Social Engineering Puzzle
                    </h2>
                    <p style="color: ${colors.secondary}; margin: 0; font-size: 14px;">
                        Character: ${puzzle.character.toUpperCase()} | 
                        Tactic: ${puzzle.tacticType.replace('_', ' ').toUpperCase()} | 
                        Difficulty: ${puzzle.difficulty.toUpperCase()}
                    </p>
                </div>
                
                <div class="puzzle-scenario" style="margin-bottom: 25px;">
                    <h3 style="color: ${colors.secondary}; margin-bottom: 15px;">Scenario:</h3>
                    <div style="
                        background: rgba(255, 255, 255, 0.05);
                        padding: 20px;
                        border-radius: 8px;
                        border-left: 4px solid ${colors.primary};
                        line-height: 1.6;
                    ">
                        ${puzzle.scenario?.setup || 'Loading scenario...'}
                    </div>
                </div>
                
                <div class="puzzle-challenges" style="margin-bottom: 25px;">
                    <h3 style="color: ${colors.secondary}; margin-bottom: 15px;">Analysis Questions:</h3>
                    <div id="challenges-container">
                        ${this.generateChallengesHTML(puzzle, colors)}
                    </div>
                </div>
                
                <div class="puzzle-actions" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid ${colors.secondary};
                ">
                    <button id="hint-btn" style="
                        background: rgba(${colors.secondary}, 0.2);
                        border: 1px solid ${colors.secondary};
                        color: ${colors.secondary};
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-family: inherit;
                    ">💡 Get Hint</button>
                    
                    <div style="display: flex; gap: 15px;">
                        <button id="submit-btn" style="
                            background: ${colors.primary};
                            border: none;
                            color: white;
                            padding: 12px 25px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-family: inherit;
                            font-weight: bold;
                        ">Submit Analysis</button>
                        
                        <button id="close-btn" style="
                            background: rgba(255, 0, 0, 0.7);
                            border: none;
                            color: white;
                            padding: 12px 25px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-family: inherit;
                        ">Close</button>
                    </div>
                </div>
                
                <div id="feedback-container" style="
                    margin-top: 20px;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 8px;
                    display: none;
                "></div>
            </div>
        `;
        
        // Set up event listeners
        this.setupPuzzleUIEventListeners(container, puzzle);
        
        return container;
    }

    /**
     * Generate HTML for puzzle challenges
     * @param {Object} puzzle - Puzzle object
     * @param {Object} colors - Character color scheme
     * @returns {string} HTML for challenges
     */
    generateChallengesHTML(puzzle, colors) {
        if (!puzzle.challenges || puzzle.challenges.length === 0) {
            return '<p style="color: #FFD700;">Loading challenges...</p>';
        }

        return puzzle.challenges.map((challenge, index) => `
            <div class="challenge" style="
                margin-bottom: 20px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 8px;
                border-left: 3px solid ${colors.secondary};
            " data-challenge-id="${challenge.id}">
                <h4 style="color: ${colors.primary}; margin-bottom: 15px;">
                    Question ${index + 1}: ${challenge.question}
                </h4>
                <div class="challenge-options" style="margin-bottom: 15px;">
                    ${challenge.options.map((option, optIndex) => `
                        <label style="
                            display: block;
                            margin-bottom: 10px;
                            cursor: pointer;
                            padding: 10px;
                            background: rgba(0, 0, 0, 0.2);
                            border-radius: 6px;
                            border: 1px solid transparent;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.borderColor='${colors.secondary}'" 
                           onmouseout="this.style.borderColor='transparent'">
                            <input type="radio" name="challenge_${challenge.id}" value="${option}" style="
                                margin-right: 10px;
                                accent-color: ${colors.primary};
                            ">
                            <span style="color: white;">${option}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="challenge-feedback" id="feedback_${challenge.id}" style="
                    display: none;
                    margin-top: 15px;
                    padding: 15px;
                    border-radius: 6px;
                    background: rgba(0, 0, 0, 0.3);
                "></div>
            </div>
        `).join('');
    }

    /**
     * Set up event listeners for puzzle UI
     * @param {HTMLElement} container - Puzzle container
     * @param {Object} puzzle - Puzzle object
     */
    setupPuzzleUIEventListeners(container, puzzle) {
        const hintBtn = container.querySelector('#hint-btn');
        const submitBtn = container.querySelector('#submit-btn');
        const closeBtn = container.querySelector('#close-btn');
        
        hintBtn.addEventListener('click', () => {
            const hint = this.requestHint(puzzle.id);
            this.displayHint(container, hint);
        });
        
        submitBtn.addEventListener('click', () => {
            const userResponse = this.collectUserResponse(container);
            const result = this.evaluateSolution(puzzle.id, userResponse);
            this.displayFeedback(container, result);
        });
        
        closeBtn.addEventListener('click', () => {
            this.closePuzzle(puzzle.id);
            container.remove();
        });
    }

    /**
     * Collect user response from UI
     * @param {HTMLElement} container - Puzzle container
     * @returns {Object} User response
     */
    collectUserResponse(container) {
        const responses = {};
        const challenges = container.querySelectorAll('.challenge');
        
        challenges.forEach(challengeElement => {
            const challengeId = challengeElement.dataset.challengeId;
            const selectedOption = challengeElement.querySelector(`input[name="challenge_${challengeId}"]:checked`);
            
            if (selectedOption) {
                responses[challengeId] = selectedOption.value;
            }
        });
        
        // Calculate confidence based on how many questions were answered
        const totalChallenges = challenges.length;
        const answeredChallenges = Object.keys(responses).length;
        const confidence = answeredChallenges / totalChallenges;
        
        return {
            challengeResponses: responses,
            confidence: confidence,
            totalChallenges: totalChallenges,
            answeredChallenges: answeredChallenges,
            reasoning: 'User completed puzzle challenges'
        };
    }

    /**
     * Display hint in UI
     * @param {HTMLElement} container - Puzzle container
     * @param {Object} hint - Hint information
     */
    displayHint(container, hint) {
        const hintContainer = document.createElement('div');
        hintContainer.style.cssText = `
            margin-top: 15px;
            padding: 15px;
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid #FFD700;
            border-radius: 6px;
            color: #FFD700;
        `;
        hintContainer.innerHTML = `
            <strong>💡 Hint ${hint.hintNumber}:</strong> ${hint.hint}
        `;
        
        const challengesContainer = container.querySelector('#challenges-container');
        challengesContainer.appendChild(hintContainer);
    }

    /**
     * Display feedback in UI
     * @param {HTMLElement} container - Puzzle container
     * @param {Object} result - Evaluation result
     */
    displayFeedback(container, result) {
        const feedbackContainer = container.querySelector('#feedback-container');
        feedbackContainer.style.display = 'block';
        
        const scoreColor = result.score >= 0.8 ? '#32CD32' : result.score >= 0.6 ? '#FFD700' : '#FF6B6B';
        
        // Display individual challenge feedback first
        if (result.analysis && result.analysis.challengeResults) {
            result.analysis.challengeResults.forEach(challengeResult => {
                const challengeFeedback = container.querySelector(`#feedback_${challengeResult.challengeId}`);
                if (challengeFeedback) {
                    challengeFeedback.style.display = 'block';
                    challengeFeedback.style.borderLeft = `3px solid ${challengeResult.isCorrect ? '#32CD32' : '#FF6B6B'}`;
                    challengeFeedback.innerHTML = `
                        <div style="color: ${challengeResult.isCorrect ? '#32CD32' : '#FF6B6B'}; font-weight: bold; margin-bottom: 10px;">
                            ${challengeResult.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </div>
                        <div style="color: white; line-height: 1.5;">
                            ${challengeResult.feedback}
                        </div>
                    `;
                }
            });
        }
        
        // Display overall feedback
        feedbackContainer.innerHTML = `
            <h3 style="color: ${scoreColor}; margin-bottom: 15px;">
                📊 Overall Analysis Results (Score: ${Math.round(result.score * 100)}%)
            </h3>
            <div style="margin-bottom: 15px;">
                <strong>Performance Summary:</strong><br>
                You answered ${result.analysis?.correctAnswers || 0} out of ${result.analysis?.totalAnswers || 0} questions correctly.
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Overall Feedback:</strong><br>
                ${result.feedback.overall}
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Psychology Explanation:</strong><br>
                ${result.feedback.psychologyExplanation.whyItWorks}
            </div>
            ${result.feedback.improvementSuggestions.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <strong>Improvement Suggestions:</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        ${result.feedback.improvementSuggestions.map(suggestion => 
                            `<li style="margin: 5px 0;">${suggestion}</li>`
                        ).join('')}
                    </ul>
                </div>
            ` : ''}
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #444;">
                <strong>Real-World Application:</strong><br>
                ${result.feedback.realWorldApplication.protection}
            </div>
        `;
        
        // Scroll to feedback
        feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Close puzzle and clean up
     * @param {string} puzzleId - Puzzle identifier
     */
    closePuzzle(puzzleId) {
        const puzzle = this.activePuzzles.get(puzzleId);
        if (puzzle && puzzle.interface.status === 'active') {
            puzzle.interface.status = 'cancelled';
            this.activePuzzles.delete(puzzleId);
        }
    }

    // Helper methods for generating explanations
    getWarningSignExplanation(sign, tactic) {
        const explanations = {
            'unsolicited_contact_from_authority': 'Legitimate authorities rarely contact you unexpectedly asking for sensitive information.',
            'pressure_for_immediate_action': 'Scammers create artificial urgency to prevent you from thinking critically.',
            'requests_for_sensitive_information': 'Be suspicious of any unsolicited requests for passwords, SSN, or financial information.',
            'rapid_relationship_development': 'Genuine relationships develop naturally over time, not within days or weeks.',
            'excessive_personal_sharing': 'Scammers share personal details to create false intimacy and trust.',
            'unverifiable_testimonials': 'Fake testimonials are easy to create and should always be independently verified.'
        };
        return explanations[sign] || 'This is a common warning sign to watch for in manipulation attempts.';
    }

    getPsychologyPrincipleExplanation(principle) {
        const explanations = {
            'authority_bias': 'People tend to comply with requests from perceived authority figures.',
            'reciprocity_principle': 'People feel obligated to return favors, even fake ones.',
            'social_proof_bias': 'People look to others\' behavior to guide their own actions.',
            'scarcity_principle': 'People value things more when they believe they are rare or limited.',
            'fear_response': 'Fear can override rational thinking and lead to poor decisions.'
        };
        return explanations[principle] || 'This psychological principle influences human behavior.';
    }

    getHowPrincipleWorks(principle, tactic) {
        return `In ${tactic.name.toLowerCase()}, this principle is exploited by ${tactic.description.toLowerCase()}.`;
    }

    /**
     * Get engine statistics
     * @returns {Object} Engine statistics
     */
    getStatistics() {
        return {
            ...this.stats,
            activePuzzles: this.activePuzzles.size,
            completedPuzzles: this.completedPuzzles.size,
            successRate: this.stats.puzzlesGenerated > 0 ? 
                        (this.stats.puzzlesCompleted / this.stats.puzzlesGenerated) : 0
        };
    }

    /**
     * Get active puzzles
     * @returns {Array} Active puzzles
     */
    getActivePuzzles() {
        return Array.from(this.activePuzzles.values());
    }

    /**
     * Get completed puzzles
     * @returns {Array} Completed puzzles
     */
    getCompletedPuzzles() {
        return Array.from(this.completedPuzzles.values());
    }
}

// Puzzle Generator class
class PuzzleGenerator {
    constructor(manipulationTactics) {
        this.manipulationTactics = manipulationTactics;
        this.characterScenarios = null;
        this.initializeScenarioTemplates();
    }

    initializeScenarioTemplates() {
        // Wait for character scenarios to be available
        if (window.characterPuzzleScenarios) {
            this.characterScenarios = window.characterPuzzleScenarios;
        } else {
            // Initialize character scenarios if not available
            this.characterScenarios = new window.CharacterPuzzleScenarios();
        }
        console.log('🧩 Puzzle generator initialized with character scenarios');
    }

    create(options) {
        const { character, difficulty, tactic, context, realism } = options;
        
        // Try to get a specific scenario from character scenarios
        let scenario = null;
        if (this.characterScenarios) {
            scenario = this.characterScenarios.getRandomScenario(character, difficulty, tactic);
        }
        
        if (scenario) {
            // Use the detailed character-specific scenario
            console.log(`🧩 Using character-specific scenario: ${scenario.id}`);
            return {
                id: scenario.id,
                character: scenario.character,
                difficulty: scenario.difficulty,
                tacticType: scenario.tacticType,
                title: scenario.title,
                scenario: scenario.scenario,
                challenges: scenario.challenges,
                educationalGoals: scenario.educationalGoals,
                realWorldMapping: scenario.realWorldMapping,
                source: 'character_specific'
            };
        } else {
            // Fallback to generated scenario
            console.log(`🧩 Generating fallback scenario for ${character}, ${difficulty}, ${tactic}`);
            return this.generateFallbackScenario(character, difficulty, tactic, context);
        }
    }

    generateFallbackScenario(character, difficulty, tactic, context) {
        const characterContexts = {
            eli: {
                domain: 'gaming and competitive environments',
                threats: ['gaming scams', 'account theft', 'tournament fraud'],
                settings: ['gaming platforms', 'tournaments', 'gaming communities']
            },
            maya: {
                domain: 'dating and social relationships',
                threats: ['romance scams', 'catfishing', 'identity theft'],
                settings: ['dating apps', 'social media', 'online relationships']
            },
            stanley: {
                domain: 'elder-targeted scams and community interactions',
                threats: ['elder fraud', 'government impersonation', 'tech support scams'],
                settings: ['phone calls', 'email', 'social media']
            }
        };

        const charContext = characterContexts[character] || characterContexts.maya;
        const tacticInfo = this.manipulationTactics.get(tactic);

        return {
            character,
            difficulty,
            tacticType: tactic,
            title: `${tactic.replace('_', ' ').toUpperCase()} Recognition Challenge`,
            scenario: {
                setup: `In this ${difficulty} level scenario, you'll encounter ${tacticInfo?.name || tactic} tactics in ${charContext.domain}. Pay attention to the psychological manipulation techniques being used and identify the warning signs that should alert you to potential threats.`,
                context: context
            },
            challenges: this.generateChallenges(tactic, difficulty, character),
            educationalGoals: [
                `recognize_${tactic}_in_${character}_context`,
                `understand_${tactic}_psychology`,
                `develop_${character}_specific_protection_strategies`
            ],
            realWorldMapping: `${character}_${tactic}_general_scenarios`,
            source: 'generated_fallback'
        };
    }

    generateChallenges(tactic, difficulty, character) {
        const numChallenges = difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4;
        const tacticInfo = this.manipulationTactics.get(tactic);
        
        const challengeTypes = ['identify_tactic', 'recognize_warning_signs', 'assess_response', 'understand_psychology'];
        
        return Array.from({ length: numChallenges }, (_, i) => {
            const challengeType = challengeTypes[i] || 'assess_response';
            
            return {
                id: `challenge_${i + 1}`,
                type: challengeType,
                question: this.generateChallengeQuestion(challengeType, tactic, character, tacticInfo),
                options: this.generateChallengeOptions(challengeType, tactic, character, tacticInfo),
                correctAnswer: this.generateCorrectAnswer(challengeType, tactic, character, tacticInfo),
                explanation: this.generateChallengeExplanation(challengeType, tactic, character, tacticInfo)
            };
        });
    }

    generateChallengeQuestion(type, tactic, character, tacticInfo) {
        const questions = {
            identify_tactic: `What primary manipulation tactic is being used in this ${character} scenario?`,
            recognize_warning_signs: `What are the key warning signs you should watch for in this type of ${tactic.replace('_', ' ')} situation?`,
            assess_response: `What would be the safest way to respond to this ${tactic.replace('_', ' ')} attempt?`,
            understand_psychology: `Why is ${tacticInfo?.name || tactic} effective as a manipulation technique?`
        };
        
        return questions[type] || `How should you handle this ${tactic} scenario?`;
    }

    generateChallengeOptions(type, tactic, character, tacticInfo) {
        // Generate contextually appropriate options based on challenge type
        const baseOptions = {
            identify_tactic: [
                tacticInfo?.name || `${tactic.replace('_', ' ')} manipulation`,
                'Authority manipulation',
                'Social proof manipulation',
                'Urgency manipulation'
            ],
            recognize_warning_signs: [
                'Pressure for immediate action',
                'Requests for sensitive information',
                'Too-good-to-be-true offers',
                'All of the above'
            ],
            assess_response: [
                'Comply immediately to avoid consequences',
                'Verify independently before taking action',
                'Ignore the situation completely',
                'Ask friends for advice first'
            ],
            understand_psychology: [
                'It exploits natural human psychological tendencies',
                'It uses complex technical methods',
                'It only works on uninformed people',
                'It relies purely on luck'
            ]
        };
        
        return baseOptions[type] || ['Option A', 'Option B', 'Option C', 'Option D'];
    }

    generateCorrectAnswer(type, tactic, character, tacticInfo) {
        const correctAnswers = {
            identify_tactic: tacticInfo?.name || `${tactic.replace('_', ' ')} manipulation`,
            recognize_warning_signs: 'All of the above',
            assess_response: 'Verify independently before taking action',
            understand_psychology: 'It exploits natural human psychological tendencies'
        };
        
        return correctAnswers[type] || 'Verify independently before taking action';
    }

    generateChallengeExplanation(type, tactic, character, tacticInfo) {
        const explanations = {
            identify_tactic: `This scenario demonstrates ${tacticInfo?.name || tactic} by ${tacticInfo?.description || 'using psychological manipulation techniques'}.`,
            recognize_warning_signs: `Multiple warning signs help identify ${tactic.replace('_', ' ')} attempts: pressure tactics, information requests, and unrealistic offers.`,
            assess_response: `Independent verification is always the safest approach when dealing with potential ${tactic.replace('_', ' ')} manipulation.`,
            understand_psychology: `${tacticInfo?.name || tactic} works by exploiting psychological principles like ${tacticInfo?.psychologyPrinciples?.join(', ') || 'cognitive biases'}.`
        };
        
        return explanations[type] || `This demonstrates important principles of ${tactic.replace('_', ' ')} recognition and response.`;
    }
}

// Psychology Engine class
class PsychologyEngine {
    analyze(puzzle, userResponse) {
        if (!puzzle.challenges || !userResponse.challengeResponses) {
            // Fallback for incomplete data
            return {
                correctnessLevel: 0.5,
                tacticRecognition: false,
                identifiedTechniques: [],
                identifiedWarningSigns: [],
                confidence: userResponse.confidence || 0.5,
                reasoning: userResponse.reasoning || 'Incomplete response data'
            };
        }

        let correctAnswers = 0;
        let totalAnswers = 0;
        const identifiedTechniques = [];
        const identifiedWarningSigns = [];
        let tacticRecognition = false;

        // Analyze each challenge response
        puzzle.challenges.forEach(challenge => {
            const userAnswer = userResponse.challengeResponses[challenge.id];
            if (userAnswer) {
                totalAnswers++;
                
                // Check if answer is correct
                if (userAnswer === challenge.correctAnswer) {
                    correctAnswers++;
                    
                    // Track specific recognitions based on challenge type
                    switch (challenge.type) {
                        case 'identify_tactic':
                            tacticRecognition = true;
                            break;
                        case 'recognize_warning_signs':
                            identifiedWarningSigns.push('warning_signs_recognized');
                            break;
                        case 'assess_response':
                            identifiedTechniques.push('proper_response_identified');
                            break;
                        case 'understand_psychology':
                            identifiedTechniques.push('psychology_understood');
                            break;
                    }
                }
            }
        });

        // Calculate correctness level
        const correctnessLevel = totalAnswers > 0 ? correctAnswers / totalAnswers : 0;

        // Add tactic-specific techniques based on puzzle type
        if (tacticRecognition) {
            const tacticTechniques = this.getTacticTechniques(puzzle.tacticType);
            identifiedTechniques.push(...tacticTechniques);
        }

        return {
            correctnessLevel,
            tacticRecognition,
            identifiedTechniques,
            identifiedWarningSigns,
            confidence: userResponse.confidence || 0.5,
            reasoning: userResponse.reasoning || 'Challenge-based analysis',
            challengeResults: this.analyzeChallengeResults(puzzle.challenges, userResponse.challengeResponses),
            correctAnswers,
            totalAnswers
        };
    }

    /**
     * Get tactic-specific techniques for recognition
     * @param {string} tacticType - Type of manipulation tactic
     * @returns {Array} Array of technique identifiers
     */
    getTacticTechniques(tacticType) {
        const tacticTechniques = {
            authority: ['authority_impersonation', 'official_language_use', 'threat_of_consequences'],
            trust: ['rapport_building', 'vulnerability_sharing', 'false_intimacy'],
            urgency: ['artificial_deadlines', 'fear_tactics', 'scarcity_claims'],
            reciprocity: ['unsolicited_favors', 'obligation_creation', 'guilt_manipulation'],
            social_proof: ['fake_testimonials', 'manufactured_popularity', 'peer_pressure']
        };
        
        return tacticTechniques[tacticType] || [];
    }

    /**
     * Analyze individual challenge results
     * @param {Array} challenges - Puzzle challenges
     * @param {Object} responses - User responses
     * @returns {Array} Challenge analysis results
     */
    analyzeChallengeResults(challenges, responses) {
        return challenges.map(challenge => {
            const userAnswer = responses[challenge.id];
            const isCorrect = userAnswer === challenge.correctAnswer;
            
            return {
                challengeId: challenge.id,
                type: challenge.type,
                question: challenge.question,
                userAnswer: userAnswer || 'No answer provided',
                correctAnswer: challenge.correctAnswer,
                isCorrect,
                explanation: challenge.explanation,
                feedback: this.generateChallengeFeedback(challenge, userAnswer, isCorrect)
            };
        });
    }

    /**
     * Generate feedback for individual challenge
     * @param {Object} challenge - Challenge object
     * @param {string} userAnswer - User's answer
     * @param {boolean} isCorrect - Whether answer was correct
     * @returns {string} Feedback message
     */
    generateChallengeFeedback(challenge, userAnswer, isCorrect) {
        if (!userAnswer) {
            return 'No answer was provided for this question. Make sure to answer all questions for complete analysis.';
        }
        
        if (isCorrect) {
            return `Correct! ${challenge.explanation}`;
        } else {
            return `Not quite right. The correct answer was "${challenge.correctAnswer}". ${challenge.explanation}`;
        }
    }
}

// Puzzle Evaluation System class
class PuzzleEvaluationSystem {
    constructor(psychologyEngine) {
        this.psychologyEngine = psychologyEngine;
    }

    evaluate(puzzle, userResponse) {
        return this.psychologyEngine.analyze(puzzle, userResponse);
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        SocialEngineeringPuzzleEngine,
        PuzzleGenerator,
        PsychologyEngine,
        PuzzleEvaluationSystem
    };
}

// Make available globally
window.SocialEngineeringPuzzleEngine = SocialEngineeringPuzzleEngine;
window.PuzzleGenerator = PuzzleGenerator;
window.PsychologyEngine = PsychologyEngine;
window.PuzzleEvaluationSystem = PuzzleEvaluationSystem;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.socialEngineeringPuzzleEngine) {
            window.socialEngineeringPuzzleEngine = new SocialEngineeringPuzzleEngine();
            await window.socialEngineeringPuzzleEngine.initialize();
        }
    });
} else {
    if (!window.socialEngineeringPuzzleEngine) {
        window.socialEngineeringPuzzleEngine = new SocialEngineeringPuzzleEngine();
        window.socialEngineeringPuzzleEngine.initialize();
    }
}