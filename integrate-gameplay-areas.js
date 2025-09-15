/**
 * Gameplay Areas Integration Script
 * Connects the 6-area framework to the main DATA_BLEED application
 */

// Area Configuration for each character
const AREA_CONFIG = {
    maya: {
        areas: [
            { id: 1, name: 'home-base', title: 'Home Base', file: 'area-1-home-base.html' },
            { id: 2, name: 'dating-app', title: 'Dating App Interface', file: 'area-2-dating-app.html' },
            { id: 3, name: 'investigation-hub', title: 'Investigation Hub', file: 'area-3-investigation-hub.html' },
            { id: 4, name: 'cyber-cafe', title: 'Cyber Cafe', file: 'area-4-cyber-cafe.html' },
            { id: 5, name: 'corporate-office', title: 'Corporate Office', file: 'area-5-corporate-office.html' },
            { id: 6, name: 'final-confrontation', title: 'Final Confrontation', file: 'area-6-final-confrontation.html' }
        ],
        theme: {
            primaryColor: '#ff1493',
            secondaryColor: '#00bfff',
            background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a1a2a 100%)'
        }
    },
    eli: {
        areas: [
            { id: 1, name: 'gaming-setup', title: 'Gaming Setup', file: 'area-1-gaming-setup.html' },
            { id: 2, name: 'tournament-arena', title: 'Tournament Arena', file: 'area-2-tournament-arena.html' },
            { id: 3, name: 'gambling-platform', title: 'Gambling Platform', file: 'area-3-gambling-platform.html' },
            { id: 4, name: 'gaming-community', title: 'Gaming Community', file: 'area-4-gaming-community.html' },
            { id: 5, name: 'school-campus', title: 'School/Campus', file: 'area-5-school-campus.html' },
            { id: 6, name: 'championship-victory', title: 'Championship Victory', file: 'area-6-championship-victory.html' }
        ],
        theme: {
            primaryColor: '#00ffff',
            secondaryColor: '#0066ff',
            background: 'radial-gradient(ellipse at center, #0a1a2a 0%, #000810 100%)'
        }
    },
    stanley: {
        areas: [
            { id: 1, name: 'suburban-home', title: 'Suburban Home', file: 'area-1-suburban-home.html' },
            { id: 2, name: 'social-media-maze', title: 'Social Media Maze', file: 'area-2-social-media-maze.html' },
            { id: 3, name: 'financial-district', title: 'Financial District', file: 'area-3-financial-district.html' },
            { id: 4, name: 'digital-marketplace', title: 'Digital Marketplace', file: 'area-4-digital-marketplace.html' },
            { id: 5, name: 'law-enforcement', title: 'Law Enforcement', file: 'area-5-law-enforcement.html' },
            { id: 6, name: 'protection-network', title: 'Protection Network', file: 'area-6-protection-network.html' }
        ],
        theme: {
            primaryColor: '#9ca3af',
            secondaryColor: '#6b7280',
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 30%, #374151 70%, #1f2937 100%)'
        }
    }
};

/**
 * Gameplay Area Manager
 * Handles navigation between areas and integration with main app
 */
class GameplayAreaManager {
    constructor() {
        this.currentCharacter = null;
        this.currentArea = 1;
        this.totalAreas = 6;
        this.gameplayContainer = null;
        this.isInGameplayMode = false;
    }

    /**
     * Initialize gameplay areas for a character
     */
    initializeAreas(character) {
        console.log(`🎮 Initializing gameplay areas for: ${character}`);
        
        this.currentCharacter = character;
        this.currentArea = 1;
        
        // Store in session for persistence
        sessionStorage.setItem('gameplayCharacter', character);
        sessionStorage.setItem('gameplayArea', '1');
        sessionStorage.setItem('gameplayMode', 'true');
        
        this.isInGameplayMode = true;
        
        // Load the first area
        this.loadArea(1);
    }

    /**
     * Load a specific area for the current character
     */
    loadArea(areaNumber) {
        if (!this.currentCharacter || areaNumber < 1 || areaNumber > this.totalAreas) {
            console.error('❌ Invalid area or character not set');
            return;
        }

        const config = AREA_CONFIG[this.currentCharacter];
        const area = config.areas[areaNumber - 1];
        
        if (!area) {
            console.error(`❌ Area ${areaNumber} not found for ${this.currentCharacter}`);
            return;
        }

        console.log(`🗺️ Loading ${this.currentCharacter} Area ${areaNumber}: ${area.title}`);
        
        // Update current area
        this.currentArea = areaNumber;
        sessionStorage.setItem('gameplayArea', areaNumber.toString());
        
        // Load area in iframe or redirect
        const areaPath = `./gameplay-areas/${this.currentCharacter}/${area.file}`;
        
        if (this.gameplayContainer) {
            // Load in container
            this.gameplayContainer.src = areaPath;
        } else {
            // Direct navigation
            window.location.href = areaPath;
        }
    }

    /**
     * Navigate to next area
     */
    nextArea() {
        if (this.currentArea < this.totalAreas) {
            this.loadArea(this.currentArea + 1);
        }
    }

    /**
     * Navigate to previous area
     */
    previousArea() {
        if (this.currentArea > 1) {
            this.loadArea(this.currentArea - 1);
        }
    }

