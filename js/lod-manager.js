/**
 * Level of Detail (LOD) Manager
 * Manages dynamic quality adjustment for 3D character models
 * Works with Gaussian Splatting Optimizer for device-specific optimizations
 */

class LODManager {
    constructor(gaussianOptimizer) {
        this.gaussianOptimizer = gaussianOptimizer;
        this.activeCharacters = new Map();
        this.lodCache = new Map();
        this.updateInterval = null;
        this.updateFrequency = 100; // Update every 100ms
        
        // Distance calculation settings
        this.cameraPosition = { x: 0, y: 0, z: 5 };
        this.lodTransitionSmoothness = 0.1; // Smoothing factor for LOD transitions
        
        // Performance tracking
        this.performanceHistory = [];
        this.maxHistoryLength = 60; // Keep 60 samples (6 seconds at 10fps)
    }

    /**
     * Initialize the LOD Manager
     */
    async initialize() {
        console.log('Initializing LOD Manager...');
        
        try {
            // Ensure Gaussian Splatting Optimizer is initialized
            if (!this.gaussianOptimizer) {
                throw new Error('Gaussian Splatting Optimizer is required');
            }
            
            // Start automatic LOD updates
            this.startLODUpdates();
            
            // Listen for performance optimization events
            this.setupPerformanceListeners();
            
            console.log('LOD Manager initialized successfully');
            return true;
            
        } catch (error) {
            console.error('Failed to initialize LOD Manager:', error);
            throw error;
        }
    }

    /**
     * Register a character for LOD management
     */
    registerCharacter(characterId, characterModel, position = { x: 0, y: 0, z: 0 }) {
        const characterData = {
            id: characterId,
            model: characterModel,
            position,
            currentLOD: 0,
            targetLOD: 0,
            lastDistance: 0,
            lastUpdate: Date.now(),
            transitionProgress: 0,
            isTransitioning: false
        };
        
        this.activeCharacters.set(characterId, characterData);
        
        // Generate initial LOD cache for this character
        this.generateLODCache(characterId, characterModel);
        
        console.log(`Registered character ${characterId} for LOD management`);
        
        return characterData;
    }

    /**
     * Unregister a character from LOD management
     */
    unregisterCharacter(characterId) {
        this.activeCharacters.delete(characterId);
        this.lodCache.delete(characterId);
        
        console.log(`Unregistered character ${characterId} from LOD management`);
    }

    /**
     * Update camera position for distance calculations
     */
    updateCameraPosition(position) {
        this.cameraPosition = { ...position };
        
        // Trigger immediate LOD update for all characters
        this.updateAllCharacterLODs();
    }

    /**
     * Generate LOD cache for a character
     */
    generateLODCache(characterId, baseModel) {
        const lodCache = new Map();
        
        // Generate LOD models for each level (0-3)
        for (let lodLevel = 0; lodLevel <= 3; lodLevel++) {
            const distance = lodLevel * 10 + 5; // Approximate distance for this LOD
            const optimizedModel = this.gaussianOptimizer.optimizeCharacterModel(baseModel, distance);
            
            lodCache.set(lodLevel, {
                model: optimizedModel,
                lodLevel,
                distance,
                generated: Date.now()
            });
        }
        
        this.lodCache.set(characterId, lodCache);
        console.log(`Generated LOD cache for character ${characterId}`);
    }

