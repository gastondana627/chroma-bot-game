/**
 * Character 3D System
 * Main orchestrator for the 3D character emergence system
 * Coordinates character renderer, emergence animator, and return animator
 */

class Character3DSystem {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.currentCharacter = null;
    this.characterRenderer = null;
    this.emergenceAnimator = null;
    this.returnAnimator = null;
    this.isActive = false;
    this.isTransitioning = false;
    
    // System state
    this.state = 'idle'; // 'idle', 'emerging', 'active', 'returning'
    
    console.log('✅ Character 3D System initialized');
  }

  /**
   * Initialize 3D character system for a specific character
   */
  async initializeCharacter(character) {
    if (!this.sceneManager || !this.sceneManager.isAvailable()) {
      console.error('❌ Cannot initialize character - scene manager not available');
      return false;
    }

    if (!['eli', 'maya', 'stanley'].includes(character)) {
      console.error(`❌ Invalid character: ${character}`);
      return false;
    }

    try {
      // Clean up previous character if exists
      if (this.currentCharacter && this.currentCharacter !== character) {
        await this.cleanup();
      }

      // Skip if already initialized for this character
      if (this.currentCharacter === character && this.characterRenderer) {
        console.log(`✅ Character ${character} already initialized`);
        return true;
      }

      // Create character renderer
      this.characterRenderer = new Character3DRenderer(character, this.sceneManager);
      
      // Create animators
      this.emergenceAnimator = new CharacterEmergenceAnimator(this.characterRenderer, this.sceneManager);
      this.returnAnimator = new CharacterReturnAnimator(this.characterRenderer, this.sceneManager);
      
      // Load character model
      const loaded = await this.characterRenderer.loadCharacterModel();
      if (!loaded) {
        console.error(`❌ Failed to load character model for ${character}`);
        return false;
      }

      this.currentCharacter = character;
      this.state = 'idle';
      
      console.log(`✅ Character 3D system initialized for ${character}`);
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to initialize character ${character}:`, error);
      return false;
    }
  }

  /**
   * Start character emergence from chroma orb
   */
  async emergeCharacter(orbScreenPosition) {
    if (!this.characterRenderer || !this.emergenceAnimator) {
      console.error('❌ Character system not initialized');
      return false;
    }

    if (this.isTransitioning) {
      console.warn('⚠️ Character transition already in progress');
      return false;
    }

    if (this.state !== 'idle') {
      console.warn(`⚠️ Cannot emerge character - current state: ${this.state}`);
      return false;
    }

    try {
      this.isTransitioning = true;
      this.state = 'emerging';
      
      // Show 3D overlay
      this.sceneManager.show();
      
      // Start emergence animation
      const emerged = await this.emergenceAnimator.startEmergence(orbScreenPosition);
      
      if (emerged) {
        // Wait for emergence to complete
        await this.waitForEmergenceComplete();
        
        this.isActive = true;
        this.state = 'active';
        this.isTransitioning = false;
        
        console.log(`✅ Character ${this.currentCharacter} emerged successfully`);
        return true;
      } else {
        this.isTransitioning = false;
        this.state = 'idle';
        this.sceneManager.hide();
        return false;
      }
      
    } catch (error) {
      console.error('❌ Failed to emerge character:', error);
      this.isTransitioning = false;
      this.state = 'idle';
      this.sceneManager.hide();
      return false;
    }
  }

  /**
   * Return character to chroma orb
   */
  async returnCharacter(orbScreenPosition) {
    if (!this.characterRenderer || !this.returnAnimator) {
      console.error('❌ Character system not initialized');
      return false;
    }

    if (this.isTransitioning) {
      console.warn('⚠️ Character transition already in progress');
      return false;
    }

    if (this.state !== 'active') {
      console.warn(`⚠️ Cannot return character - current state: ${this.state}`);
      return false;
    }

    try {
      this.isTransitioning = true;
      this.state = 'returning';
      
      // Start return animation
      const returned = await this.returnAnimator.startReturn(orbScreenPosition);
      
      if (returned) {
        // Wait for return to complete
        await this.waitForReturnComplete();
        
        this.isActive = false;
        this.state = 'idle';
        this.isTransitioning = false;
        
        console.log(`✅ Character ${this.currentCharacter} returned successfully`);
        return true;
      } else {
        this.isTransitioning = false;
        this.state = 'active';
        return false;
      }
      
    } catch (error) {
      console.error('❌ Failed to return character:', error);
      this.isTransitioning = false;
      this.state = 'active';
      return false;
    }
  }

  /**
   * Wait for emergence animation to complete
   */
  waitForEmergenceComplete() {
    return new Promise((resolve) => {
      const checkComplete = () => {
        if (!this.emergenceAnimator.isEmergenceAnimating()) {
          resolve();
        } else {
          setTimeout(checkComplete, 100);
        }
      };
      checkComplete();
    });
  }

  /**
   * Wait for return animation to complete
   */
  waitForReturnComplete() {
    return new Promise((resolve) => {
      const checkComplete = () => {
        if (!this.returnAnimator.isReturnAnimating()) {
          resolve();
        } else {
          setTimeout(checkComplete, 100);
        }
      };
      checkComplete();
    });
  }

  /**
   * Update character system (called in render loop)
   */
  update() {
    if (this.characterRenderer && this.isActive) {
      this.characterRenderer.update();
    }
  }

  /**
   * Get current character
   */
  getCurrentCharacter() {
    return this.currentCharacter;
  }

  /**
   * Get current system state
   */
  getState() {
    return this.state;
  }

  /**
   * Check if character is currently active (visible in 3D)
   */
  isCharacterActive() {
    return this.isActive && this.state === 'active';
  }

  /**
   * Check if system is currently transitioning
   */
  isSystemTransitioning() {
    return this.isTransitioning;
  }

  /**
   * Get character renderer instance
   */
  getCharacterRenderer() {
    return this.characterRenderer;
  }

  /**
   * Emergency stop all animations
   */
  emergencyStop() {
    if (this.emergenceAnimator) {
      this.emergenceAnimator.stopEmergence();
    }
    
    if (this.returnAnimator) {
      this.returnAnimator.stopReturn();
    }
    
    this.isTransitioning = false;
    this.isActive = false;
    this.state = 'idle';
    
    // Hide 3D overlay
    this.sceneManager.hide();
    
    console.log('🛑 Character 3D system emergency stop executed');
  }

  /**
   * Clean up character 3D system
   */
  async cleanup() {
    // Stop any ongoing animations
    this.emergencyStop();
    
    // Clean up animators
    if (this.emergenceAnimator) {
      this.emergenceAnimator.cleanup();
      this.emergenceAnimator = null;
    }
    
    if (this.returnAnimator) {
      this.returnAnimator.cleanup();
      this.returnAnimator = null;
    }
    
    // Clean up character renderer
    if (this.characterRenderer) {
      this.characterRenderer.cleanup();
      this.characterRenderer = null;
    }
    
    // Reset state
    this.currentCharacter = null;
    this.isActive = false;
    this.isTransitioning = false;
    this.state = 'idle';
    
    console.log('🧹 Character 3D system cleaned up');
  }

  /**
   * Get system status for debugging
   */
  getSystemStatus() {
    return {
      currentCharacter: this.currentCharacter,
      state: this.state,
      isActive: this.isActive,
      isTransitioning: this.isTransitioning,
      rendererReady: this.characterRenderer ? this.characterRenderer.isReady() : false,
      sceneManagerAvailable: this.sceneManager ? this.sceneManager.isAvailable() : false
    };
  }
}

// Export for use in other modules
window.Character3DSystem = Character3DSystem;