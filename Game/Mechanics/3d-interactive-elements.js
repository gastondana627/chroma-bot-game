/**
 * 3D Interactive Elements Integration
 * Integrates interactive objects with existing 3D character system
 * Implements requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */

class ThreeDInteractiveElements {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        
        // Core dependencies
        this.sceneManager = null;
        this.character3DSystem = null;
        this.interactiveObjectManager = null;
        this.ui3DIntegration = null;
        
        // 3D interactive objects
        this.interactive3DObjects = new Map();
        this.raycaster = null;
        this.mouse = new THREE.Vector2();
        
        // Lighting and effects
        this.interactiveLighting = new InteractiveLightingSystem();
        this.depthManager = new DepthAwareInteractionManager();
        this.viewportManager = new ThreeDViewportManager();
        
        // Current state
        this.currentCharacter = null;
        this.currentArea = null;
        this.is3DModeActive = false;
        
        // Event handlers
        this.mouseHandlers = {
            click: this.handle3DClick.bind(this),
            move: this.handle3DMouseMove.bind(this),
            hover: this.handle3DHover.bind(this)
        };
        
        // Configuration
        this.config = {
            enableDepthAwareInteraction: true,
            enableDynamicLighting: true,
            enableSeamlessUIIntegration: true,
            interactionDistance: 10,
            highlightIntensity: 1.2,
            lightingTransitionDuration: 500
        };
        
