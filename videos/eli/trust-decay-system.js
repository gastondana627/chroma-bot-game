/**
 * Trust Decay System
 * Manages exponential trust score decay and bad ending triggers
 */

class TrustDecaySystem {
    constructor(options = {}) {
        this.startingScore = 100;
        this.currentScore = 100;
        this.passiveDecay = 5; // Per scene
        this.badDecisionPenalty = 0.25; // 25% of current score
        this.warningThreshold = 30;
        this.criticalThreshold = 10;
        this.failureThreshold = 0;
        
        this.sceneHistory = [];
        this.onScoreUpdate = options.onScoreUpdate || null;
        this.onWarning = options.onWarning || null;
        this.onCritical = options.onCritical || null;
        this.onFailure = options.onFailure || null;
    }
    
    /**
     * Apply passive decay when entering new scene
     */
    applyPassiveDecay(sceneNumber) {
        const oldScore = this.currentScore;
        this.currentScore = Math.max(0, this.currentScore - this.passiveDecay);
        
        this.sceneHistory.push({
            scene: sceneNumber,
            type: 'passive_decay',
            oldScore,
            newScore: this.currentScore,
            delta: -this.passiveDecay
        });
        
        this._checkThresholds(oldScore);
        this._notifyUpdate();
        
        // Play trust down sound
        this._playSound('audio/trust/trust_down.wav', 0.4);
        
        console.log(`📉 Passive decay: ${oldScore} → ${this.currentScore}`);
    }
    
    /**
     * Apply bad decision penalty (25% of current score)
     */
    applyBadDecision(decisionData) {
        const oldScore = this.currentScore;
        const penalty = Math.floor(this.currentScore * this.badDecisionPenalty);
        this.currentScore = Math.max(0, this.currentScore - penalty);
        
        this.sceneHistory.push({
            scene: decisionData.scene,
            type: 'bad_decision',
            decision: decisionData.question,
            oldScore,
            newScore: this.currentScore,
            delta: -penalty
        });
        
        this._checkThresholds(oldScore);
        this._notifyUpdate();
        
        // Play trust down sound (louder for bad decisions)
        this._playSound('audio/trust/trust_down.wav', 0.6);
        
        console.log(`🚨 Bad decision penalty: -${penalty} (25% of ${oldScore}) → ${this.currentScore}`);
        
        return penalty;
    }
    
    /**
     * Apply good decision bonus
     * No cap - scores can go above 100!
     */
    applyGoodDecision(decisionData, bonus) {
        const oldScore = this.currentScore;
        this.currentScore = this.currentScore + bonus; // Removed Math.min(100, ...) cap
        
        this.sceneHistory.push({
            scene: decisionData.scene,
            type: 'good_decision',
            decision: decisionData.question,
            oldScore,
            newScore: this.currentScore,
            delta: bonus
        });
        
        this._notifyUpdate();
        
        // Play trust up sound
        this._playSound('audio/trust/trust_up.wav', 0.5);
        
        console.log(`✅ Good decision bonus: +${bonus} → ${this.currentScore}`);
        
        return bonus;
    }
    
    /**
     * Check if thresholds have been crossed
     */
    _checkThresholds(oldScore) {
        // Check failure (0)
        if (this.currentScore <= this.failureThreshold && oldScore > this.failureThreshold) {
            console.log('💀 FAILURE THRESHOLD REACHED');
            if (this.onFailure) this.onFailure(this.currentScore);
        }
        // Check critical (<10)
        else if (this.currentScore <= this.criticalThreshold && oldScore > this.criticalThreshold) {
            console.log('🔴 CRITICAL THRESHOLD REACHED');
            this._playSound('audio/trust/trust_critical.wav', 0.7);
            if (this.onCritical) this.onCritical(this.currentScore);
        }
        // Check warning (<30)
        else if (this.currentScore <= this.warningThreshold && oldScore > this.warningThreshold) {
            console.log('⚠️ WARNING THRESHOLD REACHED');
            this._playSound('audio/trust/trust_warning.wav', 0.6);
            if (this.onWarning) this.onWarning(this.currentScore);
        }
    }
    
    /**
     * Notify score update
     */
    _notifyUpdate() {
        if (this.onScoreUpdate) {
            this.onScoreUpdate(this.currentScore, this.getScoreStatus());
        }
    }
    
    /**
     * Play sound effect
     */
    _playSound(path, volume = 0.5) {
        try {
            const audio = new Audio(path);
            audio.volume = volume;
            audio.play().catch(err => console.log('Audio play blocked:', err.message));
        } catch (err) {
            console.warn('Could not play sound:', path, err.message);
        }
    }
    
    /**
     * Get current score status
     */
    getScoreStatus() {
        if (this.currentScore <= this.failureThreshold) {
            return { level: 'failure', color: '#000', message: 'ASSESSMENT FAILED' };
        } else if (this.currentScore <= this.criticalThreshold) {
            return { level: 'critical', color: '#ff0040', message: 'CRITICAL RISK' };
        } else if (this.currentScore <= this.warningThreshold) {
            return { level: 'warning', color: '#ff6b35', message: 'HIGH RISK' };
        } else if (this.currentScore < 50) {
            return { level: 'moderate', color: '#ffd700', message: 'MODERATE RISK' };
        } else {
            return { level: 'safe', color: '#00ff88', message: 'ACCEPTABLE' };
        }
    }
    
    /**
     * Check if player has failed
     */
    hasFailed() {
        return this.currentScore <= this.failureThreshold;
    }
    
    /**
     * Get score
     */
    getScore() {
        return this.currentScore;
    }
    
    /**
     * Get history
     */
    getHistory() {
        return this.sceneHistory;
    }
    
    /**
     * Reset system
     */
    reset() {
        this.currentScore = this.startingScore;
        this.sceneHistory = [];
        this._notifyUpdate();
    }
}

// Export
if (typeof window !== 'undefined') {
    window.TrustDecaySystem = TrustDecaySystem;
}
