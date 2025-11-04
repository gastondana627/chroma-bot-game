/**
 * Narrative Story Integration
 * Integrates narrative branching system with existing story progression tracker
 * Implements replay functionality and seamless cinematic integration
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */

class NarrativeStoryIntegration {
    constructor(storyTracker, narrativeBranching, cinematicManager) {
        this.storyTracker = storyTracker;
        this.narrativeBranching = narrativeBranching;
        this.cinematicManager = cinematicManager;
        
        // Integration state
        this.integrationActive = false;
        this.replaySystem = new ReplaySystem(this);
        this.cinematicIntegration = new CinematicIntegration(this);
        
        // Event tracking
        this.eventHistory = [];
        this.branchTriggers = new Map();
        
        // Mode tracking for branching
        this.currentModes = new Map(); // character -> mode
        
        // Initialize integration
        this.initializeIntegration();
        
        // Bind methods
        this.handleStoryProgression = this.handleStoryProgression.bind(this);
        this.handleDecisionMade = this.handleDecisionMade.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
    }

    /**
     * Initialize the integration system
     */
    initializeIntegration() {
        console.log('🔗 Initializing Narrative Story Integration...');

        // Set up event listeners for story progression
        this.setupStoryProgressionListeners();
        
        // Set up event listeners for decision system
        this.setupDecisionSystemListeners();
        
        // Set up event listeners for mode changes
        this.setupModeChangeListeners();
        
        // Set up event listeners for cinematic moments
        this.setupCinematicListeners();
        
        // Initialize replay system
        this.replaySystem.initialize();
        
        // Initialize cinematic integration
        this.cinematicIntegration.initialize();
        
        this.integrationActive = true;
        console.log('🔗 Narrative Story Integration initialized successfully');
    }

    /**
     * Set up story progression event listeners
     */
    setupStoryProgressionListeners() {
        // Listen for story trigger events
        window.addEventListener('storyTriggerFired', (event) => {
            this.handleStoryProgression(event.detail);
        });

        // Listen for area visits
        window.addEventListener('areaVisited', (event) => {
            this.handleAreaVisit(event.detail);
        });

        // Listen for story state updates
        window.addEventListener('storyStateUpdated', (event) => {
            this.handleStoryStateUpdate(event.detail);
        });
    }

    /**
     * Set up decision system event listeners
     */
    setupDecisionSystemListeners() {
        // Listen for decision made events
        window.addEventListener('decisionMade', (event) => {
            this.handleDecisionMade(event.detail);
        });

        // Listen for mechanic completion events
        window.addEventListener('mechanicCompleted', (event) => {
            this.handleMechanicCompletion(event.detail);
        });
    }

    /**
     * Set up mode change event listeners
     */
    setupModeChangeListeners() {
        // Listen for mode selection events
        window.addEventListener('modeSelected', (event) => {
            this.handleModeChange(event.detail);
        });

        // Listen for mode switch events
        window.addEventListener('modeSwitched', (event) => {
            this.handleModeSwitch(event.detail);
        });
    }

    /**
     * Set up cinematic event listeners
     */
    setupCinematicListeners() {
        // Listen for cinematic moment triggers
        window.addEventListener('cinematicMomentTriggered', (event) => {
            this.handleCinematicMoment(event.detail);
        });

        // Listen for 3D character emergence events
        window.addEventListener('characterEmergenceTriggered', (event) => {
            this.handleCharacterEmergence(event.detail);
        });
    }

    /**
     * Handle story progression events
     * @param {Object} progressionData - Story progression event data
     */
    handleStoryProgression(progressionData) {
        console.log('🔗 Handling story progression:', progressionData);

        const { character, areaNumber, trigger } = progressionData;
        const currentMode = this.getCurrentMode(character);

        // Track the progression event
        this.trackEvent('story_progression', {
            character,
            area: areaNumber,
            trigger: trigger?.id,
            mode: currentMode,
            timestamp: Date.now()
        });

        // Check if this progression should trigger narrative branching
        if (this.shouldTriggerBranching(progressionData)) {
            this.triggerNarrativeBranching(character, currentMode, progressionData);
        }

        // Update cinematic integration
        this.cinematicIntegration.handleStoryProgression(progressionData);
    }

    /**
     * Handle area visit events
     * @param {Object} visitData - Area visit data
     */
    handleAreaVisit(visitData) {
        const { character, area, timestamp } = visitData;
        const currentMode = this.getCurrentMode(character);

        // Track area visit for narrative context
        this.trackEvent('area_visit', {
            character,
            area,
            mode: currentMode,
            timestamp
        });

        // Check for area-specific narrative triggers
        this.checkAreaNarrativeTriggers(character, area, currentMode);
    }

