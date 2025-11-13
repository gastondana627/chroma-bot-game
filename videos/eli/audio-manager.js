/**
 * Audio Manager for Eli's Story
 * Handles narration, ambience, and SFX
 * 
 * USAGE:
 * Always check if AudioManager is available before using:
 * 
 *   if (window.audioManager) {
 *       window.audioManager.playTransitionNarration(3, 4, 'success');
 *   } else {
 *       console.log('AudioManager not available, skipping audio');
 *       // Continue game flow without audio
 *   }
 * 
 * ERROR HANDLING:
 * - All audio playback is wrapped in try-catch blocks
 * - Callbacks fire even when audio fails (game never blocks)
 * - Missing files log warnings but don't crash
 * - Graceful degradation when audio system unavailable
 */

console.log('📦 Loading audio-manager.js...');

class AudioManager {
    constructor() {
        // Separate audio elements for simultaneous playback
        this.narrationAudio = new Audio();
        this.ambienceAudio = new Audio();
        this.sfxAudio = new Audio();
        
        // Ambience settings
        this.ambienceAudio.loop = true;
        this.ambienceAudio.volume = 0.12; // Subtle background
        
        // Narration settings
        this.narrationAudio.volume = 0.85; // Clear and prominent
        
        // SFX settings
        this.sfxAudio.volume = 0.5; // Moderate
        
        // State
        this.isNarrationPlaying = false;
        this.isMuted = false;
        this.ambiencePlaying = false;
        
        // Callbacks
        this.onNarrationEnd = null;
        
        // Set up event listeners
        this.narrationAudio.addEventListener('ended', () => {
            this.isNarrationPlaying = false;
            if (this.onNarrationEnd) {
                this.onNarrationEnd();
            }
        });
        
        this.narrationAudio.addEventListener('error', (e) => {
            this.logAudioError('narrationAudio.error', e.error || new Error('Audio playback error'), {
                src: this.narrationAudio.src,
                readyState: this.narrationAudio.readyState,
                networkState: this.narrationAudio.networkState
            });
            this.isNarrationPlaying = false;
            if (this.onNarrationEnd) {
                this.onNarrationEnd(); // Continue even if audio fails
            }
        });
        
        console.log('✅ Audio Manager initialized');
    }
    
    /**
     * Get correct asset path for audio files
     */
    getAudioPath(relativePath) {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/videos/eli/')) {
            return relativePath; // Already in correct directory
        }
        
