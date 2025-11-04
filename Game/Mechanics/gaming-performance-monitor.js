/**
 * Gaming Performance Monitor
 * Specialized performance monitoring for interactive gaming mechanics
 * Integrates with base performance monitor for 3D rendering and gameplay optimization
 */

class GamingPerformanceMonitor {
  constructor(performanceMonitor, gamingMechanicsEngine) {
    this.performanceMonitor = performanceMonitor;
    this.gamingEngine = gamingMechanicsEngine;
    this.isMonitoring = false;
    this.monitoringInterval = null;
    
    // Gaming-specific metrics
    this.gamingMetrics = {
      mechanics: {
        investigation: {
          loadTime: 0,
          responseTime: 0,
          memoryUsage: 0,
          activeScenarios: 0
        },
        realTime: {
          decisionLatency: 0,
          timerAccuracy: 0,
          scenarioSwitchTime: 0,
          activeTimers: 0
        },
        puzzles: {
          generationTime: 0,
          evaluationTime: 0,
          memoryPerPuzzle: 0,
          activePuzzles: 0
        },
        actionSequences: {
          sequenceLoadTime: 0,
          inputLatency: 0,
          animationFrameRate: 0,
          activeSequences: 0
        },
        modeSystem: {
          switchTime: 0,
          uiUpdateTime: 0,
          stateTransitionTime: 0,
          currentMode: null
        }
      },
      scenarios: {
        loadingTimes: new Map(),
        memoryUsage: new Map(),
        completionRates: new Map(),
        errorRates: new Map()
      },
      user: {
        interactionLatency: 0,
        decisionTime: 0,
        engagementScore: 0,
        sessionDuration: 0
      }
    };
    
    // Performance thresholds for gaming mechanics
    this.gamingThresholds = {
      loadTime: {
        excellent: 100,  // ms
        good: 300,
        poor: 1000
      },
      responseTime: {
        excellent: 50,   // ms
        good: 150,
        poor: 500
      },
      memoryPerScenario: {
        excellent: 5,    // MB
        good: 15,
        poor: 50
      },
      frameRate: {
        target: 30,      // fps for gaming mechanics
        minimum: 20
      }
    };
    
    // Optimization settings
    this.optimizations = {
      scenarioPreloading: true,
      memoryPooling: true,
      assetCaching: true,
      qualityScaling: true,
      lastOptimization: Date.now()
    };
    
    this.initialize();
  }

  /**
   * Initialize gaming performance monitoring
   */
  initialize() {
    try {
      // Set up gaming metrics collection
      this.setupGamingMetrics();
      
      // Set up scenario performance tracking
      this.setupScenarioTracking();
      
      // Set up user interaction monitoring
      this.setupUserInteractionMonitoring();
      
      // Set up automatic optimization
      this.setupAutomaticOptimization();
      
      console.log('✅ Gaming performance monitor initialized');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize gaming performance monitor:', error);
      return false;
    }
  }

  /**
   * Start gaming performance monitoring
   */
  startMonitoring() {
    if (this.isMonitoring) {
      console.warn('⚠️ Gaming performance monitoring already active');
      return;
    }
    
    this.isMonitoring = true;
    this.sessionStartTime = Date.now();
    
    // Start base performance monitoring
    if (this.performanceMonitor && !this.performanceMonitor.isMonitoring) {
      this.performanceMonitor.startMonitoring();
    }
    
    // Start gaming-specific monitoring
    this.monitoringInterval = setInterval(() => {
      this.collectGamingMetrics();
      this.analyzePerformance();
      this.optimizeIfNeeded();
    }, 1000); // Check every second
    
    console.log('🎮 Gaming performance monitoring started');
  }

