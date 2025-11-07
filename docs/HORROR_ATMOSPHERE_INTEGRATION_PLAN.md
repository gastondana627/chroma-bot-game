# Horror Atmosphere Integration Plan
## Data Bleed: "Shadows in the Feed"

**Version**: 1.0  
**Created**: November 7, 2025  
**Purpose**: Bridge existing game mechanics with horror narrative vision

---

## Executive Summary

This plan integrates horror atmosphere into your existing game mechanics. You've built sophisticated systems (trust scores, adaptive AI, gaming mechanics) - now we layer the psychological horror that makes players feel the danger.

**Core Principle**: Horror intensity scales with vulnerability. As trust score drops, reality distorts.

---

## Integration Architecture

```
Trust Score (-100 to 100)
        ↓
Horror Intensity Calculator
        ↓
    ┌───┴───┬───────┬────────┐
    ↓       ↓       ↓        ↓
Glitch   Audio   Visual   UI
Effects  Horror  Distort  Corrupt
```

### Horror Intensity Formula

```javascript
horrorIntensity = {
    level: calculateHorrorLevel(trustScore, sophistication),
    glitchFrequency: mapToGlitchRate(trustScore),
    audioDistortion: mapToAudioDistortion(trustScore),
    visualCorruption: mapToVisualCorruption(trustScore),
    uiStability: mapToUIStability(trustScore)
}

// Trust Score → Horror Level Mapping
// 20 to 100:   Level 0 (Safe - minimal effects)
// 0 to 19:     Level 1 (Uneasy - subtle glitches)
// -30 to -1:   Level 2 (Disturbed - frequent glitches)
// -60 to -31:  Level 3 (Corrupted - reality breaking)
// -100 to -61: Level 4 (Nightmare - full horror)
```

---

## Character-Specific Horror Aesthetics

### Maya (Mid-20s) - Mobile/Dating App Horror

**Visual Style**: Clean modern UI that slowly corrupts
**Glitch Type**: Smooth morphing, filter breakdowns, uncanny faces
**Color Palette**: Pastels → desaturated → inverted
**Horror Triggers**: Profile photos distorting, messages from "deleted" accounts

#### Horror Progression

**Level 0 (Trust 20-100): Safe Dating**
```css
/* Clean, modern interface */
filter: none;
animation: none;
```

**Level 1 (Trust 0-19): Subtle Unease**
```css
/* Occasional filter glitches */
animation: subtle-flicker 8s infinite;
filter: hue-rotate(2deg);
```
- Profile photos occasionally blur
- Text briefly doubles
- Notification sounds slightly off-pitch

**Level 2 (Trust -1 to -30): Growing Dread**
```css
/* Frequent distortions */
animation: face-morph 4s infinite, color-shift 6s infinite;
filter: saturate(1.3) hue-rotate(5deg);
```
- Profile photos morph between faces
- Messages appear then disappear
- Typing indicator shows when no one is typing
- "Seen" status changes randomly

**Level 3 (Trust -31 to -60): Reality Breaking**
```css
/* Heavy corruption */
animation: deep-glitch 2s infinite, reality-tear 3s infinite;
filter: saturate(0.5) contrast(1.5) hue-rotate(15deg);
```
- Multiple versions of same profile
- Messages from blocked contacts
- Photos show things that weren't there
- UI elements move on their own

**Level 4 (Trust -61 to -100): Full Horror**
```css
/* Complete breakdown */
animation: nightmare-mode 1s infinite, face-distortion 0.5s infinite;
filter: invert(0.3) saturate(2) contrast(2);
```
- All faces become distorted/uncanny
- Messages appear in reverse
- "You" are messaging yourself
- Camera activates showing distorted reflection
- Reality completely unreliable

### Eli (Teen) - Gaming/Discord Horror

**Visual Style**: Bright neon that corrupts into digital nightmare
**Glitch Type**: Pixel smear, corrupted streams, broken overlays
**Color Palette**: RGB neon → static → corrupted pixels
**Horror Triggers**: Game glitches bleeding into reality, avatars becoming sentient

#### Horror Progression

**Level 0: Normal Gaming**
- Clean Discord-style interface
- Smooth animations
- Normal chat behavior

