/**
 * Mode Selection Interface
 * Provides UI for selecting Guardian or Shadow Observer modes
 */

class ModeSelectionInterface {
    constructor(modeManager) {
        this.modeManager = modeManager;
        this.isVisible = false;
        this.currentCharacter = null;
        this.currentArea = null;
        this.selectionCallbacks = [];
        
        this.initializeInterface();
    }

    /**
     * Show mode selection interface
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @param {Object} options - Additional options
     */
    async show(character, area, options = {}) {
        this.currentCharacter = character;
        this.currentArea = area;
        
        const interface = this.createModeSelectionUI(character, area, options);
        document.body.appendChild(interface);
        
        this.isVisible = true;
        
        // Animate entrance
        await this.animateEntrance(interface);
        
        return new Promise((resolve) => {
            this.selectionCallbacks.push(resolve);
        });
    }

    /**
     * Hide mode selection interface
     */
    async hide() {
        const interface = document.querySelector('.mode-selection-interface');
        if (interface) {
            await this.animateExit(interface);
            interface.remove();
        }
        this.isVisible = false;
    }

    /**
     * Create the mode selection UI
     */
    createModeSelectionUI(character, area, options) {
        const container = document.createElement('div');
        container.className = 'mode-selection-interface';
        container.setAttribute('data-character', character);
        container.setAttribute('data-area', area);
        
        container.innerHTML = `
            <div class="mode-selection-backdrop"></div>
            <div class="mode-selection-content">
                <div class="mode-selection-header">
                    <h2 class="mode-selection-title">Choose Your Perspective</h2>
                    <p class="mode-selection-subtitle">
                        How will you experience ${this.getCharacterDisplayName(character)}'s story in ${this.getAreaDisplayName(character, area)}?
                    </p>
                </div>
                
                <div class="mode-options">
                    <div class="mode-option guardian-option" data-mode="guardian">
                        <div class="mode-icon guardian-icon">🛡️</div>
                        <div class="mode-info">
                            <h3 class="mode-name">Guardian</h3>
                            <p class="mode-description">
                                ${this.getGuardianDescription(character)}
                            </p>
                            <ul class="mode-features">
                                ${this.getGuardianFeatures(character).map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        <button class="mode-select-btn guardian-btn" data-mode="guardian">
                            Protect & Guide
                        </button>
                    </div>
                    
                    <div class="mode-option shadow-option" data-mode="shadowObserver">
                        <div class="mode-icon shadow-icon">👤</div>
                        <div class="mode-info">
                            <h3 class="mode-name">Shadow Observer</h3>
                            <p class="mode-description">
                                ${this.getShadowDescription(character)}
                            </p>
                            <ul class="mode-features">
                                ${this.getShadowFeatures(character).map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        <button class="mode-select-btn shadow-btn" data-mode="shadowObserver">
                            Manipulate & Exploit
                        </button>
                    </div>
                </div>
                
                <div class="mode-selection-footer">
                    <p class="mode-switch-note">
                        You can switch perspectives at any time during the experience.
                    </p>
                    ${options.allowSkip ? '<button class="skip-selection-btn">Continue Without Selection</button>' : ''}
                </div>
            </div>
        `;
        
        this.attachEventListeners(container);
        return container;
    }

