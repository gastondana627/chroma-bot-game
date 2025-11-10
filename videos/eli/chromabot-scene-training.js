/**
 * ChromaBot Scene-Specific Training Data
 * Fine-tuned responses for each scene in Eli's story
 */

const CHROMABOT_SCENE_TRAINING = {
    scene1: {
        title: "Gaming Setup - The Beginning",
        context: "Eli is in his room, gaming late at night. Peer pressure is starting.",
        messages: [
            { user: "sk8rboi2006", text: "yo eli u coming to the party tonight?", type: "pressure" },
            { user: "gamequeen", text: "everyone's gonna be there...", type: "pressure" },
            { user: "your_mom", text: "dinner in 20 mins", type: "safe" }
        ],
        chromaResponses: {
            "party": "🎉 Parties aren't bad, but peer pressure is. Notice how they're making it seem like you HAVE to go? That's a manipulation tactic.",
            "pressure": "💪 Peer pressure works by making you feel left out. Real friends respect your choices. Fake friends pressure you.",
            "gaming": "🎮 Gaming is fun, but balance matters. Don't let it isolate you from real connections.",
            "friends": "👥 True friends support your decisions. If they're pressuring you, are they really friends?",
            "default": "🤔 In this scene, Eli is facing social pressure. The key is recognizing when 'friends' are manipulating you."
        },
        advice: "Watch for manipulation tactics: urgency ('everyone's going'), FOMO (fear of missing out), and guilt-tripping."
    },
    
    scene2: {
        title: "Tournament Arena - Competition Heats Up",
        context: "Eli is in an online tournament. Stakes are high, and scammers are watching.",
        messages: [
            { user: "ProGamer_Official", text: "Congrats on the win! Want to join our pro team?", type: "scam" },
            { user: "TournamentAdmin", text: "Verify your account to claim prize", type: "scam" },
            { user: "real_friend_jake", text: "nice game dude!", type: "safe" }
        ],
        chromaResponses: {
            "tournament": "🏆 Tournaments attract scammers. They prey on excited winners. Always verify official communications!",
            "prize": "💰 Real prizes don't require 'verification' via sketchy links. Official tournaments have secure processes.",
            "team": "⚠️ 'Pro team' invites from strangers? Red flag! Legitimate teams have proper recruitment processes.",
            "verify": "🔐 'Verify your account' is a classic phishing tactic. Never click suspicious links, even if they look official!",
            "admin": "👮 Fake admins use official-sounding names. Check the actual username and domain before trusting anyone.",
            "default": "🎮 Scene 2 is about post-victory scams. Scammers target emotional highs when you're less cautious."
        },
        advice: "Scammers exploit excitement. When you win, take a breath before clicking anything. Verify through official channels."
    },
    
    scene3: {
        title: "Gambling Platform - The Trap",
        context: "Eli discovers gambling sites disguised as gaming platforms. Addiction risk is high.",
        messages: [
            { user: "LuckyBets_VIP", text: "First deposit bonus: 500% match!", type: "scam" },
            { user: "BigWinner2024", text: "I made $5000 in one night!", type: "scam" },
            { user: "concerned_friend", text: "eli... this doesn't look safe", type: "safe" }
        ],
        chromaResponses: {
            "gambling": "🎰 Gambling sites disguised as games are predatory. They target young gamers with 'bonuses' that are traps.",
            "bonus": "💸 '500% bonus' sounds great, but it's bait. These sites make money by getting you addicted, not by giving away money.",
            "winner": "🚩 'I made $5000!' posts are fake testimonials. Real gambling = real losses. The house always wins.",
            "deposit": "💳 Once you deposit, they have your payment info. Withdrawing 'winnings' is nearly impossible.",
            "addiction": "⚠️ Gambling addiction starts with 'just one try'. It's designed to trigger dopamine like a drug.",
            "default": "🎲 Scene 3 shows how gambling sites exploit gamers. They use gaming aesthetics to hide predatory practices."
        },
        advice: "Gambling sites use psychological tricks: fake wins, near-misses, and 'bonuses' to hook you. Stay away."
    },
    
    scene4: {
        title: "Gaming Community - Toxic Environment",
        context: "Eli is deep in a toxic gaming community. Harassment and manipulation are normalized.",
        messages: [
            { user: "ToxicPlayer99", text: "ur trash eli, uninstall", type: "toxic" },
            { user: "ScammerPro", text: "buy my coaching for $200, guaranteed rank up", type: "scam" },
            { user: "supportive_gamer", text: "ignore the haters, you're improving!", type: "safe" }
        ],
        chromaResponses: {
            "toxic": "☠️ Toxic communities normalize abuse. This isn't 'just gaming culture' - it's harassment. You deserve better.",
            "coaching": "💰 '$200 coaching' from random players? Scam. Real coaches have credentials and reviews.",
            "harassment": "🛡️ Online harassment is real harm. Block, report, and find healthier communities.",
            "community": "👥 Good communities support growth. Toxic ones tear you down. Choose wisely.",
            "rank": "📈 'Guaranteed rank up' is a lie. Skill comes from practice, not paying scammers.",
            "default": "🎮 Scene 4 explores toxic gaming culture. Remember: you can leave toxic spaces. Your mental health matters."
        },
        advice: "Toxic communities damage mental health. Block harassers, report abuse, and find supportive spaces."
    },
    
    scene5: {
        title: "School Campus - Real World Consequences",
        context: "Eli's online choices are affecting his real life. Friends, family, and school are concerned.",
        messages: [
            { user: "mom", text: "We need to talk about your screen time", type: "safe" },
            { user: "school_counselor", text: "Your grades are dropping. Let's chat.", type: "safe" },
            { user: "fake_friend", text: "they just don't understand us gamers", type: "toxic" }
        ],
        chromaResponses: {
            "family": "👨‍👩‍👦 Family concerns come from love, not control. They see changes you might not notice.",
            "grades": "📚 Dropping grades are a warning sign. Balance is key - gaming shouldn't destroy your future.",
            "counselor": "🗣️ Talking to a counselor isn't weakness. It's smart. They can help you find balance.",
            "understand": "⚠️ 'They don't understand' is isolation talk. Don't let online 'friends' separate you from real support.",
            "consequences": "⚡ Online actions have real-world consequences. Your digital life affects your actual life.",
            "default": "🏫 Scene 5 shows real-world impact. Online addiction affects school, family, and future opportunities."
        },
        advice: "When real life suffers, it's time to reassess. Seek help from trusted adults - it's strength, not weakness."
    },
    
    scene6: {
        title: "Championship Victory - Redemption or Relapse?",
        context: "Eli faces a final choice: continue down the dangerous path or choose recovery.",
        messages: [
            { user: "recovery_friend", text: "proud of you for getting help", type: "safe" },
            { user: "old_toxic_friend", text: "come back, we miss you", type: "toxic" },
            { user: "therapist", text: "Remember your coping strategies", type: "safe" }
        ],
        chromaResponses: {
            "recovery": "🌟 Recovery is possible! It takes courage to admit you need help and even more to accept it.",
            "relapse": "⚠️ Old toxic friends will try to pull you back. Stay strong. You've come too far.",
            "therapy": "🧠 Therapy works. Coping strategies help you handle pressure without falling back into bad habits.",
            "choice": "🔀 This is your moment. Choose the life you want, not the one toxic people want for you.",
            "victory": "🏆 Real victory isn't winning games - it's winning back your life, health, and future.",
            "default": "✨ Scene 6 is about redemption. You can break free from toxic patterns. Choose wisely."
        },
        advice: "Recovery is a choice you make every day. Surround yourself with support, not toxicity."
    }
};

