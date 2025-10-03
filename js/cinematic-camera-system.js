/**
 * Cinematic Camera System
 * Implements automatic camera positioning and smooth transitions
 * for optimal character viewing during 3D cinematic moments
 */

class CinematicCameraSystem {
    constructor(camera, controls, scene) {
        this.camera = camera;
        this.controls = controls;
        this.scene = scene;
        this.isActive = false;
        this.currentShot = null;
        this.animationFrameId = null;
        
        // Store original camera state for restoration
        this.originalCameraState = {
            position: this.camera.position.clone(),
            rotation: this.camera.rotation.clone(),
            fov: this.camera.fov,
            zoom: this.camera.zoom
        };
        
        // Camera shot configurations for different cinematic moments
        this.cameraShots = {
            // Eli's Camera Shots
            heroic_low: {
                name: 'Heroic Low Angle',
                character: 'eli',
                position: { x: 0, y: 1.5, z: 4 },
                lookAt: { x: 0, y: 2.5, z: 0 },
                fov: 50,
                description: 'Low angle shot emphasizing victory and triumph'
            },
            
            eye_level: {
                name: 'Eye Level',
                character: 'eli',
                position: { x: 0, y: 2, z: 3 },
                lookAt: { x: 0, y: 2, z: 0 },
                fov: 60,
                description: 'Direct eye contact for serious moments'
            },
            
            epic_wide: {
                name: 'Epic Wide Shot',
                character: 'eli',
                position: { x: 0, y: 3, z: 6 },
                lookAt: { x: 0, y: 2, z: 0 },
                fov: 70,
                description: 'Wide shot showing full character and environment'
            },
            
            // Maya's Camera Shots
            detective_close: {
                name: 'Detective Close-up',
                character: 'maya',
                position: { x: 1, y: 2.2, z: 2.5 },
                lookAt: { x: 0, y: 2.2, z: 0 },
                fov: 45,
                description: 'Close-up for investigation and analysis moments'
            },
            
            revelation_dramatic: {
                name: 'Revelation Dramatic',
                character: 'maya',
                position: { x: -2, y: 3, z: 4 },
                lookAt: { x: 0, y: 2, z: 0 },
                fov: 55,
                description: 'Dramatic angle for breakthrough moments'
            },
            
            heroic_confrontation: {
                name: 'Heroic Confrontation',
                character: 'maya',
                position: { x: 0, y: 2.5, z: 3.5 },
                lookAt: { x: 0, y: 2.3, z: 0 },
                fov: 50,
                description: 'Strong angle for confrontation scenes'
            },
            
            // Stanley's Camera Shots
            concerned_citizen: {
                name: 'Concerned Citizen',
                character: 'stanley',
                position: { x: 1.5, y: 2, z: 3 },
                lookAt: { x: 0, y: 2, z: 0 },
                fov: 55,
                description: 'Relatable angle for concern and worry'
            },
            
            protector_stance: {
                name: 'Protector Stance',
                character: 'stanley',
                position: { x: 0, y: 1.8, z: 4 },
                lookAt: { x: 0, y: 2.2, z: 0 },
                fov: 60,
                description: 'Stable shot emphasizing protective nature'
            },
            
            leader_perspective: {
                name: 'Leader Perspective',
                character: 'stanley',
                position: { x: 0, y: 2.8, z: 5 },
                lookAt: { x: 0, y: 2, z: 0 },
                fov: 65,
                description: 'Elevated view showing leadership qualities'
            }
        };
        
        // Camera movement patterns
        this.movementPatterns = {
            slow_zoom_in: {
                name: 'Slow Zoom In',
                type: 'zoom',
                startDistance: 5,
                endDistance: 3,
                duration: 3000,
                easing: 'easeInOutCubic'
            },
            
            steady_focus: {
                name: 'Steady Focus',
                type: 'static',
                duration: 5000,
                microMovements: true
            },
            
            triumphant_circle: {
                name: 'Triumphant Circle',
                type: 'orbit',
                radius: 4,
                startAngle: 0,
                endAngle: Math.PI * 2,
                duration: 8000,
                easing: 'easeInOutSine'
            },
            
            investigative_zoom: {
                name: 'Investigative Zoom',
                type: 'zoom',
                startDistance: 4,
                endDistance: 2.5,
                duration: 2500,
                easing: 'easeOutQuart'
            },
            
            discovery_pull_back: {
                name: 'Discovery Pull Back',
                type: 'zoom',
                startDistance: 2.5,
                endDistance: 4.5,
                duration: 3000,
                easing: 'easeOutBack'
            },
            
            justice_approach: {
                name: 'Justice Approach',
                type: 'dolly',
                startPosition: { x: 0, y: 2.5, z: 5 },
                endPosition: { x: 0, y: 2.5, z: 3 },
                duration: 4000,
                easing: 'easeInOutQuart'
            },
            
            security_focus: {
                name: 'Security Focus',
                type: 'static',
                duration: 4000,
                stabilization: true
            },
            
            guardian_circle: {
                name: 'Guardian Circle',
                type: 'orbit',
                radius: 3.5,
                startAngle: Math.PI / 4,
                endAngle: Math.PI * 1.75,
                duration: 6000,
                easing: 'easeInOutSine'
            },
            
            community_pan: {
                name: 'Community Pan',
                type: 'pan',
                startLookAt: { x: -2, y: 2, z: 0 },
                endLookAt: { x: 2, y: 2, z: 0 },
                duration: 5000,
                easing: 'easeInOutCubic'
            }
        };
        
        // Focus targets for different shots
        this.focusTargets = {
            character_face: { x: 0, y: 2.2, z: 0 },
            character_eyes: { x: 0, y: 2.3, z: 0 },
            full_character: { x: 0, y: 1.8, z: 0 },
            character_analysis: { x: 0, y: 2.1, z: 0 },
            evidence_and_character: { x: 0, y: 2, z: 0 },
            determined_expression: { x: 0, y: 2.2, z: 0 },
            worried_expression: { x: 0, y: 2.1, z: 0 },
            protective_gesture: { x: 0, y: 1.9, z: 0 },
            inspiring_presence: { x: 0, y: 2.4, z: 0 }
        };
        
        // Current animation state
        this.animationState = {
            isAnimating: false,
            startTime: 0,
            duration: 0,
            startPosition: new THREE.Vector3(),
            endPosition: new THREE.Vector3(),
            startLookAt: new THREE.Vector3(),
            endLookAt: new THREE.Vector3(),
            startFov: 60,
            endFov: 60,
            easing: 'linear',
            pattern: null
        };
    }
    
