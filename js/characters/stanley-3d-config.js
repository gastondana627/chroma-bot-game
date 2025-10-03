/**
 * Stanley's 3D Character Configuration
 * Suburban security theme with warm but cautious lighting
 */

class Stanley3DConfig {
    constructor() {
        this.characterId = 'stanley';
        this.name = 'Stanley';
        this.theme = 'suburban_security';
        
        // Reference image configuration for NeRF processing
        this.referenceConfig = {
            description: 'Older man with concerned expression, suburban security theme',
            imageRequirements: {
                minImages: 5,
                preferredAngles: ['front', 'left_profile', 'right_profile', 'three_quarter_left', 'three_quarter_right'],
                resolution: { min: 1024, preferred: 2048 },
                lighting: 'natural_warm_preferred',
                background: 'suburban_or_removable',
                specialRequirements: ['mature_facial_features', 'concerned_expression_range', 'authoritative_presence']
            },
            processingSettings: {
                nerfIterations: 38000,
                gaussianSplattingOptimization: true,
                lodLevels: 3,
                textureResolution: 2048,
                matureFaceOptimization: true // Special handling for older character
            }
        };
        
        // Suburban security themed lighting configuration
        this.lightingConfig = {
            primary: {
                color: '#E2E8F0', // Warm daylight
                intensity: 1.0,
                position: [2, 3, 3],
                type: 'directional',
                castShadow: true,
                shadowMapSize: 1024
            },
            secondary: {
                color: '#FED7D7', // Soft warm accent
                intensity: 0.7,
                position: [-2, 2, 1],
                type: 'point',
                castShadow: false
            },
            accent: {
                color: '#4A5568', // Subtle cool balance
                intensity: 0.5,
                position: [1, 1, -2],
                type: 'spot',
                angle: Math.PI / 3,
                penumbra: 0.4
            },
            ambient: {
                color: '#F7FAFC', // Bright ambient for suburban feel
                intensity: 0.4
            },
            environment: {
                type: 'suburban_home',
                hdri: '/assets/3d/environments/suburban_daylight.hdr',
                intensity: 0.6,
                backgroundBlur: 0.3
            },
            // Warm rim lighting for trustworthy appearance
            rimLight: {
                color: '#FBD38D',
                intensity: 0.6,
                position: [0, 2, -3],
                type: 'directional'
            }
        };
        
        // Suburban and protection network atmosphere effects
        this.atmosphereEffects = {
            particles: {
                enabled: true,
                type: 'security_network',
                count: 60,
                color: '#4A5568',
                speed: 0.01,
                size: 0.4,
                opacity: 0.5
            },
            fog: {
                enabled: false, // Clear suburban atmosphere
                color: '#F7FAFC',
                near: 10,
                far: 30,
                density: 0.02
            },
            bloom: {
                enabled: true,
                strength: 0.8, // Subtle bloom for warm feel
                radius: 0.3,
                threshold: 0.9
            },
            screenEffects: {
                scanlines: false,
                vignette: {
                    enabled: false // Open, trustworthy feel
                },
                colorGrading: {
                    shadows: '#2D3748',
                    midtones: '#718096',
                    highlights: '#F7FAFC'
                }
            },
            // Security-specific effects
            protectionField: {
                enabled: true,
                color: '#4299E1',
                intensity: 0.8,
                pulsing: false,
                steady: true
            }
        };
        
        // Warning gestures and protective pose animations
        this.animations = {
            // Base animations
            idle: {
                name: 'suburban_guardian_idle',
                duration: 6000,
                loop: true,
                keyframes: [
                    { time: 0, pose: 'watchful_stance', expression: 'alert_concern', weight: 1.0 },
                    { time: 2000, pose: 'protective_posture', expression: 'caring_vigilance', weight: 1.0 },
                    { time: 4000, pose: 'community_guardian', expression: 'responsible_watch', weight: 1.0 },
                    { time: 6000, pose: 'watchful_stance', expression: 'alert_concern', weight: 1.0 }
                ],
                blendMode: 'smooth'
            },
            
            emergence: {
                name: 'emergence_from_community',
                duration: 3500,
                loop: false,
                keyframes: [
                    { time: 0, scale: 0.1, opacity: 0.3, pose: 'community_form', lighting: 'gathering' },
                    { time: 1200, scale: 0.6, opacity: 0.7, pose: 'materializing_guardian', lighting: 'strengthening' },
                    { time: 2400, scale: 0.9, opacity: 0.9, pose: 'becoming_protector', lighting: 'warm' },
                    { time: 3500, scale: 1.0, opacity: 1.0, pose: 'watchful_stance', lighting: 'full' }
                ],
                effects: ['community_materialization', 'protection_aura']
            },
            
            return_to_community: {
                name: 'return_to_community',
                duration: 3000,
                loop: false,
                keyframes: [
                    { time: 0, scale: 1.0, opacity: 1.0, pose: 'watchful_stance', lighting: 'full' },
                    { time: 1000, scale: 0.9, opacity: 0.8, pose: 'fading_guardian', lighting: 'dimming' },
                    { time: 2000, scale: 0.5, opacity: 0.5, pose: 'becoming_network', lighting: 'dispersing' },
                    { time: 3000, scale: 0.1, opacity: 0.0, pose: 'community_form', lighting: 'none' }
                ],
                effects: ['community_integration', 'network_fade']
            },
            
            // Warning gesture animations
            warning_gesture: {
                name: 'identity_theft_warning',
                duration: 4000,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'watchful_stance', expression: 'alert_concern' },
                    { time: 1000, pose: 'concern_building', expression: 'growing_worry' },
                    { time: 2000, pose: 'warning_raise', expression: 'serious_caution' },
                    { time: 3000, pose: 'emphatic_warning', expression: 'urgent_protection' },
                    { time: 4000, pose: 'protective_ready', expression: 'guardian_resolve' }
                ],
                effects: ['warning_pulse', 'caution_aura'],
                audio: 'warning_alert'
            },
            
