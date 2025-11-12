# Orbit Ring Rotation Update

## Changes Made

Updated the character selection orbit rings to have different rotation directions for visual variety and character distinction.

## Rotation Directions

### Eli (Center) - Clockwise ↻
- Animation: `ringRotate`
- Direction: 0deg → 360deg (clockwise)
- Color: Cyan (#00ffff)
- Symbolism: Forward-moving, tech-focused

### Maya (Left) - Counter-Clockwise ↺
- Animation: `ringRotateReverse`
- Direction: 360deg → 0deg (counter-clockwise)
- Color: Pink (#ff1493)
- Symbolism: Reflective, analytical approach

### Stanley (Right) - Counter-Clockwise ↺
- Animation: `ringRotateReverse`
- Direction: 360deg → 0deg (counter-clockwise)
- Color: Gray (#9ca3af)
- Symbolism: Methodical, investigative nature

## Technical Implementation

### New Animation Added
```css
@keyframes ringRotateReverse {
    0% { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(360deg); }
    100% { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(0deg); }
}
```

### Character-Specific Animations
```css
.character-node.maya .orbit-ring {
    border-color: #ff1493;
    animation: ringRotateReverse 8s linear infinite;
}

.character-node.eli .orbit-ring {
    border-color: #00ffff;
    animation: ringRotate 8s linear infinite;
}

.character-node.stanley .orbit-ring {
    border-color: #9ca3af;
    animation: ringRotateReverse 8s linear infinite;
}
```

## Visual Effect

The opposing rotations create:
- **Dynamic contrast** between characters
- **Visual balance** with Eli in center rotating one way, flanked by Maya and Stanley rotating the opposite way
- **Character personality** reflected in motion
- **Symmetrical design** with outer characters mirroring each other

## Animation Details

- **Duration**: 8 seconds per full rotation
- **Timing**: Linear (constant speed)
- **Loop**: Infinite
- **Tilt**: 75deg on X-axis (3D perspective)
- **Smoothness**: GPU-accelerated transform

The result is a more dynamic and visually interesting character selection screen with each character having their own unique orbital motion!
