/**
 * UI 3D Integration System
 * Preserves existing UI element positioning during 3D mode
 * Implements z-index management for 3D canvas and existing UI components
 */

class UI3DIntegration {
  constructor() {
    this.originalUIStates = new Map();
    this.is3DModeActive = false;
    this.uiElements = {};
    this.zIndexLayers = {
      background: -1,
      gameplayArea: 1000,
      threeCanvas: 1500,
      pauseButton: 1600,
      characterHUD: 1700,
      chromaOrb: 2000,
      chatBox: 2001,
      overlay: 9999
    };
    
    this.initialize();
  }

  /**
   * Initialize UI integration system
   */
  initialize() {
    try {
      // Cache references to existing UI elements
      this.cacheUIElements();
      
      // Set up initial z-index management
      this.setupZIndexManagement();
      
      // Set up responsive handlers
      this.setupResponsiveHandlers();
      
      console.log('✅ UI 3D Integration system initialized');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize UI 3D Integration:', error);
      return false;
    }
  }

  /**
   * Cache references to existing UI elements for preservation
   */
  cacheUIElements() {
    // Core gameplay UI elements
    this.uiElements = {
      // Pause functionality
      pauseButton: document.getElementById('pause-game-btn'),
      
      // Character HUDs
      mayaHUD: document.getElementById('maya-hud'),
      eliHUD: document.getElementById('eli-hud'),
      stanleyHUD: document.getElementById('stanley-hud'),
      
      // Chroma bot system
      videoContainer: document.getElementById('video-container'),
      chromaVideo: document.getElementById('chroma-video'),
      chatBox: document.getElementById('chat-box'),
      closeChat: document.getElementById('close-chat'),
      
      // Main containers
      gameplayArea: document.getElementById('gameplay-area'),
      gameView: document.getElementById('game-view'),
      dashboardView: document.getElementById('dashboard-view'),
      
      // Three.js canvas (will be created by scene manager)
      threeCanvas: null // Will be set when canvas is created
    };
    
    console.log('✅ UI elements cached for 3D integration');
  }

  /**
   * Set up z-index management for proper layering
   */
  setupZIndexManagement() {
    // Apply z-index values to ensure proper layering during 3D mode
    Object.entries(this.uiElements).forEach(([key, element]) => {
      if (!element) return;
      
      switch (key) {
        case 'pauseButton':
          this.setElementZIndex(element, this.zIndexLayers.pauseButton);
          break;
          
        case 'mayaHUD':
        case 'eliHUD':
        case 'stanleyHUD':
          this.setElementZIndex(element, this.zIndexLayers.characterHUD);
          break;
          
        case 'videoContainer':
          this.setElementZIndex(element, this.zIndexLayers.chromaOrb);
          break;
          
        case 'chatBox':
          this.setElementZIndex(element, this.zIndexLayers.chatBox);
          break;
          
        case 'gameplayArea':
          this.setElementZIndex(element, this.zIndexLayers.gameplayArea);
          break;
      }
    });
    
    console.log('✅ Z-index management configured');
  }

  /**
   * Set element z-index with proper CSS handling
   */
  setElementZIndex(element, zIndex) {
    if (!element) return;
    
    // Ensure element has position property for z-index to work
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === 'static') {
      element.style.position = 'relative';
    }
    
