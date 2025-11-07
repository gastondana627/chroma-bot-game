# Design Document

## Overview

The Horror Atmosphere Engine is a modular system that creates psychological horror through dynamic visual, audio, and UI corruption. It integrates with the existing Bayesian Trust Engine and Adaptive AI Engine to scale horror intensity based on player vulnerability.

**Core Design Principle**: Horror is not decorative - it's a direct reflection of danger. As trust score drops, reality itself becomes unreliable.

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│           Horror Atmosphere Engine (Core)                │
│  - Intensity Calculator                                  │
│  - State Manager                                         │
│  - Event Dispatcher                                      │
└──────────────┬──────────────────────────────────────────┘
               │
    ┌──────────┼──────────┬──────────────┐
    │          │          │              │
    ▼          ▼          ▼              ▼
┌────────┐ ┌────────┐ ┌────────┐  ┌──────────┐
│ Glitch │ │Character│ │Transition│ │Accessibility│
│ System │ │Profiles │ │ Manager  │ │  Manager   │
└────────┘ └────────┘ └────────┘  └──────────┘
    │          │          │              │
    └──────────┴──────────┴──────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│  DOM   │ │  CSS   │ │ Events │
│Updates │ │Animations│ │System  │
└────────┘ └────────┘ └────────┘
```

### Integration Points

```
Bayesian Trust Engine
        ↓
    (trust score update)
        ↓
Horror Atmosphere Engine
        ↓
    (intensity calculation)
        ↓
    ┌───┴───┬───────┐
    ↓       ↓       ↓
 Glitch   CSS    Events
 System   Filters  →  Other Systems
```

## Components

### 1. Horror Atmosphere Engine (Core)

**Responsibility**: Central coordinator for all horror effects

**Key Methods**:
- `initialize(options)` - Set up engine with configuration
- `update(gameState)` - Recalculate and apply effects based on game state
- `calculateIntensity(trustScore, sophistication)` - Determine horror level
- `transitionToIntensity(newIntensity, character)` - Smoothly change intensity
- `getStatus()` - Return current horror state

**State Management**:
```javascript
{
    currentIntensity: 0-4,
    character: 'maya' | 'eli' | 'stanley',
    trustScore: -100 to 100,
    sophistication: 1-5,
    activeEffects: [],
    transitionInProgress: boolean,
    accessibilitySettings: {}
}
```

**Intensity Calculation Algorithm**:
```javascript
function calculateIntensity(trustScore, sophistication) {
    // Base intensity from trust score
    let baseIntensity;
    if (trustScore >= 20) baseIntensity = 0;
    else if (trustScore >= 0) baseIntensity = 1;
    else if (trustScore >= -30) baseIntensity = 2;
    else if (trustScore >= -60) baseIntensity = 3;
    else baseIntensity = 4;
    
    // Sophistication bonus (AI complexity adds horror)
    const sophisticationBonus = (sophistication - 1) * 0.2;
    
    // Final intensity (capped at 4)
    return Math.min(4, baseIntensity + sophisticationBonus);
}
```

### 2. Glitch Effect System

**Responsibility**: Apply character-specific visual corruption

**Key Methods**:
- `applyGlitches(intensity)` - Activate glitches for current intensity
- `activateGlitch(glitchType, intensity)` - Trigger specific glitch
- `calculateGlitchFrequency(intensity)` - Determine how often glitches occur
- `calculateGlitchDuration(intensity)` - Determine how long glitches last
- `applyGlitchToDOM(glitch)` - Apply glitch effect to DOM elements

**Glitch Profiles**:
```javascript
glitchProfiles = {
    'maya': {
        0: [],
        1: ['subtle-flicker', 'text-double'],
        2: ['face-morph', 'color-shift', 'ui-drift'],
        3: ['reality-tear', 'deep-glitch', 'photo-corruption'],
        4: ['nightmare-mode', 'face-distortion', 'reality-collapse']
    },
    // ... eli and stanley profiles
}
```

**Frequency/Duration Tables**:
```javascript
frequencies = {
    0: 0,       // Never
    1: 15000,   // Every 15 seconds
    2: 8000,    // Every 8 seconds
    3: 3000,    // Every 3 seconds
    4: 1000     // Every second
}

