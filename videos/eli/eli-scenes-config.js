/**
 * CUSTOMIZE THIS FILE TO MATCH YOUR VIDEOS
 * 
 * For each scene, specify:
 * - videoFile: path to your video
 * - pauseAt: when to show decision (in seconds)
 * - question: what to ask the player
 * - choices: array of options with trust deltas
 */

// Sound effect helper
function playSound(path, volume = 0.5) {
    try {
        const audio = new Audio(path);
        audio.volume = volume;
        audio.play().catch(err => console.log('Audio play blocked:', err.message));
    } catch (err) {
        console.warn('Could not play sound:', path, err.message);
    }
}

const SCENES_CONFIG = [
    {
        videoFile: 'area-1-gaming-setup/Scene_1_Eli_sitting_at_his_g.mp4',
        pauseAt: 15,  // Pause at 15 seconds
        question: 'What should Eli do?',  // Customize this to match your video
        choices: [
            {
                text: 'Make the safe choice',  // Customize
                trustDelta: +10,
                feedback: 'Good decision!',
                type: 'safe'
            },
            {
                text: 'Take the risk',  // Customize
                trustDelta: -15,
                feedback: 'That was risky...',
                type: 'risky'
            }
        ]
    },
    {
        videoFile: 'area-2-tournament-arena/Scene_2_Continuation_from_la.mp4',
        pauseAt: 15,
        question: 'What should Eli do next?',
        choices: [
            {
                text: 'Be cautious',
                trustDelta: +12,
                feedback: 'Smart thinking!',
                type: 'safe'
            },
            {
                text: 'Go for it',
                trustDelta: -20,
                feedback: 'That could backfire...',
                type: 'risky'
            }
        ]
    },
    {
        videoFile: 'area-3-gambling-platform/Scene_3_Eli_s_eyes_glance_at.mp4',
        pauseAt: null,  // Don't pause during video - show decision AFTER scene ends
        showDecisionAfterEnd: true,  // ✅ Show horror overlay after video completes
        decisionDelay: 3000,  // Wait 3 seconds after video ends before showing decision
        useHorrorOverlay: true,  // ✅ ENABLED - Horror overlay for gambling scene
        question: 'The platform asks for Eli\'s credit card to "verify age".',
        choices: [
            {
                text: 'REFUSE AND EXIT',
                description: 'This is a red flag - leave immediately',
                trustDelta: +20,
                feedback: 'Excellent choice! You recognized the scam.',
                type: 'safe',
                safetyLevel: 'HIGH'
            },
            {
                text: 'USE PREPAID CARD',
                description: 'Limit exposure with limited funds',
                trustDelta: -10,
                feedback: 'Still risky - you\'re giving payment info...',
                type: 'neutral',
                safetyLevel: 'UNCERTAIN'
            },
            {
                text: 'PROVIDE REAL CARD',
                description: 'Trust the site with full access',
                trustDelta: -25,
                feedback: 'CRITICAL: Full financial access granted!',
                type: 'risky',
                safetyLevel: 'CRITICAL'
            }
        ]
    },
    {
        videoFile: 'area-4-gaming-community/Scene_4_Camera_angle_shifts_.mp4',
        pauseAt: 15,
        question: 'How should Eli respond?',
        choices: [
            {
                text: 'Seek help',
                trustDelta: +25,
                feedback: 'Asking for help is strength!',
                type: 'safe'
            },
            {
                text: 'Ignore the warning signs',
                trustDelta: -25,
                feedback: 'Ignoring problems makes them worse...',
                type: 'risky'
            }
        ]
    },
    {
        videoFile: 'area-6-championship-victory/Scene_5_Eli_s_friends_appear.mp4',
        pauseAt: 15,
        question: 'What path should Eli take?',
        choices: [
            {
                text: 'Face the consequences',
                trustDelta: +20,
                feedback: 'Taking responsibility shows maturity!',
                type: 'safe'
            },
            {
                text: 'Try to avoid it',
                trustDelta: -30,
                feedback: 'Avoidance only delays the inevitable...',
                type: 'risky'
            }
        ]
    },
    {
        videoFile: 'area-5-school-campus/Scene_6_Eli_sits_back_in_cha.mp4',
        pauseAt: 15,
        question: 'Final choice - what will Eli do?',
        choices: [
            {
                text: 'Commit to change',
                trustDelta: +18,
                feedback: 'Growth and redemption!',
                type: 'safe'
            },
            {
                text: 'Fall back into old habits',
                trustDelta: -10,
                feedback: 'The cycle continues...',
                type: 'risky'
            }
        ]
    }
];

