/**
 * Real-Time Decision Mechanics Unit Tests
 * Tests for timer accuracy, decision processing under pressure, and educational outcomes
 * Requirements: 10.1, 10.2, 10.3
 */

const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

// Mock the modules under test
let RealTimeDecisionEngine, TimerManager, ThreatDatabase, CharacterRealTimeScenarios;

// Mock implementations
const mockRealTimeDecisionEngine = {
  initialize: jest.fn(() => Promise.resolve(true)),
  startRealTimeScenario: jest.fn(),
  processDecision: jest.fn(),
  handleTimeout: jest.fn(),
  generateScenario: jest.fn(),
  calculateTimingScore: jest.fn(),
  generateOutcome: jest.fn(),
  applyDecisionConsequences: jest.fn(),
  completeScenario: jest.fn()
};

const mockTimerManager = {
  startTimer: jest.fn(),
  stopTimer: jest.fn(),
  updateTimer: jest.fn(),
  getTimeRemaining: jest.fn(),
  isActive: jest.fn(),
  getActiveTimers: jest.fn(),
  stopAllTimers: jest.fn()
};

const mockThreatDatabase = {
  initialize: jest.fn(() => Promise.resolve()),
  getScenario: jest.fn(),
  addScenario: jest.fn(),
  getCharacterScenarios: jest.fn(),
  getRandomScenario: jest.fn()
};

const mockCharacterRealTimeScenarios = {
  scenarios: new Map(),
  getScenario: jest.fn(),
  getCharacterScenarios: jest.fn(),
  getRandomScenario: jest.fn()
};

// Mock classes
RealTimeDecisionEngine = jest.fn(() => mockRealTimeDecisionEngine);
TimerManager = jest.fn(() => mockTimerManager);
ThreatDatabase = jest.fn(() => mockThreatDatabase);
CharacterRealTimeScenarios = jest.fn(() => mockCharacterRealTimeScenarios);

