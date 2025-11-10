/**
 * ChromaBot Corruption Animator
 * Uses image sequence for smooth corruption/healing animations
 */

class ChromaBotCorruptionAnimator {
    constructor(containerId = 'chromabot-indicator') {
        this.container = document.getElementById(containerId);
        this.frames = [];
        this.currentFrame = 0;
        this.isAnimating = false;
        this.animationInterval = null;
        this.currentState = 'normal'; // normal, glitching, corrupted
        this.corruptionLevel = 0; // 0 = clean, 1-4 = increasing corruption
        this.badDecisionCount = 0; // Track consecutive bad decisions
        this.currentScene = 1; // Track current scene for scene-based animation speeds
        this.currentFrameIndex = 0; // Track which frame in the pair we're on (for pause/resume)
        this.currentFramePair = null; // Store current frame pair for pause/resume
        
        // Define corruption pairs for animated loops
        // Using less broken frames to avoid eye strain
        this.corruptionPairs = {
            0: [0],           // Clean - single frame
            1: [1, 2],        // Slight corruption - 2 frame loop
            2: [2, 3],        // Moderate corruption - 2 frame loop
            3: [3, 4],        // Heavy corruption - 2 frame loop
            4: [4, 4]         // Critical - stays on most broken frame (flicker)
        };
        
        this.init();
    }
    
    init() {
        // UNIFIED SYSTEM: Don't create separate indicator
        // Instead, control the video orb's image display
        console.log('✅ ChromaBot Corruption Animator initialized (Unified with video orb)');
        
        // Preload all frames for when we need them
        this.preloadFrames();
        
        // Get reference to video orb container
        this.videoOrbContainer = null;
        this.videoOrbVideo = null;
        this.imageElement = null;
        
        // Wait for video orb to be created
        const checkVideoOrb = setInterval(() => {
            this.videoOrbContainer = document.querySelector('#chromabot-video-overlay .chromabot-container');
            this.videoOrbVideo = document.getElementById('chromabot-video');
            
            if (this.videoOrbContainer && this.videoOrbVideo) {
                clearInterval(checkVideoOrb);
                console.log('✅ Video orb found, ready to switch to image mode when needed');
            }
        }, 100);
    }
    

    
    preloadFrames() {
        // Dynamic path resolution for localhost and production
        const basePath = this.getBasePath() + 'chroma-bot/assets/img/Chroma_Org_Logo_No_Background/';
        
        // Load frames 1-5
        for (let i = 1; i <= 5; i++) {
            const img = new Image();
            img.src = basePath + 'Chroma_' + i + '.png';
            this.frames.push(img);
        }
        
        console.log('📥 Preloaded ' + this.frames.length + ' ChromaBot frames from: ' + basePath);
    }
    
    /**
     * Get base path for assets (works in localhost and production)
     */
    getBasePath() {
        // Check if we're in a subdirectory (like videos/eli/)
        const currentPath = window.location.pathname;
        
        // If we're in videos/eli/, go up two levels
        if (currentPath.includes('/videos/eli/')) {
            return '../../';
        }
        // If we're in videos/, go up one level
        else if (currentPath.includes('/videos/')) {
            return '../';
        }
        // If we're at root or in production
        else {
            return '/';
        }
    }
    
    setFrame(index) {
        if (index >= 0 && index < this.frames.length) {
            this.currentFrame = index;
            
            // Ensure image element exists and is visible
            if (!this.imageElement) {
                console.warn('⚠️ Image element not found, cannot set frame');
                return;
            }
            
            // Force visibility
            this.imageElement.style.display = 'block';
            this.imageElement.src = this.frames[index].src;
            
            console.log(`✅ Frame ${index} set in UI (src: ${this.frames[index].src})`);
        }
    }
    
