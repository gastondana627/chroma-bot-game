// 3D Response Formatter
// Handles formatting of chat responses for 3D cinematic moments

class Response3DFormatter {
  constructor() {
    this.cinematicMoments = this.loadCinematicMoments();
  }

  loadCinematicMoments() {
    return {
      eli: {
        tournament_win: {
          storyContext: "Tournament Arena victory",
          emotionalTone: "triumphant",
          keyThemes: ["competition", "skill", "achievement"],
          suggestedDialogue: [
            "That was incredible! You're really getting the hang of this...",
            "I knew you had it in you! That combo was perfect!",
            "Victory tastes sweet, doesn't it? But this is just the beginning..."
          ]
        },
        peer_pressure_peak: {
          storyContext: "Gaming Community peer pressure",
          emotionalTone: "conflicted",
          keyThemes: ["belonging", "pressure", "identity"],
          suggestedDialogue: [
            "Everyone's watching... do you really want to do this?",
            "I get it, fitting in matters. But at what cost?",
            "Sometimes the hardest battles are against ourselves..."
          ]
        },
        final_victory: {
          storyContext: "Championship Victory finale",
          emotionalTone: "heroic",
          keyThemes: ["mastery", "growth", "legacy"],
          suggestedDialogue: [
            "You've come so far from where we started...",
            "This isn't just about winning anymore, is it?",
            "Champions aren't made in a day. They're forged through every choice."
          ]
        }
      },
      maya: {
        suspicious_match_detected: {
          storyContext: "Dating app suspicious activity",
          emotionalTone: "investigative",
          keyThemes: ["deception", "intuition", "danger"],
          suggestedDialogue: [
            "Something's not right about this profile...",
            "Trust your instincts. They're trying to tell you something.",
            "Look closer at the details. What doesn't add up?"
          ]
        },
        investigation_breakthrough: {
          storyContext: "Cyber cafe evidence discovery",
          emotionalTone: "determined",
          keyThemes: ["revelation", "justice", "truth"],
          suggestedDialogue: [
            "Wait... this changes everything. Look at what we found...",
            "The pieces are finally coming together.",
            "Now we have the evidence we need to expose them."
          ]
        },
        confrontation_moment: {
          storyContext: "Final confrontation with scammer",
          emotionalTone: "fierce",
          keyThemes: ["justice", "protection", "resolution"],
          suggestedDialogue: [
            "It ends here. No more victims.",
            "You thought you could hide behind fake profiles forever?",
            "This is for everyone you've hurt."
          ]
        }
      },
      stanley: {
        identity_theft_discovery: {
          storyContext: "Social media identity threat",
          emotionalTone: "alarmed",
          keyThemes: ["vulnerability", "awareness", "protection"],
          suggestedDialogue: [
            "Stop! Don't share that information!",
            "They're building a profile of you with every post...",
            "Your digital footprint is bigger than you think."
          ]
        },
        scam_prevention_success: {
          storyContext: "Digital marketplace scam prevention",
          emotionalTone: "relieved",
          keyThemes: ["safety", "wisdom", "prevention"],
          suggestedDialogue: [
            "Good catch! You just saved yourself from a major scam.",
            "See how they tried to rush you? That's always a red flag.",
            "You're getting better at spotting these tricks."
          ]
        },
        community_leadership: {
          storyContext: "Protection network leadership",
          emotionalTone: "wise",
          keyThemes: ["mentorship", "community", "legacy"],
          suggestedDialogue: [
            "Now you can help protect others like we protected you.",
            "Knowledge shared is power multiplied.",
            "Every person you help makes the whole community stronger."
          ]
        }
      }
    };
  }

  formatResponse(baseResponse, character, storyTrigger, mode) {
    const response = {
      reply: baseResponse,
      mode: mode || "standard",
      timestamp: new Date().toISOString()
    };

    if (mode === "3d_cinematic") {
      response.cinematicData = this.getCinematicData(character, storyTrigger);
      response.animations = this.getAnimationData(character, storyTrigger);
      response.returnToNormal = true;
      response.duration = response.animations.duration;
    }

    return response;
  }

  getCinematicData(character, storyTrigger) {
    const moment = this.cinematicMoments[character]?.[storyTrigger];
    
    if (!moment) {
      return {
        storyContext: "Generic cinematic moment",
        emotionalTone: "neutral",
        keyThemes: ["interaction"]
      };
    }

    return {
      storyContext: moment.storyContext,
      emotionalTone: moment.emotionalTone,
      keyThemes: moment.keyThemes,
      characterFocus: character
    };
  }

