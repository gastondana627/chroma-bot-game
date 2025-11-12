/**
 * Tutorial Overlay System
 * Shows first-time user tutorial before Scene 1
 */

class TutorialOverlay {
    constructor() {
        this.hasSeenTutorial = localStorage.getItem('datableed_tutorial_seen') === 'true';
    }

    show() {
        // Don't show if user has already seen it
        if (this.hasSeenTutorial) {
            console.log('📚 Tutorial already seen, skipping');
            return;
        }

        console.log('📚 Showing tutorial overlay');
        
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.innerHTML = `
            <div class="tutorial-content">
                <div class="tutorial-header">
                    <h2>🎮 How to Play</h2>
                </div>
                
                <div class="tutorial-body">
                    <div class="tutorial-section">
                        <div class="tutorial-icon">🎯</div>
                        <h3>Trust Score System</h3>
                        <p>Your choices affect Eli's <strong>Trust Score</strong>. This measures how vulnerable he is to online manipulation.</p>
                    </div>
                    
                    <div class="tutorial-section">
                        <div class="tutorial-icon">✅</div>
                        <h3>Good Choices</h3>
                        <p><span class="score-positive">Increase</span> Eli's awareness and protection against scams.</p>
                    </div>
                    
                    <div class="tutorial-section">
                        <div class="tutorial-icon">⚠️</div>
                        <h3>Risky Choices</h3>
                        <p><span class="score-negative">Decrease</span> Eli's trust score and make him more vulnerable.</p>
                    </div>
                    
                    <div class="tutorial-section tutorial-goal">
                        <div class="tutorial-icon">🏆</div>
                        <h3>Your Goal</h3>
                        <p>Keep Eli's Trust Score <strong>above 60</strong> to protect him from getting compromised.</p>
                    </div>
                </div>
                
                <div class="tutorial-footer">
                    <button class="tutorial-btn" onclick="window.tutorialOverlay.dismiss()">
                        <span>Got It! Let's Play</span>
                        <span class="btn-arrow">→</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.addStyles();
        
        // Fade in
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 100);
    }

    dismiss() {
        const overlay = document.querySelector('.tutorial-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                console.log('📚 Tutorial dismissed');
            }, 300);
        }
        
        // Mark as seen
        localStorage.setItem('datableed_tutorial_seen', 'true');
        this.hasSeenTutorial = true;
    }

    reset() {
        // For testing - reset tutorial
        localStorage.removeItem('datableed_tutorial_seen');
        this.hasSeenTutorial = false;
        console.log('📚 Tutorial reset');
    }

    addStyles() {
        if (document.getElementById('tutorial-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'tutorial-styles';
        styles.textContent = `
            .tutorial-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 50000;
                opacity: 0;
                transition: opacity 0.3s ease;
                padding: 20px;
                overflow-y: auto;
            }

            .tutorial-content {
                max-width: 600px;
                width: 100%;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
                border: 2px solid #00ffff;
                border-radius: 16px;
                padding: 30px;
                box-shadow: 0 0 40px rgba(0, 255, 255, 0.3);
                animation: tutorialSlideIn 0.5s ease-out;
            }

            @keyframes tutorialSlideIn {
                from {
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .tutorial-header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid rgba(0, 255, 255, 0.3);
            }

            .tutorial-header h2 {
                margin: 0;
                color: #00ffff;
                font-size: 2rem;
                font-family: 'Orbitron', monospace;
                text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            }

            .tutorial-body {
                margin-bottom: 30px;
            }

            .tutorial-section {
                margin-bottom: 25px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.3);
                border-left: 3px solid rgba(0, 255, 255, 0.5);
                border-radius: 8px;
            }

            .tutorial-section.tutorial-goal {
                background: rgba(0, 255, 255, 0.1);
                border-left-color: #00ffff;
                border-left-width: 4px;
            }

            .tutorial-icon {
                font-size: 2rem;
                margin-bottom: 10px;
            }

            .tutorial-section h3 {
                margin: 0 0 10px 0;
                color: #00ffff;
                font-size: 1.2rem;
                font-family: 'Orbitron', monospace;
            }

            .tutorial-section p {
                margin: 0;
                color: rgba(255, 255, 255, 0.9);
                font-size: 1rem;
                line-height: 1.6;
                font-family: 'Courier New', monospace;
            }

            .score-positive {
                color: #00ff88;
                font-weight: bold;
            }

            .score-negative {
                color: #ff4444;
                font-weight: bold;
            }

            .tutorial-footer {
                text-align: center;
            }

            .tutorial-btn {
                padding: 15px 40px;
                background: linear-gradient(135deg, #00ffff, #00ff88);
                border: none;
                border-radius: 8px;
                color: #000;
                font-size: 1.1rem;
                font-weight: bold;
                font-family: 'Orbitron', monospace;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 15px rgba(0, 255, 255, 0.4);
            }

            .tutorial-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 25px rgba(0, 255, 255, 0.6);
            }

            .tutorial-btn:active {
                transform: translateY(-1px);
            }

            .btn-arrow {
                font-size: 1.3rem;
                transition: transform 0.3s ease;
            }

            .tutorial-btn:hover .btn-arrow {
                transform: translateX(5px);
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .tutorial-content {
                    padding: 20px;
                }

                .tutorial-header h2 {
                    font-size: 1.5rem;
                }

                .tutorial-section {
                    padding: 15px;
                }

                .tutorial-section h3 {
                    font-size: 1.1rem;
                }

                .tutorial-section p {
                    font-size: 0.95rem;
                }

                .tutorial-btn {
                    padding: 12px 30px;
                    font-size: 1rem;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Initialize and export
if (typeof window !== 'undefined') {
    window.tutorialOverlay = new TutorialOverlay();
    window.TutorialOverlay = TutorialOverlay;
    console.log('✅ Tutorial Overlay system loaded');
}
