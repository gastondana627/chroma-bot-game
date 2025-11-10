/**
 * Interactive Video Player
 * Plays video with pause points for player decisions
 * Applies visual effects (blur, grayscale) during choices
 */

class InteractiveVideoPlayer {
  constructor(videoElement, config) {
    this.video = videoElement;
    this.config = config;
    this.currentDecisionIndex = 0;
    this.trustScore = 100;
    this.decisions = [];
    
    this.setupVideo();
    this.setupOverlay();
  }
  
  setupVideo() {
    // Add CSS filter container
    this.video.style.transition = 'filter 0.5s ease';
    
    // Listen for timeupdate to trigger decision points
    this.video.addEventListener('timeupdate', () => {
      this.checkDecisionPoints();
    });
  }
  
  setupOverlay() {
    // Create decision overlay container
    this.overlay = document.createElement('div');
    this.overlay.id = 'decision-overlay';
    this.overlay.className = 'decision-overlay hidden';
    this.overlay.innerHTML = `
      <div class="decision-content">
        <h2 class="decision-question"></h2>
        <div class="decision-buttons">
          <button class="choice-btn choice-yes" data-choice="yes">
            <span class="choice-icon">✓</span>
            <span class="choice-text"></span>
          </button>
          <button class="choice-btn choice-no" data-choice="no">
            <span class="choice-icon">✗</span>
            <span class="choice-text"></span>
          </button>
        </div>
        <div class="decision-timer">
          <div class="timer-bar"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    
    // Add click handlers
    this.overlay.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const choice = e.currentTarget.dataset.choice;
        this.handleChoice(choice);
      });
    });
  }
  
  checkDecisionPoints() {
    const currentTime = this.video.currentTime;
    const decision = this.config.decisions[this.currentDecisionIndex];
    
    if (decision && currentTime >= decision.timestamp && !decision.triggered) {
      decision.triggered = true;
      this.showDecision(decision);
    }
  }
  
  showDecision(decision) {
    // Pause video
    this.video.pause();
    
    // Apply visual effect
    if (this.config.effectStyle === 'blur') {
      this.video.style.filter = 'blur(8px) brightness(0.6)';
    } else if (this.config.effectStyle === 'grayscale') {
      this.video.style.filter = 'grayscale(100%) brightness(0.5)';
    } else if (this.config.effectStyle === 'both') {
      this.video.style.filter = 'blur(5px) grayscale(80%) brightness(0.5)';
    }
    
    // Populate overlay
    this.overlay.querySelector('.decision-question').textContent = decision.question;
    this.overlay.querySelector('.choice-yes .choice-text').textContent = decision.yesText;
    this.overlay.querySelector('.choice-no .choice-text').textContent = decision.noText;
    
    // Show overlay with animation
    this.overlay.classList.remove('hidden');
    setTimeout(() => this.overlay.classList.add('visible'), 10);
    
    // Start timer if configured
    if (decision.timeLimit) {
      this.startTimer(decision.timeLimit, () => {
        // Auto-select default choice if time runs out
        this.handleChoice(decision.defaultChoice || 'no');
      });
    }
  }
  
  handleChoice(choice) {
    const decision = this.config.decisions[this.currentDecisionIndex];
    const outcome = choice === 'yes' ? decision.yesOutcome : decision.noOutcome;
    
    // Update trust score
    this.trustScore += outcome.trustDelta;
    
    // Store decision
    this.decisions.push({
      timestamp: decision.timestamp,
      choice: choice,
      trustDelta: outcome.trustDelta
    });
    
    // Show feedback
    this.showFeedback(outcome);
    
    // Hide overlay
    this.overlay.classList.remove('visible');
    setTimeout(() => {
      this.overlay.classList.add('hidden');
      
      // Remove visual effect
      this.video.style.filter = 'none';
      
      // Resume video
      this.video.play();
      
      // Move to next decision
      this.currentDecisionIndex++;
      
      // Check if story is complete
      if (this.currentDecisionIndex >= this.config.decisions.length) {
        this.video.addEventListener('ended', () => this.endStory());
      }
    }, 300);
  }
  
  showFeedback(outcome) {
    const feedback = document.createElement('div');
    feedback.className = `feedback-popup ${outcome.trustDelta > 0 ? 'positive' : 'negative'}`;
    feedback.innerHTML = `
      <div class="feedback-icon">${outcome.trustDelta > 0 ? '✓' : '✗'}</div>
      <div class="feedback-text">${outcome.reason}</div>
      <div class="feedback-score">${outcome.trustDelta > 0 ? '+' : ''}${outcome.trustDelta}</div>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.classList.add('show'), 10);
    setTimeout(() => {
      feedback.classList.remove('show');
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
  }
  
  startTimer(seconds, onTimeout) {
    const timerBar = this.overlay.querySelector('.timer-bar');
    timerBar.style.transition = `width ${seconds}s linear`;
    timerBar.style.width = '0%';
    
    this.timerTimeout = setTimeout(onTimeout, seconds * 1000);
  }
  
  stopTimer() {
    if (this.timerTimeout) {
      clearTimeout(this.timerTimeout);
      this.timerTimeout = null;
    }
  }
  
  endStory() {
    // Calculate final outcome
    const finalScore = this.trustScore;
    let ending;
    
    if (finalScore >= 150) {
      ending = 'excellent';
    } else if (finalScore >= 100) {
      ending = 'good';
    } else if (finalScore >= 50) {
      ending = 'learning';
    } else {
      ending = 'needs_help';
    }
    
    // Trigger ending callback
    if (this.config.onComplete) {
      this.config.onComplete({
        finalScore: finalScore,
        ending: ending,
        decisions: this.decisions
      });
    }
  }
  
  play() {
    this.video.play();
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InteractiveVideoPlayer;
}
