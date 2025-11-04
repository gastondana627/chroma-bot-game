/**
 * Character-Specific Investigation Tools
 * Specialized cybersecurity investigation tools tailored for each character's domain
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
 */

/**
 * Maya's Dating Profile Verification and Reverse Image Search Tools
 * Specialized for romance scam detection and dating safety
 */
class MayaInvestigationTools {
    constructor() {
        this.toolId = 'maya_tools';
        this.character = 'maya';
        this.domain = 'dating_safety';
    }

    /**
     * Dating Profile Verification Tool
     * Analyzes dating profiles for authenticity and red flags
     * @param {Object} profileData - Dating profile information
     * @param {Object} userInput - User's analysis input
     * @returns {Object} Verification results with educational feedback
     */
    verifyDatingProfile(profileData, userInput = {}) {
        const analysis = {
            toolUsed: 'dating_profile_verifier',
            character: 'maya',
            timestamp: Date.now(),
            profileId: profileData.id || 'unknown',
            findings: {},
            riskScore: 0,
            redFlags: [],
            educationalPoints: []
        };

        // Analyze profile completeness
        const completeness = this.analyzeProfileCompleteness(profileData);
        analysis.findings.completeness = completeness;
        
        // Check for common romance scam indicators
        const scamIndicators = this.detectRomanceScamIndicators(profileData);
        analysis.findings.scamIndicators = scamIndicators;
        analysis.redFlags.push(...scamIndicators.flags);

        // Verify photo authenticity
        const photoAnalysis = this.analyzeProfilePhotos(profileData);
        analysis.findings.photoAuthenticity = photoAnalysis;
        analysis.redFlags.push(...photoAnalysis.flags);

        // Analyze bio and description
        const bioAnalysis = this.analyzeBioContent(profileData);
        analysis.findings.bioAnalysis = bioAnalysis;
        analysis.redFlags.push(...bioAnalysis.flags);

        // Calculate overall risk score
        analysis.riskScore = this.calculateRiskScore(analysis.redFlags);

        // Generate educational feedback
        analysis.educationalPoints = this.generateDatingEducationalFeedback(analysis);

        return {
            success: true,
            analysis: analysis,
            recommendations: this.generateDatingRecommendations(analysis),
            nextSteps: this.suggestNextSteps(analysis)
        };
    }

    /**
     * Advanced Reverse Image Search Tool
     * Specialized for dating profile photo verification
     * @param {Object} imageData - Image information to search
     * @param {Object} userInput - User's search parameters
     * @returns {Object} Reverse search results with dating-specific insights
     */
    performAdvancedReverseImageSearch(imageData, userInput = {}) {
        const searchResult = {
            toolUsed: 'advanced_reverse_image_search',
            character: 'maya',
            timestamp: Date.now(),
            imageId: imageData.id || 'unknown',
            searchResults: {},
            datingSpecificFindings: {},
            educationalPoints: []
        };

        // Simulate reverse image search results
        const reverseResults = this.simulateReverseImageSearch(imageData);
        searchResult.searchResults = reverseResults;

        // Analyze results for dating context
        const datingAnalysis = this.analyzeDatingImageContext(reverseResults);
        searchResult.datingSpecificFindings = datingAnalysis;

        // Check for stock photo usage
        const stockPhotoCheck = this.checkForStockPhotos(reverseResults);
        searchResult.datingSpecificFindings.stockPhotoIndicators = stockPhotoCheck;

        // Analyze image metadata for authenticity
        const metadataAnalysis = this.analyzeImageMetadata(imageData);
        searchResult.datingSpecificFindings.metadataAnalysis = metadataAnalysis;

        // Generate educational content
        searchResult.educationalPoints = this.generateImageSearchEducation(searchResult);

        return {
            success: true,
            searchResult: searchResult,
            recommendations: this.generateImageSearchRecommendations(searchResult),
            verificationTips: this.getImageVerificationTips()
        };
    }

    /**
     * Romance Scam Communication Analyzer
     * Analyzes messages for manipulation tactics and red flags
     * @param {Object} communicationData - Messages and communication history
     * @param {Object} userInput - User's analysis parameters
     * @returns {Object} Communication analysis results
     */
    analyzeRomanceCommunication(communicationData, userInput = {}) {
        const analysis = {
            toolUsed: 'romance_communication_analyzer',
            character: 'maya',
            timestamp: Date.now(),
            communicationId: communicationData.id || 'unknown',
            manipulationTactics: [],
            emotionalPatterns: {},
            timelineAnalysis: {},
            educationalPoints: []
        };

        // Detect manipulation tactics
        const tactics = this.detectManipulationTactics(communicationData);
        analysis.manipulationTactics = tactics;

        // Analyze emotional progression
        const emotionalAnalysis = this.analyzeEmotionalProgression(communicationData);
        analysis.emotionalPatterns = emotionalAnalysis;

        // Timeline analysis for relationship progression
        const timelineAnalysis = this.analyzeRelationshipTimeline(communicationData);
        analysis.timelineAnalysis = timelineAnalysis;

        // Generate educational feedback
        analysis.educationalPoints = this.generateCommunicationEducation(analysis);

        return {
            success: true,
            analysis: analysis,
            recommendations: this.generateCommunicationRecommendations(analysis),
            warningSignsIdentified: this.identifyWarningSignsInCommunication(analysis)
        };
    }

    // Private helper methods for Maya's tools

    analyzeProfileCompleteness(profileData) {
        const requiredFields = ['name', 'age', 'profession', 'photos', 'bio'];
        const completedFields = requiredFields.filter(field => 
            profileData.content && profileData.content[field] && 
            profileData.content[field] !== '' && 
            profileData.content[field] !== null
        );

        return {
            completionRate: (completedFields.length / requiredFields.length) * 100,
            missingFields: requiredFields.filter(field => !completedFields.includes(field)),
            riskLevel: completedFields.length < 3 ? 'high' : completedFields.length < 4 ? 'medium' : 'low'
        };
    }

    detectRomanceScamIndicators(profileData) {
        const indicators = [];
        const flags = [];

        if (profileData.content) {
            // Check for military/overseas claims
            if (profileData.content.profession && 
                (profileData.content.profession.toLowerCase().includes('military') ||
                 profileData.content.profession.toLowerCase().includes('engineer'))) {
                indicators.push('Military/engineer profession claim');
                flags.push('military_claim');
            }

            // Check for deployment/travel stories
            if (profileData.content.bio && 
                (profileData.content.bio.toLowerCase().includes('deployed') ||
                 profileData.content.bio.toLowerCase().includes('overseas'))) {
                indicators.push('Deployment/overseas story');
                flags.push('deployment_story');
            }

            // Check for limited personal details
            if (!profileData.content.location || profileData.content.location === 'Unknown') {
                indicators.push('Missing location information');
                flags.push('missing_location');
            }
        }

        return {
            indicators: indicators,
            flags: flags,
            riskLevel: flags.length > 2 ? 'high' : flags.length > 0 ? 'medium' : 'low'
        };
    }

    analyzeProfilePhotos(profileData) {
        const analysis = {
            photoCount: 0,
            qualityAssessment: 'unknown',
            flags: [],
            suspiciousIndicators: []
        };

        if (profileData.content && profileData.content.photos) {
            analysis.photoCount = profileData.content.photos.length;

            // Check for professional quality (potential stock photos)
            if (profileData.content.quality === 'Professional') {
                analysis.qualityAssessment = 'professional';
                analysis.flags.push('professional_photos');
                analysis.suspiciousIndicators.push('Unusually high-quality photos may indicate stock images');
            }

            // Check for limited photo variety
            if (analysis.photoCount < 3) {
                analysis.flags.push('limited_photos');
                analysis.suspiciousIndicators.push('Limited number of photos reduces verification ability');
            }
        }

        return analysis;
    }

