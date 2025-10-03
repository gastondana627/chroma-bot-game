/**
 * 3D Asset Pipeline Unit Tests
 * Tests for the complete 3D asset pipeline from NeRF processing to web delivery
 */

const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

// Mock pipeline components
global.NeRFPipeline = jest.fn();
global.CharacterAssetProcessor = jest.fn();
global.GaussianSplattingOptimizer = jest.fn();
global.LODManager = jest.fn();
global.AssetLoader = jest.fn();

// Load the module under test
require('../js/3d-asset-pipeline.js');

describe('AssetPipeline3D', () => {
  let assetPipeline;
  let mockComponents;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock components
    mockComponents = {
      nerfPipeline: {
        initialize: jest.fn(() => Promise.resolve()),
      },
      characterProcessor: {
        initialize: jest.fn(() => Promise.resolve()),
        addCharacterImages: jest.fn(),
        processCharacter: jest.fn(() => Promise.resolve({ 
          success: true, 
          config: { model: 'mock-model' } 
        })),
        getCharacterConfiguration: jest.fn(() => ({ assets: { animations: {} } }))
      },
      gaussianOptimizer: {
        initialize: jest.fn(() => Promise.resolve()),
        getRecommendedSettings: jest.fn(() => ({})),
        optimizeCharacterModel: jest.fn(() => ({ vertices: 15000, faces: 30000 })),
        getOptimizationStatus: jest.fn(() => ({ activeProfile: 'medium' }))
      },
      lodManager: {
        initialize: jest.fn(() => Promise.resolve()),
        registerCharacter: jest.fn(),
        cleanup: jest.fn()
      },
      assetLoader: {
        initialize: jest.fn(() => Promise.resolve()),
        preloadCharacterAssets: jest.fn(() => Promise.resolve()),
        compressionSupport: { ktx2: true, webp: true },
        getLoadingStats: jest.fn(() => ({})),
        clearCache: jest.fn()
      }
    };

    // Mock constructors
    global.NeRFPipeline.mockImplementation(() => mockComponents.nerfPipeline);
    global.CharacterAssetProcessor.mockImplementation(() => mockComponents.characterProcessor);
    global.GaussianSplattingOptimizer.mockImplementation(() => mockComponents.gaussianOptimizer);
    global.LODManager.mockImplementation(() => mockComponents.lodManager);
    global.AssetLoader.mockImplementation(() => mockComponents.assetLoader);

    assetPipeline = new AssetPipeline3D();
  });

  afterEach(() => {
    if (assetPipeline) {
      assetPipeline.cleanup();
    }
  });

  describe('Constructor', () => {
    test('should initialize with correct default state', () => {
      expect(assetPipeline.isInitialized).toBe(false);
      expect(assetPipeline.processingStatus).toBeInstanceOf(Map);
      expect(assetPipeline.pipelineConfig.autoOptimization).toBe(true);
      expect(assetPipeline.pipelineConfig.progressiveLoading).toBe(true);
    });

    test('should have all required pipeline stages defined', () => {
      expect(assetPipeline.stages.NERF_PROCESSING).toBe('nerf_processing');
      expect(assetPipeline.stages.GAUSSIAN_OPTIMIZATION).toBe('gaussian_optimization');
      expect(assetPipeline.stages.ASSET_GENERATION).toBe('asset_generation');
      expect(assetPipeline.stages.WEB_OPTIMIZATION).toBe('web_optimization');
      expect(assetPipeline.stages.LOADING_READY).toBe('loading_ready');
    });
  });

  describe('Pipeline Initialization', () => {
    test('should successfully initialize all components', async () => {
      const result = await assetPipeline.initialize();
      
      expect(result).toBe(true);
      expect(assetPipeline.isInitialized).toBe(true);
      expect(mockComponents.nerfPipeline.initialize).toHaveBeenCalled();
      expect(mockComponents.characterProcessor.initialize).toHaveBeenCalled();
      expect(mockComponents.gaussianOptimizer.initialize).toHaveBeenCalled();
      expect(mockComponents.lodManager.initialize).toHaveBeenCalled();
      expect(mockComponents.assetLoader.initialize).toHaveBeenCalled();
    });

    test('should handle initialization failure', async () => {
      mockComponents.nerfPipeline.initialize.mockRejectedValue(new Error('Init failed'));
      
      await expect(assetPipeline.initialize()).rejects.toThrow('Init failed');
      expect(assetPipeline.isInitialized).toBe(false);
    });
  });

  describe('Character Pipeline Processing', () => {
    beforeEach(async () => {
      await assetPipeline.initialize();
    });

    test('should process complete character pipeline successfully', async () => {
      const referenceImages = ['image1.jpg', 'image2.jpg'];
      const progressCallback = jest.fn();
      
      const result = await assetPipeline.processCharacterPipeline('eli', referenceImages, {
        onProgress: progressCallback
      });
      
      expect(result.success).toBe(true);
      expect(result.characterId).toBe('eli');
      expect(result.pipelineComplete).toBe(true);
      expect(progressCallback).toHaveBeenCalledTimes(10); // 2 calls per stage (start/end) * 5 stages
      expect(mockComponents.characterProcessor.addCharacterImages).toHaveBeenCalledWith('eli', referenceImages);
    });

    test('should handle NeRF processing failure', async () => {
      mockComponents.characterProcessor.processCharacter.mockResolvedValue({
        success: false,
        error: 'NeRF processing failed'
      });
      
      const result = await assetPipeline.processCharacterPipeline('maya', []);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('NeRF processing failed');
      expect(result.pipelineComplete).toBe(false);
    });

    test('should fail when pipeline not initialized', async () => {
      const uninitializedPipeline = new AssetPipeline3D();
      
      await expect(
        uninitializedPipeline.processCharacterPipeline('stanley', [])
      ).rejects.toThrow('Pipeline not initialized');
    });

    test('should update processing status throughout pipeline', async () => {
      await assetPipeline.processCharacterPipeline('eli', []);
      
      const finalStatus = assetPipeline.getProcessingStatus('eli');
      expect(finalStatus.stage).toBe('loading_ready');
      expect(finalStatus.progress).toBe(100);
    });
  });

  describe('Asset Generation', () => {
    beforeEach(async () => {
      await assetPipeline.initialize();
    });

    test('should generate texture variants for different quality levels', async () => {
      const textures = await assetPipeline.generateTextureVariants('eli', {});
      
      expect(textures.high).toBeDefined();
      expect(textures.medium).toBeDefined();
      expect(textures.low).toBeDefined();
      expect(textures.high.resolution).toBe('2048x2048');
      expect(textures.medium.resolution).toBe('1024x1024');
      expect(textures.low.resolution).toBe('512x512');
    });

    test('should include KTX2 variants when supported', async () => {
      const textures = await assetPipeline.generateTextureVariants('maya', {});
      
      expect(textures.ktx2).toBeDefined();
      expect(textures.ktx2.format).toBe('ktx2');
      expect(textures.ktx2.compression).toBe('etc1s');
    });

    test('should generate animation assets', async () => {
      const animations = await assetPipeline.generateAnimationAssets('stanley');
      
      expect(animations.idle).toBeDefined();
      expect(animations.emergence).toBeDefined();
      expect(animations.return).toBeDefined();
      expect(animations.idle.loop).toBe(true);
      expect(animations.emergence.loop).toBe(false);
    });

    test('should generate LOD assets with correct hierarchy', async () => {
      const lodAssets = await assetPipeline.generateLODAssets('eli', { vertices: 60000, faces: 120000 });
      
      expect(lodAssets.lod0).toBeDefined();
      expect(lodAssets.lod1).toBeDefined();
      expect(lodAssets.lod2).toBeDefined();
      expect(lodAssets.lod3).toBeDefined();
      
      // Check LOD hierarchy (higher LOD = lower detail)
      expect(lodAssets.lod0.distance).toBe(5);
      expect(lodAssets.lod3.distance).toBe(35);
    });
  });

  describe('Web Optimization', () => {
    beforeEach(async () => {
      await assetPipeline.initialize();
    });

    test('should optimize assets for web delivery', async () => {
      const generatedAssets = {
        model: { vertices: 30000 },
        textures: { high: {}, medium: {}, low: {} },
        animations: { idle: {}, emergence: {} }
      };
      
      const optimized = await assetPipeline.optimizeForWebDelivery('eli', generatedAssets);
      
      expect(optimized.model.compressed).toBe(true);
      expect(optimized.model.compressionRatio).toBe(0.3);
      expect(optimized.loadingManifest).toBeDefined();
    });

    test('should compress models with Draco compression', async () => {
      const model = { vertices: 15000, faces: 30000 };
      
      const compressed = await assetPipeline.compressModel(model);
      
      expect(compressed.compressed).toBe(true);
      expect(compressed.format).toBe('glb-draco');
      expect(compressed.compressionRatio).toBe(0.3);
    });

    test('should optimize textures based on device support', async () => {
      const textures = { 
        ktx2: { format: 'ktx2' }, 
        medium: { format: 'webp' }, 
        low: { format: 'jpg' } 
      };
      
      const optimized = await assetPipeline.optimizeTextures(textures);
      
      expect(optimized.preferred).toBe(textures.ktx2); // KTX2 preferred when supported
    });

    test('should generate progressive loading manifest', () => {
      const assets = {
        model: { path: '/model.glb' },
        textures: { high: { path: '/tex_high.webp' }, low: { path: '/tex_low.jpg' } },
        animations: { idle: { path: '/idle.json' } },
        lodModels: { lod0: { path: '/lod0.glb' }, lod2: { path: '/lod2.glb' } }
      };
      
      const manifest = assetPipeline.generateLoadingManifest('eli', assets);
      
      expect(manifest.characterId).toBe('eli');
      expect(manifest.loadingStrategy).toBe('progressive');
      expect(manifest.stages).toHaveLength(3);
      expect(manifest.stages[0].priority).toBe('high');
      expect(manifest.stages[2].priority).toBe('low');
    });
  });

  describe('Status and Monitoring', () => {
    beforeEach(async () => {
      await assetPipeline.initialize();
    });

    test('should track processing status for characters', () => {
      assetPipeline.updateProcessingStatus('eli', 'nerf_processing', 50);
      
      const status = assetPipeline.getProcessingStatus('eli');
      expect(status.stage).toBe('nerf_processing');
      expect(status.progress).toBe(50);
      expect(status.timestamp).toBeDefined();
    });

    test('should return comprehensive pipeline status', () => {
      const status = assetPipeline.getPipelineStatus();
      
      expect(status.initialized).toBe(true);
      expect(status.config).toBe(assetPipeline.pipelineConfig);
      expect(status.components.nerfPipeline).toBe(true);
      expect(status.components.characterProcessor).toBe(true);
      expect(status.loadingStats).toBeDefined();
      expect(status.optimizationStatus).toBeDefined();
    });

    test('should estimate asset sizes correctly', () => {
      const assets = {
        model: {},
        textures: { high: {}, medium: {}, low: {} },
        animations: { idle: {}, emergence: {} },
        lodModels: { lod0: {}, lod1: {} }
      };
      
      const estimatedSize = assetPipeline.estimateAssetSize(assets);
      
      // 5MB (model) + 6MB (3 textures) + 0.2MB (2 animations) + 4MB (2 LODs) = 15.2MB
      expect(estimatedSize).toBe(15.2);
    });

    test('should count assets correctly', () => {
      const assets = {
        model: {},
        textures: { high: {}, medium: {} },
        animations: { idle: {} },
        lodModels: { lod0: {}, lod1: {}, lod2: {} }
      };
      
      const count = assetPipeline.countAssets(assets);
      
      // 1 model + 2 textures + 1 animation + 3 LODs = 7
      expect(count).toBe(7);
    });
  });

  describe('Event Handling', () => {
    beforeEach(async () => {
      await assetPipeline.initialize();
    });

    test('should setup event handlers for pipeline coordination', () => {
      expect(window.addEventListener).toHaveBeenCalledWith('lodModelUpdate', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('gaussianSplattingOptimization', expect.any(Function));
    });
  });

  describe('Cleanup', () => {
    beforeEach(async () => {
      await assetPipeline.initialize();
    });

    test('should clean up all pipeline resources', () => {
      assetPipeline.updateProcessingStatus('eli', 'completed', 100);
      
      assetPipeline.cleanup();
      
      expect(mockComponents.lodManager.cleanup).toHaveBeenCalled();
      expect(mockComponents.assetLoader.clearCache).toHaveBeenCalled();
      expect(assetPipeline.processingStatus.size).toBe(0);
      expect(assetPipeline.isInitialized).toBe(false);
    });
  });
});