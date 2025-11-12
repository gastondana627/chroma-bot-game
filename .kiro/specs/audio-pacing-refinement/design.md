# Audio Pacing Refinement - Design Document

## Overview

This design refines the existing audio narration system to ensure optimal pacing, seamless integration with gameplay, and enhanced psychological horror atmosphere. The system builds on the current AudioManager implementation while adding verification tools, timing optimizations, and comprehensive error handling.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Game Flow Controller                     │
│                  (eli-scenes-config.js)                      │
└────────────┬────────────────────────────────┬───────────────┘
             │                                │
             ▼                                ▼
┌────────────────────────┐      ┌────────────────────────────┐
│   Audio Manager        │      │   Trust Decay System       │
│   (audio-manager.js)   │◄─────┤   (trust-decay-system.js)  │
└────────────┬───────────┘      └────────────────────────────┘
             │
             ├──► Narration Channel (0.85 volume)
             ├──► Ambience Channel (0.12 volume)
             └──► SFX Channel (0.5 volume)
```

### Data Flow

```
Player Makes Decision
    ↓
Trust Score Updated
    ↓
Calculate Narration Path (success/moderate/failure)
    ↓
Scene Transition Triggered
    ↓
Audio Manager Plays Narration
    ↓
Wait for Narration Complete
    ↓
Advance to Next Scene
```

## Components and Interfaces

### 1. Enhanced Audio Manager

**File:** `videos/eli/audio-manager.js`

**New Methods:**

```javascript
class AudioManager {
    // Existing methods remain...
    
    /**
     * Verify all required narration files exist
     * @returns {Promise<Object>} Status of each file
     */
    async verifyNarrationFiles() {
        const files = [
            'scene_1_to_2_success.mp3',
            'scene_1_to_2_moderate.mp3',
            'scene_1_to_2_failure.mp3',
            // ... all 18 files
        ];
        
        const results = {};
        for (const file of files) {
            results[file] = await this.checkFileExists(
                this.getAudioPath(`audio/narration/${file}`)
            );
        }
        return results;
    }
    
    /**
     * Check if audio file exists
     * @param {string} path - File path to check
     * @returns {Promise<boolean>}
     */
    async checkFileExists(path) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.addEventListener('canplaythrough', () => resolve(true));
            audio.addEventListener('error', () => resolve(false));
            audio.src = path;
        });
    }
    
    /**
     * Get detailed narration status for debugging
     * @returns {Object} Current state information
     */
    getNarrationStatus() {
        return {
            isPlaying: this.isNarrationPlaying,
            isMuted: this.isMuted,
            currentPath: this.getNarrationPath(),
            trustScore: window.trustDecay ? window.trustDecay.getScore() : 100,
            goodChoices: window.goodDecisionCount || 0,
            riskyChoices: window.riskyChoiceCount || 0
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
            this.narrationAudio.play();
            console.log('▶️ Narration resumed');
        }
    }
}
```

### 2. Scene Transition Handler

**File:** `videos/eli/eli-scenes-config.js`

**Enhanced Transition Logic:**

```javascript
/**
 * Handle scene transitions with narration
 * @param {number} fromScene - Current scene (1-6)
 * @param {number} toScene - Next scene (2-6)
 */
