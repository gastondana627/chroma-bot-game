/**
 * QR Code Logo Transformation System
 * Transforms the animated Data Bleed logo into a scannable QR code
 * Links to creator's LinkedIn: https://www.linkedin.com/in/gaston-d-859653184/
 */
class QRLogoSystem {
    constructor() {
        this.linkedInURL = 'https://www.linkedin.com/in/gaston-d-859653184/';
        this.qrSize = 200;
        this.isTransformed = false;
        this.isLibraryLoaded = false;
        this.init();
    }

    init() {
        console.log('🔗 QR Logo System initializing...');
        this.loadQRLibrary();
    }

    loadQRLibrary() {
        // Check if QRCode library is already loaded
        if (window.QRCode) {
            this.isLibraryLoaded = true;
            console.log('✅ QR Code library already loaded');
            return;
        }

        // Load QR code generation library from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
        script.onload = () => {
            this.isLibraryLoaded = true;
            console.log('✅ QR Code library loaded successfully');
        };
        script.onerror = () => {
            console.error('❌ Failed to load QR Code library');
            this.isLibraryLoaded = false;
        };
        document.head.appendChild(script);
    }

    /**
     * Transform logo animation into QR code
     * @param {HTMLElement} logoElement - The logo element to transform
     */
    async transformToQR(logoElement) {
        if (this.isTransformed) {
            console.log('⚠️ Logo already transformed to QR code');
            return;
        }

        if (!this.isLibraryLoaded) {
            console.warn('⚠️ QR library not loaded yet, waiting...');
            // Wait for library to load
            await this.waitForLibrary();
        }

        if (!logoElement) {
            console.error('❌ Logo element not found');
            return;
        }

        console.log('🎨 Starting logo to QR transformation...');

        // Create QR container
        const qrContainer = document.createElement('div');
        qrContainer.id = 'qr-logo-container';
        qrContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 1s ease;
            z-index: 1000;
        `;

        // Create wrapper for styling
        const qrWrapper = document.createElement('div');
        qrWrapper.style.cssText = `
            padding: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 3px solid #00ffff;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.1);
            animation: qrPulse 2s ease-in-out infinite;
            cursor: pointer;
            position: relative;
        `;

        // Create QR code element
        const qrElement = document.createElement('div');
        qrElement.id = 'qr-code';
        qrWrapper.appendChild(qrElement);

        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'qr-tooltip';
        tooltip.textContent = '📱 Scan to connect with the creator';
        tooltip.style.cssText = `
            position: absolute;
            bottom: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 255, 255, 0.9);
            color: #000;
            padding: 8px 15px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-family: 'Orbitron', monospace;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        qrWrapper.appendChild(tooltip);

        qrContainer.appendChild(qrWrapper);

        // Apply glitch transition to logo
        this.applyGlitchTransition(logoElement);

        // Wait for glitch animation
        await this.sleep(1000);

        // Fade out logo
        logoElement.style.transition = 'opacity 0.5s ease';
        logoElement.style.opacity = '0';

        await this.sleep(500);

        // Insert QR container
        logoElement.parentElement.appendChild(qrContainer);

        // Generate QR code
        try {
            new QRCode(qrElement, {
                text: this.linkedInURL,
                width: this.qrSize,
                height: this.qrSize,
                colorDark: '#00ffff',
                colorLight: '#000000',
                correctLevel: QRCode.CorrectLevel.M
            });

            console.log('✅ QR code generated successfully');
        } catch (error) {
            console.error('❌ Error generating QR code:', error);
            // Fallback: show text link
            qrElement.innerHTML = `
                <div style="
                    width: ${this.qrSize}px;
                    height: ${this.qrSize}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #000;
                    color: #00ffff;
                    text-align: center;
                    padding: 20px;
                    font-size: 0.9rem;
                ">
                    <a href="${this.linkedInURL}" target="_blank" style="color: #00ffff; text-decoration: none;">
                        Connect on LinkedIn →
                    </a>
                </div>
            `;
        }

        // Fade in QR code
        await this.sleep(100);
        qrContainer.style.opacity = '1';