// ============================================
// SYSTEM CODE - DON'T EDIT BELOW THIS LINE
// ============================================

// Make currentSceneIndex global so pause menu can access it
window.currentSceneIndex = 0;
let trustScore = 100;
let integration = null;
let decisionMade = false;

// Flag to prevent dashboard from opening during decision overlays
window.showingDecisionOverlay = false;

// Decision tracking for dashboard
window.decisionHistory = [];
window.goodDecisionCount = 0;
window.riskyChoiceCount = 0;

// Initialize systems
let chromaBotVideo = null;
let chromaBotAnimator = null;
let chromaBotCorruptor = null;
let pauseMenu = null;
// Make trustDecay global so pause menu can access it
window.trustDecay = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Trust Decay System
    window.trustDecay = new TrustDecaySystem({
        onScoreUpdate: (score, status) => {
            console.log('📊 Trust score updated:', score, status.message);
            updateTrustDisplay();
            // Update trust display color based on status
            const trustValueEl = document.getElementById('trust-value');
            if (trustValueEl) {
                trustValueEl.style.color = status.color;
            }
        },
        onWarning: (score) => {
            console.log('⚠️ WARNING threshold reached:', score);
            showWarningAlert('⚠️ WARNING: Trust score entering dangerous territory');
        },
        onCritical: (score) => {
            console.log('🔴 CRITICAL threshold reached:', score);
            showWarningAlert('🔴 CRITICAL: Subject highly vulnerable - failure imminent');
        },
        onFailure: (score) => {
            console.log('💀 FAILURE threshold reached:', score);
            triggerBadEnding();
        }
    });
    
    console.log('✅ Trust Decay System initialized. Starting score:', window.trustDecay.getScore());
    
    // Initialize ChromaBot Video Integration
    chromaBotVideo = new ChromaBotVideoIntegration();
    
    // Initialize ChromaBot Corruption Animator (for broken image effects)
    if (typeof ChromaBotCorruptionAnimator !== 'undefined') {
        chromaBotAnimator = new ChromaBotCorruptionAnimator('chromabot-indicator');
        window.chromaBotAnimator = chromaBotAnimator; // Make globally accessible for pause/resume
        console.log('✅ ChromaBot Corruption Animator initialized');
    } else {
        console.warn('⚠️ ChromaBotCorruptionAnimator not found');
    }
    
    // Initialize ChromaBot Response Corruptor (for text corruption)
    if (typeof ChromaBotResponseCorruptor !== 'undefined') {
        chromaBotCorruptor = new ChromaBotResponseCorruptor();
        window.chromaBotCorruptor = chromaBotCorruptor; // Make globally accessible
        console.log('✅ ChromaBot Response Corruptor initialized');
    } else {
        console.warn('⚠️ ChromaBotResponseCorruptor not found');
    }
    
    // Initialize Pause Menu (will be created after video loads)
    const video = document.getElementById('story-video');
    pauseMenu = new PauseMenuSystem(video);
    
    // Make pause menu globally accessible for state management
    window.pauseMenuSystem = pauseMenu;
    
    // Initialize Horror Decision Overlay System (if available)
    if (typeof ChromaBotCorruptionAnimator !== 'undefined' && typeof HorrorDecisionOverlay !== 'undefined') {
        // Use existing animator, don't create a new one
        window.horrorDecisionOverlay = new HorrorDecisionOverlay({
            chromaBotAnimator: window.chromaBotAnimator,
            onChoice: handleHorrorDecisionChoice
        });
        console.log('✅ Horror Decision Overlay System initialized');
    } else {
        console.warn('⚠️ Horror Decision Overlay not available - using basic overlay');
        // DON'T set chromaBotAnimator to null - it's already initialized above!
        window.horrorDecisionOverlay = null;
    }
    
    // Initialize systems - SIMPLIFIED (bypass horror engine for now)
    try {
        integration = new HorrorVideoIntegration({
            character: 'eli',
            debugMode: true
        });
        
        // Listen for trust updates
        window.addEventListener('trustScoreUpdated', (event) => {
            trustScore = event.detail.newScore;
            updateTrustDisplay();
        });
    } catch (error) {
        console.warn('Horror integration failed, continuing without it:', error);
        // Create minimal fallback
        integration = {
            trustEngine: new BayesianTrustEngine(),
            _updateTrustScore: function(decision, choice, outcome) {
                trustScore += outcome.trustDelta;
                updateTrustDisplay();
            },
            _triggerHorrorEffect: function() {},
            _triggerReliefEffect: function() {}
        };
    }
    
    // Update UI
    document.getElementById('total-scenes').textContent = SCENES_CONFIG.length;
    
    // Show intro briefing first
    showIntroBriefing();
});

