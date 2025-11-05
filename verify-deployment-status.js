#!/usr/bin/env node

/**
 * Deployment Status Verification Script
 * Checks Railway backend and Vercel frontend deployment status
 */

const https = require('https');
const http = require('http');

// Known deployment URLs from codebase analysis
const RAILWAY_BACKEND_URL = 'https://data-bleed-backend.up.railway.app';
const LOCAL_BACKEND_URL = 'http://localhost:8001';

// Test endpoints
const ENDPOINTS = {
    railway_health: `${RAILWAY_BACKEND_URL}/api/health`,
    railway_characters: `${RAILWAY_BACKEND_URL}/api/characters`,
    local_health: `${LOCAL_BACKEND_URL}/api/health`,
    local_characters: `${LOCAL_BACKEND_URL}/api/characters`
};

/**
 * Make HTTP request and return response data
 */
function makeRequest(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        
        const req = client.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'DataBleed-Deployment-Checker/1.0'
            }
        }, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        success: true,
                        status: res.statusCode,
                        data: jsonData,
                        url: url
                    });
                } catch (e) {
                    resolve({
                        success: false,
                        status: res.statusCode,
                        error: 'Invalid JSON response',
                        data: data.substring(0, 200),
                        url: url
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            resolve({
                success: false,
                error: error.message,
                url: url
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                error: 'Request timeout',
                url: url
            });
        });
    });
}

/**
 * Test CORS by making a preflight request
 */
function testCORS(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            },
            timeout: 5000
        };
        
        const req = client.request(options, (res) => {
            const corsHeaders = {
                'access-control-allow-origin': res.headers['access-control-allow-origin'],
                'access-control-allow-methods': res.headers['access-control-allow-methods'],
                'access-control-allow-headers': res.headers['access-control-allow-headers']
            };
            
            resolve({
                success: true,
                status: res.statusCode,
                corsHeaders: corsHeaders,
                url: url
            });
        });
        
        req.on('error', (error) => {
            resolve({
                success: false,
                error: error.message,
                url: url
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                error: 'CORS test timeout',
                url: url
            });
        });
        
        req.end();
    });
}

/**
 * Main verification function
 */
async function verifyDeployments() {
    console.log('🔍 Data Bleed Deployment Status Verification');
    console.log('=' .repeat(50));
    
    // Test Railway Backend
    console.log('\n📡 Testing Railway Backend...');
    console.log(`URL: ${RAILWAY_BACKEND_URL}`);
    
    const railwayHealth = await makeRequest(ENDPOINTS.railway_health);
    if (railwayHealth.success) {
        console.log('✅ Railway backend is ONLINE');
        console.log(`   Status: ${railwayHealth.status}`);
        console.log(`   Health: ${JSON.stringify(railwayHealth.data, null, 2)}`);
        
        // Test characters endpoint
        const railwayChars = await makeRequest(ENDPOINTS.railway_characters);
        if (railwayChars.success) {
            console.log('✅ Characters endpoint working');
            console.log(`   Characters: ${JSON.stringify(railwayChars.data, null, 2)}`);
        } else {
            console.log('❌ Characters endpoint failed');
            console.log(`   Error: ${railwayChars.error}`);
        }
        
        // Test CORS
        console.log('\n🔒 Testing CORS configuration...');
        const corsTest = await testCORS(RAILWAY_BACKEND_URL + '/api/health');
        if (corsTest.success) {
            console.log('✅ CORS preflight successful');
            console.log(`   Allow-Origin: ${corsTest.corsHeaders['access-control-allow-origin']}`);
            console.log(`   Allow-Methods: ${corsTest.corsHeaders['access-control-allow-methods']}`);
        } else {
            console.log('❌ CORS test failed');
            console.log(`   Error: ${corsTest.error}`);
        }
        
    } else {
        console.log('❌ Railway backend is OFFLINE or unreachable');
        console.log(`   Error: ${railwayHealth.error}`);
    }
    
    // Test Local Backend (if running)
    console.log('\n🏠 Testing Local Backend...');
    console.log(`URL: ${LOCAL_BACKEND_URL}`);
    
    const localHealth = await makeRequest(ENDPOINTS.local_health);
    if (localHealth.success) {
        console.log('✅ Local backend is running');
        console.log(`   Status: ${localHealth.status}`);
        console.log(`   Health: ${JSON.stringify(localHealth.data, null, 2)}`);
    } else {
        console.log('ℹ️  Local backend not running (expected in production)');
        console.log(`   Error: ${localHealth.error}`);
    }
    
    // Check for Vercel deployment
    console.log('\n🌐 Checking for Vercel Frontend...');
    
    // Look for vercel.json and check if there's a deployment
    const fs = require('fs');
    if (fs.existsSync('vercel.json')) {
        console.log('✅ Vercel configuration found (vercel.json)');
        
        // Try to detect Vercel deployment URL from environment or config
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        console.log(`   Project: ${packageJson.name}`);
        console.log('   Expected URL pattern: https://[project-name]-[hash].vercel.app');
        console.log('   ℹ️  Run "vercel --prod" to deploy or check Vercel dashboard for URL');
    } else {
        console.log('❌ No Vercel configuration found');
        console.log('   Create vercel.json to enable Vercel deployment');
    }
    
    // Summary
    console.log('\n📋 DEPLOYMENT STATUS SUMMARY');
    console.log('=' .repeat(50));
    
    if (railwayHealth.success) {
        console.log('✅ Backend (Railway): DEPLOYED and WORKING');
        console.log(`   URL: ${RAILWAY_BACKEND_URL}`);
        console.log(`   Health Check: ${RAILWAY_BACKEND_URL}/api/health`);
    } else {
        console.log('❌ Backend (Railway): NOT ACCESSIBLE');
        console.log('   Check Railway dashboard and deployment logs');
    }
    
    console.log('🌐 Frontend (Vercel): Configuration ready');
    console.log('   Run deployment check: vercel --prod');
    console.log('   Or check: https://vercel.com/dashboard');
    
    console.log('\n🔗 NEXT STEPS:');
    if (railwayHealth.success) {
        console.log('1. ✅ Backend is working - proceed with frontend deployment');
        console.log('2. 🚀 Deploy frontend to Vercel: vercel --prod');
        console.log('3. 🔧 Update CORS origins with Vercel URL');
        console.log('4. 🧪 Test end-to-end functionality');
    } else {
        console.log('1. 🔧 Fix Railway backend deployment first');
        console.log('2. 📋 Check Railway dashboard for deployment status');
        console.log('3. 🔑 Verify environment variables (OPENAI_API_KEY)');
        console.log('4. 📝 Check deployment logs for errors');
    }
}

// Run verification
verifyDeployments().catch(console.error);