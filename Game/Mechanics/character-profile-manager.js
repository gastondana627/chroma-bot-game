/**
 * Character Profile Manager
 * 
 * Manages character-specific horror profiles including loading, validation,
 * caching, and switching between different character configurations.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

class CharacterProfileManager {
    constructor() {
        this.profiles = new Map();
        this.currentProfile = null;
        this.currentCharacter = null;
        this.initialized = false;
    }

    /**
     * Initialize the profile manager and load all character profiles
     * @returns {Promise<boolean>} Success status
     */
    async initialize() {
        try {
            // Load all character profiles
            await this.loadProfile('maya');
            await this.loadProfile('eli');
            await this.loadProfile('stanley');
            
            this.initialized = true;
            console.log('[CharacterProfileManager] Initialized with', this.profiles.size, 'profiles');
            return true;
        } catch (error) {
            console.error('[CharacterProfileManager] Initialization failed:', error);
            return false;
        }
    }

    /**
     * Load a character profile
     * @param {string} character - Character name ('maya', 'eli', 'stanley')
     * @returns {Promise<Object>} Loaded profile
     */
    async loadProfile(character) {
        // Check if already cached
        if (this.profiles.has(character)) {
            console.log(`[CharacterProfileManager] Profile '${character}' loaded from cache`);
            return this.profiles.get(character);
        }

        try {
            // Get profile configuration
            const profile = this.getProfileConfiguration(character);
            
            // Validate profile
            if (!this.validateProfile(profile)) {
                throw new Error(`Invalid profile configuration for ${character}`);
            }

            // Cache the profile
            this.profiles.set(character, profile);
            console.log(`[CharacterProfileManager] Profile '${character}' loaded and cached`);
            
            return profile;
        } catch (error) {
            console.error(`[CharacterProfileManager] Failed to load profile '${character}':`, error);
            throw error;
        }
    }

    /**
     * Get profile configuration for a character
     * @param {string} character - Character name
     * @returns {Object} Profile configuration
     */
    getProfileConfiguration(character) {
        const profiles = {
            'maya': this.getMayaProfile(),
            'eli': this.getEliProfile(),
            'stanley': this.getStanleyProfile()
        };

        const profile = profiles[character.toLowerCase()];
        if (!profile) {
            throw new Error(`Unknown character: ${character}`);
        }

        return profile;
    }

    /**
     * Get Maya character profile
     * @returns {Object} Maya profile configuration
     */
    getMayaProfile() {
        return {
            character: 'maya',
            aesthetic: 'mobile-modern',
            glitchStyle: 'smooth-morphing',
            colorPalette: {
                safe: ['#FFB6C1', '#87CEEB', '#98FB98'],
                corrupted: ['#8B008B', '#4B0082', '#2F4F4F']
            },
            cssFilters: {
                0: 'none',
                1: 'hue-rotate(2deg) saturate(1.05)',
                2: 'hue-rotate(5deg) saturate(1.3) brightness(0.95)',
                3: 'hue-rotate(15deg) saturate(0.5) contrast(1.5)',
                4: 'invert(0.3) saturate(2) contrast(2)'
            },
            targetElements: [
                '.profile-image',
                '.chat-message',
                '.dating-app-ui',
                '.notification',
                '.message-bubble',
                '.user-avatar'
            ],
            glitchProfiles: {
                0: [],
                1: ['subtle-flicker', 'text-double'],
                2: ['face-morph', 'color-shift', 'ui-drift'],
                3: ['reality-tear', 'deep-glitch', 'photo-corruption'],
                4: ['nightmare-mode', 'face-distortion', 'reality-collapse']
            }
        };
    }

    /**
     * Get Eli character profile
     * @returns {Object} Eli profile configuration
     */
    getEliProfile() {
        return {
            character: 'eli',
            aesthetic: 'gaming-neon',
            glitchStyle: 'pixel-corruption',
            colorPalette: {
                safe: ['#00FFFF', '#FF00FF', '#00FF00'],
                corrupted: ['#FF0000', '#000000', '#8B0000']
            },
            cssFilters: {
                0: 'none',
                1: 'saturate(1.2) brightness(1.05)',
                2: 'saturate(1.5) contrast(1.2) brightness(1.1)',
                3: 'saturate(2) contrast(1.5) hue-rotate(10deg)',
                4: 'saturate(3) contrast(2) hue-rotate(20deg) blur(1px)'
            },
            targetElements: [
                '.discord-message',
                '.game-overlay',
                '.avatar-image',
                '.stream-window',
                '.chat-window',
                '.game-ui'
            ],
            glitchProfiles: {
                0: [],
                1: ['pixel-flicker', 'scan-line'],
                2: ['neon-distort', 'rgb-split', 'screen-tear'],
                3: ['pixel-corruption', 'color-bleed', 'signal-loss'],
                4: ['digital-breakdown', 'screen-melt', 'data-corruption']
            }
        };
    }

    /**
     * Get Stanley character profile
     * @returns {Object} Stanley profile configuration
     */
    getStanleyProfile() {
        return {
            character: 'stanley',
            aesthetic: 'desktop-vintage',
            glitchStyle: 'crt-analog',
            colorPalette: {
                safe: ['#4267B2', '#898F9C', '#E4E6EB'],
                corrupted: ['#2C2C2C', '#1C1C1C', '#0C0C0C']
            },
            cssFilters: {
                0: 'none',
                1: 'saturate(0.9) sepia(0.1)',
                2: 'saturate(0.7) sepia(0.3) contrast(1.1)',
                3: 'saturate(0.5) sepia(0.5) contrast(1.3)',
                4: 'saturate(0.3) sepia(0.7) contrast(1.5) blur(0.5px)'
            },
            targetElements: [
                '.facebook-post',
                '.profile-photo',
                '.friend-request',
                '.message-thread',
                '.news-feed',
                '.timeline-post'
            ],
            glitchProfiles: {
                0: [],
                1: ['crt-flicker', 'static-noise'],
                2: ['vhs-distort', 'tracking-error', 'color-bleed'],
                3: ['signal-interference', 'analog-corruption', 'screen-roll'],
                4: ['total-breakdown', 'white-noise', 'signal-death']
            }
        };
    }

    /**
     * Validate a profile configuration
     * @param {Object} profile - Profile to validate
     * @returns {boolean} Validation result
     */
    validateProfile(profile) {
        // Check required fields
        const requiredFields = [
            'character',
            'aesthetic',
            'glitchStyle',
            'colorPalette',
            'cssFilters',
            'targetElements',
            'glitchProfiles'
        ];

        for (const field of requiredFields) {
            if (!profile[field]) {
                console.error(`[CharacterProfileManager] Missing required field: ${field}`);
                return false;
            }
        }

        // Validate color palette
        if (!profile.colorPalette.safe || !profile.colorPalette.corrupted) {
            console.error('[CharacterProfileManager] Invalid color palette structure');
            return false;
        }

        // Validate CSS filters (must have entries for intensity 0-4)
        for (let i = 0; i <= 4; i++) {
            if (profile.cssFilters[i] === undefined) {
                console.error(`[CharacterProfileManager] Missing CSS filter for intensity ${i}`);
                return false;
            }
        }

        // Validate glitch profiles (must have entries for intensity 0-4)
        for (let i = 0; i <= 4; i++) {
            if (!Array.isArray(profile.glitchProfiles[i])) {
                console.error(`[CharacterProfileManager] Invalid glitch profile for intensity ${i}`);
                return false;
            }
        }

        // Validate target elements
        if (!Array.isArray(profile.targetElements) || profile.targetElements.length === 0) {
            console.error('[CharacterProfileManager] Invalid target elements');
            return false;
        }

        return true;
    }

    /**
     * Switch to a different character profile
     * @param {string} character - Character name to switch to
     * @returns {Promise<Object>} New active profile
     */
    async switchProfile(character) {
        try {
            // Load profile if not cached
            const profile = await this.loadProfile(character);

            // Store previous character for cleanup
            const previousCharacter = this.currentCharacter;

            // Perform cleanup of previous profile
            if (previousCharacter && previousCharacter !== character) {
                this.cleanupProfile(previousCharacter);
            }

            // Set new profile as current
            this.currentProfile = profile;
            this.currentCharacter = character;

            // Dispatch profile change event
            this.dispatchProfileChangeEvent(previousCharacter, character);

            console.log(`[CharacterProfileManager] Switched to profile: ${character}`);
            return profile;
        } catch (error) {
            console.error(`[CharacterProfileManager] Failed to switch profile to '${character}':`, error);
            throw error;
        }
    }

    /**
     * Cleanup previous profile effects
     * @param {string} character - Character to cleanup
     */
    cleanupProfile(character) {
        const profile = this.profiles.get(character);
        if (!profile) return;

        // Remove character-specific CSS classes
        const elements = document.querySelectorAll(profile.targetElements.join(','));
        elements.forEach(element => {
            // Remove any horror-related classes
            element.classList.forEach(className => {
                if (className.includes('horror-') || className.includes('glitch-')) {
                    element.classList.remove(className);
                }
            });

            // Reset filters
            element.style.filter = '';
        });

        console.log(`[CharacterProfileManager] Cleaned up profile: ${character}`);
    }

    /**
     * Dispatch profile change event
     * @param {string} previousCharacter - Previous character
     * @param {string} newCharacter - New character
     */
    dispatchProfileChangeEvent(previousCharacter, newCharacter) {
        const event = new CustomEvent('horrorProfileChanged', {
            detail: {
                previous: previousCharacter,
                current: newCharacter,
                profile: this.currentProfile,
                timestamp: Date.now()
            }
        });

        window.dispatchEvent(event);
        console.log(`[CharacterProfileManager] Dispatched profile change event: ${previousCharacter} -> ${newCharacter}`);
    }

    /**
     * Get current active profile
     * @returns {Object|null} Current profile or null
     */
    getCurrentProfile() {
        return this.currentProfile;
    }

    /**
     * Get current character name
     * @returns {string|null} Current character or null
     */
    getCurrentCharacter() {
        return this.currentCharacter;
    }

    /**
     * Get profile for specific character (from cache)
     * @param {string} character - Character name
     * @returns {Object|null} Profile or null if not loaded
     */
    getProfile(character) {
        return this.profiles.get(character) || null;
    }

    /**
     * Check if a profile is loaded
     * @param {string} character - Character name
     * @returns {boolean} True if loaded
     */
    isProfileLoaded(character) {
        return this.profiles.has(character);
    }

    /**
     * Get all loaded profile names
     * @returns {Array<string>} Array of character names
     */
    getLoadedProfiles() {
        return Array.from(this.profiles.keys());
    }

    /**
     * Clear profile cache
     */
    clearCache() {
        this.profiles.clear();
        this.currentProfile = null;
        this.currentCharacter = null;
        console.log('[CharacterProfileManager] Cache cleared');
    }

    /**
     * Get manager status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            initialized: this.initialized,
            currentCharacter: this.currentCharacter,
            loadedProfiles: this.getLoadedProfiles(),
            profileCount: this.profiles.size
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterProfileManager;
}
