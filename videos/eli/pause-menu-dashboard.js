/**
 * Pause Menu System with Eli Dashboard Integration
 * Connects to live game data and displays interactive dashboard
 */

class PauseMenuSystem {
    constructor(videoElement) {
        this.video = videoElement;
        this.isPaused = false;
        this.pauseButton = null;
        this.menuOverlay = null;
        
        this.init();
    }
    
    init() {
        this.createPauseButton();
        this.createDashboardOverlay();
        this.setupKeyboardShortcuts();
    }
    
    /**
     * Create pause button (top left)
     */
    createPauseButton() {
        const button = document.createElement('button');
        button.id = 'pause-button';
        button.innerHTML = '⏸';
        button.title = 'Pause (Space)';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #a855f7;
            border-radius: 8px;
            color: #a855f7;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 9999;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'JetBrains Mono', monospace;
        `;
        
        button.onmouseenter = () => {
            button.style.background = 'rgba(168, 85, 247, 0.2)';
            button.style.transform = 'scale(1.1)';
        };
        
        button.onmouseleave = () => {
            button.style.background = 'rgba(0, 0, 0, 0.8)';
            button.style.transform = 'scale(1)';
        };
        
        button.onclick = () => this.togglePause();
        
        document.body.appendChild(button);
        this.pauseButton = button;
    }
    
    /**
     * Get correct path for assets (localhost vs production)
     */
    getAssetPath(relativePath) {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/videos/eli/')) {
            return `../../${relativePath}`;
        }
        
        if (currentPath.includes('/videos/')) {
            return `../${relativePath}`;
        }
        
        return relativePath;
    }
    
    /**
     * Create dashboard overlay - simplified inline version
     */
    createDashboardOverlay() {
        // Check if overlay already exists and remove it
        const existingOverlay = document.getElementById('pause-menu-overlay');
        if (existingOverlay) {
            console.log('⚠️ Removing existing pause overlay');
            existingOverlay.remove();
        }
        
        const overlay = document.createElement('div');
        overlay.id = 'pause-menu-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: none;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            overflow-y: auto;
            background: #000;
            font-family: 'JetBrains Mono', monospace;
        `;
        
        // Load Tailwind CSS
        const tailwindLink = document.createElement('script');
        tailwindLink.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(tailwindLink);
        
        // Load JetBrains Mono font
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
        
        // Use inline dashboard HTML
        overlay.innerHTML = this.getInlineDashboard();
        
        // Define global functions FIRST (before DOM)
        this.defineGlobalFunctions();
        
        // Add to DOM
        document.body.appendChild(overlay);
        this.menuOverlay = overlay;
        
        // Attach event listeners AFTER DOM is ready
        setTimeout(() => {
            this.connectDashboardButtons();
            this.setupDashboardAnimations();
            this.attachFormListeners();
        }, 100);
    }
    