    /**
     * Attach event listeners to the interface
     */
    attachEventListeners(container) {
        // Mode selection buttons
        const selectButtons = container.querySelectorAll('.mode-select-btn');
        selectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const mode = e.target.getAttribute('data-mode');
                this.selectMode(mode);
            });
        });

        // Mode option hover effects
        const modeOptions = container.querySelectorAll('.mode-option');
        modeOptions.forEach(option => {
            option.addEventListener('mouseenter', () => {
                option.classList.add('hovered');
                this.previewMode(option.getAttribute('data-mode'));
            });
            
            option.addEventListener('mouseleave', () => {
                option.classList.remove('hovered');
                this.clearModePreview();
            });
        });

        // Skip button if available
        const skipButton = container.querySelector('.skip-selection-btn');
        if (skipButton) {
            skipButton.addEventListener('click', () => {
                this.skipSelection();
            });
        }

        // Backdrop click to close (if allowed)
        const backdrop = container.querySelector('.mode-selection-backdrop');
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                // Only allow backdrop close if skip is enabled
                const skipButton = container.querySelector('.skip-selection-btn');
                if (skipButton) {
                    this.skipSelection();
                }
            }
        });
    }

    /**
     * Handle mode selection
     */
    async selectMode(mode) {
        try {
            // Apply mode through mode manager
            const result = await this.modeManager.setMode(mode, this.currentCharacter, this.currentArea);
            
            // Hide interface
            await this.hide();
            
            // Resolve all pending callbacks
            this.selectionCallbacks.forEach(callback => callback({
                mode,
                character: this.currentCharacter,
                area: this.currentArea,
                result
            }));
            this.selectionCallbacks = [];
            
            // Emit selection event
            this.emitSelectionEvent(mode, result);
            
        } catch (error) {
            console.error('Error selecting mode:', error);
            this.showError('Failed to select mode. Please try again.');
        }
    }

    /**
     * Handle skip selection
     */
    async skipSelection() {
        await this.hide();
        
        this.selectionCallbacks.forEach(callback => callback({
            skipped: true,
            character: this.currentCharacter,
            area: this.currentArea
        }));
        this.selectionCallbacks = [];
    }

    /**
     * Preview mode effects
     */
    previewMode(mode) {
        const container = document.querySelector('.mode-selection-interface');
        if (container) {
            container.setAttribute('data-preview-mode', mode);
        }
    }

    /**
     * Clear mode preview
     */
    clearModePreview() {
        const container = document.querySelector('.mode-selection-interface');
        if (container) {
            container.removeAttribute('data-preview-mode');
        }
    }

    /**
     * Get character display name
     */
    getCharacterDisplayName(character) {
        const names = {
            eli: 'Eli',
            maya: 'Maya',
            stanley: 'Stanley'
        };
        return names[character] || character;
    }

    /**
     * Get area display name
     */
    getAreaDisplayName(character, area) {
        const areaNames = {
            eli: {
                1: 'Gaming Setup',
                2: 'Tournament Arena',
                3: 'Gambling Platform',
                4: 'Gaming Community',
                5: 'School Campus',
                6: 'Championship Victory'
            },
            maya: {
                1: 'Home Base',
                2: 'Dating App',
                3: 'Investigation Hub',
                4: 'Cyber Cafe',
                5: 'Corporate Office',
                6: 'Final Confrontation'
            },
            stanley: {
                1: 'Suburban Home',
                2: 'Social Media Maze',
                3: 'Financial District',
                4: 'Digital Marketplace',
                5: 'Law Enforcement',
                6: 'Protection Network'
            }
        };
        return areaNames[character]?.[area] || `Area ${area}`;
    }

    /**
     * Get Guardian mode description for character
     */
    getGuardianDescription(character) {
        const descriptions = {
            eli: 'Help Eli navigate the gaming world safely, protecting him from scams and exploitation while maintaining his competitive edge.',
            maya: 'Guide Maya through digital relationships, helping her identify red flags and stay safe while finding genuine connections.',
            stanley: 'Protect Stanley from elder-targeted scams and fraud, empowering him with knowledge and security tools.'
        };
        return descriptions[character] || 'Help the character stay safe and make good decisions.';
    }

    /**
     * Get Shadow Observer mode description for character
     */
    getShadowDescription(character) {
        const descriptions = {
            eli: 'Experience how predators exploit competitive gaming culture, peer pressure, and the desire for quick wins.',
            maya: 'Understand the tactics used by romance scammers and catfish to manipulate emotions and extract personal information.',
            stanley: 'Learn how scammers target older adults through authority impersonation, urgency tactics, and social isolation.'
        };
        return descriptions[character] || 'Experience the manipulative tactics used by cybercriminals.';
    }

    /**
     * Get Guardian mode features for character
     */
    getGuardianFeatures(character) {
        const features = {
            eli: [
                'Highlight security best practices',
                'Verify tournament legitimacy',
                'Protect gaming accounts',
                'Promote healthy gaming habits'
            ],
            maya: [
                'Verify dating profiles',
                'Analyze communication patterns',
                'Compile evidence safely',
                'Build support networks'
            ],
            stanley: [
                'Detect identity theft attempts',
                'Verify official communications',
                'Protect financial information',
                'Build community connections'
            ]
        };
        return features[character] || ['Provide safety guidance', 'Highlight security features'];
    }

    /**
     * Get Shadow Observer mode features for character
     */
    getShadowFeatures(character) {
        const features = {
            eli: [
                'Exploit competitive pressure',
                'Promote risky shortcuts',
                'Target gaming vulnerabilities',
                'Demonstrate manipulation tactics'
            ],
            maya: [
                'Use emotional manipulation',
                'Exploit trust and vulnerability',
                'Hide warning signs',
                'Demonstrate catfishing techniques'
            ],
            stanley: [
                'Impersonate authority figures',
                'Create false urgency',
                'Exploit social isolation',
                'Target financial vulnerabilities'
            ]
        };
        return features[character] || ['Show manipulation tactics', 'Demonstrate cybersecurity risks'];
    }

    /**
     * Animate interface entrance
     */
    async animateEntrance(interface) {
        return new Promise((resolve) => {
            interface.style.opacity = '0';
            interface.style.transform = 'scale(0.9)';
            
            requestAnimationFrame(() => {
                interface.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                interface.style.opacity = '1';
                interface.style.transform = 'scale(1)';
                
                // Animate mode options
                const options = interface.querySelectorAll('.mode-option');
                options.forEach((option, index) => {
                    option.style.opacity = '0';
                    option.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        option.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                        option.style.opacity = '1';
                        option.style.transform = 'translateY(0)';
                    }, 200 + (index * 100));
                });
                
                setTimeout(resolve, 800);
            });
        });
    }

    /**
     * Animate interface exit
     */
    async animateExit(interface) {
        return new Promise((resolve) => {
            interface.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            interface.style.opacity = '0';
            interface.style.transform = 'scale(1.1)';
            
            setTimeout(resolve, 400);
        });
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'mode-selection-error';
        errorDiv.textContent = message;
        
        const container = document.querySelector('.mode-selection-content');
        if (container) {
            container.appendChild(errorDiv);
            
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 3000);
        }
    }

    /**
     * Emit selection event
     */
    emitSelectionEvent(mode, result) {
        const event = new CustomEvent('modeSelected', {
            detail: {
                mode,
                character: this.currentCharacter,
                area: this.currentArea,
                result,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Initialize interface
     */
    initializeInterface() {
        // Add CSS styles if not already present
        if (!document.querySelector('#mode-selection-styles')) {
            this.addStyles();
        }
    }

    /**
     * Add CSS styles for the interface
     */
    addStyles() {
        const styles = document.createElement('style');
        styles.id = 'mode-selection-styles';
        styles.textContent = `
            .mode-selection-interface {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Arial', sans-serif;
            }

            .mode-selection-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
            }

            .mode-selection-content {
                position: relative;
                max-width: 900px;
                width: 90%;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 40px;
                color: white;
                text-align: center;
            }

            .mode-selection-header {
                margin-bottom: 40px;
            }

            .mode-selection-title {
                font-size: 2.5em;
                margin: 0 0 15px 0;
                background: linear-gradient(45deg, #fff, #ccc);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .mode-selection-subtitle {
                font-size: 1.2em;
                opacity: 0.9;
                margin: 0;
            }

            .mode-options {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 30px;
            }

            .mode-option {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                border: 2px solid transparent;
                padding: 30px 20px;
                transition: all 0.3s ease;
                cursor: pointer;
                text-align: left;
            }

            .mode-option:hover,
            .mode-option.hovered {
                transform: translateY(-5px);
                border-color: rgba(255, 255, 255, 0.3);
                background: rgba(255, 255, 255, 0.1);
            }

            .guardian-option:hover,
            .guardian-option.hovered {
                border-color: #4CAF50;
                box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
            }

            .shadow-option:hover,
            .shadow-option.hovered {
                border-color: #F44336;
                box-shadow: 0 10px 30px rgba(244, 67, 54, 0.3);
            }

            .mode-icon {
                font-size: 3em;
                margin-bottom: 15px;
                display: block;
            }

            .mode-name {
                font-size: 1.5em;
                margin: 0 0 10px 0;
                color: white;
            }

            .mode-description {
                font-size: 1em;
                opacity: 0.8;
                margin: 0 0 15px 0;
                line-height: 1.5;
            }

            .mode-features {
                list-style: none;
                padding: 0;
                margin: 0 0 20px 0;
            }

            .mode-features li {
                padding: 5px 0;
                opacity: 0.7;
                font-size: 0.9em;
            }

            .mode-features li:before {
                content: "• ";
                color: currentColor;
                margin-right: 8px;
            }

            .mode-select-btn {
                width: 100%;
                padding: 15px 20px;
                border: none;
                border-radius: 10px;
                font-size: 1.1em;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .guardian-btn {
                background: linear-gradient(45deg, #4CAF50, #45a049);
                color: white;
            }

            .guardian-btn:hover {
                background: linear-gradient(45deg, #45a049, #4CAF50);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
            }

            .shadow-btn {
                background: linear-gradient(45deg, #F44336, #d32f2f);
                color: white;
            }

            .shadow-btn:hover {
                background: linear-gradient(45deg, #d32f2f, #F44336);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(244, 67, 54, 0.4);
            }

            .mode-selection-footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .mode-switch-note {
                opacity: 0.7;
                font-size: 0.9em;
                margin: 0 0 15px 0;
            }

            .skip-selection-btn {
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .skip-selection-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.5);
            }

            .mode-selection-error {
                background: rgba(244, 67, 54, 0.2);
                border: 1px solid rgba(244, 67, 54, 0.5);
                color: #ffcdd2;
                padding: 15px;
                border-radius: 10px;
                margin-top: 20px;
                animation: errorSlideIn 0.3s ease;
            }

            @keyframes errorSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-width: 768px) {
                .mode-options {
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
                
                .mode-selection-content {
                    padding: 30px 20px;
                }
                
                .mode-selection-title {
                    font-size: 2em;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export the class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModeSelectionInterface };
} else if (typeof window !== 'undefined') {
    window.ModeSelectionInterface = ModeSelectionInterface;
}