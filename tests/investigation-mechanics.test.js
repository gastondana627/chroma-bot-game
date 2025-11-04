/**
 * Investigation Mechanics Unit Tests
 * Tests for investigation engine, evidence database, and character-specific tools
 * Requirements: 9.1, 9.2, 9.3
 */

const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

// Load the modules under test
const { InvestigationEngine, ToolRegistry } = require('../Game/Mechanics/investigation-engine.js');
const { EvidenceDatabase } = require('../Game/Mechanics/evidence-database.js');
const { MayaInvestigationTools, EliInvestigationTools, StanleyInvestigationTools } = require('../Game/Mechanics/character-investigation-tools.js');

describe('Investigation Engine', () => {
  let investigationEngine;
  let mockEvidenceDatabase;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock character tools manager
    global.window = {
      ...global.window,
      characterToolsManager: {
        initialize: jest.fn(() => Promise.resolve()),
        getAvailableToolsForCharacter: jest.fn(() => []),
        executeToolAnalysis: jest.fn(() => Promise.resolve({
          success: true,
          findings: { test: 'result' },
          educationalPoints: ['Test point']
        }))
      }
    };
    
    investigationEngine = new InvestigationEngine();
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with empty state', () => {
      expect(investigationEngine.evidenceDatabase).toBeInstanceOf(Map);
      expect(investigationEngine.analysisTools).toBeDefined();
      expect(investigationEngine.investigationState).toBeInstanceOf(Map);
      expect(investigationEngine.activeInvestigations).toBeInstanceOf(Map);
    });

    test('should initialize analysis tools registry', () => {
      const tool = investigationEngine.analysisTools.getTool('metadata_viewer');
      expect(tool).toBeDefined();
      expect(tool.name).toBe('Metadata Viewer');
      expect(tool.supportedTypes).toContain('image');
    });

    test('should initialize character tools integration', async () => {
      await investigationEngine.initializeCharacterTools();
      expect(investigationEngine.characterToolsManager).toBeDefined();
    });
  });

  describe('Investigation Session Management', () => {
    test('should start investigation with valid scenario', () => {
      const scenarioConfig = {
        evidence: [
          {
            id: 'test_evidence',
            type: 'image',
            title: 'Test Image',
            content: { url: 'test.jpg' }
          }
        ],
        objectives: [
          {
            id: 'verify_image',
            description: 'Verify image authenticity'
          }
        ]
      };

      const result = investigationEngine.startInvestigation('test_scenario', 'maya', scenarioConfig);

      expect(result.investigationId).toBe('test_scenario');
      expect(result.evidence).toHaveLength(1);
      expect(result.tools).toBeDefined();
      expect(result.objectives).toHaveLength(1);
      expect(result.initialGuidance).toContain('dating profiles');
    });

    test('should track active investigations', () => {
      const scenarioConfig = { evidence: [], objectives: [] };
      
      investigationEngine.startInvestigation('test_scenario', 'eli', scenarioConfig);
      
      const investigation = investigationEngine.activeInvestigations.get('test_scenario');
      expect(investigation).toBeDefined();
      expect(investigation.character).toBe('eli');
      expect(investigation.state).toBe('active');
    });

    test('should get investigation progress', () => {
      const scenarioConfig = { evidence: [], objectives: [] };
      investigationEngine.startInvestigation('test_scenario', 'stanley', scenarioConfig);
      
      const progress = investigationEngine.getProgress('test_scenario');
      
      expect(progress).toBeDefined();
      expect(progress.completionPercentage).toBe(0);
      expect(progress.evidenceAnalyzed).toEqual([]);
    });
  });

  describe('Evidence Analysis', () => {
    beforeEach(() => {
      const scenarioConfig = {
        evidence: [
          {
            id: 'test_evidence',
            type: 'image',
            title: 'Test Image',
            metadata: {
              created: '2024-01-01',
              location: 'Unknown',
              suspicious: ['No location data']
            }
          }
        ],
        objectives: []
      };
      investigationEngine.startInvestigation('test_scenario', 'maya', scenarioConfig);
    });

    test('should analyze evidence with metadata viewer', () => {
      const result = investigationEngine.analyzeEvidence(
        'test_scenario',
        'test_evidence',
        'metadata_viewer',
        {}
      );

      expect(result.result.success).toBe(true);
      expect(result.result.type).toBe('metadata');
      expect(result.result.findings.creationDate).toBe('2024-01-01');
      expect(result.feedback).toBeDefined();
      expect(result.progress.evidenceAnalyzed).toContain('test_evidence');
    });

    test('should handle invalid investigation ID', () => {
      expect(() => {
        investigationEngine.analyzeEvidence('invalid_id', 'test_evidence', 'metadata_viewer', {});
      }).toThrow('Investigation not found or not active');
    });

    test('should handle invalid evidence ID', () => {
      expect(() => {
        investigationEngine.analyzeEvidence('test_scenario', 'invalid_evidence', 'metadata_viewer', {});
      }).toThrow('Evidence or tool not found');
    });

    test('should handle invalid tool ID', () => {
      expect(() => {
        investigationEngine.analyzeEvidence('test_scenario', 'test_evidence', 'invalid_tool', {});
      }).toThrow('Evidence or tool not found');
    });

    test('should update investigation progress after analysis', () => {
      investigationEngine.analyzeEvidence('test_scenario', 'test_evidence', 'metadata_viewer', {});
      
      const progress = investigationEngine.getProgress('test_scenario');
      expect(progress.completionPercentage).toBe(100); // 1 evidence analyzed out of 1
      expect(progress.toolsUsed).toContain('metadata_viewer');
    });

    test('should generate educational feedback', () => {
      const result = investigationEngine.analyzeEvidence(
        'test_scenario',
        'test_evidence',
        'metadata_viewer',
        {}
      );

      expect(result.feedback.character).toBe('maya');
      expect(result.feedback.educationalPoints).toContain('Dating profile verification is crucial for online safety');
    });
  });

  describe('Tool Registry', () => {
    test('should register and retrieve tools', () => {
      const toolRegistry = new ToolRegistry();
      
      toolRegistry.registerTool('test_tool', {
        name: 'Test Tool',
        description: 'Test description',
        supportedTypes: ['test'],
        analyze: () => ({ success: true })
      });

      const tool = toolRegistry.getTool('test_tool');
      expect(tool.name).toBe('Test Tool');
      expect(tool.supportedTypes).toContain('test');
    });

    test('should get tools by type', () => {
      const toolRegistry = new ToolRegistry();
      
      toolRegistry.registerTool('image_tool', {
        supportedTypes: ['image']
      });
      toolRegistry.registerTool('document_tool', {
        supportedTypes: ['document']
      });

      const imageTools = toolRegistry.getToolsByType('image');
      expect(imageTools).toHaveLength(1);
      expect(imageTools[0].id).toBe('image_tool');
    });
  });

  describe('Character-Specific Tools', () => {
    test('should get available tools for Maya', () => {
      const tools = investigationEngine.getAvailableTools('maya');
      
      expect(tools.some(tool => tool.id === 'reverse_image_search')).toBe(true);
      expect(tools.some(tool => tool.id === 'profile_verifier')).toBe(true);
    });

    test('should get available tools for Eli', () => {
      const tools = investigationEngine.getAvailableTools('eli');
      
      expect(tools.some(tool => tool.id === 'network_analyzer')).toBe(true);
      expect(tools.some(tool => tool.id === 'profile_verifier')).toBe(true);
    });

    test('should get available tools for Stanley', () => {
      const tools = investigationEngine.getAvailableTools('stanley');
      
      expect(tools.some(tool => tool.id === 'document_verifier')).toBe(true);
      expect(tools.some(tool => tool.id === 'communication_analyzer')).toBe(true);
    });

    test('should include character-specific tools', () => {
      const mayaTools = investigationEngine.getAvailableTools('maya');
      const characterSpecificTool = mayaTools.find(tool => tool.type === 'character_specific');
      
      expect(characterSpecificTool).toBeDefined();
      expect(characterSpecificTool.character).toBe('maya');
    });
  });

  describe('Analysis Methods', () => {
    test('should analyze metadata correctly', () => {
      const evidence = {
        metadata: {
          created: '2024-01-01',
          location: 'New York',
          device: 'iPhone 12',
          suspicious: ['Modified timestamp']
        }
      };

      const result = investigationEngine.analyzeMetadata(evidence, {});

      expect(result.success).toBe(true);
      expect(result.type).toBe('metadata');
      expect(result.findings.creationDate).toBe('2024-01-01');
      expect(result.findings.location).toBe('New York');
      expect(result.riskIndicators).toContain('Modified timestamp');
    });

    test('should perform reverse image search', () => {
      const evidence = {
        reverseSearch: {
          source: 'Stock photo website',
          duplicates: 15,
          firstSeen: '2020-01-01',
          contexts: ['Dating sites', 'Social media'],
          suspicious: ['Multiple profiles']
        }
      };

      const result = investigationEngine.performReverseImageSearch(evidence, {});

      expect(result.success).toBe(true);
      expect(result.type).toBe('reverse_search');
      expect(result.findings.originalSource).toBe('Stock photo website');
      expect(result.findings.duplicates).toBe(15);
      expect(result.riskIndicators).toContain('Multiple profiles');
    });

    test('should analyze communication patterns', () => {
      const evidence = {
        communication: {
          patterns: ['Love bombing', 'Urgency creation'],
          urgency: 'high',
          tactics: ['Emotional manipulation'],
          authentic: false,
          suspicious: ['Financial request']
        }
      };

      const result = investigationEngine.analyzeCommunicationPatterns(evidence, {});

      expect(result.success).toBe(true);
      expect(result.type).toBe('communication');
      expect(result.findings.languagePatterns).toContain('Love bombing');
      expect(result.findings.urgencyLevel).toBe('high');
      expect(result.riskIndicators).toContain('Financial request');
    });
  });

  describe('Findings Compilation', () => {
    beforeEach(() => {
      const scenarioConfig = {
        evidence: [{ id: 'test_evidence', type: 'image' }],
        objectives: [
          {
            id: 'verify_image',
            description: 'Verify image authenticity'
          }
        ]
      };
      investigationEngine.startInvestigation('test_scenario', 'maya', scenarioConfig);
    });

    test('should compile investigation findings', () => {
      const selectedFindings = [
        {
          objectiveId: 'verify_image',
          finding: 'Image is likely fake',
          correct: true
        }
      ];

      const compilation = investigationEngine.compileFindings('test_scenario', selectedFindings);

      expect(compilation.investigationId).toBe('test_scenario');
      expect(compilation.character).toBe('maya');
      expect(compilation.findings).toEqual(selectedFindings);
      expect(compilation.recommendations).toBeDefined();
      expect(compilation.accuracyScore).toBe(100);
    });

    test('should calculate accuracy score correctly', () => {
      const objectives = [
        { id: 'obj1' },
        { id: 'obj2' }
      ];
      const findings = [
        { objectiveId: 'obj1', correct: true },
        { objectiveId: 'obj2', correct: false }
      ];

      const score = investigationEngine.calculateAccuracyScore(findings, objectives);
      expect(score).toBe(50); // 1 correct out of 2
    });

    test('should mark investigation as completed after compilation', () => {
      investigationEngine.compileFindings('test_scenario', []);
      
      const investigation = investigationEngine.activeInvestigations.get('test_scenario');
      expect(investigation.state).toBe('completed');
      expect(investigation.progress.completionPercentage).toBe(100);
    });
  });
});

