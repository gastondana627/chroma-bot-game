/**
 * Character Return Animator
 * Handles reverse animation where 3D character dissolves back into chroma orb
 * Ensures seamless transition back to standard chroma bot interface
 */

class CharacterReturnAnimator {
  constructor(characterRenderer, sceneManager) {
    this.characterRenderer = characterRenderer;
    this.sceneManager = sceneManager;
    this.isAnimating = false;
    this.animationDuration = 1500; // 1.5 seconds (slightly faster than emergence)
    this.dissolveSystem = null;
    this.returnStartTime = 0;
    
    // Animation timeline configuration (reverse of emergence)
    this.timeline = {
      lightingFade: { start: 0, end: 0.4 },        // 0-40% - lighting fades
      characterShrink: { start: 0.2, end: 0.8 },   // 20-80% - character shrinks
      dissolveEffect: { start: 0.3, end: 0.9 },    // 30-90% - dissolve particles
      orbReformation: { start: 0.7, end: 1.0 }     // 70-100% - orb reforms
    };
    
    // Dissolve effect configuration
    this.dissolveConfig = {
      particleCount: 150,
      shrinkSpeed: 0.8,
      fadeSpeed: 1.2,
      convergenceRadius: 0.1
    };
    
    // Target orb position (where character should return to)
    this.targetOrbPosition = { x: 0, y: 0, z: 0 };
    
    console.log(`✅ Character return animator initialized for ${characterRenderer.character}`);
  }

  /**
   * Start the return-to-orb animation
   */
  async startReturn(targetOrbScreenPosition) {
    if (this.isAnimating) {
      console.warn('⚠️ Return animation already in progress');
      return false;
    }

    if (!this.characterRenderer.isCharacterVisible()) {
      console.warn('⚠️ Character not visible, cannot start return animation');
      return false;
    }

    try {
      // Convert screen position to world position for target orb location
      this.convertScreenToWorldPosition(targetOrbScreenPosition);
      
      // Prepare character for return animation
      this.prepareCharacterForReturn();
      
      // Create dissolve effect system
      this.createDissolveSystem();
      
      // Start the animation sequence
      this.isAnimating = true;
      this.returnStartTime = performance.now();
      
      console.log(`🎬 Starting return animation for ${this.characterRenderer.character}`);
      
      // Run the animation loop
      this.runReturnAnimation();
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to start return animation:', error);
      this.isAnimating = false;
      return false;
    }
  }

  /**
   * Convert screen position to 3D world position for target orb location
   */
  convertScreenToWorldPosition(screenPosition) {
    const camera = this.sceneManager.getCamera();
    const renderer = this.sceneManager.getRenderer();
    
    if (!camera || !renderer) {
      console.warn('⚠️ Camera or renderer not available, using default target position');
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
    
    // Place target orb position at the same distance as current character
    const characterGroup = this.characterRenderer.getCharacterGroup();
    const distance = camera.position.distanceTo(characterGroup.position);
    this.targetOrbPosition = camera.position.clone().add(direction.multiplyScalar(distance));
    
    console.log('🎯 Target orb position calculated:', this.targetOrbPosition);
  }

  /**
   * Prepare character for return animation
   */
  prepareCharacterForReturn() {
    const characterGroup = this.characterRenderer.getCharacterGroup();
    
    // Store initial position and scale for animation
    this.initialPosition = characterGroup.position.clone();
    this.initialScale = characterGroup.scale.x;
    
    // Ensure character is visible and at full scale
    characterGroup.scale.setScalar(1);
    this.characterRenderer.show();
    
    console.log('🎭 Character prepared for return animation');
  }

  /**
   * Create dissolve effect system
   */
  createDissolveSystem() {
    const character = this.characterRenderer.character;
    const characterGroup = this.characterRenderer.getCharacterGroup();
    
    // Get character model bounds for particle distribution
    const box = new THREE.Box3().setFromObject(characterGroup);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    // Create dissolve particle geometry
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = this.dissolveConfig.particleCount;
    
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);
    
    // Character-specific colors for dissolve effect
    const characterColors = {
      eli: [0x00FFFF, 0xFF0080, 0x7928CA],
      maya: [0x0066CC, 0xFFFFFF, 0x4A90E2],
      stanley: [0x4A5568, 0xE2E8F0, 0xFED7D7]
    };
    
    const colors32 = characterColors[character] || characterColors.eli;
    
    // Initialize particles distributed around character
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Distribute particles within character bounds
      positions[i3] = center.x + (Math.random() - 0.5) * size.x;
      positions[i3 + 1] = center.y + (Math.random() - 0.5) * size.y;
      positions[i3 + 2] = center.z + (Math.random() - 0.5) * size.z;
      
      // Calculate velocity toward target orb position
      const particlePos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      const direction = this.targetOrbPosition.clone().sub(particlePos).normalize();
      const speed = 0.02 + Math.random() * 0.01;
      
      velocities[i3] = direction.x * speed;
      velocities[i3 + 1] = direction.y * speed;
      velocities[i3 + 2] = direction.z * speed;
      
      // Random color from character palette
      const colorIndex = Math.floor(Math.random() * colors32.length);
      const color = new THREE.Color(colors32[colorIndex]);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Random size and lifetime
      sizes[i] = Math.random() * 0.03 + 0.01;
      lifetimes[i] = Math.random() * 0.5 + 0.5;
    }
    
