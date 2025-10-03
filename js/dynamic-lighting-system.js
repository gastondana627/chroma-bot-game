/**
 * Dynamic Lighting and Atmosphere Effects System
 * Implements character-specific lighting themes and atmospheric effects
 * that activate during 3D cinematic moments
 */

class DynamicLightingSystem {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.isActive = false;
        this.currentTheme = null;
        this.activeLights = [];
        this.atmosphereEffects = [];
        this.animationFrameId = null;
        
        // Lighting theme configurations
        this.lightingThemes = {
            // Eli's Gaming Themes
            tournament_arena: {
                name: 'Tournament Arena',
                character: 'eli',
                colors: {
                    primary: '#00FFFF',    // Cyan
                    secondary: '#FF0080',  // Hot Pink
                    accent: '#7928CA',     // Purple
                    ambient: '#1a1a2e'    // Dark Blue
                },
                lights: [
                    {
                        type: 'directional',
                        name: 'arena_main',
                        color: '#00FFFF',
                        intensity: 1.2,
                        position: [5, 10, 5],
                        target: [0, 0, 0],
                        castShadow: true
                    },
                    {
                        type: 'spot',
                        name: 'neon_accent_1',
                        color: '#FF0080',
                        intensity: 0.8,
                        position: [-3, 8, 3],
                        target: [0, 1, 0],
                        angle: Math.PI / 6,
                        penumbra: 0.3
                    },
                    {
                        type: 'spot',
                        name: 'neon_accent_2',
                        color: '#7928CA',
                        intensity: 0.8,
                        position: [3, 8, -3],
                        target: [0, 1, 0],
                        angle: Math.PI / 6,
                        penumbra: 0.3
                    },
                    {
                        type: 'ambient',
                        name: 'arena_ambient',
                        color: '#1a1a2e',
                        intensity: 0.3
                    }
                ],
                effects: [
                    {
                        type: 'neon_glow',
                        colors: ['#00FFFF', '#FF0080'],
                        intensity: 0.7,
                        pulsing: true,
                        speed: 2.0
                    },
                    {
                        type: 'victory_sparkles',
                        count: 50,
                        colors: ['#FFD700', '#00FFFF'],
                        lifetime: 3000,
                        trigger: 'victory_moment'
                    }
                ]
            },
            
            gaming_community: {
                name: 'Gaming Community',
                character: 'eli',
                colors: {
                    primary: '#FF6B6B',    // Coral Red
                    secondary: '#4ECDC4',  // Turquoise
                    accent: '#45B7D1',     // Sky Blue
                    ambient: '#2c3e50'     // Dark Slate
                },
                lights: [
                    {
                        type: 'directional',
                        name: 'community_main',
                        color: '#4ECDC4',
                        intensity: 1.0,
                        position: [0, 10, 8],
                        target: [0, 0, 0],
                        castShadow: true
                    },
                    {
                        type: 'point',
                        name: 'tension_light',
                        color: '#FF6B6B',
                        intensity: 0.6,
                        position: [-5, 5, 0],
                        distance: 15,
                        decay: 2
                    },
                    {
                        type: 'point',
                        name: 'resolve_light',
                        color: '#45B7D1',
                        intensity: 0.8,
                        position: [5, 5, 0],
                        distance: 15,
                        decay: 2
                    }
                ],
                effects: [
                    {
                        type: 'tension_shadows',
                        intensity: 0.5,
                        movement: 'subtle_sway',
                        speed: 1.0
                    },
                    {
                        type: 'resolve_glow',
                        color: '#45B7D1',
                        intensity: 0.6,
                        trigger: 'resolve_moment'
                    }
                ]
            },
            
            championship_victory: {
                name: 'Championship Victory',
                character: 'eli',
                colors: {
                    primary: '#FFD700',    // Gold
                    secondary: '#FFA500',  // Orange
                    accent: '#FF69B4',     // Hot Pink
                    ambient: '#4a4a4a'     // Gray
                },
                lights: [
                    {
                        type: 'directional',
                        name: 'champion_main',
                        color: '#FFD700',
                        intensity: 1.5,
                        position: [0, 15, 0],
                        target: [0, 0, 0],
                        castShadow: true
                    },
                    {
                        type: 'spot',
                        name: 'victory_beam_1',
                        color: '#FFA500',
                        intensity: 1.2,
                        position: [-8, 12, -8],
                        target: [0, 2, 0],
                        angle: Math.PI / 4,
                        penumbra: 0.2
                    },
                    {
                        type: 'spot',
                        name: 'victory_beam_2',
                        color: '#FF69B4',
                        intensity: 1.2,
                        position: [8, 12, 8],
                        target: [0, 2, 0],
                        angle: Math.PI / 4,
                        penumbra: 0.2
                    }
                ],
                effects: [
                    {
                        type: 'golden_aura',
                        color: '#FFD700',
                        intensity: 0.8,
                        radius: 3.0,
                        pulsing: true
                    },
                    {
                        type: 'champion_sparkles',
                        count: 100,
                        colors: ['#FFD700', '#FFA500'],
                        lifetime: 5000,
                        continuous: true
                    },
                    {
                        type: 'victory_beams',
                        count: 6,
                        color: '#FFD700',
                        length: 20,
                        rotation: true
                    }
                ]
            },
            
            // Maya's Investigation Themes
            investigation_mode: {
                name: 'Investigation Mode',
                character: 'maya',
                colors: {
                    primary: '#FF1493',    // Deep Pink
                    secondary: '#00BFFF',  // Deep Sky Blue
                    accent: '#FFFFFF',     // White
                    ambient: '#191970'     // Midnight Blue
                },
                lights: [
                    {
                        type: 'directional',
                        name: 'investigation_main',
                        color: '#00BFFF',
                        intensity: 1.1,
                        position: [3, 8, 5],
                        target: [0, 0, 0],
                        castShadow: true
                    },
                    {
                        type: 'spot',
                        name: 'evidence_spotlight',
                        color: '#FFFFFF',
                        intensity: 1.5,
                        position: [0, 10, 2],
                        target: [0, 0, 0],
                        angle: Math.PI / 8,
                        penumbra: 0.1
                    },
                    {
                        type: 'point',
                        name: 'data_glow',
                        color: '#FF1493',
                        intensity: 0.7,
                        position: [2, 3, 2],
                        distance: 10,
                        decay: 1.5
                    }
                ],
                effects: [
                    {
                        type: 'investigation_glow',
                        color: '#00BFFF',
                        intensity: 0.5,
                        pulsing: true,
                        speed: 1.5
                    },
                    {
                        type: 'data_streams',
                        count: 20,
                        color: '#FF1493',
                        speed: 2.0,
                        direction: 'vertical'
                    }
                ]
            },
            
            cyber_cafe_discovery: {
                name: 'Cyber Cafe Discovery',
                character: 'maya',
                colors: {
                    primary: '#00FFFF',    // Cyan
                    secondary: '#FF69B4',  // Hot Pink
                    accent: '#32CD32',     // Lime Green
                    ambient: '#0f0f23'     // Very Dark Blue
                },
                lights: [
                    {
                        type: 'directional',
                        name: 'cafe_main',
                        color: '#00FFFF',
                        intensity: 1.0,
                        position: [-5, 10, 5],
                        target: [0, 0, 0],
                        castShadow: true
                    },
                    {
                        type: 'point',
                        name: 'discovery_burst',
                        color: '#32CD32',
                        intensity: 1.3,
                        position: [0, 5, 0],
                        distance: 20,
                        decay: 1.0
                    },
                    {
                        type: 'spot',
                        name: 'connection_light',
                        color: '#FF69B4',
                        intensity: 0.9,
                        position: [4, 8, -2],
                        target: [0, 1, 0],
                        angle: Math.PI / 5,
                        penumbra: 0.4
                    }
                ],
                effects: [
                    {
                        type: 'data_revelation',
                        colors: ['#00FFFF', '#32CD32'],
                        intensity: 0.8,
                        expansion: true,
                        speed: 3.0
                    },
                    {
                        type: 'connection_lines',
                        count: 15,
                        color: '#FF69B4',
                        animated: true,
                        pattern: 'network'
                    },
                    {
                        type: 'breakthrough_pulse',
                        color: '#32CD32',
                        intensity: 1.0,
                        radius: 5.0,
                        duration: 2000
                    }
                ]
            },
            
            final_confrontation: {
                name: 'Final Confrontation',
                character: 'maya',
                colors: {
                    primary: '#DC143C',    // Crimson
                    secondary: '#4169E1',  // Royal Blue
                    accent: '#FFD700',     // Gold
                    ambient: '#2f1b14'     // Dark Brown
                },
                lights: [
                    {
                        type: 'directional',
                        name: 'confrontation_main',
                        color: '#4169E1',
                        intensity: 1.3,
                        position: [0, 12, 8],
                        target: [0, 0, 0],
                        castShadow: true
                    },
                    {
                        type: 'spot',
                        name: 'justice_spotlight',
                        color: '#FFD700',
                        intensity: 1.8,
                        position: [0, 15, 0],
                        target: [0, 2, 0],
                        angle: Math.PI / 6,
                        penumbra: 0.1
                    },
                    {
                        type: 'point',
                        name: 'dramatic_accent',
                        color: '#DC143C',
                        intensity: 0.8,
                        position: [-6, 6, -3],
                        distance: 12,
                        decay: 2.0
                    }
                ],
                effects: [
                    {
                        type: 'justice_aura',
                        color: '#FFD700',
                        intensity: 0.9,
                        radius: 4.0,
                        steady: true
                    },
                    {
                        type: 'confrontation_shadows',
                        intensity: 0.7,
                        dramatic: true,
                        movement: 'intense'
                    },
                    {
                        type: 'truth_beams',
                        count: 4,
                        color: '#4169E1',
                        intensity: 1.0,
                        convergent: true
                    }
                ]
            },
            
            // Stanley's Security Themes
            suburban_security_alert: {
                name: 'Suburban Security Alert',
                character: 'stanley',
                colors: {
                    primary: '#9CA3AF',    // Gray
                    secondary: '#FEF3C7',  // Light Yellow
                    accent: '#FCA5A5',     // Light Red
                    ambient: '#374151'     // Dark Gray
                },
                lights: [
                    {
                        type: 'directional',
                        name: 'security_main',
                        color: '#9CA3AF',
                        intensity: 1.0,
                        position: [5, 8, 5],
                        target: [0, 0, 0],
                        castShadow: true
                    },
                    {
                        type: 'point',
                        name: 'warning_light',
                        color: '#FEF3C7',
                        intensity: 0.8,
                        position: [0, 6, 3],
                        distance: 12,
                        decay: 1.5
                    },
                    {
                        type: 'spot',
                        name: 'alert_beam',
                        color: '#FCA5A5',
                        intensity: 0.6,
                        position: [3, 7, 0],
                        target: [0, 0, 0],
                        angle: Math.PI / 4,
                        penumbra: 0.5
                    }
                ],
                effects: [
                    {
                        type: 'warning_glow',
                        color: '#FEF3C7',
                        intensity: 0.4,
                        pulsing: true,
                        speed: 1.0
                    },
                    {
                        type: 'security_scan',
                        color: '#9CA3AF',
                        pattern: 'sweep',
                        speed: 2.0
                    },
                    {
                        type: 'alert_pulse',
                        color: '#FCA5A5',
                        intensity: 0.6,
                        interval: 1500
                    }
                ]
            },
            
            marketplace_protection: {
                name: 'Marketplace Protection',
                character: 'stanley',
                colors: {
                    primary: '#10B981',    // Emerald Green
                    secondary: '#F59E0B',  // Amber
                    accent: '#EF4444',     // Red
                    ambient: '#1f2937'     // Dark Gray
                },
                lights: [
                    {
                        type: 'directional',
                        name: 'protection_main',
                        color: '#10B981',
                        intensity: 1.2,
                        position: [0, 10, 6],
                        target: [0, 0, 0],
                        castShadow: true
                    },
                    {
                        type: 'point',
                        name: 'shield_light',
                        color: '#10B981',
                        intensity: 1.0,
                        position: [0, 4, 0],
                        distance: 15,
                        decay: 1.0
                    },
                    {
                        type: 'spot',
                        name: 'warning_spotlight',
                        color: '#F59E0B',
                        intensity: 0.9,
                        position: [-4, 8, 2],
                        target: [0, 1, 0],
                        angle: Math.PI / 5,
                        penumbra: 0.3
                    }
                ],
                effects: [
                    {
                        type: 'shield_glow',
                        color: '#10B981',
                        intensity: 0.7,
                        radius: 3.5,
                        protective: true
                    },
                    {
                        type: 'protection_barrier',
                        color: '#10B981',
                        opacity: 0.3,
                        animated: true,
                        pattern: 'hexagonal'
                    },
                    {
                        type: 'safety_aura',
                        color: '#F59E0B',
                        intensity: 0.5,
                        warm: true,
                        steady: true
                    }
                ]
            },
            
            community_leadership: {
                name: 'Community Leadership',
                character: 'stanley',
                colors: {
                    primary: '#3B82F6',    // Blue
                    secondary: '#10B981',  // Emerald
                    accent: '#F59E0B',     // Amber
                    ambient: '#1e293b'     // Slate
                },
                lights: [
                    {
                        type: 'directional',
                        name: 'leadership_main',
                        color: '#3B82F6',
                        intensity: 1.4,
                        position: [0, 12, 0],
                        target: [0, 0, 0],
                        castShadow: true
                    },
                    {
                        type: 'point',
                        name: 'community_glow',
                        color: '#10B981',
                        intensity: 0.9,
                        position: [0, 3, 0],
                        distance: 20,
                        decay: 0.8
                    },
                    {
                        type: 'spot',
                        name: 'wisdom_light',
                        color: '#F59E0B',
                        intensity: 1.1,
                        position: [0, 10, 5],
                        target: [0, 2, 0],
                        angle: Math.PI / 3,
                        penumbra: 0.2
                    }
                ],
                effects: [
                    {
                        type: 'leadership_aura',
                        color: '#3B82F6',
                        intensity: 0.8,
                        radius: 4.5,
                        inspiring: true
                    },
                    {
                        type: 'community_glow',
                        color: '#10B981',
                        intensity: 0.6,
                        expansive: true,
                        inclusive: true
                    },
                    {
                        type: 'wisdom_light',
                        color: '#F59E0B',
                        intensity: 0.7,
                        gentle: true,
                        guiding: true
                    }
                ]
            }
        };
        
