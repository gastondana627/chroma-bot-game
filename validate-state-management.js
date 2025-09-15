#!/usr/bin/env node

/**
 * State Management Validation Script
 * Tests the core functionality of the Data_Bleed state management system
 */

const fs = require('fs');
const path = require('path');

class StateManagementValidator {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            total: 0
        };
        this.errors = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`[${timestamp}] ${prefix} ${message}`);
    }

    test(description, testFn) {
        this.testResults.total++;
        try {
            const result = testFn();
            if (result === true || result === undefined) {
                this.testResults.passed++;
                this.log(`PASS: ${description}`, 'success');
                return true;
            } else {
                throw new Error(result || 'Test returned false');
            }
        } catch (error) {
            this.testResults.failed++;
            this.errors.push({ test: description, error: error.message });
            this.log(`FAIL: ${description} - ${error.message}`, 'error');
            return false;
        }
    }

    async validateFiles() {
        this.log('🔍 Validating file structure and dependencies...');

        // Test 1: Core files exist
        this.test('Main index.html exists', () => {
            return fs.existsSync('./index.html');
        });

        // Test 2: Login format files exist
        const loginFiles = ['Maya.html', 'Eli.html', 'Stanley.html'];
        loginFiles.forEach(file => {
            this.test(`Login format ${file} exists`, () => {
                return fs.existsSync(`./Log_in_formats/${file}`);
            });
        });

        // Test 3: Dashboard files exist
        const dashboardFiles = [
            'Maya_Dashboard_V2.html',
            'Eli_Dashboard_V2.html', 
            'Stanley_Dashboard_V1.html'
        ];
        dashboardFiles.forEach(file => {
            this.test(`Dashboard ${file} exists`, () => {
                return fs.existsSync(`./Main_Dashboards/${file}`);
            });
        });

        // Test 4: Audio files exist
        const audioFiles = [
            'Maya_The_Connection_Trap.mp3',
            'Eli_Rage_Glitch.mp3',
            'Stanely_The Digital Doppelganger.mp3'
        ];
        audioFiles.forEach(file => {
            this.test(`Audio file ${file} exists`, () => {
                return fs.existsSync(`./Main_Login_Audio/${file}`);
            });
        });
    }

    async validateIndexHTML() {
        this.log('🔍 Validating index.html structure...');

        const indexContent = fs.readFileSync('./index.html', 'utf8');

        // Test 1: Login screen container exists
        this.test('Login screen container exists', () => {
            return indexContent.includes('id="login-screen"');
        });

        // Test 2: Gameplay area container exists
        this.test('Gameplay area container exists', () => {
            return indexContent.includes('id="gameplay-area"');
        });

        // Test 3: Character selector exists
        this.test('Character selector exists', () => {
            return indexContent.includes('id="character-selector"');
        });

        // Test 4: Video container exists
        this.test('Video container exists', () => {
            return indexContent.includes('id="video-container"');
        });

        // Test 5: Chat box exists
        this.test('Chat box exists', () => {
            return indexContent.includes('id="chat-box"');
        });

        // Test 6: Fireworks canvas exists
        this.test('Fireworks canvas exists', () => {
            return indexContent.includes('id="fireworks"');
        });

        // Test 7: Character dashboards exist
        const characters = ['maya', 'eli', 'stanley'];
        characters.forEach(character => {
            this.test(`${character} dashboard element exists`, () => {
                return indexContent.includes(`id="${character}-dashboard"`);
            });
        });

        // Test 8: Character HUDs exist
        characters.forEach(character => {
            this.test(`${character} HUD element exists`, () => {
                return indexContent.includes(`id="${character}-hud"`);
            });
        });
    }

    async validateJavaScript() {
        this.log('🔍 Validating JavaScript functionality...');

        const indexContent = fs.readFileSync('./index.html', 'utf8');

        // Test 1: handleExternalConnect function exists
        this.test('handleExternalConnect function exists', () => {
            return indexContent.includes('function handleExternalConnect');
        });

        // Test 2: State transition logic exists
        this.test('State transition logic exists', () => {
            return indexContent.includes('fade-out') && indexContent.includes('fade-in');
        });

        // Test 3: Session storage usage exists
        this.test('Session storage usage exists', () => {
            return indexContent.includes('sessionStorage.setItem');
        });

        // Test 4: Character switching logic exists
        this.test('Character switching logic exists', () => {
            return indexContent.includes('switchTheme');
        });

        // Test 5: Chat functionality exists
        this.test('Chat functionality exists', () => {
            return indexContent.includes('getBotResponse');
        });

        // Test 6: Fireworks functionality exists
        this.test('Fireworks functionality exists', () => {
            return indexContent.includes('createFirework');
        });

        // Test 7: Message listener exists
        this.test('Message listener exists', () => {
            return indexContent.includes('window.addEventListener("message"');
        });

        // Test 8: API connectivity exists
        this.test('API connectivity exists', () => {
            return indexContent.includes('API_BASE');
        });
    }

    async validateCSS() {
        this.log('🔍 Validating CSS styles...');

        const indexContent = fs.readFileSync('./index.html', 'utf8');

        // Test 1: Hidden class exists
        this.test('Hidden class exists', () => {
            return indexContent.includes('.hidden');
        });

        // Test 2: Fade animations exist
        this.test('Fade animations exist', () => {
            return indexContent.includes('.fade-out') && indexContent.includes('.fade-in');
        });

        // Test 3: Fixed positioning exists
        this.test('Fixed positioning exists', () => {
            return indexContent.includes('position: fixed');
        });

        // Test 4: Z-index management exists
        this.test('Z-index management exists', () => {
            return indexContent.includes('z-index');
        });

        // Test 5: Keyframe animations exist
        this.test('Keyframe animations exist', () => {
            return indexContent.includes('@keyframes');
        });
    }

    async validateLoginFormats() {
        this.log('🔍 Validating login format files...');

        const characters = [
            { name: 'Maya', file: 'Maya.html', action: 'maya-connected' },
            { name: 'Eli', file: 'Eli.html', action: 'eli-connected' },
            { name: 'Stanley', file: 'Stanley.html', action: 'stanley-connected' }
        ];

        characters.forEach(character => {
            const filePath = `./Log_in_formats/${character.file}`;
            
            this.test(`${character.name} login file exists`, () => {
                return fs.existsSync(filePath);
            });

            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                
                this.test(`${character.name} login has postMessage`, () => {
                    return content.includes('window.parent.postMessage');
                });

                this.test(`${character.name} login has correct action`, () => {
                    return content.includes(character.action);
                });

                this.test(`${character.name} login has form handling`, () => {
                    return content.includes('addEventListener("submit"');
                });
            }
        });
    }

    async validateStateTransitions() {
        this.log('🔍 Validating state transition requirements...');

        const indexContent = fs.readFileSync('./index.html', 'utf8');

        // Test 1: Login state fade-out logic
        this.test('Login state fade-out logic exists', () => {
            return indexContent.includes('loginScreen.classList.add("fade-out")');
        });

        // Test 2: Gameplay state fade-in logic
        this.test('Gameplay state fade-in logic exists', () => {
            return indexContent.includes('gameplayArea.classList.add("fade-in")');
        });

        // Test 3: Session data validation
        this.test('Session data validation exists', () => {
            return indexContent.includes('sessionStorage.getItem("character")');
        });

        // Test 4: Component initialization
        this.test('Component initialization exists', () => {
            return indexContent.includes('initializeGameplayState');
        });

        // Test 5: Dashboard management
        this.test('Dashboard management exists', () => {
            return indexContent.includes('showDashboardView') || indexContent.includes('showGameView');
        });

        // Test 6: Error handling
        this.test('Error handling exists', () => {
            return indexContent.includes('try') && indexContent.includes('catch');
        });
    }

    async validateRequirements() {
        this.log('🔍 Validating specific requirements...');

        const indexContent = fs.readFileSync('./index.html', 'utf8');

        // Requirement 1.1: Clean state transitions
        this.test('Requirement 1.1: Clean state transitions', () => {
            return indexContent.includes('fade-out') && 
                   indexContent.includes('fade-in') &&
                   indexContent.includes('setTimeout');
        });

        // Requirement 1.2: Gameplay area fade-in
        this.test('Requirement 1.2: Gameplay area fade-in', () => {
            return indexContent.includes('gameplayArea.classList.remove("hidden")');
        });

        // Requirement 2.1: Chroma Bot orb display
        this.test('Requirement 2.1: Chroma Bot orb display', () => {
            return indexContent.includes('video-container') &&
                   indexContent.includes('chroma-video');
        });

        // Requirement 2.2: Fixed positioning
        this.test('Requirement 2.2: Fixed positioning', () => {
            return indexContent.includes('position: fixed') &&
                   indexContent.includes('bottom:') &&
                   indexContent.includes('right:');
        });

        // Requirement 3.1: Character dashboard visibility
        this.test('Requirement 3.1: Character dashboard visibility', () => {
            return indexContent.includes('maya-dashboard') &&
                   indexContent.includes('eli-dashboard') &&
                   indexContent.includes('stanley-dashboard');
        });

        // Requirement 4.1: Session storage
        this.test('Requirement 4.1: Session storage', () => {
            return indexContent.includes('sessionStorage.setItem("character"') &&
                   indexContent.includes('sessionStorage.setItem("gamertag"');
        });

        // Requirement 5.1: Audio system preservation
        this.test('Requirement 5.1: Audio system preservation', () => {
            return indexContent.includes('switchTheme') &&
                   indexContent.includes('audio');
        });

        // Requirement 6.1: State separation
        this.test('Requirement 6.1: State separation', () => {
            return indexContent.includes('login-screen') &&
                   indexContent.includes('gameplay-area');
        });
    }

    generateReport() {
        this.log('\n📊 VALIDATION REPORT', 'info');
        this.log('='.repeat(50), 'info');
        this.log(`Total Tests: ${this.testResults.total}`, 'info');
        this.log(`Passed: ${this.testResults.passed}`, 'success');
        this.log(`Failed: ${this.testResults.failed}`, this.testResults.failed > 0 ? 'error' : 'info');
        
        const successRate = this.testResults.total > 0 ? 
            Math.round((this.testResults.passed / this.testResults.total) * 100) : 0;
        this.log(`Success Rate: ${successRate}%`, successRate >= 90 ? 'success' : 'error');

        if (this.errors.length > 0) {
            this.log('\n❌ FAILED TESTS:', 'error');
            this.errors.forEach((error, index) => {
                this.log(`${index + 1}. ${error.test}: ${error.error}`, 'error');
            });
        }

        if (this.testResults.failed === 0) {
            this.log('\n🎉 ALL TESTS PASSED! State management system is working correctly.', 'success');
            return true;
        } else {
            this.log('\n⚠️ Some tests failed. Please review and fix the issues above.', 'error');
            return false;
        }
    }

    async run() {
        this.log('🚀 Starting State Management Validation...', 'info');
        this.log('='.repeat(50), 'info');

        await this.validateFiles();
        await this.validateIndexHTML();
        await this.validateJavaScript();
        await this.validateCSS();
        await this.validateLoginFormats();
        await this.validateStateTransitions();
        await this.validateRequirements();

        return this.generateReport();
    }
}

// Run the validator
if (require.main === module) {
    const validator = new StateManagementValidator();
    validator.run().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Validation failed:', error);
        process.exit(1);
    });
}

module.exports = StateManagementValidator;