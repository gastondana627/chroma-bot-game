/**
 * Interactive Object Manager
 * Manages interactive objects with mode-appropriate indicators and click handling
 * Implements requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6 for interactive object system
 */

class InteractiveObjectManager {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        
        // Core components
        this.modeManager = null;
        this.trustScoreManager = new TrustScoreManager();
        this.highlightSystem = new ObjectHighlightSystem();
        this.feedbackSystem = new InteractionFeedbackSystem();
        
        // Interactive objects registry
        this.registeredObjects = new Map();
        this.activeObjects = new Map();
        
        // Current context
        this.currentCharacter = null;
        this.currentArea = null;
        this.currentMode = null;
        
        // Event handlers
        this.clickHandlers = new Map();
        this.hoverHandlers = new Map();
        
        // Configuration
        this.config = {
            enableHighlighting: true,
            enableAudioFeedback: true,
            enableVisualFeedback: true,
            highlightIntensity: 0.8,
            feedbackDuration: 1000
        };
        
        // Bind methods
        this.initialize = this.initialize.bind(this);
        this.handleObjectClick = this.handleObjectClick.bind(this);
        this.handleObjectHover = this.handleObjectHover.bind(this);
    }

    /**
     * Initialize the interactive object manager
     * @param {Object} options - Initialization options
     * @returns {Promise<boolean>} Success status
     */
    async initialize(options = {}) {
        if (this.initialized) {
            console.log('🎯 Interactive Object Manager already initialized');
            return true;
        }

        try {
            console.log('🎯 Initializing Interactive Object Manager...');
            
            // Merge configuration
            this.config = { ...this.config, ...options };
            
            // Wait for dependencies
            await this.waitForDependencies();
            
            // Initialize components
            await this.initializeComponents();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Register default object types
            this.registerDefaultObjectTypes();
            
            this.initialized = true;
            console.log('✅ Interactive Object Manager initialized successfully');
            
            // Dispatch initialization event
            this.dispatchEvent('interactiveObjectManagerInitialized', {
                version: this.version,
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Interactive Object Manager:', error);
            return false;
        }
    }

    /**
     * Wait for required dependencies
     * @returns {Promise<void>}
     */
    async waitForDependencies() {
        const maxWaitTime = 5000;
        const checkInterval = 100;
        let elapsed = 0;

        return new Promise((resolve, reject) => {
            const checkDependencies = () => {
                if (window.ModeManager) {
                    resolve();
                } else if (elapsed >= maxWaitTime) {
                    reject(new Error('ModeManager dependency not loaded within timeout'));
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
    async initializeComponents() {
        // Get mode manager instance
        if (window.modeManager) {
            this.modeManager = window.modeManager;
        } else {
            this.modeManager = new window.ModeManager();
            window.modeManager = this.modeManager;
        }

        // Initialize trust score manager
        await this.trustScoreManager.initialize();
        
        // Initialize highlight system
        await this.highlightSystem.initialize(this.config);
        
        // Initialize feedback system
        await this.feedbackSystem.initialize(this.config);
        
        console.log('🎯 Interactive object components initialized');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for mode changes
        document.addEventListener('modeChanged', (event) => {
            this.handleModeChange(event.detail);
        });

        // Listen for character/area changes
        document.addEventListener('storyTriggerFired', (event) => {
            this.handleContextChange(event.detail);
        });

        // Listen for trust score updates
        document.addEventListener('trustScoreUpdated', (event) => {
            this.handleTrustScoreUpdate(event.detail);
        });

        console.log('🎯 Interactive object event listeners set up');
    }

    /**
     * Register default object types for each character
     */
    registerDefaultObjectTypes() {
        // Eli's interactive objects
        this.registerObjectType('eli_gaming_setup', {
            character: 'eli',
            areas: [1],
            guardianActions: ['analyze_security', 'enable_2fa', 'check_privacy'],
            shadowActions: ['skip_security', 'share_credentials', 'ignore_warnings'],
            trustImpact: { guardian: +5, shadow: -3 },
            description: 'Gaming setup security configuration'
        });

        this.registerObjectType('eli_tournament_entry', {
            character: 'eli',
            areas: [2],
            guardianActions: ['verify_tournament', 'check_legitimacy', 'read_terms'],
            shadowActions: ['quick_join', 'ignore_verification', 'skip_terms'],
            trustImpact: { guardian: +3, shadow: -5 },
            description: 'Tournament entry verification'
        });

        // Maya's interactive objects
        this.registerObjectType('maya_dating_profile', {
            character: 'maya',
            areas: [1, 2],
            guardianActions: ['verify_photos', 'reverse_search', 'check_consistency'],
            shadowActions: ['trust_immediately', 'ignore_red_flags', 'skip_verification'],
            trustImpact: { guardian: +4, shadow: -4 },
            description: 'Dating profile verification tools'
        });

        this.registerObjectType('maya_message_analysis', {
            character: 'maya',
            areas: [2, 3],
            guardianActions: ['analyze_language', 'check_patterns', 'verify_claims'],
            shadowActions: ['respond_quickly', 'share_personal_info', 'trust_blindly'],
            trustImpact: { guardian: +6, shadow: -6 },
            description: 'Message and communication analysis'
        });

        // Stanley's interactive objects
        this.registerObjectType('stanley_identity_scanner', {
            character: 'stanley',
            areas: [1, 2],
            guardianActions: ['scan_documents', 'verify_identity', 'check_sources'],
            shadowActions: ['share_documents', 'trust_caller', 'provide_info'],
            trustImpact: { guardian: +5, shadow: -7 },
            description: 'Identity verification and document scanning'
        });

        this.registerObjectType('stanley_financial_checker', {
            character: 'stanley',
            areas: [3, 4],
            guardianActions: ['verify_transactions', 'check_legitimacy', 'contact_bank'],
            shadowActions: ['quick_payment', 'ignore_warnings', 'trust_urgency'],
            trustImpact: { guardian: +7, shadow: -8 },
            description: 'Financial transaction verification'
        });

        console.log('🎯 Default object types registered');
    }

    /**
     * Register a new interactive object type
     * @param {string} objectType - Object type identifier
     * @param {Object} config - Object configuration
     */
    registerObjectType(objectType, config) {
        this.registeredObjects.set(objectType, {
            type: objectType,
            character: config.character,
            areas: config.areas || [],
            guardianActions: config.guardianActions || [],
            shadowActions: config.shadowActions || [],
            trustImpact: config.trustImpact || { guardian: 0, shadow: 0 },
            description: config.description || '',
            customHandler: config.customHandler || null,
            metadata: config.metadata || {}
        });

        console.log(`🎯 Registered object type: ${objectType}`);
    }

    /**
     * Create interactive object in the DOM
     * @param {string} objectId - Unique object identifier
     * @param {string} objectType - Object type
     * @param {HTMLElement} targetElement - Element to make interactive
     * @param {Object} options - Additional options
     * @returns {boolean} Success status
     */
    createInteractiveObject(objectId, objectType, targetElement, options = {}) {
        if (!this.initialized) {
            console.error('❌ Interactive Object Manager not initialized');
            return false;
        }

        const objectConfig = this.registeredObjects.get(objectType);
        if (!objectConfig) {
            console.error(`❌ Unknown object type: ${objectType}`);
            return false;
        }

        if (this.activeObjects.has(objectId)) {
            console.warn(`⚠️ Object ${objectId} already exists`);
            return false;
        }

        try {
            // Create interactive object instance
            const interactiveObject = {
                id: objectId,
                type: objectType,
                config: objectConfig,
                element: targetElement,
                options: options,
                isHighlighted: false,
                isActive: true,
                createdAt: Date.now()
            };

            // Set up element attributes
            targetElement.setAttribute('data-interactive-object', objectId);
            targetElement.setAttribute('data-object-type', objectType);
            targetElement.classList.add('interactive-object');

            // Set up click handler
            const clickHandler = (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.handleObjectClick(objectId, event);
            };
            targetElement.addEventListener('click', clickHandler);
            this.clickHandlers.set(objectId, clickHandler);

            // Set up hover handlers
            const hoverInHandler = (event) => this.handleObjectHover(objectId, true, event);
            const hoverOutHandler = (event) => this.handleObjectHover(objectId, false, event);
            targetElement.addEventListener('mouseenter', hoverInHandler);
            targetElement.addEventListener('mouseleave', hoverOutHandler);
            this.hoverHandlers.set(objectId, { in: hoverInHandler, out: hoverOutHandler });

            // Apply initial highlighting based on current mode
            this.updateObjectHighlighting(interactiveObject);

            // Store active object
            this.activeObjects.set(objectId, interactiveObject);

            console.log(`✅ Created interactive object: ${objectId} (${objectType})`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to create interactive object ${objectId}:`, error);
            return false;
        }
    }

    /**
     * Handle object click interaction
     * @param {string} objectId - Object identifier
     * @param {Event} event - Click event
     */
    async handleObjectClick(objectId, event) {
        const interactiveObject = this.activeObjects.get(objectId);
        if (!interactiveObject || !interactiveObject.isActive) {
            return;
        }

        console.log(`🎯 Object clicked: ${objectId}`);

        try {
            // Get current mode and actions
            const currentMode = this.getCurrentMode();
            const actions = this.getObjectActions(interactiveObject, currentMode);

            if (actions.length === 0) {
                console.warn(`⚠️ No actions available for ${objectId} in ${currentMode} mode`);
                return;
            }

            // Provide immediate visual feedback
            await this.feedbackSystem.showClickFeedback(interactiveObject.element, currentMode);

            // Play audio feedback
            if (this.config.enableAudioFeedback) {
                this.feedbackSystem.playAudioFeedback(currentMode, 'click');
            }

            // Execute interaction
            const result = await this.executeObjectInteraction(interactiveObject, actions, currentMode);

            // Update trust score based on interaction
            this.updateTrustScore(interactiveObject, currentMode, result);

            // Trigger AI persona behavior adjustment
            this.triggerAIPersonaAdjustment(interactiveObject, currentMode, result);

            // Dispatch interaction event
            this.dispatchEvent('objectInteraction', {
                objectId,
                objectType: interactiveObject.type,
                mode: currentMode,
                actions,
                result,
                timestamp: Date.now()
            });

        } catch (error) {
            console.error(`❌ Failed to handle object click for ${objectId}:`, error);
        }
    }

    /**
     * Handle object hover interaction
     * @param {string} objectId - Object identifier
     * @param {boolean} isEntering - Whether mouse is entering or leaving
     * @param {Event} event - Hover event
     */
    handleObjectHover(objectId, isEntering, event) {
        const interactiveObject = this.activeObjects.get(objectId);
        if (!interactiveObject || !interactiveObject.isActive) {
            return;
        }

        if (isEntering) {
            // Show hover highlight
            this.highlightSystem.showHoverHighlight(interactiveObject.element, this.getCurrentMode());
            
            // Show tooltip with available actions
            this.showObjectTooltip(interactiveObject, event);
        } else {
            // Remove hover highlight
            this.highlightSystem.removeHoverHighlight(interactiveObject.element);
            
            // Hide tooltip
            this.hideObjectTooltip();
        }
    }

    /**
     * Get available actions for object in current mode
     * @param {Object} interactiveObject - Interactive object
     * @param {string} mode - Current mode
     * @returns {Array} Available actions
     */
    getObjectActions(interactiveObject, mode) {
        const config = interactiveObject.config;
        
        if (mode === 'guardian') {
            return config.guardianActions || [];
        } else if (mode === 'shadowObserver') {
            return config.shadowActions || [];
        }
        
        return [];
    }

    /**
     * Execute object interaction
     * @param {Object} interactiveObject - Interactive object
     * @param {Array} actions - Available actions
     * @param {string} mode - Current mode
     * @returns {Promise<Object>} Interaction result
     */
    async executeObjectInteraction(interactiveObject, actions, mode) {
        // If custom handler exists, use it
        if (interactiveObject.config.customHandler) {
            return await interactiveObject.config.customHandler(interactiveObject, actions, mode);
        }

        // Default interaction execution
        const primaryAction = actions[0]; // Use first action as primary
        
        const result = {
            action: primaryAction,
            mode: mode,
            success: true,
            message: this.generateInteractionMessage(interactiveObject, primaryAction, mode),
            educationalContent: this.generateEducationalContent(interactiveObject, primaryAction, mode)
        };

        // Show interaction result
        await this.feedbackSystem.showInteractionResult(interactiveObject.element, result);

        return result;
    }

    /**
     * Generate interaction message
     * @param {Object} interactiveObject - Interactive object
     * @param {string} action - Action taken
     * @param {string} mode - Current mode
     * @returns {string} Interaction message
     */
    generateInteractionMessage(interactiveObject, action, mode) {
        const messages = {
            guardian: {
                analyze_security: "🛡️ Analyzing security settings to protect your account...",
                verify_photos: "🔍 Verifying photo authenticity using reverse image search...",
                scan_documents: "📄 Scanning documents for authenticity markers...",
                verify_tournament: "🏆 Verifying tournament legitimacy and safety...",
                check_legitimacy: "✅ Checking source legitimacy and credentials..."
            },
            shadowObserver: {
                skip_security: "⚠️ Skipping security checks - this could be risky...",
                trust_immediately: "💔 Trusting without verification - potential danger ahead...",
                share_documents: "🚨 Sharing sensitive documents - identity theft risk!",
                quick_join: "⚡ Joining quickly without verification - scam potential!",
                ignore_warnings: "🔥 Ignoring safety warnings - consequences incoming..."
            }
        };

        return messages[mode]?.[action] || `${mode === 'guardian' ? '🛡️' : '👤'} ${action.replace(/_/g, ' ')}`;
    }

    /**
     * Generate educational content
     * @param {Object} interactiveObject - Interactive object
     * @param {string} action - Action taken
     * @param {string} mode - Current mode
     * @returns {string} Educational content
     */
    generateEducationalContent(interactiveObject, action, mode) {
        const education = {
            guardian: {
                analyze_security: "Good choice! Always review security settings to protect your accounts from unauthorized access.",
                verify_photos: "Excellent! Reverse image searches can reveal fake profiles and catfishing attempts.",
                scan_documents: "Smart move! Document verification helps prevent identity theft and fraud.",
                verify_tournament: "Well done! Legitimate tournaments have proper verification and clear terms.",
                check_legitimacy: "Perfect! Always verify sources before sharing information or making decisions."
            },
            shadowObserver: {
                skip_security: "This demonstrates how skipping security leads to account compromise and data theft.",
                trust_immediately: "This shows how predators exploit trust to manipulate victims emotionally and financially.",
                share_documents: "This illustrates how identity thieves collect personal documents for fraudulent activities.",
                quick_join: "This reveals how scammers create urgency to prevent victims from thinking critically.",
                ignore_warnings: "This demonstrates the consequences of dismissing cybersecurity warnings and red flags."
            }
        };

        return education[mode]?.[action] || `This ${mode} action demonstrates important cybersecurity principles.`;
    }

    /**
     * Update trust score based on interaction
     * @param {Object} interactiveObject - Interactive object
     * @param {string} mode - Current mode
     * @param {Object} result - Interaction result
     */
    updateTrustScore(interactiveObject, mode, result) {
        const trustImpact = interactiveObject.config.trustImpact[mode] || 0;
        
        if (trustImpact !== 0) {
            this.trustScoreManager.updateScore(trustImpact, {
                source: 'interactive_object',
                objectId: interactiveObject.id,
                objectType: interactiveObject.type,
                mode: mode,
                action: result.action
            });
        }
    }

    /**
     * Trigger AI persona behavior adjustment
     * @param {Object} interactiveObject - Interactive object
     * @param {string} mode - Current mode
     * @param {Object} result - Interaction result
     */
    triggerAIPersonaAdjustment(interactiveObject, mode, result) {
        // Dispatch event for AI persona system to handle
        this.dispatchEvent('aiPersonaAdjustment', {
            trigger: 'object_interaction',
            objectType: interactiveObject.type,
            mode: mode,
            action: result.action,
            trustScore: this.trustScoreManager.getCurrentScore(),
            character: this.currentCharacter,
            area: this.currentArea
        });
    }

    /**
     * Show object tooltip
     * @param {Object} interactiveObject - Interactive object
     * @param {Event} event - Mouse event
     */
    showObjectTooltip(interactiveObject, event) {
        const mode = this.getCurrentMode();
        const actions = this.getObjectActions(interactiveObject, mode);
        
        if (actions.length === 0) return;

        const tooltip = document.createElement('div');
        tooltip.id = 'interactive-object-tooltip';
        tooltip.className = `interactive-tooltip ${mode}-mode`;
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid ${mode === 'guardian' ? '#4CAF50' : '#F44336'};
            border-radius: 6px;
            padding: 8px 12px;
            color: white;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
            max-width: 200px;
            backdrop-filter: blur(5px);
        `;

        tooltip.innerHTML = `
            <div style="color: ${mode === 'guardian' ? '#4CAF50' : '#F44336'}; font-weight: bold; margin-bottom: 4px;">
                ${mode === 'guardian' ? '🛡️ Guardian' : '👤 Shadow Observer'}
            </div>
            <div style="color: #CCCCCC;">
                ${interactiveObject.config.description}
            </div>
            <div style="color: #FFD700; margin-top: 4px; font-size: 11px;">
                Click to ${actions[0].replace(/_/g, ' ')}
            </div>
        `;

        // Position tooltip
        const rect = interactiveObject.element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';

        document.body.appendChild(tooltip);
    }

    /**
     * Hide object tooltip
     */
    hideObjectTooltip() {
        const tooltip = document.getElementById('interactive-object-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    /**
     * Update object highlighting based on current mode
     * @param {Object} interactiveObject - Interactive object
     */
    updateObjectHighlighting(interactiveObject) {
        if (!this.config.enableHighlighting) return;

        const mode = this.getCurrentMode();
        const actions = this.getObjectActions(interactiveObject, mode);
        
        if (actions.length > 0) {
            this.highlightSystem.applyModeHighlight(interactiveObject.element, mode);
            interactiveObject.isHighlighted = true;
        } else {
            this.highlightSystem.removeHighlight(interactiveObject.element);
            interactiveObject.isHighlighted = false;
        }
    }

    /**
     * Handle mode change event
     * @param {Object} modeData - Mode change data
     */
    handleModeChange(modeData) {
        this.currentMode = modeData.mode;
        this.currentCharacter = modeData.character;
        this.currentArea = modeData.area;

        // Update highlighting for all active objects
        this.activeObjects.forEach(interactiveObject => {
            this.updateObjectHighlighting(interactiveObject);
        });

        console.log(`🎯 Interactive objects updated for mode: ${modeData.mode}`);
    }

    /**
     * Handle context change (character/area change)
     * @param {Object} contextData - Context change data
     */
    handleContextChange(contextData) {
        if (contextData.character) {
            this.currentCharacter = contextData.character;
        }
        if (contextData.areaNumber) {
            this.currentArea = contextData.areaNumber;
        }

        // Update object visibility based on new context
        this.updateObjectVisibility();
    }

    /**
     * Handle trust score update
     * @param {Object} trustData - Trust score data
     */
    handleTrustScoreUpdate(trustData) {
        // Update object highlighting intensity based on trust score
        const trustScore = trustData.score;
        const intensity = Math.max(0.3, Math.min(1.0, (trustScore + 50) / 100));
        
        this.config.highlightIntensity = intensity;
        
        // Re-apply highlighting to all objects
        this.activeObjects.forEach(interactiveObject => {
            if (interactiveObject.isHighlighted) {
                this.updateObjectHighlighting(interactiveObject);
            }
        });
    }

    /**
     * Update object visibility based on current context
     */
    updateObjectVisibility() {
        this.activeObjects.forEach(interactiveObject => {
            const config = interactiveObject.config;
            const isVisible = config.character === this.currentCharacter && 
                            config.areas.includes(this.currentArea);
            
            interactiveObject.element.style.display = isVisible ? '' : 'none';
            interactiveObject.isActive = isVisible;
        });
    }

    /**
     * Get current mode
     * @returns {string} Current mode
     */
    getCurrentMode() {
        if (this.modeManager) {
            const modeInfo = this.modeManager.getCurrentMode();
            return modeInfo.mode || 'guardian';
        }
        return this.currentMode || 'guardian';
    }

    /**
     * Remove interactive object
     * @param {string} objectId - Object identifier
     * @returns {boolean} Success status
     */
    removeInteractiveObject(objectId) {
        const interactiveObject = this.activeObjects.get(objectId);
        if (!interactiveObject) {
            return false;
        }

        try {
            // Remove event listeners
            const clickHandler = this.clickHandlers.get(objectId);
            if (clickHandler) {
                interactiveObject.element.removeEventListener('click', clickHandler);
                this.clickHandlers.delete(objectId);
            }

            const hoverHandlers = this.hoverHandlers.get(objectId);
            if (hoverHandlers) {
                interactiveObject.element.removeEventListener('mouseenter', hoverHandlers.in);
                interactiveObject.element.removeEventListener('mouseleave', hoverHandlers.out);
                this.hoverHandlers.delete(objectId);
            }

            // Remove highlighting
            this.highlightSystem.removeHighlight(interactiveObject.element);

            // Clean up element attributes
            interactiveObject.element.removeAttribute('data-interactive-object');
            interactiveObject.element.removeAttribute('data-object-type');
            interactiveObject.element.classList.remove('interactive-object');

            // Remove from active objects
            this.activeObjects.delete(objectId);

            console.log(`✅ Removed interactive object: ${objectId}`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to remove interactive object ${objectId}:`, error);
            return false;
        }
    }

    /**
     * Clear all interactive objects
     */
    clearAllObjects() {
        const objectIds = Array.from(this.activeObjects.keys());
        objectIds.forEach(objectId => {
            this.removeInteractiveObject(objectId);
        });
        
        console.log('🧹 All interactive objects cleared');
    }

    /**
     * Get active objects for current context
     * @returns {Array} Active objects
     */
    getActiveObjects() {
        return Array.from(this.activeObjects.values()).filter(obj => obj.isActive);
    }

    /**
     * Dispatch custom event
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    dispatchEvent(event, data) {
        window.dispatchEvent(new CustomEvent(`interactiveObject${event}`, {
            detail: data
        }));
    }

    /**
     * Get manager status
     * @returns {Object} Manager status
     */
    getStatus() {
        return {
            version: this.version,
            initialized: this.initialized,
            currentCharacter: this.currentCharacter,
            currentArea: this.currentArea,
            currentMode: this.currentMode,
            registeredObjects: this.registeredObjects.size,
            activeObjects: this.activeObjects.size,
            config: this.config
        };
    }
}

/**
 * Trust Score Manager
 * Manages trust score integration for interactive objects
 */
class TrustScoreManager {
    constructor() {
        this.currentScore = 0;
        this.scoreHistory = [];
        this.initialized = false;
    }

    async initialize() {
        // Initialize with neutral trust score
        this.currentScore = 0;
        this.initialized = true;
        console.log('✅ Trust Score Manager initialized');
    }

    updateScore(change, context = {}) {
        const previousScore = this.currentScore;
        this.currentScore = Math.max(-100, Math.min(100, this.currentScore + change));
        
        // Record score change
        this.scoreHistory.push({
            previousScore,
            change,
            newScore: this.currentScore,
            context,
            timestamp: Date.now()
        });

        // Dispatch trust score update event
        window.dispatchEvent(new CustomEvent('trustScoreUpdated', {
            detail: {
                score: this.currentScore,
                change,
                context
            }
        }));

        console.log(`🎯 Trust score updated: ${previousScore} → ${this.currentScore} (${change > 0 ? '+' : ''}${change})`);
    }

    getCurrentScore() {
        return this.currentScore;
    }

    getScoreHistory() {
        return [...this.scoreHistory];
    }
}

/**
 * Object Highlight System
 * Manages visual highlighting of interactive objects
 */
class ObjectHighlightSystem {
    constructor() {
        this.highlightStyles = new Map();
        this.initialized = false;
    }

    async initialize(config) {
        this.config = config;
        this.setupHighlightStyles();
        this.initialized = true;
        console.log('✅ Object Highlight System initialized');
    }

    setupHighlightStyles() {
        // Guardian mode highlighting
        this.highlightStyles.set('guardian', {
            border: '2px solid #4CAF50',
            boxShadow: '0 0 10px rgba(76, 175, 80, 0.6)',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            cursor: 'pointer'
        });

        // Shadow Observer mode highlighting
        this.highlightStyles.set('shadowObserver', {
            border: '2px solid #F44336',
            boxShadow: '0 0 10px rgba(244, 67, 54, 0.6)',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            cursor: 'pointer'
        });

        // Hover highlighting
        this.highlightStyles.set('hover_guardian', {
            border: '2px solid #66BB6A',
            boxShadow: '0 0 15px rgba(102, 187, 106, 0.8)',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            transform: 'scale(1.02)'
        });

        this.highlightStyles.set('hover_shadowObserver', {
            border: '2px solid #EF5350',
            boxShadow: '0 0 15px rgba(239, 83, 80, 0.8)',
            backgroundColor: 'rgba(244, 67, 54, 0.2)',
            transform: 'scale(1.02)'
        });
    }

    applyModeHighlight(element, mode) {
        if (!this.initialized) return;

        const styles = this.highlightStyles.get(mode);
        if (!styles) return;

        // Store original styles
        if (!element.dataset.originalStyles) {
            element.dataset.originalStyles = JSON.stringify({
                border: element.style.border,
                boxShadow: element.style.boxShadow,
                backgroundColor: element.style.backgroundColor,
                cursor: element.style.cursor,
                transform: element.style.transform
            });
        }

        // Apply highlight styles
        Object.entries(styles).forEach(([property, value]) => {
            element.style[property] = value;
        });

        element.classList.add('interactive-highlighted', `${mode}-highlighted`);
    }

    showHoverHighlight(element, mode) {
        if (!this.initialized) return;

        const hoverStyles = this.highlightStyles.get(`hover_${mode}`);
        if (!hoverStyles) return;

        // Apply hover styles
        Object.entries(hoverStyles).forEach(([property, value]) => {
            element.style[property] = value;
        });

        element.classList.add('interactive-hover');
    }

    removeHoverHighlight(element) {
        if (!this.initialized) return;

        // Restore mode highlighting
        const mode = element.classList.contains('guardian-highlighted') ? 'guardian' : 'shadowObserver';
        const modeStyles = this.highlightStyles.get(mode);
        
        if (modeStyles) {
            Object.entries(modeStyles).forEach(([property, value]) => {
                element.style[property] = value;
            });
        }

        element.classList.remove('interactive-hover');
    }

    removeHighlight(element) {
        if (!this.initialized) return;

        // Restore original styles
        if (element.dataset.originalStyles) {
            const originalStyles = JSON.parse(element.dataset.originalStyles);
            Object.entries(originalStyles).forEach(([property, value]) => {
                element.style[property] = value || '';
            });
            delete element.dataset.originalStyles;
        }

        element.classList.remove('interactive-highlighted', 'guardian-highlighted', 'shadowObserver-highlighted', 'interactive-hover');
    }
}

/**
 * Interaction Feedback System
 * Manages visual and audio feedback for interactions
 */
class InteractionFeedbackSystem {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
    }

    async initialize(config) {
        this.config = config;
        
        // Initialize audio context if audio feedback is enabled
        if (config.enableAudioFeedback) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (error) {
                console.warn('⚠️ Audio context not available:', error);
            }
        }

        this.initialized = true;
        console.log('✅ Interaction Feedback System initialized');
    }

    async showClickFeedback(element, mode) {
        if (!this.initialized || !this.config.enableVisualFeedback) return;

        // Create click ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'interaction-ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: ${mode === 'guardian' ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)'};
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
            z-index: 1000;
        `;

        // Position ripple at element center
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${rect.left + rect.width / 2 - size / 2}px`;
        ripple.style.top = `${rect.top + rect.height / 2 - size / 2}px`;

        // Add ripple animation CSS if not exists
        if (!document.getElementById('ripple-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-styles';
            style.textContent = `
                @keyframes ripple-animation {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    async showInteractionResult(element, result) {
        if (!this.initialized || !this.config.enableVisualFeedback) return;

        // Create result popup
        const popup = document.createElement('div');
        popup.className = 'interaction-result-popup';
        popup.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid ${result.mode === 'guardian' ? '#4CAF50' : '#F44336'};
            border-radius: 8px;
            padding: 12px 16px;
            color: white;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            z-index: 10001;
            max-width: 300px;
            backdrop-filter: blur(5px);
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        `;

        popup.innerHTML = `
            <div style="color: ${result.mode === 'guardian' ? '#4CAF50' : '#F44336'}; font-weight: bold; margin-bottom: 6px;">
                ${result.message}
            </div>
            <div style="color: #CCCCCC; font-size: 11px; line-height: 1.4;">
                ${result.educationalContent}
            </div>
        `;

        // Position popup near element
        const rect = element.getBoundingClientRect();
        popup.style.left = `${rect.left + rect.width / 2}px`;
        popup.style.top = `${rect.bottom + 10}px`;
        popup.style.transform = 'translateX(-50%) translateY(10px)';

        document.body.appendChild(popup);

        // Animate in
        requestAnimationFrame(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Remove after duration
        setTimeout(() => {
            popup.style.opacity = '0';
            popup.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 300);
        }, this.config.feedbackDuration);
    }

    playAudioFeedback(mode, type) {
        if (!this.initialized || !this.config.enableAudioFeedback || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Different tones for different modes and types
            const frequencies = {
                guardian: { click: 800, hover: 600 },
                shadowObserver: { click: 400, hover: 300 }
            };

            oscillator.frequency.setValueAtTime(
                frequencies[mode]?.[type] || 500,
                this.audioContext.currentTime
            );

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);

        } catch (error) {
            console.warn('⚠️ Audio feedback failed:', error);
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        InteractiveObjectManager, 
        TrustScoreManager, 
        ObjectHighlightSystem, 
        InteractionFeedbackSystem 
    };
}

// Make available globally
window.InteractiveObjectManager = InteractiveObjectManager;
window.TrustScoreManager = TrustScoreManager;
window.ObjectHighlightSystem = ObjectHighlightSystem;
window.InteractionFeedbackSystem = InteractionFeedbackSystem;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.interactiveObjectManager) {
            window.interactiveObjectManager = new InteractiveObjectManager();
            await window.interactiveObjectManager.initialize();
        }
    });
} else {
    if (!window.interactiveObjectManager) {
        window.interactiveObjectManager = new InteractiveObjectManager();
        window.interactiveObjectManager.initialize();
    }
}