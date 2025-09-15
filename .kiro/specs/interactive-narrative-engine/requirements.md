# Requirements Document

## Introduction

The State Management Refactor addresses the critical architectural flaw in Data_Bleed's frontend state transitions. Currently, the application fails to properly transition from the "Login State" to the "Gameplay State," causing UI element bleed and incorrect component positioning. This refactor will implement a robust state machine in index.html to resolve all current UI bugs and provide a stable foundation for the interactive narrative system.

**Current Critical Issues:**
- UI Bleed: Character selection buttons remain visible after login
- Incorrect Component Placement: Chroma Bot appears as static chat panel instead of floating orb
- Broken Asset Paths: Orb video animation not loading
- Failed State Transitions: Login UI doesn't properly fade out to gameplay state

**Existing Functional Components:**
- FastAPI backend with /api/chat endpoint working correctly
- Individual UI components functional in isolation
- API connectivity and CORS policies working
- Character dashboards and chat logic complete

## Requirements

### Requirement 1

**User Story:** As a player, I want the application to transition cleanly from login to gameplay without UI element bleed or positioning issues, so that I have a professional and immersive experience.

#### Acceptance Criteria

1. WHEN a user successfully logs in THEN the system SHALL completely fade out and hide the entire login screen including character selection buttons
2. WHEN the login screen fades out THEN the system SHALL simultaneously fade in the gameplay area with proper component positioning
3. WHEN the gameplay state loads THEN the character dashboard SHALL appear in the top-left corner of the viewport
4. WHEN the gameplay state loads THEN the Chroma Bot orb SHALL appear as a floating, animated element in the bottom-right corner
5. WHEN the state transition completes THEN no login UI elements SHALL remain visible or interfere with gameplay
6. WHEN the transition occurs THEN the system SHALL maintain session data and character selection from the login process

### Requirement 2

**User Story:** As a player, I want the Chroma Bot orb to function correctly as an animated, interactive floating element, so that I can access the chatbot interface as intended.

#### Acceptance Criteria

1. WHEN the gameplay state loads THEN the Chroma Bot orb SHALL display with the correct video animation looping continuously
2. WHEN the orb is positioned THEN it SHALL use position: fixed with high z-index to float above all other content
3. WHEN I click the orb THEN it SHALL trigger the fireworks animation and open the chat interface
4. WHEN the chat interface opens THEN the orb SHALL hide and the chat box SHALL appear in the correct position
5. WHEN I close the chat interface THEN the orb SHALL reappear with implosion fireworks animation
6. WHEN the orb loads THEN the video asset path SHALL resolve correctly from the root-relative path

### Requirement 3

**User Story:** As a player, I want the character dashboards to display correctly in the gameplay state, so that I can see my character's metrics and status information clearly.

#### Acceptance Criteria

1. WHEN the gameplay state loads THEN only the selected character's dashboard SHALL be visible (Maya, Eli, or Stanley)
2. WHEN the dashboard appears THEN it SHALL be positioned in the top-left corner of the viewport with proper styling
3. WHEN the dashboard loads THEN it SHALL display the character's baseline metrics correctly (e.g., Maya: Suspicious DMs: 3, Blocked Profiles: 12)
4. WHEN the dashboard is visible THEN it SHALL maintain its character-specific styling and animations
5. WHEN switching between characters THEN the system SHALL hide the previous dashboard and show the new one
6. WHEN the dashboard updates THEN it SHALL use the existing smooth transition animations and visual effects

### Requirement 4

**User Story:** As a player, I want the state management system to properly handle session data and character selection, so that my login choices are preserved throughout the gameplay experience.

#### Acceptance Criteria

1. WHEN I log in as a specific character THEN the system SHALL store the character selection and gamertag in sessionStorage
2. WHEN the state transitions to gameplay THEN the system SHALL retrieve and use the stored character and gamertag data
3. WHEN the chatbot initializes THEN it SHALL use the correct character configuration and session ID from the login process
4. WHEN I interact with the chat system THEN it SHALL maintain the character context and session continuity
5. WHEN the application needs to make API calls THEN it SHALL use the stored session data for proper backend communication
6. WHEN the state machine operates THEN it SHALL preserve all existing functionality while fixing the transition bugs

### Requirement 5

**User Story:** As a player, I want the audio and visual effects to work correctly during state transitions, so that the immersive experience is maintained throughout the application.

#### Acceptance Criteria

1. WHEN state transitions occur THEN the existing audio switching system SHALL continue to function properly
2. WHEN the gameplay state loads THEN the character-specific theme music SHALL play using the existing switchTheme() function
3. WHEN fireworks animations trigger THEN they SHALL use the existing canvas-based animation system without interference
4. WHEN visual effects activate THEN they SHALL coordinate properly with the new state management system
5. WHEN fade animations occur THEN they SHALL use smooth CSS transitions that don't conflict with existing animations
6. WHEN the orb interactions happen THEN the fireworks effects SHALL trigger correctly for both explode and implode animations

### Requirement 6

**User Story:** As a developer, I want the refactored state management system to provide a stable foundation for future development, so that additional features can be built without encountering the current architectural issues.

#### Acceptance Criteria

1. WHEN the state machine is implemented THEN it SHALL provide clear separation between login state and gameplay state
2. WHEN new character paths are added THEN the system SHALL easily accommodate Eli and Stanley using the same state transition pattern
3. WHEN future features are developed THEN they SHALL be able to rely on consistent state management and component positioning
4. WHEN debugging is needed THEN the state machine SHALL provide clear visibility into current state and transition logic
5. WHEN maintenance is required THEN the code SHALL be organized with clear separation of concerns between state management and component logic
6. WHEN the system is extended THEN the existing API connectivity and backend integration SHALL remain fully functional