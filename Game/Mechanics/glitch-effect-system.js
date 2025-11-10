/**
 * Glitch Effect System
 * 
 * Manages character-specific visual corruption effects based on horror intensity.
 * Applies glitches with appropriate frequency and duration for each intensity level.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

class GlitchEffectSystem {
    /**
     * Initialize the Glitch Effect System
     * @param {string} character - Character name ('maya', 'eli', 'stanley')
     */
    constructor(character = 'maya') {
        this.character = character;
        this.activeGlitches = new Map();
        this.glitchTimers = new Map();
        this.currentIntensity = 0;
        
        // Initialize glitch profiles for all characters
        this.initializeGlitchProfiles();
        
        // Load character-specific profile
        this.loadCharacterProfile(character);
    }

    /**
     * Initialize glitch profiles for all characters
     * Defines which glitch effects are available at each intensity level
     */
    initializeGlitchProfiles() {
        this.glitchProfiles = {
            'maya': {
                0: [],
                1: ['subtle-flicker', 'text-double'],
                2: ['face-morph', 'color-shift', 'ui-drift'],
                3: ['reality-tear', 'deep-glitch', 'photo-corruption'],
                4: ['nightmare-mode', 'face-distortion', 'reality-collapse']
            },
            'eli': {
                0: [],
                1: ['pixel-shimmer', 'neon-flicker'],
                2: ['discord-corruption', 'avatar-glitch', 'chat-distortion'],
                3: ['stream-tear', 'game-corruption', 'overlay-break'],
                4: ['digital-nightmare', 'pixel-explosion', 'reality-fragment']
            },
            'stanley': {
                0: [],
                1: ['crt-flicker', 'scan-line'],
                2: ['facebook-corruption', 'photo-distortion', 'post-glitch'],
                3: ['analog-tear', 'static-overlay', 'memory-corruption'],
                4: ['desktop-nightmare', 'system-collapse', 'reality-error']
            }
        };

        // Frequency table: how often glitches occur (in milliseconds)
        // Requirement 3.2, 3.3, 3.4, 3.5
        this.frequencies = {
            0: 0,       // Never
            1: 15000,   // Every 15 seconds
            2: 8000,    // Every 8 seconds
            3: 3000,    // Every 3 seconds
            4: 1000     // Every second
        };

        // Duration table: how long glitches last (in milliseconds)
        // Requirement 3.2, 3.3, 3.4, 3.5
        this.durations = {
            0: 0,       // No duration
            1: 200,     // 0.2 seconds
            2: 500,     // 0.5 seconds
            3: 1000,    // 1 second
            4: 2000     // 2 seconds
        };
    }

    /**
     * Load character-specific glitch profile
     * @param {string} character - Character name
     */
    loadCharacterProfile(character) {
        if (!this.glitchProfiles[character]) {
            console.warn(`Unknown character: ${character}, defaulting to maya`);
            character = 'maya';
        }
        
        this.character = character;
        this.currentProfile = this.glitchProfiles[character];
    }

    /**
     * Calculate glitch frequency based on intensity
     * @param {number} intensity - Horror intensity level (0-4)
     * @returns {number} Frequency in milliseconds
     * Requirement 3.2, 3.3, 3.4, 3.5
     */
    calculateGlitchFrequency(intensity) {
        const clampedIntensity = Math.max(0, Math.min(4, Math.floor(intensity)));
        return this.frequencies[clampedIntensity];
    }

    /**
     * Calculate glitch duration based on intensity
     * @param {number} intensity - Horror intensity level (0-4)
     * @returns {number} Duration in milliseconds
     * Requirement 3.2, 3.3, 3.4, 3.5
     */
    calculateGlitchDuration(intensity) {
        const clampedIntensity = Math.max(0, Math.min(4, Math.floor(intensity)));
        return this.durations[clampedIntensity];
    }

    /**
     * Activate a specific glitch effect
     * @param {string} glitchType - Type of glitch to activate
     * @param {number} intensity - Horror intensity level
     * @returns {boolean} Success status
     * Requirement 3.6, 3.7
     */
    activateGlitch(glitchType, intensity) {
        try {
            // Check if glitch is already active
            if (this.activeGlitches.has(glitchType)) {
                return false;
            }

            const duration = this.calculateGlitchDuration(intensity);
            
            // Create glitch state object
            const glitchState = {
                type: glitchType,
                intensity: intensity,
                duration: duration,
                startTime: Date.now(),
                active: true
            };

            // Add to active glitches
            this.activeGlitches.set(glitchType, glitchState);

            // Apply glitch to DOM
            this.applyGlitchToDOM(glitchType, intensity);

            // Schedule glitch cleanup
            const cleanupTimer = setTimeout(() => {
                this.deactivateGlitch(glitchType);
            }, duration);

            this.glitchTimers.set(glitchType, cleanupTimer);

            // Dispatch glitch triggered event
            this.dispatchGlitchEvent('glitchTriggered', {
                type: glitchType,
                intensity: intensity,
                duration: duration
            });

            return true;
        } catch (error) {
            console.error(`Failed to activate glitch ${glitchType}:`, error);
            return false;
        }
    }

    /**
     * Deactivate a specific glitch effect
     * @param {string} glitchType - Type of glitch to deactivate
     * Requirement 3.7
     */
    deactivateGlitch(glitchType) {
        try {
            // Remove from active glitches
            this.activeGlitches.delete(glitchType);

            // Clear timer
            if (this.glitchTimers.has(glitchType)) {
                clearTimeout(this.glitchTimers.get(glitchType));
                this.glitchTimers.delete(glitchType);
            }

            // Remove glitch from DOM
            this.removeGlitchFromDOM(glitchType);

            // Dispatch glitch completed event
            this.dispatchGlitchEvent('glitchCompleted', {
                type: glitchType
            });
        } catch (error) {
            console.error(`Failed to deactivate glitch ${glitchType}:`, error);
        }
    }

    /**
     * Apply glitch effect to DOM elements
     * @param {string} glitchType - Type of glitch to apply
     * @param {number} intensity - Horror intensity level
     * Requirement 3.6, 3.7
     */
    applyGlitchToDOM(glitchType, intensity) {
        // Get target elements based on character
        const targetElements = this.getTargetElements(glitchType);
        
        if (targetElements.length === 0) {
            console.warn(`No target elements found for glitch: ${glitchType}`);
            return;
        }

        // Apply glitch CSS class to each target element
        targetElements.forEach(element => {
            // Add base glitch class
            element.classList.add('horror-glitch');
            
            // Add specific glitch type class
            element.classList.add(`glitch-${glitchType}`);
            
            // Add intensity class
            element.classList.add(`glitch-intensity-${Math.floor(intensity)}`);
            
            // Store original state for restoration
            if (!element.dataset.originalState) {
                element.dataset.originalState = element.className;
            }
        });
    }

    /**
     * Remove glitch effect from DOM elements
     * @param {string} glitchType - Type of glitch to remove
     * Requirement 3.7
     */
    removeGlitchFromDOM(glitchType) {
        // Get all elements with this glitch type
        const glitchedElements = document.querySelectorAll(`.glitch-${glitchType}`);
        
        glitchedElements.forEach(element => {
            // Remove glitch classes
            element.classList.remove('horror-glitch');
            element.classList.remove(`glitch-${glitchType}`);
            
            // Remove intensity classes
            for (let i = 0; i <= 4; i++) {
                element.classList.remove(`glitch-intensity-${i}`);
            }
            
            // If no other glitches are active, restore original state
            const hasOtherGlitches = Array.from(element.classList).some(
                cls => cls.startsWith('glitch-') && cls !== `glitch-${glitchType}`
            );
            
            if (!hasOtherGlitches && element.dataset.originalState) {
                delete element.dataset.originalState;
            }
        });
    }

    /**
     * Get target elements for a specific glitch type
     * @param {string} glitchType - Type of glitch
     * @returns {Array} Array of DOM elements
     */
    getTargetElements(glitchType) {
        // Character-specific target selectors
        const targetSelectors = {
            'maya': [
                '.profile-image',
                '.chat-message',
                '.dating-app-ui',
                '.notification',
                '.message-bubble',
                '.user-avatar'
            ],
            'eli': [
                '.discord-message',
                '.game-overlay',
                '.avatar-image',
                '.stream-window',
                '.chat-window',
                '.game-ui'
            ],
            'stanley': [
                '.facebook-post',
                '.profile-photo',
                '.friend-request',
                '.message-thread',
                '.news-feed',
                '.timeline-post'
            ]
        };

        const selectors = targetSelectors[this.character] || targetSelectors['maya'];
        const elements = [];

        // Collect all matching elements
        selectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            elements.push(...Array.from(found));
        });

        // If no specific elements found, target common UI elements
        if (elements.length === 0) {
            const fallbackSelectors = [
                '.chat-container',
                '.message-container',
                '.ui-panel',
                'main',
                '.content'
            ];
            
            fallbackSelectors.forEach(selector => {
                const found = document.querySelectorAll(selector);
                elements.push(...Array.from(found));
            });
        }

        return elements;
    }

    /**
     * Update glitch effects based on new intensity
     * @param {number} intensity - New horror intensity level
     */
    updateIntensity(intensity) {
        const oldIntensity = this.currentIntensity;
        this.currentIntensity = intensity;

        // Stop all current glitches
        this.stopAllGlitches();

        // Start new glitches if intensity > 0
        if (intensity > 0) {
            this.startGlitchSchedule(intensity);
        }
    }

    /**
     * Start glitch scheduling for current intensity
     * @param {number} intensity - Horror intensity level
     */
    startGlitchSchedule(intensity) {
        const frequency = this.calculateGlitchFrequency(intensity);
        
        if (frequency === 0) {
            return;
        }

        // Get available glitches for this intensity
        const availableGlitches = this.getGlitchesForIntensity(intensity);
        
        if (availableGlitches.length === 0) {
            return;
        }

        // Schedule recurring glitch activation
        const scheduleNext = () => {
            // Pick random glitch from available options
            const randomGlitch = availableGlitches[
                Math.floor(Math.random() * availableGlitches.length)
            ];
            
            // Activate the glitch
            this.activateGlitch(randomGlitch, intensity);
            
            // Schedule next glitch
            this.scheduleTimer = setTimeout(scheduleNext, frequency);
        };

        // Start the schedule
        scheduleNext();
    }

    /**
     * Get available glitches for a specific intensity level
     * @param {number} intensity - Horror intensity level
     * @returns {Array} Array of glitch type strings
     */
    getGlitchesForIntensity(intensity) {
        const level = Math.floor(intensity);
        const glitches = [];

        // Include glitches from current level and all lower levels
        for (let i = 1; i <= level && i <= 4; i++) {
            if (this.currentProfile[i]) {
                glitches.push(...this.currentProfile[i]);
            }
        }

        return glitches;
    }

    /**
     * Stop all active glitches
     */
    stopAllGlitches() {
        // Clear schedule timer
        if (this.scheduleTimer) {
            clearTimeout(this.scheduleTimer);
            this.scheduleTimer = null;
        }

        // Deactivate all active glitches
        const activeGlitchTypes = Array.from(this.activeGlitches.keys());
        activeGlitchTypes.forEach(glitchType => {
            this.deactivateGlitch(glitchType);
        });
    }

    /**
     * Dispatch glitch-related events
     * @param {string} eventType - Type of event
     * @param {Object} data - Event data
     */
    dispatchGlitchEvent(eventType, data) {
        const event = new CustomEvent(eventType, {
            detail: {
                character: this.character,
                timestamp: Date.now(),
                ...data
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Get current glitch system status
     * @returns {Object} Status object
     */
    getStatus() {
        return {
            character: this.character,
            intensity: this.currentIntensity,
            activeGlitches: Array.from(this.activeGlitches.values()),
            glitchCount: this.activeGlitches.size,
            frequency: this.calculateGlitchFrequency(this.currentIntensity),
            duration: this.calculateGlitchDuration(this.currentIntensity)
        };
    }

    /**
     * Clean up and destroy the glitch system
     */
    destroy() {
        this.stopAllGlitches();
        this.activeGlitches.clear();
        this.glitchTimers.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlitchEffectSystem;
}
