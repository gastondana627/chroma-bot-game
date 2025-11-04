/**
 * UI Aesthetic Integration System
 * Implements Data_Bleed aesthetic integration with character-specific color schemes,
 * glassmorphism design patterns, and 3D spatial elements
 * Implements requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */

class UIAestheticIntegration {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        
        // Character-specific color schemes
        this.colorSchemes = {
            maya: {
                primary: '#FF1493',      // Hot pink
                secondary: '#00BFFF',    // Deep sky blue
                accent: '#00FFFF',       // Cyan
                warning: '#FF69B4',      // Hot pink
                background: 'radial-gradient(circle at center, #0a0a1a, #1a0a2a)',
                gradient: 'linear-gradient(135deg, #ff1493 0%, #00bfff 100%)',
                glow: 'rgba(255, 20, 147, 0.4)',
                highlight: 'rgba(255, 20, 147, 0.15)'
            },
            eli: {
                primary: '#FF4500',      // Orange red
                secondary: '#0066FF',    // Blue
                accent: '#00FFFF',       // Cyan
                warning: '#FFD700',      // Gold
                background: 'radial-gradient(circle at center, #0f0f0f, #220000)',
                gradient: 'linear-gradient(135deg, #ff4500 0%, #0066ff 100%)',
                glow: 'rgba(255, 69, 0, 0.4)',
                highlight: 'rgba(255, 69, 0, 0.15)'
            },
            stanley: {
                primary: '#32CD32',      // Lime green
                secondary: '#6B7280',    // Gray
                accent: '#9CA3AF',       // Light gray
                warning: '#8B0000',      // Dark red
                background: 'radial-gradient(circle at center, #050505, #1a1a1a)',
                gradient: 'linear-gradient(135deg, #32cd32 0%, #6b7280 100%)',
                glow: 'rgba(50, 205, 50, 0.4)',
                highlight: 'rgba(50, 205, 50, 0.15)'
            }
        };
        
