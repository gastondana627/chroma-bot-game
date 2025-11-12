# Corruption Audio Files

This directory contains audio files for the corruption sequence effects.

## Files

### heartbeat_corruption.mp3
**Purpose:** Audio for the heartbeat corruption sequence that plays during bad decisions

**Specifications:**
- **Duration:** 7-8 seconds
- **Format:** MP3, 128kbps, mono
- **Start:** 60 BPM (1 beat per second) - slow, ominous
- **Transition:** Accelerates to 120 BPM over 2 seconds
- **End:** Abrupt stop (creates jarring effect)
- **Volume:** 0.4 (subtle but present)

**Usage:**
- Triggered by `audioManager.playHeartbeatCorruption()`
- Plays on SFX channel
- Layers with narration and other sounds
- Syncs with ChromaBot flicker animation

**Audio Characteristics:**
- Deep, resonant heartbeat sound
- Ominous, dread-building atmosphere
- Smooth acceleration curve
- Clean abrupt ending (no fade)

**Production Notes:**
- Normalize to -3dB
- No fade in/out (raw start and stop)
- Ensure clean loop points for each beat
- Test layering with narration at 0.85 volume

## Integration

The heartbeat audio is part of the corruption sequence system:

1. **Bad Decision Made** → Heartbeat starts (60 BPM)
2. **ChromaBot Flickers** → Synced to heartbeat pulse
3. **Narration Plays** → Layers over heartbeat
4. **Heartbeat Accelerates** → 60→120 BPM over 2 seconds
5. **Heartbeat Stops** → Abrupt ending
6. **Corruption Complete** → Final animation triggers

## Testing

Use `test-heartbeat-audio.html` to verify:
- Basic playback functionality
- Audio layering with narration
- Volume levels (0.4)
- Error handling for missing file
- Mute functionality

## File Status

✅ **File Available**

The heartbeat_corruption.mp3 file has been generated and placed in this directory.

**File Properties:**
- Duration: ~3 seconds
- Format: MP3, 128kbps, mono
- Size: 48KB
- Normalized audio levels

**Next Steps:**
1. Test using `test-heartbeat-audio.html`
2. Verify audio layering with narration
3. Confirm volume level (0.4) is appropriate
4. Test in full corruption sequence

## Related Files

- `videos/eli/audio-manager.js` - Audio playback system
- `videos/eli/chromabot-corruption-sequence.js` - Visual sync system
- `css/chromabot-corruption.css` - Corruption pulse animations
- `videos/eli/test-heartbeat-audio.html` - Testing interface