    /**
     * Initialize cinematic camera system
     */
    initialize() {
        console.log('Cinematic Camera System initialized');
        
        // Store original controls state
        if (this.controls) {
            this.originalControlsEnabled = this.controls.enabled;
        }
    }
    
    /**
     * Start cinematic camera sequence
     * @param {Object} cinematicConfig - Camera configuration from cinematic moments
     */
    async startCinematicSequence(cinematicConfig) {
        if (this.isActive) {
            console.warn('Cinematic camera already active');
            return;
        }
        
        this.isActive = true;
        
        console.log('Starting cinematic camera sequence:', cinematicConfig);
        
        try {
            // Disable user controls during cinematic
            if (this.controls) {
                this.controls.enabled = false;
            }
            
            // Get camera shot configuration
            const shotConfig = this.getCameraShot(cinematicConfig);
            
            // Execute camera movement
            await this.executeCameraMovement(shotConfig, cinematicConfig);
            
            console.log('Cinematic camera sequence completed');
            
        } catch (error) {
            console.error('Cinematic camera sequence failed:', error);
        }
    }
    
    /**
     * End cinematic camera sequence
     * @param {number} transitionDuration - Duration to transition back
     */
    async endCinematicSequence(transitionDuration = 2000) {
        if (!this.isActive) {
            return;
        }
        
        console.log('Ending cinematic camera sequence');
        
        try {
            // Stop any ongoing animation
            this.stopAnimation();
            
            // Transition back to original camera state
            await this.transitionToOriginalState(transitionDuration);
            
            // Re-enable user controls
            if (this.controls) {
                this.controls.enabled = this.originalControlsEnabled;
            }
            
            this.isActive = false;
            this.currentShot = null;
            
            console.log('Cinematic camera sequence ended');
            
        } catch (error) {
            console.error('Failed to end cinematic camera sequence:', error);
        }
    }
    
