/**
 * Responsive Gaming Interface System
 * Builds adaptive UI that works across different devices and screen sizes,
 * implements touch-friendly controls for mobile 3D interaction,
 * and creates accessibility features for diverse user abilities
 * Implements requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */

class ResponsiveGamingInterface {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        
        // Device detection
        this.deviceInfo = {
            isMobile: false,
            isTablet: false,
            isDesktop: false,
            hasTouch: false,
            screenSize: 'desktop',
            orientation: 'landscape',
            pixelRatio: 1
        };
        
        // Breakpoints for responsive design
        this.breakpoints = {
            mobile: 480,
            tablet: 768,
            desktop: 1024,
            large: 1440
        };
        
        // Touch interaction settings
        this.touchSettings = {
            tapThreshold: 10,
            longPressDelay: 500,
            swipeThreshold: 50,
            pinchThreshold: 0.1,
            doubleTapDelay: 300
        };
        
        // Accessibility settings
        this.accessibilitySettings = {
            highContrast: false,
            reducedMotion: false,
            largeText: false,
            keyboardNavigation: false,
            screenReader: false,
            colorBlindFriendly: false
        };
        
        // UI scaling factors
        this.scalingFactors = {
            mobile: 0.8,
            tablet: 0.9,
            desktop: 1.0,
            large: 1.1
        };
        
        // Current state
        this.currentBreakpoint = 'desktop';
        this.adaptiveElements = new Map();
        this.touchHandlers = new Map();
        this.resizeObserver = null;
        
