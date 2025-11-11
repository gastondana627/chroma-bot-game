/**
 * Email Signup System for Data Bleed
 * Collects user emails for next level releases via Formspree
 * Target: gastondana627@gmail.com
 */
class EmailSignupSystem {
    constructor() {
        // Formspree form ID - safe to be public (client-side)
        // Form: https://formspree.io/f/mldarqvj
        this.apiEndpoint = 'https://formspree.io/f/mldarqvj';
        this.targetEmail = 'gastondana627@gmail.com';
        this.isSubmitting = false;
        this.init();
    }

    init() {
        this.createSignupModal();
        this.bindEvents();
        console.log('📧 Email Signup System initialized');
    }

    createSignupModal() {
        const modalHTML = `
            <div id="email-signup-modal" class="email-modal" style="display: none;">
                <div class="email-modal-overlay"></div>
                <div class="email-modal-content">
                    <div class="email-modal-header">
                        <h2>🎮 Get Notified for Maya & Stanley!</h2>
                        <button class="email-modal-close" type="button" aria-label="Close">&times;</button>
                    </div>
                    <div class="email-modal-body">
                        <p class="modal-intro">You've experienced Eli's story! Want to be first to know when Maya and Stanley's adventures are ready?</p>
                        
                        <form id="email-signup-form" class="email-signup-form">
                            <div class="form-group">
                                <label for="user-email">Email Address: <span class="required">*</span></label>
                                <input 
                                    type="email" 
                                    id="user-email" 
                                    name="email" 
                                    required 
                                    placeholder="your.email@example.com"
                                    autocomplete="email">
                            </div>
                            
                            <div class="form-group">
                                <label for="user-name">Name (Optional):</label>
                                <input 
                                    type="text" 
                                    id="user-name" 
                                    name="name" 
                                    placeholder="Your name"
                                    autocomplete="name">
                            </div>
                            
                            <div class="form-group">
                                <label>Which character are you most excited for?</label>
                                <select name="character_interest" id="character-interest">
                                    <option value="">Select one...</option>
                                    <option value="maya">Maya - The Investigator</option>
                                    <option value="stanley">Stanley - The Vulnerable</option>
                                    <option value="both">Both!</option>
                                </select>
                            </div>
                            
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" name="feedback" value="yes">
                                    <span>I'd like to provide feedback on Eli's story</span>
                                </label>
                            </div>
                            
                            <!-- Hidden fields for context -->
                            <input type="hidden" name="source" value="Data Bleed Game">
                            <input type="hidden" name="completed_story" value="Eli">
                            <input type="hidden" name="_subject" value="New Data Bleed Signup!">
                            
                            <button type="submit" class="email-submit-btn">
                                <span class="btn-text">🔔 Notify Me!</span>
                                <span class="btn-loading" style="display: none;">⏳ Sending...</span>
                            </button>
                        </form>
                        
                        <div class="email-success" style="display: none;">
                            <div class="success-icon">✅</div>
                            <h3>Thanks for signing up!</h3>
                            <p>You'll be the first to know when new stories are available.</p>
                        </div>
                        
                        <div class="email-error" style="display: none;">
                            <div class="error-icon">⚠️</div>
                            <p class="error-message"></p>
                            <button type="button" class="retry-btn" onclick="window.emailSignup.resetForm()">Try Again</button>
                        </div>
                    </div>
                    
                    <div class="email-modal-footer">
                        <p class="privacy-note">🔒 Your email is safe. No spam, just game updates.</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addModalStyles();
    }

    addModalStyles() {
        const styles = `
            <style>
            /* Email Signup Modal Styles */
            .email-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 25000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Orbitron', 'Courier New', monospace;
            }

