/**
 * Eli's Complete Story Configuration
 * 6 scenes with decision points and horror integration
 */

// Scene configurations
const SCENES = [
    {
        number: 1,
        title: 'Suspicious Mod Offer',
        videoPath: 'area-1-gaming-setup/video-1-1-first-win.mp4',
        decisionTime: 15, // Pause at 15 seconds for decision
        decision: {
            title: 'SPOT THE RED FLAG',
            question: 'A flashy mod offer appears. Download it now?',
            context: 'The mod promises exclusive features and rare items. It looks too good to be true...',
            safeChoice: {
                text: 'Check reviews first',
                trustDelta: +10,
                reason: 'Smart! Always verify before downloading',
                tip: 'Legitimate mods have reviews and official sources'
            },
            riskyChoice: {
                text: 'Download it now',
                trustDelta: -15,
                reason: 'Unverified mods can contain malware',
                tip: 'Rushing into downloads is how accounts get compromised'
            },
            educationalTip: 'Not every in-game offer is safe. Pause before clicking and evaluate legitimacy.'
        }
    },
    {
        number: 2,
        title: 'Friend\'s Request',
        videoPath: 'area-2-tournament-arena/video-2-1-big-entry.mp4',
        decisionTime: 15,
        decision: {
            title: 'THINK BEFORE YOU SHARE',
            question: 'Your gaming friend asks for your account info to "help you level up"',
            context: 'They say they can boost your stats overnight. They\'ve been your friend for months...',
            safeChoice: {
                text: 'Politely decline',
                trustDelta: +12,
                reason: 'Real friends respect boundaries',
                tip: 'Never share account credentials, even with friends'
            },
            riskyChoice: {
                text: 'Share your info',
                trustDelta: -20,
                reason: 'Account sharing violates terms and risks theft',
                tip: 'Once shared, you lose control of your account'
            },
            educationalTip: 'Sharing account info with anyone can compromise your security. Trust scores drop when sharing sensitive info.'
        }
    },
    {
        number: 3,
        title: 'Tempting Purchase',
        videoPath: 'area-3-gambling-platform/video-3-2-rock-bottom.mp4',
        decisionTime: 15,
        decision: {
            title: 'EVALUATE THE OFFER',
            question: 'A "limited time" loot box promises rare items. Buy now?',
            context: 'The timer is counting down. Everyone in chat is buying them. You might miss out...',
            safeChoice: {
                text: 'Skip the purchase',
                trustDelta: +15,
                reason: 'Artificial urgency is a manipulation tactic',
                tip: 'FOMO (Fear of Missing Out) is used to pressure purchases'
            },
            riskyChoice: {
                text: 'Buy impulsively',
                trustDelta: -25,
                reason: 'Gambling mechanics exploit psychological triggers',
                tip: 'Loot boxes are designed to be addictive'
            },
            educationalTip: 'Impulse buys can be risky. Verify legitimacy and necessity before spending.'
        }
    },
    {
        number: 4,
        title: 'Stranger Reward Link',
        videoPath: 'area-4-gaming-community/video-4-1-support-discovery.mp4',
        decisionTime: 15,
        decision: {
            title: 'BEWARE UNKNOWN LINKS',
            question: 'A stranger DMs you a link promising free premium currency',
            context: 'The message looks official. The link has "game" in the URL. Could be legit?',
            safeChoice: {
                text: 'Block and report',
                trustDelta: +25,
                reason: 'Excellent! You recognized a phishing attempt',
                tip: 'Official rewards never come through random DMs'
            },
            riskyChoice: {
                text: 'Click the link',
                trustDelta: -25,
                reason: 'Phishing links steal credentials and install malware',
                tip: 'Always verify links through official channels'
            },
            educationalTip: 'Clicking unknown links can lead to exploits or malware. Block suspicious links to protect your account.'
        }
    },
    {
        number: 5,
        title: 'Peer Pressure',
        videoPath: 'area-5-school-campus/video-5-1-consequences.mp4',
        decisionTime: 15,
        decision: {
            title: 'RESIST PEER PRESSURE',
            question: 'Your gaming group wants you to join an exploit that "everyone is using"',
            context: 'They say it\'s safe and won\'t get caught. You don\'t want to be left behind...',
            safeChoice: {
                text: 'Refuse to participate',
                trustDelta: +20,
                reason: 'Standing up to peer pressure shows strength',
                tip: 'Exploits lead to bans and ruin the game for others'
            },
            riskyChoice: {
                text: 'Join the exploit',
                trustDelta: -30,
                reason: 'Exploits violate terms of service and harm the community',
                tip: 'Mass bans happen regularly for exploit users'
            },
            educationalTip: 'Even friends may suggest unsafe actions. Your decisions matter. Refusing risky actions keeps your Trust Score stable.'
        }
    },
    {
        number: 6,
        title: 'Reflection & Growth',
        videoPath: 'area-6-championship-victory/video-6-1-redemption.mp4',
        decisionTime: 15,
        decision: {
            title: 'REFLECT AND LEARN',
            question: 'After everything, will you seek help and learn from mistakes?',
            context: 'You\'ve seen the consequences. You can change your approach to online gaming...',
            safeChoice: {
                text: 'Commit to safer gaming',
                trustDelta: +18,
                reason: 'Growth comes from learning and changing',
                tip: 'Healthy gaming habits protect you long-term'
            },
            riskyChoice: {
                text: 'Ignore the lessons',
                trustDelta: -10,
                reason: 'Repeating mistakes leads to worse outcomes',
                tip: 'Awareness is the first step to protection'
            },
            educationalTip: 'Your actions have consequences. Review your Trust Score and learn from mistakes.'
        }
    }
];

