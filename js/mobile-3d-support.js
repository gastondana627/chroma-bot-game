/**
 * Mobile 3D Support System
 * Implements touch gesture support for 3D character interaction on mobile devices
 * Creates adaptive rendering quality based on device capabilities
 */

class Mobile3DSupport {
  constructor(sceneManager, character3DSystem) {
    this.sceneManager = sceneManager;
    this.character3DSystem = character3DSystem;
    this.isMobile = false;
    this.isTablet = false;
    this.deviceCapabilities = {};
    this.touchGestures = {};
    this.renderingQuality = 'auto';
    this.adaptiveSettings = {};
    
    this.initialize();
  }

  /**
   * Initialize mobile 3D support system
   */
  initialize() {
    try {
      // Detect device type and capabilities
      this.detectDevice();
      
      // Analyze device performance capabilities
      this.analyzeDeviceCapabilities();
      
      // Set up touch gesture handlers (only if scene manager exists)
      if (this.sceneManager) {
        this.setupTouchGestures();
      } else {
        console.log('⚠️ Scene manager not available, skipping touch gestures');
      }
      
      // Configure adaptive rendering
      this.configureAdaptiveRendering();
      
      // Set up responsive viewport handling
      this.setupResponsiveViewport();
      
      console.log('✅ Mobile 3D support initialized', {
        isMobile: this.isMobile,
        isTablet: this.isTablet,
        quality: this.renderingQuality
      });
      
      return true;
      
    } catch (error) {
      console.warn('⚠️ Mobile 3D support initialization had issues:', error);
      // Don't fail completely - allow page to load
      return false;
    }
  }

  /**
   * Detect device type (mobile, tablet, desktop)
   */
  detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const maxDimension = Math.max(screenWidth, screenHeight);
    const minDimension = Math.min(screenWidth, screenHeight);
    
    // Check for mobile indicators
    this.isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
                   (maxDimension <= 768 && 'ontouchstart' in window);
    
