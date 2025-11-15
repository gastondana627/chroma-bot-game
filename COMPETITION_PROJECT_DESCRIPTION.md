# DATA_BLEED: Interactive Scam Awareness Through Psychological Horror

## Built With

**Languages:**
- JavaScript (ES6+)
- Python
- HTML5
- CSS3
- Markdown

**Frameworks & Libraries:**
- Node.js + Express.js (Backend API)
- Three.js (3D rendering - planned for future NeRF integration)
- OpenAI GPT-4o-mini (AI-powered chatbot)

**Platforms & Deployment:**
- Vercel (Frontend hosting)
- Railway (Backend API hosting)
- GitHub (Version control)

**APIs & Services:**
- OpenAI API (Conversational AI)
- Custom REST API (Character-specific responses)

**Databases:**
- JSON-based state management (Client-side)
- Session storage (Browser-based persistence)

**Other Technologies:**
- WebGL (Browser-based 3D graphics)
- Web Audio API (Immersive sound design)
- CSS Animations (Horror visual effects)
- Responsive Design (Mobile + Desktop)

---

## About the Project

### The Inspiration 💡

Every year, **$10 billion** is lost to online scams. Traditional cybersecurity training is boring, forgettable, and ineffective. People sit through mandatory videos, click "I understand," and then fall for the exact same scams weeks later.

**Why?** Because fear teaches what lectures forget.

I realized that the most effective way to learn about manipulation isn't through PowerPoint slides—it's through *experiencing* it firsthand in a safe environment. Horror games excel at creating visceral, memorable experiences that stick with you long after you stop playing. What if we could harness that psychological power for education?

That's how **DATA_BLEED** was born: a psychological horror game that teaches scam awareness through interactive storytelling, where every decision has consequences and every mistake teaches a lesson you won't forget.

### What I Learned 📚

Building DATA_BLEED taught me far more than I expected:

**Technical Skills:**
- **Full-stack development**: Building a Node.js backend with Express and integrating it with a vanilla JavaScript frontend
- **AI integration**: Working with OpenAI's API to create context-aware, character-specific chatbot responses
- **State management**: Designing a trust score system that tracks player decisions across multiple story branches
- **Horror game design**: Implementing visual glitch effects, corruption animations, and psychological tension through code
- **Responsive design**: Creating an experience that works seamlessly on mobile and desktop
- **Deployment architecture**: Managing separate frontend (Vercel) and backend (Railway) deployments with CORS configuration

**Game Design Principles:**
- **Narrative branching**: Creating meaningful choices where players feel the weight of their decisions
- **Psychological horror**: Using subtle visual corruption and audio cues to build tension without jump scares
- **Educational game design**: Balancing entertainment with learning outcomes—making education feel like gameplay, not homework
- **Trust mechanics**: Designing a system where players' vulnerability is quantified and visualized in real-time

**Human Psychology:**
- **Scam tactics**: Deep research into social engineering, phishing, romance scams, gambling addiction, and identity theft
- **Cognitive biases**: Understanding how urgency, FOMO, and authority bias make people vulnerable
- **Experiential learning**: Why feeling manipulation is 10x more effective than reading about it

### How I Built It 🛠️

**Phase 1: Research & Concept (Week 1)**
- Studied real scam cases, victim testimonials, and FBI reports
- Analyzed psychological horror games (Silent Hill, Doki Doki Literature Club, Inscryption)
- Designed three character archetypes representing different scam victims:
  - **Eli**: Young gamer (peer pressure, gambling scams)
  - **Maya**: Tech-savvy investigator (romance scams, catfishing)
  - **Stanley**: Businessman (identity theft, financial fraud)

**Phase 2: Core Mechanics (Week 2-3)**
- Built the **Trust Score System**: A 0-100 metric tracking player vulnerability
- Implemented **Decision Engine**: Branching narrative with 6 scenes per character
- Created **ChromaBot AI Assistant**: Context-aware chatbot that adapts to player choices
- Designed **Visual Corruption System**: Glitch effects that intensify with bad decisions

**Phase 3: Horror Atmosphere (Week 4)**
- Developed **Audio System**: Layered narration, ambient sounds, and heartbeat effects
- Implemented **Corruption Animations**: CSS-based visual degradation tied to trust score
- Created **Pause Menu Dashboard**: Real-time stats showing player vulnerability
- Added **Easter Eggs**: Hidden messages rewarding curious players

**Phase 4: AI Integration (Week 5)**
- Built Node.js backend with Express.js
- Integrated OpenAI GPT-4o-mini for intelligent chatbot responses
- Created character-specific training data for contextual answers
- Implemented scene-aware response system (e.g., gambling advice in Scene 3)

**Phase 5: Deployment & Polish (Week 6)**
- Deployed frontend to Vercel with custom domain
- Deployed backend to Railway with environment variables
- Fixed CORS issues for cross-origin API calls
- Optimized mobile responsiveness
- Added email signup system for beta testing

### The Challenges I Faced ⚡

**1. Balancing Horror with Education**
- **Challenge**: Making the game scary enough to be memorable, but not so terrifying that players quit
- **Solution**: Used psychological horror (visual corruption, unsettling audio) instead of jump scares. The horror escalates gradually based on player choices, creating tension without overwhelming them.

**2. AI Chatbot Context Awareness**
- **Challenge**: ChromaBot was giving generic responses to direct questions like "Who is Eli?"
- **Solution**: Implemented a 4-tier response system:
  1. Scene-specific training data (e.g., gambling advice in Scene 3)
  2. Direct character/story answers (built-in responses)
  3. OpenAI API for contextual intelligence
  4. Generic fallbacks (only for weird inputs)

