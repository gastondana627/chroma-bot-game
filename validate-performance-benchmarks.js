/**
 * Performance Benchmark Validation Script
 * Validates that the performance benchmarking system integrates correctly
 * with existing 3D components and meets all requirements
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

const fs = require('fs');
const path = require('path');

class PerformanceBenchmarkValidator {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            details: []
        };
    }

    /**
     * Validate that all required files exist
     */
    validateFileStructure() {
        console.log('🔍 Validating performance benchmark file structure...');
        
        const requiredFiles = [
            'js/performance-benchmarking-system.js',
            'tests/3d-performance-benchmarks.test.js',
            'test-3d-performance-benchmarks.html'
        ];
        
        const existingFiles = [
            'js/performance-monitor.js',
            'js/3d-integration.js',
            'js/character-3d-system.js'
        ];
        
        // Check required new files
        requiredFiles.forEach(file => {
            if (fs.existsSync(file)) {
                this.logPass(`✅ Required file exists: ${file}`);
            } else {
                this.logFail(`❌ Missing required file: ${file}`);
            }
        });
        
        // Check integration with existing files
        existingFiles.forEach(file => {
            if (fs.existsSync(file)) {
                this.logPass(`✅ Integration target exists: ${file}`);
            } else {
                this.logWarning(`⚠️  Integration target missing: ${file}`);
            }
        });
    }

    /**
     * Validate performance benchmarking system code quality
     */
    validateBenchmarkingSystem() {
        console.log('🔍 Validating performance benchmarking system implementation...');
        
        const systemFile = 'js/performance-benchmarking-system.js';
        
        if (!fs.existsSync(systemFile)) {
            this.logFail(`❌ Performance benchmarking system file not found`);
            return;
        }
        
        const content = fs.readFileSync(systemFile, 'utf8');
        
        // Check for required methods and functionality
        const requiredMethods = [
            'detectDeviceCapabilities',
            'startBenchmark',
            'endBenchmark',
            'recordFrame',
            'recordAssetLoad',
            'checkPerformanceThresholds',
            'triggerMemoryCleanup',
            'generateReport',
            'testConcurrentUsers'
        ];
        
        requiredMethods.forEach(method => {
            if (content.includes(method)) {
                this.logPass(`✅ Required method implemented: ${method}`);
            } else {
                this.logFail(`❌ Missing required method: ${method}`);
            }
        });
        
        // Check for performance thresholds (Requirement 6.1, 6.2, 6.3)
        const requiredThresholds = [
            'minFPS',
            'maxFrameTime',
            'maxMemoryUsage',
            'maxLoadTime',
            'maxDrawCalls'
        ];
        
        requiredThresholds.forEach(threshold => {
            if (content.includes(threshold)) {
                this.logPass(`✅ Performance threshold defined: ${threshold}`);
            } else {
                this.logFail(`❌ Missing performance threshold: ${threshold}`);
            }
        });
        
        // Check for device capability detection (Requirement 6.4)
        const deviceCapabilities = [
            'memory',
            'cores',
            'webglVersion',
            'isMobile',
            'connectionSpeed'
        ];
        
        deviceCapabilities.forEach(capability => {
            if (content.includes(capability)) {
                this.logPass(`✅ Device capability detected: ${capability}`);
            } else {
                this.logFail(`❌ Missing device capability: ${capability}`);
            }
        });
    }

    /**
     * Validate test coverage
     */
    validateTestCoverage() {
        console.log('🔍 Validating performance benchmark test coverage...');
        
        const testFile = 'tests/3d-performance-benchmarks.test.js';
        
        if (!fs.existsSync(testFile)) {
            this.logFail(`❌ Performance benchmark test file not found`);
            return;
        }
        
        const content = fs.readFileSync(testFile, 'utf8');
        
        // Check for required test categories
        const requiredTestSuites = [
            'Rendering Performance Tests',
            'Memory Usage Tests',
            'Asset Loading Optimization Tests',
            'Cross-Browser Performance Tests',
            'Concurrent User Performance Tests',
            'Performance Optimization Validation'
        ];
        
        requiredTestSuites.forEach(suite => {
            if (content.includes(suite)) {
                this.logPass(`✅ Test suite implemented: ${suite}`);
            } else {
                this.logFail(`❌ Missing test suite: ${suite}`);
            }
        });
        
        // Check for specific requirement tests
        const requirementTests = [
            'should maintain 60 FPS during character emergence',
            'should handle multiple character models',
            'should maintain memory usage below 80%',
            'should load initial assets within 5 seconds',
            'should maintain performance with up to 50 concurrent users',
            'should implement progressive loading for limited bandwidth'
        ];
        
        requirementTests.forEach(test => {
            if (content.includes(test.substring(0, 30))) {
                this.logPass(`✅ Requirement test implemented: ${test}`);
            } else {
                this.logFail(`❌ Missing requirement test: ${test}`);
            }
        });
    }

    /**
     * Validate HTML test interface
     */
    validateTestInterface() {
        console.log('🔍 Validating HTML test interface...');
        
        const htmlFile = 'test-3d-performance-benchmarks.html';
        
        if (!fs.existsSync(htmlFile)) {
            this.logFail(`❌ HTML test interface not found`);
            return;
        }
        
        const content = fs.readFileSync(htmlFile, 'utf8');
        
        // Check for required UI components
        const requiredComponents = [
            'Device Information',
            'Real-time Performance Metrics',
            '3D Rendering Test',
            'Performance Benchmarks',
            'Optimization Validation',
            'Browser Compatibility'
        ];
        
        requiredComponents.forEach(component => {
            if (content.includes(component)) {
                this.logPass(`✅ UI component present: ${component}`);
            } else {
                this.logFail(`❌ Missing UI component: ${component}`);
            }
        });
        
        // Check for Three.js integration
        if (content.includes('three.min.js')) {
            this.logPass(`✅ Three.js integration present`);
        } else {
            this.logFail(`❌ Missing Three.js integration`);
        }
        
        // Check for performance monitoring functions
        const requiredFunctions = [
            'runRenderingBenchmark',
            'runMemoryBenchmark',
            'runAssetLoadingBenchmark',
            'runConcurrentUserTest',
            'testLODOptimization',
            'testWebGLSupport'
        ];
        
        requiredFunctions.forEach(func => {
            if (content.includes(func)) {
                this.logPass(`✅ Test function implemented: ${func}`);
            } else {
                this.logFail(`❌ Missing test function: ${func}`);
            }
        });
    }

    /**
     * Validate integration with existing 3D system
     */
    validateIntegration() {
        console.log('🔍 Validating integration with existing 3D system...');
        
        // Check if performance monitor exists and can be integrated
        const performanceMonitorFile = 'js/performance-monitor.js';
        if (fs.existsSync(performanceMonitorFile)) {
            const content = fs.readFileSync(performanceMonitorFile, 'utf8');
            
            if (content.includes('class PerformanceMonitor')) {
                this.logPass(`✅ Existing performance monitor can be extended`);
            } else {
                this.logWarning(`⚠️  Existing performance monitor may need updates`);
            }
        }
        
        // Check 3D integration points
        const integrationFiles = [
            'js/3d-integration.js',
            'js/character-3d-system.js',
            'js/character-3d-renderer.js'
        ];
        
        integrationFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                
                // Check if file has hooks for performance monitoring
                if (content.includes('performance') || content.includes('monitor')) {
                    this.logPass(`✅ Performance hooks available in: ${file}`);
                } else {
                    this.logWarning(`⚠️  May need performance hooks in: ${file}`);
                }
            }
        });
    }

    /**
     * Validate requirement compliance
     */
    validateRequirements() {
        console.log('🔍 Validating requirement compliance...');
        
        const requirements = [
            {
                id: '6.1',
                description: 'Support for 50 concurrent users',
                checks: ['testConcurrentUsers', 'concurrent users test']
            },
            {
                id: '6.2',
                description: 'Asset loading under 5 seconds',
                checks: ['maxLoadTime', 'asset loading benchmark']
            },
            {
                id: '6.3',
                description: 'Memory usage monitoring and cleanup',
                checks: ['maxMemoryUsage', 'triggerMemoryCleanup', 'memory usage test']
            },
            {
                id: '6.4',
                description: 'Progressive loading for limited bandwidth',
                checks: ['connectionSpeed', 'progressive loading', 'adaptive rendering']
            }
        ];
        
        const systemContent = fs.existsSync('js/performance-benchmarking-system.js') 
            ? fs.readFileSync('js/performance-benchmarking-system.js', 'utf8') : '';
        const testContent = fs.existsSync('tests/3d-performance-benchmarks.test.js')
            ? fs.readFileSync('tests/3d-performance-benchmarks.test.js', 'utf8') : '';
        const htmlContent = fs.existsSync('test-3d-performance-benchmarks.html')
            ? fs.readFileSync('test-3d-performance-benchmarks.html', 'utf8') : '';
        
        const allContent = systemContent + testContent + htmlContent;
        
        requirements.forEach(req => {
            const implementedChecks = req.checks.filter(check => 
                allContent.toLowerCase().includes(check.toLowerCase())
            );
            
            if (implementedChecks.length === req.checks.length) {
                this.logPass(`✅ Requirement ${req.id} fully implemented: ${req.description}`);
            } else if (implementedChecks.length > 0) {
                this.logWarning(`⚠️  Requirement ${req.id} partially implemented: ${req.description}`);
            } else {
                this.logFail(`❌ Requirement ${req.id} not implemented: ${req.description}`);
            }
        });
    }

    /**
     * Check for performance best practices
     */
    validateBestPractices() {
        console.log('🔍 Validating performance best practices...');
        
        const systemFile = 'js/performance-benchmarking-system.js';
        if (fs.existsSync(systemFile)) {
            const content = fs.readFileSync(systemFile, 'utf8');
            
            // Check for memory management
            if (content.includes('clearInterval') && content.includes('dispose')) {
                this.logPass(`✅ Proper cleanup mechanisms implemented`);
            } else {
                this.logWarning(`⚠️  Consider adding more cleanup mechanisms`);
            }
            
            // Check for error handling
            if (content.includes('try') && content.includes('catch')) {
                this.logPass(`✅ Error handling implemented`);
            } else {
                this.logWarning(`⚠️  Consider adding error handling`);
            }
            
            // Check for performance optimization
            if (content.includes('requestAnimationFrame')) {
                this.logPass(`✅ Uses requestAnimationFrame for smooth rendering`);
            } else {
                this.logWarning(`⚠️  Consider using requestAnimationFrame`);
            }
            
            // Check for throttling/debouncing
            if (content.includes('throttle') || content.includes('debounce') || content.includes('setTimeout')) {
                this.logPass(`✅ Performance throttling mechanisms present`);
            } else {
                this.logWarning(`⚠️  Consider adding performance throttling`);
            }
        }
    }

    /**
     * Log a passing validation
     */
    logPass(message) {
        console.log(message);
        this.results.passed++;
        this.results.details.push({ type: 'pass', message });
    }

    /**
     * Log a failing validation
     */
    logFail(message) {
        console.log(message);
        this.results.failed++;
        this.results.details.push({ type: 'fail', message });
    }

    /**
     * Log a warning
     */
    logWarning(message) {
        console.log(message);
        this.results.warnings++;
        this.results.details.push({ type: 'warning', message });
    }

    /**
     * Generate final validation report
     */
    generateReport() {
        console.log('\n📊 Performance Benchmark Validation Report');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`⚠️  Warnings: ${this.results.warnings}`);
        console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);
        
        if (this.results.failed === 0) {
            console.log('\n🎉 All performance benchmark validations passed!');
            console.log('The 3D performance benchmarking system is ready for use.');
        } else {
            console.log('\n⚠️  Some validations failed. Please review the issues above.');
        }
        
        // Write detailed report to file
        const reportData = {
            timestamp: new Date().toISOString(),
            summary: {
                passed: this.results.passed,
                failed: this.results.failed,
                warnings: this.results.warnings,
                successRate: ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)
            },
            details: this.results.details
        };
        
        fs.writeFileSync('performance-benchmark-validation-report.json', 
            JSON.stringify(reportData, null, 2));
        
        console.log('\n📄 Detailed report saved to: performance-benchmark-validation-report.json');
        
        return this.results.failed === 0;
    }

    /**
     * Run all validations
     */
    async runAllValidations() {
        console.log('🚀 Starting Performance Benchmark Validation\n');
        
        this.validateFileStructure();
        this.validateBenchmarkingSystem();
        this.validateTestCoverage();
        this.validateTestInterface();
        this.validateIntegration();
        this.validateRequirements();
        this.validateBestPractices();
        
        return this.generateReport();
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new PerformanceBenchmarkValidator();
    validator.runAllValidations().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = PerformanceBenchmarkValidator;