/**
 * Comprehensive Error Handling System for Production Deployment
 * Provides network error detection, timeout handling, and fallback behavior
 */

class ErrorHandler {
  constructor() {
    this.config = {
      // Request timeout in milliseconds
      requestTimeout: 10000, // 10 seconds
      // Retry configuration
      maxRetries: 3,
      retryDelay: 1000, // 1 second base delay
      // Fallback behavior settings
      fallbackEnabled: true,
      // User notification settings
      showUserNotifications: true,
      notificationDuration: 5000 // 5 seconds
    };
    
    this.errorCounts = new Map();
    this.lastErrorTime = new Map();
    this.isOffline = false;
    
    this.initializeOfflineDetection();
    this.initializeErrorUI();
  }

  /**
   * Initialize offline/online detection
   */
  initializeOfflineDetection() {
    window.addEventListener('online', () => {
      this.isOffline = false;
      this.showNotification('🟢 Connection restored', 'success');
      console.log('✅ Network connection restored');
    });

    window.addEventListener('offline', () => {
      this.isOffline = true;
      this.showNotification('🔴 Connection lost - working offline', 'error');
      console.log('❌ Network connection lost');
    });

    // Initial check
    this.isOffline = !navigator.onLine;
  }

  /**
   * Initialize error notification UI
   */
  initializeErrorUI() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('error-notifications')) {
      // Wait for DOM to be ready before appending
      const createContainer = () => {
        if (!document.body) {
          setTimeout(createContainer, 50);
          return;
        }
        
        const container = document.createElement('div');
        container.id = 'error-notifications';
        container.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          max-width: 400px;
          pointer-events: none;
        `;
        document.body.appendChild(container);
      };
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createContainer);
      } else {
        createContainer();
      }
    }
  }

  /**
   * Enhanced fetch with comprehensive error handling
   * @param {string} url - The URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>} Enhanced fetch response
   */
  async enhancedFetch(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.requestTimeout);

    // Add abort signal to options
    const enhancedOptions = {
      ...options,
      signal: controller.signal
    };

    try {
      // Check if offline
      if (this.isOffline) {
        throw new NetworkError('Device is offline', 'OFFLINE');
      }

      const response = await fetch(url, enhancedOptions);
      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        throw new HTTPError(`HTTP ${response.status}: ${response.statusText}`, response.status, response);
      }

      // Reset error count on success
      this.errorCounts.delete(url);
      return response;

    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle different error types
      if (error.name === 'AbortError') {
        throw new TimeoutError('Request timed out', this.config.requestTimeout);
      }
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new NetworkError('Network connection failed', 'FETCH_FAILED');
      }

      // Re-throw custom errors
      if (error instanceof APIError) {
        throw error;
      }

      // Wrap unknown errors
      throw new APIError(`Request failed: ${error.message}`, 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Make API request with retry logic and fallback handling
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} API response data
   */
  async makeAPIRequest(endpoint, options = {}) {
    const url = window.APIConfig ? window.APIConfig.getApiUrl(endpoint) : this.getFallbackUrl(endpoint);
    let lastError;

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        console.log(`🔄 API Request attempt ${attempt}/${this.config.maxRetries}: ${endpoint}`);
        
        const response = await this.enhancedFetch(url, options);
        const data = await response.json();
        
        console.log(`✅ API Request successful: ${endpoint}`);
        return data;

      } catch (error) {
        lastError = error;
        console.warn(`⚠️ API Request attempt ${attempt} failed:`, error.message);

        // Don't retry on certain errors
        if (error instanceof HTTPError && error.status >= 400 && error.status < 500) {
          break; // Client errors shouldn't be retried
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.config.maxRetries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await this.sleep(delay);
        }
      }
    }

    // All retries failed, try fallback
    if (this.config.fallbackEnabled) {
      try {
        const fallbackResult = await this.tryFallbackUrls(endpoint, options);
        if (fallbackResult) {
          return fallbackResult;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
    }

    // Handle final failure
    this.handleAPIFailure(endpoint, lastError);
    throw lastError;
  }

  /**
   * Try fallback URLs when primary API fails
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} API response data or null
   */
  async tryFallbackUrls(endpoint, options) {
    if (!window.APIConfig || !window.APIConfig.findWorkingApiUrl) {
      return null;
    }

    console.log('🔄 Attempting to find working API URL...');
    const workingUrl = await window.APIConfig.findWorkingApiUrl();
    
    if (workingUrl) {
      console.log('✅ Found working API URL:', workingUrl);
      this.showNotification('🔄 Reconnected to backup server', 'info');
      
      try {
        const fullUrl = workingUrl + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
        const response = await this.enhancedFetch(fullUrl, options);
        return await response.json();
      } catch (error) {
        console.error('❌ Fallback URL also failed:', error);
        return null;
      }
    }

    return null;
  }

  /**
   * Handle API failure with user feedback
   * @param {string} endpoint - Failed endpoint
   * @param {Error} error - The error that occurred
   */
  handleAPIFailure(endpoint, error) {
    // Track error frequency
    const errorKey = `${endpoint}:${error.constructor.name}`;
    const count = (this.errorCounts.get(errorKey) || 0) + 1;
    this.errorCounts.set(errorKey, count);
    this.lastErrorTime.set(errorKey, Date.now());

    // Determine user message based on error type
    let userMessage = '❌ Service temporarily unavailable';
    let messageType = 'error';

    if (error instanceof NetworkError) {
      if (error.code === 'OFFLINE') {
        userMessage = '📱 You appear to be offline';
      } else {
        userMessage = '🌐 Network connection problem';
      }
    } else if (error instanceof TimeoutError) {
      userMessage = '⏱️ Request timed out - server may be busy';
    } else if (error instanceof HTTPError) {
      if (error.status >= 500) {
        userMessage = '🔧 Server error - please try again later';
      } else if (error.status === 429) {
        userMessage = '⏳ Too many requests - please wait a moment';
      } else {
        userMessage = `❌ Request failed (${error.status})`;
      }
    }

    // Show notification to user
    this.showNotification(userMessage, messageType);

    // Log detailed error for debugging
    console.error(`❌ API Failure [${endpoint}]:`, {
      error: error.message,
      type: error.constructor.name,
      count: count,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Show user notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, warning, info)
   */
  showNotification(message, type = 'info') {
    if (!this.config.showUserNotifications) return;

    const container = document.getElementById('error-notifications');
    if (!container) return;

    const notification = document.createElement('div');
    notification.style.cssText = `
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      pointer-events: auto;
      cursor: pointer;
      transition: opacity 0.3s ease;
    `;
    notification.textContent = message;

    // Add click to dismiss
    notification.addEventListener('click', () => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    });

    container.appendChild(notification);

    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
      }
    }, this.config.notificationDuration);
  }

  /**
   * Get notification color based on type
   * @param {string} type - Notification type
   * @returns {string} CSS color
   */
  getNotificationColor(type) {
    const colors = {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6'
    };
    return colors[type] || colors.info;
  }

  /**
   * Get fallback URL for endpoint
   * @param {string} endpoint - API endpoint
   * @returns {string} Fallback URL
   */
  getFallbackUrl(endpoint) {
    const API_BASE = window.location.hostname === "localhost"
      ? "http://127.0.0.1:3001"
      : "https://data-bleed-backend.up.railway.app";
    return API_BASE + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
  }

  /**
   * Sleep utility for delays
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  getErrorStats() {
    const stats = {};
    for (const [key, count] of this.errorCounts.entries()) {
      const lastTime = this.lastErrorTime.get(key);
      stats[key] = {
        count,
        lastOccurred: new Date(lastTime).toISOString(),
        timeSinceLastError: Date.now() - lastTime
      };
    }
    return stats;
  }

  /**
   * Clear error statistics
   */
  clearErrorStats() {
    this.errorCounts.clear();
    this.lastErrorTime.clear();
  }
}

/**
 * Custom Error Classes
 */
class APIError extends Error {
  constructor(message, code, originalError = null) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.originalError = originalError;
  }
}

class NetworkError extends APIError {
  constructor(message, code) {
    super(message, code);
    this.name = 'NetworkError';
  }
}

class TimeoutError extends APIError {
  constructor(message, timeout) {
    super(message, 'TIMEOUT');
    this.name = 'TimeoutError';
    this.timeout = timeout;
  }
}

class HTTPError extends APIError {
  constructor(message, status, response = null) {
    super(message, `HTTP_${status}`);
    this.name = 'HTTPError';
    this.status = status;
    this.response = response;
  }
}

// Create and export singleton instance
const errorHandler = new ErrorHandler();

// Make it globally available
window.ErrorHandler = errorHandler;
window.APIError = APIError;
window.NetworkError = NetworkError;
window.TimeoutError = TimeoutError;
window.HTTPError = HTTPError;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ErrorHandler,
    APIError,
    NetworkError,
    TimeoutError,
    HTTPError
  };
}

console.log('✅ Error Handler initialized');