    /**
     * Get camera shot configuration
     * @param {Object} cinematicConfig - Cinematic configuration
     * @returns {Object} Camera shot configuration
     */
    getCameraShot(cinematicConfig) {
        const shotName = cinematicConfig.camera?.angle || 'eye_level';
        const shot = this.cameraShots[shotName];
        
        if (!shot) {
            console.warn(`Unknown camera shot: ${shotName}, using default`);
            return this.cameraShots.eye_level;
        }
        
        return shot;
    }
    
    /**
     * Execute camera movement sequence
     * @param {Object} shotConfig - Camera shot configuration
     * @param {Object} cinematicConfig - Full cinematic configuration
     */
    async executeCameraMovement(shotConfig, cinematicConfig) {
        this.currentShot = shotConfig;
        
        // Get movement pattern
        const movementName = cinematicConfig.camera?.movement || 'steady_focus';
        const movement = this.movementPatterns[movementName];
        
        // Get focus target
        const focusName = cinematicConfig.camera?.focus || 'character_face';
        const focusTarget = this.focusTargets[focusName];
        
        // Initial camera positioning
        await this.transitionToShot(shotConfig, focusTarget, 1500);
        
        // Execute movement pattern
        if (movement) {
            await this.executeMovementPattern(movement, shotConfig, focusTarget);
        }
    }
    
    /**
     * Transition camera to shot position
     * @param {Object} shotConfig - Shot configuration
     * @param {Object} focusTarget - Focus target position
     * @param {number} duration - Transition duration
     */
    async transitionToShot(shotConfig, focusTarget, duration) {
        const startPosition = this.camera.position.clone();
        const endPosition = new THREE.Vector3(shotConfig.position.x, shotConfig.position.y, shotConfig.position.z);
        
        const startLookAt = new THREE.Vector3();
        this.camera.getWorldDirection(startLookAt);
        startLookAt.add(this.camera.position);
        
        const endLookAt = new THREE.Vector3(focusTarget.x, focusTarget.y, focusTarget.z);
        
        // Setup animation state
        this.animationState = {
            isAnimating: true,
            startTime: Date.now(),
            duration: duration,
            startPosition: startPosition,
            endPosition: endPosition,
            startLookAt: startLookAt,
            endLookAt: endLookAt,
            startFov: this.camera.fov,
            endFov: shotConfig.fov,
            easing: 'easeInOutCubic',
            pattern: null
        };
        
        // Start animation loop
        this.startAnimationLoop();
        
        // Wait for completion
        await this.waitForAnimation(duration);
    }
    
    /**
     * Execute movement pattern
     * @param {Object} movement - Movement pattern configuration
     * @param {Object} shotConfig - Shot configuration
     * @param {Object} focusTarget - Focus target
     */
    async executeMovementPattern(movement, shotConfig, focusTarget) {
        console.log(`Executing movement pattern: ${movement.name}`);
        
        switch (movement.type) {
            case 'zoom':
                await this.executeZoomMovement(movement, shotConfig, focusTarget);
                break;
                
            case 'orbit':
                await this.executeOrbitMovement(movement, shotConfig, focusTarget);
                break;
                
            case 'dolly':
                await this.executeDollyMovement(movement, focusTarget);
                break;
                
            case 'pan':
                await this.executePanMovement(movement, shotConfig);
                break;
                
            case 'static':
                await this.executeStaticMovement(movement);
                break;
                
            default:
                console.warn(`Unknown movement type: ${movement.type}`);
        }
    }
    
