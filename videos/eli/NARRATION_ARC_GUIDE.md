# Narration Arc System - 3 Story Paths

## Overview
Simple 1-liner narration prompts (3-5 seconds each) that adapt based on player choices. Three distinct emotional arcs:
- **Success Path**: Cautious → Aware → Empowered
- **Moderate Path**: Uncertain → Struggling → Surviving  
- **Failure Path**: Confident → Desperate → Broken

## How It Works
- Narration plays BETWEEN scenes (during transitions)
- Narrator voice is neutral, observational (not Eli's thoughts)
- Path determined by trust score and decision history
- Audio files are 3-5 seconds max - quick, punchy, atmospheric

---

## Scene Transitions & Narration

**TIMING STRATEGY**: Play narration BEFORE each scene starts (not after)
- Creates anticipation and sets emotional tone
- Gives player breathing room between scenes
- Feels more intentional and cinematic
- Avoids awkward pauses after video ends

**Flow**: Scene 1 ends → Narration plays (3-5 sec) → Scene 2 briefing → User clicks continue → Scene 2 starts

---

### Scene 1 → Scene 2
**Timing**: BEFORE Scene 2 loads (after Scene 1 ends)  
**Context**: First tournament, initial choices made

#### Success Path (Good choices in Scene 1)
```
"He's learning to recognize the patterns."
```
**Tone**: Observational, hint of approval  
**Duration**: 3 seconds

#### Moderate Path (Mixed choices)
```
"The line between gaming and gambling blurs."
```
**Tone**: Neutral, ominous undertone  
**Duration**: 3 seconds

#### Failure Path (Risky choices in Scene 1)
```
"The hook is set. He doesn't see it yet."
```
**Tone**: Dark, foreboding  
**Duration**: 3 seconds

---

### Scene 2 → Scene 3
**Timing**: After Scene 2 video ends, before Scene 3 loads  
**Context**: Tournament results, escalation begins

#### Success Path
```
"Caution keeps him grounded. For now."
```
**Tone**: Measured, watchful  
**Duration**: 3 seconds

#### Moderate Path
```
"Each loss whispers promises of the next win."
```
**Tone**: Seductive, dangerous  
**Duration**: 4 seconds

#### Failure Path
```
"Desperation makes him easy prey."
```
**Tone**: Cold, clinical  
**Duration**: 3 seconds

---

### Scene 3 → Scene 4
**Timing**: After Scene 3 video ends, before Scene 4 loads  
**Context**: Credit card decision made, point of no return

#### Success Path
```
"He sees the trap and steps back."
```
**Tone**: Relief, wisdom  
**Duration**: 3 seconds

#### Moderate Path
```
"One foot in, one foot out. The worst place to be."
```
**Tone**: Tense, uncertain  
**Duration**: 4 seconds

#### Failure Path
```
"The data bleeds. His identity, exposed."
```
**Tone**: Ominous, inevitable  
**Duration**: 4 seconds

---

### Scene 4 → Scene 5
**Timing**: After Scene 4 video ends, before Scene 5 loads  
**Context**: Scam messages flooding in, consequences mounting

#### Success Path
```
"He's built walls. They hold."
```
**Tone**: Strong, protective  
**Duration**: 3 seconds

#### Moderate Path
```
"The messages multiply. His resolve weakens."
```
**Tone**: Pressure building  
**Duration**: 4 seconds

#### Failure Path
```
"They smell blood in the water."
```
**Tone**: Predatory, dark  
**Duration**: 3 seconds

---

### Scene 5 → Scene 6
**Timing**: After Scene 5 video ends, before Scene 6 loads  
**Context**: Final consequences, approaching ending

#### Success Path
```
"He chose awareness over addiction."
```
**Tone**: Proud, earned  
**Duration**: 3 seconds

#### Moderate Path
```
"Scarred, but standing. Barely."
```
**Tone**: Exhausted relief  
**Duration**: 3 seconds

#### Failure Path
```
"The debt collector always wins."
```
**Tone**: Final, crushing  
**Duration**: 3 seconds

---

## Final Endings (After Scene 6)

### Success Ending (Trust Score 70+, mostly good choices)
```
"Subject Eli: Assessment complete. Status: Protected."
```
**Tone**: Official, satisfied  
**Duration**: 4 seconds  
**Visual**: Green "PROTECTED" stamp

### Moderate Ending (Trust Score 40-69, mixed choices)
```
"Subject Eli: Assessment complete. Status: Vulnerable."
```
**Tone**: Clinical, concerned  
**Duration**: 4 seconds  
**Visual**: Yellow "VULNERABLE" stamp

### Failure Ending (Trust Score <40, mostly bad choices)
```
"Subject Eli: Assessment complete. Status: Compromised."
```
**Tone**: Cold, final  
**Duration**: 4 seconds  
**Visual**: Red "COMPROMISED" stamp

---

## Implementation

### File Naming Convention
```
audio/narration/
├── scene_1_to_2_success.mp3
├── scene_1_to_2_moderate.mp3
├── scene_1_to_2_failure.mp3
├── scene_2_to_3_success.mp3
├── scene_2_to_3_moderate.mp3
├── scene_2_to_3_failure.mp3
├── scene_3_to_4_success.mp3
├── scene_3_to_4_moderate.mp3
├── scene_3_to_4_failure.mp3
├── scene_4_to_5_success.mp3
├── scene_4_to_5_moderate.mp3
├── scene_4_to_5_failure.mp3
├── scene_5_to_6_success.mp3
├── scene_5_to_6_moderate.mp3
├── scene_5_to_6_failure.mp3
├── ending_success.mp3
├── ending_moderate.mp3
└── ending_failure.mp3
```

**Total Files**: 18 narrations (5 transitions × 3 paths + 3 endings)

### Path Detection Logic
```javascript
function getNarrationPath() {
    const score = window.trustDecay.getScore();
    const goodChoices = window.goodDecisionCount;
    const riskyChoices = window.riskyChoiceCount;
    
    // Success path: High score + more good than risky
    if (score >= 70 && goodChoices > riskyChoices) {
        return 'success';
    }
    
    // Failure path: Low score OR significantly more risky choices
    if (score < 40 || riskyChoices >= goodChoices + 2) {
        return 'failure';
    }
    
    // Moderate path: Everything else
    return 'moderate';
}

function playTransitionNarration(fromScene, toScene) {
    const path = getNarrationPath();
    const fileName = `scene_${fromScene}_to_${toScene}_${path}.mp3`;
    
    if (window.audioManager) {
        window.audioManager.playNarration(fileName);
    }
}
```

### Integration Points
Add to `eli-scenes-config.js` in the `loadScene()` function:

```javascript
// After scene briefing is dismissed, before video loads
if (index > 0) {
    playTransitionNarration(index, index + 1);
}
```

---

## Voice Direction for TTS

### Narrator Voice Characteristics
- **Gender**: Neutral/Male (clinical observer)
- **Age**: 30-40 (authoritative but not old)
- **Tone**: Detached, observational, slightly ominous
- **Pace**: Measured, deliberate (not rushed)
- **Emotion**: Minimal - like reading a case file

### ElevenLabs Settings
```
Voice: "Callum" or "Antoni" (deep, measured)
Stability: 0.70 (consistent delivery)
Similarity: 0.80 (clear articulation)
Style: 0.20 (minimal emotion)
Speaker Boost: ON
```

### Alternative: Google Cloud TTS
```python
voice = texttospeech.VoiceSelectionParams(
    language_code="en-US",
    name="en-US-Neural2-D",  # Deep male voice
    ssml_gender=texttospeech.SsmlGender.MALE
)

audio_config = texttospeech.AudioConfig(
    speaking_rate=0.95,  # Slightly slower
    pitch=-2.0,  # Slightly deeper
    audio_encoding=texttospeech.AudioEncoding.MP3
)
```

---

## Production Checklist

### Phase 1: Script Review (15 min)
- [ ] Read all 18 scripts aloud
- [ ] Confirm 3-5 second timing
- [ ] Adjust wording if needed

### Phase 2: Voice Setup (30 min)
- [ ] Choose TTS service (ElevenLabs recommended)
- [ ] Test 3 sample narrations (one per path)
- [ ] Lock in voice settings

### Phase 3: Generation (1 hour)
- [ ] Generate all 18 narrations in one session
- [ ] Use SAME voice and settings for consistency
- [ ] Name files according to convention

### Phase 4: Post-Processing (30 min)
- [ ] Normalize volume levels (-3dB)
- [ ] Trim silence at start/end
- [ ] Add 0.3s fade in/out
- [ ] Verify all files are 3-5 seconds

### Phase 5: Integration (1 hour)
- [ ] Add narration logic to eli-scenes-config.js
- [ ] Test all 3 paths
- [ ] Verify timing feels natural
- [ ] Adjust delays if needed

**Total Time**: ~3 hours

---

## Testing Strategy

### Test Path 1: Success
1. Make all safe choices
2. Listen for success narrations
3. Verify ending: "Status: Protected"

### Test Path 2: Moderate
1. Mix safe and risky choices evenly
2. Listen for moderate narrations
3. Verify ending: "Status: Vulnerable"

### Test Path 3: Failure
1. Make all risky choices
2. Listen for failure narrations
3. Verify ending: "Status: Compromised"

---

## Budget

### ElevenLabs (Recommended)
- **Plan**: Starter ($5/month)
- **Characters**: ~1,000 total (well under 10k limit)
- **Cost**: $5 one-time (cancel after)

### Google Cloud TTS (Free)
- **Free Tier**: 1M characters/month
- **Quality**: Good but less natural
- **Cost**: $0

---

## Why This Works

1. **Short & Punchy**: 3-5 seconds doesn't drag, maintains pace
2. **Atmospheric**: Adds tension without overwhelming
3. **Adaptive**: Player feels their choices matter
4. **Minimal**: Doesn't compete with video content
5. **Professional**: Narrator voice adds "assessment" feel

---

## Quick Reference

| Transition | Success | Moderate | Failure |
|------------|---------|----------|---------|
| 1→2 | Learning patterns | Line blurs | Hook is set |
| 2→3 | Caution grounds | Promises whisper | Easy prey |
| 3→4 | Sees trap | One foot in/out | Data bleeds |
| 4→5 | Walls hold | Resolve weakens | Blood in water |
| 5→6 | Chose awareness | Scarred, standing | Debt collector wins |
| **Ending** | **Protected** | **Vulnerable** | **Compromised** |

---

## Next Steps

1. Review scripts with team
2. Generate 3 sample narrations (one per path)
3. Test timing in actual game flow
4. Adjust if needed
5. Generate remaining 15 narrations
6. Integrate and deploy

**Ready to generate audio? Start with Scene 1→2 (all 3 paths) as proof of concept.**
