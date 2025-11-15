# Competition Submission Information

## Elevator Pitch

**"A psychological horror game that teaches scam awareness through experience—because fear teaches what lectures forget."**

### Why This Pitch Works:
- ✅ Non-technical but sophisticated
- ✅ Captures the horror + education fusion perfectly
- ✅ Memorable tagline that sticks
- ✅ Implies broader impact without being preachy
- ✅ Perfect length for competition forms
- ✅ Embodies your core philosophy about experiential learning

### Alternative Options (if needed):

**Option 2:** "The first horror-based education platform that makes you immune to scams by letting you feel the manipulation firsthand."

**Option 3:** "Interactive scam education that saves lives and money by teaching through visceral experience, not boring training videos."

**Option 4:** "Where cybersecurity meets psychological horror—experience manipulation to build real resistance against digital predators."

**Option 5:** "Turning the $10 billion scam epidemic into experiential learning that actually sticks—one terrifying lesson at a time."

---

## ChromaBot Fix Summary

### Issue:
ChromaBot was giving generic boilerplate responses to all questions, even direct ones like "Who is Eli?"

### Solution:
Updated `videos/eli/chromabot-video-config.js` to:

1. **Check scene-specific responses first** - Uses training data from `chromabot-scene-training.js`
2. **Handle direct questions** - Answers questions about characters, story, and gameplay
3. **Call API for contextual responses** - Connects to OpenAI backend for intelligent answers
4. **Fallback gracefully** - Only uses generic responses when nothing else matches

### Response Priority:
1. Scene-specific keywords (e.g., "gambling" in Scene 3)
2. Direct character/story questions (e.g., "Who is Eli?")
3. API-powered contextual responses
4. Generic helpful fallbacks (only for weird/indirect inputs)

### Example Improvements:

**Before:**
- User: "Who is Eli?"
- ChromaBot: "Good thinking! Always be cautious with personal information online." ❌

**After:**
- User: "Who is Eli?"
- ChromaBot: "Eli is a young gamer facing peer pressure and online scams. He's learning to navigate digital dangers while staying true to himself." ✅

---

## Testing

To test the ChromaBot fix:
1. Open any Eli story page (e.g., `videos/eli/eli-complete-story.html`)
2. Click the ChromaBot orb (bottom right)
3. Ask questions like:
   - "Who is Eli?"
   - "What is trust score?"
   - "Tell me about gambling" (in Scene 3)
   - "How do I play?"

ChromaBot should now give contextual, helpful responses instead of random generic ones!
