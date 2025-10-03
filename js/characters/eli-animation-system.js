/**
 * Eli's Animation System
 * Victory gestures and celebration poses for tournament wins
 */

class EliAnimationSystem {
    constructor(character3DRenderer) {
        this.renderer = character3DRenderer;
        this.characterId = 'eli';
        this.currentAnimation = null;
        this.animationQueue = [];
        this.isPlaying = false;
        
        // Animation mixer for Three.js
        this.mixer = null;
        this.clock = new THREE.Clock();
        
        // Victory gesture configurations
        this.victoryAnimations = {
            tournament_win: {
                name: 'Tournament Victory',
                sequence: [
                    { action: 'pause_neutral', duration: 500 },
                    { action: 'arms_raise_slow', duration: 1000 },
                    { action: 'victory_pose_hold', duration: 2000 },
                    { action: 'fist_pump_double', duration: 800 },
                    { action: 'confident_stance', duration: 1200 }
                ],
                totalDuration: 5500,
                effects: ['victory_particles', 'screen_flash'],
                audio: 'tournament_cheer'
            },
            
            championship_celebration: {
                name: 'Championship Celebration',
                sequence: [
                    { action: 'controller_raise', duration: 800 },
                    { action: 'look_at_controller', duration: 600 },
                    { action: 'controller_kiss', duration: 400 },
                    { action: 'arms_spread_wide', duration: 1200 },
                    { action: 'spin_celebration', duration: 1500 },
                    { action: 'point_to_crowd', duration: 1000 },
                    { action: 'champion_bow', duration: 1000 }
                ],
                totalDuration: 6500,
                effects: ['championship_confetti', 'crowd_simulation', 'victory_fireworks'],
                audio: 'championship_fanfare'
            },
            
            skill_showcase: {
                name: 'Skill Showcase',
                sequence: [
                    { action: 'controller_juggle', duration: 1500 },
                    { action: 'behind_back_catch', duration: 800 },
                    { action: 'confident_smirk', duration: 600 },
                    { action: 'finger_guns', duration: 1000 },
                    { action: 'cool_lean', duration: 1100 }
                ],
                totalDuration: 5000,
                effects: ['skill_aura', 'controller_trail'],
                audio: 'crowd_impressed'
            }
        };
        
        // Individual animation actions
        this.animationActions = {
            // Neutral and transition poses
            pause_neutral: {
                keyframes: [
                    { time: 0, pose: { arms: 'relaxed', head: 'forward', expression: 'focused' } },
                    { time: 1, pose: { arms: 'relaxed', head: 'forward', expression: 'focused' } }
                ],
                easing: 'linear'
            },
            
            // Victory sequence actions
            arms_raise_slow: {
                keyframes: [
                    { time: 0, pose: { arms: 'relaxed', head: 'forward', expression: 'focused' } },
                    { time: 0.3, pose: { arms: 'lifting', head: 'slight_up', expression: 'realizing' } },
                    { time: 0.7, pose: { arms: 'half_raised', head: 'up', expression: 'excited' } },
                    { time: 1, pose: { arms: 'fully_raised', head: 'up', expression: 'triumphant' } }
                ],
                easing: 'easeOutCubic'
            },
            
            victory_pose_hold: {
                keyframes: [
                    { time: 0, pose: { arms: 'fully_raised', head: 'up', expression: 'triumphant' } },
                    { time: 0.2, pose: { arms: 'victory_v', head: 'up', expression: 'big_smile' } },
                    { time: 0.8, pose: { arms: 'victory_v', head: 'up', expression: 'big_smile' } },
                    { time: 1, pose: { arms: 'victory_v', head: 'forward', expression: 'confident' } }
                ],
                easing: 'easeInOutSine'
            },
            
            fist_pump_double: {
                keyframes: [
                    { time: 0, pose: { arms: 'victory_v', head: 'forward', expression: 'confident' } },
                    { time: 0.2, pose: { arms: 'fists_down', head: 'forward', expression: 'determined' } },
                    { time: 0.4, pose: { arms: 'fists_up', head: 'slight_up', expression: 'excited' } },
                    { time: 0.6, pose: { arms: 'fists_down', head: 'forward', expression: 'determined' } },
                    { time: 0.8, pose: { arms: 'fists_up', head: 'slight_up', expression: 'excited' } },
                    { time: 1, pose: { arms: 'confident_crossed', head: 'forward', expression: 'satisfied' } }
                ],
                easing: 'easeInOutBounce'
            },
            
            confident_stance: {
                keyframes: [
                    { time: 0, pose: { arms: 'confident_crossed', head: 'forward', expression: 'satisfied' } },
                    { time: 0.3, pose: { arms: 'hands_on_hips', head: 'slight_up', expression: 'proud' } },
                    { time: 1, pose: { arms: 'hands_on_hips', head: 'forward', expression: 'confident' } }
                ],
                easing: 'easeOutQuart'
            },
            
            // Championship celebration actions
            controller_raise: {
                keyframes: [
                    { time: 0, pose: { arms: 'holding_controller', head: 'forward', expression: 'focused' } },
                    { time: 0.5, pose: { arms: 'controller_lifting', head: 'following_controller', expression: 'amazed' } },
                    { time: 1, pose: { arms: 'controller_raised_high', head: 'up_at_controller', expression: 'reverent' } }
                ],
                easing: 'easeOutCubic'
            },
            
            look_at_controller: {
                keyframes: [
                    { time: 0, pose: { arms: 'controller_raised_high', head: 'up_at_controller', expression: 'reverent' } },
                    { time: 1, pose: { arms: 'controller_eye_level', head: 'focused_on_controller', expression: 'grateful' } }
                ],
                easing: 'easeInOutSine'
            },
            
            controller_kiss: {
                keyframes: [
                    { time: 0, pose: { arms: 'controller_eye_level', head: 'focused_on_controller', expression: 'grateful' } },
                    { time: 0.5, pose: { arms: 'controller_to_lips', head: 'kissing_controller', expression: 'affectionate' } },
                    { time: 1, pose: { arms: 'controller_away_from_lips', head: 'satisfied_look', expression: 'happy' } }
                ],
                easing: 'easeInOutQuad'
            },
            
            arms_spread_wide: {
                keyframes: [
                    { time: 0, pose: { arms: 'controller_away_from_lips', head: 'satisfied_look', expression: 'happy' } },
                    { time: 0.6, pose: { arms: 'spreading_wide', head: 'up', expression: 'ecstatic' } },
                    { time: 1, pose: { arms: 'fully_spread', head: 'up', expression: 'champion' } }
                ],
                easing: 'easeOutBack'
            },
            
            spin_celebration: {
                keyframes: [
                    { time: 0, pose: { arms: 'fully_spread', head: 'up', expression: 'champion', rotation: 0 } },
                    { time: 0.25, pose: { arms: 'fully_spread', head: 'up', expression: 'joyful', rotation: 90 } },
                    { time: 0.5, pose: { arms: 'fully_spread', head: 'up', expression: 'ecstatic', rotation: 180 } },
                    { time: 0.75, pose: { arms: 'fully_spread', head: 'up', expression: 'champion', rotation: 270 } },
                    { time: 1, pose: { arms: 'fully_spread', head: 'forward', expression: 'confident', rotation: 360 } }
                ],
                easing: 'easeInOutCubic'
            },
            
            point_to_crowd: {
                keyframes: [
                    { time: 0, pose: { arms: 'fully_spread', head: 'forward', expression: 'confident' } },
                    { time: 0.3, pose: { arms: 'right_pointing', head: 'right', expression: 'acknowledging' } },
                    { time: 0.7, pose: { arms: 'left_pointing', head: 'left', expression: 'acknowledging' } },
                    { time: 1, pose: { arms: 'both_pointing_forward', head: 'forward', expression: 'inclusive' } }
                ],
                easing: 'easeInOutSine'
            },
            
            champion_bow: {
                keyframes: [
                    { time: 0, pose: { arms: 'both_pointing_forward', head: 'forward', expression: 'inclusive' } },
                    { time: 0.4, pose: { arms: 'respectful_sides', head: 'bowing', expression: 'humble' } },
                    { time: 0.8, pose: { arms: 'respectful_sides', head: 'bowing', expression: 'grateful' } },
                    { time: 1, pose: { arms: 'relaxed', head: 'forward', expression: 'satisfied' } }
                ],
                easing: 'easeInOutQuad'
            },
            
            // Skill showcase actions
            controller_juggle: {
                keyframes: [
                    { time: 0, pose: { arms: 'holding_controller', head: 'forward', expression: 'focused' } },
                    { time: 0.2, pose: { arms: 'toss_up', head: 'following_up', expression: 'playful' } },
                    { time: 0.4, pose: { arms: 'catch_right', head: 'following_right', expression: 'skilled' } },
                    { time: 0.6, pose: { arms: 'toss_up_again', head: 'following_up', expression: 'confident' } },
                    { time: 0.8, pose: { arms: 'catch_left', head: 'following_left', expression: 'showing_off' } },
                    { time: 1, pose: { arms: 'final_toss', head: 'following_up', expression: 'anticipation' } }
                ],
                easing: 'easeInOutBounce'
            },
            
            behind_back_catch: {
                keyframes: [
                    { time: 0, pose: { arms: 'final_toss', head: 'following_up', expression: 'anticipation' } },
                    { time: 0.3, pose: { arms: 'reaching_behind', head: 'confident_forward', expression: 'focused' } },
                    { time: 0.7, pose: { arms: 'behind_back_position', head: 'slight_turn', expression: 'concentration' } },
                    { time: 1, pose: { arms: 'successful_catch', head: 'forward', expression: 'impressed_with_self' } }
                ],
                easing: 'easeOutBack'
            },
            
            confident_smirk: {
                keyframes: [
                    { time: 0, pose: { arms: 'successful_catch', head: 'forward', expression: 'impressed_with_self' } },
                    { time: 0.5, pose: { arms: 'controller_casual_hold', head: 'slight_tilt', expression: 'smug_smile' } },
                    { time: 1, pose: { arms: 'controller_casual_hold', head: 'confident_tilt', expression: 'cool_smirk' } }
                ],
                easing: 'easeInOutSine'
            },
            
            finger_guns: {
                keyframes: [
                    { time: 0, pose: { arms: 'controller_casual_hold', head: 'confident_tilt', expression: 'cool_smirk' } },
                    { time: 0.3, pose: { arms: 'finger_guns_ready', head: 'forward', expression: 'playful' } },
                    { time: 0.6, pose: { arms: 'finger_guns_fire', head: 'wink', expression: 'cheeky' } },
                    { time: 1, pose: { arms: 'finger_guns_holster', head: 'satisfied', expression: 'cool' } }
                ],
                easing: 'easeOutQuart'
            },
            
            cool_lean: {
                keyframes: [
                    { time: 0, pose: { arms: 'finger_guns_holster', head: 'satisfied', expression: 'cool' } },
                    { time: 0.5, pose: { arms: 'casual_lean_prep', head: 'relaxed', expression: 'chill' } },
                    { time: 1, pose: { arms: 'leaning_cool', head: 'casual_confident', expression: 'satisfied' } }
                ],
                easing: 'easeOutCubic'
            }
        };
        
        // Particle and effect configurations for animations
        this.effectConfigurations = {
            victory_particles: {
                type: 'burst',
                count: 100,
                colors: ['#00FFFF', '#FF0080', '#FFD700'],
                duration: 2000,
                spread: 45,
                velocity: 5
            },
            
            championship_confetti: {
                type: 'confetti',
                count: 200,
                colors: ['#FFD700', '#FF6B35', '#00FFFF', '#FF0080'],
                duration: 4000,
                gravity: -0.1,
                spread: 90
            },
            
            skill_aura: {
                type: 'aura',
                color: '#00FFFF',
                intensity: 0.8,
                duration: 3000,
                pulsing: true
            },
            
            controller_trail: {
                type: 'trail',
                color: '#7928CA',
                width: 0.1,
                duration: 1500,
                fadeOut: true
            }
        };
    }
    