describe('Evidence Database', () => {
  let evidenceDatabase;

  beforeEach(() => {
    evidenceDatabase = new EvidenceDatabase();
  });

  describe('Evidence Storage and Retrieval', () => {
    test('should store evidence with generated ID', () => {
      const evidenceData = {
        type: 'image',
        title: 'Test Image',
        content: { url: 'test.jpg' }
      };

      const evidenceId = evidenceDatabase.storeEvidence(evidenceData);

      expect(evidenceId).toMatch(/^evidence_\d+_[a-z0-9]+$/);
      
      const retrieved = evidenceDatabase.getEvidence(evidenceId);
      expect(retrieved.type).toBe('image');
      expect(retrieved.title).toBe('Test Image');
      expect(retrieved.accessed).toBe(1);
    });

    test('should track evidence access', () => {
      const evidenceId = evidenceDatabase.storeEvidence({ type: 'document' });
      
      evidenceDatabase.getEvidence(evidenceId);
      evidenceDatabase.getEvidence(evidenceId);
      
      const evidence = evidenceDatabase.getEvidence(evidenceId);
      expect(evidence.accessed).toBe(3);
      expect(evidence.lastAccessed).toBeDefined();
    });

    test('should return null for non-existent evidence', () => {
      const result = evidenceDatabase.getEvidence('non_existent_id');
      expect(result).toBeUndefined();
    });
  });

  describe('Scenario Management', () => {
    test('should create scenario with evidence', () => {
      const scenarioConfig = {
        character: 'maya',
        title: 'Test Scenario',
        description: 'Test description',
        evidence: [
          {
            type: 'profile_data',
            title: 'Dating Profile',
            content: { name: 'Test User' }
          }
        ],
        objectives: [
          {
            id: 'verify_profile',
            description: 'Verify profile authenticity'
          }
        ]
      };

      const scenarioId = evidenceDatabase.createScenario(scenarioConfig);

      expect(scenarioId).toMatch(/^scenario_\d+_[a-z0-9]+$/);
      
      const scenario = evidenceDatabase.getScenario(scenarioId);
      expect(scenario.character).toBe('maya');
      expect(scenario.title).toBe('Test Scenario');
      expect(scenario.evidenceIds).toHaveLength(1);
    });

    test('should get scenarios by character', () => {
      const initialEliCount = evidenceDatabase.getScenariosByCharacter('eli').length;
      
      evidenceDatabase.createScenario({ character: 'eli', title: 'Eli Scenario' });
      evidenceDatabase.createScenario({ character: 'maya', title: 'Maya Scenario' });
      evidenceDatabase.createScenario({ character: 'eli', title: 'Another Eli Scenario' });

      const eliScenarios = evidenceDatabase.getScenariosByCharacter('eli');
      expect(eliScenarios).toHaveLength(initialEliCount + 2);
      expect(eliScenarios.every(s => s.character === 'eli')).toBe(true);
    });

    test('should get evidence by scenario', () => {
      const scenarioConfig = {
        character: 'stanley',
        evidence: [
          { type: 'document', title: 'Document 1' },
          { type: 'communication', title: 'Message 1' }
        ]
      };

      const scenarioId = evidenceDatabase.createScenario(scenarioConfig);
      const evidence = evidenceDatabase.getEvidenceByScenario(scenarioId);

      expect(evidence).toHaveLength(2);
      expect(evidence[0].type).toBe('document');
      expect(evidence[1].type).toBe('communication');
    });
  });

  describe('Evidence Search and Categorization', () => {
    let testEvidenceDatabase;
    
    beforeEach(() => {
      // Create a fresh database without default scenarios for these tests
      testEvidenceDatabase = new EvidenceDatabase();
      testEvidenceDatabase.scenarios.clear();
      testEvidenceDatabase.evidence.clear();
      testEvidenceDatabase.categories.forEach(cat => cat.evidenceIds = []);
      
      testEvidenceDatabase.storeEvidence({
        type: 'image_evidence',
        title: 'Profile Photo',
        content: { description: 'Dating profile photo' }
      });
      testEvidenceDatabase.storeEvidence({
        type: 'digital_communication',
        title: 'Chat Messages',
        content: { messages: ['Hello', 'How are you?'] }
      });
    });

    test('should get evidence by category', () => {
      const imageEvidence = testEvidenceDatabase.getEvidenceByCategory('image_evidence');
      expect(imageEvidence).toHaveLength(1);
      expect(imageEvidence[0].title).toBe('Profile Photo');
    });

    test('should search evidence by criteria', () => {
      const results = testEvidenceDatabase.searchEvidence({
        type: 'digital_communication'
      });

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Chat Messages');
    });

    test('should search evidence by title', () => {
      const results = testEvidenceDatabase.searchEvidence({
        title: 'photo'
      });

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Profile Photo');
    });
  });

  describe('Default Evidence Loading', () => {
    test('should load Maya dating scenario by default', () => {
      const mayaScenarios = evidenceDatabase.getScenariosByCharacter('maya');
      expect(mayaScenarios.length).toBeGreaterThan(0);
      
      const datingScenario = mayaScenarios.find(s => s.title.includes('Dating Profile'));
      expect(datingScenario).toBeDefined();
      expect(datingScenario.evidenceIds.length).toBeGreaterThan(0);
    });

    test('should load Eli gaming scenario by default', () => {
      const eliScenarios = evidenceDatabase.getScenariosByCharacter('eli');
      expect(eliScenarios.length).toBeGreaterThan(0);
      
      const gamingScenario = eliScenarios.find(s => s.title.includes('Gaming Account'));
      expect(gamingScenario).toBeDefined();
      expect(gamingScenario.evidenceIds.length).toBeGreaterThan(0);
    });

    test('should load Stanley identity theft scenario by default', () => {
      const stanleyScenarios = evidenceDatabase.getScenariosByCharacter('stanley');
      expect(stanleyScenarios.length).toBeGreaterThan(0);
      
      const identityScenario = stanleyScenarios.find(s => s.title.includes('Identity Theft'));
      expect(identityScenario).toBeDefined();
      expect(identityScenario.evidenceIds.length).toBeGreaterThan(0);
    });
  });
});

