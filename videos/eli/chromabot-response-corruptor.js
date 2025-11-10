/**
 * ChromaBot Response Corruptor
 * Progressively corrupts chatbot responses based on scene and corruption level
 */

class ChromaBotResponseCorruptor {
    constructor() {
        this.currentScene = 1;
        this.corruptionLevel = 0; // 0-4, synced with visual corruption
        
        // Corruption rules by scene
        this.sceneCorruption = {
            1: 'none',      // Scene 1-3: Normal responses
            2: 'none',
            3: 'none',
            4: 'slight',    // Scene 4: Slight glitches if corrupted
            5: 'moderate',  // Scene 5: Letter substitution (o→0, i→1, etc)
            6: 'severe'     // Scene 6: Heavy binary corruption
        };
        
        // Character substitution map for Scene 5
        this.letterSubstitutions = {
            'o': '0',
            'O': '0',
            'i': '1',
            'I': '1',
            'l': '1',
            'e': '3',
            'a': '4',
            's': '5',
            't': '7',
            'b': '8'
        };
        
        console.log('✅ ChromaBot Response Corruptor initialized');
    }
    
    /**
     * Update current scene
     */
    setScene(sceneNumber) {
        this.currentScene = sceneNumber;
        console.log(`🎬 ChromaBot corruptor: Scene ${sceneNumber} (${this.sceneCorruption[sceneNumber]} corruption)`);
    }
    
    /**
     * Update corruption level (synced with visual corruption)
     */
    setCorruptionLevel(level) {
        this.corruptionLevel = Math.max(0, Math.min(4, level));
        console.log(`💀 ChromaBot corruptor: Corruption level ${this.corruptionLevel}`);
    }
    
    /**
     * Main corruption function - processes response based on scene and level
     */
    corruptResponse(originalResponse) {
        const sceneType = this.sceneCorruption[this.currentScene];
        
        // No corruption for early scenes or if corruption level is 0
        if (sceneType === 'none' || this.corruptionLevel === 0) {
            return originalResponse;
        }
        
        // Apply corruption based on scene
        switch(sceneType) {
            case 'slight':
                return this.applySlightCorruption(originalResponse);
            case 'moderate':
                return this.applyModerateCorruption(originalResponse);
            case 'severe':
                return this.applySevereCorruption(originalResponse);
            default:
                return originalResponse;
        }
    }
    
    /**
     * Scene 4: Slight corruption - occasional glitches
     */
    applySlightCorruption(text) {
        if (this.corruptionLevel < 2) return text;
        
        // Add occasional glitch characters
        const words = text.split(' ');
        const corruptedWords = words.map(word => {
            // 10% chance to add glitch
            if (Math.random() < 0.1) {
                const glitchChars = ['█', '▓', '▒', '░'];
                const glitch = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                return word + glitch;
            }
            return word;
        });
        
        return corruptedWords.join(' ');
    }
    
    /**
     * Scene 5: Moderate corruption - letter substitution (o→0, i→1, etc)
     * Still comprehensible but clearly corrupted
     */
    applyModerateCorruption(text) {
        let corrupted = text;
        
        // Apply letter substitutions based on corruption level
        const substitutionChance = this.corruptionLevel * 0.2; // 0%, 20%, 40%, 60%, 80%
        
        corrupted = corrupted.split('').map(char => {
            if (this.letterSubstitutions[char] && Math.random() < substitutionChance) {
                return this.letterSubstitutions[char];
            }
            return char;
        }).join('');
        
        // Add occasional binary fragments at higher corruption
        if (this.corruptionLevel >= 3) {
            const sentences = corrupted.split('. ');
            corrupted = sentences.map(sentence => {
                if (Math.random() < 0.3) {
                    const binaryFragment = this.generateBinaryFragment(3);
                    return sentence + ' ' + binaryFragment;
                }
                return sentence;
            }).join('. ');
        }
        
        return corrupted;
    }
    
    /**
     * Scene 6: Severe corruption - heavy binary, barely comprehensible
     */
    applySevereCorruption(text) {
        const words = text.split(' ');
        
        // Corruption intensity based on level
        const binaryChance = this.corruptionLevel * 0.15; // 0%, 15%, 30%, 45%, 60%
        
        const corrupted = words.map(word => {
            if (Math.random() < binaryChance) {
                // Replace entire word with binary
                return this.generateBinaryFragment(word.length);
            } else if (Math.random() < binaryChance * 2) {
                // Partial binary corruption
                const mid = Math.floor(word.length / 2);
                return word.substring(0, mid) + this.generateBinaryFragment(word.length - mid);
            } else {
                // Apply letter substitution
                return word.split('').map(char => {
                    if (this.letterSubstitutions[char] && Math.random() < 0.6) {
                        return this.letterSubstitutions[char];
                    }
                    return char;
                }).join('');
            }
        });
        
        // At max corruption (level 4), add binary prefix/suffix
        if (this.corruptionLevel >= 4) {
            const binaryPrefix = this.generateBinaryFragment(8);
            const binarySuffix = this.generateBinaryFragment(8);
            return `${binaryPrefix} ${corrupted.join(' ')} ${binarySuffix}`;
        }
        
        return corrupted.join(' ');
    }
    
    /**
     * Generate random binary string
     */
    generateBinaryFragment(length) {
        let binary = '';
        for (let i = 0; i < length; i++) {
            binary += Math.random() < 0.5 ? '0' : '1';
        }
        return binary;
    }
    
    /**
     * Get corruption status message for UI
     */
    getCorruptionStatus() {
        const sceneType = this.sceneCorruption[this.currentScene];
        
        if (sceneType === 'none' || this.corruptionLevel === 0) {
            return 'ChromaBot: Online';
        }
        
        const statusMessages = {
            1: 'ChromaBot: Minor glitches detected',
            2: 'ChromaBot: Moderate corruption',
            3: 'ChromaBot: Severe corruption',
            4: 'ChromaBot: CRITICAL - System failing'
        };
        
        return statusMessages[this.corruptionLevel] || 'ChromaBot: Status unknown';
    }
    
    /**
     * Example responses for testing
     */
    getExampleResponse(scene, level) {
        const examples = {
            1: "I'm here to help you understand the risks of online gambling. What would you like to know?",
            4: "Be careful with your personal information. Scammers often create urgency to pressure victims.",
            5: "Remember to verify the sender's identity before responding to any suspicious messages.",
            6: "Trust your instincts. If something feels off, it probably is. Stay safe online."
        };
        
        this.setScene(scene);
        this.setCorruptionLevel(level);
        
        return this.corruptResponse(examples[scene] || examples[1]);
    }
}

// Make globally accessible
if (typeof window !== 'undefined') {
    window.ChromaBotResponseCorruptor = ChromaBotResponseCorruptor;
}