    // Set geometry attributes
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
    
    // Create dissolve material
    const dissolveMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    
    // Create dissolve system
    this.dissolveSystem = new THREE.Points(particleGeometry, dissolveMaterial);
    
    // Add to scene
    const scene = this.sceneManager.getScene();
    scene.add(this.dissolveSystem);
    
    console.log('💫 Dissolve system created for return animation');
  }

  /**
   * Run the return animation loop
   */
  runReturnAnimation() {
    const animate = () => {
      if (!this.isAnimating) return;
      
      const currentTime = performance.now();
      const elapsed = currentTime - this.returnStartTime;
      const progress = Math.min(elapsed / this.animationDuration, 1.0);
      
      // Update animation components based on timeline
      this.updateLighting(progress);
      this.updateCharacterShrink(progress);
      this.updateDissolveEffect(progress);
      this.updateCharacterMovement(progress);
      
      // Continue animation or finish
      if (progress < 1.0) {
        requestAnimationFrame(animate);
      } else {
        this.finishReturn();
      }
    };
    
    animate();
  }

  /**
   * Update lighting fade during return
   */
  updateLighting(progress) {
    const timeline = this.timeline.lightingFade;
    
    if (progress >= timeline.start && progress <= timeline.end) {
      const fadeProgress = (progress - timeline.start) / (timeline.end - timeline.start);
      
      // Gradually decrease lighting intensity
      const scene = this.sceneManager.getScene();
      scene.traverse((object) => {
        if (object.isLight && object !== scene.children[0]) { // Skip default ambient light
          object.intensity = 0.8 * (1 - fadeProgress);
        }
      });
    }
  }

  /**
   * Update character shrinking during return
   */
  updateCharacterShrink(progress) {
    const timeline = this.timeline.characterShrink;
    
    if (progress >= timeline.start && progress <= timeline.end) {
      const shrinkProgress = (progress - timeline.start) / (timeline.end - timeline.start);
      
      // Use easing function for smooth shrinking
      const easedProgress = this.easeInQuart(shrinkProgress);
      const scale = 1 - easedProgress;
      
      // Apply scale to character group
      const characterGroup = this.characterRenderer.getCharacterGroup();
      characterGroup.scale.setScalar(scale);
      
      // Add slight rotation for dynamic effect
      characterGroup.rotation.y = easedProgress * Math.PI * 0.2;
      
      // Fade character opacity
      characterGroup.traverse((object) => {
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => {
              if (material.transparent !== undefined) {
                material.transparent = true;
                material.opacity = 1 - easedProgress;
              }
            });
          } else if (object.material.transparent !== undefined) {
            object.material.transparent = true;
            object.material.opacity = 1 - easedProgress;
          }
        }
      });
    }
  }

  /**
   * Update character movement toward orb position
   */
  updateCharacterMovement(progress) {
    const timeline = this.timeline.characterShrink;
    
    if (progress >= timeline.start && progress <= timeline.end) {
      const moveProgress = (progress - timeline.start) / (timeline.end - timeline.start);
      
      // Interpolate position toward target orb position
      const characterGroup = this.characterRenderer.getCharacterGroup();
      characterGroup.position.lerpVectors(this.initialPosition, this.targetOrbPosition, moveProgress);
    }
  }

  /**
   * Update dissolve effect during return
   */
  updateDissolveEffect(progress) {
    if (!this.dissolveSystem) return;
    
    const timeline = this.timeline.dissolveEffect;
    
    if (progress >= timeline.start && progress <= timeline.end) {
      const dissolveProgress = (progress - timeline.start) / (timeline.end - timeline.start);
      
      // Fade in dissolve particles
      this.dissolveSystem.material.opacity = dissolveProgress * 0.8;
      
      // Update particle positions toward orb
      const geometry = this.dissolveSystem.geometry;
      const positions = geometry.attributes.position.array;
      const velocities = geometry.attributes.velocity.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Move particles toward target orb position
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
        
        // Accelerate particles as they get closer to orb
        const particlePos = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        const distance = particlePos.distanceTo(this.targetOrbPosition);
        
        if (distance < this.dissolveConfig.convergenceRadius) {
          // Snap particles to orb position when very close
          positions[i] = this.targetOrbPosition.x;
          positions[i + 1] = this.targetOrbPosition.y;
          positions[i + 2] = this.targetOrbPosition.z;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;
    }
  }

  /**
   * Easing function for character shrinking
   */
  easeInQuart(t) {
    return t * t * t * t;
  }

  /**
   * Finish the return animation
   */
  finishReturn() {
    this.isAnimating = false;
    
    // Hide the character completely
    this.characterRenderer.hide();
    
    // Reset character properties
    const characterGroup = this.characterRenderer.getCharacterGroup();
    characterGroup.scale.setScalar(1);
    characterGroup.rotation.y = 0;
    characterGroup.position.copy(this.initialPosition);
    
    // Reset character material opacity
    characterGroup.traverse((object) => {
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => {
            if (material.transparent !== undefined) {
              material.transparent = false;
              material.opacity = 1;
            }
          });
        } else if (object.material.transparent !== undefined) {
          object.material.transparent = false;
          object.material.opacity = 1;
        }
      }
    });
    
    // Clean up dissolve system
    this.cleanupDissolveSystem();
    
    // Hide 3D overlay to return to standard chroma bot
    this.sceneManager.hide();
    
    console.log(`✅ Return animation completed for ${this.characterRenderer.character}`);
    
    // Dispatch custom event for return completion
    window.dispatchEvent(new CustomEvent('characterReturnComplete', {
      detail: { character: this.characterRenderer.character }
    }));
  }

  /**
   * Clean up dissolve system
   */
  cleanupDissolveSystem() {
    if (this.dissolveSystem) {
      const scene = this.sceneManager.getScene();
      scene.remove(this.dissolveSystem);
      
      // Dispose of geometry and material
      this.dissolveSystem.geometry.dispose();
      this.dissolveSystem.material.dispose();
      
      this.dissolveSystem = null;
      console.log('🧹 Dissolve system cleaned up');
    }
  }

  /**
   * Check if return animation is currently running
   */
  isReturnAnimating() {
    return this.isAnimating;
  }

  /**
   * Stop return animation (emergency stop)
   */
  stopReturn() {
    if (this.isAnimating) {
      this.isAnimating = false;
      this.cleanupDissolveSystem();
      
      // Ensure character is hidden and 3D overlay is closed
      this.characterRenderer.hide();
      this.sceneManager.hide();
      
      console.log('⏹️ Return animation stopped');
    }
  }

  /**
   * Clean up return animator resources
   */
  cleanup() {
    this.stopReturn();
    this.cleanupDissolveSystem();
    
    this.characterRenderer = null;
    this.sceneManager = null;
    
    console.log('🧹 Character return animator cleaned up');
  }
}

// Export for use in other modules
window.CharacterReturnAnimator = CharacterReturnAnimator;