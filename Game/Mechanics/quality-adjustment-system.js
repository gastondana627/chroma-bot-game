/**
 * Quality Adjustment System
 * Automatic quality adjustment based on device capabilities and performance
 * Integrates with gaming mechanics for optimal user experience
 */

class QualityAdjustmentSystem {
  constructor(performanceMonitor, mobile3DSupport, gamingEngine) {
    this.performanceMonitor = performanceMonitor;
    this.mobile3DSupport = mobile3DSupport;
    this.gamingEngine = gamingEngine;
    this.isInitialized = false;
    
    // Quality levels and their settings
    this.qualityLevels = {
      ultra: {
        name: 'Ultra',
        renderScale: 1.0,
        shadowQuality: 'high',
        textureQuality: 'high',
        particleCount: 100,
        animationQuality: 'high',
        audioQuality: 'high',
        mechanicsComplexity: 'high',
        evidenceDetail: 'high',
        uiAnimations: true,
        postProcessing: true,
        minFPS: 45,
        targetFPS: 60
      },
      high: {
        name: 'High',
        renderScale: 0.9,
        shadowQuality: 'medium',
        textureQuality: 'high',
        particleCount: 75,
        animationQuality: 'high',
        audioQuality: 'high',
        mechanicsComplexity: 'high',
        evidenceDetail: 'medium',
        uiAnimations: true,
        postProcessing: true,
        minFPS: 35,
        targetFPS: 50
      },
      medium: {
        name: 'Medium',
        renderScale: 0.8,
        shadowQuality: 'medium',
        textureQuality: 'medium',
        particleCount: 50,
        animationQuality: 'medium',
        audioQuality: 'medium',
        mechanicsComplexity: 'medium',
        evidenceDetail: 'medium',
        uiAnimations: true,
        postProcessing: false,
        minFPS: 25,
        targetFPS: 40
      },
      low: {
        name: 'Low',
        renderScale: 0.7,
        shadowQuality: 'low',
        textureQuality: 'low',
        particleCount: 25,
        animationQuality: 'low',
        audioQuality: 'medium',
        mechanicsComplexity: 'low',
        evidenceDetail: 'low',
        uiAnimations: false,
        postProcessing: false,
        minFPS: 20,
        targetFPS: 30
      },
      minimal: {
        name: 'Minimal',
        renderScale: 0.6,
        shadowQuality: 'off',
        textureQuality: 'low',
        particleCount: 10,
        animationQuality: 'low',
        audioQuality: 'low',
        mechanicsComplexity: 'minimal',
        evidenceDetail: 'minimal',
        uiAnimations: false,
        postProcessing: false,
        minFPS: 15,
        targetFPS: 25
      }
    };
    
    // Current state
    this.currentQuality = 'medium';
    this.autoAdjustment = true;
    this.adjustmentHistory = [];
    this.lastAdjustment = Date.now();
    
    // Device capabilities
    this.deviceCapabilities = {
      isMobile: false,
      isTablet: false,
      hasWebGL2: false,
      maxTextureSize: 0,
      maxRenderBufferSize: 0,
      memoryEstimate: 0,
      cpuCores: 1,
      gpuTier: 'unknown'
    };
    
    // Performance tracking
    this.performanceHistory = {
      fps: [],
      frameTime: [],
      memoryUsage: [],
      loadTimes: [],
      sampleSize: 30
    };
    
    // Adjustment rules
    this.adjustmentRules = {
      fpsThreshold: {
        upgrade: 10,    // FPS above target for this many samples
        downgrade: 5    // FPS below minimum for this many samples
      },
      memoryThreshold: {
        warning: 0.8,   // 80% memory usage
        critical: 0.9   // 90% memory usage
      },
      loadTimeThreshold: {
        acceptable: 2000,  // 2 seconds
        poor: 5000        // 5 seconds
      },
      adjustmentCooldown: 10000 // 10 seconds between adjustments
    };
    
    this.initialize();
  }

