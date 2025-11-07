#!/usr/bin/env node

/**
 * Test Railway backend deployment status
 */

const https = require('https');

const RAILWAY_URL = 'https://data-bleed-backend.up.railway.app';

console.log('🔍 Testing Railway Backend Status...\n');

function makeRequest(path, method = 'GET') {
  return new Promise((resolve) => {
    const url = new URL(path, RAILWAY_URL);
    
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://chroma-bot-game.vercel.app'
      }
    };

    console.log(`Testing: ${method} ${url.href}`);
    
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, JSON.stringify(res.headers, null, 2));
        console.log(`Body preview: ${data.substring(0, 200)}\n`);
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (error) => {
      console.log(`Error: ${error.message}\n`);
      resolve({ error: error.message });
    });
    
    req.end();
  });
}

async function runTests() {
  console.log('Testing root path...');
  await makeRequest('/');
  
  console.log('Testing /api/health...');
  await makeRequest('/api/health');
  
  console.log('Testing /api/characters...');
  await makeRequest('/api/characters');
  
  console.log('Testing /health (without /api prefix)...');
  await makeRequest('/health');
  
  console.log('✨ Tests complete!');
}

runTests();
