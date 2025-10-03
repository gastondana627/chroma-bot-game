/**
 * Performance Benchmarking System for 3D Immersive Chatbot
 * Provides real-time performance monitoring and optimization
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

class PerformanceBenchmarkingSystem {
    constructor() {
        this.benchmarks = new Map();
        this.metrics = {
            fps: [],
            frameTime: [],
            memoryUsage: [],
            drawCalls: [],
            triangles: [],
            loadTimes: []
        };
        this.isMonitoring = false;
        this.performanceThresholds = {
            minFPS: 24,
            maxFrameTime: 41.67, // ms for 24fps
            maxMemoryUsage: 80, // percentage
            maxLoadTime: 5000, // ms
            maxDrawCalls: 100,
            maxTriangles: 50000
        };
        this.deviceCapabilities = this.detectDeviceCapabilities();
        this.optimizationLevel = this.determineOptimizationLevel();
    }

    /**
     * Detect device capabilities for performance optimization
     * Requirement 6.4: Adaptive rendering based on device capabilities
     */
    detectDeviceCapabilities() {
        const capabilities = {
            memory: this.getAvailableMemory(),
            cores: navigator.hardwareConcurrency || 4,
            webglVersion: this.detectWebGLVersion(),
            isMobile: this.isMobileDevice(),
            connectionSpeed: this.estimateConnectionSpeed()
        };

        return capabilities;
    }

    /**
     * Get available memory information
     */
    getAvailableMemory() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit,
                percentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
            };
        }
        return { used: 0, total: 0, limit: 0, percentage: 0 };
    }

    /**
     * Detect WebGL version and capabilities
     */
    detectWebGLVersion() {
        const canvas = document.createElement('canvas');
        const contexts = ['webgl2', 'webgl', 'experimental-webgl'];
        
        for (const contextType of contexts) {
            const context = canvas.getContext(contextType);
            if (context) {
                return {
                    version: contextType,
                    maxTextureSize: context.getParameter(context.MAX_TEXTURE_SIZE),
                    maxVertexAttribs: context.getParameter(context.MAX_VERTEX_ATTRIBS),
                    extensions: this.getWebGLExtensions(context)
                };
            }
        }
        return null;
    }

    /**
     * Get available WebGL extensions
     */
    getWebGLExtensions(context) {
        const extensions = context.getSupportedExtensions() || [];
        return {
            available: extensions,
            hasFloatTextures: extensions.includes('OES_texture_float'),
            hasCompressedTextures: extensions.some(ext => ext.includes('compressed_texture')),
            hasInstancedArrays: extensions.includes('ANGLE_instanced_arrays')
        };
    }

    /**
     * Check if device is mobile
     */
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Estimate connection speed for progressive loading
     * Requirement 6.4: Progressive loading for limited bandwidth
     */
    estimateConnectionSpeed() {
        if (navigator.connection) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return { effectiveType: 'unknown', downlink: 0, rtt: 0 };
    }

    /**
     * Determine optimization level based on device capabilities
     */
    determineOptimizationLevel() {
        const { memory, cores, webglVersion, isMobile, connectionSpeed } = this.deviceCapabilities;
        
        let level = 'high';
        
        if (isMobile || !webglVersion || cores < 4) {
            level = 'low';
        } else if (memory.percentage > 60 || connectionSpeed.effectiveType === 'slow-2g') {
            level = 'medium';
        }
        
        return level;
    }

    /**
     * Start performance benchmark
     */
    startBenchmark(name) {
        this.benchmarks.set(name, {
            startTime: performance.now(),
            startMemory: this.getAvailableMemory(),
            frameCount: 0
        });
    }

    /**
     * End performance benchmark and record metrics
     */
    endBenchmark(name) {
        const benchmark = this.benchmarks.get(name);
        if (!benchmark) return null;

        const endTime = performance.now();
        const endMemory = this.getAvailableMemory();
        const duration = endTime - benchmark.startTime;

        const result = {
            name,
            duration,
            fps: benchmark.frameCount > 0 ? (benchmark.frameCount / (duration / 1000)) : 0,
            memoryDelta: endMemory.used - benchmark.startMemory.used,
            memoryUsage: endMemory.percentage
        };

        this.recordMetrics(result);
        this.benchmarks.delete(name);
        
        return result;
    }

    /**
     * Record frame metrics during rendering
     */
    recordFrame(renderInfo = {}) {
        if (!this.isMonitoring) return;

        const now = performance.now();
        const memory = this.getAvailableMemory();

        // Calculate FPS
        if (this.lastFrameTime) {
            const frameTime = now - this.lastFrameTime;
            const fps = 1000 / frameTime;
            
            this.metrics.fps.push(fps);
            this.metrics.frameTime.push(frameTime);
            
            // Keep only last 60 frames for rolling average
            if (this.metrics.fps.length > 60) {
                this.metrics.fps.shift();
                this.metrics.frameTime.shift();
            }
        }

        this.lastFrameTime = now;
        this.metrics.memoryUsage.push(memory.percentage);
        
        if (renderInfo.drawCalls) this.metrics.drawCalls.push(renderInfo.drawCalls);
        if (renderInfo.triangles) this.metrics.triangles.push(renderInfo.triangles);

        // Check for performance issues
        this.checkPerformanceThresholds();
    }

    /**
     * Record asset loading metrics
     */
    recordAssetLoad(assetName, loadTime, size) {
        this.metrics.loadTimes.push({
            asset: assetName,
            time: loadTime,
            size: size,
            timestamp: Date.now()
        });

        // Requirement 6.2: Asset loading under 5 seconds
        if (loadTime > this.performanceThresholds.maxLoadTime) {
            console.warn(`Asset ${assetName} took ${loadTime}ms to load (exceeds ${this.performanceThresholds.maxLoadTime}ms threshold)`);
        }
    }

    /**
     * Check performance thresholds and trigger optimizations
     * Requirement 6.3: Memory usage monitoring and cleanup
     */
    checkPerformanceThresholds() {
        const currentMetrics = this.getCurrentMetrics();
        
        // Check memory usage
        if (currentMetrics.memoryUsage > this.performanceThresholds.maxMemoryUsage) {
            this.triggerMemoryCleanup();
        }
        
        // Check FPS
        if (currentMetrics.fps < this.performanceThresholds.minFPS) {
            this.triggerPerformanceOptimization();
        }
        
        // Check draw calls
        if (currentMetrics.drawCalls > this.performanceThresholds.maxDrawCalls) {
            this.optimizeDrawCalls();
        }
    }

    /**
     * Get current performance metrics
     */
    getCurrentMetrics() {
        const recentFPS = this.metrics.fps.slice(-10);
        const recentFrameTime = this.metrics.frameTime.slice(-10);
        const recentMemory = this.metrics.memoryUsage.slice(-10);
        const recentDrawCalls = this.metrics.drawCalls.slice(-10);

        return {
            fps: recentFPS.length > 0 ? recentFPS.reduce((a, b) => a + b, 0) / recentFPS.length : 0,
            frameTime: recentFrameTime.length > 0 ? recentFrameTime.reduce((a, b) => a + b, 0) / recentFrameTime.length : 0,
            memoryUsage: recentMemory.length > 0 ? recentMemory[recentMemory.length - 1] : 0,
            drawCalls: recentDrawCalls.length > 0 ? recentDrawCalls[recentDrawCalls.length - 1] : 0
        };
    }

    /**
     * Trigger memory cleanup when threshold exceeded
     */
    triggerMemoryCleanup() {
        console.log('Triggering memory cleanup due to high usage');
        
        // Dispatch cleanup event
        window.dispatchEvent(new CustomEvent('3d-memory-cleanup', {
            detail: { memoryUsage: this.getAvailableMemory().percentage }
        }));
    }

    /**
     * Trigger performance optimization
     */
    triggerPerformanceOptimization() {
        console.log('Triggering performance optimization due to low FPS');
        
        // Reduce quality level
        if (this.optimizationLevel === 'high') {
            this.optimizationLevel = 'medium';
        } else if (this.optimizationLevel === 'medium') {
            this.optimizationLevel = 'low';
        }
        
        // Dispatch optimization event
        window.dispatchEvent(new CustomEvent('3d-performance-optimize', {
            detail: { 
                level: this.optimizationLevel,
                currentFPS: this.getCurrentMetrics().fps
            }
        }));
    }

    /**
     * Optimize draw calls
     */
    optimizeDrawCalls() {
        console.log('Optimizing draw calls due to high count');
        
        window.dispatchEvent(new CustomEvent('3d-optimize-drawcalls', {
            detail: { drawCalls: this.getCurrentMetrics().drawCalls }
        }));
    }

    /**
     * Start continuous monitoring
     */
    startMonitoring() {
        this.isMonitoring = true;
        console.log('Performance monitoring started');
    }

    /**
     * Stop continuous monitoring
     */
    stopMonitoring() {
        this.isMonitoring = false;
        console.log('Performance monitoring stopped');
    }

    /**
     * Generate performance report
     */
    generateReport() {
        const metrics = this.getCurrentMetrics();
        const deviceInfo = this.deviceCapabilities;
        
        return {
            timestamp: new Date().toISOString(),
            deviceCapabilities: deviceInfo,
            optimizationLevel: this.optimizationLevel,
            currentMetrics: metrics,
            thresholds: this.performanceThresholds,
            recommendations: this.generateRecommendations(metrics),
            historicalData: {
                fpsHistory: this.metrics.fps.slice(-60),
                memoryHistory: this.metrics.memoryUsage.slice(-60),
                loadTimeHistory: this.metrics.loadTimes.slice(-10)
            }
        };
    }

    /**
     * Generate performance recommendations
     */
    generateRecommendations(metrics) {
        const recommendations = [];
        
        if (metrics.fps < this.performanceThresholds.minFPS) {
            recommendations.push('Consider reducing 3D model complexity or texture resolution');
        }
        
        if (metrics.memoryUsage > 70) {
            recommendations.push('Implement more aggressive asset cleanup');
        }
        
        if (this.deviceCapabilities.isMobile) {
            recommendations.push('Use mobile-optimized assets and reduced particle effects');
        }
        
        if (this.deviceCapabilities.connectionSpeed.effectiveType === 'slow-2g') {
            recommendations.push('Enable progressive loading with lower quality previews');
        }
        
        return recommendations;
    }

    /**
     * Record metrics for analysis
     */
    recordMetrics(result) {
        // Store metrics for later analysis
        if (!window.performanceMetrics) {
            window.performanceMetrics = [];
        }
        
        window.performanceMetrics.push({
            ...result,
            timestamp: Date.now(),
            deviceInfo: this.deviceCapabilities
        });
        
        // Keep only last 100 entries
        if (window.performanceMetrics.length > 100) {
            window.performanceMetrics.shift();
        }
    }

    /**
     * Test concurrent user performance
     * Requirement 6.1: Support for 50 concurrent users
     */
    async testConcurrentUsers(maxUsers = 50) {
        console.log(`Testing performance with ${maxUsers} concurrent users`);
        
        const userSessions = [];
        const startTime = performance.now();
        
        for (let i = 0; i < maxUsers; i++) {
            userSessions.push({
                id: i,
                startTime: performance.now()
            });
        }
        
        // Simulate concurrent rendering
        const results = await Promise.all(
            userSessions.map(async (session) => {
                this.startBenchmark(`concurrent_user_${session.id}`);
                
                // Simulate user interaction
                await new Promise(resolve => setTimeout(resolve, 100));
                
                return this.endBenchmark(`concurrent_user_${session.id}`);
            })
        );
        
        const totalTime = performance.now() - startTime;
        const averageFPS = results.reduce((sum, r) => sum + (r?.fps || 0), 0) / results.length;
        
        return {
            totalUsers: maxUsers,
            totalTime,
            averageFPS,
            passedTest: averageFPS >= this.performanceThresholds.minFPS
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceBenchmarkingSystem;
} else {
    window.PerformanceBenchmarkingSystem = PerformanceBenchmarkingSystem;
}