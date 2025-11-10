/**
 * DATA_BLEED - Pre-Push Security Audit
 * Scans for secrets, API keys, and sensitive information before git push
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 DATA_BLEED Pre-Push Security Audit\n');
console.log('='.repeat(60));

// Patterns to search for
const securityPatterns = {
    apiKeys: {
        pattern: /(api[_-]?key|apikey|api[_-]?secret|access[_-]?key)[\s]*[=:]["']?[a-zA-Z0-9_\-]{20,}/gi,
        severity: 'CRITICAL',
        description: 'API Key detected'
    },
    openaiKeys: {
        pattern: /sk-[a-zA-Z0-9]{48}/g,
        severity: 'CRITICAL',
        description: 'OpenAI API Key detected'
    },
    passwords: {
        pattern: /(password|passwd|pwd)[\s]*[=:]["'][^"'\s]{6,}/gi,
        severity: 'CRITICAL',
        description: 'Password detected'
    },
    tokens: {
        pattern: /(token|auth[_-]?token|bearer)[\s]*[=:]["']?[a-zA-Z0-9_\-\.]{20,}/gi,
        severity: 'HIGH',
        description: 'Authentication token detected'
    },
    privateKeys: {
        pattern: /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/g,
        severity: 'CRITICAL',
        description: 'Private key detected'
    },
    awsKeys: {
        pattern: /AKIA[0-9A-Z]{16}/g,
        severity: 'CRITICAL',
        description: 'AWS Access Key detected'
    },
    hardcodedUrls: {
        pattern: /(https?:\/\/)[a-zA-Z0-9\-\.]+\.(railway\.app|vercel\.app|herokuapp\.com)/gi,
        severity: 'MEDIUM',
        description: 'Hardcoded production URL'
    },
    ipAddresses: {
        pattern: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
        severity: 'LOW',
        description: 'IP address detected'
    },
    emails: {
        pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        severity: 'LOW',
        description: 'Email address detected'
    }
};

// Files to exclude from scanning
const excludePatterns = [
    /node_modules/,
    /\.git/,
    /\.env\.example/,
    /package-lock\.json/,
    /\.md$/,  // Documentation files
    /test-/,  // Test files
    /verify-/,  // Verification scripts
    /\.min\.js$/,  // Minified files
    /\.map$/,  // Source maps
];

// Files that should be checked for .gitignore
const sensitiveFiles = [
    '.env',
    '.env.local',
    '.env.production',
    'config.json',
    'secrets.json',
    'credentials.json'
];

let findings = [];
let criticalCount = 0;
let highCount = 0;
let mediumCount = 0;
let lowCount = 0;

// Check if .gitignore exists and is properly configured
function checkGitignore() {
    console.log('\n📋 Checking .gitignore configuration...\n');
    
    if (!fs.existsSync('.gitignore')) {
        findings.push({
            severity: 'CRITICAL',
            file: '.gitignore',
            issue: 'Missing .gitignore file',
            line: 0
        });
        criticalCount++;
        console.log('   ❌ .gitignore file not found');
        return;
    }
    
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const requiredEntries = [
        'node_modules',
        '.env',
        '.env.local',
        '.env.production',
        '*.log'
    ];
    
    let allPresent = true;
    requiredEntries.forEach(entry => {
        if (!gitignore.includes(entry)) {
            findings.push({
                severity: 'HIGH',
                file: '.gitignore',
                issue: `Missing entry: ${entry}`,
                line: 0
            });
            highCount++;
            console.log(`   ⚠️  Missing: ${entry}`);
            allPresent = false;
        }
    });
    
    if (allPresent) {
        console.log('   ✅ .gitignore properly configured');
    }
}

// Check if sensitive files exist and are ignored
function checkSensitiveFiles() {
    console.log('\n📋 Checking for sensitive files...\n');
    
    sensitiveFiles.forEach(file => {
        if (fs.existsSync(file)) {
            // Check if file is in .gitignore
            const gitignore = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf8') : '';
            if (!gitignore.includes(file)) {
                findings.push({
                    severity: 'CRITICAL',
                    file: file,
                    issue: 'Sensitive file exists but not in .gitignore',
                    line: 0
                });
                criticalCount++;
                console.log(`   ❌ ${file} exists but not ignored`);
            } else {
                console.log(`   ✅ ${file} exists and is ignored`);
            }
        }
    });
}

// Scan a file for security issues
function scanFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        Object.entries(securityPatterns).forEach(([name, config]) => {
            const matches = content.match(config.pattern);
            if (matches) {
                matches.forEach(match => {
                    // Find line number
                    let lineNum = 0;
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].includes(match)) {
                            lineNum = i + 1;
                            break;
                        }
                    }
                    
                    // Skip if it's a comment or example
                    const line = lines[lineNum - 1] || '';
                    if (line.trim().startsWith('//') || 
                        line.trim().startsWith('#') || 
                        line.trim().startsWith('*') ||
                        line.includes('example') ||
                        line.includes('placeholder') ||
                        line.includes('your-api-key-here')) {
                        return;
                    }
                    
                    findings.push({
                        severity: config.severity,
                        file: filePath,
                        issue: config.description,
                        line: lineNum,
                        match: match.substring(0, 50) + (match.length > 50 ? '...' : '')
                    });
                    
                    if (config.severity === 'CRITICAL') criticalCount++;
                    else if (config.severity === 'HIGH') highCount++;
                    else if (config.severity === 'MEDIUM') mediumCount++;
                    else lowCount++;
                });
            }
        });
    } catch (err) {
        // Skip files that can't be read
    }
}

// Recursively scan directory
function scanDirectory(dir) {
    try {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            
            // Skip excluded patterns
            if (excludePatterns.some(pattern => pattern.test(filePath))) {
                return;
            }
            
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                scanDirectory(filePath);
            } else if (stat.isFile()) {
                // Only scan text files
                const ext = path.extname(file);
                if (['.js', '.html', '.css', '.json', '.env', '.txt', '.py', '.sh'].includes(ext)) {
                    scanFile(filePath);
                }
            }
        });
    } catch (err) {
        // Skip directories that can't be read
    }
}

// Check for hardcoded API URLs in key files
function checkApiConfiguration() {
    console.log('\n📋 Checking API configuration...\n');
    
    const apiConfigFile = 'js/api-config.js';
    if (fs.existsSync(apiConfigFile)) {
        const content = fs.readFileSync(apiConfigFile, 'utf8');
        
        // Check if using environment-based configuration
        if (content.includes('window.location.hostname') || 
            content.includes('process.env') ||
            content.includes('getApiBaseUrl')) {
            console.log('   ✅ API configuration uses dynamic URLs');
        } else {
            findings.push({
                severity: 'MEDIUM',
                file: apiConfigFile,
                issue: 'API configuration may have hardcoded URLs',
                line: 0
            });
            mediumCount++;
            console.log('   ⚠️  API configuration may have hardcoded URLs');
        }
    }
}

// Main execution
console.log('\n🔍 Starting security scan...\n');

checkGitignore();
checkSensitiveFiles();
checkApiConfiguration();

console.log('\n📁 Scanning files for security issues...\n');
scanDirectory('.');

// Report findings
console.log('\n' + '='.repeat(60));
console.log('📊 SECURITY AUDIT RESULTS');
console.log('='.repeat(60));

console.log(`\nTotal Issues Found: ${findings.length}`);
console.log(`   🔴 Critical: ${criticalCount}`);
console.log(`   🟠 High: ${highCount}`);
console.log(`   🟡 Medium: ${mediumCount}`);
console.log(`   🟢 Low: ${lowCount}`);

if (findings.length > 0) {
    console.log('\n📋 DETAILED FINDINGS:\n');
    
    // Group by severity
    ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
        const severityFindings = findings.filter(f => f.severity === severity);
        if (severityFindings.length > 0) {
            console.log(`\n${severity} Issues (${severityFindings.length}):`);
            console.log('-'.repeat(60));
            severityFindings.forEach((finding, index) => {
                console.log(`\n${index + 1}. ${finding.issue}`);
                console.log(`   File: ${finding.file}:${finding.line}`);
                if (finding.match) {
                    console.log(`   Match: ${finding.match}`);
                }
            });
        }
    });
}

// Recommendations
console.log('\n\n💡 RECOMMENDATIONS:');
console.log('-'.repeat(60));

if (criticalCount > 0) {
    console.log('\n🔴 CRITICAL - DO NOT PUSH:');
    console.log('   - Remove all API keys and secrets from code');
    console.log('   - Move sensitive data to .env file');
    console.log('   - Ensure .env is in .gitignore');
    console.log('   - Use environment variables for configuration');
}

if (highCount > 0) {
    console.log('\n🟠 HIGH PRIORITY:');
    console.log('   - Review and fix high-severity issues');
    console.log('   - Ensure .gitignore is properly configured');
    console.log('   - Check for exposed authentication tokens');
}

if (mediumCount > 0) {
    console.log('\n🟡 MEDIUM PRIORITY:');
    console.log('   - Review hardcoded URLs');
    console.log('   - Consider using environment-based configuration');
    console.log('   - Document any intentional hardcoded values');
}

if (lowCount > 0) {
    console.log('\n🟢 LOW PRIORITY:');
    console.log('   - Review for informational purposes');
    console.log('   - Consider if any low-severity items should be addressed');
}

if (findings.length === 0) {
    console.log('\n✅ No security issues detected!');
    console.log('   - All sensitive files are properly ignored');
    console.log('   - No API keys or secrets found in code');
    console.log('   - Configuration appears secure');
}

console.log('\n\n✅ SAFE TO PUSH CHECKLIST:');
console.log('-'.repeat(60));
console.log(`   [${criticalCount === 0 ? '✓' : ' '}] No critical security issues`);
console.log(`   [${highCount === 0 ? '✓' : ' '}] No high-severity issues`);
console.log('   [ ] .env file is in .gitignore');
console.log('   [ ] No API keys in code');
console.log('   [ ] Using environment variables for secrets');
console.log('   [ ] Production URLs are dynamic');

console.log('\n' + '='.repeat(60));

// Exit code
if (criticalCount > 0) {
    console.log('\n🔴 SECURITY AUDIT FAILED - DO NOT PUSH\n');
    process.exit(1);
} else if (highCount > 0) {
    console.log('\n🟠 SECURITY AUDIT PASSED WITH WARNINGS\n');
    process.exit(0);
} else {
    console.log('\n✅ SECURITY AUDIT PASSED - SAFE TO PUSH\n');
    process.exit(0);
}
