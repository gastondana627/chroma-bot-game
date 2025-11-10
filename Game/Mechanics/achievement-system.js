/**
 * Achievement System
 * Tracks easter eggs and unlockable achievements
 */

class AchievementSystem {
    constructor() {
        this.storageKey = 'datableed_achievements';
        this.achievements = this.loadAchievements();
        
        // Define all achievements
        this.achievementList = {
            // Easter Egg Achievements (15 total)
            easter_eggs: {
                egg_1: { id: 'egg_1', name: 'First Discovery', description: 'Found your first easter egg', icon: '🥚', found: false },
                egg_2: { id: 'egg_2', name: 'Hidden Message', description: 'Discovered a secret message', icon: '📨', found: false },
                egg_3: { id: 'egg_3', name: 'ChromaBot Secret', description: 'Found ChromaBot\'s hidden response', icon: '🤖', found: false },
                egg_4: { id: 'egg_4', name: 'Code Breaker', description: 'Decrypted a hidden code', icon: '🔐', found: false },
                egg_5: { id: 'egg_5', name: 'Observer', description: 'Found the surveillance note', icon: '👁️', found: false },
                egg_6: { id: 'egg_6', name: 'Glitch Hunter', description: 'Discovered the glitch easter egg', icon: '⚡', found: false },
                egg_7: { id: 'egg_7', name: 'Deep Dive', description: 'Found the hidden dashboard secret', icon: '📊', found: false },
                egg_8: { id: 'egg_8', name: 'Time Traveler', description: 'Discovered the timestamp anomaly', icon: '⏰', found: false },
                egg_9: { id: 'egg_9', name: 'Data Miner', description: 'Found the corrupted data file', icon: '💾', found: false },
                egg_10: { id: 'egg_10', name: 'Pattern Recognition', description: 'Spotted the hidden pattern', icon: '🔍', found: false },
                egg_11: { id: 'egg_11', name: 'Audio Clue', description: 'Found the sound-based secret', icon: '🔊', found: false },
                egg_12: { id: 'egg_12', name: 'Visual Trick', description: 'Caught the hidden visual', icon: '👀', found: false },
                egg_13: { id: 'egg_13', name: 'Meta Discovery', description: 'Found the fourth wall break', icon: '🎭', found: false },
                egg_14: { id: 'egg_14', name: 'Developer Note', description: 'Discovered the dev message', icon: '💬', found: false },
                egg_15: { id: 'egg_15', name: 'Master Hunter', description: 'Found all easter eggs!', icon: '🏆', found: false }
            },
            
            // Performance Achievements
            performance: {
                perfect_score: { id: 'perfect_score', name: 'Perfect Assessment', description: 'Achieved 120+ trust score', icon: '⭐', unlocked: false },
                no_mistakes: { id: 'no_mistakes', name: 'Flawless', description: 'Made all correct decisions', icon: '✨', unlocked: false },
                speed_run: { id: 'speed_run', name: 'Quick Thinker', description: 'Completed in under 10 minutes', icon: '⚡', unlocked: false },
                survivor: { id: 'survivor', name: 'Survivor', description: 'Completed with trust score above 50', icon: '🛡️', unlocked: false }
            },
            
            // Story Achievements
            story: {
                first_completion: { id: 'first_completion', name: 'Case Closed', description: 'Completed Eli\'s story', icon: '📁', unlocked: false },
                good_ending: { id: 'good_ending', name: 'Protected', description: 'Achieved the good ending', icon: '🌟', unlocked: false },
                bad_ending: { id: 'bad_ending', name: 'Compromised', description: 'Witnessed the bad ending', icon: '💀', unlocked: false },
                all_paths: { id: 'all_paths', name: 'Every Possibility', description: 'Saw all story branches', icon: '🌳', unlocked: false }
            }
        };
        
        // Merge saved progress
        this.mergeProgress();
    }
    