    element.style.zIndex = zIndex.toString();
  }

  /**
   * Enter 3D mode - preserve UI elements and adjust for 3D overlay
   */
  enter3DMode(character) {
    if (this.is3DModeActive) {
      console.warn('⚠️ 3D mode already active');
      return false;
    }

    try {
      // Store original UI states before modification
      this.storeOriginalUIStates();
      
      // Update Three.js canvas reference if it exists
      this.updateThreeCanvasReference();
      
      // Ensure UI elements remain accessible during 3D mode
      this.preserveUIAccessibility(character);
      
      // Apply 3D mode specific styling
      this.apply3DModeStyles();
      
      this.is3DModeActive = true;
      console.log(`✅ Entered 3D mode for character: ${character}`);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to enter 3D mode:', error);
      return false;
    }
  }

  /**
   * Exit 3D mode - restore original UI states
   */
  exit3DMode() {
    if (!this.is3DModeActive) {
      console.warn('⚠️ 3D mode not active');
      return false;
    }

    try {
      // Restore original UI states
      this.restoreOriginalUIStates();
      
      // Remove 3D mode specific styles
      this.remove3DModeStyles();
      
      this.is3DModeActive = false;
      console.log('✅ Exited 3D mode, UI restored');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to exit 3D mode:', error);
      return false;
    }
  }

  /**
   * Store original UI states for restoration later
   */
  storeOriginalUIStates() {
    Object.entries(this.uiElements).forEach(([key, element]) => {
      if (!element) return;
      
      const computedStyle = window.getComputedStyle(element);
      this.originalUIStates.set(key, {
        position: element.style.position || computedStyle.position,
        zIndex: element.style.zIndex || computedStyle.zIndex,
        top: element.style.top || computedStyle.top,
        left: element.style.left || computedStyle.left,
        right: element.style.right || computedStyle.right,
        bottom: element.style.bottom || computedStyle.bottom,
        display: element.style.display || computedStyle.display,
        visibility: element.style.visibility || computedStyle.visibility,
        pointerEvents: element.style.pointerEvents || computedStyle.pointerEvents
      });
    });
    
    console.log('💾 Original UI states stored');
  }

  /**
   * Restore original UI states
   */
  restoreOriginalUIStates() {
    this.originalUIStates.forEach((originalState, key) => {
      const element = this.uiElements[key];
      if (!element) return;
      
      // Restore original styles
      Object.entries(originalState).forEach(([property, value]) => {
        if (value && value !== 'auto') {
          element.style[property] = value;
        }
      });
    });
    
    // Clear stored states
    this.originalUIStates.clear();
    console.log('🔄 Original UI states restored');
  }

  /**
   * Update Three.js canvas reference for z-index management
   */
  updateThreeCanvasReference() {
    const threeCanvas = document.getElementById('three-overlay-canvas');
    if (threeCanvas) {
      this.uiElements.threeCanvas = threeCanvas;
      this.setElementZIndex(threeCanvas, this.zIndexLayers.threeCanvas);
      console.log('✅ Three.js canvas z-index configured');
    }
  }

  /**
   * Preserve UI accessibility during 3D mode
   */
  preserveUIAccessibility(character) {
    // Ensure pause button remains accessible
    if (this.uiElements.pauseButton) {
      this.uiElements.pauseButton.style.cssText += `
        position: fixed !important;
        top: 20px !important;
        left: 20px !important;
        z-index: ${this.zIndexLayers.pauseButton} !important;
        pointer-events: auto !important;
        display: block !important;
      `;
    }
    
    // Ensure character HUD remains visible
    const characterHUD = this.uiElements[`${character}HUD`];
    if (characterHUD) {
      characterHUD.style.cssText += `
        position: fixed !important;
        top: 20px !important;
        left: 200px !important;
        z-index: ${this.zIndexLayers.characterHUD} !important;
        pointer-events: auto !important;
        display: block !important;
      `;
    }
    
    // Ensure chroma orb remains accessible (but may be hidden during 3D interaction)
    if (this.uiElements.videoContainer) {
      this.uiElements.videoContainer.style.cssText += `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: ${this.zIndexLayers.chromaOrb} !important;
        pointer-events: auto !important;
      `;
    }
    
    // Ensure chat box maintains proper positioning
    if (this.uiElements.chatBox) {
      this.uiElements.chatBox.style.cssText += `
        position: fixed !important;
        bottom: 120px !important;
        right: 20px !important;
        z-index: ${this.zIndexLayers.chatBox} !important;
        pointer-events: auto !important;
      `;
    }
    
    console.log(`✅ UI accessibility preserved for ${character} in 3D mode`);
  }

  /**
   * Apply 3D mode specific styles
   */
  apply3DModeStyles() {
    // Add a class to body for 3D mode styling
    document.body.classList.add('ui-3d-mode-active');
    
    // Ensure Three.js canvas doesn't interfere with UI interactions
    if (this.uiElements.threeCanvas) {
      this.uiElements.threeCanvas.style.pointerEvents = 'none';
    }
    
    console.log('🎨 3D mode styles applied');
  }

  /**
   * Remove 3D mode specific styles
   */
  remove3DModeStyles() {
    // Remove 3D mode class from body
    document.body.classList.remove('ui-3d-mode-active');
    
    console.log('🎨 3D mode styles removed');
  }

  /**
   * Set up responsive handlers for window resize
   */
  setupResponsiveHandlers() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      // Debounce resize events
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (this.is3DModeActive) {
          this.handleResize();
        }
      }, 100);
    });
    
    console.log('📱 Responsive handlers configured');
  }

  /**
   * Handle window resize during 3D mode
   */
  handleResize() {
    // Re-apply UI positioning to ensure elements remain properly positioned
    Object.entries(this.uiElements).forEach(([key, element]) => {
      if (!element) return;
      
      // Force recalculation of positions for fixed elements
      if (element.style.position === 'fixed') {
        const rect = element.getBoundingClientRect();
        // Trigger reflow to ensure proper positioning
        element.style.transform = 'translateZ(0)';
        setTimeout(() => {
          element.style.transform = '';
        }, 0);
      }
    });
    
    console.log('📐 UI elements repositioned after resize');
  }

  /**
   * Get current 3D mode status
   */
  is3DModeEnabled() {
    return this.is3DModeActive;
  }

  /**
   * Get UI element reference
   */
  getUIElement(elementKey) {
    return this.uiElements[elementKey];
  }

  /**
   * Update UI element reference (for dynamically created elements)
   */
  updateUIElement(elementKey, element) {
    this.uiElements[elementKey] = element;
    
    // Apply appropriate z-index if in 3D mode
    if (this.is3DModeActive && element) {
      const zIndex = this.zIndexLayers[elementKey] || this.zIndexLayers.overlay;
      this.setElementZIndex(element, zIndex);
    }
  }

  /**
   * Force UI refresh (useful for debugging or after dynamic changes)
   */
  refreshUI() {
    if (this.is3DModeActive) {
      // Re-cache elements
      this.cacheUIElements();
      
      // Re-apply z-index management
      this.setupZIndexManagement();
      
      console.log('🔄 UI refreshed in 3D mode');
    }
  }

  /**
   * Get system status for debugging
   */
  getSystemStatus() {
    return {
      is3DModeActive: this.is3DModeActive,
      cachedElements: Object.keys(this.uiElements).length,
      storedStates: this.originalUIStates.size,
      zIndexLayers: this.zIndexLayers
    };
  }
}

// Export for use in other modules
window.UI3DIntegration = UI3DIntegration;