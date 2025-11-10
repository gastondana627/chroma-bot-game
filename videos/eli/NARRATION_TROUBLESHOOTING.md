# Narration System Troubleshooting

## Issue: AudioManager not found

### Symptoms
Console shows:
```
⚠️ AudioManager not found - narration will be skipped
```

### Quick Fixes

#### 1. Check Script Loading
Open browser DevTools → Network tab → Filter by "JS"

Look for `audio-manager.js` - should show status 200 (loaded successfully)

If 404: File path is wrong
If not listed: Script tag missing from HTML

#### 2. Check Script Order in HTML
In `eli-complete-story.html`, verify this order:
```html
<script src="audio-manager.js"></script>  <!-- BEFORE -->
<script src="eli-scenes-config.js"></script>  <!-- AFTER -->
```

#### 3. Check Browser Console
Look for:
```
🔍 Checking for AudioManager... function
✅ Audio Manager initialized
```

If you see `undefined` instead of `function`, audio-manager.js didn't load.

#### 4. Manual Test
Open browser console and type:
```javascript
typeof AudioManager
```

Should return: `"function"`
If returns: `"undefined"` → Script not loaded

#### 5. Force Reload
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear cache and reload
- Try incognito/private window

### Common Causes

1. **File path wrong**: Check `audio-manager.js` exists in `videos/eli/` folder
2. **Script tag missing**: Verify `<script src="audio-manager.js"></script>` in HTML
3. **Script order wrong**: audio-manager.js must load BEFORE eli-scenes-config.js
4. **Cached old version**: Hard refresh to clear cache

### Verification Steps

1. Open `videos/eli/eli-complete-story.html` in browser
2. Open DevTools console (F12)
3. Look for these messages in order:
   ```
   🔍 Checking for AudioManager... function
   ✅ Audio Manager initialized for narration system
   ```
4. If you see those, narration system is working!

### Test Narration Manually

In browser console:
```javascript
// Check if audio manager exists
window.audioManager

// Test transition narration
window.audioManager.playTransitionNarration(1, 2, 'success');

// Check path detection
window.audioManager.getNarrationPath();
```

### Still Not Working?

Check these files exist:
```
videos/eli/
├── audio-manager.js  ← Must exist
├── eli-scenes-config.js
└── audio/
    └── narration/
        ├── scene_1_to_2_success.mp3
        ├── scene_1_to_2_moderate.mp3
        └── scene_1_to_2_failure.mp3
```

### Debug Mode

Add this to browser console to see what's happening:
```javascript
// Check all Audio-related globals
Object.keys(window).filter(k => k.toLowerCase().includes('audio'))

// Check if class is defined
AudioManager

// Try to create instance manually
const testManager = new AudioManager();
```

---

## Working? Next Steps

Once you see `✅ Audio Manager initialized`, the narration system is ready!

Test by playing through the story - you should hear narration between scenes.
