/**
 * Comprehensive Test Configuration
 * Configuration for all gaming mechanics testing frameworks
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
 */

const ComprehensiveTestConfig = {
  // Test execution settings
  execution: {
    timeout: 30000, // 30 seconds per test
    retries: 2,
    parallel: true,
    maxWorkers: 4,
    verbose: true
  },

  // Coverage requirements
  coverage: {
    threshold: {
      global: {
        branches: 80,
        functions: 85,
        lines: 85,
        statements: 85
      },
      './Game/Mechanics/': {
        branches: 85,
        functions: 90,
        lines: 90,
        statements: 90
      },
      './js/': {
        branches: 75,
        functions: 80,
        lines: 80,
        statements: 80
      }
    },
    collectCoverageFrom: [
      'Game/Mechanics/**/*.js',
      'js/**/*.js',
      'chroma-bot/**/*.js',
      '!**/node_modules/**',
      '!**/tests/**',
      '!js/three-scene-manager.js'
    ]
  },

  // Character-specific test configurations
  characters: {
    maya: {
      domain: 'dating_safety',
      primaryThreats: ['romance_scams', 'catfishing', 'emotional_manipulation'],
      testScenarios: [
        'dating_profile_analysis',
        'romance_scam_detection',
        'catfish_identification',
        'emotional_manipulation_resistance'
      ],
      educationalGoals: [
        'scam_recognition',
        'verification_skills',
        'emotional_resilience',
        'safe_dating_practices'
      ],
      tools: [
        'reverse_image_search',
        'profile_verifier',
        'communication_analyzer',
        'relationship_red_flag_detector'
      ],
      expectedSuccessRate: 0.85,
      averageCompletionTime: 180000 // 3 minutes
    },
    eli: {
      domain: 'gaming_security',
      primaryThreats: ['account_takeover', 'gaming_scams', 'tournament_fraud'],
      testScenarios: [
        'gaming_account_security',
        'tournament_scam_detection',
        'trade_verification',
        'community_safety_awareness'
      ],
      educationalGoals: [
        'account_protection',
        'scam_awareness',
        'safe_trading',
        'community_vigilance'
      ],
      tools: [
        'account_security_checker',
        'trade_verifier',
        'network_analyzer',
        'tournament_legitimacy_validator'
      ],
      expectedSuccessRate: 0.88,
      averageCompletionTime: 150000 // 2.5 minutes
    },
    stanley: {
      domain: 'elder_fraud_prevention',
      primaryThreats: ['elder_fraud', 'identity_theft', 'government_impersonation'],
      testScenarios: [
        'identity_theft_investigation',
        'government_scam_detection',
        'elder_fraud_awareness',
        'community_protection_building'
      ],
      educationalGoals: [
        'fraud_awareness',
        'protection_strategies',
        'verification_procedures',
        'support_seeking'
      ],
      tools: [
        'document_verifier',
        'fraud_detector',
        'identity_monitor',
        'government_verification_system'
      ],
      expectedSuccessRate: 0.82,
      averageCompletionTime: 240000 // 4 minutes
    }
  },

  // Gaming mechanics test configurations
  mechanics: {
    investigation: {
      testTypes: ['evidence_analysis', 'tool_functionality', 'educational_outcomes'],
      performanceThresholds: {
        analysisAccuracy: 0.9,
        toolEffectiveness: 0.85,
        educationalValue: 0.8
      },
      timeConstraints: {
        evidenceLoading: 2000, // 2 seconds
        analysisProcessing: 5000, // 5 seconds
        resultGeneration: 1000 // 1 second
      }
    },
    realtime_decision: {
      testTypes: ['timer_accuracy', 'decision_processing', 'consequence_application'],
      performanceThresholds: {
        timerAccuracy: 0.95,
        decisionProcessingSpeed: 500, // 500ms
        consequenceRealism: 0.9
      },
      urgencyLevels: {
        low: { timeLimit: 60, tolerance: 5 },
        medium: { timeLimit: 30, tolerance: 3 },
        high: { timeLimit: 15, tolerance: 2 },
        critical: { timeLimit: 10, tolerance: 1 }
      }
    },
    social_engineering_puzzle: {
      testTypes: ['puzzle_generation', 'solution_evaluation', 'educational_feedback'],
      performanceThresholds: {
        puzzleRealism: 0.88,
        educationalEffectiveness: 0.85,
        psychologicalAccuracy: 0.9
      },
      difficultyLevels: {
        beginner: { challenges: 2, timeEstimate: 300000 },
        intermediate: { challenges: 3, timeEstimate: 600000 },
        advanced: { challenges: 4, timeEstimate: 900000 }
      }
    },
    action_sequence: {
      testTypes: ['timing_constraints', 'tool_functionality', 'educational_outcomes'],
      performanceThresholds: {
        timingAccuracy: 0.92,
        toolEffectiveness: 0.88,
        educationalImpact: 0.85
      },
      sequenceTypes: {
        maya: ['evidence_compilation', 'confrontation_preparation', 'intervention_execution'],
        eli: ['security_assessment', 'account_lockdown', 'community_notification'],
        stanley: ['threat_identification', 'containment_actions', 'support_mobilization']
      }
    }
  },

  // Scenario validation criteria
  scenarioValidation: {
    realism: {
      minimumScore: 0.85,
      criteria: [
        'threat_authenticity',
        'language_patterns',
        'behavior_realism',
        'consequence_accuracy'
      ]
    },
    educational: {
      minimumEffectiveness: 0.8,
      criteria: [
        'learning_objective_alignment',
        'skill_development',
        'knowledge_transfer',
        'real_world_application'
      ]
    },
    accessibility: {
      requirements: [
        'clear_instructions',
        'appropriate_difficulty_scaling',
        'cultural_sensitivity',
        'age_appropriate_content'
      ]
    }
  },

  // Performance benchmarks
  performance: {
    loadTimes: {
      mechanic_initialization: 2000, // 2 seconds
      scenario_loading: 3000, // 3 seconds
      character_switching: 1000, // 1 second
      decision_processing: 500 // 500ms
    },
    memoryUsage: {
      baseline: 50 * 1024 * 1024, // 50MB
      maximum: 200 * 1024 * 1024, // 200MB
      warningThreshold: 150 * 1024 * 1024 // 150MB
    },
    concurrency: {
      maxSimultaneousUsers: 10,
      maxActiveMechanics: 5,
      maxActiveScenarios: 3
    }
  },

  // Test data and fixtures
  testData: {
    sampleEvidence: {
      maya: {
        dating_profile: {
          name: 'Alex Johnson',
          photos: ['profile1.jpg', 'profile2.jpg'],
          bio: 'Military engineer deployed overseas',
          inconsistencies: ['stock_photo_usage', 'deployment_claims']
        }
      },
      eli: {
        gaming_account: {
          username: 'ProGamer2024',
          recentLogins: [
            { location: 'Russia', suspicious: true },
            { location: 'USA', suspicious: false }
          ],
          trades: [{ item: 'Rare Skin', value: 500, suspicious: true }]
        }
      },
      stanley: {
        government_communication: {
          sender: 'Social Security Administration',
          message: 'Urgent: Your benefits will be suspended',
          redFlags: ['unsolicited_contact', 'urgency_language', 'personal_info_request']
        }
      }
    },
    mockResponses: {
      investigation_tools: {
        reverse_image_search: {
          success: true,
          findings: { duplicates: 15, source: 'stock_photo' }
        },
        profile_verifier: {
          success: true,
          verification: { authentic: false, confidence: 0.85 }
        }
      }
    }
  },

  // Error handling and recovery
  errorHandling: {
    gracefulDegradation: true,
    fallbackMechanisms: {
      network_failure: 'offline_mode',
      performance_issues: 'quality_reduction',
      mechanic_failure: 'alternative_path'
    },
    retryStrategies: {
      network_requests: { attempts: 3, backoff: 'exponential' },
      mechanic_loading: { attempts: 2, backoff: 'linear' },
      scenario_generation: { attempts: 1, fallback: 'default_scenario' }
    }
  },

  // Reporting and analytics
  reporting: {
    formats: ['console', 'json', 'html'],
    metrics: [
      'test_execution_time',
      'memory_usage',
      'success_rates',
      'coverage_percentages',
      'performance_benchmarks'
    ],
    detailLevel: 'comprehensive',
    includeRecommendations: true
  }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComprehensiveTestConfig;
}

// Make available globally for browser environments
if (typeof window !== 'undefined') {
  window.ComprehensiveTestConfig = ComprehensiveTestConfig;
}