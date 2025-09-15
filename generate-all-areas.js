#!/usr/bin/env node

/**
 * Generate All Gameplay Areas Script
 * Creates all 18 areas (6 per character) with consistent structure
 */

const fs = require('fs');
const path = require('path');

// Area definitions for each character
const AREAS = {
    maya: [
        { id: 1, name: 'home-base', title: 'Home Base', emoji: '🏠', description: 'Maya\'s secure apartment with cybersecurity monitoring setup. Multiple screens show threat alerts and security dashboards.' },
        { id: 2, name: 'dating-app', title: 'Dating App Interface', emoji: '💕', description: 'Interactive dating app where Maya encounters suspicious profiles. Red flags and security warnings appear as she navigates.' },
        { id: 3, name: 'investigation-hub', title: 'Investigation Hub', emoji: '🕵️', description: 'Digital forensics workspace with evidence boards and data analysis tools. Maya pieces together cyber crime patterns.' },
        { id: 4, name: 'cyber-cafe', title: 'Cyber Cafe', emoji: '🌐', description: 'Public internet space where Maya observes social engineering attacks and educates other users about security.' },
        { id: 5, name: 'corporate-office', title: 'Corporate Office', emoji: '🏢', description: 'Maya\'s workplace handling cybersecurity incidents. Training sessions and real-time threat response scenarios.' },
        { id: 6, name: 'final-confrontation', title: 'Final Confrontation', emoji: '🎯', description: 'High-stakes digital showdown. Maya uses all her skills to prevent a major cyber attack and protect victims.' }
    ],
    eli: [
        { id: 1, name: 'gaming-setup', title: 'Gaming Setup', emoji: '🏠', description: 'Eli\'s gaming room with streaming equipment. Multiple monitors show games, chat, and performance metrics.' },
        { id: 2, name: 'tournament-arena', title: 'Tournament Arena', emoji: '🎯', description: 'Competitive gaming environment with peer pressure scenarios. Eli faces exploitation attempts and learns to resist.' },
        { id: 3, name: 'gambling-platform', title: 'Gambling Platform', emoji: '💰', description: 'Online gambling interface showing addiction mechanics. Eli learns about financial manipulation in gaming.' },
        { id: 4, name: 'gaming-community', title: 'Gaming Community', emoji: '👥', description: 'Online community hub with chat rooms and forums. Eli encounters toxic behavior and promotes healthy gaming.' },
        { id: 5, name: 'school-campus', title: 'School/Campus', emoji: '🏫', description: 'Educational environment where Eli shares gaming security knowledge with classmates and teachers.' },
        { id: 6, name: 'championship-victory', title: 'Championship Victory', emoji: '🏆', description: 'Final tournament where Eli applies security knowledge to win while helping other players stay safe.' }
    ],
    stanley: [
        { id: 1, name: 'suburban-home', title: 'Suburban Home', emoji: '🏠', description: 'Stanley\'s quiet home office where he discovers identity theft. Computer screens show suspicious account activity.' },
        { id: 2, name: 'social-media-maze', title: 'Social Media Maze', emoji: '📱', description: 'Complex social media landscape with fake profiles and catfishing attempts. Stanley learns to identify deception.' },
        { id: 3, name: 'financial-district', title: 'Financial District', emoji: '🏦', description: 'Banking area where Stanley learns about financial fraud and identity protection. ATMs and bank interfaces feature prominently.' },
        { id: 4, name: 'digital-marketplace', title: 'Digital Marketplace', emoji: '🌐', description: 'Online marketplace showing how personal information is traded. Stanley discovers the dark web of identity theft.' },
        { id: 5, name: 'law-enforcement', title: 'Law Enforcement', emoji: '👮', description: 'Police cybercrime unit where Stanley reports crimes and learns about legal protections and investigation processes.' },
        { id: 6, name: 'protection-network', title: 'Protection Network', emoji: '🛡️', description: 'Community hub where Stanley helps others secure their identities and shares protection strategies.' }
    ]
};