function handleSceneTransition(fromScene, toScene) {
    console.log(`🎬 Transitioning: Scene ${fromScene} → Scene ${toScene}`);
    
    // Check if narration should play for this transition
    const shouldPlayNarration = (fromScene >= 3 && fromScene <= 5);
    
    if (shouldPlayNarration && window.audioManager) {
        const narrationPath = window.audioManager.getNarrationPath();
        console.log(`🎙️ Playing transition narration (${narrationPath} path)`);
        
        // Set up completion callback
        window.audioManager.onNarrationEnd = () => {
            console.log('✅ Narration complete, advancing scene');
            // Add brief pause after narration
            setTimeout(() => {
                nextScene();
            }, 1000);
        };
        
        // Play narration
        window.audioManager.playTransitionNarration(fromScene, toScene, narrationPath);
    } else {
        // No narration, use standard delay
        console.log('⏭️ No narration for this transition');
        setTimeout(() => nextScene(), 1000);
    }
}
```

### 3. Testing Interface

**New File:** `videos/eli/test-audio-pacing.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Audio Pacing Test Interface</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background: #0a0a0a;
            color: #00ff00;
            padding: 20px;
        }
        .test-section {
            border: 1px solid #00ff00;
            padding: 15px;
            margin: 15px 0;
        }
        button {
            background: #003300;
            color: #00ff00;
            border: 1px solid #00ff00;
            padding: 10px 20px;
            margin: 5px;
            cursor: pointer;
        }
        button:hover {
            background: #005500;
        }
        .status {
            background: #001100;
            padding: 10px;
            margin: 10px 0;
            border-left: 3px solid #00ff00;
        }
    </style>
</head>
<body>
    <h1>🎙️ Audio Pacing Test Interface</h1>
    
    <div class="test-section">
        <h2>Narration Path Testing</h2>
        <button onclick="testPath('success')">Test Success Path</button>
        <button onclick="testPath('moderate')">Test Moderate Path</button>
        <button onclick="testPath('failure')">Test Failure Path</button>
        <div id="path-status" class="status"></div>
    </div>
    
    <div class="test-section">
        <h2>Scene Transitions</h2>
        <button onclick="testTransition(3, 4)">Test Scene 3→4</button>
        <button onclick="testTransition(4, 5)">Test Scene 4→5</button>
        <button onclick="testTransition(5, 6)">Test Scene 5→6</button>
        <div id="transition-status" class="status"></div>
    </div>
    
    <div class="test-section">
        <h2>Ending Narrations</h2>
        <button onclick="testEnding('success')">Test Success Ending</button>
        <button onclick="testEnding('moderate')">Test Moderate Ending</button>
        <button onclick="testEnding('failure')">Test Failure Ending</button>
        <div id="ending-status" class="status"></div>
    </div>
    
    <div class="test-section">
        <h2>File Verification</h2>
        <button onclick="verifyAllFiles()">Verify All Audio Files</button>
        <div id="verification-status" class="status"></div>
    </div>
    
    <div class="test-section">
        <h2>Current Status</h2>
        <button onclick="showStatus()">Show Audio Status</button>
        <div id="current-status" class="status"></div>
    </div>
    
    <script src="audio-manager.js"></script>
    <script src="test-audio-pacing.js"></script>
</body>
</html>
```

### 4. Testing Script

**New File:** `videos/eli/test-audio-pacing.js`

```javascript
// Initialize audio manager
let audioManager;

window.addEventListener('DOMContentLoaded', () => {
    audioManager = new AudioManager();
    console.log('✅ Test interface loaded');
});

/**
 * Test specific narration path
 */
function testPath(path) {
    const statusDiv = document.getElementById('path-status');
    statusDiv.innerHTML = `Testing ${path} path...`;
    
    // Simulate trust score for path
    if (path === 'success') {
        window.trustDecay = { getScore: () => 80 };
        window.goodDecisionCount = 5;
        window.riskyChoiceCount = 1;
    } else if (path === 'moderate') {
        window.trustDecay = { getScore: () => 55 };
        window.goodDecisionCount = 3;
        window.riskyChoiceCount = 3;
    } else {
        window.trustDecay = { getScore: () => 25 };
        window.goodDecisionCount = 1;
        window.riskyChoiceCount = 5;
    }
    
    const calculatedPath = audioManager.getNarrationPath();
    statusDiv.innerHTML = `
        <strong>Path Test: ${path}</strong><br>
        Calculated Path: ${calculatedPath}<br>
        Trust Score: ${window.trustDecay.getScore()}<br>
        Good Choices: ${window.goodDecisionCount}<br>
        Risky Choices: ${window.riskyChoiceCount}<br>
        ${calculatedPath === path ? '✅ PASS' : '❌ FAIL'}
    `;
}

/**
 * Test scene transition narration
 */