  /**
   * Stop gaming performance monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    
    // Update session duration
    if (this.sessionStartTime) {
      this.gamingMetrics.user.sessionDuration = Date.now() - this.sessionStartTime;
    }
    
    // Clear monitoring interval
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    console.log('🎮 Gaming performance monitoring stopped');
  }

  /**
   * Set up gaming metrics collection
   */
  setupGamingMetrics() {
    // Hook into gaming engine events
    if (this.gamingEngine) {
      this.gamingEngine.on('mechanicActivated', (mechanic, startTime) => {
        this.trackMechanicActivation(mechanic, startTime);
      });
      
      this.gamingEngine.on('mechanicCompleted', (mechanic, duration, success) => {
        this.trackMechanicCompletion(mechanic, duration, success);
      });
      
      this.gamingEngine.on('scenarioLoaded', (scenario, loadTime) => {
        this.trackScenarioLoad(scenario, loadTime);
      });
      
      this.gamingEngine.on('modeChanged', (fromMode, toMode, switchTime) => {
        this.trackModeChange(fromMode, toMode, switchTime);
      });
    }
  }

  /**
   * Set up scenario performance tracking
   */
  setupScenarioTracking() {
    this.scenarioTracker = {
      activeScenarios: new Map(),
      loadingQueue: [],
      memoryPool: new Map()
    };
  }

  /**
   * Set up user interaction monitoring
   */
  setupUserInteractionMonitoring() {
    // Track click/touch latency
    document.addEventListener('click', (event) => {
      if (this.isMonitoring) {
        this.trackUserInteraction('click', event);
      }
    });
    
    // Track decision timing
    this.decisionStartTime = null;
  }

  /**
   * Set up automatic optimization
   */
  setupAutomaticOptimization() {
    this.optimizationRules = [
      {
        condition: () => this.gamingMetrics.mechanics.investigation.loadTime > this.gamingThresholds.loadTime.poor,
        action: () => this.optimizeInvestigationLoading()
      },
      {
        condition: () => this.gamingMetrics.mechanics.realTime.decisionLatency > this.gamingThresholds.responseTime.poor,
        action: () => this.optimizeRealTimeResponsiveness()
      },
      {
        condition: () => this.getTotalMemoryUsage() > 100, // 100MB
        action: () => this.optimizeMemoryUsage()
      }
    ];
  }

  /**
   * Track mechanic activation
   */
  trackMechanicActivation(mechanic, startTime) {
    const mechanicMetrics = this.gamingMetrics.mechanics[mechanic];
    if (mechanicMetrics) {
      mechanicMetrics.loadTime = Date.now() - startTime;
      
      // Track active count
      const activeKey = `active${mechanic.charAt(0).toUpperCase() + mechanic.slice(1)}s`;
      if (mechanicMetrics[activeKey] !== undefined) {
        mechanicMetrics[activeKey]++;
      }
    }
  }

  /**
   * Track mechanic completion
   */
  trackMechanicCompletion(mechanic, duration, success) {
    const mechanicMetrics = this.gamingMetrics.mechanics[mechanic];
    if (mechanicMetrics) {
      mechanicMetrics.responseTime = duration;
      
      // Update completion rates
      const scenarioId = `${mechanic}_scenario`;
      if (!this.gamingMetrics.scenarios.completionRates.has(scenarioId)) {
        this.gamingMetrics.scenarios.completionRates.set(scenarioId, { completed: 0, total: 0 });
      }
      
      const rates = this.gamingMetrics.scenarios.completionRates.get(scenarioId);
      rates.total++;
      if (success) rates.completed++;
      
      // Track active count
      const activeKey = `active${mechanic.charAt(0).toUpperCase() + mechanic.slice(1)}s`;
      if (mechanicMetrics[activeKey] !== undefined && mechanicMetrics[activeKey] > 0) {
        mechanicMetrics[activeKey]--;
      }
    }
  }

  /**
   * Track scenario loading
   */
  trackScenarioLoad(scenario, loadTime) {
    this.gamingMetrics.scenarios.loadingTimes.set(scenario.id, loadTime);
    
    // Estimate memory usage
    const estimatedMemory = this.estimateScenarioMemoryUsage(scenario);
    this.gamingMetrics.scenarios.memoryUsage.set(scenario.id, estimatedMemory);
  }

  /**
   * Track mode changes
   */
  trackModeChange(fromMode, toMode, switchTime) {
    this.gamingMetrics.mechanics.modeSystem.switchTime = switchTime;
    this.gamingMetrics.mechanics.modeSystem.currentMode = toMode;
  }

