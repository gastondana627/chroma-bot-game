/**
 * Story Progression Tracker Unit Tests
 * Tests for story progression tracking and trigger detection system
 */

const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

// Load the module under test
require('../Game/Mechanics/story-progression-tracker.js');

describe('StoryProgressionTracker', () => {
  let storyTracker;
  let mockLocalStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset localStorage mock
    mockLocalStorage = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    global.localStorage = mockLocalStorage;
    
    // Reset window mock
    global.window = {
      ...global.window,
      cinematicManager: {
        getTriggerConditions: jest.fn(() => [])
      }
    };
    
    storyTracker = new StoryProgressionTracker();
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with default progress structure', () => {
      expect(storyTracker.currentSession.eli).toBeDefined();
      expect(storyTracker.currentSession.maya).toBeDefined();
      expect(storyTracker.currentSession.stanley).toBeDefined();
      
      expect(storyTracker.currentSession.eli.currentArea).toBe(1);
      expect(storyTracker.currentSession.eli.visitedAreas).toEqual([]);
      expect(storyTracker.currentSession.eli.completedTriggers).toEqual([]);
    });

    test('should load existing progress from localStorage', () => {
      const existingProgress = {
        eli: {
          currentArea: 3,
          visitedAreas: [1, 2, 3],
          completedTriggers: ['eli_tournament_win'],
          storyState: { tournament_wins: 1 }
        }
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingProgress));
      
      const tracker = new StoryProgressionTracker();
      
      expect(tracker.currentSession.eli.currentArea).toBe(3);
      expect(tracker.currentSession.eli.visitedAreas).toEqual([1, 2, 3]);
      expect(tracker.currentSession.eli.completedTriggers).toContain('eli_tournament_win');
    });

    test('should handle localStorage loading errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      expect(() => new StoryProgressionTracker()).not.toThrow();
      expect(console.warn).toHaveBeenCalledWith('Failed to load story progress:', expect.any(Error));
    });

    test('should merge existing progress with default structure', () => {
      const partialProgress = {
        eli: { currentArea: 2 }
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(partialProgress));
      
      const tracker = new StoryProgressionTracker();
      
      expect(tracker.currentSession.eli.currentArea).toBe(2);
      expect(tracker.currentSession.eli.storyState).toBeDefined();
      expect(tracker.currentSession.maya).toBeDefined();
    });
  });

  describe('Area Visit Tracking', () => {
    test('should track area visits correctly', () => {
      storyTracker.trackAreaVisit('eli', 2, { timestamp: 1234567890 });
      
      const progress = storyTracker.getProgress('eli');
      expect(progress.currentArea).toBe(2);
      expect(progress.visitedAreas).toContain(2);
      expect(progress.lastVisit).toBe(1234567890);
    });

    test('should update current area to highest visited', () => {
      storyTracker.trackAreaVisit('maya', 3);
      storyTracker.trackAreaVisit('maya', 2); // Lower area shouldn't decrease current
      
      const progress = storyTracker.getProgress('maya');
      expect(progress.currentArea).toBe(3);
      expect(progress.visitedAreas).toEqual([2, 3]);
    });

    test('should not duplicate visited areas', () => {
      storyTracker.trackAreaVisit('stanley', 2);
      storyTracker.trackAreaVisit('stanley', 2); // Duplicate visit
      
      const progress = storyTracker.getProgress('stanley');
      expect(progress.visitedAreas).toEqual([2]);
    });

    test('should handle unknown character gracefully', () => {
      storyTracker.trackAreaVisit('unknown', 1);
      
      expect(console.warn).toHaveBeenCalledWith('Unknown character: unknown');
    });

    test('should save progress after area visit', () => {
      storyTracker.trackAreaVisit('eli', 3);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'data_bleed_story_progress',
        expect.stringContaining('"currentArea":3')
      );
    });

    test('should check trigger conditions after area visit', () => {
      const checkTriggerSpy = jest.spyOn(storyTracker, 'checkTriggerConditions');
      
      storyTracker.trackAreaVisit('eli', 2, { special: true });
      
      expect(checkTriggerSpy).toHaveBeenCalledWith('eli', 2, 'area_visit', { special: true });
    });
  });

  describe('Story State Updates', () => {
    test('should update story state values', () => {
      storyTracker.updateStoryState('eli', 'tournament_wins', 5);
      
      const progress = storyTracker.getProgress('eli');
      expect(progress.storyState.tournament_wins).toBe(5);
    });

    test('should increment story state values', () => {
      storyTracker.updateStoryState('maya', 'investigation_clues', 3);
      storyTracker.updateStoryState('maya', 'investigation_clues', 2, true); // increment
      
      const progress = storyTracker.getProgress('maya');
      expect(progress.storyState.investigation_clues).toBe(5);
    });

    test('should handle unknown character in state update', () => {
      storyTracker.updateStoryState('unknown', 'test', 1);
      
      expect(console.warn).toHaveBeenCalledWith('Unknown character: unknown');
    });

    test('should check trigger conditions after state update', () => {
      const checkTriggerSpy = jest.spyOn(storyTracker, 'checkTriggerConditions');
      
      storyTracker.updateStoryState('stanley', 'scams_prevented', 3);
      
      expect(checkTriggerSpy).toHaveBeenCalledWith('stanley', 1, 'state_update', {
        stateKey: 'scams_prevented',
        newValue: 3
      });
    });
  });

  describe('Trigger Condition Evaluation', () => {
    test('should evaluate basic trigger conditions', () => {
      const trigger = {
        id: 'test_trigger',
        requiredArea: 2,
        requiredVisits: 2
      };
      
      const progress = {
        currentArea: 3,
        visitedAreas: [1, 2, 3],
        storyState: {}
      };
      
      const result = storyTracker.evaluateTriggerCondition(trigger, progress, 'area_visit', {});
      expect(result).toBe(true);
    });

    test('should fail when required area not reached', () => {
      const trigger = {
        id: 'test_trigger',
        requiredArea: 5
      };
      
      const progress = {
        currentArea: 3,
        visitedAreas: [1, 2, 3],
        storyState: {}
      };
      
      const result = storyTracker.evaluateTriggerCondition(trigger, progress, 'area_visit', {});
      expect(result).toBe(false);
    });

    test('should fail when required visits not met', () => {
      const trigger = {
        id: 'test_trigger',
        requiredVisits: 5
      };
      
      const progress = {
        currentArea: 3,
        visitedAreas: [1, 2, 3],
        storyState: {}
      };
      
      const result = storyTracker.evaluateTriggerCondition(trigger, progress, 'area_visit', {});
      expect(result).toBe(false);
    });

    test('should evaluate state conditions', () => {
      const trigger = {
        id: 'test_trigger',
        stateConditions: {
          tournament_wins: 3,
          peer_pressure_encounters: 2
        }
      };
      
      const progress = {
        currentArea: 3,
        visitedAreas: [1, 2, 3],
        storyState: {
          tournament_wins: 5,
          peer_pressure_encounters: 2
        }
      };
      
      const result = storyTracker.evaluateTriggerCondition(trigger, progress, 'state_update', {});
      expect(result).toBe(true);
    });

    test('should fail when state conditions not met', () => {
      const trigger = {
        id: 'test_trigger',
        stateConditions: {
          tournament_wins: 5
        }
      };
      
      const progress = {
        currentArea: 3,
        visitedAreas: [1, 2, 3],
        storyState: {
          tournament_wins: 2
        }
      };
      
      const result = storyTracker.evaluateTriggerCondition(trigger, progress, 'state_update', {});
      expect(result).toBe(false);
    });
  });

  describe('Trigger Firing and Callbacks', () => {
    test('should fire trigger and call registered callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const trigger = { id: 'test_trigger' };
      
      storyTracker.onTrigger('test_trigger', callback1);
      storyTracker.onTrigger('test_trigger', callback2);
      
      storyTracker.fireTrigger(trigger, 'eli', 2, { test: true });
      
      expect(callback1).toHaveBeenCalledWith({
        trigger,
        character: 'eli',
        areaNumber: 2,
        eventData: { test: true },
        progress: storyTracker.currentSession.eli
      });
      expect(callback2).toHaveBeenCalled();
    });

    test('should dispatch custom event when trigger fires', () => {
      const trigger = { id: 'test_trigger' };
      
      storyTracker.fireTrigger(trigger, 'maya', 3, {});
      
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'storyTriggerFired',
          detail: expect.objectContaining({
            triggerId: 'test_trigger',
            character: 'maya',
            areaNumber: 3
          })
        })
      );
    });

    test('should handle callback errors gracefully', () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Callback error');
      });
      
      storyTracker.onTrigger('test_trigger', errorCallback);
      
      expect(() => {
        storyTracker.fireTrigger({ id: 'test_trigger' }, 'eli', 1, {});
      }).not.toThrow();
      
      expect(console.error).toHaveBeenCalledWith('Error in trigger callback:', expect.any(Error));
    });

    test('should remove trigger callbacks', () => {
      const callback = jest.fn();
      
      storyTracker.onTrigger('test_trigger', callback);
      storyTracker.offTrigger('test_trigger', callback);
      
      storyTracker.fireTrigger({ id: 'test_trigger' }, 'eli', 1, {});
      
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Trigger Condition Checking', () => {
    test('should check trigger conditions and fire when met', () => {
      const mockTrigger = {
        id: 'eli_tournament_win',
        requiredArea: 2,
        requiredVisits: 1
      };
      
      window.cinematicManager.getTriggerConditions.mockReturnValue([mockTrigger]);
      
      const fireTriggerSpy = jest.spyOn(storyTracker, 'fireTrigger');
      
      storyTracker.trackAreaVisit('eli', 2);
      
      expect(fireTriggerSpy).toHaveBeenCalledWith(mockTrigger, 'eli', 2, expect.any(Object));
    });

    test('should not fire trigger if already completed', () => {
      const mockTrigger = {
        id: 'eli_tournament_win',
        requiredArea: 1
      };
      
      window.cinematicManager.getTriggerConditions.mockReturnValue([mockTrigger]);
      
      // Mark trigger as completed
      storyTracker.currentSession.eli.completedTriggers.push('eli_tournament_win');
      
      const fireTriggerSpy = jest.spyOn(storyTracker, 'fireTrigger');
      
      storyTracker.trackAreaVisit('eli', 2);
      
      expect(fireTriggerSpy).not.toHaveBeenCalled();
    });

    test('should handle missing cinematic manager gracefully', () => {
      window.cinematicManager = undefined;
      
      expect(() => {
        storyTracker.checkTriggerConditions('eli', 2, 'area_visit', {});
      }).not.toThrow();
    });
  });

  describe('Context Detection', () => {
    test('should detect character from body dataset', () => {
      document.body.dataset.character = 'maya';
      
      const context = storyTracker.detectCurrentContext();
      
      expect(context.character).toBe('maya');
    });

    test('should detect area from URL', () => {
      window.location.pathname = '/gameplay-areas/eli/area-3-gambling-platform.html';
      
      const context = storyTracker.detectCurrentContext();
      
      expect(context.area).toBe(3);
    });

    test('should default to area 1 when no area in URL', () => {
      window.location.pathname = '/some-other-page.html';
      
      const context = storyTracker.detectCurrentContext();
      
      expect(context.area).toBe(1);
    });
  });

  describe('Progress Management', () => {
    test('should return progress for specific character', () => {
      storyTracker.trackAreaVisit('stanley', 4);
      
      const progress = storyTracker.getProgress('stanley');
      
      expect(progress.currentArea).toBe(4);
      expect(progress.visitedAreas).toContain(4);
    });

    test('should return null for unknown character', () => {
      const progress = storyTracker.getProgress('unknown');
      
      expect(progress).toBeNull();
    });

    test('should return all progress data', () => {
      const allProgress = storyTracker.getAllProgress();
      
      expect(allProgress.eli).toBeDefined();
      expect(allProgress.maya).toBeDefined();
      expect(allProgress.stanley).toBeDefined();
    });

    test('should reset progress for character', () => {
      storyTracker.trackAreaVisit('eli', 5);
      storyTracker.updateStoryState('eli', 'tournament_wins', 3);
      
      storyTracker.resetProgress('eli');
      
      const progress = storyTracker.getProgress('eli');
      expect(progress.currentArea).toBe(1);
      expect(progress.visitedAreas).toEqual([]);
      expect(progress.storyState.tournament_wins).toBe(0);
    });
  });

  describe('Save/Load Functionality', () => {
    test('should handle save errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });
      
      expect(() => {
        storyTracker.trackAreaVisit('eli', 2);
      }).not.toThrow();
      
      expect(console.warn).toHaveBeenCalledWith('Failed to save story progress:', expect.any(Error));
    });

    test('should save progress in correct format', () => {
      storyTracker.trackAreaVisit('maya', 3);
      
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      
      expect(savedData.maya.currentArea).toBe(3);
      expect(savedData.maya.visitedAreas).toContain(3);
    });
  });
});