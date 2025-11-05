#!/usr/bin/env node

/**
 * Test Vercel Frontend Deployment
 */

const https = require('https');

const VERCEL_URL = 'https://data-bleed-vsc-game-98hba28m4-gastondana627s-projects.vercel.app';

function testURL(url, description) {
    return new Promise((resolve) => {
        console.log(`\n🧪 Testing ${description}...`);
        console.log(`URL: ${url}`);
        
        const req = https.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'DataBleed-Frontend-Checker/1.0'
            }
        }, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const isHTML = res.headers['content-type']?.includes('text/html');
                const hasDataBleed = data.toLowerCase().includes('data') && data.toLowerCase().includes('bleed');
                
                console.log(`✅ Status: ${res.statusCode}`);
                console.log(`📄 Content-Type: ${res.headers['content-type']}`);
                console.log(`📏 Content Length: ${data.length} bytes`);
                console.log(`🎮 Contains "Data Bleed": ${hasDataBleed ? '✅' : '❌'}`);
                
                if (isHTML && data.length > 1000) {
                    console.log('✅ Frontend appears to be deployed successfully');
                } else {
                    console.log('⚠️  Frontend may not be fully deployed');
                }
                
                resolve({
                    success: res.statusCode === 200,
                    status: res.statusCode,
                    isHTML,
                    hasDataBleed,
                    contentLength: data.length
                });
            });
        });
        
        req.on('error', (error) => {
            console.log(`❌ Error: ${error.message}`);
            resolve({
                success: false,
                error: error.message
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            console.log('❌ Request timeout');
            resolve({
                success: false,
                error: 'timeout'
            });
        });
    });
}

async function testVercelDeployment() {
    console.log('🌐 Testing Vercel Frontend Deployment');
    console.log('=' .repeat(50));
    
    // Test main page
    const mainPage = await testURL(VERCEL_URL, 'Main Game Page');
    
    // Test character login page
    const charPage = await testURL(`${VERCEL_URL}/eli_login.html`, 'Character Login Page');
    
    // Test performance test page
    const perfPage = await testURL(`${VERCEL_URL}/test-3d-performance-benchmarks.html`, 'Performance Test Page');
    
    console.log('\n📋 VERCEL DEPLOYMENT SUMMARY');
    console.log('=' .repeat(50));
    console.log(`🌐 Frontend URL: ${VERCEL_URL}`);
    console.log(`📄 Main Page: ${mainPage.success ? '✅ Working' : '❌ Failed'}`);
    console.log(`👤 Character Page: ${charPage.success ? '✅ Working' : '❌ Failed'}`);
    console.log(`⚡ Performance Page: ${perfPage.success ? '✅ Working' : '❌ Failed'}`);
    
    if (mainPage.success && charPage.success) {
        console.log('\n✅ VERCEL FRONTEND IS DEPLOYED AND ACCESSIBLE');
        console.log('🔗 Production URLs:');
        console.log(`   Main Game: ${VERCEL_URL}`);
        console.log(`   Character Chat: ${VERCEL_URL}/eli_login.html`);
        console.log(`   Performance Tests: ${VERCEL_URL}/test-3d-performance-benchmarks.html`);
    } else {
        console.log('\n❌ VERCEL FRONTEND HAS ISSUES');
        console.log('🔧 Check deployment logs and configuration');
    }
}

testVercelDeployment().catch(console.error);