    analyzeBioContent(profileData) {
        const analysis = {
            length: 0,
            flags: [],
            emotionalLanguage: [],
            urgencyIndicators: []
        };

        if (profileData.content && profileData.content.bio) {
            const bio = profileData.content.bio.toLowerCase();
            analysis.length = bio.length;

            // Check for emotional manipulation language
            const emotionalWords = ['love', 'soulmate', 'destiny', 'connection', 'heart'];
            emotionalWords.forEach(word => {
                if (bio.includes(word)) {
                    analysis.emotionalLanguage.push(word);
                }
            });

            // Check for urgency/pressure language
            const urgencyWords = ['serious', 'immediately', 'urgent', 'quickly'];
            urgencyWords.forEach(word => {
                if (bio.includes(word)) {
                    analysis.urgencyIndicators.push(word);
                    analysis.flags.push('urgency_language');
                }
            });

            if (analysis.emotionalLanguage.length > 2) {
                analysis.flags.push('excessive_emotional_language');
            }
        }

        return analysis;
    }

    calculateRiskScore(redFlags) {
        const flagWeights = {
            'military_claim': 25,
            'deployment_story': 20,
            'missing_location': 15,
            'professional_photos': 20,
            'limited_photos': 10,
            'urgency_language': 15,
            'excessive_emotional_language': 10
        };

        let score = 0;
        redFlags.forEach(flag => {
            score += flagWeights[flag] || 5;
        });

        return Math.min(score, 100);
    }

    generateDatingEducationalFeedback(analysis) {
        const points = [];

        if (analysis.riskScore > 70) {
            points.push('High-risk profile detected - multiple red flags present');
            points.push('Romance scammers often use military/professional personas to build trust');
        }

        if (analysis.redFlags.includes('professional_photos')) {
            points.push('Professional-quality photos may be stolen from stock photo sites');
            points.push('Always verify photos using reverse image search');
        }

        if (analysis.redFlags.includes('deployment_story')) {
            points.push('Deployment stories are common in romance scams to explain inability to meet');
            points.push('Legitimate military personnel have official verification methods');
        }

        points.push('Trust your instincts - if something feels too good to be true, investigate further');

        return points;
    }

    generateDatingRecommendations(analysis) {
        const recommendations = [];

        if (analysis.riskScore > 50) {
            recommendations.push({
                priority: 'high',
                action: 'Perform reverse image search on all profile photos',
                reason: 'High risk score indicates potential fake profile'
            });
        }

        if (analysis.redFlags.includes('military_claim')) {
            recommendations.push({
                priority: 'high',
                action: 'Request military verification through official channels',
                reason: 'Military claims are common in romance scams'
            });
        }

        recommendations.push({
            priority: 'medium',
            action: 'Verify profile information through multiple sources',
            reason: 'Cross-verification helps identify inconsistencies'
        });

        return recommendations;
    }

    // Additional helper methods for reverse image search
    simulateReverseImageSearch(imageData) {
        // Simulate realistic reverse image search results
        return {
            totalMatches: imageData.reverseSearch?.duplicates || 0,
            sources: imageData.reverseSearch?.contexts || [],
            firstAppearance: imageData.reverseSearch?.firstSeen || 'Unknown',
            originalSource: imageData.reverseSearch?.source || 'Unknown',
            similarImages: Math.floor(Math.random() * 50) + 10
        };
    }

    analyzeDatingImageContext(reverseResults) {
        const analysis = {
            datingProfileUsage: 0,
            stockPhotoIndicators: [],
            multipleProfileUsage: false,
            riskAssessment: 'low'
        };

        if (reverseResults.sources) {
            analysis.datingProfileUsage = reverseResults.sources.filter(source => 
                source.toLowerCase().includes('dating') || 
                source.toLowerCase().includes('romance')
            ).length;

            if (analysis.datingProfileUsage > 3) {
                analysis.multipleProfileUsage = true;
                analysis.riskAssessment = 'high';
            }
        }

        if (reverseResults.originalSource && 
            reverseResults.originalSource.toLowerCase().includes('stock')) {
            analysis.stockPhotoIndicators.push('Original source is stock photo website');
            analysis.riskAssessment = 'high';
        }

        return analysis;
    }

    checkForStockPhotos(reverseResults) {
        const indicators = [];

        if (reverseResults.originalSource) {
            const stockSites = ['shutterstock', 'getty', 'stock', 'unsplash', 'pexels'];
            stockSites.forEach(site => {
                if (reverseResults.originalSource.toLowerCase().includes(site)) {
                    indicators.push(`Found on ${site} - likely stock photo`);
                }
            });
        }

        return {
            isStockPhoto: indicators.length > 0,
            indicators: indicators,
            confidence: indicators.length > 0 ? 'high' : 'low'
        };
    }

    analyzeImageMetadata(imageData) {
        return {
            hasMetadata: imageData.metadata ? true : false,
            locationData: imageData.metadata?.location || 'Not available',
            deviceInfo: imageData.metadata?.device || 'Unknown',
            creationDate: imageData.metadata?.created || 'Unknown',
            suspiciousIndicators: imageData.metadata?.suspicious || []
        };
    }

    generateImageSearchEducation(searchResult) {
        const points = [];

        if (searchResult.datingSpecificFindings.multipleProfileUsage) {
            points.push('Image appears on multiple dating profiles - strong indicator of catfishing');
        }

        if (searchResult.datingSpecificFindings.stockPhotoIndicators.isStockPhoto) {
            points.push('Stock photos are commonly used in fake dating profiles');
            points.push('Legitimate users typically use personal photos with metadata');
        }

        points.push('Reverse image search is a powerful tool for verifying online identities');
        points.push('Always check multiple search engines for comprehensive results');

        return points;
    }

    generateImageSearchRecommendations(searchResult) {
        const recommendations = [];

        if (searchResult.datingSpecificFindings.multipleProfileUsage) {
            recommendations.push({
                priority: 'high',
                action: 'Report profile as fake to dating platform',
                reason: 'Image used on multiple dating profiles'
            });
        }

        if (searchResult.datingSpecificFindings.stockPhotoIndicators.isStockPhoto) {
            recommendations.push({
                priority: 'high',
                action: 'Avoid contact with this profile',
                reason: 'Profile uses stock photos - likely fake'
            });
        }

        recommendations.push({
            priority: 'medium',
            action: 'Verify all profile photos using reverse image search',
            reason: 'Standard verification practice for online dating safety'
        });

        return recommendations;
    }

    // Communication analysis helper methods
    detectManipulationTactics(communicationData) {
        const tactics = [];

        if (communicationData.content && communicationData.content.messages) {
            const messages = communicationData.content.messages.join(' ').toLowerCase();

            // Love bombing detection
            const loveWords = ['beautiful', 'perfect', 'soulmate', 'destiny', 'love'];
            const loveCount = loveWords.filter(word => messages.includes(word)).length;
            if (loveCount > 2) {
                tactics.push({
                    tactic: 'Love Bombing',
                    description: 'Excessive romantic language used to build emotional connection quickly',
                    severity: 'high'
                });
            }

            // Financial request detection
            if (messages.includes('money') || messages.includes('financial') || messages.includes('help')) {
                tactics.push({
                    tactic: 'Financial Manipulation',
                    description: 'Request for money or financial assistance',
                    severity: 'critical'
                });
            }

            // Urgency creation
            if (messages.includes('urgent') || messages.includes('emergency') || messages.includes('quickly')) {
                tactics.push({
                    tactic: 'Urgency Creation',
                    description: 'Creating false sense of urgency to pressure quick decisions',
                    severity: 'high'
                });
            }
        }

        return tactics;
    }

    analyzeEmotionalProgression(communicationData) {
        return {
            progressionSpeed: 'rapid',
            emotionalIntensity: 'high',
            consistencyCheck: 'inconsistent',
            redFlags: ['Too fast emotional escalation', 'Inconsistent personal details']
        };
    }

    analyzeRelationshipTimeline(communicationData) {
        return {
            timeToLoveDeclaration: '< 1 week',
            timeToFinancialRequest: '< 2 weeks',
            meetingAvoidance: true,
            excusesForNotMeeting: ['Military deployment', 'Travel restrictions']
        };
    }

