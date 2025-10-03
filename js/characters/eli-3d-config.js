/**
 * Eli's 3D Character Configuration
 * Gaming-themed setup with neon blues and tournament arena atmosphere
 */

class Eli3DConfig {
    constructor() {
        this.characterId = 'eli';
        this.name = 'Eli';
        this.theme = 'gaming_neon';
        
        // Reference image configuration for NeRF processing
        this.referenceConfig = {
            description: 'Young gamer with headset',
            imageRequirements: {
                minImages: 5,
                preferredAngles: ['front', 'left_profile', 'right_profile', 'three_quarter_left', 'three_quarter_right'],
                resolution: { min: 1024, preferred: 2048 },
                lighting: 'even_diffused',
                background: 'neutral_or_removable'
            },
            processingSettings: {
                nerfIterations: 35000,
                gaussianSplattingOptimization: true,
                lodLevels: 3,
                textureResolution: 2048
            }
        };
        
        // Gaming-themed lighting configuration
        this.lightingConfig = {
            primary: {
                color: '#00FFFF', // Cyan gaming light
                intensity: 1.2,
                position: [2, 3, 2],
                type: 'directional',
                castShadow: true
            },
            secondary: {
                color: '#FF0080', // Magenta accent
                intensity: 0.8,
                position: [-2, 2, 1],
                type: 'point',
                castShadow: false
            },
            accent: {
                color: '#7928CA', // Purple gaming RGB
                intensity: 0.6,
                position: [0, 1, -2],
                type: 'spot',
                angle: Math.PI / 4,
                penumbra: 0.3
            },
            ambient: {
                color: '#1a1a2e',
                intensity: 0.3
            },
            environment: {
                type: 'gaming_setup',
                hdri: '/assets/3d/environments/gaming_room.hdr',
                intensity: 0.5
            }
        };
        
        // Tournament arena atmosphere effects
        this.atmosphereEffects = {
            particles: {
                enabled: true,
                type: 'digital_sparks',
                count: 150,
                color: '#00FFFF',
                speed: 0.02,
                size: 0.8
            },
            fog: {
                enabled: true,
                color: '#0a0a1a',
                near: 5,
                far: 15,
                density: 0.05
            },
            bloom: {
                enabled: true,
                strength: 1.5,
                radius: 0.4,
                threshold: 0.85
            },
            screenEffects: {
                scanlines: true,
                glitch: {
                    enabled: true,
                    intensity: 0.1,
                    frequency: 0.02
                }
            }
        };
        
        // Victory gesture animations for tournament wins
        this.animations = {
            // Base animations
            idle: {
                name: 'idle',
                duration: 4000,
                loop: true,
                keyframes: [
                    { time: 0, pose: 'neutral_gaming_stance', weight: 1.0 },
                    { time: 2000, pose: 'slight_controller_adjust', weight: 1.0 },
                    { time: 4000, pose: 'neutral_gaming_stance', weight: 1.0 }
                ],
                blendMode: 'smooth'
            },
            
            emergence: {
                name: 'emergence_from_orb',
                duration: 2500,
                loop: false,
                keyframes: [
                    { time: 0, scale: 0.1, opacity: 0.3, pose: 'compressed' },
                    { time: 800, scale: 0.6, opacity: 0.7, pose: 'expanding' },
                    { time: 1600, scale: 0.9, opacity: 0.9, pose: 'materializing' },
                    { time: 2500, scale: 1.0, opacity: 1.0, pose: 'neutral_gaming_stance' }
                ],
                effects: ['digital_materialization', 'particle_burst']
            },
            
            return_to_orb: {
                name: 'return_to_orb',
                duration: 2000,
                loop: false,
                keyframes: [
                    { time: 0, scale: 1.0, opacity: 1.0, pose: 'neutral_gaming_stance' },
                    { time: 600, scale: 0.8, opacity: 0.8, pose: 'dissolving' },
                    { time: 1200, scale: 0.4, opacity: 0.5, pose: 'compressing' },
                    { time: 2000, scale: 0.1, opacity: 0.0, pose: 'orb_form' }
                ],
                effects: ['digital_dissolution', 'particle_collapse']
            },
            
            // Victory animations for tournament wins
            victory_pose: {
                name: 'tournament_victory',
                duration: 3000,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'neutral_gaming_stance' },
                    { time: 500, pose: 'arms_raising' },
                    { time: 1200, pose: 'victory_arms_up', expression: 'triumphant_smile' },
                    { time: 2000, pose: 'fist_pump', expression: 'confident_grin' },
                    { time: 3000, pose: 'confident_stance', expression: 'satisfied' }
                ],
                effects: ['victory_particles', 'screen_flash'],
                audio: 'victory_cheer'
            },
            