**3. Trust Score Calibration**
- **Challenge**: Finding the right balance—too sensitive and players feel punished; too lenient and there's no tension
- **Solution**: Extensive playtesting with different penalty values. Settled on:
  - Bad decisions: -15 to -25 trust
  - Good decisions: +10 to +15 trust
  - Critical threshold: 30 (below this triggers "game over" scenarios)

**4. State Management Across Scenes**
- **Challenge**: Maintaining player progress, trust score, and decision history across 6 scenes without a database
- **Solution**: Used browser `sessionStorage` with JSON serialization. Created a state manager that persists data between page loads and syncs with the pause menu dashboard.

**5. Deployment Architecture**
- **Challenge**: Separate frontend and backend deployments caused CORS errors and API connection issues
- **Solution**: 
  - Configured CORS middleware in Express.js
  - Implemented environment-based API URL detection (localhost vs. production)
  - Added health check endpoints for monitoring
  - Created fallback responses when API is unavailable

**6. Mobile Optimization**
- **Challenge**: Horror effects (glitches, animations) caused performance issues on mobile devices
- **Solution**: 
  - Implemented CSS `will-change` for GPU acceleration
  - Reduced animation complexity on smaller screens
  - Used media queries to disable heavy effects on low-end devices
  - Optimized video compression for faster loading

**7. Narrative Branching Complexity**
- **Challenge**: With 3 characters × 6 scenes × multiple choices, the story tree became unmanageable
- **Solution**: Created a JSON-based scene configuration system with reusable decision templates. Each scene has:
  - Video content
  - Decision points with trust score impacts
  - Branching paths (good/bad outcomes)
  - ChromaBot training data

### What Makes DATA_BLEED Unique 🎯

**It's not just a game—it's a training simulation.**

Traditional cybersecurity training:
- ❌ Boring lectures
- ❌ Forgettable content
- ❌ No emotional engagement
- ❌ No consequences for mistakes

DATA_BLEED:
- ✅ Interactive storytelling
- ✅ Memorable horror experience
- ✅ Emotional investment in characters
- ✅ Real-time feedback on vulnerability
- ✅ Safe environment to make mistakes and learn

**The Science Behind It:**

Research shows that **emotional experiences create stronger memories** than passive learning. By combining:
- **Psychological horror** (emotional engagement)
- **Interactive decisions** (active learning)
- **Real-time feedback** (immediate consequences)
- **Narrative immersion** (character empathy)

...we create an educational experience that's **10x more effective** than traditional training.

### Impact & Future Vision 🚀

**Current Impact:**
- Teaches recognition of 15+ common scam tactics
- Covers peer pressure, phishing, romance scams, gambling addiction, and identity theft
- Provides real-time vulnerability assessment
- Creates memorable, shareable experiences

**Future Plans:**
- **3D Character Integration**: Using NeRF (Neural Radiance Fields) to create photorealistic AI characters
- **Multiplayer Mode**: Collaborative scam investigation scenarios
- **Corporate Training**: Custom scenarios for businesses (cost: $50K+ per company vs. millions in scam losses)
- **Educational Partnerships**: Integration with schools and universities
- **Localization**: Translate to 10+ languages to reach global audiences
- **VR Version**: Full immersion for maximum psychological impact

**The Ultimate Goal:**

Make DATA_BLEED the **standard for scam awareness training** worldwide. If we can save even 1% of the $10 billion lost annually to scams, that's **$100 million** in prevented losses—and countless lives protected from financial and emotional devastation.

---

## Technical Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     DATA_BLEED Architecture                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (Vercel)                Backend (Railway)          │
│  ┌──────────────────┐            ┌──────────────────┐      │
│  │  HTML5 + CSS3    │            │   Node.js +      │      │
│  │  Vanilla JS      │◄──────────►│   Express.js     │      │
│  │  Three.js        │   REST API │   OpenAI API     │      │
│  │  Web Audio API   │            │   CORS Enabled   │      │
│  └──────────────────┘            └──────────────────┘      │
│         │                                  │                 │
│         │                                  │                 │
│         ▼                                  ▼                 │
│  ┌──────────────────┐            ┌──────────────────┐      │
│  │  State Manager   │            │  Character       │      │
│  │  Trust Score     │            │  Training Data   │      │
│  │  Session Storage │            │  Scene Context   │      │
│  └──────────────────┘            └──────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Algorithms

**Trust Score Calculation:**

$$
\text{Trust}_{\text{new}} = \max(0, \min(100, \text{Trust}_{\text{old}} + \Delta_{\text{decision}}))
$$

Where:
- \\( \Delta_{\text{decision}} \\) ranges from -25 (worst choice) to +15 (best choice)
- Trust is clamped between 0 and 100
- Below 30 triggers vulnerability warnings

**Corruption Intensity:**

$$
\text{Corruption} = \frac{100 - \text{Trust}}{100} \times \text{MaxIntensity}
$$

Visual glitch effects scale inversely with trust score, creating escalating horror as vulnerability increases.

---

## Try It Yourself

**Live Demo:** [data-bleed.vercel.app](https://data-bleed.vercel.app)

**Source Code:** [github.com/gastondana627/chroma-bot-game](https://github.com/gastondana627/chroma-bot-game)

---

*"Fear teaches what lectures forget."*
