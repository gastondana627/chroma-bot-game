/**
 * Scenario Memory Manager
 * Efficient memory management for gaming scenarios and assets
 * Handles preloading, caching, and cleanup of scenario resources
 */

class ScenarioMemoryManager {
  constructor(gamingEngine) {
    this.gamingEngine = gamingEngine;
    this.isInitialized = false;
    
    // Memory pools for different resource types
    this.memoryPools = {
      scenarios: new Map(),
      evidence: new Map(),
      assets: new Map(),
      animations: new Map(),
      audio: new Map()
    };
    
    // Cache management
    this.cache = {
      scenarios: new Map(),
      preloadQueue: [],
      activeScenarios: new Set(),
      lastAccessed: new Map(),
      maxCacheSize: 50 * 1024 * 1024, // 50MB
      currentCacheSize: 0
    };
    
    // Memory tracking
    this.memoryTracking = {
      totalAllocated: 0,
      peakUsage: 0,
      allocations: new Map(),
      deallocations: new Map(),
      leakDetection: new Map()
    };
    
    // Configuration
    this.config = {
      preloadEnabled: true,
      maxPreloadScenarios: 3,
      cacheTimeout: 10 * 60 * 1000, // 10 minutes
      cleanupInterval: 30 * 1000, // 30 seconds
      memoryThreshold: 0.8, // 80% of available memory
      aggressiveCleanup: false
    };
    
    this.initialize();
  }

  /**
   * Initialize memory manager
   */
  initialize() {
    try {
      // Set up memory pools
      this.setupMemoryPools();
      
      // Set up cache management
      this.setupCacheManagement();
      
      // Set up automatic cleanup
      this.setupAutomaticCleanup();
      
      // Set up memory leak detection
      this.setupLeakDetection();
      
      this.isInitialized = true;
      console.log('✅ Scenario memory manager initialized');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize scenario memory manager:', error);
      return false;
    }
  }

  /**
   * Set up memory pools for efficient resource management
   */
  setupMemoryPools() {
    // Initialize pools with default capacities
    const poolConfigs = {
      scenarios: { maxSize: 10, itemSize: 5 * 1024 * 1024 }, // 5MB per scenario
      evidence: { maxSize: 50, itemSize: 1 * 1024 * 1024 },  // 1MB per evidence
      assets: { maxSize: 100, itemSize: 2 * 1024 * 1024 },   // 2MB per asset
      animations: { maxSize: 20, itemSize: 3 * 1024 * 1024 }, // 3MB per animation
      audio: { maxSize: 30, itemSize: 1 * 1024 * 1024 }      // 1MB per audio
    };
    
    Object.entries(poolConfigs).forEach(([poolName, config]) => {
      this.memoryPools[poolName] = new Map();
      this.memoryPools[poolName].maxSize = config.maxSize;
      this.memoryPools[poolName].itemSize = config.itemSize;
      this.memoryPools[poolName].currentSize = 0;
    });
  }

  /**
   * Set up cache management system
   */
  setupCacheManagement() {
    // LRU cache implementation
    this.lruCache = {
      order: [],
      maxSize: 20,
      
      get: (key) => {
        if (this.cache.scenarios.has(key)) {
          // Move to end (most recently used)
          const index = this.lruCache.order.indexOf(key);
          if (index > -1) {
            this.lruCache.order.splice(index, 1);
          }
          this.lruCache.order.push(key);
          
          // Update last accessed time
          this.cache.lastAccessed.set(key, Date.now());
          
          return this.cache.scenarios.get(key);
        }
        return null;
      },
      
      set: (key, value, size) => {
        // Remove if already exists
        if (this.cache.scenarios.has(key)) {
          this.lruCache.remove(key);
        }
        
        // Check if we need to make space
        while (this.cache.currentCacheSize + size > this.cache.maxCacheSize && 
               this.lruCache.order.length > 0) {
          const oldestKey = this.lruCache.order.shift();
          this.lruCache.remove(oldestKey);
        }
        
        // Add new item
        this.cache.scenarios.set(key, value);
        this.cache.currentCacheSize += size;
        this.lruCache.order.push(key);
        this.cache.lastAccessed.set(key, Date.now());
        
        console.log(`📦 Cached scenario: ${key} (${(size / 1024 / 1024).toFixed(2)}MB)`);
      },
      
      remove: (key) => {
        if (this.cache.scenarios.has(key)) {
          const scenario = this.cache.scenarios.get(key);
          const size = this.estimateScenarioSize(scenario);
          
          this.cache.scenarios.delete(key);
          this.cache.currentCacheSize -= size;
          this.cache.lastAccessed.delete(key);
          
          const index = this.lruCache.order.indexOf(key);
          if (index > -1) {
            this.lruCache.order.splice(index, 1);
          }
          
          console.log(`🗑️ Removed from cache: ${key} (${(size / 1024 / 1024).toFixed(2)}MB)`);
        }
      }
    };
  }

