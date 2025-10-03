/**
 * Character 3D System Unit Tests
 * Tests for the main orchestrator of the 3D character emergence system
 */

const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

// Mock the dependencies
global.Character3DRenderer = jest.fn();
global.CharacterEmergenceAnimator = jest.fn();
global.CharacterReturnAnimator = jest.fn();

// Load the module under test
require('../js/character-3d-system.js');

describe('Character3DSystem', () => {
  let character3DSystem;
  let mockSceneManager;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock scene manager
    mockSceneManager = testUtils.createMockSceneManager();
    
    // Create system instance
    character3DSystem = new Character3DSystem(mockSceneManager);
  });

  afterEach(() => {
    if (character3DSystem) {
      character3DSystem.cleanup();
    }
  });

  describe('Constructor', () => {
    test('should initialize with correct default state', () => {
      expect(character3DSystem.sceneManager).toBe(mockSceneManager);
      expect(character3DSystem.currentCharacter).toBeNull();
      expect(character3DSystem.isActive).toBe(false);
      expect(character3DSystem.isTransitioning).toBe(false);
      expect(character3DSystem.state).toBe('idle');
    });

    test('should log initialization message', () => {
      expect(console.log).toHaveBeenCalledWith('✅ Character 3D System initialized');
    });
  });

  describe('initializeCharacter', () => {
    beforeEach(() => {
      // Mock the constructor functions
      global.Character3DRenderer = jest.fn().mockImplementation(() => 
        testUtils.createMockCharacterRenderer()
      );
      global.CharacterEmergenceAnimator = jest.fn().mockImplementation(() => 
        testUtils.createMockEmergenceAnimator()
      );
      global.CharacterReturnAnimator = jest.fn().mockImplementation(() => 
        testUtils.createMockReturnAnimator()
      );
    });

    test('should successfully initialize valid character', async () => {
      const result = await character3DSystem.initializeCharacter('eli');
      
      expect(result).toBe(true);
      expect(character3DSystem.currentCharacter).toBe('eli');
      expect(character3DSystem.state).toBe('idle');
      expect(global.Character3DRenderer).toHaveBeenCalledWith('eli', mockSceneManager);
    });

    test('should reject invalid character names', async () => {
      const result = await character3DSystem.initializeCharacter('invalid');
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('❌ Invalid character: invalid');
    });

    test('should fail when scene manager not available', async () => {
      mockSceneManager.isAvailable.mockReturnValue(false);
      
      const result = await character3DSystem.initializeCharacter('eli');
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('❌ Cannot initialize character - scene manager not available');
    });

    test('should skip initialization if character already initialized', async () => {
      // First initialization
      await character3DSystem.initializeCharacter('eli');
      jest.clearAllMocks();
      
      // Second initialization with same character
      const result = await character3DSystem.initializeCharacter('eli');
      
      expect(result).toBe(true);
      expect(console.log).toHaveBeenCalledWith('✅ Character eli already initialized');
      expect(global.Character3DRenderer).not.toHaveBeenCalled();
    });

    test('should cleanup previous character when switching', async () => {
      // Initialize first character
      await character3DSystem.initializeCharacter('eli');
      const cleanupSpy = jest.spyOn(character3DSystem, 'cleanup');
      
      // Initialize different character
      await character3DSystem.initializeCharacter('maya');
      
      expect(cleanupSpy).toHaveBeenCalled();
      expect(character3DSystem.currentCharacter).toBe('maya');
    });

    test('should handle character model loading failure', async () => {
      const mockRenderer = testUtils.createMockCharacterRenderer();
      mockRenderer.loadCharacterModel.mockResolvedValue(false);
      global.Character3DRenderer.mockImplementation(() => mockRenderer);
      
      const result = await character3DSystem.initializeCharacter('eli');
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('❌ Failed to load character model for eli');
    });
  });

  describe('emergeCharacter', () => {
    beforeEach(async () => {
      // Setup initialized system
      global.Character3DRenderer = jest.fn().mockImplementation(() => 
        testUtils.createMockCharacterRenderer()
      );
      global.CharacterEmergenceAnimator = jest.fn().mockImplementation(() => 
        testUtils.createMockEmergenceAnimator()
      );
      global.CharacterReturnAnimator = jest.fn().mockImplementation(() => 
        testUtils.createMockReturnAnimator()
      );
      
      await character3DSystem.initializeCharacter('eli');
    });

    test('should successfully emerge character', async () => {
      const orbPosition = { x: 100, y: 200 };
      
      const result = await character3DSystem.emergeCharacter(orbPosition);
      
      expect(result).toBe(true);
      expect(character3DSystem.isActive).toBe(true);
      expect(character3DSystem.state).toBe('active');
      expect(character3DSystem.isTransitioning).toBe(false);
      expect(mockSceneManager.show).toHaveBeenCalled();
    });

    test('should fail when system not initialized', async () => {
      const uninitializedSystem = new Character3DSystem(mockSceneManager);
      
      const result = await uninitializedSystem.emergeCharacter({ x: 100, y: 200 });
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('❌ Character system not initialized');
    });

    test('should prevent emergence when already transitioning', async () => {
      character3DSystem.isTransitioning = true;
      
      const result = await character3DSystem.emergeCharacter({ x: 100, y: 200 });
      
      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('⚠️ Character transition already in progress');
    });

    test('should prevent emergence when not in idle state', async () => {
      character3DSystem.state = 'active';
      
      const result = await character3DSystem.emergeCharacter({ x: 100, y: 200 });
      
      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('⚠️ Cannot emerge character - current state: active');
    });

    test('should handle emergence animation failure', async () => {
      const mockEmergenceAnimator = testUtils.createMockEmergenceAnimator();
      mockEmergenceAnimator.startEmergence.mockResolvedValue(false);
      character3DSystem.emergenceAnimator = mockEmergenceAnimator;
      
      const result = await character3DSystem.emergeCharacter({ x: 100, y: 200 });
      
      expect(result).toBe(false);
      expect(character3DSystem.state).toBe('idle');
      expect(character3DSystem.isTransitioning).toBe(false);
      expect(mockSceneManager.hide).toHaveBeenCalled();
    });
  });

  describe('returnCharacter', () => {
    beforeEach(async () => {
      // Setup initialized and active system
      global.Character3DRenderer = jest.fn().mockImplementation(() => 
        testUtils.createMockCharacterRenderer()
      );
      global.CharacterEmergenceAnimator = jest.fn().mockImplementation(() => 
        testUtils.createMockEmergenceAnimator()
      );
      global.CharacterReturnAnimator = jest.fn().mockImplementation(() => 
        testUtils.createMockReturnAnimator()
      );
      
      await character3DSystem.initializeCharacter('eli');
      await character3DSystem.emergeCharacter({ x: 100, y: 200 });
    });

    test('should successfully return character', async () => {
      const orbPosition = { x: 100, y: 200 };
      
      const result = await character3DSystem.returnCharacter(orbPosition);
      
      expect(result).toBe(true);
      expect(character3DSystem.isActive).toBe(false);
      expect(character3DSystem.state).toBe('idle');
      expect(character3DSystem.isTransitioning).toBe(false);
    });

    test('should fail when system not initialized', async () => {
      const uninitializedSystem = new Character3DSystem(mockSceneManager);
      
      const result = await uninitializedSystem.returnCharacter({ x: 100, y: 200 });
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('❌ Character system not initialized');
    });

    test('should prevent return when not in active state', async () => {
      character3DSystem.state = 'idle';
      
      const result = await character3DSystem.returnCharacter({ x: 100, y: 200 });
      
      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('⚠️ Cannot return character - current state: idle');
    });

    test('should handle return animation failure', async () => {
      const mockReturnAnimator = testUtils.createMockReturnAnimator();
      mockReturnAnimator.startReturn.mockResolvedValue(false);
      character3DSystem.returnAnimator = mockReturnAnimator;
      
      const result = await character3DSystem.returnCharacter({ x: 100, y: 200 });
      
      expect(result).toBe(false);
      expect(character3DSystem.state).toBe('active');
      expect(character3DSystem.isTransitioning).toBe(false);
    });
  });

  describe('State Management', () => {
    test('should return correct current character', () => {
      character3DSystem.currentCharacter = 'maya';
      expect(character3DSystem.getCurrentCharacter()).toBe('maya');
    });

    test('should return correct system state', () => {
      character3DSystem.state = 'emerging';
      expect(character3DSystem.getState()).toBe('emerging');
    });

    test('should correctly identify active character', () => {
      character3DSystem.isActive = true;
      character3DSystem.state = 'active';
      expect(character3DSystem.isCharacterActive()).toBe(true);
      
      character3DSystem.state = 'idle';
      expect(character3DSystem.isCharacterActive()).toBe(false);
    });

    test('should correctly identify transitioning state', () => {
      character3DSystem.isTransitioning = true;
      expect(character3DSystem.isSystemTransitioning()).toBe(true);
    });
  });

  describe('Emergency Stop', () => {
    beforeEach(async () => {
      global.Character3DRenderer = jest.fn().mockImplementation(() => 
        testUtils.createMockCharacterRenderer()
      );
      global.CharacterEmergenceAnimator = jest.fn().mockImplementation(() => 
        testUtils.createMockEmergenceAnimator()
      );
      global.CharacterReturnAnimator = jest.fn().mockImplementation(() => 
        testUtils.createMockReturnAnimator()
      );
      
      await character3DSystem.initializeCharacter('eli');
    });

    test('should stop all animations and reset state', () => {
      character3DSystem.isTransitioning = true;
      character3DSystem.isActive = true;
      character3DSystem.state = 'emerging';
      
      character3DSystem.emergencyStop();
      
      expect(character3DSystem.emergenceAnimator.stopEmergence).toHaveBeenCalled();
      expect(character3DSystem.returnAnimator.stopReturn).toHaveBeenCalled();
      expect(character3DSystem.isTransitioning).toBe(false);
      expect(character3DSystem.isActive).toBe(false);
      expect(character3DSystem.state).toBe('idle');
      expect(mockSceneManager.hide).toHaveBeenCalled();
    });
  });

  describe('System Status', () => {
    test('should return comprehensive system status', () => {
      character3DSystem.currentCharacter = 'stanley';
      character3DSystem.state = 'active';
      character3DSystem.isActive = true;
      character3DSystem.isTransitioning = false;
      
      const status = character3DSystem.getSystemStatus();
      
      expect(status).toEqual({
        currentCharacter: 'stanley',
        state: 'active',
        isActive: true,
        isTransitioning: false,
        rendererReady: false, // No renderer in this test
        sceneManagerAvailable: true
      });
    });
  });

  describe('Cleanup', () => {
    beforeEach(async () => {
      global.Character3DRenderer = jest.fn().mockImplementation(() => 
        testUtils.createMockCharacterRenderer()
      );
      global.CharacterEmergenceAnimator = jest.fn().mockImplementation(() => 
        testUtils.createMockEmergenceAnimator()
      );
      global.CharacterReturnAnimator = jest.fn().mockImplementation(() => 
        testUtils.createMockReturnAnimator()
      );
      
      await character3DSystem.initializeCharacter('eli');
    });

    test('should clean up all resources and reset state', async () => {
      await character3DSystem.cleanup();
      
      expect(character3DSystem.emergenceAnimator).toBeNull();
      expect(character3DSystem.returnAnimator).toBeNull();
      expect(character3DSystem.characterRenderer).toBeNull();
      expect(character3DSystem.currentCharacter).toBeNull();
      expect(character3DSystem.isActive).toBe(false);
      expect(character3DSystem.isTransitioning).toBe(false);
      expect(character3DSystem.state).toBe('idle');
    });
  });
});