    generateCommunicationEducation(analysis) {
        const points = [];

        analysis.manipulationTactics.forEach(tactic => {
            if (tactic.tactic === 'Love Bombing') {
                points.push('Love bombing is a manipulation tactic used to gain emotional control');
            }
            if (tactic.tactic === 'Financial Manipulation') {
                points.push('Legitimate romantic interests never ask for money from strangers');
            }
        });

        points.push('Healthy relationships develop gradually with consistent communication');
        points.push('Be wary of anyone who avoids meeting in person with elaborate excuses');

        return points;
    }

    generateCommunicationRecommendations(analysis) {
        const recommendations = [];

        if (analysis.manipulationTactics.some(t => t.severity === 'critical')) {
            recommendations.push({
                priority: 'urgent',
                action: 'Cease all communication immediately',
                reason: 'Critical manipulation tactics detected'
            });
        }

        recommendations.push({
            priority: 'high',
            action: 'Never send money or personal financial information',
            reason: 'Financial requests are major red flags in online relationships'
        });

        return recommendations;
    }

    suggestNextSteps(analysis) {
        const steps = [];

        if (analysis.riskScore > 70) {
            steps.push('Report profile to dating platform');
            steps.push('Block all communication');
            steps.push('Document evidence for potential law enforcement report');
        } else if (analysis.riskScore > 40) {
            steps.push('Request video call verification');
            steps.push('Ask for additional verification photos');
            steps.push('Proceed with extreme caution');
        }

        return steps;
    }

    getImageVerificationTips() {
        return [
            'Use multiple reverse image search engines (Google, TinEye, Yandex)',
            'Look for metadata in original photos',
            'Request specific photos (holding a sign with your name)',
            'Check for consistency across all profile photos',
            'Be suspicious of professional-quality photos'
        ];
    }

    identifyWarningSignsInCommunication(analysis) {
        const warnings = [];

        analysis.manipulationTactics.forEach(tactic => {
            warnings.push(`${tactic.tactic}: ${tactic.description}`);
        });

        return warnings;
    }
}

/**

 * Eli's Trade Verification and Account Security Analysis Systems
 * Specialized for gaming fraud detection and account security
 */
class EliInvestigationTools {
    constructor() {
        this.toolId = 'eli_tools';
        this.character = 'eli';
        this.domain = 'gaming_security';
    }

    /**
     * Gaming Trade Verification System
     * Analyzes gaming trades for fraud indicators and security risks
     * @param {Object} tradeData - Trading transaction information
     * @param {Object} userInput - User's analysis input
     * @returns {Object} Trade verification results with security recommendations
     */
    verifyGamingTrade(tradeData, userInput = {}) {
        const analysis = {
            toolUsed: 'gaming_trade_verifier',
            character: 'eli',
            timestamp: Date.now(),
            tradeId: tradeData.id || 'unknown',
            findings: {},
            riskScore: 0,
            fraudIndicators: [],
            educationalPoints: []
        };

        // Analyze trader reputation
        const reputationAnalysis = this.analyzeTraderReputation(tradeData);
        analysis.findings.traderReputation = reputationAnalysis;

        // Check trade terms and conditions
        const tradeTermsAnalysis = this.analyzeTradeTerms(tradeData);
        analysis.findings.tradeTerms = tradeTermsAnalysis;
        analysis.fraudIndicators.push(...tradeTermsAnalysis.redFlags);

        // Verify item authenticity and value
        const itemAnalysis = this.analyzeTradeItems(tradeData);
        analysis.findings.itemAnalysis = itemAnalysis;
        analysis.fraudIndicators.push(...itemAnalysis.redFlags);

        // Analyze payment methods and security
        const paymentAnalysis = this.analyzePaymentSecurity(tradeData);
        analysis.findings.paymentSecurity = paymentAnalysis;
        analysis.fraudIndicators.push(...paymentAnalysis.redFlags);

        // Calculate overall risk score
        analysis.riskScore = this.calculateTradingRiskScore(analysis.fraudIndicators);

        // Generate educational feedback
        analysis.educationalPoints = this.generateTradingEducationalFeedback(analysis);

        return {
            success: true,
            analysis: analysis,
            recommendations: this.generateTradingRecommendations(analysis),
            securityTips: this.getTradingSecurityTips()
        };
    }

    /**
     * Account Security Analysis System
     * Comprehensive analysis of gaming account security and compromise indicators
     * @param {Object} accountData - Gaming account information and activity logs
     * @param {Object} userInput - User's analysis parameters
     * @returns {Object} Account security analysis results
     */
    analyzeAccountSecurity(accountData, userInput = {}) {
        const analysis = {
            toolUsed: 'account_security_analyzer',
            character: 'eli',
            timestamp: Date.now(),
            accountId: accountData.id || 'unknown',
            securityFindings: {},
            compromiseIndicators: [],
            securityScore: 0,
            educationalPoints: []
        };

        // Analyze login patterns and anomalies
        const loginAnalysis = this.analyzeLoginPatterns(accountData);
        analysis.securityFindings.loginPatterns = loginAnalysis;
        analysis.compromiseIndicators.push(...loginAnalysis.anomalies);

        // Check for suspicious account activity
        const activityAnalysis = this.analyzeAccountActivity(accountData);
        analysis.securityFindings.accountActivity = activityAnalysis;
        analysis.compromiseIndicators.push(...activityAnalysis.suspiciousActivities);

        // Analyze network and IP information
        const networkAnalysis = this.analyzeNetworkSecurity(accountData);
        analysis.securityFindings.networkSecurity = networkAnalysis;
        analysis.compromiseIndicators.push(...networkAnalysis.riskIndicators);

        // Check password and authentication security
        const authAnalysis = this.analyzeAuthenticationSecurity(accountData);
        analysis.securityFindings.authenticationSecurity = authAnalysis;

        // Calculate security score
        analysis.securityScore = this.calculateSecurityScore(analysis.compromiseIndicators);

        // Generate educational feedback
        analysis.educationalPoints = this.generateSecurityEducationalFeedback(analysis);

        return {
            success: true,
            analysis: analysis,
            recommendations: this.generateSecurityRecommendations(analysis),
            immediateActions: this.getImmediateSecurityActions(analysis)
        };
    }

    /**
     * Gaming Scam Detection System
     * Identifies common gaming scams and fraudulent schemes
     * @param {Object} scamData - Potential scam information
     * @param {Object} userInput - User's analysis input
     * @returns {Object} Scam detection results
     */
    detectGamingScam(scamData, userInput = {}) {
        const analysis = {
            toolUsed: 'gaming_scam_detector',
            character: 'eli',
            timestamp: Date.now(),
            scamId: scamData.id || 'unknown',
            scamType: 'unknown',
            scamIndicators: [],
            confidenceLevel: 0,
            educationalPoints: []
        };

        // Identify scam type
        const scamTypeAnalysis = this.identifyScamType(scamData);
        analysis.scamType = scamTypeAnalysis.type;
        analysis.scamIndicators.push(...scamTypeAnalysis.indicators);

        // Analyze communication patterns for scam tactics
        const communicationAnalysis = this.analyzeScamCommunication(scamData);
        analysis.scamIndicators.push(...communicationAnalysis.tactics);

        // Check for common gaming scam patterns
        const patternAnalysis = this.analyzeScamPatterns(scamData);
        analysis.scamIndicators.push(...patternAnalysis.patterns);

        // Calculate confidence level
        analysis.confidenceLevel = this.calculateScamConfidence(analysis.scamIndicators);

        // Generate educational feedback
        analysis.educationalPoints = this.generateScamEducationalFeedback(analysis);

        return {
            success: true,
            analysis: analysis,
            recommendations: this.generateScamRecommendations(analysis),
            preventionTips: this.getScamPreventionTips(analysis.scamType)
        };
    }

    // Private helper methods for Eli's tools