durations = {
    0: 0,
    1: 200,     // 0.2 seconds
    2: 500,     // 0.5 seconds
    3: 1000,    // 1 second
    4: 2000     // 2 seconds
}
```

### 3. Character Profile Manager

**Responsibility**: Load and manage character-specific horror configurations

**Character Profiles**:

**Maya (Mobile/Dating App)**:
```javascript
{
    character: 'maya',
    aesthetic: 'mobile-modern',
    glitchStyle: 'smooth-morphing',
    colorPalette: {
        safe: ['#FFB6C1', '#87CEEB', '#98FB98'],
        corrupted: ['#8B008B', '#4B0082', '#2F4F4F']
    },
    cssFilters: {
        0: 'none',
        1: 'hue-rotate(2deg) saturate(1.05)',
        2: 'hue-rotate(5deg) saturate(1.3) brightness(0.95)',
        3: 'hue-rotate(15deg) saturate(0.5) contrast(1.5)',
        4: 'invert(0.3) saturate(2) contrast(2)'
    },
    targetElements: [
        '.profile-image',
        '.chat-message',
        '.dating-app-ui',
        '.notification'
    ]
}
```

**Eli (Gaming/Discord)**:
```javascript
{
    character: 'eli',
    aesthetic: 'gaming-neon',
    glitchStyle: 'pixel-corruption',
    colorPalette: {
        safe: ['#00FFFF', '#FF00FF', '#00FF00'],
        corrupted: ['#FF0000', '#000000', '#8B0000']
    },
    cssFilters: {
        0: 'none',
        1: 'saturate(1.2) brightness(1.05)',
        2: 'saturate(1.5) contrast(1.2) brightness(1.1)',
        3: 'saturate(2) contrast(1.5) hue-rotate(10deg)',
        4: 'saturate(3) contrast(2) hue-rotate(20deg) blur(1px)'
    },
    targetElements: [
        '.discord-message',
        '.game-overlay',
        '.avatar-image',
        '.stream-window'
    ]
}
```

**Stanley (Desktop/Facebook)**:
```javascript
{
    character: 'stanley',
    aesthetic: 'desktop-vintage',
    glitchStyle: 'crt-analog',
    colorPalette: {
        safe: ['#4267B2', '#898F9C', '#E4E6EB'],
        corrupted: ['#2C2C2C', '#1C1C1C', '#0C0C0C']
    },
    cssFilters: {
        0: 'none',
        1: 'saturate(0.9) sepia(0.1)',
        2: 'saturate(0.7) sepia(0.3) contrast(1.1)',
        3: 'saturate(0.5) sepia(0.5) contrast(1.3)',
        4: 'saturate(0.3) sepia(0.7) contrast(1.5) blur(0.5px)'
    },
    targetElements: [
        '.facebook-post',
        '.profile-photo',
        '.friend-request',
        '.message-thread'
    ]
}
```

### 4. Transition Manager

**Responsibility**: Smooth transitions between horror intensity levels

**Transition Types**:
- **Fade Transition**: Gradual opacity change (1 second)
- **Dramatic Transition**: Rapid intensity spike with flash effect
- **Relief Transition**: Calming effect when intensity decreases
- **Threshold Transition**: Special effect when crossing major threshold

**Transition Algorithm**:
```javascript
async function transitionToIntensity(newIntensity, character) {
    // 1. Determine transition type
    const transitionType = this.getTransitionType(
        this.currentIntensity, 
        newIntensity
    );
    
    // 2. Fade out current effects
    await this.fadeOutEffects(1000);
    
    // 3. Apply transition effect
    await this.applyTransitionEffect(transitionType);
    
    // 4. Fade in new effects
    await this.fadeInEffects(newIntensity, character, 1000);
    
    // 5. Update state
    this.currentIntensity = newIntensity;
    
    // 6. Dispatch event
    this.dispatchEvent('horrorTransitionComplete', {
        from: this.currentIntensity,
        to: newIntensity,
        character: character
    });
}
```

### 5. Accessibility Manager

**Responsibility**: Apply user accessibility preferences

**Settings**:
```javascript
accessibilitySettings = {
    horrorIntensity: {
        off: 0,         // No effects
        minimal: 0.3,   // 30% intensity
        moderate: 0.7,  // 70% intensity
        full: 1.0       // 100% intensity
    },
    flashingEffects: {
        enabled: true,
        disabled: false
    },
    reducedMotion: {
        enabled: true,
        disabled: false
    }
}
```

**Application Logic**:
```javascript
function applyAccessibilitySettings(baseIntensity) {
    let adjustedIntensity = baseIntensity;
    
    // Apply intensity multiplier
    adjustedIntensity *= this.settings.horrorIntensity;
    
    // Remove flashing if disabled
    if (!this.settings.flashingEffects) {
        this.removeFlashingAnimations();
    }
    
    // Reduce motion if enabled
    if (this.settings.reducedMotion) {
        this.simplifyAnimations();
    }
    
    return adjustedIntensity;
}
```

## Data Models

### Horror State
```javascript
{
    intensity: 0-4,
    character: 'maya' | 'eli' | 'stanley',
    trustScore: -100 to 100,
    sophistication: 1-5,
    activeGlitches: [
        {
            type: 'face-morph',
            frequency: 8000,
            duration: 500,
            active: true,
            lastTriggered: timestamp
        }
    ],
    transitionState: {
        inProgress: false,
        from: 0,
        to: 1,
        startTime: timestamp
    },
    accessibility: {
        intensityMultiplier: 1.0,
        flashingEnabled: true,
        motionReduced: false
    }
}
```

### Glitch Effect
```javascript
{
    type: 'face-morph' | 'text-double' | 'crt-tear' | ...,
    frequency: milliseconds,
    duration: milliseconds,
    active: boolean,
    lastTriggered: timestamp,
    targetElements: ['.profile-image', ...],
    cssAnimation: 'face-morph 2s infinite',
    cssFilter: 'blur(3px) hue-rotate(10deg)'
}
```

## Error Handling

### Graceful Degradation
```javascript
try {
    this.applyGlitchEffect(glitch);
} catch (error) {
    console.error('Glitch effect failed:', error);
    // Fall back to simpler effect
    this.applySimpleGlitch(glitch.type);
}
```

### Performance Monitoring
```javascript
if (this.fps < 30) {
    console.warn('Performance degradation detected');
    this.reduceEffectComplexity();
}
```

### Missing Dependencies
```javascript
if (!window.BayesianTrustEngine) {
    console.error('Trust Engine not found');
    // Use manual intensity control
    this.enableManualMode();
}
```

## Testing Strategy

### Unit Tests
- Intensity calculation accuracy
- Glitch frequency/duration calculations
- Character profile loading
- Accessibility settings application

### Integration Tests
- Trust score updates trigger intensity changes
- Intensity changes apply correct effects
- Transitions complete successfully
- Events dispatch correctly

### Visual Tests
- Each glitch effect renders correctly
- Character-specific aesthetics match design
- Transitions are smooth
- Accessibility settings work

### Performance Tests
- Maintains 60 FPS at intensity 4
- Memory usage stays under 50MB
- DOM updates are batched
- No memory leaks over 10 minutes

## Implementation Notes

### CSS Animation Strategy
- Use CSS animations for performance
- Apply via class addition/removal
- Batch DOM updates using requestAnimationFrame
- Use will-change for optimized animations

### Event System
- Use CustomEvent for browser compatibility
- Dispatch on window for global access
- Include detailed event data
- Support event listener cleanup

### State Management
- Single source of truth in engine
- Immutable state updates
- State history for debugging
- Persistence for testing

## Dependencies

**Required**:
- Bayesian Trust Engine (for trust score updates)
- Modern browser with CSS animation support
- requestAnimationFrame support

**Optional**:
- Adaptive AI Engine (for sophistication bonus)
- Story Progression Tracker (for story-based triggers)
- Gaming Mechanics Engine (for mechanic integration)

## Performance Considerations

### Optimization Strategies
1. **Batch DOM Updates**: Group changes in single frame
2. **CSS Over JS**: Use CSS animations when possible
3. **Lazy Loading**: Load character profiles on demand
4. **Effect Pooling**: Reuse glitch effect objects
5. **Throttling**: Limit update frequency to 60 FPS

### Memory Management
- Clean up event listeners on destroy
- Remove completed animations
- Clear effect history periodically
- Unload unused character profiles

## Future Enhancements

### Phase 2 Additions
- Audio horror system integration
- Canvas-based corruption effects
- Procedural glitch generation
- Advanced shader effects

### Phase 3 Additions
- Machine learning for effect timing
- Player-specific horror adaptation
- Dynamic difficulty adjustment
- Community-created horror profiles