        // Add hover effect
        qrWrapper.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });

        qrWrapper.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });

        // Click to open LinkedIn
        qrWrapper.addEventListener('click', () => {
            window.open(this.linkedInURL, '_blank');
            console.log('🔗 LinkedIn link opened');
            
            // Track event
            if (window.gtag) {
                gtag('event', 'qr_code_click', {
                    'event_category': 'engagement',
                    'event_label': 'linkedin'
                });
            }
        });

        this.isTransformed = true;
        console.log('✅ Logo transformed to QR code');

        // Add pulse animation styles
        this.addAnimationStyles();
    }

    applyGlitchTransition(element) {
        element.style.animation = 'logoToQRGlitch 1s ease-in-out';
        
        // Remove animation after it completes
        setTimeout(() => {
            element.style.animation = '';
        }, 1000);
    }

    addAnimationStyles() {
        if (document.getElementById('qr-logo-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'qr-logo-styles';
        styles.textContent = `
            @keyframes logoToQRGlitch {
                0%, 100% { 
                    transform: translate(0); 
                    filter: none; 
                }
                10% { 
                    transform: translate(-5px, 5px); 
                    filter: hue-rotate(90deg); 
                }
                20% { 
                    transform: translate(5px, -5px); 
                    filter: hue-rotate(180deg); 
                }
                30% { 
                    transform: translate(-5px, -5px); 
                    filter: invert(1); 
                }
                40% { 
                    transform: translate(5px, 5px); 
                    filter: hue-rotate(270deg); 
                }
                50% { 
                    transform: translate(-3px, 3px) scale(0.95); 
                    filter: saturate(3); 
                }
                60% { 
                    transform: translate(3px, -3px) scale(1.05); 
                    filter: brightness(2); 
                }
                70% { 
                    transform: translate(-2px, 2px); 
                    filter: contrast(3); 
                }
                80% { 
                    transform: translate(2px, -2px); 
                    filter: hue-rotate(180deg); 
                }
                90% { 
                    transform: translate(-1px, 1px); 
                    filter: blur(2px); 
                }
            }

            @keyframes qrPulse {
                0%, 100% { 
                    box-shadow: 0 0 30px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.1);
                    transform: scale(1);
                }
                50% { 
                    box-shadow: 0 0 50px rgba(0, 255, 255, 0.9), inset 0 0 30px rgba(0, 255, 255, 0.2);
                    transform: scale(1.02);
                }
            }

            #qr-logo-container:hover #qr-code {
                transform: scale(1.05);
                transition: transform 0.3s ease;
            }
        `;
        document.head.appendChild(styles);
    }

    waitForLibrary(timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                if (this.isLibraryLoaded) {
                    clearInterval(checkInterval);
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    reject(new Error('QR library load timeout'));
                }
            }, 100);
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Auto-detect and transform logo after animation
     * Call this from your intro screen
     */
    autoTransformAfterAnimation() {
        console.log('🔍 Watching for logo animation completion...');

        // Try to find logo video element
        const logoVideo = document.querySelector('video[src*="DataBleed_Logo"]') || 
                         document.querySelector('video[src*="logo"]') ||
                         document.querySelector('#logo-video');

        if (logoVideo) {
            console.log('📹 Found logo video element');
            
            // Wait for video to end
            logoVideo.addEventListener('ended', () => {
                console.log('🎬 Logo animation ended, transforming to QR...');
                setTimeout(() => {
                    this.transformToQR(logoVideo);
                }, 500);
            });

            // Fallback: transform after 10 seconds if video doesn't end
            setTimeout(() => {
                if (!this.isTransformed) {
                    console.log('⏰ Timeout reached, transforming to QR...');
                    this.transformToQR(logoVideo);
                }
            }, 10000);
        } else {
            console.warn('⚠️ Logo video element not found');
            
            // Try to find any logo element
            const logoElement = document.querySelector('.logo-animation') ||
                              document.querySelector('[class*="logo"]') ||
                              document.querySelector('#logo');
            
            if (logoElement) {
                console.log('🎨 Found logo element, transforming after delay...');
                setTimeout(() => {
                    this.transformToQR(logoElement);
                }, 3000);
            }
        }
    }
}

// Initialize QR Logo System
window.qrLogoSystem = new QRLogoSystem();

console.log('🔗 QR Logo System loaded and ready');