    // Check for tablet indicators
    this.isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) ||
                   (maxDimension > 768 && maxDimension <= 1024 && 'ontouchstart' in window);
    
    // Additional mobile detection
    if (!this.isMobile && !this.isTablet && 'ontouchstart' in window) {
      if (minDimension <= 480) {
        this.isMobile = true;
      } else if (minDimension <= 768) {
        this.isTablet = true;
      }
    }
    
    console.log(`📱 Device detected: ${this.isMobile ? 'Mobile' : this.isTablet ? 'Tablet' : 'Desktop'}`);
  }

  /**
   * Analyze device performance capabilities
   */
  analyzeDeviceCapabilities() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      this.deviceCapabilities = {
        webgl: false,
        maxTextureSize: 0,
        maxRenderbufferSize: 0,
        performance: 'low'
      };
      return;
    }
    
    // Get WebGL capabilities
    this.deviceCapabilities = {
      webgl: true,
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
      maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
      maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
      maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
      renderer: gl.getParameter(gl.RENDERER),
      vendor: gl.getParameter(gl.VENDOR)
    };
    
    // Estimate performance level
    this.deviceCapabilities.performance = this.estimatePerformance();
    
    console.log('🔍 Device capabilities analyzed:', this.deviceCapabilities);
  }

  /**
   * Estimate device performance level
   */
  estimatePerformance() {
    const { maxTextureSize, renderer } = this.deviceCapabilities;
    const memoryInfo = navigator.deviceMemory || 4; // Default to 4GB if not available
    
    // Performance indicators
    let score = 0;
    
    // Texture size scoring
    if (maxTextureSize >= 4096) score += 3;
    else if (maxTextureSize >= 2048) score += 2;
    else score += 1;
    
    // Memory scoring
    if (memoryInfo >= 8) score += 3;
    else if (memoryInfo >= 4) score += 2;
    else score += 1;
    
    // Device type penalty
    if (this.isMobile) score -= 1;
    
    // GPU hints from renderer string
    const rendererLower = (renderer || '').toLowerCase();
    if (rendererLower.includes('adreno') && rendererLower.includes('6')) score += 1;
    if (rendererLower.includes('mali') && rendererLower.includes('g7')) score += 1;
    if (rendererLower.includes('apple') && rendererLower.includes('gpu')) score += 2;
    
    // Determine performance level
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  /**
   * Set up touch gesture handlers for 3D character interaction
   */
  setupTouchGestures() {
    if (!('ontouchstart' in window)) {
      console.log('👆 Touch not supported, skipping gesture setup');
      return;
    }
    
    this.touchGestures = {
      isActive: false,
      startTouch: null,
      currentTouch: null,
      lastTouch: null,
      gestureType: null, // 'rotate', 'zoom', 'pan'
      sensitivity: this.isMobile ? 0.8 : 1.0
    };
    
    // Get the Three.js canvas for touch events
    const canvas = document.getElementById('three-overlay-canvas');
    if (!canvas) {
      console.warn('⚠️ Three.js canvas not found for touch gestures');
      return;
    }
    
    // Touch start
    canvas.addEventListener('touchstart', (event) => {
      this.handleTouchStart(event);
    }, { passive: false });
    
    // Touch move
    canvas.addEventListener('touchmove', (event) => {
      this.handleTouchMove(event);
    }, { passive: false });
    
    // Touch end
    canvas.addEventListener('touchend', (event) => {
      this.handleTouchEnd(event);
    }, { passive: false });
    
    // Prevent default touch behaviors that might interfere
    canvas.addEventListener('touchcancel', (event) => {
      this.handleTouchEnd(event);
    }, { passive: false });
    
    console.log('👆 Touch gesture handlers configured');
  }

  /**
   * Handle touch start events
   */
  handleTouchStart(event) {
    event.preventDefault();
    
    const touches = event.touches;
    if (touches.length === 0) return;
    
    this.touchGestures.isActive = true;
    this.touchGestures.startTouch = {
      x: touches[0].clientX,
      y: touches[0].clientY,
      timestamp: Date.now()
    };
    this.touchGestures.currentTouch = { ...this.touchGestures.startTouch };
    
    // Determine gesture type based on number of touches
    if (touches.length === 1) {
      this.touchGestures.gestureType = 'rotate';
    } else if (touches.length === 2) {
      this.touchGestures.gestureType = 'zoom';
      // Store second touch for pinch gestures
      this.touchGestures.secondTouch = {
        x: touches[1].clientX,
        y: touches[1].clientY
      };
    }
    
    console.log(`👆 Touch start: ${this.touchGestures.gestureType}`);
  }

  /**
   * Handle touch move events
   */
  handleTouchMove(event) {
    event.preventDefault();
    
    if (!this.touchGestures.isActive) return;
    
    const touches = event.touches;
    if (touches.length === 0) return;
    
    this.touchGestures.lastTouch = { ...this.touchGestures.currentTouch };
    this.touchGestures.currentTouch = {
      x: touches[0].clientX,
      y: touches[0].clientY,
      timestamp: Date.now()
    };
    
    // Handle different gesture types
    switch (this.touchGestures.gestureType) {
      case 'rotate':
        this.handleRotateGesture();
        break;
      case 'zoom':
        if (touches.length >= 2) {
          this.handleZoomGesture(touches[1]);
        }
        break;
    }
  }

  /**
   * Handle touch end events
   */
  handleTouchEnd(event) {
    event.preventDefault();
    
    this.touchGestures.isActive = false;
    this.touchGestures.gestureType = null;
    this.touchGestures.startTouch = null;
    this.touchGestures.currentTouch = null;
    this.touchGestures.lastTouch = null;
    this.touchGestures.secondTouch = null;
    
    console.log('👆 Touch ended');
  }

  /**
   * Handle rotation gesture (single finger drag)
   */
  handleRotateGesture() {
    if (!this.touchGestures.lastTouch || !this.character3DSystem) return;
    
    const deltaX = this.touchGestures.currentTouch.x - this.touchGestures.lastTouch.x;
    const deltaY = this.touchGestures.currentTouch.y - this.touchGestures.lastTouch.y;
    
    // Apply sensitivity adjustment
    const adjustedDeltaX = deltaX * this.touchGestures.sensitivity * 0.01;
    const adjustedDeltaY = deltaY * this.touchGestures.sensitivity * 0.01;
    
    // Get camera and rotate around character
    const camera = this.sceneManager.getCamera();
    if (!camera) return;
    
    // Rotate camera around the character (simple orbital rotation)
    const radius = camera.position.length();
    const theta = Math.atan2(camera.position.x, camera.position.z) - adjustedDeltaX;
    const phi = Math.acos(camera.position.y / radius) + adjustedDeltaY;
    
    // Clamp phi to prevent flipping
    const clampedPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));
    
    // Update camera position
    camera.position.x = radius * Math.sin(clampedPhi) * Math.sin(theta);
    camera.position.y = radius * Math.cos(clampedPhi);
    camera.position.z = radius * Math.sin(clampedPhi) * Math.cos(theta);
    
    // Look at character center
    camera.lookAt(0, 0, 0);
  }

  /**
   * Handle zoom gesture (pinch)
   */
  handleZoomGesture(secondTouch) {
    if (!this.touchGestures.secondTouch) return;
    
    // Calculate current distance between touches
    const currentDistance = Math.sqrt(
      Math.pow(this.touchGestures.currentTouch.x - secondTouch.x, 2) +
      Math.pow(this.touchGestures.currentTouch.y - secondTouch.y, 2)
    );
    
    // Calculate initial distance
    const initialDistance = Math.sqrt(
      Math.pow(this.touchGestures.startTouch.x - this.touchGestures.secondTouch.x, 2) +
      Math.pow(this.touchGestures.startTouch.y - this.touchGestures.secondTouch.y, 2)
    );
    
    if (initialDistance === 0) return;
    
    // Calculate zoom factor
    const zoomFactor = currentDistance / initialDistance;
    const camera = this.sceneManager.getCamera();
    if (!camera) return;
    
    // Apply zoom by moving camera closer/farther
    const direction = camera.position.clone().normalize();
    const baseDistance = 5; // Base camera distance
    const newDistance = baseDistance / zoomFactor;
    
    // Clamp zoom limits
    const clampedDistance = Math.max(2, Math.min(10, newDistance));
    
    camera.position.copy(direction.multiplyScalar(clampedDistance));
    camera.lookAt(0, 0, 0);
  }

  /**
   * Configure adaptive rendering based on device capabilities
   */
  configureAdaptiveRendering() {
    const performance = this.deviceCapabilities.performance;
    
    // Define quality settings based on performance level
    const qualitySettings = {
      high: {
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        shadowMapSize: 1024,
        antialias: true,
        shadowsEnabled: true,
        maxLights: 4,
        lodDistance: 50
      },
      medium: {
        pixelRatio: Math.min(window.devicePixelRatio, 1.5),
        shadowMapSize: 512,
        antialias: true,
        shadowsEnabled: true,
        maxLights: 3,
        lodDistance: 30
      },
      low: {
        pixelRatio: 1,
        shadowMapSize: 256,
        antialias: false,
        shadowsEnabled: false,
        maxLights: 2,
        lodDistance: 20
      }
    };
    
    // Apply mobile-specific adjustments
    if (this.isMobile) {
      Object.values(qualitySettings).forEach(settings => {
        settings.pixelRatio = Math.min(settings.pixelRatio, 1.5);
        settings.shadowMapSize = Math.min(settings.shadowMapSize, 512);
        settings.maxLights = Math.min(settings.maxLights, 2);
      });
    }
    
    this.adaptiveSettings = qualitySettings[performance];
    this.renderingQuality = performance;
    
    console.log(`🎨 Adaptive rendering configured for ${performance} performance:`, this.adaptiveSettings);
  }

  /**
   * Apply adaptive settings to the renderer
   */
  applyAdaptiveSettings() {
    const renderer = this.sceneManager.getRenderer();
    if (!renderer) return;
    
    // Apply pixel ratio
    renderer.setPixelRatio(this.adaptiveSettings.pixelRatio);
    
    // Configure shadows
    renderer.shadowMap.enabled = this.adaptiveSettings.shadowsEnabled;
    if (this.adaptiveSettings.shadowsEnabled) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    console.log('🎨 Adaptive settings applied to renderer');
  }

  /**
   * Set up responsive viewport handling
   */
  setupResponsiveViewport() {
    // Handle orientation changes on mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100); // Small delay to ensure viewport has updated
    });
    
    // Handle viewport changes
    window.addEventListener('resize', () => {
      this.handleViewportChange();
    });
    
    console.log('📱 Responsive viewport handlers configured');
  }

  /**
   * Handle orientation changes
   */
  handleOrientationChange() {
    if (!this.isMobile && !this.isTablet) return;
    
    // Force viewport recalculation
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: screen.orientation ? screen.orientation.angle : window.orientation
    };
    
    // Update camera aspect ratio
    const camera = this.sceneManager.getCamera();
    if (camera) {
      camera.aspect = viewport.width / viewport.height;
      camera.updateProjectionMatrix();
    }
    
    // Update renderer size
    const renderer = this.sceneManager.getRenderer();
    if (renderer) {
      renderer.setSize(viewport.width, viewport.height);
    }
    
    console.log('📱 Orientation change handled:', viewport);
  }

  /**
   * Handle viewport changes
   */
  handleViewportChange() {
    // Re-detect device type in case of significant size changes
    const oldIsMobile = this.isMobile;
    const oldIsTablet = this.isTablet;
    
    this.detectDevice();
    
    // If device type changed, reconfigure adaptive rendering
    if (oldIsMobile !== this.isMobile || oldIsTablet !== this.isTablet) {
      this.configureAdaptiveRendering();
      this.applyAdaptiveSettings();
      console.log('📱 Device type changed, adaptive rendering reconfigured');
    }
  }

  /**
   * Get current device information
   */
  getDeviceInfo() {
    return {
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      capabilities: this.deviceCapabilities,
      renderingQuality: this.renderingQuality,
      adaptiveSettings: this.adaptiveSettings
    };
  }

  /**
   * Check if device supports 3D features
   */
  supports3D() {
    return this.deviceCapabilities.webgl && this.deviceCapabilities.performance !== 'low';
  }

  /**
   * Get recommended quality level for current device
   */
  getRecommendedQuality() {
    return this.renderingQuality;
  }

  /**
   * Force quality level (for user preferences)
   */
  setQualityLevel(level) {
    if (!['low', 'medium', 'high'].includes(level)) {
      console.error(`❌ Invalid quality level: ${level}`);
      return false;
    }
    
    this.renderingQuality = level;
    this.configureAdaptiveRendering();
    this.applyAdaptiveSettings();
    
    console.log(`🎨 Quality level set to: ${level}`);
    return true;
  }

  /**
   * Get system status for debugging
   */
  getSystemStatus() {
    return {
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      renderingQuality: this.renderingQuality,
      touchGesturesActive: this.touchGestures.isActive,
      supports3D: this.supports3D(),
      deviceCapabilities: this.deviceCapabilities
    };
  }
}

// Export for use in other modules
window.Mobile3DSupport = Mobile3DSupport;