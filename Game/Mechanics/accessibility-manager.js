/**
 * AccessibilityManager
 * 
 * Manages accessibility settings for the Horror Atmosphere Engine.
 * Allows users to control horror intensity, disable flashing effects,
 * and enable reduced motion for safer gameplay.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

class AccessibilityManager {
    constructor() {
        // Default settings
        this.settings = {
            horrorIntensity: 'full',      // 'off', 'minimal', 'moderate', 'full'
            flashingEffects: true,         // true or false
            reducedMotion: false           // true or false
        };

        // Intensity multipliers
        this.intensityMultipliers = {
            off: 0,
            minimal: 0.3,
            moderate: 0.7,
            full: 1.0
        };

        // Load saved settings from localStorage
        this.loadSettings();

        // Check for system-level reduced motion preference
        this.checkSystemPreferences();

        // Event listeners for system preference changes
        this.setupSystemPreferenceListeners();
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('horrorAccessibilitySettings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                this.settings = { ...this.settings, ...parsed };
                console.log('[AccessibilityManager] Loaded settings:', this.settings);
            }
        } catch (error) {
            console.error('[AccessibilityManager] Error loading settings:', error);
        }
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('horrorAccessibilitySettings', JSON.stringify(this.settings));
            console.log('[AccessibilityManager] Settings saved');
        } catch (error) {
            console.error('[AccessibilityManager] Error saving settings:', error);
        }
    }

    /**
     * Check system-level accessibility preferences
     */
    checkSystemPreferences() {
        // Check for prefers-reduced-motion
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('[AccessibilityManager] System prefers reduced motion');
            this.settings.reducedMotion = true;
        }
    }

    /**
     * Setup listeners for system preference changes
     */
    setupSystemPreferenceListeners() {
        if (window.matchMedia) {
            const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            // Modern browsers
            if (motionQuery.addEventListener) {
                motionQuery.addEventListener('change', (e) => {
                    this.settings.reducedMotion = e.matches;
                    this.dispatchSettingsChangeEvent();
                });
            }
            // Older browsers
            else if (motionQuery.addListener) {
                motionQuery.addListener((e) => {
                    this.settings.reducedMotion = e.matches;
                    this.dispatchSettingsChangeEvent();
                });
            }
        }
    }

    /**
     * Validate settings object
     * @param {Object} settings - Settings to validate
     * @returns {boolean} - True if valid
     */
    validateSettings(settings) {
        // Validate horrorIntensity
        if (settings.horrorIntensity !== undefined) {
            const validIntensities = ['off', 'minimal', 'moderate', 'full'];
            if (!validIntensities.includes(settings.horrorIntensity)) {
                console.error('[AccessibilityManager] Invalid horrorIntensity:', settings.horrorIntensity);
                return false;
            }
        }

        // Validate flashingEffects
        if (settings.flashingEffects !== undefined && typeof settings.flashingEffects !== 'boolean') {
            console.error('[AccessibilityManager] Invalid flashingEffects:', settings.flashingEffects);
            return false;
        }

        // Validate reducedMotion
        if (settings.reducedMotion !== undefined && typeof settings.reducedMotion !== 'boolean') {
            console.error('[AccessibilityManager] Invalid reducedMotion:', settings.reducedMotion);
            return false;
        }

        return true;
    }

    /**
     * Update settings
     * @param {Object} newSettings - New settings to apply
     */
    updateSettings(newSettings) {
        if (!this.validateSettings(newSettings)) {
            console.error('[AccessibilityManager] Invalid settings provided');
            return;
        }

        // Update settings
        this.settings = { ...this.settings, ...newSettings };

        // Save to localStorage
        this.saveSettings();

        // Dispatch change event
        this.dispatchSettingsChangeEvent();

        console.log('[AccessibilityManager] Settings updated:', this.settings);
    }

    /**
     * Get current settings
     * @returns {Object} - Current settings
     */
    getSettings() {
        return { ...this.settings };
    }

    /**
     * Get intensity multiplier for current setting
     * @returns {number} - Multiplier value (0-1)
     */
    getIntensityMultiplier() {
        return this.intensityMultipliers[this.settings.horrorIntensity];
    }

    /**
     * Apply intensity multiplier to base intensity
     * @param {number} baseIntensity - Base horror intensity (0-4)
     * @returns {number} - Adjusted intensity
     */
    applyIntensityMultiplier(baseIntensity) {
        const multiplier = this.getIntensityMultiplier();
        const adjustedIntensity = baseIntensity * multiplier;
        
        console.log(`[AccessibilityManager] Intensity: ${baseIntensity} × ${multiplier} = ${adjustedIntensity}`);
        
        return adjustedIntensity;
    }

    /**
     * Check if flashing effects are enabled
     * @returns {boolean}
     */
    areFlashingEffectsEnabled() {
        return this.settings.flashingEffects;
    }

    /**
     * Check if reduced motion is enabled
     * @returns {boolean}
     */
    isReducedMotionEnabled() {
        return this.settings.reducedMotion;
    }

    /**
     * Dispatch settings change event
     */
    dispatchSettingsChangeEvent() {
        const event = new CustomEvent('accessibilitySettingsChanged', {
            detail: {
                settings: this.getSettings(),
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(event);
        console.log('[AccessibilityManager] Settings change event dispatched');
    }

    /**
     * Remove flashing animations from the page
     * Requirement 7.4: Disable flashing effects for photosensitivity
     */
    removeFlashingAnimations() {
        if (this.settings.flashingEffects) {
            return; // Flashing effects are enabled, don't remove
        }

        console.log('[AccessibilityManager] Removing flashing animations');

        // Find all elements with animations
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            // Get computed style
            const computedStyle = window.getComputedStyle(element);
            const animationName = computedStyle.animationName;
            
            if (animationName && animationName !== 'none') {
                // Check if animation is flashing (rapid changes)
                if (this.isFlashingAnimation(animationName, element)) {
                    console.log(`[AccessibilityManager] Removing flashing animation: ${animationName}`);
                    
                    // Replace with non-flashing alternative
                    this.replaceWithNonFlashingAlternative(element, animationName);
                }
            }
        });

        // Add warning for users
        this.addFlashingEffectWarning();
    }

    /**
     * Check if an animation is considered "flashing"
     * @param {string} animationName - Name of the animation
     * @param {HTMLElement} element - Element with the animation
     * @returns {boolean}
     */
    isFlashingAnimation(animationName, element) {
        // List of known flashing animation patterns
        const flashingPatterns = [
            'flicker',
            'flash',
            'strobe',
            'blink',
            'pulse-fast',
            'rapid'
        ];

        // Check if animation name matches flashing patterns
        const nameMatches = flashingPatterns.some(pattern => 
            animationName.toLowerCase().includes(pattern)
        );

        if (nameMatches) {
            return true;
        }

        // Check animation duration (< 0.5s is considered rapid)
        const computedStyle = window.getComputedStyle(element);
        const duration = parseFloat(computedStyle.animationDuration);
        
        if (duration > 0 && duration < 0.5) {
            return true;
        }

        return false;
    }

    /**
     * Replace flashing animation with non-flashing alternative
     * @param {HTMLElement} element - Element to modify
     * @param {string} animationName - Original animation name
     */
    replaceWithNonFlashingAlternative(element, animationName) {
        // Remove the flashing animation
        element.style.animation = 'none';
        
        // Add a class to mark it as accessibility-modified
        element.classList.add('accessibility-no-flash');
        
        // Apply a gentle alternative effect based on the original animation
        if (animationName.includes('flicker') || animationName.includes('flash')) {
            // Replace with slow fade
            element.style.animation = 'accessibility-gentle-fade 3s ease-in-out infinite';
        } else if (animationName.includes('pulse')) {
            // Replace with slow pulse
            element.style.animation = 'accessibility-gentle-pulse 4s ease-in-out infinite';
        } else {
            // Default: subtle opacity change
            element.style.animation = 'accessibility-gentle-fade 3s ease-in-out infinite';
        }
    }

    /**
     * Add warning message about flashing effects being disabled
     */
    addFlashingEffectWarning() {
        // Check if warning already exists
        if (document.getElementById('accessibility-flash-warning')) {
            return;
        }

        const warning = document.createElement('div');
        warning.id = 'accessibility-flash-warning';
        warning.className = 'accessibility-warning';
        warning.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 10000;
            max-width: 250px;
        `;
        warning.textContent = 'Flashing effects have been disabled for your safety.';
        
        document.body.appendChild(warning);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            warning.style.transition = 'opacity 0.5s';
            warning.style.opacity = '0';
            setTimeout(() => warning.remove(), 500);
        }, 5000);
    }

    /**
     * Simplify animations for reduced motion
     * Requirement 7.5: Respect prefers-reduced-motion and provide simpler alternatives
     */
    simplifyAnimations() {
        if (!this.settings.reducedMotion) {
            return; // Reduced motion is not enabled
        }

        console.log('[AccessibilityManager] Simplifying animations for reduced motion');

        // Find all elements with animations
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const animationName = computedStyle.animationName;
            const transitionProperty = computedStyle.transitionProperty;
            
            // Simplify animations
            if (animationName && animationName !== 'none') {
                if (this.isComplexAnimation(animationName, element)) {
                    console.log(`[AccessibilityManager] Simplifying animation: ${animationName}`);
                    this.replaceWithSimpleAlternative(element, animationName);
                }
            }

            // Simplify transitions
            if (transitionProperty && transitionProperty !== 'none') {
                this.simplifyTransition(element);
            }
        });

        // Add CSS class to body for global reduced motion styles
        document.body.classList.add('accessibility-reduced-motion');
    }

    /**
     * Check if an animation is considered "complex"
     * @param {string} animationName - Name of the animation
     * @param {HTMLElement} element - Element with the animation
     * @returns {boolean}
     */
    isComplexAnimation(animationName, element) {
        // List of complex animation patterns
        const complexPatterns = [
            'shake',
            'bounce',
            'spin',
            'rotate',
            'wobble',
            'swing',
            'morph',
            'distort',
            'tear',
            'glitch'
        ];

        // Check if animation name matches complex patterns
        const nameMatches = complexPatterns.some(pattern => 
            animationName.toLowerCase().includes(pattern)
        );

        if (nameMatches) {
            return true;
        }

        // Check for transform-based animations (often complex)
        const computedStyle = window.getComputedStyle(element);
        const transform = computedStyle.transform;
        
        if (transform && transform !== 'none') {
            return true;
        }

        return false;
    }

    /**
     * Replace complex animation with simple alternative
     * @param {HTMLElement} element - Element to modify
     * @param {string} animationName - Original animation name
     */
    replaceWithSimpleAlternative(element, animationName) {
        // Remove the complex animation
        element.style.animation = 'none';
        
        // Add a class to mark it as accessibility-modified
        element.classList.add('accessibility-reduced-motion');
        
        // Apply a simple alternative effect
        if (animationName.includes('shake') || animationName.includes('wobble')) {
            // Replace with subtle position shift
            element.style.animation = 'accessibility-subtle-shift 2s ease-in-out';
        } else if (animationName.includes('spin') || animationName.includes('rotate')) {
            // Replace with fade
            element.style.animation = 'accessibility-simple-fade 1s ease-in-out';
        } else if (animationName.includes('morph') || animationName.includes('distort')) {
            // Replace with opacity change
            element.style.animation = 'accessibility-opacity-change 1.5s ease-in-out';
        } else {
            // Default: simple fade
            element.style.animation = 'accessibility-simple-fade 1s ease-in-out';
        }
    }

    /**
     * Simplify transitions on an element
     * @param {HTMLElement} element - Element to modify
     */
    simplifyTransition(element) {
        const computedStyle = window.getComputedStyle(element);
        const duration = parseFloat(computedStyle.transitionDuration);
        
        // If transition is longer than 0.5s, reduce it
        if (duration > 0.5) {
            element.style.transitionDuration = '0.3s';
        }
        
        // Simplify timing function to linear
        element.style.transitionTimingFunction = 'linear';
    }

    /**
     * Apply all accessibility modifications to the page
     * This should be called when settings change or page loads
     */
    applyAccessibilityModifications() {
        console.log('[AccessibilityManager] Applying accessibility modifications');

        // Remove flashing animations if disabled
        if (!this.settings.flashingEffects) {
            this.removeFlashingAnimations();
        }

        // Simplify animations if reduced motion is enabled
        if (this.settings.reducedMotion) {
            this.simplifyAnimations();
        }

        // Inject accessibility CSS
        this.injectAccessibilityCSS();
    }

    /**
     * Inject CSS for accessibility alternatives
     */
    injectAccessibilityCSS() {
        // Check if CSS already injected
        if (document.getElementById('accessibility-animations-css')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'accessibility-animations-css';
        style.textContent = `
            /* Gentle fade for non-flashing alternative */
            @keyframes accessibility-gentle-fade {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.85; }
            }

            /* Gentle pulse for non-flashing alternative */
            @keyframes accessibility-gentle-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }

            /* Simple fade for reduced motion */
            @keyframes accessibility-simple-fade {
                0% { opacity: 0.9; }
                100% { opacity: 1; }
            }

            /* Subtle shift for reduced motion */
            @keyframes accessibility-subtle-shift {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(2px); }
            }

            /* Opacity change for reduced motion */
            @keyframes accessibility-opacity-change {
                0% { opacity: 0.95; }
                100% { opacity: 1; }
            }

            /* Global reduced motion styles */
            .accessibility-reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }

            /* Respect system preference */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('[AccessibilityManager] Accessibility CSS injected');
    }

    /**
     * Get status for debugging
     * @returns {Object}
     */
    getStatus() {
        return {
            settings: this.getSettings(),
            intensityMultiplier: this.getIntensityMultiplier(),
            systemReducedMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
}