**Level 1: Lag & Artifacts**
- Occasional frame drops
- Chat messages duplicate
- Avatar images pixelate briefly
- Audio crackles

**Level 2: System Corruption**
- Screen tearing effects
- Overlays glitch and overlap
- Voice chat distorts
- Game assets appear in chat
- Notifications from non-existent users

**Level 3: Digital Breakdown**
- Massive pixel corruption
- Multiple overlapping interfaces
- Chat messages scramble
- Avatars animate wrong
- Game world bleeds into UI

**Level 4: Digital Nightmare**
- Complete visual corruption
- Avatars become hostile/distorted
- Messages appear in code/binary
- Screen fills with error messages
- "Game over" screens that aren't from any game

### Stanley (Elderly) - Desktop/Facebook Horror

**Visual Style**: Dated 2010s UI that decays into analog horror
**Glitch Type**: CRT tearing, static overlays, VHS corruption
**Color Palette**: Muted blues → sepia → static
**Horror Triggers**: Dead friends posting, old photos corrupting, time distortion

#### Horror Progression

**Level 0: Familiar Interface**
- Clean Facebook-style layout
- Normal loading times
- Friendly notifications

**Level 1: Technical Issues**
- Slow loading with CRT flicker
- Occasional static overlay
- Photos load corrupted then fix
- Cursor trails

**Level 2: Temporal Distortion**
- Posts from years ago appear as new
- Timestamps wrong
- Photos show different content each view
- Deceased friends appear online
- Messages from the past

**Level 3: Reality Corruption**
- Heavy CRT tearing
- Static overlays persistent
- Photos morph and distort
- Multiple timelines visible
- "You" posting things you didn't write
- Friend requests from yourself

**Level 4: Analog Horror**
- Full VHS corruption
- Screen mostly static
- Faces in photos distorted/wrong
- Messages in reverse/corrupted
- Webcam shows wrong person
- Time loops and paradoxes
- "You have been here before" messages

---

## Technical Implementation

### 1. Horror Atmosphere Engine

```javascript
class HorrorAtmosphereEngine {
    constructor() {
        this.currentIntensity = 0;
        this.character = null;
        this.glitchSystem = null;
        this.audioSystem = null;
        this.visualSystem = null;
    }

    /**
     * Calculate horror intensity from trust score
     */
    calculateIntensity(trustScore, sophistication) {
        let baseIntensity = 0;
        
        if (trustScore >= 20) baseIntensity = 0;
        else if (trustScore >= 0) baseIntensity = 1;
        else if (trustScore >= -30) baseIntensity = 2;
        else if (trustScore >= -60) baseIntensity = 3;
        else baseIntensity = 4;
        
        // AI sophistication adds to horror
        const sophisticationBonus = (sophistication - 1) * 0.2;
        
        return Math.min(4, baseIntensity + sophisticationBonus);
    }

    /**
     * Update horror atmosphere based on game state
     */
    update(gameState) {
        const { trustScore, character, sophistication } = gameState;
        
        const newIntensity = this.calculateIntensity(trustScore, sophistication);
        
        if (newIntensity !== this.currentIntensity) {
            this.transitionToIntensity(newIntensity, character);
        }
        
        // Apply continuous effects
        this.applyGlitchEffects(newIntensity, character);
        this.applyAudioEffects(newIntensity, character);
        this.applyVisualEffects(newIntensity, character);
    }

    /**
     * Transition between horror intensity levels
     */
    transitionToIntensity(newIntensity, character) {
        console.log(`Horror intensity: ${this.currentIntensity} → ${newIntensity}`);
        
        // Fade out old effects
        this.fadeOutCurrentEffects();
        
        // Fade in new effects
        this.fadeInNewEffects(newIntensity, character);
        
        this.currentIntensity = newIntensity;
        
        // Trigger intensity-specific events
        this.triggerIntensityEvents(newIntensity, character);
    }
}
```

### 2. Glitch Effect System

