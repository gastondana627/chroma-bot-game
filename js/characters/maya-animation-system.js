/**
 * Maya's Animation System
 * Pointing gestures and concerned expressions for investigation moments
 */

class MayaAnimationSystem {
    constructor(character3DRenderer) {
        this.renderer = character3DRenderer;
        this.characterId = 'maya';
        this.currentAnimation = null;
        this.animationQueue = [];
        this.isPlaying = false;
        
        // Animation mixer for Three.js
        this.mixer = null;
        this.clock = new THREE.Clock();
        
        // Investigation gesture configurations
        this.investigationAnimations = {
            evidence_discovery: {
                name: 'Evidence Discovery',
                sequence: [
                    { action: 'investigation_idle', duration: 800 },
                    { action: 'realization_moment', duration: 1200 },
                    { action: 'pointing_gesture_build', duration: 1500 },
                    { action: 'confident_pointing_hold', duration: 2000 },
                    { action: 'satisfied_conclusion', duration: 1000 }
                ],
                totalDuration: 6500,
                effects: ['evidence_highlight', 'revelation_glow'],
                audio: 'discovery_chime'
            },
            
            breakthrough_concern: {
                name: 'Breakthrough Concern',
                sequence: [
                    { action: 'thoughtful_analysis', duration: 1000 },
                    { action: 'growing_concern', duration: 1500 },
                    { action: 'protective_stance_build', duration: 1200 },
                    { action: 'warning_gesture', duration: 1800 },
                    { action: 'determined_resolve', duration: 1500 }
                ],
                totalDuration: 7000,
                effects: ['warning_aura', 'protective_glow'],
                audio: 'concern_theme'
            },
            
            investigation_analysis: {
                name: 'Deep Investigation',
                sequence: [
                    { action: 'data_examination', duration: 1500 },
                    { action: 'pattern_recognition', duration: 2000 },
                    { action: 'connection_realization', duration: 1800 },
                    { action: 'conclusion_formation', duration: 1700 }
                ],
                totalDuration: 7000,
                effects: ['data_streams', 'connection_lines'],
                audio: 'investigation_processing'
            },
            
            cyber_discovery: {
                name: 'Cyber Cafe Discovery',
                sequence: [
                    { action: 'cautious_approach', duration: 1000 },
                    { action: 'digital_investigation', duration: 2500 },
                    { action: 'shocking_revelation', duration: 1500 },
                    { action: 'processing_implications', duration: 2000 }
                ],
                totalDuration: 7000,
                effects: ['screen_glow', 'data_revelation'],
                audio: 'digital_discovery'
            },
            
            final_confrontation: {
                name: 'Final Confrontation',
                sequence: [
                    { action: 'steely_determination', duration: 1200 },
                    { action: 'evidence_presentation', duration: 2000 },
                    { action: 'unwavering_stance', duration: 1800 },
                    { action: 'justice_declaration', duration: 2000 },
                    { action: 'victorious_resolution', duration: 1500 }
                ],
                totalDuration: 8500,
                effects: ['justice_aura', 'truth_revelation'],
                audio: 'confrontation_resolution'
            }
        };
        
        // Individual animation actions for investigation theme
        this.animationActions = {
            // Base investigation poses
            investigation_idle: {
                keyframes: [
                    { time: 0, pose: { arms: 'thoughtful_crossed', head: 'analytical_tilt', expression: 'focused_investigation' } },
                    { time: 1, pose: { arms: 'thoughtful_crossed', head: 'analytical_tilt', expression: 'focused_investigation' } }
                ],
                easing: 'linear'
            },
            
            thoughtful_analysis: {
                keyframes: [
                    { time: 0, pose: { arms: 'thoughtful_crossed', head: 'analytical_tilt', expression: 'focused_investigation' } },
                    { time: 0.4, pose: { arms: 'hand_to_chin', head: 'contemplative', expression: 'deep_thought' } },
                    { time: 1, pose: { arms: 'both_hands_thinking', head: 'focused_down', expression: 'analyzing' } }
                ],
                easing: 'easeInOutSine'
            },
            
            // Evidence discovery sequence
            realization_moment: {
                keyframes: [
                    { time: 0, pose: { arms: 'both_hands_thinking', head: 'focused_down', expression: 'analyzing' } },
                    { time: 0.3, pose: { arms: 'slight_lift', head: 'beginning_to_look_up', expression: 'something_clicking' } },
                    { time: 0.6, pose: { arms: 'opening_up', head: 'eyes_widening', expression: 'realization_dawning' } },
                    { time: 1, pose: { arms: 'ready_to_point', head: 'alert_focused', expression: 'breakthrough_excitement' } }
                ],
                easing: 'easeOutCubic'
            },
            
            pointing_gesture_build: {
                keyframes: [
                    { time: 0, pose: { arms: 'ready_to_point', head: 'alert_focused', expression: 'breakthrough_excitement' } },
                    { time: 0.4, pose: { arms: 'arm_raising', head: 'following_gesture', expression: 'building_confidence' } },
                    { time: 0.8, pose: { arms: 'pointing_direction', head: 'locked_on_target', expression: 'certain_discovery' } },
                    { time: 1, pose: { arms: 'confident_point', head: 'assertive_forward', expression: 'determined_revelation' } }
                ],
                easing: 'easeOutBack'
            },
            
            confident_pointing_hold: {
                keyframes: [
                    { time: 0, pose: { arms: 'confident_point', head: 'assertive_forward', expression: 'determined_revelation' } },
                    { time: 0.3, pose: { arms: 'emphatic_point', head: 'intense_focus', expression: 'unwavering_certainty' } },
                    { time: 0.7, pose: { arms: 'sustained_point', head: 'steady_gaze', expression: 'investigative_satisfaction' } },
                    { time: 1, pose: { arms: 'concluding_point', head: 'satisfied_nod', expression: 'case_closed' } }
                ],
                easing: 'easeInOutQuad'
            },
            
            satisfied_conclusion: {
                keyframes: [
                    { time: 0, pose: { arms: 'concluding_point', head: 'satisfied_nod', expression: 'case_closed' } },
                    { time: 0.5, pose: { arms: 'lowering_arm', head: 'confident_stance', expression: 'job_well_done' } },
                    { time: 1, pose: { arms: 'professional_rest', head: 'composed_forward', expression: 'investigative_pride' } }
                ],
                easing: 'easeInOutSine'
            },
            
            // Concern and warning sequence
            growing_concern: {
                keyframes: [
                    { time: 0, pose: { arms: 'both_hands_thinking', head: 'focused_down', expression: 'analyzing' } },
                    { time: 0.3, pose: { arms: 'tension_building', head: 'slight_worry', expression: 'concern_growing' } },
                    { time: 0.7, pose: { arms: 'protective_instinct', head: 'alert_caution', expression: 'serious_concern' } },
                    { time: 1, pose: { arms: 'defensive_ready', head: 'watchful_guard', expression: 'protective_mode' } }
                ],
                easing: 'easeInOutCubic'
            },
            
            protective_stance_build: {
                keyframes: [
                    { time: 0, pose: { arms: 'defensive_ready', head: 'watchful_guard', expression: 'protective_mode' } },
                    { time: 0.4, pose: { arms: 'building_barrier', head: 'scanning_threats', expression: 'guardian_alert' } },
                    { time: 1, pose: { arms: 'protective_position', head: 'steady_vigilance', expression: 'determined_protection' } }
                ],
                easing: 'easeOutQuart'
            },
            
            warning_gesture: {
                keyframes: [
                    { time: 0, pose: { arms: 'protective_position', head: 'steady_vigilance', expression: 'determined_protection' } },
                    { time: 0.3, pose: { arms: 'warning_raise', head: 'authoritative_angle', expression: 'serious_warning' } },
                    { time: 0.6, pose: { arms: 'stop_gesture', head: 'firm_command', expression: 'no_nonsense' } },
                    { time: 1, pose: { arms: 'emphatic_warning', head: 'unwavering_authority', expression: 'final_warning' } }
                ],
                easing: 'easeInOutBounce'
            },
            
            determined_resolve: {
                keyframes: [
                    { time: 0, pose: { arms: 'emphatic_warning', head: 'unwavering_authority', expression: 'final_warning' } },
                    { time: 0.4, pose: { arms: 'resolute_stance', head: 'determined_forward', expression: 'unshakeable_resolve' } },
                    { time: 1, pose: { arms: 'confident_ready', head: 'prepared_action', expression: 'ready_for_anything' } }
                ],
                easing: 'easeOutCubic'
            },
            
            // Investigation analysis sequence
            data_examination: {
                keyframes: [
                    { time: 0, pose: { arms: 'examining_posture', head: 'focused_scrutiny', expression: 'intense_analysis' } },
                    { time: 0.5, pose: { arms: 'detailed_inspection', head: 'microscopic_focus', expression: 'finding_clues' } },
                    { time: 1, pose: { arms: 'cross_referencing', head: 'comparing_data', expression: 'connecting_dots' } }
                ],
                easing: 'easeInOutSine'
            },
            
            pattern_recognition: {
                keyframes: [
                    { time: 0, pose: { arms: 'cross_referencing', head: 'comparing_data', expression: 'connecting_dots' } },
                    { time: 0.3, pose: { arms: 'pattern_tracing', head: 'following_connections', expression: 'seeing_patterns' } },
                    { time: 0.7, pose: { arms: 'mapping_relationships', head: 'understanding_structure', expression: 'comprehension_building' } },
                    { time: 1, pose: { arms: 'pattern_complete', head: 'full_understanding', expression: 'pattern_recognized' } }
                ],
                easing: 'easeOutBack'
            },
            
            connection_realization: {
                keyframes: [
                    { time: 0, pose: { arms: 'pattern_complete', head: 'full_understanding', expression: 'pattern_recognized' } },
                    { time: 0.4, pose: { arms: 'eureka_moment', head: 'sudden_clarity', expression: 'major_breakthrough' } },
                    { time: 1, pose: { arms: 'connection_made', head: 'pieces_fitting', expression: 'everything_clear' } }
                ],
                easing: 'easeOutElastic'
            },
            
            conclusion_formation: {
                keyframes: [
                    { time: 0, pose: { arms: 'connection_made', head: 'pieces_fitting', expression: 'everything_clear' } },
                    { time: 0.5, pose: { arms: 'synthesizing_data', head: 'forming_conclusion', expression: 'final_analysis' } },
                    { time: 1, pose: { arms: 'case_solved', head: 'confident_conclusion', expression: 'investigation_complete' } }
                ],
                easing: 'easeInOutQuad'
            },
            
            // Cyber discovery sequence
            cautious_approach: {
                keyframes: [
                    { time: 0, pose: { arms: 'careful_positioning', head: 'wary_observation', expression: 'cautious_curiosity' } },
                    { time: 1, pose: { arms: 'ready_for_discovery', head: 'focused_preparation', expression: 'investigative_readiness' } }
                ],
                easing: 'easeInOutSine'
            },
            
            digital_investigation: {
                keyframes: [
                    { time: 0, pose: { arms: 'ready_for_discovery', head: 'focused_preparation', expression: 'investigative_readiness' } },
                    { time: 0.3, pose: { arms: 'interface_interaction', head: 'screen_focused', expression: 'digital_searching' } },
                    { time: 0.6, pose: { arms: 'data_navigation', head: 'following_trails', expression: 'cyber_tracking' } },
                    { time: 1, pose: { arms: 'information_absorption', head: 'processing_data', expression: 'digital_comprehension' } }
                ],
                easing: 'easeInOutCubic'
            },
            
            shocking_revelation: {
                keyframes: [
                    { time: 0, pose: { arms: 'information_absorption', head: 'processing_data', expression: 'digital_comprehension' } },
                    { time: 0.4, pose: { arms: 'recoil_shock', head: 'disbelief', expression: 'shocking_discovery' } },
                    { time: 1, pose: { arms: 'processing_shock', head: 'grappling_reality', expression: 'overwhelmed_realization' } }
                ],
                easing: 'easeOutBounce'
            },
            
            processing_implications: {
                keyframes: [
                    { time: 0, pose: { arms: 'processing_shock', head: 'grappling_reality', expression: 'overwhelmed_realization' } },
                    { time: 0.5, pose: { arms: 'calculating_response', head: 'strategic_thinking', expression: 'planning_action' } },
                    { time: 1, pose: { arms: 'determined_next_steps', head: 'resolved_forward', expression: 'ready_to_act' } }
                ],
                easing: 'easeInOutQuart'
            },
            
            // Final confrontation sequence
            steely_determination: {
                keyframes: [
                    { time: 0, pose: { arms: 'preparation_stance', head: 'focused_resolve', expression: 'steely_determination' } },
                    { time: 1, pose: { arms: 'battle_ready', head: 'unwavering_gaze', expression: 'unshakeable_resolve' } }
                ],
                easing: 'easeOutCubic'
            },
            
            evidence_presentation: {
                keyframes: [
                    { time: 0, pose: { arms: 'battle_ready', head: 'unwavering_gaze', expression: 'unshakeable_resolve' } },
                    { time: 0.3, pose: { arms: 'presenting_case', head: 'authoritative_delivery', expression: 'confident_accusation' } },
                    { time: 0.7, pose: { arms: 'evidence_display', head: 'compelling_presentation', expression: 'undeniable_proof' } },
                    { time: 1, pose: { arms: 'case_concluded', head: 'satisfied_delivery', expression: 'evidence_presented' } }
                ],
                easing: 'easeInOutSine'
            },
            
            unwavering_stance: {
                keyframes: [
                    { time: 0, pose: { arms: 'case_concluded', head: 'satisfied_delivery', expression: 'evidence_presented' } },
                    { time: 0.5, pose: { arms: 'immovable_position', head: 'steady_conviction', expression: 'unwavering_certainty' } },
                    { time: 1, pose: { arms: 'fortress_stance', head: 'unbreakable_will', expression: 'absolute_conviction' } }
                ],
                easing: 'easeInOutQuad'
            },
            
            justice_declaration: {
                keyframes: [
                    { time: 0, pose: { arms: 'fortress_stance', head: 'unbreakable_will', expression: 'absolute_conviction' } },
                    { time: 0.4, pose: { arms: 'justice_gesture', head: 'righteous_authority', expression: 'moral_certainty' } },
                    { time: 1, pose: { arms: 'final_judgment', head: 'divine_justice', expression: 'righteous_triumph' } }
                ],
                easing: 'easeOutBack'
            },
            
            victorious_resolution: {
                keyframes: [
                    { time: 0, pose: { arms: 'final_judgment', head: 'divine_justice', expression: 'righteous_triumph' } },
                    { time: 0.5, pose: { arms: 'victory_stance', head: 'satisfied_justice', expression: 'mission_accomplished' } },
                    { time: 1, pose: { arms: 'peaceful_resolution', head: 'serene_satisfaction', expression: 'justice_served' } }
                ],
                easing: 'easeInOutSine'
            }
        };
        
        // Particle and effect configurations for investigation animations
        this.effectConfigurations = {
            evidence_highlight: {
                type: 'spotlight',
                color: '#FFD700',
                intensity: 2.0,
                duration: 3000,
                focusPoint: 'gesture_target',
                pulsing: true
            },
            
            revelation_glow: {
                type: 'aura',
                color: '#4A90E2',
                intensity: 1.2,
                duration: 4000,
                expansion: true,
                fadeOut: true
            },
            
            warning_aura: {
                type: 'protective_field',
                color: '#FF6B35',
                intensity: 1.0,
                duration: 3500,
                pulsing: true,
                barrier: true
            },
            
            protective_glow: {
                type: 'shield',
                color: '#00CCFF',
                intensity: 0.8,
                duration: 4000,
                defensive: true
            },
            
            data_streams: {
                type: 'flowing_data',
                colors: ['#0066CC', '#4A90E2', '#FFFFFF'],
                count: 50,
                duration: 5000,
                flow: 'upward'
            },
            
            connection_lines: {
                type: 'network_visualization',
                color: '#FFD700',
                nodes: 8,
                duration: 3000,
                animated: true
            },
            
            justice_aura: {
                type: 'righteous_energy',
                color: '#FFFFFF',
                intensity: 1.5,
                duration: 6000,
                divine: true
            },
            
            truth_revelation: {
                type: 'light_burst',
                color: '#FFD700',
                intensity: 2.5,
                duration: 2000,
                explosive: true
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
        await this.loadInvestigationAnimationClips();
        
        console.log('Maya Investigation Animation System initialized');
    }
    
    /**
     * Play an investigation animation sequence
     */
    async playInvestigationAnimation(animationType = 'evidence_discovery') {
        if (this.isPlaying) {
            console.warn('Animation already playing, queuing new animation');
            this.animationQueue.push(animationType);
            return;
        }
        
        const animation = this.investigationAnimations[animationType];
        if (!animation) {
            console.error(`Unknown animation type: ${animationType}`);
            return;
        }
        
        console.log(`Playing investigation animation: ${animation.name}`);
        this.isPlaying = true;
        this.currentAnimation = animation;
        
        try {
            // Start investigation effects
            this.startInvestigationEffects(animation.effects);
            
            // Play audio if available
            if (animation.audio) {
                this.playAudio(animation.audio);
            }
            
            // Execute animation sequence
            await this.executeAnimationSequence(animation.sequence);
            
            console.log(`Investigation animation completed: ${animation.name}`);
            
        } catch (error) {
            console.error('Animation playback failed:', error);
        } finally {
            this.isPlaying = false;
            this.currentAnimation = null;
            
            // Process queued animations
            if (this.animationQueue.length > 0) {
                const nextAnimation = this.animationQueue.shift();
                setTimeout(() => this.playInvestigationAnimation(nextAnimation), 500);
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
            console.log(`Playing investigation action: ${actionName} for ${duration}ms`);
            
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
            this.applyInvestigationPoseToCharacter(currentFrame.pose);
            
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
        // Mock pose interpolation for investigation character
        return {
            pose: {
                ...pose1.pose,
                // In production, would interpolate all bone rotations and positions
                interpolationProgress: progress,
                investigationIntensity: progress
            }
        };
    }
    
    /**
     * Apply investigation pose to character model
     */
    applyInvestigationPoseToCharacter(pose) {
        // Mock pose application - in production would manipulate Three.js bones
        if (this.renderer && this.renderer.character) {
            // Update character pose with investigation-specific adjustments
            console.log('Applying investigation pose:', pose);
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
            case 'easeOutBack':
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
            case 'easeOutQuart':
                return 1 - Math.pow(1 - progress, 4);
            case 'easeInOutCubic':
                return progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            case 'easeOutElastic':
                const c4 = (2 * Math.PI) / 3;
                return progress === 0 ? 0 : progress === 1 ? 1 : Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1;
            case 'easeInOutQuad':
                return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            case 'easeOutBounce':
                const n1 = 7.5625;
                const d1 = 2.75;
                if (progress < 1 / d1) {
                    return n1 * progress * progress;
                } else if (progress < 2 / d1) {
                    return n1 * (progress -= 1.5 / d1) * progress + 0.75;
                } else if (progress < 2.5 / d1) {
                    return n1 * (progress -= 2.25 / d1) * progress + 0.9375;
                } else {
                    return n1 * (progress -= 2.625 / d1) * progress + 0.984375;
                }
            case 'easeInOutQuart':
                return progress < 0.5 ? 8 * progress * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 4) / 2;
            default:
                return progress; // linear
        }
    }
    
    /**
     * Start investigation effects for animation
     */
    startInvestigationEffects(effectNames) {
        if (!effectNames || !Array.isArray(effectNames)) return;
        
        effectNames.forEach(effectName => {
            const effectConfig = this.effectConfigurations[effectName];
            if (effectConfig) {
                console.log(`Starting investigation effect: ${effectName}`);
                // In production, would create actual particle systems
                this.createInvestigationEffect(effectConfig);
            }
        });
    }
    
    /**
     * Create investigation-specific particle effect
     */
    createInvestigationEffect(config) {
        // Mock particle system - in production would use Three.js particles
        console.log('Creating investigation effect:', config);
    }
    
    /**
     * Play audio for animation
     */
    playAudio(audioName) {
        // Mock audio playback
        console.log(`Playing investigation audio: ${audioName}`);
    }
    
    /**
     * Load investigation animation clips
     */
    async loadInvestigationAnimationClips() {
        // In production, would load actual animation files
        console.log('Loading Maya investigation animation clips...');
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
            console.log('Investigation animation stopped');
        }
    }
    
    /**
     * Get available investigation animations
     */
    getAvailableAnimations() {
        return Object.keys(this.investigationAnimations);
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
    module.exports = MayaAnimationSystem;
} else if (typeof window !== 'undefined') {
    window.MayaAnimationSystem = MayaAnimationSystem;
}