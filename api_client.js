// /api_client.js

// This is the single source of truth for your backend's location.
const API_BASE_URL = 'http://127.0.0.1:3001';

/**
 * A centralized helper for making all API calls to your Python backend.
 * @param {string} endpoint The endpoint to call (e.g., '/api/chat').
 * @param {object} body The data to send in the request.
 * @returns {Promise<any>} A promise that resolves with the JSON response.
 */
async function callApi(endpoint, body) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'API request failed');
    }
    return await response.json();
  } catch (error) {
    console.error(`Network error for ${endpoint}:`, error);
    throw error;
  }
}

// We create a global object so all other scripts can use our functions.
window.apiClient = {
  sendChatMessage: (message, character, sessionId) => {
    return callApi('/api/chat', { message, character, sessionId });
  }
};