function testTransition(fromScene, toScene) {
    const statusDiv = document.getElementById('transition-status');
    statusDiv.innerHTML = `Playing Scene ${fromScene}→${toScene} narration...`;
    
    const path = audioManager.getNarrationPath();
    
    audioManager.onNarrationEnd = () => {
        statusDiv.innerHTML = `
            <strong>Transition Test: Scene ${fromScene}→${toScene}</strong><br>
            Path: ${path}<br>
            ✅ Narration completed successfully
        `;
    };
    
    audioManager.playTransitionNarration(fromScene, toScene, path);
}

/**
 * Test ending narration
 */
function testEnding(endingType) {
    const statusDiv = document.getElementById('ending-status');
    statusDiv.innerHTML = `Playing ${endingType} ending...`;
    
    audioManager.onNarrationEnd = () => {
        statusDiv.innerHTML = `
            <strong>Ending Test: ${endingType}</strong><br>
            ✅ Ending narration completed successfully
        `;
    };
    
    audioManager.playEndingNarration(endingType);
}

/**
 * Verify all audio files exist
 */
async function verifyAllFiles() {
    const statusDiv = document.getElementById('verification-status');
    statusDiv.innerHTML = 'Verifying audio files...';
    
    const results = await audioManager.verifyNarrationFiles();
    
    let html = '<strong>File Verification Results:</strong><br><br>';
    let passCount = 0;
    let failCount = 0;
    
    for (const [file, exists] of Object.entries(results)) {
        if (exists) {
            html += `✅ ${file}<br>`;
            passCount++;
        } else {
            html += `❌ ${file}<br>`;
            failCount++;
        }
    }
    
    html += `<br><strong>Summary:</strong> ${passCount} passed, ${failCount} failed`;
    statusDiv.innerHTML = html;
}

/**
 * Show current audio status
 */