    /**
     * Handle story state updates
     * @param {Object} stateData - Story state update data
     */
    handleStoryStateUpdate(stateData) {
        const { character, stateKey, newValue } = stateData;
        const currentMode = this.getCurrentMode(character);

        // Track state update
        this.trackEvent('story_state_update', {
            character,
            stateKey,
            newValue,
            mode: currentMode,
            timestamp: Date.now()
        });

        // Check if state update affects narrative branching
        this.checkStateBasedBranching(character, stateKey, newValue, currentMode);
    }

    /**
     * Handle decision made events
     * @param {Object} decisionData - Decision event data
     */
    handleDecisionMade(decisionData) {
        console.log('🔗 Handling decision made:', decisionData);

        const { choice, session } = decisionData;
        const { character } = session;
        const currentMode = this.getCurrentMode(character);

        // Track the decision for narrative branching
        if (this.narrativeBranching) {
            this.narrativeBranching.trackBranch(character, currentMode, choice, {
                session,
                area: session.area,
                mechanicType: choice.mechanicType
            });
        }

        // Track decision event
        this.trackEvent('decision_made', {
            character,
            decision: choice.id,
            mechanicType: choice.mechanicType,
            mode: currentMode,
            area: session.area,
            timestamp: Date.now()
        });

        // Update story progression based on decision consequences
        this.applyDecisionToStoryProgression(decisionData);
    }

    /**
     * Handle mechanic completion events
     * @param {Object} completionData - Mechanic completion data
     */
    handleMechanicCompletion(completionData) {
        const { mechanicType, character, results } = completionData;
        const currentMode = this.getCurrentMode(character);

        // Track mechanic completion
        this.trackEvent('mechanic_completion', {
            character,
            mechanicType,
            results,
            mode: currentMode,
            timestamp: Date.now()
        });

        // Update narrative branching with completion results
        if (this.narrativeBranching && results) {
            const currentBranch = this.narrativeBranching.getCurrentBranch(character, currentMode);
            if (currentBranch) {
                this.updateBranchWithMechanicResults(currentBranch, mechanicType, results);
            }
        }
    }

    /**
     * Handle mode change events
     * @param {Object} modeData - Mode change data
     */
    handleModeChange(modeData) {
        console.log('🔗 Handling mode change:', modeData);

        const { character, newMode, previousMode } = modeData;
        
        // Update current mode tracking
        this.currentModes.set(character, newMode);

        // Track mode change event
        this.trackEvent('mode_change', {
            character,
            newMode,
            previousMode,
            timestamp: Date.now()
        });

        // Handle mode-specific narrative branching
        this.handleModeSpecificBranching(character, newMode, previousMode);

        // Update cinematic integration for new mode
        this.cinematicIntegration.handleModeChange(character, newMode);
    }

    /**
     * Handle mode switch events (mid-game mode changes)
     * @param {Object} switchData - Mode switch data
     */
    handleModeSwitch(switchData) {
        const { character, newMode, previousMode, context } = switchData;

        // Archive current branch if switching modes
        if (this.narrativeBranching) {
            const currentBranch = this.narrativeBranching.getCurrentBranch(character, previousMode);
            if (currentBranch && currentBranch.status === 'active') {
                // Mark branch as paused for potential resume
                currentBranch.status = 'paused';
                currentBranch.pausedAt = Date.now();
                currentBranch.pauseContext = context;
            }
        }

        // Handle as regular mode change
        this.handleModeChange({ character, newMode, previousMode });
    }

    /**
     * Handle cinematic moment events
     * @param {Object} cinematicData - Cinematic moment data
     */
    handleCinematicMoment(cinematicData) {
        const { character, momentId, area } = cinematicData;
        const currentMode = this.getCurrentMode(character);

        // Track cinematic moment
        this.trackEvent('cinematic_moment', {
            character,
            momentId,
            area,
            mode: currentMode,
            timestamp: Date.now()
        });

        // Integrate cinematic moment with narrative branching
        this.integrateCinematicWithBranching(character, momentId, currentMode);
    }

    /**
     * Handle character emergence events
     * @param {Object} emergenceData - Character emergence data
     */
    handleCharacterEmergence(emergenceData) {
        const { character, area, trigger } = emergenceData;
        const currentMode = this.getCurrentMode(character);

        // Track character emergence
        this.trackEvent('character_emergence', {
            character,
            area,
            trigger,
            mode: currentMode,
            timestamp: Date.now()
        });

        // Coordinate emergence with narrative state
        this.coordinateEmergenceWithNarrative(character, area, currentMode);
    }

    /**
     * Get current mode for character
     * @param {string} character - Character name
     * @returns {string} Current mode
     */
    getCurrentMode(character) {
        return this.currentModes.get(character) || 'guardian'; // Default to guardian
    }