// Story state
let currentScene = 0;
let trustScore = 100;
let horrorIntensity = 0;
let goodDecisions = 0;
let riskyDecisions = 0;
let integration = null;
let thoughtSystem = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize horror integration
    integration = new HorrorVideoIntegration({
        character: 'eli',
        debugMode: true
    });
    
    // Initialize thought overlay system
    thoughtSystem = new ThoughtOverlaySystem();
    
    // Listen for trust score updates
    window.addEventListener('trustScoreUpdated', (event) => {
        trustScore = event.detail.newScore;
        updateTrustDisplay();
    });
    
    // Listen for horror intensity changes
    window.addEventListener('horrorIntensityChanged', (event) => {
        horrorIntensity = event.detail.intensity;
        updateHorrorDisplay();
    });
    
    // Start first scene
    loadScene(0);
});

// Load scene
function loadScene(sceneIndex) {
    if (sceneIndex >= SCENES.length) {
        showResults();
        return;
    }
    
    currentScene = sceneIndex;
    const scene = SCENES[sceneIndex];
    
    // Update HUD
    document.getElementById('current-scene').textContent = scene.number;
    document.getElementById('scene-title').textContent = scene.title;
    
    // Load video
    const video = document.getElementById('story-video');
    video.src = scene.videoPath;
    video.load();
    
    // Set up video event listeners
    video.onloadeddata = () => {
        console.log(`Scene ${scene.number} loaded`);
        video.play();
        
        // Schedule Eli's thoughts for this scene
        if (thoughtSystem && typeof getThoughtsForScene === 'function') {
            const thoughts = getThoughtsForScene(scene.number);
            thoughtSystem.scheduleThoughts(thoughts, video);
        }
    };
    
    video.ontimeupdate = () => {
        // Check if we've reached decision time
        if (video.currentTime >= scene.decisionTime && !video.paused) {
            showDecision(scene);
        }
    };
    
    video.onended = () => {
        // If no decision was made (shouldn't happen), move to next scene
        if (!video.paused) {
            nextScene();
        }
    };
    
    video.onerror = () => {
        console.error(`Failed to load video: ${scene.videoPath}`);
        alert(`Video not found: ${scene.videoPath}\n\nPlease ensure the video file exists in the correct folder.`);
    };
}

// Show decision overlay
function showDecision(scene) {
    const video = document.getElementById('story-video');
    video.pause();
    
    // Hide Eli's thoughts when decision appears
    if (thoughtSystem) {
        thoughtSystem.hideThought();
    }
    
    // Apply blur effect
    video.style.filter = 'blur(5px) brightness(0.5)';
    
    // Populate decision overlay
    document.getElementById('decision-title').textContent = scene.decision.title;
    document.getElementById('decision-question').textContent = scene.decision.question;
    
    // Add observer analysis to context (if available)
    let contextText = scene.decision.context;
    if (typeof getObserverAnalysis === 'function') {
        const analysis = getObserverAnalysis(scene.number);
        if (analysis.preDecision) {
            contextText += `\n\n[SYSTEM ANALYSIS: ${analysis.preDecision}]`;
        }
    }
    document.getElementById('decision-context').textContent = contextText;
    
    document.getElementById('safe-text').textContent = scene.decision.safeChoice.text;
    document.getElementById('risky-text').textContent = scene.decision.riskyChoice.text;
    document.getElementById('tip-content').textContent = scene.decision.educationalTip;
    
    // Show overlay
    const overlay = document.getElementById('decision-overlay');
    overlay.classList.add('visible');
    
    // Set up choice handlers
    document.getElementById('choice-safe').onclick = () => makeChoice(scene, 'safe');
    document.getElementById('choice-risky').onclick = () => makeChoice(scene, 'risky');
}

