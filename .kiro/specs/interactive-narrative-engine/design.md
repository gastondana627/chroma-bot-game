# Design Document

## Overview

The State Management Refactor will implement a robust state machine architecture in index.html to resolve the critical UI transition bugs. The design focuses on creating clean separation between the "Login State" and "Gameplay State" while preserving all existing functional components and API integrations.

The refactor will transform the current broken state transitions into a professional, cinematic experience where users seamlessly move from character selection through login to an immersive gameplay environment.

## Architecture

### State Machine Design

The application will implement a simple but effective two-state machine:

```
[Login State] ---> handleExternalConnect() ---> [Gameplay State]
      |                                              |
      |                                              |
   - Intro Screen                               - Character Dashboard
   - Character Selection                        - Chroma Bot Orb  
   - Login Iframes                             - Chat Interface
   - Audio Management                          - Fireworks Canvas
```

### State Containers

**Login State Container (`#login-screen`)**
- Contains all pre-gameplay UI elements
- Includes character selector, login iframes, intro elements
- Will be completely hidden during gameplay state

**Gameplay State Container (`#gameplay-area`)**
- Contains all post-login UI elements
- Includes character dashboards, orb, chat interface
- Hidden by default, revealed after successful login
- Uses `position: fixed` elements for proper layering

### Transition Controller

The `handleExternalConnect()` function will act as the state transition controller:
1. Receives login success message from iframe
2. Stores session data (character, gamertag)
3. Orchestrates fade-out of login state
4. Orchestrates fade-in of gameplay state
5. Initializes gameplay components

## Components and Interfaces

### HTML Structure Refactor

```html
<!-- Login State Container -->
<div id="login-screen">
  <div id="intro-screen">...</div>
  <div id="character-selector">...</div>
  <div class="character-login">...</div>
</div>

<!-- Gameplay State Container -->
<div id="gameplay-area" class="hidden" style="visibility:hidden;">
  <!-- Fixed Position Elements -->
  <div id="video-container">...</div>
  <div id="chat-box">...</div>
  
  <!-- Character Dashboards -->
  <div id="eli-ui" class="character-ui hidden">...</div>
  <div id="maya-ui" class="character-ui hidden">...</div>
  <div id="stanley-ui" class="character-ui hidden">...</div>
</div>

<!-- Global Elements -->
<canvas id="fireworks"></canvas>
<audio elements...>
```

### CSS Architecture

**State Management Classes:**
```css
.hidden { display: none; }
.fade-out { animation: fadeOutAnimation 0.6s forwards; }
.fade-in { animation: fadeInAnimation 0.6s forwards; opacity: 0; visibility: visible; }

@keyframes fadeOutAnimation { 
  from { opacity: 1; } 
  to { opacity: 0; visibility: hidden; } 
}
@keyframes fadeInAnimation { 
  from { opacity: 0; } 
  to { opacity: 1; } 
}
```

**Fixed Positioning for Gameplay Elements:**
```css
#video-container, #chat-box {
  position: fixed !important;
  z-index: 2000;
}
#video-container {
  bottom: 20px;
  right: 20px;
}
#chat-box {
  bottom: 120px;
  right: 20px;
}
```

### JavaScript State Controller

**Enhanced handleExternalConnect Function:**
```javascript
function handleExternalConnect(characterKey, gamertag) {
  // 1. Store session data
  sessionStorage.setItem("character", characterKey);
  sessionStorage.setItem("gamertag", gamertag);

  // 2. Fade out login state
  loginScreen.classList.add("fade-out");
  
  // 3. After fade completes, transition to gameplay
  setTimeout(() => {
    // Hide login completely
    loginScreen.style.display = "none";
    
    // Show and fade in gameplay
    gameplayArea.classList.remove("hidden");
    gameplayArea.classList.add("fade-in");
    
    // Initialize gameplay components
    initializeGameplayState(characterKey);
  }, 600); // Match CSS animation duration
}
```

**Gameplay Initialization:**
```javascript
function initializeGameplayState(characterKey) {
  // Show orb and initialize video
  document.getElementById("video-container").style.display = "block";
  
  // Show correct character dashboard
  showCharacterDashboard(characterKey);
  
  // Initialize audio theme
  switchTheme(characterKey);
  
  // Ensure chat system is ready
  initializeChatSystem();
}
```

## Data Models

### Session State Model
```javascript
{
  character: "maya" | "eli" | "stanley",
  gamertag: string,
  currentState: "login" | "gameplay"
}
```

### Character Configuration Model
```javascript
{
  [characterKey]: {
    dashboard: string,     // CSS selector for dashboard
    audio: string,         // Audio element ID
    ui: string            // UI container ID
  }
}
```

## Error Handling

### Asset Loading Protection
- Video assets will use root-relative paths (`/chroma-bot/assets/vid/Chroma_Vid.mp4`)
- Fallback handling for missing video files
- Audio loading error handling with user interaction triggers

### State Transition Safety
- Timeout protection for fade animations
- Cleanup of event listeners during transitions
- Validation of session data before state changes

### UI Consistency Checks
- Verification that only one character dashboard is visible
- Confirmation that login elements are completely hidden
- Validation of orb positioning and functionality

## Testing Strategy

### Unit Tests for State Management
1. **State Transition Tests**
   - Verify login state hides completely
   - Verify gameplay state shows correctly
   - Test session data persistence

2. **Component Positioning Tests**
   - Verify orb appears in bottom-right corner
   - Verify dashboard appears in top-left corner
   - Test z-index layering

3. **Asset Loading Tests**
   - Verify video paths resolve correctly
   - Test audio switching functionality
   - Validate fireworks canvas initialization

### Integration Tests
1. **End-to-End Login Flow**
   - Complete login process for each character
   - Verify clean state transitions
   - Test chat functionality in gameplay state

2. **Cross-Browser Compatibility**
   - Test fade animations across browsers
   - Verify fixed positioning behavior
   - Validate video autoplay policies

### Visual Regression Tests
1. **UI Bleed Prevention**
   - Screenshot comparison before/after login
   - Verify no login elements remain visible
   - Test responsive behavior

2. **Component Positioning**
   - Verify orb placement consistency
   - Test dashboard positioning
   - Validate chat interface alignment

## Performance Considerations

### Animation Optimization
- Use CSS transforms for smooth animations
- Minimize reflows during state transitions
- Optimize video loading and playback

### Memory Management
- Clean up unused DOM elements after transitions
- Proper event listener management
- Efficient canvas rendering for fireworks

### Loading Strategy
- Preload critical assets during intro sequence
- Lazy load character-specific resources
- Progressive enhancement for slower connections

## Security Considerations

### Session Management
- Validate session data before state transitions
- Sanitize user input from login forms
- Secure storage of character selection

### Asset Security
- Use relative paths to prevent path traversal
- Validate video and audio file types
- Implement CSP headers for asset loading

## Deployment Strategy

### Rollback Plan
- Maintain backup of current index.html
- Feature flag for new state management
- Gradual rollout with monitoring

### Monitoring
- Track state transition success rates
- Monitor for UI bleed occurrences
- Log asset loading failures

### Success Metrics
- Zero UI bleed incidents
- 100% successful state transitions
- Improved user experience scores
- Reduced support tickets for UI issues