```javascript
class GlitchEffectSystem {
    constructor(character) {
        this.character = character;
        this.activeGlitches = [];
        this.glitchProfiles = this.initializeGlitchProfiles();
    }

    initializeGlitchProfiles() {
        return {
            'maya': {
                0: [],
                1: ['subtle-flicker', 'text-double'],
                2: ['face-morph', 'color-shift', 'ui-drift'],
                3: ['reality-tear', 'deep-glitch', 'photo-corruption'],
                4: ['nightmare-mode', 'face-distortion', 'reality-collapse']
            },
            'eli': {
                0: [],
                1: ['frame-drop', 'pixel-artifact'],
                2: ['screen-tear', 'overlay-glitch', 'audio-crackle'],
                3: ['pixel-corruption', 'interface-overlap', 'asset-bleed'],
                4: ['digital-nightmare', 'avatar-corruption', 'system-collapse']
            },
            'stanley': {
                0: [],
                1: ['crt-flicker', 'static-overlay'],
                2: ['temporal-distortion', 'photo-corruption', 'cursor-trail'],
                3: ['crt-tear', 'timeline-merge', 'identity-confusion'],
                4: ['vhs-corruption', 'analog-horror', 'time-loop']
            }
        };
    }

    /**
     * Apply glitch effects for current intensity
     */
    applyGlitches(intensity) {
        const glitches = this.glitchProfiles[this.character][intensity];
        
        glitches.forEach(glitchType => {
            this.activateGlitch(glitchType, intensity);
        });
    }

    /**
     * Activate specific glitch effect
     */
    activateGlitch(glitchType, intensity) {
        const frequency = this.calculateGlitchFrequency(intensity);
        const duration = this.calculateGlitchDuration(intensity);
        
        const glitch = {
            type: glitchType,
            frequency: frequency,
            duration: duration,
            active: true
        };
        
        this.activeGlitches.push(glitch);
        this.applyGlitchToDOM(glitch);
    }

    /**
     * Calculate how often glitches occur
     */
    calculateGlitchFrequency(intensity) {
        const frequencies = {
            0: 0,           // Never
            1: 15000,       // Every 15 seconds
            2: 8000,        // Every 8 seconds
            3: 3000,        // Every 3 seconds
            4: 1000         // Every second
        };
        return frequencies[intensity];
    }

    /**
     * Calculate how long glitches last
     */
    calculateGlitchDuration(intensity) {
        const durations = {
            0: 0,
            1: 200,         // 0.2 seconds
            2: 500,         // 0.5 seconds
            3: 1000,        // 1 second
            4: 2000         // 2 seconds
        };
        return durations[intensity];
    }
}
```

### 3. Audio Horror System

```javascript
class AudioHorrorSystem {
    constructor(character) {
        this.character = character;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.ambientTrack = null;
        this.effectsQueue = [];
    }

    /**
     * Apply audio effects based on horror intensity
     */
    applyAudioEffects(intensity) {
        // Ambient sound
        this.updateAmbientSound(intensity);
        
        // Distortion effects
        this.applyDistortion(intensity);
        
        // Uncanny sounds
        this.triggerUncannyEffects(intensity);
    }

    /**
     * Update ambient background sound
     */
    updateAmbientSound(intensity) {
        const ambientProfiles = {
            0: { volume: 0, track: null },
            1: { volume: 0.1, track: 'subtle-unease.mp3' },
            2: { volume: 0.3, track: 'growing-dread.mp3' },
            3: { volume: 0.5, track: 'reality-breaking.mp3' },
            4: { volume: 0.7, track: 'nightmare.mp3' }
        };
        
        const profile = ambientProfiles[intensity];
        
        if (profile.track) {
            this.loadAndPlayAmbient(profile.track, profile.volume);
        }
    }

    /**
     * Apply distortion to notification sounds
     */
    applyDistortion(intensity) {
        const distortionLevels = {
            0: 0,
            1: 0.1,
            2: 0.3,
            3: 0.6,
            4: 1.0
        };
        
        // Apply distortion filter to all UI sounds
        const distortion = this.audioContext.createWaveShaper();
        distortion.curve = this.makeDistortionCurve(distortionLevels[intensity] * 100);
        
        return distortion;
    }

    /**
     * Trigger uncanny audio effects
     */
    triggerUncannyEffects(intensity) {
        const effects = {
            1: ['reversed-whisper', 'distant-static'],
            2: ['distorted-voice', 'wrong-notification', 'echo-delay'],
            3: ['layered-voices', 'time-distortion', 'reality-tear-sound'],
            4: ['nightmare-voices', 'reality-collapse-sound', 'void-ambient']
        };
        
        if (effects[intensity]) {
            const randomEffect = effects[intensity][Math.floor(Math.random() * effects[intensity].length)];
            this.playEffect(randomEffect);
        }
    }
}
```

