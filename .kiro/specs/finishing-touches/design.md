# Finishing Touches - Design Document

## Overview

This design implements three polishing features for Data Bleed: scene transition audio, Formspree email integration, and QR code logo transformation. All features are designed for rapid implementation with minimal dependencies and maximum impact.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                   Finishing Touches                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ Scene Transition │  │  Email Signup    │            │
│  │  Audio System    │  │     System       │            │
│  └────────┬─────────┘  └────────┬─────────┘            │
│           │                     │                       │
│           │                     │                       │
│  ┌────────▼─────────────────────▼─────────┐            │
│  │      QR Logo Transformation             │            │
│  │         System                          │            │
│  └─────────────────────────────────────────┘            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Scene Transition Audio System

**File:** `videos/eli/scene-transition-audio.js`

**Purpose:** Plays atmospheric audio between scenes based on narrative context and trust score.

**Key Methods:**
```javascript
class SceneTransitionAudio {
    playSceneTransition(fromScene, toScene, trustScore)
    getTransitionType(fromScene, toScene, trustScore)
    playTransitionSound(type)
    playAmbientSound(transitionType, trustScore)
    stopTransition()
}
```

**Audio Files Structure:**
```
videos/eli/audio/
├── transitions/
│   ├── suspense_build.mp3
│   ├── tension_rise.mp3
│   ├── corruption_whisper.mp3
│   └── relief_breath.mp3
└── ambient/
    ├── keyboard_typing.mp3
    ├── heartbeat_slow.mp3
    ├── digital_static.mp3
    └── nervous_breathing.mp3
```

**Integration Points:**
- Hook into existing scene navigation in `eli-flexible-player.html`
- Access trust score from `trust-decay-system.js`
- Respect audio settings from `audio-manager.js`

**Transition Logic:**
```javascript
Scene 1→2: suspense (gaming setup → tournament)
Scene 2→3: tension (tournament → gambling)
Scene 3→4: corruption (gambling → community)
Scene 4→5: revelation (community → school)
Scene 5→6: victory/tension (based on trust score)

Trust < 30: corruption sounds
Trust < 60: tension sounds
Trust > 80: relief sounds
```

### 2. Email Signup System

**File:** `js/email-signup-system.js`

**Purpose:** Captures user emails via Formspree and sends to gastondana627@gmail.com

**Key Methods:**
```javascript
class EmailSignupSystem {
    showModal()
    hideModal()
    submitEmail()
    showSuccess()
    triggerOnStoryCompletion()
    triggerOnCharacterLocked()
}
```

**Formspree Configuration:**
```javascript
{
    apiEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
    targetEmail: 'gastondana627@gmail.com',
    fields: {
        email: required,
        name: optional,
        character_interest: optional,
        feedback: optional
    }
}
```

**Modal Structure:**
```html
<div class="email-modal">
    <h2>Get Notified for Maya & Stanley!</h2>
    <form>
        <input type="email" required>
        <input type="text" placeholder="Name (optional)">
        <select name="character_interest">
            <option>Maya - The Investigator</option>
            <option>Stanley - The Vulnerable</option>
            <option>Both!</option>
        </select>
        <button>Notify Me!</button>
    </form>
</div>
```

**Trigger Events:**
1. Story completion: Listen for `storyCompleted` event
2. Locked character click: Listen for `lockedCharacterClick` event
3. Manual trigger: Button in pause menu (optional)

**Styling:** Matches Data Bleed aesthetic with cyan/neon theme, glassmorphism effects

### 3. QR Code Logo Transformation

**File:** `js/qr-logo-system.js`

**Purpose:** Transforms animated logo into scannable QR code linking to creator's LinkedIn

**Key Methods:**
```javascript
class QRLogoSystem {
    init()
    detectLogoCompletion()
    transformToQR()
    generateQRCode(url)
    applyGlitchTransition()
    addPulseEffect()
    showQRModal()
}
```

**QR Code Library:**
- Use: `qrcode.js` (CDN: https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js)
- Lightweight, no dependencies
- Generates QR codes client-side

**Default QR Target:**
```javascript
primaryLink: 'https://www.linkedin.com/in/gaston-d-859653184/'
```

**Transformation Sequence:**
```
1. Detect logo animation completion (monitor CSS animation end)
2. Wait 0.5s
3. Apply glitch effect (1s duration)
4. Fade logo opacity to 0
5. Generate QR code
6. Fade QR code opacity to 1
7. Add pulse animation
8. Add hover tooltip
```

**Glitch Effect:**
```css
@keyframes logoToQRGlitch {
    0%, 100% { transform: translate(0); filter: none; }
    20% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
    40% { transform: translate(5px, -5px); filter: hue-rotate(180deg); }
    60% { transform: translate(-5px, -5px); filter: invert(1); }
    80% { transform: translate(5px, 5px); filter: hue-rotate(270deg); }
}
```

**QR Code Styling:**
```css
.qr-code-container {
    width: 200px;
    height: 200px;
    padding: 15px;
    background: rgba(0, 255, 255, 0.1);
    border: 2px solid #00ffff;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    animation: qrPulse 2s infinite;
}
```

