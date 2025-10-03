/**
 * Character 3D Renderer Unit Tests
 * Tests for Three.js-based character rendering system
 */

const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

// Load the module under test
require('../js/character-3d-renderer.js');

describe('Character3DRenderer', () => {
  let character3DRenderer;
  let mockSceneManager;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSceneManager = testUtils.createMockSceneManager();
  });

  afterEach(() => {
    if (character3DRenderer) {
      character3DRenderer.cleanup();
    }
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with correct character and scene manager', () => {
      character3DRenderer = new Character3DRenderer('eli', mockSceneManager);
      
      expect(character3DRenderer.character).toBe('eli');
      expect(character3DRenderer.sceneManager).toBe(mockSceneManager);
      expect(character3DRenderer.isLoaded).toBe(false);
      expect(character3DRenderer.isVisible).toBe(false);
    });

    test('should have correct character configurations', () => {
      character3DRenderer = new Character3DRenderer('maya', mockSceneManager);
      
      const config = character3DRenderer.characterConfigs.maya;
      expect(config).toBeDefined();
      expect(config.lighting.theme).toBe('investigation_mood');
      expect(config.lighting.colors.directional).toBe(0x0066CC);
    });

    test('should setup character lighting on initialization', () => {
      character3DRenderer = new Character3DRenderer('stanley', mockSceneManager);
      
      expect(mockSceneManager.getScene).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('✅ Character renderer initialized for: stanley');
    });

    test('should fail initialization when scene manager not available', () => {
      mockSceneManager.isAvailable.mockReturnValue(false);
      
      character3DRenderer = new Character3DRenderer('eli', mockSceneManager);
      
      expect(console.error).toHaveBeenCalledWith('❌ Cannot initialize character renderer - scene manager not available');
    });
  });

  describe('Character Lighting Setup', () => {
    beforeEach(() => {
      character3DRenderer = new Character3DRenderer('eli', mockSceneManager);
    });

    test('should create ambient, directional, and accent lights', () => {
      expect(THREE.AmbientLight).toHaveBeenCalled();
      expect(THREE.DirectionalLight).toHaveBeenCalled();
      expect(THREE.PointLight).toHaveBeenCalled();
    });

    test('should use character-specific lighting colors', () => {
      const config = character3DRenderer.characterConfigs.eli;
      
      expect(THREE.AmbientLight).toHaveBeenCalledWith(config.lighting.colors.ambient, 0.4);
      expect(THREE.DirectionalLight).toHaveBeenCalledWith(config.lighting.colors.directional, 0.8);
      expect(THREE.PointLight).toHaveBeenCalledWith(config.lighting.colors.accent, 0.6, 10);
    });

    test('should configure shadow properties for directional light', () => {
      const mockDirectionalLight = {
        position: { set: jest.fn() },
        castShadow: false,
        shadow: {
          mapSize: { width: 0, height: 0 },
          camera: { near: 0, far: 0 }
        }
      };
      
      THREE.DirectionalLight.mockReturnValue(mockDirectionalLight);
      character3DRenderer.setupCharacterLighting();
      
      expect(mockDirectionalLight.castShadow).toBe(true);
      expect(mockDirectionalLight.shadow.mapSize.width).toBe(1024);
      expect(mockDirectionalLight.shadow.mapSize.height).toBe(1024);
    });
  });

  describe('Camera Positioning', () => {
    beforeEach(() => {
      character3DRenderer = new Character3DRenderer('maya', mockSceneManager);
    });

    test('should position camera according to character configuration', () => {
      const mockCamera = { position: { set: jest.fn() }, lookAt: jest.fn() };
      mockSceneManager.getCamera.mockReturnValue(mockCamera);
      
      character3DRenderer.positionCameraForCharacter();
      
      const config = character3DRenderer.characterConfigs.maya;
      expect(mockCamera.position.set).toHaveBeenCalledWith(
        config.camera.position.x,
        config.camera.position.y,
        config.camera.position.z
      );
      expect(mockCamera.lookAt).toHaveBeenCalledWith(
        config.camera.lookAt.x,
        config.camera.lookAt.y,
        config.camera.lookAt.z
      );
    });
  });

  describe('Character Model Loading', () => {
    beforeEach(() => {
      character3DRenderer = new Character3DRenderer('stanley', mockSceneManager);
    });

    test('should successfully load character model', async () => {
      const result = await character3DRenderer.loadCharacterModel();
      
      expect(result).toBe(true);
      expect(character3DRenderer.isLoaded).toBe(true);
      expect(THREE.CapsuleGeometry).toHaveBeenCalled();
      expect(THREE.MeshPhongMaterial).toHaveBeenCalled();
      expect(THREE.Mesh).toHaveBeenCalled();
    });

    test('should create model with correct configuration', async () => {
      const mockMesh = {
        position: { set: jest.fn() },
        scale: { setScalar: jest.fn() },
        castShadow: false,
        receiveShadow: false
      };
      THREE.Mesh.mockReturnValue(mockMesh);
      
      await character3DRenderer.loadCharacterModel();
      
      const config = character3DRenderer.characterConfigs.stanley;
      expect(mockMesh.position.set).toHaveBeenCalledWith(
        config.position.x,
        config.position.y,
        config.position.z
      );
      expect(mockMesh.scale.setScalar).toHaveBeenCalledWith(config.scale);
      expect(mockMesh.castShadow).toBe(true);
      expect(mockMesh.receiveShadow).toBe(true);
    });

    test('should set initial scale to 0 for emergence animation', async () => {
      const mockGroup = { scale: { setScalar: jest.fn() }, add: jest.fn() };
      character3DRenderer.characterGroup = mockGroup;
      
      await character3DRenderer.loadCharacterModel();
      
      expect(mockGroup.scale.setScalar).toHaveBeenCalledWith(0);
    });

    test('should handle loading errors gracefully', async () => {
      THREE.CapsuleGeometry.mockImplementation(() => {
        throw new Error('Loading failed');
      });
      
      const result = await character3DRenderer.loadCharacterModel();
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('❌ Failed to load character model for stanley:')
      );
    });
  });

  describe('Visibility Control', () => {
    beforeEach(async () => {
      character3DRenderer = new Character3DRenderer('eli', mockSceneManager);
      await character3DRenderer.loadCharacterModel();
    });

    test('should show character when loaded', () => {
      const result = character3DRenderer.show();
      
      expect(result).toBe(true);
      expect(character3DRenderer.characterGroup.visible).toBe(true);
      expect(character3DRenderer.isVisible).toBe(true);
    });

    test('should not show character when not loaded', () => {
      character3DRenderer.isLoaded = false;
      
      const result = character3DRenderer.show();
      
      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('⚠️ Cannot show eli - model not loaded');
    });

    test('should hide character', () => {
      character3DRenderer.show();
      character3DRenderer.hide();
      
      expect(character3DRenderer.characterGroup.visible).toBe(false);
      expect(character3DRenderer.isVisible).toBe(false);
    });
  });

  describe('Animation Update', () => {
    beforeEach(async () => {
      character3DRenderer = new Character3DRenderer('maya', mockSceneManager);
      await character3DRenderer.loadCharacterModel();
      character3DRenderer.show();
    });

    test('should update animations when visible and mixer exists', () => {
      const mockMixer = { update: jest.fn() };
      character3DRenderer.animations.mixer = mockMixer;
      
      character3DRenderer.update();
      
      expect(mockMixer.update).toHaveBeenCalled();
    });

    test('should not update when not visible', () => {
      const mockMixer = { update: jest.fn() };
      character3DRenderer.animations.mixer = mockMixer;
      character3DRenderer.hide();
      
      character3DRenderer.update();
      
      expect(mockMixer.update).not.toHaveBeenCalled();
    });

    test('should not update when no mixer exists', () => {
      character3DRenderer.animations.mixer = null;
      
      // Should not throw error
      expect(() => character3DRenderer.update()).not.toThrow();
    });
  });

  describe('Getters and Status', () => {
    beforeEach(async () => {
      character3DRenderer = new Character3DRenderer('stanley', mockSceneManager);
      await character3DRenderer.loadCharacterModel();
    });

    test('should return character group', () => {
      const group = character3DRenderer.getCharacterGroup();
      expect(group).toBe(character3DRenderer.characterGroup);
    });

    test('should return character model', () => {
      const model = character3DRenderer.getCharacterModel();
      expect(model).toBe(character3DRenderer.characterModel);
    });

    test('should return ready status correctly', () => {
      expect(character3DRenderer.isReady()).toBe(true);
      
      character3DRenderer.characterModel = null;
      expect(character3DRenderer.isReady()).toBe(false);
    });

    test('should return visibility status', () => {
      expect(character3DRenderer.isCharacterVisible()).toBe(false);
      
      character3DRenderer.show();
      expect(character3DRenderer.isCharacterVisible()).toBe(true);
    });

    test('should return character configuration', () => {
      const config = character3DRenderer.getConfig();
      expect(config).toBe(character3DRenderer.characterConfigs.stanley);
    });
  });

  describe('Cleanup', () => {
    beforeEach(async () => {
      character3DRenderer = new Character3DRenderer('eli', mockSceneManager);
      await character3DRenderer.loadCharacterModel();
    });

    test('should clean up all resources', () => {
      const mockMixer = { stopAllAction: jest.fn() };
      character3DRenderer.animations.mixer = mockMixer;
      
      character3DRenderer.cleanup();
      
      expect(mockMixer.stopAllAction).toHaveBeenCalled();
      expect(character3DRenderer.characterModel).toBeNull();
      expect(character3DRenderer.characterGroup).toBeNull();
      expect(character3DRenderer.isLoaded).toBe(false);
      expect(character3DRenderer.isVisible).toBe(false);
    });

    test('should remove lights from scene', () => {
      const mockScene = mockSceneManager.getScene();
      
      character3DRenderer.cleanup();
      
      // Should have called remove for each light type
      expect(mockScene.remove).toHaveBeenCalledTimes(3); // ambient, directional, accent
    });

    test('should dispose of geometries and materials', () => {
      const mockGeometry = { dispose: jest.fn() };
      const mockMaterial = { dispose: jest.fn() };
      const mockObject = { geometry: mockGeometry, material: mockMaterial };
      
      character3DRenderer.characterGroup.traverse = jest.fn(callback => {
        callback(mockObject);
      });
      
      character3DRenderer.cleanup();
      
      expect(mockGeometry.dispose).toHaveBeenCalled();
      expect(mockMaterial.dispose).toHaveBeenCalled();
    });
  });
});