    /**
     * Execute zoom movement
     * @param {Object} movement - Movement configuration
     * @param {Object} shotConfig - Shot configuration
     * @param {Object} focusTarget - Focus target
     */
    async executeZoomMovement(movement, shotConfig, focusTarget) {
        const direction = new THREE.Vector3()
            .subVectors(this.camera.position, new THREE.Vector3(focusTarget.x, focusTarget.y, focusTarget.z))
            .normalize();
        
        const startPosition = direction.clone().multiplyScalar(movement.startDistance).add(new THREE.Vector3(focusTarget.x, focusTarget.y, focusTarget.z));
        const endPosition = direction.clone().multiplyScalar(movement.endDistance).add(new THREE.Vector3(focusTarget.x, focusTarget.y, focusTarget.z));
        
        this.animationState = {
            isAnimating: true,
            startTime: Date.now(),
            duration: movement.duration,
            startPosition: startPosition,
            endPosition: endPosition,
            startLookAt: new THREE.Vector3(focusTarget.x, focusTarget.y, focusTarget.z),
            endLookAt: new THREE.Vector3(focusTarget.x, focusTarget.y, focusTarget.z),
            startFov: this.camera.fov,
            endFov: this.camera.fov,
            easing: movement.easing,
            pattern: movement
        };
        
        this.startAnimationLoop();
        await this.waitForAnimation(movement.duration);
    }
    
    /**
     * Execute orbit movement
     * @param {Object} movement - Movement configuration
     * @param {Object} shotConfig - Shot configuration
     * @param {Object} focusTarget - Focus target
     */
    async executeOrbitMovement(movement, shotConfig, focusTarget) {
        const center = new THREE.Vector3(focusTarget.x, focusTarget.y, focusTarget.z);
        
        this.animationState = {
            isAnimating: true,
            startTime: Date.now(),
            duration: movement.duration,
            startPosition: this.camera.position.clone(),
            endPosition: this.camera.position.clone(), // Will be calculated during animation
            startLookAt: center,
            endLookAt: center,
            startFov: this.camera.fov,
            endFov: this.camera.fov,
            easing: movement.easing,
            pattern: movement,
            orbitCenter: center,
            orbitRadius: movement.radius,
            startAngle: movement.startAngle,
            endAngle: movement.endAngle
        };
        
        this.startAnimationLoop();
        await this.waitForAnimation(movement.duration);
    }
    
    /**
     * Execute dolly movement
     * @param {Object} movement - Movement configuration
     * @param {Object} focusTarget - Focus target
     */
    async executeDollyMovement(movement, focusTarget) {
        const startPosition = new THREE.Vector3(movement.startPosition.x, movement.startPosition.y, movement.startPosition.z);
        const endPosition = new THREE.Vector3(movement.endPosition.x, movement.endPosition.y, movement.endPosition.z);
        
        this.animationState = {
            isAnimating: true,
            startTime: Date.now(),
            duration: movement.duration,
            startPosition: startPosition,
            endPosition: endPosition,
            startLookAt: new THREE.Vector3(focusTarget.x, focusTarget.y, focusTarget.z),
            endLookAt: new THREE.Vector3(focusTarget.x, focusTarget.y, focusTarget.z),
            startFov: this.camera.fov,
            endFov: this.camera.fov,
            easing: movement.easing,
            pattern: movement
        };
        
        this.startAnimationLoop();
        await this.waitForAnimation(movement.duration);
    }
    
    /**
     * Execute pan movement
     * @param {Object} movement - Movement configuration
     * @param {Object} shotConfig - Shot configuration
     */
    async executePanMovement(movement, shotConfig) {
        const startLookAt = new THREE.Vector3(movement.startLookAt.x, movement.startLookAt.y, movement.startLookAt.z);
        const endLookAt = new THREE.Vector3(movement.endLookAt.x, movement.endLookAt.y, movement.endLookAt.z);
        
        this.animationState = {
            isAnimating: true,
            startTime: Date.now(),
            duration: movement.duration,
            startPosition: this.camera.position.clone(),
            endPosition: this.camera.position.clone(),
            startLookAt: startLookAt,
            endLookAt: endLookAt,
            startFov: this.camera.fov,
            endFov: this.camera.fov,
            easing: movement.easing,
            pattern: movement
        };
        
        this.startAnimationLoop();
        await this.waitForAnimation(movement.duration);
    }
    
