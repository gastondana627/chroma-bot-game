/**
 * Stanley's Animation System
 * Warning gestures and protective poses for community leadership moments
 */

class StanleyAnimationSystem {
    constructor(character3DRenderer) {
        this.renderer = character3DRenderer;
        this.characterId = 'stanley';
        this.currentAnimation = null;
        this.animationQueue = [];
        this.isPlaying = false;
        
        // Animation mixer for Three.js
        this.mixer = null;
        this.clock = new THREE.Clock();
        
        // Suburban security gesture configurations
        this.suburbanAnimations = {
            identity_protection: {
                name: 'Identity Theft Warning',
                sequence: [
                    { action: 'suburban_guardian_idle', duration: 1000 },
                    { action: 'threat_recognition', duration: 1500 },
                    { action: 'warning_gesture_build', duration: 2000 },
                    { action: 'protective_warning_hold', duration: 2500 },
                    { action: 'caring_resolution', duration: 1500 }
                ],
                totalDuration: 8500,
                effects: ['warning_pulse', 'protective_aura'],
                audio: 'parental_warning'
            },
            
            scam_prevention: {
                name: 'Marketplace Protection',
                sequence: [
                    { action: 'vigilant_observation', duration: 1200 },
                    { action: 'threat_detection', duration: 1800 },
                    { action: 'intervention_stance', duration: 2000 },
                    { action: 'protective_blocking', duration: 2200 },
                    { action: 'safety_secured', duration: 1800 }
                ],
                totalDuration: 9000,
                effects: ['threat_detection', 'protection_barrier'],
                audio: 'prevention_success'
            },
            
            community_leadership: {
                name: 'Protection Network Command',
                sequence: [
                    { action: 'leadership_assessment', duration: 1500 },
                    { action: 'network_coordination', duration: 2500 },
                    { action: 'community_mobilization', duration: 3000 },
                    { action: 'network_establishment', duration: 2000 },
                    { action: 'guardian_satisfaction', duration: 1000 }
                ],
                totalDuration: 10000,
                effects: ['network_visualization', 'community_connection', 'leadership_beacon'],
                audio: 'network_activation'
            },
            
            parental_guidance: {
                name: 'Caring Authority',
                sequence: [
                    { action: 'concerned_observation', duration: 1200 },
                    { action: 'parental_instinct_rising', duration: 1800 },
                    { action: 'gentle_but_firm_intervention', duration: 2500 },
                    { action: 'nurturing_guidance', duration: 2000 },
                    { action: 'protective_satisfaction', duration: 1500 }
                ],
                totalDuration: 9000,
                effects: ['parental_aura', 'protective_warmth'],
                audio: 'caring_authority'
            },
            
            digital_navigation: {
                name: 'Social Media Guidance',
                sequence: [
                    { action: 'digital_threat_analysis', duration: 1500 },
                    { action: 'pattern_recognition', duration: 2000 },
                    { action: 'guidance_gesture', duration: 2200 },
                    { action: 'safe_path_demonstration', duration: 1800 }
                ],
                totalDuration: 7500,
                effects: ['digital_analysis', 'safe_path_highlight'],
                audio: 'guidance_support'
            }
        };
        
        // Individual animation actions for suburban security theme
        this.animationActions = {
            // Base suburban poses
            suburban_guardian_idle: {
                keyframes: [
                    { time: 0, pose: { arms: 'watchful_ready', head: 'alert_scan', expression: 'protective_vigilance' } },
                    { time: 1, pose: { arms: 'watchful_ready', head: 'alert_scan', expression: 'protective_vigilance' } }
                ],
                easing: 'linear'
            },
            
            vigilant_observation: {
                keyframes: [
                    { time: 0, pose: { arms: 'watchful_ready', head: 'alert_scan', expression: 'protective_vigilance' } },
                    { time: 0.5, pose: { arms: 'observational_stance', head: 'focused_assessment', expression: 'analytical_concern' } },
                    { time: 1, pose: { arms: 'assessment_position', head: 'thorough_evaluation', expression: 'growing_awareness' } }
                ],
                easing: 'easeInOutSine'
            },
            
            // Warning sequence actions
            threat_recognition: {
                keyframes: [
                    { time: 0, pose: { arms: 'assessment_position', head: 'thorough_evaluation', expression: 'growing_awareness' } },
                    { time: 0.3, pose: { arms: 'alert_positioning', head: 'threat_identification', expression: 'concern_building' } },
                    { time: 0.7, pose: { arms: 'defensive_ready', head: 'threat_assessment', expression: 'serious_concern' } },
                    { time: 1, pose: { arms: 'protective_preparation', head: 'action_ready', expression: 'determined_protection' } }
                ],
                easing: 'easeOutCubic'
            },
            
            warning_gesture_build: {
                keyframes: [
                    { time: 0, pose: { arms: 'protective_preparation', head: 'action_ready', expression: 'determined_protection' } },
                    { time: 0.3, pose: { arms: 'warning_initiation', head: 'authoritative_angle', expression: 'firm_concern' } },
                    { time: 0.6, pose: { arms: 'warning_gesture_rising', head: 'commanding_presence', expression: 'serious_warning' } },
                    { time: 1, pose: { arms: 'full_warning_position', head: 'unwavering_authority', expression: 'protective_command' } }
                ],
                easing: 'easeOutBack'
            },
            
            protective_warning_hold: {
                keyframes: [
                    { time: 0, pose: { arms: 'full_warning_position', head: 'unwavering_authority', expression: 'protective_command' } },
                    { time: 0.2, pose: { arms: 'emphatic_warning', head: 'direct_eye_contact', expression: 'caring_firmness' } },
                    { time: 0.5, pose: { arms: 'sustained_caution', head: 'steady_authority', expression: 'parental_protection' } },
                    { time: 0.8, pose: { arms: 'reinforced_warning', head: 'compassionate_firm', expression: 'loving_concern' } },
                    { time: 1, pose: { arms: 'concluding_caution', head: 'hopeful_guidance', expression: 'protective_care' } }
                ],
                easing: 'easeInOutQuad'
            },
            
            caring_resolution: {
                keyframes: [
                    { time: 0, pose: { arms: 'concluding_caution', head: 'hopeful_guidance', expression: 'protective_care' } },
                    { time: 0.4, pose: { arms: 'supportive_gesture', head: 'encouraging_nod', expression: 'understanding_support' } },
                    { time: 1, pose: { arms: 'open_availability', head: 'approachable_guardian', expression: 'caring_readiness' } }
                ],
                easing: 'easeInOutSine'
            },
            
            // Threat detection and intervention sequence
            threat_detection: {
                keyframes: [
                    { time: 0, pose: { arms: 'assessment_position', head: 'thorough_evaluation', expression: 'growing_awareness' } },
                    { time: 0.3, pose: { arms: 'pattern_analysis', head: 'connecting_dots', expression: 'recognition_dawning' } },
                    { time: 0.7, pose: { arms: 'threat_confirmed', head: 'alert_confirmation', expression: 'protective_alarm' } },
                    { time: 1, pose: { arms: 'intervention_ready', head: 'action_determination', expression: 'guardian_resolve' } }
                ],
                easing: 'easeInOutCubic'
            },
            
            intervention_stance: {
                keyframes: [
                    { time: 0, pose: { arms: 'intervention_ready', head: 'action_determination', expression: 'guardian_resolve' } },
                    { time: 0.4, pose: { arms: 'blocking_position', head: 'protective_barrier', expression: 'firm_intervention' } },
                    { time: 1, pose: { arms: 'shield_formation', head: 'unwavering_protection', expression: 'absolute_defense' } }
                ],
                easing: 'easeOutQuart'
            },
            
            protective_blocking: {
                keyframes: [
                    { time: 0, pose: { arms: 'shield_formation', head: 'unwavering_protection', expression: 'absolute_defense' } },
                    { time: 0.3, pose: { arms: 'active_blocking', head: 'threat_neutralization', expression: 'determined_prevention' } },
                    { time: 0.7, pose: { arms: 'barrier_maintenance', head: 'sustained_protection', expression: 'vigilant_guard' } },
                    { time: 1, pose: { arms: 'threat_contained', head: 'successful_intervention', expression: 'protective_success' } }
                ],
                easing: 'easeInOutBounce'
            },
            
            safety_secured: {
                keyframes: [
                    { time: 0, pose: { arms: 'threat_contained', head: 'successful_intervention', expression: 'protective_success' } },
                    { time: 0.5, pose: { arms: 'security_confirmed', head: 'satisfied_guardian', expression: 'mission_accomplished' } },
                    { time: 1, pose: { arms: 'peaceful_readiness', head: 'continued_vigilance', expression: 'protective_satisfaction' } }
                ],
                easing: 'easeInOutSine'
            },
            
            // Community leadership sequence
            leadership_assessment: {
                keyframes: [
                    { time: 0, pose: { arms: 'strategic_evaluation', head: 'community_survey', expression: 'leadership_analysis' } },
                    { time: 0.5, pose: { arms: 'situation_assessment', head: 'network_evaluation', expression: 'strategic_thinking' } },
                    { time: 1, pose: { arms: 'command_preparation', head: 'leadership_ready', expression: 'authoritative_confidence' } }
                ],
                easing: 'easeInOutSine'
            },
            
            network_coordination: {
                keyframes: [
                    { time: 0, pose: { arms: 'command_preparation', head: 'leadership_ready', expression: 'authoritative_confidence' } },
                    { time: 0.25, pose: { arms: 'coordination_gesture_1', head: 'network_point_1', expression: 'organizing_command' } },
                    { time: 0.5, pose: { arms: 'coordination_gesture_2', head: 'network_point_2', expression: 'strategic_direction' } },
                    { time: 0.75, pose: { arms: 'coordination_gesture_3', head: 'network_point_3', expression: 'unified_command' } },
                    { time: 1, pose: { arms: 'network_synchronized', head: 'command_center', expression: 'leadership_control' } }
                ],
                easing: 'easeOutBack'
            },
            
            community_mobilization: {
                keyframes: [
                    { time: 0, pose: { arms: 'network_synchronized', head: 'command_center', expression: 'leadership_control' } },
                    { time: 0.2, pose: { arms: 'mobilization_call', head: 'inspiring_address', expression: 'rallying_leadership' } },
                    { time: 0.4, pose: { arms: 'unity_gesture', head: 'community_connection', expression: 'inspiring_confidence' } },
                    { time: 0.6, pose: { arms: 'strength_demonstration', head: 'powerful_presence', expression: 'commanding_inspiration' } },
                    { time: 0.8, pose: { arms: 'collective_power', head: 'unified_vision', expression: 'shared_determination' } },
                    { time: 1, pose: { arms: 'network_activated', head: 'mission_clarity', expression: 'leadership_triumph' } }
                ],
                easing: 'easeInOutElastic'
            },
            
            network_establishment: {
                keyframes: [
                    { time: 0, pose: { arms: 'network_activated', head: 'mission_clarity', expression: 'leadership_triumph' } },
                    { time: 0.5, pose: { arms: 'network_stabilization', head: 'system_confirmation', expression: 'established_authority' } },
                    { time: 1, pose: { arms: 'guardian_network_complete', head: 'protective_oversight', expression: 'accomplished_leader' } }
                ],
                easing: 'easeInOutQuad'
            },
            
            guardian_satisfaction: {
                keyframes: [
                    { time: 0, pose: { arms: 'guardian_network_complete', head: 'protective_oversight', expression: 'accomplished_leader' } },
                    { time: 1, pose: { arms: 'satisfied_guardian', head: 'peaceful_vigilance', expression: 'protective_contentment' } }
                ],
                easing: 'easeOutCubic'
            },
            
            // Parental guidance sequence
            concerned_observation: {
                keyframes: [
                    { time: 0, pose: { arms: 'parental_attention', head: 'caring_focus', expression: 'parental_concern' } },
                    { time: 1, pose: { arms: 'protective_instinct', head: 'worried_assessment', expression: 'growing_parental_alarm' } }
                ],
                easing: 'easeInOutSine'
            },
            
            parental_instinct_rising: {
                keyframes: [
                    { time: 0, pose: { arms: 'protective_instinct', head: 'worried_assessment', expression: 'growing_parental_alarm' } },
                    { time: 0.4, pose: { arms: 'parental_protection_mode', head: 'determined_care', expression: 'protective_parent' } },
                    { time: 1, pose: { arms: 'caring_authority_ready', head: 'firm_but_loving', expression: 'parental_strength' } }
                ],
                easing: 'easeOutCubic'
            },
            
            gentle_but_firm_intervention: {
                keyframes: [
                    { time: 0, pose: { arms: 'caring_authority_ready', head: 'firm_but_loving', expression: 'parental_strength' } },
                    { time: 0.3, pose: { arms: 'gentle_guidance', head: 'compassionate_firm', expression: 'loving_correction' } },
                    { time: 0.7, pose: { arms: 'supportive_boundary', head: 'understanding_authority', expression: 'caring_discipline' } },
                    { time: 1, pose: { arms: 'protective_embrace_ready', head: 'nurturing_strength', expression: 'parental_love' } }
                ],
                easing: 'easeInOutSine'
            },
            
            nurturing_guidance: {
                keyframes: [
                    { time: 0, pose: { arms: 'protective_embrace_ready', head: 'nurturing_strength', expression: 'parental_love' } },
                    { time: 0.5, pose: { arms: 'teaching_gesture', head: 'patient_instruction', expression: 'wise_guidance' } },
                    { time: 1, pose: { arms: 'encouraging_support', head: 'hopeful_confidence', expression: 'proud_parent' } }
                ],
                easing: 'easeInOutQuad'
            },
            
            protective_satisfaction: {
                keyframes: [
                    { time: 0, pose: { arms: 'encouraging_support', head: 'hopeful_confidence', expression: 'proud_parent' } },
                    { time: 1, pose: { arms: 'available_guardian', head: 'always_watching', expression: 'protective_peace' } }
                ],
                easing: 'easeOutSine'
            },
            
            // Digital navigation sequence
            digital_threat_analysis: {
                keyframes: [
                    { time: 0, pose: { arms: 'tech_assessment', head: 'digital_evaluation', expression: 'tech_concern' } },
                    { time: 0.5, pose: { arms: 'pattern_analysis', head: 'threat_identification', expression: 'digital_alarm' } },
                    { time: 1, pose: { arms: 'cyber_threat_confirmed', head: 'serious_digital_concern', expression: 'protective_tech_mode' } }
                ],
                easing: 'easeInOutCubic'
            },
            
            pattern_recognition: {
                keyframes: [
                    { time: 0, pose: { arms: 'cyber_threat_confirmed', head: 'serious_digital_concern', expression: 'protective_tech_mode' } },
                    { time: 0.4, pose: { arms: 'connecting_digital_dots', head: 'understanding_pattern', expression: 'digital_comprehension' } },
                    { time: 1, pose: { arms: 'solution_formation', head: 'guidance_ready', expression: 'helpful_determination' } }
                ],
                easing: 'easeOutBack'
            },
            
            guidance_gesture: {
                keyframes: [
                    { time: 0, pose: { arms: 'solution_formation', head: 'guidance_ready', expression: 'helpful_determination' } },
                    { time: 0.3, pose: { arms: 'direction_pointing', head: 'safe_path_indication', expression: 'guiding_confidence' } },
                    { time: 0.7, pose: { arms: 'path_demonstration', head: 'clear_instruction', expression: 'teaching_assurance' } },
                    { time: 1, pose: { arms: 'supportive_direction', head: 'encouraging_guidance', expression: 'helpful_support' } }
                ],
                easing: 'easeInOutSine'
            },
            
            safe_path_demonstration: {
                keyframes: [
                    { time: 0, pose: { arms: 'supportive_direction', head: 'encouraging_guidance', expression: 'helpful_support' } },
                    { time: 0.5, pose: { arms: 'step_by_step_guide', head: 'patient_instruction', expression: 'careful_teaching' } },
                    { time: 1, pose: { arms: 'safety_confirmed', head: 'satisfied_guidance', expression: 'protective_relief' } }
                ],
                easing: 'easeInOutQuad'
            }
        };
        
        // Particle and effect configurations for suburban animations
        this.effectConfigurations = {
            warning_pulse: {
                type: 'caution_pulse',
                color: '#FBD38D',
                intensity: 1.0,
                duration: 4000,
                pulsing: true,
                frequency: 0.8,
                caring: true
            },
            
            protective_aura: {
                type: 'guardian_field',
                color: '#4299E1',
                intensity: 0.9,
                duration: 5000,
                steady: true,
                warmth: true
            },
            
            threat_detection: {
                type: 'analysis_grid',
                color: '#E53E3E',
                intensity: 1.2,
                duration: 3000,
                scanning: true,
                protective: true
            },
            
            protection_barrier: {
                type: 'safety_shield',
                color: '#38B2AC',
                intensity: 1.1,
                duration: 4000,
                barrier: true,
                community: true
            },
            
            network_visualization: {
                type: 'community_network',
                colors: ['#4299E1', '#38B2AC', '#FBD38D'],
                nodes: 12,
                duration: 6000,
                connections: true,
                growth: true
            },
            
            community_connection: {
                type: 'unity_bonds',
                color: '#9F7AEA',
                intensity: 0.8,
                duration: 5000,
                linking: true,
                strength: true
            },
            
            leadership_beacon: {
                type: 'guidance_light',
                color: '#F6E05E',
                intensity: 1.3,
                duration: 4000,
                beacon: true,
                inspiring: true
            },
            
            parental_aura: {
                type: 'caring_warmth',
                color: '#FED7D7',
                intensity: 0.7,
                duration: 6000,
                nurturing: true,
                protective: true
            },
            
            protective_warmth: {
                type: 'family_safety',
                color: '#FBD38D',
                intensity: 0.8,
                duration: 4000,
                comforting: true,
                secure: true
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
        await this.loadSuburbanAnimationClips();
        
        console.log('Stanley Suburban Animation System initialized');
    }
    
    /**
     * Play a suburban security animation sequence
     */
    async playSuburbanAnimation(animationType = 'identity_protection') {
        if (this.isPlaying) {
            console.warn('Animation already playing, queuing new animation');
            this.animationQueue.push(animationType);
            return;
        }
        
        const animation = this.suburbanAnimations[animationType];
        if (!animation) {
            console.error(`Unknown animation type: ${animationType}`);
            return;
        }
        
        console.log(`Playing suburban animation: ${animation.name}`);
        this.isPlaying = true;
        this.currentAnimation = animation;
        
        try {
            // Start suburban effects
            this.startSuburbanEffects(animation.effects);
            
            // Play audio if available
            if (animation.audio) {
                this.playAudio(animation.audio);
            }
            
            // Execute animation sequence
            await this.executeAnimationSequence(animation.sequence);
            
            console.log(`Suburban animation completed: ${animation.name}`);
            
        } catch (error) {
            console.error('Animation playback failed:', error);
        } finally {
            this.isPlaying = false;
            this.currentAnimation = null;
            
            // Process queued animations
            if (this.animationQueue.length > 0) {
                const nextAnimation = this.animationQueue.shift();
                setTimeout(() => this.playSuburbanAnimation(nextAnimation), 500);
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
            console.log(`Playing suburban action: ${actionName} for ${duration}ms`);
            
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
            this.applySuburbanPoseToCharacter(currentFrame.pose);
            
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
        // Mock pose interpolation for suburban character
        return {
            pose: {
                ...pose1.pose,
                // In production, would interpolate all bone rotations and positions
                interpolationProgress: progress,
                suburbanAuthority: progress,
                protectiveIntensity: progress
            }
        };
    }
    
    /**
     * Apply suburban pose to character model
     */
    applySuburbanPoseToCharacter(pose) {
        // Mock pose application - in production would manipulate Three.js bones
        if (this.renderer && this.renderer.character) {
            // Update character pose with suburban-specific adjustments
            console.log('Applying suburban protective pose:', pose);
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
            case 'easeInOutElastic':
                const c5 = (2 * Math.PI) / 4.5;
                return progress === 0 ? 0 : progress === 1 ? 1 : progress < 0.5
                    ? -(Math.pow(2, 20 * progress - 10) * Math.sin((20 * progress - 11.125) * c5)) / 2
                    : (Math.pow(2, -20 * progress + 10) * Math.sin((20 * progress - 11.125) * c5)) / 2 + 1;
            case 'easeInOutQuad':
                return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            case 'easeInOutBounce':
                return progress < 0.5
                    ? (1 - this.bounceOut(1 - 2 * progress)) / 2
                    : (1 + this.bounceOut(2 * progress - 1)) / 2;
            case 'easeOutSine':
                return Math.sin((progress * Math.PI) / 2);
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
     * Start suburban effects for animation
     */
    startSuburbanEffects(effectNames) {
        if (!effectNames || !Array.isArray(effectNames)) return;
        
        effectNames.forEach(effectName => {
            const effectConfig = this.effectConfigurations[effectName];
            if (effectConfig) {
                console.log(`Starting suburban effect: ${effectName}`);
                // In production, would create actual particle systems
                this.createSuburbanEffect(effectConfig);
            }
        });
    }
    
    /**
     * Create suburban-specific particle effect
     */
    createSuburbanEffect(config) {
        // Mock particle system - in production would use Three.js particles
        console.log('Creating suburban effect:', config);
    }
    
    /**
     * Play audio for animation
     */
    playAudio(audioName) {
        // Mock audio playback
        console.log(`Playing suburban audio: ${audioName}`);
    }
    
    /**
     * Load suburban animation clips
     */
    async loadSuburbanAnimationClips() {
        // In production, would load actual animation files
        console.log('Loading Stanley suburban animation clips...');
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
            console.log('Suburban animation stopped');
        }
    }
    
    /**
     * Get available suburban animations
     */
    getAvailableAnimations() {
        return Object.keys(this.suburbanAnimations);
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
    module.exports = StanleyAnimationSystem;
} else if (typeof window !== 'undefined') {
    window.StanleyAnimationSystem = StanleyAnimationSystem;
}