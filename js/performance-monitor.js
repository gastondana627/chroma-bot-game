/**
 * Performance Monitor and Optimization System
 * Adds frame rate monitoring and automatic quality adjustment
 * Creates memory usage tracking and cleanup for 3D assets
 */

class PerformanceMonitor {
  constructor(sceneManager, mobile3DSupport) {
    this.sceneManager = sceneManager;
    this.mobile3DSupport = mobile3DSupport;
    this.isMonitoring = false;
    this.monitoringInterval = null;
    
    // Performance metrics
    this.metrics = {
      fps: {
        current: 0,
        average: 0,
        min: Infinity,
        max: 0,
        samples: [],
        sampleSize: 60 // 1 second at 60fps
      },
      memory: {
        used: 0,
        total: 0,
        geometries: 0,
        textures: 0,
        programs: 0
      },
      rendering: {
        drawCalls: 0,
        triangles: 0,
        points: 0,
        lines: 0
      },
      performance: {
        level: 'medium',
        autoAdjust: true,
        adjustmentHistory: []
      }
    };
    
    // Performance thresholds
    this.thresholds = {
      fps: {
        target: 30,
        minimum: 20,
        excellent: 50
      },
      memory: {
        warning: 0.8, // 80% of available memory
        critical: 0.9  // 90% of available memory
      },
      drawCalls: {
        warning: 100,
        critical: 200
      }
    };
    
    // Optimization settings
    this.optimizations = {
      enabled: true,
      autoQualityAdjustment: true,
      memoryCleanupInterval: 30000, // 30 seconds
      performanceCheckInterval: 1000, // 1 second
      lastCleanup: Date.now(),
      lastQualityAdjustment: Date.now()
    };
    
    this.initialize();
  }

  /**
   * Initialize performance monitoring system
   */
  initialize() {
    try {
      // Set up FPS monitoring
      this.setupFPSMonitoring();
      
      // Set up memory monitoring
      this.setupMemoryMonitoring();
      
      // Set up automatic cleanup
      this.setupAutomaticCleanup();
      
      // Set up performance adjustment
      this.setupPerformanceAdjustment();
      
      console.log('✅ Performance monitor initialized');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize performance monitor:', error);
      return false;
    }
  }

  /**
   * Start performance monitoring
   */
  startMonitoring() {
    if (this.isMonitoring) {
      console.warn('⚠️ Performance monitoring already active');
      return;
    }
    
    this.isMonitoring = true;
    
    // Start FPS monitoring
    this.startFPSMonitoring();
    
    // Start periodic performance checks
    this.monitoringInterval = setInterval(() => {
      this.performPerformanceCheck();
    }, this.optimizations.performanceCheckInterval);
    
    console.log('📊 Performance monitoring started');
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    
    // Stop FPS monitoring
    this.stopFPSMonitoring();
    
    // Clear monitoring interval
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    console.log('📊 Performance monitoring stopped');
  }

  /**
   * Set up FPS monitoring
   */
  setupFPSMonitoring() {
    this.fpsMonitor = {
      lastTime: performance.now(),
      frameCount: 0,
      animationId: null
    };
  }

  /**
   * Start FPS monitoring loop
   */
  startFPSMonitoring() {
    const measureFPS = (currentTime) => {
      if (!this.isMonitoring) return;
      
      this.fpsMonitor.frameCount++;
      const deltaTime = currentTime - this.fpsMonitor.lastTime;
      
      // Calculate FPS every second
      if (deltaTime >= 1000) {
        const fps = Math.round((this.fpsMonitor.frameCount * 1000) / deltaTime);
        this.updateFPSMetrics(fps);
        
        this.fpsMonitor.frameCount = 0;
        this.fpsMonitor.lastTime = currentTime;
      }
      
      this.fpsMonitor.animationId = requestAnimationFrame(measureFPS);
    };
    
    this.fpsMonitor.animationId = requestAnimationFrame(measureFPS);
  }

