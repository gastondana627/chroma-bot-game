/**
 * Story Progression Tracker
 * Tracks user progress through character storylines and detects trigger points for 3D cinematic moments
 */

class StoryProgressionTracker {
    constructor() {
        this.progressKey = 'data_bleed_story_progress';
        this.currentSession = this.loadProgress();
        this.triggerCallbacks = new Map();
        
        // Initialize progress tracking for all characters
        this.initializeProgress();
        
        // Bind methods to maintain context
        this.trackAreaVisit = this.trackAreaVisit.bind(this);
        this.checkTriggerConditions = this.checkTriggerConditions.bind(this);
    }

    /**
     * Initialize progress structure for all characters
     */
    initializeProgress() {
        const defaultProgress = {
            eli: {
                currentArea: 1,
                visitedAreas: [],
                completedTriggers: [],
                storyState: {
                    tournament_wins: 0,
                    peer_pressure_encounters: 0,
                    championship_progress: 0
                }
            },
            maya: {
                currentArea: 1,
                visitedAreas: [],
                completedTriggers: [],
                storyState: {
                    suspicious_matches: 0,
                    investigation_clues: 0,
                    confrontation_readiness: 0
                }
            },
            stanley: {
                currentArea: 1,
                visitedAreas: [],
                completedTriggers: [],
                storyState: {
                    identity_threats_detected: 0,
                    scams_prevented: 0,
                    community_leadership_level: 0
                }
            }
        };

        // Merge with existing progress, keeping user data
        Object.keys(defaultProgress).forEach(character => {
            if (!this.currentSession[character]) {
                this.currentSession[character] = defaultProgress[character];
            } else {
                // Ensure all required properties exist
                this.currentSession[character] = {
                    ...defaultProgress[character],
                    ...this.currentSession[character]
                };
            }
        });

        this.saveProgress();
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem(this.progressKey);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.warn('Failed to load story progress:', error);
            return {};
        }
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            localStorage.setItem(this.progressKey, JSON.stringify(this.currentSession));
        } catch (error) {
            console.warn('Failed to save story progress:', error);
        }
    }

    /**
     * Track when user visits a new area
     * @param {string} character - Character name (eli, maya, stanley)
     * @param {number} areaNumber - Area number (1-6)
     * @param {Object} areaData - Additional area-specific data
     */
    trackAreaVisit(character, areaNumber, areaData = {}) {
        if (!this.currentSession[character]) {
            console.warn(`Unknown character: ${character}`);
            return;
        }

        const progress = this.currentSession[character];
        
        // Update current area
        progress.currentArea = Math.max(progress.currentArea, areaNumber);
        
        // Add to visited areas if not already present
        if (!progress.visitedAreas.includes(areaNumber)) {
            progress.visitedAreas.push(areaNumber);
            progress.visitedAreas.sort((a, b) => a - b);
        }

        // Update area-specific data
        if (areaData.timestamp) {
            progress.lastVisit = areaData.timestamp;
        }

        this.saveProgress();
        
        // Check for trigger conditions after area visit
        this.checkTriggerConditions(character, areaNumber, 'area_visit', areaData);
        
        console.log(`Story Progress: ${character} visited area ${areaNumber}`, progress);
    }

    /**
     * Update story state for specific events
     * @param {string} character - Character name
     * @param {string} stateKey - State property to update
     * @param {*} value - New value or increment amount
     * @param {boolean} increment - Whether to increment existing value
     */
    updateStoryState(character, stateKey, value, increment = false) {
        if (!this.currentSession[character]) {
            console.warn(`Unknown character: ${character}`);
            return;
        }

        const storyState = this.currentSession[character].storyState;
        
        if (increment && typeof storyState[stateKey] === 'number') {
            storyState[stateKey] += value;
        } else {
            storyState[stateKey] = value;
        }

        this.saveProgress();
        
        // Check for trigger conditions after state update
        this.checkTriggerConditions(character, this.currentSession[character].currentArea, 'state_update', {
            stateKey,
            newValue: storyState[stateKey]
        });
    }

    /**
     * Check if trigger conditions are met and fire callbacks
     * @param {string} character - Character name
     * @param {number} areaNumber - Current area
     * @param {string} eventType - Type of event that triggered check
     * @param {Object} eventData - Additional event data
     */
    checkTriggerConditions(character, areaNumber, eventType, eventData = {}) {
        const progress = this.currentSession[character];
        const triggers = this.getTriggerConditions(character, areaNumber);

        triggers.forEach(trigger => {
            if (this.evaluateTriggerCondition(trigger, progress, eventType, eventData)) {
                // Check if this trigger has already been completed
                if (!progress.completedTriggers.includes(trigger.id)) {
                    progress.completedTriggers.push(trigger.id);
                    this.saveProgress();
                    
                    // Fire trigger callback
                    this.fireTrigger(trigger, character, areaNumber, eventData);
                }
            }
        });
    }

    /**
     * Get trigger conditions for a specific character and area
     * @param {string} character - Character name
     * @param {number} areaNumber - Area number
     * @returns {Array} Array of trigger conditions
     */
    getTriggerConditions(character, areaNumber) {
        // Use cinematic moments manager if available
        if (window.cinematicManager) {
            return window.cinematicManager.getTriggerConditions(character, areaNumber);
        }
        
        // Fallback: return empty array if cinematic manager not loaded
        return [];
    }

    /**
     * Evaluate if a trigger condition is met
     * @param {Object} trigger - Trigger configuration
     * @param {Object} progress - Character progress data
     * @param {string} eventType - Event type
     * @param {Object} eventData - Event data
     * @returns {boolean} Whether trigger condition is met
     */
    evaluateTriggerCondition(trigger, progress, eventType, eventData) {
        // Basic condition evaluation - will be enhanced with specific trigger logic
        if (trigger.requiredArea && progress.currentArea < trigger.requiredArea) {
            return false;
        }

        if (trigger.requiredVisits && progress.visitedAreas.length < trigger.requiredVisits) {
            return false;
        }

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
     * Fire a trigger and notify registered callbacks
     * @param {Object} trigger - Trigger configuration
     * @param {string} character - Character name
     * @param {number} areaNumber - Area number
     * @param {Object} eventData - Event data
     */
    fireTrigger(trigger, character, areaNumber, eventData) {
        console.log(`🎬 Story Trigger Fired: ${trigger.id} for ${character} in area ${areaNumber}`);
        
        // Notify registered callbacks
        const callbacks = this.triggerCallbacks.get(trigger.id) || [];
        callbacks.forEach(callback => {
            try {
                callback({
                    trigger,
                    character,
                    areaNumber,
                    eventData,
                    progress: this.currentSession[character]
                });
            } catch (error) {
                console.error('Error in trigger callback:', error);
            }
        });

        // Dispatch custom event for other systems to listen to
        window.dispatchEvent(new CustomEvent('storyTriggerFired', {
            detail: {
                triggerId: trigger.id,
                character,
                areaNumber,
                trigger,
                eventData
            }
        }));
    }

    /**
     * Register a callback for a specific trigger
     * @param {string} triggerId - Trigger ID
     * @param {Function} callback - Callback function
     */
    onTrigger(triggerId, callback) {
        if (!this.triggerCallbacks.has(triggerId)) {
            this.triggerCallbacks.set(triggerId, []);
        }
        this.triggerCallbacks.get(triggerId).push(callback);
    }

    /**
     * Remove a trigger callback
     * @param {string} triggerId - Trigger ID
     * @param {Function} callback - Callback function to remove
     */
    offTrigger(triggerId, callback) {
        const callbacks = this.triggerCallbacks.get(triggerId);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Get current progress for a character
     * @param {string} character - Character name
     * @returns {Object} Character progress data
     */
    getProgress(character) {
        return this.currentSession[character] || null;
    }

    /**
     * Get all progress data
     * @returns {Object} All progress data
     */
    getAllProgress() {
        return { ...this.currentSession };
    }

    /**
     * Reset progress for a character (for testing/debugging)
     * @param {string} character - Character name
     */
    resetProgress(character) {
        if (this.currentSession[character]) {
            delete this.currentSession[character];
            this.initializeProgress();
        }
    }

    /**
     * Auto-detect current character and area from page context
     * @returns {Object} Current context { character, area }
     */
    detectCurrentContext() {
        // Try to get character from body data attribute
        const character = document.body.dataset.character;
        
        // Try to detect area from URL or page title
        let area = 1;
        const url = window.location.pathname;
        const areaMatch = url.match(/area-(\d+)/);
        if (areaMatch) {
            area = parseInt(areaMatch[1]);
        }

        return { character, area };
    }

    /**
     * Initialize tracking for current page
     */
    initializePageTracking() {
        const context = this.detectCurrentContext();
        if (context.character && context.area) {
            this.trackAreaVisit(context.character, context.area, {
                timestamp: Date.now(),
                url: window.location.href
            });
        }
    }
}

// Create global instance
window.StoryProgressionTracker = StoryProgressionTracker;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.storyTracker) {
            window.storyTracker = new StoryProgressionTracker();
            window.storyTracker.initializePageTracking();
        }
    });
} else {
    if (!window.storyTracker) {
        window.storyTracker = new StoryProgressionTracker();
        window.storyTracker.initializePageTracking();
    }
}