    analyzeTraderReputation(tradeData) {
        const analysis = {
            reputationScore: 0,
            accountAge: 'unknown',
            tradeHistory: 0,
            verificationStatus: false,
            redFlags: []
        };

        if (tradeData.content && tradeData.content.trades) {
            const trader = tradeData.content;
            
            // Check account age vs reputation mismatch
            if (trader.joinDate) {
                const accountAge = this.calculateAccountAge(trader.joinDate);
                analysis.accountAge = accountAge;
                
                if (accountAge < 30 && trader.trades && trader.trades.includes('1000')) {
                    analysis.redFlags.push('new_account_high_reputation');
                }
            }

            // Analyze reputation patterns
            if (trader.reputation && trader.reputation.includes('5 stars')) {
                const reviewCount = this.extractReviewCount(trader.reputation);
                if (reviewCount > 0 && analysis.accountAge < 60) {
                    analysis.redFlags.push('suspicious_review_pattern');
                }
            }
        }

        return analysis;
    }

    analyzeTradeTerms(tradeData) {
        const analysis = {
            paymentMethod: 'unknown',
            escrowUsed: false,
            advancePaymentRequired: false,
            redFlags: []
        };

        if (tradeData.content && tradeData.content.messages) {
            const messages = tradeData.content.messages.join(' ').toLowerCase();

            // Check for advance payment requests
            if (messages.includes('send me') && messages.includes('first')) {
                analysis.advancePaymentRequired = true;
                analysis.redFlags.push('advance_payment_request');
            }

            // Check for urgency tactics
            if (messages.includes('hurry') || messages.includes('expires')) {
                analysis.redFlags.push('urgency_pressure');
            }

            // Check for trust claims without verification
            if (messages.includes('trusted') && messages.includes('vouches')) {
                analysis.redFlags.push('unverified_trust_claims');
            }
        }

        return analysis;
    }

    analyzeTradeItems(tradeData) {
        const analysis = {
            itemValues: [],
            marketPrices: {},
            valueDiscrepancies: [],
            redFlags: []
        };

        if (tradeData.content && tradeData.content.trades) {
            tradeData.content.trades.forEach(trade => {
                const value = this.parseItemValue(trade.value);
                analysis.itemValues.push(value);

                // Check for unrealistic values
                if (value > 1000) {
                    analysis.redFlags.push('unusually_high_value');
                }

                // Check for common scam items
                if (trade.item && this.isCommonScamItem(trade.item)) {
                    analysis.redFlags.push('common_scam_item');
                }
            });
        }

        return analysis;
    }

    analyzePaymentSecurity(tradeData) {
        const analysis = {
            securePaymentMethod: false,
            escrowAvailable: false,
            paymentProtection: false,
            redFlags: []
        };

        // Check if secure payment methods are offered
        if (tradeData.content && tradeData.content.messages) {
            const messages = tradeData.content.messages.join(' ').toLowerCase();

            if (!messages.includes('paypal') && !messages.includes('escrow')) {
                analysis.redFlags.push('no_secure_payment');
            }

            if (messages.includes('gift card') || messages.includes('crypto')) {
                analysis.redFlags.push('irreversible_payment_method');
            }
        }

        return analysis;
    }

    calculateTradingRiskScore(fraudIndicators) {
        const indicatorWeights = {
            'new_account_high_reputation': 30,
            'suspicious_review_pattern': 25,
            'advance_payment_request': 35,
            'urgency_pressure': 20,
            'unverified_trust_claims': 15,
            'unusually_high_value': 20,
            'common_scam_item': 25,
            'no_secure_payment': 30,
            'irreversible_payment_method': 40
        };

        let score = 0;
        fraudIndicators.forEach(indicator => {
            score += indicatorWeights[indicator] || 10;
        });

        return Math.min(score, 100);
    }

    analyzeLoginPatterns(accountData) {
        const analysis = {
            unusualLocations: [],
            suspiciousIPs: [],
            timePatternAnomalies: [],
            anomalies: []
        };

        if (accountData.content && accountData.content.recentLogins) {
            const logins = accountData.content.recentLogins;

            // Check for geographically impossible logins
            const locations = logins.map(login => login.location);
            if (this.hasImpossibleLocationChanges(locations, logins)) {
                analysis.anomalies.push('impossible_location_changes');
                analysis.unusualLocations = locations;
            }

            // Check for suspicious IP addresses
            logins.forEach(login => {
                if (this.isSuspiciousIP(login.ip)) {
                    analysis.suspiciousIPs.push(login.ip);
                    analysis.anomalies.push('suspicious_ip_detected');
                }
            });

            // Check for unusual time patterns
            if (this.hasUnusualTimePatterns(logins)) {
                analysis.anomalies.push('unusual_time_patterns');
            }
        }

        return analysis;
    }

    analyzeAccountActivity(accountData) {
        const analysis = {
            suspiciousActivities: [],
            unusualTrades: [],
            accountChanges: []
        };

        if (accountData.content && accountData.content.trades) {
            const trades = accountData.content.trades;

            // Check for rapid high-value trades
            const highValueTrades = trades.filter(trade => 
                this.parseItemValue(trade.value) > 200
            );

            if (highValueTrades.length > 2) {
                analysis.suspiciousActivities.push('rapid_high_value_trades');
                analysis.unusualTrades = highValueTrades;
            }

            // Check for trades with suspicious buyers
            trades.forEach(trade => {
                if (this.isSuspiciousBuyer(trade.buyer)) {
                    analysis.suspiciousActivities.push('suspicious_buyer_detected');
                }
            });
        }

        return analysis;
    }

    analyzeNetworkSecurity(accountData) {
        const analysis = {
            riskIndicators: [],
            vpnUsage: false,
            knownMaliciousIPs: [],
            geolocationRisks: []
        };

        if (accountData.network) {
            const network = accountData.network;

            // Check for VPN usage
            if (network.provider && network.provider.toLowerCase().includes('vpn')) {
                analysis.vpnUsage = true;
                analysis.riskIndicators.push('vpn_usage_detected');
            }

            // Check IP reputation
            if (network.reputation === 'suspicious') {
                analysis.riskIndicators.push('suspicious_ip_reputation');
                analysis.knownMaliciousIPs.push(network.ip);
            }

            // Check for high-risk locations
            if (this.isHighRiskLocation(network.location)) {
                analysis.riskIndicators.push('high_risk_location');
                analysis.geolocationRisks.push(network.location);
            }
        }

        return analysis;
    }

    analyzeAuthenticationSecurity(accountData) {
        return {
            twoFactorEnabled: false,
            passwordStrength: 'unknown',
            recentPasswordChange: false,
            securityQuestions: false,
            recommendations: [
                'Enable two-factor authentication',
                'Use strong, unique passwords',
                'Regularly update security settings'
            ]
        };
    }

    calculateSecurityScore(compromiseIndicators) {
        const baseScore = 100;
        const indicatorPenalties = {
            'impossible_location_changes': 40,
            'suspicious_ip_detected': 30,
            'unusual_time_patterns': 20,
            'rapid_high_value_trades': 25,
            'suspicious_buyer_detected': 20,
            'vpn_usage_detected': 15,
            'suspicious_ip_reputation': 35,
            'high_risk_location': 25
        };

        let penalty = 0;
        compromiseIndicators.forEach(indicator => {
            penalty += indicatorPenalties[indicator] || 10;
        });

        return Math.max(baseScore - penalty, 0);
    }

    identifyScamType(scamData) {
        const analysis = {
            type: 'unknown',
            indicators: []
        };

        if (scamData.content && scamData.content.messages) {
            const messages = scamData.content.messages.join(' ').toLowerCase();

            // Trading scam detection
            if (messages.includes('trade') && messages.includes('first')) {
                analysis.type = 'trading_scam';
                analysis.indicators.push('advance_fee_trading');
            }

            // Phishing detection
            if (messages.includes('verify') && messages.includes('account')) {
                analysis.type = 'phishing_scam';
                analysis.indicators.push('account_verification_request');
            }

            // Prize/giveaway scam
            if (messages.includes('won') || messages.includes('prize')) {
                analysis.type = 'prize_scam';
                analysis.indicators.push('fake_prize_notification');
            }
        }

        return analysis;
    }

