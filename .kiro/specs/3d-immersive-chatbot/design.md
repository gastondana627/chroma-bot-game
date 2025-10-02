# Design Document

## Overview

The 3D Immersive Chatbot system will enhance the existing Data Bleed chroma bot by adding cinematic 3D character moments that emerge from the familiar chroma orb interface. Rather than replacing the chatbot, the 3D characters (Eli, Maya, Stanley) will appear 2-3 times during each character's storyline at key narrative moments, creating memorable interactions while preserving the consistent chroma bot experience players expect.

## Architecture

### High-Level System Design

```
Existing Chroma Bot (Preserved)
├── Chroma Orb (animated video)
├── Chat Interface (popup)
├── API Backend (/api/chat)
└── Character Configurations

3D Enhancement Layer (New)
├── 3D Trigger System (story-based)
├── 3D Character Renderer (Three.js)
├── 3D Asset Pipeline (NeRF/Gaussian Splatting)
└── Cinematic Controller (animations/transitions)
```

### Integration Strategy

The 3D system will be **additive** to the existing chatbot, not replacing it:

1. **Primary Interface**: Chroma bot remains the main interaction method
2. **Cinematic Moments**: 3D characters emerge at predetermined story beats
3. **Seamless Transition**: 3D characters animate out from the chroma orb location
4. **Return to Normal**: After 3D interaction, system returns to standard chroma bot

## Components and Interfaces

### 1. 3D Trigger System

**Purpose**: Determines when 3D characters should appear based on story progression

**Implementation**:
```javascript
// Story progression tracking
const storyTriggers = {
  eli: [
    { area: 'area-2-tournament-arena', trigger: 'first_tournament_win' },
    { area: 'area-4-gaming-community', trigger: 'peer_pressure_peak' },
    { area: 'area-6-championship-victory', trigger: 'final_victory' }
  ],
  maya: [
    { area: 'area-2-dating-app', trigger: 'suspicious_match_detected' },
    { area: 'area-4-cyber-cafe', trigger: 'investigation_breakthrough' },
    { area: 'area-6-final-confrontation', trigger: 'confrontation_moment' }
  ],
  stanley: [
    { area: 'area-2-social-media-maze', trigger: 'identity_theft_discovery' },
    { area: 'area-4-digital-marketplace', trigger: 'scam_prevention_success' },
    { area: 'area-6-protection-network', trigger: 'community_leadership' }
  ]
};
```

**Integration with Existing System**:
- Extends current `chroma_bot_injectors.js`
- Monitors story state through existing area navigation
- Triggers 3D mode based on user progress and choices

### 2. 3D Character Renderer

**Technology Stack**:
- **Three.js**: WebGL rendering engine
- **NeRF Integration**: For photorealistic character models from reference images
- **Gaussian Splatting**: Real-time rendering optimization
- **Photogrammetry Pipeline**: Environment reconstruction

**Character Asset Pipeline**:
```
Reference Images (Provided) → 
NeRF Processing → 
3D Model Generation → 
Gaussian Splatting Optimization → 
Web-Ready Assets
```

**Rendering Architecture**:
```javascript
class Character3DRenderer {
  constructor(character, chromaOrbPosition) {
    this.character = character; // 'eli', 'maya', 'stanley'
    this.emergencePoint = chromaOrbPosition;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
  }
  
  emergeFromChromaOrb() {
    // Animate 3D character emerging from chroma orb location
  }
  
  returnToChromaOrb() {
    // Animate 3D character returning to chroma orb
  }
}
```

### 3. Cinematic Controller

**Purpose**: Manages the transition between 2D chroma bot and 3D character moments

**Key Features**:
- **Emergence Animation**: 3D character scales up from chroma orb position
- **Camera Control**: Automatic camera positioning for optimal character view
- **Lighting System**: Dynamic lighting that matches character themes
- **Return Transition**: Smooth animation back to chroma orb

**Animation Sequence**:
1. **Trigger Detection**: Story moment reached
2. **Chroma Orb Expansion**: Orb glows and expands
3. **3D Character Emergence**: Character materializes from orb location
4. **Cinematic Interaction**: 3D character delivers key dialogue
5. **Return Sequence**: Character dissolves back into chroma orb
6. **Resume Normal**: Standard chroma bot interface restored

