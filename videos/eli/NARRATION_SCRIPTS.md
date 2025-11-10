# Eli's Thought Bubble Narration Scripts

## Voice Direction
- **Age**: 16-18 years old
- **Tone**: Uncertain, rationalizing, slightly anxious
- **Pace**: Natural, conversational (not rushed)
- **Emotion**: Starts hopeful, becomes increasingly desperate

---

## Scene 1 → Scene 2
**Context**: Eli just started gaming, feeling confident

**Script**:
```
Just one more tournament. I can win this back. 
I know what I'm doing... right?
```

**Duration**: ~5 seconds
**Emotion**: Hopeful but with a hint of doubt
**Delivery**: Confident at first, trailing off with uncertainty

---

## Scene 2 → Scene 3
**Context**: Lost the tournament, trying to justify continuing

**Script**:
```
Okay, so I lost that one. But the next match... 
the next match will be different. I can feel it.
```

**Duration**: ~6 seconds
**Emotion**: Defensive, trying to convince himself
**Delivery**: Slightly faster, more insistent

---

## Scene 3 → Scene 4
**Context**: Just entered credit card info on gambling site

**Script**:
```
They're asking for my card info. That's... normal, right? 
Everyone does this. It's fine. It's totally fine.
```

**Duration**: ~7 seconds
**Emotion**: Nervous, seeking reassurance
**Delivery**: Hesitant, repeating "fine" to convince himself

---

## Scene 4 → Scene 5
**Context**: Getting bombarded with scam messages

**Script**:
```
Why is everyone messaging me? These offers seem too good... 
but what if they're real? What if I'm missing out?
```

**Duration**: ~7 seconds
**Emotion**: Confused, FOMO kicking in
**Delivery**: Questioning, voice rising with anxiety

---

## Scene 5 → Scene 6
**Context**: Debt piling up, can't focus on school

**Script**:
```
I can't focus. The debt's piling up. 
Maybe just one more bet. Just one more...
```

**Duration**: ~6 seconds
**Emotion**: Desperate, defeated
**Delivery**: Tired, almost whispering, trailing off

---

## Scene 6 Endings

### Good Ending (Score 60+)
**Context**: Player made mostly good choices, Eli realizes the danger

**Script**:
```
I almost lost everything. But I stopped. 
I actually stopped. That was close... too close.
```

**Duration**: ~6 seconds
**Emotion**: Relief, realization, gratitude
**Delivery**: Exhale of relief, voice steadying

### Bad Ending (Score <60)
**Context**: Player made bad choices, Eli is in deep trouble

**Script**:
```
How did it get this bad? How did I let this happen? 
I can't... I can't fix this.
```

**Duration**: ~6 seconds
**Emotion**: Despair, panic, regret
**Delivery**: Voice breaking, almost crying

---

## ElevenLabs Generation Guide

### Step 1: Choose Voice
1. Go to ElevenLabs Voice Library
2. Search for young male voices
3. Test these voices:
   - **Adam** (young, clear)
   - **Antoni** (warm, relatable)
   - **Josh** (casual, authentic)
4. Pick the one that sounds most like a teenage gamer

### Step 2: Settings
```
Stability: 0.50
Similarity: 0.75
Style: 0.00
Use Speaker Boost: ON
```

### Step 3: Generate
1. Copy Scene 1→2 script
2. Click "Generate"
3. Listen and approve
4. Download as MP3
5. **SAVE THE VOICE ID** (critical for consistency)
6. Repeat for all 7 narrations using SAME voice

### Step 4: File Naming
```
scene_1_narration.mp3  (After Scene 1)
scene_2_narration.mp3  (After Scene 2)
scene_3_narration.mp3  (After Scene 3)
scene_4_narration.mp3  (After Scene 4)
scene_5_narration.mp3  (After Scene 5)
scene_6_narration_good.mp3  (Good ending)
scene_6_narration_bad.mp3   (Bad ending)
```

---

## Alternative: Google Cloud TTS

### API Call Example
```python
from google.cloud import texttospeech

client = texttospeech.TextToSpeechClient()

voice = texttospeech.VoiceSelectionParams(
    language_code="en-US",
    name="en-US-Neural2-J",  # Young male voice
    ssml_gender=texttospeech.SsmlGender.MALE
)

audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3,
    speaking_rate=1.0,
    pitch=0.0
)

# For each script
input_text = texttospeech.SynthesisInput(text="Your script here")
response = client.synthesize_speech(
    input=input_text,
    voice=voice,
    audio_config=audio_config
)

with open("scene_1_narration.mp3", "wb") as out:
    out.write(response.audio_content)
```

---

## Post-Processing (Optional)

### Using Audacity (Free)
1. Import MP3
2. **Normalize**: Effect → Normalize (-3.0 dB)
3. **Trim Silence**: Effect → Truncate Silence
4. **Fade In/Out**: Effect → Fade In (0.5s), Fade Out (0.5s)
5. Export as MP3 (128 kbps)

### Batch Processing
If you have multiple files:
1. Use Audacity's Macro feature
2. Apply same effects to all files
3. Ensures consistent quality

---

## Testing Checklist

- [ ] All 7 narrations use same voice
- [ ] Volume levels are consistent
- [ ] No clipping or distortion
- [ ] Timing feels natural (not rushed)
- [ ] Emotional delivery matches context
- [ ] Files are properly named
- [ ] Total file size < 2MB

---

## Timing Integration

### In eli-scenes-config.js
```javascript
function transitionToNextScene() {
    // Video ends
    video.pause();
    
    // Play narration
    audioManager.playNarration(currentSceneIndex + 1);
    
    // Show "Eli's Thoughts" overlay
    showThoughtBubble();
    
    // Wait for narration to end
    audioManager.onNarrationEnd = () => {
        hideThoughtBubble();
        loadNextScene();
    };
}
```

---

## Budget Breakdown

### ElevenLabs (Recommended)
- **Starter Plan**: $5/month
- **Characters**: 10,000/month
- **Estimated Usage**: ~500 characters total
- **Cost**: $5 one-time (cancel after)

### Google Cloud TTS (Free Tier)
- **Free**: 1M characters/month
- **Quality**: Good but less natural
- **Cost**: $0

---

## Production Timeline

1. **Day 1**: Write and review scripts (1 hour)
2. **Day 1**: Set up ElevenLabs account (15 min)
3. **Day 1**: Generate test narration (30 min)
4. **Day 1**: Review and approve voice (15 min)
5. **Day 2**: Generate all 7 narrations (1 hour)
6. **Day 2**: Post-process if needed (1 hour)
7. **Day 2**: Integrate with game (2 hours)
8. **Day 3**: Test and polish (1 hour)

**Total**: ~7 hours over 3 days

---

## Tips for Natural Delivery

1. **Add pauses**: Use commas and ellipses (...) for natural breaks
2. **Emphasis**: CAPITALIZE words you want stressed
3. **Questions**: End with "?" for rising intonation
4. **Emotion**: Add stage directions in brackets [nervous], [relieved]
5. **Test**: Read scripts aloud before generating

---

## Example with Emphasis

**Original**:
```
I can't focus. The debt's piling up.
```

**With Emphasis**:
```
I can't FOCUS. The debt's... piling up.
```

**Result**: More emotional, natural delivery

---

## Summary

These 7 short narrations (5-7 seconds each) will add significant emotional depth to Eli's story. Using consistent TTS settings ensures the voice sounds the same across all scenes, creating a cohesive experience. Total production time: ~7 hours. Total cost: $5 (or free with Google TTS).