    analyzeScamCommunication(scamData) {
        const analysis = {
            tactics: []
        };

        if (scamData.content && scamData.content.messages) {
            const messages = scamData.content.messages.join(' ').toLowerCase();

            // Urgency tactics
            if (messages.includes('hurry') || messages.includes('limited time')) {
                analysis.tactics.push('urgency_creation');
            }

            // Authority claims
            if (messages.includes('official') || messages.includes('admin')) {
                analysis.tactics.push('false_authority');
            }

            // Social proof claims
            if (messages.includes('many people') || messages.includes('everyone')) {
                analysis.tactics.push('false_social_proof');
            }
        }

        return analysis;
    }

    analyzeScamPatterns(scamData) {
        return {
            patterns: [
                'unsolicited_contact',
                'too_good_to_be_true_offer',
                'pressure_for_quick_action'
            ]
        };
    }

    calculateScamConfidence(indicators) {
        return Math.min(indicators.length * 20, 100);
    }

    // Helper methods
    calculateAccountAge(joinDate) {
        const join = new Date(joinDate);
        const now = new Date();
        return Math.floor((now - join) / (1000 * 60 * 60 * 24));
    }

    extractReviewCount(reputationString) {
        const match = reputationString.match(/\((\d+)\s*reviews?\)/);
        return match ? parseInt(match[1]) : 0;
    }

