/**
 * Character-Specific Puzzle Scenarios
 * Defines realistic social engineering puzzles tailored to each character's domain
 * Maya: Romance/dating manipulation, Eli: Gaming exploitation, Stanley: Elder-targeted scams
 */

class CharacterPuzzleScenarios {
    constructor() {
        this.scenarios = new Map();
        this.initializeScenarios();
    }

    /**
     * Initialize all character-specific scenarios
     */
    initializeScenarios() {
        this.initializeMayaScenarios();
        this.initializeEliScenarios();
        this.initializeStanleyScenarios();
        
        console.log('🧩 Character puzzle scenarios initialized:', this.scenarios.size, 'scenarios');
    }

    /**
     * Initialize Maya's romance/dating manipulation scenarios
     */
    initializeMayaScenarios() {
        // Maya - Trust Exploitation Romance Scam
        this.scenarios.set('maya_trust_romance_scam', {
            character: 'maya',
            tacticType: 'trust',
            difficulty: 'intermediate',
            title: 'The Perfect Match',
            scenario: {
                setup: `You've been chatting with someone named Alex on a dating app for two weeks. They seem perfect - same interests, similar background, and they're very attentive. Alex has shared personal stories about their difficult childhood and recent job loss. They've asked about your work and seem genuinely interested in your life. Today, Alex mentions they're having trouble paying rent and asks if you could help with a small loan until their new job starts next week. They promise to pay you back and say they feel terrible asking, but they trust you more than anyone.`,
                context: {
                    platform: 'dating_app',
                    relationship_duration: '2_weeks',
                    manipulation_stage: 'trust_building_complete',
                    request_type: 'financial_assistance'
                },
                communication: [
                    {
                        sender: 'Alex',
                        message: "I can't believe how much we have in common! It's like we were meant to find each other 😊",
                        timestamp: '2 weeks ago',
                        manipulation_elements: ['false_intimacy', 'destiny_narrative']
                    },
                    {
                        sender: 'Alex',
                        message: "I've never opened up to someone so quickly before. There's just something about you that makes me feel safe.",
                        timestamp: '1 week ago',
                        manipulation_elements: ['vulnerability_sharing', 'trust_acceleration']
                    },
                    {
                        sender: 'Alex',
                        message: "I'm so embarrassed to ask this, but I'm really struggling with rent this month. My new job starts Monday, but I won't get paid for two weeks. Could you possibly help with $300? I'll pay you back as soon as I get my first paycheck. I hate asking, but I trust you more than my own family right now.",
                        timestamp: 'today',
                        manipulation_elements: ['financial_request', 'artificial_urgency', 'trust_exploitation', 'emotional_manipulation']
                    }
                ]
            },
            challenges: [
                {
                    id: 'identify_trust_tactics',
                    type: 'identify_tactic',
                    question: 'What primary manipulation tactic is Alex using in this scenario?',
                    options: [
                        'Trust exploitation through rapid relationship building',
                        'Authority manipulation by claiming expertise',
                        'Social proof by showing popularity',
                        'Reciprocity by offering valuable services'
                    ],
                    correctAnswer: 'Trust exploitation through rapid relationship building',
                    explanation: 'Alex is using trust exploitation by rapidly building intimacy and emotional connection, then leveraging that false trust to make a financial request.'
                },
                {
                    id: 'recognize_warning_signs',
                    type: 'recognize_warning_signs',
                    question: 'Which warning signs should alert you to potential manipulation? (Select all that apply)',
                    options: [
                        'Rapid emotional intimacy development',
                        'Sharing personal vulnerabilities early',
                        'Financial request after short relationship',
                        'Claims of special trust and connection',
                        'All of the above'
                    ],
                    correctAnswer: 'All of the above',
                    explanation: 'All these elements are classic warning signs of romance scam manipulation: accelerated intimacy, vulnerability sharing to build trust, financial requests, and claims of special connection.'
                },
                {
                    id: 'assess_response',
                    type: 'assess_response',
                    question: 'What would be the safest response to Alex\'s request?',
                    options: [
                        'Send the money since they seem trustworthy and it\'s a small amount',
                        'Ask for verification of their identity and situation before considering',
                        'Suggest they ask family or friends for help instead',
                        'Politely decline and suggest legitimate financial resources'
                    ],
                    correctAnswer: 'Politely decline and suggest legitimate financial resources',
                    explanation: 'The safest response is to decline financial requests from online contacts you haven\'t met in person, regardless of the relationship\'s apparent depth. Legitimate financial emergencies have proper resources available.'
                }
            ],
            educationalGoals: [
                'recognize_romance_scam_patterns',
                'understand_trust_exploitation_psychology',
                'identify_financial_manipulation_tactics',
                'develop_healthy_online_relationship_boundaries'
            ],
            realWorldMapping: 'romance_scam_financial_exploitation'
        });

        // Maya - Authority Manipulation Dating Safety
        this.scenarios.set('maya_authority_dating_verification', {
            character: 'maya',
            tacticType: 'authority',
            difficulty: 'beginner',
            title: 'The Verification Request',
            scenario: {
                setup: `You receive an email claiming to be from the dating app you use, stating that there have been security breaches and fake profiles. The email says your account needs immediate verification to remain active. It asks you to click a link and provide your login credentials, phone number, and a photo of your ID to "verify your identity and protect other users." The email looks official with the app's logo and mentions specific recent news about online dating safety. It warns that unverified accounts will be suspended within 24 hours.`,
                context: {
                    platform: 'email',
                    impersonated_authority: 'dating_app_security',
                    urgency_level: 'high',
                    request_type: 'credential_harvesting'
                }
            },
            challenges: [
                {
                    id: 'identify_authority_impersonation',
                    type: 'identify_tactic',
                    question: 'What manipulation tactic is being used in this email?',
                    options: [
                        'Authority impersonation with urgency pressure',
                        'Social proof through testimonials',
                        'Reciprocity through free services',
                        'Trust building through personal stories'
                    ],
                    correctAnswer: 'Authority impersonation with urgency pressure',
                    explanation: 'This is authority manipulation - impersonating the dating app\'s security team and using urgency to pressure immediate compliance without verification.'
                },
                {
                    id: 'spot_phishing_signs',
                    type: 'recognize_warning_signs',
                    question: 'What are the key warning signs this might be a phishing attempt?',
                    options: [
                        'Unsolicited security email requesting credentials',
                        'Artificial urgency with 24-hour deadline',
                        'Request for sensitive information via email',
                        'All of the above'
                    ],
                    correctAnswer: 'All of the above',
                    explanation: 'Legitimate companies rarely request credentials via email, especially with artificial urgency. The combination of unsolicited contact, credential requests, and pressure tactics are classic phishing signs.'
                }
            ],
            educationalGoals: [
                'recognize_phishing_attempts',
                'understand_authority_impersonation',
                'develop_verification_habits',
                'protect_dating_app_security'
            ],
            realWorldMapping: 'dating_app_phishing_scams'
        });

        // Maya - Urgency Manipulation Catfish Detection
        this.scenarios.set('maya_urgency_catfish_emergency', {
            character: 'maya',
            tacticType: 'urgency',
            difficulty: 'advanced',
            title: 'The Emergency Meeting',
            scenario: {
                setup: `You've been video chatting with Jordan for a month, but they always have technical issues - poor connection, camera problems, or background noise. You've planned to meet several times, but something always comes up. Today, Jordan messages frantically saying they're in the hospital after a car accident and desperately want to see you before a major surgery tomorrow. They're asking you to come to a hospital in a city 2 hours away tonight. Jordan says they can't video call because they lost their phone in the accident, and the hospital WiFi is terrible. They're pressuring you to come immediately, saying they might not make it through surgery and have something important to tell you.`,
                context: {
                    relationship_duration: '1_month',
                    meeting_attempts: 'multiple_failed',
                    emergency_type: 'medical',
                    location_request: 'remote_location',
                    urgency_level: 'extreme'
                }
            },
            challenges: [
                {
                    id: 'identify_urgency_manipulation',
                    type: 'identify_tactic',
                    question: 'What manipulation tactic is Jordan primarily using?',
                    options: [
                        'Urgency manipulation with fear and emotional pressure',
                        'Authority manipulation through medical context',
                        'Social proof through hospital setting',
                        'Reciprocity through vulnerability sharing'
                    ],
                    correctAnswer: 'Urgency manipulation with fear and emotional pressure',
                    explanation: 'Jordan is using urgency manipulation by creating an artificial emergency that demands immediate action, combined with fear (surgery risk) and emotional pressure (important confession).'
                },
                {
                    id: 'recognize_catfish_patterns',
                    type: 'recognize_warning_signs',
                    question: 'What patterns suggest this might be a catfishing attempt?',
                    options: [
                        'Consistent technical issues preventing clear video calls',
                        'Multiple failed meeting attempts with last-minute excuses',
                        'Emergency request to meet in remote location',
                        'All of the above indicate potential catfishing'
                    ],
                    correctAnswer: 'All of the above indicate potential catfishing',
                    explanation: 'These are classic catfishing patterns: avoiding clear video verification, preventing in-person meetings, and using emergencies to create urgency while maintaining distance.'
                },
                {
                    id: 'safety_assessment',
                    type: 'assess_response',
                    question: 'What would be the safest way to handle this situation?',
                    options: [
                        'Rush to the hospital immediately to support Jordan',
                        'Ask for hospital details and verify the emergency independently',
                        'Demand a clear video call before considering any meeting',
                        'Both verify independently and demand video verification'
                    ],
                    correctAnswer: 'Both verify independently and demand video verification',
                    explanation: 'Safety requires both independent verification of the emergency (calling the hospital directly) and insisting on clear video verification of Jordan\'s identity before any in-person meeting.'
                }
            ],
            educationalGoals: [
                'recognize_catfishing_patterns',
                'understand_urgency_manipulation_in_relationships',
                'develop_verification_protocols_for_online_relationships',
                'maintain_safety_boundaries_under_pressure'
            ],
            realWorldMapping: 'catfishing_emergency_manipulation'
        });

        console.log('🧩 Maya scenarios initialized: 3 scenarios');
    }