// Character themes
const THEMES = {
    maya: {
        primaryColor: '#ff1493',
        secondaryColor: '#00bfff',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a1a2a 100%)',
        gradients: 'radial-gradient(circle at 20% 80%, rgba(255, 20, 147, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 191, 255, 0.15) 0%, transparent 50%)'
    },
    eli: {
        primaryColor: '#00ffff',
        secondaryColor: '#0066ff',
        background: 'radial-gradient(ellipse at center, #0a1a2a 0%, #000810 100%)',
        gradients: 'radial-gradient(ellipse at center, #0a1a2a 0%, #000810 100%)'
    },
    stanley: {
        primaryColor: '#9ca3af',
        secondaryColor: '#6b7280',
        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 30%, #374151 70%, #1f2937 100%)',
        gradients: 'linear-gradient(135deg, #6b7280 0%, #4b5563 30%, #374151 70%, #1f2937 100%)'
    }
};

function generateAreaHTML(character, area) {
    const theme = THEMES[character];
    const nextArea = area.id < 6 ? area.id + 1 : null;
    const prevArea = area.id > 1 ? area.id - 1 : null;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DATA_BLEED - ${character.charAt(0).toUpperCase() + character.slice(1)}'s ${area.title}</title>
    <style>
        body {
            margin: 0;
            background: ${theme.background};
            font-family: 'Inter', sans-serif;
            overflow: hidden;
            color: white;
            position: relative;
            width: 100vw;
            height: 100vh;
        }

        .area-container {
            position: relative;
            width: 100%;
            height: 100%;
            background: ${theme.gradients};
        }

        /* Continue Button - Center Top */
        .continue-button {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            padding: 15px 30px;
            background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            font-family: inherit;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(${theme.primaryColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.4);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .continue-button:hover {
            transform: translateX(-50%) translateY(-2px);
            box-shadow: 0 6px 20px rgba(${theme.primaryColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.6);
        }

        .continue-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: translateX(-50%);
        }

        /* Pause Button - Top Left */
        .pause-button {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            padding: 10px 20px;
            background: #00FFFF;
            color: black;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-family: inherit;
            transition: all 0.3s ease;
        }

        .pause-button:hover {
            background: #00CCCC;
            transform: translateY(-2px);
        }

        /* Chroma Orb - Bottom Right with Video */
        .chroma-orb {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 80px;
            height: 80px;
            cursor: pointer;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
            transition: transform 0.3s ease;
            z-index: 2000;
            animation: orbPulse 3s ease-in-out infinite;
        }

        .chroma-orb:hover {
            transform: scale(1.15);
        }

        .chroma-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }

        @keyframes orbPulse {
            0%, 100% { box-shadow: 0 0 12px rgba(0, 255, 255, 0.5); }
            50% { box-shadow: 0 0 25px rgba(0, 255, 255, 0.8); }
        }

        /* Chat Box */
        .chat-box {
            position: fixed;
            bottom: 120px;
            right: 20px;
            width: 280px;
            height: 380px;
            background: rgba(20, 20, 20, 0.92);
            border: 2px solid #00FFFF;
            border-radius: 12px;
            display: none;
            flex-direction: column;
            padding: 10px;
            z-index: 2001;
        }

        .chat-header {
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
            position: relative;
            color: #00FFFF;
        }

        .close-chat {
            position: absolute;
            right: 0;
            top: 0;
            background: transparent;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            font-size: 14px;
            color: white;
        }

        .chat-form {
            display: flex;
            margin-top: 8px;
        }

        .chat-input {
            flex: 1;
            padding: 6px;
            border: 1px solid #7928CA;
            background: #333;
            color: white;
            border-radius: 6px;
        }

        .chat-submit {
            margin-left: 6px;
            padding: 6px 10px;
            border: none;
            border-radius: 6px;
            background: #FF0080;
            color: white;
            cursor: pointer;
        }

        /* Content Area */
        .content-layer {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 80px 40px 40px 40px; /* Extra top padding for continue button */
        }

        .area-title {
            font-size: 3.5em;
            font-weight: bold;
            margin-bottom: 20px;
            color: ${theme.primaryColor};
            text-shadow: 0 0 20px rgba(${theme.primaryColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.5);
        }

        .area-description {
            font-size: 1.3em;
            max-width: 800px;
            margin-bottom: 40px;
            line-height: 1.6;
            background: rgba(0, 0, 0, 0.7);
            padding: 25px;
            border-radius: 15px;
            border: 2px solid ${theme.primaryColor};
        }

        .development-space {
            width: 80%;
            height: 300px;
            border: 2px dashed ${theme.primaryColor};
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(${theme.primaryColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.1);
            color: ${theme.primaryColor};
            font-size: 1.2em;
            text-align: center;
        }

        .fade-in {
            animation: fadeIn 0.6s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    </style>
</head>
<body>
    <!-- Continue Button - Center Top -->
    <button class="continue-button" onclick="continueToNext()" ${!nextArea ? 'style="display: none;"' : ''}>
        ${nextArea ? `Continue to Area ${nextArea} →` : 'Complete!'}
    </button>

    <!-- Pause Button - Top Left -->
    <button class="pause-button" onclick="pauseGame()">⏸ Pause Game</button>

    <!-- Area Container -->
    <div class="area-container fade-in">
        <div class="content-layer">
            <h1 class="area-title">${area.emoji} ${area.title}</h1>
            <div class="area-description">
                ${area.description}
            </div>
            
            <!-- Development Space -->
            <div class="development-space">
                <div>
                    <h3>🎨 Development Space Ready</h3>
                    <p>Area ${area.id} of 6 - This space is ready for your artwork and interactive elements.</p>
                    <p>Character: ${character.toUpperCase()} | Theme: ${area.title}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Chroma Orb - Bottom Right with Video Animation -->
    <div class="chroma-orb" onclick="toggleChat()">
        <video class="chroma-video" autoplay loop muted playsinline>
            <source src="../../chroma-bot/assets/vid/Chroma_Vid.mp4" type="video/mp4">
            <!-- Fallback if video doesn't load -->
            🤖
        </video>
    </div>

    <!-- Chat Box -->
    <div class="chat-box" id="chat-box">
        <div class="chat-header">
            💬 Chroma Bot
            <button class="close-chat" onclick="toggleChat()">✖</button>
        </div>
        <div class="chat-messages" id="chat-messages">
            <p><b>Bot:</b> Welcome to ${character.charAt(0).toUpperCase() + character.slice(1)}'s ${area.title}! I can help you learn about this area.</p>
        </div>
        <form class="chat-form" onsubmit="sendMessage(event)">
            <input type="text" class="chat-input" id="chat-input" placeholder="Ask about this area..." required>
            <button type="submit" class="chat-submit">Send</button>
        </form>
    </div>

    <script>
        function continueToNext() {
            ${nextArea ? `
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = './area-${nextArea}-${AREAS[character][nextArea - 1].name}.html';
            }, 300);
            ` : `
            alert('🎉 Congratulations! You\\'ve completed all areas for ${character.toUpperCase()}!');
            `}
        }

        function pauseGame() {
            console.log('⏸️ Pausing game and returning to dashboard');
            
            // Clear gameplay session data
            sessionStorage.removeItem('gameplayCharacter');
            sessionStorage.removeItem('gameplayArea');
            sessionStorage.removeItem('gameplayMode');
            
            // Return to main app and show dashboard
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    action: 'pause-game',
                    character: '${character}',
                    currentArea: ${area.id}
                }, '*');
            } else {
                // Direct navigation back to main app
                window.location.href = '../../index.html#dashboard-${character}';
            }
        }

        // Fireworks system for orb clicks
        const canvas = document.createElement('canvas');
        canvas.id = 'fireworks';
        canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none;';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Firework {
            constructor(x, y, color, velocity) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.velocity = velocity;
                this.alpha = 1;
                this.radius = 2;
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            
            update() {
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                this.alpha -= 0.02;
                this.draw();
            }
        }

        let fireworks = [];
        
        function createFirework(x, y, mode = "explode") {
            const metallicColors = ["rgba(192,192,192,1)", "rgba(220,220,220,0.9)", "rgba(255,255,255,0.8)", "rgba(169,169,169,0.9)"];
            const particleCount = mode === "explode" ? 100 : 70;
            const baseSpeed = mode === "explode" ? 5 : 4;
            
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * baseSpeed + 1;
                const velocity = mode === "explode" ? 
                    { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed } : 
                    { x: -Math.cos(angle) * speed * 0.5, y: -Math.sin(angle) * speed * 0.5 };
                fireworks.push(new Firework(x, y, metallicColors[Math.floor(Math.random() * metallicColors.length)], velocity));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            fireworks = fireworks.filter((f) => {
                if (f.alpha <= 0) return false;
                f.update();
                return true;
            });
        }
        animate();

        function toggleChat() {
            const chatBox = document.getElementById('chat-box');
            const video = document.querySelector('.chroma-video');
            const orb = document.querySelector('.chroma-orb');
            
            if (chatBox.style.display === 'flex') {
                // Close chat - create implosion effect
                const rect = orb.getBoundingClientRect();
                createFirework(rect.left + rect.width / 2, rect.top + rect.height / 2, "implode");
                chatBox.style.display = 'none';
                if (video) {
                    video.play();
                }
            } else {
                // Open chat - create explosion effect
                const rect = orb.getBoundingClientRect();
                createFirework(rect.left + rect.width / 2, rect.top + rect.height / 2, "explode");
                chatBox.style.display = 'flex';
                if (video) {
                    video.pause();
                }
            }
        }

        function sendMessage(event) {
            event.preventDefault();
            const input = document.getElementById('chat-input');
            const messages = document.getElementById('chat-messages');
            const message = input.value.trim();
            
            if (message) {
                const userMsg = document.createElement('p');
                userMsg.innerHTML = \`<b>You:</b> \${message}\`;
                messages.appendChild(userMsg);
                
                setTimeout(() => {
                    const botMsg = document.createElement('p');
                    botMsg.innerHTML = \`<b>Bot:</b> Great question about ${area.title}! This area focuses on ${area.description.split('.')[0].toLowerCase()}.\`;
                    messages.appendChild(botMsg);
                    messages.scrollTop = messages.scrollHeight;
                }, 1000);
                
                input.value = '';
                messages.scrollTop = messages.scrollHeight;
            }
        }

        console.log('${character.charAt(0).toUpperCase() + character.slice(1)} Area ${area.id}: ${area.title} loaded');
    </script>
</body>
</html>`;
}

function generateAllAreas() {
    console.log('🏗️ Generating all 18 gameplay areas...');
    
    let generatedCount = 0;
    
    Object.keys(AREAS).forEach(character => {
        const characterDir = `gameplay-areas/${character}`;
        
        // Create character directory if it doesn't exist
        if (!fs.existsSync(characterDir)) {
            fs.mkdirSync(characterDir, { recursive: true });
        }
        
        AREAS[character].forEach(area => {
            const filename = `area-${area.id}-${area.name}.html`;
            const filepath = path.join(characterDir, filename);
            
            const html = generateAreaHTML(character, area);
            
            try {
                fs.writeFileSync(filepath, html);
                console.log(`✅ Generated: ${filepath}`);
                generatedCount++;
            } catch (error) {
                console.error(`❌ Failed to generate ${filepath}:`, error.message);
            }
        });
    });
    
    console.log(`\n🎉 Successfully generated ${generatedCount}/18 areas!`);
    console.log('\n📋 Summary:');
    console.log('- Maya: 6 cybersecurity areas');
    console.log('- Eli: 6 gaming security areas'); 
    console.log('- Stanley: 6 identity protection areas');
    console.log('\n🎮 Each area includes:');
    console.log('- Continue button (center top)');
    console.log('- Pause button (top left)');
    console.log('- Chroma orb (bottom right)');
    console.log('- Development space for artwork');
    console.log('- Character-specific theming');
    console.log('\n🚀 Ready for artwork integration and development!');
}

// Run the generator
if (require.main === module) {
    generateAllAreas();
}

module.exports = { generateAllAreas, AREAS, THEMES };