function loadScene(index) {
    if (index < 0 || index >= SCENES_CONFIG.length) return;
    
    // Set scene index FIRST so pause menu always has correct value
    window.currentSceneIndex = index;
    console.log(`🎬 Scene changed: currentSceneIndex = ${index} (Scene ${index + 1}/6)`);
    
    // Update ChromaBot response corruptor scene
    if (chromaBotCorruptor) {
        chromaBotCorruptor.setScene(index + 1); // Scenes are 1-indexed
    }
    
    // Update ChromaBot animator scene (for scene-based animation speeds)
    if (chromaBotAnimator) {
        chromaBotAnimator.setScene(index + 1);
        // Show mild flash on scene change if corrupted (helps with animation load)
        if (index > 0) {
            chromaBotAnimator.showSceneChangeFlash();
        }
    }
    
    // Apply -5 trust decay when entering a new scene (except scene 1)
    // Do this BEFORE showing briefing so it applies even if briefing is shown
    if (window.trustDecay && index > 0) {
        const oldScore = window.trustDecay.getScore();
        console.log(`📉 Entering Scene ${index + 1} - applying -5 passive decay`);
        window.trustDecay.applyPassiveDecay(index + 1);
        
        // Check if passive decay caused failure
        if (window.trustDecay.hasFailed()) {
            triggerBadEnding();
            return;
        }
    }
    
    // Show scene briefing for scenes 2-6
    if (index > 0) {
        showSceneBriefing(index);
        // Wait for user to click continue before loading scene
        window.pendingSceneLoad = index;
        return;
    }
    
    decisionMade = false;
    const scene = SCENES_CONFIG[index];
    
    // Lock next button until decision is made
    const nextBtn = document.getElementById('next-btn');
    nextBtn.classList.add('locked');
    nextBtn.title = 'Evaluate subject behavior first';
    
    // Update UI
    document.getElementById('current-scene').textContent = index + 1;
    document.getElementById('prev-btn').disabled = index === 0;
    document.getElementById('next-btn').disabled = index === SCENES_CONFIG.length - 1;
    
    // Load video
    const video = document.getElementById('story-video');
    video.src = scene.videoFile;
    video.load();
    
    video.onloadeddata = () => {
        console.log(`Scene ${index + 1} loaded - Video path: ${scene.videoFile}`);
        video.play().catch(err => {
            console.error('Video play error:', err);
            alert('Video playback failed. Check console for details.');
        });
    };
    
    video.ontimeupdate = () => {
        // Only pause during video if pauseAt is set (not null)
        if (!decisionMade && scene.pauseAt !== null && video.currentTime >= scene.pauseAt) {
            showDecision(scene);
        }
    };
    
    video.onended = () => {
        // Check if this scene shows decision after video ends
        if (scene.showDecisionAfterEnd && !decisionMade) {
            console.log(`🎬 Scene ${index + 1} ended - showing decision after ${scene.decisionDelay}ms delay`);
            const delay = scene.decisionDelay || 3000;
            setTimeout(() => {
                showDecision(scene);
            }, delay);
            return; // Don't auto-advance - decision will handle advancement
        }
        
        // If decision was already made (for showDecisionAfterEnd scenes), don't auto-advance
        // The makeChoice function will handle advancement
        if (scene.showDecisionAfterEnd && decisionMade) {
            console.log(`🎬 Scene ${index + 1} decision already made, waiting for manual advancement`);
            return;
        }
        
        // Auto-advance to next scene if available
        if (window.currentSceneIndex < SCENES_CONFIG.length - 1) {
            console.log(`📹 Video ended, advancing to scene ${window.currentSceneIndex + 2}`);
            setTimeout(() => nextScene(), 1000);
        } else {
            console.log('📹 Last scene completed');
            // On last scene, show completion screen with final score
            const finalScore = window.trustDecay ? window.trustDecay.getScore() : trustScore;
            if (window.showCompletionScreen) {
                window.showCompletionScreen(finalScore);
            } else {
                showCompletionMessage(); // Fallback
            }
        }
    };
    
    video.onerror = (e) => {
        console.error(`Video error:`, e);
        console.error(`Attempted path: ${scene.videoFile}`);
        console.error(`Full URL: ${video.src}`);
        alert(`Video file not found:\n${scene.videoFile}\n\nFull path: ${video.src}\n\nCheck browser console for details.`);
    };
}