### 4. Visual Corruption System

```javascript
class VisualCorruptionSystem {
    constructor(character) {
        this.character = character;
        this.corruptionLevel = 0;
        this.activeFilters = [];
    }

    /**
     * Apply visual corruption effects
     */
    applyCorruption(intensity) {
        // CSS filters
        this.applyCSSFilters(intensity);
        
        // Canvas-based corruption
        this.applyCanvasCorruption(intensity);
        
        // Element manipulation
        this.corruptUIElements(intensity);
    }

    /**
     * Apply CSS filter effects
     */
    applyCSSFilters(intensity) {
        const filterProfiles = {
            'maya': {
                0: 'none',
                1: 'hue-rotate(2deg) saturate(1.05)',
                2: 'hue-rotate(5deg) saturate(1.3) brightness(0.95)',
                3: 'hue-rotate(15deg) saturate(0.5) contrast(1.5) brightness(0.9)',
                4: 'invert(0.3) saturate(2) contrast(2) hue-rotate(30deg)'
            },
            'eli': {
                0: 'none',
                1: 'saturate(1.2) brightness(1.05)',
                2: 'saturate(1.5) contrast(1.2) brightness(1.1)',
                3: 'saturate(2) contrast(1.5) brightness(1.2) hue-rotate(10deg)',
                4: 'saturate(3) contrast(2) brightness(1.3) hue-rotate(20deg) blur(1px)'
            },
            'stanley': {
                0: 'none',
                1: 'saturate(0.9) sepia(0.1)',
                2: 'saturate(0.7) sepia(0.3) contrast(1.1)',
                3: 'saturate(0.5) sepia(0.5) contrast(1.3) brightness(0.9)',
                4: 'saturate(0.3) sepia(0.7) contrast(1.5) brightness(0.8) blur(0.5px)'
            }
        };
        
        const filter = filterProfiles[this.character][intensity];
        document.body.style.filter = filter;
    }

    /**
     * Corrupt specific UI elements
     */
    corruptUIElements(intensity) {
        if (intensity === 0) return;
        
        // Profile images
        this.corruptImages(intensity);
        
        // Text content
        this.corruptText(intensity);
        
        // UI components
        this.corruptComponents(intensity);
    }

    /**
     * Corrupt images (profile photos, etc.)
     */
    corruptImages(intensity) {
        const images = document.querySelectorAll('.profile-image, .chat-image');
        
        images.forEach(img => {
            if (Math.random() < intensity * 0.2) {
                // Apply corruption
                this.applyImageCorruption(img, intensity);
            }
        });
    }

    /**
     * Apply specific image corruption
     */
    applyImageCorruption(img, intensity) {
        const corruptions = {
            1: () => img.style.filter = 'blur(2px)',
            2: () => {
                img.style.filter = 'blur(3px) hue-rotate(30deg)';
                img.style.transform = 'scale(1.05)';
            },
            3: () => {
                img.style.filter = 'blur(5px) contrast(2) saturate(0)';
                img.style.animation = 'face-distort 2s infinite';
            },
            4: () => {
                img.style.filter = 'invert(1) blur(8px) contrast(3)';
                img.style.animation = 'nightmare-face 1s infinite';
            }
        };
        
        if (corruptions[intensity]) {
            corruptions[intensity]();
        }
    }
}
```

---

## Integration with Existing Systems

### 1. Trust Score Integration

```javascript
// In bayesian-trust-engine.js
applyTrustChange(currentScore, delta) {
    const newScore = currentScore + delta;
    const boundedScore = Math.max(this.TRUST_MIN, Math.min(this.TRUST_MAX, newScore));
    
    // NEW: Trigger horror atmosphere update
    if (window.horrorAtmosphere) {
        window.horrorAtmosphere.update({
            trustScore: boundedScore,
            character: this.currentCharacter,
            sophistication: this.currentSophistication
        });
    }
    
    return boundedScore;
}
```

