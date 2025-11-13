# Narration Audio Files - Eli's Story

## Folder Structure

This folder contains 18 narration audio files for Eli's story:
- 15 transition narrations (5 transitions × 3 paths)
- 3 ending narrations (success/moderate/failure)

## File Naming Convention

### Transition Narrations (Scene X → Scene Y)
```
scene_[FROM]_to_[TO]_[PATH].mp3

Examples:
- scene_1_to_2_success.mp3
- scene_1_to_2_moderate.mp3
- scene_1_to_2_failure.mp3
```
 
### Ending Narrations
```
ending_[TYPE].mp3

Examples:
- ending_success.mp3
- ending_moderate.mp3
- ending_failure.mp3
```

## Complete File List (18 files)

### Transitions: Scene 1 → 2
- [ ] `scene_1_to_2_success.mp3` - "He's learning to recognize the patterns."
- [ ] `scene_1_to_2_moderate.mp3` - "The line between gaming and gambling blurs."
- [ ] `scene_1_to_2_failure.mp3` - "The hook is set. He doesn't see it yet."

### Transitions: Scene 2 → 3
- [ ] `scene_2_to_3_success.mp3` - "Caution keeps him grounded. For now."
- [ ] `scene_2_to_3_moderate.mp3` - "Each loss whispers promises of the next win."
- [ ] `scene_2_to_3_failure.mp3` - "Desperation makes him easy prey."

### Transitions: Scene 3 → 4
- [ ] `scene_3_to_4_success.mp3` - "He sees the trap and steps back."
- [ ] `scene_3_to_4_moderate.mp3` - "One foot in, one foot out. The worst place to be."
- [ ] `scene_3_to_4_failure.mp3` - "The data bleeds. His identity, exposed."

### Transitions: Scene 4 → 5
- [ ] `scene_4_to_5_success.mp3` - "He's built walls. They hold."
- [ ] `scene_4_to_5_moderate.mp3` - "The messages multiply. His resolve weakens."
- [ ] `scene_4_to_5_failure.mp3` - "They smell blood in the water."

### Transitions: Scene 5 → 6
- [ ] `scene_5_to_6_success.mp3` - "He chose awareness over addiction."
- [ ] `scene_5_to_6_moderate.mp3` - "Scarred, but standing. Barely."
- [ ] `scene_5_to_6_failure.mp3` - "The debt collector always wins."

### Endings
- [ ] `ending_success.mp3` - "Subject Eli: Assessment complete. Status: Protected."
- [ ] `ending_moderate.mp3` - "Subject Eli: Assessment complete. Status: Vulnerable."
- [ ] `ending_failure.mp3` - "Subject Eli: Assessment complete. Status: Compromised."

## Audio Specifications

### Technical Requirements
- **Format**: MP3
- **Duration**: 3-5 seconds each
- **Bitrate**: 128 kbps (recommended)
- **Sample Rate**: 44.1 kHz
- **Channels**: Mono or Stereo

### Voice Characteristics
- **Voice Type**: Neutral/Male narrator (clinical observer)
- **Age**: 30-40 (authoritative)
- **Tone**: Detached, observational, slightly ominous
- **Pace**: Measured, deliberate (not rushed)
- **Emotion**: Minimal - like reading a case file

### Post-Processing
- Normalize to -3.0 dB
- Trim silence at start/end
- Add 0.3s fade in/out
- No background music or effects

## Generation Guide

### Using ElevenLabs (Recommended)
1. Voice: "Callum" or "Antoni"
2. Settings:
   - Stability: 0.70
   - Similarity: 0.80
   - Style: 0.20
   - Speaker Boost: ON
3. Generate all 18 files in ONE session for consistency

### Using Google Cloud TTS (Free Alternative)
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

## Integration

These files are loaded by `audio-manager.js` and played during scene transitions.

**Timing**: Narration plays BEFORE each scene starts (after previous scene ends)

**Flow**:
```
Scene 1 ends → 
Narration plays (3-5 sec) → 
Scene 2 briefing appears → 
User clicks continue → 
Scene 2 starts
```

## Testing Checklist

After generating files:
- [ ] All 18 files present and named correctly
- [ ] Each file is 3-5 seconds long
- [ ] Volume levels are consistent across all files
- [ ] No clipping or distortion
- [ ] Voice sounds the same in all files
- [ ] Fade in/out is smooth
- [ ] Files play correctly in game

## File Size

Expected total size: ~500KB - 1MB for all 18 files

## Notes

- Generate all files in ONE session to ensure voice consistency
- Save your TTS settings/voice ID for future use
- Keep raw/unprocessed versions as backup
- Test in-game before finalizing

---

For complete narration scripts and implementation details, see:
`videos/eli/NARRATION_ARC_GUIDE.md`
