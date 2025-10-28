/**
 * Mode Manager - Guardian/Shadow Observer Mode System
 * Manages dual-perspective gameplay modes with character-specific configurations
 */

class ModeManager {
    constructor() {
        this.currentMode = null;
        this.currentCharacter = null;
        this.currentArea = null;
        this.modeConfigs = {
            guardian: new GuardianModeConfig(),
            shadowObserver: new ShadowObserverModeConfig()
        };
        this.uiThemeManager = new UIThemeManager();
        this.narrativeTransitions = new NarrativeTransitionManager();
        this.modeHistory = [];
        
        this.initializeEventListeners();
    }

    /**
     * Set the current gameplay mode
     * @param {string} mode - 'guardian' or 'shadowObserver'
     * @param {string} character - 'eli', 'maya', or 'stanley'
     * @param {number} area - Area number (1-6)
     * @returns {Object} Mode capabilities and configuration
     */
    async setMode(mode, character, area) {
        const previousMode = this.currentMode;
        
        // Validate mode
        if (!this.modeConfigs[mode]) {
            throw new Error(`Invalid mode: ${mode}`);
        }

        // Store previous state for transitions
        const transitionData = {
            from: previousMode,
            to: mode,
            character,
            area,
            timestamp: Date.now()
        };

        // Update current state
        this.currentMode = mode;
        this.currentCharacter = character;
        this.currentArea = area;
        this.modeHistory.push(transitionData);

        // Apply mode configuration
        const modeConfig = await this.applyModeConfiguration(mode, character, area);
        
        // Update UI theme
        await this.uiThemeManager.applyTheme(mode, character);
        
        // Handle narrative transition if switching modes
        if (previousMode && previousMode !== mode) {
            await this.narrativeTransitions.executeTransition(transitionData);
        }

        // Emit mode change event
        this.emitModeChangeEvent(mode, character, area, modeConfig);

        return {
            mode,
            character,
            area,
            capabilities: modeConfig.capabilities,
            interactions: modeConfig.interactions,
            theme: this.uiThemeManager.getCurrentTheme()
        };
    }

    /**
     * Apply mode-specific configuration
     */
    async applyModeConfiguration(mode, character, area) {
        const modeConfig = this.modeConfigs[mode];
        const characterConfig = modeConfig.getCharacterConfig(character);
        const areaConfig = modeConfig.getAreaConfig(character, area);

        // Merge configurations
        const config = {
            ...modeConfig.baseConfig,
            ...characterConfig,
            ...areaConfig,
            capabilities: this.getModeCapabilities(mode, character),
            interactions: this.getModeInteractions(mode, character, area)
        };

        return config;
    }

    /**
     * Get mode-specific capabilities
     */
    getModeCapabilities(mode, character) {
        const modeConfig = this.modeConfigs[mode];
        return modeConfig.getCapabilities(character);
    }

    /**
     * Get mode-specific interactions for objects
     */
    getInteractions(objectId, context = {}) {
        if (!this.currentMode) {
            return [];
        }

        const modeConfig = this.modeConfigs[this.currentMode];
        return modeConfig.getInteractions(objectId, {
            ...context,
            character: this.currentCharacter,
            area: this.currentArea
        });
    }

    /**
     * Get mode-specific interactions for current context
     */
    getModeInteractions(mode, character, area) {
        const modeConfig = this.modeConfigs[mode];
        return modeConfig.getAreaInteractions(character, area);
    }

    /**
     * Switch modes with narrative transition
     */
    async switchMode(newMode) {
        if (!this.currentCharacter || !this.currentArea) {
            throw new Error('Cannot switch mode without active character and area');
        }

        return await this.setMode(newMode, this.currentCharacter, this.currentArea);
    }

    /**
     * Get current mode information
     */
    getCurrentMode() {
        return {
            mode: this.currentMode,
            character: this.currentCharacter,
            area: this.currentArea,
            config: this.currentMode ? this.modeConfigs[this.currentMode] : null
        };
    }

