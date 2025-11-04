/**
 * Comprehensive UI Integration System
 * Orchestrates the UI aesthetic integration and responsive gaming interface
 * to provide a unified, cohesive user experience across all devices and contexts
 * Implements requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */

class ComprehensiveUIIntegration {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        
        // Component references
        this.aestheticIntegration = null;
        this.responsiveInterface = null;
        this.ui3DIntegration = null;
        
        // Current state
        this.currentCharacter = null;
        this.currentMode = null;
        this.is3DActive = false;
        this.currentArea = null;
        
        // UI element registry
        this.managedElements = new Map();
        this.elementConfigurations = new Map();
        
        // Integration settings
        this.settings = {
            autoApplyThemes: true,
            autoResponsive: true,
            auto3DIntegration: true,
            preserveUserPreferences: true,
            enableAnimations: true,
            enableAccessibility: true
        };
        
        // Bind methods
        this.initialize = this.initialize.bind(this);
        this.handleCharacterChange = this.handleCharacterChange.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handle3DModeChange = this.handle3DModeChange.bind(this);
    }

    /**
     * Initialize the comprehensive UI integration system
     * @param {Object} options - Initialization options
     * @returns {Promise<boolean>} Success status
     */
    async initialize(options = {}) {
        if (this.initialized) {
            console.log('🎨📱 Comprehensive UI Integration already initialized');
            return true;
        }

        try {
            console.log('🎨📱 Initializing Comprehensive UI Integration...');
            
            // Merge settings
            this.settings = { ...this.settings, ...options };
            
            // Wait for dependencies
            await this.waitForDependencies();
            
            // Initialize component systems
            await this.initializeComponents();
            
            // Set up cross-system event listeners
            this.setupCrossSystemEvents();
            
            // Apply initial state
            await this.applyInitialState();
            
            // Set up gaming-specific UI elements
            this.setupGamingUIElements();
            
            this.initialized = true;
            console.log('✅ Comprehensive UI Integration initialized successfully');
            
            // Dispatch initialization event
            this.dispatchEvent('comprehensiveUIInitialized', {
                version: this.version,
                settings: this.settings,
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Comprehensive UI Integration:', error);
            return false;
        }
    }

    /**
     * Wait for required dependencies
     * @returns {Promise<void>}
     */
    async waitForDependencies() {
        const maxWaitTime = 10000;
        const checkInterval = 100;
        let elapsed = 0;

        return new Promise((resolve, reject) => {
            const checkDependencies = () => {
                const hasAesthetic = window.UIAestheticIntegration || window.uiAestheticIntegration;
                const hasResponsive = window.ResponsiveGamingInterface || window.responsiveGamingInterface;
                const hasUI3D = window.UI3DIntegration;
                
                if (hasAesthetic && hasResponsive && hasUI3D) {
                    resolve();
                } else if (elapsed >= maxWaitTime) {
                    console.warn('⚠️ Some UI dependencies not loaded, proceeding with available components');
                    resolve();
                } else {
                    elapsed += checkInterval;
                    setTimeout(checkDependencies, checkInterval);
                }
            };
            checkDependencies();
        });
    }

    /**
     * Initialize component systems
     * @returns {Promise<void>}
     */
    async initializeComponents() {
        // Initialize UI Aesthetic Integration
        if (window.uiAestheticIntegration) {
            this.aestheticIntegration = window.uiAestheticIntegration;
        } else if (window.UIAestheticIntegration) {
            this.aestheticIntegration = new window.UIAestheticIntegration();
            await this.aestheticIntegration.initialize();
            window.uiAestheticIntegration = this.aestheticIntegration;
        }

        // Initialize Responsive Gaming Interface
        if (window.responsiveGamingInterface) {
            this.responsiveInterface = window.responsiveGamingInterface;
        } else if (window.ResponsiveGamingInterface) {
            this.responsiveInterface = new window.ResponsiveGamingInterface();
            await this.responsiveInterface.initialize();
            window.responsiveGamingInterface = this.responsiveInterface;
        }

        // Initialize UI 3D Integration
        if (window.ui3DIntegration) {
            this.ui3DIntegration = window.ui3DIntegration;
        } else if (window.UI3DIntegration) {
            this.ui3DIntegration = new window.UI3DIntegration();
            this.ui3DIntegration.initialize();
            window.ui3DIntegration = this.ui3DIntegration;
        }

        console.log('🎨📱 Component systems initialized');
    }

    /**
     * Set up cross-system event listeners
     */
    setupCrossSystemEvents() {
        // Character change events
        document.addEventListener('characterChanged', this.handleCharacterChange);
        
        // Mode change events
        document.addEventListener('modeSelected', this.handleModeChange);
        document.addEventListener('modeChanged', this.handleModeChange);
        
        // 3D mode events
        document.addEventListener('3DModeChanged', this.handle3DModeChange);
        document.addEventListener('character3DActivated', this.handle3DModeChange);
        
        // Story progression events
        document.addEventListener('storyTriggerFired', (event) => {
            this.handleStoryProgression(event.detail);
        });
        
        // Responsive events
        document.addEventListener('responsiveResize', (event) => {
            this.handleResponsiveChange(event.detail);
        });
        
        // Gaming mechanics events
        document.addEventListener('gamingMechanicActivated', (event) => {
            this.handleGamingMechanicActivation(event.detail);
        });
        
        console.log('🎨📱 Cross-system event listeners set up');
    }

    /**
     * Apply initial state based on current session
     * @returns {Promise<void>}
     */
    async applyInitialState() {
        // Get current character from session
        const storedCharacter = sessionStorage.getItem('character');
        if (storedCharacter) {
            await this.setCharacter(storedCharacter);
        }
        
        // Get current mode if available
        const storedMode = sessionStorage.getItem('currentMode');
        if (storedMode) {
            await this.setMode(storedMode);
        }
        
        // Check for 3D mode
        const is3DActive = sessionStorage.getItem('3DModeActive') === 'true';
        if (is3DActive) {
            await this.activate3DMode(storedCharacter);
        }
        
        console.log('🎨📱 Initial state applied');
    }

    /**
     * Set up gaming-specific UI elements
     */
    setupGamingUIElements() {
        // Register common gaming UI elements
        this.registerGamingElement('pause-button', {
            selector: '#pause-game-btn, .pause-button',
            responsive: true,
            aesthetic: true,
            layout: 'pauseButton',
            touchFriendly: true,
            accessibility: true
        });
        
        this.registerGamingElement('continue-button', {
            selector: '.continue-button',
            responsive: true,
            aesthetic: true,
            layout: 'continueButton',
            touchFriendly: true,
            accessibility: true
        });
        
        this.registerGamingElement('chroma-orb', {
            selector: '#video-container, .chroma-orb',
            responsive: true,
            aesthetic: true,
            layout: 'chromaOrb',
            touchFriendly: true,
            accessibility: true,
            special3D: true
        });
        
        this.registerGamingElement('chat-box', {
            selector: '#chat-box, .chat-box',
            responsive: true,
            aesthetic: true,
            layout: 'chatBox',
            touchFriendly: true,
            accessibility: true
        });
        
        this.registerGamingElement('character-hud', {
            selector: '#maya-hud, #eli-hud, #stanley-hud, .character-hud',
            responsive: true,
            aesthetic: true,
            layout: 'characterHUD',
            touchFriendly: false,
            accessibility: true
        });
        
        this.registerGamingElement('mode-selection', {
            selector: '.mode-selection-interface',
            responsive: true,
            aesthetic: true,
            layout: 'modeSelection',
            touchFriendly: true,
            accessibility: true,
            glassmorphism: 'heavy'
        });
        
        console.log('🎨📱 Gaming UI elements registered');
    }

    /**
     * Register a gaming UI element for comprehensive management
     * @param {string} elementId - Element identifier
     * @param {Object} config - Element configuration
     */
    registerGamingElement(elementId, config) {
        this.elementConfigurations.set(elementId, config);
        
        // Find and apply configuration to existing elements
        const elements = document.querySelectorAll(config.selector);
        elements.forEach(element => {
            this.applyElementConfiguration(element, config);
            this.managedElements.set(element, { id: elementId, config });
        });
    }

    /**
     * Apply configuration to a UI element
     * @param {HTMLElement} element - Target element
     * @param {Object} config - Configuration object
     */
    applyElementConfiguration(element, config) {
        if (!element) return;
        
        // Apply responsive behavior
        if (config.responsive && this.responsiveInterface) {
            this.responsiveInterface.makeElementResponsive(element, {
                touchFriendly: config.touchFriendly,
                observeResize: true,
                mobileClass: config.mobileClass,
                tabletClass: config.tabletClass,
                desktopClass: config.desktopClass
            });
        }
        
        // Apply aesthetic styling
        if (config.aesthetic && this.aestheticIntegration) {
            // Apply glassmorphism if specified
            if (config.glassmorphism) {
                this.aestheticIntegration.applyGlassmorphism(element, config.glassmorphism);
            }
            
            // Apply layout pattern if specified
            if (config.layout) {
                this.aestheticIntegration.applyLayoutPattern(element, config.layout);
            }
            
            // Apply character lighting if character is set
            if (this.currentCharacter) {
                this.aestheticIntegration.applyCharacterLighting(element, this.currentCharacter, 'glow');
            }
        }
        
        // Apply 3D spatial positioning if needed
        if (config.spatial3D && this.aestheticIntegration) {
            this.aestheticIntegration.apply3DSpatialPositioning(element, config.spatial3D);
        }
        
        // Apply accessibility features
        if (config.accessibility) {
            this.applyAccessibilityFeatures(element, config);
        }
        
        console.log(`🎨📱 Applied configuration to ${config.selector}`);
    }

    /**
     * Apply accessibility features to element
     * @param {HTMLElement} element - Target element
     * @param {Object} config - Configuration object
     */
    applyAccessibilityFeatures(element, config) {
        // Add ARIA labels if not present
        if (!element.getAttribute('aria-label') && config.ariaLabel) {
            element.setAttribute('aria-label', config.ariaLabel);
        }
        
        // Add role if not present
        if (!element.getAttribute('role') && config.role) {
            element.setAttribute('role', config.role);
        }
        
        // Make focusable if interactive
        if (config.touchFriendly && !element.getAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        // Add keyboard event handlers
        if (config.touchFriendly) {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        }
    }

    /**
     * Set current character and apply all related UI changes
     * @param {string} character - Character name
     * @returns {Promise<boolean>} Success status
     */
    async setCharacter(character) {
        if (this.currentCharacter === character) {
            return true;
        }
        
        this.currentCharacter = character;
        
        try {
            // Apply character theme through aesthetic integration
            if (this.aestheticIntegration && this.settings.autoApplyThemes) {
                this.aestheticIntegration.applyCharacterTheme(character);
            }
            
            // Update all managed elements with character-specific styling
            this.managedElements.forEach((elementData, element) => {
                if (elementData.config.aesthetic && this.aestheticIntegration) {
                    this.aestheticIntegration.applyCharacterLighting(element, character, 'glow');
                }
            });
            
            // Store character in session
            sessionStorage.setItem('character', character);
            
            console.log(`🎨📱 Character set to: ${character}`);
            
            // Dispatch character change event
            this.dispatchEvent('characterSet', {
                character,
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error(`❌ Failed to set character to ${character}:`, error);
            return false;
        }
    }

    /**
     * Set current mode and apply mode-specific UI changes
     * @param {string} mode - Mode name
     * @returns {Promise<boolean>} Success status
     */
    async setMode(mode) {
        if (this.currentMode === mode) {
            return true;
        }
        
        this.currentMode = mode;
        
        try {
            // Apply mode aesthetics
            if (this.aestheticIntegration && this.settings.autoApplyThemes) {
                this.aestheticIntegration.applyModeAesthetics(mode, this.currentCharacter);
            }
            
            // Store mode in session
            sessionStorage.setItem('currentMode', mode);
            
            console.log(`🎨📱 Mode set to: ${mode}`);
            
            // Dispatch mode change event
            this.dispatchEvent('modeSet', {
                mode,
                character: this.currentCharacter,
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error(`❌ Failed to set mode to ${mode}:`, error);
            return false;
        }
    }

    /**
     * Activate 3D mode with full UI integration
     * @param {string} character - Current character
     * @returns {Promise<boolean>} Success status
     */
    async activate3DMode(character) {
        if (this.is3DActive) {
            return true;
        }
        
        try {
            // Activate 3D mode in UI 3D integration
            if (this.ui3DIntegration && this.settings.auto3DIntegration) {
                await this.ui3DIntegration.enter3DMode(character);
            }
            
            // Apply 3D mode aesthetics
            if (this.aestheticIntegration) {
                this.aestheticIntegration.handle3DModeChange(true, character);
            }
            
            // Create mobile 3D controls if on mobile
            if (this.responsiveInterface && this.responsiveInterface.deviceInfo.isMobile) {
                this.responsiveInterface.createMobile3DControls(character);
            }
            
            // Update managed elements for 3D mode
            this.managedElements.forEach((elementData, element) => {
                if (elementData.config.special3D) {
                    element.classList.add('ui-3d-active');
                }
            });
            
            this.is3DActive = true;
            sessionStorage.setItem('3DModeActive', 'true');
            
            console.log(`🎨📱 3D mode activated for ${character}`);
            
            // Dispatch 3D activation event
            this.dispatchEvent('3DModeActivated', {
                character,
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error(`❌ Failed to activate 3D mode for ${character}:`, error);
            return false;
        }
    }

    /**
     * Deactivate 3D mode and restore normal UI
     * @returns {Promise<boolean>} Success status
     */
    async deactivate3DMode() {
        if (!this.is3DActive) {
            return true;
        }
        
        try {
            // Deactivate 3D mode in UI 3D integration
            if (this.ui3DIntegration) {
                await this.ui3DIntegration.exit3DMode();
            }
            
            // Restore normal aesthetics
            if (this.aestheticIntegration) {
                this.aestheticIntegration.handle3DModeChange(false, this.currentCharacter);
            }
            
            // Remove mobile 3D controls
            const mobileControls = document.getElementById('mobile-3d-controls');
            if (mobileControls) {
                mobileControls.remove();
            }
            
            // Update managed elements
            this.managedElements.forEach((elementData, element) => {
                element.classList.remove('ui-3d-active');
            });
            
            this.is3DActive = false;
            sessionStorage.removeItem('3DModeActive');
            
            console.log('🎨📱 3D mode deactivated');
            
            // Dispatch 3D deactivation event
            this.dispatchEvent('3DModeDeactivated', {
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error('❌ Failed to deactivate 3D mode:', error);
            return false;
        }
    }

    /**
     * Handle character change event
     * @param {CustomEvent} event - Character change event
     */
    async handleCharacterChange(event) {
        const character = event.detail.character || event.detail;
        if (typeof character === 'string') {
            await this.setCharacter(character);
        }
    }

    /**
     * Handle mode change event
     * @param {CustomEvent} event - Mode change event
     */
    async handleModeChange(event) {
        const mode = event.detail.mode;
        const character = event.detail.character;
        
        if (mode) {
            await this.setMode(mode);
        }
        
        if (character && character !== this.currentCharacter) {
            await this.setCharacter(character);
        }
    }

    /**
     * Handle 3D mode change event
     * @param {CustomEvent} event - 3D mode change event
     */
    async handle3DModeChange(event) {
        const enabled = event.detail.enabled !== undefined ? event.detail.enabled : true;
        const character = event.detail.character || this.currentCharacter;
        
        if (enabled) {
            await this.activate3DMode(character);
        } else {
            await this.deactivate3DMode();
        }
    }

    /**
     * Handle story progression event
     * @param {Object} progressionData - Story progression data
     */
    handleStoryProgression(progressionData) {
        if (progressionData.character && progressionData.character !== this.currentCharacter) {
            this.setCharacter(progressionData.character);
        }
        
        if (progressionData.areaNumber) {
            this.currentArea = progressionData.areaNumber;
        }
        
        // Apply area-specific UI adjustments if needed
        this.applyAreaSpecificUI(progressionData);
    }

    /**
     * Handle responsive change event
     * @param {Object} responsiveData - Responsive change data
     */
    handleResponsiveChange(responsiveData) {
        // Re-apply configurations to all managed elements
        this.managedElements.forEach((elementData, element) => {
            this.applyElementConfiguration(element, elementData.config);
        });
        
        console.log('🎨📱 Responsive changes applied to all managed elements');
    }

    /**
     * Handle gaming mechanic activation
     * @param {Object} mechanicData - Gaming mechanic data
     */
    handleGamingMechanicActivation(mechanicData) {
        // Apply mechanic-specific UI enhancements
        const mechanicType = mechanicData.type;
        
        switch (mechanicType) {
            case 'investigation':
                this.enhanceUIForInvestigation();
                break;
            case 'realtime':
                this.enhanceUIForRealTime();
                break;
            case 'puzzle':
                this.enhanceUIForPuzzle();
                break;
            case 'action':
                this.enhanceUIForAction();
                break;
        }
    }

    /**
     * Apply area-specific UI adjustments
     * @param {Object} progressionData - Story progression data
     */
    applyAreaSpecificUI(progressionData) {
        const { character, areaNumber } = progressionData;
        
        // Apply area-specific color adjustments
        if (this.aestheticIntegration) {
            const areaColorAdjustment = this.getAreaColorAdjustment(character, areaNumber);
            if (areaColorAdjustment) {
                document.documentElement.style.setProperty('--area-filter', areaColorAdjustment);
            }
        }
    }

    /**
     * Get area-specific color adjustment
     * @param {string} character - Character name
     * @param {number} areaNumber - Area number
     * @returns {string} CSS filter string
     */
    getAreaColorAdjustment(character, areaNumber) {
        const areaAdjustments = {
            maya: {
                1: 'hue-rotate(0deg)',
                2: 'hue-rotate(10deg)',
                3: 'hue-rotate(20deg)',
                4: 'hue-rotate(30deg)',
                5: 'hue-rotate(40deg)',
                6: 'hue-rotate(50deg)'
            },
            eli: {
                1: 'hue-rotate(0deg)',
                2: 'hue-rotate(-10deg)',
                3: 'hue-rotate(-20deg)',
                4: 'hue-rotate(-30deg)',
                5: 'hue-rotate(-40deg)',
                6: 'hue-rotate(-50deg)'
            },
            stanley: {
                1: 'hue-rotate(0deg)',
                2: 'hue-rotate(5deg)',
                3: 'hue-rotate(10deg)',
                4: 'hue-rotate(15deg)',
                5: 'hue-rotate(20deg)',
                6: 'hue-rotate(25deg)'
            }
        };
        
        return areaAdjustments[character]?.[areaNumber] || 'hue-rotate(0deg)';
    }

    /**
     * Enhance UI for investigation mechanics
     */
    enhanceUIForInvestigation() {
        document.body.classList.add('investigation-mode');
        
        // Apply investigation-specific styling
        if (this.aestheticIntegration) {
            document.documentElement.style.setProperty('--mechanic-filter', 'contrast(1.1) brightness(1.1)');
        }
    }

    /**
     * Enhance UI for real-time mechanics
     */
    enhanceUIForRealTime() {
        document.body.classList.add('realtime-mode');
        
        // Apply urgency styling
        if (this.aestheticIntegration) {
            document.documentElement.style.setProperty('--mechanic-filter', 'saturate(1.2) contrast(1.2)');
        }
    }

    /**
     * Enhance UI for puzzle mechanics
     */
    enhanceUIForPuzzle() {
        document.body.classList.add('puzzle-mode');
        
        // Apply focus styling
        if (this.aestheticIntegration) {
            document.documentElement.style.setProperty('--mechanic-filter', 'brightness(1.1)');
        }
    }

    /**
     * Enhance UI for action mechanics
     */
    enhanceUIForAction() {
        document.body.classList.add('action-mode');
        
        // Apply high-energy styling
        if (this.aestheticIntegration) {
            document.documentElement.style.setProperty('--mechanic-filter', 'saturate(1.3) contrast(1.3)');
        }
    }

    /**
     * Refresh all managed UI elements
     */
    refreshAllElements() {
        this.managedElements.forEach((elementData, element) => {
            this.applyElementConfiguration(element, elementData.config);
        });
        
        console.log('🎨📱 All managed elements refreshed');
    }

    /**
     * Add new element to management
     * @param {HTMLElement} element - Element to manage
     * @param {string} elementId - Element identifier
     * @param {Object} config - Element configuration
     */
    manageElement(element, elementId, config) {
        if (!element) return false;
        
        this.applyElementConfiguration(element, config);
        this.managedElements.set(element, { id: elementId, config });
        
        console.log(`🎨📱 Added element to management: ${elementId}`);
        return true;
    }

    /**
     * Remove element from management
     * @param {HTMLElement} element - Element to remove
     */
    unmanageElement(element) {
        if (!element || !this.managedElements.has(element)) {
            return false;
        }
        
        // Clean up applied styles
        if (this.aestheticIntegration) {
            this.aestheticIntegration.cleanupElement(element);
        }
        
        if (this.responsiveInterface) {
            this.responsiveInterface.removeResponsiveBehavior(element);
        }
        
        this.managedElements.delete(element);
        
        console.log('🎨📱 Removed element from management');
        return true;
    }

    /**
     * Dispatch custom event
     * @param {string} eventName - Event name
     * @param {Object} data - Event data
     */
    dispatchEvent(eventName, data) {
        window.dispatchEvent(new CustomEvent(`comprehensiveUI${eventName}`, {
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
            currentMode: this.currentMode,
            is3DActive: this.is3DActive,
            currentArea: this.currentArea,
            managedElements: this.managedElements.size,
            settings: this.settings,
            components: {
                aesthetic: !!this.aestheticIntegration,
                responsive: !!this.responsiveInterface,
                ui3D: !!this.ui3DIntegration
            }
        };
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('characterChanged', this.handleCharacterChange);
        document.removeEventListener('modeSelected', this.handleModeChange);
        document.removeEventListener('modeChanged', this.handleModeChange);
        document.removeEventListener('3DModeChanged', this.handle3DModeChange);
        
        // Clean up all managed elements
        this.managedElements.forEach((elementData, element) => {
            this.unmanageElement(element);
        });
        
        // Destroy component systems
        if (this.responsiveInterface && typeof this.responsiveInterface.destroy === 'function') {
            this.responsiveInterface.destroy();
        }
        
        this.initialized = false;
        console.log('🎨📱 Comprehensive UI Integration destroyed');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ComprehensiveUIIntegration };
}

// Make available globally
window.ComprehensiveUIIntegration = ComprehensiveUIIntegration;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.comprehensiveUIIntegration) {
            window.comprehensiveUIIntegration = new ComprehensiveUIIntegration();
            await window.comprehensiveUIIntegration.initialize();
        }
    });
} else {
    if (!window.comprehensiveUIIntegration) {
        window.comprehensiveUIIntegration = new ComprehensiveUIIntegration();
        window.comprehensiveUIIntegration.initialize();
    }
}