  /**
   * Stop FPS monitoring loop
   */
  stopFPSMonitoring() {
    if (this.fpsMonitor.animationId) {
      cancelAnimationFrame(this.fpsMonitor.animationId);
      this.fpsMonitor.animationId = null;
    }
  }

  /**
   * Update FPS metrics
   */
  updateFPSMetrics(fps) {
    const fpsMetrics = this.metrics.fps;
    
    // Update current FPS
    fpsMetrics.current = fps;
    
    // Update min/max
    fpsMetrics.min = Math.min(fpsMetrics.min, fps);
    fpsMetrics.max = Math.max(fpsMetrics.max, fps);
    
    // Add to samples for average calculation
    fpsMetrics.samples.push(fps);
    if (fpsMetrics.samples.length > fpsMetrics.sampleSize) {
      fpsMetrics.samples.shift();
    }
    
    // Calculate average
    fpsMetrics.average = fpsMetrics.samples.reduce((sum, sample) => sum + sample, 0) / fpsMetrics.samples.length;
    
    // Check for performance issues
    this.checkFPSPerformance(fps);
  }

  /**
   * Check FPS performance and trigger adjustments if needed
   */
  checkFPSPerformance(fps) {
    const now = Date.now();
    const timeSinceLastAdjustment = now - this.optimizations.lastQualityAdjustment;
    
    // Only adjust quality if enough time has passed and auto-adjustment is enabled
    if (!this.optimizations.autoQualityAdjustment || timeSinceLastAdjustment < 5000) {
      return;
    }
    
    if (fps < this.thresholds.fps.minimum) {
      console.warn(`⚠️ Low FPS detected: ${fps}fps`);
      this.adjustQualityDown();
    } else if (fps > this.thresholds.fps.excellent && this.metrics.performance.level !== 'high') {
      console.log(`✅ Excellent FPS detected: ${fps}fps`);
      this.adjustQualityUp();
    }
  }

  /**
   * Set up memory monitoring
   */
  setupMemoryMonitoring() {
    // Check if Performance API memory is available
    this.memoryAPIAvailable = 'memory' in performance;
    
    if (!this.memoryAPIAvailable) {
      console.warn('⚠️ Performance.memory API not available, using fallback memory monitoring');
    }
  }

  /**
   * Update memory metrics
   */
  updateMemoryMetrics() {
    const renderer = this.sceneManager.getRenderer();
    if (!renderer) return;
    
    // Get Three.js memory info
    const info = renderer.info;
    this.metrics.memory.geometries = info.memory.geometries;
    this.metrics.memory.textures = info.memory.textures;
    this.metrics.memory.programs = info.programs ? info.programs.length : 0;
    
    // Get rendering info
    this.metrics.rendering.drawCalls = info.render.calls;
    this.metrics.rendering.triangles = info.render.triangles;
    this.metrics.rendering.points = info.render.points;
    this.metrics.rendering.lines = info.render.lines;
    
    // Get system memory if available
    if (this.memoryAPIAvailable) {
      const memory = performance.memory;
      this.metrics.memory.used = memory.usedJSHeapSize;
      this.metrics.memory.total = memory.totalJSHeapSize;
      
      // Check memory usage
      const memoryUsageRatio = memory.usedJSHeapSize / memory.totalJSHeapSize;
      this.checkMemoryUsage(memoryUsageRatio);
    }
    
    // Check rendering performance
    this.checkRenderingPerformance();
  }

  /**
   * Check memory usage and trigger cleanup if needed
   */
  checkMemoryUsage(usageRatio) {
    if (usageRatio > this.thresholds.memory.critical) {
      console.warn(`⚠️ Critical memory usage: ${(usageRatio * 100).toFixed(1)}%`);
      this.performEmergencyCleanup();
    } else if (usageRatio > this.thresholds.memory.warning) {
      console.warn(`⚠️ High memory usage: ${(usageRatio * 100).toFixed(1)}%`);
      this.performMemoryCleanup();
    }
  }