            protective_pose: {
                name: 'community_leadership',
                duration: 5000,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'watchful_stance', expression: 'alert_concern' },
                    { time: 1200, pose: 'leadership_emergence', expression: 'taking_charge' },
                    { time: 2400, pose: 'protective_stance', expression: 'determined_guardian' },
                    { time: 3600, pose: 'community_shield', expression: 'unwavering_protection' },
                    { time: 5000, pose: 'established_leader', expression: 'confident_protector' }
                ],
                effects: ['leadership_aura', 'community_rally'],
                audio: 'leadership_theme'
            },
            
            // Social media maze specific animations
            digital_navigation: {
                name: 'social_media_guidance',
                duration: 4500,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'analyzing_digital_threat', expression: 'concerned_study' },
                    { time: 1200, pose: 'identifying_danger', expression: 'recognition_alarm' },
                    { time: 2400, pose: 'guidance_gesture', expression: 'helpful_direction' },
                    { time: 3600, pose: 'protective_guidance', expression: 'caring_instruction' },
                    { time: 4500, pose: 'safe_path_shown', expression: 'relieved_guidance' }
                ],
                effects: ['digital_analysis', 'safe_path_highlight'],
                audio: 'guidance_support'
            },
            
            // Financial district animations
            scam_prevention: {
                name: 'marketplace_protection',
                duration: 5500,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'marketplace_observation', expression: 'vigilant_watching' },
                    { time: 1400, pose: 'threat_detection', expression: 'alarm_recognition' },
                    { time: 2800, pose: 'intervention_stance', expression: 'protective_action' },
                    { time: 4200, pose: 'scam_blocking', expression: 'determined_prevention' },
                    { time: 5500, pose: 'safety_secured', expression: 'successful_protection' }
                ],
                effects: ['threat_detection', 'protection_barrier'],
                audio: 'prevention_success'
            },
            
            // Protection network animations
            network_leadership: {
                name: 'protection_network_command',
                duration: 6000,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'network_assessment', expression: 'strategic_evaluation' },
                    { time: 1500, pose: 'coordination_stance', expression: 'organizing_response' },
                    { time: 3000, pose: 'network_activation', expression: 'commanding_presence' },
                    { time: 4500, pose: 'community_mobilization', expression: 'inspiring_leadership' },
                    { time: 6000, pose: 'network_established', expression: 'accomplished_guardian' }
                ],
                effects: ['network_visualization', 'community_connection', 'leadership_beacon'],
                audio: 'network_activation'
            },
            
            // Concerned authority animations
            parental_concern: {
                name: 'parental_protective_instinct',
                duration: 4200,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'observing_threat', expression: 'parental_worry' },
                    { time: 1200, pose: 'protective_instinct_rising', expression: 'growing_concern' },
                    { time: 2400, pose: 'authoritative_intervention', expression: 'firm_protection' },
                    { time: 3600, pose: 'caring_guidance', expression: 'nurturing_authority' },
                    { time: 4200, pose: 'protective_resolution', expression: 'satisfied_guardian' }
                ],
                effects: ['parental_aura', 'protective_warmth'],
                audio: 'caring_authority'
            }
        };
        
        // Cinematic moment configurations for suburban security storyline
        this.cinematicMoments = {
            social_media_identity_threat: {
                trigger: 'area-2-social-media-maze',
                condition: 'identity_theft_discovery',
                animation: 'warning_gesture',
                dialogue: "Hold on there. I've seen this pattern before - someone's trying to piece together your identity. We need to be smarter about what we share online.",
                duration: 8000,
                lighting: 'concerned_warning',
                effects: ['warning_pulse', 'caution_aura']
            },
            
            digital_marketplace_scam: {
                trigger: 'area-4-digital-marketplace',
                condition: 'scam_prevention_success',
                animation: 'scam_prevention',
                dialogue: "That's exactly the kind of offer that's too good to be true. I've helped neighbors avoid these traps before. Let me show you the warning signs.",
                duration: 9000,
                lighting: 'protective_intervention',
                effects: ['threat_detection', 'protection_barrier']
            },
            
            protection_network_leadership: {
                trigger: 'area-6-protection-network',
                condition: 'community_leadership',
                animation: 'network_leadership',
                dialogue: "This is how we protect each other - by building a network of awareness and support. Together, we're stronger than any digital threat.",
                duration: 10000,
                lighting: 'community_leadership',
                effects: ['network_visualization', 'community_connection', 'leadership_beacon']
            }
        };
        
        // Performance optimization settings
        this.performanceConfig = {
            lodDistances: [6, 18, 35], // Comfortable suburban distances
            maxParticles: {
                high: 120,
                medium: 60,
                low: 30
            },
            shadowQuality: {
                high: 1024, // Moderate shadows for suburban feel
                medium: 512,
                low: 256
            },
            textureQuality: {
                high: 2048,
                medium: 1024,
                low: 512
            },
            animationFPS: {
                high: 60,
                medium: 30,
                low: 15
            },
            // Suburban-specific optimizations
            warmLightingOptimization: {
                colorTemperature: 3200, // Warm suburban lighting
                softShadows: true,
                ambientOcclusion: true
            }
        };
    }
    
    /**
     * Get lighting configuration for specific cinematic moment
     */
    getLightingForMoment(momentName) {
        const baseLighting = { ...this.lightingConfig };
        
        switch (momentName) {
            case 'concerned_warning':
                baseLighting.primary.color = '#FBD38D'; // Warmer warning
                baseLighting.secondary.intensity = 0.9;
                baseLighting.accent.color = '#E53E3E'; // Red caution
                break;
                
            case 'protective_intervention':
                baseLighting.primary.intensity = 1.2;
                baseLighting.secondary.color = '#4299E1'; // Protective blue
                baseLighting.rimLight.intensity = 0.8;
                break;
                
            case 'community_leadership':
                baseLighting.primary.intensity = 1.3;
                baseLighting.secondary.intensity = 1.0;
                baseLighting.accent.color = '#38B2AC'; // Leadership teal
                baseLighting.ambient.intensity = 0.5;
                break;
        }
        
        return baseLighting;
    }
    
    /**
     * Get animation configuration by name
     */
    getAnimation(animationName) {
        return this.animations[animationName] || this.animations.idle;
    }
    
    /**
     * Get cinematic moment configuration
     */
    getCinematicMoment(momentName) {
        return this.cinematicMoments[momentName];
    }
    
    /**
     * Get performance settings based on device capability
     */
    getPerformanceSettings(deviceTier = 'medium') {
        const settings = {};
        
        for (const [key, value] of Object.entries(this.performanceConfig)) {
            if (typeof value === 'object' && value[deviceTier]) {
                settings[key] = value[deviceTier];
            } else {
                settings[key] = value;
            }
        }
        
        return settings;
    }
    
    /**
     * Validate character setup for NeRF processing
     */
    validateSetup(referenceImages = []) {
        const validation = {
            valid: true,
            warnings: [],
            errors: []
        };
        
        // Check image count
        if (referenceImages.length < this.referenceConfig.imageRequirements.minImages) {
            validation.errors.push(`Insufficient reference images: ${referenceImages.length}/${this.referenceConfig.imageRequirements.minImages}`);
            validation.valid = false;
        }
        
        // Check for mature character requirements
        let matureFeaturesImages = 0;
        let expressionRangeImages = 0;
        let authoritativePresenceImages = 0;
        
        referenceImages.forEach((img, index) => {
            if (img.width < this.referenceConfig.imageRequirements.resolution.min) {
                validation.warnings.push(`Image ${index + 1} resolution below recommended: ${img.width}x${img.height}`);
            }
            
            // Mock mature character analysis
            if (Math.random() > 0.3) matureFeaturesImages++; // Mock mature features detection
            if (Math.random() > 0.4) expressionRangeImages++; // Mock expression range detection
            if (Math.random() > 0.5) authoritativePresenceImages++; // Mock authority detection
        });
        
        if (matureFeaturesImages < 4) {
            validation.warnings.push('Ensure mature facial features are clearly visible for Stanley character');
        }
        
        if (expressionRangeImages < 3) {
            validation.warnings.push('Recommend more images showing concerned/protective expression range');
        }
        
        if (authoritativePresenceImages < 2) {
            validation.warnings.push('Consider adding images that show authoritative/protective presence');
        }
        
        return validation;
    }
    
    /**
     * Export configuration for asset processor
     */
    exportConfig() {
        return {
            characterId: this.characterId,
            name: this.name,
            theme: this.theme,
            referenceConfig: this.referenceConfig,
            lightingConfig: this.lightingConfig,
            atmosphereEffects: this.atmosphereEffects,
            animations: this.animations,
            cinematicMoments: this.cinematicMoments,
            performanceConfig: this.performanceConfig,
            version: '1.0.0',
            createdAt: new Date().toISOString()
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Stanley3DConfig;
} else if (typeof window !== 'undefined') {
    window.Stanley3DConfig = Stanley3DConfig;
}