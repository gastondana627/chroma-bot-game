# Deployment Setup - Localhost & Production

## Overview
This document explains how the ChromaBot and Pause Menu systems work seamlessly in both localhost and production environments.

## The Problem
Different environments require different asset paths:
- **Localhost**: `/videos/eli/eli-flexible-player.html` needs `../../chroma-bot/assets/vid/Chroma_Vid.mp4`
- **Production**: Root-level serving needs `chroma-bot/assets/vid/Chroma_Vid.mp4`

## The Solution
Smart path resolution that automatically detects the environment and adjusts paths accordingly.

## Implementation

### Path Resolution Function
```javascript
getAssetPath(relativePath) {
    const currentPath = window.location.pathname;
    
    // If in videos/eli/, use ../../
    if (currentPath.includes('/videos/eli/')) {
        return `../../${relativePath}`;
    }
    
    // If in videos/, use ../
    if (currentPath.includes('/videos/')) {
        return `../${relativePath}`;
    }
    
    // Otherwise, use direct path (root/production)
    return relativePath;
}
```

### Usage
```javascript
// Automatically resolves to correct path
const videoPath = this.getAssetPath('chroma-bot/assets/vid/Chroma_Vid.mp4');
```

## Testing

### Quick Test
1. Open `videos/eli/test-deployment.html`
2. Check console output
3. Verify all tests pass ✅

### Detailed Path Testing
1. Open `videos/eli/test-asset-paths.html`
2. See which paths work in your environment
3. View live video preview

### Full Integration Test
1. Open `videos/eli/eli-flexible-player.html`
2. Verify ChromaBot appears (bottom right)
3. Test pause menu (SPACE or top-left button)
4. Make decisions and verify reactions

## Deployment Checklist

### Localhost
- [ ] ChromaBot video loads from `../../chroma-bot/assets/vid/Chroma_Vid.mp4`
- [ ] Pause button appears in top left
- [ ] Pause menu works with SPACE key
- [ ] Decision reactions trigger correctly

### Production (Vercel/Netlify)
- [ ] ChromaBot video loads from `chroma-bot/assets/vid/Chroma_Vid.mp4`
- [ ] All assets accessible from root
- [ ] No console errors for missing files
- [ ] Same functionality as localhost

## File Structure

### Required Assets
```
Root/
├── chroma-bot/
│   └── assets/
│       └── vid/
│           └── Chroma_Vid.mp4
├── videos/
│   └── eli/
│       ├── eli-flexible-player.html
│       ├── chromabot-video-config.js
│       ├── pause-menu.js
│       └── test-deployment.html
└── public/                    (Production mirror)
    └── chroma-bot/
        └── assets/
            └── vid/
                └── Chroma_Vid.mp4
```

## Debugging

### Console Messages
Look for these in browser console:

**Success:**
```
✅ ChromaBot connected to video player
🎥 ChromaBot video path: [resolved path]
✅ ChromaBot video loaded successfully
⏸ Surveillance paused
```

**Errors:**
```
❌ ChromaBot video failed to load: [path]
⚠️ ChromaBot not found, will initialize when available
```

### Common Issues

**Issue: ChromaBot not visible**
- Check console for video path
- Verify video file exists at resolved path
- Run `test-asset-paths.html` to diagnose

**Issue: Different behavior localhost vs production**
- Verify both `chroma-bot/` and `public/chroma-bot/` have same files
- Check browser console for path resolution
- Run `test-deployment.html` in both environments

**Issue: Pause menu not working**
- Verify `pause-menu.js` is loaded
- Check for JavaScript errors in console
- Ensure video element exists before initialization

## Production Deployment

### Vercel
1. Ensure `vercel.json` has `"public": true`
2. All assets in root are served directly
3. Path resolution automatically uses direct paths

### Netlify
1. Configure `netlify.toml` for static serving
2. Ensure all assets are in build output
3. Test with `test-deployment.html` after deploy

### Manual Verification
After deploying:
1. Visit `[your-domain]/videos/eli/test-deployment.html`
2. Check all tests pass
3. Visit `[your-domain]/videos/eli/eli-flexible-player.html`
4. Verify ChromaBot and pause menu work

## Environment Variables
No environment variables needed! Path resolution is automatic based on URL structure.

## Performance Notes
- Video is 150x150px, optimized for performance
- Autoplay, loop, and muted for seamless experience
- Lazy loading not needed due to small size
- No impact on page load time

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (requires playsinline attribute)
- Mobile: ✅ Works with touch events

## Support
If issues persist:
1. Run all test files in order
2. Check browser console for errors
3. Verify file paths in your deployment
4. Compare localhost vs production behavior