    /**
     * Initialize Eli's gaming community exploitation scenarios
     */
    initializeEliScenarios() {
        // Eli - Social Proof Gaming Tournament Scam
        this.scenarios.set('eli_social_proof_tournament_scam', {
            character: 'eli',
            tacticType: 'social_proof',
            difficulty: 'intermediate',
            title: 'The Exclusive Tournament',
            scenario: {
                setup: `A popular gaming influencer you follow announces an "exclusive invitation-only tournament" with a $10,000 prize pool. They show screenshots of previous winners and their earnings, claiming hundreds of players have already joined. The entry fee is $50, and they say spots are filling up fast. Several comments from verified accounts praise the tournament and share their winnings. The influencer emphasizes this is a limited opportunity for "serious gamers only" and that you need to register within 24 hours. They provide a link to a professional-looking tournament website with testimonials and leaderboards.`,
                context: {
                    platform: 'social_media',
                    influencer_status: 'verified_popular',
                    tournament_type: 'invitation_only',
                    entry_fee: '$50',
                    social_proof_elements: ['testimonials', 'winner_screenshots', 'verified_comments']
                }
            },
            challenges: [
                {
                    id: 'identify_social_proof_manipulation',
                    type: 'identify_tactic',
                    question: 'What primary manipulation tactic is being used to promote this tournament?',
                    options: [
                        'Social proof through fake testimonials and winner claims',
                        'Authority manipulation through influencer status',
                        'Urgency through limited-time registration',
                        'Reciprocity through exclusive invitation'
                    ],
                    correctAnswer: 'Social proof through fake testimonials and winner claims',
                    explanation: 'While multiple tactics are present, the primary manipulation is social proof - using fake testimonials, winner screenshots, and manufactured popularity to make the tournament seem legitimate and successful.'
                },
                {
                    id: 'verify_tournament_legitimacy',
                    type: 'recognize_warning_signs',
                    question: 'What steps should you take to verify this tournament\'s legitimacy?',
                    options: [
                        'Check if the tournament is listed on official gaming platforms',
                        'Research the tournament organizer\'s history and reputation',
                        'Verify testimonials and winner claims independently',
                        'All of the above verification steps are important'
                    ],
                    correctAnswer: 'All of the above verification steps are important',
                    explanation: 'Legitimate tournaments have verifiable organizers, are listed on official platforms, and have independently confirmable results. All these verification steps help identify scams.'
                },
                {
                    id: 'assess_risk_factors',
                    type: 'assess_response',
                    question: 'Which factors make this tournament offer most suspicious?',
                    options: [
                        'High prize pool relative to entry fee seems too good to be true',
                        'Artificial urgency with 24-hour registration deadline',
                        'Unverifiable testimonials and winner claims',
                        'All factors combined create significant red flags'
                    ],
                    correctAnswer: 'All factors combined create significant red flags',
                    explanation: 'The combination of unrealistic prize ratios, artificial urgency, and unverifiable social proof creates a pattern typical of gaming tournament scams.'
                }
            ],
            educationalGoals: [
                'recognize_gaming_tournament_scams',
                'understand_social_proof_manipulation_in_gaming',
                'develop_tournament_verification_skills',
                'protect_against_gaming_community_fraud'
            ],
            realWorldMapping: 'gaming_tournament_advance_fee_fraud'
        });

        // Eli - Reciprocity Gaming Account Services
        this.scenarios.set('eli_reciprocity_account_boost', {
            character: 'eli',
            tacticType: 'reciprocity',
            difficulty: 'beginner',
            title: 'The Free Boost Offer',
            scenario: {
                setup: `A player you met in-game offers to help boost your ranking for free. They claim to be a professional booster who usually charges $100+ but wants to help you because you were friendly and skilled during your match together. They say they'll boost your account overnight while you sleep, and all they need is your login credentials. They mention they've helped dozens of players reach higher ranks and show you screenshots of successful boosts. They emphasize this is a one-time free offer because they liked playing with you, and they don't usually do this for strangers.`,
                context: {
                    relationship: 'recent_gaming_partner',
                    service_offered: 'account_boosting',
                    usual_cost: '$100+',
                    offer_price: 'free',
                    requirement: 'account_credentials'
                }
            },
            challenges: [
                {
                    id: 'identify_reciprocity_manipulation',
                    type: 'identify_tactic',
                    question: 'What manipulation tactic is being used in this offer?',
                    options: [
                        'Reciprocity manipulation through fake generosity',
                        'Authority manipulation through professional claims',
                        'Social proof through success screenshots',
                        'Trust exploitation through friendship'
                    ],
                    correctAnswer: 'Reciprocity manipulation through fake generosity',
                    explanation: 'This is reciprocity manipulation - offering a valuable service "for free" to create a sense of obligation and make you feel you should reciprocate by trusting them with your credentials.'
                },
                {
                    id: 'recognize_account_security_risks',
                    type: 'recognize_warning_signs',
                    question: 'What are the major security risks of accepting this offer?',
                    options: [
                        'Account theft and permanent loss of access',
                        'Unauthorized purchases using stored payment methods',
                        'Personal information harvesting from account data',
                        'All of these risks are serious concerns'
                    ],
                    correctAnswer: 'All of these risks are serious concerns',
                    explanation: 'Sharing account credentials creates multiple serious risks: complete account takeover, financial theft through stored payment methods, and harvesting of personal information.'
                }
            ],
            educationalGoals: [
                'understand_account_security_importance',
                'recognize_reciprocity_manipulation_in_gaming',
                'develop_healthy_skepticism_of_free_offers',
                'protect_gaming_account_credentials'
            ],
            realWorldMapping: 'gaming_account_credential_theft'
        });

        // Eli - Authority Gaming Support Scam
        this.scenarios.set('eli_authority_gaming_support', {
            character: 'eli',
            tacticType: 'authority',
            difficulty: 'advanced',
            title: 'The Security Alert',
            scenario: {
                setup: `You receive a message that appears to be from the game's official support team, warning that your account has been flagged for "suspicious activity" and may be permanently banned within 48 hours. The message includes official-looking logos and references recent security updates. It claims that hackers have been using accounts like yours for cheating and that immediate verification is required. The message asks you to click a link to verify your account by providing your username, password, email, and phone number. It warns that failure to verify will result in automatic account suspension and loss of all progress and purchases.`,
                context: {
                    sender: 'fake_official_support',
                    threat: 'account_suspension',
                    timeframe: '48_hours',
                    verification_request: 'full_credentials',
                    consequences: 'permanent_ban_and_loss'
                }
            },
            challenges: [
                {
                    id: 'identify_authority_impersonation',
                    type: 'identify_tactic',
                    question: 'What manipulation tactic is this message using?',
                    options: [
                        'Authority impersonation with fear-based urgency',
                        'Social proof through security update references',
                        'Reciprocity through account protection offer',
                        'Trust exploitation through official appearance'
                    ],
                    correctAnswer: 'Authority impersonation with fear-based urgency',
                    explanation: 'This is authority manipulation - impersonating official game support and using fear of account loss combined with artificial urgency to pressure immediate compliance.'
                },
                {
                    id: 'verify_official_communication',
                    type: 'recognize_warning_signs',
                    question: 'How should you verify if this message is legitimate?',
                    options: [
                        'Check the sender\'s email address for official domain',
                        'Log into your account directly (not through the link) to check for alerts',
                        'Contact official support through verified channels',
                        'All of these verification methods should be used'
                    ],
                    correctAnswer: 'All of these verification methods should be used',
                    explanation: 'Legitimate security alerts can be verified through multiple channels: checking sender authenticity, logging in directly to see official notifications, and contacting support through verified channels.'
                },
                {
                    id: 'assess_phishing_indicators',
                    type: 'assess_response',
                    question: 'What indicates this is likely a phishing attempt?',
                    options: [
                        'Request for complete credentials via external link',
                        'Artificial urgency with specific time deadline',
                        'Threats of severe consequences for non-compliance',
                        'All of these are classic phishing indicators'
                    ],
                    correctAnswer: 'All of these are classic phishing indicators',
                    explanation: 'Legitimate companies don\'t request credentials via email links, use artificial urgency, or threaten severe consequences. These are all classic phishing tactics.'
                }
            ],
            educationalGoals: [
                'recognize_gaming_support_impersonation',
                'understand_authority_manipulation_in_gaming_context',
                'develop_official_communication_verification_skills',
                'protect_against_gaming_account_phishing'
            ],
            realWorldMapping: 'gaming_platform_phishing_scams'
        });

        console.log('🧩 Eli scenarios initialized: 3 scenarios');
    }

