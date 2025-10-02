/**
 * Web-Optimized Asset Loading System
 * Provides progressive loading system for 3D assets with fallback options
 * Implements asset caching and memory management for 3D models
 */

class AssetLoader {
    constructor() {
        this.cache = new Map();
        this.loadingQueue = new Map();
        this.loadingPromises = new Map();
        this.memoryUsage = 0;
        this.maxMemoryUsage = 100 * 1024 * 1024; // 100MB default
        this.compressionSupport = null;
        this.networkSpeed = 'unknown';
        
        // Loading strategies
        this.loadingStrategies = {
            progressive: 'progressive',
            preload: 'preload',
            ondemand: 'ondemand',
            lazy: 'lazy'
        };
        
        // Asset types
        this.assetTypes = {
            model: { extensions: ['.glb', '.gltf'], priority: 1 },
            texture: { extensions: ['.jpg', '.png', '.webp', '.ktx2'], priority: 2 },
            audio: { extensions: ['.mp3', '.ogg', '.wav'], priority: 3 },
            animation: { extensions: ['.json'], priority: 2 },
            shader: { extensions: ['.glsl', '.vert', '.frag'], priority: 1 }
        };
        
        // Fallback configurations
        this.fallbackConfigs = new Map();
        
        // Performance monitoring
        this.loadingStats = {
            totalRequests: 0,
            successfulLoads: 0,
            failedLoads: 0,
            totalBytesLoaded: 0,
            averageLoadTime: 0,
            cacheHitRate: 0
        };
    }

    /**
     * Initialize the asset loading system
     */
    async initialize() {
        console.log('Initializing Asset Loading System...');
        
        try {
            // Detect compression support
            this.compressionSupport = await this.detectCompressionSupport();
            
            // Estimate network speed
            this.networkSpeed = await this.estimateNetworkSpeed();
            
            // Set up memory management
            this.setupMemoryManagement();
            
            // Initialize fallback configurations
            this.initializeFallbackConfigs();
            
            // Set up service worker for caching (if available)
            await this.setupServiceWorkerCaching();
            
            console.log('Asset Loading System initialized successfully');
            console.log('Compression support:', this.compressionSupport);
            console.log('Network speed:', this.networkSpeed);
            
            return true;
            
        } catch (error) {
            console.error('Failed to initialize Asset Loading System:', error);
            throw error;
        }
    }

    /**
     * Load asset with progressive loading and fallbacks
     */
    async loadAsset(assetPath, options = {}) {
        const {
            strategy = 'progressive',
            priority = 'normal',
            fallback = true,
            cache = true,
            onProgress = null
        } = options;
        
        // Check cache first
        if (cache && this.cache.has(assetPath)) {
            this.loadingStats.cacheHitRate++;
            return this.cache.get(assetPath);
        }
        
        // Check if already loading
        if (this.loadingPromises.has(assetPath)) {
            return this.loadingPromises.get(assetPath);
        }
        
        // Start loading process
        const loadingPromise = this.executeLoadingStrategy(assetPath, strategy, options);
        this.loadingPromises.set(assetPath, loadingPromise);
        
        try {
            const asset = await loadingPromise;
            
            // Cache the asset if requested
            if (cache) {
                this.cacheAsset(assetPath, asset);
            }
            
            // Update statistics
            this.updateLoadingStats(assetPath, true, asset.size || 0);
            
            return asset;
            
        } catch (error) {
            console.error(`Failed to load asset ${assetPath}:`, error);
            
            // Try fallback if enabled
            if (fallback) {
                const fallbackAsset = await this.loadFallbackAsset(assetPath, options);
                if (fallbackAsset) {
                    return fallbackAsset;
                }
            }
            
            // Update statistics
            this.updateLoadingStats(assetPath, false, 0);
            throw error;
            
        } finally {
            this.loadingPromises.delete(assetPath);
        }
    }

    /**
     * Execute loading strategy
     */
    async executeLoadingStrategy(assetPath, strategy, options) {
        switch (strategy) {
            case 'progressive':
                return this.loadProgressively(assetPath, options);
            case 'preload':
                return this.preloadAsset(assetPath, options);
            case 'ondemand':
                return this.loadOnDemand(assetPath, options);
            case 'lazy':
                return this.loadLazily(assetPath, options);
            default:
                return this.loadProgressively(assetPath, options);
        }
    }

