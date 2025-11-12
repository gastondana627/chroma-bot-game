/**
 * ChromaBot Corruption Sequence with Heartbeat Sync
 * Creates multi-sensory corruption experience combining:
 * - Heartbeat audio (slow → fast)
 * - ChromaBot flickering animation (synced to heartbeat)
 * - Eli's narration (plays over heartbeat)
 * - Rapid corruption sequence (after narration ends)
 */

console.log('📦 Loading chromabot-corruption-sequence.js...');
console.log('  - Script URL:', document.currentScript ? document.currentScript.src : 'unknown');
console.log('  - Timestamp:', new Date().toISOString());

class ChromaBotCorruptionSequence {
    constructor() {
        this.heartbeatInterval = null;
        this.flickerFrame = 0;
        this.isAccelerating = false;
        this.isRunning = false;
        this.accelerationInterval = null;
        this.isPausedHeartbeat = false;
        this.pausedInterval = null;
        
        console.log('✅ ChromaBot Corruption Sequence initialized');
    }
    
    /**
     * Start corruption sequence with audio-visual sync
     * Full flow: heartbeat → narration → acceleration → stop → corruption
     */
    startCorruptionSequence() {
        // Prevent multiple simultaneous sequences
        if (this.isRunning) {
            console.log('⚠️ Corruption sequence already running');
            return;
        }
        
        this.isRunning = true;
        console.log('💔 Starting corruption sequence with heartbeat sync');
        
        // Start heartbeat audio
        if (window.audioManager) {
            window.audioManager.playHeartbeatCorruption();
        } else {
            console.warn('⚠️ Audio manager not available for heartbeat');
        }
        
        // Start slow flicker (60 BPM = 1000ms interval)
        this.startHeartbeatFlicker(1000);
        
        // NOTE: Narration is now played when user clicks "Continue" on briefing
        // This prevents duplicate narration playback
        console.log('💔 Heartbeat sequence started (narration will play on briefing continue)');
        
        // Accelerate heartbeat after initial phase (5 seconds)
        setTimeout(() => {
            this.accelerateHeartbeat();
        }, 5000);
        
        // Stop heartbeat and complete corruption (7 seconds)
        setTimeout(() => {
            this.stopHeartbeat();
            this.completeCorruption();
            this.isRunning = false;
        }, 7000);
    }
    
    /**
     * Flicker ChromaBot in sync with heartbeat
     * @param {number} interval - Milliseconds between flickers (BPM-based)
     */
    startHeartbeatFlicker(interval) {
        // Clear any existing flicker
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        
        console.log(`💓 Starting heartbeat flicker at ${interval}ms (${60000/interval} BPM)`);
        
        this.heartbeatInterval = setInterval(() => {
            this.flickerChromaBot();
        }, interval);
    }
    
    /**
     * Single flicker pulse effect
     * Creates brief corruption flash synced to heartbeat
     */
    flickerChromaBot() {
        const chromaBot = document.querySelector('.chromabot-container');
        if (!chromaBot) {
            console.warn('⚠️ ChromaBot container not found for flicker');
            return;
        }
        
        // Flash to corrupted state briefly
        chromaBot.classList.add('corruption-pulse');
        
        // Remove after quick flash (100ms)
        setTimeout(() => {
            chromaBot.classList.remove('corruption-pulse');
        }, 100);
    }
    
    /**
     * Accelerate heartbeat from 60 to 120 BPM
     * Creates smooth transition over 2 seconds
     */
    accelerateHeartbeat() {
        console.log('💨 Accelerating heartbeat (60 → 120 BPM)');
        this.isAccelerating = true;
        
        // Clear slow interval
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        
        // Gradually speed up over 2 seconds
        let currentInterval = 1000; // 60 BPM
        const targetInterval = 500;  // 120 BPM
        const steps = 20;
        const intervalChange = (currentInterval - targetInterval) / steps;
        
        let step = 0;
        
        this.accelerationInterval = setInterval(() => {
            step++;
            currentInterval -= intervalChange;
            
            // Restart flicker at new speed
            if (this.heartbeatInterval) {
                clearInterval(this.heartbeatInterval);
            }
            this.startHeartbeatFlicker(currentInterval);
            
            // Add accelerating class for visual effect
            const chromaBot = document.querySelector('.chromabot-container');
            if (chromaBot && step > 10) {
                chromaBot.classList.add('accelerating');
            }
            
            if (step >= steps) {
                clearInterval(this.accelerationInterval);
                this.accelerationInterval = null;
                console.log('✅ Heartbeat acceleration complete (120 BPM)');
            }
        }, 100); // Update every 100ms
    }
    
