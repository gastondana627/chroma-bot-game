# Implementation Plan

- [x] 1. Enhance Audio Manager with verification and testing methods
  - Add `verifyNarrationFiles()` method to check all 18 audio files exist
  - Add `checkFileExists()` helper for individual file verification
  - Add `getNarrationStatus()` method for debugging current audio state
  - Add `pauseNarration()` and `resumeNarration()` methods for game pause integration
  - Update error handling to log detailed information with context
  - _Requirements: 1.3, 1.4, 4.1, 4.2, 4.4, 6.2, 6.4, 7.3, 7.4_

- [x] 2. Create testing interface for audio system verification
  - Create `test-audio-pacing.html` with test controls for all narration paths
  - Create `test-audio-pacing.js` with test functions for path calculation
  - Add buttons to test each scene transition (3→4, 4→5, 5→6)
  - Add buttons to test each ending narration (success, moderate, failure)
  - Add file verification tool to check all audio files exist
  - Add status display showing current audio state and narration path
  - Style interface with terminal/surveillance aesthetic
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x] 3. Implement ChromaBot corruption sequence with heartbeat sync
  - Create `chromabot-corruption-sequence.js` class file
  - Implement `startCorruptionSequence()` method with full audio-visual flow
  - Implement `startHeartbeatFlicker()` with configurable interval
  - Implement `flickerChromaBot()` for single pulse effect
  - Implement `accelerateHeartbeat()` with smooth 60→120 BPM transition
  - Implement `stopHeartbeat()` for abrupt ending
  - Implement `completeCorruption()` to trigger final animation
  - Add timing coordination between audio and visual effects
  - _Requirements: 2.5, 3.1, 3.2, 7.1, 7.2_

- [x] 4. Add CSS corruption pulse animations
  - Add `.corruption-pulse` animation to `css/chromabot-corruption.css`
  - Create heartbeat pulse effect with scale and glow
  - Add `.accelerating` class for rapid flicker effect
  - Ensure animations sync with audio timing (100ms pulse duration)
  - Test animation performance across browsers
  - _Requirements: 2.5, 3.1_

- [x] 5. Integrate heartbeat corruption into decision handler
  - Update `makeChoice()` function in `eli-scenes-config.js`
  - Add conditional check for `chromaBotCorruptionSequence` availability
  - Trigger new sequence for bad decisions when available
  - Maintain fallback to existing `pendingCorruption` behavior
  - Add feature flag support for gradual rollout
  - Test both enhanced and fallback modes
  - _Requirements: 2.1, 2.5, 4.1, 4.4_

- [x] 6. Add heartbeat audio playback to Audio Manager
  - Add `playHeartbeatCorruption()` method to `audio-manager.js`
  - Configure heartbeat to use SFX channel at 0.4 volume
  - Add path resolution for `audio/corruption/heartbeat_corruption.mp3`
  - Implement error handling for missing heartbeat file
  - Test audio layering with narration and other sounds
  - _Requirements: 1.1, 1.5, 4.1, 7.1, 7.2_

- [x] 7. Optimize scene transition timing and narration flow
  - Review and adjust post-decision delay (currently 4000ms)
  - Review and adjust post-narration delay (currently 1000ms)
  - Ensure narration plays before scene loads (not after)
  - Add timeout protection (6 seconds max) for narration
  - Test timing feels natural across all transitions
  - Verify no rushed or dragging moments
  - _Requirements: 1.1, 1.2, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 8. Implement narration path calculation verification
  - Verify success path triggers correctly (score ≥70, good > risky)
  - Verify failure path triggers correctly (score <40 OR risky ≥ good+2)
  - Verify moderate path triggers for all other cases
  - Test edge cases (equal choices, boundary scores)
  - Add logging to show path calculation reasoning
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 6.3, 6.4_

- [x] 9. Add narration integration to scene transitions
  - Verify Scene 3→4 post-decision narration works correctly
  - Verify Scene 4→5 transition narration works correctly
  - Verify Scene 5→6 transition narration works correctly
  - Ensure narration callback triggers scene advancement
  - Test fallback behavior when audio fails
  - Verify timing coordination with video playback
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.5, 3.3_

- [x] 10. Implement ending narration system
  - Add ending narration trigger after Scene 6 completion
  - Implement path-based ending selection (success/moderate/failure)
  - Coordinate ending narration with completion screen display
  - Add 500ms delay after narration before showing completion screen
  - Test all three ending paths
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 11. Add comprehensive error handling and logging
  - Implement `logAudioError()` function with context and details
  - Add try-catch blocks around all audio playback
  - Ensure callbacks fire even when audio fails
  - Add console warnings for missing files with file paths
  - Test graceful degradation when audio system unavailable
  - Verify game never blocks on audio errors
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 12. Integrate audio with pause menu system
  - Connect Audio Manager pause/resume to game pause events
  - Ensure narration pauses when player pauses game
  - Ensure narration resumes from correct position
  - Test pause during heartbeat corruption sequence
  - Verify mute toggle affects all audio channels
  - _Requirements: 7.3, 7.4, 7.5_

- [ ]* 13. Create audio production guide and generate files
  - Document voice direction for TTS narration (neutral, clinical tone)
  - Document heartbeat audio specifications (60→120 BPM acceleration)
  - Generate or source all 18 narration files (3-5 seconds each)
  - Generate heartbeat corruption audio file (7-8 seconds)
  - Normalize all audio to -3dB
  - Apply 0.3s fade in/out to all files
  - Compress to MP3 128kbps
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 14. Perform comprehensive audio system testing
  - Test all three narration paths end-to-end (success, moderate, failure)
  - Test each scene transition with all path variations
  - Test all three ending narrations
  - Verify audio file loading across localhost and production
  - Test audio layering (narration + heartbeat + ambience + SFX)
  - Test error scenarios (missing files, network errors)
  - Verify timing feels natural and not rushed
  - Test pause/resume functionality
  - Test mute functionality
  - Measure performance impact (CPU, memory, load times)
  - _Requirements: All requirements_

- [ ]* 15. Create deployment checklist and documentation
  - Document audio file directory structure
  - Create production deployment checklist
  - Document path resolution for different environments
  - Create troubleshooting guide for common audio issues
  - Document feature flags and rollout strategy
  - Create user-facing audio settings documentation
  - _Requirements: 4.3, 4.5_