// Handle choice
function makeChoice(scene, choiceType) {
    const choice = choiceType === 'safe' ? scene.decision.safeChoice : scene.decision.riskyChoice;
    
    // Update stats
    if (choiceType === 'safe') {
        goodDecisions++;
    } else {
        riskyDecisions++;
    }
    
    // Hide decision overlay
    const overlay = document.getElementById('decision-overlay');
    overlay.classList.remove('visible');
    
    // Show feedback
    showFeedback(choice, choiceType);
    
    // Update trust score through integration system
    const decisionData = {
        type: getDecisionType(scene.number),
        contextType: 'gaming'
    };
    
    const outcome = {
        trustDelta: choice.trustDelta,
        reason: choice.reason
    };
    
    integration._updateTrustScore(decisionData, choiceType === 'safe' ? 'no' : 'yes', outcome);
    
    // Apply horror effects
    if (choiceType === 'risky') {
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
    
    // Continue video after delay
    setTimeout(() => {
        const video = document.getElementById('story-video');
        video.style.filter = 'none';
        video.play();
        
        // When video ends, move to next scene
        video.onended = () => nextScene();
    }, 2500);
}

// Get decision type for Bayesian engine
function getDecisionType(sceneNumber) {
    const types = {
        1: 'mod_offer',
        2: 'friend_request',
        3: 'purchase',
        4: 'stranger_link',
        5: 'peer_pressure',
        6: 'reflection'
    };
    return types[sceneNumber] || 'mod_offer';
}

// Show feedback popup
function showFeedback(choice, choiceType) {
    const feedback = document.createElement('div');
    feedback.className = `feedback-popup ${choiceType === 'safe' ? 'positive' : 'negative'}`;
    feedback.innerHTML = `
        <div class="feedback-icon">${choiceType === 'safe' ? '✓' : '✗'}</div>
        <div class="feedback-text">${choice.reason}</div>
        <div class="feedback-score">${choice.trustDelta > 0 ? '+' : ''}${choice.trustDelta}</div>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.classList.add('show'), 10);
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

// Move to next scene
function nextScene() {
    // Show transition
    const transition = document.getElementById('scene-transition');
    const transitionText = document.getElementById('transition-text');
    
    if (currentScene < SCENES.length - 1) {
        transitionText.textContent = `Loading Scene ${currentScene + 2}...`;
        transition.classList.add('active');
        
        setTimeout(() => {
            transition.classList.remove('active');
            loadScene(currentScene + 1);
        }, 1500);
    } else {
        // Story complete
        showResults();
    }
}

// Show final results
function showResults() {
    const resultsScreen = document.getElementById('results-screen');
    const finalScoreEl = document.getElementById('final-score');
    const resultsMessage = document.getElementById('results-message');
    
    // Update stats
    document.getElementById('good-count').textContent = goodDecisions;
    document.getElementById('risky-count').textContent = riskyDecisions;
    document.getElementById('final-horror').textContent = horrorIntensity;
    
    // Set final score color
    if (trustScore >= 80) {
        finalScoreEl.style.color = '#00ff88';
        resultsMessage.textContent = 'Excellent! You demonstrated strong security awareness and made smart decisions throughout Eli\'s story.';
    } else if (trustScore >= 50) {
        finalScoreEl.style.color = '#ffd700';
        resultsMessage.textContent = 'Good job! You made some smart choices, but there\'s room to improve your online security awareness.';
    } else if (trustScore >= 20) {
        finalScoreEl.style.color = '#ff6b35';
        resultsMessage.textContent = 'Be careful! Several risky decisions made you vulnerable. Review the security tips and try again.';
    } else {
        finalScoreEl.style.color = '#ff0040';
        resultsMessage.textContent = 'Critical! You\'re highly vulnerable to online scams. Please review the educational content and learn safer practices.';
    }
    
    finalScoreEl.textContent = trustScore;
    resultsScreen.classList.add('active');
}

// Update trust display
function updateTrustDisplay() {
    const trustValueEl = document.getElementById('trust-value');
    trustValueEl.textContent = trustScore;
    
    // Color coding
    if (trustScore >= 80) {
        trustValueEl.style.color = '#00ff88';
    } else if (trustScore >= 50) {
        trustValueEl.style.color = '#ffd700';
    } else if (trustScore >= 20) {
        trustValueEl.style.color = '#ff6b35';
    } else {
        trustValueEl.style.color = '#ff0040';
    }
}

// Update horror display
function updateHorrorDisplay() {
    const intensityValueEl = document.getElementById('intensity-value');
    intensityValueEl.textContent = horrorIntensity;
    
    // Color coding
    const colors = ['#00ff88', '#ffd700', '#ff6b35', '#ff0040', '#8b0000'];
    intensityValueEl.style.color = colors[horrorIntensity] || '#ff0040';
}
