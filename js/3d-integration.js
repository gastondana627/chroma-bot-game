/**
 * 3D Integration Module
 * Connects Three.js scene manager with existing chroma bot interface
 */

class ThreeDIntegration {
  constructor() {
    this.sceneManager = null;
    this.character3DSystem = null;
    this.performanceMonitor = null;
    this.mobile3DSupport = null;
    this.isEnabled = false;
    this.currentCharacter = null;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  }

  /**
   * Initialize 3D integration with existing chroma bot system
   */
  initialize() {
    console.log('🎯 Initializing 3D integration...');
    
    try {
      // Create scene manager instance
      this.sceneManager = new ThreeSceneManager();
      
      // Initialize the 3D scene
      const initialized = this.sceneManager.initialize();
      
      if (initialized) {
        // Initialize mobile 3D support
        this.mobile3DSupport = new Mobile3DSupport(this.sceneManager, null);
        
        // Initialize character 3D system
        this.character3DSystem = new Character3DSystem(this.sceneManager);
        
        // Update mobile 3D support with character system reference
        this.mobile3DSupport.character3DSystem = this.character3DSystem;
        
        // Initialize performance monitoring (if available)
        if (typeof PerformanceMonitor !== 'undefined') {
          this.performanceMonitor = new PerformanceMonitor(this.sceneManager, this.mobile3DSupport);
        } else {
          console.warn('⚠️ PerformanceMonitor not available, skipping performance tracking');
          this.performanceMonitor = null;
        }
        
        this.isEnabled = true;
        this.setupChromaBotIntegration();
        console.log('✅ 3D integration initialized successfully');
      } else {
        console.log('⚠️ 3D integration disabled - WebGL not available');
        this.isEnabled = false;
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize 3D integration:', error);
      this.isEnabled = false;
    }
  }

  /**
   * Set up integration with existing chroma bot system
   */
  setupChromaBotIntegration() {
    // Monitor for character changes in session storage
    this.monitorCharacterChanges();
    
    // Extend existing video container click handler for 3D support
    this.enhanceChromaBotInteraction();
    
    // Set up performance monitoring
    this.setupPerformanceMonitoring();
    
    console.log('🔗 Chroma bot integration established');
  }

  /**
   * Monitor session storage for character changes
   */
  monitorCharacterChanges() {
    // Check for character changes periodically
    setInterval(() => {
      const sessionCharacter = sessionStorage.getItem('character');
      if (sessionCharacter && sessionCharacter !== this.currentCharacter) {
        this.currentCharacter = sessionCharacter;
        console.log(`🎭 Character changed to: ${this.currentCharacter}`);
        
        // Initialize 3D character system for new character
        if (this.character3DSystem && ['eli', 'maya', 'stanley'].includes(sessionCharacter)) {
          this.character3DSystem.initializeCharacter(sessionCharacter);
        }
      }
    }, 1000);
  }

  /**
   * Enhance existing chroma bot interaction with 3D capabilities
   */
  enhanceChromaBotInteraction() {
    const videoContainer = document.getElementById('video-container');
    if (!videoContainer) {
      console.warn('⚠️ Video container not found for 3D integration');
      return;
    }

    // Store original click handler
    const originalClickHandler = videoContainer.onclick;
    
    // Add 3D-aware click handler
    videoContainer.addEventListener('click', (event) => {
      // Check if 3D mode should be triggered
      if (this.should3DModeActivate()) {
        console.log('🎬 3D mode activation detected');
        this.prepare3DTransition(event);
      }
      
      // Call original handler if it exists
      if (originalClickHandler) {
        originalClickHandler.call(videoContainer, event);
      }
    });

    console.log('🎮 Chroma bot interaction enhanced with 3D support');
  }

  /**
   * Check if 3D mode should activate based on story triggers
   * This is a placeholder for the story trigger system to be implemented later
   */
  should3DModeActivate() {
    // For now, return false as story trigger system is not yet implemented
    // This will be enhanced in later tasks
    return false;
  }

  /**
   * Prepare for 3D transition from chroma orb
   */
  async prepare3DTransition(clickEvent) {
    if (!this.isEnabled || !this.sceneManager || !this.character3DSystem) {
      console.log('⚠️ 3D transition skipped - 3D not available');
      return;
    }

    // Get chroma orb position for emergence animation
    const videoContainer = document.getElementById('video-container');
    const rect = videoContainer.getBoundingClientRect();
    const orbPosition = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    console.log('🎯 3D transition prepared from orb position:', orbPosition);
    
    // Start performance monitoring for 3D session
    if (this.performanceMonitor && !this.performanceMonitor.isMonitoring) {
      this.performanceMonitor.startMonitoring();
    }
    
    // Check if character is already active
    if (this.character3DSystem.isCharacterActive()) {
      // Return character to orb
      await this.character3DSystem.returnCharacter(orbPosition);
      
      // Stop performance monitoring when returning to 2D
      if (this.performanceMonitor) {
        this.performanceMonitor.stopMonitoring();
      }
    } else if (this.currentCharacter) {
      // Emerge character from orb
      await this.character3DSystem.emergeCharacter(orbPosition);
    }
  }

  /**
   * Set up performance monitoring for 3D features
   */
  setupPerformanceMonitoring() {
    if (!this.performanceMonitor) return;

    // Start performance monitoring when 3D is active
    this.performanceMonitor.startMonitoring();
    
    console.log('📊 Performance monitoring activated');
  }

  /**
   * Check if 3D features are available
   */
  isAvailable() {
    return this.isEnabled && this.sceneManager && this.sceneManager.isAvailable();
  }

  /**
   * Get the scene manager instance
   */
  getSceneManager() {
    return this.sceneManager;
  }

  /**
   * Get the character 3D system instance
   */
  getCharacter3DSystem() {
    return this.character3DSystem;
  }

  /**
   * Get the performance monitor instance
   */
  getPerformanceMonitor() {
    return this.performanceMonitor;
  }

  /**
   * Get the mobile 3D support instance
   */
  getMobile3DSupport() {
    return this.mobile3DSupport;
  }

  /**
   * Get current performance status
   */
  getPerformanceStatus() {
    return this.performanceMonitor ? this.performanceMonitor.getPerformanceStatus() : null;
  }

  /**
   * Get system status for debugging
   */
  getSystemStatus() {
    return {
      isEnabled: this.isEnabled,
      currentCharacter: this.currentCharacter,
      sceneManager: this.sceneManager ? this.sceneManager.isAvailable() : false,
      performanceMonitor: this.performanceMonitor ? this.performanceMonitor.getSystemStatus() : null,
      mobile3DSupport: this.mobile3DSupport ? this.mobile3DSupport.getSystemStatus() : null
    };
  }

  /**
   * Clean up 3D integration
   */
  async cleanup() {
    if (this.performanceMonitor) {
      this.performanceMonitor.cleanup();
      this.performanceMonitor = null;
    }
    
    if (this.character3DSystem) {
      await this.character3DSystem.cleanup();
      this.character3DSystem = null;
    }
    
    if (this.sceneManager) {
      this.sceneManager.cleanup();
      this.sceneManager = null;
    }
    
    this.mobile3DSupport = null;
    this.isEnabled = false;
    this.currentCharacter = null;
    
    console.log('🧹 3D integration cleaned up');
  }
}

// Create global instance for use throughout the application
window.threeDIntegration = new ThreeDIntegration();

// Export for module use
window.ThreeDIntegration = ThreeDIntegration;