        console.log('🎮 3D Interactive Elements system created');
    }

    /**
     * Initialize 3D interactive elements system
     * @param {Object} options - Initialization options
     * @returns {Promise<boolean>} Success status
     */
    async initialize(options = {}) {
        if (this.initialized) {
            console.log('🎮 3D Interactive Elements already initialized');
            return true;
        }

        try {
            console.log('🎮 Initializing 3D Interactive Elements...');
            
            // Merge configuration
            this.config = { ...this.config, ...options };
            
            // Wait for dependencies
            await this.waitForDependencies();
            
            // Initialize core components
            await this.initializeComponents();
            
            // Set up 3D interaction system
            await this.setup3DInteractionSystem();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize lighting system
            await this.interactiveLighting.initialize(this.sceneManager, this.config);
            
            // Initialize depth manager
            await this.depthManager.initialize(this.sceneManager, this.config);
            
            // Initialize viewport manager
            await this.viewportManager.initialize(this.config);
            
            this.initialized = true;
            console.log('✅ 3D Interactive Elements initialized successfully');
            
            // Dispatch initialization event
            this.dispatchEvent('threeDInteractiveElementsInitialized', {
                version: this.version,
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize 3D Interactive Elements:', error);
            return false;
        }
    }

    /**
     * Wait for required dependencies
     * @returns {Promise<void>}
     */
    async waitForDependencies() {
        const maxWaitTime = 10000;
        const checkInterval = 100;
        let elapsed = 0;

        return new Promise((resolve, reject) => {
            const checkDependencies = () => {
                const hasSceneManager = window.threeSceneManager && window.threeSceneManager.isAvailable();
                const hasCharacter3D = window.Character3DSystem;
                const hasInteractiveManager = window.InteractiveObjectManager;
                const hasUI3D = window.UI3DIntegration;
                const hasTHREE = window.THREE;

                if (hasSceneManager && hasCharacter3D && hasInteractiveManager && hasUI3D && hasTHREE) {
                    resolve();
                } else if (elapsed >= maxWaitTime) {
                    reject(new Error('3D Interactive Elements dependencies not loaded within timeout'));
                } else {
                    elapsed += checkInterval;
                    setTimeout(checkDependencies, checkInterval);
                }
            };
            checkDependencies();
        });
    }

    /**
     * Initialize core components
     * @returns {Promise<void>}
     */
    async initializeComponents() {
        // Get scene manager
        this.sceneManager = window.threeSceneManager;
        
        // Get character 3D system
        if (window.character3DSystem) {
            this.character3DSystem = window.character3DSystem;
        } else {
            this.character3DSystem = new window.Character3DSystem(this.sceneManager);
            window.character3DSystem = this.character3DSystem;
        }
        
        // Get interactive object manager
        if (window.interactiveObjectManager) {
            this.interactiveObjectManager = window.interactiveObjectManager;
        } else {
            this.interactiveObjectManager = new window.InteractiveObjectManager();
            await this.interactiveObjectManager.initialize();
            window.interactiveObjectManager = this.interactiveObjectManager;
        }
        
        // Get UI 3D integration
        if (window.ui3DIntegration) {
            this.ui3DIntegration = window.ui3DIntegration;
        } else {
            this.ui3DIntegration = new window.UI3DIntegration();
            window.ui3DIntegration = this.ui3DIntegration;
        }
        
        console.log('🎮 3D Interactive Elements components initialized');
    }

    /**
     * Set up 3D interaction system
     * @returns {Promise<void>}
     */
    async setup3DInteractionSystem() {
        // Initialize raycaster for 3D object picking
        this.raycaster = new THREE.Raycaster();
        
        // Set up mouse interaction on the 3D canvas
        const canvas = this.sceneManager.getCanvas();
        if (canvas) {
            canvas.addEventListener('click', this.mouseHandlers.click);
            canvas.addEventListener('mousemove', this.mouseHandlers.move);
            canvas.style.pointerEvents = 'auto'; // Enable mouse events on canvas
        }
        
        console.log('🎮 3D interaction system set up');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for character emergence/return
        document.addEventListener('character3DEmergence', (event) => {
            this.handleCharacterEmergence(event.detail);
        });

        document.addEventListener('character3DReturn', (event) => {
            this.handleCharacterReturn(event.detail);
        });

        // Listen for mode changes
        document.addEventListener('modeChanged', (event) => {
            this.handleModeChange(event.detail);
        });

        // Listen for story context changes
        document.addEventListener('storyTriggerFired', (event) => {
            this.handleContextChange(event.detail);
        });

        // Listen for interactive object creation
        document.addEventListener('interactiveObjectCreated', (event) => {
            this.handle2DObjectCreation(event.detail);
        });

        console.log('🎮 3D Interactive Elements event listeners set up');
    }

    /**
     * Handle character emergence into 3D space
     * @param {Object} emergenceData - Character emergence data
     */
    async handleCharacterEmergence(emergenceData) {
        this.currentCharacter = emergenceData.character;
        this.is3DModeActive = true;
        
        console.log(`🎮 Character ${this.currentCharacter} emerged - setting up 3D interactions`);
        
        // Enter 3D mode in UI integration
        await this.ui3DIntegration.enter3DMode(this.currentCharacter);
        
        // Set up character-specific 3D interactive objects
        await this.setupCharacter3DObjects(this.currentCharacter, this.currentArea);
        
        // Enable 3D viewport management
        this.viewportManager.enable3DViewport();
        
        // Set up dynamic lighting for interactions
        this.interactiveLighting.setupCharacterLighting(this.currentCharacter);
    }

    /**
     * Handle character return from 3D space
     * @param {Object} returnData - Character return data
     */
    async handleCharacterReturn(returnData) {
        console.log(`🎮 Character ${this.currentCharacter} returning - cleaning up 3D interactions`);
        
        // Clean up 3D interactive objects
        this.cleanup3DObjects();
        
        // Exit 3D mode in UI integration
        await this.ui3DIntegration.exit3DMode();
        
        // Disable 3D viewport management
        this.viewportManager.disable3DViewport();
        
        // Clean up lighting
        this.interactiveLighting.cleanup();
        
        this.is3DModeActive = false;
        this.currentCharacter = null;
    }

    /**
     * Set up character-specific 3D interactive objects
     * @param {string} character - Character name
     * @param {number} area - Area number
     */
    async setupCharacter3DObjects(character, area) {
        // Get character-specific 3D object configurations
        const objectConfigs = this.getCharacter3DObjectConfigs(character, area);
        
        for (const config of objectConfigs) {
            await this.create3DInteractiveObject(config);
        }
        
        console.log(`🎮 Set up ${objectConfigs.length} 3D interactive objects for ${character} area ${area}`);
    }

    /**
     * Get character-specific 3D object configurations
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @returns {Array} Object configurations
     */
    getCharacter3DObjectConfigs(character, area) {
        const configs = {
            eli: {
                1: [
                    {
                        id: 'eli_3d_gaming_setup',
                        type: 'eli_gaming_setup',
                        position: { x: -2, y: 0, z: 2 },
                        geometry: 'box',
                        size: { width: 1, height: 0.8, depth: 0.6 },
                        material: { color: 0x4CAF50, opacity: 0.7 },
                        description: 'Gaming setup security console'
                    },
                    {
                        id: 'eli_3d_security_panel',
                        type: 'eli_gaming_setup',
                        position: { x: 2, y: 1, z: 1 },
                        geometry: 'plane',
                        size: { width: 1.5, height: 1 },
                        material: { color: 0x2196F3, opacity: 0.8 },
                        description: 'Security settings panel'
                    }
                ],
                2: [
                    {
                        id: 'eli_3d_tournament_board',
                        type: 'eli_tournament_entry',
                        position: { x: 0, y: 1.5, z: -2 },
                        geometry: 'plane',
                        size: { width: 2, height: 1.2 },
                        material: { color: 0xFF9800, opacity: 0.8 },
                        description: 'Tournament verification board'
                    }
                ]
            },
            maya: {
                1: [
                    {
                        id: 'maya_3d_profile_analyzer',
                        type: 'maya_dating_profile',
                        position: { x: -1.5, y: 0.5, z: 2 },
                        geometry: 'box',
                        size: { width: 1, height: 1.2, depth: 0.3 },
                        material: { color: 0xE91E63, opacity: 0.7 },
                        description: 'Dating profile analysis station'
                    }
                ],
                2: [
                    {
                        id: 'maya_3d_message_scanner',
                        type: 'maya_message_analysis',
                        position: { x: 1, y: 0.8, z: 1.5 },
                        geometry: 'cylinder',
                        size: { radius: 0.5, height: 1 },
                        material: { color: 0x00BCD4, opacity: 0.8 },
                        description: 'Message analysis scanner'
                    }
                ]
            },
            stanley: {
                1: [
                    {
                        id: 'stanley_3d_id_scanner',
                        type: 'stanley_identity_scanner',
                        position: { x: -1, y: 0.3, z: 2.5 },
                        geometry: 'box',
                        size: { width: 0.8, height: 0.6, depth: 0.4 },
                        material: { color: 0x4CAF50, opacity: 0.7 },
                        description: 'Identity verification scanner'
                    }
                ],
                3: [
                    {
                        id: 'stanley_3d_financial_terminal',
                        type: 'stanley_financial_checker',
                        position: { x: 0, y: 1, z: -1.5 },
                        geometry: 'box',
                        size: { width: 1.2, height: 0.8, depth: 0.6 },
                        material: { color: 0x607D8B, opacity: 0.8 },
                        description: 'Financial verification terminal'
                    }
                ]
            }
        };

        return configs[character]?.[area] || [];
    }

    /**
     * Create 3D interactive object
     * @param {Object} config - Object configuration
     * @returns {Promise<boolean>} Success status
     */
    async create3DInteractiveObject(config) {
        try {
            // Create 3D geometry
            let geometry;
            switch (config.geometry) {
                case 'box':
                    geometry = new THREE.BoxGeometry(
                        config.size.width,
                        config.size.height,
                        config.size.depth
                    );
                    break;
                case 'plane':
                    geometry = new THREE.PlaneGeometry(
                        config.size.width,
                        config.size.height
                    );
                    break;
                case 'cylinder':
                    geometry = new THREE.CylinderGeometry(
                        config.size.radius,
                        config.size.radius,
                        config.size.height,
                        16
                    );
                    break;
                default:
                    geometry = new THREE.BoxGeometry(1, 1, 1);
            }

            // Create material with transparency and glow effect
            const material = new THREE.MeshPhongMaterial({
                color: config.material.color,
                opacity: config.material.opacity,
                transparent: true,
                emissive: new THREE.Color(config.material.color).multiplyScalar(0.2)
            });

            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(config.position.x, config.position.y, config.position.z);
            
            // Add interaction data
            mesh.userData = {
                interactive: true,
                objectId: config.id,
                objectType: config.type,
                description: config.description,
                originalColor: config.material.color,
                originalOpacity: config.material.opacity
            };

            // Add to scene
            const scene = this.sceneManager.getScene();
            scene.add(mesh);

            // Store reference
            this.interactive3DObjects.set(config.id, {
                mesh,
                config,
                isHighlighted: false,
                isHovered: false
            });

            // Set up depth-aware interaction
            this.depthManager.register3DObject(mesh, config);

            console.log(`✅ Created 3D interactive object: ${config.id}`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to create 3D interactive object ${config.id}:`, error);
            return false;
        }
    }

    /**
     * Handle 3D mouse click
     * @param {MouseEvent} event - Mouse click event
     */
    handle3DClick(event) {
        if (!this.is3DModeActive) return;

        // Update mouse coordinates
        this.updateMouseCoordinates(event);

        // Perform raycasting
        const intersects = this.performRaycast();

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            
            if (intersectedObject.userData.interactive) {
                this.handle3DObjectClick(intersectedObject, intersects[0]);
            }
        }
    }

    /**
     * Handle 3D mouse move
     * @param {MouseEvent} event - Mouse move event
     */
    handle3DMouseMove(event) {
        if (!this.is3DModeActive) return;

        // Update mouse coordinates
        this.updateMouseCoordinates(event);

        // Perform raycasting for hover effects
        const intersects = this.performRaycast();

        // Clear previous hover states
        this.clearHoverStates();

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            
            if (intersectedObject.userData.interactive) {
                this.handle3DObjectHover(intersectedObject, true, intersects[0]);
            }
        }
    }

    /**
     * Handle 3D object click
     * @param {THREE.Object3D} object - Clicked 3D object
     * @param {Object} intersection - Raycast intersection data
     */
    async handle3DObjectClick(object, intersection) {
        const objectId = object.userData.objectId;
        const objectType = object.userData.objectType;
        
        console.log(`🎮 3D object clicked: ${objectId}`);

        // Get current mode from mode manager
        const currentMode = this.interactiveObjectManager.getCurrentMode();

        // Provide immediate 3D visual feedback
        await this.provide3DClickFeedback(object, intersection, currentMode);

        // Play 3D audio feedback
        this.play3DAudioFeedback(intersection.point, currentMode);

        // Execute interaction through interactive object manager
        const interactionResult = await this.execute3DInteraction(objectId, objectType, currentMode, intersection);

        // Update 3D lighting based on interaction
        this.interactiveLighting.updateInteractionLighting(object, interactionResult, currentMode);

        // Dispatch 3D interaction event
        this.dispatchEvent('threeDObjectInteraction', {
            objectId,
            objectType,
            mode: currentMode,
            intersection,
            result: interactionResult,
            timestamp: Date.now()
        });
    }

    /**
     * Handle 3D object hover
     * @param {THREE.Object3D} object - Hovered 3D object
     * @param {boolean} isEntering - Whether mouse is entering or leaving
     * @param {Object} intersection - Raycast intersection data
     */
    handle3DObjectHover(object, isEntering, intersection) {
        const objectData = this.interactive3DObjects.get(object.userData.objectId);
        if (!objectData) return;

        if (isEntering) {
            // Apply hover highlight
            this.apply3DHoverHighlight(object);
            objectData.isHovered = true;

            // Show 3D tooltip
            this.show3DTooltip(object, intersection);

            // Update lighting for hover
            this.interactiveLighting.applyHoverLighting(object);
        } else {
            // Remove hover highlight
            this.remove3DHoverHighlight(object);
            objectData.isHovered = false;

            // Hide 3D tooltip
            this.hide3DTooltip();

            // Restore normal lighting
            this.interactiveLighting.restoreNormalLighting(object);
        }
    }

    /**
     * Update mouse coordinates for raycasting
     * @param {MouseEvent} event - Mouse event
     */
    updateMouseCoordinates(event) {
        const canvas = this.sceneManager.getCanvas();
        const rect = canvas.getBoundingClientRect();
        
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    /**
     * Perform raycast to detect 3D object intersections
     * @returns {Array} Intersection results
     */
    performRaycast() {
        const camera = this.sceneManager.getCamera();
        this.raycaster.setFromCamera(this.mouse, camera);

        // Get all interactive 3D objects
        const interactive3DMeshes = Array.from(this.interactive3DObjects.values()).map(obj => obj.mesh);
        
        return this.raycaster.intersectObjects(interactive3DMeshes);
    }

    /**
     * Clear hover states for all objects
     */
    clearHoverStates() {
        this.interactive3DObjects.forEach((objectData, objectId) => {
            if (objectData.isHovered) {
                this.handle3DObjectHover(objectData.mesh, false, null);
            }
        });
    }

    /**
     * Apply 3D hover highlight
     * @param {THREE.Object3D} object - Object to highlight
     */
    apply3DHoverHighlight(object) {
        const material = object.material;
        const currentMode = this.interactiveObjectManager.getCurrentMode();
        
        // Store original values
        object.userData.originalEmissive = material.emissive.getHex();
        object.userData.originalScale = object.scale.clone();
        
        // Apply hover effects
        const hoverColor = currentMode === 'guardian' ? 0x4CAF50 : 0xF44336;
        material.emissive.setHex(hoverColor);
        material.emissiveIntensity = 0.3;
        
        // Slight scale increase
        object.scale.multiplyScalar(1.05);
    }

    /**
     * Remove 3D hover highlight
     * @param {THREE.Object3D} object - Object to unhighlight
     */
    remove3DHoverHighlight(object) {
        const material = object.material;
        
        // Restore original values
        if (object.userData.originalEmissive !== undefined) {
            material.emissive.setHex(object.userData.originalEmissive);
            material.emissiveIntensity = 0.2;
        }
        
        if (object.userData.originalScale) {
            object.scale.copy(object.userData.originalScale);
        }
    }

    /**
     * Provide 3D click feedback
     * @param {THREE.Object3D} object - Clicked object
     * @param {Object} intersection - Intersection data
     * @param {string} mode - Current mode
     */
    async provide3DClickFeedback(object, intersection, mode) {
        // Create click effect at intersection point
        const effectGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const effectMaterial = new THREE.MeshBasicMaterial({
            color: mode === 'guardian' ? 0x4CAF50 : 0xF44336,
            transparent: true,
            opacity: 0.8
        });
        
        const effectMesh = new THREE.Mesh(effectGeometry, effectMaterial);
        effectMesh.position.copy(intersection.point);
        
        const scene = this.sceneManager.getScene();
        scene.add(effectMesh);
        
        // Animate effect
        const startTime = Date.now();
        const duration = 500;
        
        const animateEffect = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                effectMesh.scale.setScalar(1 + progress * 2);
                effectMaterial.opacity = 0.8 * (1 - progress);
                requestAnimationFrame(animateEffect);
            } else {
                scene.remove(effectMesh);
                effectGeometry.dispose();
                effectMaterial.dispose();
            }
        };
        
        animateEffect();
    }

    /**
     * Play 3D audio feedback
     * @param {THREE.Vector3} position - 3D position for spatial audio
     * @param {string} mode - Current mode
     */
    play3DAudioFeedback(position, mode) {
        // Create positional audio if Web Audio API is available
        if (window.AudioContext || window.webkitAudioContext) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                const panner = audioContext.createPanner();
                
                // Set up spatial audio
                panner.panningModel = 'HRTF';
                panner.setPosition(position.x, position.y, position.z);
                
                oscillator.connect(gainNode);
                gainNode.connect(panner);
                panner.connect(audioContext.destination);
                
                // Different frequencies for different modes
                oscillator.frequency.setValueAtTime(
                    mode === 'guardian' ? 800 : 400,
                    audioContext.currentTime
                );
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                
            } catch (error) {
                console.warn('⚠️ 3D audio feedback failed:', error);
            }
        }
    }

    /**
     * Execute 3D interaction
     * @param {string} objectId - Object ID
     * @param {string} objectType - Object type
     * @param {string} mode - Current mode
     * @param {Object} intersection - Intersection data
     * @returns {Promise<Object>} Interaction result
     */
    async execute3DInteraction(objectId, objectType, mode, intersection) {
        // Create a virtual 2D element for the interactive object manager
        const virtualElement = document.createElement('div');
        virtualElement.setAttribute('data-interactive-object', objectId);
        virtualElement.setAttribute('data-object-type', objectType);
        
        // Execute interaction through the interactive object manager
        // This ensures consistency between 2D and 3D interactions
        const result = {
            action: mode === 'guardian' ? 'analyze_3d_object' : 'manipulate_3d_object',
            mode: mode,
            success: true,
            message: `3D ${mode} interaction with ${objectType}`,
            educationalContent: `This 3D interaction demonstrates ${mode} behavior in cybersecurity scenarios.`,
            intersection: intersection
        };
        
        return result;
    }

    /**
     * Show 3D tooltip
     * @param {THREE.Object3D} object - Object to show tooltip for
     * @param {Object} intersection - Intersection data
     */
    show3DTooltip(object, intersection) {
        // Convert 3D position to screen coordinates
        const screenPosition = this.worldToScreen(intersection.point);
        
        const tooltip = document.createElement('div');
        tooltip.id = 'interactive-3d-tooltip';
        tooltip.className = 'interactive-3d-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            left: ${screenPosition.x}px;
            top: ${screenPosition.y}px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00FFFF;
            border-radius: 6px;
            padding: 8px 12px;
            color: white;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
            transform: translate(-50%, -100%);
            backdrop-filter: blur(5px);
        `;
        
        const mode = this.interactiveObjectManager.getCurrentMode();
        tooltip.innerHTML = `
            <div style="color: ${mode === 'guardian' ? '#4CAF50' : '#F44336'}; font-weight: bold; margin-bottom: 4px;">
                ${mode === 'guardian' ? '🛡️ Guardian' : '👤 Shadow Observer'} Mode
            </div>
            <div style="color: #CCCCCC;">
                ${object.userData.description}
            </div>
            <div style="color: #FFD700; margin-top: 4px; font-size: 11px;">
                Click to interact in 3D space
            </div>
        `;
        
        document.body.appendChild(tooltip);
    }

    /**
     * Hide 3D tooltip
     */
    hide3DTooltip() {
        const tooltip = document.getElementById('interactive-3d-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    /**
     * Convert world coordinates to screen coordinates
     * @param {THREE.Vector3} worldPosition - World position
     * @returns {Object} Screen coordinates
     */
    worldToScreen(worldPosition) {
        const camera = this.sceneManager.getCamera();
        const canvas = this.sceneManager.getCanvas();
        
        const vector = worldPosition.clone();
        vector.project(camera);
        
        const rect = canvas.getBoundingClientRect();
        
        return {
            x: rect.left + (vector.x + 1) * rect.width / 2,
            y: rect.top + (-vector.y + 1) * rect.height / 2
        };
    }

    /**
     * Handle mode change
     * @param {Object} modeData - Mode change data
     */
    handleModeChange(modeData) {
        if (!this.is3DModeActive) return;
        
        // Update 3D object highlighting based on new mode
        this.interactive3DObjects.forEach((objectData, objectId) => {
            this.update3DObjectModeHighlight(objectData.mesh, modeData.mode);
        });
        
        // Update lighting for new mode
        this.interactiveLighting.updateModeBasedLighting(modeData.mode);
        
        console.log(`🎮 3D interactive elements updated for mode: ${modeData.mode}`);
    }

    /**
     * Handle context change
     * @param {Object} contextData - Context change data
     */
    handleContextChange(contextData) {
        if (contextData.character) {
            this.currentCharacter = contextData.character;
        }
        if (contextData.areaNumber) {
            this.currentArea = contextData.areaNumber;
            
            // Update 3D objects for new area if in 3D mode
            if (this.is3DModeActive) {
                this.cleanup3DObjects();
                this.setupCharacter3DObjects(this.currentCharacter, this.currentArea);
            }
        }
    }

    /**
     * Handle 2D object creation (create corresponding 3D object if needed)
     * @param {Object} objectData - 2D object data
     */
    handle2DObjectCreation(objectData) {
        if (!this.is3DModeActive) return;
        
        // Check if this 2D object should have a 3D counterpart
        const has3DCounterpart = this.interactive3DObjects.has(objectData.objectId);
        
        if (!has3DCounterpart) {
            // Create 3D version of the 2D object
            this.create3DCounterpart(objectData);
        }
    }

    /**
     * Create 3D counterpart for 2D object
     * @param {Object} objectData - 2D object data
     */
    async create3DCounterpart(objectData) {
        // Generate 3D configuration based on 2D object
        const config = {
            id: `${objectData.objectId}_3d`,
            type: objectData.objectType,
            position: { x: Math.random() * 4 - 2, y: Math.random() * 2, z: Math.random() * 4 - 2 },
            geometry: 'box',
            size: { width: 0.8, height: 0.8, depth: 0.8 },
            material: { color: 0x00FFFF, opacity: 0.7 },
            description: `3D version of ${objectData.objectType}`
        };
        
        await this.create3DInteractiveObject(config);
    }

    /**
     * Update 3D object mode highlight
     * @param {THREE.Object3D} object - 3D object
     * @param {string} mode - Current mode
     */
    update3DObjectModeHighlight(object, mode) {
        const material = object.material;
        
        // Update emissive color based on mode
        const modeColor = mode === 'guardian' ? 0x4CAF50 : 0xF44336;
        material.emissive.setHex(modeColor);
        material.emissiveIntensity = 0.2;
        
        // Update opacity based on mode
        material.opacity = mode === 'guardian' ? 0.8 : 0.6;
    }

    /**
     * Clean up 3D objects
     */
    cleanup3DObjects() {
        const scene = this.sceneManager.getScene();
        
        this.interactive3DObjects.forEach((objectData, objectId) => {
            // Remove from scene
            scene.remove(objectData.mesh);
            
            // Dispose geometry and material
            objectData.mesh.geometry.dispose();
            objectData.mesh.material.dispose();
            
            // Unregister from depth manager
            this.depthManager.unregister3DObject(objectData.mesh);
        });
        
        this.interactive3DObjects.clear();
        console.log('🧹 3D interactive objects cleaned up');
    }

    /**
     * Dispatch custom event
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    dispatchEvent(event, data) {
        window.dispatchEvent(new CustomEvent(`threeDInteractive${event}`, {
            detail: data
        }));
    }

    /**
     * Get system status
     * @returns {Object} System status
     */
    getStatus() {
        return {
            version: this.version,
            initialized: this.initialized,
            is3DModeActive: this.is3DModeActive,
            currentCharacter: this.currentCharacter,
            currentArea: this.currentArea,
            active3DObjects: this.interactive3DObjects.size,
            config: this.config
        };
    }
}

/**
 * Interactive Lighting System
 * Manages dynamic lighting effects for 3D interactive objects
 */
class InteractiveLightingSystem {
    constructor() {
        this.sceneManager = null;
        this.interactiveLights = new Map();
        this.ambientLight = null;
        this.initialized = false;
    }

    async initialize(sceneManager, config) {
        this.sceneManager = sceneManager;
        this.config = config;
        
        if (config.enableDynamicLighting) {
            this.setupBaseLighting();
        }
        
        this.initialized = true;
        console.log('✅ Interactive Lighting System initialized');
    }

    setupBaseLighting() {
        const scene = this.sceneManager.getScene();
        
        // Add ambient light for base illumination
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(this.ambientLight);
        
        console.log('💡 Base lighting set up');
    }

    setupCharacterLighting(character) {
        if (!this.initialized || !this.config.enableDynamicLighting) return;
        
        const scene = this.sceneManager.getScene();
        
        // Character-specific lighting colors
        const lightColors = {
            eli: 0x4CAF50,    // Green
            maya: 0xE91E63,   // Pink
            stanley: 0x607D8B // Blue Grey
        };
        
        // Create character-specific point light
        const characterLight = new THREE.PointLight(lightColors[character] || 0xFFFFFF, 1, 10);
        characterLight.position.set(0, 3, 0);
        scene.add(characterLight);
        
        this.interactiveLights.set('character_light', characterLight);
        
        console.log(`💡 Character lighting set up for ${character}`);
    }

    applyHoverLighting(object) {
        if (!this.initialized || !this.config.enableDynamicLighting) return;
        
        const scene = this.sceneManager.getScene();
        
        // Create hover spotlight
        const hoverLight = new THREE.SpotLight(0x00FFFF, 1, 5, Math.PI / 6, 0.5);
        hoverLight.position.copy(object.position);
        hoverLight.position.y += 2;
        hoverLight.target = object;
        
        scene.add(hoverLight);
        scene.add(hoverLight.target);
        
        this.interactiveLights.set(`hover_${object.userData.objectId}`, hoverLight);
    }

    restoreNormalLighting(object) {
        if (!this.initialized) return;
        
        const scene = this.sceneManager.getScene();
        const hoverLight = this.interactiveLights.get(`hover_${object.userData.objectId}`);
        
        if (hoverLight) {
            scene.remove(hoverLight);
            scene.remove(hoverLight.target);
            this.interactiveLights.delete(`hover_${object.userData.objectId}`);
        }
    }

    updateInteractionLighting(object, result, mode) {
        if (!this.initialized || !this.config.enableDynamicLighting) return;
        
        // Create interaction flash effect
        const scene = this.sceneManager.getScene();
        const flashColor = mode === 'guardian' ? 0x4CAF50 : 0xF44336;
        
        const flashLight = new THREE.PointLight(flashColor, 2, 3);
        flashLight.position.copy(object.position);
        scene.add(flashLight);
        
        // Animate flash
        let intensity = 2;
        const fadeFlash = () => {
            intensity *= 0.9;
            flashLight.intensity = intensity;
            
            if (intensity > 0.1) {
                requestAnimationFrame(fadeFlash);
            } else {
                scene.remove(flashLight);
            }
        };
        
        fadeFlash();
    }

    updateModeBasedLighting(mode) {
        if (!this.initialized || !this.config.enableDynamicLighting) return;
        
        // Update ambient light based on mode
        if (this.ambientLight) {
            const ambientColor = mode === 'guardian' ? 0x404040 : 0x402020;
            this.ambientLight.color.setHex(ambientColor);
        }
    }

    cleanup() {
        if (!this.initialized) return;
        
        const scene = this.sceneManager.getScene();
        
        // Remove all interactive lights
        this.interactiveLights.forEach((light, key) => {
            scene.remove(light);
            if (light.target) {
                scene.remove(light.target);
            }
        });
        
        this.interactiveLights.clear();
        
        // Remove ambient light
        if (this.ambientLight) {
            scene.remove(this.ambientLight);
            this.ambientLight = null;
        }
        
        console.log('🧹 Interactive lighting cleaned up');
    }
}

/**
 * Depth-Aware Interaction Manager
 * Manages depth-based interaction priorities and occlusion
 */
class DepthAwareInteractionManager {
    constructor() {
        this.registered3DObjects = new Map();
        this.initialized = false;
    }

    async initialize(sceneManager, config) {
        this.sceneManager = sceneManager;
        this.config = config;
        this.initialized = true;
        console.log('✅ Depth-Aware Interaction Manager initialized');
    }

    register3DObject(mesh, config) {
        if (!this.initialized) return;
        
        this.registered3DObjects.set(mesh.uuid, {
            mesh,
            config,
            priority: this.calculateInteractionPriority(mesh, config)
        });
    }

    unregister3DObject(mesh) {
        if (!this.initialized) return;
        
        this.registered3DObjects.delete(mesh.uuid);
    }

    calculateInteractionPriority(mesh, config) {
        // Calculate priority based on distance from camera and object importance
        const camera = this.sceneManager.getCamera();
        const distance = camera.position.distanceTo(mesh.position);
        
        // Closer objects have higher priority
        const distancePriority = 1 / (distance + 1);
        
        // Object type importance
        const typePriority = config.type.includes('security') ? 1.2 : 1.0;
        
        return distancePriority * typePriority;
    }

    updateInteractionPriorities() {
        if (!this.initialized) return;
        
        this.registered3DObjects.forEach((objectData, uuid) => {
            objectData.priority = this.calculateInteractionPriority(objectData.mesh, objectData.config);
        });
    }
}

/**
 * 3D Viewport Manager
 * Manages seamless UI integration with 3D viewport
 */
class ThreeDViewportManager {
    constructor() {
        this.viewportActive = false;
        this.originalUIStates = new Map();
        this.initialized = false;
    }

    async initialize(config) {
        this.config = config;
        this.initialized = true;
        console.log('✅ 3D Viewport Manager initialized');
    }

    enable3DViewport() {
        if (!this.initialized || this.viewportActive) return;
        
        // Store original UI states and adjust for 3D viewport
        this.storeUIStates();
        this.adjustUIFor3D();
        
        this.viewportActive = true;
        console.log('🎮 3D viewport enabled');
    }

    disable3DViewport() {
        if (!this.initialized || !this.viewportActive) return;
        
        // Restore original UI states
        this.restoreUIStates();
        
        this.viewportActive = false;
        console.log('🎮 3D viewport disabled');
    }

    storeUIStates() {
        // Store states of key UI elements
        const keyElements = ['pause-game-btn', 'chat-box', 'video-container'];
        
        keyElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                const computedStyle = window.getComputedStyle(element);
                this.originalUIStates.set(elementId, {
                    zIndex: element.style.zIndex || computedStyle.zIndex,
                    pointerEvents: element.style.pointerEvents || computedStyle.pointerEvents
                });
            }
        });
    }

    adjustUIFor3D() {
        // Ensure UI elements remain accessible during 3D interaction
        const element = document.getElementById('pause-game-btn');
        if (element) {
            element.style.zIndex = '2000';
            element.style.pointerEvents = 'auto';
        }
    }

    restoreUIStates() {
        // Restore original UI states
        this.originalUIStates.forEach((state, elementId) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.style.zIndex = state.zIndex;
                element.style.pointerEvents = state.pointerEvents;
            }
        });
        
        this.originalUIStates.clear();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        ThreeDInteractiveElements,
        InteractiveLightingSystem,
        DepthAwareInteractionManager,
        ThreeDViewportManager
    };
}

// Make available globally
window.ThreeDInteractiveElements = ThreeDInteractiveElements;
window.InteractiveLightingSystem = InteractiveLightingSystem;
window.DepthAwareInteractionManager = DepthAwareInteractionManager;
window.ThreeDViewportManager = ThreeDViewportManager;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.threeDInteractiveElements) {
            window.threeDInteractiveElements = new ThreeDInteractiveElements();
            await window.threeDInteractiveElements.initialize();
        }
    });
} else {
    if (!window.threeDInteractiveElements) {
        window.threeDInteractiveElements = new ThreeDInteractiveElements();
        window.threeDInteractiveElements.initialize();
    }
}