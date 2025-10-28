/**
 * Gaming Mechanics Integration Script
 * Simple script to add gaming mechanics to existing Data_Bleed pages
 * Can be included in any page to enable interactive gaming mechanics
 */

(function() {
    'use strict';
    
    // Configuration
    const GAMING_MECHANICS_CONFIG = {
        autoLoad: true,
        enableLogging: true,
        enableDecisionTriggers: true,
        enableMechanicActivation: true
    };
    
    // Integration state
    let integrationInitialized = false;
    let gamingMechanicsReady = false;
    
    /**
     * Initialize gaming mechanics integration
     */
    async function initializeGamingMechanicsIntegration() {
        if (integrationInitialized) return;
        integrationInitialized = true;
        
        console.log('🎮 Initializing Gaming Mechanics Integration...');
        
        try {
            // Load the gaming mechanics loader if not already present
            await loadGamingMechanicsLoader();
            
            // Wait for gaming mechanics to be ready
            await waitForGamingMechanics();
            
            // Set up integration hooks
            setupIntegrationHooks();
            
            // Set up UI enhancements
            setupUIEnhancements();
            
            gamingMechanicsReady = true;
            console.log('✅ Gaming Mechanics Integration ready');
            
            // Dispatch ready event
            window.dispatchEvent(new CustomEvent('gamingMechanicsIntegrationReady', {
                detail: { timestamp: Date.now() }
            }));
            
        } catch (error) {
            console.error('❌ Gaming Mechanics Integration failed:', error);
        }
    }
    
    /**
     * Load the gaming mechanics loader script
     */
    async function loadGamingMechanicsLoader() {
        // Check if already loaded
        if (window.gamingMechanicsLoader) {
            return;
        }
        
        // Check if script already exists
        const existingScript = document.querySelector('script[src*="gaming-mechanics-loader.js"]');
        if (existingScript) {
            return waitForLoader();
        }
        
        // Load the loader script
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'Game/Mechanics/gaming-mechanics-loader.js';
            script.async = false;
            
            script.onload = () => {
                waitForLoader().then(resolve).catch(reject);
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load gaming mechanics loader'));
            };
            
            document.head.appendChild(script);
        });
    }
    
    /**
     * Wait for the loader to be available
     */
    async function waitForLoader() {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (!window.gamingMechanicsLoader && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.gamingMechanicsLoader) {
            throw new Error('Gaming mechanics loader not available');
        }
    }
    
    /**
     * Wait for gaming mechanics to be fully loaded
     */
    async function waitForGamingMechanics() {
        let attempts = 0;
        const maxAttempts = 100;
        
        while (attempts < maxAttempts) {
            if (window.gamingEngine && window.gamingEngine.initialized) {
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
        }
        
        throw new Error('Gaming mechanics not ready within timeout');
    }
    
    /**
     * Set up integration hooks with existing systems
     */
    function setupIntegrationHooks() {
        // Hook into story progression events
        window.addEventListener('storyTriggerFired', (event) => {
            if (GAMING_MECHANICS_CONFIG.enableDecisionTriggers) {
                handleStoryTrigger(event.detail);
            }
        });
        
        // Hook into page navigation
        if (window.storyTracker) {
            const originalTrackAreaVisit = window.storyTracker.trackAreaVisit;
            window.storyTracker.trackAreaVisit = function(character, area, data) {
                // Call original method
                const result = originalTrackAreaVisit.call(this, character, area, data);
                
                // Check for gaming mechanic triggers
                checkForGamingTriggers(character, area, data);
                
                return result;
            };
        }
        
        // Hook into chroma bot interactions
        window.addEventListener('chromaBotInteraction', (event) => {
            handleChromaBotInteraction(event.detail);
        });
    }
    
    /**
     * Set up UI enhancements for gaming mechanics
     */
    function setupUIEnhancements() {
        // Add gaming mechanics indicator to existing UI
        addGamingMechanicsIndicator();
        
        // Enhance existing buttons with gaming mechanics
        enhanceExistingButtons();
        
        // Add keyboard shortcuts
        setupKeyboardShortcuts();
    }
    
    /**
     * Handle story trigger events
     */
    function handleStoryTrigger(triggerData) {
        console.log('🎮 Gaming Mechanics handling story trigger:', triggerData);
        
        // Check if this trigger should activate gaming mechanics
        if (shouldActivateGamingMechanics(triggerData)) {
            activateGamingMechanicsForTrigger(triggerData);
        }
    }
    
    /**
     * Check for gaming mechanic triggers on area visits
     */
    function checkForGamingTriggers(character, area, data) {
        if (!gamingMechanicsReady || !window.gamingEngine) return;
        
        // Check if this area/character combination should trigger decisions
        const shouldTrigger = shouldTriggerDecisions(character, area, data);
        
        if (shouldTrigger) {
            // Delay slightly to allow page to settle
            setTimeout(() => {
                presentAreaDecisions(character, area, data);
            }, 1000);
        }
    }
    
    /**
     * Determine if gaming mechanics should activate for a trigger
     */
    function shouldActivateGamingMechanics(triggerData) {
        // Activate for specific trigger types
        const activatingTriggers = [
            'tournament_victory',
            'suspicious_match_detection',
            'identity_threat_discovery',
            'peer_pressure_peak',
            'archive_breakthrough',
            'scam_prevention_success'
        ];
        
        return activatingTriggers.includes(triggerData.triggerId);
    }
    
    /**
     * Determine if decisions should be triggered for area visit
     */
    function shouldTriggerDecisions(character, area, data) {
        // Don't trigger if decisions are already active
        if (window.gamingEngine.decisionSystem && 
            window.gamingEngine.decisionSystem.getCurrentDecision()) {
            return false;
        }
        
        // Trigger for specific areas
        const triggerAreas = {
            eli: [1, 2, 4],
            maya: [2, 3, 4],
            stanley: [2, 4, 5]
        };
        
        return triggerAreas[character] && triggerAreas[character].includes(area);
    }
    
    /**
     * Activate gaming mechanics for a specific trigger
     */
    function activateGamingMechanicsForTrigger(triggerData) {
        if (!window.gamingEngine || !window.gamingEngine.decisionSystem) return;
        
        const context = {
            trigger: triggerData,
            character: triggerData.character,
            area: triggerData.areaNumber,
            triggerSource: 'story_event'
        };
        
        // Present decisions related to the trigger
        window.gamingEngine.decisionSystem.presentDecisions(
            triggerData.character,
            triggerData.areaNumber,
            context
        );
    }
    
    /**
     * Present decisions for area visit
     */
    function presentAreaDecisions(character, area, data) {
        if (!window.gamingEngine || !window.gamingEngine.decisionSystem) return;
        
        const context = {
            areaVisit: true,
            character,
            area,
            visitData: data,
            triggerSource: 'area_visit'
        };
        
        window.gamingEngine.decisionSystem.presentDecisions(character, area, context);
    }
    
    /**
     * Handle chroma bot interactions
     */
    function handleChromaBotInteraction(interactionData) {
        // Could trigger specific mechanics based on bot conversation
        console.log('🎮 Gaming Mechanics handling chroma bot interaction:', interactionData);
    }
    
    /**
     * Add gaming mechanics indicator to UI
     */
    function addGamingMechanicsIndicator() {
        // Add a small indicator that gaming mechanics are active
        const indicator = document.createElement('div');
        indicator.id = 'gaming-mechanics-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 255, 255, 0.2);
            border: 1px solid #00FFFF;
            border-radius: 15px;
            padding: 5px 10px;
            font-size: 12px;
            color: #00FFFF;
            font-family: 'JetBrains Mono', monospace;
            z-index: 9997;
            backdrop-filter: blur(5px);
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        indicator.textContent = '🎮 GM';
        indicator.title = 'Gaming Mechanics Active - Click for info';
        
        indicator.addEventListener('click', showGamingMechanicsInfo);
        
        document.body.appendChild(indicator);
    }
    
    /**
     * Enhance existing buttons with gaming mechanics
     */
    function enhanceExistingButtons() {
        // Find existing action buttons and enhance them
        const buttons = document.querySelectorAll('button, .btn, .action-btn');
        
        buttons.forEach(button => {
            // Add subtle gaming mechanics styling
            if (!button.classList.contains('gaming-enhanced')) {
                button.classList.add('gaming-enhanced');
                
                // Add hover effect
                button.addEventListener('mouseenter', () => {
                    if (gamingMechanicsReady) {
                        button.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
                    }
                });
                
                button.addEventListener('mouseleave', () => {
                    button.style.boxShadow = '';
                });
            }
        });
    }
    
    /**
     * Set up keyboard shortcuts for gaming mechanics
     */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + G: Show gaming mechanics info
            if ((event.ctrlKey || event.metaKey) && event.key === 'g') {
                event.preventDefault();
                showGamingMechanicsInfo();
            }
            
            // Ctrl/Cmd + D: Trigger decisions for current context
            if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
                event.preventDefault();
                triggerContextualDecisions();
            }
        });
    }
    
    /**
     * Show gaming mechanics information
     */
    function showGamingMechanicsInfo() {
        if (!gamingMechanicsReady) {
            alert('Gaming Mechanics not ready yet');
            return;
        }
        
        const status = window.gamingEngine.getStatus();
        const info = `
Gaming Mechanics Status:
- Version: ${status.version}
- Initialized: ${status.initialized}
- Registered Mechanics: ${status.registeredMechanics}
- Active Mechanics: ${status.activeMechanics}
- Current Character: ${status.currentSession.character}
- Current Area: ${status.currentSession.area}

Keyboard Shortcuts:
- Ctrl/Cmd + G: Show this info
- Ctrl/Cmd + D: Trigger decisions
        `;
        
        alert(info);
    }
    
    /**
     * Trigger contextual decisions
     */
    function triggerContextualDecisions() {
        if (!gamingMechanicsReady || !window.gamingEngine.decisionSystem) {
            alert('Decision system not available');
            return;
        }
        
        // Get current context
        const context = window.storyTracker ? 
                      window.storyTracker.detectCurrentContext() : 
                      { character: 'eli', area: 1 };
        
        if (!context.character) {
            alert('Could not detect current character context');
            return;
        }
        
        // Present decisions
        window.gamingEngine.decisionSystem.presentDecisions(
            context.character,
            context.area || 1,
            { manualTrigger: true }
        );
    }
    
    // Public API
    window.GamingMechanicsIntegration = {
        initialize: initializeGamingMechanicsIntegration,
        isReady: () => gamingMechanicsReady,
        showInfo: showGamingMechanicsInfo,
        triggerDecisions: triggerContextualDecisions,
        config: GAMING_MECHANICS_CONFIG
    };
    
    // Auto-initialize if configured
    if (GAMING_MECHANICS_CONFIG.autoLoad) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeGamingMechanicsIntegration);
        } else {
            initializeGamingMechanicsIntegration();
        }
    }
    
})();