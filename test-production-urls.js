#!/usr/bin/env node

/**
 * Test Production URLs - Final Verification
 */

const https = require('https');

// Production URLs identified
const VERCEL_FRONTEND_URL = 'https://data-bleed-vsc-game.vercel.app';
const RAILWAY_BACKEND_URL = 'https://data-bleed-backend.up.railway.app';

function testURL(url, description) {
    return new Promise((resolve) => {
        console.log(`\n🧪 Testing ${description}...`);
        console.log(`URL: ${url}`);
        
        const req = https.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'DataBleed-Production-Checker/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        }, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const isHTML = res.headers['content-type']?.includes('text/html');
                const isJSON = res.headers['content-type']?.includes('application/json');
                const hasDataBleed = data.toLowerCase().includes('data') && data.toLowerCase().includes('bleed');
                
                console.log(`📊 Status: ${res.statusCode}`);
                console.log(`📄 Content-Type: ${res.headers['content-type']}`);
                console.log(`📏 Content Length: ${data.length} bytes`);
                
                if (isJSON) {
                    try {
                        const jsonData = JSON.parse(data);
                        console.log(`📋 JSON Response: ${JSON.stringify(jsonData, null, 2)}`);
                    } catch (e) {
                        console.log(`⚠️  Invalid JSON response`);
                    }
                }
                
                if (isHTML) {
                    console.log(`🎮 Contains "Data Bleed": ${hasDataBleed ? '✅' : '❌'}`);
                    
                    // Check for key game elements
                    const hasThreeJS = data.includes('three.js') || data.includes('THREE');
                    const hasGameMechanics = data.includes('Game/Mechanics') || data.includes('gaming-mechanics');
                    const hasCharacters = data.includes('eli') || data.includes('maya') || data.includes('stanley');
                    
                    console.log(`🎯 Has Three.js: ${hasThreeJS ? '✅' : '❌'}`);
                    console.log(`⚙️  Has Game Mechanics: ${hasGameMechanics ? '✅' : '❌'}`);
                    console.log(`👥 Has Characters: ${hasCharacters ? '✅' : '❌'}`);
                }
                
                const success = res.statusCode === 200;
                console.log(`${success ? '✅' : '❌'} ${description}: ${success ? 'WORKING' : 'FAILED'}`);
                
                resolve({
                    success,
                    status: res.statusCode,
                    isHTML,
                    isJSON,
                    hasDataBleed,
                    contentLength: data.length,
                    url
                });
            });
        });
        
        req.on('error', (error) => {
            console.log(`❌ Error: ${error.message}`);
            resolve({
                success: false,
                error: error.message,
                url
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            console.log('❌ Request timeout');
            resolve({
                success: false,
                error: 'timeout',
                url
            });
        });
    });
}

