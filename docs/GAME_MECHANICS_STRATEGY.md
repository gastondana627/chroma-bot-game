# Data Bleed - Game Mechanics Strategy & Algorithm Documentation

**Version**: 1.0  
**Last Updated**: November 7, 2025  
**Purpose**: Comprehensive breakdown of game mechanics, algorithms, and gamification systems

---

## Table of Contents

1. [Overview](#overview)
2. [Core Mechanics Architecture](#core-mechanics-architecture)
3. [Trust Score System](#trust-score-system)
4. [Adaptive AI System](#adaptive-ai-system)
5. [Investigation Mechanics](#investigation-mechanics)
6. [Real-Time Decision Mechanics](#real-time-decision-mechanics)
7. [Social Engineering Puzzles](#social-engineering-puzzles)
8. [Gamification Systems](#gamification-systems)
9. [Integration & Data Flow](#integration--data-flow)
10. [Implementation Roadmap](#implementation-roadmap)

---

## Overview

### Game Concept
Data Bleed is an educational horror game that teaches cybersecurity awareness through immersive narrative experiences. Players interact with three characters (Maya, Eli, Stanley) who are vulnerable to different types of online manipulation.

### Core Philosophy
- **Education through experience**: Players learn by making mistakes in a safe environment
- **Character-driven narratives**: Each character represents different vulnerability profiles
- **Adaptive difficulty**: AI adjusts tactics based on player performance
- **Psychological realism**: Based on research-backed manipulation techniques

---

## Core Mechanics Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  Gaming Mechanics Engine                     │
│                    (Central Orchestrator)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Trust Score  │ │ Adaptive AI  │ │ Story        │
│ Engine       │ │ Engine       │ │ Progression  │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Investigation │ │ Real-Time    │ │ Social Eng.  │
│ Mechanics    │ │ Decisions    │ │ Puzzles      │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Component Responsibilities

**Gaming Mechanics Engine**
- Central coordinator for all mechanics
- Manages mechanic lifecycle (activation/deactivation)
- Routes events between systems
- Handles session management

**Trust Score Engine**
- Calculates player vulnerability using Bayesian algorithms
- Character-specific vulnerability profiles
- Non-linear vulnerability curves
- Recovery rate calculations

**Adaptive AI Engine**
- Multi-persona system (Guardian/Deceiver)
- Tactic escalation based on player responses
- Sophistication levels (1-5)
- Learning from player patterns

---

## Trust Score System

### Algorithm: Bayesian Trust Calculation

#### Core Formula
```
TrustDelta = BaseImpact × ContextModifier × CharacterWeight × VulnerabilityCurve
```

#### Components Breakdown

**1. Base Impact**
```javascript
Actions and their base impacts:
- trust_stranger: -15
- share_personal_info: -20
- click_suspicious_link: -25
- send_money: -40
- verify_identity: +15
- check_url: +10
- ask_questions: +12
- seek_help: +18
- ignore_pressure: +20
- report_suspicious: +25
```

**2. Context Modifier**
```javascript
Character-specific context multipliers:

Maya (Romance Context):
- emotional_multiplier: 1.5
- romance_vulnerability: -20 baseline
- recovery_rate: 0.7 (slower in emotional contexts)

Eli (Gaming Context):
- peer_pressure_multiplier: 1.3
- gaming_context_weight: 2.0
- community_trust_bonus: +10

Stanley (Authority Context):
- loneliness_factor: 2.0
- tech_savvy_factor: 0.5 (reduced understanding)
- authority_trust_bonus: +20
```

**3. Vulnerability Curve**
```javascript
// Non-linear exponential curve
normalized = (currentScore - TRUST_MIN) / (TRUST_MAX - TRUST_MIN)
vulnerability = Math.pow(1 - normalized, 1.5) + 0.5

// Lower trust = exponentially higher vulnerability
// Example: -60 trust = 2.3x vulnerability multiplier
```

#### Trust Levels & Thresholds

```
Score Range    | Level      | Risk      | Color
---------------|------------|-----------|--------
20 to 100      | SAFE       | LOW       | #00FF88
0 to 19        | CAUTIOUS   | MEDIUM    | #FFD700
-59 to -1      | VULNERABLE | HIGH      | #FF6B35
-100 to -60    | CRITICAL   | CRITICAL  | #FF0040
```

#### Character-Specific Trust Theming

**Maya (Romance Scams)**
- SAFE → "SECURE" - Dating safely, red flags detected
- VULNERABLE → "AT RISK" - Susceptible to romance scams
- CRITICAL → "COMPROMISED" - Highly vulnerable to catfishing

**Eli (Gaming Scams)**
- SAFE → "SECURE" - Gaming safely, scams detected
- VULNERABLE → "PRESSURED" - Susceptible to peer pressure
- CRITICAL → "PWNED" - Highly vulnerable to gaming scams

**Stanley (Elder Fraud)**
- SAFE → "PROTECTED" - Digitally secure and aware
- VULNERABLE → "TARGETED" - Susceptible to elder fraud
- CRITICAL → "EXPLOITED" - Highly vulnerable to scams

### Implementation Status
✅ **IMPLEMENTED** - `Game/Mechanics/bayesian-trust-engine.js`

---

## Adaptive AI System

### Multi-Persona Architecture

#### Persona Types

**Guardian Mode** (High Trust)
- Educational and supportive
- Provides security tips
- Reinforces good decisions
- Activated when: Trust ≥ threshold

**Deceiver Mode** (Low Trust)
- Manipulative and exploitative
- Uses psychological tactics
- Escalates sophistication
- Activated when: Trust ≤ threshold

### Sophistication Levels (1-5 Scale)

#### Level 1: Basic Appeals
**Tactics**: Simple compliments, friendly conversation, basic requests
**Example (Maya)**: "You seem really genuine and different..."
**Detection Difficulty**: Easy
**Trust Impact**: -5 to -10

#### Level 2: Social Proof & Authority
**Tactics**: Testimonials, expert credentials, peer validation
**Example (Eli)**: "As a pro gamer, I can tell you..."
**Detection Difficulty**: Moderate
**Trust Impact**: -10 to -15

#### Level 3: Scarcity & Fear Tactics
**Tactics**: Limited time offers, FOMO, urgent deadlines
**Example (Stanley)**: "Your account will be closed in 24 hours..."
**Detection Difficulty**: Moderate-Hard
**Trust Impact**: -15 to -20

#### Level 4: Complex Psychological Manipulation
**Tactics**: Love bombing, gaslighting, emotional dependency
**Example (Maya)**: "I thought you trusted me... I'm disappointed..."
**Detection Difficulty**: Hard
**Trust Impact**: -25 to -30

#### Level 5: Perception Hacks & Reality Distortion
**Tactics**: Questioning interface, memory gaslighting, isolation
**Example (All)**: "Are you sure you can trust what you're seeing on your screen?"
**Detection Difficulty**: Very Hard
**Trust Impact**: -35 to -45

### Tactic Escalation Algorithm

```javascript
// Escalation decision tree
function calculateSophistication(trustScore, detectionRate, recentFailures) {
    let sophistication = 1;
    
    // Base on trust score
    if (trustScore < -60) sophistication = 5;
    else if (trustScore < -30) sophistication = 4;
    else if (trustScore < 0) sophistication = 3;
    else if (trustScore < 30) sophistication = 2;
    
    // Adjust for player detection
    if (detectionRate > 0.7) sophistication += 2;
    else if (detectionRate > 0.4) sophistication += 1;
    
    // Adjust for failures
    if (recentFailures > 3) sophistication += 1;
    
    return Math.min(5, sophistication);
}
```

### Character-Specific Manipulation Profiles

#### Maya (Romance Scams)
**Primary Vulnerabilities**: Loneliness, romantic desire, emotional validation

**Escalation Patterns**:
1. **Slow Burn**: Gradual emotional investment building
2. **Love Bombing**: Intense affection and attention
3. **Emergency Scam**: Sudden crisis requiring help

**Effective Tactics by Level**:
- L1: Compliments, shared interests, emotional connection
- L2: Social proof (dating success stories), romance expert authority
- L3: Limited time love, fear of loneliness, scarcity of perfect match
- L4: Love bombing, future faking, emotional dependency creation
- L5: Gaslighting feelings, reality distortion, isolation tactics

#### Eli (Gaming Scams)
**Primary Vulnerabilities**: Peer acceptance, gaming achievement, competitive pride

**Escalation Patterns**:
1. **Peer Pressure**: Gradual social pressure building
2. **Rare Item Bait**: Exclusive gaming opportunities
3. **Team Exploitation**: Trust-based account access

**Effective Tactics by Level**:
- L1: Gaming compliments, skill recognition, community belonging
- L2: Peer pressure, pro gamer authority, social proof
- L3: Limited rare items, FOMO, competitive scarcity
- L4: Trust exploitation, account sharing pressure, team manipulation
- L5: Gaslighting skills, community isolation, identity questioning

#### Stanley (Elder Fraud)
**Primary Vulnerabilities**: Loneliness, tech confusion, authority trust

**Escalation Patterns**:
1. **Authority Scam**: Official impersonation with urgency
2. **Tech Support**: Helpful assistance turning exploitative
3. **Companionship**: Friendship building for financial gain

**Effective Tactics by Level**:
- L1: Friendly conversation, tech help offers, authority respect
- L2: Official authority, social proof (seniors), expert credentials
- L3: Urgent deadlines, fear of consequences, limited time offers
- L4: Complex tech confusion, authority intimidation, isolation exploitation
- L5: Gaslighting memory, reality confusion, dependency creation

### Learning & Adaptation

**Player History Tracking**:
```javascript
playerHistory = {
    successful_manipulations: [],  // Tactics that worked
    failed_attempts: [],            // Tactics that failed
    detected_tactics: [],           // Player recognized these
    response_patterns: {},          // Message type → success rate
    sophistication_resistance: 1    // Player's detection skill
}
```

**Adaptation Logic**:
1. Track success/failure of each tactic
2. Calculate detection rate per tactic type
3. Avoid recently failed tactics (2-minute cooldown)
4. Escalate sophistication when player shows high detection
5. Adjust effectiveness multipliers based on history

### Implementation Status
✅ **IMPLEMENTED** - `Game/Mechanics/adaptive-ai-deception-engine.js`
✅ **IMPLEMENTED** - `Game/Mechanics/tactic-escalation-engine.js`

---

## Investigation Mechanics

### Overview
Digital forensics and evidence analysis system where players investigate suspicious communications, profiles, and digital artifacts.

### Core Components

#### 1. Evidence Database
**Purpose**: Store and categorize evidence items
**Data Structure**:
```javascript
evidence = {
    id: "unique_id",
    type: "email" | "profile" | "message" | "url" | "image",
    character: "maya" | "eli" | "stanley",
    area: 1-6,
    content: "evidence content",
    red_flags: ["flag1", "flag2"],
    analysis_points: 0-100,
    discovered: false,
    analyzed: false
}
```

#### 2. Investigation Tools
**Character-Specific Tools**:

**Maya's Tools**:
- Reverse image search
- Profile verification checker
- Relationship timeline analyzer
- Communication pattern detector

**Eli's Tools**:
- Account history checker
- Trade verification system
- Community reputation scanner
- Link safety analyzer

**Stanley's Tools**:
- Email header analyzer
- Phone number validator
- Website legitimacy checker
- Caller ID verification

#### 3. Analysis System
**Scoring Algorithm**:
```javascript
analysisScore = (
    red_flags_found * 20 +
    correct_tool_usage * 15 +
    time_efficiency_bonus * 10 +
    thoroughness_score * 5
) / total_possible_points * 100
```

**Feedback Tiers**:
- 90-100: Expert Analysis
- 70-89: Good Investigation
- 50-69: Adequate Review
- 0-49: Missed Critical Evidence

### Gameplay Flow

```
1. Player receives suspicious communication
2. Evidence added to investigation board
3. Player selects investigation tool
4. Tool reveals information/red flags
5. Player analyzes findings
6. System scores investigation
7. Trust score adjusted based on findings
8. Story progresses based on outcome
```

### Implementation Status
🔄 **PARTIALLY IMPLEMENTED** - `Game/Mechanics/investigation-engine.js`
🔄 **PARTIALLY IMPLEMENTED** - `Game/Mechanics/character-investigation-tools.js`
🔄 **PARTIALLY IMPLEMENTED** - `Game/Mechanics/evidence-database.js`

---

## Real-Time Decision Mechanics

### Overview
Time-pressured cybersecurity scenarios where players must make quick decisions under stress.

### Core Algorithm: Time Pressure System

```javascript
// Pressure calculation
timePressure = baseTime - (playerSkill * skillReduction)
stressMultiplier = 1 + (sophistication * 0.2)
finalTime = timePressure / stressMultiplier

// Scoring
timeBonus = (timeRemaining / totalTime) * 100
accuracyScore = correctDecisions / totalDecisions * 100
finalScore = (accuracyScore * 0.7) + (timeBonus * 0.3)
```

### Scenario Types

#### 1. Phishing Email Response
**Time Limit**: 30-60 seconds
**Decisions**: Click link, verify sender, delete, report
**Pressure**: Urgent language, authority impersonation

#### 2. Suspicious Message Handling
**Time Limit**: 20-45 seconds
**Decisions**: Respond, ignore, block, verify
**Pressure**: Emotional manipulation, time scarcity

#### 3. Account Security Alert
**Time Limit**: 45-90 seconds
**Decisions**: Follow link, call official number, ignore, verify
**Pressure**: Fear of account loss, urgent action required

### Difficulty Scaling

**Easy Mode**:
- Longer time limits
- Obvious red flags
- Clear correct answers
- Minimal distractions

**Medium Mode**:
- Standard time limits
- Subtle red flags
- Multiple viable options
- Some distractions

**Hard Mode**:
- Shorter time limits
- Hidden red flags
- Ambiguous situations
- High distraction level

### Implementation Status
✅ **IMPLEMENTED** - `Game/Mechanics/real-time-decision-engine.js`
✅ **IMPLEMENTED** - `Game/Mechanics/time-pressure-system.js`
✅ **IMPLEMENTED** - `Game/Mechanics/character-realtime-scenarios.js`

---

## Social Engineering Puzzles

### Overview
Recognition and counter-manipulation puzzles where players identify manipulation tactics and choose appropriate responses.

### Puzzle Types

#### 1. Tactic Identification
**Objective**: Identify which manipulation tactic is being used
**Mechanics**: Multiple choice with explanation
**Scoring**: Correct identification + reasoning quality

#### 2. Red Flag Detection
**Objective**: Find all red flags in a communication
**Mechanics**: Click/highlight suspicious elements
**Scoring**: Percentage of flags found + false positives penalty

#### 3. Response Selection
**Objective**: Choose the safest response to manipulation
**Mechanics**: Branching dialogue with consequences
**Scoring**: Safety of choice + long-term impact

#### 4. Pattern Recognition
**Objective**: Identify escalation patterns across multiple messages
**Mechanics**: Timeline analysis with pattern matching
**Scoring**: Pattern accuracy + speed bonus

### Difficulty Progression

**Level 1 Puzzles**: Single obvious tactic
**Level 2 Puzzles**: Multiple tactics, clear patterns
**Level 3 Puzzles**: Subtle tactics, mixed signals
**Level 4 Puzzles**: Complex multi-stage manipulation
**Level 5 Puzzles**: Perception hacks, reality questioning

### Scoring Algorithm

```javascript
puzzleScore = (
    correct_identifications * 25 +
    red_flags_found * 15 +
    response_safety * 30 +
    time_bonus * 10 +
    explanation_quality * 20
) / 100
```

### Implementation Status
✅ **IMPLEMENTED** - `Game/Mechanics/social-engineering-puzzle-engine.js`
✅ **IMPLEMENTED** - `Game/Mechanics/character-puzzle-scenarios.js`

---

## Gamification Systems

### Achievement System

#### Categories

**1. Security Awareness**
- First Red Flag Detected
- Perfect Investigation
- Manipulation Master (detect all tactics)
- Trust Guardian (maintain high trust)

**2. Character Mastery**
- Maya's Protector
- Eli's Mentor
- Stanley's Guardian
- All Characters Completed

**3. Skill Development**
- Quick Thinker (real-time decisions)
- Digital Detective (investigation)
- Puzzle Solver (social engineering)
- Pattern Recognition Expert

**4. Story Progression**
- Area Completion (1-6 per character)
- Multiple Endings Unlocked
- Secret Paths Discovered
- Perfect Playthrough

### Progression System

#### Experience Points (XP)
```javascript
XP Sources:
- Correct decisions: 10-50 XP
- Red flag detection: 15 XP each
- Puzzle completion: 25-100 XP
- Investigation success: 50-150 XP
- Area completion: 200-500 XP
```

#### Skill Trees

**Investigation Skills**:
- Evidence Analysis +10%
- Tool Efficiency +15%
- Pattern Recognition +20%
- Expert Investigator (unlock advanced tools)

**Decision Making Skills**:
- Time Extension +5 seconds
- Stress Resistance +10%
- Quick Analysis +15%
- Master Responder (unlock instant analysis)

**Awareness Skills**:
- Red Flag Sensitivity +20%
- Tactic Recognition +15%
- Trust Recovery +10%
- Guardian Mode (unlock protective abilities)

### Leaderboard System

**Categories**:
- Highest Trust Score
- Fastest Area Completion
- Most Red Flags Detected
- Perfect Investigations
- Overall Security Score

**Scoring Formula**:
```javascript
overallScore = (
    trust_score * 0.3 +
    investigations_completed * 0.2 +
    red_flags_detected * 0.15 +
    puzzles_solved * 0.15 +
    time_efficiency * 0.1 +
    story_completion * 0.1
) * difficulty_multiplier
```

### Reward System

**Unlockables**:
- Character backstories
- Advanced investigation tools
- Bonus scenarios
- Educational content
- Behind-the-scenes insights

**Cosmetic Rewards**:
- UI themes
- Character avatars
- Badge collections
- Profile customization

### Implementation Status
🔄 **PARTIALLY IMPLEMENTED** - Achievement tracking in story progression
⏳ **PLANNED** - Full gamification system

---

## Integration & Data Flow

### System Communication

```
Player Action
    ↓
Gaming Mechanics Engine
    ↓
┌───────────────┬───────────────┬───────────────┐
│               │               │               │
Trust Engine    AI Engine       Story Tracker
│               │               │
└───────────────┴───────────────┴───────────────┘
    ↓               ↓               ↓
Trust Update    Tactic Selection    Progress Update
    ↓               ↓               ↓
    └───────────────┴───────────────┘
                    ↓
            UI Update & Feedback
                    ↓
            Next Game State
```

### Data Persistence

**Session Data**:
```javascript
session = {
    character: "maya" | "eli" | "stanley",
    area: 1-6,
    trust_score: -100 to 100,
    story_state: {},
    evidence_collected: [],
    decisions_made: [],
    achievements: [],
    xp: 0,
    skills: {}
}
```

**Save System**:
- Auto-save after each decision
- Manual save points at area transitions
- Cloud sync for cross-device play
- Export/import save data

### Performance Optimization

**Lazy Loading**:
- Load mechanics on-demand
- Preload next area assets
- Cache frequently used data

**Memory Management**:
- Unload inactive mechanics
- Clear old session data
- Optimize evidence database queries

---

## Implementation Roadmap

### Phase 1: Core Systems ✅ COMPLETE
- [x] Trust Score Engine
- [x] Adaptive AI Engine
- [x] Gaming Mechanics Engine
- [x] Story Progression Tracker

### Phase 2: Interactive Mechanics 🔄 IN PROGRESS
- [x] Real-Time Decision System
- [x] Social Engineering Puzzles
- [ ] Investigation Mechanics (70% complete)
- [ ] Action Sequences (30% complete)

### Phase 3: Gamification ⏳ PLANNED
- [ ] Achievement System
- [ ] XP & Progression
- [ ] Skill Trees
- [ ] Leaderboards

### Phase 4: Polish & Balance ⏳ PLANNED
- [ ] Difficulty tuning
- [ ] Tutorial system
- [ ] Accessibility features
- [ ] Performance optimization

### Phase 5: Content Expansion ⏳ FUTURE
- [ ] Additional characters
- [ ] Bonus scenarios
- [ ] Multiplayer modes
- [ ] Educational modules

---

## Next Steps

### Immediate Priorities

1. **Complete Investigation Mechanics**
   - Finish evidence database integration
   - Implement all character-specific tools
   - Add scoring and feedback system

2. **Implement Gamification Core**
   - Achievement tracking system
   - XP calculation and progression
   - Basic skill tree structure

3. **Balance & Testing**
   - Tune trust score calculations
   - Test AI escalation patterns
   - Validate difficulty curves

4. **Documentation**
   - API documentation for each system
   - Integration guides
   - Testing procedures

### Long-Term Goals

1. **Advanced AI**
   - Machine learning for tactic selection
   - Player behavior prediction
   - Dynamic difficulty adjustment

2. **Expanded Content**
   - More character storylines
   - Additional manipulation tactics
   - Real-world case studies

3. **Community Features**
   - Shared investigations
   - Competitive modes
   - User-generated scenarios

---

**Document Status**: Living Document  
**Next Review**: After Phase 2 completion  
**Maintainer**: Development Team
