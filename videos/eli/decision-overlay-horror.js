/**
 * Horror-Themed Decision Overlay System
 * Glitch aesthetic with dramatic presentation
 * Syncs with ChromaBot corruption animations
 */

class HorrorDecisionOverlay {
    constructor(options = {}) {
        this.container = null;
        this.isActive = false;
        this.currentDecision = null;
        this.chromaBotAnimator = options.chromaBotAnimator || null;
        this.onChoiceCallback = options.onChoice || null;
        
        // Timing configuration
        this.timing = {
            glitchIn: 800,        // Glitch effect duration
            displayDuration: 0,   // Infinite until choice made
            glitchOut: 600,       // Exit glitch duration
            choiceDelay: 300      // Delay before processing choice
        };
        
        this.init();
    }
    
    init() {
        this.createOverlay();
        this.attachEventListeners();
    }
    
    createOverlay() {
        this.container = document.createElement('div');
        this.container.id = 'horror-decision-overlay';
        this.container.className = 'horror-decision-overlay hidden';
        this.container.innerHTML = `
            <div class="glitch-container">
                <div class="decision-box">
                    <div class="decision-header">
                        <span class="warning-icon">⚠️</span>
                        <span class="header-text">CRITICAL MOMENT DETECTED</span>
                        <span class="warning-icon">⚠️</span>
                    </div>
                    
                    <div class="decision-context">
                        <p id="decision-context-text"></p>
                    </div>
                    
                    <div class="choices-container">
                        <!-- Choices will be injected here -->
                    </div>
                    
                    <div class="chromabot-indicator-container">
                        <!-- ChromaBot will be positioned here -->
                    </div>
                </div>
                
                <!-- Glitch effect layers -->
                <div class="glitch-layer glitch-layer-1"></div>
                <div class="glitch-layer glitch-layer-2"></div>
                <div class="glitch-layer glitch-layer-3"></div>
            </div>
        `;
        
        document.body.appendChild(this.container);
    }
    