    /**
     * Check if story progression should trigger narrative branching
     * @param {Object} progressionData - Story progression data
     * @returns {boolean} Whether to trigger branching
     */
    shouldTriggerBranching(progressionData) {
        const { character, trigger } = progressionData;
        const currentMode = this.getCurrentMode(character);

        // Check if we already have an active branch
        const existingBranch = this.narrativeBranching?.getCurrentBranch(character, currentMode);
        if (existingBranch && existingBranch.status === 'active') {
            return false; // Don't create new branch if one is active
        }

        // Check if trigger is significant enough for branching
        return trigger && (
            trigger.stateConditions || 
            trigger.eventTriggers?.length > 0 ||
            trigger.requiredArea > 1
        );
    }

    /**
     * Trigger narrative branching
     * @param {string} character - Character name
     * @param {string} mode - Current mode
     * @param {Object} progressionData - Story progression data
     */
    triggerNarrativeBranching(character, mode, progressionData) {
        if (!this.narrativeBranching) return;

        console.log(`🔗 Triggering narrative branching for ${character} in ${mode} mode`);

        // Create initial branch context
        const branchContext = {
            trigger: progressionData.trigger,
            area: progressionData.areaNumber,
            storyState: this.storyTracker.getProgress(character)?.storyState || {},
            timestamp: Date.now()
        };

        // Initialize or update branch
        const branch = this.narrativeBranching.trackBranch(character, mode, {
            id: 'story_progression_trigger',
            mechanicType: 'story_event',
            consequences: this.extractConsequencesFromTrigger(progressionData.trigger)
        }, branchContext);

        // Store branch trigger for reference
        this.branchTriggers.set(`${character}_${mode}`, {
            trigger: progressionData.trigger,
            branch: branch.id,
            timestamp: Date.now()
        });
    }

    /**
     * Check for area-specific narrative triggers
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @param {string} mode - Current mode
     */
    checkAreaNarrativeTriggers(character, area, mode) {
        // Get area-specific triggers from cinematic manager
        const areaTriggers = this.cinematicManager?.getTriggerConditions(character, area) || [];
        
        areaTriggers.forEach(trigger => {
            if (this.evaluateTriggerCondition(trigger, character)) {
                this.triggerNarrativeBranching(character, mode, {
                    character,
                    areaNumber: area,
                    trigger
                });
            }
        });
    }

    /**
     * Check state-based branching triggers
     * @param {string} character - Character name
     * @param {string} stateKey - State key that changed
     * @param {*} newValue - New state value
     * @param {string} mode - Current mode
     */
    checkStateBasedBranching(character, stateKey, newValue, mode) {
        // Define state thresholds that trigger branching
        const branchingThresholds = {
            tournament_wins: [1, 3, 5],
            investigation_clues: [3, 7, 10],
            scams_prevented: [2, 5, 10],
            peer_pressure_encounters: [2, 4],
            suspicious_matches: [1, 3, 5],
            identity_threats_detected: [1, 3]
        };

        const thresholds = branchingThresholds[stateKey];
        if (thresholds && thresholds.includes(newValue)) {
            // Trigger branching for significant state changes
            this.triggerNarrativeBranching(character, mode, {
                character,
                areaNumber: this.storyTracker.getProgress(character)?.currentArea || 1,
                trigger: {
                    id: `state_threshold_${stateKey}_${newValue}`,
                    stateConditions: { [stateKey]: newValue },
                    eventTriggers: [`${stateKey}_threshold_reached`]
                }
            });
        }
    }

    /**
     * Apply decision consequences to story progression
     * @param {Object} decisionData - Decision data
     */
    applyDecisionToStoryProgression(decisionData) {
        const { choice, session } = decisionData;
        const { character } = session;

        if (choice.consequences && this.storyTracker) {
            Object.entries(choice.consequences).forEach(([key, value]) => {
                this.storyTracker.updateStoryState(character, key, value, true);
            });
        }
    }

    /**
     * Handle mode-specific narrative branching
     * @param {string} character - Character name
     * @param {string} newMode - New mode
     * @param {string} previousMode - Previous mode
     */
    handleModeSpecificBranching(character, newMode, previousMode) {
        if (!this.narrativeBranching) return;

        // If switching from one mode to another, handle transition
        if (previousMode && previousMode !== newMode) {
            const previousBranch = this.narrativeBranching.getCurrentBranch(character, previousMode);
            if (previousBranch && previousBranch.status === 'active') {
                // Complete or pause the previous branch
                if (previousBranch.decisions.length >= 2) {
                    this.narrativeBranching.completeBranch(previousBranch);
                } else {
                    previousBranch.status = 'paused';
                    previousBranch.pausedAt = Date.now();
                }
            }
        }

        // Initialize new branch for new mode if needed
        const currentArea = this.storyTracker.getProgress(character)?.currentArea || 1;
        if (currentArea > 1) { // Only create branch if past initial area
            this.triggerNarrativeBranching(character, newMode, {
                character,
                areaNumber: currentArea,
                trigger: {
                    id: `mode_change_${newMode}`,
                    eventTriggers: [`mode_selected_${newMode}`]
                }
            });
        }
    }