function showStatus() {
    const statusDiv = document.getElementById('current-status');
    const status = audioManager.getNarrationStatus();
    
    statusDiv.innerHTML = `
        <strong>Current Audio Status:</strong><br>
        Is Playing: ${status.isPlaying}<br>
        Is Muted: ${status.isMuted}<br>
        Current Path: ${status.currentPath}<br>
        Trust Score: ${status.trustScore}<br>
        Good Choices: ${status.goodChoices}<br>
        Risky Choices: ${status.riskyChoices}
    `;
}
```

## Data Models

### Narration Configuration

```javascript
const NARRATION_CONFIG = {
    transitions: {
        '1_to_2': {
            success: 'scene_1_to_2_success.mp3',
            moderate: 'scene_1_to_2_moderate.mp3',
            failure: 'scene_1_to_2_failure.mp3'
        },
        '2_to_3': {
            success: 'scene_2_to_3_success.mp3',
            moderate: 'scene_2_to_3_moderate.mp3',
            failure: 'scene_2_to_3_failure.mp3'
        },
        '3_to_4': {
            success: 'scene_3_to_4_success.mp3',
            moderate: 'scene_3_to_4_moderate.mp3',
            failure: 'scene_3_to_4_failure.mp3'
        },
        '4_to_5': {
            success: 'scene_4_to_5_success.mp3',
            moderate: 'scene_4_to_5_moderate.mp3',
            failure: 'scene_4_to_5_failure.mp3'
        },
        '5_to_6': {
            success: 'scene_5_to_6_success.mp3',
            moderate: 'scene_5_to_6_moderate.mp3',
            failure: 'scene_5_to_6_failure.mp3'
        }
    },
    endings: {
        success: 'ending_success.mp3',
        moderate: 'ending_moderate.mp3',
        failure: 'ending_failure.mp3'
    },
    timing: {
        postDecisionDelay: 4000,      // Wait after decision feedback
        postNarrationDelay: 1000,     // Wait after narration ends
        fallbackDelay: 1000,          // Wait if no narration
        narrationTimeout: 6000        // Max narration duration
    }
};
```

### Audio State Model

```javascript
const audioState = {
    narration: {
        isPlaying: false,
        currentFile: null,
        currentPath: null,
        volume: 0.85
    },
    ambience: {
        isPlaying: false,
        currentType: null,
        volume: 0.12
    },
    sfx: {
        lastPlayed: null,
        volume: 0.5
    },
    global: {
        isMuted: false,
        masterVolume: 1.0
    }
};
```

## Error Handling

### Error Scenarios and Responses

1. **Audio File Not Found**
   - Log error to console with file path
   - Invoke onNarrationEnd callback immediately
   - Continue game flow without blocking

2. **Audio Playback Failure**
   - Catch promise rejection from play()
   - Log detailed error information
   - Trigger fallback timing mechanism

3. **AudioManager Not Initialized**
   - Check for window.audioManager existence
   - Skip audio playback gracefully
   - Use standard timing delays

4. **Narration Timeout**
   - Set maximum 6-second timeout
   - Force advancement if narration exceeds limit
   - Log timeout warning

### Error Logging

```javascript
function logAudioError(context, error, details = {}) {
    console.error(`❌ Audio Error [${context}]:`, error);
    console.error('   Details:', details);
    console.error('   Timestamp:', new Date().toISOString());
    
    // Optional: Send to analytics
    if (window.analytics) {
        window.analytics.trackError('audio_error', {
            context,
            error: error.message,
            ...details
        });
    }
}
```

## Testing Strategy

### Unit Tests

1. **Path Calculation Tests**
   - Test success path conditions
   - Test moderate path conditions
   - Test failure path conditions
   - Test edge cases (equal choices, boundary scores)

2. **File Verification Tests**
   - Verify all 18 narration files exist
   - Test path resolution (localhost vs production)
   - Verify file format and duration

3. **Timing Tests**
   - Measure actual narration duration
   - Verify delays match configuration
   - Test timeout mechanisms

### Integration Tests

1. **Scene Transition Tests**
   - Test Scene 3→4 with all paths
   - Test Scene 4→5 with all paths
   - Test Scene 5→6 with all paths
   - Verify smooth advancement

2. **Decision Flow Tests**
   - Make decision → Verify narration plays
   - Verify narration reflects choice
   - Verify scene advances after narration

3. **Error Handling Tests**
   - Test with missing audio files
   - Test with network errors
   - Verify graceful degradation

### User Experience Tests

1. **Pacing Tests**
   - Play through complete story
   - Verify narration doesn't feel rushed
   - Verify adequate time to absorb feedback

2. **Audio Quality Tests**
   - Verify volume levels are appropriate
   - Check for audio clipping or distortion
   - Verify voice consistency across files

3. **Immersion Tests**
   - Verify narration enhances atmosphere
   - Check that audio doesn't break flow
   - Verify psychological impact

## Performance Considerations

### Optimization Strategies

1. **Preloading**
   - Preload next scene's narration during current scene
   - Use browser's native audio preload
   - Cache audio elements for reuse

2. **Memory Management**
   - Reuse audio elements instead of creating new ones
   - Clear completed audio from memory
   - Limit simultaneous audio streams

3. **Network Efficiency**
   - Compress audio files (MP3, 128kbps)
   - Use CDN for production deployment
   - Implement progressive loading

### Performance Metrics

```javascript
const performanceMetrics = {
    narrationLoadTime: [],      // Time to load audio file
    narrationPlayDelay: [],     // Delay from trigger to playback
    totalTransitionTime: [],    // Complete transition duration
    errorRate: 0,               // Percentage of failed playbacks
    cacheHitRate: 0            // Percentage of cached loads
};
```

## Deployment Considerations

### Audio File Requirements

- **Format:** MP3, 128kbps, mono
- **Duration:** 3-5 seconds per narration
- **Naming:** Strict convention (scene_X_to_Y_path.mp3)
- **Total Size:** ~2-3 MB for all 18 files

### Directory Structure

```
videos/eli/audio/
├── narration/
│   ├── scene_1_to_2_success.mp3
│   ├── scene_1_to_2_moderate.mp3
│   ├── scene_1_to_2_failure.mp3
│   ├── scene_2_to_3_success.mp3
│   ├── scene_2_to_3_moderate.mp3
│   ├── scene_2_to_3_failure.mp3
│   ├── scene_3_to_4_success.mp3
│   ├── scene_3_to_4_moderate.mp3
│   ├── scene_3_to_4_failure.mp3
│   ├── scene_4_to_5_success.mp3
│   ├── scene_4_to_5_moderate.mp3
│   ├── scene_4_to_5_failure.mp3
│   ├── scene_5_to_6_success.mp3
│   ├── scene_5_to_6_moderate.mp3
│   ├── scene_5_to_6_failure.mp3
│   ├── ending_success.mp3
│   ├── ending_moderate.mp3
│   └── ending_failure.mp3
├── ambience/
├── sfx/
└── README.md
```

### Production Checklist

- [ ] All 18 narration files generated
- [ ] Audio files normalized to -3dB
- [ ] Files compressed to 128kbps MP3
- [ ] Fade in/out applied (0.3s)
- [ ] Files uploaded to correct directory
- [ ] Path resolution tested on production
- [ ] All three paths tested end-to-end
- [ ] Error handling verified
- [ ] Performance metrics acceptable
- [ ] User testing completed

## Design Decisions and Rationales

### Decision 1: Separate Audio Channels
**Rationale:** Using separate Audio() elements for narration, ambience, and SFX allows simultaneous playback without interference and independent volume control.

### Decision 2: Callback-Based Flow Control
**Rationale:** Using onNarrationEnd callback ensures scene advancement waits for narration completion while maintaining clean, non-blocking code.

### Decision 3: Path Calculation at Transition Time
**Rationale:** Calculating narration path when needed (not pre-calculated) ensures it reflects the most current player state and decisions.

### Decision 4: Graceful Degradation
**Rationale:** Game continues even if audio fails, ensuring technical issues don't break the core experience.

### Decision 5: Testing Interface
**Rationale:** Dedicated testing tool allows rapid verification of all narration paths without playing through entire game repeatedly.

### Decision 6: 1-Second Post-Narration Delay
**Rationale:** Brief pause after narration gives player time to process the commentary before next scene begins, improving pacing.

### Decision 7: 4-Second Post-Decision Delay
**Rationale:** Longer delay after decisions allows player to see feedback clearly and feel the weight of their choice before advancing.

## ChromaBot Corruption Audio-Visual Sync

### Overview
When bad decisions are made, create a multi-sensory corruption experience that combines:
- Heartbeat audio (slow → fast)
- ChromaBot flickering animation (synced to heartbeat)
- Eli's narration (plays over heartbeat)
- Rapid corruption sequence (after narration ends)

### Corruption Sequence Flow

```
Bad Decision Made
    ↓