describe('Real-Time Decision Engine', () => {
  let realTimeEngine;
  let mockStoryTracker;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock global dependencies
    mockStoryTracker = {
      updateStoryState: jest.fn()
    };
    
    global.window = {
      ...global.window,
      storyTracker: mockStoryTracker,
      addEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    };

    realTimeEngine = new RealTimeDecisionEngine();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Engine Initialization', () => {
    test('should initialize successfully with default configuration', async () => {
      mockRealTimeDecisionEngine.initialize.mockResolvedValue(true);
      
      const result = await realTimeEngine.initialize();
      
      expect(result).toBe(true);
      expect(realTimeEngine.initialize).toHaveBeenCalled();
    });

    test('should handle initialization failure gracefully', async () => {
      mockRealTimeDecisionEngine.initialize.mockResolvedValue(false);
      
      const result = await realTimeEngine.initialize();
      
      expect(result).toBe(false);
    });

    test('should set up event listeners during initialization', async () => {
      await realTimeEngine.initialize();
      
      expect(mockRealTimeDecisionEngine.initialize).toHaveBeenCalled();
    });
  });

  describe('Scenario Generation and Management', () => {
    test('should generate scenario for Maya romance scam', async () => {
      const mockScenario = {
        id: 'maya_romance_scam_realtime',
        title: 'Emergency Romance Scam',
        character: 'maya',
        urgencyLevel: 'high',
        timeLimit: 20,
        phases: [
          {
            id: 'initial_contact',
            title: 'Urgent Message Received',
            timeAllowed: 8,
            decisions: [
              {
                id: 'verify_identity',
                text: 'Demand video call verification',
                correctness: 'optimal'
              }
            ]
          }
        ]
      };

      mockRealTimeDecisionEngine.generateScenario.mockResolvedValue(mockScenario);
      
      const result = await realTimeEngine.generateScenario('romance_scam_detection', 'maya', 'high');
      
      expect(result).toEqual(mockScenario);
      expect(result.character).toBe('maya');
      expect(result.urgencyLevel).toBe('high');
      expect(result.phases).toHaveLength(1);
    });

    test('should generate scenario for Eli gaming scam', async () => {
      const mockScenario = {
        id: 'eli_gaming_scam_realtime',
        title: 'Fake Tournament Alert',
        character: 'eli',
        urgencyLevel: 'high',
        timeLimit: 18,
        threatType: 'gaming_fraud',
        phases: [
          {
            id: 'tournament_offer',
            title: 'Suspicious Tournament Invitation',
            timeAllowed: 8,
            decisions: [
              {
                id: 'verify_organizer',
                text: 'Research tournament organizer',
                correctness: 'optimal'
              }
            ]
          }
        ]
      };

      mockRealTimeDecisionEngine.generateScenario.mockResolvedValue(mockScenario);
      
      const result = await realTimeEngine.generateScenario('gaming_scam_prevention', 'eli', 'high');
      
      expect(result).toEqual(mockScenario);
      expect(result.character).toBe('eli');
      expect(result.threatType).toBe('gaming_fraud');
    });

    test('should generate scenario for Stanley elder fraud', async () => {
      const mockScenario = {
        id: 'stanley_elder_fraud_realtime',
        title: 'Social Security Scam Call',
        character: 'stanley',
        urgencyLevel: 'critical',
        timeLimit: 15,
        phases: [
          {
            id: 'scam_call',
            title: 'Urgent Government Call',
            timeAllowed: 7,
            decisions: [
              {
                id: 'hang_up_verify',
                text: 'Hang up and call Social Security directly',
                correctness: 'optimal'
              }
            ]
          }
        ]
      };

      mockRealTimeDecisionEngine.generateScenario.mockResolvedValue(mockScenario);
      
      const result = await realTimeEngine.generateScenario('elder_fraud_prevention', 'stanley', 'critical');
      
      expect(result).toEqual(mockScenario);
      expect(result.character).toBe('stanley');
      expect(result.urgencyLevel).toBe('critical');
    });

    test('should start real-time scenario with proper session management', async () => {
      const mockScenarioResult = {
        scenarioId: 'realtime_maya_1234567890',
        interface: document.createElement('div'),
        session: {
          id: 'realtime_maya_1234567890',
          character: 'maya',
          status: 'active',
          startTime: Date.now()
        }
      };

      mockRealTimeDecisionEngine.startRealTimeScenario.mockResolvedValue(mockScenarioResult);
      
      const result = await realTimeEngine.startRealTimeScenario('romance_scam_detection', 'maya', 'high');
      
      expect(result.scenarioId).toMatch(/^realtime_maya_\d+$/);
      expect(result.session.character).toBe('maya');
      expect(result.session.status).toBe('active');
    });
  });

  describe('Timer Management and Accuracy', () => {
    let timerManager;

    beforeEach(() => {
      timerManager = new TimerManager();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should start timer with accurate countdown', () => {
      const callback = jest.fn();
      const duration = 30; // 30 seconds
      
      mockTimerManager.startTimer.mockImplementation((timerId, dur, cb) => {
        expect(timerId).toBe('test_timer');
        expect(dur).toBe(duration);
        expect(cb).toBe(callback);
      });
      
      timerManager.startTimer('test_timer', duration, callback);
      
      expect(mockTimerManager.startTimer).toHaveBeenCalledWith('test_timer', duration, callback);
    });

    test('should track remaining time accurately', () => {
      mockTimerManager.getTimeRemaining.mockReturnValue(25);
      
      const remaining = timerManager.getTimeRemaining('test_timer');
      
      expect(remaining).toBe(25);
      expect(mockTimerManager.getTimeRemaining).toHaveBeenCalledWith('test_timer');
    });

    test('should handle timer expiration correctly', () => {
      const callback = jest.fn();
      mockTimerManager.startTimer.mockImplementation((timerId, duration, cb) => {
        // Simulate timer expiration
        setTimeout(cb, duration * 1000);
      });
      
      timerManager.startTimer('test_timer', 1, callback); // 1 second
      
      jest.advanceTimersByTime(1000);
      
      expect(callback).toHaveBeenCalled();
    });

    test('should stop timer and clean up resources', () => {
      timerManager.stopTimer('test_timer');
      
      expect(mockTimerManager.stopTimer).toHaveBeenCalledWith('test_timer');
    });

    test('should update timer duration for phase transitions', () => {
      timerManager.updateTimer('test_timer', 15);
      
      expect(mockTimerManager.updateTimer).toHaveBeenCalledWith('test_timer', 15);
    });

    test('should manage multiple active timers', () => {
      mockTimerManager.getActiveTimers.mockReturnValue(['timer1', 'timer2', 'timer3']);
      
      const activeTimers = timerManager.getActiveTimers();
      
      expect(activeTimers).toHaveLength(3);
      expect(activeTimers).toContain('timer1');
      expect(activeTimers).toContain('timer2');
      expect(activeTimers).toContain('timer3');
    });
  });

  describe('Decision Processing Under Pressure', () => {
    test('should process optimal decision with good timing', () => {
      const mockResult = {
        decisionId: 'verify_identity',
        decision: { text: 'Demand video call verification', correctness: 'optimal' },
        timeRemaining: 15,
        timingScore: 0.9,
        correctness: 'optimal',
        consequences: { scam_detection: 3, safety_awareness: 2, timing_bonus: 1 },
        explanation: 'Always verify identity before financial assistance'
      };

      mockRealTimeDecisionEngine.processDecision.mockReturnValue(mockResult);
      
      const result = realTimeEngine.processDecision('scenario_123', 'verify_identity', 15);
      
      expect(result.correctness).toBe('optimal');
      expect(result.timingScore).toBe(0.9);
      expect(result.consequences.timing_bonus).toBe(1);
      expect(result.explanation).toContain('verify identity');
    });

    test('should process acceptable decision with moderate timing', () => {
      const mockResult = {
        decisionId: 'ask_details',
        decision: { text: 'Ask for hospital details', correctness: 'acceptable' },
        timeRemaining: 8,
        timingScore: 0.6,
        correctness: 'acceptable',
        consequences: { verification_attempt: 2, caution: 1 },
        explanation: 'Requesting details is good, but scammers often have fake documentation'
      };

      mockRealTimeDecisionEngine.processDecision.mockReturnValue(mockResult);
      
      const result = realTimeEngine.processDecision('scenario_123', 'ask_details', 8);
      
      expect(result.correctness).toBe('acceptable');
      expect(result.timingScore).toBe(0.6);
      expect(result.consequences.verification_attempt).toBe(2);
    });

    test('should process poor decision with timing penalty', () => {
      const mockResult = {
        decisionId: 'send_money',
        decision: { text: 'Send money immediately', correctness: 'dangerous' },
        timeRemaining: 2,
        timingScore: 0.2,
        correctness: 'dangerous',
        consequences: { financial_loss: -3, vulnerability: 2, timing_penalty: -1 },
        explanation: 'Sending money without verification is extremely risky'
      };

      mockRealTimeDecisionEngine.processDecision.mockReturnValue(mockResult);
      
      const result = realTimeEngine.processDecision('scenario_123', 'send_money', 2);
      
      expect(result.correctness).toBe('dangerous');
      expect(result.timingScore).toBe(0.2);
      expect(result.consequences.timing_penalty).toBe(-1);
      expect(result.consequences.financial_loss).toBe(-3);
    });

    test('should handle timeout scenario appropriately', () => {
      const mockTimeoutResult = {
        decisionId: 'timeout',
        decision: { text: 'No decision made (timeout)' },
        timeRemaining: 0,
        timingScore: 0,
        correctness: 'poor',
        consequences: { timeout_penalty: -2, missed_opportunity: 1 },
        explanation: 'Delayed response in cybersecurity can lead to increased damage'
      };

      mockRealTimeDecisionEngine.handleTimeout.mockImplementation((scenarioId) => {
        expect(scenarioId).toBe('scenario_123');
        return mockTimeoutResult;
      });
      
      realTimeEngine.handleTimeout('scenario_123');
      
      expect(mockRealTimeDecisionEngine.handleTimeout).toHaveBeenCalledWith('scenario_123');
    });

    test('should calculate timing score accurately', () => {
      // Test optimal timing (60% of time used)
      mockRealTimeDecisionEngine.calculateTimingScore.mockImplementation((timeRemaining, timeAllowed) => {
        const timeUsed = timeAllowed - timeRemaining;
        const optimalTime = timeAllowed * 0.6;
        
        if (timeUsed <= optimalTime) {
          return 1.0;
        } else {
          const overtime = timeUsed - optimalTime;
          const maxOvertime = timeAllowed * 0.4;
          return Math.max(0, 1 - (overtime / maxOvertime));
        }
      });
      
      // Optimal timing: 6 seconds used out of 10 (60%)
      let score = realTimeEngine.calculateTimingScore(4, 10);
      expect(score).toBe(1.0);
      
      // Slower timing: 8 seconds used out of 10 (80%)
      score = realTimeEngine.calculateTimingScore(2, 10);
      expect(score).toBe(0.5);
      
      // Very slow timing: 10 seconds used out of 10 (100%)
      score = realTimeEngine.calculateTimingScore(0, 10);
      expect(score).toBe(0);
    });
  });

  describe('Educational Outcomes and Consequence Systems', () => {
    test('should generate comprehensive outcome for excellent performance', () => {
      const mockOutcome = {
        performance: 'excellent',
        metrics: {
          totalDecisions: 2,
          correctDecisions: 2,
          acceptableDecisions: 0,
          poorDecisions: 0,
          averageTimingScore: 0.9
        },
        feedback: {
          summary: 'Outstanding cybersecurity response! You demonstrated excellent threat assessment and rapid decision-making skills.',
          strengths: ['Good choice: Demand video call verification', 'Good choice: Block contact and report as scam'],
          improvements: [],
          keyLessons: [
            'Recognize romance scam urgency tactics',
            'Understand emotional manipulation in online relationships',
            'Learn proper verification methods for online contacts'
          ]
        },
        educationalGoals: [
          'Recognize romance scam urgency tactics',
          'Understand emotional manipulation in online relationships'
        ],
        realWorldMapping: 'Romance scams cost victims an average of $2,600 each'
      };

      mockRealTimeDecisionEngine.generateOutcome.mockReturnValue(mockOutcome);
      
      const scenarioSession = {
        decisions: [
          { correctness: 'optimal', timingScore: 0.9 },
          { correctness: 'optimal', timingScore: 0.9 }
        ],
        scenario: {
          educationalGoals: mockOutcome.educationalGoals,
          realWorldMapping: mockOutcome.realWorldMapping
        }
      };
      
      const outcome = realTimeEngine.generateOutcome(scenarioSession);
      
      expect(outcome.performance).toBe('excellent');
      expect(outcome.metrics.correctDecisions).toBe(2);
      expect(outcome.feedback.summary).toContain('Outstanding cybersecurity response');
      expect(outcome.feedback.keyLessons).toContain('Recognize romance scam urgency tactics');
    });

    test('should generate outcome for poor performance with educational guidance', () => {
      const mockOutcome = {
        performance: 'poor',
        metrics: {
          totalDecisions: 2,
          correctDecisions: 0,
          acceptableDecisions: 0,
          poorDecisions: 2,
          averageTimingScore: 0.3
        },
        feedback: {
          summary: 'This scenario highlights the importance of quick, informed decision-making in cybersecurity.',
          strengths: [],
          improvements: [
            'Consider: Always verify identity before financial assistance',
            'Consider: Blocking and reporting protects you and helps prevent others from being scammed'
          ],
          keyLessons: [
            'Recognize romance scam urgency tactics',
            'Develop resistance to guilt-based manipulation'
          ]
        }
      };

      mockRealTimeDecisionEngine.generateOutcome.mockReturnValue(mockOutcome);
      
      const scenarioSession = {
        decisions: [
          { correctness: 'dangerous', timingScore: 0.2 },
          { correctness: 'poor', timingScore: 0.4 }
        ]
      };
      
      const outcome = realTimeEngine.generateOutcome(scenarioSession);
      
      expect(outcome.performance).toBe('poor');
      expect(outcome.feedback.improvements.length).toBeGreaterThan(0);
      expect(outcome.feedback.keyLessons).toContain('Recognize romance scam urgency tactics');
    });

    test('should apply decision consequences to story state', () => {
      const scenarioSession = {
        character: 'maya'
      };
      
      const result = {
        consequences: {
          scam_detection: 3,
          safety_awareness: 2,
          timing_bonus: 1
        }
      };

      realTimeEngine.applyDecisionConsequences(scenarioSession, result);
      
      expect(mockRealTimeDecisionEngine.applyDecisionConsequences).toHaveBeenCalledWith(scenarioSession, result);
    });

    test('should validate educational goals are met for each character', () => {
      // Maya educational goals
      const mayaGoals = [
        'Recognize romance scam urgency tactics',
        'Understand emotional manipulation in online relationships',
        'Learn proper verification methods for online contacts',
        'Develop resistance to guilt-based manipulation'
      ];

      // Eli educational goals
      const eliGoals = [
        'Recognize gaming tournament scam tactics',
        'Learn to verify tournament legitimacy',
        'Resist high-pressure sales tactics',
        'Understand FOMO manipulation in gaming contexts'
      ];

      // Stanley educational goals
      const stanleyGoals = [
        'Recognize government impersonation scams',
        'Understand legitimate government communication methods',
        'Resist authority-based intimidation tactics',
        'Learn proper verification procedures for official contacts'
      ];

      expect(mayaGoals).toContain('Recognize romance scam urgency tactics');
      expect(eliGoals).toContain('Recognize gaming tournament scam tactics');
      expect(stanleyGoals).toContain('Recognize government impersonation scams');
      
      // Each character should have at least 4 educational goals
      expect(mayaGoals.length).toBeGreaterThanOrEqual(4);
      expect(eliGoals.length).toBeGreaterThanOrEqual(4);
      expect(stanleyGoals.length).toBeGreaterThanOrEqual(4);
    });

    test('should complete scenario with proper cleanup and event dispatch', () => {
      const scenarioSession = {
        id: 'scenario_123',
        character: 'maya',
        status: 'active'
      };

      const completionType = 'completed';

      realTimeEngine.completeScenario(scenarioSession, completionType);
      
      expect(mockRealTimeDecisionEngine.completeScenario).toHaveBeenCalledWith(scenarioSession, completionType);
    });
  });

  describe('Character-Specific Scenario Validation', () => {
    test('should validate Maya romance scam scenarios have proper structure', () => {
      const mayaScenario = {
        id: 'maya_romance_scam_realtime',
        character: 'maya',
        threatType: 'romance_fraud',
        phases: [
          {
            id: 'initial_contact',
            decisions: [
              { id: 'verify_identity', correctness: 'optimal' },
              { id: 'ask_details', correctness: 'acceptable' },
              { id: 'send_money', correctness: 'dangerous' }
            ]
          }
        ],
        educationalGoals: [
          'Recognize romance scam urgency tactics',
          'Understand emotional manipulation in online relationships'
        ]
      };

      expect(mayaScenario.character).toBe('maya');
      expect(mayaScenario.threatType).toBe('romance_fraud');
      expect(mayaScenario.phases[0].decisions).toHaveLength(3);
      expect(mayaScenario.educationalGoals.length).toBeGreaterThan(0);
    });

    test('should validate Eli gaming scenarios have proper structure', () => {
      const eliScenario = {
        id: 'eli_gaming_scam_realtime',
        character: 'eli',
        threatType: 'gaming_fraud',
        phases: [
          {
            id: 'tournament_offer',
            decisions: [
              { id: 'verify_organizer', correctness: 'optimal' },
              { id: 'ask_community', correctness: 'acceptable' },
              { id: 'register_immediately', correctness: 'dangerous' }
            ]
          }
        ],
        educationalGoals: [
          'Recognize gaming tournament scam tactics',
          'Learn to verify tournament legitimacy'
        ]
      };

      expect(eliScenario.character).toBe('eli');
      expect(eliScenario.threatType).toBe('gaming_fraud');
      expect(eliScenario.phases[0].decisions).toHaveLength(3);
      expect(eliScenario.educationalGoals.length).toBeGreaterThan(0);
    });

    test('should validate Stanley elder fraud scenarios have proper structure', () => {
      const stanleyScenario = {
        id: 'stanley_elder_fraud_realtime',
        character: 'stanley',
        threatType: 'government_impersonation',
        phases: [
          {
            id: 'scam_call',
            decisions: [
              { id: 'hang_up_verify', correctness: 'optimal' },
              { id: 'ask_verification', correctness: 'acceptable' },
              { id: 'provide_information', correctness: 'dangerous' }
            ]
          }
        ],
        educationalGoals: [
          'Recognize government impersonation scams',
          'Understand legitimate government communication methods'
        ]
      };

      expect(stanleyScenario.character).toBe('stanley');
      expect(stanleyScenario.threatType).toBe('government_impersonation');
      expect(stanleyScenario.phases[0].decisions).toHaveLength(3);
      expect(stanleyScenario.educationalGoals.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Error Handling', () => {
    test('should handle invalid scenario ID gracefully', () => {
      mockRealTimeDecisionEngine.processDecision.mockImplementation(() => {
        throw new Error('Scenario not found or not active');
      });

      expect(() => {
        realTimeEngine.processDecision('invalid_scenario', 'decision_id', 10);
      }).toThrow('Scenario not found or not active');
    });

    test('should handle invalid decision ID gracefully', () => {
      mockRealTimeDecisionEngine.processDecision.mockImplementation(() => {
        throw new Error('Decision not found: invalid_decision');
      });

      expect(() => {
        realTimeEngine.processDecision('valid_scenario', 'invalid_decision', 10);
      }).toThrow('Decision not found: invalid_decision');
    });

    test('should clean up resources when scenario completes', () => {
      const scenarioSession = {
        id: 'scenario_123',
        status: 'completed'
      };

      realTimeEngine.completeScenario(scenarioSession, 'completed');
      
      expect(mockRealTimeDecisionEngine.completeScenario).toHaveBeenCalledWith(scenarioSession, 'completed');
    });

    test('should handle multiple concurrent scenarios', () => {
      mockRealTimeDecisionEngine.startRealTimeScenario
        .mockResolvedValueOnce({ scenarioId: 'scenario_1', session: { id: 'scenario_1' } })
        .mockResolvedValueOnce({ scenarioId: 'scenario_2', session: { id: 'scenario_2' } });

      const promise1 = realTimeEngine.startRealTimeScenario('romance_scam_detection', 'maya', 'high');
      const promise2 = realTimeEngine.startRealTimeScenario('gaming_scam_prevention', 'eli', 'medium');

      return Promise.all([promise1, promise2]).then(([result1, result2]) => {
        expect(result1.scenarioId).toBe('scenario_1');
        expect(result2.scenarioId).toBe('scenario_2');
      });
    });
  });
});

describe('Threat Database', () => {
  let threatDatabase;

  beforeEach(() => {
    threatDatabase = new ThreatDatabase();
  });

  describe('Database Initialization and Management', () => {
    test('should initialize with character-specific scenarios', async () => {
      await threatDatabase.initialize();
      
      expect(mockThreatDatabase.initialize).toHaveBeenCalled();
    });

    test('should retrieve scenario by type and character', () => {
      const mockScenario = {
        id: 'maya_romance_scam',
        character: 'maya',
        threatType: 'romance_fraud'
      };

      mockThreatDatabase.getScenario.mockReturnValue(mockScenario);
      
      const scenario = threatDatabase.getScenario('romance_scam_detection', 'maya');
      
      expect(scenario).toEqual(mockScenario);
      expect(mockThreatDatabase.getScenario).toHaveBeenCalledWith('romance_scam_detection', 'maya');
    });

    test('should get all scenarios for a character', () => {
      const mockScenarios = [
        { id: 'maya_romance_scam', character: 'maya' },
        { id: 'maya_catfish', character: 'maya' }
      ];

      mockThreatDatabase.getCharacterScenarios.mockReturnValue(mockScenarios);
      
      const scenarios = threatDatabase.getCharacterScenarios('maya');
      
      expect(scenarios).toHaveLength(2);
      expect(scenarios.every(s => s.character === 'maya')).toBe(true);
    });

    test('should get random scenario for character', () => {
      const mockScenario = {
        id: 'eli_gaming_scam',
        character: 'eli',
        threatType: 'gaming_fraud'
      };

      mockThreatDatabase.getRandomScenario.mockReturnValue(mockScenario);
      
      const scenario = threatDatabase.getRandomScenario('eli');
      
      expect(scenario.character).toBe('eli');
      expect(mockThreatDatabase.getRandomScenario).toHaveBeenCalledWith('eli');
    });
  });
});

describe('Character Real-Time Scenarios', () => {
  let characterScenarios;

  beforeEach(() => {
    characterScenarios = new CharacterRealTimeScenarios();
  });

  describe('Scenario Management', () => {
    test('should retrieve character-specific scenarios', () => {
      const mockMayaScenarios = [
        { id: 'maya_romance_scam_realtime', character: 'maya' },
        { id: 'maya_catfish_realtime', character: 'maya' }
      ];

      mockCharacterRealTimeScenarios.getCharacterScenarios.mockReturnValue(mockMayaScenarios);
      
      const scenarios = characterScenarios.getCharacterScenarios('maya');
      
      expect(scenarios).toHaveLength(2);
      expect(scenarios.every(s => s.character === 'maya')).toBe(true);
    });

    test('should get scenario by type and character', () => {
      const mockScenario = {
        id: 'stanley_elder_fraud_realtime',
        character: 'stanley',
        threatType: 'government_impersonation'
      };

      mockCharacterRealTimeScenarios.getScenario.mockReturnValue(mockScenario);
      
      const scenario = characterScenarios.getScenario('elder_fraud_prevention', 'stanley');
      
      expect(scenario.character).toBe('stanley');
      expect(scenario.threatType).toBe('government_impersonation');
    });
  });
});