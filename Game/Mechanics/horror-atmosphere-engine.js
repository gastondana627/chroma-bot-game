/**
 * Horror Atmosphere Engine
 * 
 * Core system that manages psychological horror effects based on player vulnerability.
 * Integrates with Bayesian Trust Engine to scale horror intensity dynamically.
 * 
 * @class HorrorAtmosphereEngine
 */

class HorrorAtmosphereEngine {
    /**
     * Event type constants
     */
    static EVENT_TYPES = {
        INTENSITY_CHANGED: 'horrorIntensityChanged',
        TRANSITION_START: 'horrorTransitionStart',
        TRANSITION_COMPLETE: 'horrorTransitionComplete',
        GLITCH_TRIGGERED: 'glitchTriggered',
        THRESHOLD_CROSSED: 'horrorThresholdCrossed'
    };

    /**
     * Horror intensity thresholds
     */
    static INTENSITY_THRESHOLDS = {
        SAFE: 20,
        MINIMAL: 0,
        MODERATE: -30,
        HEAVY: -60
    };

    /**
     * Initialize Horror Atmosphere Engine
     * @param {Object} options - Configuration options
     * @param {string} options.character - Character name ('maya', 'eli', 'stanley')
     * @param {Object} options.accessibilitySettings - Accessibility preferences
     * @param {boolean} options.debugMode - Enable debug logging
     * @param {number} options.updateThrottle - Minimum time between updates in ms (default: 100)
     */
    constructor(options = {}) {
        // Configuration
        this.character = options.character || 'maya';
        this.debugMode = options.debugMode || false;
        this.testMode = options.testMode || false;
        this.updateThrottle = options.updateThrottle || 100; // 100ms minimum between updates

        // State management properties
        this.state = {
            currentIntensity: 0,
            previousIntensity: 0,
            trustScore: 100,
            sophistication: 1,
            activeEffects: [],
            transitionInProgress: false,
            lastUpdate: Date.now(),
            initialized: false
        };

        // State history for debugging
        this.stateHistory = [];
        this.maxHistoryLength = 50;

        // Event listeners registry
        this.eventListeners = new Map();

        // Throttling state
        this._updateTimeout = null;
        this._pendingUpdate = null;

        // Accessibility settings
        this.accessibilitySettings = {
            intensityMultiplier: options.accessibilitySettings?.intensityMultiplier || 1.0,
            flashingEnabled: options.accessibilitySettings?.flashingEnabled !== false,
            motionReduced: options.accessibilitySettings?.motionReduced || false
        };

        // Performance optimization: DOM update batching (Task 9.1)
        this._domUpdateQueue = [];
        this._rafScheduled = false;
        this._frameTimings = [];
        this._maxFrameTimings = 60; // Track last 60 frames

        // Performance optimization: Effect limiting (Task 9.2)
        this._activeAnimations = new Set();
        this._maxConcurrentAnimations = 10;
        this._effectPool = new Map();
        this._effectPriorities = {
            'nightmare-mode': 5,
            'reality-tear': 4,
            'face-morph': 3,
            'subtle-flicker': 2,
            'text-double': 1
        };

        // Performance optimization: Performance monitoring (Task 9.3)
        this._performanceMonitor = {
            fps: 60,
            fpsHistory: [],
            memoryUsage: 0,
            lastFrameTime: Date.now(),
            frameCount: 0,
            degradationDetected: false,
            qualityLevel: 'high' // 'high', 'medium', 'low'
        };
        this._performanceCheckInterval = null;

        // Initialize
        this._initialize();
    }

