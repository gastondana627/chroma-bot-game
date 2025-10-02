/**
 * WebGL Fallback System
 * Provides graceful degradation for devices without WebGL support
 */

class WebGLFallback {
  constructor() {
    this.isWebGLSupported = false;
    this.fallbackActive = false;
    this.checkSupport();
  }

  /**
   * Check WebGL support and initialize fallback if needed
   */
  checkSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl) {
        // Additional checks for WebGL capabilities
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        
        // Minimum requirements for 3D chatbot
        if (maxTextureSize >= 1024 && maxVertexAttribs >= 8) {
          this.isWebGLSupported = true;
          console.log('✅ WebGL support confirmed with adequate capabilities');
        } else {
          console.warn('⚠️ WebGL supported but with limited capabilities');
          this.initializeFallback();
        }
      } else {
        console.warn('⚠️ WebGL not supported');
        this.initializeFallback();
      }
    } catch (error) {
      console.error('❌ WebGL detection failed:', error);
      this.initializeFallback();
    }
  }

  /**
   * Initialize fallback mechanisms for unsupported devices
   */
  initializeFallback() {
    this.fallbackActive = true;
    
    // Create fallback notification
    this.createFallbackNotification();
    
    // Override 3D methods to prevent errors
    this.overrideThreeDMethods();
    
    console.log('🔄 WebGL fallback system activated');
  }

  /**
   * Create a subtle notification about 3D limitations
   */
  createFallbackNotification() {
    const notification = document.createElement('div');
    notification.id = 'webgl-fallback-notification';
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 165, 0, 0.9);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      z-index: 10000;
      display: none;
      animation: slideDown 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <span>ℹ️ Enhanced 3D features unavailable on this device</span>
      <button onclick="this.parentElement.style.display='none'" 
              style="background: none; border: none; color: white; margin-left: 10px; cursor: pointer;">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification briefly when 3D features are attempted
    this.showNotificationOnAttempt();
  }

  /**
   * Show notification when 3D features are attempted
   */
  showNotificationOnAttempt() {
    let notificationShown = false;
    
    // Monitor for 3D feature attempts
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      if (!notificationShown && args.some(arg => 
        typeof arg === 'string' && arg.includes('3D'))) {
        this.showNotification();
        notificationShown = true;
      }
      originalConsoleWarn.apply(console, args);
    };
  }

  /**
   * Show the fallback notification
   */
  showNotification() {
    const notification = document.getElementById('webgl-fallback-notification');
    if (notification) {
      notification.style.display = 'block';
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        notification.style.display = 'none';
      }, 5000);
    }
  }

  /**
   * Override 3D methods to prevent errors on unsupported devices
   */
  overrideThreeDMethods() {
    // Override ThreeSceneManager if it exists
    if (typeof window.ThreeSceneManager !== 'undefined') {
      const originalInitialize = window.ThreeSceneManager.prototype.initialize;
      window.ThreeSceneManager.prototype.initialize = function() {
        console.log('🚫 3D initialization blocked - WebGL not supported');
        return false;
      };
    }

    // Override 3D integration methods
    if (typeof window.ThreeDIntegration !== 'undefined') {
      const originalPrepare3D = window.ThreeDIntegration.prototype.prepare3DTransition;
      window.ThreeDIntegration.prototype.prepare3DTransition = function() {
        console.log('🚫 3D transition blocked - WebGL not supported');
        this.showNotification();
      };
    }
  }

  /**
   * Check if WebGL is supported
   */
  isSupported() {
    return this.isWebGLSupported;
  }

  /**
   * Check if fallback is active
   */
  isFallbackActive() {
    return this.fallbackActive;
  }

  /**
   * Get device capabilities information
   */
  getDeviceInfo() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return {
        webglSupported: false,
        vendor: 'Unknown',
        renderer: 'Unknown',
        maxTextureSize: 0,
        maxVertexAttribs: 0
      };
    }

    return {
      webglSupported: true,
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
      extensions: gl.getSupportedExtensions()
    };
  }
}

// Initialize fallback system
window.webGLFallback = new WebGLFallback();

// Export for module use
window.WebGLFallback = WebGLFallback;