    /**
     * Define global functions (called before DOM insertion)
     */
    defineGlobalFunctions() {
        // Dashboard update function - MUST be defined early
        window.updatePauseDashboard = function(gameData) {
            const trustScore = gameData.trustScore || 100;
            const sceneEl = document.getElementById('pauseCurrentScene');
            const trustScoreEl = document.getElementById('pauseTrustScore');
            const trustPercentEl = document.getElementById('pauseTrustPercent');
            const trustBarEl = document.getElementById('pauseTrustBar');
            
            // Update scene number
            if (sceneEl) {
                sceneEl.textContent = gameData.currentScene || 1;
                console.log('🎬 Dashboard scene updated: ' + gameData.currentScene);
            }
            
            // Update trust score
            if (trustScoreEl) trustScoreEl.textContent = Math.floor(trustScore);
            if (trustPercentEl) trustPercentEl.textContent = Math.floor(trustScore) + '%';
            if (trustBarEl) trustBarEl.style.width = trustScore + '%';
            
            // Update trust bar color
            if (trustBarEl) {
                if (trustScore < 30) {
                    trustBarEl.style.background = '#ef4444';
                    trustBarEl.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.5)';
                } else if (trustScore < 60) {
                    trustBarEl.style.background = '#f59e0b';
                    trustBarEl.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.5)';
                } else {
                    trustBarEl.style.background = '#10b981';
                    trustBarEl.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.5)';
                }
            }
            
            // Update vibe
            const vibeEmoji = document.getElementById('pauseVibeEmoji');
            const vibeText = document.getElementById('pauseVibeText');
            if (vibeEmoji && vibeText) {
                if (trustScore < 30) {
                    vibeEmoji.textContent = '😰';
                    vibeText.textContent = 'VULNERABLE';
                    vibeText.style.color = '#ef4444';
                } else if (trustScore < 60) {
                    vibeEmoji.textContent = '😐';
                    vibeText.textContent = 'UNCERTAIN';
                    vibeText.style.color = '#fbbf24';
                } else {
                    vibeEmoji.textContent = '😊';
                    vibeText.textContent = 'PROTECTED';
                    vibeText.style.color = '#10b981';
                }
            }
            
            // Update stats
            const scenesCompletedEl = document.getElementById('pauseScenesCompleted');
            const decisionsMadeEl = document.getElementById('pauseDecisionsMade');
            const goodDecisionsEl = document.getElementById('pauseGoodDecisions');
            const riskyChoicesEl = document.getElementById('pauseRiskyChoices');
            const trustLostEl = document.getElementById('pauseTrustLost');
            
            // Scenes completed = current scene number (shows which scene you're on)
            const scenesCompleted = gameData.currentScene || 1;
            if (scenesCompletedEl) scenesCompletedEl.textContent = scenesCompleted + '/6';
            if (decisionsMadeEl) decisionsMadeEl.textContent = gameData.decisionsMade || 0;
            if (goodDecisionsEl) goodDecisionsEl.textContent = gameData.goodDecisions || 0;
            if (riskyChoicesEl) riskyChoicesEl.textContent = gameData.riskyChoices || 0;
            if (trustLostEl) trustLostEl.textContent = Math.max(0, 100 - trustScore);
            
            // Update time
            const timeEl = document.getElementById('pauseCurrentTime');
            if (timeEl) {
                timeEl.textContent = new Date().toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
            
            // Update decision history
            if (gameData.decisionHistory && gameData.decisionHistory.length > 0) {
                const historyDiv = document.getElementById('pauseDecisionHistory');
                if (historyDiv) {
                    historyDiv.innerHTML = '';
                    gameData.decisionHistory.slice(-5).reverse().forEach(decision => {
                        const decisionDiv = document.createElement('div');
                        decisionDiv.className = 'decision-item ' + (decision.type === 'risky' ? 'decision-risky' : 'decision-safe');
                        const color = decision.type === 'risky' ? '#ef4444' : '#10b981';
                        const icon = decision.type === 'risky' ? '⚠️ risky' : '✓ safe';
                        const sign = decision.trustDelta > 0 ? '+' : '';
                        decisionDiv.innerHTML = '<div class="decision-header">' +
                            '<span style="font-weight: 600; color: ' + color + ';">Scene ' + decision.scene + '</span>' +
                            '<span style="color: #6b7280;">' + icon + '</span>' +
                            '</div>' +
                            '<div class="decision-trust">' + sign + decision.trustDelta + ' trust</div>';
                        historyDiv.appendChild(decisionDiv);
                    });
                }
            }
            
            console.log('✅ Dashboard fully updated');
        };
        
        // Message interaction function with trust score consequences
        window.interactWithMessage = function(button, action) {
            const messageItem = button.closest('.message-item');
            const messageText = messageItem.querySelector('.message-text');
            const messageType = messageItem.classList.contains('safe') ? 'safe' : 'toxic';
            
            if (action === 'encrypt') {
                if (messageItem.classList.contains('encrypted')) {
                    // Decrypt
                    messageItem.classList.remove('encrypted');
                    messageText.textContent = messageItem.dataset.originalText;
                    button.textContent = '🔒 encrypt';
                } else {
                    // Encrypt - REWARD PLAYER!
                    messageItem.dataset.originalText = messageText.textContent;
                    messageItem.classList.add('encrypted');
                    messageText.textContent = '█████████████████';
                    button.textContent = '🔓 decrypt';
                    
                    // Award +1 trust score for protecting yourself
                    // BUT: If it's a toxic message, apply penalty FIRST, then reward
                    if (window.trustDecay && !messageItem.dataset.rewarded) {
                        const oldScore = window.trustDecay.getScore();
                        let scoreAfterPenalty = oldScore;
                        
                        // If toxic message, apply penalty first
                        if (messageType === 'toxic' && !messageItem.dataset.read) {
                            window.trustDecay.applyBadDecision({
                                scene: window.currentSceneIndex !== undefined ? window.currentSceneIndex + 1 : 1,
                                question: 'Interacted with Toxic Message'
                            });
                            scoreAfterPenalty = window.trustDecay.getScore();
                            messageItem.dataset.read = 'true';
                            console.log('⚠️ Toxic message penalty applied first: ' + oldScore + ' → ' + scoreAfterPenalty + ' (-1 trust)');
                        }
                        
                        // Then apply encryption reward
                        window.trustDecay.applyGoodDecision({
                            scene: window.currentSceneIndex !== undefined ? window.currentSceneIndex + 1 : 1,
                            question: 'Message Encryption'
                        }, 1);
                        
                        const newScore = window.trustDecay.getScore();
                        messageItem.dataset.rewarded = 'true';
                        
                        showEncryptionReward(button, oldScore, newScore, messageType === 'toxic' ? 'Net: 0' : '+1 Trust!', '🛡️');
                        updateDashboardAfterTrustChange(oldScore, newScore, 'encryption');
                        
                        console.log('🔐 Encryption reward: ' + scoreAfterPenalty + ' → ' + newScore + ' (+1 trust)');
                    }
                }
            } else if (action === 'read') {
                // RED/TOXIC messages: -1 trust penalty when clicked
                // GREEN/SAFE messages: 0 penalty (neutral)
                if (!messageItem.dataset.read) {
                    messageItem.dataset.read = 'true';
                    
                    if (messageType === 'toxic' && window.trustDecay) {
                        const oldScore = window.trustDecay.getScore();
                        
                        // Apply -1 penalty for interacting with toxic content
                        window.trustDecay.applyBadDecision({
                            scene: window.currentSceneIndex !== undefined ? window.currentSceneIndex + 1 : 1,
                            question: 'Interacted with Toxic Message'
                        });
                        
                        const newScore = window.trustDecay.getScore();
                        
                        showEncryptionReward(button, oldScore, newScore, '-1 Trust', '⚠️');
                        updateDashboardAfterTrustChange(oldScore, newScore, 'toxic_exposure');
                        
                        console.log('⚠️ Toxic message penalty: ' + oldScore + ' → ' + newScore + ' (-1 trust)');
                    } else if (messageType === 'safe') {
                        // Safe messages are neutral - no penalty, no reward
                        console.log('✅ Safe message clicked - no trust change');
                    }
                }
            }
        };
        
        // Legacy function for backward compatibility
        window.encryptMessage = function(button) {
            window.interactWithMessage(button, 'encrypt');
        };
        
        // Centralized dashboard update after trust changes
        function updateDashboardAfterTrustChange(oldScore, newScore, reason) {
            if (window.updatePauseDashboard && window.pauseMenuSystem) {
                const gameData = window.pauseMenuSystem.getCurrentGameState();
                window.updatePauseDashboard(gameData);
                console.log('🔄 Dashboard updated after trust change');
            }
            
            window.dispatchEvent(new CustomEvent('trustScoreUpdated', { 
                detail: { oldScore, newScore, reason }
            }));
        }
        
        // Show encryption reward animation
        function showEncryptionReward(button, oldScore, newScore) {
            const reward = document.createElement('div');
            reward.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #a855f7 0%, #c084fc 100%);
                color: white;
                padding: 20px 40px;
                border-radius: 12px;
                font-size: 1.5rem;
                font-weight: bold;
                pointer-events: none;
                z-index: 100000;
                box-shadow: 0 8px 32px rgba(168, 85, 247, 0.8);
                border: 2px solid rgba(255, 255, 255, 0.3);
                animation: rewardPulse 2s ease-out forwards;
                text-align: center;
                backdrop-filter: blur(10px);
            `;
            reward.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 8px;">🛡️</div>
                <div>+1 Trust!</div>
                <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 4px;">${oldScore} → ${newScore}</div>
            `;
            
            // Add animation keyframes if not already added
            if (!document.getElementById('reward-animation-style')) {
                const style = document.createElement('style');
                style.id = 'reward-animation-style';
                style.textContent = `
                    @keyframes rewardPulse {
                        0% { 
                            opacity: 0; 
                            transform: translate(-50%, -50%) scale(0.5);
                        }
                        20% { 
                            opacity: 1; 
                            transform: translate(-50%, -50%) scale(1.1);
                        }
                        80% { 
                            opacity: 1; 
                            transform: translate(-50%, -50%) scale(1);
                        }
                        100% { 
                            opacity: 0; 
                            transform: translate(-50%, -50%) scale(0.8);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(reward);
            
            setTimeout(() => reward.remove(), 2000);
        }
        
        // ChromaBot interaction with easter eggs
        window.askChromaBot = async (event) => {
            event.preventDefault();
            event.stopImmediatePropagation(); // Prevent multiple handlers from firing
            
            const input = document.getElementById('chromabotInput');
            const response = document.getElementById('chromabotResponse');
            const question = input.value.trim();
            const questionLower = question.toLowerCase();
            
            if (!question) return;
            
            // Prevent multiple simultaneous calls
            if (window.askChromaBot.isProcessing) {
                console.log('⏳ Already processing a request, skipping...');
                return;
            }
            window.askChromaBot.isProcessing = true;
            
            // Show loading
            response.textContent = '🤔 ChromaBot is thinking...';
            
            // Get current scene number
            const currentScene = window.currentSceneIndex !== undefined ? window.currentSceneIndex + 1 : 1;
            
            // Check for scene-specific response first
            if (window.getSceneChromaBotResponse) {
                const sceneResponse = window.getSceneChromaBotResponse(currentScene, questionLower);
                if (sceneResponse) {
                    // Found a scene-specific keyword match
                    setTimeout(() => {
                        response.innerHTML = `<span class="chroma-scene-response">${sceneResponse}</span>`;
                        window.askChromaBot.isProcessing = false;
                    }, 800);
                    input.value = '';
                    return;
                }
            }
            
            // Easter eggs
            const easterEggs = {
                'chroma': '✨ You found me! I\'m ChromaBot, the guardian AI of Data_Bleed. My purpose is to help you spot digital dangers before they spot you. 🎨',
                'who are you': '💬 I\'m ChromaBot, an AI assistant designed to help you navigate online safety. Think of me as your digital guardian angel! 😇',
                'help': '🛡️ I can help you understand risky messages, explain trust scores, and give advice on online safety. Just ask!',
                'trust score': '📊 Your trust score shows how vulnerable you are online. Higher = safer. Bad decisions lower it. Stay above 30 to avoid danger!',
                'encrypt': '🔐 Encryption hides message content. Use it to protect yourself from toxic messages. Click the lock button on any message!',
                'eli': '🎮 Eli is a gamer facing peer pressure and online scams. Help him make smart choices to stay safe!',
                'secret': '🎭 Want a secret? Type "konami" for a surprise... or ask about "the observer" 👁️',
                'konami': '🎮 ↑↑↓↓←→←→BA - Classic! Here\'s your reward: Trust +5! (Just kidding, but nice try!) 🕹️',
                'observer': '👁️ The Shadow Observers are watching... They see everything. Every decision. Every click. Are you being observed right now? 🌑',
                'maya': '🔍 Maya is a cybersecurity investigator. She\'s smart, cautious, and knows how to spot scams. Learn from her!',
                'stanley': '💼 Stanley is a businessman who fell for identity theft. His story teaches us to verify everything online.',
                'data bleed': '🎮 Data_Bleed is more than a game - it\'s a training simulation for digital survival. Every choice matters.',
                'glitch': '⚡ Glitches happen when you make bad decisions. They\'re visual warnings that you\'re heading into danger!',
                'pause': '⏸️ Smart move pausing! Taking breaks helps you think clearly about decisions. Don\'t let pressure rush you.',
                'decrypt': '🔓 Decryption reveals hidden messages. But be careful - some things are encrypted for a reason...'
            };
            
            // Check for easter eggs FIRST (before API call)
            let foundEasterEgg = false;
            console.log('🔍 Checking for easter eggs in:', questionLower);
            for (const [key, value] of Object.entries(easterEggs)) {
                if (questionLower.includes(key)) {
                    console.log('🎨 Easter egg found:', key);
                    // Show immediately, no delay!
                    response.innerHTML = `<span class="chroma-easter-egg">${value}</span>`;
                    foundEasterEgg = true;
                    input.value = '';
                    break;
                }
            }
            
            // If easter egg found, stop here - don't call API
            if (foundEasterEgg) {
                console.log('✅ Easter egg displayed, skipping API');
                window.askChromaBot.isProcessing = false;
                return;
            }
            
            // If no easter egg, try API call
            if (!foundEasterEgg) {
                try {
                    const apiResponse = await fetch('http://localhost:3001/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: question,
                            character: 'eli',
                            sessionId: 'pause-dashboard',
                            mode: 'standard'
                        })
                    });
                    
                    if (apiResponse.ok) {
                        const data = await apiResponse.json();
                        response.textContent = data.reply || 'ChromaBot is processing...';
                    } else {
                        throw new Error('API error');
                    }
                } catch (error) {
                    // Fallback responses
                    const fallbacks = [
                        '🤖 Good question! Always verify suspicious messages before responding.',
                        '💡 Remember: Real friends won\'t pressure you into risky decisions.',
                        '🛡️ Trust your instincts. If something feels wrong, it probably is.',
                        '📱 Never share personal info with strangers online, no matter how friendly they seem.',
                        '⚠️ Scammers create urgency to make you act without thinking. Take your time!',
                        '🔍 Look for red flags: poor grammar, suspicious links, requests for money or info.',
                        '✅ Good decisions build trust. Bad decisions make you vulnerable. Choose wisely!'
                    ];
                    
                    setTimeout(() => {
                        response.textContent = fallbacks[Math.floor(Math.random() * fallbacks.length)];
                    }, 800);
                }
            }
            
            input.value = '';
            window.askChromaBot.isProcessing = false;
        };
        
        // Add new messages dynamically
        window.addPauseMessage = function(user, text, type = 'toxic') {
            const feed = document.getElementById('pauseMessageFeed');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message-item ${type}`;
            messageDiv.innerHTML = `
                <div class="message-header">
                    <span class="message-user">${user}</span>
                    <span class="message-time">just now</span>
                </div>
                <div class="message-text">${text}</div>
                <button class="encrypt-btn" onclick="window.encryptMessage(this)">🔒 encrypt</button>
            `;
            feed.insertBefore(messageDiv, feed.firstChild);
            
            // Keep only last 5 messages
            while (feed.children.length > 5) {
                feed.removeChild(feed.lastChild);
            }
        };
        
        console.log('✅ Global functions defined');
    }
    
    /**
     * Attach form listeners (called after DOM insertion)
     */
    attachFormListeners() {
        const chromabotForm = document.getElementById('chromabotForm');
        if (chromabotForm) {
            // Remove any existing listener to prevent duplicates
            chromabotForm.removeEventListener('submit', window.askChromaBot);
            // Add the listener
            chromabotForm.addEventListener('submit', window.askChromaBot);
            console.log('✅ ChromaBot form handler attached');
        } else {
            console.error('❌ ChromaBot form not found!');
        }
    }
    
    /**
     * Connect dashboard button handlers
     */
    connectDashboardButtons() {
        const resumeBtn = document.getElementById('pauseResumeBtn');
        const restartBtn = document.getElementById('pauseRestartBtn');
        const exitBtn = document.getElementById('pauseExitBtn');
        
        if (resumeBtn) resumeBtn.onclick = () => this.resume();
        if (restartBtn) restartBtn.onclick = () => this.restart();
        if (exitBtn) exitBtn.onclick = () => this.exit();
        
        console.log('✅ Dashboard buttons connected');
    }
    
    /**
     * Update dashboard with live game data
     */
    updateDashboardData() {
        const gameData = this.getCurrentGameState();
        
        console.log('📊 Updating dashboard with game data:', gameData);
        
        // Call the dashboard update function
        if (window.updatePauseDashboard) {
            window.updatePauseDashboard(gameData);
        }
        
        // Load scene-specific messages if training data is available
        if (window.getSceneMessages) {
            this.loadSceneMessages(gameData.currentScene);
        }
    }
    
    /**
     * Load scene-specific messages into dashboard
     * Shows 3 messages from current scene + 2 from each completed scene
     */
    loadSceneMessages(sceneNumber) {
        const feed = document.getElementById('pauseMessageFeed');
        if (!feed || !window.getSceneMessages) return;
        
        // Clear existing messages
        feed.innerHTML = '';
        
        const allMessages = [];
        
        // Add 3 messages from current scene
        const currentMessages = window.getSceneMessages(sceneNumber);
        console.log('📥 Scene ' + sceneNumber + ' has ' + (currentMessages?.length || 0) + ' messages available');
        if (currentMessages && currentMessages.length > 0) {
            const sceneMsgs = currentMessages.slice(0, 3).map(msg => ({
                ...msg,
                scene: sceneNumber,
                time: 'just now'
            }));
            allMessages.push(...sceneMsgs);
            console.log('  ➕ Added ' + sceneMsgs.length + ' from current scene ' + sceneNumber);
        }
        
        // Add 2 messages from each completed scene (in reverse order)
        for (let i = sceneNumber - 1; i >= 1; i--) {
            const pastMessages = window.getSceneMessages(i);
            if (pastMessages && pastMessages.length > 0) {
                // Take 2 messages from this past scene
                const pastMsgs = pastMessages.slice(0, 2).map(msg => ({
                    ...msg,
                    scene: i,
                    time: `scene ${i}`
                }));
                allMessages.push(...pastMsgs);
                console.log('  ➕ Added ' + pastMsgs.length + ' from past scene ' + i);
            }
        }
        
        console.log('📊 Total messages collected: ' + allMessages.length);
        
        // Limit to most recent 10 messages
        const displayMessages = allMessages.slice(0, 10);
        console.log('📊 Messages to display (after limit): ' + displayMessages.length);
        
        // Debug: Log what we're about to display
        console.log('📱 Preparing to display ' + displayMessages.length + ' messages for scene ' + sceneNumber + ':', 
            displayMessages.map(m => m.user + ' (' + m.time + ') [' + m.type + ']'));
        
        // Add messages to feed with FORCED inline styles
        displayMessages.forEach((msg, index) => {
            const messageDiv = document.createElement('div');
            // Map all non-safe types to toxic for styling
            const messageClass = msg.type === 'safe' ? 'safe' : 'toxic';
            const bgColor = msg.type === 'safe' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
            const borderColor = msg.type === 'safe' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
            
            messageDiv.className = `message-item ${messageClass}`;
            // FORCE display with inline styles + cursor pointer for clickability
            messageDiv.style.cssText = `
                display: block !important;
                padding: 10px !important;
                border-radius: 8px !important;
                margin-bottom: 12px !important;
                background: ${bgColor} !important;
                border: 1px solid ${borderColor} !important;
                min-height: 60px !important;
                width: 100% !important;
                box-sizing: border-box !important;
                visibility: visible !important;
                opacity: 1 !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
            `;
            
            // Add hover effect
            messageDiv.onmouseenter = () => {
                messageDiv.style.transform = 'translateX(5px)';
                messageDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            };
            messageDiv.onmouseleave = () => {
                messageDiv.style.transform = 'translateX(0)';
                messageDiv.style.boxShadow = 'none';
            };
            
            // Add click handler for the entire message (triggers read action)
            messageDiv.onclick = (e) => {
                // Don't trigger if clicking the encrypt button
                if (!e.target.classList.contains('encrypt-btn')) {
                    window.interactWithMessage(messageDiv, 'read');
                }
            };
            
            messageDiv.innerHTML = `
                <div class="message-header" style="display: flex !important; justify-content: space-between !important; margin-bottom: 6px !important; font-size: 0.75rem !important;">
                    <span class="message-user" style="color: ${msg.type === 'safe' ? '#10b981' : '#ef4444'} !important; font-weight: 600 !important;">${msg.user}</span>
                    <span class="message-time" style="color: #6b7280 !important;">${msg.time}</span>
                </div>
                <div class="message-text" style="font-size: 0.875rem !important; color: #d1d5db !important; margin-bottom: 8px !important;">${msg.text}</div>
                <button class="encrypt-btn" onclick="window.interactWithMessage(this.closest('.message-item'), 'encrypt'); event.stopPropagation();" style="padding: 4px 12px !important; background: rgba(168, 85, 247, 0.3) !important; border: 1px solid #a855f7 !important; border-radius: 4px !important; color: #c084fc !important; font-size: 0.75rem !important; cursor: pointer !important;">🔒 encrypt</button>
            `;
            feed.appendChild(messageDiv);
            console.log('  ✓ Added message ' + (index + 1) + ': ' + msg.user + ' [' + msg.type + '→' + messageClass + '] - ' + msg.text.substring(0, 30) + '...');
        });
        
        console.log('📱 Loaded ' + displayMessages.length + ' messages (scene ' + sceneNumber + ' + history)');
        console.log('📦 Feed now has ' + feed.children.length + ' child elements');
        console.log('📏 Feed dimensions:', {
            scrollHeight: feed.scrollHeight,
            clientHeight: feed.clientHeight,
            offsetHeight: feed.offsetHeight
        });
        
        // Scroll to top to show most recent messages
        feed.scrollTop = 0;
    }
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.togglePause();
            } else if (e.code === 'Escape' && this.isPaused) {
                this.resume();
            }
        });
        
        // Listen for trust score updates to refresh dashboard if paused
        window.addEventListener('trustScoreUpdated', (event) => {
            if (this.isPaused && window.updatePauseDashboard) {
                const gameData = this.getCurrentGameState();
                window.updatePauseDashboard(gameData);
                console.log('🔄 Dashboard auto-updated after trust score change:', event.detail);
            }
        });
    }
    
    /**
     * Toggle pause state
     */
    togglePause() {
        // Don't toggle if a decision overlay is showing
        if (window.showingDecisionOverlay) {
            console.log('🚫 Toggle pause blocked - decision overlay is active');
            return;
        }
        
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }
    
    /**
     * Get current game state from all sources
     */
    getCurrentGameState() {
        // Get scene index - check multiple sources for reliability
        let sceneIndex = 0;
        if (window.currentSceneIndex !== undefined) {
            sceneIndex = window.currentSceneIndex;
        } else if (window.currentScene !== undefined) {
            sceneIndex = window.currentScene - 1; // Convert 1-based to 0-based
        }
        
        const currentScene = sceneIndex + 1; // Convert to 1-based for display
        const trustScore = window.trustDecay ? window.trustDecay.getScore() : 100;
        const decisionsMade = window.decisionHistory ? window.decisionHistory.length : 0;
        const goodDecisions = window.goodDecisionCount || 0;
        const riskyChoices = window.riskyChoiceCount || 0;
        const decisionHistory = window.decisionHistory || [];
        
        console.log('🎯 State check: currentSceneIndex=' + window.currentSceneIndex + ', calculated scene=' + currentScene);
        
        return {
            currentScene,
            trustScore,
            decisionsMade,
            goodDecisions,
            riskyChoices,
            decisionHistory
        };
    }
    
    /**
     * Pause video and show dashboard
     */
    pause() {
        // Don't open dashboard if a decision overlay is showing
        if (window.showingDecisionOverlay) {
            console.log('🚫 Dashboard blocked - decision overlay is active');
            return;
        }
        
        if (this.video) {
            this.video.pause();
            // Store the onended handler and remove it during pause
            this.storedOnEnded = this.video.onended;
            this.video.onended = null;
        }
        
        this.isPaused = true;
        this.pauseButton.innerHTML = '▶';
        this.pauseButton.title = 'Resume (Space)';
        
        // Disable decision overlay interactions
        const decisionOverlay = document.getElementById('decision-overlay');
        if (decisionOverlay) {
            decisionOverlay.style.pointerEvents = 'none';
        }
        
        // Hide ChromaBot chat if it's open
        const chromabotChat = document.querySelector('.chromabot-chat-box');
        if (chromabotChat) {
            chromabotChat.style.display = 'none';
        }
        
        this.menuOverlay.style.display = 'block';
        setTimeout(() => {
            this.menuOverlay.style.opacity = '1';
        }, 10);
        
        // Get current game state and update dashboard
        setTimeout(() => {
            const gameState = this.getCurrentGameState();
            
            console.log('📊 Pause menu opened with state:', gameState);
            console.log('🔍 Raw scene data: currentSceneIndex =', window.currentSceneIndex, ', currentScene =', window.currentScene);
            
            // Update dashboard using the centralized update function
            if (window.updatePauseDashboard) {
                window.updatePauseDashboard(gameState);
            }
            
            // Load scene-specific messages if available
            if (window.getSceneMessages) {
                this.loadSceneMessages(gameState.currentScene);
            }
        }, 100);
        
        // Dispatch pause event for other systems
        window.dispatchEvent(new CustomEvent('gamePaused'));
        
        console.log('⏸ Game paused - Dashboard shown');
    }
    
    /**
     * Resume video and hide dashboard
     */
    resume() {
        if (this.video) {
            this.video.play();
            // Restore the onended handler
            if (this.storedOnEnded) {
                this.video.onended = this.storedOnEnded;
            }
        }
        
        this.isPaused = false;
        this.pauseButton.innerHTML = '⏸';
        this.pauseButton.title = 'Pause (Space)';
        
        // Re-enable decision overlay interactions
        const decisionOverlay = document.getElementById('decision-overlay');
        if (decisionOverlay) {
            decisionOverlay.style.pointerEvents = 'auto';
        }
        
        this.menuOverlay.style.opacity = '0';
        setTimeout(() => {
            this.menuOverlay.style.display = 'none';
        }, 300);
        
        // Dispatch resume event for other systems
        window.dispatchEvent(new CustomEvent('gameResumed'));
        
        console.log('▶ Game resumed');
    }
    
    /**
     * Restart assessment
     */
    restart() {
        if (confirm('Restart from beginning? All progress will be lost.')) {
            window.location.reload();
        }
    }
    
    /**
     * Exit to menu
     */
    exit() {
        if (confirm('Exit to character selection? Progress will not be saved.')) {
            const exitPath = this.getAssetPath('Enhanced_Login_System/enhanced-character-selector.html');
            window.location.href = exitPath;
        }
    }
    
    /**
     * Destroy pause menu
     */
    destroy() {
        if (this.pauseButton) this.pauseButton.remove();
        if (this.menuOverlay) this.menuOverlay.remove();
    }
    
    /**
     * Setup dashboard animations
     */
    setupDashboardAnimations() {
        // Breathing background animation
        let breathingPhase = 0;
        setInterval(() => {
            breathingPhase += 0.1;
            const breathIntensity = Math.sin(breathingPhase) * 0.05;
            const bgGradient = document.getElementById('pauseBackgroundGradient');
            if (bgGradient) {
                bgGradient.style.background = `radial-gradient(ellipse at center, rgba(139,69,19,${0.1+breathIntensity}), rgba(75,0,130,${0.15+breathIntensity*1.5}), rgba(0,0,0,0.9) 70%)`;
            }
        }, 500);
        
        // Update time
        setInterval(() => {
            const timeEl = document.getElementById('pauseCurrentTime');
            if (timeEl) {
                timeEl.textContent = new Date().toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
        }, 1000);
    }
    
    /**
     * Get inline dashboard HTML with complete Eli Dashboard V2 styling
     */
    getInlineDashboard() {
        return `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
            
            .pause-dashboard {
                font-family: 'JetBrains Mono', monospace;
                background: #000;
                min-height: 100vh;
                position: relative;
                overflow-x: hidden;
            }
            
            .breathing-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(ellipse at center, rgba(139, 69, 19, 0.15), rgba(75, 0, 130, 0.25), rgba(0,0,0,0.9));
                animation: breathe 4s ease-in-out infinite;
            }
            
            @keyframes breathe {
                0%, 100% { transform: scale(1); opacity: 0.85; }
                50% { transform: scale(1.02); opacity: 1; }
            }
            
            .dashboard-header {
                position: relative;
                z-index: 10;
                padding: 24px;
                border-bottom: 1px solid rgba(168, 85, 247, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .header-left h1 {
                font-size: 2rem;
                font-weight: bold;
                color: white;
                margin-bottom: 4px;
                display: flex;
                align-items: center;
            }
            
            .header-left .subtitle {
                font-size: 0.875rem;
                color: #9ca3af;
            }
            
            .header-right {
                text-align: right;
            }
            
            .header-right .time {
                font-size: 0.875rem;
                color: #9ca3af;
            }
            
            .header-right .scene {
                font-size: 0.75rem;
                color: #a855f7;
            }
            
            .header-right .status {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-top: 4px;
                font-size: 0.75rem;
                color: #10b981;
            }
            
            .dashboard-content {
                position: relative;
                z-index: 10;
                padding: 24px;
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 24px;
            }
            
            @media (max-width: 1024px) {
                .dashboard-content {
                    grid-template-columns: 1fr;
                }
            }
            
            .main-panel {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }
            
            .side-panel {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }
            
            .panel {
                background: rgba(17, 24, 39, 0.8);
                border: 1px solid #374151;
                border-radius: 12px;
                padding: 24px;
                backdrop-filter: blur(12px);
            }
            
            .panel h2, .panel h3 {
                font-weight: bold;
                color: white;
                margin-bottom: 16px;
            }
            
            .vibe-check {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 24px;
            }
            
            .vibe-left {
                display: flex;
                align-items: center;
            }
            
            .vibe-emoji {
                font-size: 3rem;
                margin-right: 12px;
            }
            
            .vibe-text {
                font-size: 1.25rem;
                font-weight: 600;
                color: #fbbf24;
            }
            
            .vibe-right {
                text-align: right;
                font-size: 0.875rem;
                color: #9ca3af;
            }
            
            .trust-bar-container {
                margin-bottom: 24px;
            }
            
            .trust-bar-header {
                display: flex;
                justify-content: space-between;
                font-size: 0.875rem;
                margin-bottom: 8px;
            }
            
            .trust-bar {
                position: relative;
                height: 24px;
                background: #1f2937;
                border-radius: 12px;
                overflow: hidden;
            }
            
            .trust-progress {
                height: 100%;
                background: #10b981;
                transition: width 1s ease-in-out;
                box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
            }
            
            .trust-labels {
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem;
                margin-top: 4px;
                color: #6b7280;
            }
            
            .action-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 16px;
            }
            
            .action-btn {
                padding: 12px 16px;
                font-weight: 600;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
                font-family: 'JetBrains Mono', monospace;
            }
            
            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            }
            
            .btn-resume {
                background: rgba(16, 185, 129, 0.8);
                color: white;
            }
            
            .btn-resume:hover {
                background: #10b981;
            }
            
            .btn-restart {
                background: rgba(245, 158, 11, 0.8);
                color: white;
            }
            
            .btn-restart:hover {
                background: #f59e0b;
            }
            
            .btn-exit {
                background: rgba(239, 68, 68, 0.8);
                color: white;
            }
            
            .btn-exit:hover {
                background: #ef4444;
            }
            
            .stats-grid {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .stat-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid rgba(75, 85, 99, 0.3);
            }
            
            .stat-row:last-child {
                border-bottom: none;
            }
            
            .stat-label {
                color: #9ca3af;
                font-size: 0.875rem;
                text-transform: lowercase;
            }
            
            .stat-value {
                font-weight: bold;
                font-size: 1rem;
            }
            
            .stat-green { color: #10b981; }
            .stat-red { color: #ef4444; }
            .stat-orange { color: #f59e0b; }
            .stat-purple { color: #a855f7; }
            
            .decision-history {
                max-height: 320px;
                overflow-y: auto;
            }
            
            .decision-item {
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 12px;
            }
            
            .decision-safe {
                background: rgba(16, 185, 129, 0.3);
                border: 1px solid rgba(16, 185, 129, 0.2);
            }
            
            .decision-risky {
                background: rgba(239, 68, 68, 0.3);
                border: 1px solid rgba(239, 68, 68, 0.2);
            }
            
            .decision-header {
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem;
                margin-bottom: 4px;
            }
            
            .decision-trust {
                font-size: 0.875rem;
                color: #d1d5db;
            }
            
            .notes {
                font-size: 0.875rem;
                color: #d1d5db;
                line-height: 1.6;
            }
            
            .notes div {
                margin-bottom: 8px;
            }
            
            .notes .hint {
                font-size: 0.75rem;
                color: #6b7280;
                margin-top: 12px;
            }
            
            .chat-message {
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 12px;
                transition: all 0.3s ease;
            }
            
            .chat-message:hover {
                transform: translateX(5px);
            }
            
            .slide-in-right {
                animation: slideInRight 0.5s ease-out;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            /* Message Feed Styles - Force display with !important */
            .message-feed {
                max-height: 400px !important;
                min-height: 200px !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                margin-bottom: 16px !important;
                display: block !important;
                width: 100% !important;
            }
            
            .message-item {
                padding: 10px !important;
                border-radius: 8px !important;
                margin-bottom: 12px !important;
                position: relative !important;
                transition: all 0.3s ease !important;
                display: block !important;
                width: 100% !important;
                box-sizing: border-box !important;
                min-height: 60px !important;
            }
            
            .message-item.toxic {
                background: rgba(239, 68, 68, 0.2);
                border: 1px solid rgba(239, 68, 68, 0.3);
            }
            
            .message-item.safe {
                background: rgba(16, 185, 129, 0.2);
                border: 1px solid rgba(16, 185, 129, 0.3);
            }
            
            .message-item.encrypted {
                background: rgba(168, 85, 247, 0.2);
                border: 1px solid rgba(168, 85, 247, 0.3);
                filter: blur(2px);
                opacity: 0.6;
            }
            
            .message-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                font-size: 0.75rem;
            }
            
            .message-user {
                color: #ef4444;
                font-weight: 600;
            }
            
            .message-time {
                color: #6b7280;
            }
            
            .message-text {
                font-size: 0.875rem;
                color: #d1d5db;
                margin-bottom: 8px;
            }
            
            .encrypt-btn {
                padding: 4px 12px;
                background: rgba(168, 85, 247, 0.3);
                border: 1px solid #a855f7;
                border-radius: 4px;
                color: #c084fc;
                font-size: 0.75rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'JetBrains Mono', monospace;
            }
            
            .encrypt-btn:hover {
                background: rgba(168, 85, 247, 0.5);
                transform: translateY(-1px);
            }
            
            /* ChromaBot Section */
            .chromabot-section {
                background: rgba(0, 255, 255, 0.05);
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 8px;
                padding: 12px;
            }
            
            .chromabot-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-weight: 600;
            }
            
            .chromabot-response {
                background: rgba(0, 0, 0, 0.3);
                padding: 10px;
                border-radius: 6px;
                font-size: 0.875rem;
                color: #d1d5db;
                margin-bottom: 10px;
                min-height: 60px;
                line-height: 1.5;
            }
            
            .chromabot-form {
                display: flex;
                gap: 8px;
            }
            
            .chromabot-form input {
                flex: 1;
                padding: 8px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 4px;
                color: white;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.875rem;
            }
            
            .chromabot-form input:focus {
                outline: none;
                border-color: #00ffff;
            }
            
            .chromabot-form button {
                padding: 8px 16px;
                background: rgba(0, 255, 255, 0.2);
                border: 1px solid #00ffff;
                border-radius: 4px;
                color: #00ffff;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.875rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .chromabot-form button:hover {
                background: rgba(0, 255, 255, 0.3);
                transform: translateY(-1px);
            }
            
            .chroma-easter-egg {
                animation: chromaGlow 2s ease-in-out infinite;
            }
            
            @keyframes chromaGlow {
                0%, 100% { color: #00ffff; text-shadow: 0 0 10px rgba(0, 255, 255, 0.5); }
                50% { color: #a855f7; text-shadow: 0 0 15px rgba(168, 85, 247, 0.8); }
            }
        </style>
        
        <div class="pause-dashboard">
            <div id="pauseBackgroundGradient" class="breathing-bg"></div>
            
            <div class="dashboard-header">
                <div class="header-left">
                    <h1>
                        <span style="color: #a855f7; margin-right: 8px;">◉</span>
                        eli's space - PAUSED
                        <span style="font-size: 0.75rem; margin-left: 12px; color: #6b7280;">taking a break</span>
                    </h1>
                    <div class="subtitle">
                        🎵 <span id="pauseCurrentTrack">lo-fi beats to cry to</span> • press SPACE to resume
                    </div>
                </div>
                
                <div class="header-right">
                    <div id="pauseCurrentTime" class="time">3:47 AM</div>
                    <div class="scene">scene <span id="pauseCurrentScene">1</span>/6</div>
                    <div class="status">
                        <span>● game paused</span>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-content">
                <div class="main-panel">
                    <div class="panel">
                        <div class="vibe-check">
                            <div class="vibe-left">
                                <span id="pauseVibeEmoji" class="vibe-emoji">😐</span>
                                <div>
                                    <h2 style="margin-bottom: 4px;">current vibe</h2>
                                    <p id="pauseVibeText" class="vibe-text">TAKING A BREAK</p>
                                </div>
                            </div>
                            <div class="vibe-right">
                                <div>trust score: <span id="pauseTrustScore" style="color: #10b981; font-weight: bold;">100</span></div>
                                <div>decisions made: <span id="pauseDecisionsMade">0</span></div>
                            </div>
                        </div>
                        
                        <div class="trust-bar-container">
                            <div class="trust-bar-header">
                                <span style="color: #c084fc;">trust level</span>
                                <span id="pauseTrustPercent" style="color: white; font-weight: bold;">100%</span>
                            </div>
                            <div class="trust-bar">
                                <div id="pauseTrustBar" class="trust-progress" style="width: 100%"></div>
                            </div>
                            <div class="trust-labels">
                                <span>😰 vulnerable</span>
                                <span>😐 uncertain</span>
                                <span>😊 protected</span>
                            </div>
                        </div>
                        
                        <div class="action-buttons">
                            <button id="pauseResumeBtn" class="action-btn btn-resume">▶ RESUME</button>
                            <button id="pauseRestartBtn" class="action-btn btn-restart">🔄 RESTART</button>
                            <button id="pauseExitBtn" class="action-btn btn-exit">❌ EXIT</button>
                        </div>
                    </div>
                </div>
                
                <div class="side-panel">
                    <div class="panel">
                        <h3>game stats</h3>
                        <div class="stats-grid">
                            <div class="stat-row">
                                <span class="stat-label">scenes completed</span>
                                <span id="pauseScenesCompleted" class="stat-value stat-green">0/6</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">good decisions</span>
                                <span id="pauseGoodDecisions" class="stat-value stat-green">0</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">risky choices</span>
                                <span id="pauseRiskyChoices" class="stat-value stat-red">0</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">trust lost</span>
                                <span id="pauseTrustLost" class="stat-value stat-orange">0</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="panel">
                        <h3>recent decisions</h3>
                        <div id="pauseDecisionHistory" class="decision-history">
                            <div style="text-align: center; padding: 16px; color: #6b7280; font-size: 0.875rem;">No decisions yet</div>
                        </div>
                    </div>
                    
                    <div class="panel">
                        <h3>🔐 message feed <span style="font-size: 0.75rem; color: #6b7280;">(live)</span></h3>
                        <div id="pauseMessageFeed" class="message-feed">
                            <!-- Messages loaded dynamically -->
                        </div>
                        
                        <div class="chromabot-section">
                            <div class="chromabot-header">
                                <span style="color: #00ffff;">💬 ChromaBot</span>
                                <span style="font-size: 0.75rem; color: #6b7280;">AI Assistant</span>
                            </div>
                            <div id="chromabotResponse" class="chromabot-response">
                                Ask me about the messages or decisions...
                            </div>
                            <form id="chromabotForm" class="chromabot-form">
                                <input type="text" id="chromabotInput" placeholder="Ask ChromaBot..." />
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            // Dashboard update function is now defined in defineGlobalFunctions()
            // This ensures it's available before the first pause
            console.log('✅ Dashboard inline script loaded');
        </script>
        `;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.PauseMenuSystem = PauseMenuSystem;
}