  /**
   * Set up automatic cleanup
   */
  setupAutomaticCleanup() {
    setInterval(() => {
      this.performAutomaticCleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Set up memory leak detection
   */
  setupLeakDetection() {
    // Track allocations and deallocations
    this.leakDetector = {
      checkInterval: 60 * 1000, // 1 minute
      lastCheck: Date.now(),
      suspiciousGrowth: 10 * 1024 * 1024, // 10MB growth without cleanup
      
      check: () => {
        const now = Date.now();
        const timeSinceLastCheck = now - this.leakDetector.lastCheck;
        
        if (timeSinceLastCheck > this.leakDetector.checkInterval) {
          const currentUsage = this.getCurrentMemoryUsage();
          const growth = currentUsage - (this.leakDetector.lastUsage || 0);
          
          if (growth > this.leakDetector.suspiciousGrowth) {
            console.warn(`🚨 Potential memory leak detected: ${(growth / 1024 / 1024).toFixed(2)}MB growth`);
            this.performLeakAnalysis();
          }
          
          this.leakDetector.lastUsage = currentUsage;
          this.leakDetector.lastCheck = now;
        }
      }
    };
    
    setInterval(() => {
      this.leakDetector.check();
    }, this.leakDetector.checkInterval);
  }

  /**
   * Load scenario with memory management
   */
  async loadScenario(scenarioId, character, priority = 'normal') {
    try {
      // Check cache first
      const cached = this.lruCache.get(scenarioId);
      if (cached) {
        console.log(`⚡ Loaded scenario from cache: ${scenarioId}`);
        this.cache.activeScenarios.add(scenarioId);
        return cached;
      }
      
      // Check if we have memory available
      if (!this.hasAvailableMemory(scenarioId)) {
        await this.freeMemoryForScenario(scenarioId);
      }
      
      // Load scenario
      const startTime = Date.now();
      const scenario = await this.loadScenarioFromSource(scenarioId, character);
      const loadTime = Date.now() - startTime;
      
      // Estimate and track memory usage
      const size = this.estimateScenarioSize(scenario);
      this.trackAllocation(scenarioId, size);
      
      // Cache the scenario
      this.lruCache.set(scenarioId, scenario, size);
      this.cache.activeScenarios.add(scenarioId);
      
      // Preload related scenarios if enabled
      if (this.config.preloadEnabled && priority === 'high') {
        this.schedulePreloading(scenarioId, character);
      }
      
      console.log(`✅ Loaded scenario: ${scenarioId} (${loadTime}ms, ${(size / 1024 / 1024).toFixed(2)}MB)`);
      return scenario;
      
    } catch (error) {
      console.error(`❌ Failed to load scenario ${scenarioId}:`, error);
      throw error;
    }
  }

  /**
   * Load scenario from source (mock implementation)
   */
  async loadScenarioFromSource(scenarioId, character) {
    // This would typically load from files or API
    // For now, return a mock scenario structure
    return {
      id: scenarioId,
      character: character,
      type: this.getScenarioType(scenarioId),
      evidence: this.generateMockEvidence(scenarioId),
      assets: this.generateMockAssets(scenarioId),
      animations: this.generateMockAnimations(scenarioId),
      audio: this.generateMockAudio(scenarioId),
      loadedAt: Date.now()
    };
  }

  /**
   * Unload scenario and free memory
   */
  unloadScenario(scenarioId) {
    try {
      // Remove from active scenarios
      this.cache.activeScenarios.delete(scenarioId);
      
      // Get scenario for cleanup
      const scenario = this.cache.scenarios.get(scenarioId);
      if (scenario) {
        // Clean up resources
        this.cleanupScenarioResources(scenario);
        
        // Track deallocation
        const size = this.estimateScenarioSize(scenario);
        this.trackDeallocation(scenarioId, size);
        
        // Remove from cache
        this.lruCache.remove(scenarioId);
        
        console.log(`🗑️ Unloaded scenario: ${scenarioId}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to unload scenario ${scenarioId}:`, error);
    }
  }

  /**
   * Preload scenarios for better performance
   */
  async preloadScenarios(scenarioIds, character) {
    if (!this.config.preloadEnabled) return;
    
    const preloadPromises = scenarioIds.slice(0, this.config.maxPreloadScenarios)
      .map(async (scenarioId) => {
        try {
          if (!this.cache.scenarios.has(scenarioId)) {
            await this.loadScenario(scenarioId, character, 'low');
          }
        } catch (error) {
          console.warn(`⚠️ Failed to preload scenario ${scenarioId}:`, error);
        }
      });
    
    await Promise.all(preloadPromises);
    console.log(`📦 Preloaded ${preloadPromises.length} scenarios`);
  }

  /**
   * Schedule preloading of related scenarios
   */
  schedulePreloading(currentScenarioId, character) {
    const relatedScenarios = this.getRelatedScenarios(currentScenarioId, character);
    
    // Add to preload queue
    relatedScenarios.forEach(scenarioId => {
      if (!this.cache.preloadQueue.includes(scenarioId)) {
        this.cache.preloadQueue.push(scenarioId);
      }
    });
    
    // Process queue asynchronously
    setTimeout(() => {
      this.processPreloadQueue(character);
    }, 100);
  }

  /**
   * Process preload queue
   */
  async processPreloadQueue(character) {
    while (this.cache.preloadQueue.length > 0 && 
           this.cache.scenarios.size < this.config.maxPreloadScenarios) {
      const scenarioId = this.cache.preloadQueue.shift();
      
      try {
        if (!this.cache.scenarios.has(scenarioId)) {
          await this.loadScenario(scenarioId, character, 'low');
        }
      } catch (error) {
        console.warn(`⚠️ Failed to preload queued scenario ${scenarioId}:`, error);
      }
    }
  }

  /**
   * Check if we have available memory for a scenario
   */
  hasAvailableMemory(scenarioId) {
    const estimatedSize = this.estimateScenarioSizeById(scenarioId);
    const availableMemory = this.getAvailableMemory();
    
    return availableMemory >= estimatedSize;
  }

  /**
   * Free memory for a scenario
   */
  async freeMemoryForScenario(scenarioId) {
    const requiredMemory = this.estimateScenarioSizeById(scenarioId);
    let freedMemory = 0;
    
    // First, try cleaning up inactive scenarios
    const inactiveScenarios = this.getInactiveScenarios();
    for (const inactiveId of inactiveScenarios) {
      if (freedMemory >= requiredMemory) break;
      
      const scenario = this.cache.scenarios.get(inactiveId);
      if (scenario) {
        const size = this.estimateScenarioSize(scenario);
        this.unloadScenario(inactiveId);
        freedMemory += size;
      }
    }
    
    // If still not enough, remove oldest cached scenarios
    while (freedMemory < requiredMemory && this.lruCache.order.length > 0) {
      const oldestId = this.lruCache.order[0];
      const scenario = this.cache.scenarios.get(oldestId);
      if (scenario) {
        const size = this.estimateScenarioSize(scenario);
        this.unloadScenario(oldestId);
        freedMemory += size;
      } else {
        break;
      }
    }
    
    console.log(`🧹 Freed ${(freedMemory / 1024 / 1024).toFixed(2)}MB for scenario: ${scenarioId}`);
  }

  /**
   * Perform automatic cleanup
   */
  performAutomaticCleanup() {
    const now = Date.now();
    
    // Clean up expired cache entries
    const expiredScenarios = [];
    this.cache.lastAccessed.forEach((lastAccessed, scenarioId) => {
      if (now - lastAccessed > this.config.cacheTimeout && 
          !this.cache.activeScenarios.has(scenarioId)) {
        expiredScenarios.push(scenarioId);
      }
    });
    
    expiredScenarios.forEach(scenarioId => {
      this.unloadScenario(scenarioId);
    });
    
    if (expiredScenarios.length > 0) {
      console.log(`🧹 Cleaned up ${expiredScenarios.length} expired scenarios`);
    }
    
    // Aggressive cleanup if memory usage is high
    if (this.config.aggressiveCleanup || this.isMemoryUsageHigh()) {
      this.performAggressiveCleanup();
    }
  }

  /**
   * Perform aggressive cleanup
   */
  performAggressiveCleanup() {
    console.log('🚨 Performing aggressive memory cleanup...');
    
    // Remove all inactive scenarios
    const inactiveScenarios = this.getInactiveScenarios();
    inactiveScenarios.forEach(scenarioId => {
      this.unloadScenario(scenarioId);
    });
    
    // Clear preload queue
    this.cache.preloadQueue = [];
    
    // Force garbage collection if available
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }
    
    console.log('✅ Aggressive cleanup completed');
  }

  /**
   * Get inactive scenarios
   */
  getInactiveScenarios() {
    const inactive = [];
    const now = Date.now();
    
    this.cache.scenarios.forEach((scenario, scenarioId) => {
      if (!this.cache.activeScenarios.has(scenarioId)) {
        const lastAccessed = this.cache.lastAccessed.get(scenarioId) || 0;
        if (now - lastAccessed > this.config.cacheTimeout / 2) {
          inactive.push(scenarioId);
        }
      }
    });
    
    return inactive;
  }

  /**
   * Check if memory usage is high
   */
  isMemoryUsageHigh() {
    const currentUsage = this.getCurrentMemoryUsage();
    const availableMemory = this.getAvailableMemory();
    const totalMemory = currentUsage + availableMemory;
    
    return (currentUsage / totalMemory) > this.config.memoryThreshold;
  }

  /**
   * Get current memory usage
   */
  getCurrentMemoryUsage() {
    return this.cache.currentCacheSize;
  }

  /**
   * Get available memory (estimated)
   */
  getAvailableMemory() {
    // Use Performance API if available
    if ('memory' in performance) {
      const memory = performance.memory;
      return memory.totalJSHeapSize - memory.usedJSHeapSize;
    }
    
    // Fallback estimation
    return Math.max(0, this.cache.maxCacheSize - this.cache.currentCacheSize);
  }

  /**
   * Estimate scenario size
   */
  estimateScenarioSize(scenario) {
    let size = 1024; // Base size
    
    if (scenario.evidence) size += scenario.evidence.length * 512 * 1024; // 512KB per evidence
    if (scenario.assets) size += scenario.assets.length * 2 * 1024 * 1024; // 2MB per asset
    if (scenario.animations) size += scenario.animations.length * 1.5 * 1024 * 1024; // 1.5MB per animation
    if (scenario.audio) size += scenario.audio.length * 1 * 1024 * 1024; // 1MB per audio
    
    return size;
  }

  /**
   * Estimate scenario size by ID
   */
  estimateScenarioSizeById(scenarioId) {
    // Basic estimation based on scenario type
    const type = this.getScenarioType(scenarioId);
    
    const baseSizes = {
      investigation: 5 * 1024 * 1024,  // 5MB
      realtime: 3 * 1024 * 1024,      // 3MB
      puzzle: 4 * 1024 * 1024,        // 4MB
      action: 6 * 1024 * 1024         // 6MB
    };
    
    return baseSizes[type] || 3 * 1024 * 1024; // Default 3MB
  }

  /**
   * Get scenario type from ID
   */
  getScenarioType(scenarioId) {
    if (scenarioId.includes('investigation')) return 'investigation';
    if (scenarioId.includes('realtime')) return 'realtime';
    if (scenarioId.includes('puzzle')) return 'puzzle';
    if (scenarioId.includes('action')) return 'action';
    return 'general';
  }

  /**
   * Get related scenarios for preloading
   */
  getRelatedScenarios(scenarioId, character) {
    // This would typically be based on story progression logic
    // For now, return mock related scenarios
    const baseId = scenarioId.replace(/\d+$/, '');
    const currentNumber = parseInt(scenarioId.match(/\d+$/)?.[0] || '1');
    
    return [
      `${baseId}${currentNumber + 1}`,
      `${baseId}${currentNumber + 2}`,
      `${character}_${this.getScenarioType(scenarioId)}_${currentNumber + 1}`
    ].filter(id => id !== scenarioId);
  }

  /**
   * Track memory allocation
   */
  trackAllocation(scenarioId, size) {
    this.memoryTracking.allocations.set(scenarioId, {
      size: size,
      timestamp: Date.now()
    });
    
    this.memoryTracking.totalAllocated += size;
    this.memoryTracking.peakUsage = Math.max(this.memoryTracking.peakUsage, 
                                           this.getCurrentMemoryUsage());
  }

  /**
   * Track memory deallocation
   */
  trackDeallocation(scenarioId, size) {
    this.memoryTracking.deallocations.set(scenarioId, {
      size: size,
      timestamp: Date.now()
    });
    
    this.memoryTracking.totalAllocated -= size;
    this.memoryTracking.allocations.delete(scenarioId);
  }

  /**
   * Perform memory leak analysis
   */
  performLeakAnalysis() {
    console.log('🔍 Performing memory leak analysis...');
    
    const suspiciousAllocations = [];
    const now = Date.now();
    
    this.memoryTracking.allocations.forEach((allocation, scenarioId) => {
      const age = now - allocation.timestamp;
      if (age > 5 * 60 * 1000) { // Older than 5 minutes
        suspiciousAllocations.push({
          scenarioId,
          size: allocation.size,
          age: age
        });
      }
    });
    
    if (suspiciousAllocations.length > 0) {
      console.warn('🚨 Suspicious allocations found:', suspiciousAllocations);
      
      // Force cleanup of suspicious allocations
      suspiciousAllocations.forEach(({ scenarioId }) => {
        if (!this.cache.activeScenarios.has(scenarioId)) {
          this.unloadScenario(scenarioId);
        }
      });
    }
  }

  /**
   * Clean up scenario resources
   */
  cleanupScenarioResources(scenario) {
    // Clean up any WebGL resources, audio contexts, etc.
    if (scenario.assets) {
      scenario.assets.forEach(asset => {
        if (asset.dispose) asset.dispose();
      });
    }
    
    if (scenario.animations) {
      scenario.animations.forEach(animation => {
        if (animation.dispose) animation.dispose();
      });
    }
    
    if (scenario.audio) {
      scenario.audio.forEach(audio => {
        if (audio.pause) audio.pause();
        if (audio.src) audio.src = '';
      });
    }
  }

  /**
   * Generate mock evidence (for testing)
   */
  generateMockEvidence(scenarioId) {
    const count = Math.floor(Math.random() * 5) + 1;
    return Array.from({ length: count }, (_, i) => ({
      id: `${scenarioId}_evidence_${i}`,
      type: 'digital_communication',
      size: Math.floor(Math.random() * 512 * 1024) // Up to 512KB
    }));
  }

  /**
   * Generate mock assets (for testing)
   */
  generateMockAssets(scenarioId) {
    const count = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: count }, (_, i) => ({
      id: `${scenarioId}_asset_${i}`,
      type: '3d_model',
      size: Math.floor(Math.random() * 2 * 1024 * 1024) // Up to 2MB
    }));
  }

  /**
   * Generate mock animations (for testing)
   */
  generateMockAnimations(scenarioId) {
    const count = Math.floor(Math.random() * 2) + 1;
    return Array.from({ length: count }, (_, i) => ({
      id: `${scenarioId}_animation_${i}`,
      type: 'character_animation',
      size: Math.floor(Math.random() * 1.5 * 1024 * 1024) // Up to 1.5MB
    }));
  }

  /**
   * Generate mock audio (for testing)
   */
  generateMockAudio(scenarioId) {
    const count = Math.floor(Math.random() * 2);
    return Array.from({ length: count }, (_, i) => ({
      id: `${scenarioId}_audio_${i}`,
      type: 'sound_effect',
      size: Math.floor(Math.random() * 1 * 1024 * 1024) // Up to 1MB
    }));
  }

  /**
   * Get memory statistics
   */
  getMemoryStats() {
    return {
      cache: {
        size: this.cache.currentCacheSize,
        maxSize: this.cache.maxCacheSize,
        utilization: (this.cache.currentCacheSize / this.cache.maxCacheSize) * 100,
        scenarios: this.cache.scenarios.size,
        activeScenarios: this.cache.activeScenarios.size
      },
      tracking: {
        totalAllocated: this.memoryTracking.totalAllocated,
        peakUsage: this.memoryTracking.peakUsage,
        activeAllocations: this.memoryTracking.allocations.size
      },
      system: {
        available: this.getAvailableMemory(),
        usage: this.getCurrentMemoryUsage(),
        threshold: this.config.memoryThreshold
      }
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
    console.log('⚙️ Memory manager configuration updated:', newConfig);
  }

  /**
   * Clean up memory manager
   */
  cleanup() {
    // Unload all scenarios
    const allScenarios = Array.from(this.cache.scenarios.keys());
    allScenarios.forEach(scenarioId => {
      this.unloadScenario(scenarioId);
    });
    
    // Clear all caches
    this.cache.scenarios.clear();
    this.cache.activeScenarios.clear();
    this.cache.lastAccessed.clear();
    this.cache.preloadQueue = [];
    
    // Clear memory tracking
    this.memoryTracking.allocations.clear();
    this.memoryTracking.deallocations.clear();
    
    console.log('🧹 Scenario memory manager cleaned up');
  }
}

// Export for use in other modules
window.ScenarioMemoryManager = ScenarioMemoryManager;