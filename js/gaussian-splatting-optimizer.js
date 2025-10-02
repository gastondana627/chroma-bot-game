/**
 * Gaussian Splatting Optimization System
 * Provides real-time rendering optimization for 3D character models
 * Implements level-of-detail system for different device capabilities
 */

class GaussianSplattingOptimizer {
    constructor() {
        this.deviceCapabilities = null;
        this.lodLevels = new Map();
        this.renderingProfiles = new Map();
        this.activeOptimizations = new Set();
        this.performanceMetrics = {
            frameRate: 0,
            memoryUsage: 0,
            renderTime: 0,
            lastUpdate: 0
        };
        
        // Optimization thresholds
        this.thresholds = {
            targetFrameRate: 30,
            maxMemoryUsage: 100 * 1024 * 1024, // 100MB
            maxRenderTime: 33, // 33ms for 30fps
            lodSwitchDistance: [5, 15, 30] // Distance thresholds for LOD switching
        };
    }

    /**
     * Initialize the Gaussian Splatting optimizer
     */
    async initialize() {
        console.log('Initializing Gaussian Splatting Optimizer...');
        
        try {
            // Detect device capabilities
            this.deviceCapabilities = await this.detectDeviceCapabilities();
            
            // Initialize LOD levels
            this.initializeLODLevels();
            
            // Create rendering profiles
            this.createRenderingProfiles();
            
            // Start performance monitoring
            this.startPerformanceMonitoring();
            
            console.log('Gaussian Splatting Optimizer initialized successfully');
            console.log('Device profile:', this.deviceCapabilities.profile);
            
            return true;
            
        } catch (error) {
            console.error('Failed to initialize Gaussian Splatting Optimizer:', error);
            throw error;
        }
    }

    /**
     * Detect device capabilities for optimization
     */
    async detectDeviceCapabilities() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        if (!gl) {
            throw new Error('WebGL not supported');
        }
        
        // Get GPU information
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
        const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';
        
        // Get memory information
        const memoryInfo = gl.getExtension('WEBGL_lose_context');
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        
        // Detect device type and performance tier
        const deviceType = this.detectDeviceType();
        const performanceTier = this.detectPerformanceTier(renderer, deviceType);
        
        const capabilities = {
            webglVersion: gl instanceof WebGL2RenderingContext ? 2 : 1,
            renderer,
            vendor,
            maxTextureSize,
            maxVertexAttribs,
            deviceType,
            performanceTier,
            profile: this.getOptimizationProfile(performanceTier, deviceType),
            extensions: {
                instancedArrays: !!gl.getExtension('ANGLE_instanced_arrays'),
                vertexArrayObject: !!gl.getExtension('OES_vertex_array_object'),
                textureFloat: !!gl.getExtension('OES_texture_float'),
                depthTexture: !!gl.getExtension('WEBGL_depth_texture')
            }
        };
        
        // Clean up
        canvas.remove();
        