    /**
     * Internal initialization
     * @private
     */
    _initialize() {
        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] Initializing...', {
                character: this.character,
                accessibilitySettings: this.accessibilitySettings
            });
        }

        // Set up trust score event listener
        this._setupTrustScoreListener();

        // Mark as initialized
        this.state.initialized = true;
        this._recordStateHistory('initialized');

        // Dispatch initialization event
        this.dispatchEvent(HorrorAtmosphereEngine.EVENT_TYPES.INTENSITY_CHANGED, {
            intensity: this.state.currentIntensity,
            character: this.character,
            reason: 'initialization'
        });
    }

    /**
     * Set up trust score event listener
     * Listens for trust score updates from the Bayesian Trust Engine
     * @private
     */
    _setupTrustScoreListener() {
        // Listen for custom trust score update events
        if (typeof window !== 'undefined') {
            // Bind the handler to maintain context
            this._trustScoreHandler = this._handleTrustScoreUpdate.bind(this);
            
            // Listen for trust score update events
            window.addEventListener('trustScoreUpdated', this._trustScoreHandler);
            
            if (this.debugMode) {
                console.log('[HorrorAtmosphereEngine] Trust score listener registered');
            }
        }
    }

    /**
     * Handle trust score update events
     * @param {CustomEvent} event - Trust score update event
     * @private
     */
    _handleTrustScoreUpdate(event) {
        try {
            // Extract trust score from event data
            const eventData = event.detail || {};
            const trustScore = eventData.newScore !== undefined ? eventData.newScore : eventData.trustScore;
            const sophistication = eventData.sophistication || this.state.sophistication;
            const character = eventData.character || this.character;

            // Handle missing trust score gracefully
            if (trustScore === undefined || trustScore === null) {
                if (this.debugMode) {
                    console.warn('[HorrorAtmosphereEngine] Trust score update received without valid score:', eventData);
                }
                return;
            }

            // Validate trust score range
            if (trustScore < -100 || trustScore > 100) {
                console.error('[HorrorAtmosphereEngine] Invalid trust score received:', trustScore);
                return;
            }

            if (this.debugMode) {
                console.log('[HorrorAtmosphereEngine] Trust score update received:', {
                    trustScore,
                    sophistication,
                    character,
                    previousScore: this.state.trustScore
                });
            }

            // Trigger intensity recalculation
            this.update({
                trustScore,
                sophistication,
                character
            });

        } catch (error) {
            console.error('[HorrorAtmosphereEngine] Error handling trust score update:', error);
        }
    }

    /**
     * Calculate horror intensity based on trust score and AI sophistication
     * @param {number} trustScore - Trust score (-100 to 100)
     * @param {number} sophistication - AI sophistication level (1-5)
     * @returns {number} Horror intensity (0-4)
     */
    calculateIntensity(trustScore, sophistication = 1) {
        // Base intensity from trust score thresholds
        let baseIntensity;
        
        if (trustScore >= HorrorAtmosphereEngine.INTENSITY_THRESHOLDS.SAFE) {
            baseIntensity = 0; // Safe zone
        } else if (trustScore >= HorrorAtmosphereEngine.INTENSITY_THRESHOLDS.MINIMAL) {
            baseIntensity = 1; // Minimal horror
        } else if (trustScore >= HorrorAtmosphereEngine.INTENSITY_THRESHOLDS.MODERATE) {
            baseIntensity = 2; // Moderate horror
        } else if (trustScore >= HorrorAtmosphereEngine.INTENSITY_THRESHOLDS.HEAVY) {
            baseIntensity = 3; // Heavy horror
        } else {
            baseIntensity = 4; // Extreme horror
        }

        // Sophistication bonus (AI complexity adds horror)
        const sophisticationBonus = (sophistication - 1) * 0.2;

        // Final intensity (capped at 4)
        const finalIntensity = Math.min(4, baseIntensity + sophisticationBonus);

        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] Intensity calculation:', {
                trustScore,
                sophistication,
                baseIntensity,
                sophisticationBonus,
                finalIntensity
            });
        }

        return finalIntensity;
    }

    /**
     * Update engine state based on game state
     * Automatically triggers effect updates when intensity changes
     * Includes throttling to prevent excessive updates
     * @param {Object} gameState - Current game state
     * @param {number} gameState.trustScore - Current trust score
     * @param {number} gameState.sophistication - Current AI sophistication
     * @param {string} gameState.character - Current character
     * @param {boolean} gameState.immediate - Skip throttling for immediate update
     */
    update(gameState = {}) {
        if (!this.state.initialized) {
            console.warn('[HorrorAtmosphereEngine] Engine not initialized');
            return;
        }

        // Check if we should throttle this update
        const now = Date.now();
        const timeSinceLastUpdate = now - this.state.lastUpdate;
        const immediate = gameState.immediate || false;

        // If not immediate and within throttle window, queue the update
        if (!immediate && timeSinceLastUpdate < this.updateThrottle) {
            // Store pending update
            this._pendingUpdate = gameState;

            // Clear existing timeout
            if (this._updateTimeout) {
                clearTimeout(this._updateTimeout);
            }

            // Schedule update after throttle period
            const delay = this.updateThrottle - timeSinceLastUpdate;
            this._updateTimeout = setTimeout(() => {
                if (this._pendingUpdate) {
                    this._performUpdate(this._pendingUpdate);
                    this._pendingUpdate = null;
                }
                this._updateTimeout = null;
            }, delay);

            if (this.debugMode) {
                console.log('[HorrorAtmosphereEngine] Update throttled, scheduled in', delay, 'ms');
            }

            return;
        }

        // Perform immediate update
        this._performUpdate(gameState);
    }

    /**
     * Perform the actual update logic
     * @param {Object} gameState - Current game state
     * @private
     */
    _performUpdate(gameState) {
        const startTime = Date.now();

        // Extract values from game state
        const trustScore = gameState.trustScore !== undefined ? gameState.trustScore : this.state.trustScore;
        const sophistication = gameState.sophistication || this.state.sophistication;
        const character = gameState.character || this.character;

        // Calculate new intensity
        const newIntensity = this.calculateIntensity(trustScore, sophistication);

        // Store previous intensity before update
        const previousIntensity = this.state.currentIntensity;

        // Update state
        const stateChanged = this._updateState({
            trustScore,
            sophistication,
            currentIntensity: newIntensity
        });

        // Log state change
        if (this.debugMode && stateChanged) {
            this._logDebug('state_change', {
                previousIntensity,
                newIntensity,
                trustScore,
                sophistication,
                character
            });
        }

        // Check for threshold crossings
        if (stateChanged) {
            this._checkThresholdCrossing(previousIntensity, newIntensity, trustScore);
        }

        // Update character if changed
        if (character !== this.character) {
            this.character = character;
            this._recordStateHistory('character_changed');
        }

        // Trigger effect updates if intensity changed
        if (stateChanged && previousIntensity !== newIntensity) {
            this._triggerEffectUpdates(previousIntensity, newIntensity);
        }

        // Track performance
        this._trackUpdatePerformance(startTime);

        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] State updated:', this.getStatus());
        }
    }

    /**
     * Trigger effect updates when intensity changes
     * @param {number} oldIntensity - Previous intensity level
     * @param {number} newIntensity - New intensity level
     * @private
     */
    _triggerEffectUpdates(oldIntensity, newIntensity) {
        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] Triggering effect updates:', {
                from: oldIntensity,
                to: newIntensity
            });
        }

        // Log effect trigger
        if (this.debugMode) {
            this._logDebug('effect_trigger', {
                oldIntensity,
                newIntensity,
                character: this.character,
                trustScore: this.state.trustScore,
                sophistication: this.state.sophistication
            });
        }

        // Dispatch event for other systems to respond
        this.dispatchEvent('horrorEffectsUpdate', {
            oldIntensity,
            newIntensity,
            character: this.character,
            trustScore: this.state.trustScore,
            sophistication: this.state.sophistication
        });

        // Record in state history
        this._recordStateHistory('effects_updated');
    }

    /**
     * Get current engine status
     * @returns {Object} Current state snapshot
     */
    getStatus() {
        return {
            intensity: this.state.currentIntensity,
            previousIntensity: this.state.previousIntensity,
            character: this.character,
            trustScore: this.state.trustScore,
            sophistication: this.state.sophistication,
            activeEffects: [...this.state.activeEffects],
            transitionInProgress: this.state.transitionInProgress,
            lastUpdate: this.state.lastUpdate,
            initialized: this.state.initialized,
            accessibilitySettings: { ...this.accessibilitySettings }
        };
    }

    /**
     * Update internal state
     * @param {Object} updates - State updates
     * @returns {boolean} True if intensity changed
     * @private
     */
    _updateState(updates) {
        const previousIntensity = this.state.currentIntensity;

        // Apply updates
        Object.assign(this.state, updates);
        this.state.lastUpdate = Date.now();

        // Track previous intensity
        if (updates.currentIntensity !== undefined) {
            this.state.previousIntensity = previousIntensity;
        }

        // Record state change
        this._recordStateHistory('state_updated');

        // Check if intensity changed
        const intensityChanged = this.state.currentIntensity !== previousIntensity;

        // Dispatch event if intensity changed
        if (intensityChanged) {
            this.dispatchEvent(HorrorAtmosphereEngine.EVENT_TYPES.INTENSITY_CHANGED, {
                intensity: this.state.currentIntensity,
                previousIntensity: previousIntensity,
                trustScore: this.state.trustScore,
                character: this.character
            });
        }

        return intensityChanged;
    }

    /**
     * Record state in history for debugging
     * @param {string} reason - Reason for state change
     * @private
     */
    _recordStateHistory(reason) {
        this.stateHistory.push({
            timestamp: Date.now(),
            reason,
            state: { ...this.state }
        });

        // Limit history size
        if (this.stateHistory.length > this.maxHistoryLength) {
            this.stateHistory.shift();
        }
    }

    /**
     * Validate state integrity
     * @returns {boolean} True if state is valid
     * @private
     */
    _validateState() {
        const { currentIntensity, trustScore, sophistication } = this.state;

        // Validate intensity range
        if (currentIntensity < 0 || currentIntensity > 4) {
            console.error('[HorrorAtmosphereEngine] Invalid intensity:', currentIntensity);
            return false;
        }

        // Validate trust score range
        if (trustScore < -100 || trustScore > 100) {
            console.error('[HorrorAtmosphereEngine] Invalid trust score:', trustScore);
            return false;
        }

        // Validate sophistication range
        if (sophistication < 1 || sophistication > 5) {
            console.error('[HorrorAtmosphereEngine] Invalid sophistication:', sophistication);
            return false;
        }

        return true;
    }

    /**
     * Check if intensity crossed a threshold
     * Implements threshold crossing detection with logging and threshold-specific effects
     * @param {number} oldIntensity - Previous intensity
     * @param {number} newIntensity - New intensity
     * @param {number} trustScore - Current trust score
     * @private
     */
    _checkThresholdCrossing(oldIntensity, newIntensity, trustScore) {
        const thresholds = [0, 1, 2, 3, 4];
        
        for (const threshold of thresholds) {
            // Check if we crossed this threshold
            if ((oldIntensity < threshold && newIntensity >= threshold) ||
                (oldIntensity >= threshold && newIntensity < threshold)) {
                
                const direction = newIntensity > oldIntensity ? 'increase' : 'decrease';
                
                // Get threshold name for logging
                const thresholdName = this._getThresholdName(threshold);
                
                // Create detailed threshold event data
                const thresholdData = {
                    threshold,
                    thresholdName,
                    direction,
                    oldIntensity,
                    newIntensity,
                    trustScore,
                    character: this.character,
                    timestamp: Date.now()
                };

                // Dispatch threshold crossed event
                this.dispatchEvent(HorrorAtmosphereEngine.EVENT_TYPES.THRESHOLD_CROSSED, thresholdData);

                // Log threshold crossing
                this._logThresholdCrossing(thresholdData);

                // Apply threshold-specific effects
                this._applyThresholdEffects(thresholdData);

                if (this.debugMode) {
                    console.log('[HorrorAtmosphereEngine] Threshold crossed:', {
                        threshold,
                        thresholdName,
                        direction,
                        oldIntensity,
                        newIntensity,
                        trustScore
                    });
                }
            }
        }
    }

    /**
     * Get human-readable threshold name
     * @param {number} threshold - Threshold level
     * @returns {string} Threshold name
     * @private
     */
    _getThresholdName(threshold) {
        const names = {
            0: 'SAFE',
            1: 'MINIMAL',
            2: 'MODERATE',
            3: 'HEAVY',
            4: 'EXTREME'
        };
        return names[threshold] || 'UNKNOWN';
    }

    /**
     * Log threshold crossing for analytics
     * @param {Object} thresholdData - Threshold crossing data
     * @private
     */
    _logThresholdCrossing(thresholdData) {
        // Create log entry
        const logEntry = {
            type: 'threshold_crossing',
            timestamp: thresholdData.timestamp,
            threshold: thresholdData.threshold,
            thresholdName: thresholdData.thresholdName,
            direction: thresholdData.direction,
            oldIntensity: thresholdData.oldIntensity,
            newIntensity: thresholdData.newIntensity,
            trustScore: thresholdData.trustScore,
            character: thresholdData.character
        };

        // Store in state history
        this._recordStateHistory('threshold_crossed');

        // Log to console in debug mode
        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] Threshold crossing logged:', logEntry);
        }

        // Dispatch analytics event for external tracking
        this.dispatchEvent('horrorAnalytics', {
            eventType: 'threshold_crossing',
            data: logEntry
        });
    }

    /**
     * Apply threshold-specific effects
     * @param {Object} thresholdData - Threshold crossing data
     * @private
     */
    _applyThresholdEffects(thresholdData) {
        const { threshold, direction, character } = thresholdData;

        // Define threshold-specific effects
        const effects = {
            1: {
                increase: 'subtle_warning',
                decrease: 'relief_minimal'
            },
            2: {
                increase: 'moderate_tension',
                decrease: 'relief_moderate'
            },
            3: {
                increase: 'heavy_dread',
                decrease: 'relief_significant'
            },
            4: {
                increase: 'extreme_horror',
                decrease: 'relief_major'
            }
        };

        // Get effect for this threshold and direction
        const effect = effects[threshold]?.[direction];

        if (effect) {
            // Dispatch effect trigger event
            this.dispatchEvent('horrorThresholdEffect', {
                effect,
                threshold,
                direction,
                character,
                timestamp: Date.now()
            });

            if (this.debugMode) {
                console.log('[HorrorAtmosphereEngine] Threshold effect triggered:', effect);
            }
        }
    }

    /**
     * Dispatch custom event
     * @param {string} eventType - Event type
     * @param {Object} eventData - Event data payload
     */
    dispatchEvent(eventType, eventData = {}) {
        // Format event data
        const formattedData = {
            timestamp: Date.now(),
            engine: 'HorrorAtmosphereEngine',
            character: this.character,
            ...eventData
        };

        // Track event count for performance metrics
        if (this._performanceMetrics) {
            this._performanceMetrics.eventCount++;
        }

        // Log event
        if (this.debugMode) {
            this._logDebug('event', {
                eventType,
                data: formattedData
            });
        }

        // Create custom event
        const event = new CustomEvent(eventType, {
            detail: formattedData,
            bubbles: true,
            cancelable: true
        });

        // Dispatch on window for global access
        if (typeof window !== 'undefined') {
            window.dispatchEvent(event);
        }

        // Call registered listeners
        if (this.eventListeners.has(eventType)) {
            const listeners = this.eventListeners.get(eventType);
            listeners.forEach(listener => {
                try {
                    listener(formattedData);
                } catch (error) {
                    console.error('[HorrorAtmosphereEngine] Event listener error:', error);
                }
            });
        }

        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] Event dispatched:', eventType, formattedData);
        }
    }

    /**
     * Add event listener
     * @param {string} eventType - Event type to listen for
     * @param {Function} callback - Callback function
     */
    addEventListener(eventType, callback) {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }
        this.eventListeners.get(eventType).push(callback);

        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] Event listener added:', eventType);
        }
    }

    /**
     * Remove event listener
     * @param {string} eventType - Event type
     * @param {Function} callback - Callback function to remove
     */
    removeEventListener(eventType, callback) {
        if (this.eventListeners.has(eventType)) {
            const listeners = this.eventListeners.get(eventType);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Remove all event listeners
     */
    removeAllEventListeners() {
        this.eventListeners.clear();
        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] All event listeners removed');
        }
    }

    /**
     * Enable test mode with manual intensity control
     * Allows direct manipulation of intensity for testing purposes
     * @param {Object} options - Test mode options
     * @param {boolean} options.showUI - Show test UI overlay (default: true)
     * @param {Function} options.onIntensityChange - Callback for intensity changes
     */
    enableTestMode(options = {}) {
        this.testMode = true;
        this.testModeOptions = {
            showUI: options.showUI !== false,
            onIntensityChange: options.onIntensityChange || null
        };

        // Disable automatic updates in test mode
        this._testModeActive = true;

        console.log('[HorrorAtmosphereEngine] Test mode enabled');

        // Create test UI if requested
        if (this.testModeOptions.showUI && typeof document !== 'undefined') {
            this._createTestUI();
        }

        // Dispatch test mode event
        this.dispatchEvent('horrorTestModeEnabled', {
            testMode: true,
            options: this.testModeOptions
        });
    }

    /**
     * Disable test mode
     */
    disableTestMode() {
        this.testMode = false;
        this._testModeActive = false;

        // Remove test UI if it exists
        if (this._testUI && typeof document !== 'undefined') {
            this._testUI.remove();
            this._testUI = null;
        }

        console.log('[HorrorAtmosphereEngine] Test mode disabled');

        // Dispatch test mode event
        this.dispatchEvent('horrorTestModeDisabled', {
            testMode: false
        });
    }

    /**
     * Set intensity manually (test mode only)
     * Provides instant intensity changes for testing
     * @param {number} intensity - Intensity level (0-4)
     * @param {Object} options - Additional options
     * @param {boolean} options.skipTransition - Skip transition effects
     */
    setTestIntensity(intensity, options = {}) {
        if (!this.testMode) {
            console.warn('[HorrorAtmosphereEngine] setTestIntensity can only be used in test mode');
            return;
        }

        // Validate intensity
        if (intensity < 0 || intensity > 4) {
            console.error('[HorrorAtmosphereEngine] Invalid intensity:', intensity);
            return;
        }

        const previousIntensity = this.state.currentIntensity;

        // Update state immediately
        this.state.currentIntensity = intensity;
        this.state.previousIntensity = previousIntensity;
        this.state.lastUpdate = Date.now();

        // Record state change
        this._recordStateHistory('test_intensity_set');

        // Trigger effect updates
        if (!options.skipTransition) {
            this._triggerEffectUpdates(previousIntensity, intensity);
        }

        // Dispatch intensity changed event
        this.dispatchEvent(HorrorAtmosphereEngine.EVENT_TYPES.INTENSITY_CHANGED, {
            intensity: intensity,
            previousIntensity: previousIntensity,
            testMode: true,
            character: this.character
        });

        // Call test mode callback if provided
        if (this.testModeOptions?.onIntensityChange) {
            this.testModeOptions.onIntensityChange(intensity, previousIntensity);
        }

        console.log('[HorrorAtmosphereEngine] Test intensity set:', {
            from: previousIntensity,
            to: intensity
        });

        // Update test UI if it exists
        if (this._testUI) {
            this._updateTestUI();
        }
    }

    /**
     * Create test UI overlay
     * @private
     */
    _createTestUI() {
        // Remove existing UI if present
        if (this._testUI) {
            this._testUI.remove();
        }

        // Create container
        const container = document.createElement('div');
        container.id = 'horror-test-ui';
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            padding: 15px;
            border: 2px solid #00ff00;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 999999;
            min-width: 250px;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        `;

        // Create title
        const title = document.createElement('div');
        title.textContent = '🧪 HORROR TEST MODE';
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 14px;
            text-align: center;
            border-bottom: 1px solid #00ff00;
            padding-bottom: 5px;
        `;
        container.appendChild(title);

        // Create intensity display
        const intensityDisplay = document.createElement('div');
        intensityDisplay.id = 'horror-test-intensity-display';
        intensityDisplay.style.cssText = `
            margin-bottom: 10px;
            padding: 5px;
            background: rgba(0, 255, 0, 0.1);
            border-radius: 3px;
        `;
        container.appendChild(intensityDisplay);

        // Create intensity slider
        const sliderLabel = document.createElement('label');
        sliderLabel.textContent = 'Intensity Level:';
        sliderLabel.style.cssText = `
            display: block;
            margin-bottom: 5px;
        `;
        container.appendChild(sliderLabel);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '4';
        slider.step = '1';
        slider.value = this.state.currentIntensity.toString();
        slider.id = 'horror-test-slider';
        slider.style.cssText = `
            width: 100%;
            margin-bottom: 10px;
        `;
        slider.addEventListener('input', (e) => {
            const intensity = parseInt(e.target.value);
            this.setTestIntensity(intensity);
        });
        container.appendChild(slider);

        // Create character selector
        const characterLabel = document.createElement('label');
        characterLabel.textContent = 'Character:';
        characterLabel.style.cssText = `
            display: block;
            margin-bottom: 5px;
        `;
        container.appendChild(characterLabel);

        const characterSelect = document.createElement('select');
        characterSelect.id = 'horror-test-character';
        characterSelect.style.cssText = `
            width: 100%;
            margin-bottom: 10px;
            background: #000;
            color: #00ff00;
            border: 1px solid #00ff00;
            padding: 5px;
            border-radius: 3px;
        `;
        ['maya', 'eli', 'stanley'].forEach(char => {
            const option = document.createElement('option');
            option.value = char;
            option.textContent = char.charAt(0).toUpperCase() + char.slice(1);
            option.selected = char === this.character;
            characterSelect.appendChild(option);
        });
        characterSelect.addEventListener('change', (e) => {
            this.character = e.target.value;
            this._updateTestUI();
            this.dispatchEvent('horrorCharacterChanged', {
                character: this.character,
                testMode: true
            });
        });
        container.appendChild(characterSelect);

        // Create trust score display
        const trustScoreDisplay = document.createElement('div');
        trustScoreDisplay.id = 'horror-test-trust-score';
        trustScoreDisplay.style.cssText = `
            margin-bottom: 10px;
            padding: 5px;
            background: rgba(0, 255, 0, 0.1);
            border-radius: 3px;
        `;
        container.appendChild(trustScoreDisplay);

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close Test Mode';
        closeButton.style.cssText = `
            width: 100%;
            padding: 8px;
            background: #00ff00;
            color: #000;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
            font-family: monospace;
        `;
        closeButton.addEventListener('click', () => {
            this.disableTestMode();
        });
        container.appendChild(closeButton);

        // Add to document
        document.body.appendChild(container);
        this._testUI = container;

        // Initial update
        this._updateTestUI();

        console.log('[HorrorAtmosphereEngine] Test UI created');
    }

    /**
     * Update test UI with current state
     * @private
     */
    _updateTestUI() {
        if (!this._testUI) return;

        // Update intensity display
        const intensityDisplay = document.getElementById('horror-test-intensity-display');
        if (intensityDisplay) {
            const intensityName = this._getThresholdName(Math.floor(this.state.currentIntensity));
            intensityDisplay.innerHTML = `
                <strong>Current Intensity:</strong> ${this.state.currentIntensity.toFixed(2)}<br>
                <strong>Level:</strong> ${intensityName}
            `;
        }

        // Update slider
        const slider = document.getElementById('horror-test-slider');
        if (slider) {
            slider.value = Math.floor(this.state.currentIntensity).toString();
        }

        // Update trust score display
        const trustScoreDisplay = document.getElementById('horror-test-trust-score');
        if (trustScoreDisplay) {
            trustScoreDisplay.innerHTML = `
                <strong>Trust Score:</strong> ${this.state.trustScore}<br>
                <strong>Sophistication:</strong> ${this.state.sophistication}
            `;
        }
    }

    /**
     * Enable debug mode with comprehensive logging
     * @param {Object} options - Debug mode options
     * @param {boolean} options.logStateChanges - Log all state changes (default: true)
     * @param {boolean} options.logEffectTriggers - Log effect triggers (default: true)
     * @param {boolean} options.logPerformanceMetrics - Log performance metrics (default: true)
     * @param {boolean} options.logEvents - Log all events (default: true)
     * @param {number} options.performanceInterval - Performance logging interval in ms (default: 5000)
     */
    enableDebugMode(options = {}) {
        this.debugMode = true;
        this.debugOptions = {
            logStateChanges: options.logStateChanges !== false,
            logEffectTriggers: options.logEffectTriggers !== false,
            logPerformanceMetrics: options.logPerformanceMetrics !== false,
            logEvents: options.logEvents !== false,
            performanceInterval: options.performanceInterval || 5000
        };

        // Initialize debug logging structures
        this.debugLogs = {
            stateChanges: [],
            effectTriggers: [],
            performanceMetrics: [],
            events: []
        };

        // Start performance monitoring if enabled
        if (this.debugOptions.logPerformanceMetrics) {
            this._startPerformanceMonitoring();
        }

        console.log('[HorrorAtmosphereEngine] Debug mode enabled with options:', this.debugOptions);
        this._logDebug('debug_mode_enabled', { options: this.debugOptions });
    }

    /**
     * Disable debug mode
     */
    disableDebugMode() {
        this.debugMode = false;

        // Stop performance monitoring
        if (this._performanceMonitorInterval) {
            clearInterval(this._performanceMonitorInterval);
            this._performanceMonitorInterval = null;
        }

        console.log('[HorrorAtmosphereEngine] Debug mode disabled');
    }

    /**
     * Log debug information
     * @param {string} type - Log type
     * @param {Object} data - Log data
     * @private
     */
    _logDebug(type, data = {}) {
        if (!this.debugMode) return;

        const logEntry = {
            timestamp: Date.now(),
            type,
            data,
            state: {
                intensity: this.state.currentIntensity,
                trustScore: this.state.trustScore,
                character: this.character
            }
        };

        // Categorize log
        switch (type) {
            case 'state_change':
                if (this.debugOptions.logStateChanges) {
                    this.debugLogs.stateChanges.push(logEntry);
                    console.log('[HorrorAtmosphereEngine] State Change:', data);
                }
                break;

            case 'effect_trigger':
                if (this.debugOptions.logEffectTriggers) {
                    this.debugLogs.effectTriggers.push(logEntry);
                    console.log('[HorrorAtmosphereEngine] Effect Trigger:', data);
                }
                break;

            case 'performance_metric':
                if (this.debugOptions.logPerformanceMetrics) {
                    this.debugLogs.performanceMetrics.push(logEntry);
                    console.log('[HorrorAtmosphereEngine] Performance:', data);
                }
                break;

            case 'event':
                if (this.debugOptions.logEvents) {
                    this.debugLogs.events.push(logEntry);
                    console.log('[HorrorAtmosphereEngine] Event:', data);
                }
                break;

            default:
                console.log('[HorrorAtmosphereEngine] Debug:', type, data);
        }

        // Limit log sizes to prevent memory issues
        this._trimDebugLogs();
    }

    /**
     * Trim debug logs to prevent memory overflow
     * @private
     */
    _trimDebugLogs() {
        const maxLogSize = 100;

        Object.keys(this.debugLogs).forEach(key => {
            if (this.debugLogs[key].length > maxLogSize) {
                this.debugLogs[key] = this.debugLogs[key].slice(-maxLogSize);
            }
        });
    }

    /**
     * Start performance monitoring
     * @private
     */
    _startPerformanceMonitoring() {
        // Clear existing interval
        if (this._performanceMonitorInterval) {
            clearInterval(this._performanceMonitorInterval);
        }

        // Initialize performance tracking
        this._performanceMetrics = {
            updateCount: 0,
            eventCount: 0,
            lastUpdateTime: Date.now(),
            averageUpdateTime: 0,
            peakUpdateTime: 0
        };

        // Start monitoring interval
        this._performanceMonitorInterval = setInterval(() => {
            this._logPerformanceMetrics();
        }, this.debugOptions.performanceInterval);

        console.log('[HorrorAtmosphereEngine] Performance monitoring started');
    }

    /**
     * Log performance metrics
     * @private
     */
    _logPerformanceMetrics() {
        if (!this.debugMode || !this.debugOptions.logPerformanceMetrics) return;

        const now = Date.now();
        const timeSinceLastLog = now - (this._lastPerformanceLog || now);
        this._lastPerformanceLog = now;

        // Calculate metrics
        const metrics = {
            updateCount: this._performanceMetrics.updateCount,
            eventCount: this._performanceMetrics.eventCount,
            updatesPerSecond: (this._performanceMetrics.updateCount / (timeSinceLastLog / 1000)).toFixed(2),
            eventsPerSecond: (this._performanceMetrics.eventCount / (timeSinceLastLog / 1000)).toFixed(2),
            averageUpdateTime: this._performanceMetrics.averageUpdateTime.toFixed(2),
            peakUpdateTime: this._performanceMetrics.peakUpdateTime.toFixed(2),
            stateHistorySize: this.stateHistory.length,
            activeEffectsCount: this.state.activeEffects.length,
            memoryUsage: this._getMemoryUsage()
        };

        // Log metrics
        this._logDebug('performance_metric', metrics);

        // Reset counters
        this._performanceMetrics.updateCount = 0;
        this._performanceMetrics.eventCount = 0;
        this._performanceMetrics.peakUpdateTime = 0;
    }

    /**
     * Get memory usage estimate
     * @returns {Object} Memory usage information
     * @private
     */
    _getMemoryUsage() {
        if (typeof performance !== 'undefined' && performance.memory) {
            return {
                usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
                totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
                jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
            };
        }
        return { available: false };
    }

    /**
     * Track update performance
     * @param {number} startTime - Update start time
     * @private
     */
    _trackUpdatePerformance(startTime) {
        if (!this.debugMode || !this.debugOptions.logPerformanceMetrics) return;

        const updateTime = Date.now() - startTime;

        // Update metrics
        this._performanceMetrics.updateCount++;
        
        // Calculate running average
        const count = this._performanceMetrics.updateCount;
        this._performanceMetrics.averageUpdateTime = 
            (this._performanceMetrics.averageUpdateTime * (count - 1) + updateTime) / count;

        // Track peak
        if (updateTime > this._performanceMetrics.peakUpdateTime) {
            this._performanceMetrics.peakUpdateTime = updateTime;
        }

        // Warn if update is slow
        if (updateTime > 100) {
            console.warn('[HorrorAtmosphereEngine] Slow update detected:', updateTime + 'ms');
        }
    }

    /**
     * Get debug logs
     * @param {string} type - Log type ('stateChanges', 'effectTriggers', 'performanceMetrics', 'events', or 'all')
     * @returns {Array|Object} Debug logs
     */
    getDebugLogs(type = 'all') {
        if (!this.debugMode) {
            console.warn('[HorrorAtmosphereEngine] Debug mode is not enabled');
            return [];
        }

        if (type === 'all') {
            return { ...this.debugLogs };
        }

        return this.debugLogs[type] || [];
    }

    /**
     * Clear debug logs
     * @param {string} type - Log type to clear, or 'all' for all logs
     */
    clearDebugLogs(type = 'all') {
        if (!this.debugMode) {
            console.warn('[HorrorAtmosphereEngine] Debug mode is not enabled');
            return;
        }

        if (type === 'all') {
            this.debugLogs = {
                stateChanges: [],
                effectTriggers: [],
                performanceMetrics: [],
                events: []
            };
            console.log('[HorrorAtmosphereEngine] All debug logs cleared');
        } else if (this.debugLogs[type]) {
            this.debugLogs[type] = [];
            console.log('[HorrorAtmosphereEngine] Debug logs cleared:', type);
        }
    }

    /**
     * Export debug logs as JSON
     * @returns {string} JSON string of debug logs
     */
    exportDebugLogs() {
        if (!this.debugMode) {
            console.warn('[HorrorAtmosphereEngine] Debug mode is not enabled');
            return '{}';
        }

        const exportData = {
            timestamp: Date.now(),
            character: this.character,
            currentState: this.getStatus(),
            stateHistory: this.stateHistory,
            debugLogs: this.debugLogs,
            performanceMetrics: this._performanceMetrics
        };

        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Get state history for debugging
     * @returns {Array} State history
     */
    getStateHistory() {
        return [...this.stateHistory];
    }

    /**
     * Validate all character profiles
     * Checks that all character profiles load correctly and have valid configurations
     * @returns {Object} Validation results
     */
    validateProfiles() {
        console.log('[HorrorAtmosphereEngine] Starting profile validation...');

        const results = {
            success: true,
            timestamp: Date.now(),
            profiles: {},
            errors: [],
            warnings: []
        };

        const characters = ['maya', 'eli', 'stanley'];

        // Test each character profile
        for (const character of characters) {
            const profileResult = {
                character,
                loaded: false,
                valid: false,
                errors: [],
                warnings: []
            };

            try {
                // Try to load profile
                const profileManager = new CharacterProfileManager();
                const profile = profileManager.getProfileConfiguration(character);
                profileResult.loaded = true;

                // Validate profile structure
                const requiredFields = [
                    'character',
                    'aesthetic',
                    'glitchStyle',
                    'colorPalette',
                    'cssFilters',
                    'targetElements',
                    'glitchProfiles'
                ];

                for (const field of requiredFields) {
                    if (!profile[field]) {
                        profileResult.errors.push(`Missing required field: ${field}`);
                        results.success = false;
                    }
                }

                // Validate color palette
                if (profile.colorPalette) {
                    if (!profile.colorPalette.safe || !Array.isArray(profile.colorPalette.safe)) {
                        profileResult.errors.push('Invalid or missing safe color palette');
                        results.success = false;
                    }
                    if (!profile.colorPalette.corrupted || !Array.isArray(profile.colorPalette.corrupted)) {
                        profileResult.errors.push('Invalid or missing corrupted color palette');
                        results.success = false;
                    }
                }

                // Validate CSS filters for all intensity levels
                if (profile.cssFilters) {
                    for (let i = 0; i <= 4; i++) {
                        if (profile.cssFilters[i] === undefined) {
                            profileResult.errors.push(`Missing CSS filter for intensity ${i}`);
                            results.success = false;
                        }
                    }
                }

                // Validate glitch profiles for all intensity levels
                if (profile.glitchProfiles) {
                    for (let i = 0; i <= 4; i++) {
                        if (!Array.isArray(profile.glitchProfiles[i])) {
                            profileResult.errors.push(`Invalid glitch profile for intensity ${i}`);
                            results.success = false;
                        } else if (i > 0 && profile.glitchProfiles[i].length === 0) {
                            profileResult.warnings.push(`No glitch effects defined for intensity ${i}`);
                        }
                    }
                }

                // Validate target elements
                if (profile.targetElements) {
                    if (!Array.isArray(profile.targetElements) || profile.targetElements.length === 0) {
                        profileResult.errors.push('Invalid or empty target elements array');
                        results.success = false;
                    }
                }

                // Mark as valid if no errors
                profileResult.valid = profileResult.errors.length === 0;

            } catch (error) {
                profileResult.errors.push(`Failed to load profile: ${error.message}`);
                results.success = false;
            }

            // Store profile result
            results.profiles[character] = profileResult;

            // Add to global errors/warnings
            if (profileResult.errors.length > 0) {
                results.errors.push(...profileResult.errors.map(e => `${character}: ${e}`));
            }
            if (profileResult.warnings.length > 0) {
                results.warnings.push(...profileResult.warnings.map(w => `${character}: ${w}`));
            }
        }

        // Log results
        console.log('[HorrorAtmosphereEngine] Profile validation complete:', results);

        if (results.success) {
            console.log('✓ All profiles validated successfully');
        } else {
            console.error('✗ Profile validation failed with', results.errors.length, 'errors');
        }

        if (results.warnings.length > 0) {
            console.warn('⚠ Profile validation has', results.warnings.length, 'warnings');
        }

        return results;
    }

    /**
     * Verify animation definitions exist
     * Checks that CSS animation definitions are available
     * @returns {Object} Verification results
     */
    verifyAnimationDefinitions() {
        console.log('[HorrorAtmosphereEngine] Verifying animation definitions...');

        const results = {
            success: true,
            timestamp: Date.now(),
            animations: {},
            errors: [],
            warnings: []
        };

        // Define expected animations for each character
        const expectedAnimations = {
            maya: [
                'subtle-flicker',
                'face-morph',
                'reality-tear',
                'nightmare-mode'
            ],
            eli: [
                'pixel-flicker',
                'neon-distort',
                'pixel-corruption',
                'digital-breakdown'
            ],
            stanley: [
                'crt-flicker',
                'vhs-distort',
                'signal-interference',
                'total-breakdown'
            ]
        };

        // Check if we can access stylesheets
        if (typeof document === 'undefined' || !document.styleSheets) {
            results.warnings.push('Cannot access stylesheets (not in browser environment)');
            return results;
        }

        // Get all CSS rules
        const allRules = [];
        try {
            for (const sheet of document.styleSheets) {
                try {
                    if (sheet.cssRules) {
                        allRules.push(...Array.from(sheet.cssRules));
                    }
                } catch (e) {
                    // Cross-origin stylesheet, skip
                }
            }
        } catch (error) {
            results.warnings.push('Error accessing stylesheets: ' + error.message);
        }

        // Extract animation names
        const definedAnimations = new Set();
        allRules.forEach(rule => {
            if (rule.type === CSSRule.KEYFRAMES_RULE) {
                definedAnimations.add(rule.name);
            }
        });

        // Check each character's animations
        for (const [character, animations] of Object.entries(expectedAnimations)) {
            const characterResult = {
                character,
                expected: animations.length,
                found: 0,
                missing: []
            };

            for (const animation of animations) {
                if (definedAnimations.has(animation)) {
                    characterResult.found++;
                } else {
                    characterResult.missing.push(animation);
                    results.warnings.push(`${character}: Missing animation '${animation}'`);
                }
            }

            results.animations[character] = characterResult;
        }

        // Check if any animations were found
        if (definedAnimations.size === 0) {
            results.warnings.push('No CSS animations found - stylesheets may not be loaded');
        }

        console.log('[HorrorAtmosphereEngine] Animation verification complete:', results);

        if (results.warnings.length > 0) {
            console.warn('⚠ Animation verification has', results.warnings.length, 'warnings');
        } else {
            console.log('✓ All animations verified');
        }

        return results;
    }

    /**
     * Test event system functionality
     * Verifies that events can be dispatched and received
     * @returns {Object} Test results
     */
    testEventSystem() {
        console.log('[HorrorAtmosphereEngine] Testing event system...');

        const results = {
            success: true,
            timestamp: Date.now(),
            tests: {},
            errors: []
        };

        // Test 1: Event dispatch
        try {
            let eventReceived = false;
            const testHandler = () => { eventReceived = true; };

            this.addEventListener('testEvent', testHandler);
            this.dispatchEvent('testEvent', { test: true });
            this.removeEventListener('testEvent', testHandler);

            results.tests.eventDispatch = {
                passed: eventReceived,
                description: 'Event dispatch and listener'
            };

            if (!eventReceived) {
                results.errors.push('Event was not received by listener');
                results.success = false;
            }
        } catch (error) {
            results.tests.eventDispatch = {
                passed: false,
                description: 'Event dispatch and listener',
                error: error.message
            };
            results.errors.push('Event dispatch test failed: ' + error.message);
            results.success = false;
        }

        // Test 2: Window event dispatch
        try {
            let windowEventReceived = false;
            const windowHandler = () => { windowEventReceived = true; };

            if (typeof window !== 'undefined') {
                window.addEventListener('testWindowEvent', windowHandler);
                this.dispatchEvent('testWindowEvent', { test: true });
                window.removeEventListener('testWindowEvent', windowHandler);

                results.tests.windowEventDispatch = {
                    passed: windowEventReceived,
                    description: 'Window event dispatch'
                };

                if (!windowEventReceived) {
                    results.errors.push('Window event was not received');
                    results.success = false;
                }
            } else {
                results.tests.windowEventDispatch = {
                    passed: false,
                    description: 'Window event dispatch',
                    skipped: true,
                    reason: 'Window object not available'
                };
            }
        } catch (error) {
            results.tests.windowEventDispatch = {
                passed: false,
                description: 'Window event dispatch',
                error: error.message
            };
            results.errors.push('Window event dispatch test failed: ' + error.message);
            results.success = false;
        }

        // Test 3: Event data formatting
        try {
            let receivedData = null;
            const dataHandler = (data) => { receivedData = data; };

            this.addEventListener('testDataEvent', dataHandler);
            this.dispatchEvent('testDataEvent', { testValue: 123 });
            this.removeEventListener('testDataEvent', dataHandler);

            const hasTimestamp = receivedData && receivedData.timestamp;
            const hasEngine = receivedData && receivedData.engine === 'HorrorAtmosphereEngine';
            const hasTestValue = receivedData && receivedData.testValue === 123;

            results.tests.eventDataFormatting = {
                passed: hasTimestamp && hasEngine && hasTestValue,
                description: 'Event data formatting',
                receivedData
            };

            if (!hasTimestamp || !hasEngine || !hasTestValue) {
                results.errors.push('Event data not formatted correctly');
                results.success = false;
            }
        } catch (error) {
            results.tests.eventDataFormatting = {
                passed: false,
                description: 'Event data formatting',
                error: error.message
            };
            results.errors.push('Event data formatting test failed: ' + error.message);
            results.success = false;
        }

        // Test 4: Multiple listeners
        try {
            let listener1Called = false;
            let listener2Called = false;

            const handler1 = () => { listener1Called = true; };
            const handler2 = () => { listener2Called = true; };

            this.addEventListener('testMultiEvent', handler1);
            this.addEventListener('testMultiEvent', handler2);
            this.dispatchEvent('testMultiEvent', {});
            this.removeEventListener('testMultiEvent', handler1);
            this.removeEventListener('testMultiEvent', handler2);

            results.tests.multipleListeners = {
                passed: listener1Called && listener2Called,
                description: 'Multiple event listeners'
            };

            if (!listener1Called || !listener2Called) {
                results.errors.push('Not all listeners were called');
                results.success = false;
            }
        } catch (error) {
            results.tests.multipleListeners = {
                passed: false,
                description: 'Multiple event listeners',
                error: error.message
            };
            results.errors.push('Multiple listeners test failed: ' + error.message);
            results.success = false;
        }

        console.log('[HorrorAtmosphereEngine] Event system test complete:', results);

        if (results.success) {
            console.log('✓ All event system tests passed');
        } else {
            console.error('✗ Event system tests failed with', results.errors.length, 'errors');
        }

        return results;
    }

    /**
     * Run all validation tests
     * Comprehensive validation of all engine components
     * @returns {Object} Complete validation results
     */
    runValidation() {
        console.log('[HorrorAtmosphereEngine] Running complete validation...');

        const results = {
            timestamp: Date.now(),
            overallSuccess: true,
            profiles: null,
            animations: null,
            eventSystem: null,
            summary: {
                totalTests: 0,
                passed: 0,
                failed: 0,
                warnings: 0
            }
        };

        // Run profile validation
        results.profiles = this.validateProfiles();
        if (!results.profiles.success) {
            results.overallSuccess = false;
        }

        // Run animation verification
        results.animations = this.verifyAnimationDefinitions();

        // Run event system tests
        results.eventSystem = this.testEventSystem();
        if (!results.eventSystem.success) {
            results.overallSuccess = false;
        }

        // Calculate summary
        const profileTests = Object.keys(results.profiles.profiles).length;
        const profilePassed = Object.values(results.profiles.profiles).filter(p => p.valid).length;
        const eventTests = Object.keys(results.eventSystem.tests).length;
        const eventPassed = Object.values(results.eventSystem.tests).filter(t => t.passed).length;

        results.summary.totalTests = profileTests + eventTests;
        results.summary.passed = profilePassed + eventPassed;
        results.summary.failed = results.summary.totalTests - results.summary.passed;
        results.summary.warnings = results.profiles.warnings.length + results.animations.warnings.length;

        console.log('[HorrorAtmosphereEngine] Validation complete:', results.summary);

        if (results.overallSuccess) {
            console.log('✓ All validation tests passed');
        } else {
            console.error('✗ Validation failed');
        }

        return results;
    }

    /**
     * ========================================
     * PERFORMANCE OPTIMIZATION METHODS
     * Task 9: Performance Optimization
     * ========================================
     */

    /**
     * Task 9.1: DOM Update Batching
     * Queue a DOM update to be batched with other updates
     * @param {Function} updateFn - Function that performs DOM updates
     * @param {number} priority - Update priority (higher = more important)
     */
    queueDOMUpdate(updateFn, priority = 0) {
        this._domUpdateQueue.push({
            fn: updateFn,
            priority,
            timestamp: Date.now()
        });

        // Schedule batch processing if not already scheduled
        if (!this._rafScheduled) {
            this._scheduleRAF();
        }
    }

    /**
     * Schedule requestAnimationFrame for batch processing
     * @private
     */
    _scheduleRAF() {
        if (this._rafScheduled) return;

        this._rafScheduled = true;

        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame((timestamp) => {
                this._processDOMUpdateBatch(timestamp);
            });
        } else {
            // Fallback for non-browser environments
            setTimeout(() => {
                this._processDOMUpdateBatch(Date.now());
            }, 16); // ~60fps
        }
    }

    /**
     * Process all queued DOM updates in a single frame
     * Implements batching and frame timing measurement
     * @param {number} timestamp - Frame timestamp
     * @private
     */
    _processDOMUpdateBatch(timestamp) {
        const frameStart = performance.now ? performance.now() : Date.now();

        // Sort updates by priority (highest first)
        this._domUpdateQueue.sort((a, b) => b.priority - a.priority);

        // Process all queued updates
        const processedUpdates = [];
        while (this._domUpdateQueue.length > 0) {
            const update = this._domUpdateQueue.shift();
            
            try {
                update.fn();
                processedUpdates.push(update);
            } catch (error) {
                console.error('[HorrorAtmosphereEngine] DOM update error:', error);
            }
        }

        // Measure frame timing
        const frameEnd = performance.now ? performance.now() : Date.now();
        const frameDuration = frameEnd - frameStart;
        
        this._recordFrameTiming(frameDuration);

        // Reset RAF flag
        this._rafScheduled = false;

        // Log performance in debug mode
        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] Batch processed:', {
                updateCount: processedUpdates.length,
                frameDuration: frameDuration.toFixed(2) + 'ms',
                fps: this._performanceMonitor.fps.toFixed(1)
            });
        }
    }

    /**
     * Record frame timing for performance monitoring
     * @param {number} duration - Frame duration in milliseconds
     * @private
     */
    _recordFrameTiming(duration) {
        this._frameTimings.push({
            duration,
            timestamp: Date.now()
        });

        // Limit history size
        if (this._frameTimings.length > this._maxFrameTimings) {
            this._frameTimings.shift();
        }

        // Update FPS calculation
        this._updateFPSCalculation();
    }

    /**
     * Get average frame time from recent frames
     * @returns {number} Average frame time in milliseconds
     */
    getAverageFrameTime() {
        if (this._frameTimings.length === 0) return 16.67; // Assume 60fps

        const sum = this._frameTimings.reduce((acc, frame) => acc + frame.duration, 0);
        return sum / this._frameTimings.length;
    }

    /**
     * Get frame timing statistics
     * @returns {Object} Frame timing stats
     */
    getFrameTimingStats() {
        if (this._frameTimings.length === 0) {
            return {
                average: 16.67,
                min: 16.67,
                max: 16.67,
                count: 0
            };
        }

        const durations = this._frameTimings.map(f => f.duration);
        return {
            average: durations.reduce((a, b) => a + b, 0) / durations.length,
            min: Math.min(...durations),
            max: Math.max(...durations),
            count: durations.length
        };
    }

    /**
     * Task 9.2: Effect Limiting
     * Add an animation to the active set with priority management
     * @param {string} effectId - Unique effect identifier
     * @param {string} effectType - Type of effect
     * @param {Function} cleanupFn - Function to call when effect is removed
     * @returns {boolean} True if effect was added, false if limit reached
     */
    addActiveAnimation(effectId, effectType, cleanupFn = null) {
        // Check if we're at the limit
        if (this._activeAnimations.size >= this._maxConcurrentAnimations) {
            // Try to remove lowest priority effect
            const removed = this._removeLowPriorityEffect(effectType);
            
            if (!removed) {
                if (this.debugMode) {
                    console.warn('[HorrorAtmosphereEngine] Animation limit reached, effect rejected:', effectId);
                }
                return false;
            }
        }

        // Add to active set
        const priority = this._effectPriorities[effectType] || 0;
        this._activeAnimations.add({
            id: effectId,
            type: effectType,
            priority,
            startTime: Date.now(),
            cleanupFn
        });

        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] Animation added:', {
                effectId,
                effectType,
                priority,
                activeCount: this._activeAnimations.size
            });
        }

        return true;
    }

    /**
     * Remove an animation from the active set
     * @param {string} effectId - Effect identifier to remove
     */
    removeActiveAnimation(effectId) {
        for (const effect of this._activeAnimations) {
            if (effect.id === effectId) {
                // Call cleanup function if provided
                if (effect.cleanupFn) {
                    try {
                        effect.cleanupFn();
                    } catch (error) {
                        console.error('[HorrorAtmosphereEngine] Effect cleanup error:', error);
                    }
                }

                this._activeAnimations.delete(effect);

                if (this.debugMode) {
                    console.log('[HorrorAtmosphereEngine] Animation removed:', effectId);
                }
                break;
            }
        }
    }

    /**
     * Remove the lowest priority active effect
     * @param {string} newEffectType - Type of new effect trying to be added
     * @returns {boolean} True if an effect was removed
     * @private
     */
    _removeLowPriorityEffect(newEffectType) {
        const newPriority = this._effectPriorities[newEffectType] || 0;
        
        let lowestPriority = Infinity;
        let lowestEffect = null;

        // Find lowest priority effect
        for (const effect of this._activeAnimations) {
            if (effect.priority < lowestPriority) {
                lowestPriority = effect.priority;
                lowestEffect = effect;
            }
        }

        // Only remove if new effect has higher priority
        if (lowestEffect && newPriority > lowestPriority) {
            this.removeActiveAnimation(lowestEffect.id);
            return true;
        }

        return false;
    }

    /**
     * Get an effect from the pool or create a new one
     * Implements effect pooling for performance
     * @param {string} effectType - Type of effect
     * @returns {Object} Effect object
     */
    getPooledEffect(effectType) {
        // Check if we have a pooled effect of this type
        if (this._effectPool.has(effectType) && this._effectPool.get(effectType).length > 0) {
            const effect = this._effectPool.get(effectType).pop();
            
            if (this.debugMode) {
                console.log('[HorrorAtmosphereEngine] Effect retrieved from pool:', effectType);
            }
            
            return effect;
        }

        // Create new effect
        const effect = {
            type: effectType,
            id: `${effectType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            active: false,
            element: null
        };

        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] New effect created:', effectType);
        }

        return effect;
    }

    /**
     * Return an effect to the pool for reuse
     * @param {Object} effect - Effect object to pool
     */
    returnEffectToPool(effect) {
        if (!effect || !effect.type) return;

        // Reset effect state
        effect.active = false;
        effect.element = null;

        // Add to pool
        if (!this._effectPool.has(effect.type)) {
            this._effectPool.set(effect.type, []);
        }

        const pool = this._effectPool.get(effect.type);
        
        // Limit pool size to prevent memory bloat
        const maxPoolSize = 5;
        if (pool.length < maxPoolSize) {
            pool.push(effect);
            
            if (this.debugMode) {
                console.log('[HorrorAtmosphereEngine] Effect returned to pool:', effect.type);
            }
        }
    }

    /**
     * Clean up inactive effects
     * Removes effects that have been active for too long
     */
    cleanupInactiveEffects() {
        const now = Date.now();
        const maxEffectDuration = 10000; // 10 seconds

        const toRemove = [];
        for (const effect of this._activeAnimations) {
            if (now - effect.startTime > maxEffectDuration) {
                toRemove.push(effect.id);
            }
        }

        toRemove.forEach(id => this.removeActiveAnimation(id));

        if (this.debugMode && toRemove.length > 0) {
            console.log('[HorrorAtmosphereEngine] Cleaned up inactive effects:', toRemove.length);
        }
    }

    /**
     * Get active animation count
     * @returns {number} Number of active animations
     */
    getActiveAnimationCount() {
        return this._activeAnimations.size;
    }

    /**
     * Task 9.3: Performance Monitoring
     * Start continuous performance monitoring
     * @param {number} interval - Check interval in milliseconds (default: 1000)
     */
    startPerformanceMonitoring(interval = 1000) {
        // Stop existing monitoring
        this.stopPerformanceMonitoring();

        // Start new monitoring interval
        this._performanceCheckInterval = setInterval(() => {
            this._checkPerformance();
        }, interval);

        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] Performance monitoring started');
        }
    }

    /**
     * Stop performance monitoring
     */
    stopPerformanceMonitoring() {
        if (this._performanceCheckInterval) {
            clearInterval(this._performanceCheckInterval);
            this._performanceCheckInterval = null;
        }
    }

    /**
     * Check current performance metrics
     * @private
     */
    _checkPerformance() {
        // Update FPS
        this._updateFPSCalculation();

        // Update memory usage
        this._updateMemoryUsage();

        // Detect performance degradation
        this._detectPerformanceDegradation();

        // Log metrics in debug mode
        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] Performance check:', {
                fps: this._performanceMonitor.fps.toFixed(1),
                memoryUsage: this._performanceMonitor.memoryUsage,
                qualityLevel: this._performanceMonitor.qualityLevel,
                degradationDetected: this._performanceMonitor.degradationDetected,
                activeAnimations: this._activeAnimations.size
            });
        }
    }

    /**
     * Update FPS calculation based on frame timings
     * @private
     */
    _updateFPSCalculation() {
        const now = Date.now();
        const timeSinceLastFrame = now - this._performanceMonitor.lastFrameTime;
        
        if (timeSinceLastFrame > 0) {
            const instantFPS = 1000 / timeSinceLastFrame;
            
            // Smooth FPS using exponential moving average
            const alpha = 0.1; // Smoothing factor
            this._performanceMonitor.fps = 
                (alpha * instantFPS) + ((1 - alpha) * this._performanceMonitor.fps);
        }

        this._performanceMonitor.lastFrameTime = now;
        this._performanceMonitor.frameCount++;

        // Store FPS history
        this._performanceMonitor.fpsHistory.push(this._performanceMonitor.fps);
        
        // Limit history size
        if (this._performanceMonitor.fpsHistory.length > 60) {
            this._performanceMonitor.fpsHistory.shift();
        }
    }

    /**
     * Update memory usage estimate
     * @private
     */
    _updateMemoryUsage() {
        if (typeof performance !== 'undefined' && performance.memory) {
            const usedMB = performance.memory.usedJSHeapSize / (1024 * 1024);
            this._performanceMonitor.memoryUsage = usedMB;
        } else {
            // Estimate based on active effects and state
            const estimatedMB = 
                (this._activeAnimations.size * 0.1) + 
                (this.stateHistory.length * 0.01) +
                (this._frameTimings.length * 0.001);
            this._performanceMonitor.memoryUsage = estimatedMB;
        }
    }

    /**
     * Detect performance degradation
     * @private
     */
    _detectPerformanceDegradation() {
        const fps = this._performanceMonitor.fps;
        const memoryUsage = this._performanceMonitor.memoryUsage;

        // Check FPS thresholds
        const fpsThresholds = {
            high: 50,    // Above 50 FPS = high quality
            medium: 30,  // 30-50 FPS = medium quality
            low: 20      // Below 20 FPS = low quality
        };

        // Check memory thresholds (in MB)
        const memoryThresholds = {
            high: 50,
            medium: 100,
            low: 150
        };

        let newQualityLevel = 'high';
        let degradationDetected = false;

        // Determine quality level based on FPS
        if (fps < fpsThresholds.low) {
            newQualityLevel = 'low';
            degradationDetected = true;
        } else if (fps < fpsThresholds.medium) {
            newQualityLevel = 'medium';
            degradationDetected = true;
        }

        // Also consider memory usage
        if (memoryUsage > memoryThresholds.low) {
            newQualityLevel = 'low';
            degradationDetected = true;
        } else if (memoryUsage > memoryThresholds.medium && newQualityLevel !== 'low') {
            newQualityLevel = 'medium';
            degradationDetected = true;
        }

        // Update quality level if changed
        if (newQualityLevel !== this._performanceMonitor.qualityLevel) {
            const previousLevel = this._performanceMonitor.qualityLevel;
            this._performanceMonitor.qualityLevel = newQualityLevel;
            this._performanceMonitor.degradationDetected = degradationDetected;

            // Apply automatic quality reduction
            this._applyQualityReduction(newQualityLevel);

            // Dispatch event
            this.dispatchEvent('horrorPerformanceChange', {
                previousLevel,
                newLevel: newQualityLevel,
                fps,
                memoryUsage,
                degradationDetected
            });

            if (this.debugMode) {
                console.warn('[HorrorAtmosphereEngine] Performance degradation detected:', {
                    previousLevel,
                    newLevel: newQualityLevel,
                    fps: fps.toFixed(1),
                    memoryUsage: memoryUsage.toFixed(2) + ' MB'
                });
            }
        }
    }

    /**
     * Apply automatic quality reduction based on performance
     * @param {string} qualityLevel - Quality level ('high', 'medium', 'low')
     * @private
     */
    _applyQualityReduction(qualityLevel) {
        switch (qualityLevel) {
            case 'low':
                // Aggressive optimization
                this._maxConcurrentAnimations = 3;
                this.updateThrottle = 200; // Slower updates
                
                // Clean up effects
                this.cleanupInactiveEffects();
                
                if (this.debugMode) {
                    console.log('[HorrorAtmosphereEngine] Applied LOW quality settings');
                }
                break;

            case 'medium':
                // Moderate optimization
                this._maxConcurrentAnimations = 6;
                this.updateThrottle = 150;
                
                if (this.debugMode) {
                    console.log('[HorrorAtmosphereEngine] Applied MEDIUM quality settings');
                }
                break;

            case 'high':
            default:
                // Full quality
                this._maxConcurrentAnimations = 10;
                this.updateThrottle = 100;
                
                if (this.debugMode) {
                    console.log('[HorrorAtmosphereEngine] Applied HIGH quality settings');
                }
                break;
        }
    }

    /**
     * Get current performance metrics
     * @returns {Object} Performance metrics
     */
    getPerformanceMetrics() {
        return {
            fps: this._performanceMonitor.fps,
            averageFPS: this._performanceMonitor.fpsHistory.length > 0
                ? this._performanceMonitor.fpsHistory.reduce((a, b) => a + b, 0) / this._performanceMonitor.fpsHistory.length
                : 60,
            memoryUsage: this._performanceMonitor.memoryUsage,
            qualityLevel: this._performanceMonitor.qualityLevel,
            degradationDetected: this._performanceMonitor.degradationDetected,
            activeAnimations: this._activeAnimations.size,
            frameTimings: this.getFrameTimingStats(),
            domUpdateQueueSize: this._domUpdateQueue.length
        };
    }

    /**
     * Reset performance metrics
     */
    resetPerformanceMetrics() {
        this._performanceMonitor = {
            fps: 60,
            fpsHistory: [],
            memoryUsage: 0,
            lastFrameTime: Date.now(),
            frameCount: 0,
            degradationDetected: false,
            qualityLevel: 'high'
        };
        this._frameTimings = [];

        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] Performance metrics reset');
        }
    }

    /**
     * Destroy engine and clean up
     */
    destroy() {
        // Stop performance monitoring
        if (this._performanceMonitorInterval) {
            clearInterval(this._performanceMonitorInterval);
            this._performanceMonitorInterval = null;
        }

        // Stop performance check interval (Task 9.3)
        this.stopPerformanceMonitoring();

        // Clear DOM update queue (Task 9.1)
        this._domUpdateQueue = [];
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
            this._updateTimeout = null;
        }

        // Clean up active animations (Task 9.2)
        for (const effect of this._activeAnimations) {
            if (effect.cleanupFn) {
                try {
                    effect.cleanupFn();
                } catch (error) {
                    console.error('[HorrorAtmosphereEngine] Cleanup error:', error);
                }
            }
        }
        this._activeAnimations.clear();
        this._effectPool.clear();

        // Remove trust score listener
        if (typeof window !== 'undefined' && this._trustScoreHandler) {
            window.removeEventListener('trustScoreUpdated', this._trustScoreHandler);
            this._trustScoreHandler = null;
        }

        // Remove test UI
        if (this._testUI) {
            this._testUI.remove();
            this._testUI = null;
        }

        this.removeAllEventListeners();
        this.state.initialized = false;
        this.stateHistory = [];
        
        if (this.debugMode) {
            console.log('[HorrorAtmosphereEngine] Engine destroyed');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HorrorAtmosphereEngine;
}