    /**
     * Update branch with mechanic results
     * @param {Object} branch - Story branch
     * @param {string} mechanicType - Type of mechanic
     * @param {Object} results - Mechanic results
     */
    updateBranchWithMechanicResults(branch, mechanicType, results) {
        // Add mechanic results to branch educational progress
        if (results.educationalOutcomes) {
            results.educationalOutcomes.forEach(outcome => {
                if (!branch.educationalProgress.lessonsLearned.includes(outcome)) {
                    branch.educationalProgress.lessonsLearned.push(outcome);
                }
            });
        }

        // Add skills gained from mechanic
        if (results.skillsGained) {
            results.skillsGained.forEach(skill => {
                if (!branch.educationalProgress.skillsGained.includes(skill)) {
                    branch.educationalProgress.skillsGained.push(skill);
                }
            });
        }

        // Update branch consequences with mechanic results
        if (results.consequences) {
            Object.entries(results.consequences).forEach(([key, value]) => {
                branch.consequences.push({
                    type: key,
                    value,
                    source: `mechanic_${mechanicType}`,
                    timestamp: Date.now()
                });
            });
        }
    }

    /**
     * Integrate cinematic moment with narrative branching
     * @param {string} character - Character name
     * @param {string} momentId - Cinematic moment ID
     * @param {string} mode - Current mode
     */
    integrateCinematicWithBranching(character, momentId, mode) {
        if (!this.narrativeBranching) return;

        const currentBranch = this.narrativeBranching.getCurrentBranch(character, mode);
        if (currentBranch) {
            // Add cinematic moment as a significant branch event
            currentBranch.pathHistory.push({
                path: currentBranch.currentPath,
                decision: `cinematic_${momentId}`,
                timestamp: Date.now(),
                context: {
                    type: 'cinematic_moment',
                    momentId,
                    significance: 'high'
                }
            });

            // Check if cinematic moment completes the branch
            if (this.isCinematicMomentFinal(momentId)) {
                this.narrativeBranching.completeBranch(currentBranch);
            }
        }
    }

    /**
     * Coordinate character emergence with narrative state
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @param {string} mode - Current mode
     */
    coordinateEmergenceWithNarrative(character, area, mode) {
        if (!this.narrativeBranching) return;

        const currentBranch = this.narrativeBranching.getCurrentBranch(character, mode);
        if (currentBranch) {
            // Enhance character emergence with narrative context
            const branchContext = {
                pathName: currentBranch.template?.branches[currentBranch.currentPath]?.name,
                educationalProgress: currentBranch.educationalProgress,
                decisionCount: currentBranch.decisions.length,
                mode: currentBranch.mode
            };

            // Dispatch enhanced emergence event
            window.dispatchEvent(new CustomEvent('narrativeEnhancedEmergence', {
                detail: {
                    character,
                    area,
                    branchContext,
                    timestamp: Date.now()
                }
            }));
        }
    }

    /**
     * Extract consequences from trigger
     * @param {Object} trigger - Story trigger
     * @returns {Object} Extracted consequences
     */
    extractConsequencesFromTrigger(trigger) {
        const consequences = {};
        
        if (trigger.stateConditions) {
            Object.entries(trigger.stateConditions).forEach(([key, value]) => {
                consequences[`${key}_progress`] = 1;
            });
        }

        return consequences;
    }

