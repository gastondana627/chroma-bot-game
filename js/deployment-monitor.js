/**
 * Deployment Monitoring System
 * Monitors health and performance of both frontend and backend deployments
 */

class DeploymentMonitor {
  constructor() {
    this.config = {
      // Monitoring intervals - DISABLED FOR PRODUCTION
      healthCheckInterval: 300000, // 5 minutes (reduced frequency)
      performanceCheckInterval: 600000, // 10 minutes
      uptimeCheckInterval: 300000, // 5 minutes (reduced frequency)
      
      // Thresholds
      responseTimeThreshold: 5000, // 5 seconds
      errorRateThreshold: 0.1, // 10%
      uptimeThreshold: 0.95, // 95%
      
      // Endpoints to monitor
      endpoints: {
        health: '/api/health',
        characters: '/api/characters',
        chat: '/api/chat'
      },
      
      // Alert settings - DISABLED FOR PRODUCTION
      alertsEnabled: false, // Disabled to prevent spam
      maxAlerts: 5, // Max alerts per hour
      alertCooldown: 300000 // 5 minutes between same alert types
    };
    
    this.metrics = {
      uptime: {
        total: 0,
        successful: 0,
        failed: 0,
        percentage: 100
      },
      performance: {
        averageResponseTime: 0,
        responseTimes: [],
        slowRequests: 0
      },
      errors: {
        total: 0,
        rate: 0,
        lastError: null,
        errorTypes: {}
      },
      alerts: {
        sent: 0,
        lastAlert: null,
        recentAlerts: []
      }
    };
    
    this.isMonitoring = false;
    this.intervals = {};
    this.lastAlerts = new Map();
    
    this.initializeUI();
  }

  /**
   * Start monitoring all systems
   */
  startMonitoring() {
    if (this.isMonitoring) {
      console.log('📊 Monitoring already active');
      return;
    }

    console.log('🚀 Starting deployment monitoring (smart mode)...');
    this.isMonitoring = true;

    // Smart monitoring: Only check health periodically, not constantly
    // Start health checks (reduced frequency for production)
    this.intervals.health = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);

    // Performance monitoring disabled by default (enable with ?debug=true)
    if (window.location.search.includes('debug=true')) {
      this.intervals.performance = setInterval(() => {
        this.performPerformanceCheck();
      }, this.config.performanceCheckInterval);

      this.intervals.uptime = setInterval(() => {
        this.performUptimeCheck();
      }, this.config.uptimeCheckInterval);
      
      console.log('✅ Full monitoring enabled (debug mode)');
    } else {
      console.log('ℹ️ Smart monitoring active (health checks only)');
    }

    // Initial health check only
    this.performHealthCheck();

    this.updateUI();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    console.log('⏹️ Stopping deployment monitoring...');
    this.isMonitoring = false;

    // Clear all intervals
    Object.values(this.intervals).forEach(interval => {
      clearInterval(interval);
    });
    this.intervals = {};