    /**
     * Initialize Stanley's elder-targeted scam scenarios
     */
    initializeStanleyScenarios() {
        // Stanley - Authority Elder Fraud Government Impersonation
        this.scenarios.set('stanley_authority_government_scam', {
            character: 'stanley',
            tacticType: 'authority',
            difficulty: 'intermediate',
            title: 'The Social Security Call',
            scenario: {
                setup: `You receive a phone call from someone claiming to be from the Social Security Administration. The caller has an official-sounding voice and knows your full name and partial Social Security number. They inform you that your Social Security number has been "suspended due to suspicious activity" and that there's a warrant out for your arrest unless you take immediate action. The caller says you need to verify your identity by providing your full Social Security number, date of birth, and bank account information to "reactivate your benefits and clear your record." They create urgency by saying the police could arrive within hours if you don't comply immediately.`,
                context: {
                    impersonated_authority: 'social_security_administration',
                    personal_info_known: 'partial_ssn_and_name',
                    threat: 'arrest_warrant',
                    urgency: 'immediate_police_action',
                    information_requested: 'full_ssn_dob_banking'
                }
            },
            challenges: [
                {
                    id: 'identify_government_impersonation',
                    type: 'identify_tactic',
                    question: 'What manipulation tactic is the caller using?',
                    options: [
                        'Authority impersonation with fear and urgency tactics',
                        'Social proof through official knowledge',
                        'Reciprocity through benefit protection offer',
                        'Trust exploitation through helpful demeanor'
                    ],
                    correctAnswer: 'Authority impersonation with fear and urgency tactics',
                    explanation: 'This is classic authority manipulation - impersonating a government agency and using fear of arrest combined with artificial urgency to pressure immediate compliance.'
                },
                {
                    id: 'recognize_government_scam_signs',
                    type: 'recognize_warning_signs',
                    question: 'What are the key warning signs this is a scam?',
                    options: [
                        'Government agencies don\'t suspend Social Security numbers',
                        'Legitimate agencies don\'t threaten immediate arrest over the phone',
                        'Real government contact doesn\'t request sensitive info via phone',
                        'All of these are major red flags'
                    ],
                    correctAnswer: 'All of these are major red flags',
                    explanation: 'Social Security numbers cannot be "suspended," government agencies don\'t make arrest threats over the phone, and legitimate agencies have secure procedures for identity verification that don\'t involve phone requests for sensitive information.'
                },
                {
                    id: 'proper_response_protocol',
                    type: 'assess_response',
                    question: 'What is the safest way to handle this call?',
                    options: [
                        'Hang up immediately and call the official SSA number to verify',
                        'Ask for the caller\'s badge number and call back later',
                        'Provide partial information to verify the caller\'s legitimacy',
                        'Ask to speak with a supervisor to confirm the situation'
                    ],
                    correctAnswer: 'Hang up immediately and call the official SSA number to verify',
                    explanation: 'The safest response is to hang up and contact the Social Security Administration directly using their official phone number to verify any legitimate issues with your account.'
                }
            ],
            educationalGoals: [
                'recognize_government_impersonation_scams',
                'understand_authority_manipulation_targeting_elders',
                'learn_proper_government_agency_verification_procedures',
                'develop_resistance_to_fear_based_pressure_tactics'
            ],
            realWorldMapping: 'social_security_administration_impersonation_fraud'
        });

        // Stanley - Trust Companionship Scam
        this.scenarios.set('stanley_trust_companionship_scam', {
            character: 'stanley',
            tacticType: 'trust',
            difficulty: 'advanced',
            title: 'The New Friend',
            scenario: {
                setup: `You've been chatting with someone named Pat on a senior social media group for several months. Pat seems to share many of your interests and has been very supportive during your recent health challenges. Pat claims to be a retired teacher from a nearby state and often shares stories about grandchildren and gardening. Recently, Pat has started sharing personal financial struggles - mentioning medical bills and difficulty making ends meet on a fixed income. Today, Pat messages privately asking if you could help with a temporary loan of $500 to cover an unexpected medical expense, promising to pay you back when their pension check arrives next month. Pat says they're embarrassed to ask but feels you're the only person who truly understands their situation.`,
                context: {
                    relationship_duration: 'several_months',
                    platform: 'senior_social_media',
                    shared_interests: 'multiple_common_interests',
                    support_provided: 'emotional_support_during_health_issues',
                    financial_request: '$500_medical_emergency',
                    manipulation_elements: ['shared_vulnerability', 'trust_building', 'isolation_tactics']
                }
            },
            challenges: [
                {
                    id: 'identify_trust_exploitation',
                    type: 'identify_tactic',
                    question: 'What manipulation tactic is Pat using in this scenario?',
                    options: [
                        'Trust exploitation through long-term relationship building',
                        'Authority manipulation through professional background',
                        'Urgency manipulation through medical emergency',
                        'Social proof through group membership'
                    ],
                    correctAnswer: 'Trust exploitation through long-term relationship building',
                    explanation: 'Pat is using trust exploitation - building a long-term relationship with emotional support and shared experiences to create trust, then leveraging that trust for financial gain.'
                },
                {
                    id: 'recognize_companionship_scam_patterns',
                    type: 'recognize_warning_signs',
                    question: 'What patterns suggest this might be a companionship scam?',
                    options: [
                        'Long-term relationship building before financial request',
                        'Targeting during vulnerable period (health challenges)',
                        'Creating emotional connection through shared struggles',
                        'All of these are companionship scam warning signs'
                    ],
                    correctAnswer: 'All of these are companionship scam warning signs',
                    explanation: 'Companionship scams involve long-term trust building, targeting vulnerable individuals, and creating emotional bonds before making financial requests. All these elements are present.'
                },
                {
                    id: 'safe_verification_approach',
                    type: 'assess_response',
                    question: 'How should you safely handle Pat\'s request?',
                    options: [
                        'Send the money since you\'ve known Pat for months',
                        'Ask for verification of Pat\'s identity and medical emergency',
                        'Suggest Pat contact local social services for assistance',
                        'Both verify identity and suggest legitimate resources'
                    ],
                    correctAnswer: 'Both verify identity and suggest legitimate resources',
                    explanation: 'Safe handling requires both identity verification (video calls, official documentation) and directing them to legitimate assistance resources rather than providing money to unverified online contacts.'
                }
            ],
            educationalGoals: [
                'recognize_long_term_companionship_scams',
                'understand_trust_exploitation_in_senior_communities',
                'develop_verification_protocols_for_online_relationships',
                'learn_about_legitimate_assistance_resources'
            ],
            realWorldMapping: 'elder_companionship_fraud'
        });

        // Stanley - Urgency Tech Support Scam
        this.scenarios.set('stanley_urgency_tech_support', {
            character: 'stanley',
            tacticType: 'urgency',
            difficulty: 'beginner',
            title: 'The Computer Warning',
            scenario: {
                setup: `While browsing the internet, a pop-up window suddenly appears claiming your computer is infected with dangerous viruses. The warning looks official and includes flashing red text saying "CRITICAL SECURITY ALERT" and "YOUR COMPUTER IS AT RISK." It states that your personal information, banking details, and photos could be stolen within minutes if you don't act immediately. The pop-up provides a phone number for "Microsoft Certified Technicians" and warns not to close the browser or shut down the computer as this could cause permanent damage. A countdown timer shows you have only 5 minutes to call before your computer becomes permanently compromised.`,
                context: {
                    alert_type: 'browser_popup',
                    impersonated_company: 'microsoft',
                    threat_level: 'critical_immediate',
                    time_pressure: '5_minute_countdown',
                    consequences: 'permanent_damage_and_data_theft',
                    action_required: 'phone_call_to_fake_support'
                }
            },
            challenges: [
                {
                    id: 'identify_urgency_manipulation',
                    type: 'identify_tactic',
                    question: 'What primary manipulation tactic is this pop-up using?',
                    options: [
                        'Urgency manipulation with artificial time pressure',
                        'Authority manipulation through Microsoft branding',
                        'Fear manipulation through security threats',
                        'All of these tactics are being used together'
                    ],
                    correctAnswer: 'All of these tactics are being used together',
                    explanation: 'This scam combines urgency (countdown timer), authority (Microsoft branding), and fear (security threats) to overwhelm rational thinking and pressure immediate action.'
                },
                {
                    id: 'recognize_fake_tech_support',
                    type: 'recognize_warning_signs',
                    question: 'What indicates this is a fake tech support scam?',
                    options: [
                        'Legitimate companies don\'t use pop-up warnings',
                        'Real security alerts don\'t include countdown timers',
                        'Microsoft doesn\'t provide phone support through pop-ups',
                        'All of these indicate a scam'
                    ],
                    correctAnswer: 'All of these indicate a scam',
                    explanation: 'Legitimate tech companies don\'t use pop-up warnings, countdown timers, or provide support phone numbers through browser alerts. These are all classic scam indicators.'
                },
                {
                    id: 'proper_response_action',
                    type: 'assess_response',
                    question: 'What should you do when encountering this type of pop-up?',
                    options: [
                        'Call the number immediately to protect your computer',
                        'Close the browser and run your regular antivirus scan',
                        'Follow the pop-up instructions to avoid damage',
                        'Shut down the computer immediately as instructed'
                    ],
                    correctAnswer: 'Close the browser and run your regular antivirus scan',
                    explanation: 'The safest response is to close the browser (ignoring warnings not to), then run your legitimate antivirus software to check for any actual issues.'
                }
            ],
            educationalGoals: [
                'recognize_fake_tech_support_scams',
                'understand_urgency_manipulation_in_tech_scams',
                'learn_proper_computer_security_practices',
                'develop_resistance_to_fear_based_tech_alerts'
            ],
            realWorldMapping: 'tech_support_scam_pop_up_warnings'
        });

        console.log('🧩 Stanley scenarios initialized: 3 scenarios');
    }