    /**
     * Progressive loading - load low quality first, then upgrade
     */
    async loadProgressively(assetPath, options) {
        const { onProgress } = options;
        const assetType = this.getAssetType(assetPath);
        
        // Step 1: Load low-quality version first
        const lowQualityPath = this.getLowQualityPath(assetPath);
        let asset = null;
        
        try {
            if (onProgress) onProgress({ stage: 'low-quality', progress: 0.1 });
            asset = await this.loadSingleAsset(lowQualityPath);
            if (onProgress) onProgress({ stage: 'low-quality', progress: 0.5, asset });
        } catch (error) {
            console.warn(`Failed to load low-quality version of ${assetPath}:`, error);
        }
        
        // Step 2: Load medium quality if network allows
        if (this.shouldLoadMediumQuality()) {
            try {
                const mediumQualityPath = this.getMediumQualityPath(assetPath);
                if (onProgress) onProgress({ stage: 'medium-quality', progress: 0.6 });
                const mediumAsset = await this.loadSingleAsset(mediumQualityPath);
                asset = mediumAsset;
                if (onProgress) onProgress({ stage: 'medium-quality', progress: 0.8, asset });
            } catch (error) {
                console.warn(`Failed to load medium-quality version of ${assetPath}:`, error);
            }
        }
        
        // Step 3: Load high quality if conditions are optimal
        if (this.shouldLoadHighQuality()) {
            try {
                if (onProgress) onProgress({ stage: 'high-quality', progress: 0.9 });
                const highAsset = await this.loadSingleAsset(assetPath);
                asset = highAsset;
                if (onProgress) onProgress({ stage: 'high-quality', progress: 1.0, asset });
            } catch (error) {
                console.warn(`Failed to load high-quality version of ${assetPath}:`, error);
            }
        }
        
        if (!asset) {
            throw new Error(`Failed to load any version of ${assetPath}`);
        }
        
        return asset;
    }

    /**
     * Preload asset in background
     */
    async preloadAsset(assetPath, options) {
        // Add to preload queue with lower priority
        return new Promise((resolve, reject) => {
            const preloadTask = {
                path: assetPath,
                options,
                resolve,
                reject,
                priority: options.priority || 'low',
                timestamp: Date.now()
            };
            
            this.addToPreloadQueue(preloadTask);
        });
    }

    /**
     * Load asset on demand (immediate)
     */
    async loadOnDemand(assetPath, options) {
        return this.loadSingleAsset(assetPath, options);
    }

    /**
     * Load asset lazily (when needed)
     */
    async loadLazily(assetPath, options) {
        // Return a proxy that loads the asset when first accessed
        return new Proxy({}, {
            get: (target, prop) => {
                if (!target._loaded) {
                    target._loadPromise = this.loadSingleAsset(assetPath, options);
                    target._loaded = true;
                }
                return target._loadPromise.then(asset => asset[prop]);
            }
        });
    }