    this.updateUI();
    console.log('✅ Deployment monitoring stopped');
  }

  /**
   * Perform health check on backend
   */
  async performHealthCheck() {
    const startTime = Date.now();
    
    try {
      const response = await this.makeMonitoringRequest('/api/health');
      const responseTime = Date.now() - startTime;
      
      // Update metrics
      this.updatePerformanceMetrics(responseTime);
      this.updateUptimeMetrics(true);
      
      // Check response data
      const healthData = await response.json();
      
      // Analyze health status
      if (healthData.status !== 'healthy') {
        this.handleHealthIssue(healthData);
      }
      
      // Check for performance issues
      if (responseTime > this.config.responseTimeThreshold) {
        this.handlePerformanceIssue(responseTime);
      }
      
      console.log(`✅ Health check passed (${responseTime}ms) - Status: ${healthData.status}`);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateUptimeMetrics(false);
      this.handleHealthCheckError(error, responseTime);
    }
  }

  /**
   * Perform performance check
   */
  async performPerformanceCheck() {
    const checks = [
      { name: 'Characters API', endpoint: '/api/characters' },
      { name: 'Chat API', endpoint: '/api/chat', method: 'POST', body: { 
        message: 'monitoring test', 
        character: 'maya', 
        sessionId: 'monitor_session' 
      }}
    ];

    for (const check of checks) {
      try {
        const startTime = Date.now();
        const response = await this.makeMonitoringRequest(
          check.endpoint, 
          check.method || 'GET',
          check.body
        );
        const responseTime = Date.now() - startTime;
        
        this.updatePerformanceMetrics(responseTime);
        
        console.log(`✅ ${check.name} performance check: ${responseTime}ms`);
        
      } catch (error) {
        console.warn(`⚠️ ${check.name} performance check failed:`, error.message);
        this.handlePerformanceError(check.name, error);
      }
    }
  }

  /**
   * Perform uptime check
   */
  async performUptimeCheck() {
    try {
      const response = await this.makeMonitoringRequest('/api/health', 'GET', null, 5000);
      this.updateUptimeMetrics(true);
    } catch (error) {
      this.updateUptimeMetrics(false);
    }
  }

  /**
   * Make monitoring request with timeout
   */
  async makeMonitoringRequest(endpoint, method = 'GET', body = null, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const apiUrl = window.APIConfig ? 
        window.APIConfig.getApiUrl(endpoint) : 
        this.getFallbackUrl(endpoint);

      const options = {
        method,
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(apiUrl, options);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics(responseTime) {
    this.metrics.performance.responseTimes.push({
      time: responseTime,
      timestamp: Date.now()
    });

    // Keep only last 100 measurements
    if (this.metrics.performance.responseTimes.length > 100) {
      this.metrics.performance.responseTimes.shift();
    }

    // Calculate average
    const times = this.metrics.performance.responseTimes.map(r => r.time);
    this.metrics.performance.averageResponseTime = 
      times.reduce((a, b) => a + b, 0) / times.length;

    // Count slow requests
    if (responseTime > this.config.responseTimeThreshold) {
      this.metrics.performance.slowRequests++;
    }
  }

  /**
   * Update uptime metrics
   */
  updateUptimeMetrics(success) {
    this.metrics.uptime.total++;
    
    if (success) {
      this.metrics.uptime.successful++;
    } else {
      this.metrics.uptime.failed++;
    }

    this.metrics.uptime.percentage = 
      (this.metrics.uptime.successful / this.metrics.uptime.total) * 100;
  }

  /**
   * Handle health issues
   */
  handleHealthIssue(healthData) {
    const issue = {
      type: 'health_degraded',
      status: healthData.status,
      timestamp: Date.now(),
      details: healthData
    };

    console.warn('⚠️ Health issue detected:', issue);
    this.sendAlert('Health Degraded', `Backend status: ${healthData.status}`, issue);
  }

  /**
   * Handle performance issues
   */
  handlePerformanceIssue(responseTime) {
    const issue = {
      type: 'slow_response',
      responseTime,
      threshold: this.config.responseTimeThreshold,
      timestamp: Date.now()
    };

    console.warn('⚠️ Performance issue detected:', issue);
    this.sendAlert(
      'Slow Response', 
      `Response time: ${responseTime}ms (threshold: ${this.config.responseTimeThreshold}ms)`,
      issue
    );
  }

  /**
   * Handle health check errors
   */
  handleHealthCheckError(error, responseTime) {
    this.metrics.errors.total++;
    this.metrics.errors.lastError = {
      message: error.message,
      timestamp: Date.now(),
      responseTime
    };

    // Update error rate
    this.metrics.errors.rate = this.metrics.errors.total / this.metrics.uptime.total;

    // Track error types
    const errorType = error.name || 'Unknown';
    this.metrics.errors.errorTypes[errorType] = 
      (this.metrics.errors.errorTypes[errorType] || 0) + 1;

    console.error('❌ Health check failed:', error.message);
    this.sendAlert('Health Check Failed', error.message, { error: error.message, responseTime });
  }

  /**
   * Handle performance errors
   */
  handlePerformanceError(checkName, error) {
    console.warn(`⚠️ Performance check failed for ${checkName}:`, error.message);
    this.sendAlert(
      'Performance Check Failed', 
      `${checkName}: ${error.message}`,
      { checkName, error: error.message }
    );
  }

  /**
   * Send alert with cooldown logic
   */
  sendAlert(title, message, details = {}) {
    if (!this.config.alertsEnabled) return;

    const alertKey = `${title}:${message}`;
    const now = Date.now();
    const lastAlert = this.lastAlerts.get(alertKey);

    // Check cooldown
    if (lastAlert && (now - lastAlert) < this.config.alertCooldown) {
      return; // Still in cooldown
    }

    // Check max alerts per hour
    const oneHourAgo = now - 3600000;
    const recentAlerts = this.metrics.alerts.recentAlerts.filter(
      alert => alert.timestamp > oneHourAgo
    );

    if (recentAlerts.length >= this.config.maxAlerts) {
      console.warn('⚠️ Alert rate limit reached, suppressing alert');
      return;
    }

    // Send alert
    this.displayAlert(title, message, details);
    
    // Update tracking
    this.lastAlerts.set(alertKey, now);
    this.metrics.alerts.sent++;
    this.metrics.alerts.lastAlert = { title, message, timestamp: now };
    this.metrics.alerts.recentAlerts.push({ title, message, timestamp: now, details });

    // Clean up old alerts
    this.metrics.alerts.recentAlerts = this.metrics.alerts.recentAlerts.filter(
      alert => alert.timestamp > oneHourAgo
    );
  }

  /**
   * Display alert to user
   */
  displayAlert(title, message, details) {
    console.warn(`🚨 ALERT: ${title} - ${message}`);
    
    // Use ErrorHandler notification system if available
    if (window.ErrorHandler) {
      window.ErrorHandler.showNotification(`🚨 ${title}: ${message}`, 'warning');
    }

    // Also log to monitoring UI
    this.logToMonitoringUI('alert', { title, message, details, timestamp: Date.now() });
  }

  /**
   * Initialize monitoring UI
   */
  initializeUI() {
    // Create monitoring panel if it doesn't exist
    if (!document.getElementById('deployment-monitor')) {
      const panel = document.createElement('div');
      panel.id = 'deployment-monitor';
      panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 300px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 9999;
        border: 1px solid #333;
        display: none;
      `;
      
      panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <strong>🔍 Deployment Monitor</strong>
          <button id="monitor-toggle" style="background: #333; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer;">Hide</button>
        </div>
        <div id="monitor-status">Initializing...</div>
        <div id="monitor-metrics" style="margin-top: 10px; font-size: 11px;"></div>
        <div id="monitor-log" style="margin-top: 10px; max-height: 150px; overflow-y: auto; font-size: 10px;"></div>
      `;
      
      document.body.appendChild(panel);
      
      // Add toggle functionality
      document.getElementById('monitor-toggle').addEventListener('click', () => {
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        document.getElementById('monitor-toggle').textContent = isVisible ? 'Show' : 'Hide';
      });
    }
  }

  /**
   * Update monitoring UI
   */
  updateUI() {
    const statusEl = document.getElementById('monitor-status');
    const metricsEl = document.getElementById('monitor-metrics');
    
    if (!statusEl || !metricsEl) return;

    // Update status
    const status = this.isMonitoring ? '🟢 Active' : '🔴 Stopped';
    statusEl.textContent = `Status: ${status}`;

    // Update metrics
    const uptime = this.metrics.uptime.percentage.toFixed(1);
    const avgResponse = Math.round(this.metrics.performance.averageResponseTime);
    const errorRate = (this.metrics.errors.rate * 100).toFixed(1);
    
    metricsEl.innerHTML = `
      <div>Uptime: ${uptime}% (${this.metrics.uptime.successful}/${this.metrics.uptime.total})</div>
      <div>Avg Response: ${avgResponse}ms</div>
      <div>Error Rate: ${errorRate}%</div>
      <div>Alerts Sent: ${this.metrics.alerts.sent}</div>
    `;
  }

  /**
   * Log message to monitoring UI
   */
  logToMonitoringUI(level, data) {
    const logEl = document.getElementById('monitor-log');
    if (!logEl) return;

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.style.color = this.getLogColor(level);
    logEntry.textContent = `${timestamp} [${level.toUpperCase()}] ${JSON.stringify(data)}`;
    
    logEl.appendChild(logEntry);
    
    // Keep only last 50 log entries
    while (logEl.children.length > 50) {
      logEl.removeChild(logEl.firstChild);
    }
    
    logEl.scrollTop = logEl.scrollHeight;
  }

  /**
   * Get log color based on level
   */
  getLogColor(level) {
    const colors = {
      info: '#00FFFF',
      warn: '#FFA500',
      error: '#FF4444',
      alert: '#FF0080'
    };
    return colors[level] || '#FFFFFF';
  }

  /**
   * Get fallback URL
   */
  getFallbackUrl(endpoint) {
    const API_BASE = window.location.hostname === "localhost"
      ? "http://127.0.0.1:3001"
      : "https://data-bleed-backend.up.railway.app";
    return API_BASE + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
  }

  /**
   * Get monitoring statistics
   */
  getStats() {
    return {
      ...this.metrics,
      isMonitoring: this.isMonitoring,
      config: this.config
    };
  }

  /**
   * Show monitoring panel
   */
  showPanel() {
    const panel = document.getElementById('deployment-monitor');
    if (panel) {
      panel.style.display = 'block';
      this.updateUI();
    }
  }

  /**
   * Hide monitoring panel
   */
  hidePanel() {
    const panel = document.getElementById('deployment-monitor');
    if (panel) {
      panel.style.display = 'none';
    }
  }
}

// Create and export singleton instance
const deploymentMonitor = new DeploymentMonitor();

// Make it globally available
window.DeploymentMonitor = deploymentMonitor;

// Auto-start monitoring in production
if (window.location.hostname !== 'localhost') {
  // Start monitoring after a short delay to let other systems initialize
  setTimeout(() => {
    deploymentMonitor.startMonitoring();
  }, 5000);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeploymentMonitor;
}

console.log('✅ Deployment Monitor initialized');