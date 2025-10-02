/**
 * Three.js Scene Manager for 3D Immersive Chatbot
 * Manages 3D rendering infrastructure and WebGL detection
 */

class ThreeSceneManager {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.isWebGLSupported = false;
    this.isInitialized = false;
    this.animationId = null;
    
    // Check WebGL support on initialization
    this.checkWebGLSupport();
  }

  /**
   * Check if WebGL is supported by the browser
   * Implements fallback mechanisms for unsupported devices
   */
  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      this.isWebGLSupported = !!gl;
      
      if (!this.isWebGLSupported) {
        console.warn('⚠️ WebGL not supported. 3D features will be disabled.');
        this.showWebGLFallback();
        return false;
      }
      
      console.log('✅ WebGL support detected');
      return true;
    } catch (error) {
      console.error('❌ WebGL detection failed:', error);
      this.isWebGLSupported = false;
      this.showWebGLFallback();
      return false;
    }
  }

  /**
   * Show fallback message for devices without WebGL support
   */
  showWebGLFallback() {
    // Create a subtle notification that 3D features are unavailable
    const fallbackNotice = document.createElement('div');
    fallbackNotice.id = 'webgl-fallback-notice';
    fallbackNotice.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(255, 165, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 9999;
      display: none;
    `;
    fallbackNotice.textContent = '3D features unavailable on this device';
    document.body.appendChild(fallbackNotice);
  }

  /**
   * Initialize the Three.js scene that overlays the chroma bot interface
   */
  initialize() {
    if (!this.isWebGLSupported) {
      console.log('🚫 Skipping 3D initialization - WebGL not supported');
      return false;
    }

    if (this.isInitialized) {
      console.log('⚠️ 3D Scene already initialized');
      return true;
    }

    try {
      // Create 3D canvas that overlays existing interface
      this.createOverlayCanvas();
      
      // Initialize Three.js components
      this.initializeScene();
      this.initializeCamera();
      this.initializeRenderer();
      
      // Set up resize handling
      this.setupResizeHandler();
      
      this.isInitialized = true;
      console.log('✅ Three.js scene manager initialized successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize 3D scene:', error);
      this.cleanup();
      return false;
    }
  }

  /**
   * Create canvas element that overlays the existing chroma bot interface
   */
  createOverlayCanvas() {
    // Create canvas for 3D rendering
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'three-overlay-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1500;
      display: none;
    `;
    
    // Insert canvas before existing UI elements but after background
    document.body.appendChild(this.canvas);
    console.log('✅ 3D overlay canvas created');
  }

  /**
   * Initialize Three.js scene
   */
  initializeScene() {
    this.scene = new THREE.Scene();
    
    // Set up basic lighting for character rendering
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    console.log('✅ Three.js scene initialized');
  }

  /**
   * Initialize camera with appropriate settings for character viewing
   */
  initializeCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    
    // Position camera for optimal character viewing
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
    
    console.log('✅ Three.js camera initialized');
  }

  /**
   * Initialize WebGL renderer with optimization settings
   */
  initializeRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // Enable transparency for overlay
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    console.log('✅ Three.js renderer initialized');
  }

  /**
   * Set up window resize handling
   */
  setupResizeHandler() {
    window.addEventListener('resize', () => {
      if (!this.camera || !this.renderer) return;
      
      // Update camera aspect ratio
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      
      // Update renderer size
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      
      console.log('🔄 3D scene resized');
    });
  }

  /**
   * Show the 3D overlay canvas
   */
  show() {
    if (!this.isInitialized || !this.canvas) {
      console.warn('⚠️ Cannot show 3D overlay - not initialized');
      return false;
    }
    
    this.canvas.style.display = 'block';
    this.canvas.style.pointerEvents = 'auto';
    
    // Start render loop
    this.startRenderLoop();
    
    console.log('✅ 3D overlay shown');
    return true;
  }

  /**
   * Hide the 3D overlay canvas
   */
  hide() {
    if (!this.canvas) return;
    
    this.canvas.style.display = 'none';
    this.canvas.style.pointerEvents = 'none';
    
    // Stop render loop
    this.stopRenderLoop();
    
    console.log('✅ 3D overlay hidden');
  }

  /**
   * Start the render loop
   */
  startRenderLoop() {
    if (!this.renderer || !this.scene || !this.camera) return;
    
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    };
    
    animate();
    console.log('🎬 3D render loop started');
  }

  /**
   * Stop the render loop
   */
  stopRenderLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      console.log('⏹️ 3D render loop stopped');
    }
  }

  /**
   * Get the current scene for adding 3D objects
   */
  getScene() {
    return this.scene;
  }

  /**
   * Get the current camera for positioning
   */
  getCamera() {
    return this.camera;
  }

  /**
   * Get the renderer for custom rendering operations
   */
  getRenderer() {
    return this.renderer;
  }

  /**
   * Check if 3D features are available
   */
  isAvailable() {
    return this.isWebGLSupported && this.isInitialized;
  }

  /**
   * Clean up Three.js resources
   */
  cleanup() {
    // Stop render loop
    this.stopRenderLoop();
    
    // Dispose of Three.js objects
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    
    if (this.scene) {
      // Dispose of scene objects
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      this.scene = null;
    }
    
    // Remove canvas
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
    }
    
    this.camera = null;
    this.isInitialized = false;
    
    console.log('🧹 3D scene manager cleaned up');
  }

  /**
   * Get performance information for monitoring
   */
  getPerformanceInfo() {
    if (!this.renderer) return null;
    
    return {
      drawCalls: this.renderer.info.render.calls,
      triangles: this.renderer.info.render.triangles,
      points: this.renderer.info.render.points,
      lines: this.renderer.info.render.lines,
      frame: this.renderer.info.render.frame,
      geometries: this.renderer.info.memory.geometries,
      textures: this.renderer.info.memory.textures
    };
  }
}

// Export for use in other modules
window.ThreeSceneManager = ThreeSceneManager;