    /**
     * Calculate distance between camera and character
     */
    calculateDistance(characterPosition) {
        const dx = this.cameraPosition.x - characterPosition.x;
        const dy = this.cameraPosition.y - characterPosition.y;
        const dz = this.cameraPosition.z - characterPosition.z;
        
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Determine appropriate LOD level based on distance and performance
     */
    determineLODLevel(distance, characterId) {
        const optimizationStatus = this.gaussianOptimizer.getOptimizationStatus();
        const profile = optimizationStatus.activeProfile;
        
        // Get base LOD from distance
        let baseLOD = 0;
        const lodDistances = optimizationStatus.thresholds.lodSwitchDistance;
        
        for (let i = 0; i < lodDistances.length; i++) {
            if (distance > lodDistances[i]) {
                baseLOD = i + 1;
            }
        }
        
        // Adjust based on performance
        const performanceAdjustment = this.getPerformanceAdjustment();
        const finalLOD = Math.min(3, Math.max(0, baseLOD + performanceAdjustment));
        
        return finalLOD;
    }

    /**
     * Get performance-based LOD adjustment
     */
    getPerformanceAdjustment() {
        const metrics = this.gaussianOptimizer.getOptimizationStatus().performanceMetrics;
        const targetFPS = this.gaussianOptimizer.getOptimizationStatus().thresholds?.targetFrameRate || 30;
        
        // Calculate performance ratio
        const performanceRatio = metrics.frameRate / targetFPS;
        
        if (performanceRatio < 0.7) {
            return 2; // Significant performance issues, increase LOD by 2
        } else if (performanceRatio < 0.85) {
            return 1; // Minor performance issues, increase LOD by 1
        } else if (performanceRatio > 1.2) {
            return -1; // Good performance, can decrease LOD for better quality
        }
        
        return 0; // No adjustment needed
    }

    /**
     * Update LOD for a specific character
     */
    updateCharacterLOD(characterId) {
        const characterData = this.activeCharacters.get(characterId);
        if (!characterData) return;
        
        const distance = this.calculateDistance(characterData.position);
        const targetLOD = this.determineLODLevel(distance, characterId);
        
        characterData.lastDistance = distance;
        
        // Check if LOD change is needed
        if (targetLOD !== characterData.currentLOD) {
            this.initiateLODTransition(characterId, targetLOD);
        }
        
        // Update transition if in progress
        if (characterData.isTransitioning) {
            this.updateLODTransition(characterId);
        }
    }

    /**
     * Initiate smooth LOD transition
     */
    initiateLODTransition(characterId, targetLOD) {
        const characterData = this.activeCharacters.get(characterId);
        if (!characterData) return;
        
        characterData.targetLOD = targetLOD;
        characterData.isTransitioning = true;
        characterData.transitionProgress = 0;
        
        console.log(`Initiating LOD transition for ${characterId}: ${characterData.currentLOD} -> ${targetLOD}`);
    }

    /**
     * Update ongoing LOD transition
     */
    updateLODTransition(characterId) {
        const characterData = this.activeCharacters.get(characterId);
        if (!characterData || !characterData.isTransitioning) return;
        
        // Update transition progress
        characterData.transitionProgress += this.lodTransitionSmoothness;
        
        if (characterData.transitionProgress >= 1.0) {
            // Transition complete
            characterData.currentLOD = characterData.targetLOD;
            characterData.isTransitioning = false;
            characterData.transitionProgress = 0;
            
            // Apply the new LOD model
            this.applyLODModel(characterId, characterData.currentLOD);
            
            console.log(`LOD transition completed for ${characterId}, now at LOD ${characterData.currentLOD}`);
        } else {
            // Transition in progress - could implement blending here
            this.updateTransitionBlending(characterId, characterData.transitionProgress);
        }
    }

    /**
     * Apply LOD model to character
     */
    applyLODModel(characterId, lodLevel) {
        const lodCache = this.lodCache.get(characterId);
        if (!lodCache || !lodCache.has(lodLevel)) {
            console.warn(`LOD model not found for ${characterId} at level ${lodLevel}`);
            return;
        }
        
        const lodModel = lodCache.get(lodLevel);
        
        // Emit event for 3D renderer to update the model
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('lodModelUpdate', {
                detail: {
                    characterId,
                    lodLevel,
                    model: lodModel.model,
                    distance: this.activeCharacters.get(characterId)?.lastDistance
                }
            }));
        }
    }

    /**
     * Update transition blending (for smooth LOD transitions)
     */
    updateTransitionBlending(characterId, progress) {
        const characterData = this.activeCharacters.get(characterId);
        if (!characterData) return;
        
        // Emit event for renderer to handle blending between LOD levels
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('lodTransitionUpdate', {
                detail: {
                    characterId,
                    fromLOD: characterData.currentLOD,
                    toLOD: characterData.targetLOD,
                    progress,
                    blendFactor: this.calculateBlendFactor(progress)
                }
            }));
        }
    }

    /**
     * Calculate blend factor for smooth transitions
     */
    calculateBlendFactor(progress) {
        // Use smooth step function for natural transition
        return progress * progress * (3 - 2 * progress);
    }

    /**
     * Update all character LODs
     */
    updateAllCharacterLODs() {
        for (const characterId of this.activeCharacters.keys()) {
            this.updateCharacterLOD(characterId);
        }
    }

    /**
     * Start automatic LOD updates
     */
    startLODUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(() => {
            this.updateAllCharacterLODs();
            this.updatePerformanceHistory();
        }, this.updateFrequency);
        
        console.log(`Started automatic LOD updates every ${this.updateFrequency}ms`);
    }

    /**
     * Stop automatic LOD updates
     */
    stopLODUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        console.log('Stopped automatic LOD updates');
    }

    /**
     * Update performance history for trend analysis
     */
    updatePerformanceHistory() {
        const metrics = this.gaussianOptimizer.getOptimizationStatus().performanceMetrics;
        
        this.performanceHistory.push({
            timestamp: Date.now(),
            frameRate: metrics.frameRate,
            memoryUsage: metrics.memoryUsage,
            renderTime: metrics.renderTime
        });
        
        // Keep history within limits
        if (this.performanceHistory.length > this.maxHistoryLength) {
            this.performanceHistory.shift();
        }
    }

    /**
     * Setup performance event listeners
     */
    setupPerformanceListeners() {
        if (typeof window !== 'undefined') {
            window.addEventListener('gaussianSplattingOptimization', (event) => {
                const { optimizations, metrics } = event.detail;
                
                // Respond to optimization events by adjusting LOD more aggressively
                if (optimizations.includes('reduce_quality')) {
                    this.forceLODIncrease();
                }
                
                if (optimizations.includes('reduce_memory')) {
                    this.optimizeMemoryUsage();
                }
            });
        }
    }

    /**
     * Force LOD increase for all characters (lower quality)
     */
    forceLODIncrease() {
        console.log('Forcing LOD increase due to performance issues');
        
        for (const [characterId, characterData] of this.activeCharacters) {
            const newLOD = Math.min(3, characterData.currentLOD + 1);
            if (newLOD !== characterData.currentLOD) {
                this.initiateLODTransition(characterId, newLOD);
            }
        }
    }

    /**
     * Optimize memory usage by reducing LOD cache
     */
    optimizeMemoryUsage() {
        console.log('Optimizing memory usage by reducing LOD cache');
        
        // Remove higher quality LOD models from cache
        for (const [characterId, lodCache] of this.lodCache) {
            if (lodCache.has(0)) {
                lodCache.delete(0); // Remove highest quality LOD
            }
        }
    }

    /**
     * Get LOD status for all characters
     */
    getLODStatus() {
        const status = {};
        
        for (const [characterId, characterData] of this.activeCharacters) {
            status[characterId] = {
                currentLOD: characterData.currentLOD,
                targetLOD: characterData.targetLOD,
                distance: characterData.lastDistance,
                isTransitioning: characterData.isTransitioning,
                transitionProgress: characterData.transitionProgress,
                position: characterData.position
            };
        }
        
        return {
            characters: status,
            cameraPosition: this.cameraPosition,
            performanceHistory: this.performanceHistory.slice(-10), // Last 10 samples
            updateFrequency: this.updateFrequency
        };
    }

    /**
     * Manually set LOD for a character (for testing/debugging)
     */
    setCharacterLOD(characterId, lodLevel) {
        const characterData = this.activeCharacters.get(characterId);
        if (!characterData) {
            throw new Error(`Character ${characterId} not registered`);
        }
        
        if (lodLevel < 0 || lodLevel > 3) {
            throw new Error('LOD level must be between 0 and 3');
        }
        
        this.initiateLODTransition(characterId, lodLevel);
        console.log(`Manually set LOD for ${characterId} to level ${lodLevel}`);
    }

    /**
     * Get recommended LOD settings for current conditions
     */
    getRecommendedSettings() {
        const optimizationStatus = this.gaussianOptimizer.getOptimizationStatus();
        const performanceAdjustment = this.getPerformanceAdjustment();
        
        return {
            recommendedBaseLOD: Math.max(0, 1 + performanceAdjustment),
            performanceAdjustment,
            currentProfile: optimizationStatus.activeProfile,
            frameRate: optimizationStatus.performanceMetrics.frameRate,
            memoryUsage: optimizationStatus.performanceMetrics.memoryUsage,
            activeCharacters: this.activeCharacters.size
        };
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        this.stopLODUpdates();
        this.activeCharacters.clear();
        this.lodCache.clear();
        this.performanceHistory = [];
        
        console.log('LOD Manager cleaned up');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LODManager;
} else if (typeof window !== 'undefined') {
    window.LODManager = LODManager;
}