/**
 * 3D Character Renderer Class
 * Handles Three.js-based character rendering system for displaying 3D models
 * Implements camera positioning and lighting for character presentation
 */

class Character3DRenderer {
  constructor(character, sceneManager) {
    this.character = character; // 'eli', 'maya', 'stanley'
    this.sceneManager = sceneManager;
    this.characterModel = null;
    this.characterGroup = new THREE.Group();
    this.isLoaded = false;
    this.isVisible = false;
    
    // Character-specific configurations
    this.characterConfigs = {
      eli: {
        modelPath: '/assets/3d/eli/eli_model.glb',
        scale: 1.0,
        position: { x: 0, y: -1, z: 0 },
        lighting: {
          theme: 'gaming_neon',
          colors: {
            ambient: 0x001122,
            directional: 0x00FFFF,
            accent: 0xFF0080
          }
        },
        camera: {
          position: { x: 2, y: 1, z: 4 },
          lookAt: { x: 0, y: 0.5, z: 0 }
        }
      },
      maya: {
        modelPath: '/assets/3d/maya/maya_model.glb',
        scale: 1.0,
        position: { x: 0, y: -1, z: 0 },
        lighting: {
          theme: 'investigation_mood',
          colors: {
            ambient: 0x001133,
            directional: 0x0066CC,
            accent: 0xFFFFFF
          }
        },
        camera: {
          position: { x: -2, y: 1.5, z: 3.5 },
          lookAt: { x: 0, y: 0.5, z: 0 }
        }
      },
      stanley: {
        modelPath: '/assets/3d/stanley/stanley_model.glb',
        scale: 1.0,
        position: { x: 0, y: -1, z: 0 },
        lighting: {
          theme: 'suburban_security',
          colors: {
            ambient: 0x2D3748,
            directional: 0xE2E8F0,
            accent: 0xFED7D7
          }
        },
        camera: {
          position: { x: 1.5, y: 1, z: 4 },
          lookAt: { x: 0, y: 0.5, z: 0 }
        }
      }
    };
    
    // Lighting setup
    this.lights = {
      ambient: null,
      directional: null,
      accent: null
    };
    
    // Animation properties
    this.animations = {
      mixer: null,
      actions: {},
      clock: new THREE.Clock()
    };
    
    // Initialize the character renderer
    this.initialize();
  }

  /**
   * Initialize the character renderer
   */
  initialize() {
    if (!this.sceneManager || !this.sceneManager.isAvailable()) {
      console.error('❌ Cannot initialize character renderer - scene manager not available');
      return false;
    }

    try {
      // Set up character-specific lighting
      this.setupCharacterLighting();
      
      // Add character group to scene
      const scene = this.sceneManager.getScene();
      scene.add(this.characterGroup);
      
      // Position camera for character viewing
      this.positionCameraForCharacter();
      
      console.log(`✅ Character renderer initialized for: ${this.character}`);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize character renderer:', error);
      return false;
    }
  }

  /**
   * Set up character-specific lighting system
   */
  setupCharacterLighting() {
    const config = this.characterConfigs[this.character];
    if (!config) {
      console.error(`❌ No configuration found for character: ${this.character}`);
      return;
    }

    const scene = this.sceneManager.getScene();
    
    // Remove existing lights if any
    this.removeLights();
    
    // Ambient light for base illumination
    this.lights.ambient = new THREE.AmbientLight(
      config.lighting.colors.ambient, 
      0.4
    );
    scene.add(this.lights.ambient);
    
    // Directional light for main character lighting
    this.lights.directional = new THREE.DirectionalLight(
      config.lighting.colors.directional, 
      0.8
    );
    this.lights.directional.position.set(2, 3, 2);
    this.lights.directional.castShadow = true;
    
    // Configure shadow properties
    this.lights.directional.shadow.mapSize.width = 1024;
    this.lights.directional.shadow.mapSize.height = 1024;
    this.lights.directional.shadow.camera.near = 0.5;
    this.lights.directional.shadow.camera.far = 50;
    
    scene.add(this.lights.directional);
    
    // Accent light for character theme
    this.lights.accent = new THREE.PointLight(
      config.lighting.colors.accent, 
      0.6, 
      10
    );
    this.lights.accent.position.set(-2, 2, 1);
    scene.add(this.lights.accent);
    
    console.log(`✅ Character lighting setup complete for ${this.character} (${config.lighting.theme})`);
  }

