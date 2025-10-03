/**
 * Maya's 3D Character Configuration
 * Investigation-themed setup with dramatic lighting and cyber cafe atmosphere
 */

class Maya3DConfig {
    constructor() {
        this.characterId = 'maya';
        this.name = 'Maya';
        this.theme = 'investigation_mood';
        
        // Reference image configuration for NeRF processing
        this.referenceConfig = {
            description: 'Young woman in shadows with investigation theme',
            imageRequirements: {
                minImages: 5,
                preferredAngles: ['front', 'left_profile', 'right_profile', 'three_quarter_left', 'three_quarter_right'],
                resolution: { min: 1024, preferred: 2048 },
                lighting: 'dramatic_shadows_preferred',
                background: 'dark_or_removable',
                specialRequirements: ['shadow_detail_preservation', 'facial_expression_clarity']
            },
            processingSettings: {
                nerfIterations: 40000, // Higher for shadow detail
                gaussianSplattingOptimization: true,
                lodLevels: 3,
                textureResolution: 2048,
                shadowPreservation: true
            }
        };
        
        // Investigation-themed dramatic lighting configuration
        this.lightingConfig = {
            primary: {
                color: '#0066CC', // Cool investigative blue
                intensity: 1.1,
                position: [3, 4, 2],
                type: 'directional',
                castShadow: true,
                shadowMapSize: 2048
            },
            secondary: {
                color: '#FFFFFF', // Harsh white interrogation light
                intensity: 0.6,
                position: [-1, 3, -1],
                type: 'spot',
                angle: Math.PI / 3,
                penumbra: 0.5,
                castShadow: true
            },
            accent: {
                color: '#333333', // Dark ambient for mystery
                intensity: 0.4,
                position: [0, 1, 3],
                type: 'point',
                castShadow: false
            },
            ambient: {
                color: '#1a1a2e',
                intensity: 0.2 // Lower ambient for dramatic shadows
            },
            environment: {
                type: 'investigation_hub',
                hdri: '/assets/3d/environments/cyber_cafe.hdr',
                intensity: 0.3,
                backgroundBlur: 0.8
            },
            // Special rim lighting for silhouette effect
            rimLight: {
                color: '#4A90E2',
                intensity: 0.8,
                position: [0, 2, -4],
                type: 'directional'
            }
        };
        
        // Cyber cafe and investigation hub atmosphere effects
        this.atmosphereEffects = {
            particles: {
                enabled: true,
                type: 'data_streams',
                count: 80,
                color: '#0066CC',
                speed: 0.015,
                size: 0.6,
                opacity: 0.7
            },
            fog: {
                enabled: true,
                color: '#0a0a1a',
                near: 3,
                far: 20,
                density: 0.08
            },
            bloom: {
                enabled: true,
                strength: 1.2,
                radius: 0.5,
                threshold: 0.7
            },
            screenEffects: {
                scanlines: false, // More subtle than gaming theme
                vignette: {
                    enabled: true,
                    intensity: 0.3,
                    color: '#000033'
                },
                colorGrading: {
                    shadows: '#001122',
                    midtones: '#334455',
                    highlights: '#AABBCC'
                }
            },
            // Investigation-specific effects
            evidenceHighlight: {
                enabled: true,
                color: '#FFD700',
                intensity: 1.5,
                pulsing: true,
                frequency: 0.5
            }
        };
        
        // Investigation gestures and breakthrough moment animations
        this.animations = {
            // Base animations
            idle: {
                name: 'investigative_idle',
                duration: 5000,
                loop: true,
                keyframes: [
                    { time: 0, pose: 'thoughtful_stance', expression: 'focused_analysis', weight: 1.0 },
                    { time: 2000, pose: 'slight_head_tilt', expression: 'considering', weight: 1.0 },
                    { time: 3500, pose: 'arms_crossed_thinking', expression: 'contemplative', weight: 1.0 },
                    { time: 5000, pose: 'thoughtful_stance', expression: 'focused_analysis', weight: 1.0 }
                ],
                blendMode: 'smooth'
            },
            
            emergence: {
                name: 'emergence_from_shadows',
                duration: 3000,
                loop: false,
                keyframes: [
                    { time: 0, scale: 0.1, opacity: 0.2, pose: 'shadow_form', lighting: 'minimal' },
                    { time: 1000, scale: 0.5, opacity: 0.6, pose: 'materializing', lighting: 'building' },
                    { time: 2000, scale: 0.8, opacity: 0.85, pose: 'becoming_solid', lighting: 'dramatic' },
                    { time: 3000, scale: 1.0, opacity: 1.0, pose: 'thoughtful_stance', lighting: 'full' }
                ],
                effects: ['shadow_materialization', 'investigation_aura']
            },
            
            return_to_shadows: {
                name: 'return_to_shadows',
                duration: 2500,
                loop: false,
                keyframes: [
                    { time: 0, scale: 1.0, opacity: 1.0, pose: 'thoughtful_stance', lighting: 'full' },
                    { time: 800, scale: 0.9, opacity: 0.8, pose: 'fading_back', lighting: 'dimming' },
                    { time: 1600, scale: 0.6, opacity: 0.5, pose: 'becoming_shadow', lighting: 'minimal' },
                    { time: 2500, scale: 0.1, opacity: 0.0, pose: 'shadow_form', lighting: 'none' }
                ],
                effects: ['shadow_dissolution', 'mystery_fade']
            },
            
            // Investigation breakthrough animations
            pointing_gesture: {
                name: 'evidence_discovery_point',
                duration: 3500,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'thoughtful_stance', expression: 'focused_analysis' },
                    { time: 800, pose: 'realization_moment', expression: 'eyes_widening' },
                    { time: 1500, pose: 'arm_raising_to_point', expression: 'breakthrough_excitement' },
                    { time: 2200, pose: 'confident_pointing', expression: 'determined_revelation' },
                    { time: 3000, pose: 'pointing_with_conviction', expression: 'certain_discovery' },
                    { time: 3500, pose: 'satisfied_conclusion', expression: 'investigative_satisfaction' }
                ],
                effects: ['evidence_highlight', 'revelation_glow'],
                audio: 'discovery_chime'
            },
            