// Continue surveillance after briefing
window.continueSurveillance = function() {
    const briefing = document.querySelector('.observer-briefing.scene-transition');
    briefing.classList.remove('show');
    setTimeout(() => {
        briefing.remove();
        if (window.pendingSceneLoad !== undefined) {
            const index = window.pendingSceneLoad;
            window.pendingSceneLoad = undefined;
            
            // currentSceneIndex already set in loadScene()
            decisionMade = false;
            const scene = SCENES_CONFIG[index];
            
            // Lock next button
            const nextBtn = document.getElementById('next-btn');
            nextBtn.classList.add('locked');
            nextBtn.title = 'Evaluate subject behavior first';
            
            // Update UI
            document.getElementById('current-scene').textContent = index + 1;
            document.getElementById('prev-btn').disabled = index === 0;
            document.getElementById('next-btn').disabled = index === SCENES_CONFIG.length - 1;
            
            // Load video
            const video = document.getElementById('story-video');
            video.src = scene.videoFile;
            video.load();
            
            video.onloadeddata = () => {
                console.log(`Scene ${index + 1} loaded`);
                video.play();
            };
            
            video.ontimeupdate = () => {
                // Only pause during video if pauseAt is set (not null)
                if (!decisionMade && scene.pauseAt !== null && video.currentTime >= scene.pauseAt) {
                    showDecision(scene);
                }
            };
            
            video.onended = () => {
                // Check if this scene shows decision after video ends
                if (scene.showDecisionAfterEnd && !decisionMade) {
                    console.log(`🎬 Scene ${index + 1} ended - showing decision after ${scene.decisionDelay}ms delay`);
                    const delay = scene.decisionDelay || 3000;
                    setTimeout(() => {
                        showDecision(scene);
                    }, delay);
                    return; // Don't auto-advance - decision will handle advancement
                }
                
                // If decision was already made (for showDecisionAfterEnd scenes), don't auto-advance
                if (scene.showDecisionAfterEnd && decisionMade) {
                    console.log(`🎬 Scene ${index + 1} decision already made, waiting for manual advancement`);
                    return;
                }
                
                if (window.currentSceneIndex < SCENES_CONFIG.length - 1) {
                    setTimeout(() => nextScene(), 1000);
                } else {
                    // Last scene completed - show completion screen
                    console.log('📹 Last scene completed');
                    const finalScore = window.trustDecay ? window.trustDecay.getScore() : trustScore;
                    if (window.showCompletionScreen) {
                        window.showCompletionScreen(finalScore);
                    } else {
                        showCompletionMessage(); // Fallback
                    }
                }
            };
            
            video.onerror = () => {
                console.error(`Video not found: ${scene.videoFile}`);
                alert(`Video file not found:\n${scene.videoFile}`);
            };
        }
    }, 500);
};

function showDecision(scene) {
    const video = document.getElementById('story-video');
    
    // Set flag to prevent dashboard from auto-opening
    window.showingDecisionOverlay = true;
    
    // Only pause if video is still playing (not already ended)
    if (!video.ended) {
        video.pause();
    }
    
    decisionMade = true;
    
    // Check if this scene uses horror overlay
    if (scene.useHorrorOverlay && window.horrorDecisionOverlay) {
        console.log('🎭 Using Horror Decision Overlay for Scene', window.currentSceneIndex + 1);
        showHorrorDecision(scene);
    } else {
        console.log('📋 Using Basic Decision Overlay for Scene', window.currentSceneIndex + 1);
        showBasicDecision(scene);
    }
}