        // Initialize lighting system
        this.initializeLightingSystem();
    }
    
    /**
     * Initialize the lighting system
     */
    initializeLightingSystem() {
        // Store original scene lighting for restoration
        this.originalLights = [];
        this.scene.traverse((child) => {
            if (child.isLight) {
                this.originalLights.push({
                    light: child,
                    parent: child.parent
                });
            }
        });
        
        console.log('Dynamic Lighting System initialized');
    }
    
    /**
     * Activate lighting theme for cinematic moment
     * @param {string} themeName - Name of lighting theme
     * @param {number} transitionDuration - Duration of transition in ms
     */
    async activateLightingTheme(themeName, transitionDuration = 2000) {
        const theme = this.lightingThemes[themeName];
        if (!theme) {
            console.error(`Unknown lighting theme: ${themeName}`);
            return;
        }
        
        console.log(`Activating lighting theme: ${theme.name}`);
        
        this.isActive = true;
        this.currentTheme = theme;
        
        try {
            // Transition out existing lights
            await this.transitionOutCurrentLights(transitionDuration / 2);
            
            // Create and transition in new lights
            await this.createThemeLights(theme, transitionDuration / 2);
            
            // Start atmosphere effects
            this.startAtmosphereEffects(theme.effects);
            
            console.log(`Lighting theme activated: ${theme.name}`);
            
        } catch (error) {
            console.error('Failed to activate lighting theme:', error);
        }
    }
    
    /**
     * Deactivate current lighting theme
     * @param {number} transitionDuration - Duration of transition in ms
     */
    async deactivateLightingTheme(transitionDuration = 2000) {
        if (!this.isActive || !this.currentTheme) {
            return;
        }
        
        console.log(`Deactivating lighting theme: ${this.currentTheme.name}`);
        
        try {
            // Stop atmosphere effects
            this.stopAtmosphereEffects();
            
            // Transition out theme lights
            await this.transitionOutCurrentLights(transitionDuration / 2);
            
            // Restore original lighting
            await this.restoreOriginalLights(transitionDuration / 2);
            
            this.isActive = false;
            this.currentTheme = null;
            
            console.log('Lighting theme deactivated');
            
        } catch (error) {
            console.error('Failed to deactivate lighting theme:', error);
        }
    }
    
    /**
     * Transition out current lights
     * @param {number} duration - Transition duration
     */
    async transitionOutCurrentLights(duration) {
        const promises = this.activeLights.map(lightData => {
            return this.animateLightProperty(lightData.light, 'intensity', 0, duration);
        });
        
        await Promise.all(promises);
        
        // Remove lights from scene
        this.activeLights.forEach(lightData => {
            this.scene.remove(lightData.light);
        });
        
        this.activeLights = [];
    }
    
    /**
     * Create and transition in theme lights
     * @param {Object} theme - Lighting theme configuration
     * @param {number} duration - Transition duration
     */
    async createThemeLights(theme, duration) {
        const lightPromises = theme.lights.map(async (lightConfig) => {
            const light = this.createLight(lightConfig);
            
            // Start with zero intensity
            light.intensity = 0;
            
            // Add to scene
            this.scene.add(light);
            
            // Store light data
            const lightData = {
                light: light,
                config: lightConfig,
                originalIntensity: lightConfig.intensity
            };
            
            this.activeLights.push(lightData);
            
            // Animate to target intensity
            await this.animateLightProperty(light, 'intensity', lightConfig.intensity, duration);
            
            return lightData;
        });
        
        await Promise.all(lightPromises);
    }
    
    /**
     * Create a Three.js light from configuration
     * @param {Object} config - Light configuration
     * @returns {THREE.Light} Created light
     */
    createLight(config) {
        let light;
        
        switch (config.type) {
            case 'directional':
                light = new THREE.DirectionalLight(config.color, config.intensity);
                light.position.set(...config.position);
                if (config.target) {
                    light.target.position.set(...config.target);
                }
                if (config.castShadow) {
                    light.castShadow = true;
                    light.shadow.mapSize.width = 2048;
                    light.shadow.mapSize.height = 2048;
                }
                break;
                
            case 'spot':
                light = new THREE.SpotLight(config.color, config.intensity, config.distance || 0, config.angle, config.penumbra || 0, config.decay || 1);
                light.position.set(...config.position);
                if (config.target) {
                    light.target.position.set(...config.target);
                }
                if (config.castShadow) {
                    light.castShadow = true;
                }
                break;
                
            case 'point':
                light = new THREE.PointLight(config.color, config.intensity, config.distance || 0, config.decay || 1);
                light.position.set(...config.position);
                if (config.castShadow) {
                    light.castShadow = true;
                }
                break;
                
            case 'ambient':
                light = new THREE.AmbientLight(config.color, config.intensity);
                break;
                
            default:
                console.warn(`Unknown light type: ${config.type}`);
                light = new THREE.AmbientLight(config.color, config.intensity);
        }
        
        light.name = config.name;
        return light;
    }
    
    /**
     * Animate light property over time
     * @param {THREE.Light} light - Light to animate
     * @param {string} property - Property to animate
     * @param {number} targetValue - Target value
     * @param {number} duration - Animation duration
     */
    async animateLightProperty(light, property, targetValue, duration) {
        return new Promise((resolve) => {
            const startValue = light[property];
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Smooth easing
                const easedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
                
                light[property] = startValue + (targetValue - startValue) * easedProgress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    /**
     * Start atmosphere effects
     * @param {Array} effects - Array of effect configurations
     */
    startAtmosphereEffects(effects) {
        if (!effects || !Array.isArray(effects)) return;
        
        effects.forEach(effectConfig => {
            const effect = this.createAtmosphereEffect(effectConfig);
            if (effect) {
                this.atmosphereEffects.push(effect);
            }
        });
        
        // Start effect animation loop
        this.startEffectAnimationLoop();
    }
    
    /**
     * Create atmosphere effect
     * @param {Object} config - Effect configuration
     * @returns {Object} Created effect
     */
    createAtmosphereEffect(config) {
        console.log(`Creating atmosphere effect: ${config.type}`);
        
        // Mock effect creation - in production would create actual particle systems
        const effect = {
            type: config.type,
            config: config,
            active: true,
            startTime: Date.now()
        };
        
        // Initialize effect-specific properties
        switch (config.type) {
            case 'neon_glow':
            case 'investigation_glow':
            case 'shield_glow':
                effect.pulsePhase = 0;
                break;
                
            case 'victory_sparkles':
            case 'champion_sparkles':
                effect.particles = [];
                break;
                
            case 'data_streams':
            case 'connection_lines':
                effect.streams = [];
                break;
        }
        
        return effect;
    }
    
    /**
     * Start effect animation loop
     */
    startEffectAnimationLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        const animate = () => {
            this.updateAtmosphereEffects();
            
            if (this.isActive && this.atmosphereEffects.length > 0) {
                this.animationFrameId = requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    /**
     * Update atmosphere effects
     */
    updateAtmosphereEffects() {
        const currentTime = Date.now();
        
        this.atmosphereEffects.forEach(effect => {
            if (!effect.active) return;
            
            const elapsed = currentTime - effect.startTime;
            
            switch (effect.type) {
                case 'neon_glow':
                case 'investigation_glow':
                case 'shield_glow':
                    this.updateGlowEffect(effect, elapsed);
                    break;
                    
                case 'victory_sparkles':
                case 'champion_sparkles':
                    this.updateSparkleEffect(effect, elapsed);
                    break;
                    
                case 'data_streams':
                case 'connection_lines':
                    this.updateStreamEffect(effect, elapsed);
                    break;
            }
        });
    }
    
    /**
     * Update glow effect
     * @param {Object} effect - Effect object
     * @param {number} elapsed - Elapsed time
     */
    updateGlowEffect(effect, elapsed) {
        if (effect.config.pulsing) {
            const speed = effect.config.speed || 1.0;
            effect.pulsePhase = (elapsed * speed * 0.001) % (Math.PI * 2);
            
            const pulseIntensity = 0.5 + 0.5 * Math.sin(effect.pulsePhase);
            
            // In production, would update actual glow materials
            console.log(`Glow pulse: ${pulseIntensity.toFixed(2)}`);
        }
    }
    
    /**
     * Update sparkle effect
     * @param {Object} effect - Effect object
     * @param {number} elapsed - Elapsed time
     */
    updateSparkleEffect(effect, elapsed) {
        // Mock sparkle animation
        if (elapsed % 100 < 16) { // Roughly 60fps
            console.log(`Sparkles: ${effect.config.count} particles`);
        }
    }
    
    /**
     * Update stream effect
     * @param {Object} effect - Effect object
     * @param {number} elapsed - Elapsed time
     */
    updateStreamEffect(effect, elapsed) {
        // Mock stream animation
        if (elapsed % 50 < 16) { // Roughly 60fps
            console.log(`Data streams: ${effect.config.count} streams`);
        }
    }
    
    /**
     * Stop atmosphere effects
     */
    stopAtmosphereEffects() {
        this.atmosphereEffects.forEach(effect => {
            effect.active = false;
        });
        
        this.atmosphereEffects = [];
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        console.log('Atmosphere effects stopped');
    }
    
    /**
     * Restore original lighting
     * @param {number} duration - Transition duration
     */
    async restoreOriginalLights(duration) {
        const promises = this.originalLights.map(async (lightData) => {
            // Re-add original light to scene
            lightData.parent.add(lightData.light);
            
            // Start with zero intensity
            const originalIntensity = lightData.light.intensity;
            lightData.light.intensity = 0;
            
            // Animate back to original intensity
            await this.animateLightProperty(lightData.light, 'intensity', originalIntensity, duration);
        });
        
        await Promise.all(promises);
    }
    
    /**
     * Get available lighting themes
     * @returns {Array} Array of theme names
     */
    getAvailableThemes() {
        return Object.keys(this.lightingThemes);
    }
    
    /**
     * Get theme by character
     * @param {string} character - Character name
     * @returns {Array} Array of themes for character
     */
    getThemesByCharacter(character) {
        return Object.entries(this.lightingThemes)
            .filter(([_, theme]) => theme.character === character)
            .map(([name, _]) => name);
    }
    
    /**
     * Check if lighting system is active
     * @returns {boolean} Whether system is active
     */
    isLightingActive() {
        return this.isActive;
    }
    
    /**
     * Get current theme
     * @returns {Object|null} Current theme or null
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    /**
     * Trigger specific effect
     * @param {string} effectType - Type of effect to trigger
     * @param {Object} options - Effect options
     */
    triggerEffect(effectType, options = {}) {
        console.log(`Triggering effect: ${effectType}`, options);
        
        // Create temporary effect
        const effectConfig = {
            type: effectType,
            ...options,
            trigger: 'manual'
        };
        
        const effect = this.createAtmosphereEffect(effectConfig);
        if (effect) {
            this.atmosphereEffects.push(effect);
            
            // Auto-remove after duration
            if (options.duration) {
                setTimeout(() => {
                    const index = this.atmosphereEffects.indexOf(effect);
                    if (index > -1) {
                        this.atmosphereEffects.splice(index, 1);
                    }
                }, options.duration);
            }
        }
    }
    
    /**
     * Cleanup lighting system
     */
    cleanup() {
        this.stopAtmosphereEffects();
        
        if (this.isActive) {
            this.deactivateLightingTheme(500);
        }
        
        console.log('Dynamic Lighting System cleaned up');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicLightingSystem;
} else if (typeof window !== 'undefined') {
    window.DynamicLightingSystem = DynamicLightingSystem;
}

console.log('Dynamic Lighting System loaded');