Heartbeat Starts (60 BPM - slow, ominous)
    ↓
ChromaBot Flickers (synced to heartbeat pulse)
    ↓
Eli's Narration Plays (3-5 seconds)
    ↓
Heartbeat Accelerates (60 → 120 BPM over 2 seconds)
    ↓
ChromaBot Flickers Rapidly (matching accelerated heartbeat)
    ↓
Heartbeat Stops Abruptly
    ↓
ChromaBot Corruption Animation Completes
```

### Audio Implementation

**New Audio File:** `videos/eli/audio/corruption/heartbeat_corruption.mp3`

**Characteristics:**
- Start: 60 BPM (1 beat per second) - ominous, dread-building
- Duration: 7-8 seconds total
- Transition: Accelerate to 120 BPM over 2 seconds
- End: Abrupt stop (creates jarring effect)
- Volume: 0.4 (subtle but present)

**Audio Layering:**
```javascript
// Layer 1: Heartbeat (background)
heartbeatAudio.volume = 0.4;
heartbeatAudio.play();

// Layer 2: Narration (foreground)
setTimeout(() => {
    narrationAudio.volume = 0.85;
    narrationAudio.play();
}, 500); // Start narration after first heartbeat

// Layer 3: Corruption SFX (punctuation)
setTimeout(() => {
    corruptionSFX.volume = 0.6;
    corruptionSFX.play();
}, 7000); // Final corruption sound
```

### Visual Sync Implementation

**Enhanced ChromaBot Corruption Animator:**

```javascript
class ChromaBotCorruptionSequence {
    constructor() {
        this.heartbeatInterval = null;
        this.flickerFrame = 0;
        this.isAccelerating = false;
    }
    
