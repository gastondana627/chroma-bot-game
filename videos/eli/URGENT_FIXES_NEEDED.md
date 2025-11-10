# Urgent Fixes Needed

## Issue 1: Trust Score Not Decaying by 5 Per Scene

**Problem:** Trust score stays at 100, not decreasing by 5 each scene

**Solution:** The code is there but might not be triggering. Need to:
1. Check console for "📉 Passive decay" messages
2. Verify `trustDecay.applyPassiveDecay()` is being called
3. Ensure `updateTrustDisplay()` is updating the UI

**Quick Fix:**
Open browser console and check if you see:
- "✅ Trust Decay System initialized. Starting score: 100"
- "📉 Passive decay: 100 → 95" (when moving to scene 2)

If not seeing these, the trust decay system isn't initializing.

## Issue 2: Dashboard is a Mess (No Styling)

**Problem:** Dashboard shows as plain text, Tailwind CSS not loading

**Root Cause:** Loading HTML fragment doesn't execute `<script>` tags for Tailwind

**Solution:** Need to use the original `pause-menu.js` with simple styled overlay instead of complex dashboard

**Recommended Approach:**
Revert to simple pause menu with Eli's styling:
- Use inline CSS (not Tailwind)
- Show trust score, scene, decisions
- Keep Resume/Restart/Exit buttons
- Add Eli's personality with simple styling

## Quick Fix Steps:

### 1. Revert to Working Pause Menu
```bash
# Use the original pause-menu.js
# It works, just needs Eli's color scheme
```

### 2. Update Colors to Match Eli:
- Background: #000 (black)
- Primary: #a855f7 (purple)
- Text: white/gray
- Borders: purple

### 3. Add Live Data:
- Trust score from trustDecay
- Scene number from currentSceneIndex
- Decision counts from window variables

## Immediate Action:

**Option A: Simple Fix (Recommended)**
- Revert eli-flexible-player.html to use `pause-menu.js`
- Update pause-menu.js colors to purple theme
- Add trust score display
- Keep it simple and working

**Option B: Fix Dashboard**
- Inline ALL CSS (no Tailwind)
- Write complete styles in JavaScript
- Much more code but matches dashboard design

## My Recommendation:

Use **Option A** - Get it working first with simple pause menu showing:
- "eli's space - PAUSED"
- Trust Score: [live number]
- Scene: [X]/6
- Decisions: [X] good, [X] risky
- Three buttons: Resume, Restart, Exit
- Purple theme
- SPACE key works

Then we can enhance it later once it's stable.

Would you like me to implement Option A (simple working version)?
