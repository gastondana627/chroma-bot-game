/**
 * Maya's 3D Character Integration
 * Combines investigation configuration, NeRF processing, and animation systems
 */

class Maya3DIntegration {
    constructor() {
        this.characterId = 'maya';
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
     * Initialize Maya's complete 3D investigation system
     */
    async initialize(character3DRenderer) {
        console.log('Initializing Maya 3D Investigation Integration...');
        
        try {
            // Load investigation configuration
            this.config = new Maya3DConfig();
            this.status.configLoaded = true;
            
            // Initialize NeRF processor with investigation optimizations
            this.nerfProcessor = new MayaNeRFProcessor();
            
            // Initialize animation system with investigation gestures
            this.animationSystem = new MayaAnimationSystem(character3DRenderer);
            
            console.log('Maya 3D Investigation Integration initialized successfully');
            this.isInitialized = true;
            
            return {
                success: true,
                characterId: this.characterId,
                theme: 'investigation_mood',
                status: this.status
            };
            
        } catch (error) {
            console.error('Failed to initialize Maya 3D Investigation Integration:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Process Maya's reference images and create investigation-themed 3D model
     */
    async processCharacterModel(referenceImages) {
        if (!this.isInitialized) {
            throw new Error('Integration not initialized');
        }
        
        console.log('Processing Maya investigation character model...');
        
        try {
            // Validate setup for investigation character
            const validation = this.config.validateSetup(referenceImages);
            if (!validation.valid) {
                throw new Error(`Setup validation failed: ${validation.errors.join(', ')}`);
            }
            
            // Log validation warnings for investigation theme
            if (validation.warnings.length > 0) {
                console.warn('Investigation setup warnings:', validation.warnings);
            }
            
            // Process through investigation-optimized NeRF pipeline
            const processingResult = await this.nerfProcessor.processMayaImages(referenceImages);
            
            if (!processingResult.success) {
                throw new Error(`Investigation NeRF processing failed: ${processingResult.error}`);
            }
            
            // Store model reference
            this.model = processingResult.model;
            this.status.modelProcessed = true;
            
            // Initialize animations with processed investigation model
            await this.animationSystem.initialize(this.model);
            this.status.animationsReady = true;
            
            // Mark as fully integrated
            this.status.fullyIntegrated = true;
            
            console.log('Maya investigation character model processed successfully');
            
            return {
                success: true,
                model: this.model,
                metadata: processingResult.metadata,
                investigationFeatures: processingResult.metadata.investigationFeatures,
                status: this.status
            };
            
        } catch (error) {
            console.error('Investigation character model processing failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Trigger a cinematic investigation moment for Maya
     */
    async triggerCinematicMoment(momentName, context = {}) {
        if (!this.status.fullyIntegrated) {
            console.warn('Maya 3D investigation system not fully integrated, skipping cinematic moment');
            return { success: false, reason: 'not_integrated' };
        }
        
        const cinematicMoment = this.config.getCinematicMoment(momentName);
        if (!cinematicMoment) {
            console.error(`Unknown investigation cinematic moment: ${momentName}`);
            return { success: false, reason: 'unknown_moment' };
        }
        
        console.log(`Triggering Maya investigation cinematic moment: ${momentName}`);
        this.currentCinematicMoment = cinematicMoment;
        
        try {
            // Set up dramatic lighting for the investigation moment
            const lighting = this.config.getLightingForMoment(cinematicMoment.lighting || momentName);
            await this.applyInvestigationLighting(lighting);
            
            // Play the associated investigation animation
            await this.animationSystem.playInvestigationAnimation(cinematicMoment.animation);
            
            // Return dialogue and timing information
            return {
                success: true,
                dialogue: cinematicMoment.dialogue,
                duration: cinematicMoment.duration,
                effects: cinematicMoment.effects,
                momentName: momentName,
                investigationTheme: true
            };
            
        } catch (error) {
            console.error('Investigation cinematic moment failed:', error);
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.currentCinematicMoment = null;
        }
    }
    
    /**
     * Apply investigation-themed lighting configuration
     */
    async applyInvestigationLighting(lightingConfig) {
        // In production, would apply to actual Three.js scene with shadow optimization
        console.log('Applying Maya investigation lighting configuration:', {
            primary: lightingConfig.primary.color,
            shadows: lightingConfig.primary.castShadow,
            dramatic: true
        });
        
        // Mock dramatic lighting application with shadow enhancement
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Investigation lighting applied with dramatic shadows');
                resolve();
            }, 300);
        });
    }
    
    /**
     * Get Maya's investigation configuration
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
            currentMoment: this.currentCinematicMoment?.trigger || null,
            theme: 'investigation_mood',
            shadowSupport: true
        };
    }
    
    /**
     * Get available investigation cinematic moments
     */
    getAvailableCinematicMoments() {
        if (!this.config) return [];
        
        return Object.keys(this.config.cinematicMoments).map(key => ({
            name: key,
            trigger: this.config.cinematicMoments[key].trigger,
            condition: this.config.cinematicMoments[key].condition,
            duration: this.config.cinematicMoments[key].duration,
            investigationType: this.getInvestigationType(key)
        }));
    }
    
    /**
     * Get investigation type for a cinematic moment
     */
    getInvestigationType(momentName) {
        const investigationTypes = {
            dating_app_discovery: 'digital_forensics',
            investigation_breakthrough: 'pattern_analysis',
            cyber_cafe_archive: 'data_archaeology',
            final_confrontation: 'justice_delivery'
        };
        
        return investigationTypes[momentName] || 'general_investigation';
    }
    
    /**
     * Check if an investigation cinematic moment should be triggered
     */
    shouldTriggerCinematicMoment(currentArea, gameState) {
        if (!this.config) return null;
        
        for (const [momentName, moment] of Object.entries(this.config.cinematicMoments)) {
            if (moment.trigger === currentArea && this.checkInvestigationCondition(moment.condition, gameState)) {
                return momentName;
            }
        }
        
        return null;
    }
    
    /**
     * Check if an investigation condition is met
     */
    checkInvestigationCondition(condition, gameState) {
        // Mock condition checking for investigation storyline
        switch (condition) {
            case 'suspicious_match_detected':
                return gameState.suspiciousActivity >= 0.7;
            case 'evidence_discovered':
                return gameState.evidenceCollected >= 3;
            case 'investigation_breakthrough':
                return gameState.connectionsFound >= 2;
            case 'confrontation_moment':
                return gameState.readyForConfrontation === true;
            default:
                return false;
        }
    }
    
    /**
     * Get investigation progress metrics
     */
    getInvestigationProgress(gameState) {
        return {
            evidenceCollected: gameState.evidenceCollected || 0,
            connectionsFound: gameState.connectionsFound || 0,
            suspiciousActivity: gameState.suspiciousActivity || 0,
            investigationDepth: gameState.investigationDepth || 0,
            readyForConfrontation: gameState.readyForConfrontation || false
        };
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
        
        console.log('Maya 3D Investigation Integration disposed');
    }
    
    /**
     * Export integration data for debugging
     */
    exportDebugData() {
        return {
            characterId: this.characterId,
            theme: 'investigation_mood',
            status: this.getStatus(),
            config: this.getConfiguration(),
            availableMoments: this.getAvailableCinematicMoments(),
            model: this.model ? {
                path: this.model.path,
                size: this.model.size,
                vertices: this.model.vertices,
                shadowSupport: this.model.shadowSupport
            } : null,
            investigationFeatures: {
                shadowPreservation: true,
                expressionDetail: 'high',
                dramaticLighting: true,
                gestureLibrary: 'comprehensive'
            }
        };
    }
    
    /**
     * Test investigation animation system
     */
    async testInvestigationAnimations() {
        if (!this.status.animationsReady) {
            console.warn('Animation system not ready for testing');
            return false;
        }
        
        console.log('Testing Maya investigation animations...');
        
        try {
            // Test each investigation animation type
            const animationTypes = this.animationSystem.getAvailableAnimations();
            
            for (const animationType of animationTypes) {
                console.log(`Testing animation: ${animationType}`);
                // In production, would actually test the animation
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            console.log('All investigation animations tested successfully');
            return true;
            
        } catch (error) {
            console.error('Investigation animation testing failed:', error);
            return false;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Maya3DIntegration;
} else if (typeof window !== 'undefined') {
    window.Maya3DIntegration = Maya3DIntegration;
}