        // Glassmorphism design patterns
        this.glassmorphismStyles = {
            light: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px'
            },
            medium: {
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px'
            },
            heavy: {
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '20px'
            }
        };
        
        // Layout patterns
        this.layoutPatterns = {
            pauseButton: { top: '20px', left: '20px' },
            chromaOrb: { bottom: '20px', right: '20px' },
            continueButton: { top: '20px', left: '50%', transform: 'translateX(-50%)' },
            characterHUD: { top: '20px', left: '200px' },
            chatBox: { bottom: '120px', right: '20px' },
            modeSelection: { center: true }
        };
        
        // Animation configurations
        this.animations = {
            fadeIn: { duration: '0.6s', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
            fadeOut: { duration: '0.6s', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
            scale: { duration: '0.3s', easing: 'ease' },
            glow: { duration: '2s', easing: 'ease-in-out' }
        };
        
        // Current context
        this.currentCharacter = null;
        this.current3DMode = false;
        this.appliedStyles = new Map();
        
        this.initialize = this.initialize.bind(this);
    }

    /**
     * Initialize the UI aesthetic integration system
     * @param {Object} options - Initialization options
     * @returns {Promise<boolean>} Success status
     */
    async initialize(options = {}) {
        if (this.initialized) {
            console.log('🎨 UI Aesthetic Integration already initialized');
            return true;
        }

        try {
            console.log('🎨 Initializing UI Aesthetic Integration...');
            
            // Inject base CSS styles
            this.injectBaseStyles();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Apply initial theme if character is already set
            const storedCharacter = sessionStorage.getItem('character');
            if (storedCharacter) {
                this.applyCharacterTheme(storedCharacter);
            }
            
            this.initialized = true;
            console.log('✅ UI Aesthetic Integration initialized successfully');
            
            // Dispatch initialization event
            this.dispatchEvent('uiAestheticIntegrationInitialized', {
                version: this.version,
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize UI Aesthetic Integration:', error);
            return false;
        }
    }

    /**
     * Inject base CSS styles for Data_Bleed aesthetic
     */
    injectBaseStyles() {
        if (document.getElementById('ui-aesthetic-styles')) {
            return; // Already injected
        }

        const styles = document.createElement('style');
        styles.id = 'ui-aesthetic-styles';
        styles.textContent = `
            /* Base Data_Bleed Aesthetic Styles */
            :root {
                --font-main: 'Inter', sans-serif;
                --font-mono: 'IBM Plex Mono', monospace;
                --animation-fast: 0.3s;
                --animation-medium: 0.6s;
                --animation-slow: 1s;
                --border-radius-small: 8px;
                --border-radius-medium: 12px;
                --border-radius-large: 20px;
                --shadow-glow: 0 0 20px;
                --shadow-elevation: 0 4px 15px;
            }

            /* Glassmorphism Base Classes */
            .glass-light {
                background: rgba(255, 255, 255, 0.1) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                border-radius: var(--border-radius-medium) !important;
            }

            .glass-medium {
                background: rgba(255, 255, 255, 0.15) !important;
                backdrop-filter: blur(15px) !important;
                border: 1px solid rgba(255, 255, 255, 0.3) !important;
                border-radius: var(--border-radius-large) !important;
            }

            .glass-heavy {
                background: rgba(255, 255, 255, 0.2) !important;
                backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(255, 255, 255, 0.4) !important;
                border-radius: var(--border-radius-large) !important;
            }

            /* 3D Spatial Element Support */
            .spatial-element {
                transform-style: preserve-3d !important;
                perspective: 1000px !important;
            }

            .spatial-depth-1 {
                transform: translateZ(10px) !important;
            }

            .spatial-depth-2 {
                transform: translateZ(20px) !important;
            }

            .spatial-depth-3 {
                transform: translateZ(30px) !important;
            }

            /* Animation Classes */
            .fade-in-aesthetic {
                animation: fadeInAesthetic var(--animation-medium) cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
                opacity: 0 !important;
            }

            .fade-out-aesthetic {
                animation: fadeOutAesthetic var(--animation-medium) cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
            }

            .scale-hover {
                transition: transform var(--animation-fast) ease !important;
            }

            .scale-hover:hover {
                transform: scale(1.05) !important;
            }

            .glow-pulse {
                animation: glowPulse 2s ease-in-out infinite !important;
            }

            /* Character Theme Classes */
            .theme-maya {
                --primary-color: #FF1493;
                --secondary-color: #00BFFF;
                --accent-color: #00FFFF;
                --warning-color: #FF69B4;
                --gradient: linear-gradient(135deg, #ff1493 0%, #00bfff 100%);
                --glow-color: rgba(255, 20, 147, 0.4);
                --highlight-color: rgba(255, 20, 147, 0.15);
            }

            .theme-eli {
                --primary-color: #FF4500;
                --secondary-color: #0066FF;
                --accent-color: #00FFFF;
                --warning-color: #FFD700;
                --gradient: linear-gradient(135deg, #ff4500 0%, #0066ff 100%);
                --glow-color: rgba(255, 69, 0, 0.4);
                --highlight-color: rgba(255, 69, 0, 0.15);
            }

            .theme-stanley {
                --primary-color: #32CD32;
                --secondary-color: #6B7280;
                --accent-color: #9CA3AF;
                --warning-color: #8B0000;
                --gradient: linear-gradient(135deg, #32cd32 0%, #6b7280 100%);
                --glow-color: rgba(50, 205, 50, 0.4);
                --highlight-color: rgba(50, 205, 50, 0.15);
            }

            /* Layout Pattern Classes */
            .layout-pause-button {
                position: fixed !important;
                top: 20px !important;
                left: 20px !important;
                z-index: 1000 !important;
            }

            .layout-chroma-orb {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                z-index: 2000 !important;
            }

            .layout-continue-button {
                position: fixed !important;
                top: 20px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                z-index: 1000 !important;
            }

            .layout-character-hud {
                position: fixed !important;
                top: 20px !important;
                left: 200px !important;
                z-index: 1700 !important;
            }

            .layout-chat-box {
                position: fixed !important;
                bottom: 120px !important;
                right: 20px !important;
                z-index: 2001 !important;
            }

            /* 3D Mode Adaptations */
            .ui-3d-mode .glass-light,
            .ui-3d-mode .glass-medium,
            .ui-3d-mode .glass-heavy {
                backdrop-filter: blur(25px) !important;
                background: rgba(255, 255, 255, 0.25) !important;
            }

            .ui-3d-mode .spatial-element {
                transform-style: preserve-3d !important;
                perspective: 1200px !important;
            }

            /* Keyframe Animations */
            @keyframes fadeInAesthetic {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeOutAesthetic {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                }
            }

            @keyframes glowPulse {
                0%, 100% {
                    box-shadow: var(--shadow-glow) var(--glow-color);
                }
                50% {
                    box-shadow: var(--shadow-glow) var(--glow-color), 0 0 30px var(--glow-color);
                }
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .layout-character-hud {
                    left: 20px !important;
                    top: 70px !important;
                    width: calc(100vw - 40px) !important;
                    max-width: 300px !important;
                }

                .layout-continue-button {
                    top: 10px !important;
                    padding: 12px 20px !important;
                    font-size: 14px !important;
                }

                .glass-light,
                .glass-medium,
                .glass-heavy {
                    backdrop-filter: blur(8px) !important;
                }
            }

            @media (max-width: 480px) {
                .layout-chroma-orb {
                    width: 60px !important;
                    height: 60px !important;
                    bottom: 15px !important;
                    right: 15px !important;
                }

                .layout-chat-box {
                    bottom: 90px !important;
                    right: 15px !important;
                    width: calc(100vw - 30px) !important;
                    max-width: 280px !important;
                }
            }
        `;
        
        document.head.appendChild(styles);
        console.log('✅ Base aesthetic styles injected');
    }

    /**
     * Set up event listeners for theme changes
     */
    setupEventListeners() {
        // Listen for character changes
        document.addEventListener('characterChanged', (event) => {
            this.applyCharacterTheme(event.detail.character);
        });

        // Listen for 3D mode changes
        document.addEventListener('3DModeChanged', (event) => {
            this.handle3DModeChange(event.detail.enabled, event.detail.character);
        });

        // Listen for mode selection events
        document.addEventListener('modeSelected', (event) => {
            this.applyModeAesthetics(event.detail.mode, event.detail.character);
        });

        console.log('🎨 Aesthetic event listeners set up');
    }

    /**
     * Apply character-specific theme
     * @param {string} character - Character name (maya, eli, stanley)
     */
    applyCharacterTheme(character) {
        if (!this.colorSchemes[character]) {
            console.warn(`⚠️ Unknown character theme: ${character}`);
            return;
        }

        this.currentCharacter = character;
        const scheme = this.colorSchemes[character];

        // Apply theme class to body
        document.body.classList.remove('theme-maya', 'theme-eli', 'theme-stanley');
        document.body.classList.add(`theme-${character}`);

        // Update CSS custom properties
        const root = document.documentElement;
        root.style.setProperty('--primary-color', scheme.primary);
        root.style.setProperty('--secondary-color', scheme.secondary);
        root.style.setProperty('--accent-color', scheme.accent);
        root.style.setProperty('--warning-color', scheme.warning);
        root.style.setProperty('--gradient', scheme.gradient);
        root.style.setProperty('--glow-color', scheme.glow);
        root.style.setProperty('--highlight-color', scheme.highlight);

        // Apply background gradient
        document.body.style.background = scheme.background;

        console.log(`🎨 Applied ${character} theme`);
        
        // Dispatch theme change event
        this.dispatchEvent('themeApplied', {
            character,
            scheme,
            timestamp: Date.now()
        });
    }

    /**
     * Apply glassmorphism effect to element
     * @param {HTMLElement} element - Target element
     * @param {string} intensity - Intensity level (light, medium, heavy)
     * @param {Object} options - Additional options
     */
    applyGlassmorphism(element, intensity = 'medium', options = {}) {
        if (!element) return false;

        const styles = this.glassmorphismStyles[intensity];
        if (!styles) {
            console.warn(`⚠️ Unknown glassmorphism intensity: ${intensity}`);
            return false;
        }

        // Remove existing glass classes
        element.classList.remove('glass-light', 'glass-medium', 'glass-heavy');
        
        // Apply new glass class
        element.classList.add(`glass-${intensity}`);

        // Apply custom styles if provided
        if (options.customBackground) {
            element.style.background = options.customBackground;
        }
        if (options.customBorder) {
            element.style.border = options.customBorder;
        }
        if (options.customRadius) {
            element.style.borderRadius = options.customRadius;
        }

        // Store applied style for cleanup
        this.appliedStyles.set(element, { type: 'glassmorphism', intensity, options });

        console.log(`🎨 Applied ${intensity} glassmorphism to element`);
        return true;
    }

    /**
     * Apply 3D spatial positioning to element
     * @param {HTMLElement} element - Target element
     * @param {number} depth - Depth level (1-3)
     * @param {Object} options - Additional 3D options
     */
    apply3DSpatialPositioning(element, depth = 1, options = {}) {
        if (!element) return false;

        // Remove existing spatial classes
        element.classList.remove('spatial-depth-1', 'spatial-depth-2', 'spatial-depth-3');
        
        // Apply spatial element base class
        element.classList.add('spatial-element');
        
        // Apply depth class
        if (depth >= 1 && depth <= 3) {
            element.classList.add(`spatial-depth-${depth}`);
        }

        // Apply custom transform if provided
        if (options.customTransform) {
            element.style.transform = options.customTransform;
        }

        // Apply perspective if provided
        if (options.perspective) {
            element.style.perspective = `${options.perspective}px`;
        }

        // Store applied style for cleanup
        this.appliedStyles.set(element, { type: '3d-spatial', depth, options });

        console.log(`🎨 Applied 3D spatial positioning (depth ${depth}) to element`);
        return true;
    }

    /**
     * Apply layout pattern to element
     * @param {HTMLElement} element - Target element
     * @param {string} pattern - Layout pattern name
     * @param {Object} customStyles - Custom style overrides
     */
    applyLayoutPattern(element, pattern, customStyles = {}) {
        if (!element || !this.layoutPatterns[pattern]) {
            console.warn(`⚠️ Unknown layout pattern: ${pattern}`);
            return false;
        }

        // Apply layout class
        element.classList.add(`layout-${pattern.replace(/([A-Z])/g, '-$1').toLowerCase()}`);

        // Apply custom styles
        Object.entries(customStyles).forEach(([property, value]) => {
            element.style[property] = value;
        });

        // Store applied style for cleanup
        this.appliedStyles.set(element, { type: 'layout', pattern, customStyles });

        console.log(`🎨 Applied ${pattern} layout pattern to element`);
        return true;
    }

    /**
     * Apply character-specific lighting effects
     * @param {HTMLElement} element - Target element
     * @param {string} character - Character name
     * @param {string} effect - Effect type (glow, pulse, highlight)
     */
    applyCharacterLighting(element, character = null, effect = 'glow') {
        if (!element) return false;

        const targetCharacter = character || this.currentCharacter;
        if (!targetCharacter || !this.colorSchemes[targetCharacter]) {
            console.warn(`⚠️ No character specified for lighting effect`);
            return false;
        }

        const scheme = this.colorSchemes[targetCharacter];

        switch (effect) {
            case 'glow':
                element.style.boxShadow = `0 0 20px ${scheme.glow}`;
                break;
            case 'pulse':
                element.classList.add('glow-pulse');
                break;
            case 'highlight':
                element.style.background = scheme.highlight;
                break;
            default:
                console.warn(`⚠️ Unknown lighting effect: ${effect}`);
                return false;
        }

        // Store applied style for cleanup
        this.appliedStyles.set(element, { type: 'lighting', character: targetCharacter, effect });

        console.log(`🎨 Applied ${effect} lighting effect for ${targetCharacter}`);
        return true;
    }

    /**
     * Handle 3D mode change
     * @param {boolean} enabled - Whether 3D mode is enabled
     * @param {string} character - Current character
     */
    handle3DModeChange(enabled, character) {
        this.current3DMode = enabled;

        if (enabled) {
            document.body.classList.add('ui-3d-mode');
            
            // Enhance glassmorphism for 3D mode
            document.querySelectorAll('.glass-light, .glass-medium, .glass-heavy').forEach(element => {
                element.style.backdropFilter = 'blur(25px)';
                element.style.background = 'rgba(255, 255, 255, 0.25)';
            });
            
            console.log('🎨 Enhanced aesthetics for 3D mode');
        } else {
            document.body.classList.remove('ui-3d-mode');
            
            // Restore normal glassmorphism
            document.querySelectorAll('.glass-light').forEach(element => {
                element.style.backdropFilter = 'blur(10px)';
                element.style.background = 'rgba(255, 255, 255, 0.1)';
            });
            document.querySelectorAll('.glass-medium').forEach(element => {
                element.style.backdropFilter = 'blur(15px)';
                element.style.background = 'rgba(255, 255, 255, 0.15)';
            });
            document.querySelectorAll('.glass-heavy').forEach(element => {
                element.style.backdropFilter = 'blur(20px)';
                element.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            
            console.log('🎨 Restored normal aesthetics from 3D mode');
        }
    }

    /**
     * Apply mode-specific aesthetics
     * @param {string} mode - Mode name (guardian, shadowObserver)
     * @param {string} character - Character name
     */
    applyModeAesthetics(mode, character) {
        const modeClass = `mode-${mode}`;
        
        // Remove existing mode classes
        document.body.classList.remove('mode-guardian', 'mode-shadowObserver');
        
        // Apply new mode class
        document.body.classList.add(modeClass);

        // Apply mode-specific color adjustments
        if (mode === 'shadowObserver') {
            // Darken the theme for shadow observer mode
            document.documentElement.style.setProperty('--mode-filter', 'brightness(0.8) contrast(1.2)');
        } else {
            // Normal brightness for guardian mode
            document.documentElement.style.setProperty('--mode-filter', 'brightness(1) contrast(1)');
        }

        console.log(`🎨 Applied ${mode} mode aesthetics for ${character}`);
    }

    /**
     * Animate element entrance
     * @param {HTMLElement} element - Target element
     * @param {string} animation - Animation type
     * @param {number} delay - Delay in milliseconds
     */
    animateEntrance(element, animation = 'fadeIn', delay = 0) {
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            setTimeout(() => {
                element.classList.add(`${animation.toLowerCase()}-aesthetic`);
                
                const duration = this.animations[animation]?.duration || '0.6s';
                const durationMs = parseFloat(duration) * 1000;
                
                setTimeout(() => {
                    element.classList.remove(`${animation.toLowerCase()}-aesthetic`);
                    resolve();
                }, durationMs);
            }, delay);
        });
    }

    /**
     * Animate element exit
     * @param {HTMLElement} element - Target element
     * @param {string} animation - Animation type
     */
    animateExit(element, animation = 'fadeOut') {
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            element.classList.add(`${animation.toLowerCase()}-aesthetic`);
            
            const duration = this.animations[animation]?.duration || '0.6s';
            const durationMs = parseFloat(duration) * 1000;
            
            setTimeout(() => {
                element.style.display = 'none';
                element.classList.remove(`${animation.toLowerCase()}-aesthetic`);
                resolve();
            }, durationMs);
        });
    }

    /**
     * Clean up applied styles from element
     * @param {HTMLElement} element - Target element
     */
    cleanupElement(element) {
        if (!element || !this.appliedStyles.has(element)) {
            return false;
        }

        const appliedStyle = this.appliedStyles.get(element);
        
        switch (appliedStyle.type) {
            case 'glassmorphism':
                element.classList.remove('glass-light', 'glass-medium', 'glass-heavy');
                break;
            case '3d-spatial':
                element.classList.remove('spatial-element', 'spatial-depth-1', 'spatial-depth-2', 'spatial-depth-3');
                break;
            case 'layout':
                element.classList.remove(`layout-${appliedStyle.pattern.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
                break;
            case 'lighting':
                element.classList.remove('glow-pulse');
                element.style.boxShadow = '';
                break;
        }

        this.appliedStyles.delete(element);
        console.log(`🧹 Cleaned up aesthetic styles from element`);
        return true;
    }

    /**
     * Get current theme information
     * @returns {Object} Current theme data
     */
    getCurrentTheme() {
        return {
            character: this.currentCharacter,
            colorScheme: this.currentCharacter ? this.colorSchemes[this.currentCharacter] : null,
            is3DMode: this.current3DMode,
            appliedStyles: this.appliedStyles.size
        };
    }

    /**
     * Dispatch custom event
     * @param {string} eventName - Event name
     * @param {Object} data - Event data
     */
    dispatchEvent(eventName, data) {
        window.dispatchEvent(new CustomEvent(`uiAesthetic${eventName}`, {
            detail: data
        }));
    }

    /**
     * Get system status
     * @returns {Object} System status
     */
    getStatus() {
        return {
            version: this.version,
            initialized: this.initialized,
            currentCharacter: this.currentCharacter,
            current3DMode: this.current3DMode,
            appliedStyles: this.appliedStyles.size,
            availableThemes: Object.keys(this.colorSchemes)
        };
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIAestheticIntegration };
}

// Make available globally
window.UIAestheticIntegration = UIAestheticIntegration;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.uiAestheticIntegration) {
            window.uiAestheticIntegration = new UIAestheticIntegration();
            await window.uiAestheticIntegration.initialize();
        }
    });
} else {
    if (!window.uiAestheticIntegration) {
        window.uiAestheticIntegration = new UIAestheticIntegration();
        window.uiAestheticIntegration.initialize();
    }
}