    parseItemValue(valueString) {
        const match = valueString.match(/\$(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    isCommonScamItem(itemName) {
        const scamItems = ['rare skin', 'exclusive item', 'limited edition'];
        return scamItems.some(item => 
            itemName.toLowerCase().includes(item.toLowerCase())
        );
    }

    hasImpossibleLocationChanges(locations, logins) {
        // Check if logins from different continents happened within impossible timeframes
        for (let i = 1; i < logins.length; i++) {
            const timeDiff = new Date(logins[i].time) - new Date(logins[i-1].time);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            if (hoursDiff < 8 && this.areLocationsFarApart(locations[i-1], locations[i])) {
                return true;
            }
        }
        return false;
    }

    areLocationsFarApart(loc1, loc2) {
        const farLocations = [
            ['USA', 'Russia'],
            ['Europe', 'Asia'],
            ['America', 'Africa']
        ];
        
        return farLocations.some(pair => 
            (loc1.includes(pair[0]) && loc2.includes(pair[1])) ||
            (loc1.includes(pair[1]) && loc2.includes(pair[0]))
        );
    }

    isSuspiciousIP(ip) {
        // Check against known suspicious IP patterns
        const suspiciousRanges = ['185.220', '192.168', '10.0'];
        return suspiciousRanges.some(range => ip.startsWith(range));
    }

    hasUnusualTimePatterns(logins) {
        // Check for logins at unusual hours (3-6 AM local time)
        return logins.some(login => {
            const hour = new Date(login.time).getHours();
            return hour >= 3 && hour <= 6;
        });
    }

    isSuspiciousBuyer(buyerName) {
        const suspiciousPatterns = ['quickcash', 'fasttrade', 'easymoney'];
        return suspiciousPatterns.some(pattern => 
            buyerName.toLowerCase().includes(pattern)
        );
    }

    isHighRiskLocation(location) {
        const highRiskLocations = ['Unknown', 'VPN', 'Proxy'];
        return highRiskLocations.some(risk => 
            location.toLowerCase().includes(risk.toLowerCase())
        );
    }

    // Educational feedback generators
    generateTradingEducationalFeedback(analysis) {
        const points = [];

        if (analysis.riskScore > 70) {
            points.push('High-risk trade detected - multiple fraud indicators present');
            points.push('Never send items or money first to unverified traders');
        }

        if (analysis.fraudIndicators.includes('advance_payment_request')) {
            points.push('Legitimate traders use escrow services for protection');
            points.push('Advance payment requests are major red flags in trading');
        }

        if (analysis.fraudIndicators.includes('urgency_pressure')) {
            points.push('Scammers create false urgency to pressure quick decisions');
            points.push('Take time to verify trades and trader reputation');
        }

        points.push('Always use official trading platforms with buyer protection');

        return points;
    }

    generateSecurityEducationalFeedback(analysis) {
        const points = [];

        if (analysis.securityScore < 50) {
            points.push('Account shows signs of compromise - immediate action required');
            points.push('Change passwords and enable two-factor authentication');
        }

        if (analysis.compromiseIndicators.includes('impossible_location_changes')) {
            points.push('Impossible location changes indicate account takeover');
            points.push('Monitor login notifications and secure your account');
        }

        if (analysis.compromiseIndicators.includes('suspicious_ip_detected')) {
            points.push('Suspicious IP addresses may indicate unauthorized access');
            points.push('Review recent account activity for unauthorized changes');
        }

        points.push('Regular security monitoring helps detect threats early');

        return points;
    }

    generateScamEducationalFeedback(analysis) {
        const points = [];

        if (analysis.scamType === 'trading_scam') {
            points.push('Trading scams exploit trust and greed in gaming communities');
            points.push('Always verify trader reputation through multiple sources');
        }

        if (analysis.scamType === 'phishing_scam') {
            points.push('Phishing attempts steal login credentials through fake websites');
            points.push('Always verify URLs and never enter passwords from email links');
        }

        points.push('When in doubt, report suspicious activity to platform administrators');

        return points;
    }

    // Recommendation generators
    generateTradingRecommendations(analysis) {
        const recommendations = [];

        if (analysis.riskScore > 50) {
            recommendations.push({
                priority: 'high',
                action: 'Avoid this trade - too many risk factors',
                reason: 'Multiple fraud indicators detected'
            });
        }

        recommendations.push({
            priority: 'medium',
            action: 'Use official escrow services for all trades',
            reason: 'Protects both parties in trading transactions'
        });

        return recommendations;
    }

    generateSecurityRecommendations(analysis) {
        const recommendations = [];

        if (analysis.securityScore < 70) {
            recommendations.push({
                priority: 'urgent',
                action: 'Change password immediately',
                reason: 'Account security compromised'
            });
        }

        recommendations.push({
            priority: 'high',
            action: 'Enable two-factor authentication',
            reason: 'Adds extra layer of account protection'
        });

        return recommendations;
    }

    generateScamRecommendations(analysis) {
        const recommendations = [];

        if (analysis.confidenceLevel > 70) {
            recommendations.push({
                priority: 'urgent',
                action: 'Report scam to platform administrators',
                reason: 'High confidence scam detection'
            });
        }

        recommendations.push({
            priority: 'high',
            action: 'Block all communication with suspected scammer',
            reason: 'Prevent further manipulation attempts'
        });

        return recommendations;
    }

    // Security tips and prevention
    getTradingSecurityTips() {
        return [
            'Always use official trading platforms with escrow services',
            'Verify trader reputation through multiple independent sources',
            'Never send items or money first to unverified traders',
            'Be suspicious of deals that seem too good to be true',
            'Take screenshots of all trade communications'
        ];
    }

    getImmediateSecurityActions(analysis) {
        const actions = [];

        if (analysis.securityScore < 50) {
            actions.push('Change password immediately');
            actions.push('Enable two-factor authentication');
            actions.push('Review recent account activity');
            actions.push('Check for unauthorized purchases or trades');
        }

        return actions;
    }

    getScamPreventionTips(scamType) {
        const tips = {
            'trading_scam': [
                'Use official trading platforms only',
                'Never trade outside secure environments',
                'Verify all trader claims independently'
            ],
            'phishing_scam': [
                'Always check URLs before entering credentials',
                'Never click links in suspicious emails',
                'Use official website bookmarks'
            ],
            'prize_scam': [
                'Verify contest legitimacy through official channels',
                'Never pay fees to claim prizes',
                'Be suspicious of unsolicited prize notifications'
            ]
        };

        return tips[scamType] || [
            'Trust your instincts about suspicious offers',
            'Verify claims through official sources',
            'Report suspicious activity to authorities'
        ];
    }
}

/**
 * S
tanley's Identity Theft Detection and Document Verification Tools
 * Specialized for elder fraud prevention and document authentication
 */
class StanleyInvestigationTools {
    constructor() {
        this.toolId = 'stanley_tools';
        this.character = 'stanley';
        this.domain = 'elder_fraud_prevention';
    }

    /**
     * Identity Theft Detection System
     * Comprehensive analysis for identity theft indicators and prevention
     * @param {Object} identityData - Personal information and activity data
     * @param {Object} userInput - User's analysis input
     * @returns {Object} Identity theft analysis results
     */
    detectIdentityTheft(identityData, userInput = {}) {
        const analysis = {
            toolUsed: 'identity_theft_detector',
            character: 'stanley',
            timestamp: Date.now(),
            identityId: identityData.id || 'unknown',
            findings: {},
            riskScore: 0,
            theftIndicators: [],
            educationalPoints: []
        };

        // Analyze personal information exposure
        const exposureAnalysis = this.analyzeInformationExposure(identityData);
        analysis.findings.informationExposure = exposureAnalysis;
        analysis.theftIndicators.push(...exposureAnalysis.riskFactors);

        // Check for unauthorized account activity
        const accountAnalysis = this.analyzeUnauthorizedActivity(identityData);
        analysis.findings.unauthorizedActivity = accountAnalysis;
        analysis.theftIndicators.push(...accountAnalysis.suspiciousActivities);

        // Analyze communication patterns for fraud attempts
        const communicationAnalysis = this.analyzeFraudCommunications(identityData);
        analysis.findings.fraudCommunications = communicationAnalysis;
        analysis.theftIndicators.push(...communicationAnalysis.fraudIndicators);

        // Check for document forgery indicators
        const documentAnalysis = this.analyzeDocumentAuthenticity(identityData);
        analysis.findings.documentAuthenticity = documentAnalysis;
        analysis.theftIndicators.push(...documentAnalysis.forgeryIndicators);

        // Calculate overall risk score
        analysis.riskScore = this.calculateIdentityTheftRisk(analysis.theftIndicators);

        // Generate educational feedback
        analysis.educationalPoints = this.generateIdentityTheftEducation(analysis);

        return {
            success: true,
            analysis: analysis,
            recommendations: this.generateIdentityTheftRecommendations(analysis),
            preventionSteps: this.getIdentityTheftPreventionSteps()
        };
    }

    /**
     * Document Verification System
     * Advanced document authentication and forgery detection
     * @param {Object} documentData - Document information and metadata
     * @param {Object} userInput - User's verification parameters
     * @returns {Object} Document verification results
     */
    verifyDocument(documentData, userInput = {}) {
        const analysis = {
            toolUsed: 'document_verifier',
            character: 'stanley',
            timestamp: Date.now(),
            documentId: documentData.id || 'unknown',
            findings: {},
            authenticityScore: 0,
            forgeryIndicators: [],
            educationalPoints: []
        };

        // Analyze document format and structure
        const formatAnalysis = this.analyzeDocumentFormat(documentData);
        analysis.findings.formatAnalysis = formatAnalysis;
        analysis.forgeryIndicators.push(...formatAnalysis.anomalies);

        // Check official seals and markings
        const sealAnalysis = this.analyzeOfficialSeals(documentData);
        analysis.findings.sealAnalysis = sealAnalysis;
        analysis.forgeryIndicators.push(...sealAnalysis.irregularities);

        // Verify issuing authority information
        const authorityAnalysis = this.verifyIssuingAuthority(documentData);
        analysis.findings.authorityVerification = authorityAnalysis;
        analysis.forgeryIndicators.push(...authorityAnalysis.discrepancies);

        // Analyze language and content patterns
        const contentAnalysis = this.analyzeDocumentContent(documentData);
        analysis.findings.contentAnalysis = contentAnalysis;
        analysis.forgeryIndicators.push(...contentAnalysis.suspiciousPatterns);

        // Calculate authenticity score
        analysis.authenticityScore = this.calculateAuthenticityScore(analysis.forgeryIndicators);

        // Generate educational feedback
        analysis.educationalPoints = this.generateDocumentEducation(analysis);

        return {
            success: true,
            analysis: analysis,
            recommendations: this.generateDocumentRecommendations(analysis),
            verificationSteps: this.getDocumentVerificationSteps()
        };
    }

    /**
     * Elder Fraud Detection System
     * Specialized detection of fraud schemes targeting seniors
     * @param {Object} fraudData - Potential fraud attempt information
     * @param {Object} userInput - User's analysis input
     * @returns {Object} Elder fraud analysis results
     */
    detectElderFraud(fraudData, userInput = {}) {
        const analysis = {
            toolUsed: 'elder_fraud_detector',
            character: 'stanley',
            timestamp: Date.now(),
            fraudId: fraudData.id || 'unknown',
            fraudType: 'unknown',
            fraudIndicators: [],
            targetingTactics: [],
            educationalPoints: []
        };

        // Identify fraud type
        const fraudTypeAnalysis = this.identifyElderFraudType(fraudData);
        analysis.fraudType = fraudTypeAnalysis.type;
        analysis.fraudIndicators.push(...fraudTypeAnalysis.indicators);

        // Analyze targeting tactics specific to seniors
        const tacticsAnalysis = this.analyzeElderTargetingTactics(fraudData);
        analysis.targetingTactics = tacticsAnalysis.tactics;
        analysis.fraudIndicators.push(...tacticsAnalysis.manipulationMethods);

        // Check for authority impersonation
        const impersonationAnalysis = this.analyzeAuthorityImpersonation(fraudData);
        analysis.fraudIndicators.push(...impersonationAnalysis.impersonationIndicators);

        // Analyze urgency and fear tactics
        const pressureAnalysis = this.analyzePressureTactics(fraudData);
        analysis.fraudIndicators.push(...pressureAnalysis.pressureMethods);

        // Generate educational feedback
        analysis.educationalPoints = this.generateElderFraudEducation(analysis);

        return {
            success: true,
            analysis: analysis,
            recommendations: this.generateElderFraudRecommendations(analysis),
            protectionStrategies: this.getElderProtectionStrategies(analysis.fraudType)
        };
    }

    // Private helper methods for Stanley's tools

    analyzeInformationExposure(identityData) {
        const analysis = {
            exposedInformation: [],
            riskFactors: [],
            exposureLevel: 'low'
        };

        // Check for common information exposure points
        if (identityData.content) {
            const content = identityData.content;

            // Check for SSN exposure
            if (content.ssn || (content.messages && 
                content.messages.some(msg => msg.toLowerCase().includes('social security')))) {
                analysis.exposedInformation.push('Social Security Number');
                analysis.riskFactors.push('ssn_exposure');
            }

            // Check for financial information exposure
            if (content.bankAccount || content.creditCard) {
                analysis.exposedInformation.push('Financial Information');
                analysis.riskFactors.push('financial_info_exposure');
            }

            // Check for personal details exposure
            if (content.birthDate || content.mothersMaiden) {
                analysis.exposedInformation.push('Personal Verification Details');
                analysis.riskFactors.push('personal_details_exposure');
            }
        }

        // Determine exposure level
        if (analysis.riskFactors.length > 2) {
            analysis.exposureLevel = 'high';
        } else if (analysis.riskFactors.length > 0) {
            analysis.exposureLevel = 'medium';
        }

        return analysis;
    }

    analyzeUnauthorizedActivity(identityData) {
        const analysis = {
            suspiciousActivities: [],
            accountChanges: [],
            financialAnomalies: []
        };

        if (identityData.content && identityData.content.transactions) {
            const transactions = identityData.content.transactions;

            // Check for unusual charges
            transactions.forEach(transaction => {
                if (this.isUnusualCharge(transaction)) {
                    analysis.suspiciousActivities.push('unusual_charges');
                    analysis.financialAnomalies.push(transaction);
                }

                // Check for verification fees (common in elder fraud)
                if (transaction.description && 
                    transaction.description.toLowerCase().includes('verification')) {
                    analysis.suspiciousActivities.push('verification_fees');
                }
            });
        }

        return analysis;
    }

    analyzeFraudCommunications(identityData) {
        const analysis = {
            fraudIndicators: [],
            manipulationTactics: [],
            urgencyLevel: 'low'
        };

        if (identityData.content && identityData.content.messages) {
            const messages = identityData.content.messages.join(' ').toLowerCase();

            // Check for government impersonation
            if (messages.includes('social security') || messages.includes('medicare')) {
                analysis.fraudIndicators.push('government_impersonation');
            }

            // Check for urgency tactics
            if (messages.includes('urgent') || messages.includes('immediately')) {
                analysis.fraudIndicators.push('urgency_tactics');
                analysis.urgencyLevel = 'high';
            }

            // Check for fear tactics
            if (messages.includes('suspended') || messages.includes('cancelled')) {
                analysis.fraudIndicators.push('fear_tactics');
            }

            // Check for information harvesting
            if (messages.includes('verify') && messages.includes('number')) {
                analysis.fraudIndicators.push('information_harvesting');
            }
        }

        return analysis;
    }

    analyzeDocumentAuthenticity(identityData) {
        const analysis = {
            forgeryIndicators: [],
            authenticityMarkers: [],
            overallAuthenticity: 'unknown'
        };

        if (identityData.document) {
            const doc = identityData.document;

            // Check for missing official elements
            if (!doc.marks || doc.marks.includes('Missing official seal')) {
                analysis.forgeryIndicators.push('missing_official_seal');
            }

            // Check for formatting issues
            if (doc.marks && doc.marks.includes('Incorrect formatting')) {
                analysis.forgeryIndicators.push('incorrect_formatting');
            }

            // Check for alterations
            if (doc.altered) {
                analysis.forgeryIndicators.push('document_alterations');
            }

            // Determine overall authenticity
            if (analysis.forgeryIndicators.length > 2) {
                analysis.overallAuthenticity = 'likely_forged';
            } else if (analysis.forgeryIndicators.length > 0) {
                analysis.overallAuthenticity = 'questionable';
            } else {
                analysis.overallAuthenticity = 'likely_authentic';
            }
        }

        return analysis;
    }

    calculateIdentityTheftRisk(indicators) {
        const indicatorWeights = {
            'ssn_exposure': 40,
            'financial_info_exposure': 35,
            'personal_details_exposure': 25,
            'unusual_charges': 30,
            'verification_fees': 35,
            'government_impersonation': 40,
            'urgency_tactics': 25,
            'fear_tactics': 30,
            'information_harvesting': 35
        };

        let score = 0;
        indicators.forEach(indicator => {
            score += indicatorWeights[indicator] || 15;
        });

        return Math.min(score, 100);
    }

    analyzeDocumentFormat(documentData) {
        const analysis = {
            formatCompliance: 'unknown',
            anomalies: [],
            structuralIssues: []
        };

        if (documentData.document) {
            const doc = documentData.document;

            // Check for standard government document formatting
            if (doc.marks && doc.marks.includes('Incorrect formatting')) {
                analysis.anomalies.push('non_standard_formatting');
                analysis.structuralIssues.push('Format does not match official standards');
            }

            // Check for required elements
            if (!doc.issuer || doc.issuer === 'Fake government agency') {
                analysis.anomalies.push('invalid_issuer');
            }
        }

        return analysis;
    }

    analyzeOfficialSeals(documentData) {
        const analysis = {
            sealPresent: false,
            sealAuthenticity: 'unknown',
            irregularities: []
        };

        if (documentData.document && documentData.document.marks) {
            const marks = documentData.document.marks;

            // Check for missing seals
            if (marks.includes('Missing official seal')) {
                analysis.irregularities.push('missing_official_seal');
                analysis.sealPresent = false;
            } else {
                analysis.sealPresent = true;
            }

            // Check for seal quality issues
            if (marks.includes('Poor quality seal') || marks.includes('Blurry seal')) {
                analysis.irregularities.push('poor_quality_seal');
            }
        }

        return analysis;
    }

    verifyIssuingAuthority(documentData) {
        const analysis = {
            authorityValid: false,
            discrepancies: [],
            contactInfoValid: false
        };

        if (documentData.document) {
            const doc = documentData.document;

            // Check issuer validity
            if (doc.issuer === 'Fake government agency') {
                analysis.discrepancies.push('invalid_issuing_authority');
                analysis.authorityValid = false;
            }

            // Check for suspicious contact methods
            if (documentData.content && documentData.content.content) {
                const content = documentData.content.content.toLowerCase();
                if (content.includes('call immediately') || content.includes('urgent')) {
                    analysis.discrepancies.push('suspicious_contact_urgency');
                }
            }
        }

        return analysis;
    }

    analyzeDocumentContent(documentData) {
        const analysis = {
            languageQuality: 'unknown',
            suspiciousPatterns: [],
            contentAccuracy: 'unknown'
        };

        if (documentData.content && documentData.content.content) {
            const content = documentData.content.content.toLowerCase();

            // Check for spelling/grammar errors
            if (this.hasSpellingErrors(content)) {
                analysis.suspiciousPatterns.push('spelling_grammar_errors');
                analysis.languageQuality = 'poor';
            }

            // Check for threatening language
            if (content.includes('suspended') || content.includes('terminated')) {
                analysis.suspiciousPatterns.push('threatening_language');
            }

            // Check for urgency language
            if (content.includes('immediately') || content.includes('urgent')) {
                analysis.suspiciousPatterns.push('urgency_language');
            }
        }

        return analysis;
    }

    calculateAuthenticityScore(forgeryIndicators) {
        const baseScore = 100;
        const indicatorPenalties = {
            'missing_official_seal': 30,
            'incorrect_formatting': 25,
            'document_alterations': 35,
            'non_standard_formatting': 20,
            'invalid_issuer': 40,
            'poor_quality_seal': 20,
            'invalid_issuing_authority': 40,
            'suspicious_contact_urgency': 25,
            'spelling_grammar_errors': 30,
            'threatening_language': 25,
            'urgency_language': 20
        };

        let penalty = 0;
        forgeryIndicators.forEach(indicator => {
            penalty += indicatorPenalties[indicator] || 15;
        });

        return Math.max(baseScore - penalty, 0);
    }

    identifyElderFraudType(fraudData) {
        const analysis = {
            type: 'unknown',
            indicators: []
        };

        if (fraudData.content) {
            const content = fraudData.content;

            // Government benefit scam
            if (content.sender && content.sender.includes('Social Security')) {
                analysis.type = 'government_benefit_scam';
                analysis.indicators.push('government_impersonation');
            }

            // Medicare scam
            if (content.caller && content.caller.includes('Medicare')) {
                analysis.type = 'medicare_scam';
                analysis.indicators.push('healthcare_impersonation');
            }

            // Tech support scam
            if (content.message && content.message.toLowerCase().includes('computer')) {
                analysis.type = 'tech_support_scam';
                analysis.indicators.push('technical_assistance_claim');
            }

            // Grandparent scam
            if (content.message && content.message.toLowerCase().includes('emergency')) {
                analysis.type = 'emergency_scam';
                analysis.indicators.push('family_emergency_claim');
            }
        }

        return analysis;
    }

    analyzeElderTargetingTactics(fraudData) {
        const analysis = {
            tactics: [],
            manipulationMethods: []
        };

        if (fraudData.communication) {
            const comm = fraudData.communication;

            // Authority impersonation
            if (comm.patterns && comm.patterns.includes('Authority impersonation')) {
                analysis.tactics.push('Authority Impersonation');
                analysis.manipulationMethods.push('authority_impersonation');
            }

            // Fear tactics
            if (comm.tactics && comm.tactics.includes('Fear tactics')) {
                analysis.tactics.push('Fear and Intimidation');
                analysis.manipulationMethods.push('fear_intimidation');
            }

            // Urgency creation
            if (comm.patterns && comm.patterns.includes('Urgency creation')) {
                analysis.tactics.push('Urgency Pressure');
                analysis.manipulationMethods.push('urgency_pressure');
            }

            // Information harvesting
            if (comm.patterns && comm.patterns.includes('Information harvesting')) {
                analysis.tactics.push('Information Harvesting');
                analysis.manipulationMethods.push('information_harvesting');
            }
        }

        return analysis;
    }

    analyzeAuthorityImpersonation(fraudData) {
        const analysis = {
            impersonationIndicators: []
        };

        if (fraudData.content) {
            // Check for government agency impersonation
            if (fraudData.content.sender && 
                fraudData.content.sender.includes('Administration')) {
                analysis.impersonationIndicators.push('government_agency_impersonation');
            }

            // Check for healthcare impersonation
            if (fraudData.content.caller && 
                fraudData.content.caller.includes('Medicare')) {
                analysis.impersonationIndicators.push('healthcare_authority_impersonation');
            }

            // Check for law enforcement impersonation
            if (fraudData.content.message && 
                fraudData.content.message.toLowerCase().includes('police')) {
                analysis.impersonationIndicators.push('law_enforcement_impersonation');
            }
        }

        return analysis;
    }

    analyzePressureTactics(fraudData) {
        const analysis = {
            pressureMethods: []
        };

        if (fraudData.communication) {
            const comm = fraudData.communication;

            // Time pressure
            if (comm.urgency === 'critical') {
                analysis.pressureMethods.push('time_pressure');
            }

            // Threat of consequences
            if (comm.suspicious && comm.suspicious.includes('Threat of suspension')) {
                analysis.pressureMethods.push('consequence_threats');
            }

            // Immediate action required
            if (comm.suspicious && comm.suspicious.includes('Unsolicited call')) {
                analysis.pressureMethods.push('unsolicited_contact');
            }
        }

        return analysis;
    }

    // Helper methods
    isUnusualCharge(transaction) {
        const unusualDescriptions = ['verification fee', 'account protection', 'security service'];
        return unusualDescriptions.some(desc => 
            transaction.description.toLowerCase().includes(desc)
        );
    }

    hasSpellingErrors(content) {
        // Simple check for common spelling errors in scam documents
        const commonErrors = ['recieve', 'seperate', 'occured', 'goverment'];
        return commonErrors.some(error => content.includes(error));
    }

    // Educational feedback generators
    generateIdentityTheftEducation(analysis) {
        const points = [];

        if (analysis.riskScore > 70) {
            points.push('High risk of identity theft detected - immediate action required');
            points.push('Never provide personal information to unsolicited contacts');
        }

        if (analysis.theftIndicators.includes('ssn_exposure')) {
            points.push('Social Security numbers should never be shared over phone or email');
            points.push('Government agencies already have your SSN and will not ask for it');
        }

        if (analysis.theftIndicators.includes('government_impersonation')) {
            points.push('Government agencies do not make threatening phone calls');
            points.push('Always verify government contact through official phone numbers');
        }

        points.push('Legitimate organizations will allow you time to verify their identity');

        return points;
    }

    generateDocumentEducation(analysis) {
        const points = [];

        if (analysis.authenticityScore < 50) {
            points.push('Document shows multiple signs of forgery - likely fraudulent');
            points.push('Official government documents have specific security features');
        }

        if (analysis.forgeryIndicators.includes('missing_official_seal')) {
            points.push('All official government documents contain authentic seals and watermarks');
            points.push('Missing or poor-quality seals indicate document forgery');
        }

        if (analysis.forgeryIndicators.includes('spelling_grammar_errors')) {
            points.push('Official documents are professionally written without errors');
            points.push('Spelling and grammar mistakes are red flags for fraud');
        }

        points.push('When in doubt, contact the issuing agency directly to verify documents');

        return points;
    }

    generateElderFraudEducation(analysis) {
        const points = [];

        if (analysis.fraudType === 'government_benefit_scam') {
            points.push('Government agencies do not threaten benefit suspension over the phone');
            points.push('Social Security Administration communicates through official mail');
        }

        if (analysis.fraudType === 'medicare_scam') {
            points.push('Medicare representatives do not call asking for personal information');
            points.push('Medicare cards are being replaced - scammers exploit this transition');
        }

        if (analysis.targetingTactics.includes('Authority Impersonation')) {
            points.push('Scammers impersonate authority figures to create compliance');
            points.push('Always verify the identity of callers claiming to be officials');
        }

        points.push('Take time to think and consult trusted family or friends before acting');

        return points;
    }

    // Recommendation generators
    generateIdentityTheftRecommendations(analysis) {
        const recommendations = [];

        if (analysis.riskScore > 70) {
            recommendations.push({
                priority: 'urgent',
                action: 'Place fraud alert on credit reports',
                reason: 'High risk of identity theft detected'
            });
        }

        if (analysis.theftIndicators.includes('financial_info_exposure')) {
            recommendations.push({
                priority: 'high',
                action: 'Contact banks and credit card companies',
                reason: 'Financial information may be compromised'
            });
        }

        recommendations.push({
            priority: 'medium',
            action: 'Monitor credit reports regularly',
            reason: 'Early detection of unauthorized accounts'
        });

        return recommendations;
    }

    generateDocumentRecommendations(analysis) {
        const recommendations = [];

        if (analysis.authenticityScore < 60) {
            recommendations.push({
                priority: 'high',
                action: 'Do not respond to document requests',
                reason: 'Document appears to be fraudulent'
            });
        }

        recommendations.push({
            priority: 'medium',
            action: 'Verify through official government channels',
            reason: 'Confirm document authenticity independently'
        });

        return recommendations;
    }

    generateElderFraudRecommendations(analysis) {
        const recommendations = [];

        if (analysis.fraudIndicators.length > 3) {
            recommendations.push({
                priority: 'urgent',
                action: 'Report fraud attempt to authorities',
                reason: 'Multiple fraud indicators detected'
            });
        }

        recommendations.push({
            priority: 'high',
            action: 'Hang up and call official number',
            reason: 'Verify legitimacy through official channels'
        });

        return recommendations;
    }

    // Prevention and protection strategies
    getIdentityTheftPreventionSteps() {
        return [
            'Never give personal information to unsolicited contacts',
            'Verify caller identity through official phone numbers',
            'Monitor financial accounts and credit reports regularly',
            'Use strong, unique passwords for all accounts',
            'Be cautious about sharing personal information online'
        ];
    }

    getDocumentVerificationSteps() {
        return [
            'Check for official seals and watermarks',
            'Verify issuing authority contact information',
            'Look for spelling and grammar errors',
            'Compare with known authentic documents',
            'Contact issuing agency directly to verify'
        ];
    }

    getElderProtectionStrategies(fraudType) {
        const strategies = {
            'government_benefit_scam': [
                'Government agencies communicate through official mail',
                'Benefits are not suspended through phone calls',
                'Always verify through official SSA website or office'
            ],
            'medicare_scam': [
                'Medicare does not call asking for personal information',
                'New Medicare cards are sent automatically',
                'Verify through official Medicare.gov website'
            ],
            'tech_support_scam': [
                'Microsoft/Apple do not make unsolicited calls',
                'Never allow remote access to your computer',
                'Contact tech support through official channels only'
            ],
            'emergency_scam': [
                'Verify family emergency through other family members',
                'Ask questions only the real person would know',
                'Never send money without verification'
            ]
        };

        return strategies[fraudType] || [
            'Take time to verify before taking any action',
            'Consult with trusted family or friends',
            'Report suspicious activity to authorities',
            'Trust your instincts if something feels wrong'
        ];
    }
}

// Export all character-specific investigation tools
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MayaInvestigationTools, EliInvestigationTools, StanleyInvestigationTools };
} else if (typeof window !== 'undefined') {
    window.MayaInvestigationTools = MayaInvestigationTools;
    window.EliInvestigationTools = EliInvestigationTools;
    window.StanleyInvestigationTools = StanleyInvestigationTools;
}