        return `videos/eli/${relativePath}`;
    }
    
    /**
     * Play transition narration between scenes
     * @param {number} fromScene - Scene transitioning from (1-6)
     * @param {number} toScene - Scene transitioning to (2-6)
     * @param {string} path - Narration path: 'success', 'moderate', or 'failure'
     */
    playTransitionNarration(fromScene, toScene, path = 'moderate') {
        if (this.isMuted) {
            console.log('🔇 Audio muted, skipping transition narration');
            if (this.onNarrationEnd) {
                this.onNarrationEnd();
            }
            return;
        }
        
        const fileName = `scene_${fromScene}_to_${toScene}_${path}.mp3`;
        const filePath = this.getAudioPath(`audio/narration/${fileName}`);
        
        console.log(`🎙️ Playing transition narration DURING video: ${fileName}`);
        
        this.narrationAudio.src = filePath;
        this.narrationAudio.volume = 0.9; // Slightly louder for clarity over video
        this.isNarrationPlaying = true;
        
        // Set timeout protection (15 seconds max - allows for network latency + playback)
        const timeoutId = setTimeout(() => {
            if (this.isNarrationPlaying) {
                console.warn('⏱️ Narration timeout - forcing advancement');
                this.isNarrationPlaying = false;
                if (this.onNarrationEnd) {
                    this.onNarrationEnd();
                }
            }
        }, 15000);
        
        // Clear timeout when narration ends naturally
        const originalCallback = this.onNarrationEnd;
        this.onNarrationEnd = () => {
            clearTimeout(timeoutId);
            if (originalCallback) {
                originalCallback();
            }
        };
        
        this.narrationAudio.play().catch(err => {
            clearTimeout(timeoutId);
            this.logAudioError('playTransitionNarration', err, {
                fileName,
                filePath,
                fromScene,
                toScene,
                path
            });
            this.isNarrationPlaying = false;
            if (originalCallback) {
                originalCallback();
            }
        });
    }
    
    /**
     * Play ending narration
     * @param {string} endingType - 'success', 'moderate', or 'failure'
     */
    playEndingNarration(endingType = 'moderate') {
        if (this.isMuted) {
            console.log('🔇 Audio muted, skipping ending narration');
            if (this.onNarrationEnd) {
                this.onNarrationEnd();
            }
            return;
        }
        
        const fileName = `ending_${endingType}.mp3`;
        const filePath = this.getAudioPath(`audio/narration/${fileName}`);
        
        console.log(`🎙️ Playing ending narration: ${fileName}`);
        
        this.narrationAudio.src = filePath;
        this.isNarrationPlaying = true;
        
        // Set timeout protection (6 seconds max)
        const timeoutId = setTimeout(() => {
            if (this.isNarrationPlaying) {
                console.warn('⏱️ Ending narration timeout - forcing advancement');
                this.isNarrationPlaying = false;
                if (this.onNarrationEnd) {
                    this.onNarrationEnd();
                }
            }
        }, 6000);
        
        // Clear timeout when narration ends naturally
        const originalCallback = this.onNarrationEnd;
        this.onNarrationEnd = () => {
            clearTimeout(timeoutId);
            if (originalCallback) {
                originalCallback();
            }
        };
        
        this.narrationAudio.play().catch(err => {
            clearTimeout(timeoutId);
            this.logAudioError('playEndingNarration', err, {
                fileName,
                filePath,
                endingType
            });
            this.isNarrationPlaying = false;
            if (originalCallback) {
                originalCallback();
            }
        });
    }
    
    /**
     * Determine narration path based on player performance
     * @param {boolean} verbose - If true, log detailed calculation reasoning
     * @returns {string} 'success', 'moderate', or 'failure'
     */
    getNarrationPath(verbose = false) {
        const score = window.trustDecay ? window.trustDecay.getScore() : 100;
        const goodChoices = window.goodDecisionCount || 0;
        const riskyChoices = window.riskyChoiceCount || 0;
        
        // Calculate path with detailed reasoning
        let path = 'moderate';
        let reasoning = [];
        
        // Check success conditions
        const hasHighScore = score >= 70;
        const hasMoreGoodChoices = goodChoices > riskyChoices;
        
        if (hasHighScore && hasMoreGoodChoices) {
            path = 'success';
            reasoning.push(`✅ SUCCESS PATH TRIGGERED`);
            reasoning.push(`   - Trust Score: ${score} (≥70 required) ✓`);
            reasoning.push(`   - Good Choices: ${goodChoices} > Risky Choices: ${riskyChoices} ✓`);
        } else {
            // Check failure conditions
            const hasLowScore = score < 40;
            const hasSignificantlyMoreRisky = riskyChoices >= goodChoices + 2;
            
            if (hasLowScore || hasSignificantlyMoreRisky) {
                path = 'failure';
                reasoning.push(`❌ FAILURE PATH TRIGGERED`);
                
                if (hasLowScore) {
                    reasoning.push(`   - Trust Score: ${score} (<40 threshold) ✓`);
                }
                if (hasSignificantlyMoreRisky) {
                    reasoning.push(`   - Risky Choices: ${riskyChoices} ≥ Good Choices: ${goodChoices} + 2 ✓`);
                }
                if (!hasLowScore && hasSignificantlyMoreRisky) {
                    reasoning.push(`   - Trust Score: ${score} (not low, but risky choices dominate)`);
                }
            } else {
                // Moderate path (default)
                path = 'moderate';
                reasoning.push(`⚖️ MODERATE PATH (Default)`);
                reasoning.push(`   - Trust Score: ${score} (between 40-69 or doesn't meet success criteria)`);
                reasoning.push(`   - Good Choices: ${goodChoices}, Risky Choices: ${riskyChoices}`);
                
                // Explain why not success
                if (!hasHighScore) {
                    reasoning.push(`   - Not Success: Score ${score} < 70`);
                } else if (!hasMoreGoodChoices) {
                    reasoning.push(`   - Not Success: Good choices (${goodChoices}) not > Risky (${riskyChoices})`);
                }
                
                // Explain why not failure
                reasoning.push(`   - Not Failure: Score ${score} ≥ 40 AND risky (${riskyChoices}) < good (${goodChoices}) + 2`);
            }
        }
        
        // Log reasoning if verbose or if in development mode
        if (verbose || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🎯 NARRATION PATH CALCULATION:');
            reasoning.forEach(line => console.log(line));
            console.log(`📊 Final Path: ${path.toUpperCase()}`);
        }
        
        return path;
    }
    
    /**
     * Start background ambience
     */
    startAmbience(ambienceType = 'gaming_room') {
        if (this.isMuted || this.ambiencePlaying) return;
        
        const path = this.getAudioPath(`audio/ambience/${ambienceType}_loop.mp3`);
        
        console.log(`🎵 Starting ambience: ${ambienceType}`);
        
        try {
            this.ambienceAudio.src = path;
            this.ambiencePlaying = true;
            
            // Fade in ambience
            this.ambienceAudio.volume = 0;
            this.ambienceAudio.play().then(() => {
                this.fadeVolume(this.ambienceAudio, 0.12, 2000);
            }).catch(err => {
                this.logAudioError('startAmbience', err, {
                    ambienceType,
                    path,
                    message: 'Failed to play ambience audio'
                });
                this.ambiencePlaying = false;
            });
        } catch (err) {
            this.logAudioError('startAmbience', err, {
                ambienceType,
                path,
                message: 'Exception while starting ambience'
            });
            this.ambiencePlaying = false;
        }
    }
    
    /**
     * Stop background ambience
     */
    stopAmbience() {
        if (!this.ambiencePlaying) return;
        
        console.log('🔇 Stopping ambience');
        
        try {
            // Fade out then stop
            this.fadeVolume(this.ambienceAudio, 0, 1000).then(() => {
                this.ambienceAudio.pause();
                this.ambiencePlaying = false;
            }).catch(err => {
                this.logAudioError('stopAmbience', err, {
                    message: 'Failed to fade out ambience'
                });
                // Force stop even if fade fails
                this.ambienceAudio.pause();
                this.ambiencePlaying = false;
            });
        } catch (err) {
            this.logAudioError('stopAmbience', err, {
                message: 'Exception while stopping ambience'
            });
            // Force stop even if exception occurs
            try {
                this.ambienceAudio.pause();
            } catch (e) {
                // Ignore pause errors
            }
            this.ambiencePlaying = false;
        }
    }
    
    /**
     * Play sound effect
     */
    playSFX(sfxName) {
        if (this.isMuted) return;
        
        const path = this.getAudioPath(`audio/sfx/${sfxName}.mp3`);
        
        console.log(`🔊 Playing SFX: ${sfxName}`);
        
        try {
            this.sfxAudio.src = path;
            this.sfxAudio.play().catch(err => {
                this.logAudioError('playSFX', err, {
                    sfxName,
                    path,
                    message: 'Failed to play sound effect'
                });
            });
        } catch (err) {
            this.logAudioError('playSFX', err, {
                sfxName,
                path,
                message: 'Exception while playing SFX'
            });
        }
    }
    
    /**
     * Play heartbeat corruption audio
     * Used for corruption sequence with audio-visual sync
     */
    playHeartbeatCorruption() {
        if (this.isMuted) {
            console.log('🔇 Audio muted, skipping heartbeat');
            return;
        }
        
        const path = this.getAudioPath('audio/corruption/heartbeat_corruption.mp3');
        
        console.log('💔 Playing heartbeat corruption');
        
        try {
            // Use SFX channel for heartbeat
            this.sfxAudio.src = path;
            this.sfxAudio.volume = 0.4; // Subtle but present
            this.sfxAudio.loop = false;
            
            this.sfxAudio.play().catch(err => {
                this.logAudioError('playHeartbeatCorruption', err, {
                    path,
                    message: 'Failed to play heartbeat corruption audio'
                });
            });
        } catch (err) {
            this.logAudioError('playHeartbeatCorruption', err, {
                path,
                message: 'Exception while playing heartbeat corruption'
            });
        }
    }
    
    /**
     * Fade volume over time
     */
    fadeVolume(audioElement, targetVolume, duration) {
        return new Promise((resolve) => {
            const startVolume = audioElement.volume;
            const volumeChange = targetVolume - startVolume;
            const steps = 20;
            const stepDuration = duration / steps;
            let currentStep = 0;
            
            const interval = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;
                audioElement.volume = startVolume + (volumeChange * progress);
                
                if (currentStep >= steps) {
                    clearInterval(interval);
                    audioElement.volume = targetVolume;
                    resolve();
                }
            }, stepDuration);
        });
    }
    
    /**
     * Mute/unmute all audio
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.narrationAudio.volume = 0;
            this.ambienceAudio.volume = 0;
            this.sfxAudio.volume = 0;
            console.log('🔇 Audio muted');
        } else {
            this.narrationAudio.volume = 0.85;
            this.ambienceAudio.volume = 0.12;
            this.sfxAudio.volume = 0.5;
            console.log('🔊 Audio unmuted');
        }
        
        return this.isMuted;
    }
    
    /**
     * Set master volume (0-1)
     */
    setMasterVolume(volume) {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        
        this.narrationAudio.volume = clampedVolume * 0.85;
        this.ambienceAudio.volume = clampedVolume * 0.12;
        this.sfxAudio.volume = clampedVolume * 0.5;
        
        console.log(`🔊 Master volume set to ${Math.round(clampedVolume * 100)}%`);
    }
    
    /**
     * Stop all audio
     */
    stopAll() {
        try {
            this.narrationAudio.pause();
        } catch (err) {
            this.logAudioError('stopAll.narration', err, {
                message: 'Failed to pause narration'
            });
        }
        
        try {
            this.ambienceAudio.pause();
        } catch (err) {
            this.logAudioError('stopAll.ambience', err, {
                message: 'Failed to pause ambience'
            });
        }
        
        try {
            this.sfxAudio.pause();
        } catch (err) {
            this.logAudioError('stopAll.sfx', err, {
                message: 'Failed to pause SFX'
            });
        }
        
        this.isNarrationPlaying = false;
        this.ambiencePlaying = false;
        
        console.log('⏹️ All audio stopped');
    }
    
    /**
     * Check if narration is currently playing
     */
    isPlaying() {
        return this.isNarrationPlaying;
    }
    
    /**
     * Preload audio files for smoother playback
     */
    preloadAudio(sceneNumber) {
        try {
            const narrationPath = this.getAudioPath(`audio/narration/scene_${sceneNumber}_narration.mp3`);
            
            // Create temporary audio element to preload
            const preloader = new Audio();
            preloader.src = narrationPath;
            preloader.preload = 'auto';
            
            // Add error handler for preload failures
            preloader.addEventListener('error', (e) => {
                console.warn(`⚠️ Failed to preload audio for scene ${sceneNumber}: ${narrationPath}`);
            });
            
            console.log(`📥 Preloading audio for scene ${sceneNumber}`);
        } catch (err) {
            this.logAudioError('preloadAudio', err, {
                sceneNumber,
                message: 'Exception while preloading audio'
            });
        }
    }
    
    /**
     * Verify all required narration files exist
     * @returns {Promise<Object>} Status of each file
     */
    async verifyNarrationFiles() {
        console.log('🔍 Verifying narration files...');
        
        const files = [
            'scene_1_to_2_success.mp3',
            'scene_1_to_2_moderate.mp3',
            'scene_1_to_2_failure.mp3',
            'scene_2_to_3_success.mp3',
            'scene_2_to_3_moderate.mp3',
            'scene_2_to_3_failure.mp3',
            'scene_3_to_4_success.mp3',
            'scene_3_to_4_moderate.mp3',
            'scene_3_to_4_failure.mp3',
            'scene_4_to_5_success.mp3',
            'scene_4_to_5_moderate.mp3',
            'scene_4_to_5_failure.mp3',
            'scene_5_to_6_success.mp3',
            'scene_5_to_6_moderate.mp3',
            'scene_5_to_6_failure.mp3',
            'ending_success.mp3',
            'ending_moderate.mp3',
            'ending_failure.mp3'
        ];
        
        const results = {};
        
        for (const file of files) {
            const filePath = this.getAudioPath(`audio/narration/${file}`);
            results[file] = await this.checkFileExists(filePath);
        }
        
        // Log summary
        const passCount = Object.values(results).filter(exists => exists).length;
        const failCount = files.length - passCount;
        
        console.log(`✅ Verification complete: ${passCount} passed, ${failCount} failed`);
        
        return results;
    }
    
    /**
     * Check if audio file exists
     * @param {string} path - File path to check
     * @returns {Promise<boolean>}
     */
    async checkFileExists(path) {
        return new Promise((resolve) => {
            try {
                const audio = new Audio();
                
                const onSuccess = () => {
                    cleanup();
                    resolve(true);
                };
                
                const onError = (e) => {
                    cleanup();
                    console.warn(`⚠️ Audio file not found or cannot be loaded: ${path}`);
                    if (e && e.target && e.target.error) {
                        console.warn(`   Error code: ${e.target.error.code}, message: ${e.target.error.message}`);
                    }
                    resolve(false);
                };
                
                const cleanup = () => {
                    audio.removeEventListener('canplaythrough', onSuccess);
                    audio.removeEventListener('error', onError);
                };
                
                audio.addEventListener('canplaythrough', onSuccess);
                audio.addEventListener('error', onError);
                
                // Set timeout to prevent hanging
                setTimeout(() => {
                    cleanup();
                    console.warn(`⚠️ Audio file check timeout (5s): ${path}`);
                    resolve(false);
                }, 5000);
                
                audio.src = path;
            } catch (err) {
                console.warn(`⚠️ Exception while checking audio file: ${path}`, err);
                resolve(false);
            }
        });
    }
    
    /**
     * Get detailed narration status for debugging
     * @returns {Object} Current state information
     */
    getNarrationStatus() {
        const score = window.trustDecay ? window.trustDecay.getScore() : 100;
        const goodChoices = window.goodDecisionCount || 0;
        const riskyChoices = window.riskyChoiceCount || 0;
        
        return {
            isPlaying: this.isNarrationPlaying,
            isMuted: this.isMuted,
            currentPath: this.getNarrationPath(),
            trustScore: score,
            goodChoices: goodChoices,
            riskyChoices: riskyChoices,
            ambiencePlaying: this.ambiencePlaying,
            currentNarrationSrc: this.narrationAudio.src || null,
            narrationVolume: this.narrationAudio.volume,
            ambienceVolume: this.ambienceAudio.volume,
            sfxVolume: this.sfxAudio.volume
        };
    }
    
    /**
     * Pause narration (for game pause)
     */
    pauseNarration() {
        if (this.isNarrationPlaying && !this.narrationAudio.paused) {
            this.narrationAudio.pause();
            console.log('⏸️ Narration paused');
        }
    }
    
    /**
     * Resume narration (from game pause)
     */
    resumeNarration() {
        if (this.isNarrationPlaying && this.narrationAudio.paused) {
            try {
                this.narrationAudio.play().catch(err => {
                    this.logAudioError('resumeNarration', err, {
                        src: this.narrationAudio.src,
                        message: 'Failed to resume narration after pause'
                    });
                    this.isNarrationPlaying = false;
                    // Ensure callback fires even on error
                    if (this.onNarrationEnd) {
                        this.onNarrationEnd();
                    }
                });
                console.log('▶️ Narration resumed');
            } catch (err) {
                this.logAudioError('resumeNarration', err, {
                    src: this.narrationAudio.src,
                    message: 'Exception while resuming narration'
                });
                this.isNarrationPlaying = false;
                // Ensure callback fires even on error
                if (this.onNarrationEnd) {
                    this.onNarrationEnd();
                }
            }
        }
    }
    
    /**
     * Stop narration completely (for scene transitions)
     */
    stopNarration() {
        if (this.narrationAudio) {
            this.narrationAudio.pause();
            this.narrationAudio.currentTime = 0;
            this.isNarrationPlaying = false;
            console.log('⏹️ Narration stopped and reset');
        }
    }
    
    /**
     * Log audio error with detailed context
     * @param {string} context - Where the error occurred
     * @param {Error} error - The error object
     * @param {Object} details - Additional details
     */
    logAudioError(context, error, details = {}) {
        // Build comprehensive error information
        const errorInfo = {
            context,
            message: error?.message || 'Unknown error',
            name: error?.name || 'Error',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            location: window.location.href,
            ...details
        };
        
        // Log to console with clear formatting
        console.error(`❌ Audio Error [${context}]:`);
        console.error(`   Message: ${errorInfo.message}`);
        console.error(`   Timestamp: ${errorInfo.timestamp}`);
        
        if (details.path || details.filePath) {
            console.error(`   File Path: ${details.path || details.filePath}`);
        }
        
        if (details.fileName) {
            console.error(`   File Name: ${details.fileName}`);
        }
        
        // Log full error object for debugging
        console.error('   Full Error:', error);
        console.error('   Additional Details:', details);
        
        // Try to get current audio state (safely)
        try {
            const status = this.getNarrationStatus();
            console.error('   Audio State:', status);
        } catch (e) {
            console.error('   Audio State: Unable to retrieve (error in getNarrationStatus)');
        }
        
        // Log browser audio capabilities
        console.error('   Browser Info:', {
            canPlayMP3: this.narrationAudio.canPlayType('audio/mpeg'),
            audioContextAvailable: typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined'
        });
        
        // Optional: Send to analytics if available
        if (window.analytics && typeof window.analytics.trackError === 'function') {
            try {
                window.analytics.trackError('audio_error', errorInfo);
            } catch (analyticsError) {
                console.warn('⚠️ Failed to send error to analytics:', analyticsError);
            }
        }
        
        // Optional: Send to error tracking service (e.g., Sentry)
        if (window.Sentry && typeof window.Sentry.captureException === 'function') {
            try {
                window.Sentry.captureException(error, {
                    tags: { component: 'AudioManager', context },
                    extra: errorInfo
                });
            } catch (sentryError) {
                console.warn('⚠️ Failed to send error to Sentry:', sentryError);
            }
        }
    }
}

// Make globally accessible
if (typeof window !== 'undefined') {
    window.AudioManager = AudioManager;
    console.log('✅ AudioManager class exported to window');
    
    // Initialize immediately if not already initialized
    if (!window.audioManager) {
        try {
            window.audioManager = new AudioManager();
            console.log('✅ AudioManager auto-initialized on script load');
        } catch (err) {
            console.error('❌ Failed to auto-initialize AudioManager:', err);
        }
    }
}