/**
 * Get ChromaBot response for current scene
 */
function getSceneChromaBotResponse(sceneNumber, question) {
    const sceneKey = `scene${sceneNumber}`;
    const sceneData = CHROMABOT_SCENE_TRAINING[sceneKey];
    
    if (!sceneData) {
        return null; // No scene data, let other handlers process
    }
    
    // Check for keyword matches in scene-specific responses (excluding 'default')
    const questionLower = question.toLowerCase();
    for (const [keyword, response] of Object.entries(sceneData.chromaResponses)) {
        if (keyword !== 'default' && questionLower.includes(keyword)) {
            return response;
        }
    }
    
    // No keyword match - return null to let easter eggs/API handle it
    return null;
}

/**
 * Get scene-specific messages for pause dashboard
 */
function getSceneMessages(sceneNumber) {
    const sceneKey = `scene${sceneNumber}`;
    const sceneData = CHROMABOT_SCENE_TRAINING[sceneKey];
    
    return sceneData ? sceneData.messages : [];
}

/**
 * Get scene advice
 */
function getSceneAdvice(sceneNumber) {
    const sceneKey = `scene${sceneNumber}`;
    const sceneData = CHROMABOT_SCENE_TRAINING[sceneKey];
    
    return sceneData ? sceneData.advice : "Stay alert and make smart choices!";
}

// Export functions
if (typeof window !== 'undefined') {
    window.getSceneChromaBotResponse = getSceneChromaBotResponse;
    window.getSceneMessages = getSceneMessages;
    window.getSceneAdvice = getSceneAdvice;
    window.CHROMABOT_SCENE_TRAINING = CHROMABOT_SCENE_TRAINING;
}
