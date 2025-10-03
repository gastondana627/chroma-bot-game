/**
 * Cinematic Moment Orchestration System
 * Coordinates dialogue synchronization, dynamic lighting, and camera control
 * for seamless 3D cinematic experiences
 */

class CinematicOrchestrationSystem {
    constructor(scene, camera, renderer, controls) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
        
        // Sub-systems
        this.dialogueSystem = null;
        this.lightingSystem = null;
        this.cameraSystem = null;
        this.animationSystem = null;
        this.character3DRenderer = null;
        
        // Orchestration state
        this.isActive = false;
        this.currentCinematic = null;
        this.orchestrationTimeline = [];
        this.activeTimers = [];
        
        // Performance monitoring
        this.performanceMetrics = {
            frameRate: 60,
            memoryUsage: 0,
            renderTime: 0,
            lastFrameTime: 0
        };
        
        // Event listeners
        this.eventListeners = new Map();
        
        console.log('Cinematic Orchestration System created');
    }
    
    /**
     * Initialize the orchestration system with all sub-systems
     * @param {Object} systems - Object containing all required systems
     */
    async initialize(systems) {
        try {
            // Initialize dialogue synchronization system
            if (systems.dialogueSystem) {
                this.dialogueSystem = systems.dialogueSystem;
                console.log('Dialogue system connected');
            } else {
                this.dialogueSystem = new DialogueSynchronizationSystem();
                console.log('Dialogue system created');
            }
            
            // Initialize dynamic lighting system
            if (systems.lightingSystem) {
                this.lightingSystem = systems.lightingSystem;
                console.log('Lighting system connected');
            } else {
                this.lightingSystem = new DynamicLightingSystem(this.scene, this.renderer);
                console.log('Lighting system created');
            }
            
            // Initialize cinematic camera system
            if (systems.cameraSystem) {
                this.cameraSystem = systems.cameraSystem;
                console.log('Camera system connected');
            } else {
                this.cameraSystem = new CinematicCameraSystem(this.camera, this.controls, this.scene);
                this.cameraSystem.initialize();
                console.log('Camera system created');
            }
            
            // Connect animation and character systems
            this.animationSystem = systems.animationSystem;
            this.character3DRenderer = systems.character3DRenderer;
            
            // Initialize dialogue system with animation and character systems
            if (this.dialogueSystem && this.animationSystem && this.character3DRenderer) {
                this.dialogueSystem.initialize(this.animationSystem, this.character3DRenderer);
            }
            
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('Cinematic Orchestration System initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Cinematic Orchestration System:', error);
            throw error;
        }
    }
    
    /**
     * Start a complete cinematic moment
     * @param {Object} cinematicConfig - Complete cinematic configuration
     */
    async startCinematicMoment(cinematicConfig) {
        if (this.isActive) {
            console.warn('Cinematic moment already active');
            return;
        }
        
        console.log('Starting cinematic moment:', cinematicConfig.id);
        
        this.isActive = true;
        this.currentCinematic = cinematicConfig;
        
        try {
            // Create orchestration timeline
            this.createOrchestrationTimeline(cinematicConfig);
            
            // Start performance monitoring
            this.startPerformanceMonitoring();
            
            // Execute orchestrated sequence
            await this.executeOrchestrationTimeline();
            
            console.log('Cinematic moment completed successfully');
            
        } catch (error) {
            console.error('Cinematic moment failed:', error);
            await this.emergencyStop();
        } finally {
            await this.endCinematicMoment();
        }
    }
    
    /**
     * Create orchestration timeline from cinematic configuration
     * @param {Object} cinematicConfig - Cinematic configuration
     */
    createOrchestrationTimeline(cinematicConfig) {
        const config = cinematicConfig.cinematicConfig;
        const duration = config.duration || 8000;
        
        this.orchestrationTimeline = [
            // Phase 1: Setup (0-500ms)
            {
                time: 0,
                phase: 'setup',
                actions: [
                    {
                        system: 'lighting',
                        action: 'activateLightingTheme',
                        params: [config.lighting.theme, 1500],
                        description: 'Activate character-specific lighting theme'
                    },
                    {
                        system: 'camera',
                        action: 'startCinematicSequence',
                        params: [config],
                        description: 'Position camera for cinematic shot'
                    }
                ]
            },
            
            // Phase 2: Character Emergence (500-2000ms)
            {
                time: 500,
                phase: 'emergence',
                actions: [
                    {
                        system: 'character',
                        action: 'startEmergenceAnimation',
                        params: [config.character],
                        description: 'Character emerges from chroma orb'
                    }
                ]
            },
            
            // Phase 3: Dialogue and Animation Sync (2000ms - duration-1000ms)
            {
                time: 2000,
                phase: 'dialogue',
                actions: [
                    {
                        system: 'dialogue',
                        action: 'startSynchronizedDialogue',
                        params: [config.dialogue],
                        description: 'Start synchronized dialogue with animations'
                    },
                    {
                        system: 'lighting',
                        action: 'triggerEffect',
                        params: ['cinematic_enhancement', { intensity: 0.8 }],
                        description: 'Enhance lighting for dialogue'
                    }
                ]
            },
            
            // Phase 4: Climax Effects (duration * 0.7)
            {
                time: Math.floor(duration * 0.7),
                phase: 'climax',
                actions: [
                    {
                        system: 'lighting',
                        action: 'triggerEffect',
                        params: [this.getClimaxEffect(config), { duration: 2000 }],
                        description: 'Trigger climactic lighting effect'
                    }
                ]
            },
            
            // Phase 5: Resolution (duration - 1000ms)
            {
                time: duration - 1000,
                phase: 'resolution',
                actions: [
                    {
                        system: 'character',
                        action: 'startReturnAnimation',
                        params: [],
                        description: 'Character returns to chroma orb'
                    }
                ]
            },
            
            // Phase 6: Cleanup (duration)
            {
                time: duration,
                phase: 'cleanup',
                actions: [
                    {
                        system: 'lighting',
                        action: 'deactivateLightingTheme',
                        params: [1500],
                        description: 'Return to normal lighting'
                    },
                    {
                        system: 'camera',
                        action: 'endCinematicSequence',
                        params: [1500],
                        description: 'Return camera to normal position'
                    }
                ]
            }
        ];
        
        console.log('Orchestration timeline created:', this.orchestrationTimeline.length, 'phases');
    }
    
    /**
     * Execute the orchestration timeline
     */
    async executeOrchestrationTimeline() {
        const startTime = Date.now();
        
        // Schedule all timeline actions
        this.orchestrationTimeline.forEach(phase => {
            const timer = setTimeout(async () => {
                console.log(`Executing phase: ${phase.phase} at ${phase.time}ms`);
                
                try {
                    await this.executePhaseActions(phase.actions);
                } catch (error) {
                    console.error(`Phase ${phase.phase} failed:`, error);
                }
            }, phase.time);
            
            this.activeTimers.push(timer);
        });
        
        // Wait for completion
        const totalDuration = Math.max(...this.orchestrationTimeline.map(p => p.time)) + 2000;
        await this.waitForCompletion(totalDuration);
    }
    
    /**
     * Execute actions for a timeline phase
     * @param {Array} actions - Array of actions to execute
     */
    async executePhaseActions(actions) {
        const promises = actions.map(async (action) => {
            try {
                await this.executeSystemAction(action);
            } catch (error) {
                console.error(`Action failed: ${action.description}`, error);
            }
        });
        
        await Promise.all(promises);
    }
    
    /**
     * Execute a single system action
     * @param {Object} action - Action configuration
     */
    async executeSystemAction(action) {
        let system;
        
        switch (action.system) {
            case 'dialogue':
                system = this.dialogueSystem;
                break;
            case 'lighting':
                system = this.lightingSystem;
                break;
            case 'camera':
                system = this.cameraSystem;
                break;
            case 'character':
                system = this.character3DRenderer;
                break;
            case 'animation':
                system = this.animationSystem;
                break;
            default:
                console.warn(`Unknown system: ${action.system}`);
                return;
        }
        
        if (!system) {
            console.warn(`System not available: ${action.system}`);
            return;
        }
        
        const method = system[action.action];
        if (typeof method === 'function') {
            console.log(`Executing: ${action.system}.${action.action}`, action.params);
            await method.apply(system, action.params || []);
        } else {
            console.warn(`Method not found: ${action.system}.${action.action}`);
        }
    }
    
    /**
     * Get climax effect based on character and moment
     * @param {Object} config - Cinematic configuration
     * @returns {string} Effect name
     */
    getClimaxEffect(config) {
        const character = config.character?.model || 'eli';
        const animation = config.character?.animation || 'victory';
        
        // Map character and animation to climax effects
        const effectMap = {
            eli: {
                victory_celebration: 'victory_sparkles',
                champion_celebration: 'champion_sparkles',
                skill_showcase: 'skill_aura'
            },
            maya: {
                investigative_focus: 'data_revelation',
                eureka_moment: 'breakthrough_pulse',
                justice_stance: 'justice_aura'
            },
            stanley: {
                concerned_realization: 'security_scan',
                protective_action: 'shield_glow',
                leadership_address: 'leadership_aura'
            }
        };
        
        return effectMap[character]?.[animation] || 'cinematic_enhancement';
    }
    
    /**
     * End cinematic moment and cleanup
     */
    async endCinematicMoment() {
        console.log('Ending cinematic moment');
        
        // Clear all active timers
        this.clearActiveTimers();
        
        // Stop performance monitoring
        this.stopPerformanceMonitoring();
        
        // Ensure all systems are properly reset
        await this.ensureSystemsReset();
        
        // Reset state
        this.isActive = false;
        this.currentCinematic = null;
        this.orchestrationTimeline = [];
        
        // Dispatch completion event
        this.dispatchEvent('cinematicCompleted', {
            cinematicId: this.currentCinematic?.id
        });
        
        console.log('Cinematic moment ended');
    }
    
    /**
     * Emergency stop for error recovery
     */
    async emergencyStop() {
        console.warn('Emergency stop activated');
        
        // Clear all timers immediately
        this.clearActiveTimers();
        
        // Force stop all systems
        try {
            if (this.dialogueSystem?.isDialogueActive()) {
                this.dialogueSystem.stopDialogue();
            }
            
            if (this.lightingSystem?.isLightingActive()) {
                await this.lightingSystem.deactivateLightingTheme(500);
            }
            
            if (this.cameraSystem?.isCinematicActive()) {
                await this.cameraSystem.endCinematicSequence(500);
            }
            
        } catch (error) {
            console.error('Error during emergency stop:', error);
        }
        
        // Dispatch emergency stop event
        this.dispatchEvent('cinematicEmergencyStop', {
            cinematicId: this.currentCinematic?.id,
            error: 'Emergency stop activated'
        });
    }
    
    /**
     * Ensure all systems are properly reset
     */
    async ensureSystemsReset() {
        const resetPromises = [];
        
        // Reset dialogue system
        if (this.dialogueSystem?.isDialogueActive()) {
            this.dialogueSystem.stopDialogue();
        }
        
        // Reset lighting system
        if (this.lightingSystem?.isLightingActive()) {
            resetPromises.push(this.lightingSystem.deactivateLightingTheme(1000));
        }
        
        // Reset camera system
        if (this.cameraSystem?.isCinematicActive()) {
            resetPromises.push(this.cameraSystem.endCinematicSequence(1000));
        }
        
        await Promise.all(resetPromises);
    }
    
    /**
     * Clear all active timers
     */
    clearActiveTimers() {
        this.activeTimers.forEach(timer => clearTimeout(timer));
        this.activeTimers = [];
    }
    
    /**
     * Wait for orchestration completion
     * @param {number} duration - Duration to wait
     */
    async waitForCompletion(duration) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }
    
    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        this.performanceMetrics.lastFrameTime = Date.now();
        
        const monitor = () => {
            if (!this.isActive) return;
            
            const now = Date.now();
            const deltaTime = now - this.performanceMetrics.lastFrameTime;
            
            // Calculate frame rate
            this.performanceMetrics.frameRate = 1000 / deltaTime;
            this.performanceMetrics.lastFrameTime = now;
            
            // Monitor memory usage (if available)
            if (performance.memory) {
                this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
            }
            
            // Check for performance issues
            if (this.performanceMetrics.frameRate < 30) {
                console.warn('Low frame rate detected:', this.performanceMetrics.frameRate);
                this.dispatchEvent('performanceWarning', {
                    type: 'low_framerate',
                    value: this.performanceMetrics.frameRate
                });
            }
            
            if (this.performanceMetrics.memoryUsage > 100) {
                console.warn('High memory usage detected:', this.performanceMetrics.memoryUsage, 'MB');
                this.dispatchEvent('performanceWarning', {
                    type: 'high_memory',
                    value: this.performanceMetrics.memoryUsage
                });
            }
            
            requestAnimationFrame(monitor);
        };
        
        monitor();
    }
    
    /**
     * Stop performance monitoring
     */
    stopPerformanceMonitoring() {
        // Performance monitoring stops automatically when isActive becomes false
        console.log('Final performance metrics:', this.performanceMetrics);
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for dialogue events
        document.addEventListener('dialogueWordSpoken', (event) => {
            this.dispatchEvent('wordSpoken', event.detail);
        });
        
        document.addEventListener('dialogueStopped', () => {
            this.dispatchEvent('dialogueStopped');
        });
        
        console.log('Event listeners set up');
    }
    
    /**
     * Dispatch custom event
     * @param {string} eventName - Event name
     * @param {Object} detail - Event detail
     */
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(`cinematic${eventName}`, {
            detail: {
                ...detail,
                timestamp: Date.now(),
                cinematicId: this.currentCinematic?.id
            }
        });
        
        document.dispatchEvent(event);
    }
    
    /**
     * Add event listener for cinematic events
     * @param {string} eventName - Event name (without 'cinematic' prefix)
     * @param {Function} callback - Event callback
     */
    addEventListener(eventName, callback) {
        const fullEventName = `cinematic${eventName}`;
        
        if (!this.eventListeners.has(fullEventName)) {
            this.eventListeners.set(fullEventName, []);
        }
        
        this.eventListeners.get(fullEventName).push(callback);
        document.addEventListener(fullEventName, callback);
        
        console.log(`Event listener added: ${fullEventName}`);
    }
    
    /**
     * Remove event listener
     * @param {string} eventName - Event name (without 'cinematic' prefix)
     * @param {Function} callback - Event callback
     */
    removeEventListener(eventName, callback) {
        const fullEventName = `cinematic${eventName}`;
        
        document.removeEventListener(fullEventName, callback);
        
        if (this.eventListeners.has(fullEventName)) {
            const callbacks = this.eventListeners.get(fullEventName);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
        
        console.log(`Event listener removed: ${fullEventName}`);
    }
    
    /**
     * Get current orchestration status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            isActive: this.isActive,
            currentCinematic: this.currentCinematic?.id || null,
            phase: this.getCurrentPhase(),
            performanceMetrics: { ...this.performanceMetrics },
            systemStatus: {
                dialogue: this.dialogueSystem?.isDialogueActive() || false,
                lighting: this.lightingSystem?.isLightingActive() || false,
                camera: this.cameraSystem?.isCinematicActive() || false
            }
        };
    }
    
    /**
     * Get current orchestration phase
     * @returns {string} Current phase name
     */
    getCurrentPhase() {
        if (!this.isActive || !this.currentCinematic) {
            return 'inactive';
        }
        
        const elapsed = Date.now() - (this.currentCinematic.startTime || 0);
        
        for (let i = this.orchestrationTimeline.length - 1; i >= 0; i--) {
            if (elapsed >= this.orchestrationTimeline[i].time) {
                return this.orchestrationTimeline[i].phase;
            }
        }
        
        return 'setup';
    }
    
    /**
     * Check if orchestration is active
     * @returns {boolean} Whether orchestration is active
     */
    isOrchestrationActive() {
        return this.isActive;
    }
    
    /**
     * Cleanup orchestration system
     */
    cleanup() {
        if (this.isActive) {
            this.emergencyStop();
        }
        
        // Remove all event listeners
        this.eventListeners.forEach((callbacks, eventName) => {
            callbacks.forEach(callback => {
                document.removeEventListener(eventName, callback);
            });
        });
        
        this.eventListeners.clear();
        
        // Cleanup sub-systems
        if (this.lightingSystem?.cleanup) {
            this.lightingSystem.cleanup();
        }
        
        if (this.cameraSystem?.cleanup) {
            this.cameraSystem.cleanup();
        }
        
        console.log('Cinematic Orchestration System cleaned up');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CinematicOrchestrationSystem;
} else if (typeof window !== 'undefined') {
    window.CinematicOrchestrationSystem = CinematicOrchestrationSystem;
}

console.log('Cinematic Orchestration System loaded');