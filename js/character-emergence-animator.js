/**
 * Character Emergence Animator
 * Handles smooth transition animation where 3D character scales up from chroma orb position
 * Includes particle effects and lighting changes during character materialization
 */

class CharacterEmergenceAnimator {
  constructor(characterRenderer, sceneManager) {
    this.characterRenderer = characterRenderer;
    this.sceneManager = sceneManager;
    this.isAnimating = false;
    this.animationDuration = 2000; // 2 seconds
    this.particleSystem = null;
    this.emergenceStartTime = 0;
    
    // Animation timeline configuration
    this.timeline = {
      orbExpansion: { start: 0, end: 0.3 },      // 0-30% - orb glows and expands
      particleEmission: { start: 0.2, end: 0.8 }, // 20-80% - particles emit
      characterScale: { start: 0.4, end: 1.0 },   // 40-100% - character scales up
      lightingTransition: { start: 0.3, end: 0.9 } // 30-90% - lighting changes
    };
    
    // Particle system configuration
    this.particleConfig = {
      count: 200,
      spread: 2.0,
      speed: 0.02,
      life: 1.5,
      colors: {
        eli: [0x00FFFF, 0xFF0080, 0x7928CA],
        maya: [0x0066CC, 0xFFFFFF, 0x4A90E2],
        stanley: [0x4A5568, 0xE2E8F0, 0xFED7D7]
      }
    };
    
    // Orb position tracking
    this.orbPosition = { x: 0, y: 0, z: 0 };
    
    console.log(`✅ Character emergence animator initialized for ${characterRenderer.character}`);
  }

  /**
   * Start the emergence animation from chroma orb position
   */
  async startEmergence(orbScreenPosition) {
    if (this.isAnimating) {
      console.warn('⚠️ Emergence animation already in progress');
      return false;
    }

    try {
      // Convert screen position to 3D world position
      this.convertScreenToWorldPosition(orbScreenPosition);
      
      // Prepare character for emergence
      await this.prepareCharacterForEmergence();
      
      // Create particle system
      this.createParticleSystem();
      
      // Start the animation sequence
      this.isAnimating = true;
      this.emergenceStartTime = performance.now();
      
      console.log(`🎬 Starting emergence animation for ${this.characterRenderer.character}`);
      
      // Run the animation loop
      this.runEmergenceAnimation();
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to start emergence animation:', error);
      this.isAnimating = false;
      return false;
    }
  }

  /**
   * Convert screen position to 3D world position for orb location
   */
  convertScreenToWorldPosition(screenPosition) {
    const camera = this.sceneManager.getCamera();
    const renderer = this.sceneManager.getRenderer();
    
    if (!camera || !renderer) {
      console.warn('⚠️ Camera or renderer not available, using default orb position');
      return;
    }

    // Convert screen coordinates to normalized device coordinates
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    
    const x = ((screenPosition.x - rect.left) / rect.width) * 2 - 1;
    const y = -((screenPosition.y - rect.top) / rect.height) * 2 + 1;
    
    // Create a vector in NDC space
    const vector = new THREE.Vector3(x, y, 0.5);
    
    // Unproject to world coordinates
    vector.unproject(camera);
    
    // Calculate direction from camera to the point
    const direction = vector.sub(camera.position).normalize();
    
    // Place orb position at a reasonable distance from camera
    const distance = 3;
    this.orbPosition = camera.position.clone().add(direction.multiplyScalar(distance));
    
    console.log('📍 Orb world position calculated:', this.orbPosition);
  }

  /**
   * Prepare character for emergence animation
   */
  async prepareCharacterForEmergence() {
    // Load character model if not already loaded
    if (!this.characterRenderer.isReady()) {
      await this.characterRenderer.loadCharacterModel();
    }
    
    // Position character at orb location
    const characterGroup = this.characterRenderer.getCharacterGroup();
    characterGroup.position.copy(this.orbPosition);
    
    // Set initial scale to 0 for emergence effect
    characterGroup.scale.setScalar(0);
    
    // Make character visible but scaled to 0
    this.characterRenderer.show();
    
    console.log('🎭 Character prepared for emergence');
  }

  /**
   * Create particle system for emergence effect
   */
  createParticleSystem() {
    const character = this.characterRenderer.character;
    const colors = this.particleConfig.colors[character] || this.particleConfig.colors.eli;
    
    // Create particle geometry
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = this.particleConfig.count;
    
    // Particle positions
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors32 = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);
    
    // Initialize particles at orb position
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Start all particles at orb position with slight random offset
      positions[i3] = this.orbPosition.x + (Math.random() - 0.5) * 0.1;
      positions[i3 + 1] = this.orbPosition.y + (Math.random() - 0.5) * 0.1;
      positions[i3 + 2] = this.orbPosition.z + (Math.random() - 0.5) * 0.1;
      
      // Random velocities for particle spread
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI * 0.5;
      const speed = this.particleConfig.speed * (0.5 + Math.random() * 0.5);
      
      velocities[i3] = Math.cos(angle) * Math.cos(elevation) * speed;
      velocities[i3 + 1] = Math.sin(elevation) * speed;
      velocities[i3 + 2] = Math.sin(angle) * Math.cos(elevation) * speed;
      