describe('Character Investigation Tools', () => {
  describe('Maya Investigation Tools', () => {
    let mayaTools;

    beforeEach(() => {
      mayaTools = new MayaInvestigationTools();
    });

    test('should initialize with correct character settings', () => {
      expect(mayaTools.character).toBe('maya');
      expect(mayaTools.domain).toBe('dating_safety');
    });

    test('should verify dating profile with risk assessment', () => {
      const profileData = {
        content: {
          name: 'Alex Johnson',
          profession: 'Military Engineer',
          bio: 'Looking for serious relationship. Currently deployed overseas.',
          photos: ['profile1.jpg', 'profile2.jpg'],
          quality: 'Professional'
        },
        profile: {
          consistent: false,
          verified: false,
          anomalies: ['Military claims without verification'],
          suspicious: ['Deployment story']
        }
      };

      const result = mayaTools.verifyDatingProfile(profileData);

      expect(result.success).toBe(true);
      expect(result.analysis.character).toBe('maya');
      expect(result.analysis.redFlags).toContain('military_claim');
      expect(result.analysis.redFlags).toContain('deployment_story');
      expect(result.analysis.riskScore).toBeGreaterThan(0);
      expect(result.recommendations).toBeDefined();
    });

    test('should perform advanced reverse image search', () => {
      const imageData = {
        reverseSearch: {
          source: 'Stock photo website',
          duplicates: 15,
          firstSeen: '2020-03-10',
          contexts: ['Dating sites', 'Romance scams']
        },
        metadata: {
          location: 'Not available',
          device: 'Unknown'
        }
      };

      const result = mayaTools.performAdvancedReverseImageSearch(imageData);

      expect(result.success).toBe(true);
      expect(result.searchResult.character).toBe('maya');
      expect(result.searchResult.datingSpecificFindings.datingProfileUsage).toBeGreaterThan(0);
      expect(result.searchResult.datingSpecificFindings.riskAssessment).toBe('high');
      expect(result.verificationTips).toContain('Use multiple reverse image search engines (Google, TinEye, Yandex)');
    });

    test('should analyze romance communication patterns', () => {
      const communicationData = {
        content: {
          messages: [
            'Hello beautiful, I saw your profile and felt instant connection',
            'I am military engineer deployed in Syria, looking for true love',
            'Can you help me with small financial emergency? Will pay back soon'
          ]
        }
      };

      const result = mayaTools.analyzeRomanceCommunication(communicationData);

      expect(result.success).toBe(true);
      expect(result.analysis.character).toBe('maya');
      expect(result.analysis.manipulationTactics.length).toBeGreaterThan(0);
      expect(result.analysis.manipulationTactics.some(t => t.tactic === 'Love Bombing' || t.tactic === 'Financial Manipulation')).toBe(true);
      expect(result.warningSignsIdentified.length).toBeGreaterThan(0);
    });

    test('should calculate risk score accurately', () => {
      const redFlags = ['military_claim', 'deployment_story', 'professional_photos', 'urgency_language'];
      const riskScore = mayaTools.calculateRiskScore(redFlags);

      expect(riskScore).toBeGreaterThan(50);
      expect(riskScore).toBeLessThanOrEqual(100);
    });

    test('should generate appropriate educational feedback', () => {
      const analysis = {
        riskScore: 80,
        redFlags: ['military_claim', 'professional_photos']
      };

      const feedback = mayaTools.generateDatingEducationalFeedback(analysis);

      expect(feedback).toContain('High-risk profile detected - multiple red flags present');
      expect(feedback).toContain('Professional-quality photos may be stolen from stock photo sites');
    });
  });

  describe('Eli Investigation Tools', () => {
    let eliTools;

    beforeEach(() => {
      eliTools = new EliInvestigationTools();
    });

    test('should initialize with correct character settings', () => {
      expect(eliTools.character).toBe('eli');
      expect(eliTools.domain).toBe('gaming_security');
    });

    test('should verify gaming trades for fraud', () => {
      const tradeData = {
        content: {
          trades: [
            { item: 'Rare Skin', value: '$500', buyer: 'QuickCash99' }
          ],
          messages: [
            'Send me your items first, I am trusted trader with many vouches',
            'Hurry up! This offer expires in 10 minutes!'
          ],
          joinDate: '2024-01-01',
          reputation: '5 stars (50 reviews)'
        }
      };

      const result = eliTools.verifyGamingTrade(tradeData);

      expect(result.success).toBe(true);
      expect(result.analysis.character).toBe('eli');
      expect(result.analysis.fraudIndicators).toContain('advance_payment_request');
      expect(result.analysis.fraudIndicators).toContain('urgency_pressure');
      expect(result.analysis.riskScore).toBeGreaterThan(0);
    });

    test('should analyze account security', () => {
      const accountData = {
        content: {
          recentLogins: [
            { time: '2024-01-20 03:00', location: 'Russia', ip: '185.220.101.5' },
            { time: '2024-01-20 15:30', location: 'USA', ip: '192.168.1.100' }
          ],
          trades: [
            { item: 'Tournament Pass', value: '$200', buyer: 'FastTrade2024' }
          ]
        },
        network: {
          ip: '185.220.101.5',
          location: 'Moscow, Russia',
          provider: 'Unknown VPN',
          reputation: 'suspicious'
        }
      };

      const result = eliTools.analyzeAccountSecurity(accountData);

      expect(result.success).toBe(true);
      expect(result.analysis.character).toBe('eli');
      expect(result.analysis.compromiseIndicators).toContain('suspicious_ip_detected');
      expect(result.analysis.compromiseIndicators.length).toBeGreaterThan(0);
      expect(result.analysis.securityScore).toBeLessThan(100);
    });

    test('should detect gaming scams', () => {
      const scamData = {
        content: {
          messages: [
            'Hey bro, want to trade rare skins? I give you good deal!',
            'Send me your items first, I am trusted trader',
            'Hurry up! This offer expires in 10 minutes!'
          ]
        }
      };

      const result = eliTools.detectGamingScam(scamData);

      expect(result.success).toBe(true);
      expect(result.analysis.character).toBe('eli');
      expect(result.analysis.scamType).toBe('trading_scam');
      expect(result.analysis.scamIndicators).toContain('advance_fee_trading');
      expect(result.analysis.confidenceLevel).toBeGreaterThan(0);
    });
  });

  describe('Stanley Investigation Tools', () => {
    let stanleyTools;

    beforeEach(() => {
      stanleyTools = new StanleyInvestigationTools();
    });

    test('should initialize with correct character settings', () => {
      expect(stanleyTools.character).toBe('stanley');
      expect(stanleyTools.domain).toBe('elder_fraud_prevention');
    });

    test('should detect identity theft indicators', () => {
      const identityData = {
        content: {
          messages: ['We need to verify your Social Security number'],
          transactions: [
            { date: '2024-01-18', amount: '$50', description: 'Medicare Verification Fee' }
          ]
        }
      };

      const result = stanleyTools.detectIdentityTheft(identityData);

      expect(result.success).toBe(true);
      expect(result.analysis.character).toBe('stanley');
      expect(result.analysis.theftIndicators).toContain('ssn_exposure');
      expect(result.analysis.theftIndicators).toContain('verification_fees');
      expect(result.analysis.riskScore).toBeGreaterThan(0);
    });

    test('should verify document authenticity', () => {
      const documentData = {
        document: {
          authentic: false,
          issuer: 'Fake government agency',
          marks: ['Missing official seal', 'Incorrect formatting'],
          altered: true,
          suspicious: ['Urgency language', 'Spelling errors']
        },
        content: {
          content: 'Your benefits will be suspended unless you verify immediately'
        }
      };

      const result = stanleyTools.verifyDocument(documentData);

      expect(result.success).toBe(true);
      expect(result.analysis.character).toBe('stanley');
      expect(result.analysis.forgeryIndicators).toContain('missing_official_seal');
      expect(result.analysis.forgeryIndicators.length).toBeGreaterThan(2);
      expect(result.analysis.authenticityScore).toBeLessThan(50);
    });

    test('should detect elder fraud schemes', () => {
      const fraudData = {
        content: {
          sender: 'Social Security Administration',
          message: 'This is urgent call about your Medicare benefits. We need to verify your Social Security number to prevent suspension.'
        },
        communication: {
          patterns: ['Authority impersonation', 'Urgency creation'],
          urgency: 'critical',
          tactics: ['Fear tactics'],
          suspicious: ['Unsolicited call', 'SSN request']
        }
      };

      const result = stanleyTools.detectElderFraud(fraudData);

      expect(result.success).toBe(true);
      expect(result.analysis.character).toBe('stanley');
      expect(result.analysis.fraudType).toBe('government_benefit_scam');
      expect(result.analysis.fraudIndicators).toContain('government_impersonation');
      expect(result.analysis.targetingTactics).toContain('Authority Impersonation');
    });
  });
});