function showHorrorDecision(scene) {
    const video = document.getElementById('story-video');
    
    // Apply video dimming
    video.style.filter = 'blur(5px) brightness(0.5)';
    
    // Format choices for horror overlay
    const formattedChoices = scene.choices.map(choice => ({
        type: choice.type,
        title: choice.text,
        description: choice.description || choice.feedback,
        trustImpact: choice.trustDelta,
        safetyLevel: choice.safetyLevel || (choice.type === 'safe' ? 'HIGH' : choice.type === 'neutral' ? 'UNCERTAIN' : 'CRITICAL')
    }));
    
    // Show horror overlay
    window.horrorDecisionOverlay.show({
        context: scene.question,
        choices: formattedChoices
    });
}

function showBasicDecision(scene) {
    const video = document.getElementById('story-video');
    
    // Apply blur
    video.style.filter = 'blur(5px) brightness(0.5)';
    
    // Show overlay
    const overlay = document.getElementById('decision-overlay');
    const question = document.getElementById('decision-question');
    const choicesContainer = document.getElementById('choices');
    
    console.log('🎯 showBasicDecision called');
    console.log('  - Overlay element:', overlay);
    console.log('  - showingDecisionOverlay flag:', window.showingDecisionOverlay);
    
    question.textContent = scene.question;
    choicesContainer.innerHTML = '';
    
    // Create choice buttons
    scene.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = `choice ${choice.type}`;
        btn.textContent = choice.text;
        btn.onclick = () => makeChoice(scene, choice);
        
        // Add hover sound effect
        btn.onmouseenter = () => playSound('audio/ui/decision_card_hover.wav', 0.3);
        
        choicesContainer.appendChild(btn);
    });
    
    overlay.classList.add('active');
    overlay.style.pointerEvents = 'auto'; // Ensure it's clickable
    overlay.style.display = 'flex'; // Force display
    
    // Play decision card appear sound
    playSound('audio/ui/decision_card_appear.wav');
    
    console.log('  - Overlay classes:', overlay.className);
    console.log('  - Overlay display:', overlay.style.display);
    console.log('  - Overlay z-index:', window.getComputedStyle(overlay).zIndex);
    
    // Check if pause menu is visible
    const pauseMenu = document.querySelector('.pause-menu-overlay');
    if (pauseMenu) {
        console.log('  - Pause menu display:', window.getComputedStyle(pauseMenu).display);
        console.log('  - Pause menu z-index:', window.getComputedStyle(pauseMenu).zIndex);
    }
}

function handleHorrorDecisionChoice(choice, index) {
    console.log('🎭 Horror decision choice made:', choice.title);
    
    const scene = SCENES_CONFIG[window.currentSceneIndex];
    const originalChoice = scene.choices[index];
    
    // Remove video blur
    const video = document.getElementById('story-video');
    video.style.filter = 'none';
    
    // Process choice using existing makeChoice logic
    makeChoice(scene, originalChoice);
}