**Modal for Multiple Links (Optional Enhancement):**
```javascript
socialLinks: {
    linkedin: 'https://www.linkedin.com/in/gaston-d-859653184/',
    portfolio: '[YOUR_PORTFOLIO_URL]',
    github: '[YOUR_GITHUB_URL]',
    instagram: '[YOUR_INSTAGRAM_URL]'
}
```

### Integration Points

**1. Scene Transition Audio Integration:**
```javascript
// In eli-flexible-player.html
function navigateToScene(sceneNumber) {
    const currentScene = getCurrentScene();
    const trustScore = window.trustDecaySystem?.getTrustScore() || 100;
    
    // Play transition audio
    window.sceneTransitionAudio?.playSceneTransition(
        currentScene, 
        sceneNumber, 
        trustScore
    );
    
    // Continue with scene navigation...
}
```

**2. Email Signup Integration:**
```javascript
// In completion-screen.js
function showCompletionScreen() {
    // Show completion UI
    displayFinalStats();
    
    // Trigger email signup after 2 seconds
    setTimeout(() => {
        window.emailSignup?.triggerOnStoryCompletion();
    }, 2000);
}

// In enhanced-character-selector.html
document.querySelectorAll('.locked-character').forEach(char => {
    char.addEventListener('click', () => {
        window.emailSignup?.triggerOnCharacterLocked();
    });
});
```

**3. QR Logo Integration:**
```javascript
// In index.html (intro screen)
const logoAnimation = document.querySelector('.logo-animation');
logoAnimation.addEventListener('animationend', () => {
    window.qrLogoSystem?.transformToQR();
});

// Or after timeout if animation is skipped
setTimeout(() => {
    if (!window.qrLogoSystem?.isTransformed) {
        window.qrLogoSystem?.transformToQR();
    }
}, 5000);
```

## Data Models

### Email Submission Data
```javascript
{
    email: "user@example.com",
    name: "Optional Name",
    character_interest: "maya|stanley|both",
    feedback: true|false,
    source: "Data Bleed Game",
    completed_story: "Eli",
    timestamp: "2025-11-10T12:00:00Z",
    trust_score: 85
}
```

### Audio Configuration
```javascript
{
    transitionType: "suspense|tension|corruption|relief|victory",
    duration: 3000, // milliseconds
    volume: 0.7,
    fadeOut: true,
    ambientSound: "typing|heartbeat|static|breathing|null"
}
```

### QR Code Configuration
```javascript
{
    url: "https://www.linkedin.com/in/gaston-d-859653184/",
    size: 200,
    errorCorrectionLevel: "M",
    color: {
        dark: "#00ffff",
        light: "#000000"
    }
}
```

## Error Handling

### Audio System
- Fallback: Silent transitions if audio files missing
- Preload audio files on page load
- Catch and log playback errors
- Respect user audio preferences

### Email System
- Validate email format client-side
- Show user-friendly error messages
- Retry mechanism for network failures
- Fallback: Display email address for manual contact
- Rate limiting: Prevent spam submissions

### QR System
- Fallback: Display text link if QR library fails
- Ensure minimum scannable size (200x200px)
- Test QR code generation on load
- Graceful degradation if logo element not found

## Testing Strategy

### Manual Testing
1. **Audio Transitions:**
   - Navigate through all 6 scenes
   - Test with different trust scores (high, medium, low)
   - Verify audio respects global settings
   - Test on mobile devices

2. **Email Signup:**
   - Complete Eli's story → verify modal appears
   - Click locked character → verify modal appears
   - Submit valid email → check gastondana627@gmail.com
   - Submit invalid email → verify validation
   - Test on mobile devices

3. **QR Logo:**
   - Load intro screen → verify transformation
   - Scan QR code with phone → verify LinkedIn opens
   - Test on different screen sizes
   - Verify glitch effect plays smoothly

### Test Files
- `test-scene-transitions-audio.html`
- `test-email-signup.html`
- `test-qr-logo-transformation.html`
- `test-all-finishing-touches.html`

## Performance Considerations

- Audio files: Use compressed MP3 format, max 100KB each
- QR library: Load from CDN, ~15KB gzipped
- Email modal: Lazy load, only create DOM when triggered
- QR generation: Client-side, no server calls
- Total added weight: ~500KB (mostly audio)

## Accessibility

- Audio: Respect user preferences, provide mute option
- Email modal: Keyboard navigable, ESC to close, focus trap
- QR code: Alt text with link, clickable fallback
- Color contrast: Ensure text readability
- Screen reader: Announce modal opening

## Mobile Optimization

- Audio: Require user interaction before playing (iOS requirement)
- Email modal: Full-screen on mobile, large touch targets
- QR code: Minimum 200x200px, easily scannable
- Responsive layouts for all components

## Implementation Priority

1. **Email Signup** (Highest priority - captures users)
2. **QR Logo** (High priority - creator branding)
3. **Scene Audio** (Medium priority - polish)

## Timeline Estimate

- Email Signup: 1-2 hours
- QR Logo: 1-2 hours
- Scene Audio: 2-3 hours (including audio sourcing)
- Testing & Polish: 1 hour
- **Total: 5-8 hours**