            .email-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
            }

            .email-modal-content {
                position: relative;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%);
                border: 2px solid #00ffff;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1);
                animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-100px) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .email-modal-header {
                padding: 25px;
                border-bottom: 1px solid rgba(0, 255, 255, 0.3);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(0, 255, 255, 0.05);
            }

            .email-modal-header h2 {
                color: #00ffff;
                margin: 0;
                font-size: 1.4rem;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }

            .email-modal-close {
                background: none;
                border: none;
                color: #00ffff;
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
                line-height: 1;
            }

            .email-modal-close:hover {
                background: rgba(255, 0, 64, 0.2);
                transform: rotate(90deg);
                box-shadow: 0 0 15px rgba(255, 0, 64, 0.5);
            }

            .email-modal-body {
                padding: 30px;
                color: #fff;
            }

            .modal-intro {
                margin-bottom: 25px;
                line-height: 1.6;
                color: #ccc;
                font-size: 1rem;
            }

            .email-signup-form .form-group {
                margin-bottom: 20px;
            }

            .email-signup-form label {
                display: block;
                margin-bottom: 8px;
                color: #00ffff;
                font-weight: bold;
                font-size: 0.9rem;
            }

            .email-signup-form .required {
                color: #ff0040;
            }

            .email-signup-form input[type="email"],
            .email-signup-form input[type="text"],
            .email-signup-form select {
                width: 100%;
                padding: 12px;
                background: rgba(0, 0, 0, 0.6);
                border: 1px solid #00ffff;
                border-radius: 8px;
                color: #fff;
                font-size: 1rem;
                font-family: 'Courier New', monospace;
                transition: all 0.3s ease;
                box-sizing: border-box;
            }

            .email-signup-form input:focus,
            .email-signup-form select:focus {
                outline: none;
                border-color: #00ff88;
                box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
                background: rgba(0, 0, 0, 0.8);
            }

            .email-signup-form input::placeholder {
                color: rgba(255, 255, 255, 0.4);
            }

            .checkbox-group {
                display: flex;
                align-items: center;
            }

            .checkbox-group label {
                display: flex;
                align-items: center;
                cursor: pointer;
                margin: 0;
            }

            .checkbox-group input[type="checkbox"] {
                width: auto;
                margin-right: 10px;
                cursor: pointer;
                transform: scale(1.2);
            }

            .checkbox-group span {
                color: #ccc;
                font-weight: normal;
            }

            .email-submit-btn {
                width: 100%;
                padding: 15px;
                background: linear-gradient(45deg, #00ffff, #00ff88);
                border: none;
                border-radius: 10px;
                color: #000;
                font-weight: bold;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
                font-family: 'Orbitron', monospace;
                box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
            }

            .email-submit-btn:hover:not(:disabled) {
                transform: translateY(-3px);
                box-shadow: 0 6px 25px rgba(0, 255, 255, 0.5);
            }

            .email-submit-btn:active:not(:disabled) {
                transform: translateY(-1px);
            }

            .email-submit-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }

            .email-success,
            .email-error {
                text-align: center;
                padding: 30px 20px;
            }

            .success-icon,
            .error-icon {
                font-size: 4rem;
                margin-bottom: 15px;
                animation: iconPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            @keyframes iconPop {
                from {
                    transform: scale(0);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .email-success h3 {
                color: #00ff88;
                margin-bottom: 10px;
                font-size: 1.5rem;
            }

            .email-success p {
                color: #ccc;
                line-height: 1.6;
            }

            .email-error .error-message {
                color: #ff0040;
                margin-bottom: 20px;
                font-size: 1rem;
            }

            .retry-btn {
                background: rgba(0, 255, 255, 0.2);
                border: 2px solid #00ffff;
                color: #00ffff;
                padding: 10px 25px;
                border-radius: 8px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                transition: all 0.3s ease;
            }

            .retry-btn:hover {
                background: rgba(0, 255, 255, 0.4);
                transform: translateY(-2px);
            }

            .email-modal-footer {
                padding: 15px 30px;
                border-top: 1px solid rgba(0, 255, 255, 0.2);
                background: rgba(0, 0, 0, 0.3);
                text-align: center;
            }

            .privacy-note {
                margin: 0;
                color: #888;
                font-size: 0.85rem;
            }

            /* Mobile responsive */
            @media (max-width: 480px) {
                .email-modal-content {
                    width: 95%;
                    margin: 10px;
                    max-height: 95vh;
                }

                .email-modal-header {
                    padding: 20px 15px;
                }

                .email-modal-header h2 {
                    font-size: 1.1rem;
                }

                .email-modal-body {
                    padding: 20px 15px;
                }

                .modal-intro {
                    font-size: 0.9rem;
                }

                .email-submit-btn {
                    font-size: 1rem;
                    padding: 12px;
                }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindEvents() {
        // Close modal events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('email-modal-overlay') || 
                e.target.classList.contains('email-modal-close')) {
                this.hideModal();
            }
        });

        // Form submission
        const form = document.getElementById('email-signup-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitEmail();
            });
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalVisible()) {
                this.hideModal();
            }
        });
    }

    showModal() {
        const modal = document.getElementById('email-signup-modal');
        if (!modal) return;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus on email input
        setTimeout(() => {
            const emailInput = document.getElementById('user-email');
            if (emailInput) emailInput.focus();
        }, 300);
        
        console.log('📧 Email signup modal opened');
    }

    hideModal() {
        const modal = document.getElementById('email-signup-modal');
        if (!modal) return;
        
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        console.log('📧 Email signup modal closed');
    }

    isModalVisible() {
        const modal = document.getElementById('email-signup-modal');
        return modal && modal.style.display !== 'none';
    }

    async submitEmail() {
        if (this.isSubmitting) return;
        
        this.isSubmitting = true;
        const form = document.getElementById('email-signup-form');
        const submitBtn = form.querySelector('.email-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        try {
            const formData = new FormData(form);
            
            // Add timestamp and trust score if available
            formData.append('timestamp', new Date().toISOString());
            if (window.trustDecaySystem) {
                formData.append('trust_score', window.trustDecaySystem.getTrustScore());
            }
            
            console.log('📧 Submitting email signup...');
            
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('✅ Email signup successful!');
                this.showSuccess();
                
                // Track signup event
                if (window.gtag) {
                    gtag('event', 'email_signup', {
                        'event_category': 'engagement',
                        'event_label': 'story_completion'
                    });
                }
            } else {
                throw new Error('Server responded with error');
            }
        } catch (error) {
            console.error('❌ Email signup error:', error);
            this.showError('Sorry, there was an error. Please try again or email gastondana627@gmail.com directly.');
        } finally {
            this.isSubmitting = false;
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    showSuccess() {
        const form = document.querySelector('.email-signup-form');
        const success = document.querySelector('.email-success');
        const error = document.querySelector('.email-error');
        
        if (form) form.style.display = 'none';
        if (error) error.style.display = 'none';
        if (success) success.style.display = 'block';
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            this.hideModal();
            // Reset for next time
            setTimeout(() => {
                this.resetForm();
            }, 500);
        }, 3000);
    }

    showError(message) {
        const form = document.querySelector('.email-signup-form');
        const success = document.querySelector('.email-success');
        const error = document.querySelector('.email-error');
        const errorMessage = error?.querySelector('.error-message');
        
        if (form) form.style.display = 'none';
        if (success) success.style.display = 'none';
        if (error) error.style.display = 'block';
        if (errorMessage) errorMessage.textContent = message;
    }

    resetForm() {
        const form = document.querySelector('.email-signup-form');
        const success = document.querySelector('.email-success');
        const error = document.querySelector('.email-error');
        
        if (form) {
            form.style.display = 'block';
            form.reset();
        }
        if (success) success.style.display = 'none';
        if (error) error.style.display = 'none';
    }

    // Trigger methods
    triggerOnStoryCompletion() {
        // No longer auto-triggers - user clicks button instead
        console.log('🎉 Story completed! Email signup available via button.');
    }

    triggerOnCharacterLocked() {
        console.log('🔒 Locked character clicked! Showing email signup...');
        this.showModal();
    }
}

// Initialize email signup system
window.emailSignup = new EmailSignupSystem();

// Integration points
document.addEventListener('DOMContentLoaded', () => {
    // Trigger on story completion
    document.addEventListener('storyCompleted', () => {
        window.emailSignup?.triggerOnStoryCompletion();
    });
    
    // Trigger on locked character click
    document.addEventListener('lockedCharacterClick', () => {
        window.emailSignup?.triggerOnCharacterLocked();
    });
});

console.log('📧 Email Signup System loaded');