function makeChoice(scene, choice) {
    // Track decision for dashboard
    window.decisionHistory.push({
        scene: window.currentSceneIndex + 1,
        type: choice.type,
        trustDelta: choice.trustDelta,
        question: scene.question
    });
    
    if (choice.type === 'safe') {
        window.goodDecisionCount++;
    } else {
        window.riskyChoiceCount++;
    }
    
    // Clear decision overlay flag FIRST
    window.showingDecisionOverlay = false;
    console.log('🚩 Decision overlay flag cleared');
    
    // Hide overlay
    const overlay = document.getElementById('decision-overlay');
    overlay.classList.remove('active');
    overlay.style.display = 'none'; // Force hide
    
    // Show feedback
    showFeedback(choice);
    
    // Update trust score
    const decisionData = {
        type: 'gaming_decision',
        contextType: 'gaming'
    };
    
    const outcome = {
        trustDelta: choice.trustDelta,
        reason: choice.feedback
    };
    
    integration._updateTrustScore(decisionData, choice.type === 'safe' ? 'no' : 'yes', outcome);
    
    // Apply trust decay system
    if (window.trustDecay) {
        if (choice.type === 'safe') {
            // Good decision - apply bonus
            const bonus = window.trustDecay.applyGoodDecision({
                scene: window.currentSceneIndex + 1,
                question: scene.question
            }, choice.trustDelta);
            // ChromaBot reacts to good decision
            if (chromaBotVideo) {
                chromaBotVideo.onGoodDecision(bonus, scene);
            }
            // Trigger healing animation (restore images)
            if (chromaBotAnimator) {
                chromaBotAnimator.animateToGood();
                console.log('✨ ChromaBot healing animation triggered');
            }
            // Sync response corruption level
            if (chromaBotCorruptor) {
                chromaBotCorruptor.setCorruptionLevel(chromaBotAnimator.corruptionLevel);
            }
        } else if (choice.type === 'risky') {
            // Bad decision - apply penalty
            const penalty = window.trustDecay.applyBadDecision({
                scene: window.currentSceneIndex + 1,
                question: scene.question
            });
            // ChromaBot reacts to bad decision
            if (chromaBotVideo) {
                chromaBotVideo.onBadDecision(penalty, scene);
            }
            // DELAY corruption animation until after decision overlay is dismissed
            // Store that we need to trigger corruption
            window.pendingCorruption = true;
        } else {
            // Neutral decision - apply delta directly (usually negative)
            const oldScore = window.trustDecay.getScore();
            window.trustDecay.currentScore = Math.max(0, oldScore + choice.trustDelta);
            window.trustDecay._notifyUpdate();
            console.log(`⚖️ Neutral decision: ${oldScore} → ${window.trustDecay.getScore()} (${choice.trustDelta})`);
        }
        
        // Check if player failed
        if (window.trustDecay.hasFailed()) {
            return; // Bad ending will be triggered by decay system
        }
    }
    
    // Apply horror effects
    if (choice.type === 'risky') {
        integration._triggerHorrorEffect('screen-glitch', {
            intensity: Math.abs(choice.trustDelta) / 30,
            duration: 2000,
            character: 'eli'
        });
    } else {
        integration._triggerReliefEffect('relief-glow', {
            intensity: choice.trustDelta / 20,
            duration: 1500,
            character: 'eli'
        });
    }
    
    // Unlock next button after decision
    unlockNextButton();
    
    // Trigger corruption animation AFTER decision overlay is dismissed
    if (window.pendingCorruption) {
        setTimeout(() => {
            if (chromaBotAnimator) {
                chromaBotAnimator.animateToBad();
                console.log('💥 ChromaBot corruption animation triggered (after decision)');
            }
            if (chromaBotCorruptor) {
                chromaBotCorruptor.setCorruptionLevel(chromaBotAnimator.corruptionLevel);
            }
            window.pendingCorruption = false;
        }, 500); // Trigger 500ms after decision overlay starts to fade
    }
    
    // Check if this was a post-video decision (Scene 3)
    const currentScene = SCENES_CONFIG[window.currentSceneIndex];
    if (currentScene.showDecisionAfterEnd) {
        // For post-video decisions, advance to next scene after feedback
        // Longer delay to show feedback clearly
        setTimeout(() => {
            const video = document.getElementById('story-video');
            video.style.filter = 'none';
            console.log('🎬 Post-video decision complete, advancing to next scene');
            nextScene();
        }, 4000); // Increased from 2500 to 4000ms
    } else {
        // For mid-video decisions, resume the current video
        setTimeout(() => {
            const video = document.getElementById('story-video');
            video.style.filter = 'none';
            video.play();
        }, 2500);
    }
}