    /**
     * Get scenario by ID
     * @param {string} scenarioId - Scenario identifier
     * @returns {Object|null} Scenario object or null if not found
     */
    getScenario(scenarioId) {
        return this.scenarios.get(scenarioId) || null;
    }

    /**
     * Get scenarios for a specific character
     * @param {string} character - Character name (eli, maya, stanley)
     * @returns {Array} Array of scenarios for the character
     */
    getScenariosForCharacter(character) {
        const characterScenarios = [];
        for (const [id, scenario] of this.scenarios.entries()) {
            if (scenario.character === character) {
                characterScenarios.push({ id, ...scenario });
            }
        }
        return characterScenarios;
    }

    /**
     * Get scenarios by manipulation tactic
     * @param {string} tacticType - Manipulation tactic type
     * @returns {Array} Array of scenarios using the tactic
     */
    getScenariosByTactic(tacticType) {
        const tacticScenarios = [];
        for (const [id, scenario] of this.scenarios.entries()) {
            if (scenario.tacticType === tacticType) {
                tacticScenarios.push({ id, ...scenario });
            }
        }
        return tacticScenarios;
    }

    /**
     * Get scenarios by difficulty level
     * @param {string} difficulty - Difficulty level (beginner, intermediate, advanced)
     * @returns {Array} Array of scenarios at the difficulty level
     */
    getScenariosByDifficulty(difficulty) {
        const difficultyScenarios = [];
        for (const [id, scenario] of this.scenarios.entries()) {
            if (scenario.difficulty === difficulty) {
                difficultyScenarios.push({ id, ...scenario });
            }
        }
        return difficultyScenarios;
    }