    /**
     * Start corruption sequence with audio-visual sync
     */
    startCorruptionSequence() {
        console.log('💔 Starting corruption sequence with heartbeat');
        
        // Start heartbeat audio
        if (window.audioManager) {
            window.audioManager.playHeartbeatCorruption();
        }
        
        // Start slow flicker (60 BPM = 1000ms interval)
        this.startHeartbeatFlicker(1000);
        
        // Play narration after first heartbeat
        setTimeout(() => {
            if (window.audioManager) {
                const path = window.audioManager.getNarrationPath();
                window.audioManager.playTransitionNarration(
                    window.currentSceneIndex + 1,
                    window.currentSceneIndex + 2,
                    path
                );
            }
        }, 1000);
        
        // Accelerate heartbeat after narration (5 seconds)
        setTimeout(() => {
            this.accelerateHeartbeat();
        }, 5000);
        
        // Stop heartbeat and complete corruption (7 seconds)
        setTimeout(() => {
            this.stopHeartbeat();
            this.completeCorruption();
        }, 7000);
    }
    
    /**
     * Flicker ChromaBot in sync with heartbeat
     */
    startHeartbeatFlicker(interval) {
        this.heartbeatInterval = setInterval(() => {
            this.flickerChromaBot();
        }, interval);
    }
    
    /**
     * Single flicker pulse
     */
    flickerChromaBot() {
        const chromaBot = document.querySelector('.chroma-bot-orb');
        if (!chromaBot) return;
        
        // Flash to corrupted state briefly
        chromaBot.classList.add('corruption-pulse');
        
        setTimeout(() => {
            chromaBot.classList.remove('corruption-pulse');
        }, 100); // Quick flash
    }
    
    /**
     * Accelerate heartbeat from 60 to 120 BPM
     */
    accelerateHeartbeat() {
        console.log('💨 Accelerating heartbeat');
        this.isAccelerating = true;
        
        // Clear slow interval
        clearInterval(this.heartbeatInterval);
        
        // Gradually speed up over 2 seconds
        let currentInterval = 1000; // 60 BPM
        const targetInterval = 500;  // 120 BPM
        const steps = 20;
        const intervalChange = (currentInterval - targetInterval) / steps;
        
        let step = 0;
        const accelerationInterval = setInterval(() => {
            step++;
            currentInterval -= intervalChange;
            
            // Restart flicker at new speed
            clearInterval(this.heartbeatInterval);
            this.startHeartbeatFlicker(currentInterval);
            
            if (step >= steps) {
                clearInterval(accelerationInterval);
            }
        }, 100); // Update every 100ms
    }
    
    /**
     * Stop heartbeat abruptly
     */
    stopHeartbeat() {
        console.log('🛑 Heartbeat stopped');
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
    }
    
    /**
     * Complete corruption animation
     */
    completeCorruption() {
        console.log('💀 Corruption complete');
        
        // Trigger final corruption animation
        if (window.chromaBotAnimator) {
            window.chromaBotAnimator.animateToBad();
        }
        
        // Play corruption completion sound
        if (window.audioManager) {
            window.audioManager.playSFX('corruption_level_up');
        }
    }
}
```

### CSS Corruption Pulse Effect

**Add to:** `css/chromabot-corruption.css`

```css
/* Heartbeat pulse effect */
.chroma-bot-orb.corruption-pulse {
    animation: corruption-pulse 0.1s ease-out;
    filter: brightness(1.5) hue-rotate(180deg);
}