    /**
     * Animate to GOOD state (brighten, heal)
     * Reduces corruption level and heals progressively
     * UNIFIED: May switch back to video mode if fully healed
     */
    animateToGood() {
        if (!this.videoOrbContainer) {
            console.warn('⚠️ Video orb not ready yet');
            return;
        }
        
        this.stopAnimation();
        this.currentState = 'normal';
        
        // Reduce corruption level (good decisions heal)
        this.badDecisionCount = Math.max(0, this.badDecisionCount - 1);
        this.corruptionLevel = Math.max(0, this.corruptionLevel - 1);
        
        console.log(`✅ ChromaBot: Healing animation (Level ${this.corruptionLevel})`);
        
        // If fully healed, switch back to video mode
        if (this.corruptionLevel === 0) {
            this.switchToVideoMode();
            console.log('🔄 Switched video orb back to video mode (fully healed)');
            
            // Apply good state styling to container
            this.videoOrbContainer.classList.remove('glitching', 'corrupted');
            this.videoOrbContainer.classList.add('normal');
            this.videoOrbContainer.style.filter = 'brightness(1.2) saturate(1.2)';
        } else {
            // Still corrupted, just reduce level
            this.startCorruptionLoop();
            
            // Apply styling
            this.videoOrbContainer.classList.remove('glitching', 'corrupted');
            this.videoOrbContainer.classList.add('normal');
            this.videoOrbContainer.style.filter = 'brightness(1.5) saturate(1.5)';
            
            setTimeout(() => {
                this.videoOrbContainer.style.filter = 'brightness(1.2) saturate(1.2)';
            }, 1000);
        }
    }
    
    /**
     * Animate to NEUTRAL state (flicker)
     * Maintains current corruption level with slight glitch
     */
    animateToNeutral() {
        this.stopAnimation();
        this.currentState = 'glitching';
        
        console.log(`⚠️ ChromaBot: Glitching animation (Level ${this.corruptionLevel})`);
        
        // Don't change corruption level for neutral
        this.startCorruptionLoop();
        
        this.container.classList.remove('normal', 'corrupted');
        this.container.classList.add('glitching');
        this.container.style.opacity = '0.7';
        this.container.style.filter = 'brightness(1) saturate(0.8) hue-rotate(30deg)';
    }
    
    /**
     * Play sound effect
     */
    playSound(soundName, volume = 0.5) {
        try {
            const basePath = this.getBasePath();
            const audio = new Audio(`${basePath}videos/eli/audio/chromabot/${soundName}.wav`);
            audio.volume = volume;
            audio.play().catch(err => console.log('Sound play prevented:', err.message));
        } catch (error) {
            console.log('Sound error:', error.message);
        }
    }
    
    /**
     * Animate to BAD state (corrupt, break down)
     * Increases corruption level with each bad decision
     * UNIFIED: Switches video orb from video to corrupted images
     */
    animateToBad() {
        if (!this.videoOrbContainer || !this.videoOrbVideo) {
            console.warn('⚠️ Video orb not ready yet');
            return;
        }
        
        this.stopAnimation();
        this.currentState = 'corrupted';
        
        // Increase corruption level (max 4)
        this.badDecisionCount++;
        const previousLevel = this.corruptionLevel;
        this.corruptionLevel = Math.min(4, this.corruptionLevel + 1);
        
        console.log(`❌ ChromaBot: Corruption animation (Level ${this.corruptionLevel}, Bad decisions: ${this.badDecisionCount})`);
        
        // Play appropriate sound
        if (this.corruptionLevel > previousLevel) {
            this.playSound('corruption_level_up', 0.5);
        } else {
            this.playSound('corruption_tick', 0.3);
        }
        
        // On first corruption, switch from video to image mode
        if (this.badDecisionCount === 1) {
            this.switchToImageMode();
            console.log('🔄 Switched video orb from video to corrupted images');
        }
        
        // Show dramatic transition effect
        this.showCorruptionTransition();
        
        // Start new corruption loop at higher level
        setTimeout(() => {
            this.startCorruptionLoop();
        }, 800);
    }
    