        // Bind methods
        this.initialize = this.initialize.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleOrientationChange = this.handleOrientationChange.bind(this);
    }

    /**
     * Initialize the responsive gaming interface system
     * @param {Object} options - Initialization options
     * @returns {Promise<boolean>} Success status
     */
    async initialize(options = {}) {
        if (this.initialized) {
            console.log('📱 Responsive Gaming Interface already initialized');
            return true;
        }

        try {
            console.log('📱 Initializing Responsive Gaming Interface...');
            
            // Detect device capabilities
            this.detectDevice();
            
            // Detect accessibility preferences
            this.detectAccessibilityPreferences();
            
            // Set up responsive CSS
            this.setupResponsiveCSS();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Set up touch handlers if needed
            if (this.deviceInfo.hasTouch) {
                this.setupTouchHandlers();
            }
            
            // Set up keyboard navigation
            this.setupKeyboardNavigation();
            
            // Apply initial responsive layout
            this.applyResponsiveLayout();
            
            // Set up resize observer
            this.setupResizeObserver();
            
            this.initialized = true;
            console.log('✅ Responsive Gaming Interface initialized successfully');
            
            // Dispatch initialization event
            this.dispatchEvent('responsiveInterfaceInitialized', {
                version: this.version,
                deviceInfo: this.deviceInfo,
                accessibilitySettings: this.accessibilitySettings,
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Responsive Gaming Interface:', error);
            return false;
        }
    }

    /**
     * Detect device capabilities and characteristics
     */
    detectDevice() {
        // Screen size detection
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        if (width <= this.breakpoints.mobile) {
            this.deviceInfo.screenSize = 'mobile';
            this.deviceInfo.isMobile = true;
        } else if (width <= this.breakpoints.tablet) {
            this.deviceInfo.screenSize = 'tablet';
            this.deviceInfo.isTablet = true;
        } else if (width <= this.breakpoints.desktop) {
            this.deviceInfo.screenSize = 'desktop';
            this.deviceInfo.isDesktop = true;
        } else {
            this.deviceInfo.screenSize = 'large';
            this.deviceInfo.isDesktop = true;
        }
        
        // Touch capability detection
        this.deviceInfo.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Orientation detection
        this.deviceInfo.orientation = width > height ? 'landscape' : 'portrait';
        
        // Pixel ratio detection
        this.deviceInfo.pixelRatio = window.devicePixelRatio || 1;
        
        // User agent detection for specific optimizations
        const userAgent = navigator.userAgent.toLowerCase();
        this.deviceInfo.isIOS = /iphone|ipad|ipod/.test(userAgent);
        this.deviceInfo.isAndroid = /android/.test(userAgent);
        
        console.log('📱 Device detected:', this.deviceInfo);
    }

    /**
     * Detect accessibility preferences
     */
    detectAccessibilityPreferences() {
        // Check for reduced motion preference
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.accessibilitySettings.reducedMotion = true;
        }
        
        // Check for high contrast preference
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            this.accessibilitySettings.highContrast = true;
        }
        
        // Check for color scheme preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.accessibilitySettings.darkMode = true;
        }
        
        // Check for screen reader
        this.accessibilitySettings.screenReader = navigator.userAgent.includes('NVDA') || 
                                                  navigator.userAgent.includes('JAWS') ||
                                                  navigator.userAgent.includes('VoiceOver');
        
        console.log('♿ Accessibility preferences detected:', this.accessibilitySettings);
    }

    /**
     * Set up responsive CSS styles
     */
    setupResponsiveCSS() {
        if (document.getElementById('responsive-gaming-styles')) {
            return; // Already injected
        }

        const styles = document.createElement('style');
        styles.id = 'responsive-gaming-styles';
        styles.textContent = `
            /* Responsive Gaming Interface Styles */
            
            /* Base responsive utilities */
            .responsive-container {
                width: 100%;
                max-width: 100vw;
                overflow-x: hidden;
                position: relative;
            }

            .responsive-element {
                transition: all 0.3s ease;
                box-sizing: border-box;
            }

            /* Touch-friendly controls */
            .touch-friendly {
                min-height: 44px;
                min-width: 44px;
                padding: 12px;
                margin: 8px;
                border-radius: 8px;
                cursor: pointer;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            }

            .touch-friendly:active {
                transform: scale(0.95);
                opacity: 0.8;
            }

            /* Mobile-specific styles */
            @media (max-width: 480px) {
                .mobile-hidden { display: none !important; }
                .mobile-full-width { width: 100% !important; }
                .mobile-stack { flex-direction: column !important; }
                
                /* Gaming controls for mobile */
                .gaming-control-mobile {
                    position: fixed;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    padding: 16px;
                    z-index: 3000;
                }
                
                .pause-button-mobile {
                    top: 10px !important;
                    left: 10px !important;
                    padding: 8px 16px !important;
                    font-size: 14px !important;
                }
                
                .continue-button-mobile {
                    top: 10px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    padding: 10px 20px !important;
                    font-size: 14px !important;
                }
                
                .chroma-orb-mobile {
                    width: 60px !important;
                    height: 60px !important;
                    bottom: 15px !important;
                    right: 15px !important;
                }
                
                .chat-box-mobile {
                    bottom: 90px !important;
                    right: 15px !important;
                    left: 15px !important;
                    width: auto !important;
                    height: 300px !important;
                }
                
                .character-hud-mobile {
                    top: 60px !important;
                    left: 10px !important;
                    right: 10px !important;
                    width: auto !important;
                    padding: 12px !important;
                }
            }

            /* Tablet-specific styles */
            @media (min-width: 481px) and (max-width: 768px) {
                .tablet-hidden { display: none !important; }
                .tablet-adaptive { width: 90% !important; }
                
                .gaming-control-tablet {
                    position: fixed;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    border-radius: 10px;
                    padding: 14px;
                    z-index: 3000;
                }
                
                .chroma-orb-tablet {
                    width: 70px !important;
                    height: 70px !important;
                }
                
                .chat-box-tablet {
                    width: 320px !important;
                    height: 350px !important;
                }
            }

            /* Desktop and large screen styles */
            @media (min-width: 1024px) {
                .desktop-only { display: block !important; }
                .desktop-grid { display: grid !important; }
                
                .gaming-control-desktop {
                    position: fixed;
                    z-index: 3000;
                }
            }

            /* High contrast mode */
            .high-contrast {
                filter: contrast(150%) brightness(120%);
            }

            .high-contrast .glass-light,
            .high-contrast .glass-medium,
            .high-contrast .glass-heavy {
                background: rgba(255, 255, 255, 0.9) !important;
                color: #000 !important;
                border: 2px solid #000 !important;
            }

            /* Reduced motion */
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }

            /* Large text mode */
            .large-text {
                font-size: 1.2em !important;
            }

            .large-text .touch-friendly {
                min-height: 52px !important;
                min-width: 52px !important;
                padding: 16px !important;
            }

            /* Keyboard navigation */
            .keyboard-navigation *:focus {
                outline: 3px solid var(--accent-color, #00FFFF) !important;
                outline-offset: 2px !important;
            }

            /* Color blind friendly mode */
            .color-blind-friendly {
                filter: saturate(0.8) hue-rotate(15deg);
            }

            /* Touch interaction feedback */
            .touch-ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: touch-ripple 0.6s linear;
                pointer-events: none;
            }

            @keyframes touch-ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            /* 3D interaction controls for mobile */
            .mobile-3d-controls {
                position: fixed;
                bottom: 100px;
                left: 20px;
                right: 20px;
                display: flex;
                justify-content: space-between;
                z-index: 3000;
            }

            .mobile-3d-control {
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid var(--accent-color, #00FFFF);
                border-radius: 50%;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                cursor: pointer;
                user-select: none;
                backdrop-filter: blur(5px);
            }

            .mobile-3d-control:active {
                transform: scale(0.9);
                background: rgba(0, 0, 0, 0.9);
            }

            /* Orientation-specific styles */
            @media (orientation: portrait) {
                .portrait-stack {
                    flex-direction: column !important;
                }
                
                .portrait-full-height {
                    height: 100vh !important;
                }
            }

            @media (orientation: landscape) {
                .landscape-row {
                    flex-direction: row !important;
                }
                
                .landscape-sidebar {
                    width: 300px !important;
                    height: 100vh !important;
                }
            }

            /* Print styles */
            @media print {
                .no-print { display: none !important; }
                .print-only { display: block !important; }
            }
        `;
        
        document.head.appendChild(styles);
        console.log('✅ Responsive CSS styles injected');
    }

    /**
     * Set up event listeners for responsive behavior
     */
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.handleResize);
        
        // Orientation change
        window.addEventListener('orientationchange', this.handleOrientationChange);
        
        // Media query listeners for accessibility
        if (window.matchMedia) {
            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            reducedMotionQuery.addListener((e) => {
                this.accessibilitySettings.reducedMotion = e.matches;
                this.applyAccessibilitySettings();
            });
            
            const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
            highContrastQuery.addListener((e) => {
                this.accessibilitySettings.highContrast = e.matches;
                this.applyAccessibilitySettings();
            });
        }
        
        console.log('📱 Responsive event listeners set up');
    }

    /**
     * Set up touch handlers for mobile interaction
     */
    setupTouchHandlers() {
        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };
        let lastTap = 0;
        
        // Global touch event handlers
        document.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            
            // Add touch ripple effect
            this.createTouchRipple(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            
            // Handle double tap
            const currentTime = Date.now();
            const tapLength = currentTime - lastTap;
            if (tapLength < this.touchSettings.doubleTapDelay && tapLength > 0) {
                this.handleDoubleTap(e);
            }
            lastTap = currentTime;
            
            // Handle long press
            if (touchDuration > this.touchSettings.longPressDelay) {
                this.handleLongPress(e);
            }
        }, { passive: true });
        
        // Prevent zoom on double tap for gaming elements
        document.addEventListener('touchend', (e) => {
            if (e.target.closest('.gaming-control-mobile, .touch-friendly')) {
                e.preventDefault();
            }
        });
        
        console.log('👆 Touch handlers set up');
    }

    /**
     * Set up keyboard navigation
     */
    setupKeyboardNavigation() {
        // Tab navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
            
            // Gaming-specific keyboard shortcuts
            switch (e.key) {
                case 'Escape':
                    this.handleEscapeKey();
                    break;
                case ' ':
                    if (e.target.classList.contains('gaming-control')) {
                        e.preventDefault();
                        e.target.click();
                    }
                    break;
                case 'Enter':
                    if (e.target.classList.contains('gaming-control')) {
                        e.preventDefault();
                        e.target.click();
                    }
                    break;
            }
        });
        
        // Remove keyboard navigation class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        console.log('⌨️ Keyboard navigation set up');
    }

    /**
     * Apply responsive layout based on current screen size
     */
    applyResponsiveLayout() {
        const currentBreakpoint = this.getCurrentBreakpoint();
        
        if (currentBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = currentBreakpoint;
            
            // Apply device-specific classes
            document.body.classList.remove('mobile-device', 'tablet-device', 'desktop-device');
            document.body.classList.add(`${this.deviceInfo.screenSize}-device`);
            
            // Apply scaling
            const scalingFactor = this.scalingFactors[this.deviceInfo.screenSize];
            document.documentElement.style.setProperty('--responsive-scale', scalingFactor);
            
            // Update adaptive elements
            this.updateAdaptiveElements();
            
            console.log(`📱 Applied responsive layout for ${currentBreakpoint}`);
        }
    }

    /**
     * Set up resize observer for element-specific responsiveness
     */
    setupResizeObserver() {
        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver((entries) => {
                entries.forEach((entry) => {
                    const element = entry.target;
                    const { width, height } = entry.contentRect;
                    
                    // Apply size-specific classes
                    element.classList.toggle('small-size', width < 300);
                    element.classList.toggle('medium-size', width >= 300 && width < 600);
                    element.classList.toggle('large-size', width >= 600);
                    
                    // Trigger custom resize event for the element
                    element.dispatchEvent(new CustomEvent('elementResize', {
                        detail: { width, height }
                    }));
                });
            });
        }
    }

    /**
     * Make element responsive and adaptive
     * @param {HTMLElement} element - Target element
     * @param {Object} options - Responsive options
     */
    makeElementResponsive(element, options = {}) {
        if (!element) return false;
        
        // Add responsive classes
        element.classList.add('responsive-element');
        
        // Apply touch-friendly styling if needed
        if (this.deviceInfo.hasTouch && options.touchFriendly !== false) {
            element.classList.add('touch-friendly');
        }
        
        // Apply device-specific classes
        if (options.mobileClass && this.deviceInfo.isMobile) {
            element.classList.add(options.mobileClass);
        }
        if (options.tabletClass && this.deviceInfo.isTablet) {
            element.classList.add(options.tabletClass);
        }
        if (options.desktopClass && this.deviceInfo.isDesktop) {
            element.classList.add(options.desktopClass);
        }
        
        // Set up resize observation
        if (this.resizeObserver && options.observeResize) {
            this.resizeObserver.observe(element);
        }
        
        // Store adaptive configuration
        this.adaptiveElements.set(element, {
            options,
            originalStyles: {
                width: element.style.width,
                height: element.style.height,
                fontSize: element.style.fontSize,
                padding: element.style.padding,
                margin: element.style.margin
            }
        });
        
        console.log('📱 Made element responsive');
        return true;
    }

    /**
     * Create mobile 3D interaction controls
     * @param {string} character - Current character
     * @returns {HTMLElement} Controls container
     */
    createMobile3DControls(character) {
        if (!this.deviceInfo.isMobile) {
            return null;
        }
        
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'mobile-3d-controls';
        controlsContainer.id = 'mobile-3d-controls';
        
        // Rotate left control
        const rotateLeft = document.createElement('div');
        rotateLeft.className = 'mobile-3d-control';
        rotateLeft.innerHTML = '↺';
        rotateLeft.setAttribute('aria-label', 'Rotate left');
        rotateLeft.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handle3DRotation('left');
        });
        
        // Zoom control
        const zoomControl = document.createElement('div');
        zoomControl.className = 'mobile-3d-control';
        zoomControl.innerHTML = '🔍';
        zoomControl.setAttribute('aria-label', 'Zoom');
        zoomControl.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handle3DZoom();
        });
        
        // Rotate right control
        const rotateRight = document.createElement('div');
        rotateRight.className = 'mobile-3d-control';
        rotateRight.innerHTML = '↻';
        rotateRight.setAttribute('aria-label', 'Rotate right');
        rotateRight.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handle3DRotation('right');
        });
        
        controlsContainer.appendChild(rotateLeft);
        controlsContainer.appendChild(zoomControl);
        controlsContainer.appendChild(rotateRight);
        
        document.body.appendChild(controlsContainer);
        
        console.log('📱 Created mobile 3D controls');
        return controlsContainer;
    }

    /**
     * Apply accessibility settings
     */
    applyAccessibilitySettings() {
        // High contrast
        document.body.classList.toggle('high-contrast', this.accessibilitySettings.highContrast);
        
        // Reduced motion
        document.body.classList.toggle('reduced-motion', this.accessibilitySettings.reducedMotion);
        
        // Large text
        document.body.classList.toggle('large-text', this.accessibilitySettings.largeText);
        
        // Keyboard navigation
        document.body.classList.toggle('keyboard-navigation', this.accessibilitySettings.keyboardNavigation);
        
        // Color blind friendly
        document.body.classList.toggle('color-blind-friendly', this.accessibilitySettings.colorBlindFriendly);
        
        console.log('♿ Applied accessibility settings');
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Update device info
            this.detectDevice();
            
            // Apply responsive layout
            this.applyResponsiveLayout();
            
            // Dispatch resize event
            this.dispatchEvent('responsiveResize', {
                deviceInfo: this.deviceInfo,
                breakpoint: this.currentBreakpoint
            });
        }, 100);
    }

    /**
     * Handle orientation change
     */
    handleOrientationChange() {
        setTimeout(() => {
            // Update device info after orientation change
            this.detectDevice();
            
            // Apply responsive layout
            this.applyResponsiveLayout();
            
            // Dispatch orientation change event
            this.dispatchEvent('orientationChanged', {
                orientation: this.deviceInfo.orientation,
                deviceInfo: this.deviceInfo
            });
        }, 100);
    }

    /**
     * Create touch ripple effect
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    createTouchRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple';
        ripple.style.left = `${x - 25}px`;
        ripple.style.top = `${y - 25}px`;
        ripple.style.width = '50px';
        ripple.style.height = '50px';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    /**
     * Handle double tap
     * @param {TouchEvent} event - Touch event
     */
    handleDoubleTap(event) {
        const target = event.target.closest('.gaming-control, .interactive-object');
        if (target) {
            // Trigger special double-tap action
            target.dispatchEvent(new CustomEvent('doubleTap', {
                detail: { originalEvent: event }
            }));
        }
    }

    /**
     * Handle long press
     * @param {TouchEvent} event - Touch event
     */
    handleLongPress(event) {
        const target = event.target.closest('.gaming-control, .interactive-object');
        if (target) {
            // Trigger context menu or special action
            target.dispatchEvent(new CustomEvent('longPress', {
                detail: { originalEvent: event }
            }));
        }
    }

    /**
     * Handle 3D rotation for mobile
     * @param {string} direction - Rotation direction
     */
    handle3DRotation(direction) {
        this.dispatchEvent('mobile3DRotation', {
            direction,
            timestamp: Date.now()
        });
    }

    /**
     * Handle 3D zoom for mobile
     */
    handle3DZoom() {
        this.dispatchEvent('mobile3DZoom', {
            timestamp: Date.now()
        });
    }

    /**
     * Handle escape key press
     */
    handleEscapeKey() {
        // Close any open modals or return to previous state
        this.dispatchEvent('escapePressed', {
            timestamp: Date.now()
        });
    }

    /**
     * Get current breakpoint
     * @returns {string} Current breakpoint name
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width <= this.breakpoints.mobile) return 'mobile';
        if (width <= this.breakpoints.tablet) return 'tablet';
        if (width <= this.breakpoints.desktop) return 'desktop';
        return 'large';
    }

    /**
     * Update adaptive elements based on current screen size
     */
    updateAdaptiveElements() {
        this.adaptiveElements.forEach((config, element) => {
            const { options } = config;
            
            // Apply breakpoint-specific styles
            if (options.breakpointStyles) {
                const currentStyles = options.breakpointStyles[this.currentBreakpoint];
                if (currentStyles) {
                    Object.entries(currentStyles).forEach(([property, value]) => {
                        element.style[property] = value;
                    });
                }
            }
            
            // Apply scaling
            if (options.scale !== false) {
                const scalingFactor = this.scalingFactors[this.deviceInfo.screenSize];
                element.style.transform = `scale(${scalingFactor})`;
            }
        });
    }

    /**
     * Enable accessibility feature
     * @param {string} feature - Feature name
     * @param {boolean} enabled - Whether to enable
     */
    setAccessibilityFeature(feature, enabled) {
        if (this.accessibilitySettings.hasOwnProperty(feature)) {
            this.accessibilitySettings[feature] = enabled;
            this.applyAccessibilitySettings();
            
            console.log(`♿ ${enabled ? 'Enabled' : 'Disabled'} accessibility feature: ${feature}`);
        }
    }

    /**
     * Remove responsive behavior from element
     * @param {HTMLElement} element - Target element
     */
    removeResponsiveBehavior(element) {
        if (!element || !this.adaptiveElements.has(element)) {
            return false;
        }
        
        const config = this.adaptiveElements.get(element);
        
        // Restore original styles
        Object.entries(config.originalStyles).forEach(([property, value]) => {
            element.style[property] = value || '';
        });
        
        // Remove responsive classes
        element.classList.remove('responsive-element', 'touch-friendly');
        
        // Stop observing resize
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(element);
        }
        
        this.adaptiveElements.delete(element);
        
        console.log('📱 Removed responsive behavior from element');
        return true;
    }

    /**
     * Dispatch custom event
     * @param {string} eventName - Event name
     * @param {Object} data - Event data
     */
    dispatchEvent(eventName, data) {
        window.dispatchEvent(new CustomEvent(`responsive${eventName}`, {
            detail: data
        }));
    }

    /**
     * Get system status
     * @returns {Object} System status
     */
    getStatus() {
        return {
            version: this.version,
            initialized: this.initialized,
            deviceInfo: this.deviceInfo,
            currentBreakpoint: this.currentBreakpoint,
            accessibilitySettings: this.accessibilitySettings,
            adaptiveElements: this.adaptiveElements.size
        };
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.handleOrientationChange);
        
        // Disconnect resize observer
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        // Clean up adaptive elements
        this.adaptiveElements.forEach((config, element) => {
            this.removeResponsiveBehavior(element);
        });
        
        // Remove mobile 3D controls
        const mobileControls = document.getElementById('mobile-3d-controls');
        if (mobileControls) {
            mobileControls.remove();
        }
        
        this.initialized = false;
        console.log('📱 Responsive Gaming Interface destroyed');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResponsiveGamingInterface };
}

// Make available globally
window.ResponsiveGamingInterface = ResponsiveGamingInterface;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.responsiveGamingInterface) {
            window.responsiveGamingInterface = new ResponsiveGamingInterface();
            await window.responsiveGamingInterface.initialize();
        }
    });
} else {
    if (!window.responsiveGamingInterface) {
        window.responsiveGamingInterface = new ResponsiveGamingInterface();
        window.responsiveGamingInterface.initialize();
    }
}