    /**
     * Evaluate trigger condition
     * @param {Object} trigger - Trigger to evaluate
     * @param {string} character - Character name
     * @returns {boolean} Whether trigger condition is met
     */
    evaluateTriggerCondition(trigger, character) {
        const progress = this.storyTracker.getProgress(character);
        if (!progress) return false;

        // Check area requirement
        if (trigger.requiredArea && progress.currentArea < trigger.requiredArea) {
            return false;
        }

        // Check state conditions
        if (trigger.stateConditions) {
            for (const [key, requiredValue] of Object.entries(trigger.stateConditions)) {
                if (progress.storyState[key] < requiredValue) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Check if cinematic moment is final
     * @param {string} momentId - Cinematic moment ID
     * @returns {boolean} Whether moment is final
     */
    isCinematicMomentFinal(momentId) {
        const finalMoments = [
            'eli_championship_finale',
            'maya_confrontation_resolution',
            'stanley_community_leadership'
        ];
        return finalMoments.includes(momentId);
    }

    /**
     * Track integration event
     * @param {string} eventType - Type of event
     * @param {Object} eventData - Event data
     */
    trackEvent(eventType, eventData) {
        this.eventHistory.push({
            type: eventType,
            data: eventData,
            timestamp: Date.now()
        });

        // Keep only last 100 events
        if (this.eventHistory.length > 100) {
            this.eventHistory = this.eventHistory.slice(-100);
        }
    }

    /**
     * Get integration status
     * @returns {Object} Integration status
     */
    getStatus() {
        return {
            active: this.integrationActive,
            eventHistory: this.eventHistory.length,
            currentModes: Object.fromEntries(this.currentModes),
            branchTriggers: this.branchTriggers.size,
            replaySystemActive: this.replaySystem.isActive(),
            cinematicIntegrationActive: this.cinematicIntegration.isActive()
        };
    }

    /**
     * Get event history for character
     * @param {string} character - Character name
     * @returns {Array} Character event history
     */
    getCharacterEventHistory(character) {
        return this.eventHistory.filter(event => 
            event.data.character === character
        );
    }

    /**
     * Reset integration for character (for replay)
     * @param {string} character - Character name
     */
    resetIntegration(character) {
        // Reset mode tracking
        this.currentModes.delete(character);
        
        // Clear branch triggers
        const keysToDelete = [];
        for (const [key, value] of this.branchTriggers) {
            if (key.startsWith(character)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.branchTriggers.delete(key));
        
        // Filter out character events from history
        this.eventHistory = this.eventHistory.filter(event => 
            event.data.character !== character
        );
        
        console.log(`🔗 Reset integration for ${character}`);
    }
}

/**
 * Replay System
 * Handles replay functionality with alternative mode choices
 */
class ReplaySystem {
    constructor(integration) {
        this.integration = integration;
        this.replayStates = new Map();
        this.active = false;
    }

    /**
     * Initialize replay system
     */
    initialize() {
        console.log('🔄 Initializing Replay System...');
        
        // Set up replay event listeners
        window.addEventListener('replayRequested', (event) => {
            this.handleReplayRequest(event.detail);
        });

        window.addEventListener('narrativeBranchCompleted', (event) => {
            this.handleBranchCompletion(event.detail);
        });

        this.active = true;
        console.log('🔄 Replay System initialized');
    }

    /**
     * Handle replay request
     * @param {Object} replayData - Replay request data
     */
    handleReplayRequest(replayData) {
        const { character, mode, fromArea } = replayData;
        
        console.log(`🔄 Handling replay request for ${character} in ${mode} mode from area ${fromArea}`);

        // Save current state for potential restoration
        this.saveCurrentState(character);

        // Reset systems for replay
        this.resetForReplay(character, mode, fromArea);

        // Start replay
        this.startReplay(character, mode, fromArea);
    }

    /**
     * Handle branch completion for replay suggestions
     * @param {Object} completionData - Branch completion data
     */
    handleBranchCompletion(completionData) {
        const { branch, summary } = completionData;
        
        // Generate and display replay suggestions
        this.generateReplaySuggestions(branch, summary);
    }

    /**
     * Save current state before replay
     * @param {string} character - Character name
     */
    saveCurrentState(character) {
        const currentState = {
            storyProgress: this.integration.storyTracker.getProgress(character),
            narrativeBranch: this.integration.narrativeBranching?.getCurrentBranch(
                character, 
                this.integration.getCurrentMode(character)
            ),
            mode: this.integration.getCurrentMode(character),
            eventHistory: this.integration.getCharacterEventHistory(character),
            timestamp: Date.now()
        };

        this.replayStates.set(character, currentState);
        console.log(`🔄 Saved current state for ${character}`);
    }

    /**
     * Reset systems for replay
     * @param {string} character - Character name
     * @param {string} mode - Replay mode
     * @param {number} fromArea - Starting area for replay
     */
    resetForReplay(character, mode, fromArea) {
        // Reset story progression
        const progress = this.integration.storyTracker.getProgress(character);
        if (progress) {
            progress.currentArea = fromArea;
            progress.visitedAreas = progress.visitedAreas.filter(area => area < fromArea);
            
            // Reset relevant story state
            Object.keys(progress.storyState).forEach(key => {
                if (this.shouldResetStateForReplay(key, fromArea)) {
                    progress.storyState[key] = 0;
                }
            });
            
            this.integration.storyTracker.saveProgress();
        }

        // Reset narrative branching
        if (this.integration.narrativeBranching) {
            this.integration.narrativeBranching.resetBranch(character, mode);
        }

        // Reset integration state
        this.integration.resetIntegration(character);

        // Set new mode
        this.integration.currentModes.set(character, mode);

        console.log(`🔄 Reset systems for ${character} replay in ${mode} mode from area ${fromArea}`);
    }

    /**
     * Start replay
     * @param {string} character - Character name
     * @param {string} mode - Replay mode
     * @param {number} fromArea - Starting area
     */
    startReplay(character, mode, fromArea) {
        // Dispatch replay started event
        window.dispatchEvent(new CustomEvent('replayStarted', {
            detail: {
                character,
                mode,
                fromArea,
                timestamp: Date.now()
            }
        }));

        // Navigate to starting area
        this.navigateToArea(character, fromArea);

        // Initialize mode for replay
        window.dispatchEvent(new CustomEvent('modeSelected', {
            detail: {
                character,
                newMode: mode,
                previousMode: null,
                context: 'replay'
            }
        }));

        console.log(`🔄 Started replay for ${character} in ${mode} mode from area ${fromArea}`);
    }

    /**
     * Generate replay suggestions
     * @param {Object} branch - Completed branch
     * @param {Object} summary - Branch summary
     */
    generateReplaySuggestions(branch, summary) {
        const suggestions = summary.replaySuggestions || [];
        
        if (suggestions.length > 0) {
            this.displayReplaySuggestions(branch.character, suggestions);
        }
    }

    /**
     * Display replay suggestions to user
     * @param {string} character - Character name
     * @param {Array} suggestions - Replay suggestions
     */
    displayReplaySuggestions(character, suggestions) {
        // Create replay suggestions UI
        const overlay = document.createElement('div');
        overlay.className = 'replay-suggestions-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10003;
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

        let suggestionsHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #00FFFF; margin-bottom: 10px;">🔄 Replay Suggestions</h2>
                <p style="color: #CCCCCC;">Try different approaches to explore alternative outcomes</p>
            </div>
        `;

        suggestions.forEach((suggestion, index) => {
            suggestionsHTML += `
                <div class="replay-suggestion" data-suggestion="${index}" style="
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid #444;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    <h4 style="color: #FFD700; margin-bottom: 8px;">${suggestion.title}</h4>
                    <p style="color: #CCCCCC; font-size: 14px; margin-bottom: 10px;">${suggestion.description}</p>
                    <div style="display: flex; justify-content: space-between; font-size: 12px;">
                        <span style="color: #00FFFF;">Mode: ${suggestion.mode === 'guardian' ? 'Guardian' : 'Shadow Observer'}</span>
                        <span style="color: #FFD700;">Character: ${suggestion.character.toUpperCase()}</span>
                    </div>
                </div>
            `;
        });

        suggestionsHTML += `
            <div style="text-align: center; margin-top: 20px;">
                <button id="close-suggestions" style="
                    background: #666;
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: inherit;
                    margin-right: 10px;
                ">Continue Current Journey</button>
            </div>
        `;

        content.innerHTML = suggestionsHTML;
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Add event listeners
        content.querySelectorAll('.replay-suggestion').forEach((element, index) => {
            element.addEventListener('mouseenter', () => {
                element.style.background = 'rgba(0, 255, 255, 0.1)';
                element.style.borderColor = '#00FFFF';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.background = 'rgba(255, 255, 255, 0.05)';
                element.style.borderColor = '#444';
            });

            element.addEventListener('click', () => {
                const suggestion = suggestions[index];
                this.handleReplayRequest({
                    character: suggestion.character,
                    mode: suggestion.mode,
                    fromArea: 1 // Start from beginning for mode switches
                });
                overlay.remove();
            });
        });

        document.getElementById('close-suggestions').addEventListener('click', () => {
            overlay.remove();
        });

        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 30000);
    }

    /**
     * Navigate to specific area
     * @param {string} character - Character name
     * @param {number} area - Area number
     */
    navigateToArea(character, area) {
        // Construct area URL
        const areaUrl = `gameplay-areas/${character}/area-${area}-*.html`;
        
        // Try to find and navigate to the area
        // This would typically involve routing logic specific to the application
        console.log(`🔄 Navigating to ${character} area ${area}`);
        
        // Dispatch navigation event for other systems to handle
        window.dispatchEvent(new CustomEvent('replayNavigation', {
            detail: {
                character,
                area,
                url: areaUrl
            }
        }));
    }

    /**
     * Check if story state should be reset for replay
     * @param {string} stateKey - State key
     * @param {number} fromArea - Starting area
     * @returns {boolean} Whether to reset state
     */
    shouldResetStateForReplay(stateKey, fromArea) {
        // Define which states should be reset based on area
        const areaStateMap = {
            1: [], // Don't reset anything for area 1
            2: ['tournament_wins', 'suspicious_matches', 'identity_threats_detected'],
            3: ['peer_pressure_encounters', 'investigation_clues', 'scams_prevented'],
            4: ['championship_progress', 'confrontation_readiness', 'community_leadership_level']
        };

        const statesToReset = areaStateMap[fromArea] || [];
        return statesToReset.includes(stateKey);
    }

    /**
     * Restore previous state (if replay is cancelled)
     * @param {string} character - Character name
     */
    restoreState(character) {
        const savedState = this.replayStates.get(character);
        if (savedState) {
            // Restore story progress
            if (savedState.storyProgress) {
                this.integration.storyTracker.currentSession[character] = savedState.storyProgress;
                this.integration.storyTracker.saveProgress();
            }

            // Restore mode
            this.integration.currentModes.set(character, savedState.mode);

            console.log(`🔄 Restored previous state for ${character}`);
        }
    }

    /**
     * Check if replay system is active
     * @returns {boolean} Whether replay system is active
     */
    isActive() {
        return this.active;
    }

    /**
     * Get replay statistics
     * @returns {Object} Replay statistics
     */
    getStatistics() {
        return {
            active: this.active,
            savedStates: this.replayStates.size,
            availableReplays: Array.from(this.replayStates.keys())
        };
    }
}

/**
 * Cinematic Integration
 * Handles seamless integration with cinematic moments and 3D character emergence
 */
class CinematicIntegration {
    constructor(integration) {
        this.integration = integration;
        this.active = false;
        this.cinematicQueue = [];
        this.emergenceCoordination = new Map();
    }

    /**
     * Initialize cinematic integration
     */
    initialize() {
        console.log('🎬 Initializing Cinematic Integration...');
        
        // Set up cinematic event listeners
        this.setupCinematicEventListeners();
        
        this.active = true;
        console.log('🎬 Cinematic Integration initialized');
    }

    /**
     * Set up cinematic event listeners
     */
    setupCinematicEventListeners() {
        // Listen for narrative branch updates
        window.addEventListener('narrativeBranchUpdated', (event) => {
            this.handleBranchUpdate(event.detail);
        });

        // Listen for character emergence requests
        window.addEventListener('characterEmergenceRequested', (event) => {
            this.handleEmergenceRequest(event.detail);
        });
    }

    /**
     * Handle story progression for cinematic coordination
     * @param {Object} progressionData - Story progression data
     */
    handleStoryProgression(progressionData) {
        const { character, areaNumber, trigger } = progressionData;
        
        // Check if progression should trigger cinematic moment
        if (this.shouldTriggerCinematic(progressionData)) {
            this.queueCinematicMoment(character, areaNumber, trigger);
        }
    }

    /**
     * Handle mode change for cinematic adaptation
     * @param {string} character - Character name
     * @param {string} newMode - New mode
     */
    handleModeChange(character, newMode) {
        // Update cinematic styling based on mode
        this.updateCinematicStyling(character, newMode);
        
        // Adjust future cinematic moments for mode
        this.adjustCinematicsForMode(character, newMode);
    }

    /**
     * Handle narrative branch updates
     * @param {Object} branchData - Branch update data
     */
    handleBranchUpdate(branchData) {
        const { character, branch } = branchData;
        
        // Coordinate cinematic moments with branch progress
        this.coordinateCinematicsWithBranch(character, branch);
    }

    /**
     * Handle character emergence requests
     * @param {Object} emergenceData - Emergence request data
     */
    handleEmergenceRequest(emergenceData) {
        const { character, area, context } = emergenceData;
        
        // Enhance emergence with narrative context
        this.enhanceEmergenceWithNarrative(character, area, context);
    }

    /**
     * Check if story progression should trigger cinematic
     * @param {Object} progressionData - Story progression data
     * @returns {boolean} Whether to trigger cinematic
     */
    shouldTriggerCinematic(progressionData) {
        const { trigger } = progressionData;
        
        // Check if trigger has cinematic configuration
        return trigger && (
            trigger.eventTriggers?.some(event => event.includes('victory') || event.includes('breakthrough')) ||
            trigger.stateConditions && Object.keys(trigger.stateConditions).length > 0
        );
    }

    /**
     * Queue cinematic moment
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @param {Object} trigger - Story trigger
     */
    queueCinematicMoment(character, area, trigger) {
        const cinematicMoment = {
            character,
            area,
            trigger,
            timestamp: Date.now(),
            status: 'queued'
        };

        this.cinematicQueue.push(cinematicMoment);
        
        // Process queue
        this.processCinematicQueue();
    }

    /**
     * Process cinematic queue
     */
    processCinematicQueue() {
        if (this.cinematicQueue.length === 0) return;

        const nextCinematic = this.cinematicQueue.shift();
        this.executeCinematicMoment(nextCinematic);
    }

    /**
     * Execute cinematic moment
     * @param {Object} cinematicMoment - Cinematic moment to execute
     */
    executeCinematicMoment(cinematicMoment) {
        const { character, area, trigger } = cinematicMoment;
        
        console.log(`🎬 Executing cinematic moment for ${character} in area ${area}`);

        // Get narrative context
        const currentMode = this.integration.getCurrentMode(character);
        const currentBranch = this.integration.narrativeBranching?.getCurrentBranch(character, currentMode);

        // Enhance cinematic with narrative context
        const enhancedCinematic = {
            ...cinematicMoment,
            narrativeContext: {
                mode: currentMode,
                branchPath: currentBranch?.currentPath,
                educationalProgress: currentBranch?.educationalProgress,
                decisionCount: currentBranch?.decisions.length || 0
            }
        };

        // Dispatch enhanced cinematic event
        window.dispatchEvent(new CustomEvent('enhancedCinematicMoment', {
            detail: enhancedCinematic
        }));

        cinematicMoment.status = 'executed';
        cinematicMoment.executedAt = Date.now();
    }

    /**
     * Update cinematic styling based on mode
     * @param {string} character - Character name
     * @param {string} mode - Current mode
     */
    updateCinematicStyling(character, mode) {
        const modeStyles = {
            guardian: {
                lightingIntensity: 'bright',
                colorTone: 'heroic',
                cameraAngle: 'uplifting'
            },
            shadow_observer: {
                lightingIntensity: 'dramatic',
                colorTone: 'ominous',
                cameraAngle: 'menacing'
            }
        };

        const styling = modeStyles[mode] || modeStyles.guardian;
        
        // Store styling preferences for future cinematics
        this.emergenceCoordination.set(`${character}_styling`, styling);
    }

    /**
     * Adjust cinematics for mode
     * @param {string} character - Character name
     * @param {string} mode - Current mode
     */
    adjustCinematicsForMode(character, mode) {
        // Adjust queued cinematics for new mode
        this.cinematicQueue.forEach(cinematic => {
            if (cinematic.character === character) {
                cinematic.modeAdjustment = mode;
            }
        });
    }

    /**
     * Coordinate cinematics with branch progress
     * @param {string} character - Character name
     * @param {Object} branch - Story branch
     */
    coordinateCinematicsWithBranch(character, branch) {
        // Check if branch progress warrants cinematic moment
        if (branch.decisions.length > 0 && branch.decisions.length % 2 === 0) {
            // Trigger mini-cinematic for branch milestones
            this.queueCinematicMoment(character, branch.template?.area || 1, {
                id: `branch_milestone_${branch.decisions.length}`,
                eventTriggers: ['branch_progress'],
                branchContext: true
            });
        }
    }

    /**
     * Enhance character emergence with narrative context
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @param {Object} context - Emergence context
     */
    enhanceEmergenceWithNarrative(character, area, context) {
        const currentMode = this.integration.getCurrentMode(character);
        const currentBranch = this.integration.narrativeBranching?.getCurrentBranch(character, currentMode);
        const styling = this.emergenceCoordination.get(`${character}_styling`);

        const enhancedContext = {
            ...context,
            narrativeEnhancement: {
                mode: currentMode,
                branchPath: currentBranch?.currentPath,
                pathName: currentBranch?.template?.branches[currentBranch?.currentPath]?.name,
                educationalLevel: this.calculateEducationalLevel(currentBranch),
                styling: styling || {}
            }
        };

        // Dispatch enhanced emergence
        window.dispatchEvent(new CustomEvent('narrativeEnhancedEmergence', {
            detail: {
                character,
                area,
                context: enhancedContext,
                timestamp: Date.now()
            }
        }));
    }

    /**
     * Calculate educational level for emergence enhancement
     * @param {Object} branch - Story branch
     * @returns {string} Educational level
     */
    calculateEducationalLevel(branch) {
        if (!branch) return 'novice';
        
        const goalsAchieved = branch.educationalProgress?.goalsAchieved?.length || 0;
        const lessonsLearned = branch.educationalProgress?.lessonsLearned?.length || 0;
        const totalProgress = goalsAchieved + lessonsLearned;

        if (totalProgress >= 8) return 'expert';
        if (totalProgress >= 6) return 'advanced';
        if (totalProgress >= 4) return 'intermediate';
        if (totalProgress >= 2) return 'beginner';
        return 'novice';
    }

    /**
     * Check if cinematic integration is active
     * @returns {boolean} Whether integration is active
     */
    isActive() {
        return this.active;
    }

    /**
     * Get cinematic integration status
     * @returns {Object} Integration status
     */
    getStatus() {
        return {
            active: this.active,
            queuedCinematics: this.cinematicQueue.length,
            emergenceCoordinations: this.emergenceCoordination.size
        };
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NarrativeStoryIntegration, ReplaySystem, CinematicIntegration };
}

// Make available globally
window.NarrativeStoryIntegration = NarrativeStoryIntegration;
window.ReplaySystem = ReplaySystem;
window.CinematicIntegration = CinematicIntegration;