  /**
   * Initialize quality adjustment system
   */
  initialize() {
    try {
      // Detect device capabilities
      this.detectDeviceCapabilities();
      
      // Set initial quality based on device
      this.setInitialQuality();
      
      // Set up performance monitoring
      this.setupPerformanceMonitoring();
      
      // Set up automatic adjustment
      this.setupAutomaticAdjustment();
      
      this.isInitialized = true;
      console.log('✅ Quality adjustment system initialized');
      console.log(`📊 Initial quality: ${this.currentQuality}`);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize quality adjustment system:', error);
      return false;
    }
  }

  /**
   * Detect device capabilities
   */
  detectDeviceCapabilities() {
    // Detect mobile/tablet
    this.deviceCapabilities.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.deviceCapabilities.isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    
    // Detect WebGL capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (gl) {
      this.deviceCapabilities.hasWebGL2 = !!canvas.getContext('webgl2');
      this.deviceCapabilities.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      this.deviceCapabilities.maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
      
      // Get GPU info if available
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        this.deviceCapabilities.gpuTier = this.classifyGPU(renderer);
      }
    }
    
    // Estimate memory
    if ('memory' in performance) {
      this.deviceCapabilities.memoryEstimate = performance.memory.totalJSHeapSize;
    } else {
      // Fallback estimation based on device type
      this.deviceCapabilities.memoryEstimate = this.deviceCapabilities.isMobile ? 
        512 * 1024 * 1024 : 2 * 1024 * 1024 * 1024; // 512MB mobile, 2GB desktop
    }
    
    // Estimate CPU cores
    this.deviceCapabilities.cpuCores = navigator.hardwareConcurrency || 1;
    
    console.log('📱 Device capabilities detected:', this.deviceCapabilities);
  }

  /**
   * Classify GPU tier based on renderer string
   */
  classifyGPU(renderer) {
    const gpuString = renderer.toLowerCase();
    
    // High-end GPUs
    if (gpuString.includes('rtx') || gpuString.includes('gtx 1080') || 
        gpuString.includes('gtx 1070') || gpuString.includes('rx 6800') ||
        gpuString.includes('rx 6900')) {
      return 'high';
    }
    
    // Mid-range GPUs
    if (gpuString.includes('gtx 1060') || gpuString.includes('gtx 1050') ||
        gpuString.includes('rx 580') || gpuString.includes('rx 570')) {
      return 'medium';
    }
    
    // Integrated/low-end GPUs
    if (gpuString.includes('intel') || gpuString.includes('integrated') ||
        gpuString.includes('adreno') || gpuString.includes('mali')) {
      return 'low';
    }
    
    return 'unknown';
  }

  /**
   * Set initial quality based on device capabilities
   */
  setInitialQuality() {
    let initialQuality = 'medium';
    
    // Mobile devices start lower
    if (this.deviceCapabilities.isMobile) {
      initialQuality = 'low';
    }
    
    // Adjust based on GPU tier
    switch (this.deviceCapabilities.gpuTier) {
      case 'high':
        initialQuality = this.deviceCapabilities.isMobile ? 'medium' : 'high';
        break;
      case 'medium':
        initialQuality = 'medium';
        break;
      case 'low':
        initialQuality = this.deviceCapabilities.isMobile ? 'minimal' : 'low';
        break;
    }
    
    // Adjust based on memory
    const memoryGB = this.deviceCapabilities.memoryEstimate / (1024 * 1024 * 1024);
    if (memoryGB < 1) {
      initialQuality = 'minimal';
    } else if (memoryGB < 2) {
      initialQuality = Math.min(initialQuality, 'low');
    }
    
    // Adjust based on CPU cores
    if (this.deviceCapabilities.cpuCores < 2) {
      initialQuality = Math.min(initialQuality, 'low');
    }
    
    this.setQuality(initialQuality, 'initial_detection');
  }

  /**
   * Set up performance monitoring
   */
  setupPerformanceMonitoring() {
    if (this.performanceMonitor) {
      // Hook into performance monitor events
      setInterval(() => {
        this.collectPerformanceData();
      }, 1000);
    }
  }

  /**
   * Set up automatic adjustment
   */
  setupAutomaticAdjustment() {
    setInterval(() => {
      if (this.autoAdjustment) {
        this.evaluateAndAdjustQuality();
      }
    }, 2000); // Check every 2 seconds
  }

  /**
   * Collect performance data
   */
  collectPerformanceData() {
    if (!this.performanceMonitor) return;
    
    const metrics = this.performanceMonitor.getMetrics();
    
    // Collect FPS data
    if (metrics.fps.current > 0) {
      this.addToHistory('fps', metrics.fps.current);
    }
    
    // Collect memory data
    if (metrics.memory.used > 0) {
      const memoryUsageRatio = metrics.memory.used / metrics.memory.total;
      this.addToHistory('memoryUsage', memoryUsageRatio);
    }
    
    // Collect frame time (derived from FPS)
    if (metrics.fps.current > 0) {
      const frameTime = 1000 / metrics.fps.current;
      this.addToHistory('frameTime', frameTime);
    }
  }

  /**
   * Add data to performance history
   */
  addToHistory(metric, value) {
    if (!this.performanceHistory[metric]) {
      this.performanceHistory[metric] = [];
    }
    
    this.performanceHistory[metric].push(value);
    
    // Keep only recent samples
    if (this.performanceHistory[metric].length > this.performanceHistory.sampleSize) {
      this.performanceHistory[metric].shift();
    }
  }

  /**
   * Evaluate and adjust quality if needed
   */
  evaluateAndAdjustQuality() {
    const now = Date.now();
    
    // Check cooldown
    if (now - this.lastAdjustment < this.adjustmentRules.adjustmentCooldown) {
      return;
    }
    
    const currentSettings = this.qualityLevels[this.currentQuality];
    const performanceAnalysis = this.analyzePerformance();
    
    // Determine if adjustment is needed
    let newQuality = this.currentQuality;
    let reason = '';
    
    // Check for downgrade conditions
    if (performanceAnalysis.shouldDowngrade) {
      newQuality = this.getNextLowerQuality(this.currentQuality);
      reason = performanceAnalysis.downgradeReason;
    }
    // Check for upgrade conditions
    else if (performanceAnalysis.shouldUpgrade) {
      newQuality = this.getNextHigherQuality(this.currentQuality);
      reason = performanceAnalysis.upgradeReason;
    }
    
    // Apply adjustment if needed
    if (newQuality !== this.currentQuality) {
      this.setQuality(newQuality, reason);
      this.lastAdjustment = now;
    }
  }

  /**
   * Analyze current performance
   */
  analyzePerformance() {
    const analysis = {
      shouldUpgrade: false,
      shouldDowngrade: false,
      upgradeReason: '',
      downgradeReason: ''
    };
    
    const currentSettings = this.qualityLevels[this.currentQuality];
    const fpsHistory = this.performanceHistory.fps;
    const memoryHistory = this.performanceHistory.memoryUsage;
    
    // Analyze FPS performance
    if (fpsHistory.length >= 10) {
      const recentFPS = fpsHistory.slice(-10);
      const avgFPS = recentFPS.reduce((sum, fps) => sum + fps, 0) / recentFPS.length;
      const lowFPSCount = recentFPS.filter(fps => fps < currentSettings.minFPS).length;
      const highFPSCount = recentFPS.filter(fps => fps > currentSettings.targetFPS + 10).length;
      
      // Check for downgrade (poor performance)
      if (lowFPSCount >= this.adjustmentRules.fpsThreshold.downgrade) {
        analysis.shouldDowngrade = true;
        analysis.downgradeReason = `Low FPS: ${avgFPS.toFixed(1)} (target: ${currentSettings.targetFPS})`;
      }
      // Check for upgrade (excellent performance)
      else if (highFPSCount >= this.adjustmentRules.fpsThreshold.upgrade && 
               this.currentQuality !== 'ultra') {
        analysis.shouldUpgrade = true;
        analysis.upgradeReason = `High FPS: ${avgFPS.toFixed(1)} (target: ${currentSettings.targetFPS})`;
      }
    }
    
    // Analyze memory usage
    if (memoryHistory.length >= 5) {
      const recentMemory = memoryHistory.slice(-5);
      const avgMemoryUsage = recentMemory.reduce((sum, usage) => sum + usage, 0) / recentMemory.length;
      
      if (avgMemoryUsage > this.adjustmentRules.memoryThreshold.critical) {
        analysis.shouldDowngrade = true;
        analysis.downgradeReason = `Critical memory usage: ${(avgMemoryUsage * 100).toFixed(1)}%`;
      } else if (avgMemoryUsage > this.adjustmentRules.memoryThreshold.warning && 
                 analysis.shouldUpgrade) {
        // Cancel upgrade if memory usage is high
        analysis.shouldUpgrade = false;
        analysis.upgradeReason = '';
      }
    }
    
    return analysis;
  }

  /**
   * Get next lower quality level
   */
  getNextLowerQuality(currentQuality) {
    const levels = ['ultra', 'high', 'medium', 'low', 'minimal'];
    const currentIndex = levels.indexOf(currentQuality);
    
    if (currentIndex < levels.length - 1) {
      return levels[currentIndex + 1];
    }
    
    return currentQuality; // Already at lowest
  }

  /**
   * Get next higher quality level
   */
  getNextHigherQuality(currentQuality) {
    const levels = ['minimal', 'low', 'medium', 'high', 'ultra'];
    const currentIndex = levels.indexOf(currentQuality);
    
    if (currentIndex < levels.length - 1) {
      return levels[currentIndex + 1];
    }
    
    return currentQuality; // Already at highest
  }

  /**
   * Set quality level
   */
  setQuality(qualityLevel, reason = 'manual') {
    if (!this.qualityLevels[qualityLevel]) {
      console.error(`❌ Invalid quality level: ${qualityLevel}`);
      return false;
    }
    
    const oldQuality = this.currentQuality;
    this.currentQuality = qualityLevel;
    const settings = this.qualityLevels[qualityLevel];
    
    // Record adjustment
    this.adjustmentHistory.push({
      timestamp: Date.now(),
      from: oldQuality,
      to: qualityLevel,
      reason: reason
    });
    
    // Keep history manageable
    if (this.adjustmentHistory.length > 50) {
      this.adjustmentHistory.shift();
    }
    
    // Apply settings
    this.applyQualitySettings(settings);
    
    console.log(`🎛️ Quality adjusted: ${oldQuality} → ${qualityLevel} (${reason})`);
    return true;
  }

  /**
   * Apply quality settings to all systems
   */
  applyQualitySettings(settings) {
    // Apply to 3D rendering system
    if (this.mobile3DSupport) {
      this.mobile3DSupport.setRenderScale(settings.renderScale);
      this.mobile3DSupport.setShadowQuality(settings.shadowQuality);
      this.mobile3DSupport.setTextureQuality(settings.textureQuality);
      this.mobile3DSupport.setParticleCount(settings.particleCount);
      this.mobile3DSupport.setPostProcessing(settings.postProcessing);
    }
    
    // Apply to gaming mechanics
    if (this.gamingEngine) {
      this.gamingEngine.setMechanicsComplexity(settings.mechanicsComplexity);
      this.gamingEngine.setEvidenceDetail(settings.evidenceDetail);
      this.gamingEngine.setAnimationQuality(settings.animationQuality);
      this.gamingEngine.setUIAnimations(settings.uiAnimations);
    }
    
    // Apply audio quality
    this.applyAudioQuality(settings.audioQuality);
    
    // Dispatch quality change event
    this.dispatchQualityChangeEvent(settings);
  }

  /**
   * Apply audio quality settings
   */
  applyAudioQuality(quality) {
    const audioSettings = {
      high: { bitrate: 128, sampleRate: 44100 },
      medium: { bitrate: 96, sampleRate: 44100 },
      low: { bitrate: 64, sampleRate: 22050 }
    };
    
    const settings = audioSettings[quality] || audioSettings.medium;
    
    // Apply to audio context if available
    if (window.AudioContext || window.webkitAudioContext) {
      // Audio quality adjustments would go here
      console.log(`🔊 Audio quality set to: ${quality}`, settings);
    }
  }

  /**
   * Dispatch quality change event
   */
  dispatchQualityChangeEvent(settings) {
    const event = new CustomEvent('qualityChanged', {
      detail: {
        quality: this.currentQuality,
        settings: settings,
        timestamp: Date.now()
      }
    });
    
    document.dispatchEvent(event);
  }

  /**
   * Get current quality level
   */
  getCurrentQuality() {
    return this.currentQuality;
  }

  /**
   * Get quality settings
   */
  getQualitySettings(qualityLevel = null) {
    const level = qualityLevel || this.currentQuality;
    return { ...this.qualityLevels[level] };
  }

  /**
   * Get all available quality levels
   */
  getAvailableQualities() {
    return Object.keys(this.qualityLevels);
  }

  /**
   * Enable/disable automatic adjustment
   */
  setAutoAdjustment(enabled) {
    this.autoAdjustment = enabled;
    console.log(`🤖 Auto quality adjustment ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get performance analysis
   */
  getPerformanceAnalysis() {
    const analysis = this.analyzePerformance();
    const currentSettings = this.qualityLevels[this.currentQuality];
    
    return {
      currentQuality: this.currentQuality,
      currentSettings: currentSettings,
      deviceCapabilities: this.deviceCapabilities,
      performanceHistory: this.performanceHistory,
      analysis: analysis,
      adjustmentHistory: this.adjustmentHistory.slice(-10) // Last 10 adjustments
    };
  }

  /**
   * Force quality adjustment for testing
   */
  forceQualityAdjustment(direction) {
    let newQuality;
    
    if (direction === 'up') {
      newQuality = this.getNextHigherQuality(this.currentQuality);
    } else if (direction === 'down') {
      newQuality = this.getNextLowerQuality(this.currentQuality);
    } else {
      console.error(`❌ Invalid adjustment direction: ${direction}`);
      return false;
    }
    
    return this.setQuality(newQuality, `forced_${direction}`);
  }

  /**
   * Reset to optimal quality based on current performance
   */
  resetToOptimalQuality() {
    // Analyze recent performance
    const analysis = this.analyzePerformance();
    let optimalQuality = this.currentQuality;
    
    // If performance is consistently good, try higher quality
    if (!analysis.shouldDowngrade && this.performanceHistory.fps.length > 0) {
      const avgFPS = this.performanceHistory.fps.reduce((sum, fps) => sum + fps, 0) / 
                    this.performanceHistory.fps.length;
      
      if (avgFPS > 45) {
        optimalQuality = 'high';
      } else if (avgFPS > 35) {
        optimalQuality = 'medium';
      } else if (avgFPS > 25) {
        optimalQuality = 'low';
      } else {
        optimalQuality = 'minimal';
      }
    }
    
    return this.setQuality(optimalQuality, 'reset_to_optimal');
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    return {
      isInitialized: this.isInitialized,
      currentQuality: this.currentQuality,
      autoAdjustment: this.autoAdjustment,
      deviceCapabilities: this.deviceCapabilities,
      lastAdjustment: this.lastAdjustment,
      adjustmentHistory: this.adjustmentHistory.length,
      performanceDataPoints: {
        fps: this.performanceHistory.fps.length,
        memory: this.performanceHistory.memoryUsage.length,
        frameTime: this.performanceHistory.frameTime.length
      }
    };
  }

  /**
   * Clean up quality adjustment system
   */
  cleanup() {
    // Clear performance history
    Object.keys(this.performanceHistory).forEach(key => {
      if (Array.isArray(this.performanceHistory[key])) {
        this.performanceHistory[key] = [];
      }
    });
    
    // Clear adjustment history
    this.adjustmentHistory = [];
    
    console.log('🧹 Quality adjustment system cleaned up');
  }
}

// Export for use in other modules
window.QualityAdjustmentSystem = QualityAdjustmentSystem;