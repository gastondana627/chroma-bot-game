/**
 * Dialogue Synchronization System
 * Synchronizes character speech with gesture animations and facial expressions
 * for cinematic moments in the 3D immersive chatbot
 */

class DialogueSynchronizationSystem {
    constructor() {
        this.isActive = false;
        this.currentDialogue = null;
        this.animationSystem = null;
        this.character3DRenderer = null;
        this.speechTimer = null;
        this.gestureTimer = null;
        this.expressionTimer = null;
        
        // Speech timing configurations
        this.speechTimings = {
            // Words per minute for different voice styles
            excited: 180,
            firm: 120,
            inspirational: 140,
            analytical: 130,
            excited_discovery: 160,
            authoritative: 110,
            concerned: 100,
            protective: 115,
            inspirational_leader: 125
        };
        
        // Gesture synchronization patterns
        this.gestureSyncPatterns = {
            // Eli's patterns
            victory_celebration: {
                speechMarkers: [
                    { word: 'YES!', gesture: 'arms_raise_slow', timing: 'immediate' },
                    { word: 'incredible', gesture: 'victory_pose_hold', timing: 'word_start' },
                    { word: 'won', gesture: 'fist_pump_double', timing: 'word_emphasis' },
                    { word: 'practice', gesture: 'confident_stance', timing: 'word_end' }
                ],
                expressionChanges: [
                    { word: 'YES!', expression: 'triumphant', duration: 1000 },
                    { word: 'incredible', expression: 'amazed', duration: 1500 },
                    { word: 'won', expression: 'proud', duration: 2000 },
                    { word: 'practice', expression: 'satisfied', duration: 1200 }
                ]
            },
            
            champion_celebration: {
                speechMarkers: [
                    { word: 'This', gesture: 'controller_raise', timing: 'immediate' },
                    { word: 'proven', gesture: 'arms_spread_wide', timing: 'word_start' },
                    { word: 'gaming', gesture: 'spin_celebration', timing: 'word_emphasis' },
                    { word: 'inspire', gesture: 'point_to_crowd', timing: 'word_start' },
                    { word: 'same!', gesture: 'champion_bow', timing: 'word_end' }
                ],
                expressionChanges: [
                    { word: 'This', expression: 'determined', duration: 800 },
                    { word: 'proven', expression: 'proud', duration: 1500 },
                    { word: 'gaming', expression: 'passionate', duration: 2000 },
                    { word: 'inspire', expression: 'inspiring', duration: 1800 },
                    { word: 'same!', expression: 'humble', duration: 1000 }
                ]
            },
            
            // Maya's patterns
            investigation_focus: {
                speechMarkers: [
                    { word: 'Wait', gesture: 'investigative_pause', timing: 'immediate' },
                    { word: 'something\'s', gesture: 'pointing_at_evidence', timing: 'word_start' },
                    { word: 'profile', gesture: 'evidence_examination', timing: 'word_emphasis' },
                    { word: 'catfish', gesture: 'conclusive_point', timing: 'word_end' }
                ],
                expressionChanges: [
                    { word: 'Wait', expression: 'alert', duration: 500 },
                    { word: 'something\'s', expression: 'suspicious', duration: 1200 },
                    { word: 'profile', expression: 'analyzing', duration: 1500 },
                    { word: 'catfish', expression: 'certain', duration: 1000 }
                ]
            },
            
            breakthrough_moment: {
                speechMarkers: [
                    { word: 'This', gesture: 'eureka_gesture', timing: 'immediate' },
                    { word: 'connection', gesture: 'evidence_presentation', timing: 'word_start' },
                    { word: 'profiles', gesture: 'connecting_dots', timing: 'word_emphasis' },
                    { word: 'source', gesture: 'determined_point', timing: 'word_end' }
                ],
                expressionChanges: [
                    { word: 'This', expression: 'breakthrough', duration: 800 },
                    { word: 'connection', expression: 'excited', duration: 1500 },
                    { word: 'profiles', expression: 'focused', duration: 1200 },
                    { word: 'source', expression: 'determined', duration: 1000 }
                ]
            },
            
            // Stanley's patterns
            concerned_realization: {
                speechMarkers: [
                    { word: 'This', gesture: 'protective_stance', timing: 'immediate' },
                    { word: 'someone', gesture: 'worried_gesture', timing: 'word_start' },
                    { word: 'information', gesture: 'security_check', timing: 'word_emphasis' },
                    { word: 'this', gesture: 'warning_gesture', timing: 'word_end' }
                ],
                expressionChanges: [
                    { word: 'This', expression: 'confused', duration: 600 },
                    { word: 'someone', expression: 'worried', duration: 1500 },
                    { word: 'information', expression: 'concerned', duration: 1800 },
                    { word: 'this', expression: 'determined', duration: 1200 }
                ]
            },
            
            protective_action: {
                speechMarkers: [
                    { word: 'Stop!', gesture: 'stop_gesture', timing: 'immediate' },
                    { word: 'scam', gesture: 'warning_point', timing: 'word_start' },
                    { word: 'scheme', gesture: 'protective_stance', timing: 'word_emphasis' },
                    { word: 'flags', gesture: 'educational_gesture', timing: 'word_end' }
                ],
                expressionChanges: [
                    { word: 'Stop!', expression: 'urgent', duration: 500 },
                    { word: 'scam', expression: 'serious', duration: 1000 },
                    { word: 'scheme', expression: 'protective', duration: 1500 },
                    { word: 'flags', expression: 'helpful', duration: 1200 }
                ]
            }
        };
        
        // Facial expression configurations
        this.expressionConfigurations = {
            // Basic expressions
            neutral: { eyebrows: 0, eyes: 0, mouth: 0 },
            
            // Eli expressions
            triumphant: { eyebrows: 0.8, eyes: 0.9, mouth: 0.9 },
            amazed: { eyebrows: 0.7, eyes: 0.8, mouth: 0.6 },
            proud: { eyebrows: 0.5, eyes: 0.7, mouth: 0.8 },
            satisfied: { eyebrows: 0.3, eyes: 0.6, mouth: 0.7 },
            determined: { eyebrows: 0.6, eyes: 0.8, mouth: 0.4 },
            passionate: { eyebrows: 0.7, eyes: 0.9, mouth: 0.8 },
            inspiring: { eyebrows: 0.6, eyes: 0.8, mouth: 0.7 },
            humble: { eyebrows: 0.2, eyes: 0.5, mouth: 0.5 },
            
            // Maya expressions
            alert: { eyebrows: 0.6, eyes: 0.8, mouth: 0.2 },
            suspicious: { eyebrows: 0.4, eyes: 0.7, mouth: 0.1 },
            analyzing: { eyebrows: 0.5, eyes: 0.9, mouth: 0.3 },
            certain: { eyebrows: 0.7, eyes: 0.8, mouth: 0.6 },
            breakthrough: { eyebrows: 0.8, eyes: 0.9, mouth: 0.7 },
            excited: { eyebrows: 0.7, eyes: 0.8, mouth: 0.8 },
            focused: { eyebrows: 0.6, eyes: 0.9, mouth: 0.4 },
            
            // Stanley expressions
            confused: { eyebrows: 0.3, eyes: 0.6, mouth: 0.2 },
            worried: { eyebrows: 0.2, eyes: 0.7, mouth: 0.1 },
            concerned: { eyebrows: 0.4, eyes: 0.8, mouth: 0.2 },
            urgent: { eyebrows: 0.8, eyes: 0.9, mouth: 0.3 },
            serious: { eyebrows: 0.6, eyes: 0.8, mouth: 0.2 },
            protective: { eyebrows: 0.7, eyes: 0.8, mouth: 0.5 },
            helpful: { eyebrows: 0.5, eyes: 0.7, mouth: 0.6 }
        };
    }
    
