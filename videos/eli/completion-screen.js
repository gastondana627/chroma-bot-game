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
        endingMessage = `Eli saw through every manipulation attempt. He recognized the red flags, verified suspicious claims, and protected his personal information. He's not just safe—he's teaching others how to spot scams. This is what digital literacy looks like.`;
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
    } else if (finalScore >= 70) {
        // GOOD ENDING - 70-99
        endingType = 'good';
        endingTitle = 'ASSESSMENT COMPLETE: AWARE';
        endingMessage = `Eli made smart choices when it mattered most. He questioned suspicious offers, protected his accounts, and stayed skeptical. While he's not invincible, he's significantly safer than most gamers his age. The scammers moved on to easier targets.`;
        endingColor = '#ffd700';
        showEmailSignup = true;
        showRestart = false;
    } else if (finalScore >= WINNING_THRESHOLD) {
        // MODERATE ENDING - 60-69 (barely passed)
        endingType = 'moderate';
        endingTitle = 'ASSESSMENT COMPLETE: VULNERABLE';
        endingMessage = `Eli passed... barely. He made some good choices, but also took risks that could have ended badly. He got lucky this time, but the scammers are getting smarter. One wrong click could still compromise everything. He needs to stay vigilant.`;
        endingColor = '#ffaa00';
        showEmailSignup = true;
        showRestart = false;
    } else {
        // FAILED ENDING - Below 60
        endingType = 'failed';
        endingTitle = 'ASSESSMENT FAILED: COMPROMISED';
        endingMessage = `Eli fell for it. The "tournament sponsor" was a scammer. His gaming account was compromised, his personal info leaked, and he lost $500 to a fake cryptocurrency investment. The "exclusive Discord" was a phishing operation. He trusted the wrong people, and now he's dealing with the consequences.`;
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
            
            ${showEmailSignup ? `
            <!-- Email Subscription Component -->
            <div style="
                margin-top: 40px;
                padding: 25px;
                background: rgba(0, 0, 0, 0.3);
                border: 2px solid rgba(0, 255, 255, 0.3);
                border-radius: 12px;
                backdrop-filter: blur(10px);
            ">
                <div style="
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 1.1rem;
                    margin-bottom: 15px;
                    font-family: 'Courier New', monospace;
                    text-align: center;
                    letter-spacing: 0.5px;
                ">Subscribe for updates on future character releases</div>
                
                <form id="completion-email-form" style="margin-bottom: 15px;">
                    <div style="display: flex; gap: 10px; max-width: 500px; margin: 0 auto; flex-wrap: wrap;">
                        <input 
                            type="email" 
                            name="email" 
                            id="completion-email-input"
                            placeholder="Enter your email address" 
                            required
                            style="
                                flex: 1;
                                min-width: 250px;
                                padding: 12px 16px;
                                background: rgba(0, 0, 0, 0.5);
                                border: 2px solid rgba(0, 255, 255, 0.3);
                                border-radius: 8px;
                                color: #ffffff;
                                font-family: 'Courier New', monospace;
                                font-size: 0.95rem;
                                transition: all 0.3s ease;
                            "
                            onfocus="this.style.borderColor='#00ffff'; this.style.boxShadow='0 0 15px rgba(0, 255, 255, 0.3)'; this.style.background='rgba(0, 0, 0, 0.7)';"
                            onblur="this.style.borderColor='rgba(0, 255, 255, 0.3)'; this.style.boxShadow='none'; this.style.background='rgba(0, 0, 0, 0.5)';">
                        
                        <input type="hidden" name="source" value="Data Bleed - Eli Completion">
                        <input type="hidden" name="trust_score" value="${Math.floor(finalScore)}">
                        <input type="hidden" name="_subject" value="New Data Bleed Character Release Signup!">
                        
                        <button 
                            type="submit"
                            style="
                                padding: 12px 24px;
                                background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 200, 255, 0.3));
                                border: 2px solid rgba(0, 255, 255, 0.5);
                                border-radius: 8px;
                                color: #ffffff;
                                font-family: 'Courier New', monospace;
                                font-size: 0.95rem;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                white-space: nowrap;
                            "
                            onmouseover="this.style.background='linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(0, 200, 255, 0.4))'; this.style.borderColor='#00ffff'; this.style.boxShadow='0 5px 20px rgba(0, 255, 255, 0.4)'; this.style.transform='translateY(-2px)';"
                            onmouseout="this.style.background='linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 200, 255, 0.3))'; this.style.borderColor='rgba(0, 255, 255, 0.5)'; this.style.boxShadow='none'; this.style.transform='translateY(0)';"
                            onmousedown="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 10px rgba(0, 255, 255, 0.3)';">
                            <span>📧</span>
                            <span id="completion-btn-text">Subscribe</span>
                        </button>
                    </div>
                </form>
                
                <div id="completion-email-success" style="
                    display: none;
                    color: #00ff88;
                    font-family: 'Courier New', monospace;
                    font-size: 0.95rem;
                    text-align: center;
                    padding: 12px;
                    background: rgba(0, 255, 136, 0.1);
                    border: 1px solid rgba(0, 255, 136, 0.3);
                    border-radius: 8px;
                    animation: successFadeIn 0.5s ease-out;
                ">
                    <span style="font-size: 1.3rem; margin-right: 8px;">✅</span>
                    Successfully subscribed! Thank you for your interest.
                </div>
            </div>
            ` : ''}
            
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
        @keyframes successFadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @media (max-width: 768px) {
            #completion-email-form > div {
                flex-direction: column !important;
            }
            #completion-email-form button {
                justify-content: center !important;
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Handle email form submission
    if (showEmailSignup) {
        setTimeout(() => {
            const emailForm = document.getElementById('completion-email-form');
            if (emailForm) {
                emailForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const submitBtn = emailForm.querySelector('button[type="submit"]');
                    const btnText = document.getElementById('completion-btn-text');
                    const emailInput = document.getElementById('completion-email-input');
                    const successMessage = document.getElementById('completion-email-success');
                    
                    // Show loading state
                    const originalText = btnText.textContent;
                    btnText.textContent = 'Subscribing...';
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.6';
                    
                    try {
                        const formData = new FormData(emailForm);
                        
                        const response = await fetch('https://formspree.io/f/mldarqvj', {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Accept': 'application/json'
                            }
                        });
                        
                        if (response.ok) {
                            // Hide form and show success message
                            emailForm.style.display = 'none';
                            successMessage.style.display = 'block';
                            console.log('✅ Email subscription successful!');
                        } else {
                            throw new Error('Subscription failed');
                        }
                    } catch (error) {
                        console.error('❌ Subscription error:', error);
                        // Reset button on error
                        btnText.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        alert('Subscription failed. Please try again or check your email address.');
                    }
                });
            }
        }, 100);
    }
    
    console.log(`✅ Completion screen shown: ${endingType} ending, score: ${finalScore}, threshold: ${WINNING_THRESHOLD}`);
    
    // Start logo animation immediately (no delay)
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
    
    // Show email widget for successful completions
    if (showEmailSignup && window.emailWidget) {
        console.log(`✅ Showing email widget for score ${finalScore}`);
        window.emailWidget.show();
    }
}

// Export to window
window.showCompletionScreen = showCompletionScreen;

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