  /**
   * Track user interactions
   */
  trackUserInteraction(type, event) {
    const interactionTime = Date.now();
    
    // Calculate interaction latency (time from event to processing)
    const latency = interactionTime - event.timeStamp;
    this.gamingMetrics.user.interactionLatency = latency;
    
    // Track decision timing
    if (event.target.classList.contains('decision-option')) {
      if (this.decisionStartTime) {
        this.gamingMetrics.user.decisionTime = interactionTime - this.decisionStartTime;
        this.decisionStartTime = null;
      }
    }
  }

  /**
   * Start decision timing
   */
  startDecisionTiming() {
    this.decisionStartTime = Date.now();
  }

  /**
   * Collect gaming metrics
   */
  collectGamingMetrics() {
    // Update memory usage for active scenarios
    this.updateScenarioMemoryUsage();
    
    // Update engagement score
    this.updateEngagementScore();
    
    // Collect frame rate for gaming mechanics
    this.collectGamingFrameRate();
  }

  /**
   * Update scenario memory usage
   */
  updateScenarioMemoryUsage() {
    let totalMemory = 0;
    
    this.scenarioTracker.activeScenarios.forEach((scenario, id) => {
      const memory = this.estimateScenarioMemoryUsage(scenario);
      this.gamingMetrics.scenarios.memoryUsage.set(id, memory);
      totalMemory += memory;
    });
    
    return totalMemory;
  }

  /**
   * Estimate scenario memory usage
   */
  estimateScenarioMemoryUsage(scenario) {
    // Basic estimation based on scenario complexity
    let memory = 1; // Base 1MB
    
    if (scenario.evidence) memory += scenario.evidence.length * 0.5;
    if (scenario.assets) memory += scenario.assets.length * 2;
    if (scenario.animations) memory += scenario.animations.length * 1.5;
    
    return memory;
  }

  /**
   * Update engagement score
   */
  updateEngagementScore() {
    const sessionDuration = Date.now() - (this.sessionStartTime || Date.now());
    const interactions = this.gamingMetrics.user.interactionLatency > 0 ? 1 : 0;
    const completions = Array.from(this.gamingMetrics.scenarios.completionRates.values())
      .reduce((sum, rates) => sum + rates.completed, 0);
    
    // Simple engagement calculation
    this.gamingMetrics.user.engagementScore = Math.min(100, 
      (interactions * 10) + (completions * 20) + Math.min(sessionDuration / 60000, 10)
    );
  }

  /**
   * Collect gaming frame rate
   */
  collectGamingFrameRate() {
    if (this.performanceMonitor) {
      const fps = this.performanceMonitor.getMetrics().fps.current;
      
      // Update gaming-specific frame rate tracking
      Object.values(this.gamingMetrics.mechanics).forEach(mechanic => {
        if (mechanic.animationFrameRate !== undefined) {
          mechanic.animationFrameRate = fps;
        }
      });
    }
  }

  /**
   * Analyze performance and identify issues
   */
  analyzePerformance() {
    const issues = [];
    
    // Check loading times
    Object.entries(this.gamingMetrics.mechanics).forEach(([mechanic, metrics]) => {
      if (metrics.loadTime > this.gamingThresholds.loadTime.poor) {
        issues.push({
          type: 'slow_loading',
          mechanic: mechanic,
          value: metrics.loadTime,
          threshold: this.gamingThresholds.loadTime.poor
        });
      }
      
      if (metrics.responseTime > this.gamingThresholds.responseTime.poor) {
        issues.push({
          type: 'slow_response',
          mechanic: mechanic,
          value: metrics.responseTime,
          threshold: this.gamingThresholds.responseTime.poor
        });
      }
    });
    
    // Check memory usage
    const totalMemory = this.getTotalMemoryUsage();
    if (totalMemory > 100) { // 100MB threshold
      issues.push({
        type: 'high_memory',
        value: totalMemory,
        threshold: 100
      });
    }
    
    // Log issues if found
    if (issues.length > 0) {
      console.warn('⚠️ Gaming performance issues detected:', issues);
    }
    
    return issues;
  }

  /**
   * Get total memory usage
   */
  getTotalMemoryUsage() {
    return Array.from(this.gamingMetrics.scenarios.memoryUsage.values())
      .reduce((sum, memory) => sum + memory, 0);
  }

