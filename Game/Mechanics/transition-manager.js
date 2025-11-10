/**
 * TransitionManager
 * 
 * Manages smooth transitions between horror intensity levels with different
 * transition types (fade, dramatic, relief) and queuing system.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

class TransitionManager {
    constructor() {
        this.transitionState = {
            inProgress: false,
            from: 0,
            to: 0,
            startTime: null,
            type: null
        };
        
        this.transitionQueue = [];
        this.isProcessingQueue = false;
        
        // Transition type thresholds
        this.DRAMATIC_THRESHOLD = 2; // Intensity jump of 2+ levels
        
        // Transition durations (ms)
        this.FADE_DURATION = 1000;
        this.DRAMATIC_DURATION = 500;
        this.RELIEF_DURATION = 1500;
        
        // Active transition elements
        this.activeTransitionElements = new Set();
    }
    
    /**
     * Determine the appropriate transition type based on intensity change
     * @param {number} fromIntensity - Starting intensity (0-4)
     * @param {number} toIntensity - Target intensity (0-4)
     * @returns {string} Transition type: 'fade', 'dramatic', 'relief', or 'threshold'
     */
    getTransitionType(fromIntensity, toIntensity) {
        const delta = toIntensity - fromIntensity;
        
        // No transition needed
        if (delta === 0) {
            return 'none';
        }
        
        // Dramatic transition for large intensity spikes
        if (delta >= this.DRAMATIC_THRESHOLD) {
            return 'dramatic';
        }
        
        // Relief transition for intensity decreases
        if (delta < 0) {
            return 'relief';
        }
        
        // Check for threshold crossing (-60, -30, 0, 20)
        if (this.isThresholdCrossing(fromIntensity, toIntensity)) {
            return 'threshold';
        }
        
        // Default fade transition
        return 'fade';
    }
    
    /**
     * Check if transition crosses a major threshold
     * @param {number} fromIntensity - Starting intensity
     * @param {number} toIntensity - Target intensity
     * @returns {boolean} True if crossing threshold
     */
    isThresholdCrossing(fromIntensity, toIntensity) {
        const thresholds = [0, 1, 2, 3, 4];
        
        for (const threshold of thresholds) {
            if ((fromIntensity < threshold && toIntensity >= threshold) ||
                (fromIntensity >= threshold && toIntensity < threshold)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Queue a transition for processing
     * @param {number} fromIntensity - Starting intensity
     * @param {number} toIntensity - Target intensity
     * @param {string} character - Character name
     * @param {Function} callback - Callback when transition completes
     */
    queueTransition(fromIntensity, toIntensity, character, callback) {
        const transitionType = this.getTransitionType(fromIntensity, toIntensity);
        
        if (transitionType === 'none') {
            if (callback) callback();
            return;
        }
        
        this.transitionQueue.push({
            from: fromIntensity,
            to: toIntensity,
            character: character,
            type: transitionType,
            callback: callback,
            timestamp: Date.now()
        });
        
        // Start processing queue if not already processing
        if (!this.isProcessingQueue) {
            this.processQueue();
        }
    }
    
    /**
     * Process queued transitions sequentially
     */
    async processQueue() {
        if (this.isProcessingQueue || this.transitionQueue.length === 0) {
            return;
        }
        
        this.isProcessingQueue = true;
        
        while (this.transitionQueue.length > 0) {
            const transition = this.transitionQueue.shift();
            
            try {
                await this.executeTransition(transition);
                
                if (transition.callback) {
                    transition.callback();
                }
            } catch (error) {
                console.error('Transition execution failed:', error);
            }
        }
        
        this.isProcessingQueue = false;
    }
    
    /**
     * Execute a single transition
     * @param {Object} transition - Transition configuration
     */
    async executeTransition(transition) {
        // Update transition state
        this.transitionState = {
            inProgress: true,
            from: transition.from,
            to: transition.to,
            startTime: Date.now(),
            type: transition.type
        };
        
        // Dispatch transition start event
        this.dispatchTransitionEvent('horrorTransitionStart', {
            from: transition.from,
            to: transition.to,
            type: transition.type,
            character: transition.character
        });
        
        // Execute transition based on type
        switch (transition.type) {
            case 'fade':
                await this.executeFadeTransition(transition);
                break;
            case 'dramatic':
                await this.executeDramaticTransition(transition);
                break;
            case 'relief':
                await this.executeReliefTransition(transition);
                break;
            case 'threshold':
                await this.executeThresholdTransition(transition);
                break;
        }
        
        // Clear transition state
        this.transitionState.inProgress = false;
        
        // Dispatch transition complete event
        this.dispatchTransitionEvent('horrorTransitionComplete', {
            from: transition.from,
            to: transition.to,
            type: transition.type,
            character: transition.character,
            duration: Date.now() - this.transitionState.startTime
        });
    }
    
    /**
     * Execute fade transition (placeholder for subtask 4.2)
     */
    async executeFadeTransition(transition) {
        // Will be implemented in subtask 4.2
        await this.fadeOutEffects(this.FADE_DURATION);
        await this.fadeInEffects(transition.to, transition.character, this.FADE_DURATION);
    }
    
    /**
     * Execute dramatic transition (placeholder for subtask 4.3)
     */
    async executeDramaticTransition(transition) {
        // Will be implemented in subtask 4.3
        await this.applyDramaticTransition(transition);
    }
    
    /**
     * Execute relief transition (placeholder for subtask 4.4)
     */
    async executeReliefTransition(transition) {
        // Will be implemented in subtask 4.4
        await this.applyReliefTransition(transition);
    }
    
    /**
     * Execute threshold transition (combines fade with special effect)
     */
    async executeThresholdTransition(transition) {
        await this.fadeOutEffects(this.FADE_DURATION / 2);
        
        // Add threshold visual indicator
        this.addThresholdEffect(transition.to);
        
        await this.fadeInEffects(transition.to, transition.character, this.FADE_DURATION / 2);
    }
    
    /**
     * Add visual indicator for threshold crossing
     */
    addThresholdEffect(intensity) {
        const body = document.body;
        body.classList.add('horror-threshold-crossing');
        
        setTimeout(() => {
            body.classList.remove('horror-threshold-crossing');
        }, 300);
    }
    
    /**
     * Fade out current horror effects
     * @param {number} duration - Fade duration in milliseconds
     * @returns {Promise} Resolves when fade completes
     */
    async fadeOutEffects(duration) {
        return new Promise((resolve) => {
            // Get all elements with horror effects
            const horrorElements = document.querySelectorAll(
                '.horror-effect, .glitch-active, [class*="horror-intensity-"]'
            );
            
            if (horrorElements.length === 0) {
                resolve();
                return;
            }
            
            // Track elements being transitioned
            horrorElements.forEach(element => {
                this.activeTransitionElements.add(element);
            });
            
            // Apply fade-out animation
            const startTime = Date.now();
            const startOpacities = new Map();
            
            // Store initial opacities
            horrorElements.forEach(element => {
                const computedStyle = window.getComputedStyle(element);
                const currentOpacity = parseFloat(computedStyle.opacity) || 1;
                startOpacities.set(element, currentOpacity);
            });
            
            // Animate opacity to 0
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease-out cubic easing
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                horrorElements.forEach(element => {
                    const startOpacity = startOpacities.get(element);
                    const newOpacity = startOpacity * (1 - easeProgress);
                    element.style.opacity = newOpacity;
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Hide elements and reset
                    horrorElements.forEach(element => {
                        element.style.opacity = '0';
                        element.style.visibility = 'hidden';
                        this.activeTransitionElements.delete(element);
                    });
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    /**
     * Fade in new horror effects
     * @param {number} intensity - Target horror intensity (0-4)
     * @param {string} character - Character name
     * @param {number} duration - Fade duration in milliseconds
     * @returns {Promise} Resolves when fade completes
     */
    async fadeInEffects(intensity, character, duration) {
        return new Promise((resolve) => {
            // Get elements that should have effects at this intensity
            const targetElements = this.getEffectElements(intensity, character);
            
            if (targetElements.length === 0) {
                resolve();
                return;
            }
            
            // Track elements being transitioned
            targetElements.forEach(element => {
                this.activeTransitionElements.add(element);
            });
            
            // Prepare elements for fade-in
            targetElements.forEach(element => {
                element.style.opacity = '0';
                element.style.visibility = 'visible';
                
                // Apply intensity class
                element.classList.remove(
                    'horror-intensity-0',
                    'horror-intensity-1',
                    'horror-intensity-2',
                    'horror-intensity-3',
                    'horror-intensity-4'
                );
                element.classList.add(`horror-intensity-${intensity}`);
            });
            
            // Animate opacity to 1
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease-in cubic easing
                const easeProgress = Math.pow(progress, 3);
                
                targetElements.forEach(element => {
                    element.style.opacity = easeProgress;
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Finalize elements
                    targetElements.forEach(element => {
                        element.style.opacity = '1';
                        this.activeTransitionElements.delete(element);
                    });
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    /**
     * Get elements that should have effects at given intensity
     * @param {number} intensity - Horror intensity level
     * @param {string} character - Character name
     * @returns {Array} Array of DOM elements
     */
    getEffectElements(intensity, character) {
        if (intensity === 0) {
            return [];
        }
        
        // Get character-specific target elements
        const selectors = this.getCharacterSelectors(character);
        const elements = [];
        
        selectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            elements.push(...Array.from(found));
        });
        
        return elements;
    }
    
    /**
     * Get character-specific element selectors
     * @param {string} character - Character name
     * @returns {Array} Array of CSS selectors
     */
    getCharacterSelectors(character) {
        const selectorMap = {
            'maya': [
                '.profile-image',
                '.chat-message',
                '.dating-app-ui',
                '.notification'
            ],
            'eli': [
                '.discord-message',
                '.game-overlay',
                '.avatar-image',
                '.stream-window'
            ],
            'stanley': [
                '.facebook-post',
                '.profile-photo',
                '.friend-request',
                '.message-thread'
            ]
        };
        
        return selectorMap[character] || ['.horror-effect'];
    }
    
    /**
     * Apply dramatic transition for intensity spikes
     * @param {Object} transition - Transition configuration
     * @returns {Promise} Resolves when transition completes
     */
    async applyDramaticTransition(transition) {
        // Fade out current effects quickly
        await this.fadeOutEffects(this.DRAMATIC_DURATION / 4);
        
        // Apply flash effect
        await this.applyFlashEffect();
        
        // Apply screen shake
        await this.applyScreenShake();
        
        // Trigger sound hook
        this.triggerTransitionSound('dramatic', transition.to);
        
        // Fade in new effects
        await this.fadeInEffects(
            transition.to,
            transition.character,
            this.DRAMATIC_DURATION / 2
        );
    }
    
    /**
     * Apply flash effect for dramatic transitions
     * @returns {Promise} Resolves when flash completes
     */
    async applyFlashEffect() {
        return new Promise((resolve) => {
            const flashOverlay = document.createElement('div');
            flashOverlay.className = 'horror-flash-overlay';
            flashOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(255, 255, 255, 0.9);
                z-index: 9999;
                pointer-events: none;
                opacity: 0;
            `;
            
            document.body.appendChild(flashOverlay);
            
            // Flash animation
            const duration = 200;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 0.5) {
                    // Flash in
                    flashOverlay.style.opacity = progress * 2;
                } else {
                    // Flash out
                    flashOverlay.style.opacity = 2 - (progress * 2);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(flashOverlay);
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    /**
     * Apply screen shake effect
     * @returns {Promise} Resolves when shake completes
     */
    async applyScreenShake() {
        return new Promise((resolve) => {
            const body = document.body;
            const originalTransform = body.style.transform;
            
            const duration = 300;
            const intensity = 10; // pixels
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    // Random shake with decay
                    const decay = 1 - progress;
                    const offsetX = (Math.random() - 0.5) * intensity * decay;
                    const offsetY = (Math.random() - 0.5) * intensity * decay;
                    
                    body.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                    requestAnimationFrame(animate);
                } else {
                    body.style.transform = originalTransform;
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    /**
     * Trigger transition sound hook
     * @param {string} type - Transition type
     * @param {number} intensity - Target intensity
     */
    triggerTransitionSound(type, intensity) {
        // Dispatch event for audio system to handle
        const event = new CustomEvent('horrorTransitionSound', {
            detail: {
                type: type,
                intensity: intensity,
                timestamp: Date.now()
            },
            bubbles: true
        });
        window.dispatchEvent(event);
    }
    
    /**
     * Apply relief transition for intensity decreases
     * @param {Object} transition - Transition configuration
     * @returns {Promise} Resolves when transition completes
     */
    async applyReliefTransition(transition) {
        // Apply calming visual effect
        await this.applyCalmingEffect();
        
        // Fade out current effects slowly
        await this.fadeOutEffects(this.RELIEF_DURATION / 2);
        
        // Smooth color restoration
        await this.applySmoothColorRestoration(transition.to);
        
        // Trigger relief sound hook
        this.triggerTransitionSound('relief', transition.to);
        
        // Fade in new (reduced) effects
        await this.fadeInEffects(
            transition.to,
            transition.character,
            this.RELIEF_DURATION / 2
        );
    }
    
    /**
     * Apply calming visual effect
     * @returns {Promise} Resolves when effect completes
     */
    async applyCalmingEffect() {
        return new Promise((resolve) => {
            const calmOverlay = document.createElement('div');
            calmOverlay.className = 'horror-calm-overlay';
            calmOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: radial-gradient(circle, rgba(135, 206, 235, 0.3) 0%, transparent 70%);
                z-index: 9998;
                pointer-events: none;
                opacity: 0;
            `;
            
            document.body.appendChild(calmOverlay);
            
            // Gentle fade in and out
            const duration = 800;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 0.3) {
                    // Fade in
                    calmOverlay.style.opacity = progress / 0.3;
                } else if (progress < 0.7) {
                    // Hold
                    calmOverlay.style.opacity = 1;
                } else {
                    // Fade out
                    calmOverlay.style.opacity = (1 - progress) / 0.3;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(calmOverlay);
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    /**
     * Apply smooth color restoration
     * @param {number} targetIntensity - Target intensity level
     * @returns {Promise} Resolves when restoration completes
     */
    async applySmoothColorRestoration(targetIntensity) {
        return new Promise((resolve) => {
            const horrorElements = document.querySelectorAll(
                '[class*="horror-intensity-"]'
            );
            
            if (horrorElements.length === 0) {
                resolve();
                return;
            }
            
            const duration = 700;
            const startTime = Date.now();
            
            // Store initial filter values
            const initialFilters = new Map();
            horrorElements.forEach(element => {
                const computedStyle = window.getComputedStyle(element);
                initialFilters.set(element, computedStyle.filter);
            });
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease-out quadratic easing for smooth restoration
                const easeProgress = 1 - Math.pow(1 - progress, 2);
                
                horrorElements.forEach(element => {
                    // Gradually reduce filter intensity
                    const currentFilter = initialFilters.get(element);
                    
                    if (currentFilter && currentFilter !== 'none') {
                        // Interpolate filter values toward normal
                        const filterReduction = easeProgress;
                        element.style.filter = this.interpolateFilter(
                            currentFilter,
                            'none',
                            filterReduction
                        );
                    }
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Clear inline filter styles
                    horrorElements.forEach(element => {
                        if (targetIntensity === 0) {
                            element.style.filter = '';
                        }
                    });
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    /**
     * Interpolate between two CSS filter values
     * @param {string} fromFilter - Starting filter
     * @param {string} toFilter - Target filter
     * @param {number} progress - Interpolation progress (0-1)
     * @returns {string} Interpolated filter value
     */
    interpolateFilter(fromFilter, toFilter, progress) {
        if (toFilter === 'none') {
            // Gradually reduce filter intensity
            const filterMatch = fromFilter.match(/(\w+)\(([^)]+)\)/g);
            
            if (!filterMatch) {
                return fromFilter;
            }
            
            const interpolated = filterMatch.map(filter => {
                const [func, value] = filter.match(/(\w+)\(([^)]+)\)/).slice(1);
                const numValue = parseFloat(value);
                
                if (isNaN(numValue)) {
                    return filter;
                }
                
                // Interpolate toward neutral value
                let neutralValue;
                switch (func) {
                    case 'saturate':
                    case 'brightness':
                    case 'contrast':
                        neutralValue = 1;
                        break;
                    case 'hue-rotate':
                    case 'blur':
                    case 'sepia':
                    case 'invert':
                        neutralValue = 0;
                        break;
                    default:
                        neutralValue = 0;
                }
                
                const interpolatedValue = numValue + (neutralValue - numValue) * progress;
                const unit = value.replace(/[\d.-]/g, '');
                
                return `${func}(${interpolatedValue}${unit})`;
            });
            
            return interpolated.join(' ');
        }
        
        return fromFilter;
    }
    
    /**
     * Dispatch transition event
     */
    dispatchTransitionEvent(eventName, data) {
        const event = new CustomEvent(eventName, {
            detail: data,
            bubbles: true
        });
        window.dispatchEvent(event);
    }
    
    /**
     * Get current transition state
     */
    getState() {
        return {
            ...this.transitionState,
            queueLength: this.transitionQueue.length,
            isProcessing: this.isProcessingQueue
        };
    }
    
    /**
     * Cancel all queued transitions
     */
    clearQueue() {
        this.transitionQueue = [];
    }
    
    /**
     * Check if transition is in progress
     */
    isTransitioning() {
        return this.transitionState.inProgress;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransitionManager;
}
