/**
 * Production Deployment Testing Script
 * Tests both frontend and backend deployments to ensure they're working correctly
 */

class ProductionTester {
  constructor() {
    this.frontendUrl = 'https://data-bleed-vsc-game.vercel.app';
    this.backendUrl = 'https://data-bleed-backend.up.railway.app';
    this.results = {
      frontend: {},
      backend: {},
      integration: {}
    };
  }

  /**
   * Run all production tests
   */
  async runAllTests() {
    console.log('🧪 Starting production deployment tests...\n');
    
    try {
      // Test backend deployment
      await this.testBackendDeployment();
      
      // Test frontend deployment
      await this.testFrontendDeployment();
      
      // Test integration
      await this.testIntegration();
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  /**
   * Test backend deployment and API endpoints
   */
  async testBackendDeployment() {
    console.log('🔧 Testing backend deployment...');
    
    try {
      // Test health endpoint
      const healthResponse = await fetch(`${this.backendUrl}/api/health`);
      this.results.backend.health = {
        status: healthResponse.status,
        ok: healthResponse.ok,
        data: healthResponse.ok ? await healthResponse.json() : null
      };
      
      if (healthResponse.ok) {
        console.log('✅ Backend health check passed');
      } else {
        console.log('❌ Backend health check failed:', healthResponse.status);
      }

      // Test characters endpoint
      const charactersResponse = await fetch(`${this.backendUrl}/api/characters`);
      this.results.backend.characters = {
        status: charactersResponse.status,
        ok: charactersResponse.ok,
        data: charactersResponse.ok ? await charactersResponse.json() : null
      };

      if (charactersResponse.ok) {
        console.log('✅ Characters endpoint working');
      } else {
        console.log('❌ Characters endpoint failed:', charactersResponse.status);
      }

      // Test CORS headers
      const corsResponse = await fetch(`${this.backendUrl}/api/health`, {
        method: 'OPTIONS'
      });
      this.results.backend.cors = {
        status: corsResponse.status,
        headers: Object.fromEntries(corsResponse.headers.entries())
      };

      if (corsResponse.ok) {
        console.log('✅ CORS configuration working');
      } else {
        console.log('❌ CORS configuration failed');
      }

    } catch (error) {
      console.error('❌ Backend tests failed:', error);
      this.results.backend.error = error.message;
    }
  }

  /**
   * Test frontend deployment
   */
  async testFrontendDeployment() {
    console.log('\n🎨 Testing frontend deployment...');
    
    try {
      // Test main page load
      const frontendResponse = await fetch(this.frontendUrl);
      this.results.frontend.main = {
        status: frontendResponse.status,
        ok: frontendResponse.ok,
        contentType: frontendResponse.headers.get('content-type')
      };

      if (frontendResponse.ok) {
        console.log('✅ Frontend loads successfully');
        
        // Check if it's HTML content
        const contentType = frontendResponse.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          console.log('✅ Frontend serving HTML content');
        }
      } else {
        console.log('❌ Frontend failed to load:', frontendResponse.status);
      }

      // Test static assets
      const assetsToTest = [
        '/js/api-config.js',
        '/js/error-handler.js',
        '/style.css'
      ];

      this.results.frontend.assets = {};
      
      for (const asset of assetsToTest) {
        try {
          const assetResponse = await fetch(`${this.frontendUrl}${asset}`);
          this.results.frontend.assets[asset] = {
            status: assetResponse.status,
            ok: assetResponse.ok
          };
          
          if (assetResponse.ok) {
            console.log(`✅ Asset loaded: ${asset}`);
          } else {
            console.log(`❌ Asset failed: ${asset} (${assetResponse.status})`);
          }
        } catch (error) {
          console.log(`❌ Asset error: ${asset} - ${error.message}`);
          this.results.frontend.assets[asset] = { error: error.message };
        }
      }

    } catch (error) {
      console.error('❌ Frontend tests failed:', error);
      this.results.frontend.error = error.message;
    }
  }

  /**
   * Test frontend-backend integration
   */
  async testIntegration() {
    console.log('\n🔗 Testing frontend-backend integration...');
    
    try {
      // Test chat endpoint with sample data
      const chatData = {
        message: "Hello, this is a test message",
        character: "maya",
        sessionId: "test-session-" + Date.now()
      };

      const chatResponse = await fetch(`${this.backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': this.frontendUrl
        },
        body: JSON.stringify(chatData)
      });

      this.results.integration.chat = {
        status: chatResponse.status,
        ok: chatResponse.ok,
        data: chatResponse.ok ? await chatResponse.json() : null
      };

      if (chatResponse.ok) {
        console.log('✅ Chat integration working');
        const responseData = await chatResponse.json();
        if (responseData.reply) {
          console.log('✅ AI response received');
        }
      } else {
        console.log('❌ Chat integration failed:', chatResponse.status);
      }

    } catch (error) {
      console.error('❌ Integration tests failed:', error);
      this.results.integration.error = error.message;
    }
  }

  /**
   * Generate test report
   */
  generateReport() {
    console.log('\n📊 Production Deployment Test Report');
    console.log('=====================================\n');

    // Backend results
    console.log('🔧 Backend Tests:');
    console.log(`   Health Check: ${this.results.backend.health?.ok ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Characters API: ${this.results.backend.characters?.ok ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   CORS Config: ${this.results.backend.cors?.status === 200 ? '✅ PASS' : '❌ FAIL'}`);

    // Frontend results
    console.log('\n🎨 Frontend Tests:');
    console.log(`   Main Page: ${this.results.frontend.main?.ok ? '✅ PASS' : '❌ FAIL'}`);
    
    if (this.results.frontend.assets) {
      const assetResults = Object.entries(this.results.frontend.assets);
      const passedAssets = assetResults.filter(([_, result]) => result.ok).length;
      console.log(`   Static Assets: ${passedAssets}/${assetResults.length} passed`);
    }

    // Integration results
    console.log('\n🔗 Integration Tests:');
    console.log(`   Chat API: ${this.results.integration.chat?.ok ? '✅ PASS' : '❌ FAIL'}`);

    // Overall status
    const backendHealthy = this.results.backend.health?.ok && this.results.backend.characters?.ok;
    const frontendHealthy = this.results.frontend.main?.ok;
    const integrationHealthy = this.results.integration.chat?.ok;

    console.log('\n🎯 Overall Status:');
    console.log(`   Backend: ${backendHealthy ? '✅ HEALTHY' : '❌ ISSUES'}`);
    console.log(`   Frontend: ${frontendHealthy ? '✅ HEALTHY' : '❌ ISSUES'}`);
    console.log(`   Integration: ${integrationHealthy ? '✅ HEALTHY' : '❌ ISSUES'}`);

    if (backendHealthy && frontendHealthy && integrationHealthy) {
      console.log('\n🎉 Production deployment is fully functional!');
    } else {
      console.log('\n⚠️  Production deployment has issues that need attention.');
    }

    // URLs for reference
    console.log('\n🌐 Production URLs:');
    console.log(`   Frontend: ${this.frontendUrl}`);
    console.log(`   Backend: ${this.backendUrl}`);
    console.log(`   Health Check: ${this.backendUrl}/api/health`);
  }
}

// Run tests if this script is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.ProductionTester = ProductionTester;
  
  // Auto-run tests
  const tester = new ProductionTester();
  tester.runAllTests();
} else if (typeof module !== 'undefined') {
  // Node.js environment
  module.exports = ProductionTester;
  
  // Auto-run if called directly
  if (require.main === module) {
    const tester = new ProductionTester();
    tester.runAllTests();
  }
}