    /**
     * Initialize the dialogue synchronization system
     * @param {Object} animationSystem - Character animation system
     * @param {Object} character3DRenderer - 3D character renderer
     */
    initialize(animationSystem, character3DRenderer) {
        this.animationSystem = animationSystem;
        this.character3DRenderer = character3DRenderer;
        
        console.log('Dialogue Synchronization System initialized');
    }
    
    /**
     * Start synchronized dialogue with animations
     * @param {Object} dialogueConfig - Dialogue configuration from cinematic moments
     */
    async startSynchronizedDialogue(dialogueConfig) {
        if (this.isActive) {
            console.warn('Dialogue synchronization already active');
            return;
        }
        
        this.isActive = true;
        this.currentDialogue = dialogueConfig;
        
        console.log('Starting synchronized dialogue:', dialogueConfig.text);
        
        try {
            // Parse dialogue text into words and timing
            const speechPlan = this.createSpeechPlan(dialogueConfig);
            
            // Get gesture synchronization pattern
            const syncPattern = this.getSyncPattern(dialogueConfig);
            
            // Execute synchronized speech, gestures, and expressions
            await this.executeSynchronizedSequence(speechPlan, syncPattern);
            
            console.log('Synchronized dialogue completed');
            
        } catch (error) {
            console.error('Dialogue synchronization failed:', error);
        } finally {
            this.isActive = false;
            this.currentDialogue = null;
            this.clearTimers();
        }
    }
    