        return capabilities;
    }

    /**
     * Detect device type (mobile, tablet, desktop)
     */
    detectDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        const isTablet = /tablet|ipad/i.test(userAgent);
        
        if (isMobile) return 'mobile';
        if (isTablet) return 'tablet';
        return 'desktop';
    }

    /**
     * Detect performance tier based on GPU and device
     */
    detectPerformanceTier(renderer, deviceType) {
        const lowEndGPUs = ['intel', 'integrated', 'mali', 'adreno 3', 'adreno 4'];
        const highEndGPUs = ['nvidia', 'amd', 'radeon', 'geforce', 'quadro'];
        
        const rendererLower = renderer.toLowerCase();
        
        // Check for high-end GPUs
        if (highEndGPUs.some(gpu => rendererLower.includes(gpu))) {
            return deviceType === 'mobile' ? 'medium' : 'high';
        }
        
        // Check for low-end GPUs
        if (lowEndGPUs.some(gpu => rendererLower.includes(gpu))) {
            return 'low';
        }
        
        // Default based on device type
        return deviceType === 'desktop' ? 'medium' : 'low';
    }

    /**
     * Get optimization profile based on performance tier and device type
     */
    getOptimizationProfile(performanceTier, deviceType) {
        const profiles = {
            'high-desktop': 'ultra',
            'high-tablet': 'high',
            'high-mobile': 'medium',
            'medium-desktop': 'high',
            'medium-tablet': 'medium',
            'medium-mobile': 'low',
            'low-desktop': 'medium',
            'low-tablet': 'low',
            'low-mobile': 'minimal'
        };
        
        return profiles[`${performanceTier}-${deviceType}`] || 'low';
    }

    /**
     * Initialize Level of Detail (LOD) levels
     */
    initializeLODLevels() {
        // LOD 0 - Highest quality
        this.lodLevels.set(0, {
            splatCount: 100000,
            textureResolution: 2048,
            shaderComplexity: 'high',
            shadowQuality: 'high',
            particleEffects: true,
            postProcessing: true,
            maxDistance: 5
        });
        
        // LOD 1 - Medium quality
        this.lodLevels.set(1, {
            splatCount: 50000,
            textureResolution: 1024,
            shaderComplexity: 'medium',
            shadowQuality: 'medium',
            particleEffects: true,
            postProcessing: false,
            maxDistance: 15
        });
        
        // LOD 2 - Low quality
        this.lodLevels.set(2, {
            splatCount: 25000,
            textureResolution: 512,
            shaderComplexity: 'low',
            shadowQuality: 'low',
            particleEffects: false,
            postProcessing: false,
            maxDistance: 30
        });
        
        // LOD 3 - Minimal quality
        this.lodLevels.set(3, {
            splatCount: 10000,
            textureResolution: 256,
            shaderComplexity: 'minimal',
            shadowQuality: 'none',
            particleEffects: false,
            postProcessing: false,
            maxDistance: Infinity
        });
    }

    /**
     * Create rendering profiles for different device capabilities
     */
    createRenderingProfiles() {
        // Ultra profile (high-end desktop)
        this.renderingProfiles.set('ultra', {
            defaultLOD: 0,
            maxLOD: 1,
            adaptiveLOD: true,
            gaussianSplats: {
                maxSplats: 100000,
                splatSize: 1.0,
                opacity: 1.0,
                blending: 'alpha'
            },
            rendering: {
                antialiasing: 'MSAA4x',
                shadowMaps: true,
                reflections: true,
                ambientOcclusion: true
            },
            performance: {
                targetFPS: 60,
                maxMemory: 200 * 1024 * 1024
            }
        });
        
        // High profile (mid-range desktop/high-end mobile)
        this.renderingProfiles.set('high', {
            defaultLOD: 1,
            maxLOD: 2,
            adaptiveLOD: true,
            gaussianSplats: {
                maxSplats: 50000,
                splatSize: 0.8,
                opacity: 0.9,
                blending: 'alpha'
            },
            rendering: {
                antialiasing: 'FXAA',
                shadowMaps: true,
                reflections: false,
                ambientOcclusion: false
            },
            performance: {
                targetFPS: 30,
                maxMemory: 100 * 1024 * 1024
            }
        });
        
        // Medium profile (tablets/mid-range mobile)
        this.renderingProfiles.set('medium', {
            defaultLOD: 2,
            maxLOD: 3,
            adaptiveLOD: true,
            gaussianSplats: {
                maxSplats: 25000,
                splatSize: 0.6,
                opacity: 0.8,
                blending: 'additive'
            },
            rendering: {
                antialiasing: 'none',
                shadowMaps: false,
                reflections: false,
                ambientOcclusion: false
            },
            performance: {
                targetFPS: 30,
                maxMemory: 50 * 1024 * 1024
            }
        });
        
        // Low profile (low-end mobile)
        this.renderingProfiles.set('low', {
            defaultLOD: 3,
            maxLOD: 3,
            adaptiveLOD: false,
            gaussianSplats: {
                maxSplats: 10000,
                splatSize: 0.4,
                opacity: 0.7,
                blending: 'additive'
            },
            rendering: {
                antialiasing: 'none',
                shadowMaps: false,
                reflections: false,
                ambientOcclusion: false
            },
            performance: {
                targetFPS: 20,
                maxMemory: 25 * 1024 * 1024
            }
        });
        
        // Minimal profile (very low-end devices)
        this.renderingProfiles.set('minimal', {
            defaultLOD: 3,
            maxLOD: 3,
            adaptiveLOD: false,
            gaussianSplats: {
                maxSplats: 5000,
                splatSize: 0.3,
                opacity: 0.6,
                blending: 'additive'
            },
            rendering: {
                antialiasing: 'none',
                shadowMaps: false,
                reflections: false,
                ambientOcclusion: false
            },
            performance: {
                targetFPS: 15,
                maxMemory: 15 * 1024 * 1024
            }
        });
    }

    /**
     * Optimize character model for current device capabilities
     */
    optimizeCharacterModel(characterModel, cameraDistance = 10) {
        const profile = this.renderingProfiles.get(this.deviceCapabilities.profile);
        if (!profile) {
            console.warn('No rendering profile found, using default');
            return characterModel;
        }
        
        // Determine appropriate LOD level
        const lodLevel = this.determineLODLevel(cameraDistance, profile);
        const lodConfig = this.lodLevels.get(lodLevel);
        
        // Apply Gaussian Splatting optimizations
        const optimizedModel = this.applyGaussianSplattingOptimizations(
            characterModel, 
            lodConfig, 
            profile
        );
        
        // Apply rendering optimizations
        const finalModel = this.applyRenderingOptimizations(
            optimizedModel, 
            profile
        );
        
        console.log(`Applied LOD ${lodLevel} optimization for distance ${cameraDistance}`);
        
        return finalModel;
    }

    /**
     * Determine appropriate LOD level based on distance and performance
     */
    determineLODLevel(cameraDistance, profile) {
        if (!profile.adaptiveLOD) {
            return profile.defaultLOD;
        }
        
        // Check performance metrics
        if (this.performanceMetrics.frameRate < profile.performance.targetFPS * 0.8) {
            // Performance is poor, increase LOD level (lower quality)
            return Math.min(profile.maxLOD, profile.defaultLOD + 1);
        }
        
        // Distance-based LOD selection
        for (let i = 0; i < this.thresholds.lodSwitchDistance.length; i++) {
            if (cameraDistance <= this.thresholds.lodSwitchDistance[i]) {
                return Math.min(i, profile.maxLOD);
            }
        }
        
        return profile.maxLOD;
    }

    /**
     * Apply Gaussian Splatting specific optimizations
     */
    applyGaussianSplattingOptimizations(model, lodConfig, profile) {
        const optimized = { ...model };
        
        // Reduce splat count based on LOD
        optimized.splatCount = Math.min(
            model.splatCount || 100000,
            lodConfig.splatCount,
            profile.gaussianSplats.maxSplats
        );
        
        // Adjust splat properties
        optimized.splatSize = (model.splatSize || 1.0) * profile.gaussianSplats.splatSize;
        optimized.opacity = (model.opacity || 1.0) * profile.gaussianSplats.opacity;
        optimized.blending = profile.gaussianSplats.blending;
        
        // Texture resolution optimization
        optimized.textureResolution = Math.min(
            model.textureResolution || 2048,
            lodConfig.textureResolution
        );
        
        // Shader complexity
        optimized.shaderComplexity = lodConfig.shaderComplexity;
        
        return optimized;
    }

    /**
     * Apply general rendering optimizations
     */
    applyRenderingOptimizations(model, profile) {
        const optimized = { ...model };
        
        // Apply rendering settings
        optimized.rendering = {
            ...model.rendering,
            ...profile.rendering
        };
        
        // Memory optimization
        if (this.performanceMetrics.memoryUsage > profile.performance.maxMemory * 0.8) {
            optimized.textureCompression = 'high';
            optimized.geometryCompression = true;
        }
        
        return optimized;
    }

    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitor = () => {
            const currentTime = performance.now();
            frameCount++;
            
            // Update FPS every second
            if (currentTime - lastTime >= 1000) {
                this.performanceMetrics.frameRate = frameCount;
                this.performanceMetrics.lastUpdate = currentTime;
                frameCount = 0;
                lastTime = currentTime;
                
                // Update memory usage if available
                if (performance.memory) {
                    this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
                }
                
                // Trigger optimization if performance is poor
                this.checkPerformanceThresholds();
            }
            
            requestAnimationFrame(monitor);
        };
        
        requestAnimationFrame(monitor);
    }

    /**
     * Check performance thresholds and trigger optimizations
     */
    checkPerformanceThresholds() {
        const profile = this.renderingProfiles.get(this.deviceCapabilities.profile);
        if (!profile) return;
        
        let needsOptimization = false;
        
        // Check frame rate
        if (this.performanceMetrics.frameRate < profile.performance.targetFPS * 0.7) {
            needsOptimization = true;
            this.activeOptimizations.add('reduce_quality');
        }
        
        // Check memory usage
        if (this.performanceMetrics.memoryUsage > profile.performance.maxMemory) {
            needsOptimization = true;
            this.activeOptimizations.add('reduce_memory');
        }
        
        if (needsOptimization) {
            this.triggerAdaptiveOptimization();
        }
    }

    /**
     * Trigger adaptive optimization based on current performance
     */
    triggerAdaptiveOptimization() {
        console.log('Triggering adaptive optimization due to performance issues');
        
        // Emit event for other systems to respond
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('gaussianSplattingOptimization', {
                detail: {
                    optimizations: Array.from(this.activeOptimizations),
                    metrics: this.performanceMetrics,
                    profile: this.deviceCapabilities.profile
                }
            }));
        }
    }

    /**
     * Get current optimization status
     */
    getOptimizationStatus() {
        return {
            deviceCapabilities: this.deviceCapabilities,
            activeProfile: this.deviceCapabilities?.profile,
            performanceMetrics: this.performanceMetrics,
            activeOptimizations: Array.from(this.activeOptimizations),
            lodLevels: Object.fromEntries(this.lodLevels),
            thresholds: this.thresholds
        };
    }

    /**
     * Manually set optimization profile
     */
    setOptimizationProfile(profileName) {
        if (!this.renderingProfiles.has(profileName)) {
            throw new Error(`Unknown optimization profile: ${profileName}`);
        }
        
        this.deviceCapabilities.profile = profileName;
        console.log(`Optimization profile set to: ${profileName}`);
    }

    /**
     * Clear active optimizations
     */
    clearOptimizations() {
        this.activeOptimizations.clear();
    }

    /**
     * Get recommended settings for a character
     */
    getRecommendedSettings(characterId, cameraDistance = 10) {
        const profile = this.renderingProfiles.get(this.deviceCapabilities.profile);
        const lodLevel = this.determineLODLevel(cameraDistance, profile);
        const lodConfig = this.lodLevels.get(lodLevel);
        
        return {
            characterId,
            lodLevel,
            profile: this.deviceCapabilities.profile,
            settings: {
                splatCount: Math.min(lodConfig.splatCount, profile.gaussianSplats.maxSplats),
                textureResolution: lodConfig.textureResolution,
                shaderComplexity: lodConfig.shaderComplexity,
                rendering: profile.rendering,
                performance: profile.performance
            }
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GaussianSplattingOptimizer;
} else if (typeof window !== 'undefined') {
    window.GaussianSplattingOptimizer = GaussianSplattingOptimizer;
}