    /**
     * Execute static movement (with micro-movements)
     * @param {Object} movement - Movement configuration
     */
    async executeStaticMovement(movement) {
        if (movement.microMovements || movement.stabilization) {
            // Add subtle camera movements for realism
            this.animationState = {
                isAnimating: true,
                startTime: Date.now(),
                duration: movement.duration,
                startPosition: this.camera.position.clone(),
                endPosition: this.camera.position.clone(),
                startLookAt: new THREE.Vector3(),
                endLookAt: new THREE.Vector3(),
                startFov: this.camera.fov,
                endFov: this.camera.fov,
                easing: 'linear',
                pattern: movement,
                microMovements: true
            };
            
            this.startAnimationLoop();
        }
        
        await this.waitForAnimation(movement.duration);
    }
    
    /**
     * Start animation loop
     */
    startAnimationLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        const animate = () => {
            if (this.animationState.isAnimating) {
                this.updateCameraAnimation();
                this.animationFrameId = requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    /**
     * Update camera animation
     */
    updateCameraAnimation() {
        const elapsed = Date.now() - this.animationState.startTime;
        const progress = Math.min(elapsed / this.animationState.duration, 1);
        
        // Apply easing
        const easedProgress = this.applyEasing(progress, this.animationState.easing);
        
        // Handle different animation types
        if (this.animationState.pattern?.type === 'orbit') {
            this.updateOrbitAnimation(easedProgress);
        } else if (this.animationState.microMovements) {
            this.updateMicroMovements(elapsed);
        } else {
            this.updateStandardAnimation(easedProgress);
        }
        
        // Stop animation when complete
        if (progress >= 1) {
            this.animationState.isAnimating = false;
        }
    }
    
    /**
     * Update orbit animation
     * @param {number} progress - Animation progress (0-1)
     */
    updateOrbitAnimation(progress) {
        const angle = this.animationState.startAngle + 
                     (this.animationState.endAngle - this.animationState.startAngle) * progress;
        
        const x = this.animationState.orbitCenter.x + Math.cos(angle) * this.animationState.orbitRadius;
        const z = this.animationState.orbitCenter.z + Math.sin(angle) * this.animationState.orbitRadius;
        const y = this.animationState.orbitCenter.y + 2; // Slight elevation
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.animationState.orbitCenter);
    }
    
    /**
     * Update micro movements for static shots
     * @param {number} elapsed - Elapsed time
     */
    updateMicroMovements(elapsed) {
        const basePosition = this.animationState.startPosition;
        
        // Subtle breathing-like movement
        const breathingOffset = Math.sin(elapsed * 0.001) * 0.02;
        const stabilizationOffset = Math.cos(elapsed * 0.0015) * 0.01;
        
        this.camera.position.set(
            basePosition.x + breathingOffset,
            basePosition.y + stabilizationOffset,
            basePosition.z
        );
    }
    
    /**
     * Update standard animation (position, lookAt, fov)
     * @param {number} progress - Animation progress (0-1)
     */
    updateStandardAnimation(progress) {
        // Interpolate position
        this.camera.position.lerpVectors(
            this.animationState.startPosition,
            this.animationState.endPosition,
            progress
        );
        
        // Interpolate lookAt
        const currentLookAt = new THREE.Vector3().lerpVectors(
            this.animationState.startLookAt,
            this.animationState.endLookAt,
            progress
        );
        
        this.camera.lookAt(currentLookAt);
        
        // Interpolate FOV
        this.camera.fov = this.animationState.startFov + 
                         (this.animationState.endFov - this.animationState.startFov) * progress;
        this.camera.updateProjectionMatrix();
    }
    
    /**
     * Apply easing function
     * @param {number} progress - Linear progress (0-1)
     * @param {string} easingType - Easing function name
     * @returns {number} Eased progress
     */
    applyEasing(progress, easingType) {
        switch (easingType) {
            case 'easeInOutCubic':
                return progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                    
            case 'easeOutQuart':
                return 1 - Math.pow(1 - progress, 4);
                
            case 'easeOutBack':
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
                
            case 'easeInOutQuart':
                return progress < 0.5 
                    ? 8 * progress * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 4) / 2;
                    
            case 'easeInOutSine':
                return -(Math.cos(Math.PI * progress) - 1) / 2;
                
            default:
                return progress; // linear
        }
    }
    