  /**
   * Position camera for optimal character viewing
   */
  positionCameraForCharacter() {
    const config = this.characterConfigs[this.character];
    const camera = this.sceneManager.getCamera();
    
    if (!config || !camera) return;
    
    // Set camera position
    camera.position.set(
      config.camera.position.x,
      config.camera.position.y,
      config.camera.position.z
    );
    
    // Set camera look-at target
    camera.lookAt(
      config.camera.lookAt.x,
      config.camera.lookAt.y,
      config.camera.lookAt.z
    );
    
    console.log(`📷 Camera positioned for ${this.character}`);
  }

  /**
   * Load 3D character model (placeholder for now)
   * This will be enhanced when the asset pipeline is implemented
   */
  async loadCharacterModel() {
    const config = this.characterConfigs[this.character];
    
    try {
      // For now, create a placeholder geometry until actual models are available
      const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
      const material = new THREE.MeshPhongMaterial({ 
        color: config.lighting.colors.directional,
        transparent: true,
        opacity: 0.8
      });
      
      this.characterModel = new THREE.Mesh(geometry, material);
      this.characterModel.position.set(
        config.position.x,
        config.position.y,
        config.position.z
      );
      this.characterModel.scale.setScalar(config.scale);
      this.characterModel.castShadow = true;
      this.characterModel.receiveShadow = true;
      
      // Add model to character group
      this.characterGroup.add(this.characterModel);
      
      // Set initial scale to 0 for emergence animation
      this.characterGroup.scale.setScalar(0);
      
      this.isLoaded = true;
      console.log(`✅ Character model loaded for ${this.character}`);
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to load character model for ${this.character}:`, error);
      return false;
    }
  }

  /**
   * Show the character (make visible in scene)
   */
  show() {
    if (!this.isLoaded) {
      console.warn(`⚠️ Cannot show ${this.character} - model not loaded`);
      return false;
    }
    
    this.characterGroup.visible = true;
    this.isVisible = true;
    
    console.log(`👁️ Character ${this.character} is now visible`);
    return true;
  }

  /**
   * Hide the character (make invisible in scene)
   */
  hide() {
    this.characterGroup.visible = false;
    this.isVisible = false;
    
    console.log(`🙈 Character ${this.character} is now hidden`);
  }

  /**
   * Update character animations (called in render loop)
   */
  update() {
    if (!this.isVisible || !this.animations.mixer) return;
    
    const delta = this.animations.clock.getDelta();
    this.animations.mixer.update(delta);
  }

  /**
   * Get character group for animation purposes
   */
  getCharacterGroup() {
    return this.characterGroup;
  }

  /**
   * Get character model mesh
   */
  getCharacterModel() {
    return this.characterModel;
  }

  /**
   * Check if character is loaded and ready
   */
  isReady() {
    return this.isLoaded && this.characterModel !== null;
  }

  /**
   * Check if character is currently visible
   */
  isCharacterVisible() {
    return this.isVisible;
  }

  /**
   * Get character configuration
   */
  getConfig() {
    return this.characterConfigs[this.character];
  }

  /**
   * Remove character-specific lights from scene
   */
  removeLights() {
    const scene = this.sceneManager.getScene();
    
    Object.values(this.lights).forEach(light => {
      if (light && scene) {
        scene.remove(light);
        if (light.dispose) light.dispose();
      }
    });
    
    // Reset lights object
    this.lights = {
      ambient: null,
      directional: null,
      accent: null
    };
  }

  /**
   * Clean up character renderer resources
   */
  cleanup() {
    // Stop animations
    if (this.animations.mixer) {
      this.animations.mixer.stopAllAction();
      this.animations.mixer = null;
    }
    
    // Remove lights
    this.removeLights();
    
    // Remove character group from scene
    const scene = this.sceneManager.getScene();
    if (scene && this.characterGroup) {
      scene.remove(this.characterGroup);
      
      // Dispose of geometries and materials
      this.characterGroup.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    
    // Reset properties
    this.characterModel = null;
    this.characterGroup = null;
    this.isLoaded = false;
    this.isVisible = false;
    
    console.log(`🧹 Character renderer cleaned up for ${this.character}`);
  }
}

// Export for use in other modules
window.Character3DRenderer = Character3DRenderer;