@keyframes corruption-pulse {
    0% {
        transform: scale(1);
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
    }
    50% {
        transform: scale(1.1);
        box-shadow: 0 0 40px rgba(255, 0, 0, 0.8);
    }
    100% {
        transform: scale(1);
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
    }
}

/* Accelerating flicker effect */
.chroma-bot-orb.accelerating {
    animation: rapid-flicker 0.5s infinite;
}

@keyframes rapid-flicker {
    0%, 100% { opacity: 1; }
    25% { opacity: 0.7; filter: hue-rotate(90deg); }
    50% { opacity: 1; filter: hue-rotate(180deg); }
    75% { opacity: 0.7; filter: hue-rotate(270deg); }
}
```

### Integration Points

**1. Decision Handler (eli-scenes-config.js)**

```javascript
function makeChoice(choiceIndex) {
    // ... existing decision logic ...
    
    // ENHANCED: If bad decision, trigger corruption sequence
    // Falls back to existing behavior if sequence not available
    if (choice.impact === 'bad') {
        if (window.chromaBotCorruptionSequence) {
            console.log('💔 Bad decision - triggering enhanced corruption sequence');
            window.chromaBotCorruptionSequence.startCorruptionSequence();
            window.pendingCorruption = false; // Sequence handles it
        } else {
            // FALLBACK: Use existing corruption animation
            console.log('💔 Bad decision - using standard corruption');
            window.pendingCorruption = true; // Existing behavior
        }
    }
    
    // ... rest of decision logic (unchanged) ...
}
```

### Backward Compatibility

**The design maintains 100% backward compatibility:**

1. **Existing Audio System:** All current audio functionality remains unchanged
   - Decision sounds still play
   - Trust score sounds still work
   - ChromaBot chat sounds continue
   - Pause/resume sounds function normally

2. **Existing Corruption Animation:** If new sequence isn't loaded, falls back to current behavior
   - `window.pendingCorruption` flag still works
   - Existing `chromaBotAnimator.animateToBad()` still triggers
   - No breaking changes to current flow

3. **Existing Scene Flow:** All scene transitions work as before
   - Videos play normally
   - Decisions trigger at correct times
   - Scene advancement logic unchanged
   - Trust score calculations intact

4. **Graceful Enhancement:** New features layer on top without replacing
   - Heartbeat sequence is additive
   - If audio file missing, skips gracefully
   - If sequence class not loaded, uses existing animation
   - No dependencies on new features

### Feature Flags

**Optional: Add feature flag for gradual rollout:**

```javascript
const AUDIO_FEATURES = {
    enableHeartbeatCorruption: true,  // Toggle new sequence
    enableNarrationSystem: true,       // Toggle narration
    enableEnhancedFlicker: true        // Toggle sync flicker
};

// In decision handler:
if (choice.impact === 'bad') {
    if (AUDIO_FEATURES.enableHeartbeatCorruption && window.chromaBotCorruptionSequence) {
        // New enhanced sequence
        window.chromaBotCorruptionSequence.startCorruptionSequence();
    } else {
        // Existing behavior
        window.pendingCorruption = true;
    }
}
```

### Migration Path

**Phase 1: Add New Files (No Breaking Changes)**
- Add `heartbeat_corruption.mp3`
- Add `ChromaBotCorruptionSequence` class
- Add CSS corruption pulse styles
- Everything still works with existing code

**Phase 2: Enable New Features (Opt-In)**
- Initialize `ChromaBotCorruptionSequence` in page load
- Feature automatically activates for bad decisions
- Existing functionality remains as fallback

**Phase 3: Full Integration (After Testing)**
- Verify new sequence works across all scenarios
- Keep fallback code for safety
- Monitor for any issues

### What Stays Exactly The Same

✅ **All existing audio files and functionality**
✅ **Current decision feedback system**
✅ **Trust score calculations and display**
✅ **Scene transition logic**
✅ **Video playback system**
✅ **Pause menu functionality**
✅ **Achievement system**
✅ **Completion screen**
✅ **All UI interactions**
✅ **ChromaBot chat system**

### What Gets Enhanced (Additive Only)

➕ **Bad decision visual feedback** (adds heartbeat flicker)
➕ **Corruption animation timing** (syncs with audio)
➕ **Audio layering** (adds heartbeat to existing sounds)
➕ **Psychological impact** (enhances existing horror atmosphere)

### Testing Existing Functionality

**Regression Test Checklist:**
- [ ] Good decisions still work normally
- [ ] Neutral decisions still work normally
- [ ] Bad decisions work with OR without new sequence
- [ ] Trust score updates correctly
- [ ] Scene transitions happen at right times
- [ ] All existing audio plays correctly
- [ ] Pause/resume works
- [ ] Completion screen shows correctly
- [ ] No console errors in fallback mode
- [ ] No console errors with new features enabled
```

