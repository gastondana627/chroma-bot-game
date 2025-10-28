/**
 * Gaming Mechanics Loader
 * Ensures all gaming mechanics components are loaded in the correct order
 * Provides integration with existing story progression and cinematic systems
 */

class GamingMechanicsLoader {
    constructor() {
        this.loadedComponents = new Set();
        this.loadingPromises = new Map();
        this.initializationCallbacks = [];
        
        // Component dependencies
        this.dependencies = {
            'story-progression-tracker': [],
            'cinematic-moments-config': [],
            'decision-system-manager': ['story-progression-tracker', 'cinematic-moments-config'],
            'mechanic-router': ['decision-system-manager'],
            'gaming-mechanics-engine': ['decision-system-manager', 'mechanic-router']
        };
        
        // Component paths
        this.componentPaths = {
            'story-progression-tracker': 'Game/Mechanics/story-progression-tracker.js',
            'cinematic-moments-config': 'Game/Mechanics/cinematic-moments-config.js',
            'decision-system-manager': 'Game/Mechanics/decision-system-manager.js',
            'mechanic-router': 'Game/Mechanics/mechanic-router.js',
            'gaming-mechanics-engine': 'Game/Mechanics/gaming-mechanics-engine.js'
        };
    }

    /**
     * Load all gaming mechanics components
     * @returns {Promise<boolean>} Success status
     */
    async loadAll() {
        console.log('🎮 Loading Gaming Mechanics System...');
        
        try {
            // Load components in dependency order
            const loadOrder = this.calculateLoadOrder();
            
            for (const component of loadOrder) {
                await this.loadComponent(component);
            }
            
            // Initialize the gaming engine
            await this.initializeGamingEngine();
            
            console.log('🎮 Gaming Mechanics System loaded successfully');
            
            // Execute initialization callbacks
            this.initializationCallbacks.forEach(callback => {
                try {
                    callback();
                } catch (error) {
                    console.error('Error in initialization callback:', error);
                }
            });
            
            return true;
        } catch (error) {
            console.error('🎮 Failed to load Gaming Mechanics System:', error);
            return false;
        }
    }

    /**
     * Calculate the correct load order based on dependencies
     * @returns {Array} Ordered list of components to load
     */
    calculateLoadOrder() {
        const visited = new Set();
        const visiting = new Set();
        const order = [];
        
        const visit = (component) => {
            if (visiting.has(component)) {
                throw new Error(`Circular dependency detected: ${component}`);
            }
            if (visited.has(component)) {
                return;
            }
            
            visiting.add(component);
            
            const deps = this.dependencies[component] || [];
            deps.forEach(dep => visit(dep));
            
            visiting.delete(component);
            visited.add(component);
            order.push(component);
        };
        
        Object.keys(this.dependencies).forEach(component => visit(component));
        
        return order;
    }

    /**
     * Load a specific component
     * @param {string} component - Component name
     * @returns {Promise<void>}
     */
    async loadComponent(component) {
        if (this.loadedComponents.has(component)) {
            return;
        }
        
        if (this.loadingPromises.has(component)) {
            return this.loadingPromises.get(component);
        }
        
        const loadPromise = this.doLoadComponent(component);
        this.loadingPromises.set(component, loadPromise);
        
        try {
            await loadPromise;
            this.loadedComponents.add(component);
            console.log(`✅ Loaded component: ${component}`);
        } catch (error) {
            console.error(`❌ Failed to load component ${component}:`, error);
            throw error;
        } finally {
            this.loadingPromises.delete(component);
        }
    }