### 2. Adaptive AI Integration

```javascript
// In adaptive-ai-deception-engine.js
generateAdaptiveResponse(character, userMessage, trustScore, context) {
    // ... existing code ...
    
    // NEW: Trigger horror escalation on high sophistication
    if (sophistication >= 4 && trustScore < -40) {
        window.horrorAtmosphere.triggerHorrorMoment({
            type: 'reality_questioning',
            character: character,
            intensity: sophistication
        });
    }
    
    return response;
}
```

### 3. Story Progression Integration

```javascript
// In story-progression-tracker.js
updateStoryState(character, stateKey, value, increment) {
    // ... existing code ...
    
    // NEW: Trigger horror moments at key story beats
    if (this.isHorrorTriggerPoint(character, stateKey, value)) {
        window.horrorAtmosphere.triggerStoryHorrorMoment({
            character: character,
            storyPoint: stateKey,
            value: value
        });
    }
}
```

---

## CSS Animations Library

```css
/* Maya - Mobile Horror Animations */
@keyframes subtle-flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.98; }
}

@keyframes face-morph {
    0%, 100% { filter: none; }
    50% { filter: blur(3px) hue-rotate(10deg); }
}

@keyframes reality-tear {
    0% { transform: translateX(0); }
    25% { transform: translateX(-2px) skewX(2deg); }
    75% { transform: translateX(2px) skewX(-2deg); }
    100% { transform: translateX(0); }
}

@keyframes nightmare-mode {
    0%, 100% { filter: invert(0); }
    50% { filter: invert(0.5); }
}

/* Eli - Gaming Horror Animations */
@keyframes frame-drop {
    0%, 90%, 100% { opacity: 1; }
    95% { opacity: 0.5; }
}

@keyframes screen-tear {
    0% { transform: translateY(0); }
    10% { transform: translateY(-5px); }
    20% { transform: translateY(3px); }
    30% { transform: translateY(-2px); }
    100% { transform: translateY(0); }
}

@keyframes pixel-corruption {
    0%, 100% { 
        filter: none;
        transform: scale(1);
    }
    50% { 
        filter: contrast(3) saturate(3);
        transform: scale(1.02);
    }
}

@keyframes digital-nightmare {
    0% { filter: none; }
    25% { filter: hue-rotate(90deg) saturate(3); }
    50% { filter: hue-rotate(180deg) saturate(3) contrast(2); }
    75% { filter: hue-rotate(270deg) saturate(3); }
    100% { filter: hue-rotate(360deg); }
}

/* Stanley - Desktop Horror Animations */
@keyframes crt-flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.95; }
    51% { opacity: 1; }
    52% { opacity: 0.97; }
}

@keyframes static-overlay {
    0% { background-position: 0 0; }
    100% { background-position: 100% 100%; }
}

@keyframes crt-tear {
    0% { transform: translateX(0); }
    10% { transform: translateX(-10px); }
    20% { transform: translateX(5px); }
    30% { transform: translateX(-3px); }
    100% { transform: translateX(0); }
}

@keyframes vhs-corruption {
    0%, 100% { 
        filter: none;
        transform: translateY(0);
    }
    25% { 
        filter: saturate(0) contrast(2);
        transform: translateY(-2px);
    }
    50% { 
        filter: saturate(0) contrast(3);
        transform: translateY(2px);
    }
    75% { 
        filter: saturate(0) contrast(2);
        transform: translateY(-1px);
    }
}
```

---

## Horror Moment Triggers

### Automatic Triggers (Based on Trust Score)

