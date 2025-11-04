/**
 * Gaming Mechanics Engine
 * Core engine that manages all interactive gaming mechanics for Data_Bleed
 * Provides modular architecture for investigation, real-time decisions, puzzles, and action sequences
 */

class GamingMechanicsEngine {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        this.activeSession = null;
        
        // Core components
        this.decisionSystem = null;
        this.mechanicRouter = null;
        this.storyTracker = null;
        this.cinematicManager = null;
        
        // Registered mechanics
        this.registeredMechanics = new Map();
        this.activeMechanics = new Map();
        
        // Event system
        this.eventListeners = new Map();
        
        // Configuration
        this.config = {
            enableLogging: true,
            autoSave: true,
            performanceMonitoring: true
        };
        
        // Bind methods
        this.initialize = this.initialize.bind(this);
        this.registerMechanic = this.registerMechanic.bind(this);
        this.activateMechanic = this.activateMechanic.bind(this);
    }

    /**
     * Initialize the gaming mechanics engine
     * @param {Object} options - Initialization options
     * @returns {Promise<boolean>} Success status
     */
    async initialize(options = {}) {
        if (this.initialized) {
            this.log('Engine already initialized');
            return true;
        }

        try {
            this.log('Initializing Gaming Mechanics Engine...');
            
            // Merge configuration
            this.config = { ...this.config, ...options };
            
            // Wait for dependencies
            await this.waitForDependencies();
            
            // Initialize core components
            await this.initializeCoreComponents();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Register built-in mechanics
            this.registerBuiltInMechanics();
            
            this.initialized = true;
            this.log('Gaming Mechanics Engine initialized successfully');
            
            // Dispatch initialization event
            this.dispatchEvent('engineInitialized', {
                version: this.version,
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error('Failed to initialize Gaming Mechanics Engine:', error);
            return false;
        }
    }

    /**
     * Wait for required dependencies to load
     * @returns {Promise<void>}
     */
    async waitForDependencies() {
        const maxWaitTime = 5000; // 5 seconds
        const checkInterval = 100; // 100ms
        let elapsed = 0;

        return new Promise((resolve, reject) => {
            const checkDependencies = () => {
                if (window.StoryProgressionTracker && window.CinematicMomentsManager) {
                    resolve();
                } else if (elapsed >= maxWaitTime) {
                    reject(new Error('Dependencies not loaded within timeout'));
                } else {
                    elapsed += checkInterval;
                    setTimeout(checkDependencies, checkInterval);
                }
            };
            checkDependencies();
        });
    }

    /**
     * Initialize core components
     * @returns {Promise<void>}
     */
    async initializeCoreComponents() {
        // Initialize story tracker
        if (window.storyTracker) {
            this.storyTracker = window.storyTracker;
        } else {
            this.storyTracker = new window.StoryProgressionTracker();
            window.storyTracker = this.storyTracker;
        }

        // Initialize cinematic manager
        if (window.cinematicManager) {
            this.cinematicManager = window.cinematicManager;
        } else {
            this.cinematicManager = new window.CinematicMomentsManager();
            window.cinematicManager = this.cinematicManager;
        }

        // Initialize decision system
        if (window.DecisionSystemManager) {
            this.decisionSystem = new window.DecisionSystemManager(this.storyTracker, this.cinematicManager);
        } else {
            console.warn('DecisionSystemManager not available');
        }

        // Initialize mechanic router
        if (window.MechanicRouter) {
            this.mechanicRouter = new window.MechanicRouter(this);
        } else {
            console.warn('MechanicRouter not available');
        }

        this.log('Core components initialized');
    }

    /**
     * Set up event listeners for integration
     */
    setupEventListeners() {
        // Listen for story progression events
        window.addEventListener('storyTriggerFired', (event) => {
            this.handleStoryTrigger(event.detail);
        });

        // Listen for mechanic completion events
        window.addEventListener('mechanicCompleted', (event) => {
            this.handleMechanicCompletion(event.detail);
        });

        // Listen for decision events
        window.addEventListener('decisionMade', (event) => {
            this.handleDecisionMade(event.detail);
        });

        this.log('Event listeners set up');
    }

    /**
     * Register built-in mechanics
     */
    registerBuiltInMechanics() {
        // Register placeholder mechanics (will be implemented in later tasks)
        this.registerMechanic('investigation', {
            name: 'Investigation Mechanics',
            description: 'Digital forensics and evidence analysis',
            activate: this.createPlaceholderMechanic('investigation'),
            deactivate: this.createPlaceholderDeactivator('investigation')
        });

        this.registerMechanic('realtime', {
            name: 'Real-Time Decision Mechanics',
            description: 'Time-pressured cybersecurity scenarios',
            activate: this.activateRealTimeMechanic.bind(this),
            deactivate: this.deactivateRealTimeMechanic.bind(this)
        });

        this.registerMechanic('puzzle', {
            name: 'Social Engineering Puzzle Mechanics',
            description: 'Recognition and counter-manipulation puzzles',
            activate: this.activatePuzzleMechanic.bind(this),
            deactivate: this.deactivatePuzzleMechanic.bind(this)
        });

        this.registerMechanic('action', {
            name: 'Action Sequence Mechanics',
            description: 'Character-specific cybersecurity response scenarios',
            activate: this.createPlaceholderMechanic('action'),
            deactivate: this.createPlaceholderDeactivator('action')
        });

        this.log('Built-in mechanics registered');
    }

    /**
     * Create placeholder mechanic activator
     * @param {string} type - Mechanic type
     * @returns {Function} Placeholder activator function
     */
    createPlaceholderMechanic(type) {
        return (context) => {
            this.log(`Placeholder ${type} mechanic activated`, context);
            
            // Create basic placeholder UI
            const placeholder = document.createElement('div');
            placeholder.id = `${type}-mechanic-placeholder`;
            placeholder.className = 'gaming-mechanic-placeholder';
            placeholder.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #00FFFF;
                border-radius: 12px;
                padding: 20px;
                color: white;
                font-family: 'JetBrains Mono', monospace;
                z-index: 10000;
                text-align: center;
                min-width: 300px;
            `;
            
            placeholder.innerHTML = `
                <h3 style="color: #00FFFF; margin-bottom: 15px;">
                    🎮 ${type.toUpperCase()} MECHANIC
                </h3>
                <p style="margin-bottom: 15px;">
                    This ${type} mechanic will be implemented in a future task.
                </p>
                <p style="color: #FFD700; margin-bottom: 20px;">
                    Character: ${context.character || 'Unknown'}<br>
                    Area: ${context.area || 'Unknown'}
                </p>
                <button id="${type}-close-btn" style="
                    background: #FF0080;
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: inherit;
                ">Close</button>
            `;
            
            document.body.appendChild(placeholder);
            
            // Add close functionality
            document.getElementById(`${type}-close-btn`).addEventListener('click', () => {
                this.deactivateMechanic(type);
            });
            
            return {
                element: placeholder,
                type: type,
                context: context
            };
        };
    }

    /**
     * Create placeholder mechanic deactivator
     * @param {string} type - Mechanic type
     * @returns {Function} Placeholder deactivator function
     */
    createPlaceholderDeactivator(type) {
        return () => {
            const placeholder = document.getElementById(`${type}-mechanic-placeholder`);
            if (placeholder) {
                placeholder.remove();
            }
            this.log(`Placeholder ${type} mechanic deactivated`);
        };
    }

    /**
     * Register a new gaming mechanic
     * @param {string} id - Unique mechanic identifier
     * @param {Object} mechanic - Mechanic configuration
     */
    registerMechanic(id, mechanic) {
        if (this.registeredMechanics.has(id)) {
            this.log(`Mechanic ${id} already registered, updating...`);
        }

        // Validate mechanic configuration
        if (!mechanic.activate || typeof mechanic.activate !== 'function') {
            throw new Error(`Mechanic ${id} must have an activate function`);
        }

        this.registeredMechanics.set(id, {
            id,
            name: mechanic.name || id,
            description: mechanic.description || '',
            activate: mechanic.activate,
            deactivate: mechanic.deactivate || (() => {}),
            requirements: mechanic.requirements || [],
            metadata: mechanic.metadata || {}
        });

        this.log(`Mechanic registered: ${id}`);
    }

    /**
     * Activate a gaming mechanic
     * @param {string} mechanicId - Mechanic identifier
     * @param {Object} context - Activation context
     * @returns {Promise<boolean>} Success status
     */
    async activateMechanic(mechanicId, context = {}) {
        if (!this.initialized) {
            throw new Error('Engine not initialized');
        }

        const mechanic = this.registeredMechanics.get(mechanicId);
        if (!mechanic) {
            throw new Error(`Unknown mechanic: ${mechanicId}`);
        }

        // Deactivate any currently active mechanic
        await this.deactivateAllMechanics();

        try {
            this.log(`Activating mechanic: ${mechanicId}`, context);
            
            const result = await mechanic.activate(context);
            this.activeMechanics.set(mechanicId, {
                mechanic,
                context,
                result,
                activatedAt: Date.now()
            });

            this.dispatchEvent('mechanicActivated', {
                mechanicId,
                context,
                timestamp: Date.now()
            });

            return true;
        } catch (error) {
            console.error(`Failed to activate mechanic ${mechanicId}:`, error);
            return false;
        }
    }

    /**
     * Deactivate a specific mechanic
     * @param {string} mechanicId - Mechanic identifier
     * @returns {Promise<boolean>} Success status
     */
    async deactivateMechanic(mechanicId) {
        const activeMechanic = this.activeMechanics.get(mechanicId);
        if (!activeMechanic) {
            return true; // Already inactive
        }

        try {
            this.log(`Deactivating mechanic: ${mechanicId}`);
            
            await activeMechanic.mechanic.deactivate(activeMechanic.context);
            this.activeMechanics.delete(mechanicId);

            this.dispatchEvent('mechanicDeactivated', {
                mechanicId,
                timestamp: Date.now()
            });

            return true;
        } catch (error) {
            console.error(`Failed to deactivate mechanic ${mechanicId}:`, error);
            return false;
        }
    }

    /**
     * Deactivate all active mechanics
     * @returns {Promise<void>}
     */
    async deactivateAllMechanics() {
        const activeIds = Array.from(this.activeMechanics.keys());
        await Promise.all(activeIds.map(id => this.deactivateMechanic(id)));
    }

    /**
     * Handle story trigger events
     * @param {Object} triggerData - Trigger event data
     */
    handleStoryTrigger(triggerData) {
        this.log('Story trigger received:', triggerData);
        
        // Route to decision system if available
        if (this.decisionSystem) {
            this.decisionSystem.handleStoryTrigger(triggerData);
        }
    }

    /**
     * Handle mechanic completion events
     * @param {Object} completionData - Completion event data
     */
    handleMechanicCompletion(completionData) {
        this.log('Mechanic completed:', completionData);
        
        // Update story progression if needed
        if (this.storyTracker && completionData.storyUpdate) {
            const { character, stateKey, value, increment } = completionData.storyUpdate;
            this.storyTracker.updateStoryState(character, stateKey, value, increment);
        }
    }

    /**
     * Handle decision made events
     * @param {Object} decisionData - Decision event data
     */
    handleDecisionMade(decisionData) {
        this.log('Decision made:', decisionData);
        
        // Route to appropriate mechanic via mechanic router
        if (this.mechanicRouter) {
            this.mechanicRouter.routeDecision(decisionData);
        }
    }

    /**
     * Get current session information
     * @returns {Object} Session information
     */
    getCurrentSession() {
        if (!this.activeSession) {
            // Detect current context
            const context = this.storyTracker ? 
                          this.storyTracker.detectCurrentContext() : 
                          { character: 'unknown', area: 1 };
            
            this.activeSession = {
                character: context.character,
                area: context.area,
                startTime: Date.now(),
                mechanics: []
            };
        }
        
        return this.activeSession;
    }

    /**
     * Get registered mechanics
     * @returns {Array} Array of registered mechanics
     */
    getRegisteredMechanics() {
        return Array.from(this.registeredMechanics.values());
    }

    /**
     * Get active mechanics
     * @returns {Array} Array of active mechanics
     */
    getActiveMechanics() {
        return Array.from(this.activeMechanics.values());
    }

    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    removeEventListener(event, callback) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Dispatch custom event
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    dispatchEvent(event, data) {
        // Dispatch to internal listeners
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }

        // Dispatch to global window
        window.dispatchEvent(new CustomEvent(`gamingMechanics${event}`, {
            detail: data
        }));
    }

    /**
     * Log message with engine prefix
     * @param {string} message - Log message
     * @param {*} data - Additional data
     */
    log(message, data = null) {
        if (this.config.enableLogging) {
            if (data) {
                console.log(`🎮 Gaming Mechanics Engine: ${message}`, data);
            } else {
                console.log(`🎮 Gaming Mechanics Engine: ${message}`);
            }
        }
    }

    /**
     * Activate real-time decision mechanic
     * @param {Object} context - Activation context
     * @returns {Promise<Object>} Activation result
     */
    async activateRealTimeMechanic(context) {
        console.log('🎮 Activating real-time decision mechanic', context);
        
        // Ensure real-time engine is available
        if (!window.realTimeEngine) {
            console.error('Real-time decision engine not available');
            return null;
        }

        try {
            // Start real-time scenario
            const result = await window.realTimeEngine.handleMechanicActivation(context);
            
            return {
                type: 'realtime',
                context,
                result,
                engine: window.realTimeEngine
            };
        } catch (error) {
            console.error('Failed to activate real-time mechanic:', error);
            return null;
        }
    }

    /**
     * Deactivate real-time decision mechanic
     * @param {Object} context - Deactivation context
     */
    async deactivateRealTimeMechanic(context) {
        console.log('🎮 Deactivating real-time decision mechanic');
        
        if (window.realTimeEngine) {
            // Stop any active scenarios
            const activeScenarios = window.realTimeEngine.activeScenarios;
            for (const [scenarioId, scenario] of activeScenarios) {
                if (scenario.status === 'active') {
                    window.realTimeEngine.completeScenario(scenario, 'cancelled');
                }
            }
        }
    }

    /**
     * Activate social engineering puzzle mechanic
     * @param {Object} context - Activation context
     * @returns {Promise<Object>} Activation result
     */
    async activatePuzzleMechanic(context) {
        console.log('🎮 Activating social engineering puzzle mechanic', context);
        
        // Ensure puzzle engine is available
        if (!window.socialEngineeringPuzzleEngine) {
            console.error('Social engineering puzzle engine not available');
            return null;
        }

        try {
            // Activate puzzle through puzzle engine
            const result = await window.socialEngineeringPuzzleEngine.handleMechanicActivation(context);
            
            return {
                type: 'social_engineering_puzzle',
                context,
                result,
                engine: window.socialEngineeringPuzzleEngine
            };
        } catch (error) {
            console.error('Failed to activate puzzle mechanic:', error);
            return null;
        }
    }

    /**
     * Deactivate social engineering puzzle mechanic
     * @param {Object} context - Deactivation context
     */
    async deactivatePuzzleMechanic(context) {
        console.log('🎮 Deactivating social engineering puzzle mechanic');
        
        if (window.socialEngineeringPuzzleEngine) {
            // Close any active puzzles
            const activePuzzles = window.socialEngineeringPuzzleEngine.getActivePuzzles();
            for (const puzzle of activePuzzles) {
                window.socialEngineeringPuzzleEngine.closePuzzle(puzzle.id);
            }
            
            // Remove any puzzle UI elements
            const puzzleElements = document.querySelectorAll('.social-engineering-puzzle-container');
            puzzleElements.forEach(element => element.remove());
        }
    }

    /**
     * Get engine status
     * @returns {Object} Engine status information
     */
    getStatus() {
        return {
            version: this.version,
            initialized: this.initialized,
            registeredMechanics: this.registeredMechanics.size,
            activeMechanics: this.activeMechanics.size,
            currentSession: this.getCurrentSession(),
            config: this.config
        };
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GamingMechanicsEngine };
}

// Create global instance
window.GamingMechanicsEngine = GamingMechanicsEngine;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.gamingEngine) {
            window.gamingEngine = new GamingMechanicsEngine();
            await window.gamingEngine.initialize();
        }
    });
} else {
    if (!window.gamingEngine) {
        window.gamingEngine = new GamingMechanicsEngine();
        window.gamingEngine.initialize();
    }
}