            celebration_gesture: {
                name: 'championship_celebration',
                duration: 4000,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'neutral_gaming_stance' },
                    { time: 800, pose: 'controller_raise', expression: 'excited' },
                    { time: 1600, pose: 'double_fist_pump', expression: 'ecstatic' },
                    { time: 2400, pose: 'arms_spread_wide', expression: 'champion_smile' },
                    { time: 3200, pose: 'pointing_forward', expression: 'confident' },
                    { time: 4000, pose: 'confident_stance', expression: 'determined' }
                ],
                effects: ['championship_confetti', 'neon_pulse'],
                audio: 'crowd_cheer'
            },
            
            gaming_focus: {
                name: 'intense_gaming_moment',
                duration: 2500,
                loop: false,
                keyframes: [
                    { time: 0, pose: 'neutral_gaming_stance' },
                    { time: 600, pose: 'lean_forward', expression: 'focused' },
                    { time: 1200, pose: 'controller_grip_tight', expression: 'intense_concentration' },
                    { time: 1800, pose: 'slight_head_tilt', expression: 'strategic_thinking' },
                    { time: 2500, pose: 'confident_lean_back', expression: 'satisfied_completion' }
                ],
                effects: ['focus_aura', 'controller_glow']
            }
        };
        
        // Cinematic moment configurations
        this.cinematicMoments = {
            tournament_arena_victory: {
                trigger: 'area-2-tournament-arena',
                condition: 'first_tournament_win',
                animation: 'victory_pose',
                dialogue: "YES! That was incredible! You're really getting the hang of this competitive scene. The way you handled that final round... pure skill!",
                duration: 8000,
                lighting: 'tournament_victory',
                effects: ['victory_particles', 'crowd_simulation']
            },
            
            gaming_community_pressure: {
                trigger: 'area-4-gaming-community',
                condition: 'peer_pressure_peak',
                animation: 'gaming_focus',
                dialogue: "Look, I get it - everyone wants those rare items. But we've got to be smart about this. Real gamers earn their gear, they don't fall for sketchy shortcuts.",
                duration: 7500,
                lighting: 'community_warning',
                effects: ['warning_glow', 'community_chatter']
            },
            
            championship_victory: {
                trigger: 'area-6-championship-victory',
                condition: 'final_victory',
                animation: 'celebration_gesture',
                dialogue: "WE DID IT! Champion status achieved! This is what real gaming is about - skill, strategy, and never giving up. You've earned this victory!",
                duration: 10000,
                lighting: 'championship_celebration',
                effects: ['championship_confetti', 'victory_fireworks', 'crowd_roar']
            }
        };
        
        // Performance optimization settings
        this.performanceConfig = {
            lodDistances: [5, 15, 30], // Distance thresholds for LOD switching
            maxParticles: {
                high: 200,
                medium: 100,
                low: 50
            },
            shadowQuality: {
                high: 2048,
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
            }
        };
    }
    
    /**
     * Get lighting configuration for specific cinematic moment
     */
    getLightingForMoment(momentName) {
        const baseLighting = { ...this.lightingConfig };
        
        switch (momentName) {
            case 'tournament_victory':
                baseLighting.primary.intensity = 1.5;
                baseLighting.secondary.color = '#FFD700'; // Gold victory light
                baseLighting.accent.intensity = 1.0;
                break;
                
            case 'community_warning':
                baseLighting.primary.color = '#FF6B35'; // Warning orange
                baseLighting.secondary.intensity = 0.5;
                baseLighting.ambient.intensity = 0.2;
                break;
                
            case 'championship_celebration':
                baseLighting.primary.intensity = 2.0;
                baseLighting.secondary.color = '#FFD700';
                baseLighting.accent.color = '#FF1493';
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
        
        // Check image quality (mock validation)
        referenceImages.forEach((img, index) => {
            if (img.width < this.referenceConfig.imageRequirements.resolution.min) {
                validation.warnings.push(`Image ${index + 1} resolution below recommended: ${img.width}x${img.height}`);
            }
        });
        
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
    module.exports = Eli3DConfig;
} else if (typeof window !== 'undefined') {
    window.Eli3DConfig = Eli3DConfig;
}