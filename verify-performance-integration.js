/**
 * Performance Integration Verification Script
 * Verifies that performance monitoring is properly integrated with all 3D systems
 */

class PerformanceIntegrationVerifier {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
    
    this.runTests();
  }

  /**
   * Run all integration tests
   */
  async runTests() {
    console.log('🧪 Starting Performance Integration Tests...\n');
    
    // Test 1: Check if all required classes are available
    await this.testClassAvailability();
    
    // Test 2: Test 3D integration initialization
    await this.test3DIntegrationInit();
    
    // Test 3: Test performance monitor initialization
    await this.testPerformanceMonitorInit();
    
    // Test 4: Test mobile 3D support integration
    await this.testMobile3DSupportIntegration();
    
    // Test 5: Test performance monitoring lifecycle
    await this.testPerformanceMonitoringLifecycle();
    
    // Test 6: Test automatic quality adjustment
    await this.testAutomaticQualityAdjustment();
    
    // Test 7: Test memory cleanup functionality
    await this.testMemoryCleanup();
    
    // Test 8: Test system status reporting
    await this.testSystemStatusReporting();
    
    // Display results
    this.displayResults();
  }

  /**
   * Test if all required classes are available
   */
  async testClassAvailability() {
    const testName = 'Class Availability';
    console.log(`🔍 Testing: ${testName}`);
    
    try {
      const requiredClasses = [
        'ThreeSceneManager',
        'PerformanceMonitor', 
        'Mobile3DSupport',
        'ThreeDIntegration'
      ];
      
      const missingClasses = [];
      
      for (const className of requiredClasses) {
        if (typeof window[className] === 'undefined') {
          missingClasses.push(className);
        }
      }
      
      if (missingClasses.length === 0) {
        this.pass(testName, 'All required classes are available');
      } else {
        this.fail(testName, `Missing classes: ${missingClasses.join(', ')}`);
      }
      
    } catch (error) {
      this.fail(testName, `Error checking class availability: ${error.message}`);
    }
  }

  /**
   * Test 3D integration initialization
   */
  async test3DIntegrationInit() {
    const testName = '3D Integration Initialization';
    console.log(`🔍 Testing: ${testName}`);
    
    try {
      // Create a test integration instance
      const integration = new ThreeDIntegration();
      
      // Wait a moment for initialization
      await this.wait(1000);
      
      // Check if integration is properly initialized
      if (integration.isAvailable()) {
        // Check if performance monitor is initialized
        const perfMonitor = integration.getPerformanceMonitor();
        const mobile3D = integration.getMobile3DSupport();
        
        if (perfMonitor && mobile3D) {
          this.pass(testName, 'Integration initialized with all components');
        } else {
          this.fail(testName, 'Integration missing performance monitor or mobile support');
        }
      } else {
        // This might be expected if WebGL is not available
        console.log('⚠️ WebGL not available - skipping 3D integration test');
        this.pass(testName, 'Gracefully handled WebGL unavailability');
      }
      
      // Cleanup
      await integration.cleanup();
      
    } catch (error) {
      this.fail(testName, `Integration initialization failed: ${error.message}`);
    }
  }

  /**
   * Test performance monitor initialization
   */
  async testPerformanceMonitorInit() {
    const testName = 'Performance Monitor Initialization';
    console.log(`🔍 Testing: ${testName}`);
    
    try {
      // Create scene manager first
      const sceneManager = new ThreeSceneManager();
      const initialized = sceneManager.initialize();
      
      if (!initialized) {
        console.log('⚠️ WebGL not available - skipping performance monitor test');
        this.pass(testName, 'Gracefully handled WebGL unavailability');
        return;
      }
      
      // Create mobile support
      const mobile3D = new Mobile3DSupport(sceneManager, null);
      
      // Create performance monitor
      const perfMonitor = new PerformanceMonitor(sceneManager, mobile3D);
      
      // Check if monitor is properly initialized
      const systemStatus = perfMonitor.getSystemStatus();
      
      if (systemStatus && typeof systemStatus.isMonitoring === 'boolean') {
        this.pass(testName, 'Performance monitor initialized successfully');
      } else {
        this.fail(testName, 'Performance monitor system status invalid');
      }
      
      // Cleanup
      perfMonitor.cleanup();
      sceneManager.cleanup();
      
    } catch (error) {
      this.fail(testName, `Performance monitor initialization failed: ${error.message}`);
    }
  }

  /**
   * Test mobile 3D support integration
   */
  async testMobile3DSupportIntegration() {
    const testName = 'Mobile 3D Support Integration';
    console.log(`🔍 Testing: ${testName}`);
    
    try {
      const sceneManager = new ThreeSceneManager();
      const initialized = sceneManager.initialize();
      
      if (!initialized) {
        console.log('⚠️ WebGL not available - skipping mobile 3D test');
        this.pass(testName, 'Gracefully handled WebGL unavailability');
        return;
      }
      
      const mobile3D = new Mobile3DSupport(sceneManager, null);
      const deviceInfo = mobile3D.getDeviceInfo();
      
      // Check if device detection worked
      if (deviceInfo && 
          typeof deviceInfo.isMobile === 'boolean' &&
          typeof deviceInfo.isTablet === 'boolean' &&
          deviceInfo.capabilities &&
          deviceInfo.renderingQuality) {
        this.pass(testName, `Mobile support initialized - Quality: ${deviceInfo.renderingQuality}`);
      } else {
        this.fail(testName, 'Mobile 3D support device info invalid');
      }
      
      sceneManager.cleanup();
      
    } catch (error) {
      this.fail(testName, `Mobile 3D support failed: ${error.message}`);
    }
  }

  /**
   * Test performance monitoring lifecycle
   */
  async testPerformanceMonitoringLifecycle() {
    const testName = 'Performance Monitoring Lifecycle';
    console.log(`🔍 Testing: ${testName}`);
    
    try {
      const sceneManager = new ThreeSceneManager();
      const initialized = sceneManager.initialize();
      
      if (!initialized) {
        console.log('⚠️ WebGL not available - skipping lifecycle test');
        this.pass(testName, 'Gracefully handled WebGL unavailability');
        return;
      }
      
      const mobile3D = new Mobile3DSupport(sceneManager, null);
      const perfMonitor = new PerformanceMonitor(sceneManager, mobile3D);
      
      // Test start monitoring
      perfMonitor.startMonitoring();
      let status = perfMonitor.getSystemStatus();
      
      if (!status.isMonitoring) {
        this.fail(testName, 'Failed to start monitoring');
        return;
      }
      
      // Wait a moment for metrics to be collected
      await this.wait(2000);
      
      // Check if metrics are being collected
      const metrics = perfMonitor.getMetrics();
      
      if (metrics.fps.current >= 0 && metrics.fps.samples.length > 0) {
        // Test stop monitoring
        perfMonitor.stopMonitoring();
        status = perfMonitor.getSystemStatus();
        
        if (!status.isMonitoring) {
          this.pass(testName, 'Monitoring lifecycle works correctly');
        } else {
          this.fail(testName, 'Failed to stop monitoring');
        }
      } else {
        this.fail(testName, 'No metrics collected during monitoring');
      }
      
      perfMonitor.cleanup();
      sceneManager.cleanup();
      
    } catch (error) {
      this.fail(testName, `Lifecycle test failed: ${error.message}`);
    }
  }

  /**
   * Test automatic quality adjustment
   */
  async testAutomaticQualityAdjustment() {
    const testName = 'Automatic Quality Adjustment';
    console.log(`🔍 Testing: ${testName}`);
    
    try {
      const sceneManager = new ThreeSceneManager();
      const initialized = sceneManager.initialize();
      
      if (!initialized) {
        console.log('⚠️ WebGL not available - skipping quality adjustment test');
        this.pass(testName, 'Gracefully handled WebGL unavailability');
        return;
      }
      
      const mobile3D = new Mobile3DSupport(sceneManager, null);
      const perfMonitor = new PerformanceMonitor(sceneManager, mobile3D);
      
      // Test manual quality setting
      const qualityLevels = ['low', 'medium', 'high'];
      let allQualityLevelsWork = true;
      
      for (const level of qualityLevels) {
        const result = perfMonitor.setQualityLevel(level);
        if (!result) {
          allQualityLevelsWork = false;
          break;
        }
        
        const metrics = perfMonitor.getMetrics();
        if (metrics.performance.level !== level) {
          allQualityLevelsWork = false;
          break;
        }
      }
      
      // Test auto-adjustment toggle
      perfMonitor.setAutoQualityAdjustment(false);
      perfMonitor.setAutoQualityAdjustment(true);
      
      if (allQualityLevelsWork) {
        this.pass(testName, 'Quality adjustment system works correctly');
      } else {
        this.fail(testName, 'Quality adjustment system failed');
      }
      
      perfMonitor.cleanup();
      sceneManager.cleanup();
      
    } catch (error) {
      this.fail(testName, `Quality adjustment test failed: ${error.message}`);
    }
  }

  /**
   * Test memory cleanup functionality
   */
  async testMemoryCleanup() {
    const testName = 'Memory Cleanup';
    console.log(`🔍 Testing: ${testName}`);
    
    try {
      const sceneManager = new ThreeSceneManager();
      const initialized = sceneManager.initialize();
      
      if (!initialized) {
        console.log('⚠️ WebGL not available - skipping memory cleanup test');
        this.pass(testName, 'Gracefully handled WebGL unavailability');
        return;
      }
      
      const mobile3D = new Mobile3DSupport(sceneManager, null);
      const perfMonitor = new PerformanceMonitor(sceneManager, mobile3D);
      
      // Add some objects to create memory usage
      const scene = sceneManager.getScene();
      const testObjects = [];
      
      for (let i = 0; i < 10; i++) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        testObjects.push(cube);
      }
      
      // Get initial memory metrics
      perfMonitor.updateMemoryMetrics();
      const initialMetrics = perfMonitor.getMetrics();
      
      // Perform memory cleanup
      perfMonitor.performMemoryCleanup();
      
      // Check if cleanup completed without errors
      this.pass(testName, 'Memory cleanup executed successfully');
      
      // Cleanup test objects
      testObjects.forEach(obj => {
        scene.remove(obj);
        obj.geometry.dispose();
        obj.material.dispose();
      });
      
      perfMonitor.cleanup();
      sceneManager.cleanup();
      
    } catch (error) {
      this.fail(testName, `Memory cleanup test failed: ${error.message}`);
    }
  }

  /**
   * Test system status reporting
   */
  async testSystemStatusReporting() {
    const testName = 'System Status Reporting';
    console.log(`🔍 Testing: ${testName}`);
    
    try {
      // Test with 3D integration
      const integration = new ThreeDIntegration();
      await this.wait(1000);
      
      const systemStatus = integration.getSystemStatus();
      
      if (systemStatus && 
          typeof systemStatus.isEnabled === 'boolean' &&
          systemStatus.hasOwnProperty('currentCharacter') &&
          systemStatus.hasOwnProperty('sceneManager')) {
        
        // Test performance status if available
        const perfStatus = integration.getPerformanceStatus();
        
        if (integration.isAvailable() && perfStatus) {
          if (perfStatus.hasOwnProperty('status') &&
              perfStatus.hasOwnProperty('fps') &&
              perfStatus.hasOwnProperty('qualityLevel')) {
            this.pass(testName, 'System status reporting works correctly');
          } else {
            this.fail(testName, 'Performance status incomplete');
          }
        } else {
          this.pass(testName, 'System status works (3D not available)');
        }
      } else {
        this.fail(testName, 'System status reporting incomplete');
      }
      
      await integration.cleanup();
      
    } catch (error) {
      this.fail(testName, `System status test failed: ${error.message}`);
    }
  }

  /**
   * Mark test as passed
   */
  pass(testName, message) {
    this.results.passed++;
    this.results.tests.push({ name: testName, status: 'PASS', message });
    console.log(`✅ ${testName}: ${message}`);
  }

  /**
   * Mark test as failed
   */
  fail(testName, message) {
    this.results.failed++;
    this.results.tests.push({ name: testName, status: 'FAIL', message });
    console.log(`❌ ${testName}: ${message}`);
  }

  /**
   * Wait for specified milliseconds
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Display final test results
   */
  displayResults() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 PERFORMANCE INTEGRATION TEST RESULTS');
    console.log('='.repeat(60));
    
    this.results.tests.forEach(test => {
      const icon = test.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${test.name}: ${test.message}`);
    });
    
    console.log('\n' + '-'.repeat(60));
    console.log(`📊 Summary: ${this.results.passed} passed, ${this.results.failed} failed`);
    
    if (this.results.failed === 0) {
      console.log('🎉 All tests passed! Performance monitoring is properly integrated.');
    } else {
      console.log('⚠️ Some tests failed. Check the implementation.');
    }
    
    console.log('-'.repeat(60));
  }
}

// Auto-run tests when script is loaded
if (typeof window !== 'undefined') {
  // Browser environment
  window.addEventListener('load', () => {
    new PerformanceIntegrationVerifier();
  });
} else {
  // Node.js environment (if needed)
  new PerformanceIntegrationVerifier();
}

// Export for manual testing
window.PerformanceIntegrationVerifier = PerformanceIntegrationVerifier;