/**
 * Email Signup Widget - Top Left Corner
 * Toggleable widget that users can open/close freely
 */

class EmailSignupWidget {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createWidget();
        this.bindEvents();
        console.log('📧 Email Signup Widget initialized');
    }

    createWidget() {
        const widgetHTML = `
            <!-- Email Widget Toggle Button -->
            <div id="email-widget-toggle" class="email-widget-toggle" style="display: none;">
                <button class="email-toggle-btn" onclick="window.emailWidget.toggle()">
                    <span class="email-icon">📧</span>
                    <span class="email-text">Get Notified</span>
                </button>
            </div>

            <!-- Email Widget Panel -->
            <div id="email-widget-panel" class="email-widget-panel" style="display: none;">
                <div class="email-widget-header">
                    <h3>🎮 Get Notified!</h3>
                    <button class="email-widget-close" onclick="window.emailWidget.close()">&times;</button>
                </div>
                <div class="email-widget-body">
                    <p class="widget-intro">Want to know when Maya & Stanley's stories are ready?</p>
                    
                    <form id="email-widget-form" class="email-widget-form">
                        <input 
                            type="email" 
                            id="widget-email" 
                            name="email" 
                            required 
                            placeholder="your.email@example.com"
                            autocomplete="email">
                        
                        <input 
                            type="text" 
                            id="widget-name" 
                            name="name" 
                            placeholder="Your name (optional)"
                            autocomplete="name">
                        
                        <select name="character_interest" id="widget-character">
                            <option value="">Which character?</option>
                            <option value="maya">Maya - The Investigator</option>
                            <option value="stanley">Stanley - The Vulnerable</option>
                            <option value="both">Both!</option>
                        </select>
                        
                        <!-- Hidden fields -->
                        <input type="hidden" name="source" value="Data Bleed Game">
                        <input type="hidden" name="completed_story" value="Eli">
                        <input type="hidden" name="_subject" value="New Data Bleed Signup!">
                        
                        <button type="submit" class="widget-submit-btn">
                            <span class="btn-text">🔔 Notify Me!</span>
                            <span class="btn-loading" style="display: none;">⏳ Sending...</span>
                        </button>
                    </form>
                    
                    <div class="widget-success" style="display: none;">
                        <div class="success-icon">✅</div>
                        <p>Thanks! You'll be notified when new stories are available.</p>
                    </div>
                    
                    <div class="widget-error" style="display: none;">
                        <div class="error-icon">⚠️</div>
                        <p class="error-message"></p>
                        <button type="button" class="retry-btn" onclick="window.emailWidget.resetForm()">Try Again</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        this.addWidgetStyles();
    }

    addWidgetStyles() {
        const styles = `
            <style>
            /* Email Widget Styles */
            .email-widget-toggle {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 30000;
                animation: widgetPulse 2s ease-in-out infinite;
            }

            .email-toggle-btn {
                background: linear-gradient(45deg, #00ffff, #00ff88);
                border: 2px solid #00ffff;
                border-radius: 25px;
                padding: 12px 20px;
                color: #000;
                font-weight: bold;
                font-family: 'Orbitron', monospace;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
                transition: all 0.3s ease;
            }

            .email-toggle-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
            }

            .email-icon {
                font-size: 1.2rem;
            }

            .email-text {
                font-size: 0.9rem;
            }

            @keyframes widgetPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .email-widget-panel {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 350px;
                max-height: 90vh;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
                border: 2px solid #00ffff;
                border-radius: 12px;
                box-shadow: 0 0 40px rgba(0, 255, 255, 0.4);
                z-index: 30001;
                overflow-y: auto;
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .email-widget-header {
                padding: 15px 20px;
                border-bottom: 1px solid rgba(0, 255, 255, 0.3);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(0, 255, 255, 0.05);
            }

            .email-widget-header h3 {
                margin: 0;
                color: #00ffff;
                font-size: 1.1rem;
                font-family: 'Orbitron', monospace;
            }

            .email-widget-close {
                background: none;
                border: none;
                color: #00ffff;
                font-size: 1.5rem;
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .email-widget-close:hover {
                background: rgba(255, 0, 64, 0.2);
                transform: rotate(90deg);
            }

            .email-widget-body {
                padding: 20px;
                color: #fff;
            }

            .widget-intro {
                margin-bottom: 15px;
                color: #ccc;
                font-size: 0.9rem;
                line-height: 1.5;
            }

            .email-widget-form input,
            .email-widget-form select {
                width: 100%;
                padding: 10px;
                margin-bottom: 12px;
                background: rgba(0, 0, 0, 0.6);
                border: 1px solid #00ffff;
                border-radius: 6px;
                color: #fff;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
                box-sizing: border-box;
            }

            .email-widget-form input:focus,
            .email-widget-form select:focus {
                outline: none;
                border-color: #00ff88;
                box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
            }

            .email-widget-form input::placeholder {
                color: rgba(255, 255, 255, 0.4);
            }

            .widget-submit-btn {
                width: 100%;
                padding: 12px;
                background: linear-gradient(45deg, #00ffff, #00ff88);
                border: none;
                border-radius: 8px;
                color: #000;
                font-weight: bold;
                font-size: 1rem;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                transition: all 0.3s ease;
            }

            .widget-submit-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0, 255, 255, 0.5);
            }

            .widget-submit-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .widget-success,
            .widget-error {
                text-align: center;
                padding: 20px;
            }

            .success-icon,
            .error-icon {
                font-size: 3rem;
                margin-bottom: 10px;
            }

            .widget-success p {
                color: #00ff88;
                font-size: 0.9rem;
            }

            .widget-error .error-message {
                color: #ff0040;
                margin-bottom: 15px;
                font-size: 0.9rem;
            }

            .retry-btn {
                background: rgba(0, 255, 255, 0.2);
                border: 2px solid #00ffff;
                color: #00ffff;
                padding: 8px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                transition: all 0.3s ease;
            }

            .retry-btn:hover {
                background: rgba(0, 255, 255, 0.4);
            }

            /* Mobile responsive */
            @media (max-width: 480px) {
                .email-widget-panel {
                    width: calc(100vw - 40px);
                    left: 20px;
                    right: 20px;
                }

                .email-toggle-btn {
                    padding: 10px 15px;
                }

                .email-text {
                    display: none;
                }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindEvents() {
        const form = document.getElementById('email-widget-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitEmail();
            });
        }
    }

    show() {
        const toggle = document.getElementById('email-widget-toggle');
        if (toggle) {
            toggle.style.display = 'block';
        }
        console.log('📧 Email widget toggle shown');
    }

    hide() {
        const toggle = document.getElementById('email-widget-toggle');
        const panel = document.getElementById('email-widget-panel');
        if (toggle) toggle.style.display = 'none';
        if (panel) panel.style.display = 'none';
        this.isOpen = false;
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const panel = document.getElementById('email-widget-panel');
        if (panel) {
            panel.style.display = 'block';
            this.isOpen = true;
            
            // Focus on email input
            setTimeout(() => {
                const emailInput = document.getElementById('widget-email');
                if (emailInput) emailInput.focus();
            }, 300);
        }
    }

    close() {
        const panel = document.getElementById('email-widget-panel');
        if (panel) {
            panel.style.display = 'none';
            this.isOpen = false;
        }
    }

    async submitEmail() {
        const form = document.getElementById('email-widget-form');
        const submitBtn = form.querySelector('.widget-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        try {
            const formData = new FormData(form);
            formData.append('timestamp', new Date().toISOString());
            if (window.trustDecay) {
                formData.append('trust_score', window.trustDecay.getScore());
            }
            
            console.log('📧 Submitting email signup...');
            
            const response = await fetch('https://formspree.io/f/mldarqvj', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('✅ Email signup successful!');
                this.showSuccess();
            } else {
                throw new Error('Server responded with error');
            }
        } catch (error) {
            console.error('❌ Email signup error:', error);
            this.showError('Sorry, there was an error. Please try again.');
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    showSuccess() {
        const form = document.querySelector('.email-widget-form');
        const success = document.querySelector('.widget-success');
        const error = document.querySelector('.widget-error');
        
        if (form) form.style.display = 'none';
        if (error) error.style.display = 'none';
        if (success) success.style.display = 'block';
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            this.close();
            setTimeout(() => {
                this.resetForm();
            }, 500);
        }, 3000);
    }

    showError(message) {
        const form = document.querySelector('.email-widget-form');
        const success = document.querySelector('.widget-success');
        const error = document.querySelector('.widget-error');
        const errorMessage = error?.querySelector('.error-message');
        
        if (form) form.style.display = 'none';
        if (success) success.style.display = 'none';
        if (error) error.style.display = 'block';
        if (errorMessage) errorMessage.textContent = message;
    }

    resetForm() {
        const form = document.querySelector('.email-widget-form');
        const success = document.querySelector('.widget-success');
        const error = document.querySelector('.widget-error');
        
        if (form) {
            form.style.display = 'block';
            form.reset();
        }
        if (success) success.style.display = 'none';
        if (error) error.style.display = 'none';
    }
}

// Initialize widget
window.emailWidget = new EmailSignupWidget();

console.log('📧 Email Signup Widget loaded');
