/**
 * Action Sequence Integration
 * Integrates character-specific action sequences with the existing gaming mechanics system
 */

class ActionSequenceIntegration {
    constructor() {
        this.actionController = null;
        this.characterSequences = null;
        this.gamingMechanicsEngine = null;
        this.storyProgressionTracker = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the action sequence system
     */
    async initialize() {
        try {
            // Initialize core components
            this.actionController = new ActionSequenceController();
            this.characterSequences = new CharacterActionSequences(this.actionController);
            
            // Connect to existing systems
            if (window.GamingMechanicsEngine) {
                this.gamingMechanicsEngine = window.GamingMechanicsEngine;
            }
            
            if (window.StoryProgressionTracker) {
                this.storyProgressionTracker = window.StoryProgressionTracker;
            }

            this.isInitialized = true;
            console.log('Action Sequence Integration initialized successfully');
            
            return true;
        } catch (error) {
            console.error('Failed to initialize Action Sequence Integration:', error);
            return false;
        }
    }

    /**
     * Start an action sequence based on story context
     */
    startActionSequence(character, area, storyContext = {}) {
        if (!this.isInitialized) {
            throw new Error('Action Sequence Integration not initialized');
        }

        // Determine sequence type based on character and area
        const sequenceType = this.determineSequenceType(character, area, storyContext);
        
        if (!sequenceType) {
            console.warn(`No action sequence available for ${character} in area ${area}`);
            return null;
        }

        // Enhance context with story progression data
        const enhancedContext = {
            ...storyContext,
            area: area,
            storyState: this.storyProgressionTracker ? 
                this.storyProgressionTracker.getCharacterState(character) : {},
            timestamp: Date.now()
        };

        try {
            const sequence = this.characterSequences.startCharacterActionSequence(
                character, 
                sequenceType, 
                enhancedContext
            );

            // Notify gaming mechanics engine
            if (this.gamingMechanicsEngine) {
                this.gamingMechanicsEngine.onActionSequenceStarted(character, sequenceType, sequence);
            }

            // Track in story progression
            if (this.storyProgressionTracker) {
                this.storyProgressionTracker.recordActionSequenceStart(character, sequenceType, area);
            }

            return sequence;
        } catch (error) {
            console.error('Failed to start action sequence:', error);
            return null;
        }
    }

    /**
     * Determine appropriate sequence type based on character and context
     */
    determineSequenceType(character, area, context) {
        const sequenceMap = {
            'maya': {
                2: 'romance_intervention', // Dating app area
                3: 'romance_intervention', // Investigation hub
                6: 'romance_intervention'  // Final confrontation
            },
            'eli': {
                1: 'account_security', // Gaming setup
                2: 'account_security', // Tournament arena
                3: 'account_security', // Gambling platform
                4: 'account_security'  // Gaming community
            },
            'stanley': {
                1: 'identity_response', // Suburban home
                3: 'identity_response', // Financial district
                5: 'identity_response', // Law enforcement
                6: 'identity_response'  // Protection network
            }
        };

        const characterMap = sequenceMap[character];
        if (!characterMap) {
            return null;
        }

        // Check for context-specific overrides
        if (context.threatType) {
            switch (context.threatType) {
                case 'romance_scam':
                case 'catfish':
                    return character === 'maya' ? 'romance_intervention' : null;
                case 'account_takeover':
                case 'gaming_scam':
                    return character === 'eli' ? 'account_security' : null;
                case 'identity_theft':
                case 'elder_fraud':
                    return character === 'stanley' ? 'identity_response' : null;
            }
        }

        return characterMap[area] || null;
    }

    /**
     * Process an action within an active sequence
     */
    processSequenceAction(sequenceId, action) {
        if (!this.isInitialized) {
            throw new Error('Action Sequence Integration not initialized');
        }

        try {
            const result = this.actionController.processAction(sequenceId, action);
            
            // Update story progression based on action result
            if (this.storyProgressionTracker && result.success) {
                const sequence = this.actionController.getSequenceStatus(sequenceId);
                if (sequence) {
                    this.storyProgressionTracker.recordActionSequenceProgress(
                        sequence.character, 
                        sequence.type, 
                        action.type,
                        result.effectiveness || 0
                    );
                }
            }

            // Notify gaming mechanics engine of action result
            if (this.gamingMechanicsEngine) {
                this.gamingMechanicsEngine.onActionSequenceAction(sequenceId, action, result);
            }

            return result;
        } catch (error) {
            console.error('Failed to process sequence action:', error);
            return {
                success: false,
                error: error.message,
                feedback: 'Action processing failed. Please try again.'
            };
        }
    }

    /**
     * Get available action sequences for a character in current context
     */
    getAvailableActionSequences(character, area, context = {}) {
        if (!this.isInitialized) {
            return [];
        }

        const availableSequences = this.characterSequences.getAvailableSequences(character);
        
        // Filter based on area and context
        return availableSequences.filter(sequence => {
            const sequenceType = this.determineSequenceType(character, area, context);
            return sequence.id.includes(sequenceType) || sequenceType === null;
        });
    }

    /**
     * Get character domain expertise for UI display
     */
    getCharacterExpertise(character) {
        if (!this.isInitialized) {
            return null;
        }

        return this.characterSequences.getCharacterDomain(character);
    }

    /**
     * Check if action sequences are available for character/area combination
     */
    hasActionSequences(character, area) {
        const sequenceType = this.determineSequenceType(character, area, {});
        return sequenceType !== null;
    }

    /**
     * Get sequence status for UI updates
     */
    getSequenceStatus(sequenceId) {
        if (!this.isInitialized) {
            return null;
        }

        return this.actionController.getSequenceStatus(sequenceId);
    }

    /**
     * Cancel an active sequence
     */
    cancelSequence(sequenceId) {
        if (!this.isInitialized) {
            return false;
        }

        const result = this.actionController.cancelSequence(sequenceId);
        
        if (result && this.storyProgressionTracker) {
            const sequence = this.actionController.getSequenceStatus(sequenceId);
            if (sequence) {
                this.storyProgressionTracker.recordActionSequenceCancel(
                    sequence.character, 
                    sequence.type
                );
            }
        }

        return result;
    }

    /**
     * Get educational content for completed sequences
     */
    getEducationalSummary(character, sequenceType) {
        if (!this.isInitialized) {
            return null;
        }

        const domain = this.characterSequences.getCharacterDomain(character);
        const scenario = this.characterSequences.getScenario(`${character}_${sequenceType}`);
        
        if (!domain || !scenario) {
            return null;
        }

        return {
            character: character,
            domain: domain.primaryDomain,
            educationalFocus: domain.educationalFocus,
            scenarioTitle: scenario.title,
            keyLearnings: this.extractKeyLearnings(scenario),
            realWorldApplications: this.getRealWorldApplications(character, sequenceType)
        };
    }

    /**
     * Extract key learning points from a scenario
     */
    extractKeyLearnings(scenario) {
        const learnings = [];
        
        scenario.phases.forEach(phase => {
            phase.challenges.forEach(challenge => {
                learnings.push({
                    skill: challenge.type,
                    description: challenge.description,
                    tools: challenge.tools,
                    importance: challenge.successCriteria
                });
            });
        });

        return learnings;
    }

    /**
     * Get real-world applications for character expertise
     */
    getRealWorldApplications(character, sequenceType) {
        const applications = {
            'maya': {
                'romance_intervention': [
                    'Online dating safety verification',
                    'Romance scam victim support',
                    'Digital evidence compilation for fraud cases',
                    'Emotional manipulation recognition training'
                ]
            },
            'eli': {
                'account_security': [
                    'Gaming account security best practices',
                    'Esports tournament security protocols',
                    'Virtual asset protection strategies',
                    'Gaming community safety education'
                ]
            },
            'stanley': {
                'identity_response': [
                    'Elder fraud prevention programs',
                    'Identity theft response protocols',
                    'Community protection network building',
                    'Financial fraud detection and reporting'
                ]
            }
        };

        return applications[character] ? applications[character][sequenceType] || [] : [];
    }

    /**
     * Integration with existing UI systems
     */
    createActionSequenceUI(containerId, character, area) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        // Check if action sequences are available
        if (!this.hasActionSequences(character, area)) {
            container.innerHTML = '<p>No action sequences available for this area.</p>';
            return;
        }

        const expertise = this.getCharacterExpertise(character);
        const availableSequences = this.getAvailableActionSequences(character, area);

        container.innerHTML = `
            <div class="action-sequence-panel">
                <h3>${character.charAt(0).toUpperCase() + character.slice(1)}'s Action Sequences</h3>
                <p class="expertise-info">${expertise ? expertise.educationalFocus : ''}</p>
                
                <div class="available-sequences">
                    ${availableSequences.map(sequence => `
                        <div class="sequence-option" data-sequence-id="${sequence.id}">
                            <h4>${sequence.title}</h4>
                            <p>${sequence.description}</p>
                            <div class="sequence-meta">
                                <span class="phases">Phases: ${sequence.phases}</span>
                                <span class="urgency ${sequence.context.urgency}">${sequence.context.urgency.toUpperCase()}</span>
                            </div>
                            <button class="start-sequence-btn" onclick="window.ActionSequenceIntegration.startSequenceFromUI('${sequence.id}', '${character}', ${area})">
                                Start Sequence
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Start sequence from UI interaction
     */
    startSequenceFromUI(sequenceId, character, area) {
        const sequenceType = sequenceId.replace(`${character}_`, '').replace('_basic', '');
        const sequence = this.startActionSequence(character, area, { 
            uiTriggered: true,
            sequenceId: sequenceId 
        });
        
        if (sequence) {
            // Update UI to show active sequence
            this.updateUIForActiveSequence(sequence);
        }
    }

    /**
     * Update UI for active sequence
     */
    updateUIForActiveSequence(sequence) {
        // This would integrate with the existing UI system
        // Implementation depends on the specific UI framework being used
        console.log('Action sequence started:', sequence);
        
        // Trigger UI update event
        if (window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('actionSequenceStarted', {
                detail: sequence
            }));
        }
    }
}

// Create global instance
window.ActionSequenceIntegration = new ActionSequenceIntegration();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ActionSequenceIntegration.initialize();
    });
} else {
    window.ActionSequenceIntegration.initialize();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ActionSequenceIntegration;
}