    /**
     * Stop heartbeat abruptly
     * Creates jarring effect for psychological impact
     */
    stopHeartbeat() {
        console.log('🛑 Heartbeat stopped abruptly');
        
        // Clear all intervals
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        
        if (this.accelerationInterval) {
            clearInterval(this.accelerationInterval);
            this.accelerationInterval = null;
        }
        
        // Remove accelerating class
        const chromaBot = document.querySelector('.chromabot-container');
        if (chromaBot) {
            chromaBot.classList.remove('accelerating', 'corruption-pulse');
        }
        
        this.isAccelerating = false;
    }
    
    /**
     * Complete corruption animation
     * Triggers final corruption state and sound
     */
    completeCorruption() {
        console.log('💀 Corruption sequence complete');
        
        // Trigger final corruption animation
        if (window.chromaBotAnimator) {
            window.chromaBotAnimator.animateToBad();
        } else {
            console.warn('⚠️ ChromaBot animator not available');
        }
        
        // Play corruption completion sound
        if (window.audioManager) {
            window.audioManager.playSFX('corruption_level_up');
        }
    }
    
    /**
     * Emergency stop - cancel sequence immediately
     * Used for cleanup or scene changes
     */
    cancelSequence() {
        console.log('⏹️ Cancelling corruption sequence');
        
        this.stopHeartbeat();
        this.isRunning = false;
        
        // Remove all visual effects
        const chromaBot = document.querySelector('.chromabot-container');
        if (chromaBot) {
            chromaBot.classList.remove('accelerating', 'corruption-pulse');
        }
    }
    
    /**
     * Check if sequence is currently running
     * @returns {boolean}
     */
    isSequenceRunning() {
        return this.isRunning;
    }
    
    /**
     * Pause heartbeat flicker (for game pause)
     * Stores current interval for resume
     */
    pauseHeartbeat() {
        if (!this.heartbeatInterval && !this.accelerationInterval) {
            return; // Nothing to pause
        }
        
        console.log('⏸️ Pausing heartbeat corruption');
        
        // Store current interval for resume
        this.isPausedHeartbeat = true;
        
        // Clear intervals but don't reset state
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.pausedInterval = this.heartbeatInterval;
            this.heartbeatInterval = null;
        }
        
        if (this.accelerationInterval) {
            clearInterval(this.accelerationInterval);
            this.accelerationInterval = null;
        }
        
        // Remove visual effects while paused
        const chromaBot = document.querySelector('.chromabot-container');
        if (chromaBot) {
            chromaBot.classList.remove('corruption-pulse');
        }
    }
    
    /**
     * Resume heartbeat flicker (from game pause)
     * Continues from where it was paused
     */
    resumeHeartbeat() {
        if (!this.isPausedHeartbeat) {
            return; // Nothing to resume
        }
        
        console.log('▶️ Resuming heartbeat corruption');
        
        this.isPausedHeartbeat = false;
        
        // Resume flicker at current speed
        // Note: We don't restart the full sequence, just the flicker
        // The sequence timing will be off, but that's acceptable for pause/resume
        if (this.isAccelerating) {
            // If we were accelerating, restart at fast speed
            this.startHeartbeatFlicker(500); // 120 BPM
        } else {
            // Otherwise restart at slow speed
            this.startHeartbeatFlicker(1000); // 60 BPM
        }
    }
}

// Make globally accessible
if (typeof window !== 'undefined') {
    window.ChromaBotCorruptionSequence = ChromaBotCorruptionSequence;
    console.log('✅ ChromaBotCorruptionSequence class exported to window');
    console.log('  - Class name:', ChromaBotCorruptionSequence.name);
    console.log('  - typeof:', typeof ChromaBotCorruptionSequence);
    console.log('  - window.ChromaBotCorruptionSequence:', window.ChromaBotCorruptionSequence);
} else {
    console.error('❌ window object not available - cannot export ChromaBotCorruptionSequence');
}
