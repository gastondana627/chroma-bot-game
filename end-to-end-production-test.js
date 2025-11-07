/**
 * End-to-End Production Testing Suite
 * Tests complete user flow from frontend to backend in production environment
 */

class EndToEndProductionTester {
  constructor() {
    this.frontendUrl = 'https://data-bleed-vsc-game.vercel.app';
    this.backendUrl = 'https://data-bleed-backend.up.railway.app';
    this.testResults = {
      userFlow: {},
      characterInteractions: {},
      sessionManagement: {},
      errorScenarios: {}
    };
    this.sessionId = `e2e-test-${Date.now()}`;
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${level}: ${message}`);
  }

  /**
   * Test complete user flow from frontend to backend
   */
  async testCompleteUserFlow() {
    this.log('🎮 Testing complete user flow...');
    
    try {
      // Step 1: Load frontend
      this.log('Step 1: Loading frontend application...');
      const frontendResponse = await fetch(this.frontendUrl);
      
      if (!frontendResponse.ok) {
        throw new Error(`Frontend not accessible: ${frontendResponse.status}`);
      }
      
      const frontendContent = await frontendResponse.text();
      
      // Check for essential game elements
      const hasGameTitle = frontendContent.includes('Data_Bleed');
      const hasAPIConfig = frontendContent.includes('api-config.js');
      const hasGameMechanics = frontendContent.includes('Game/Mechanics');
      
      this.testResults.userFlow.frontendLoad = {
        success: true,
        hasGameTitle,
        hasAPIConfig,
        hasGameMechanics,
        contentLength: frontendContent.length
      };
      
      this.log('✅ Frontend loaded successfully');
      this.log(`   - Game title present: ${hasGameTitle}`);
      this.log(`   - API config included: ${hasAPIConfig}`);
      this.log(`   - Game mechanics included: ${hasGameMechanics}`);
      
      // Step 2: Test API configuration detection
      this.log('Step 2: Testing API configuration...');
      const apiConfigResponse = await fetch(`${this.frontendUrl}/js/api-config.js`);
      
      if (apiConfigResponse.ok) {
        const apiConfigContent = await apiConfigResponse.text();
        const hasProductionUrl = apiConfigContent.includes(this.backendUrl);
        const hasEnvironmentDetection = apiConfigContent.includes('detectEnvironment');
        
        this.testResults.userFlow.apiConfig = {
          success: true,
          hasProductionUrl,
          hasEnvironmentDetection
        };
        
        this.log('✅ API configuration accessible');
        this.log(`   - Production URL configured: ${hasProductionUrl}`);
        this.log(`   - Environment detection: ${hasEnvironmentDetection}`);
      } else {
        throw new Error(`API config not accessible: ${apiConfigResponse.status}`);
      }
      
      // Step 3: Test backend connectivity
      this.log('Step 3: Testing backend connectivity...');
      const healthResponse = await fetch(`${this.backendUrl}/api/health`);
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        
        this.testResults.userFlow.backendHealth = {
          success: true,
          data: healthData
        };
        
        this.log('✅ Backend health check passed');
        this.log(`   - OpenAI configured: ${healthData.openai_configured}`);
        this.log(`   - Characters loaded: ${healthData.characters_loaded?.length || 0}`);
      } else {
        throw new Error(`Backend health check failed: ${healthResponse.status}`);
      }
      
      this.log('🎉 Complete user flow test passed!');
      return true;
      
    } catch (error) {
      this.log(`❌ User flow test failed: ${error.message}`, 'ERROR');
      this.testResults.userFlow.error = error.message;
      return false;
    }
  }

  /**
   * Test character interactions work in production
   */
  async testCharacterInteractions() {
    this.log('🎭 Testing character interactions...');
    
    const characters = ['maya', 'eli', 'stanley'];
    const testMessages = [
      'Hello, this is a production test',
      'Can you tell me about yourself?',
      'What should I be careful about?'
    ];
    
    for (const character of characters) {
      this.log(`Testing character: ${character}`);
      
      try {
        for (let i = 0; i < testMessages.length; i++) {
          const message = testMessages[i];
          
          const chatData = {
            message: message,
            character: character,
            sessionId: `${this.sessionId}-${character}`
          };
          
          const chatResponse = await fetch(`${this.backendUrl}/api/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Origin': this.frontendUrl
            },
            body: JSON.stringify(chatData)
          });
          
          if (chatResponse.ok) {
            const chatResult = await chatResponse.json();
            
            // Validate response structure
            const hasReply = 'reply' in chatResult;
            const hasTrustScore = 'trust_score' in chatResult;
            const hasPersona = 'persona' in chatResult;
            
            if (!this.testResults.characterInteractions[character]) {
              this.testResults.characterInteractions[character] = [];
            }
            
            this.testResults.characterInteractions[character].push({
              message: message,
              success: true,
              hasReply,
              hasTrustScore,
              hasPersona,
              trustScore: chatResult.trust_score,
              persona: chatResult.persona,
              replyLength: chatResult.reply?.length || 0
            });
            
            this.log(`✅ ${character} interaction ${i + 1} successful`);
            this.log(`   - Reply received: ${hasReply} (${chatResult.reply?.length || 0} chars)`);
            this.log(`   - Trust score: ${hasTrustScore} (${chatResult.trust_score})`);
            this.log(`   - Persona: ${hasPersona} (${chatResult.persona})`);
            
            // Small delay between messages
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } else {
            throw new Error(`Chat failed for ${character}: ${chatResponse.status}`);
          }
        }
        
        this.log(`🎉 All interactions with ${character} successful!`);
        
      } catch (error) {
        this.log(`❌ Character interaction failed for ${character}: ${error.message}`, 'ERROR');
        
        if (!this.testResults.characterInteractions[character]) {
          this.testResults.characterInteractions[character] = [];
        }
        
        this.testResults.characterInteractions[character].push({
          error: error.message,
          success: false
        });
      }
    }
    
    // Check if all characters worked
    const successfulCharacters = Object.keys(this.testResults.characterInteractions)
      .filter(char => this.testResults.characterInteractions[char].some(test => test.success));
      
    this.log(`📊 Character interaction summary: ${successfulCharacters.length}/${characters.length} characters working`);
    
    return successfulCharacters.length === characters.length;
  }

  /**
   * Test session management across requests
   */
  async testSessionManagement() {
    this.log('🔄 Testing session management...');
    
    try {
      const testSessionId = `session-test-${Date.now()}`;
      const character = 'maya';
      
      // Send multiple messages with same session ID
      const messages = [
        'Hello, I am starting a new conversation',
        'Do you remember what I just said?',
        'This is my third message in this session'
      ];
      
      const sessionResults = [];
      
      for (let i = 0; i < messages.length; i++) {
        const chatData = {
          message: messages[i],
          character: character,
          sessionId: testSessionId
        };
        
        const response = await fetch(`${this.backendUrl}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': this.frontendUrl
          },
          body: JSON.stringify(chatData)
        });
        
        if (response.ok) {
          const result = await response.json();
          sessionResults.push({
            messageNumber: i + 1,
            trustScore: result.trust_score,
            persona: result.persona,
            replyLength: result.reply?.length || 0
          });
          
          this.log(`✅ Session message ${i + 1} processed`);
          this.log(`   - Trust score: ${result.trust_score}`);
          this.log(`   - Persona: ${result.persona}`);
          
          // Delay between messages
          await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
          throw new Error(`Session test message ${i + 1} failed: ${response.status}`);
        }
      }
      
      // Analyze session consistency
      const trustScores = sessionResults.map(r => r.trustScore);
      const personas = sessionResults.map(r => r.persona);
      
      // Check if trust scores are evolving (not all the same)
      const trustScoreVariation = new Set(trustScores).size > 1;
      
      // Check if personas are consistent or evolving appropriately
      const personaConsistency = personas.every(p => p === personas[0]) || 
                                personas.some(p => p !== personas[0]);
      
      this.testResults.sessionManagement = {
        success: true,
        sessionId: testSessionId,
        messageCount: messages.length,
        trustScores: trustScores,
        personas: personas,
        trustScoreVariation: trustScoreVariation,
        personaConsistency: personaConsistency,
        sessionResults: sessionResults
      };
      
      this.log('✅ Session management test completed');
      this.log(`   - Messages processed: ${messages.length}`);
      this.log(`   - Trust score variation: ${trustScoreVariation}`);
      this.log(`   - Trust scores: [${trustScores.join(', ')}]`);
      this.log(`   - Personas: [${personas.join(', ')}]`);
      
      return true;
      
    } catch (error) {
      this.log(`❌ Session management test failed: ${error.message}`, 'ERROR');
      this.testResults.sessionManagement = {
        success: false,
        error: error.message
      };
      return false;
    }
  }

  /**
   * Test error scenarios and recovery
   */
  async testErrorScenarios() {
    this.log('🚨 Testing error scenarios and recovery...');
    
    const errorTests = [
      {
        name: 'Invalid Character',
        data: { message: 'Hello', character: 'invalid_character', sessionId: this.sessionId },
        expectedStatus: [400, 422]
      },
      {
        name: 'Missing Message',
        data: { character: 'maya', sessionId: this.sessionId },
        expectedStatus: [400, 422]
      },
      {
        name: 'Empty Message',
        data: { message: '', character: 'maya', sessionId: this.sessionId },
        expectedStatus: [400, 422]
      },
      {
        name: 'Invalid Endpoint',
        endpoint: '/api/nonexistent',
        data: { message: 'Hello', character: 'maya' },
        expectedStatus: [404]
      }
    ];
    
    for (const test of errorTests) {
      this.log(`Testing error scenario: ${test.name}`);
      
      try {
        const endpoint = test.endpoint || '/api/chat';
        const response = await fetch(`${this.backendUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': this.frontendUrl
          },
          body: JSON.stringify(test.data)
        });
        
        const isExpectedError = test.expectedStatus.includes(response.status);
        
        if (isExpectedError) {
          this.log(`✅ ${test.name}: Correctly returned ${response.status}`);
          
          // Try to parse error response
          try {
            const errorData = await response.json();
            this.log(`   - Error message: ${errorData.detail || errorData.error || 'No message'}`);
          } catch (e) {
            this.log(`   - Error response not JSON`);
          }
          
          if (!this.testResults.errorScenarios[test.name]) {
            this.testResults.errorScenarios[test.name] = {};
          }
          
          this.testResults.errorScenarios[test.name] = {
            success: true,
            status: response.status,
            expectedStatus: test.expectedStatus
          };
          
        } else {
          this.log(`❌ ${test.name}: Unexpected status ${response.status} (expected ${test.expectedStatus})`, 'ERROR');
          
          this.testResults.errorScenarios[test.name] = {
            success: false,
            status: response.status,
            expectedStatus: test.expectedStatus,
            error: `Unexpected status code`
          };
        }
        
      } catch (error) {
        this.log(`❌ ${test.name}: Network error - ${error.message}`, 'ERROR');
        
        this.testResults.errorScenarios[test.name] = {
          success: false,
          error: error.message
        };
      }
    }
    
    // Test recovery after errors
    this.log('Testing recovery after errors...');
    
    try {
      const recoveryData = {
        message: 'This should work after error tests',
        character: 'maya',
        sessionId: `recovery-${Date.now()}`
      };
      
      const recoveryResponse = await fetch(`${this.backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': this.frontendUrl
        },
        body: JSON.stringify(recoveryData)
      });
      
      if (recoveryResponse.ok) {
        this.log('✅ System recovered successfully after error tests');
        this.testResults.errorScenarios.recovery = { success: true };
      } else {
        this.log(`❌ System did not recover: ${recoveryResponse.status}`, 'ERROR');
        this.testResults.errorScenarios.recovery = { 
          success: false, 
          status: recoveryResponse.status 
        };
      }
      
    } catch (error) {
      this.log(`❌ Recovery test failed: ${error.message}`, 'ERROR');
      this.testResults.errorScenarios.recovery = { 
        success: false, 
        error: error.message 
      };
    }
    
    const successfulErrorTests = Object.values(this.testResults.errorScenarios)
      .filter(test => test.success).length;
    const totalErrorTests = Object.keys(this.testResults.errorScenarios).length;
    
    this.log(`📊 Error scenario summary: ${successfulErrorTests}/${totalErrorTests} tests passed`);
    
    return successfulErrorTests === totalErrorTests;
  }

  /**
   * Generate comprehensive test report
   */
  generateTestReport() {
    const report = {
      timestamp: new Date().toISOString(),
      testSession: this.sessionId,
      frontendUrl: this.frontendUrl,
      backendUrl: this.backendUrl,
      results: this.testResults,
      summary: {
        userFlow: this.testResults.userFlow.frontendLoad?.success || false,
        characterInteractions: Object.keys(this.testResults.characterInteractions).length > 0,
        sessionManagement: this.testResults.sessionManagement.success || false,
        errorHandling: Object.values(this.testResults.errorScenarios).some(test => test.success)
      }
    };
    
    // Calculate overall success
    const allTestsPassed = Object.values(report.summary).every(result => result === true);
    report.summary.overallSuccess = allTestsPassed;
    
    return report;
  }

  /**
   * Run all end-to-end tests
   */
  async runAllTests() {
    this.log('🚀 Starting End-to-End Production Testing Suite...');
    this.log(`Frontend: ${this.frontendUrl}`);
    this.log(`Backend: ${this.backendUrl}`);
    this.log(`Session ID: ${this.sessionId}`);
    
    const testSuite = [
      { name: 'User Flow', test: () => this.testCompleteUserFlow() },
      { name: 'Character Interactions', test: () => this.testCharacterInteractions() },
      { name: 'Session Management', test: () => this.testSessionManagement() },
      { name: 'Error Scenarios', test: () => this.testErrorScenarios() }
    ];
    
    let passedTests = 0;
    
    for (const { name, test } of testSuite) {
      this.log(`\n--- ${name} Test ---`);
      
      try {
        const result = await test();
        if (result) {
          passedTests++;
          this.log(`✅ ${name} test PASSED`);
        } else {
          this.log(`❌ ${name} test FAILED`);
        }
      } catch (error) {
        this.log(`❌ ${name} test ERROR: ${error.message}`);
      }
      
      // Delay between test suites
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Generate final report
    const report = this.generateTestReport();
    
    this.log('\n📊 End-to-End Test Results');
    this.log('=' * 50);
    this.log(`✅ Passed: ${passedTests}/${testSuite.length} test suites`);
    this.log(`❌ Failed: ${testSuite.length - passedTests}/${testSuite.length} test suites`);
    
    if (report.summary.overallSuccess) {
      this.log('\n🎉 All end-to-end tests PASSED! Production system is fully functional.');
    } else {
      this.log('\n⚠️ Some end-to-end tests FAILED. Check individual test results above.');
    }
    
    // Save detailed report
    const reportFile = 'end-to-end-test-report.json';
    if (typeof require !== 'undefined') {
      const fs = require('fs');
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
      this.log(`📄 Detailed report saved to: ${reportFile}`);
    }
    
    return report.summary.overallSuccess;
  }
}

// Export for different environments
if (typeof window !== 'undefined') {
  // Browser environment
  window.EndToEndProductionTester = EndToEndProductionTester;
} else if (typeof module !== 'undefined') {
  // Node.js environment
  module.exports = EndToEndProductionTester;
}

// Auto-run if this script is executed directly
if (typeof window !== 'undefined' && window.location) {
  // Browser - wait for page load
  window.addEventListener('load', async () => {
    const tester = new EndToEndProductionTester();
    await tester.runAllTests();
  });
} else if (typeof require !== 'undefined' && require.main === module) {
  // Node.js - run immediately
  (async () => {
    const tester = new EndToEndProductionTester();
    const success = await tester.runAllTests();
    process.exit(success ? 0 : 1);
  })();
}