/**
 * Completion Screen System
 * Shows appropriate ending based on final score with email signup
 */

function showCompletionScreen(finalScore) {
    const video = document.getElementById('story-video');
    if (video) video.pause();
    
    // Define thresholds
    const WINNING_THRESHOLD = 60; // Need 60+ to "win"
    const GOOD_ENDING_THRESHOLD = 100; // 100+ for best ending
    
    // Determine ending type
    let endingType, endingTitle, endingMessage, endingColor, showEmailSignup, showRestart;
    
    if (finalScore >= GOOD_ENDING_THRESHOLD) {
        // EXCELLENT ENDING - 100+
        endingType = 'excellent';
        endingTitle = 'ASSESSMENT COMPLETE: PROTECTED';
        endingMessage = 'Subject demonstrates strong digital literacy and resistance to manipulation. Low vulnerability to online threats.';
        endingColor = '#00ff88';
        showEmailSignup = true;
        showRestart = false;
        
        // Unlock achievement
        if (window.achievements) {
            window.achievements.unlockAchievement('story', 'good_ending');
            if (finalScore >= 120) {
                window.achievements.unlockAchievement('performance', 'perfect_score');
            }
        }
    } else if (finalScore >= WINNING_THRESHOLD) {
        // GOOD ENDING - 60-99
        endingType = 'good';
        endingTitle = 'ASSESSMENT COMPLETE: AWARE';
        endingMessage = 'Subject shows solid awareness and made mostly safe choices. Demonstrates adequate protection against common manipulation tactics.';
        endingColor = '#ffd700';
        showEmailSignup = true;
        showRestart = false;
    } else {
        // FAILED ENDING - Below 60
        endingType = 'failed';
        endingTitle = 'ASSESSMENT FAILED: COMPROMISED';
        endingMessage = `Subject fell victim to manipulation tactics. Trust score of ${Math.floor(finalScore)} is below the required threshold of ${WINNING_THRESHOLD}. Additional training required.`;
        endingColor = '#ff4444';
        showEmailSignup = false;
        showRestart = true;
    }
    
    // Unlock first completion
    if (window.achievements) {
        window.achievements.unlockAchievement('story', 'first_completion');
    }
    
    // Create completion screen
    const completionScreen = document.createElement('div');
    completionScreen.className = 'completion-screen';
    completionScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20000;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    
    completionScreen.innerHTML = `
        <div style="max-width: 700px; text-align: center; padding: 40px;">
            <!-- Ending Title -->
            <div style="
                font-size: 2.5rem;
                color: ${endingColor};
                margin-bottom: 20px;
                font-weight: bold;
                text-shadow: 0 0 20px ${endingColor};
                animation: glow 2s ease-in-out infinite;
            ">${endingTitle}</div>
            
            <!-- Final Score -->
            <div style="
                font-size: 4rem;
                color: ${endingColor};
                margin: 30px 0;
                font-weight: bold;
            ">
                TRUST SCORE: ${Math.floor(finalScore)}
            </div>
            
            <!-- Ending Message -->
            <p style="
                font-size: 1.2rem;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.8;
                margin-bottom: 40px;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            ">${endingMessage}</p>
            
            <!-- Email Signup (for winners) -->
            ${showEmailSignup ? `
                <div style="
                    background: rgba(0, 255, 136, 0.1);
                    border: 2px solid #00ff88;
                    border-radius: 12px;
                    padding: 30px;
                    margin: 40px 0;
                ">
                    <div style="
                        font-size: 1.5rem;
                        color: #00ff88;
                        margin-bottom: 15px;
                        font-weight: bold;
                    ">🎮 READY FOR MORE?</div>
                    <p style="
                        color: rgba(255, 255, 255, 0.9);
                        margin-bottom: 20px;
                        font-size: 1.1rem;
                    ">
                        You've proven your digital awareness. Get early access to Maya's and Stanley's stories.
                    </p>
                    <form id="email-signup-form" style="
                        display: flex;
                        gap: 10px;
                        max-width: 500px;
                        margin: 0 auto;
                    ">
                        <input 
                            type="email" 
                            id="email-input" 
                            placeholder="Enter your email"
                            required
                            style="
                                flex: 1;
                                padding: 15px;
                                background: rgba(0, 0, 0, 0.5);
                                border: 2px solid #00ff88;
                                border-radius: 8px;
                                color: #fff;
                                font-size: 1rem;
                                font-family: 'Courier New', monospace;
                            "
                        />
                        <button type="submit" style="
                            padding: 15px 30px;
                            background: rgba(0, 255, 136, 0.2);
                            border: 2px solid #00ff88;
                            border-radius: 8px;
                            color: #00ff88;
                            font-size: 1rem;
                            font-family: 'Courier New', monospace;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">Notify Me</button>
                    </form>
                    <div id="signup-message" style="
                        margin-top: 15px;
                        color: #00ff88;
                        font-size: 0.9rem;
                        display: none;
                    "></div>
                </div>
            ` : ''}
            
            <!-- Action Buttons -->
            <div style="display: flex; gap: 20px; justify-content: center; margin-top: 30px;">
                ${showRestart ? `
                    <!-- Failed - Show prominent restart button -->
                    <button onclick="location.reload()" style="
                        padding: 20px 60px;
                        background: rgba(255, 68, 68, 0.3);
                        border: 3px solid #ff4444;
                        border-radius: 8px;
                        color: #ff4444;
                        font-size: 1.3rem;
                        font-family: 'Courier New', monospace;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-weight: bold;
                        animation: pulse 2s ease-in-out infinite;
                    ">🔄 TRY AGAIN</button>
                    
                    <button onclick="window.location.href='../../Enhanced_Login_System/enhanced-character-selector.html'" style="
                        padding: 20px 40px;
                        background: rgba(255, 215, 0, 0.2);
                        border: 2px solid #ffd700;
                        border-radius: 8px;
                        color: #ffd700;
                        font-size: 1.1rem;
                        font-family: 'Courier New', monospace;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Choose Different Character</button>
                ` : `
                    <!-- Success - Show normal buttons -->
                    <button onclick="location.reload()" style="
                        padding: 15px 40px;
                        background: rgba(0, 255, 255, 0.2);
                        border: 2px solid #00ffff;
                        border-radius: 8px;
                        color: #00ffff;
                        font-size: 1.1rem;
                        font-family: 'Courier New', monospace;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Play Again</button>
                    
                    <button onclick="window.location.href='../../Enhanced_Login_System/enhanced-character-selector.html'" style="
                        padding: 15px 40px;
                        background: rgba(255, 215, 0, 0.2);
                        border: 2px solid #ffd700;
                        border-radius: 8px;
                        color: #ffd700;
                        font-size: 1.1rem;
                        font-family: 'Courier New', monospace;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Main Menu</button>
                `}
            </div>
            
            <!-- Credits with QR Code -->
            <div style="
                margin-top: 60px;
                padding-top: 30px;
                border-top: 1px solid rgba(0, 255, 255, 0.3);
            ">
                <div style="
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 15px;
                ">
                    Created by [Your Name]
                </div>
                <div style="
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.4);
                ">
                    Scan for more projects →
                </div>
                <!-- QR Code placeholder - add your actual QR code image -->
                <div style="
                    width: 100px;
                    height: 100px;
                    margin: 15px auto;
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(0, 255, 255, 0.3);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.5);
                ">
                    QR CODE<br>HERE
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(completionScreen);
    
    // Fade in
    setTimeout(() => {
        completionScreen.style.opacity = '1';
    }, 100);
    
    // Handle email signup
    if (showEmailSignup) {
        const form = document.getElementById('email-signup-form');
        const message = document.getElementById('signup-message');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email-input').value;
            
            // TODO: Send to your backend/email service
            console.log('📧 Email signup:', email);
            
            // Show success message
            message.textContent = '✅ Thanks! You\'ll be notified when new stories drop.';
            message.style.display = 'block';
            form.style.display = 'none';
            
            // Optional: Send to backend
            // await fetch('/api/signup', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, score: finalScore })
            // });
        });
    }
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glow {
            0%, 100% { text-shadow: 0 0 20px ${endingColor}; }
            50% { text-shadow: 0 0 40px ${endingColor}, 0 0 60px ${endingColor}; }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 68, 68, 0.5); }
            50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(255, 68, 68, 0.8); }
        }
    `;
    document.head.appendChild(style);
    
    console.log(`✅ Completion screen shown: ${endingType} ending, score: ${finalScore}, threshold: ${WINNING_THRESHOLD}`);
}

// Make globally accessible
window.showCompletionScreen = showCompletionScreen;