  /**
   * Check rendering performance
   */
  checkRenderingPerformance() {
    const drawCalls = this.metrics.rendering.drawCalls;
    
    if (drawCalls > this.thresholds.drawCalls.critical) {
      console.warn(`⚠️ Critical draw calls: ${drawCalls}`);
      this.optimizeRendering();
    } else if (drawCalls > this.thresholds.drawCalls.warning) {
      console.warn(`⚠️ High draw calls: ${drawCalls}`);
    }
  }

  /**
   * Set up automatic cleanup
   */
  setupAutomaticCleanup() {
    setInterval(() => {
      if (this.isMonitoring) {
        this.performMemoryCleanup();
      }
    }, this.optimizations.memoryCleanupInterval);
  }

  /**
   * Set up performance adjustment system
   */
  setupPerformanceAdjustment() {
    // Get initial performance level from mobile support
    if (this.mobile3DSupport) {
      this.metrics.performance.level = this.mobile3DSupport.getRecommendedQuality();
    }
  }

  /**
   * Perform periodic performance check
   */
  performPerformanceCheck() {
    // Update memory metrics
    this.updateMemoryMetrics();
    
    // Log performance summary periodically (every 10 seconds)
    if (Date.now() % 10000 < this.optimizations.performanceCheckInterval) {
      this.logPerformanceSummary();
    }
  }

  /**
   * Adjust quality down to improve performance
   */
  adjustQualityDown() {
    const currentLevel = this.metrics.performance.level;
    let newLevel = currentLevel;
    
    switch (currentLevel) {
      case 'high':
        newLevel = 'medium';
        break;
      case 'medium':
        newLevel = 'low';
        break;
      case 'low':
        console.warn('⚠️ Already at lowest quality level');
        return;
    }
    
    this.applyQualityLevel(newLevel);
    this.optimizations.lastQualityAdjustment = Date.now();
    
    console.log(`📉 Quality adjusted down: ${currentLevel} → ${newLevel}`);
  }

  /**
   * Adjust quality up for better visuals
   */
  adjustQualityUp() {
    const currentLevel = this.metrics.performance.level;
    let newLevel = currentLevel;
    
    switch (currentLevel) {
      case 'low':
        newLevel = 'medium';
        break;
      case 'medium':
        newLevel = 'high';
        break;
      case 'high':
        console.log('✅ Already at highest quality level');
        return;
    }
    
    this.applyQualityLevel(newLevel);
    this.optimizations.lastQualityAdjustment = Date.now();
    
    console.log(`📈 Quality adjusted up: ${currentLevel} → ${newLevel}`);
  }

  /**
   * Apply quality level settings
   */
  applyQualityLevel(level) {
    this.metrics.performance.level = level;
    
    // Record adjustment in history
    this.metrics.performance.adjustmentHistory.push({
      timestamp: Date.now(),
      from: this.metrics.performance.level,
      to: level,
      reason: 'auto_adjustment'
    });
    
    // Apply through mobile support system
    if (this.mobile3DSupport) {
      this.mobile3DSupport.setQualityLevel(level);
    }
  }

  /**
   * Perform memory cleanup
   */
  performMemoryCleanup() {
    const now = Date.now();
    if (now - this.optimizations.lastCleanup < this.optimizations.memoryCleanupInterval) {
      return; // Too soon since last cleanup
    }
    
    console.log('🧹 Performing memory cleanup...');
    
    const renderer = this.sceneManager.getRenderer();
    if (renderer) {
      // Force garbage collection of unused resources
      renderer.info.autoReset = false;
      renderer.info.reset();
      renderer.info.autoReset = true;
    }
    
    // Suggest garbage collection if available
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }
    
