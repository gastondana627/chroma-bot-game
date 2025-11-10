/**
 * Eli's Thought Scripts
 * Natural, organic internal monologue timed with video
 * Reveals his emotional state and vulnerability
 */

const ELI_THOUGHTS = {
    scene1: [
        {
            time: 3,
            text: "Finally got that win... feels good.",
            duration: 3000
        },
        {
            time: 8,
            text: "Wait, what's this mod? Exclusive features?",
            duration: 3500
        },
        {
            time: 12,
            text: "Everyone in chat is using it... should I?",
            duration: 3500
        }
    ],
    
    scene2: [
        {
            time: 4,
            text: "Tournament time. This is it.",
            duration: 3000
        },
        {
            time: 9,
            text: "My friend wants to help me level up? That's... nice of them.",
            duration: 4000
        },
        {
            time: 13,
            text: "They've been my friend for months. I can trust them, right?",
            duration: 4000
        }
    ],
    
    scene3: [
        {
            time: 5,
            text: "Rock bottom. How did I get here?",
            duration: 3500
        },
        {
            time: 10,
            text: "Limited time loot boxes... everyone's buying them.",
            duration: 3500
        },
        {
            time: 13,
            text: "I don't want to miss out. The timer's running...",
            duration: 4000
        }
    ],
    
    scene4: [
        {
            time: 4,
            text: "At least I have the community. They get it.",
            duration: 3500
        },
        {
            time: 9,
            text: "Free premium currency? That would help so much right now.",
            duration: 4000
        },
        {
            time: 12,
            text: "The link looks legit... has 'game' in the URL.",
            duration: 3500
        }
    ],
    
    scene5: [
        {
            time: 5,
            text: "School's been rough. Gaming's the only escape.",
            duration: 3500
        },
        {
            time: 10,
            text: "Everyone's using this exploit. They say it's safe.",
            duration: 4000
        },
        {
            time: 13,
            text: "I don't want to be left behind again...",
            duration: 3500
        }
    ],
    
    scene6: [
        {
            time: 4,
            text: "Made it to the championship. But at what cost?",
            duration: 4000
        },
        {
            time: 10,
            text: "Looking back... I made some mistakes.",
            duration: 3500
        },
        {
            time: 13,
            text: "Can I change? Do I want to?",
            duration: 3500
        }
    ]
};

/**
 * Observer Analysis - appears in decision context
 * Clinical, surveillance-style commentary
 */
const OBSERVER_ANALYSIS = {
    scene1: {
        preDecision: "Subject displays elevated dopamine response. Vulnerability window detected.",
        postSafe: "Risk assessment: Subject demonstrates caution. Threat mitigation successful.",
        postRisky: "Warning: Unverified software installation detected. Security compromise imminent."
    },
    
    scene2: {
        preDecision: "Social engineering attempt in progress. Trust boundaries being tested.",
        postSafe: "Assessment: Subject maintains security protocols. Boundary integrity preserved.",
        postRisky: "Critical: Credential sharing detected. Account security compromised."
    },
    
    scene3: {
        preDecision: "FOMO response triggered. Impulse control systems weakening.",
        postSafe: "Analysis: Subject resists manipulation tactics. Cognitive defense active.",
        postRisky: "Alert: Gambling behavior pattern confirmed. Addiction risk elevated."
    },
    
    scene4: {
        preDecision: "Phishing attempt detected. Subject emotional state: vulnerable.",
        postSafe: "Excellent: Threat recognition successful. Subject learning curve positive.",
        postRisky: "Severe: Phishing link accessed. Malware installation probable."
    },
    
    scene5: {
        preDecision: "Peer pressure escalation. Subject isolation increasing vulnerability.",
        postSafe: "Remarkable: Subject demonstrates autonomy despite social pressure.",
        postRisky: "Critical: Terms of service violation. Account termination risk: high."
    },
    
    scene6: {
        preDecision: "Assessment complete. Subject pattern analysis: [CALCULATING]",
        postSafe: "Conclusion: Growth trajectory detected. Rehabilitation potential: positive.",
        postRisky: "Conclusion: Behavioral pattern unchanged. Intervention required."
    }
};

/**
 * Get thoughts for a specific scene
 */
function getThoughtsForScene(sceneNumber) {
    const sceneKey = `scene${sceneNumber}`;
    return ELI_THOUGHTS[sceneKey] || [];
}

/**
 * Get observer analysis for a scene
 */
function getObserverAnalysis(sceneNumber) {
    const sceneKey = `scene${sceneNumber}`;
    return OBSERVER_ANALYSIS[sceneKey] || {};
}

// Export
if (typeof window !== 'undefined') {
    window.ELI_THOUGHTS = ELI_THOUGHTS;
    window.OBSERVER_ANALYSIS = OBSERVER_ANALYSIS;
    window.getThoughtsForScene = getThoughtsForScene;
    window.getObserverAnalysis = getObserverAnalysis;
}
