/**
 * DATA_BLEED - Responsive Design Verification Script
 * Automated testing for responsive design across all key pages
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DATA_BLEED Responsive Design Verification\n');
console.log('='.repeat(60));

// Files to check for responsive design implementation
const filesToCheck = [
    'index.html',
    'Start_Here_Screen/Start_Button.html',
    'Enhanced_Login_System/enhanced-character-selector.html',
    'videos/eli/eli-flexible-player.html',
    'videos/eli/eli-complete-story.html'
];

// Required responsive features
const requiredFeatures = {
    viewport: '<meta name="viewport"',
    responsiveCSS: 'responsive-design.css',
    mediaQueries: '@media',
    touchOptimization: 'min-height: 44px',
    safeArea: 'safe-area-inset'
};

let totalTests = 0;
let passedTests = 0;
let warnings = [];
let errors = [];

console.log('\n📋 Checking Files for Responsive Design...\n');

// Check each file
filesToCheck.forEach(file => {
    console.log(`\n📄 Checking: ${file}`);
    console.log('-'.repeat(60));
    
    if (!fs.existsSync(file)) {
        console.log(`   ❌ File not found`);
        errors.push(`${file}: File not found`);
        return;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    
    // Test 1: Viewport meta tag
    totalTests++;
    if (content.includes(requiredFeatures.viewport)) {
        console.log(`   ✅ Viewport meta tag present`);
        passedTests++;
    } else {
        console.log(`   ❌ Missing viewport meta tag`);
        errors.push(`${file}: Missing viewport meta tag`);
    }
    
    // Test 2: Responsive CSS included
    totalTests++;
    if (content.includes(requiredFeatures.responsiveCSS)) {
        console.log(`   ✅ Responsive CSS linked`);
        passedTests++;
    } else {
        console.log(`   ⚠️  Responsive CSS not linked`);
        warnings.push(`${file}: Responsive CSS not linked`);
    }
    
    // Test 3: Check for inline styles that might break responsiveness
    totalTests++;
    const inlineStyleCount = (content.match(/style="/g) || []).length;
    if (inlineStyleCount < 10) {
        console.log(`   ✅ Minimal inline styles (${inlineStyleCount})`);
        passedTests++;
    } else {
        console.log(`   ⚠️  Many inline styles (${inlineStyleCount}) - may affect responsiveness`);
        warnings.push(`${file}: ${inlineStyleCount} inline styles found`);
    }
    
    // Test 4: Check for fixed widths that might break mobile
    totalTests++;
    const fixedWidthMatches = content.match(/width:\s*\d+px/g) || [];
    const problematicWidths = fixedWidthMatches.filter(w => {
        const px = parseInt(w.match(/\d+/)[0]);
        return px > 500; // Large fixed widths are problematic
    });
    
    if (problematicWidths.length === 0) {
        console.log(`   ✅ No problematic fixed widths`);
        passedTests++;
    } else {
        console.log(`   ⚠️  Found ${problematicWidths.length} large fixed widths`);
        warnings.push(`${file}: ${problematicWidths.length} large fixed widths may break mobile`);
    }
});

// Check responsive CSS file
console.log(`\n\n📄 Checking: css/responsive-design.css`);
console.log('-'.repeat(60));

if (fs.existsSync('css/responsive-design.css')) {
    const cssContent = fs.readFileSync('css/responsive-design.css', 'utf8');
    
    // Test: Media queries present
    totalTests++;
    const mediaQueryCount = (cssContent.match(/@media/g) || []).length;
    if (mediaQueryCount >= 5) {
        console.log(`   ✅ Comprehensive media queries (${mediaQueryCount})`);
        passedTests++;
    } else {
        console.log(`   ❌ Insufficient media queries (${mediaQueryCount})`);
        errors.push(`responsive-design.css: Only ${mediaQueryCount} media queries`);
    }
    
    // Test: Touch optimization
    totalTests++;
    if (cssContent.includes('min-height: 44px') || cssContent.includes('min-height: 48px')) {
        console.log(`   ✅ Touch target optimization present`);
        passedTests++;
    } else {
        console.log(`   ⚠️  Touch target optimization missing`);
        warnings.push(`responsive-design.css: Missing touch target optimization`);
    }
    
    // Test: Safe area support
    totalTests++;
    if (cssContent.includes('safe-area-inset')) {
        console.log(`   ✅ Safe area inset support (iPhone X+)`);
        passedTests++;
    } else {
        console.log(`   ⚠️  Safe area inset support missing`);
        warnings.push(`responsive-design.css: Missing safe area inset support`);
    }
    
    // Test: Orientation handling
    totalTests++;
    if (cssContent.includes('orientation: portrait') && cssContent.includes('orientation: landscape')) {
        console.log(`   ✅ Orientation-specific styles`);
        passedTests++;
    } else {
        console.log(`   ⚠️  Orientation-specific styles missing`);
        warnings.push(`responsive-design.css: Missing orientation-specific styles`);
    }
    
    // Test: Reduced motion support
    totalTests++;
    if (cssContent.includes('prefers-reduced-motion')) {
        console.log(`   ✅ Accessibility: Reduced motion support`);
        passedTests++;
    } else {
        console.log(`   ⚠️  Reduced motion support missing`);
        warnings.push(`responsive-design.css: Missing reduced motion support`);
    }
    
    // Test: High contrast support
    totalTests++;
    if (cssContent.includes('prefers-contrast')) {
        console.log(`   ✅ Accessibility: High contrast support`);
        passedTests++;
    } else {
        console.log(`   ⚠️  High contrast support missing`);
        warnings.push(`responsive-design.css: Missing high contrast support`);
    }
    
} else {
    console.log(`   ❌ Responsive CSS file not found`);
    errors.push(`css/responsive-design.css: File not found`);
    totalTests += 6;
}

// Summary
console.log('\n\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(60));

const passRate = ((passedTests / totalTests) * 100).toFixed(1);
console.log(`\nTests Passed: ${passedTests}/${totalTests} (${passRate}%)`);

if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):`);
    errors.forEach(err => console.log(`   - ${err}`));
}

if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach(warn => console.log(`   - ${warn}`));
}

// Recommendations
console.log('\n\n💡 RECOMMENDATIONS:');
console.log('-'.repeat(60));

if (passRate >= 90) {
    console.log('✅ Excellent! Responsive design is well implemented.');
    console.log('   - Test on actual devices (phone, tablet, desktop)');
    console.log('   - Verify touch interactions work smoothly');
    console.log('   - Check video playback on mobile devices');
} else if (passRate >= 70) {
    console.log('⚠️  Good progress, but some improvements needed:');
    console.log('   - Address all errors listed above');
    console.log('   - Review warnings and fix critical ones');
    console.log('   - Test on multiple device sizes');
} else {
    console.log('❌ Significant work needed:');
    console.log('   - Fix all errors immediately');
    console.log('   - Add missing responsive features');
    console.log('   - Conduct thorough testing');
}

console.log('\n📱 DEVICE TESTING CHECKLIST:');
console.log('-'.repeat(60));
console.log('   [ ] iPhone (Portrait & Landscape)');
console.log('   [ ] Android Phone (Portrait & Landscape)');
console.log('   [ ] iPad (Portrait & Landscape)');
console.log('   [ ] Android Tablet (Portrait & Landscape)');
console.log('   [ ] Desktop (1920x1080)');
console.log('   [ ] Desktop (2560x1440)');
console.log('   [ ] Laptop (1366x768)');

console.log('\n🌐 BROWSER TESTING CHECKLIST:');
console.log('-'.repeat(60));
console.log('   [ ] Chrome (Desktop & Mobile)');
console.log('   [ ] Safari (Desktop & Mobile)');
console.log('   [ ] Firefox (Desktop & Mobile)');
console.log('   [ ] Edge (Desktop)');

console.log('\n🎯 KEY FEATURES TO TEST:');
console.log('-'.repeat(60));
console.log('   [ ] Start screen displays correctly');
console.log('   [ ] Character selector is usable');
console.log('   [ ] Video player fills screen properly');
console.log('   [ ] Decision buttons are easily tappable');
console.log('   [ ] Chat interface is accessible');
console.log('   [ ] HUD elements don\'t overlap');
console.log('   [ ] Text is readable without zooming');
console.log('   [ ] Animations perform smoothly');

console.log('\n✅ NEXT STEPS:');
console.log('-'.repeat(60));
console.log('   1. Open test-responsive-design.html in browser');
console.log('   2. Test on actual devices if possible');
console.log('   3. Use browser DevTools device emulation');
console.log('   4. Verify all interactive elements work');
console.log('   5. Check performance on lower-end devices');

console.log('\n' + '='.repeat(60));

// Exit code
if (errors.length > 0) {
    console.log('\n❌ Verification completed with errors\n');
    process.exit(1);
} else if (warnings.length > 0) {
    console.log('\n⚠️  Verification completed with warnings\n');
    process.exit(0);
} else {
    console.log('\n✅ Verification completed successfully!\n');
    process.exit(0);
}