    /**
     * Actually load the component script
     * @param {string} component - Component name
     * @returns {Promise<void>}
     */
    async doLoadComponent(component) {
        // Check if component is already available globally
        if (this.isComponentAvailable(component)) {
            return;
        }
        
        const path = this.componentPaths[component];
        if (!path) {
            throw new Error(`Unknown component: ${component}`);
        }
        
        // Check if script is already loaded
        const existingScript = document.querySelector(`script[src*="${path}"]`);
        if (existingScript) {
            return this.waitForComponent(component);
        }
        
        // Load the script
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = path;
            script.async = false; // Maintain load order
            
            script.onload = () => {
                // Wait for component to be available
                this.waitForComponent(component)
                    .then(resolve)
                    .catch(reject);
            };
            
            script.onerror = () => {
                reject(new Error(`Failed to load script: ${path}`));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * Check if a component is available globally
     * @param {string} component - Component name
     * @returns {boolean} Whether component is available
     */
    isComponentAvailable(component) {
        const globalNames = {
            'story-progression-tracker': 'StoryProgressionTracker',
            'cinematic-moments-config': 'CinematicMomentsManager',
            'decision-system-manager': 'DecisionSystemManager',
            'mechanic-router': 'MechanicRouter',
            'gaming-mechanics-engine': 'GamingMechanicsEngine'
        };
        
        const globalName = globalNames[component];
        return globalName && window[globalName];
    }

    /**
     * Wait for a component to become available
     * @param {string} component - Component name
     * @returns {Promise<void>}
     */
    async waitForComponent(component) {
        const maxWait = 5000; // 5 seconds
        const checkInterval = 50; // 50ms
        let elapsed = 0;
        
        return new Promise((resolve, reject) => {
            const check = () => {
                if (this.isComponentAvailable(component)) {
                    resolve();
                } else if (elapsed >= maxWait) {
                    reject(new Error(`Component ${component} not available after ${maxWait}ms`));
                } else {
                    elapsed += checkInterval;
                    setTimeout(check, checkInterval);
                }
            };
            check();
        });
    }

    /**
     * Initialize the gaming engine after all components are loaded
     * @returns {Promise<void>}
     */
    async initializeGamingEngine() {
        if (!window.GamingMechanicsEngine) {
            throw new Error('GamingMechanicsEngine not available');
        }
        
        // Create global gaming engine instance if it doesn't exist
        if (!window.gamingEngine) {
            window.gamingEngine = new window.GamingMechanicsEngine();
        }
        
        // Initialize the engine
        const success = await window.gamingEngine.initialize({
            enableLogging: true,
            autoSave: true,
            performanceMonitoring: true
        });
        
        if (!success) {
            throw new Error('Failed to initialize gaming engine');
        }
        
        console.log('🎮 Gaming Engine initialized successfully');
    }

    /**
     * Add callback to execute after initialization
     * @param {Function} callback - Callback function
     */
    onInitialized(callback) {
        if (typeof callback === 'function') {
            this.initializationCallbacks.push(callback);
        }
    }

    /**
     * Check if all components are loaded
     * @returns {boolean} Whether all components are loaded
     */
    isFullyLoaded() {
        const requiredComponents = Object.keys(this.dependencies);
        return requiredComponents.every(component => this.loadedComponents.has(component));
    }

    /**
     * Get loading status
     * @returns {Object} Loading status information
     */
    getStatus() {
        const totalComponents = Object.keys(this.dependencies).length;
        const loadedCount = this.loadedComponents.size;
        
        return {
            totalComponents,
            loadedCount,
            loadedComponents: Array.from(this.loadedComponents),
            isFullyLoaded: this.isFullyLoaded(),
            loadingProgress: totalComponents > 0 ? (loadedCount / totalComponents) : 0
        };
    }
}

// Create global loader instance
window.GamingMechanicsLoader = GamingMechanicsLoader;

// Auto-load when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.gamingMechanicsLoader) {
            window.gamingMechanicsLoader = new GamingMechanicsLoader();
            await window.gamingMechanicsLoader.loadAll();
        }
    });
} else {
    if (!window.gamingMechanicsLoader) {
        window.gamingMechanicsLoader = new GamingMechanicsLoader();
        window.gamingMechanicsLoader.loadAll();
    }
}