    /**
     * Create speech timing plan from dialogue configuration
     * @param {Object} dialogueConfig - Dialogue configuration
     * @returns {Object} Speech timing plan
     */
    createSpeechPlan(dialogueConfig) {
        const words = dialogueConfig.text.split(' ');
        const wordsPerMinute = this.speechTimings[dialogueConfig.voiceStyle] || 140;
        const millisecondsPerWord = (60 / wordsPerMinute) * 1000;
        
        const speechPlan = {
            totalDuration: words.length * millisecondsPerWord,
            words: [],
            voiceStyle: dialogueConfig.voiceStyle,
            timing: dialogueConfig.timing
        };
        
        let currentTime = 0;
        
        words.forEach((word, index) => {
            // Adjust timing for punctuation and emphasis
            let wordDuration = millisecondsPerWord;
            
            if (word.includes('!')) wordDuration *= 1.3; // Exclamation emphasis
            if (word.includes('?')) wordDuration *= 1.2; // Question pause
            if (word.includes(',')) wordDuration *= 1.1; // Comma pause
            if (word.includes('.')) wordDuration *= 1.4; // Period pause
            if (word.includes('...')) wordDuration *= 2.0; // Ellipsis long pause
            
            speechPlan.words.push({
                text: word,
                startTime: currentTime,
                duration: wordDuration,
                index: index
            });
            
            currentTime += wordDuration;
        });
        
        return speechPlan;
    }
    
    /**
     * Get gesture synchronization pattern for dialogue
     * @param {Object} dialogueConfig - Dialogue configuration
     * @returns {Object} Synchronization pattern
     */
    getSyncPattern(dialogueConfig) {
        // Determine pattern based on character and dialogue type
        const character = this.currentDialogue?.character || 'eli';
        const timing = dialogueConfig.timing;
        
        // Map timing styles to gesture patterns
        const patternMap = {
            eli: {
                synchronized: 'victory_celebration',
                epic: 'champion_celebration'
            },
            maya: {
                investigative: 'investigation_focus',
                breakthrough: 'breakthrough_moment'
            },
            stanley: {
                realization: 'concerned_realization',
                urgent_warning: 'protective_action'
            }
        };
        
        const patternKey = patternMap[character]?.[timing] || 'victory_celebration';
        return this.gestureSyncPatterns[patternKey] || this.gestureSyncPatterns.victory_celebration;
    }
    
    /**
     * Execute synchronized sequence of speech, gestures, and expressions
     * @param {Object} speechPlan - Speech timing plan
     * @param {Object} syncPattern - Gesture synchronization pattern
     */
    async executeSynchronizedSequence(speechPlan, syncPattern) {
        // Start speech audio (mock implementation)
        this.startSpeechAudio(speechPlan);
        
        // Schedule gesture synchronization
        this.scheduleGestureSynchronization(speechPlan, syncPattern);
        
        // Schedule expression changes
        this.scheduleExpressionChanges(speechPlan, syncPattern);
        
        // Wait for dialogue completion
        await this.waitForDialogueCompletion(speechPlan.totalDuration);
    }
    
    /**
     * Start speech audio playback
     * @param {Object} speechPlan - Speech timing plan
     */
    startSpeechAudio(speechPlan) {
        console.log(`Starting speech audio: ${speechPlan.voiceStyle} style`);
        
        // In production, would use Web Speech API or audio files
        speechPlan.words.forEach((word, index) => {
            setTimeout(() => {
                console.log(`Speaking: "${word.text}" at ${word.startTime}ms`);
                
                // Trigger word-based events for gesture synchronization
                this.triggerWordEvent(word, index);
                
            }, word.startTime);
        });
    }
    
    /**
     * Schedule gesture synchronization with speech
     * @param {Object} speechPlan - Speech timing plan
     * @param {Object} syncPattern - Gesture synchronization pattern
     */
    scheduleGestureSynchronization(speechPlan, syncPattern) {
        if (!syncPattern.speechMarkers) return;
        
        syncPattern.speechMarkers.forEach(marker => {
            const wordMatch = speechPlan.words.find(word => 
                word.text.toLowerCase().includes(marker.word.toLowerCase())
            );
            
            if (wordMatch) {
                let gestureTime = wordMatch.startTime;
                
                // Adjust timing based on marker timing preference
                switch (marker.timing) {
                    case 'immediate':
                        gestureTime = wordMatch.startTime;
                        break;
                    case 'word_start':
                        gestureTime = wordMatch.startTime + 100;
                        break;
                    case 'word_emphasis':
                        gestureTime = wordMatch.startTime + (wordMatch.duration * 0.3);
                        break;
                    case 'word_end':
                        gestureTime = wordMatch.startTime + wordMatch.duration - 200;
                        break;
                }
                
                setTimeout(() => {
                    this.triggerGesture(marker.gesture);
                }, gestureTime);
            }
        });
    }
    
