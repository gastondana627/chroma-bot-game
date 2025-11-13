#!/bin/bash

# Verify Production Assets Script
# Checks that critical assets exist and will be deployed

echo "🔍 Verifying critical production assets..."
echo ""

MISSING=0

# Check critical video assets
echo "📹 Checking video assets..."
if [ -f "chroma-bot/assets/vid/Chroma_Vid.mp4" ]; then
    echo "  ✅ Chroma Bot video found"
else
    echo "  ❌ Chroma Bot video MISSING"
    MISSING=$((MISSING + 1))
fi

# Check character face images
echo ""
echo "👤 Checking character images..."
for char in eli maya stanley; do
    if [ -f "chroma-bot/assets/img/$char/${char}_face.png" ]; then
        echo "  ✅ $char face image found"
    else
        echo "  ❌ $char face image MISSING"
        MISSING=$((MISSING + 1))
    fi
done

# Check critical HTML files
echo ""
echo "📄 Checking critical HTML files..."
FILES=(
    "index.html"
    "Enhanced_Login_System/enhanced-character-selector.html"
    "videos/eli/eli-flexible-player.html"
    "Start_Here_Screen/Start_Button.html"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file found"
    else
        echo "  ❌ $file MISSING"
        MISSING=$((MISSING + 1))
    fi
done

# Check critical JS files
echo ""
echo "⚙️ Checking critical JavaScript files..."
JS_FILES=(
    "js/api-config.js"
    "js/error-handler.js"
    "js/mobile-3d-support.js"
    "js/email-signup-system.js"
)

for file in "${JS_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file found"
    else
        echo "  ❌ $file MISSING"
        MISSING=$((MISSING + 1))
    fi
done

# Check CSS files
echo ""
echo "🎨 Checking CSS files..."
if [ -f "css/responsive-design.css" ]; then
    echo "  ✅ Responsive design CSS found"
else
    echo "  ❌ Responsive design CSS MISSING"
    MISSING=$((MISSING + 1))
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $MISSING -eq 0 ]; then
    echo "✅ All critical assets verified!"
    echo "   Ready for production deployment"
    exit 0
else
    echo "❌ $MISSING critical asset(s) missing!"
    echo "   Fix issues before deploying"
    exit 1
fi