  getAnimationData(character, storyTrigger) {
    const animationConfigs = {
      eli: {
        tournament_win: {
          gesture: "victory_pose",
          expression: "confident",
          duration: 8000,
          lighting: {
            theme: "gaming_neon",
            colors: ["#00FFFF", "#FF0080", "#7928CA"],
            intensity: 0.8
          },
          camera: {
            angle: "celebration",
            distance: "medium",
            height: "eye_level"
          },
          effects: ["victory_particles", "neon_glow"]
        },
        peer_pressure_peak: {
          gesture: "defensive_stance",
          expression: "conflicted",
          duration: 10000,
          lighting: {
            theme: "dramatic_shadows",
            colors: ["#FF4444", "#333333", "#666666"],
            intensity: 0.6
          },
          camera: {
            angle: "close_up",
            distance: "close",
            height: "slightly_above"
          },
          effects: ["shadow_play", "tension_atmosphere"]
        },
        final_victory: {
          gesture: "champion_celebration",
          expression: "triumphant",
          duration: 12000,
          lighting: {
            theme: "victory_spotlight",
            colors: ["#FFD700", "#FFFFFF", "#00FFFF"],
            intensity: 1.0
          },
          camera: {
            angle: "hero_shot",
            distance: "medium_wide",
            height: "slightly_below"
          },
          effects: ["champion_aura", "golden_particles", "spotlight_beam"]
        }
      },
      maya: {
        suspicious_match_detected: {
          gesture: "pointing_gesture",
          expression: "concerned",
          duration: 9000,
          lighting: {
            theme: "investigation_mood",
            colors: ["#0066CC", "#FFFFFF", "#333333"],
            intensity: 0.7
          },
          camera: {
            angle: "detective_angle",
            distance: "medium",
            height: "eye_level"
          },
          effects: ["investigation_glow", "data_streams"]
        },
        investigation_breakthrough: {
          gesture: "eureka_moment",
          expression: "determined",
          duration: 11000,
          lighting: {
            theme: "revelation_glow",
            colors: ["#00AAFF", "#FFFFFF", "#CCCCCC"],
            intensity: 0.9
          },
          camera: {
            angle: "breakthrough_shot",
            distance: "close_medium",
            height: "eye_level"
          },
          effects: ["revelation_burst", "data_connection_lines"]
        },
        confrontation_moment: {
          gesture: "confrontational_pose",
          expression: "fierce",
          duration: 13000,
          lighting: {
            theme: "dramatic_contrast",
            colors: ["#FF0000", "#000000", "#FFFFFF"],
            intensity: 0.8
          },
          camera: {
            angle: "power_stance",
            distance: "medium",
            height: "slightly_below"
          },
          effects: ["dramatic_shadows", "intensity_aura"]
        }
      },
      stanley: {
        identity_theft_discovery: {
          gesture: "warning_gesture",
          expression: "alarmed",
          duration: 10000,
          lighting: {
            theme: "alert_red",
            colors: ["#FF4444", "#FFAAAA", "#330000"],
            intensity: 0.8
          },
          camera: {
            angle: "urgent_close_up",
            distance: "close",
            height: "eye_level"
          },
          effects: ["warning_pulse", "alert_indicators"]
        },
        scam_prevention_success: {
          gesture: "protective_stance",
          expression: "relieved",
          duration: 9000,
          lighting: {
            theme: "safe_blue",
            colors: ["#0088FF", "#AADDFF", "#003366"],
            intensity: 0.7
          },
          camera: {
            angle: "guardian_angle",
            distance: "medium",
            height: "slightly_above"
          },
          effects: ["safety_shield", "calm_atmosphere"]
        },
        community_leadership: {
          gesture: "leadership_pose",
          expression: "wise",
          duration: 11000,
          lighting: {
            theme: "warm_authority",
            colors: ["#FFAA44", "#FFFFFF", "#664422"],
            intensity: 0.8
          },
          camera: {
            angle: "leader_perspective",
            distance: "medium_wide",
            height: "slightly_below"
          },
          effects: ["wisdom_aura", "community_connections"]
        }
      }
    };

    // Return default animation if specific config not found
    const defaultAnimation = {
      gesture: "neutral_gesture",
      expression: "friendly",
      duration: 8000,
      lighting: {
        theme: "standard",
        colors: ["#FFFFFF", "#CCCCCC", "#666666"],
        intensity: 0.6
      },
      camera: {
        angle: "default",
        distance: "medium",
        height: "eye_level"
      },
      effects: ["subtle_glow"]
    };

    return animationConfigs[character]?.[storyTrigger] || defaultAnimation;
  }

  // Validate that a story trigger is supported for cinematic mode
  isValidCinematicTrigger(character, storyTrigger) {
    return !!(this.cinematicMoments[character]?.[storyTrigger]);
  }

  // Get all available cinematic triggers for a character
  getAvailableTriggers(character) {
    return Object.keys(this.cinematicMoments[character] || {});
  }
}

module.exports = Response3DFormatter;