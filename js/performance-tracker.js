/**
 * Performance Metrics Tracking System
 * Tracks and reports performance metrics for production monitoring
 */

class PerformanceTracker {
  constructor() {
    this.metrics = {
      pageLoad: {
        startTime: performance.now(),
        domContentLoaded: null,
        fullyLoaded: null,
        firstPaint: null,
        firstContentfulPaint: null
      },
      apiCalls: {
        total: 0,
        successful: 0,
        failed: 0,
        averageResponseTime: 0,
        responseTimes: [],
        slowCalls: 0
      },
      userInteractions: {
        clicks: 0,
        keystrokes: 0,
        scrolls: 0,
        chatMessages: 0
      },
      errors: {
        javascript: 0,
        network: 0,
        api: 0,
        lastError: null
      },
      resources: {
        memoryUsage: null,
        connectionType: null,
        deviceType: null
      }
    };

    this.thresholds = {
      slowApiCall: 3000, // 3 seconds
      slowPageLoad: 5000, // 5 seconds
      highMemoryUsage: 100 * 1024 * 1024 // 100MB
    };

    this.reportingInterval = 300000; // 5 minutes
    this.isTracking = false;

    this.initializeTracking();
  }

  /**
   * Initialize performance tracking
   */
  initializeTracking() {
    // Track page load performance
    this.trackPageLoadMetrics();
    
    // Track user interactions
    this.trackUserInteractions();
    
    // Track JavaScript errors
    this.trackJavaScriptErrors();
    
    // Track resource usage
    this.trackResourceUsage();
    
    // Start periodic reporting
    this.startPeriodicReporting();
    
    this.isTracking = true;
    console.log('📊 Performance tracking initialized');
  }

