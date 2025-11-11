/**
 * Debug script for narration system
 * Add to console to check status
 */

console.log('🔍 NARRATION SYSTEM DEBUG');
console.log('========================');

// Check if AudioManager class exists
console.log('AudioManager class:', typeof AudioManager !== 'undefined' ? '✅ Loaded' : '❌ Not found');

// Check if audioManager instance exists
console.log('audioManager instance:', typeof window.audioManager !== 'undefined' ? '✅ Exists' : '❌ Not found');

// Check if trust decay exists
console.log('trustDecay:', typeof window.trustDecay !== 'undefined' ? '✅ Exists' : '❌ Not found');

// Check decision counts
console.log('goodDecisionCount:', window.goodDecisionCount || 0);
console.log('riskyChoiceCount:', window.riskyChoiceCount || 0);

// Check current scene
console.log('currentSceneIndex:', window.currentSceneIndex || 0);

// If audioManager exists, test it
if (window.audioManager) {
    console.log('\n📊 Audio Manager Status:');
    console.log('  - Is muted:', window.audioManager.isMuted);
    console.log('  - Is playing:', window.audioManager.isNarrationPlaying);
    console.log('  - Detected path:', window.audioManager.getNarrationPath());
    
    console.log('\n🎙️ Test Commands:');
    console.log('  audioManager.playTransitionNarration(1, 2, "success")');
    console.log('  audioManager.playTransitionNarration(2, 3, "moderate")');
    console.log('  audioManager.playTransitionNarration(3, 4, "failure")');
} else {
    console.log('\n❌ AudioManager not initialized!');
    console.log('Check if audio-manager.js is loaded before eli-scenes-config.js');
}

console.log('========================');