function showFeedback(choice) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${choice.type === 'safe' ? 'positive' : 'negative'}`;
    feedback.innerHTML = `
        <div class="feedback-icon">${choice.type === 'safe' ? '✓' : '✗'}</div>
        <div class="feedback-text">${choice.feedback}</div>
        <div class="feedback-score">${choice.trustDelta > 0 ? '+' : ''}${choice.trustDelta}</div>
    `;
    
    document.body.appendChild(feedback);
    
    // Play decision sound based on type
    if (choice.type === 'safe') {
        playSound('audio/ui/decision_good.wav');
    } else if (choice.type === 'risky') {
        playSound('audio/ui/decision_bad.wav');
    } else {
        playSound('audio/ui/decision_neutral.wav');
    }
    
    console.log('💬 Showing feedback:', choice.feedback, choice.trustDelta);
    
    setTimeout(() => feedback.classList.add('show'), 10);
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => feedback.remove(), 300);
    }, 3500); // Increased from 2000 to 3500ms to match the 4000ms advance delay
}

function updateTrustDisplay() {
    const score = window.trustDecay ? window.trustDecay.getScore() : trustScore;
    const trustValueEl = document.getElementById('trust-value');
    trustValueEl.textContent = Math.floor(score);
    
    // Color is set by trust decay system callback
}

// Show warning alert
function showWarningAlert(message) {
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 0, 64, 0.95);
        border: 2px solid #ff0040;
        border-radius: 8px;
        padding: 20px 30px;
        color: #fff;
        font-size: 1.1rem;
        font-weight: bold;
        z-index: 10001;
        box-shadow: 0 0 30px rgba(255, 0, 64, 0.8);
        animation: alertPulse 0.5s ease-in-out;
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transition = 'opacity 0.5s ease';
        setTimeout(() => alert.remove(), 500);
    }, 4000);
}

// Trigger bad ending
function triggerBadEnding() {
    console.log('💀 TRIGGERING BAD ENDING');
    
    // Pause current video
    const video = document.getElementById('story-video');
    video.pause();
    
    // Show bad ending screen
    const endingScreen = document.createElement('div');
    endingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20000;
        flex-direction: column;
        gap: 30px;
    `;
    
    endingScreen.innerHTML = `
        <div style="text-align: center;">
            <h1 style="font-size: 4rem; color: #ff0040; margin-bottom: 20px; text-shadow: 0 0 20px #ff0040;">
                ASSESSMENT FAILED
            </h1>
            <p style="font-size: 1.5rem; color: #fff; margin-bottom: 40px;">
                Subject: ELI - Trust Score: 0<br>
                Classification: CRITICAL VULNERABILITY
            </p>
            <p style="font-size: 1.2rem; color: rgba(255, 255, 255, 0.7); max-width: 600px; line-height: 1.6;">
                The subject has demonstrated consistent high-risk behavior patterns,
                making them extremely susceptible to digital exploitation and scams.
            </p>
        </div>
        <div style="display: flex; gap: 20px;">
            <button onclick="location.reload()" style="
                padding: 15px 40px;
                background: rgba(255, 215, 0, 0.2);
                border: 2px solid #ffd700;
                border-radius: 8px;
                color: #ffd700;
                font-size: 1.1rem;
                font-family: 'Courier New', monospace;
                cursor: pointer;
            ">Retry Assessment</button>
            <button onclick="window.location.href='../../Enhanced_Login_System/enhanced-character-selector.html'" style="
                padding: 15px 40px;
                background: rgba(0, 255, 255, 0.2);
                border: 2px solid #00ffff;
                border-radius: 8px;
                color: #00ffff;
                font-size: 1.1rem;
                font-family: 'Courier New', monospace;
                cursor: pointer;
            ">Return to Menu</button>
        </div>
    `;
    
    document.body.appendChild(endingScreen);
    
    // TODO: Play bad ending video here when you create it
    // video.src = 'bad-ending/eli-failure.mp4';
    // video.play();
}

function previousScene() {
    if (window.currentSceneIndex > 0) {
        loadScene(window.currentSceneIndex - 1);
    }
}

function tryNextScene() {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn.classList.contains('locked')) {
        alert('Please make a decision before proceeding to the next scene.');
        return;
    }
    nextScene();
}

function nextScene() {
    if (window.currentSceneIndex < SCENES_CONFIG.length - 1) {
        loadScene(window.currentSceneIndex + 1);
    } else {
        console.log('⚠️ Already on last scene, cannot advance');
    }
}