    /**
     * Initialize animation system with character model
     */
    async initialize(characterModel) {
        if (!characterModel) {
            throw new Error('Character model required for animation system');
        }
        
        // Create Three.js animation mixer
        this.mixer = new THREE.AnimationMixer(characterModel);
        
        // Load animation clips (in production, would load from actual files)
        await this.loadAnimationClips();
        
        console.log('Eli Animation System initialized');
    }
    
    /**
     * Play a victory animation sequence
     */
    async playVictoryAnimation(animationType = 'tournament_win') {
        if (this.isPlaying) {
            console.warn('Animation already playing, queuing new animation');
            this.animationQueue.push(animationType);
            return;
        }
        
        const animation = this.victoryAnimations[animationType];
        if (!animation) {
            console.error(`Unknown animation type: ${animationType}`);
            return;
        }
        
        console.log(`Playing victory animation: ${animation.name}`);
        this.isPlaying = true;
        this.currentAnimation = animation;
        
        try {
            // Start particle effects
            this.startEffects(animation.effects);
            
            // Play audio if available
            if (animation.audio) {
                this.playAudio(animation.audio);
            }
            
            // Execute animation sequence
            await this.executeAnimationSequence(animation.sequence);
            
            console.log(`Victory animation completed: ${animation.name}`);
            
        } catch (error) {
            console.error('Animation playback failed:', error);
        } finally {
            this.isPlaying = false;
            this.currentAnimation = null;
            
            // Process queued animations
            if (this.animationQueue.length > 0) {
                const nextAnimation = this.animationQueue.shift();
                setTimeout(() => this.playVictoryAnimation(nextAnimation), 500);
            }
        }
    }
    