      // Random color from character palette
      const colorIndex = Math.floor(Math.random() * colors.length);
      const color = new THREE.Color(colors[colorIndex]);
      colors32[i3] = color.r;
      colors32[i3 + 1] = color.g;
      colors32[i3 + 2] = color.b;
      
      // Random size and lifetime
      sizes[i] = Math.random() * 0.05 + 0.02;
      lifetimes[i] = Math.random() * this.particleConfig.life + 0.5;
    }
    
    // Set geometry attributes
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors32, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
    
    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    // Create particle system
    this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    
    // Add to scene
    const scene = this.sceneManager.getScene();
    scene.add(this.particleSystem);
    
    console.log('✨ Particle system created for emergence');
  }

  /**
   * Run the emergence animation loop
   */
  runEmergenceAnimation() {
    const animate = () => {
      if (!this.isAnimating) return;
      
      const currentTime = performance.now();
      const elapsed = currentTime - this.emergenceStartTime;
      const progress = Math.min(elapsed / this.animationDuration, 1.0);
      
      // Update animation components based on timeline
      this.updateCharacterScale(progress);
      this.updateParticleSystem(progress);
      this.updateLighting(progress);
      
      // Continue animation or finish
      if (progress < 1.0) {
        requestAnimationFrame(animate);
      } else {
        this.finishEmergence();
      }
    };
    
    animate();
  }

  /**
   * Update character scale during emergence
   */
  updateCharacterScale(progress) {
    const timeline = this.timeline.characterScale;
    
    if (progress >= timeline.start && progress <= timeline.end) {
      // Calculate scale progress within the timeline segment
      const scaleProgress = (progress - timeline.start) / (timeline.end - timeline.start);
      
      // Use easing function for smooth scaling
      const easedProgress = this.easeOutElastic(scaleProgress);
      
      // Apply scale to character group
      const characterGroup = this.characterRenderer.getCharacterGroup();
      characterGroup.scale.setScalar(easedProgress);
      
      // Add slight rotation for dynamic effect
      characterGroup.rotation.y = easedProgress * Math.PI * 0.1;
    }
  }

  /**
   * Update particle system during emergence
   */
  updateParticleSystem(progress) {
    if (!this.particleSystem) return;
    
    const timeline = this.timeline.particleEmission;
    
    if (progress >= timeline.start && progress <= timeline.end) {
      const geometry = this.particleSystem.geometry;
      const positions = geometry.attributes.position.array;
      const velocities = geometry.attributes.velocity.array;
      
      // Update particle positions
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
      }
      
      geometry.attributes.position.needsUpdate = true;
      
      // Fade out particles as emergence completes
      const fadeProgress = (progress - timeline.start) / (timeline.end - timeline.start);
      this.particleSystem.material.opacity = 0.8 * (1 - fadeProgress);
    }
  }

  /**
   * Update lighting during emergence
   */
  updateLighting(progress) {
    const timeline = this.timeline.lightingTransition;
    
    if (progress >= timeline.start && progress <= timeline.end) {
      const lightProgress = (progress - timeline.start) / (timeline.end - timeline.start);
      
      // Get character configuration for lighting
      const config = this.characterRenderer.getConfig();
      if (!config) return;
      
      // Gradually increase lighting intensity
      const scene = this.sceneManager.getScene();
      scene.traverse((object) => {
        if (object.isLight && object !== scene.children[0]) { // Skip default ambient light
          object.intensity = lightProgress * 0.8;
        }
      });
    }
  }

  /**
   * Easing function for smooth character scaling
   */
  easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }

  /**
   * Finish the emergence animation
   */
  finishEmergence() {
    this.isAnimating = false;
    
    // Ensure character is at full scale
    const characterGroup = this.characterRenderer.getCharacterGroup();
    characterGroup.scale.setScalar(1);
    characterGroup.rotation.y = 0;
    
    // Clean up particle system
    this.cleanupParticleSystem();
    
    console.log(`✅ Emergence animation completed for ${this.characterRenderer.character}`);
    
    // Dispatch custom event for emergence completion
    window.dispatchEvent(new CustomEvent('characterEmergenceComplete', {
      detail: { character: this.characterRenderer.character }
    }));
  }

  /**
   * Clean up particle system
   */
  cleanupParticleSystem() {
    if (this.particleSystem) {
      const scene = this.sceneManager.getScene();
      scene.remove(this.particleSystem);
      
      // Dispose of geometry and material
      this.particleSystem.geometry.dispose();
      this.particleSystem.material.dispose();
      
      this.particleSystem = null;
      console.log('🧹 Particle system cleaned up');
    }
  }

  /**
   * Check if emergence animation is currently running
   */
  isEmergenceAnimating() {
    return this.isAnimating;
  }

  /**
   * Stop emergence animation (emergency stop)
   */
  stopEmergence() {
    if (this.isAnimating) {
      this.isAnimating = false;
      this.cleanupParticleSystem();
      console.log('⏹️ Emergence animation stopped');
    }
  }

  /**
   * Clean up emergence animator resources
   */
  cleanup() {
    this.stopEmergence();
    this.cleanupParticleSystem();
    
    this.characterRenderer = null;
    this.sceneManager = null;
    
    console.log('🧹 Character emergence animator cleaned up');
  }
}

// Export for use in other modules
window.CharacterEmergenceAnimator = CharacterEmergenceAnimator;