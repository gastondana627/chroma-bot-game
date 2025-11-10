/**
 * Thought Overlay System
 * Displays Eli's internal thoughts during video playback
 * Subtle, non-intrusive, synced with video timing
 */

class ThoughtOverlaySystem {
    constructor() {
        this.currentThought = null;
        this.thoughtElement = null;
        this.isVisible = false;
        this.thoughtQueue = [];
        
        this.init();
    }
    
    init() {
        this.createThoughtOverlay();
        console.log('💭 Thought overlay system initialized');
    }
    
    /**
     * Create thought overlay element
     */
    createThoughtOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'thought-overlay';
        overlay.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 30px;
            max-width: 400px;
            padding: 15px 20px;
            background: rgba(0, 0, 0, 0.85);
            border-left: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.5;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s ease;
            pointer-events: none;
            z-index: 9997;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;
        
        overlay.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <span style="font-size: 1.2rem; opacity: 0.6; flex-shrink: 0;">💭</span>
                <span id="thought-text" style="font-style: italic;"></span>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.thoughtElement = overlay;
        this.thoughtText = overlay.querySelector('#thought-text');
    }
    
    /**
     * Show a thought at specific video timestamp
     * @param {string} text - The thought text
     * @param {number} duration - How long to show (ms), default 4000
     */
    showThought(text, duration = 4000) {
        if (!this.thoughtElement) return;
        
        // Update text
        this.thoughtText.textContent = text;
        
        // Show overlay
        this.thoughtElement.style.opacity = '1';
        this.thoughtElement.style.transform = 'translateY(0)';
        this.isVisible = true;
        
        // Auto-hide after duration
        setTimeout(() => {
            this.hideThought();
        }, duration);
    }
    
    /**
     * Hide current thought
     */
    hideThought() {
        if (!this.thoughtElement) return;
        
        this.thoughtElement.style.opacity = '0';
        this.thoughtElement.style.transform = 'translateY(20px)';
        this.isVisible = false;
    }
    
    /**
     * Schedule thoughts for a scene
     * @param {Array} thoughts - Array of {time, text, duration}
     * @param {HTMLVideoElement} video - Video element to sync with
     */
    scheduleThoughts(thoughts, video) {
        // Clear any existing listeners
        this.clearSchedule();
        
        // Create time update listener
        this.timeUpdateHandler = () => {
            const currentTime = video.currentTime;
            
            thoughts.forEach(thought => {
                // Show thought when video reaches timestamp (with 0.1s tolerance)
                if (Math.abs(currentTime - thought.time) < 0.1 && !thought.shown) {
                    this.showThought(thought.text, thought.duration || 4000);
                    thought.shown = true;
                }
            });
        };
        
        video.addEventListener('timeupdate', this.timeUpdateHandler);
        
        // Reset shown flags when video restarts
        video.addEventListener('play', () => {
            thoughts.forEach(t => t.shown = false);
        });
    }
    
    /**
     * Clear scheduled thoughts
     */
    clearSchedule() {
        if (this.timeUpdateHandler) {
            const video = document.getElementById('story-video');
            if (video) {
                video.removeEventListener('timeupdate', this.timeUpdateHandler);
            }
        }
        this.hideThought();
    }
    
    /**
     * Destroy overlay
     */
    destroy() {
        this.clearSchedule();
        if (this.thoughtElement) {
            this.thoughtElement.remove();
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.ThoughtOverlaySystem = ThoughtOverlaySystem;
}
