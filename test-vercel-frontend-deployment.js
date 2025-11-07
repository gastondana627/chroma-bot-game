#!/usr/bin/env node

/**
 * Test script to verify Vercel frontend deployment
 * Tests that the production frontend loads correctly
 */

const https = require('https');

// Vercel production URL - update this with your actual Vercel URL
const VERCEL_URL = process.env.VERCEL_URL || 'https://chroma-bot-game.vercel.app';

console.log('🔍 Testing Vercel Frontend Deployment...\n');
console.log(`Target URL: ${VERCEL_URL}\n`);

function testEndpoint(url, description) {
  return new Promise((resolve, reject) => {
    console.log(`Testing: ${description}`);
    
    https.get(url, (res) => {
      const { statusCode } = res;
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (statusCode === 200) {
          console.log(`✅ ${description} - Status: ${statusCode}`);
          resolve({ success: true, statusCode, data });
        } else {
          console.log(`⚠️  ${description} - Status: ${statusCode}`);
          resolve({ success: false, statusCode, data });
        }
      });
    }).on('error', (err) => {
      console.log(`❌ ${description} - Error: ${err.message}`);
      reject(err);
    });
  });
}

async function runTests() {
  const results = {
    timestamp: new Date().toISOString(),
    url: VERCEL_URL,
    tests: []
  };

  try {
    // Test 1: Main page loads
    const mainPageTest = await testEndpoint(VERCEL_URL, 'Main page (index.html)');
    results.tests.push({
      name: 'Main Page Load',
      passed: mainPageTest.success,
      statusCode: mainPageTest.statusCode
    });

    // Test 2: Check if HTML contains expected content
    if (mainPageTest.success) {
      const hasDataBleed = mainPageTest.data.includes('Data Bleed') || 
                           mainPageTest.data.includes('Chroma');
      console.log(hasDataBleed ? 
        '✅ Page contains expected game content' : 
        '⚠️  Page may not contain expected game content');
      results.tests.push({
        name: 'Content Validation',
        passed: hasDataBleed
      });
    }

    // Test 3: Check for API config script
    if (mainPageTest.success) {
      const hasApiConfig = mainPageTest.data.includes('api-config.js') ||
                          mainPageTest.data.includes('API_BASE_URL');
      console.log(hasApiConfig ? 
        '✅ API configuration detected' : 
        '⚠️  API configuration may be missing');
      results.tests.push({
        name: 'API Config Present',
        passed: hasApiConfig
      });
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    const passedTests = results.tests.filter(t => t.passed).length;
    const totalTests = results.tests.length;
    console.log(`\n📊 Test Summary: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log('✅ Vercel frontend deployment is working correctly!');
      results.overall = 'PASS';
    } else {
      console.log('⚠️  Some tests failed. Please review the deployment.');
      results.overall = 'PARTIAL';
    }

    // Save results
    const fs = require('fs');
    fs.writeFileSync(
      'vercel-deployment-test-results.json',
      JSON.stringify(results, null, 2)
    );
    console.log('\n📝 Results saved to vercel-deployment-test-results.json');

  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    results.overall = 'FAIL';
    results.error = error.message;
  }

  return results;
}

// Run tests
runTests().then(() => {
  console.log('\n✨ Testing complete!\n');
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
