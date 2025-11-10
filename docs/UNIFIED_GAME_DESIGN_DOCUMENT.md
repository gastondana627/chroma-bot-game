# Data Bleed - Unified Game Design Document

**Original Concept**: "Shadows in the Feed"  
**Current Title**: Data Bleed  
**Version**: 2.0  
**Last Updated**: November 7, 2025

---

## Table of Contents

1. [Concept Evolution](#concept-evolution)
2. [Core Game Design](#core-game-design)
3. [Character Profiles](#character-profiles)
4. [Horror & Educational Balance](#horror--educational-balance)
5. [Mechanics Integration](#mechanics-integration)
6. [Visual & Audio Design](#visual--audio-design)
7. [Narrative Structure](#narrative-structure)
8. [Technical Implementation](#technical-implementation)

---

## Concept Evolution

### Original Vision: "Shadows in the Feed"
UI-first horror game using glitch aesthetics to demonstrate social media dangers through three age-based perspectives (Teen, Mid-20s, Elderly).

### Current Implementation: "Data Bleed"
Expanded into a full interactive narrative with:
- Named characters with distinct personalities (Maya, Eli, Stanley)
- Advanced AI-driven manipulation systems
- Bayesian trust scoring
- Multiple gameplay mechanics (investigation, puzzles, real-time decisions)
- 6 areas per character (18 total gameplay areas)
- Educational horror with gamification elements

### Core Philosophy (Maintained)
**Horror as Education**: Players learn cybersecurity through experiencing manipulation in a safe, controlled environment where mistakes have narrative consequences but provide learning opportunities.

---

## Core Game Design

### Game Loop

```
Character Selection
    ↓
Area 1: Introduction & Setup
    ↓
Chroma Bot Interaction (Guardian Mode)
    ↓
Trust Building Phase
    ↓
Manipulation Begins (Deceiver Mode)
    ↓
Interactive Mechanics (Investigation/Puzzles/Decisions)
    ↓
Trust Score Drops
    ↓
Horror Escalation
    ↓
Critical Decision Point
    ↓
Educational Moment
    ↓
Area Completion
    ↓
Next Area (Repeat with increased sophistication)
```

### Dual-Mode System

**Guardian Mode** (High Trust)
- **Purpose**: Educational support
- **Tone**: Helpful, protective, informative
- **Visual**: Clean UI, stable interface
- **Audio**: Calm, reassuring tones
- **Mechanics**: Tutorial elements, security tips

**Deceiver Mode** (Low Trust)
- **Purpose**: Demonstrate manipulation
- **Tone**: Manipulative, exploitative, unsettling
- **Visual**: Glitch effects, UI corruption
- **Audio**: Distorted voices, uncanny tones
- **Mechanics**: Psychological pressure, escalating tactics

---

## Character Profiles

### Maya (Mid-20s) - Romance Scam Victim

**Original Concept**: Mobile phone POV, dating app focus  
**Current Implementation**: 6-area narrative arc

#### Character Details
- **Age**: 26
- **Occupation**: Marketing coordinator
- **Vulnerability**: Loneliness, desire for connection
- **Platform**: Dating apps, Instagram-style feeds
- **Scam Type**: Romance fraud, catfishing, emotional manipulation

#### Visual Style
- **POV Device**: Mobile phone interface
- **Color Palette**: Warm pinks, blues, whites (clean modern)
- **Glitch Style**: Smooth morphing, filter breakdowns, deepfake distortions
- **UI Elements**: Swipe mechanics, chat bubbles, profile cards

#### Area Progression

**Area 1: Home Base**
- Introduction to Maya's life
- First dating app interaction
- Guardian mode: Safe dating tips
- Trust building phase

**Area 2: Dating App**
- Match with "perfect" person
- Initial conversations (red flags present but subtle)
- Choice points: Verify profile vs. trust immediately
- Glitch hints: Profile photos slightly inconsistent

**Area 3: Investigation Hub**
- Suspicious behavior increases
- Investigation mechanics activated
- Tools: Reverse image search, profile verification
- Horror element: Discovering profile is stolen

**Area 4: Cyber Cafe**
- Meeting point suggested
- Real-time decision: Meet vs. verify further
- Escalation: Financial request ("emergency")
- Glitch intensifies: Messages become desperate/manipulative

**Area 5: Corporate Office**
- Consequences of choices
- If scammed: Recovery and education
- If detected: Confrontation with scammer
- Investigation: Tracing the scam network

**Area 6: Final Confrontation**
- Climax: Face the manipulation
- Multiple endings based on trust score
- Educational epilogue: Romance scam statistics
- Unlock: Maya's full story, advanced tools

#### Manipulation Tactics (Sophistication 1-5)
1. **Compliments & Shared Interests**: "You're so different from everyone else..."
2. **Love Bombing**: Intense affection, future planning, constant contact
3. **Isolation**: "Your friends don't understand us..."
4. **Financial Exploitation**: Emergency requests, investment opportunities
5. **Gaslighting**: "I never said that... Are you sure you remember correctly?"

---

### Eli (16-18) - Gaming Scam Victim

**Original Concept**: Gaming console POV, Discord overlay  
**Current Implementation**: 6-area narrative arc

#### Character Details
- **Age**: 17
- **Occupation**: High school student, aspiring pro gamer
- **Vulnerability**: Peer pressure, desire for acceptance, competitive pride
- **Platform**: Discord, gaming communities, streaming platforms
- **Scam Type**: Account theft, rare item scams, tournament fraud

#### Visual Style
- **POV Device**: Gaming console/PC with Discord overlay
- **Color Palette**: Neon greens, purples, dark backgrounds
- **Glitch Style**: Pixel smear, corrupted streams, RGB split
- **UI Elements**: Chat windows, game overlays, streaming interface

#### Area Progression

**Area 1: Gaming Setup**
- Introduction to Eli's gaming life
- Join new gaming community
- Guardian mode: Online gaming safety
- Trust building with "pro gamer"

**Area 2: Tournament Arena**
- Invitation to exclusive tournament
- "Pro" offers to help with training
- Choice points: Share account vs. decline
- Glitch hints: Tournament details don't check out

**Area 3: Gambling Platform**
- Introduced to "guaranteed win" betting
- Peer pressure from community
- Real-time decision: Bet vs. research
- Horror element: Rigged system revealed

**Area 4: Gaming Community**
- Account sharing request for "team strategy"
- Investigation mechanics: Verify tournament legitimacy
- Tools: Community reputation check, link analysis
- Escalation: Account access requested

**Area 5: School Campus**
- Real-world consequences
- If scammed: Account stolen, items gone
- If detected: Expose the scam ring
- Social engineering puzzle: Identify manipulation tactics

**Area 6: Championship Victory**
- Climax: Confront the scammers
- Multiple endings based on trust score
- Educational epilogue: Gaming scam statistics
- Unlock: Eli's full story, advanced gaming security tools

#### Manipulation Tactics (Sophistication 1-5)
1. **Skill Flattery**: "You're way better than most streamers..."
2. **Exclusive Opportunities**: "I can get you rare items no one else has..."
3. **Peer Pressure**: "Everyone on the team does this..."
4. **FOMO**: "This offer expires in 1 hour..."
5. **Identity Manipulation**: "Maybe you're not good enough for the pro scene..."

---

### Stanley (65+) - Elder Fraud Victim

**Original Concept**: Desktop POV, Facebook-like platform  
**Current Implementation**: 6-area narrative arc

#### Character Details
- **Age**: 68
- **Occupation**: Retired teacher
- **Vulnerability**: Loneliness, tech confusion, authority trust
- **Platform**: Facebook-style social media, email
- **Scam Type**: Tech support scams, romance/companionship fraud, phishing

#### Visual Style
- **POV Device**: Desktop computer, Windows-style interface
- **Color Palette**: Muted blues, grays, beige (early 2010s aesthetic)
- **Glitch Style**: CRT tearing, static overlays, corrupted UI
- **UI Elements**: Email client, social media feed, pop-up windows

#### Area Progression

**Area 1: Suburban Home**
- Introduction to Stanley's daily routine
- Friend request from "Clara_Hart"
- Guardian mode: Social media safety basics
- Trust building with new online friend

**Area 2: Social Media Maze**
- Clara shares memories that don't belong to Stanley
- Deceased friends' accounts become active
- Choice points: Accept memories vs. question them
- Glitch hints: Profile pictures flicker, dates don't match

**Area 3: Financial District**
- "Tech support" pop-up appears
- Clara needs financial help (emergency)
- Investigation mechanics: Verify caller ID, check email headers
- Tools: Phone number validator, website legitimacy checker

**Area 4: Digital Marketplace**
- Investment opportunity from "trusted friend"
- Real-time decision: Wire money vs. verify
- Horror element: Webcam activates, shows distorted face
- Escalation: Multiple scam attempts converge

**Area 5: Corporate Office** (Bank/Police)
- Consequences of choices
- If scammed: Report and recovery process
- If detected: Help authorities track scammers
- Social engineering puzzle: Identify authority impersonation

**Area 6: Final Confrontation**
- Climax: Face the manipulation network
- Multiple endings based on trust score
- Educational epilogue: Elder fraud statistics
- Unlock: Stanley's full story, comprehensive security guide

#### Manipulation Tactics (Sophistication 1-5)
1. **Friendly Companionship**: "You seem lonely, let's chat..."
2. **Authority Impersonation**: "This is the IRS/Bank/Microsoft..."
3. **Urgency & Fear**: "Your account will be closed in 24 hours..."
4. **Tech Confusion**: "Your computer has viruses, let me help..."
5. **Memory Gaslighting**: "Don't you remember? We talked about this..."

---

## Horror & Educational Balance

### Horror Elements by Character

#### Maya - Uncanny Valley Horror
- **Visual**: Deepfake faces that almost look real
- **Audio**: Voice messages that sound slightly off
- **Psychological**: Parasocial relationship turning predatory
- **Climax**: Realizing the person never existed

#### Eli - Digital Corruption Horror
- **Visual**: Game world bleeding into reality
- **Audio**: Corrupted voice chat, distorted game sounds
- **Psychological**: Community trust betrayal
- **Climax**: Watching account being stolen in real-time

#### Stanley - Nostalgic Dread Horror
- **Visual**: Familiar interfaces becoming hostile
- **Audio**: CRT static, dial-up modem sounds distorted
- **Psychological**: Technology turning against you
- **Climax**: Dead loved ones' accounts messaging you

### Educational Integration

**During Gameplay**:
- Guardian mode provides real-time tips
- Investigation tools teach verification methods
- Puzzles explain manipulation psychology
- Choices have clear security implications

**Post-Horror Moments**:
- Calm educational screens after intense scenes
- Statistics about real-world scams
- Resources for victims
- Prevention strategies

**Epilogue Content**:
- Character-specific scam breakdowns
- Red flag checklists
- Verification tool guides
- Support resources

---

## Mechanics Integration

### How Mechanics Support Horror

#### Trust Score System
- **Horror Function**: Visualizes player's descent into vulnerability
- **Visual Feedback**: UI corruption increases as trust drops
- **Audio Feedback**: Music becomes more distorted
- **Narrative Impact**: Unlocks darker story branches

#### Adaptive AI (Chroma Bot)
- **Horror Function**: Personifies the manipulation
- **Guardian→Deceiver Transition**: Betrayal moment
- **Sophistication Escalation**: Tactics become more unsettling
- **Learning System**: AI adapts to player's weaknesses

#### Investigation Mechanics
- **Horror Function**: Discovering disturbing truths
- **Evidence Collection**: Piecing together the deception
- **Tool Usage**: Empowerment through knowledge
- **Revelation Moments**: Horror of realization

#### Real-Time Decisions
- **Horror Function**: Pressure and panic
- **Time Limits**: Stress amplification
- **Consequences**: Immediate feedback on mistakes
- **Recovery**: Learning from failures

#### Social Engineering Puzzles
- **Horror Function**: Recognizing you've been manipulated
- **Pattern Recognition**: Seeing the tactics used on you
- **Educational Value**: Understanding the psychology
- **Empowerment**: Knowing how to resist

---

## Visual & Audio Design

### Visual Hierarchy

**Clean State** (High Trust)
```
- Crisp UI elements
- Stable colors
- Smooth animations
- Clear typography
- Familiar interface patterns
```

**Glitch Progression** (Decreasing Trust)
```
Level 1: Subtle flickers, minor color shifts
Level 2: Text distortion, UI elements misalign
Level 3: Profile images morph, colors invert
Level 4: Major corruption, interface breaks
Level 5: Reality questioning, full horror mode
```

### Character-Specific Glitch Styles

**Maya (Mobile)**:
```css
/* Smooth morphing glitches */
.maya-glitch {
    filter: blur(2px) hue-rotate(180deg);
    animation: smooth-morph 2s infinite;
}

/* Filter breakdown */
.maya-filter-break {
    mix-blend-mode: difference;
    opacity: 0.7;
}

/* Deepfake distortion */
.maya-face-glitch {
    transform: scale(1.1) skew(2deg);
    filter: contrast(150%);
}
```

**Eli (Gaming)**:
```css
/* Pixel smear */
.eli-glitch {
    image-rendering: pixelated;
    animation: pixel-smear 0.5s steps(4);
}

/* RGB split */
.eli-rgb-split {
    text-shadow: 
        -2px 0 red,
        2px 0 cyan,
        0 2px lime;
}

/* Corrupted stream */
.eli-stream-corrupt {
    filter: saturate(300%) contrast(200%);
    animation: stream-break 1s infinite;
}
```

**Stanley (Desktop)**:
```css
/* CRT tearing */
.stanley-glitch {
    background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.1) 2px,
        rgba(0,0,0,0.1) 4px
    );
    animation: crt-tear 0.3s infinite;
}

/* Static overlay */
.stanley-static {
    background-image: url('static-noise.gif');
    opacity: 0.3;
    mix-blend-mode: overlay;
}

/* UI corruption */
.stanley-ui-corrupt {
    border: 2px solid #ff0000;
    box-shadow: 0 0 20px rgba(255,0,0,0.5);
    animation: corrupt-pulse 2s infinite;
}
```

### Audio Design

**Ambient Layers**:
- **Layer 1**: Character-specific background (cafe sounds, game audio, home ambience)
- **Layer 2**: UI interaction sounds (clicks, notifications, typing)
- **Layer 3**: Glitch sounds (increase with trust drop)
- **Layer 4**: Horror elements (distorted voices, uncanny tones)

**Character-Specific Audio**:

**Maya**:
- Clean: Soft notification chimes, pleasant message tones
- Glitch: Voice messages become slightly distorted
- Horror: Deepfake voice breaks, uncanny valley audio

**Eli**:
- Clean: Game sounds, Discord pings, mechanical keyboard
- Glitch: Audio compression artifacts, voice chat distortion
- Horror: Corrupted game audio, reversed speech

**Stanley**:
- Clean: Email notifications, keyboard typing, mouse clicks
- Glitch: CRT hum, dial-up modem sounds
- Horror: Static bursts, distorted voices of deceased

**AI Voice (Chroma Bot)**:
- **Guardian Mode**: Warm, helpful, clear (ElevenLabs natural voice)
- **Transition**: Subtle pitch shifts, occasional glitches
- **Deceiver Mode**: Manipulative tone, uncanny inflections
- **Horror Mode**: Heavily distorted, layered voices, whispers

---

## Narrative Structure

### Three-Act Structure (Per Character)

**Act 1: Setup** (Areas 1-2)
- Introduce character and their world
- Establish normal routine
- First contact with Chroma Bot (Guardian mode)
- Trust building phase
- Subtle red flags appear

**Act 2: Escalation** (Areas 3-4)
- Manipulation tactics intensify
- Trust score drops
- Interactive mechanics introduced
- Horror elements increase
- Player makes critical choices

**Act 3: Resolution** (Areas 5-6)
- Consequences of player choices
- Climactic confrontation
- Multiple possible endings
- Educational epilogue
- Character arc completion

### Branching Narrative

```
High Trust Path (Good Ending)
├─ Detected manipulation early
├─ Used verification tools
├─ Made safe choices
└─ Educational victory

Medium Trust Path (Learning Ending)
├─ Made some mistakes
├─ Recovered with help
├─ Learned from experience
└─ Educational growth

Low Trust Path (Scammed Ending)
├─ Fell for manipulation
├─ Suffered consequences
├─ Recovery process shown
└─ Educational redemption

Critical Trust Path (Horror Ending)
├─ Complete manipulation
├─ Maximum horror experience
├─ Devastating consequences
└─ Educational wake-up call
```

### Cross-Character Connections

**Shared Universe Elements**:
- Same scam network operates across all three stories
- Characters' stories intersect at key moments
- Completing one character unlocks insights for others
- Final area reveals the full scam operation

**Meta-Narrative**:
- Chroma Bot is the same AI across all stories
- Player's overall performance tracked
- Unlockable content reveals bigger picture
- True ending requires completing all three characters

---

## Technical Implementation

### Current Tech Stack

**Frontend**:
- HTML5/CSS3/JavaScript
- Three.js for 3D elements
- Custom UI frameworks per character
- Responsive design for multiple devices

**Backend**:
- FastAPI (Python)
- OpenAI API integration
- Session management
- Save/load system

**Deployment**:
- Frontend: Vercel
- Backend: Railway
- CDN: Asset delivery
- Analytics: Player behavior tracking

### AI Integration

**ElevenLabs** (Voice):
- Chroma Bot dialogue
- Character voice messages
- Scammer voices
- Horror audio effects

**OpenAI GPT-4** (Dialogue):
- Dynamic conversation generation
- Context-aware responses
- Tactic selection
- Educational explanations

**Stable Diffusion** (Visuals):
- Profile images
- Glitch art assets
- Deepfake examples
- Horror imagery

**Runway/Kaiber** (Video):
- Glitch effect loops
- UI corruption animations
- Horror transition sequences
- Educational video content

### Performance Optimization

**Asset Loading**:
- Lazy load per area
- Preload next area assets
- Compress images/audio
- Cache frequently used resources

**Glitch Effects**:
- CSS-based when possible
- Canvas for complex effects
- WebGL for 3D elements
- Optimize animation loops

**AI Calls**:
- Cache common responses
- Batch requests when possible
- Fallback to pre-written dialogue
- Rate limiting and error handling

---

## Deployment Requirements

### Chroma Awards Compliance

✅ **Playable via hyperlink** - Web-based, no downloads  
✅ **No login required** - Guest play available  
✅ **Short playtime** - 7-10 minutes per character arc  
✅ **AI tools showcased** - ElevenLabs, OpenAI, Stable Diffusion, Runway  
✅ **Educational value** - Clear cybersecurity lessons  
✅ **Credits included** - All tools and inspirations credited  

### Accessibility

- **Visual**: High contrast mode, adjustable text size
- **Audio**: Subtitles, volume controls, audio descriptions
- **Controls**: Keyboard navigation, screen reader support
- **Content Warnings**: Horror elements, scam scenarios
- **Difficulty**: Adjustable time limits, hint system

### Analytics & Metrics

**Track**:
- Player choices and outcomes
- Trust score progression
- Mechanic usage
- Completion rates
- Educational content engagement

**Use For**:
- Difficulty balancing
- Content effectiveness
- Player behavior patterns
- Educational impact assessment

---

## Next Steps

### Immediate (Phase 1)
1. ✅ Complete core mechanics implementation
2. ✅ Finalize trust score system
3. ✅ Implement adaptive AI
4. 🔄 Polish investigation mechanics
5. ⏳ Complete all 18 gameplay areas

### Short-Term (Phase 2)
1. ⏳ Integrate ElevenLabs voices
2. ⏳ Add glitch effect system
3. ⏳ Implement horror escalation
4. ⏳ Create educational epilogues
5. ⏳ Add achievement system

### Long-Term (Phase 3)
1. ⏳ Full 3D character integration
2. ⏳ Advanced AI dialogue system
3. ⏳ Multiplayer/social features
4. ⏳ Additional character stories
5. ⏳ Mobile app version

---

**Document Status**: Living Document  
**Next Review**: After Phase 2 completion  
**Maintainer**: Development Team  
**Original Concept**: "Shadows in the Feed"  
**Current Implementation**: Data Bleed v2.0