    /**
     * Execute a sequence of animation actions
     */
    async executeAnimationSequence(sequence) {
        for (const step of sequence) {
            await this.playAnimationAction(step.action, step.duration);
        }
    }
    
    /**
     * Play a single animation action
     */
    async playAnimationAction(actionName, duration) {
        const action = this.animationActions[actionName];
        if (!action) {
            console.warn(`Unknown animation action: ${actionName}`);
            return;
        }
        
        return new Promise((resolve) => {
            // In production, would use actual Three.js animation system
            console.log(`Playing action: ${actionName} for ${duration}ms`);
            
            // Simulate animation keyframe interpolation
            this.interpolateKeyframes(action.keyframes, duration, action.easing);
            
            setTimeout(resolve, duration);
        });
    }
    
    /**
     * Interpolate between animation keyframes
     */
    interpolateKeyframes(keyframes, duration, easing = 'linear') {
        // In production, would use actual Three.js bone manipulation
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing function
            const easedProgress = this.applyEasing(progress, easing);
            
            // Find current keyframe segment
            const currentFrame = this.getCurrentKeyframe(keyframes, easedProgress);
            
            // Apply pose to character (mock implementation)
            this.applyPoseToCharacter(currentFrame.pose);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    /**
     * Get current keyframe based on animation progress
     */
    getCurrentKeyframe(keyframes, progress) {
        for (let i = 0; i < keyframes.length - 1; i++) {
            const current = keyframes[i];
            const next = keyframes[i + 1];
            
            if (progress >= current.time && progress <= next.time) {
                const segmentProgress = (progress - current.time) / (next.time - current.time);
                return this.interpolatePoses(current, next, segmentProgress);
            }
        }
        
        return keyframes[keyframes.length - 1];
    }
    
    /**
     * Interpolate between two poses
     */
    interpolatePoses(pose1, pose2, progress) {
        // Mock pose interpolation
        return {
            pose: {
                ...pose1.pose,
                // In production, would interpolate all bone rotations and positions
                interpolationProgress: progress
            }
        };
    }
    
    /**
     * Apply pose to character model
     */
    applyPoseToCharacter(pose) {
        // Mock pose application - in production would manipulate Three.js bones
        if (this.renderer && this.renderer.character) {
            // Update character pose
            console.log('Applying pose:', pose);
        }
    }
    
    /**
     * Apply easing function to animation progress
     */
    applyEasing(progress, easingType) {
        switch (easingType) {
            case 'easeOutCubic':
                return 1 - Math.pow(1 - progress, 3);
            case 'easeInOutSine':
                return -(Math.cos(Math.PI * progress) - 1) / 2;
            case 'easeInOutBounce':
                return progress < 0.5
                    ? (1 - this.bounceOut(1 - 2 * progress)) / 2
                    : (1 + this.bounceOut(2 * progress - 1)) / 2;
            case 'easeOutBack':
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
            case 'easeOutQuart':
                return 1 - Math.pow(1 - progress, 4);
            default:
                return progress; // linear
        }
    }
    
    /**
     * Bounce easing helper
     */
    bounceOut(x) {
        const n1 = 7.5625;
        const d1 = 2.75;
        
        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    }
    
    /**
     * Start particle effects for animation
     */
    startEffects(effectNames) {
        if (!effectNames || !Array.isArray(effectNames)) return;
        
        effectNames.forEach(effectName => {
            const effectConfig = this.effectConfigurations[effectName];
            if (effectConfig) {
                console.log(`Starting effect: ${effectName}`);
                // In production, would create actual particle systems
                this.createParticleEffect(effectConfig);
            }
        });
    }
    
    /**
     * Create particle effect (mock implementation)
     */
    createParticleEffect(config) {
        // Mock particle system - in production would use Three.js particles
        console.log('Creating particle effect:', config);
    }
    
    /**
     * Play audio for animation
     */
    playAudio(audioName) {
        // Mock audio playback
        console.log(`Playing audio: ${audioName}`);
    }
    
    /**
     * Load animation clips (mock implementation)
     */
    async loadAnimationClips() {
        // In production, would load actual animation files
        console.log('Loading Eli animation clips...');
    }
    
    /**
     * Update animation system (call in render loop)
     */
    update() {
        if (this.mixer) {
            const delta = this.clock.getDelta();
            this.mixer.update(delta);
        }
    }
    
    /**
     * Stop current animation
     */
    stopAnimation() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.currentAnimation = null;
            console.log('Animation stopped');
        }
    }
    
    /**
     * Get available victory animations
     */
    getAvailableAnimations() {
        return Object.keys(this.victoryAnimations);
    }
    
    /**
     * Check if animation is currently playing
     */
    isAnimationPlaying() {
        return this.isPlaying;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EliAnimationSystem;
} else if (typeof window !== 'undefined') {
    window.EliAnimationSystem = EliAnimationSystem;
}