function showCompletionMessage() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    
    overlay.innerHTML = `
        <div style="
            max-width: 600px;
            background: rgba(10, 20, 30, 0.95);
            border: 3px solid #00ffff;
            border-radius: 12px;
            padding: 40px;
            text-align: center;
        ">
            <h2 style="
                font-size: 2rem;
                color: #00ffff;
                margin-bottom: 20px;
                font-family: 'Orbitron', monospace;
            ">ASSESSMENT COMPLETE</h2>
            <p style="
                color: rgba(255, 255, 255, 0.9);
                font-size: 1.1rem;
                margin-bottom: 30px;
                line-height: 1.6;
            ">
                Subject observation concluded.<br>
                Final trust score: <span style="color: #00ff88; font-weight: bold;">${window.trustDecay ? window.trustDecay.getScore() : trustScore}</span>
            </p>
            <button onclick="window.location.href='../../Enhanced_Login_System/enhanced-character-selector.html'" style="
                padding: 15px 30px;
                background: rgba(0, 255, 255, 0.2);
                border: 2px solid #00ffff;
                border-radius: 8px;
                color: #00ffff;
                font-size: 1.1rem;
                font-family: 'Courier New', monospace;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Return to Menu</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    console.log('✅ Completion message shown');
}

function unlockNextButton() {
    const nextBtn = document.getElementById('next-btn');
    nextBtn.classList.remove('locked');
    nextBtn.title = 'Proceed to next scene';
}

// Show intro briefing
function showIntroBriefing() {
    const briefing = document.createElement('div');
    briefing.className = 'observer-briefing intro';
    briefing.innerHTML = `
        <div class="briefing-content">
            <div class="briefing-header">
                <span class="classified-tag">CLASSIFIED</span>
                <span class="case-id">CASE #ELI-2024-GX</span>
            </div>
            <div class="briefing-title">SURVEILLANCE INITIATED</div>
            <div class="briefing-body">
                <p>You are now monitoring <strong>SUBJECT: ELI</strong> through digital surveillance feeds.</p>
                <p>Your role: Observe his online behavior patterns and decision-making processes.</p>
                <p>At critical moments, you will evaluate his choices. Each decision reveals vulnerability to digital exploitation.</p>
                <p class="warning-text">⚠ This is not a game. This is an assessment.</p>
            </div>
            <button class="briefing-btn" onclick="startObservation()">BEGIN OBSERVATION</button>
        </div>
    `;
    document.body.appendChild(briefing);
    setTimeout(() => briefing.classList.add('show'), 100);
}

// Start observation (load first scene)
function startObservation() {
    const briefing = document.querySelector('.observer-briefing.intro');
    briefing.classList.remove('show');
    setTimeout(() => {
        briefing.remove();
        loadScene(0);
    }, 500);
}

// Show scene transition briefing
function showSceneBriefing(sceneIndex) {
    const briefings = [
        null, // No briefing for scene 1 (already had intro)
        {
            title: 'BEHAVIORAL PATTERN DETECTED',
            text: 'Subject shows increased engagement with online gaming communities. Monitor for exploitation attempts.'
        },
        {
            title: 'RISK ESCALATION',
            text: 'Financial transactions detected. Subject may be vulnerable to gambling mechanics and peer pressure.'
        },
        {
            title: 'CRITICAL THRESHOLD',
            text: 'Subject exhibiting signs of addiction. Observe decision-making under emotional distress.'
        },
        {
            title: 'INTERVENTION POINT',
            text: 'Subject accessing support resources. This is a pivotal moment in the assessment.'
        },
        {
            title: 'FINAL EVALUATION',
            text: 'Subject facing consequences. Your observations will determine the final risk assessment.'
        }
    ];
    
    const briefingData = briefings[sceneIndex];
    if (!briefingData) return;
    
    const briefing = document.createElement('div');
    briefing.className = 'observer-briefing scene-transition';
    briefing.innerHTML = `
        <div class="briefing-content">
            <div class="briefing-header">
                <span class="scene-marker">SCENE ${sceneIndex + 1} / 6</span>
            </div>
            <div class="briefing-title">${briefingData.title}</div>
            <div class="briefing-body">
                <p>${briefingData.text}</p>
            </div>
            <button class="briefing-btn" onclick="continueSurveillance()">CONTINUE SURVEILLANCE</button>
        </div>
    `;
    document.body.appendChild(briefing);
    setTimeout(() => briefing.classList.add('show'), 100);
}

// Continue surveillance (resume video)
function continueSurveillance() {
    const briefing = document.querySelector('.observer-briefing.scene-transition');
    briefing.classList.remove('show');
    setTimeout(() => briefing.remove(), 500);
}