  /**
   * Optimize if needed
   */
  optimizeIfNeeded() {
    const now = Date.now();
    if (now - this.optimizations.lastOptimization < 5000) {
      return; // Don't optimize too frequently
    }
    
    // Check optimization rules
    this.optimizationRules.forEach(rule => {
      if (rule.condition()) {
        rule.action();
        this.optimizations.lastOptimization = now;
      }
    });
  }

  /**
   * Optimize investigation loading
   */
  optimizeInvestigationLoading() {
    console.log('🔍 Optimizing investigation loading...');
    
    // Enable scenario preloading
    this.optimizations.scenarioPreloading = true;
    
    // Reduce evidence complexity for slower devices
    if (this.performanceMonitor) {
      const status = this.performanceMonitor.getPerformanceStatus();
      if (status.status === 'poor') {
        this.gamingEngine.setEvidenceComplexity('low');
      }
    }
  }

  /**
   * Optimize real-time responsiveness
   */
  optimizeRealTimeResponsiveness() {
    console.log('⚡ Optimizing real-time responsiveness...');
    
    // Reduce timer precision for better performance
    this.gamingEngine.setTimerPrecision('low');
    
    // Simplify decision processing
    this.gamingEngine.setDecisionProcessingMode('fast');
  }

  /**
   * Optimize memory usage
   */
  optimizeMemoryUsage() {
    console.log('🧹 Optimizing gaming memory usage...');
    
    // Clean up inactive scenarios
    this.cleanupInactiveScenarios();
    
    // Enable memory pooling
    this.optimizations.memoryPooling = true;
    
    // Reduce asset quality
    this.gamingEngine.setAssetQuality('medium');
  }

  /**
   * Clean up inactive scenarios
   */
  cleanupInactiveScenarios() {
    const now = Date.now();
    const inactiveThreshold = 5 * 60 * 1000; // 5 minutes
    
    this.scenarioTracker.activeScenarios.forEach((scenario, id) => {
      if (now - scenario.lastAccessed > inactiveThreshold) {
        this.scenarioTracker.activeScenarios.delete(id);
        this.gamingMetrics.scenarios.memoryUsage.delete(id);
        console.log(`🧹 Cleaned up inactive scenario: ${id}`);
      }
    });
  }

  /**
   * Get gaming performance metrics
   */
  getGamingMetrics() {
    return { ...this.gamingMetrics };
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const baseMetrics = this.performanceMonitor ? 
      this.performanceMonitor.getPerformanceStatus() : {};
    
    return {
      ...baseMetrics,
      gaming: {
        totalMemoryUsage: this.getTotalMemoryUsage(),
        activeScenarios: this.scenarioTracker.activeScenarios.size,
        averageLoadTime: this.getAverageLoadTime(),
        averageResponseTime: this.getAverageResponseTime(),
        engagementScore: this.gamingMetrics.user.engagementScore,
        currentMode: this.gamingMetrics.mechanics.modeSystem.currentMode
      }
    };
  }

  /**
   * Get average load time across all mechanics
   */
  getAverageLoadTime() {
    const loadTimes = Object.values(this.gamingMetrics.mechanics)
      .map(mechanic => mechanic.loadTime || 0)
      .filter(time => time > 0);
    
    return loadTimes.length > 0 ? 
      loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length : 0;
  }

  /**
   * Get average response time across all mechanics
   */
  getAverageResponseTime() {
    const responseTimes = Object.values(this.gamingMetrics.mechanics)
      .map(mechanic => mechanic.responseTime || 0)
      .filter(time => time > 0);
    
    return responseTimes.length > 0 ? 
      responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;
  }

  /**
   * Set optimization preferences
   */
  setOptimizations(options) {
    Object.assign(this.optimizations, options);
    console.log('🎛️ Gaming optimization preferences updated:', options);
  }

  /**
   * Clean up gaming performance monitor
   */
  cleanup() {
    this.stopMonitoring();
    
    // Clean up scenario tracker
    this.scenarioTracker.activeScenarios.clear();
    this.scenarioTracker.memoryPool.clear();
    
    console.log('🧹 Gaming performance monitor cleaned up');
  }
}

// Export for use in other modules
window.GamingPerformanceMonitor = GamingPerformanceMonitor;