### 4. Enhanced Chat Integration

**Connecting 3D with Existing API**:

The existing `/api/chat` endpoint will be enhanced to support 3D mode:

```javascript
// Enhanced API request
{
  message: "user input",
  character: "eli|maya|stanley",
  sessionId: "player_session",
  mode: "3d_cinematic", // New parameter
  storyTrigger: "tournament_win" // Context for 3D moment
}
```

**3D-Specific Response Format**:
```javascript
{
  reply: "character dialogue",
  mode: "3d_cinematic",
  animations: {
    gesture: "victory_pose",
    expression: "confident",
    duration: 5000
  },
  returnToNormal: true
}
```

## Data Models

### 3D Asset Structure
```javascript
const characterAssets = {
  eli: {
    model: '/assets/3d/eli/eli_nerf_model.glb',
    textures: '/assets/3d/eli/textures/',
    animations: '/assets/3d/eli/animations.json',
    lighting: {
      theme: 'gaming_neon',
      colors: ['#00FFFF', '#FF0080', '#7928CA']
    }
  },
  maya: {
    model: '/assets/3d/maya/maya_nerf_model.glb',
    textures: '/assets/3d/maya/textures/',
    animations: '/assets/3d/maya/animations.json',
    lighting: {
      theme: 'investigation_mood',
      colors: ['#0066CC', '#FFFFFF', '#333333']
    }
  },
  stanley: {
    model: '/assets/3d/stanley/stanley_nerf_model.glb',
    textures: '/assets/3d/stanley/textures/',
    animations: '/assets/3d/stanley/animations.json',
    lighting: {
      theme: 'suburban_security',
      colors: ['#4A5568', '#E2E8F0', '#FED7D7']
    }
  }
};
```

### Story Trigger Configuration
```javascript
const cinematicMoments = {
  eli_tournament_win: {
    character: 'eli',
    area: 'area-2-tournament-arena',
    trigger: 'user_wins_tournament',
    dialogue: "That was incredible! You're really getting the hang of this...",
    animation: 'celebration_gesture',
    duration: 8000
  },
  maya_investigation_breakthrough: {
    character: 'maya',
    area: 'area-4-cyber-cafe',
    trigger: 'evidence_discovered',
    dialogue: "Wait... this changes everything. Look at what we found...",
    animation: 'pointing_gesture',
    duration: 10000
  }
  // ... additional cinematic moments
};
```

## Error Handling

### 3D Rendering Fallbacks
1. **WebGL Not Supported**: Graceful fallback to standard chroma bot
2. **Asset Loading Failure**: Display error message, continue with 2D interface
3. **Performance Issues**: Automatic quality reduction or disable 3D mode
4. **Memory Constraints**: Asset cleanup and garbage collection

### Integration Safety
- **API Compatibility**: 3D mode parameters are optional, won't break existing functionality
- **Progressive Enhancement**: 3D features enhance but don't replace core chatbot
- **Backward Compatibility**: All existing chroma bot functionality preserved

## Testing Strategy

### Unit Testing
- 3D asset loading and rendering
- Story trigger detection accuracy
- Animation sequence completion
- API integration with new parameters

### Integration Testing
- Seamless transition between 2D and 3D modes
- Preservation of chat history during 3D moments
- UI element positioning during 3D rendering
- Performance impact on existing gameplay areas

### User Experience Testing
- Cinematic moment timing and impact
- Character emergence animation smoothness
- Return to normal chatbot functionality
- Cross-device compatibility (desktop, mobile, tablet)

### Performance Testing
- 3D rendering performance across devices
- Memory usage during cinematic moments
- Asset loading times and optimization
- Concurrent user support with 3D features enabled

## Implementation Phases

### Phase 1: Foundation
- Set up Three.js integration with existing chroma bot
- Create basic 3D character emergence animation
- Implement story trigger detection system

### Phase 2: Character Assets
- Process reference images through NeRF pipeline
- Generate 3D character models for Eli, Maya, Stanley
- Optimize assets using Gaussian Splatting

### Phase 3: Cinematic System
- Implement full emergence/return animation sequences
- Add character-specific lighting and atmosphere
- Integrate with existing chat API

### Phase 4: Polish & Optimization
- Performance optimization for various devices
- Error handling and fallback systems
- User experience refinement and testing