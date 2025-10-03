/**
 * Jest Test Setup
 * Global setup for all tests including mocks and utilities
 */

// Mock Three.js for testing environment
global.THREE = {
  Scene: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    traverse: jest.fn()
  })),
  Group: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    scale: { setScalar: jest.fn() },
    position: { set: jest.fn() },
    visible: true,
    traverse: jest.fn()
  })),
  PerspectiveCamera: jest.fn(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn()
  })),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn()
  })),
  CapsuleGeometry: jest.fn(),
  MeshPhongMaterial: jest.fn(),
  Mesh: jest.fn(() => ({
    position: { set: jest.fn() },
    scale: { setScalar: jest.fn() },
    castShadow: true,
    receiveShadow: true
  })),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn(() => ({
    position: { set: jest.fn() },
    castShadow: true,
    shadow: {
      mapSize: { width: 1024, height: 1024 },
      camera: { near: 0.5, far: 50 }
    }
  })),
  PointLight: jest.fn(() => ({
    position: { set: jest.fn() }
  })),
  Clock: jest.fn(() => ({
    getDelta: jest.fn(() => 0.016)
  }))
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock window methods
global.window = {
  ...global.window,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  location: {
    pathname: '/test',
    href: 'http://localhost/test'
  }
};

// Mock document
global.document = {
  ...global.document,
  body: {
    dataset: {}
  },
  readyState: 'complete',
  addEventListener: jest.fn()
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Test utilities
global.testUtils = {
  // Create mock scene manager
  createMockSceneManager: () => ({
    isAvailable: jest.fn(() => true),
    getScene: jest.fn(() => global.THREE.Scene()),
    getCamera: jest.fn(() => global.THREE.PerspectiveCamera()),
    show: jest.fn(),
    hide: jest.fn()
  }),

  // Create mock character renderer
  createMockCharacterRenderer: (character = 'eli') => ({
    character,
    isReady: jest.fn(() => true),
    isCharacterVisible: jest.fn(() => false),
    loadCharacterModel: jest.fn(() => Promise.resolve(true)),
    show: jest.fn(() => true),
    hide: jest.fn(),
    update: jest.fn(),
    getCharacterGroup: jest.fn(() => global.THREE.Group()),
    getCharacterModel: jest.fn(() => global.THREE.Mesh()),
    getConfig: jest.fn(() => ({})),
    cleanup: jest.fn()
  }),

  // Create mock emergence animator
  createMockEmergenceAnimator: () => ({
    startEmergence: jest.fn(() => Promise.resolve(true)),
    stopEmergence: jest.fn(),
    isEmergenceAnimating: jest.fn(() => false),
    cleanup: jest.fn()
  }),

  // Create mock return animator
  createMockReturnAnimator: () => ({
    startReturn: jest.fn(() => Promise.resolve(true)),
    stopReturn: jest.fn(),
    isReturnAnimating: jest.fn(() => false),
    cleanup: jest.fn()
  }),

  // Wait for async operations
  waitFor: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))
};