  /**
   * Track page load metrics
   */
  trackPageLoadMetrics() {
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.metrics.pageLoad.domContentLoaded = performance.now() - this.metrics.pageLoad.startTime;
      });
    } else {
      this.metrics.pageLoad.domContentLoaded = performance.now() - this.metrics.pageLoad.startTime;
    }

    window.addEventListener('load', () => {
      this.metrics.pageLoad.fullyLoaded = performance.now() - this.metrics.pageLoad.startTime;
      this.checkPageLoadPerformance();
    });

    // Track paint metrics if available
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-paint') {
              this.metrics.pageLoad.firstPaint = entry.startTime;
            } else if (entry.name === 'first-contentful-paint') {
              this.metrics.pageLoad.firstContentfulPaint = entry.startTime;
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('Paint timing not supported:', e);
      }
    }
  }

  /**
   * Track user interactions
   */
  trackUserInteractions() {
    // Track clicks
    document.addEventListener('click', () => {
      this.metrics.userInteractions.clicks++;
    });

    // Track keystrokes
    document.addEventListener('keydown', () => {
      this.metrics.userInteractions.keystrokes++;
    });

    // Track scrolls
    let scrollTimeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.metrics.userInteractions.scrolls++;
      }, 100);
    });
  }

  /**
   * Track JavaScript errors
   */
  trackJavaScriptErrors() {
    window.addEventListener('error', (event) => {
      this.metrics.errors.javascript++;
      this.metrics.errors.lastError = {
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now()
      };
      
      console.error('JavaScript error tracked:', this.metrics.errors.lastError);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.errors.javascript++;
      this.metrics.errors.lastError = {
        type: 'unhandled_promise',
        message: event.reason?.message || String(event.reason),
        timestamp: Date.now()
      };
      
      console.error('Unhandled promise rejection tracked:', this.metrics.errors.lastError);
    });
  }

  /**
   * Track resource usage
   */
  trackResourceUsage() {
    // Track memory usage if available
    if ('memory' in performance) {
      setInterval(() => {
        this.metrics.resources.memoryUsage = {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
          timestamp: Date.now()
        };
        
        // Check for high memory usage
        if (performance.memory.usedJSHeapSize > this.thresholds.highMemoryUsage) {
          this.reportPerformanceIssue('high_memory_usage', {
            used: performance.memory.usedJSHeapSize,
            limit: this.thresholds.highMemoryUsage
          });
        }
      }, 30000); // Check every 30 seconds
    }

    // Track connection type if available
    if ('connection' in navigator) {
      this.metrics.resources.connectionType = {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      };
    }

    // Detect device type
    this.metrics.resources.deviceType = this.detectDeviceType();
  }

  /**
   * Track API call performance
   */
  trackApiCall(url, method, startTime, endTime, success, error = null) {
    const responseTime = endTime - startTime;
    
    this.metrics.apiCalls.total++;
    this.metrics.apiCalls.responseTimes.push({
      url,
      method,
      responseTime,
      success,
      timestamp: Date.now()
    });

    // Keep only last 100 API calls
    if (this.metrics.apiCalls.responseTimes.length > 100) {
      this.metrics.apiCalls.responseTimes.shift();
    }

    if (success) {
      this.metrics.apiCalls.successful++;
    } else {
      this.metrics.apiCalls.failed++;
      this.metrics.errors.api++;
      
      if (error) {
        this.metrics.errors.lastError = {
          type: 'api',
          url,
          method,
          message: error.message,
          timestamp: Date.now()
        };
      }
    }

    // Calculate average response time
    const times = this.metrics.apiCalls.responseTimes.map(call => call.responseTime);
    this.metrics.apiCalls.averageResponseTime = times.reduce((a, b) => a + b, 0) / times.length;

    // Check for slow API calls
    if (responseTime > this.thresholds.slowApiCall) {
      this.metrics.apiCalls.slowCalls++;
      this.reportPerformanceIssue('slow_api_call', {
        url,
        method,
        responseTime,
        threshold: this.thresholds.slowApiCall
      });
    }

    console.log(`📊 API call tracked: ${method} ${url} - ${responseTime}ms (${success ? 'success' : 'failed'})`);
  }

  /**
   * Track chat message
   */
  trackChatMessage() {
    this.metrics.userInteractions.chatMessages++;
  }

  /**
   * Check page load performance
   */
  checkPageLoadPerformance() {
    const loadTime = this.metrics.pageLoad.fullyLoaded;
    
    if (loadTime > this.thresholds.slowPageLoad) {
      this.reportPerformanceIssue('slow_page_load', {
        loadTime,
        threshold: this.thresholds.slowPageLoad
      });
    }
    
    console.log(`📊 Page load tracked: ${loadTime}ms`);
  }

  /**
   * Report performance issue
   */
  reportPerformanceIssue(type, details) {
    console.warn(`⚠️ Performance issue detected: ${type}`, details);
    
    // Send to monitoring system if available
    if (window.DeploymentMonitor) {
      window.DeploymentMonitor.sendAlert(
        'Performance Issue',
        `${type}: ${JSON.stringify(details)}`,
        { type, details, timestamp: Date.now() }
      );
    }
  }

  /**
   * Detect device type
   */
  detectDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  /**
   * Start periodic reporting
   */
  startPeriodicReporting() {
    setInterval(() => {
      this.generatePerformanceReport();
    }, this.reportingInterval);
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport() {
    const report = {
      timestamp: Date.now(),
      session: {
        duration: Date.now() - this.metrics.pageLoad.startTime,
        pageLoads: 1 // For SPA, this would be different
      },
      performance: {
        pageLoad: this.metrics.pageLoad,
        apiCalls: {
          total: this.metrics.apiCalls.total,
          successRate: this.metrics.apiCalls.total > 0 ? 
            (this.metrics.apiCalls.successful / this.metrics.apiCalls.total) * 100 : 0,
          averageResponseTime: this.metrics.apiCalls.averageResponseTime,
          slowCallsPercentage: this.metrics.apiCalls.total > 0 ?
            (this.metrics.apiCalls.slowCalls / this.metrics.apiCalls.total) * 100 : 0
        }
      },
      userActivity: this.metrics.userInteractions,
      errors: {
        total: this.metrics.errors.javascript + this.metrics.errors.network + this.metrics.errors.api,
        breakdown: {
          javascript: this.metrics.errors.javascript,
          network: this.metrics.errors.network,
          api: this.metrics.errors.api
        }
      },
      resources: this.metrics.resources
    };

    console.log('📊 Performance Report:', report);
    
    // Send to backend if monitoring endpoint exists
    this.sendPerformanceReport(report);
    
    return report;
  }

  /**
   * Send performance report to backend
   */
  async sendPerformanceReport(report) {
    try {
      // Only send in production to avoid development noise
      if (window.location.hostname === 'localhost') {
        return;
      }

      const apiUrl = window.APIConfig ? 
        window.APIConfig.getApiUrl('/api/performance') : 
        null;

      if (!apiUrl) {
        console.log('📊 No performance reporting endpoint configured');
        return;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });

      if (response.ok) {
        console.log('📊 Performance report sent successfully');
      } else {
        console.warn('📊 Failed to send performance report:', response.status);
      }

    } catch (error) {
      console.warn('📊 Error sending performance report:', error.message);
    }
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    // Reset counters but keep configuration
    this.metrics.apiCalls.total = 0;
    this.metrics.apiCalls.successful = 0;
    this.metrics.apiCalls.failed = 0;
    this.metrics.apiCalls.responseTimes = [];
    this.metrics.apiCalls.slowCalls = 0;
    
    this.metrics.userInteractions.clicks = 0;
    this.metrics.userInteractions.keystrokes = 0;
    this.metrics.userInteractions.scrolls = 0;
    this.metrics.userInteractions.chatMessages = 0;
    
    this.metrics.errors.javascript = 0;
    this.metrics.errors.network = 0;
    this.metrics.errors.api = 0;
    
    console.log('📊 Performance metrics reset');
  }
}

// Create and export singleton instance
const performanceTracker = new PerformanceTracker();

// Make it globally available
window.PerformanceTracker = performanceTracker;

// Monkey patch fetch to track API calls automatically
if (window.fetch) {
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const startTime = performance.now();
    const url = args[0];
    const options = args[1] || {};
    const method = options.method || 'GET';
    
    try {
      const response = await originalFetch.apply(this, args);
      const endTime = performance.now();
      
      // Only track API calls (not static resources)
      if (typeof url === 'string' && url.includes('/api/')) {
        performanceTracker.trackApiCall(url, method, startTime, endTime, response.ok);
      }
      
      return response;
    } catch (error) {
      const endTime = performance.now();
      
      if (typeof url === 'string' && url.includes('/api/')) {
        performanceTracker.trackApiCall(url, method, startTime, endTime, false, error);
      }
      
      throw error;
    }
  };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceTracker;
}

console.log('✅ Performance Tracker initialized');