    /**
     * Get area information
     */
    getAreaInfo(character, areaNumber) {
        const config = AREA_CONFIG[character];
        if (!config) return null;
        
        const area = config.areas[areaNumber - 1];
        return area ? { ...area, theme: config.theme } : null;
    }

    /**
     * Get all areas for a character
     */
    getAllAreas(character) {
        const config = AREA_CONFIG[character];
        return config ? config.areas : [];
    }

    /**
     * Check if area exists
     */
    areaExists(character, areaNumber) {
        const config = AREA_CONFIG[character];
        return config && config.areas[areaNumber - 1] !== undefined;
    }

    /**
     * Exit gameplay mode and return to dashboard
     */
    exitGameplay() {
        console.log('🚪 Exiting gameplay mode');
        
        this.isInGameplayMode = false;
        sessionStorage.removeItem('gameplayMode');
        
        // Return to main app dashboard
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                action: 'exit-gameplay',
                character: this.currentCharacter
            }, '*');
        } else {
            window.location.href = './index.html';
        }
    }

    /**
     * Resume from saved progress
     */
    resumeProgress() {
        const savedCharacter = sessionStorage.getItem('gameplayCharacter');
        const savedArea = parseInt(sessionStorage.getItem('gameplayArea')) || 1;
        const isGameplayMode = sessionStorage.getItem('gameplayMode') === 'true';
        
        if (savedCharacter && isGameplayMode) {
            console.log(`🔄 Resuming ${savedCharacter} from Area ${savedArea}`);
            this.currentCharacter = savedCharacter;
            this.currentArea = savedArea;
            this.isInGameplayMode = true;
            return { character: savedCharacter, area: savedArea };
        }
        
        return null;
    }
}

/**
 * Integration with main DATA_BLEED application
 */
function integrateWithMainApp() {
    // Add gameplay area manager to global scope
    window.gameplayAreaManager = new GameplayAreaManager();
    
    // Listen for messages from main app
    window.addEventListener('message', (event) => {
        const { action, character, area } = event.data;
        
        switch (action) {
            case 'start-gameplay':
                window.gameplayAreaManager.initializeAreas(character);
                break;
                
            case 'load-area':
                window.gameplayAreaManager.loadArea(area);
                break;
                
            case 'exit-gameplay':
                window.gameplayAreaManager.exitGameplay();
                break;
        }
    });
    
    // Check for saved progress on load
    const savedProgress = window.gameplayAreaManager.resumeProgress();
    if (savedProgress) {
        console.log('📖 Found saved gameplay progress');
    }
}

/**
 * Enhanced showGameView function for main app integration
 */
function enhancedShowGameView(characterKey) {
    console.log(`🎮 Enhanced Game View for: ${characterKey}`);
    
    // Initialize gameplay areas
    if (window.gameplayAreaManager) {
        window.gameplayAreaManager.initializeAreas(characterKey);
    }
    
    // Original showGameView functionality
    const dashboardView = document.getElementById("dashboard-view");
    const gameView = document.getElementById("game-view");
    
    if (dashboardView) dashboardView.classList.add("hidden");
    if (gameView) gameView.classList.remove("hidden");
    
    // Show gameplay area instead of just HUD
    const gameplayFrame = document.getElementById("gameplay-frame");
    if (gameplayFrame) {
        const areaPath = `./gameplay-areas/${characterKey}/area-1-${AREA_CONFIG[characterKey].areas[0].name}.html`;
        gameplayFrame.src = areaPath;
        gameplayFrame.style.display = "block";
    }
}

/**
 * Create gameplay integration buttons for main app
 */
function createGameplayButtons() {
    // Add "Enter Gameplay" button to each character's dashboard
    const characters = ['maya', 'eli', 'stanley'];
    
    characters.forEach(character => {
        const dashboard = document.getElementById(`${character}-dashboard`);
        if (dashboard) {
            const enterButton = document.createElement('button');
            enterButton.textContent = '🎮 Enter Gameplay Areas';
            enterButton.style.cssText = `
                position: fixed;
                top: 70px;
                left: 20px;
                z-index: 1001;
                padding: 10px 20px;
                background: linear-gradient(135deg, #FF0080 0%, #7928CA 100%);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-family: inherit;
                transition: all 0.3s ease;
            `;
            
            enterButton.addEventListener('click', () => {
                if (window.gameplayAreaManager) {
                    window.gameplayAreaManager.initializeAreas(character);
                }
            });
            
            enterButton.addEventListener('mouseenter', () => {
                enterButton.style.transform = 'translateY(-2px)';
                enterButton.style.boxShadow = '0 4px 12px rgba(255, 0, 128, 0.4)';
            });
            
            enterButton.addEventListener('mouseleave', () => {
                enterButton.style.transform = 'translateY(0)';
                enterButton.style.boxShadow = 'none';
            });
            
            dashboard.appendChild(enterButton);
        }
    });
}

// Initialize integration when script loads
if (typeof window !== 'undefined') {
    integrateWithMainApp();
    
    // Create buttons when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createGameplayButtons);
    } else {
        createGameplayButtons();
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GameplayAreaManager,
        AREA_CONFIG,
        integrateWithMainApp,
        enhancedShowGameView
    };
}

console.log('🎮 Gameplay Areas Integration Script Loaded');