**2. Audio Manager Enhancement**

```javascript
class AudioManager {
    // ... existing methods ...
    
    /**
     * Play heartbeat corruption audio
     */
    playHeartbeatCorruption() {
        if (this.isMuted) {
            console.log('🔇 Audio muted, skipping heartbeat');
            return;
        }
        
        const path = this.getAudioPath('audio/corruption/heartbeat_corruption.mp3');
        
        console.log('💔 Playing heartbeat corruption');
        
        // Use SFX channel for heartbeat
        this.sfxAudio.src = path;
        this.sfxAudio.volume = 0.4; // Subtle but present
        this.sfxAudio.loop = false;
        
        this.sfxAudio.play().catch(err => {
            console.error('❌ Failed to play heartbeat:', err);
        });
    }
}
```

### Audio Production Specifications

**Heartbeat Corruption Audio:**

1. **Base Heartbeat (0-5 seconds)**
   - 60 BPM (1 beat per second)
   - Deep, ominous bass thump
   - Slight reverb for atmosphere
   - Volume: Consistent

2. **Acceleration Phase (5-7 seconds)**
   - Gradually increase from 60 to 120 BPM
   - Maintain bass character
   - Add slight distortion as it speeds up
   - Volume: Slight increase

3. **Abrupt Stop (7 seconds)**
   - Hard cut (no fade out)
   - Creates jarring, unsettling effect

**Production Tools:**
- Use drum machine or synthesizer for clean heartbeat sound
- Layer with sub-bass for visceral impact
- Add subtle vinyl crackle for unease
- Export as MP3, 128kbps

### Testing Checklist

- [ ] Heartbeat audio plays on bad decision
- [ ] ChromaBot flickers in sync with heartbeat
- [ ] Narration plays over heartbeat (audible)
- [ ] Heartbeat accelerates smoothly
- [ ] ChromaBot flicker speeds up with heartbeat
- [ ] Heartbeat stops abruptly (jarring effect)
- [ ] Final corruption animation triggers
- [ ] No audio overlap or clipping
- [ ] Sequence feels cohesive and impactful
- [ ] Works across all bad decision scenarios

### User Experience Goals

1. **Visceral Response:** Heartbeat creates physical anxiety
2. **Synchronized Dread:** Visual and audio reinforce each other
3. **Building Tension:** Slow start → rapid acceleration
4. **Jarring Conclusion:** Abrupt stop creates unease
5. **Memorable Impact:** Players remember bad decisions

### Performance Considerations

- Heartbeat audio file: ~100-150 KB
- Flicker animation: Minimal CPU (CSS-based)
- No frame rate impact from sync logic
- Graceful degradation if audio fails

## Future Enhancements

1. **Dynamic Volume Adjustment**
   - Adjust narration volume based on ambient noise
   - Implement ducking for overlapping audio

2. **Narration Subtitles**
   - Display text version of narration
   - Support accessibility requirements

3. **Advanced Path Logic**
   - More granular path calculation
   - Character-specific narration variations

4. **Audio Analytics**
   - Track which narrations players hear most
   - Measure engagement with audio system

5. **Localization Support**
   - Multi-language narration files
   - Dynamic language switching

6. **Enhanced Corruption Variations**
   - Different heartbeat patterns for different bad decisions
   - Escalating corruption intensity across scenes
   - Character-specific corruption audio