            concerned_expression: {
                name: 'breakthrough_concern',
                duration: 4000,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'thoughtful_stance', expression: 'focused_analysis' },
                    { time: 1000, pose: 'leaning_forward_concerned', expression: 'growing_worry' },
                    { time: 2000, pose: 'hand_to_chin_worried', expression: 'deep_concern' },
                    { time: 2800, pose: 'protective_stance', expression: 'determined_protection' },
                    { time: 3500, pose: 'warning_gesture', expression: 'serious_caution' },
                    { time: 4000, pose: 'resolved_determination', expression: 'protective_resolve' }
                ],
                effects: ['warning_aura', 'protective_glow'],
                audio: 'concern_theme'
            },
            
            investigation_analysis: {
                name: 'deep_investigation_mode',
                duration: 5000,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'thoughtful_stance', expression: 'focused_analysis' },
                    { time: 1000, pose: 'examining_evidence', expression: 'intense_scrutiny' },
                    { time: 2000, pose: 'cross_referencing', expression: 'connecting_dots' },
                    { time: 3000, pose: 'pattern_recognition', expression: 'understanding_dawning' },
                    { time: 4000, pose: 'conclusion_forming', expression: 'pieces_fitting' },
                    { time: 5000, pose: 'investigation_complete', expression: 'satisfied_resolution' }
                ],
                effects: ['data_analysis_streams', 'connection_lines'],
                audio: 'investigation_processing'
            },
            
            // Cyber cafe specific animations
            digital_investigation: {
                name: 'cyber_cafe_discovery',
                duration: 4500,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'approaching_terminal', expression: 'cautious_curiosity' },
                    { time: 1000, pose: 'typing_investigation', expression: 'focused_searching' },
                    { time: 2000, pose: 'reading_screen_intently', expression: 'absorbing_information' },
                    { time: 3000, pose: 'shocked_discovery', expression: 'revelation_shock' },
                    { time: 3800, pose: 'backing_away_concerned', expression: 'processing_implications' },
                    { time: 4500, pose: 'determined_next_steps', expression: 'resolved_action' }
                ],
                effects: ['screen_glow', 'data_revelation', 'cyber_atmosphere'],
                audio: 'digital_discovery'
            },
            
            // Final confrontation animation
            confrontation_resolve: {
                name: 'final_confrontation_moment',
                duration: 6000,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'cautious_approach', expression: 'steely_determination' },
                    { time: 1200, pose: 'presenting_evidence', expression: 'confident_accusation' },
                    { time: 2400, pose: 'unwavering_stance', expression: 'unshakeable_resolve' },
                    { time: 3600, pose: 'protective_positioning', expression: 'guardian_strength' },
                    { time: 4800, pose: 'justice_declaration', expression: 'righteous_conviction' },
                    { time: 6000, pose: 'victorious_resolution', expression: 'justice_served' }
                ],
                effects: ['justice_aura', 'truth_revelation', 'protective_barrier'],
                audio: 'confrontation_resolution'
            }
        };
        
        // Cinematic moment configurations for investigation storyline
        this.cinematicMoments = {
            dating_app_discovery: {
                trigger: 'area-2-dating-app',
                condition: 'suspicious_match_detected',
                animation: 'concerned_expression',
                dialogue: "Wait... something's not right here. This profile, these messages... they're too perfect, too calculated. We need to dig deeper.",
                duration: 7500,
                lighting: 'investigation_warning',
                effects: ['warning_aura', 'data_analysis_streams']
            },
            
            investigation_breakthrough: {
                trigger: 'area-3-investigation-hub',
                condition: 'evidence_discovered',
                animation: 'pointing_gesture',
                dialogue: "There! Do you see it? The pattern in the data, the connection between all these cases. This isn't random - it's systematic.",
                duration: 8000,
                lighting: 'breakthrough_revelation',
                effects: ['evidence_highlight', 'revelation_glow', 'connection_lines']
            },
            
            cyber_cafe_archive: {
                trigger: 'area-4-cyber-cafe',
                condition: 'investigation_breakthrough',
                animation: 'digital_investigation',
                dialogue: "The archives... they go back years. Look at this data trail - we're not the first to stumble onto this. But we might be the first to understand what it means.",
                duration: 9000,
                lighting: 'cyber_discovery',
                effects: ['screen_glow', 'data_revelation', 'cyber_atmosphere']
            },
            
            final_confrontation: {
                trigger: 'area-6-final-confrontation',
                condition: 'confrontation_moment',
                animation: 'confrontation_resolve',
                dialogue: "This ends now. We have the evidence, we know the truth, and we're not backing down. Justice isn't just an ideal - it's a choice we make.",
                duration: 10000,
                lighting: 'final_confrontation',
                effects: ['justice_aura', 'truth_revelation', 'protective_barrier']
            }
        };
        
        // Performance optimization settings
        this.performanceConfig = {
            lodDistances: [4, 12, 25], // Closer distances for investigation detail
            maxParticles: {
                high: 150,
                medium: 75,
                low: 35
            },
            shadowQuality: {
                high: 2048, // Higher shadow quality for dramatic lighting
                medium: 1024,
                low: 512
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
            // Investigation-specific optimizations
            shadowOptimization: {
                cascadedShadows: true,
                softShadows: true,
                shadowBias: 0.0001
            }
        };
    }
    
    /**
     * Get lighting configuration for specific cinematic moment
     */
    getLightingForMoment(momentName) {
        const baseLighting = { ...this.lightingConfig };
        
        switch (momentName) {
            case 'investigation_warning':
                baseLighting.primary.color = '#FF6B35'; // Warning orange
                baseLighting.secondary.intensity = 0.8;
                baseLighting.ambient.intensity = 0.15;
                break;
                
            case 'breakthrough_revelation':
                baseLighting.primary.intensity = 1.4;
                baseLighting.secondary.color = '#FFD700'; // Golden revelation
                baseLighting.rimLight.intensity = 1.2;
                break;
                
            case 'cyber_discovery':
                baseLighting.primary.color = '#00CCFF'; // Cyber blue
                baseLighting.secondary.color = '#FFFFFF';
                baseLighting.accent.color = '#0066CC';
                baseLighting.ambient.intensity = 0.3;
                break;
                
            case 'final_confrontation':
                baseLighting.primary.intensity = 1.6;
                baseLighting.secondary.intensity = 1.0;
                baseLighting.rimLight.color = '#FFFFFF';
                baseLighting.rimLight.intensity = 1.5;
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
        
        // Check for shadow detail preservation
        let shadowDetailImages = 0;
        let expressionClarityImages = 0;
        
        referenceImages.forEach((img, index) => {
            if (img.width < this.referenceConfig.imageRequirements.resolution.min) {
                validation.warnings.push(`Image ${index + 1} resolution below recommended: ${img.width}x${img.height}`);
            }
            
            // Mock shadow and expression analysis
            if (Math.random() > 0.4) shadowDetailImages++; // Mock shadow detection
            if (Math.random() > 0.3) expressionClarityImages++; // Mock expression detection
        });
        
        if (shadowDetailImages < 3) {
            validation.warnings.push('Recommend more images with dramatic shadow detail for investigation theme');
        }
        
        if (expressionClarityImages < 4) {
            validation.warnings.push('Ensure facial expressions are clearly visible for investigation emotions');
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
    module.exports = Maya3DConfig;
} else if (typeof window !== 'undefined') {
    window.Maya3DConfig = Maya3DConfig;
}