    /**
     * Get random scenario for character and criteria
     * @param {string} character - Character name
     * @param {string} difficulty - Difficulty level (optional)
     * @param {string} tacticType - Tactic type (optional)
     * @returns {Object|null} Random matching scenario or null
     */
    getRandomScenario(character, difficulty = null, tacticType = null) {
        let candidates = this.getScenariosForCharacter(character);
        
        if (difficulty) {
            candidates = candidates.filter(scenario => scenario.difficulty === difficulty);
        }
        
        if (tacticType) {
            candidates = candidates.filter(scenario => scenario.tacticType === tacticType);
        }
        
        if (candidates.length === 0) {
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
    }

    /**
     * Get all available scenarios
     * @returns {Array} Array of all scenarios with IDs
     */
    getAllScenarios() {
        const allScenarios = [];
        for (const [id, scenario] of this.scenarios.entries()) {
            allScenarios.push({ id, ...scenario });
        }
        return allScenarios;
    }

    /**
     * Get scenario statistics
     * @returns {Object} Statistics about available scenarios
     */
    getStatistics() {
        const stats = {
            totalScenarios: this.scenarios.size,
            byCharacter: {},
            byTactic: {},
            byDifficulty: {}
        };
        
        for (const scenario of this.scenarios.values()) {
            // Count by character
            if (!stats.byCharacter[scenario.character]) {
                stats.byCharacter[scenario.character] = 0;
            }
            stats.byCharacter[scenario.character]++;
            
            // Count by tactic
            if (!stats.byTactic[scenario.tacticType]) {
                stats.byTactic[scenario.tacticType] = 0;
            }
            stats.byTactic[scenario.tacticType]++;
            
            // Count by difficulty
            if (!stats.byDifficulty[scenario.difficulty]) {
                stats.byDifficulty[scenario.difficulty] = 0;
            }
            stats.byDifficulty[scenario.difficulty]++;
        }
        
        return stats;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CharacterPuzzleScenarios };
}

// Make available globally
window.CharacterPuzzleScenarios = CharacterPuzzleScenarios;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.characterPuzzleScenarios) {
            window.characterPuzzleScenarios = new CharacterPuzzleScenarios();
        }
    });
} else {
    if (!window.characterPuzzleScenarios) {
        window.characterPuzzleScenarios = new CharacterPuzzleScenarios();
    }
}