```javascript
const horrorTriggers = {
    // Trust threshold triggers
    trustThresholds: {
        0: { event: 'first_doubt', description: 'Subtle unease begins' },
        -20: { event: 'growing_dread', description: 'Something feels wrong' },
        -40: { event: 'reality_questioning', description: 'Can you trust what you see?' },
        -60: { event: 'horror_climax', description: 'Full horror revelation' }
    },
    
    // Story beat triggers
    storyBeats: {
        'maya': {
            'first_date_planned': 'profile_glitch',
            'money_requested': 'reality_tear',
            'identity_revealed': 'horror_climax'
        },
        'eli': {
            'rare_item_offered': 'screen_corruption',
            'account_sharing_requested': 'digital_breakdown',
            'scam_revealed': 'system_collapse'
        },
        'stanley': {
            'friend_request_accepted': 'temporal_distortion',
            'personal_info_shared': 'identity_confusion',
            'scam_revealed': 'analog_horror'
        }
    }
};
```

### Manual Horror Moments (Cinematic)

```javascript
// Trigger specific horror cinematics
window.horrorAtmosphere.triggerCinematic({
    type: 'webcam_activation',
    character: 'stanley',
    duration: 5000,
    effects: ['crt-tear', 'face-distortion', 'reality-collapse']
});
```

---

## Implementation Phases

### Phase 1: Core Horror Engine (Week 1)
- [ ] Create HorrorAtmosphereEngine class
- [ ] Implement intensity calculation
- [ ] Connect to trust score system
- [ ] Basic glitch effect system
- [ ] Test with one character (Maya)

### Phase 2: Character-Specific Effects (Week 2)
- [ ] Implement Maya's mobile horror aesthetic
- [ ] Implement Eli's gaming horror aesthetic
- [ ] Implement Stanley's desktop horror aesthetic
- [ ] Create CSS animation library
- [ ] Test all three characters

### Phase 3: Audio Integration (Week 3)
- [ ] Set up audio context system
- [ ] Create/source ambient horror tracks
- [ ] Implement distortion effects
- [ ] Add uncanny sound effects
- [ ] Test audio transitions

### Phase 4: Visual Corruption (Week 4)
- [ ] Implement CSS filter system
- [ ] Create canvas-based corruption
- [ ] Add image distortion effects
- [ ] Implement text corruption
- [ ] Test visual effects

### Phase 5: Integration & Polish (Week 5)
- [ ] Connect all systems to existing mechanics
- [ ] Add horror moment triggers
- [ ] Implement cinematic horror sequences
- [ ] Performance optimization
- [ ] User testing and feedback

### Phase 6: Advanced Features (Week 6)
- [ ] Webcam integration (optional)
- [ ] Advanced glitch shaders
- [ ] Procedural corruption
- [ ] Dynamic horror pacing
- [ ] Final polish

---

## Testing Checklist

### Per Character Testing
- [ ] Horror intensity scales correctly with trust score
- [ ] Glitch effects match character aesthetic
- [ ] Audio effects are appropriately unsettling
- [ ] Visual corruption doesn't break gameplay
- [ ] Performance remains smooth
- [ ] Horror moments trigger at correct times

### Cross-System Testing
- [ ] Horror integrates with trust score system
- [ ] Horror responds to AI sophistication
- [ ] Horror triggers at story beats
- [ ] Horror doesn't interfere with mechanics
- [ ] Horror enhances educational message

### User Experience Testing
- [ ] Horror is unsettling but not overwhelming
- [ ] Players understand the danger
- [ ] Educational message remains clear
- [ ] Accessibility options work
- [ ] Performance is acceptable

---

## Accessibility Considerations

### Horror Intensity Options
```javascript
const accessibilitySettings = {
    horrorIntensity: {
        off: 0,           // No horror effects
        minimal: 0.3,     // Subtle effects only
        moderate: 0.6,    // Standard experience
        full: 1.0         // Full horror
    },
    
    flashingEffects: {
        enabled: true,
        disabled: false
    },
    
    audioHorror: {
        enabled: true,
        disabled: false
    }
};
```

### Warnings
- Photosensitivity warning for flashing effects
- Audio warning for distorted sounds
- Option to disable horror entirely
- Maintain educational value without horror

---

## Next Steps

1. **Review this plan** - Make sure it aligns with your vision
2. **Prioritize features** - What's most important for MVP?
3. **Create implementation spec** - Turn this into actionable tasks
4. **Start with Phase 1** - Build core horror engine
5. **Iterate and test** - Get feedback early and often

---

**Status**: Planning Document  
**Next Action**: Review and approve approach  
**Implementation Start**: After approval