async function testProductionDeployments() {
    console.log('🚀 PRODUCTION DEPLOYMENT VERIFICATION');
    console.log('=' .repeat(60));
    console.log('Testing identified production URLs...\n');
    
    // Test Vercel Frontend
    console.log('🌐 FRONTEND TESTING (Vercel)');
    console.log('-' .repeat(40));
    
    const frontendMain = await testURL(VERCEL_FRONTEND_URL, 'Frontend Main Page');
    const frontendChar = await testURL(`${VERCEL_FRONTEND_URL}/eli_login.html`, 'Frontend Character Page');
    const frontendPerf = await testURL(`${VERCEL_FRONTEND_URL}/test-3d-performance-benchmarks.html`, 'Frontend Performance Tests');
    
    // Test Railway Backend
    console.log('\n📡 BACKEND TESTING (Railway)');
    console.log('-' .repeat(40));
    
    const backendHealth = await testURL(`${RAILWAY_BACKEND_URL}/api/health`, 'Backend Health Check');
    const backendChars = await testURL(`${RAILWAY_BACKEND_URL}/api/characters`, 'Backend Characters API');
    
    // Test basic connectivity between frontend and backend
    console.log('\n🔗 CONNECTIVITY TESTING');
    console.log('-' .repeat(40));
    
    // Test if frontend can reach backend (CORS test)
    const corsTest = await testCORS(`${RAILWAY_BACKEND_URL}/api/health`, VERCEL_FRONTEND_URL);
    
    // Final Summary
    console.log('\n📋 PRODUCTION DEPLOYMENT STATUS');
    console.log('=' .repeat(60));
    
    console.log('\n🌐 FRONTEND (Vercel):');
    console.log(`   URL: ${VERCEL_FRONTEND_URL}`);
    console.log(`   Main Page: ${frontendMain.success ? '✅ Working' : '❌ Failed'} (${frontendMain.status || 'Error'})`);
    console.log(`   Character Page: ${frontendChar.success ? '✅ Working' : '❌ Failed'} (${frontendChar.status || 'Error'})`);
    console.log(`   Performance Tests: ${frontendPerf.success ? '✅ Working' : '❌ Failed'} (${frontendPerf.status || 'Error'})`);
    
    console.log('\n📡 BACKEND (Railway):');
    console.log(`   URL: ${RAILWAY_BACKEND_URL}`);
    console.log(`   Health Check: ${backendHealth.success ? '✅ Working' : '❌ Failed'} (${backendHealth.status || 'Error'})`);
    console.log(`   Characters API: ${backendChars.success ? '✅ Working' : '❌ Failed'} (${backendChars.status || 'Error'})`);
    
    console.log('\n🔗 INTEGRATION:');
    console.log(`   CORS Configuration: ${corsTest.success ? '✅ Working' : '❌ Needs Fix'}`);
    
    // Overall Status
    const frontendWorking = frontendMain.success && frontendChar.success;
    const backendWorking = backendHealth.success && backendChars.success;
    
    console.log('\n🎯 OVERALL STATUS:');
    if (frontendWorking && backendWorking) {
        console.log('✅ BOTH DEPLOYMENTS ARE WORKING');
        console.log('🎮 Game should be fully functional in production');
        console.log('\n🔗 Production URLs:');
        console.log(`   🌐 Play Game: ${VERCEL_FRONTEND_URL}`);
        console.log(`   👤 Character Chat: ${VERCEL_FRONTEND_URL}/eli_login.html`);
        console.log(`   ⚡ Performance Tests: ${VERCEL_FRONTEND_URL}/test-3d-performance-benchmarks.html`);
        console.log(`   📡 API Health: ${RAILWAY_BACKEND_URL}/api/health`);
    } else if (frontendWorking && !backendWorking) {
        console.log('⚠️  FRONTEND WORKING, BACKEND NEEDS ATTENTION');
        console.log('🔧 Fix Railway backend deployment to enable full functionality');
    } else if (!frontendWorking && backendWorking) {
        console.log('⚠️  BACKEND WORKING, FRONTEND NEEDS ATTENTION');
        console.log('🔧 Fix Vercel frontend deployment');
    } else {
        console.log('❌ BOTH DEPLOYMENTS NEED ATTENTION');
        console.log('🔧 Check deployment logs and configurations');
    }
    
    return {
        frontend: {
            url: VERCEL_FRONTEND_URL,
            working: frontendWorking,
            status: frontendMain.status
        },
        backend: {
            url: RAILWAY_BACKEND_URL,
            working: backendWorking,
            status: backendHealth.status
        }
    };
}

function testCORS(backendUrl, frontendOrigin) {
    return new Promise((resolve) => {
        console.log(`🔒 Testing CORS from ${frontendOrigin} to ${backendUrl}...`);
        
        const urlObj = new URL(backendUrl);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname,
            method: 'OPTIONS',
            headers: {
                'Origin': frontendOrigin,
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            },
            timeout: 10000
        };
        
        const req = https.request(options, (res) => {
            const corsHeaders = {
                'access-control-allow-origin': res.headers['access-control-allow-origin'],
                'access-control-allow-methods': res.headers['access-control-allow-methods'],
                'access-control-allow-headers': res.headers['access-control-allow-headers']
            };
            
            const allowsOrigin = corsHeaders['access-control-allow-origin'] === frontendOrigin || 
                               corsHeaders['access-control-allow-origin'] === '*';
            
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Allow-Origin: ${corsHeaders['access-control-allow-origin'] || 'Not set'}`);
            console.log(`   Allow-Methods: ${corsHeaders['access-control-allow-methods'] || 'Not set'}`);
            console.log(`   ${allowsOrigin ? '✅' : '❌'} CORS ${allowsOrigin ? 'allows' : 'blocks'} frontend origin`);
            
            resolve({
                success: allowsOrigin,
                status: res.statusCode,
                corsHeaders
            });
        });
        
        req.on('error', (error) => {
            console.log(`   ❌ CORS test failed: ${error.message}`);
            resolve({
                success: false,
                error: error.message
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            console.log('   ❌ CORS test timeout');
            resolve({
                success: false,
                error: 'timeout'
            });
        });
        
        req.end();
    });
}

// Run the tests
testProductionDeployments()
    .then(result => {
        console.log('\n✨ Deployment verification complete!');
        process.exit(result.frontend.working && result.backend.working ? 0 : 1);
    })
    .catch(error => {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    });