    /**
     * Load a single asset file
     */
    async loadSingleAsset(assetPath, options = {}) {
        const startTime = performance.now();
        
        try {
            // Determine optimal format based on support
            const optimizedPath = this.getOptimizedAssetPath(assetPath);
            
            // Load the asset
            const response = await fetch(optimizedPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const assetType = this.getAssetType(assetPath);
            let asset;
            
            switch (assetType) {
                case 'model':
                    asset = await this.loadModel(response, assetPath);
                    break;
                case 'texture':
                    asset = await this.loadTexture(response, assetPath);
                    break;
                case 'audio':
                    asset = await this.loadAudio(response, assetPath);
                    break;
                case 'animation':
                    asset = await this.loadAnimation(response, assetPath);
                    break;
                case 'shader':
                    asset = await this.loadShader(response, assetPath);
                    break;
                default:
                    asset = await response.arrayBuffer();
            }
            
            // Add metadata
            asset.metadata = {
                path: assetPath,
                type: assetType,
                size: response.headers.get('content-length') || asset.byteLength || 0,
                loadTime: performance.now() - startTime,
                timestamp: Date.now()
            };
            
            return asset;
            
        } catch (error) {
            console.error(`Failed to load asset ${assetPath}:`, error);
            throw error;
        }
    }

    /**
     * Load 3D model asset
     */
    async loadModel(response, assetPath) {
        const arrayBuffer = await response.arrayBuffer();
        
        // For GLB/GLTF files, we'll return the raw data
        // In a real implementation, this would parse the model
        return {
            type: 'model',
            data: arrayBuffer,
            format: assetPath.endsWith('.glb') ? 'glb' : 'gltf',
            byteLength: arrayBuffer.byteLength
        };
    }

    /**
     * Load texture asset
     */
    async loadTexture(response, assetPath) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    type: 'texture',
                    image: img,
                    url: imageUrl,
                    width: img.width,
                    height: img.height,
                    byteLength: blob.size
                });
            };
            img.onerror = reject;
            img.src = imageUrl;
        });
    }

    /**
     * Load audio asset
     */
    async loadAudio(response, assetPath) {
        const arrayBuffer = await response.arrayBuffer();
        
        return {
            type: 'audio',
            data: arrayBuffer,
            format: this.getAudioFormat(assetPath),
            byteLength: arrayBuffer.byteLength
        };
    }

    /**
     * Load animation data
     */
    async loadAnimation(response, assetPath) {
        const json = await response.json();
        
        return {
            type: 'animation',
            data: json,
            byteLength: JSON.stringify(json).length
        };
    }

    /**
     * Load shader code
     */
    async loadShader(response, assetPath) {
        const text = await response.text();
        
        return {
            type: 'shader',
            code: text,
            shaderType: this.getShaderType(assetPath),
            byteLength: text.length
        };
    }

    /**
     * Load fallback asset
     */
    async loadFallbackAsset(assetPath, options) {
        const fallbackConfig = this.fallbackConfigs.get(this.getAssetType(assetPath));
        if (!fallbackConfig) {
            return null;
        }
        
        try {
            console.log(`Loading fallback for ${assetPath}`);
            return await this.loadSingleAsset(fallbackConfig.path, options);
        } catch (error) {
            console.error(`Fallback loading failed for ${assetPath}:`, error);
            return null;
        }
    }

    /**
     * Cache asset in memory
     */
    cacheAsset(assetPath, asset) {
        const assetSize = asset.metadata?.size || 0;
        
        // Check if we have enough memory
        if (this.memoryUsage + assetSize > this.maxMemoryUsage) {
            this.evictLeastRecentlyUsed(assetSize);
        }
        
        // Add to cache
        this.cache.set(assetPath, {
            ...asset,
            cachedAt: Date.now(),
            accessCount: 1,
            lastAccessed: Date.now()
        });
        
        this.memoryUsage += assetSize;
        
        console.log(`Cached asset ${assetPath} (${assetSize} bytes)`);
    }

    /**
     * Evict least recently used assets to free memory
     */
    evictLeastRecentlyUsed(requiredSpace) {
        const sortedAssets = Array.from(this.cache.entries())
            .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
        
        let freedSpace = 0;
        
        for (const [path, asset] of sortedAssets) {
            if (freedSpace >= requiredSpace) break;
            
            const assetSize = asset.metadata?.size || 0;
            this.cache.delete(path);
            this.memoryUsage -= assetSize;
            freedSpace += assetSize;
            
            console.log(`Evicted asset ${path} (${assetSize} bytes)`);
        }
    }

    /**
     * Get optimized asset path based on device capabilities
     */
    getOptimizedAssetPath(assetPath) {
        const assetType = this.getAssetType(assetPath);
        
        // Check for compressed texture support
        if (assetType === 'texture' && this.compressionSupport.ktx2) {
            const ktx2Path = assetPath.replace(/\.(jpg|png|webp)$/, '.ktx2');
            return ktx2Path;
        }
        
        // Check for WebP support
        if (assetType === 'texture' && this.compressionSupport.webp && !assetPath.endsWith('.webp')) {
            const webpPath = assetPath.replace(/\.(jpg|png)$/, '.webp');
            return webpPath;
        }
        
        return assetPath;
    }

    /**
     * Get low quality version path
     */
    getLowQualityPath(assetPath) {
        const extension = assetPath.split('.').pop();
        const basePath = assetPath.replace(`.${extension}`, '');
        return `${basePath}_low.${extension}`;
    }

    /**
     * Get medium quality version path
     */
    getMediumQualityPath(assetPath) {
        const extension = assetPath.split('.').pop();
        const basePath = assetPath.replace(`.${extension}`, '');
        return `${basePath}_medium.${extension}`;
    }

    /**
     * Determine if medium quality should be loaded
     */
    shouldLoadMediumQuality() {
        return this.networkSpeed !== 'slow' && this.memoryUsage < this.maxMemoryUsage * 0.7;
    }

    /**
     * Determine if high quality should be loaded
     */
    shouldLoadHighQuality() {
        return this.networkSpeed === 'fast' && this.memoryUsage < this.maxMemoryUsage * 0.5;
    }

    /**
     * Detect compression format support
     */
    async detectCompressionSupport() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const support = {
            webp: false,
            avif: false,
            ktx2: false
        };
        
        // Test WebP support
        try {
            canvas.toDataURL('image/webp');
            support.webp = true;
        } catch (e) {
            support.webp = false;
        }
        
        // Test AVIF support
        try {
            canvas.toDataURL('image/avif');
            support.avif = true;
        } catch (e) {
            support.avif = false;
        }
        
        // Test KTX2 support (requires WebGL)
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (gl) {
            const ext = gl.getExtension('WEBGL_compressed_texture_etc');
            support.ktx2 = !!ext;
        }
        
        canvas.remove();
        return support;
    }

    /**
     * Estimate network speed
     */
    async estimateNetworkSpeed() {
        if (!navigator.connection) {
            return 'unknown';
        }
        
        const connection = navigator.connection;
        const effectiveType = connection.effectiveType;
        
        switch (effectiveType) {
            case 'slow-2g':
            case '2g':
                return 'slow';
            case '3g':
                return 'medium';
            case '4g':
                return 'fast';
            default:
                return 'medium';
        }
    }

    /**
     * Setup memory management
     */
    setupMemoryManagement() {
        // Adjust max memory based on device capabilities
        if (navigator.deviceMemory) {
            // Use 10% of available device memory, capped at 200MB
            this.maxMemoryUsage = Math.min(
                navigator.deviceMemory * 1024 * 1024 * 1024 * 0.1,
                200 * 1024 * 1024
            );
        }
        
        // Set up periodic cleanup
        setInterval(() => {
            this.cleanupExpiredAssets();
        }, 60000); // Every minute
        
        console.log(`Max memory usage set to: ${(this.maxMemoryUsage / 1024 / 1024).toFixed(1)}MB`);
    }

    /**
     * Initialize fallback configurations
     */
    initializeFallbackConfigs() {
        this.fallbackConfigs.set('model', {
            path: '/assets/3d/fallback/default_character.glb',
            description: 'Default character model'
        });
        
        this.fallbackConfigs.set('texture', {
            path: '/assets/3d/fallback/default_texture.jpg',
            description: 'Default texture'
        });
        
        this.fallbackConfigs.set('audio', {
            path: '/assets/audio/fallback/silence.mp3',
            description: 'Silent audio'
        });
    }

    /**
     * Setup service worker for caching
     */
    async setupServiceWorkerCaching() {
        if ('serviceWorker' in navigator) {
            try {
                // Register service worker for asset caching
                // In production, would implement actual service worker
                console.log('Service worker caching available');
            } catch (error) {
                console.warn('Service worker registration failed:', error);
            }
        }
    }

    /**
     * Utility methods
     */
    getAssetType(assetPath) {
        const extension = '.' + assetPath.split('.').pop().toLowerCase();
        
        for (const [type, config] of Object.entries(this.assetTypes)) {
            if (config.extensions.includes(extension)) {
                return type;
            }
        }
        
        return 'unknown';
    }

    getAudioFormat(assetPath) {
        const extension = assetPath.split('.').pop().toLowerCase();
        return extension;
    }

    getShaderType(assetPath) {
        const extension = assetPath.split('.').pop().toLowerCase();
        switch (extension) {
            case 'vert': return 'vertex';
            case 'frag': return 'fragment';
            default: return 'unknown';
        }
    }

    /**
     * Update loading statistics
     */
    updateLoadingStats(assetPath, success, bytes) {
        this.loadingStats.totalRequests++;
        
        if (success) {
            this.loadingStats.successfulLoads++;
            this.loadingStats.totalBytesLoaded += bytes;
        } else {
            this.loadingStats.failedLoads++;
        }
        
        // Update cache hit rate
        this.loadingStats.cacheHitRate = 
            (this.loadingStats.cacheHitRate / this.loadingStats.totalRequests) * 100;
    }

    /**
     * Clean up expired assets
     */
    cleanupExpiredAssets() {
        const now = Date.now();
        const maxAge = 30 * 60 * 1000; // 30 minutes
        
        for (const [path, asset] of this.cache.entries()) {
            if (now - asset.lastAccessed > maxAge) {
                const assetSize = asset.metadata?.size || 0;
                this.cache.delete(path);
                this.memoryUsage -= assetSize;
                console.log(`Cleaned up expired asset: ${path}`);
            }
        }
    }

    /**
     * Get loading statistics
     */
    getLoadingStats() {
        return {
            ...this.loadingStats,
            cacheSize: this.cache.size,
            memoryUsage: this.memoryUsage,
            maxMemoryUsage: this.maxMemoryUsage,
            memoryUtilization: (this.memoryUsage / this.maxMemoryUsage) * 100
        };
    }

    /**
     * Preload character assets
     */
    async preloadCharacterAssets(characterId) {
        const assetPaths = [
            `/assets/3d/characters/${characterId}/web_model.glb`,
            `/assets/3d/characters/${characterId}/textures/medium/diffuse.jpg`,
            `/assets/3d/characters/${characterId}/animations.json`
        ];
        
        const loadPromises = assetPaths.map(path => 
            this.loadAsset(path, { strategy: 'preload', priority: 'high' })
        );
        
        try {
            await Promise.all(loadPromises);
            console.log(`Preloaded assets for character: ${characterId}`);
        } catch (error) {
            console.error(`Failed to preload assets for ${characterId}:`, error);
        }
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        this.memoryUsage = 0;
        console.log('Asset cache cleared');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssetLoader;
} else if (typeof window !== 'undefined') {
    window.AssetLoader = AssetLoader;
}