    /**
     * Schedule facial expression changes
     * @param {Object} speechPlan - Speech timing plan
     * @param {Object} syncPattern - Gesture synchronization pattern
     */
    scheduleExpressionChanges(speechPlan, syncPattern) {
        if (!syncPattern.expressionChanges) return;
        
        syncPattern.expressionChanges.forEach(change => {
            const wordMatch = speechPlan.words.find(word => 
                word.text.toLowerCase().includes(change.word.toLowerCase())
            );
            
            if (wordMatch) {
                setTimeout(() => {
                    this.changeExpression(change.expression, change.duration);
                }, wordMatch.startTime);
            }
        });
    }
    
    /**
     * Trigger word event for synchronization
     * @param {Object} word - Word object with timing
     * @param {number} index - Word index
     */
    triggerWordEvent(word, index) {
        // Dispatch custom event for word synchronization
        const event = new CustomEvent('dialogueWordSpoken', {
            detail: {
                word: word.text,
                index: index,
                startTime: word.startTime,
                duration: word.duration
            }
        });
        
        document.dispatchEvent(event);
    }
    
    /**
     * Trigger gesture animation
     * @param {string} gestureName - Name of gesture to trigger
     */
    triggerGesture(gestureName) {
        if (this.animationSystem && typeof this.animationSystem.playGesture === 'function') {
            console.log(`Triggering gesture: ${gestureName}`);
            this.animationSystem.playGesture(gestureName);
        } else {
            console.log(`Mock gesture trigger: ${gestureName}`);
        }
    }
    
    /**
     * Change facial expression
     * @param {string} expressionName - Name of expression
     * @param {number} duration - Duration to hold expression
     */
    changeExpression(expressionName, duration) {
        const expression = this.expressionConfigurations[expressionName];
        if (!expression) {
            console.warn(`Unknown expression: ${expressionName}`);
            return;
        }
        
        console.log(`Changing expression to: ${expressionName} for ${duration}ms`);
        
        if (this.character3DRenderer && typeof this.character3DRenderer.setExpression === 'function') {
            this.character3DRenderer.setExpression(expression, duration);
        } else {
            // Mock expression change
            console.log(`Mock expression change:`, expression);
        }
        
        // Schedule return to neutral expression
        setTimeout(() => {
            if (this.character3DRenderer && typeof this.character3DRenderer.setExpression === 'function') {
                this.character3DRenderer.setExpression(this.expressionConfigurations.neutral, 500);
            }
        }, duration);
    }
    
    /**
     * Wait for dialogue completion
     * @param {number} duration - Total dialogue duration
     */
    async waitForDialogueCompletion(duration) {
        return new Promise(resolve => {
            setTimeout(resolve, duration + 500); // Add small buffer
        });
    }
    
    /**
     * Clear all active timers
     */
    clearTimers() {
        if (this.speechTimer) {
            clearTimeout(this.speechTimer);
            this.speechTimer = null;
        }
        if (this.gestureTimer) {
            clearTimeout(this.gestureTimer);
            this.gestureTimer = null;
        }
        if (this.expressionTimer) {
            clearTimeout(this.expressionTimer);
            this.expressionTimer = null;
        }
    }
    
    /**
     * Stop current dialogue synchronization
     */
    stopDialogue() {
        if (this.isActive) {
            console.log('Stopping dialogue synchronization');
            this.isActive = false;
            this.currentDialogue = null;
            this.clearTimers();
            
            // Dispatch stop event
            document.dispatchEvent(new CustomEvent('dialogueStopped'));
        }
    }
    
    /**
     * Check if dialogue is currently active
     * @returns {boolean} Whether dialogue is active
     */
    isDialogueActive() {
        return this.isActive;
    }
    
    /**
     * Get current dialogue progress
     * @returns {Object} Progress information
     */
    getDialogueProgress() {
        if (!this.isActive || !this.currentDialogue) {
            return { active: false };
        }
        
        return {
            active: true,
            dialogue: this.currentDialogue,
            // Additional progress info would be calculated here
        };
    }
    
    /**
     * Add custom gesture synchronization pattern
     * @param {string} patternName - Pattern name
     * @param {Object} pattern - Pattern configuration
     */
    addGestureSyncPattern(patternName, pattern) {
        this.gestureSyncPatterns[patternName] = pattern;
        console.log(`Added gesture sync pattern: ${patternName}`);
    }
    
    /**
     * Add custom facial expression
     * @param {string} expressionName - Expression name
     * @param {Object} expression - Expression configuration
     */
    addExpression(expressionName, expression) {
        this.expressionConfigurations[expressionName] = expression;
        console.log(`Added expression: ${expressionName}`);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DialogueSynchronizationSystem;
} else if (typeof window !== 'undefined') {
    window.DialogueSynchronizationSystem = DialogueSynchronizationSystem;
}

console.log('Dialogue Synchronization System loaded');