    this.optimizations.lastCleanup = now;
    console.log('✅ Memory cleanup completed');
  }

  /**
   * Perform emergency cleanup for critical memory situations
   */
  performEmergencyCleanup() {
    console.warn('🚨 Performing emergency memory cleanup...');
    
    // Force immediate cleanup
    this.performMemoryCleanup();
    
    // Reduce quality to minimum
    this.applyQualityLevel('low');
    
    // Clear any cached assets if possible
    const scene = this.sceneManager.getScene();
    if (scene) {
      scene.traverse((object) => {
        if (object.material && object.material.map) {
          // Dispose of texture if it's not being used elsewhere
          if (object.material.map.image && object.material.map.image.src) {
            object.material.map.dispose();
          }
        }
      });
    }
    
    console.warn('🚨 Emergency cleanup completed');
  }

  /**
   * Optimize rendering performance
   */
  optimizeRendering() {
    console.log('🎨 Optimizing rendering performance...');
    
    const renderer = this.sceneManager.getRenderer();
    if (!renderer) return;
    
    // Reduce shadow map size
    const scene = this.sceneManager.getScene();
    if (scene) {
      scene.traverse((object) => {
        if (object.isLight && object.shadow) {
          object.shadow.mapSize.width = Math.min(object.shadow.mapSize.width, 512);
          object.shadow.mapSize.height = Math.min(object.shadow.mapSize.height, 512);
        }
      });
    }
    
    // Reduce pixel ratio
    const currentPixelRatio = renderer.getPixelRatio();
    if (currentPixelRatio > 1) {
      renderer.setPixelRatio(Math.max(1, currentPixelRatio * 0.8));
    }
    
    console.log('✅ Rendering optimization completed');
  }

  /**
   * Log performance summary
   */
  logPerformanceSummary() {
    const summary = {
      fps: {
        current: this.metrics.fps.current,
        average: Math.round(this.metrics.fps.average),
        min: this.metrics.fps.min,
        max: this.metrics.fps.max
      },
      memory: {
        geometries: this.metrics.memory.geometries,
        textures: this.metrics.memory.textures,
        programs: this.metrics.memory.programs
      },
      rendering: {
        drawCalls: this.metrics.rendering.drawCalls,
        triangles: this.metrics.rendering.triangles
      },
      quality: this.metrics.performance.level
    };
    
    console.log('📊 Performance Summary:', summary);
  }

  /**
   * Get current performance metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Get performance status
   */
  getPerformanceStatus() {
    const fps = this.metrics.fps.current;
    const memoryUsage = this.memoryAPIAvailable ? 
      (this.metrics.memory.used / this.metrics.memory.total) : 0;
    
    let status = 'good';
    if (fps < this.thresholds.fps.minimum || memoryUsage > this.thresholds.memory.warning) {
      status = 'poor';
    } else if (fps < this.thresholds.fps.target || memoryUsage > this.thresholds.memory.warning * 0.7) {
      status = 'fair';
    }
    
    return {
      status,
      fps: fps,
      memoryUsage: memoryUsage,
      qualityLevel: this.metrics.performance.level,
      isMonitoring: this.isMonitoring
    };
  }

  /**
   * Enable/disable automatic quality adjustment
   */
  setAutoQualityAdjustment(enabled) {
    this.optimizations.autoQualityAdjustment = enabled;
    console.log(`🎛️ Auto quality adjustment ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Manually set quality level
   */
  setQualityLevel(level) {
    if (!['low', 'medium', 'high'].includes(level)) {
      console.error(`❌ Invalid quality level: ${level}`);
      return false;
    }
    
    this.applyQualityLevel(level);
    console.log(`🎛️ Quality level manually set to: ${level}`);
    return true;
  }

  /**
   * Get system status for debugging
   */
  getSystemStatus() {
    return {
      isMonitoring: this.isMonitoring,
      performanceStatus: this.getPerformanceStatus(),
      optimizations: this.optimizations,
      thresholds: this.thresholds,
      memoryAPIAvailable: this.memoryAPIAvailable
    };
  }

  /**
   * Clean up performance monitor
   */
  cleanup() {
    this.stopMonitoring();
    
    // Clear any remaining intervals
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    console.log('🧹 Performance monitor cleaned up');
  }
}

// Export for use in other modules
window.PerformanceMonitor = PerformanceMonitor;