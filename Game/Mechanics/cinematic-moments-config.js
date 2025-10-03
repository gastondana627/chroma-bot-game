/**
 * Cinematic Moments Configuration
 * Defines specific story beats and trigger conditions for 3D character emergence
 */

const CinematicMomentsConfig = {
    // Eli's Cinematic Moments
    eli: {
        // Tournament Arena Victory (Area 2 - S3 equivalent)
        tournament_victory: {
            id: 'eli_tournament_victory',
            character: 'eli',
            area: 2,
            title: 'Tournament Victory',
            description: 'Eli achieves his first major tournament win',
            
            // Trigger conditions
            triggerConditions: {
                requiredArea: 2,
                stateConditions: {
                    tournament_wins: 1
                },
                eventTriggers: ['tournament_completed', 'victory_achieved']
            },
            
            // 3D cinematic configuration
            cinematicConfig: {
                duration: 8000, // 8 seconds
                character: {
                    model: 'eli_3d_model',
                    animation: 'victory_celebration',
                    expression: 'triumphant',
                    gesture: 'fist_pump'
                },
                lighting: {
                    theme: 'tournament_arena',
                    colors: ['#00FFFF', '#FF0080', '#7928CA'],
                    intensity: 'high',
                    effects: ['neon_glow', 'victory_sparkles']
                },
                camera: {
                    angle: 'heroic_low',
                    movement: 'slow_zoom_in',
                    focus: 'character_face'
                },
                dialogue: {
                    text: "YES! That was incredible! I can't believe I actually won that tournament. All those hours of practice finally paid off!",
                    voiceStyle: 'excited',
                    timing: 'synchronized'
                }
            },
            
            // Requirements mapping
            requirements: ['5.1', '7.1', '7.5']
        },

        // Gaming Community Peer Pressure Peak (Area 4 - S5 equivalent)
        peer_pressure_peak: {
            id: 'eli_peer_pressure_peak',
            character: 'eli',
            area: 4,
            title: 'Peer Pressure Resistance',
            description: 'Eli faces intense peer pressure but learns to resist exploitation',
            
            triggerConditions: {
                requiredArea: 4,
                stateConditions: {
                    peer_pressure_encounters: 3,
                    tournament_wins: 2
                },
                eventTriggers: ['peer_pressure_event', 'exploitation_attempt']
            },
            
            cinematicConfig: {
                duration: 10000, // 10 seconds
                character: {
                    model: 'eli_3d_model',
                    animation: 'determined_stance',
                    expression: 'resolute',
                    gesture: 'defensive_posture'
                },
                lighting: {
                    theme: 'gaming_community',
                    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
                    intensity: 'medium',
                    effects: ['tension_shadows', 'resolve_glow']
                },
                camera: {
                    angle: 'eye_level',
                    movement: 'steady_focus',
                    focus: 'character_eyes'
                },
                dialogue: {
                    text: "I know what you're trying to do, and I'm not falling for it. My gaming skills aren't for sale, and neither am I.",
                    voiceStyle: 'firm',
                    timing: 'deliberate'
                }
            },
            
            requirements: ['5.1', '7.1', '7.5']
        },

        // Championship Victory Finale (Area 6 - S6 equivalent)
        championship_finale: {
            id: 'eli_championship_finale',
            character: 'eli',
            area: 6,
            title: 'Championship Victory',
            description: 'Eli wins the ultimate championship and becomes a role model',
            
            triggerConditions: {
                requiredArea: 6,
                stateConditions: {
                    championship_progress: 100,
                    tournament_wins: 5
                },
                eventTriggers: ['championship_final', 'ultimate_victory']
            },
            
            cinematicConfig: {
                duration: 12000, // 12 seconds
                character: {
                    model: 'eli_3d_model',
                    animation: 'champion_celebration',
                    expression: 'proud',
                    gesture: 'trophy_raise'
                },
                lighting: {
                    theme: 'championship_victory',
                    colors: ['#FFD700', '#FFA500', '#FF69B4'],
                    intensity: 'maximum',
                    effects: ['golden_aura', 'champion_sparkles', 'victory_beams']
                },
                camera: {
                    angle: 'epic_wide',
                    movement: 'triumphant_circle',
                    focus: 'full_character'
                },
                dialogue: {
                    text: "This is it! I've proven that you can succeed in gaming while staying true to yourself. Time to inspire others to do the same!",
                    voiceStyle: 'inspirational',
                    timing: 'epic'
                }
            },
            
            requirements: ['5.1', '7.1', '7.5']
        }
    },

    // Maya's Cinematic Moments
    maya: {
        // Dating App Suspicious Match (Area 2 - S3 equivalent)
        suspicious_match_detection: {
            id: 'maya_suspicious_match',
            character: 'maya',
            area: 2,
            title: 'Suspicious Match Detected',
            description: 'Maya discovers a suspicious dating profile that triggers her investigation instincts',
            
            triggerConditions: {
                requiredArea: 2,
                stateConditions: {
                    suspicious_matches: 1
                },
                eventTriggers: ['profile_analysis', 'red_flag_detected']
            },
            
            cinematicConfig: {
                duration: 9000, // 9 seconds
                character: {
                    model: 'maya_3d_model',
                    animation: 'investigative_focus',
                    expression: 'suspicious',
                    gesture: 'pointing_at_evidence'
                },
                lighting: {
                    theme: 'investigation_mode',
                    colors: ['#FF1493', '#00BFFF', '#FFFFFF'],
                    intensity: 'focused',
                    effects: ['investigation_glow', 'data_streams']
                },
                camera: {
                    angle: 'detective_close',
                    movement: 'investigative_zoom',
                    focus: 'character_analysis'
                },
                dialogue: {
                    text: "Wait a minute... something's not right about this profile. The photos don't match, and the story keeps changing. This is definitely a catfish.",
                    voiceStyle: 'analytical',
                    timing: 'investigative'
                }
            },
            
            requirements: ['5.2', '7.1', '7.5']
        },

        // Cyber Cafe Archive Discovery (Area 4 - S4 equivalent)
        archive_breakthrough: {
            id: 'maya_archive_breakthrough',
            character: 'maya',
            area: 4,
            title: 'Archive Breakthrough',
            description: 'Maya discovers crucial evidence in the cyber cafe archives',
            
            triggerConditions: {
                requiredArea: 4,
                stateConditions: {
                    investigation_clues: 5,
                    suspicious_matches: 3
                },
                eventTriggers: ['archive_access', 'evidence_found']
            },
            
            cinematicConfig: {
                duration: 11000, // 11 seconds
                character: {
                    model: 'maya_3d_model',
                    animation: 'eureka_moment',
                    expression: 'breakthrough',
                    gesture: 'evidence_presentation'
                },
                lighting: {
                    theme: 'cyber_cafe_discovery',
                    colors: ['#00FFFF', '#FF69B4', '#32CD32'],
                    intensity: 'revelation',
                    effects: ['data_revelation', 'connection_lines', 'breakthrough_pulse']
                },
                camera: {
                    angle: 'revelation_dramatic',
                    movement: 'discovery_pull_back',
                    focus: 'evidence_and_character'
                },
                dialogue: {
                    text: "This is it! I found the connection between all these fake profiles. They're all linked to the same operation. Now I can trace this back to the source.",
                    voiceStyle: 'excited_discovery',
                    timing: 'breakthrough'
                }
            },
            
            requirements: ['5.2', '7.1', '7.5']
        },

        // Final Confrontation Resolution (Area 6 - S6 equivalent)
        confrontation_resolution: {
            id: 'maya_confrontation_resolution',
            character: 'maya',
            area: 6,
            title: 'Final Confrontation',
            description: 'Maya confronts the cybercriminals and achieves justice',
            
            triggerConditions: {
                requiredArea: 6,
                stateConditions: {
                    confrontation_readiness: 100,
                    investigation_clues: 10
                },
                eventTriggers: ['final_confrontation', 'justice_served']
            },
            
            cinematicConfig: {
                duration: 13000, // 13 seconds
                character: {
                    model: 'maya_3d_model',
                    animation: 'justice_stance',
                    expression: 'determined',
                    gesture: 'accusatory_point'
                },
                lighting: {
                    theme: 'final_confrontation',
                    colors: ['#DC143C', '#4169E1', '#FFD700'],
                    intensity: 'dramatic',
                    effects: ['justice_aura', 'confrontation_shadows', 'truth_beams']
                },
                camera: {
                    angle: 'heroic_confrontation',
                    movement: 'justice_approach',
                    focus: 'determined_expression'
                },
                dialogue: {
                    text: "Your cybercrime operation ends here. I've gathered all the evidence, and now everyone will know the truth about what you've been doing to innocent people.",
                    voiceStyle: 'authoritative',
                    timing: 'confrontational'
                }
            },
            
            requirements: ['5.2', '7.1', '7.5']
        }
    },

    // Stanley's Cinematic Moments
    stanley: {
        // Social Media Maze Identity Threat (Area 2 - S2 equivalent)
        identity_threat_discovery: {
            id: 'stanley_identity_threat',
            character: 'stanley',
            area: 2,
            title: 'Identity Threat Discovery',
            description: 'Stanley discovers someone is trying to steal his identity through social media',
            
            triggerConditions: {
                requiredArea: 2,
                stateConditions: {
                    identity_threats_detected: 1
                },
                eventTriggers: ['identity_theft_attempt', 'fake_profile_discovered']
            },
            
            cinematicConfig: {
                duration: 9000, // 9 seconds
                character: {
                    model: 'stanley_3d_model',
                    animation: 'concerned_realization',
                    expression: 'worried',
                    gesture: 'protective_stance'
                },
                lighting: {
                    theme: 'suburban_security_alert',
                    colors: ['#9CA3AF', '#FEF3C7', '#FCA5A5'],
                    intensity: 'cautious',
                    effects: ['warning_glow', 'security_scan', 'alert_pulse']
                },
                camera: {
                    angle: 'concerned_citizen',
                    movement: 'security_focus',
                    focus: 'worried_expression'
                },
                dialogue: {
                    text: "This can't be right... someone is using my photos and personal information to create fake profiles. I need to protect myself and warn others about this.",
                    voiceStyle: 'concerned',
                    timing: 'realization'
                }
            },
            
            requirements: ['5.3', '7.1', '7.5']
        },

        // Digital Marketplace Scam Prevention (Area 4 - S4 equivalent)
        scam_prevention_success: {
            id: 'stanley_scam_prevention',
            character: 'stanley',
            area: 4,
            title: 'Scam Prevention Success',
            description: 'Stanley successfully prevents a major scam and helps others avoid it',
            
            triggerConditions: {
                requiredArea: 4,
                stateConditions: {
                    scams_prevented: 3,
                    identity_threats_detected: 2
                },
                eventTriggers: ['scam_detected', 'prevention_successful']
            },
            
            cinematicConfig: {
                duration: 10000, // 10 seconds
                character: {
                    model: 'stanley_3d_model',
                    animation: 'protective_action',
                    expression: 'determined',
                    gesture: 'warning_gesture'
                },
                lighting: {
                    theme: 'marketplace_protection',
                    colors: ['#10B981', '#F59E0B', '#EF4444'],
                    intensity: 'protective',
                    effects: ['shield_glow', 'protection_barrier', 'safety_aura']
                },
                camera: {
                    angle: 'protector_stance',
                    movement: 'guardian_circle',
                    focus: 'protective_gesture'
                },
                dialogue: {
                    text: "Stop! This is a scam - I've seen this exact same scheme before. Don't give them your information. Let me show you how to spot these red flags.",
                    voiceStyle: 'protective',
                    timing: 'urgent_warning'
                }
            },
            
            requirements: ['5.3', '7.1', '7.5']
        },

        // Protection Network Leadership (Area 6 - S6 equivalent)
        community_leadership: {
            id: 'stanley_community_leadership',
            character: 'stanley',
            area: 6,
            title: 'Community Leadership',
            description: 'Stanley becomes a leader in community protection and digital safety',
            
            triggerConditions: {
                requiredArea: 6,
                stateConditions: {
                    community_leadership_level: 100,
                    scams_prevented: 10
                },
                eventTriggers: ['leadership_recognized', 'community_protected']
            },
            
            cinematicConfig: {
                duration: 12000, // 12 seconds
                character: {
                    model: 'stanley_3d_model',
                    animation: 'leadership_address',
                    expression: 'wise',
                    gesture: 'community_embrace'
                },
                lighting: {
                    theme: 'community_leadership',
                    colors: ['#3B82F6', '#10B981', '#F59E0B'],
                    intensity: 'inspiring',
                    effects: ['leadership_aura', 'community_glow', 'wisdom_light']
                },
                camera: {
                    angle: 'leader_perspective',
                    movement: 'community_pan',
                    focus: 'inspiring_presence'
                },
                dialogue: {
                    text: "Together, we've built a network that protects our community from digital threats. By sharing knowledge and looking out for each other, we've made everyone safer.",
                    voiceStyle: 'inspirational_leader',
                    timing: 'community_address'
                }
            },
            
            requirements: ['5.3', '7.1', '7.5']
        }
    }
};

