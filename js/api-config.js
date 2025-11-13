/**
 * API Configuration and Environment Detection System
 * Provides centralized API endpoint management for production and development environments
 */

class APIConfig {
  constructor() {
    this.config = this.detectEnvironment();
    this.validateConfiguration();
  }

  /**
   * Detect current environment and set appropriate API endpoints
   * @returns {Object} Configuration object with API settings
   */
  detectEnvironment() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Development environment detection
    const isDevelopment = hostname === 'localhost' || 
                         hostname === '127.0.0.1' || 
                         hostname.startsWith('192.168.') ||
                         hostname.endsWith('.local');

    // Production Railway URL (update this with your actual Railway URL)
    const PRODUCTION_API_URL = 'https://chroma-bot-game-production.up.railway.app';
    
    // Development API URL
    const DEVELOPMENT_API_URL = 'http://127.0.0.1:3001';

    const config = {
      environment: isDevelopment ? 'development' : 'production',
      apiBaseUrl: isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL,
      hostname: hostname,
      protocol: protocol,
      isDevelopment: isDevelopment,
      isProduction: !isDevelopment,
      // Fallback URLs for error recovery
      fallbackUrls: [
        PRODUCTION_API_URL,
        'http://localhost:8001', // Alternative local port
        DEVELOPMENT_API_URL
      ]
    };

    console.log('🌐 Environment detected:', config);
    return config;
  }

  /**
   * Validate the current configuration
   */
  validateConfiguration() {
    if (!this.config.apiBaseUrl) {
      console.warn('⚠️ API Base URL not configured - chat features will be unavailable');
      // Don't throw error - allow frontend to work without backend
      return;
    }

    if (this.config.isProduction && this.config.apiBaseUrl.includes('localhost')) {
      console.warn('⚠️ Production environment detected but using localhost URL');
    }

    console.log('✅ API Configuration validated:', {
      environment: this.config.environment,
      apiBaseUrl: this.config.apiBaseUrl
    });
  }

  /**
   * Get the current API base URL
   * @returns {string} The API base URL
   */
  getApiBaseUrl() {
    return this.config.apiBaseUrl;
  }

  /**
   * Get the full API endpoint URL
   * @param {string} endpoint - The API endpoint path (e.g., '/api/chat')
   * @returns {string} The complete API URL
   */
  getApiUrl(endpoint) {
    // Ensure endpoint starts with /
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    return this.config.apiBaseUrl + endpoint;
  }

  /**
   * Get environment information
   * @returns {Object} Environment details
   */
  getEnvironmentInfo() {
    return {
      environment: this.config.environment,
      hostname: this.config.hostname,
      protocol: this.config.protocol,
      isDevelopment: this.config.isDevelopment,
      isProduction: this.config.isProduction,
      apiBaseUrl: this.config.apiBaseUrl
    };
  }

  /**
   * Test API connectivity
   * @returns {Promise<boolean>} True if API is reachable
   */
  async testConnectivity() {
    try {
      const response = await fetch(this.getApiUrl('/api/health'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ API connectivity test passed');
        return true;
      } else {
        console.warn('⚠️ API responded with status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ API connectivity test failed:', error);
      return false;
    }
  }

  /**
   * Try fallback URLs if primary fails
   * @returns {Promise<string|null>} Working API URL or null
   */
  async findWorkingApiUrl() {
    // First try the configured URL
    if (await this.testConnectivityForUrl(this.config.apiBaseUrl)) {
      return this.config.apiBaseUrl;
    }

    // Try fallback URLs
    for (const fallbackUrl of this.config.fallbackUrls) {
      if (fallbackUrl !== this.config.apiBaseUrl) {
        console.log('🔄 Trying fallback URL:', fallbackUrl);
        if (await this.testConnectivityForUrl(fallbackUrl)) {
          console.log('✅ Fallback URL working:', fallbackUrl);
          this.config.apiBaseUrl = fallbackUrl;
          return fallbackUrl;
        }
      }
    }

    console.error('❌ No working API URL found');
    return null;
  }

  /**
   * Test connectivity for a specific URL
   * @param {string} url - The URL to test
   * @returns {Promise<boolean>} True if URL is reachable
   */
  async testConnectivityForUrl(url) {
    try {
      const response = await fetch(`${url}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000 // 5 second timeout
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Create and export singleton instance
const apiConfig = new APIConfig();

// Make it globally available
window.APIConfig = apiConfig;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIConfig;
}