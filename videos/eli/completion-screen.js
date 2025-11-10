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
        align-items: flex-start;
        justify-content: center;
        z-index: 20000;
        opacity: 0;
        transition: opacity 0.5s ease;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 40px 20px;
    `;
    
    completionScreen.innerHTML = `
        <div style="max-width: 700px; width: 100%; text-align: center; padding: 20px; margin: 0 auto;">
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
            
            <!-- Email signup handled by modal (triggered automatically) -->
            
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
                    A Data Bleed Experience
                </div>
                <div style="
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.4);
                    margin-bottom: 15px;
                ">
                    📱 Connect with the creator
                </div>
                <!-- Animated Logo that transforms to QR Code -->
                <div id="completion-logo-container" style="
                    width: 150px;
                    height: 150px;
                    margin: 15px auto;
                    padding: 10px;
                    background: rgba(0, 0, 0, 0.8);
                    border: 2px solid rgba(0, 255, 255, 0.5);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
                    position: relative;
                    overflow: hidden;
                " onclick="window.open('https://www.linkedin.com/in/gaston-d-859653184/', '_blank')">
                    <!-- Logo will be inserted here based on ending type -->
                </div>
                <div style="
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin-top: 10px;
                ">
                    Scan or click to connect on LinkedIn
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(completionScreen);
    
    // Fade in
    setTimeout(() => {
        completionScreen.style.opacity = '1';
    }, 100);
    
    // Email signup now handled by the modal system (triggered automatically below)
    
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
    
    // Animate logo then transform to QR code
    setTimeout(() => {
        const logoContainer = document.getElementById('completion-logo-container');
        
        if (!logoContainer) return;
        
        console.log(`🎬 Starting logo animation for ${endingType} ending...`);
        
        // Choose animation based on ending type
        if (showEmailSignup) {
            // SUCCESS: Show Data Bleed logo video
            showDataBleedVideo();
        } else {
            // FAILURE: Show ChromaBot corrupted animation
            showChromaBotAnimation();
        }
        
        // Function to show Data Bleed video (for success)
        function showDataBleedVideo() {
            const video = document.createElement('video');
            video.style.cssText = 'width: 130px; height: 130px; object-fit: contain;';
            video.muted = true;
            video.playsInline = true;
            video.src = '../../Main_Animations/DataBleed_Logo_Animation_Adobe_Take_10.mp4';
            
            logoContainer.appendChild(video);
            
            video.play().then(() => {
                console.log('✅ Data Bleed logo video playing');
            }).catch(err => {
                console.warn('⚠️ Video autoplay failed:', err);
            });
            
            // When video ends, transform to QR
            video.addEventListener('ended', () => {
                console.log('✅ Video ended, transforming to QR...');
                setTimeout(() => {
                    transformToQR(video);
                }, 500);
            });
        }
        
        // Function to show ChromaBot animation (for failure)
        function showChromaBotAnimation() {
            const logoFrame = document.createElement('img');
            logoFrame.style.cssText = 'width: 130px; height: 130px; object-fit: contain;';
            logoFrame.src = '../../chroma-bot/assets/img/Chroma_Org_Logo_No_Background/Chroma_1.png';
            logoContainer.appendChild(logoFrame);
            
            // Animate through logo frames
            let currentFrame = 0;
            const totalFrames = 5;
            const frameDelay = 150;
            const cycles = 3;
            let cycleCount = 0;
            
            const animateFrames = setInterval(() => {
                currentFrame = (currentFrame + 1) % totalFrames;
                const frameNumber = currentFrame + 1;
                logoFrame.src = `../../chroma-bot/assets/img/Chroma_Org_Logo_No_Background/Chroma_${frameNumber}.png`;
                
                if (currentFrame === 0) {
                    cycleCount++;
                    if (cycleCount >= cycles) {
                        clearInterval(animateFrames);
                        console.log('✅ ChromaBot animation complete, transforming to QR...');
                        setTimeout(() => {
                            transformToQR(logoFrame);
                        }, 500);
                    }
                }
            }, frameDelay);
        }
        
        // Function to transform logo to QR code
        function transformToQR(element) {
            // Apply glitch effect
            element.style.animation = 'logoGlitch 0.5s ease-in-out';
            
            setTimeout(() => {
                // Fade out logo
                element.style.transition = 'opacity 0.3s ease';
                element.style.opacity = '0';
                
                setTimeout(() => {
                    // Replace with QR code
                    generateQR();
                }, 300);
            }, 500);
        }
        
        // Function to generate QR code
        function generateQR() {
            // Clear container
            logoContainer.innerHTML = '';
            
            // Create QR element
            const qrElement = document.createElement('div');
            qrElement.id = 'completion-qr-code';
            qrElement.style.cssText = 'opacity: 0; transition: opacity 0.5s ease;';
            logoContainer.appendChild(qrElement);
            
            // Load QR library if needed
            if (window.QRCode) {
                createQRCode(qrElement);
            } else {
                console.log('📦 Loading QR Code library...');
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
                script.onload = () => {
                    console.log('✅ QR Code library loaded');
                    createQRCode(qrElement);
                };
                script.onerror = () => {
                    console.warn('❌ Failed to load QR Code library');
                    showFallback(qrElement);
                };
                document.head.appendChild(script);
            }
        }
        
        function createQRCode(container) {
            try {
                new QRCode(container, {
                    text: 'https://www.linkedin.com/in/gaston-d-859653184/',
                    width: 130,
                    height: 130,
                    colorDark: '#00ffff',
                    colorLight: '#000000',
                    correctLevel: QRCode.CorrectLevel.M
                });
                
                // Style the generated elements
                setTimeout(() => {
                    const img = container.querySelector('img');
                    const canvas = container.querySelector('canvas');
                    
                    // QR library creates both canvas and img - hide canvas, show only img
                    if (canvas) {
                        canvas.style.display = 'none';
                    }
                    if (img) {
                        img.style.cssText = 'display: block; margin: 0 auto; width: 130px; height: 130px; object-fit: contain;';
                    }
                    
                    // Fade in QR code
                    container.style.opacity = '1';
                    
                    console.log('✅ QR code generated and displayed');
                }, 100);
                
            } catch (error) {
                console.warn('⚠️ Could not generate QR code:', error);
                showFallback(container);
            }
        }
        
        function showFallback(container) {
            container.innerHTML = `
                <div style="
                    width: 130px;
                    height: 130px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 255, 255, 0.1);
                    border: 2px dashed #00ffff;
                    border-radius: 8px;
                    margin: 0 auto;
                ">
                    <a href="https://www.linkedin.com/in/gaston-d-859653184/" target="_blank" style="
                        color: #00ffff;
                        text-decoration: none;
                        font-size: 0.9rem;
                        font-weight: bold;
                        text-align: center;
                    ">
                        🔗<br>Connect on<br>LinkedIn
                    </a>
                </div>
            `;
            container.style.opacity = '1';
        }
        
        // Add glitch animation styles
        if (!document.getElementById('logo-glitch-styles')) {
            const glitchStyles = document.createElement('style');
            glitchStyles.id = 'logo-glitch-styles';
            glitchStyles.textContent = `
                @keyframes logoGlitch {
                    0%, 100% { transform: translate(0); filter: none; }
                    10% { transform: translate(-3px, 3px); filter: hue-rotate(90deg); }
                    20% { transform: translate(3px, -3px); filter: hue-rotate(180deg); }
                    30% { transform: translate(-3px, -3px); filter: invert(1); }
                    40% { transform: translate(3px, 3px); filter: hue-rotate(270deg); }
                    50% { transform: translate(-2px, 2px) scale(0.95); filter: saturate(3); }
                    60% { transform: translate(2px, -2px) scale(1.05); filter: brightness(2); }
                    70% { transform: translate(-1px, 1px); filter: contrast(3); }
                    80% { transform: translate(1px, -1px); filter: hue-rotate(180deg); }
                    90% { transform: translate(-1px, 1px); filter: blur(1px); }
                }
            `;
            document.head.appendChild(glitchStyles);
        }
    }, 500);
    
    // Trigger email signup modal ONLY for successful completions (60+)
    if (showEmailSignup && window.emailSignup) {
        console.log(`✅ Player passed with score ${finalScore}! Triggering email signup...`);
        window.emailSignup.triggerOnStoryCompletion();
    } else {
        console.log(`❌ Player failed with score ${finalScore}. No email signup shown.`);
    }
}

// Update email signup modal message based on score
function updateEmailModalForWinners() {
    const modalHeader = document.querySelector('.email-modal-header h2');
    const modalIntro = document.querySelector('.modal-intro');
    
    if (modalHeader) {
        modalHeader.textContent = '🎉 Congratulations! You Passed!';
    }
    
    if (modalIntro) {
        modalIntro.textContent = "You've successfully protected Eli! Want to be first to know when Maya and Stanley's adventures are ready?";
    }
}

// Make globally accessible
window.showCompletionScreen = showCompletionScreen;