    /**
     * Wait for animation completion
     * @param {number} duration - Animation duration
     */
    async waitForAnimation(duration) {
        return new Promise(resolve => {
            setTimeout(resolve, duration + 100); // Small buffer
        });
    }
    
    /**
     * Stop current animation
     */
    stopAnimation() {
        this.animationState.isAnimating = false;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    /**
     * Transition back to original camera state
     * @param {number} duration - Transition duration
     */
    async transitionToOriginalState(duration) {
        const currentPosition = this.camera.position.clone();
        const currentLookAt = new THREE.Vector3();
        this.camera.getWorldDirection(currentLookAt);
        currentLookAt.add(this.camera.position);
        
        this.animationState = {
            isAnimating: true,
            startTime: Date.now(),
            duration: duration,
            startPosition: currentPosition,
            endPosition: this.originalCameraState.position,
            startLookAt: currentLookAt,
            endLookAt: new THREE.Vector3(0, 0, -1).add(this.originalCameraState.position),
            startFov: this.camera.fov,
            endFov: this.originalCameraState.fov,
            easing: 'easeInOutCubic',
            pattern: null
        };
        
        this.startAnimationLoop();
        await this.waitForAnimation(duration);
        
        // Restore original rotation
        this.camera.rotation.copy(this.originalCameraState.rotation);
        this.camera.zoom = this.originalCameraState.zoom;
        this.camera.updateProjectionMatrix();
    }
    
    /**
     * Get available camera shots
     * @returns {Array} Array of shot names
     */
    getAvailableShots() {
        return Object.keys(this.cameraShots);
    }
    
    /**
     * Get shots by character
     * @param {string} character - Character name
     * @returns {Array} Array of shots for character
     */
    getShotsByCharacter(character) {
        return Object.entries(this.cameraShots)
            .filter(([_, shot]) => shot.character === character)
            .map(([name, _]) => name);
    }
    
    /**
     * Get available movement patterns
     * @returns {Array} Array of movement pattern names
     */
    getAvailableMovements() {
        return Object.keys(this.movementPatterns);
    }
    
    /**
     * Check if camera system is active
     * @returns {boolean} Whether system is active
     */
    isCinematicActive() {
        return this.isActive;
    }
    
    /**
     * Get current shot information
     * @returns {Object|null} Current shot or null
     */
    getCurrentShot() {
        return this.currentShot;
    }
    
    /**
     * Add custom camera shot
     * @param {string} shotName - Shot name
     * @param {Object} shotConfig - Shot configuration
     */
    addCameraShot(shotName, shotConfig) {
        this.cameraShots[shotName] = shotConfig;
        console.log(`Added camera shot: ${shotName}`);
    }
    
    /**
     * Add custom movement pattern
     * @param {string} patternName - Pattern name
     * @param {Object} pattern - Pattern configuration
     */
    addMovementPattern(patternName, pattern) {
        this.movementPatterns[patternName] = pattern;
        console.log(`Added movement pattern: ${patternName}`);
    }
    
    /**
     * Cleanup camera system
     */
    cleanup() {
        this.stopAnimation();
        
        if (this.isActive) {
            this.endCinematicSequence(500);
        }
        
        console.log('Cinematic Camera System cleaned up');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CinematicCameraSystem;
} else if (typeof window !== 'undefined') {
    window.CinematicCameraSystem = CinematicCameraSystem;
}

console.log('Cinematic Camera System loaded');