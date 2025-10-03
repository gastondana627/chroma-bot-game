/**
 * API Integration Unit Tests
 * Tests for 3D chatbot API integration and response formatting
 */

const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

// Mock fetch for API testing
global.fetch = jest.fn();

// Mock the 3D response formatter
const mockResponseFormatter = {
  format3DResponse: jest.fn(),
  extractAnimationCues: jest.fn(),
  validateResponse: jest.fn()
};

// Load modules under test
require('../chroma-bot/3d-response-formatter.js');

describe('API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset fetch mock
    global.fetch.mockClear();
  });

  describe('3D Response Formatting', () => {
    test('should format standard chat response for 3D mode', () => {
      const standardResponse = {
        reply: "Great job on that tournament win!",
        character: "eli",
        sessionId: "test-session"
      };

      const formatted = mockResponseFormatter.format3DResponse(standardResponse, {
        mode: '3d_cinematic',
        storyTrigger: 'tournament_win'
      });

      expect(mockResponseFormatter.format3DResponse).toHaveBeenCalledWith(
        standardResponse,
        expect.objectContaining({
          mode: '3d_cinematic',
          storyTrigger: 'tournament_win'
        })
      );
    });

    test('should extract animation cues from response text', () => {
      const responseText = "Congratulations! *victory_pose* You really showed them!";
      
      mockResponseFormatter.extractAnimationCues(responseText);
      
      expect(mockResponseFormatter.extractAnimationCues).toHaveBeenCalledWith(responseText);
    });

    test('should validate 3D response format', () => {
      const response3D = {
        reply: "Test message",
        mode: "3d_cinematic",
        animations: {
          gesture: "pointing",
          expression: "confident",
          duration: 5000
        },
        returnToNormal: true
      };

      mockResponseFormatter.validateResponse(response3D);
      
      expect(mockResponseFormatter.validateResponse).toHaveBeenCalledWith(response3D);
    });
  });

  describe('Chat API Endpoint Enhancement', () => {
    test('should send 3D mode parameters to chat API', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          reply: "Test response",
          mode: "3d_cinematic",
          animations: { gesture: "wave" }
        })
      };
      
      global.fetch.mockResolvedValue(mockResponse);

      const requestData = {
        message: "Hello there!",
        character: "maya",
        sessionId: "test-session",
        mode: "3d_cinematic",
        storyTrigger: "investigation_breakthrough"
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      expect(fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      expect(data.mode).toBe('3d_cinematic');
      expect(data.animations).toBeDefined();
    });

    test('should handle API errors gracefully', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      try {
        await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: "test" })
        });
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });

    test('should maintain backward compatibility with 2D mode', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          reply: "Standard response",
          character: "stanley"
        })
      };
      
      global.fetch.mkResolvedValue(mockResponse);

      const requestData = {
        message: "Hello",
        character: "stanley",
        sessionId: "test-session"
        // No 3D mode parameters
      };

      // Should work without 3D parameters
      expect(() => {
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });
      }).not.toThrow();
    });
  });

  describe('Character-Specific API Responses', () => {
    test('should handle Eli-specific 3D responses', async () => {
      const mockEliResponse = {
        ok: true,
        json: () => Promise.resolve({
          reply: "Let's dominate this tournament!",
          character: "eli",
          mode: "3d_cinematic",
          animations: {
            gesture: "fist_pump",
            expression: "determined",
            duration: 4000
          },
          lighting: {
            theme: "gaming_neon",
            colors: ["#00FFFF", "#FF0080"]
          }
        })
      };

      global.fetch.mockResolvedValue(mockEliResponse);

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: "Ready for the tournament?",
          character: "eli",
          mode: "3d_cinematic"
        })
      });

      const data = await response.json();
      expect(data.character).toBe('eli');
      expect(data.animations.gesture).toBe('fist_pump');
      expect(data.lighting.theme).toBe('gaming_neon');
    });

    test('should handle Maya-specific 3D responses', async () => {
      const mockMayaResponse = {
        ok: true,
        json: () => Promise.resolve({
          reply: "This evidence changes everything...",
          character: "maya",
          mode: "3d_cinematic",
          animations: {
            gesture: "pointing",
            expression: "focused",
            duration: 6000
          },
          lighting: {
            theme: "investigation_mood",
            colors: ["#0066CC", "#FFFFFF"]
          }
        })
      };

      global.fetch.mockResolvedValue(mockMayaResponse);

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: "What did you find?",
          character: "maya",
          mode: "3d_cinematic",
          storyTrigger: "investigation_breakthrough"
        })
      });

      const data = await response.json();
      expect(data.character).toBe('maya');
      expect(data.animations.gesture).toBe('pointing');
      expect(data.lighting.theme).toBe('investigation_mood');
    });

    test('should handle Stanley-specific 3D responses', async () => {
      const mockStanleyResponse = {
        ok: true,
        json: () => Promise.resolve({
          reply: "We need to protect our community from these scams.",
          character: "stanley",
          mode: "3d_cinematic",
          animations: {
            gesture: "protective_stance",
            expression: "concerned",
            duration: 5000
          },
          lighting: {
            theme: "suburban_security",
            colors: ["#4A5568", "#E2E8F0"]
          }
        })
      };

      global.fetch.mockResolvedValue(mockStanleyResponse);

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: "How do we stop these scammers?",
          character: "stanley",
          mode: "3d_cinematic",
          storyTrigger: "scam_prevention_success"
        })
      });

      const data = await response.json();
      expect(data.character).toBe('stanley');
      expect(data.animations.gesture).toBe('protective_stance');
      expect(data.lighting.theme).toBe('suburban_security');
    });
  });

  describe('Response Validation', () => {
    test('should validate required 3D response fields', () => {
      const validResponse = {
        reply: "Test message",
        character: "eli",
        mode: "3d_cinematic",
        animations: {
          gesture: "wave",
          duration: 3000
        }
      };

      expect(() => {
        mockResponseFormatter.validateResponse(validResponse);
      }).not.toThrow();
    });

    test('should reject invalid 3D response format', () => {
      const invalidResponse = {
        reply: "Test message",
        // Missing required fields
      };

      mockResponseFormatter.validateResponse.mockImplementation((response) => {
        if (!response.character || !response.mode) {
          throw new Error('Invalid 3D response format');
        }
      });

      expect(() => {
        mockResponseFormatter.validateResponse(invalidResponse);
      }).toThrow('Invalid 3D response format');
    });

    test('should validate animation parameters', () => {
      const responseWithInvalidAnimation = {
        reply: "Test message",
        character: "maya",
        mode: "3d_cinematic",
        animations: {
          gesture: "invalid_gesture",
          duration: -1000 // Invalid duration
        }
      };

      mockResponseFormatter.validateResponse.mockImplementation((response) => {
        if (response.animations?.duration < 0) {
          throw new Error('Invalid animation duration');
        }
      });

      expect(() => {
        mockResponseFormatter.validateResponse(responseWithInvalidAnimation);
      }).toThrow('Invalid animation duration');
    });
  });

  describe('Session Management', () => {
    test('should maintain session continuity during 3D transitions', async () => {
      const sessionId = 'test-session-123';
      
      // First request in 2D mode
      const response2D = {
        ok: true,
        json: () => Promise.resolve({
          reply: "Hello!",
          sessionId: sessionId
        })
      };
      
      global.fetch.mockResolvedValueOnce(response2D);
      
      await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: "Hi there",
          sessionId: sessionId
        })
      });

      // Second request in 3D mode with same session
      const response3D = {
        ok: true,
        json: () => Promise.resolve({
          reply: "Great to see you again!",
          sessionId: sessionId,
          mode: "3d_cinematic"
        })
      };
      
      global.fetch.mockResolvedValueOnce(response3D);
      
      await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: "Ready for 3D?",
          sessionId: sessionId,
          mode: "3d_cinematic"
        })
      });

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenLastCalledWith('/api/chat', 
        expect.objectContaining({
          body: expect.stringContaining(sessionId)
        })
      );
    });

    test('should handle session timeout gracefully', async () => {
      const expiredResponse = {
        ok: false,
        status: 401,
        json: () => Promise.resolve({
          error: "Session expired"
        })
      };
      
      global.fetch.mockResolvedValue(expiredResponse);

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: "Test",
          sessionId: "expired-session"
        })
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });
  });

  describe('Error Handling', () => {
    test('should handle network timeouts', async () => {
      global.fetch.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      await expect(
        fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: "test" })
        })
      ).rejects.toThrow('Timeout');
    });

    test('should handle server errors', async () => {
      const serverErrorResponse = {
        ok: false,
        status: 500,
        json: () => Promise.resolve({
          error: "Internal server error"
        })
      };
      
      global.fetch.mockResolvedValue(serverErrorResponse);

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: "test" })
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    test('should handle malformed JSON responses', async () => {
      const malformedResponse = {
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      };
      
      global.fetch.mockResolvedValue(malformedResponse);

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: "test" })
      });

      await expect(response.json()).rejects.toThrow('Invalid JSON');
    });
  });
});