    /**
     * Load achievements from localStorage
     */
    loadAchievements() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Failed to load achievements:', error);
            return null;
        }
    }
    
    /**
     * Save achievements to localStorage
     */
    saveAchievements() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.achievementList));
            console.log('💾 Achievements saved');
        } catch (error) {
            console.error('Failed to save achievements:', error);
        }
    }
    
    /**
     * Merge saved progress with achievement list
     */
    mergeProgress() {
        if (!this.achievements) return;
        
        // Merge easter eggs
        Object.keys(this.achievements.easter_eggs || {}).forEach(key => {
            if (this.achievementList.easter_eggs[key]) {
                this.achievementList.easter_eggs[key].found = this.achievements.easter_eggs[key].found;
            }
        });
        
        // Merge performance achievements
        Object.keys(this.achievements.performance || {}).forEach(key => {
            if (this.achievementList.performance[key]) {
                this.achievementList.performance[key].unlocked = this.achievements.performance[key].unlocked;
            }
        });
        
        // Merge story achievements
        Object.keys(this.achievements.story || {}).forEach(key => {
            if (this.achievementList.story[key]) {
                this.achievementList.story[key].unlocked = this.achievements.story[key].unlocked;
            }
        });
    }
    
    /**
     * Play sound effect
     */
    playSound(soundName, volume = 0.5) {
        try {
            const basePath = this.getBasePath();
            const audio = new Audio(`${basePath}videos/eli/audio/gameplay/${soundName}.wav`);
            audio.volume = volume;
            audio.play().catch(err => console.log('Sound play prevented:', err.message));
        } catch (error) {
            console.log('Sound error:', error.message);
        }
    }
    
    /**
     * Get base path for assets
     */
    getBasePath() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/videos/eli/')) return '../../';
        if (currentPath.includes('/videos/')) return '../';
        return '/';
    }
    
    /**
     * Unlock an easter egg
     */
    unlockEasterEgg(eggId) {
        if (this.achievementList.easter_eggs[eggId]) {
            if (!this.achievementList.easter_eggs[eggId].found) {
                this.achievementList.easter_eggs[eggId].found = true;
                this.saveAchievements();
                
                // Play easter egg sound
                this.playSound('easter_egg', 0.6);
                
                this.showAchievementNotification(this.achievementList.easter_eggs[eggId]);
                
                // Check if all eggs found
                if (this.getEasterEggCount() === 15) {
                    this.unlockEasterEgg('egg_15'); // Master Hunter
                }
                
                return true;
            }
        }
        return false;
    }
    
    /**
     * Unlock a performance achievement
     */
    unlockAchievement(category, achievementId) {
        if (this.achievementList[category] && this.achievementList[category][achievementId]) {
            if (!this.achievementList[category][achievementId].unlocked) {
                this.achievementList[category][achievementId].unlocked = true;
                this.saveAchievements();
                
                // Play achievement sound
                this.playSound('achievement', 0.6);
                
                this.showAchievementNotification(this.achievementList[category][achievementId]);
                return true;
            }
        }
        return false;
    }
    
    /**
     * Show achievement unlock notification
     */
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    /**
     * Get easter egg count
     */
    getEasterEggCount() {
        return Object.values(this.achievementList.easter_eggs)
            .filter(egg => egg.found).length;
    }
    
    /**
     * Get total achievement count
     */
    getTotalAchievements() {
        let total = 0;
        let unlocked = 0;
        
        // Count easter eggs
        Object.values(this.achievementList.easter_eggs).forEach(egg => {
            total++;
            if (egg.found) unlocked++;
        });
        
        // Count performance achievements
        Object.values(this.achievementList.performance).forEach(ach => {
            total++;
            if (ach.unlocked) unlocked++;
        });
        
        // Count story achievements
        Object.values(this.achievementList.story).forEach(ach => {
            total++;
            if (ach.unlocked) unlocked++;
        });
        
        return { unlocked, total };
    }
    
    /**
     * Get achievement progress percentage
     */
    getProgress() {
        const { unlocked, total } = this.getTotalAchievements();
        return Math.floor((unlocked / total) * 100);
    }
    
    /**
     * Reset all achievements (for testing)
     */
    resetAll() {
        localStorage.removeItem(this.storageKey);
        console.log('🔄 All achievements reset');
        location.reload();
    }
}

// Make globally accessible
window.AchievementSystem = AchievementSystem;
