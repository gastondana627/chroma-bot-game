/**
 * Audio Manager for Eli's Story
 * Handles narration, ambience, and SFX
 */

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
            console.error('❌ Narration audio error:', e);
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
     * Play narration for a specific scene
     */
    playNarration(sceneNumber, ending = null) {
        if (this.isMuted) {
            console.log('🔇 Audio muted, skipping narration');
            if (this.onNarrationEnd) {
                this.onNarrationEnd();
            }
            return;
        }
        
        // Determine file name
        let fileName = `scene_${sceneNumber}_narration.mp3`;
        if (sceneNumber === 6 && ending) {
            fileName = `scene_6_narration_${ending}.mp3`;
        }
        
        const path = this.getAudioPath(`audio/narration/${fileName}`);
        
        console.log(`🎙️ Playing narration: ${fileName}`);
        
        this.narrationAudio.src = path;
        this.isNarrationPlaying = true;
        
        this.narrationAudio.play().catch(err => {
            console.error('❌ Failed to play narration:', err);
            this.isNarrationPlaying = false;
            if (this.onNarrationEnd) {
                this.onNarrationEnd();
            }
        });
    }
    
    /**
     * Start background ambience
     */
    startAmbience(ambienceType = 'gaming_room') {
        if (this.isMuted || this.ambiencePlaying) return;
        
        const path = this.getAudioPath(`audio/ambience/${ambienceType}_loop.mp3`);
        
        console.log(`🎵 Starting ambience: ${ambienceType}`);
        
        this.ambienceAudio.src = path;
        this.ambiencePlaying = true;
        
        // Fade in ambience
        this.ambienceAudio.volume = 0;
        this.ambienceAudio.play().then(() => {
            this.fadeVolume(this.ambienceAudio, 0.12, 2000);
        }).catch(err => {
            console.error('❌ Failed to play ambience:', err);
        });
    }
    
    /**
     * Stop background ambience
     */
    stopAmbience() {
        if (!this.ambiencePlaying) return;
        
        console.log('🔇 Stopping ambience');
        
        // Fade out then stop
        this.fadeVolume(this.ambienceAudio, 0, 1000).then(() => {
            this.ambienceAudio.pause();
            this.ambiencePlaying = false;
        });
    }
    
    /**
     * Play sound effect
     */
    playSFX(sfxName) {
        if (this.isMuted) return;
        
        const path = this.getAudioPath(`audio/sfx/${sfxName}.mp3`);
        
        console.log(`🔊 Playing SFX: ${sfxName}`);
        
        this.sfxAudio.src = path;
        this.sfxAudio.play().catch(err => {
            console.error('❌ Failed to play SFX:', err);
        });
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
        this.narrationAudio.pause();
        this.ambienceAudio.pause();
        this.sfxAudio.pause();
        
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
        const narrationPath = this.getAudioPath(`audio/narration/scene_${sceneNumber}_narration.mp3`);
        
        // Create temporary audio element to preload
        const preloader = new Audio();
        preloader.src = narrationPath;
        preloader.preload = 'auto';
        
        console.log(`📥 Preloading audio for scene ${sceneNumber}`);
    }
}

// Make globally accessible
if (typeof window !== 'undefined') {
    window.AudioManager = AudioManager;
}
