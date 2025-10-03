/**
 * Eli's 3D Character Integration
 * Combines configuration, NeRF processing, and animation systems
 */

class Eli3DIntegration {
    constructor() {
        this.characterId = 'eli';
        this.config = null;
        this.nerfProcessor = null;
        this.animationSystem = null;
        this.isInitialized = false;
        this.model = null;
        this.currentCinematicMoment = null;
        
        // Integration status
        this.status = {
            configLoaded: false,
            modelProcessed: false,
            animationsReady: false,
            fullyIntegrated: false
        };
    }
    
    /**
     * Initialize Eli's complete 3D system
     */
    async initialize(character3DRenderer) {
        console.log('Initializing Eli 3D Integration...');
        
        try {
            // Load configuration
            this.config = new Eli3DConfig();
            this.status.configLoaded = true;
            
            // Initialize NeRF processor
            this.nerfProcessor = new EliNeRFProcessor();
            
            // Initialize animation system
            this.animationSystem = new EliAnimationSystem(character3DRenderer);
            
            console.log('Eli 3D Integration initialized successfully');
            this.isInitialized = true;
            
            return {
                success: true,
                characterId: this.characterId,
                status: this.status
            };
            
        } catch (error) {
            console.error('Failed to initialize Eli 3D Integration:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Process Eli's reference images and create 3D model
     */
    async processCharacterModel(referenceImages) {
        if (!this.isInitialized) {
            throw new Error('Integration not initialized');
        }
        
        console.log('Processing Eli character model...');
        
        try {
            // Validate setup
            const validation = this.config.validateSetup(referenceImages);
            if (!validation.valid) {
                throw new Error(`Setup validation failed: ${validation.errors.join(', ')}`);
            }
            
            // Process through NeRF pipeline
            const processingResult = await this.nerfProcessor.processEliImages(referenceImages);
            
            if (!processingResult.success) {
                throw new Error(`NeRF processing failed: ${processingResult.error}`);
            }
            
            // Store model reference
            this.model = processingResult.model;
            this.status.modelProcessed = true;
            
            // Initialize animations with processed model
            await this.animationSystem.initialize(this.model);
            this.status.animationsReady = true;
            
            // Mark as fully integrated
            this.status.fullyIntegrated = true;
            
            console.log('Eli character model processed successfully');
            
            return {
                success: true,
                model: this.model,
                metadata: processingResult.metadata,
                status: this.status
            };
            
        } catch (error) {
            console.error('Character model processing failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Trigger a cinematic moment for Eli
     */
    async triggerCinematicMoment(momentName, context = {}) {
        if (!this.status.fullyIntegrated) {
            console.warn('Eli 3D system not fully integrated, skipping cinematic moment');
            return { success: false, reason: 'not_integrated' };
        }
        
        const cinematicMoment = this.config.getCinematicMoment(momentName);
        if (!cinematicMoment) {
            console.error(`Unknown cinematic moment: ${momentName}`);
            return { success: false, reason: 'unknown_moment' };
        }
        
        console.log(`Triggering Eli cinematic moment: ${momentName}`);
        this.currentCinematicMoment = cinematicMoment;
        
        try {
            // Set up lighting for the moment
            const lighting = this.config.getLightingForMoment(cinematicMoment.lighting || momentName);
            await this.applyLighting(lighting);
            
            // Play the associated animation
            await this.animationSystem.playVictoryAnimation(cinematicMoment.animation);
            
            // Return dialogue and timing information
            return {
                success: true,
                dialogue: cinematicMoment.dialogue,
                duration: cinematicMoment.duration,
                effects: cinematicMoment.effects,
                momentName: momentName
            };
            
        } catch (error) {
            console.error('Cinematic moment failed:', error);
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.currentCinematicMoment = null;
        }
    }
    
    /**
     * Apply lighting configuration
     */
    async applyLighting(lightingConfig) {
        // In production, would apply to actual Three.js scene
        console.log('Applying Eli lighting configuration:', lightingConfig.primary.color);
        
        // Mock lighting application
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Lighting applied successfully');
                resolve();
            }, 200);
        });
    }
    
    /**
     * Get Eli's current configuration
     */
    getConfiguration() {
        return this.config ? this.config.exportConfig() : null;
    }
    
    /**
     * Get processing status
     */
    getStatus() {
        return {
            ...this.status,
            isInitialized: this.isInitialized,
            hasModel: !!this.model,
            currentMoment: this.currentCinematicMoment?.trigger || null
        };
    }
    
    /**
     * Get available cinematic moments
     */
    getAvailableCinematicMoments() {
        if (!this.config) return [];
        
        return Object.keys(this.config.cinematicMoments).map(key => ({
            name: key,
            trigger: this.config.cinematicMoments[key].trigger,
            condition: this.config.cinematicMoments[key].condition,
            duration: this.config.cinematicMoments[key].duration
        }));
    }
    
    /**
     * Check if a cinematic moment should be triggered
     */
    shouldTriggerCinematicMoment(currentArea, gameState) {
        if (!this.config) return null;
        
        for (const [momentName, moment] of Object.entries(this.config.cinematicMoments)) {
            if (moment.trigger === currentArea && this.checkCondition(moment.condition, gameState)) {
                return momentName;
            }
        }
        
        return null;
    }
    
    /**
     * Check if a cinematic condition is met
     */
    checkCondition(condition, gameState) {
        // Mock condition checking - in production would check actual game state
        switch (condition) {
            case 'first_tournament_win':
                return gameState.tournamentsWon >= 1;
            case 'peer_pressure_peak':
                return gameState.communityPressure >= 0.8;
            case 'final_victory':
                return gameState.championshipWon === true;
            default:
                return false;
        }
    }
    
    /**
     * Update integration (call in render loop)
     */
    update() {
        if (this.animationSystem) {
            this.animationSystem.update();
        }
    }
    
    /**
     * Clean up resources
     */
    dispose() {
        if (this.animationSystem) {
            this.animationSystem.stopAnimation();
        }
        
        this.model = null;
        this.currentCinematicMoment = null;
        this.isInitialized = false;
        
        // Reset status
        this.status = {
            configLoaded: false,
            modelProcessed: false,
            animationsReady: false,
            fullyIntegrated: false
        };
        
        console.log('Eli 3D Integration disposed');
    }
    
    /**
     * Export integration data for debugging
     */
    exportDebugData() {
        return {
            characterId: this.characterId,
            status: this.getStatus(),
            config: this.getConfiguration(),
            availableMoments: this.getAvailableCinematicMoments(),
            model: this.model ? {
                path: this.model.path,
                size: this.model.size,
                vertices: this.model.vertices
            } : null
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Eli3DIntegration;
} else if (typeof window !== 'undefined') {
    window.Eli3DIntegration = Eli3DIntegration;
}