/**
 * Cinematic Moments Manager
 * Manages the configuration and retrieval of cinematic moments
 */
class CinematicMomentsManager {
    constructor() {
        this.config = CinematicMomentsConfig;
    }

    /**
     * Get all cinematic moments for a character
     * @param {string} character - Character name (eli, maya, stanley)
     * @returns {Object} Character's cinematic moments
     */
    getCharacterMoments(character) {
        return this.config[character] || {};
    }

    /**
     * Get a specific cinematic moment by ID
     * @param {string} momentId - Moment ID
     * @returns {Object|null} Cinematic moment configuration
     */
    getMoment(momentId) {
        for (const character in this.config) {
            for (const momentKey in this.config[character]) {
                const moment = this.config[character][momentKey];
                if (moment.id === momentId) {
                    return moment;
                }
            }
        }
        return null;
    }

    /**
     * Get cinematic moments for a specific area
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @returns {Array} Array of cinematic moments for the area
     */
    getMomentsForArea(character, area) {
        const characterMoments = this.getCharacterMoments(character);
        return Object.values(characterMoments).filter(moment => moment.area === area);
    }

    /**
     * Get trigger conditions for story progression tracker
     * @param {string} character - Character name
     * @param {number} area - Area number
     * @returns {Array} Array of trigger conditions
     */
    getTriggerConditions(character, area) {
        const moments = this.getMomentsForArea(character, area);
        return moments.map(moment => ({
            id: moment.id,
            ...moment.triggerConditions
        }));
    }

    /**
     * Validate cinematic moment configuration
     * @param {Object} moment - Moment configuration to validate
     * @returns {boolean} Whether configuration is valid
     */
    validateMoment(moment) {
        const required = ['id', 'character', 'area', 'triggerConditions', 'cinematicConfig'];
        return required.every(field => moment.hasOwnProperty(field));
    }

    /**
     * Get all moment IDs for a character
     * @param {string} character - Character name
     * @returns {Array} Array of moment IDs
     */
    getMomentIds(character) {
        const characterMoments = this.getCharacterMoments(character);
        return Object.values(characterMoments).map(moment => moment.id);
    }
}

// Export for use in other modules
window.CinematicMomentsConfig = CinematicMomentsConfig;
window.CinematicMomentsManager = CinematicMomentsManager;

// Create global instance
window.cinematicManager = new CinematicMomentsManager();

console.log('Cinematic Moments Configuration loaded:', CinematicMomentsConfig);