    attachEventListeners() {
        // Prevent clicks outside choices
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                e.stopPropagation();
            }
        });
    }
    
    /**
     * Show decision overlay with glitch effect
     * @param {Object} decision - Decision configuration
     */
    show(decision) {
        if (this.isActive) return;
        
        this.currentDecision = decision;
        this.isActive = true;
        
        // Update content
        this.updateContent(decision);
        
        // Show with glitch effect
        this.container.classList.remove('hidden');
        
        setTimeout(() => {
            this.container.classList.add('glitch-in');
            this.playGlitchSound();
        }, 50);
        
        // Trigger ChromaBot preview animation
        if (this.chromaBotAnimator && decision.choices) {
            this.previewChromaBotStates(decision.choices);
        }
        
        // Emit event
        this.dispatchEvent('decisionShown', { decision });
    }
    
    /**
     * Update overlay content
     */
    updateContent(decision) {
        // Update context text
        const contextText = document.getElementById('decision-context-text');
        contextText.textContent = decision.context || 'A decision must be made.';
        
        // Create choice buttons
        const choicesContainer = this.container.querySelector('.choices-container');
        choicesContainer.innerHTML = '';
        
        decision.choices.forEach((choice, index) => {
            const choiceBtn = this.createChoiceButton(choice, index);
            choicesContainer.appendChild(choiceBtn);
        });
    }
    
    /**
     * Create choice button element
     */
    createChoiceButton(choice, index) {
        const btn = document.createElement('button');
        btn.className = `choice-btn choice-${choice.type}`;
        btn.dataset.choiceIndex = index;
        btn.dataset.choiceType = choice.type;
        
        btn.innerHTML = `
            <div class="choice-icon">${this.getChoiceIcon(choice.type)}</div>
            <div class="choice-content">
                <div class="choice-title">${choice.title}</div>
                <div class="choice-description">${choice.description}</div>
                <div class="choice-consequences">
                    <span class="trust-impact">Trust: ${choice.trustImpact > 0 ? '+' : ''}${choice.trustImpact}</span>
                    <span class="safety-level">Safety: ${choice.safetyLevel}</span>
                </div>
            </div>
        `;
        
        // Add hover effect for ChromaBot preview
        btn.addEventListener('mouseenter', () => {
            this.previewChoice(choice);
        });
        
        btn.addEventListener('mouseleave', () => {
            this.resetChromaBotPreview();
        });
        
        // Add click handler
        btn.addEventListener('click', () => {
            this.selectChoice(choice, index);
        });
        
        return btn;
    }
    
    /**
     * Get icon for choice type
     */
    getChoiceIcon(type) {
        const icons = {
            good: '✅',
            neutral: '⚠️',
            bad: '❌'
        };
        return icons[type] || '❓';
    }
    
    /**
     * Preview ChromaBot state for hovered choice
     */
    previewChoice(choice) {
        if (!this.chromaBotAnimator) return;
        
        // Temporarily show what would happen
        switch (choice.type) {
            case 'good':
                this.chromaBotAnimator.setFrame(1); // Clean state
                break;
            case 'neutral':
                this.chromaBotAnimator.setFrame(3); // Moderate corruption
                break;
            case 'bad':
                this.chromaBotAnimator.setFrame(5); // Maximum corruption
                break;
        }
    }
    
    /**
     * Reset ChromaBot to current state
     */
    resetChromaBotPreview() {
        if (!this.chromaBotAnimator) return;
        // Reset to current trust-based state
        const currentTrust = window.trustDecay?.getScore() || 50;
        this.chromaBotAnimator.updateByTrustScore(currentTrust);
    }
    
    /**
     * Preview all ChromaBot states briefly
     */
    previewChromaBotStates(choices) {
        if (!this.chromaBotAnimator) return;
        
        // Quick flicker through possible states
        let frame = 1;
        const previewInterval = setInterval(() => {
            this.chromaBotAnimator.setFrame(frame);
            frame++;
            if (frame > 5) {
                clearInterval(previewInterval);
                this.resetChromaBotPreview();
            }
        }, 150);
    }
    
    /**
     * Handle choice selection
     */
    selectChoice(choice, index) {
        if (!this.isActive) return;
        
        // Disable all buttons
        const buttons = this.container.querySelectorAll('.choice-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.choiceIndex !== String(index)) {
                btn.classList.add('choice-dimmed');
            } else {
                btn.classList.add('choice-selected');
            }
        });
        
        // Play selection sound
        this.playSelectionSound(choice.type);
        
        // Trigger ChromaBot animation
        if (this.chromaBotAnimator) {
            this.animateChromaBotForChoice(choice.type);
        }
        
        // Wait before hiding overlay
        setTimeout(() => {
            this.hide();
            
            // Callback after overlay hidden
            setTimeout(() => {
                if (this.onChoiceCallback) {
                    this.onChoiceCallback(choice, index);
                }
                this.dispatchEvent('choiceMade', { choice, index });
            }, this.timing.glitchOut);
            
        }, this.timing.choiceDelay);
    }
    
    /**
     * Animate ChromaBot based on choice
     */
    animateChromaBotForChoice(choiceType) {
        if (!this.chromaBotAnimator) return;
        
        switch (choiceType) {
            case 'good':
                this.chromaBotAnimator.animateToGood();
                break;
            case 'neutral':
                this.chromaBotAnimator.animateToNeutral();
                break;
            case 'bad':
                this.chromaBotAnimator.animateToBad();
                break;
        }
    }
    
    /**
     * Hide overlay with glitch effect
     */
    hide() {
        if (!this.isActive) return;
        
        this.container.classList.remove('glitch-in');
        this.container.classList.add('glitch-out');
        
        setTimeout(() => {
            this.container.classList.add('hidden');
            this.container.classList.remove('glitch-out');
            this.isActive = false;
            this.currentDecision = null;
        }, this.timing.glitchOut);
        
        this.dispatchEvent('decisionHidden');
    }
    
    /**
     * Play glitch sound effect
     */
    playGlitchSound() {
        // TODO: Add audio file
        console.log('🔊 Glitch sound effect');
    }
    
    /**
     * Play selection sound based on choice type
     */
    playSelectionSound(type) {
        // TODO: Add audio files
        console.log(`🔊 ${type} choice sound effect`);
    }
    
    /**
     * Dispatch custom event
     */
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(`horrorDecision:${eventName}`, {
            detail,
            bubbles: true
        });
        this.container.dispatchEvent(event);
    }
    
    /**
     * Destroy overlay
     */
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.isActive = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HorrorDecisionOverlay;
}