    /**
     * Check if mode switching is allowed
     */
    canSwitchMode(newMode) {
        // Allow switching if no current mode or different mode requested
        if (!this.currentMode || this.currentMode !== newMode) {
            return true;
        }
        return false;
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // Listen for mode switch requests
        document.addEventListener('requestModeSwitch', (event) => {
            const { mode } = event.detail;
            if (this.canSwitchMode(mode)) {
                this.switchMode(mode);
            }
        });

        // Listen for interaction requests
        document.addEventListener('requestInteraction', (event) => {
            const { objectId, context } = event.detail;
            const interactions = this.getInteractions(objectId, context);
            event.detail.interactions = interactions;
        });
    }

    /**
     * Emit mode change event
     */
    emitModeChangeEvent(mode, character, area, config) {
        const event = new CustomEvent('modeChanged', {
            detail: {
                mode,
                character,
                area,
                config,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Get mode history
     */
    getModeHistory() {
        return [...this.modeHistory];
    }

    /**
     * Reset mode manager
     */
    reset() {
        this.currentMode = null;
        this.currentCharacter = null;
        this.currentArea = null;
        this.modeHistory = [];
        this.uiThemeManager.reset();
    }
}

/**
 * Guardian Mode Configuration
 * Focuses on safety, protection, and educational guidance
 */
class GuardianModeConfig {
    constructor() {
        this.baseConfig = {
            name: 'Guardian',
            description: 'Help characters stay safe and make good cybersecurity decisions',
            priority: 'safety',
            guidance: 'protective'
        };
    }

    getCharacterConfig(character) {
        const configs = {
            eli: {
                focus: 'gaming_security',
                tools: ['trade_verification', 'account_security', 'tournament_safety'],
                guidance: 'competitive_integrity'
            },
            maya: {
                focus: 'dating_safety',
                tools: ['profile_verification', 'reverse_image_search', 'communication_analysis'],
                guidance: 'relationship_protection'
            },
            stanley: {
                focus: 'elder_protection',
                tools: ['identity_verification', 'scam_detection', 'document_analysis'],
                guidance: 'fraud_prevention'
            }
        };
        return configs[character] || {};
    }

    getAreaConfig(character, area) {
        // Area-specific configurations for Guardian mode
        const areaConfigs = {
            eli: {
                1: { emphasis: 'setup_security', tools: ['password_manager', 'two_factor'] },
                2: { emphasis: 'tournament_verification', tools: ['legitimacy_checker'] },
                3: { emphasis: 'gambling_awareness', tools: ['risk_calculator'] },
                4: { emphasis: 'community_safety', tools: ['report_system'] },
                5: { emphasis: 'academic_integrity', tools: ['balance_tracker'] },
                6: { emphasis: 'victory_protection', tools: ['celebration_safety'] }
            },
            maya: {
                1: { emphasis: 'profile_safety', tools: ['privacy_checker'] },
                2: { emphasis: 'dating_verification', tools: ['profile_analyzer'] },
                3: { emphasis: 'investigation_tools', tools: ['evidence_compiler'] },
                4: { emphasis: 'public_safety', tools: ['location_privacy'] },
                5: { emphasis: 'workplace_security', tools: ['professional_boundaries'] },
                6: { emphasis: 'confrontation_safety', tools: ['support_network'] }
            },
            stanley: {
                1: { emphasis: 'home_security', tools: ['device_protection'] },
                2: { emphasis: 'social_verification', tools: ['contact_verification'] },
                3: { emphasis: 'financial_protection', tools: ['transaction_security'] },
                4: { emphasis: 'marketplace_safety', tools: ['seller_verification'] },
                5: { emphasis: 'authority_verification', tools: ['official_channels'] },
                6: { emphasis: 'community_building', tools: ['network_protection'] }
            }
        };
        return areaConfigs[character]?.[area] || {};
    }

    getCapabilities(character) {
        return {
            highlightSafety: true,
            showWarnings: true,
            provideGuidance: true,
            enableProtectiveActions: true,
            accessSecurityTools: true,
            character: character
        };
    }

    getInteractions(objectId, context) {
        // Guardian mode interactions focus on safety and protection
        return {
            type: 'guardian',
            actions: ['analyze_safety', 'verify_authenticity', 'check_security'],
            feedback: 'educational',
            warnings: true
        };
    }

    getAreaInteractions(character, area) {
        // Return area-specific Guardian interactions
        return {
            interactive_objects: this.getInteractiveObjects(character, area),
            safety_highlights: this.getSafetyHighlights(character, area),
            protective_actions: this.getProtectiveActions(character, area)
        };
    }

    getInteractiveObjects(character, area) {
        // Define interactive objects for Guardian mode
        const objects = {
            eli: {
                1: ['gaming_setup', 'security_settings', 'password_manager'],
                2: ['tournament_rules', 'verification_badge', 'safety_guidelines'],
                3: ['risk_calculator', 'spending_tracker', 'help_resources'],
                4: ['community_guidelines', 'report_button', 'moderator_tools'],
                5: ['study_schedule', 'balance_tracker', 'academic_resources'],
                6: ['celebration_guide', 'privacy_settings', 'sharing_controls']
            },
            maya: {
                1: ['privacy_settings', 'profile_analyzer', 'safety_checklist'],
                2: ['verification_tools', 'reverse_search', 'red_flag_detector'],
                3: ['evidence_compiler', 'analysis_tools', 'documentation_system'],
                4: ['location_privacy', 'safety_protocols', 'emergency_contacts'],
                5: ['professional_boundaries', 'hr_resources', 'security_training'],
                6: ['support_network', 'safety_plan', 'legal_resources']
            },
            stanley: {
                1: ['device_security', 'privacy_controls', 'family_contacts'],
                2: ['contact_verification', 'scam_detector', 'trusted_sources'],
                3: ['transaction_security', 'fraud_alerts', 'bank_verification'],
                4: ['seller_verification', 'secure_payment', 'review_checker'],
                5: ['official_verification', 'government_contacts', 'legal_channels'],
                6: ['community_network', 'protection_resources', 'education_center']
            }
        };
        return objects[character]?.[area] || [];
    }

    getSafetyHighlights(character, area) {
        // Define what to highlight for safety in Guardian mode
        return {
            security_indicators: true,
            verification_badges: true,
            warning_signs: true,
            safe_practices: true
        };
    }

    getProtectiveActions(character, area) {
        // Define protective actions available in Guardian mode
        return {
            verify_before_action: true,
            enable_security_features: true,
            report_suspicious_activity: true,
            seek_help_resources: true
        };
    }
}/
**
 * Shadow Observer Mode Configuration
 * Focuses on manipulation, temptation, and demonstrating cybersecurity risks
 */
class ShadowObserverModeConfig {
    constructor() {
        this.baseConfig = {
            name: 'Shadow Observer',
            description: 'Experience the manipulative tactics used by cybercriminals',
            priority: 'manipulation',
            guidance: 'deceptive'
        };
    }

    getCharacterConfig(character) {
        const configs = {
            eli: {
                focus: 'gaming_exploitation',
                tactics: ['peer_pressure', 'fomo_manipulation', 'competitive_exploitation'],
                targets: ['gaming_accounts', 'tournament_entries', 'virtual_assets']
            },
            maya: {
                focus: 'romance_manipulation',
                tactics: ['emotional_manipulation', 'trust_exploitation', 'catfishing'],
                targets: ['personal_information', 'financial_data', 'emotional_vulnerability']
            },
            stanley: {
                focus: 'elder_exploitation',
                tactics: ['authority_impersonation', 'urgency_creation', 'companionship_exploitation'],
                targets: ['financial_accounts', 'personal_documents', 'social_isolation']
            }
        };
        return configs[character] || {};
    }

    getAreaConfig(character, area) {
        // Area-specific configurations for Shadow Observer mode
        const areaConfigs = {
            eli: {
                1: { manipulation: 'setup_shortcuts', risks: ['weak_passwords', 'shared_accounts'] },
                2: { manipulation: 'tournament_pressure', risks: ['fake_tournaments', 'entry_scams'] },
                3: { manipulation: 'gambling_temptation', risks: ['addiction_triggers', 'financial_loss'] },
                4: { manipulation: 'peer_exploitation', risks: ['social_engineering', 'account_sharing'] },
                5: { manipulation: 'academic_shortcuts', risks: ['cheating_tools', 'account_compromise'] },
                6: { manipulation: 'victory_exploitation', risks: ['celebration_scams', 'prize_fraud'] }
            },
            maya: {
                1: { manipulation: 'profile_deception', risks: ['oversharing', 'fake_profiles'] },
                2: { manipulation: 'romance_tactics', risks: ['catfishing', 'emotional_manipulation'] },
                3: { manipulation: 'investigation_misdirection', risks: ['false_evidence', 'confirmation_bias'] },
                4: { manipulation: 'public_vulnerability', risks: ['location_tracking', 'stalking'] },
                5: { manipulation: 'workplace_exploitation', risks: ['professional_compromise', 'data_theft'] },
                6: { manipulation: 'confrontation_risks', risks: ['isolation_tactics', 'retaliation_threats'] }
            },
            stanley: {
                1: { manipulation: 'home_invasion_digital', risks: ['device_compromise', 'privacy_loss'] },
                2: { manipulation: 'social_impersonation', risks: ['fake_friends', 'authority_scams'] },
                3: { manipulation: 'financial_pressure', risks: ['urgent_payments', 'fake_emergencies'] },
                4: { manipulation: 'marketplace_deception', risks: ['fake_sellers', 'payment_scams'] },
                5: { manipulation: 'authority_abuse', risks: ['impersonation', 'false_urgency'] },
                6: { manipulation: 'community_exploitation', risks: ['trust_abuse', 'network_compromise'] }
            }
        };
        return areaConfigs[character]?.[area] || {};
    }

    getCapabilities(character) {
        return {
            highlightRisks: true,
            showTemptations: true,
            enableManipulation: true,
            demonstrateConsequences: true,
            accessExploitationTools: true,
            character: character
        };
    }

    getInteractions(objectId, context) {
        // Shadow Observer mode interactions focus on manipulation and risk
        return {
            type: 'shadow_observer',
            actions: ['exploit_weakness', 'create_temptation', 'hide_warnings'],
            feedback: 'manipulative',
            warnings: false,
            risks: true
        };
    }

    getAreaInteractions(character, area) {
        // Return area-specific Shadow Observer interactions
        return {
            manipulation_targets: this.getManipulationTargets(character, area),
            risk_amplifiers: this.getRiskAmplifiers(character, area),
            deceptive_actions: this.getDeceptiveActions(character, area)
        };
    }

    getManipulationTargets(character, area) {
        // Define manipulation targets for Shadow Observer mode
        const targets = {
            eli: {
                1: ['security_shortcuts', 'password_sharing', 'auto_login'],
                2: ['fake_tournaments', 'entry_fee_scams', 'prize_manipulation'],
                3: ['gambling_addiction', 'loss_chasing', 'loan_offers'],
                4: ['peer_pressure', 'account_sharing', 'trust_exploitation'],
                5: ['academic_cheating', 'shortcut_tools', 'grade_manipulation'],
                6: ['celebration_scams', 'fake_prizes', 'victory_exploitation']
            },
            maya: {
                1: ['oversharing_encouragement', 'privacy_reduction', 'profile_enhancement'],
                2: ['trust_building', 'emotional_manipulation', 'verification_bypass'],
                3: ['evidence_tampering', 'bias_confirmation', 'misdirection'],
                4: ['location_sharing', 'public_vulnerability', 'safety_reduction'],
                5: ['professional_compromise', 'boundary_crossing', 'data_extraction'],
                6: ['isolation_tactics', 'support_undermining', 'retaliation_threats']
            },
            stanley: {
                1: ['device_access', 'privacy_invasion', 'security_weakening'],
                2: ['fake_relationships', 'authority_impersonation', 'trust_exploitation'],
                3: ['urgency_creation', 'financial_pressure', 'emergency_simulation'],
                4: ['seller_impersonation', 'payment_redirection', 'deal_manipulation'],
                5: ['authority_abuse', 'official_impersonation', 'compliance_pressure'],
                6: ['community_infiltration', 'trust_network_abuse', 'protection_undermining']
            }
        };
        return targets[character]?.[area] || [];
    }

    getRiskAmplifiers(character, area) {
        // Define risk amplification techniques
        return {
            urgency_creation: true,
            trust_exploitation: true,
            fear_manipulation: true,
            reward_temptation: true,
            social_pressure: true
        };
    }

    getDeceptive_actions(character, area) {
        // Define deceptive actions available in Shadow Observer mode
        return {
            hide_security_warnings: true,
            present_fake_opportunities: true,
            create_false_urgency: true,
            exploit_emotional_vulnerabilities: true,
            manipulate_social_connections: true
        };
    }
}

/**
 * UI Theme Manager
 * Manages visual themes and indicators for different modes
 */
class UIThemeManager {
    constructor() {
        this.currentTheme = null;
        this.characterThemes = {
            eli: {
                guardian: {
                    primary: '#4CAF50',    // Green for safety
                    secondary: '#2196F3',  // Blue for trust
                    accent: '#FF9800',     // Orange for attention
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    indicators: 'shield'
                },
                shadowObserver: {
                    primary: '#F44336',    // Red for danger
                    secondary: '#9C27B0',  // Purple for manipulation
                    accent: '#FF5722',     // Deep orange for warning
                    background: 'linear-gradient(135deg, #2c1810 0%, #8B0000 100%)',
                    indicators: 'warning'
                }
            },
            maya: {
                guardian: {
                    primary: '#E91E63',    // Pink for empowerment
                    secondary: '#00BCD4',  // Cyan for clarity
                    accent: '#4CAF50',     // Green for safety
                    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                    indicators: 'heart_shield'
                },
                shadowObserver: {
                    primary: '#8E24AA',    // Dark purple for manipulation
                    secondary: '#D32F2F',  // Dark red for danger
                    accent: '#FF1744',     // Bright red for alarm
                    background: 'linear-gradient(135deg, #4a148c 0%, #880e4f 100%)',
                    indicators: 'broken_heart'
                }
            },
            stanley: {
                guardian: {
                    primary: '#4CAF50',    // Green for protection
                    secondary: '#607D8B',  // Blue grey for stability
                    accent: '#FFC107',     // Amber for guidance
                    background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                    indicators: 'family_shield'
                },
                shadowObserver: {
                    primary: '#795548',    // Brown for deception
                    secondary: '#424242',  // Dark grey for shadows
                    accent: '#FF5722',     // Red orange for threat
                    background: 'linear-gradient(135deg, #3e2723 0%, #5d4037 100%)',
                    indicators: 'shadow_figure'
                }
            }
        };
    }

    async applyTheme(mode, character) {
        const theme = this.characterThemes[character]?.[mode];
        if (!theme) {
            console.warn(`Theme not found for ${character} in ${mode} mode`);
            return;
        }

        this.currentTheme = { mode, character, ...theme };
        
        // Apply CSS custom properties
        const root = document.documentElement;
        root.style.setProperty('--mode-primary', theme.primary);
        root.style.setProperty('--mode-secondary', theme.secondary);
        root.style.setProperty('--mode-accent', theme.accent);
        root.style.setProperty('--mode-background', theme.background);
        
        // Update body class for mode-specific styling
        document.body.classList.remove('guardian-mode', 'shadow-observer-mode');
        document.body.classList.add(`${mode.replace(/([A-Z])/g, '-$1').toLowerCase()}-mode`);
        
        // Update character class
        document.body.classList.remove('character-eli', 'character-maya', 'character-stanley');
        document.body.classList.add(`character-${character}`);
        
        // Apply mode indicators
        this.updateModeIndicators(mode, character, theme.indicators);
        
        // Emit theme change event
        this.emitThemeChangeEvent(mode, character, theme);
    }

    updateModeIndicators(mode, character, indicatorType) {
        // Update visual indicators throughout the UI
        const indicators = document.querySelectorAll('.mode-indicator');
        indicators.forEach(indicator => {
            indicator.className = `mode-indicator ${mode}-mode ${character}-character ${indicatorType}`;
            indicator.setAttribute('data-mode', mode);
            indicator.setAttribute('data-character', character);
        });
        
        // Update mode-specific icons
        this.updateModeIcons(mode, indicatorType);
    }

    updateModeIcons(mode, indicatorType) {
        const iconMap = {
            shield: '🛡️',
            warning: '⚠️',
            heart_shield: '💖🛡️',
            broken_heart: '💔',
            family_shield: '👨‍👩‍👧‍👦🛡️',
            shadow_figure: '👤'
        };
        
        const modeIcons = document.querySelectorAll('.mode-icon');
        modeIcons.forEach(icon => {
            icon.textContent = iconMap[indicatorType] || '🎮';
            icon.setAttribute('title', `${mode} mode active`);
        });
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    emitThemeChangeEvent(mode, character, theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { mode, character, theme }
        });
        document.dispatchEvent(event);
    }

    reset() {
        this.currentTheme = null;
        document.body.classList.remove(
            'guardian-mode', 'shadow-observer-mode',
            'character-eli', 'character-maya', 'character-stanley'
        );
        
        // Reset CSS custom properties
        const root = document.documentElement;
        root.style.removeProperty('--mode-primary');
        root.style.removeProperty('--mode-secondary');
        root.style.removeProperty('--mode-accent');
        root.style.removeProperty('--mode-background');
    }
}

/**
 * Narrative Transition Manager
 * Handles smooth transitions between modes with appropriate storytelling
 */
class NarrativeTransitionManager {
    constructor() {
        this.transitionTemplates = {
            guardianToShadow: {
                eli: "The protective instincts fade as darker impulses emerge. You now see opportunities to exploit Eli's competitive nature...",
                maya: "Empathy dissolves into manipulation. You begin to understand how predators exploit trust and vulnerability...",
                stanley: "Compassion transforms into calculated deception. You now perceive how scammers target isolation and trust..."
            },
            shadowToGuardian: {
                eli: "The manipulative fog lifts, revealing the importance of protecting Eli from exploitation and harm...",
                maya: "Deceptive thoughts clear as protective instincts return. You now focus on Maya's safety and empowerment...",
                stanley: "The predatory mindset fades, replaced by genuine care for Stanley's security and well-being..."
            }
        };
    }

    async executeTransition(transitionData) {
        const { from, to, character } = transitionData;
        
        if (!from || !to || from === to) {
            return; // No transition needed
        }
        
        const transitionKey = `${from}To${to.charAt(0).toUpperCase() + to.slice(1)}`;
        const template = this.transitionTemplates[transitionKey];
        
        if (template && template[character]) {
            await this.displayTransitionNarrative(template[character], transitionData);
        }
    }

    async displayTransitionNarrative(narrative, transitionData) {
        // Create transition overlay
        const overlay = this.createTransitionOverlay(narrative, transitionData);
        document.body.appendChild(overlay);
        
        // Animate transition
        await this.animateTransition(overlay);
        
        // Remove overlay after transition
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 3000);
    }

    createTransitionOverlay(narrative, transitionData) {
        const overlay = document.createElement('div');
        overlay.className = 'mode-transition-overlay';
        overlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-icon mode-icon"></div>
                <div class="transition-text">${narrative}</div>
                <div class="transition-progress">
                    <div class="progress-bar"></div>
                </div>
            </div>
        `;
        
        // Apply transition-specific styling
        overlay.setAttribute('data-from-mode', transitionData.from);
        overlay.setAttribute('data-to-mode', transitionData.to);
        overlay.setAttribute('data-character', transitionData.character);
        
        return overlay;
    }

    async animateTransition(overlay) {
        return new Promise((resolve) => {
            // Fade in
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(0.9)';
            
            requestAnimationFrame(() => {
                overlay.style.transition = 'all 0.6s ease-out';
                overlay.style.opacity = '1';
                overlay.style.transform = 'scale(1)';
                
                // Animate progress bar
                const progressBar = overlay.querySelector('.progress-bar');
                if (progressBar) {
                    setTimeout(() => {
                        progressBar.style.width = '100%';
                    }, 300);
                }
                
                // Fade out
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    overlay.style.transform = 'scale(1.1)';
                    resolve();
                }, 2400);
            });
        });
    }
}

// Export the ModeManager class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModeManager, GuardianModeConfig, ShadowObserverModeConfig, UIThemeManager, NarrativeTransitionManager };
} else if (typeof window !== 'undefined') {
    window.ModeManager = ModeManager;
    window.GuardianModeConfig = GuardianModeConfig;
    window.ShadowObserverModeConfig = ShadowObserverModeConfig;
    window.UIThemeManager = UIThemeManager;
    window.NarrativeTransitionManager = NarrativeTransitionManager;
}