    /**
     * Switch video orb from video to image mode
     */
    switchToImageMode() {
        if (!this.videoOrbContainer || !this.videoOrbVideo) return;
        
        // Hide video
        this.videoOrbVideo.style.display = 'none';
        
        // Create image element if it doesn't exist
        if (!this.imageElement) {
            this.imageElement = document.createElement('img');
            this.imageElement.className = 'chromabot-frame';
            this.imageElement.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                pointer-events: none;
            `;
            this.videoOrbContainer.appendChild(this.imageElement);
        } else {
            // Image element exists from previous playthrough - make sure it's visible
            this.imageElement.style.display = 'block';
        }
        
        // Set initial corrupted frame
        this.setFrame(1);
    }
    
    /**
     * Switch video orb back to video mode (for healing)
     */
    switchToVideoMode() {
        if (!this.videoOrbContainer || !this.videoOrbVideo) return;
        
        // Show video
        this.videoOrbVideo.style.display = 'block';
        
        // Hide image if it exists
        if (this.imageElement) {
            this.imageElement.style.display = 'none';
        }
        
        // Resume video playback
        this.videoOrbVideo.play().catch(err => {
            console.log('Video play prevented:', err.message);
        });
    }
    
    /**
     * Start corruption loop based on current level
     * Uses image pairs to create animated corruption effect
     * UNIFIED: Animates the video orb's image element
     */
    startCorruptionLoop() {
        this.stopAnimation();
        
        if (!this.videoOrbContainer || !this.imageElement) {
            console.warn('⚠️ Video orb not ready for corruption loop');
            return;
        }
        
        const framePair = this.corruptionPairs[this.corruptionLevel];
        
        if (framePair.length === 1) {
            // Level 0 - Clean, should be in video mode
            this.switchToVideoMode();
            return;
        }
        
        // Initialize frame index if not set (for resume functionality)
        if (this.currentFrameIndex === undefined) {
            this.currentFrameIndex = 0;
        }
        
        const speed = this.getLoopSpeed(this.corruptionLevel);
        const scene = window.currentSceneIndex !== undefined ? window.currentSceneIndex + 1 : this.currentScene;
        
        console.log(`🎬 Starting corruption animation: Scene ${scene}, Level ${this.corruptionLevel}, Speed ${speed}ms, Frames [${framePair.join(', ')}]`);
        console.log(`⏱️ ACTUAL INTERVAL SPEED BEING USED: ${speed}ms (${speed/1000} seconds per frame)`);
        
        this.isAnimating = true;
        this.currentFramePair = framePair; // Store for pause/resume
        this.lastFrameTime = Date.now();
        
        console.log(`🚨 ANIMATION STARTING WITH ${speed}ms INTERVAL (${speed/1000} SECONDS)`);
        
        this.animationInterval = setInterval(() => {
            const now = Date.now();
            const actualDelay = now - this.lastFrameTime;
            this.lastFrameTime = now;
            
            this.setFrame(framePair[this.currentFrameIndex]);
            console.log(`🖼️ Frame ${framePair[this.currentFrameIndex]} displayed | Actual delay: ${actualDelay}ms (${(actualDelay/1000).toFixed(1)}s) | Expected: ${speed}ms (${(speed/1000).toFixed(1)}s)`);
            this.currentFrameIndex = (this.currentFrameIndex + 1) % framePair.length;
        }, speed);
        
        // Apply styling based on corruption level
        this.applyCorruptionStyling();
    }
    
    /**
     * Get loop speed based on SCENE (not just corruption level)
     * Scene-based progressive intensity - EXTREMELY SLOW for proper visibility
     * Scene 4 = Extremely Slow, Scene 5 = Very Slow, Scene 6 = Slow
     */
    getLoopSpeed(level) {
        // Get current scene from global state
        const scene = window.currentSceneIndex !== undefined ? window.currentSceneIndex + 1 : this.currentScene;
        
        // EXTREMELY SLOW speeds - DOUBLED from previous attempt
        // Each frame should be visible for many seconds
        // Note: Corruption can start in Scene 3 but should use Scene 4 speed
        if (scene <= 3) {
            // If corrupted in Scene 3, use Scene 4 speed (corruption starts here)
            if (this.corruptionLevel > 0) {
                return level === 1 ? 16000 : 12000; // Use Scene 4 speed (12-16 seconds)
            }
            return 0; // No corruption possible yet
        } else if (scene === 4) {
            // Scene 4: EXTREMELY SLOW (12-16 seconds per frame)
            return level === 1 ? 16000 : 12000; // 12-16 seconds - EXTREMELY visible
        } else if (scene === 5) {
            // Scene 5: VERY SLOW (8-10 seconds per frame)
            return level === 1 ? 10000 : 8000; // 8-10 seconds - very comfortable
        } else if (scene === 6) {
            // Scene 6: SLOW (6-8 seconds per frame)
            return level === 1 ? 8000 : 6000; // 6-8 seconds - moderate speed
        }
        
        // Fallback (shouldn't reach here)
        return 12000;
    }
    
    /**
     * Update current scene for animation speed calculation
     * Handles state management when moving between scenes
     */
    setScene(sceneNumber) {
        const previousScene = this.currentScene;
        this.currentScene = sceneNumber;
        console.log(`🎬 ChromaBot animator: Scene ${sceneNumber} set (was Scene ${previousScene})`);
        
        // STATE MANAGEMENT: Going backwards to pre-corruption scenes
        if (sceneNumber < 3 && this.corruptionLevel > 0) {
            console.log(`⏮️ Going back to Scene ${sceneNumber} (before corruption) - resetting to video mode`);
            this.reset();
            return;
        }
        
        // STATE MANAGEMENT: In corruption scenes but not corrupted yet
        if (sceneNumber >= 3 && this.corruptionLevel === 0) {
            console.log(`✅ Scene ${sceneNumber} ready for corruption (currently clean)`);
            // Stay in video mode, ready for corruption to trigger
            return;
        }
        
        // STATE MANAGEMENT: Already corrupted, update animation speed for new scene
        if (this.corruptionLevel > 0 && this.isAnimating) {
            console.log(`🔄 Scene ${sceneNumber} - updating corruption animation speed`);
            this.startCorruptionLoop();
        }
    }
    
    /**
     * Apply visual styling based on corruption level
     * UNIFIED: Applies to video orb container
     */
    applyCorruptionStyling() {
        if (!this.videoOrbContainer) return;
        
        this.videoOrbContainer.classList.remove('normal', 'glitching', 'corrupted');
        
        switch(this.corruptionLevel) {
            case 0:
                this.videoOrbContainer.classList.add('normal');
                this.videoOrbContainer.style.filter = 'brightness(1.2) saturate(1.2)';
                break;
            case 1:
                this.videoOrbContainer.classList.add('glitching');
                this.videoOrbContainer.style.filter = 'brightness(1.1) saturate(1) hue-rotate(15deg)';
                break;
            case 2:
                this.videoOrbContainer.classList.add('glitching');
                this.videoOrbContainer.style.filter = 'brightness(0.9) saturate(0.8) hue-rotate(45deg)';
                break;
            case 3:
                this.videoOrbContainer.classList.add('corrupted');
                this.videoOrbContainer.style.filter = 'brightness(0.6) saturate(0.5) hue-rotate(120deg)';
                break;
            case 4:
                this.videoOrbContainer.classList.add('corrupted');
                this.videoOrbContainer.style.filter = 'brightness(0.4) saturate(0.3) hue-rotate(180deg)';
                break;
        }
    }
    
    /**
     * Show dramatic transition when corruption increases
     * UNIFIED: Applies to video orb container
     * Mild flash effect - comfortable for eyes
     */
    showCorruptionTransition() {
        if (!this.videoOrbContainer) return;
        
        // Mild flash effect on video orb (less intense, more comfortable)
        this.videoOrbContainer.style.transition = 'none';
        this.videoOrbContainer.style.filter = 'brightness(1.8) saturate(0.3) contrast(2)';
        this.videoOrbContainer.style.transform = 'scale(1.15)';
        
        setTimeout(() => {
            this.videoOrbContainer.style.transition = 'all 0.6s ease';
            this.videoOrbContainer.style.transform = 'scale(1)';
        }, 150);
        
        // Add full-screen circular vignette effect
        this.showVignetteEffect();
    }
    
    /**
     * Show mild flash on scene change (helps with animation load)
     * Called when entering a new scene while corrupted
     */
    showSceneChangeFlash() {
        if (!this.videoOrbContainer || this.corruptionLevel === 0) return;
        
        console.log('✨ Scene change flash (helps with animation transition)');
        
        // Very mild flash - just enough to help with animation load
        this.videoOrbContainer.style.transition = 'none';
        this.videoOrbContainer.style.filter = 'brightness(1.5) saturate(0.5)';
        
        setTimeout(() => {
            this.videoOrbContainer.style.transition = 'all 0.4s ease';
            // Return to normal corruption styling
            this.applyCorruptionStyling();
        }, 100);
    }
    
    /**
     * Show full-screen circular vignette effect
     */
    showVignetteEffect() {
        // Remove existing vignette if any
        const existing = document.getElementById('corruption-vignette');
        if (existing) existing.remove();
        
        // Create vignette overlay
        const vignette = document.createElement('div');
        vignette.id = 'corruption-vignette';
        vignette.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.95) 100%);
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 1s ease-out;
        `;
        
        document.body.appendChild(vignette);
        
        // Fade in
        setTimeout(() => {
            vignette.style.opacity = '1';
        }, 50);
        
        // Fade out after 2 seconds
        setTimeout(() => {
            vignette.style.opacity = '0';
            setTimeout(() => vignette.remove(), 1000);
        }, 2000);
    }
    
    /**
     * Stop current animation
     * Clears interval and ensures no animation is running
     */
    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
            console.log('🛑 Animation interval cleared');
        }
        this.isAnimating = false;
    }
    
    /**
     * Pause animation (when chat opens)
     * Freezes on current frame for better visibility
     */
    pauseAnimation() {
        if (this.isAnimating || this.animationInterval) {
            if (this.animationInterval) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
            }
            this.isAnimating = false;
            console.log(`⏸️ ChromaBot animation PAUSED on frame ${this.currentFrameIndex} (chat opened)`);
            // DO NOT clear currentFrameIndex - we need it to resume from same spot
        } else {
            console.log('⏸️ ChromaBot animation already paused or not running');
        }
    }
    
    /**
     * Resume animation (when chat closes)
     * Continues from EXACT same frame where it was paused
     */
    resumeAnimation() {
        // Guard: Don't resume if already animating
        if (this.isAnimating) {
            console.log('⚠️ ChromaBot animation already running, not resuming');
            return;
        }
        
        // Guard: Only resume if corrupted
        if (this.corruptionLevel === 0) {
            console.log('⚠️ ChromaBot not corrupted, nothing to resume');
            return;
        }
        
        // Guard: Need frame pair to animate
        if (!this.currentFramePair) {
            console.log('⚠️ No frame pair available, cannot resume');
            return;
        }
        
        console.log(`▶️ ChromaBot animation RESUMING from frame ${this.currentFrameIndex} (chat closed)`);
        
        const speed = this.getLoopSpeed(this.corruptionLevel);
        const scene = window.currentSceneIndex !== undefined ? window.currentSceneIndex + 1 : this.currentScene;
        
        console.log(`🚨 RESUME SPEED: ${speed}ms (${speed/1000} SECONDS PER FRAME)`);
        
        this.isAnimating = true;
        this.lastFrameTime = Date.now();
        
        // Resume animation from current frame index
        this.animationInterval = setInterval(() => {
            const now = Date.now();
            const actualDelay = now - this.lastFrameTime;
            this.lastFrameTime = now;
            
            this.setFrame(this.currentFramePair[this.currentFrameIndex]);
            console.log(`🖼️ Frame ${this.currentFramePair[this.currentFrameIndex]} displayed | Actual delay: ${actualDelay}ms (${(actualDelay/1000).toFixed(1)}s) | Expected: ${speed}ms (${(speed/1000).toFixed(1)}s)`);
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.currentFramePair.length;
        }, speed);
    }
    
    /**
     * Quick state change based on trust score
     */
    updateByTrustScore(trustScore) {
        if (trustScore >= 70) {
            this.animateToGood();
        } else if (trustScore >= 40) {
            this.animateToNeutral();
        } else {
            this.animateToBad();
        }
    }
    
    /**
     * Reset to normal state
     * UNIFIED: Switches back to video mode
     */
    reset() {
        this.stopAnimation();
        this.corruptionLevel = 0;
        this.badDecisionCount = 0;
        this.currentState = 'normal';
        this.currentFrameIndex = 0;
        this.currentFramePair = null;
        
        // Switch back to video mode
        this.switchToVideoMode();
        
        if (this.videoOrbContainer) {
            this.videoOrbContainer.classList.remove('glitching', 'corrupted');
            this.videoOrbContainer.classList.add('normal');
            this.videoOrbContainer.style.filter = 'brightness(1.2) saturate(1.2)';
            this.videoOrbContainer.style.transform = 'scale(1)';
        }
        
        console.log('🔄 ChromaBot reset to clean state (video mode)');
    }
    
    /**
     * Sync animator state with external bad decision count
     * Useful when loading saved state or navigating between scenes
     */
    syncState(badDecisions, currentScene) {
        console.log(`🔄 Syncing ChromaBot state: ${badDecisions} bad decisions, Scene ${currentScene}`);
        
        this.currentScene = currentScene;
        
        // If no bad decisions or in pre-corruption scenes, reset
        if (badDecisions === 0 || currentScene < 3) {
            if (this.corruptionLevel > 0) {
                console.log('🔄 Syncing to clean state');
                this.reset();
            }
            return;
        }
        
        // Calculate corruption level from bad decisions
        const targetLevel = Math.min(4, badDecisions);
        
        if (targetLevel !== this.corruptionLevel) {
            console.log(`🔄 Syncing corruption level: ${this.corruptionLevel} → ${targetLevel}`);
            this.corruptionLevel = targetLevel;
            this.badDecisionCount = badDecisions;
            
            // Switch to image mode if not already
            if (!this.imageElement || this.imageElement.style.display === 'none') {
                this.switchToImageMode();
            }
            
            // Start animation at correct level
            this.startCorruptionLoop();
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.ChromaBotCorruptionAnimator = ChromaBotCorruptionAnimator;
}
