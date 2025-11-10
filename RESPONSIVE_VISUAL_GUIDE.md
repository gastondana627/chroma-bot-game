# 📱 DATA_BLEED - Responsive Design Visual Guide

## How Data Bleed Adapts to Different Devices

---

## 📱 MOBILE PHONE (Portrait)
**Screen Size: 375x667px (iPhone SE)**

```
┌─────────────────────────┐
│   DATA_BLEED LOGO       │
│   (Smaller, centered)   │
│                         │
│   ┌─────────────────┐   │
│   │                 │   │
│   │   MAYA NODE     │   │
│   │   (Stacked)     │   │
│   │                 │   │
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │                 │   │
│   │   ELI NODE      │   │
│   │   (Stacked)     │   │
│   │                 │   │
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │                 │   │
│   │  STANLEY NODE   │   │
│   │   (Stacked)     │   │
│   │                 │   │
│   └─────────────────┘   │
│                         │
│   TAP TO SELECT         │
└─────────────────────────┘
```

**Key Features:**
- ✅ Single column layout
- ✅ Larger touch targets (60px+)
- ✅ Simplified animations
- ✅ Readable text without zoom
- ✅ Full-screen video
- ✅ Stacked decision buttons

---

## 📱 MOBILE PHONE (Landscape)
**Screen Size: 667x375px (iPhone SE Rotated)**

```
┌───────────────────────────────────────────────┐
│ LOGO    [MAYA]  [ELI]  [STANLEY]    INFO     │
│ (Small)  NODE    NODE    NODE      (Compact) │
│                                               │
│         (Horizontal layout, smaller nodes)    │
│                                               │
│              TAP TO SELECT                    │
└───────────────────────────────────────────────┘
```

**Key Features:**
- ✅ Horizontal node layout
- ✅ Compact header
- ✅ Optimized for wide screen
- ✅ Smaller but still tappable

---

## 📱 TABLET (Portrait)
**Screen Size: 768x1024px (iPad)**

```
┌─────────────────────────────────┐
│                                 │
│      DATA_BLEED LOGO            │
│      (Medium size)              │
│                                 │
│  ┌────────┐ ┌────────┐ ┌────────┐
│  │        │ │        │ │        │
│  │  MAYA  │ │  ELI   │ │STANLEY │
│  │  NODE  │ │  NODE  │ │  NODE  │
│  │        │ │        │ │        │
│  └────────┘ └────────┘ └────────┘
│                                 │
│     (Horizontal, medium size)   │
│                                 │
│        CLICK TO SELECT          │
│                                 │
└─────────────────────────────────┘
```

**Key Features:**
- ✅ Horizontal layout
- ✅ Medium-sized nodes
- ✅ Balanced spacing
- ✅ Touch-optimized
- ✅ Full effects enabled

---

## 💻 DESKTOP
**Screen Size: 1920x1080px**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    DATA_BLEED LOGO                          │
│                    (Large, centered)                        │
│                                                             │
│                                                             │
│    ┌──────────┐         ┌──────────┐         ┌──────────┐  │
│    │          │         │          │         │          │  │
│    │   MAYA   │         │   ELI    │         │ STANLEY  │  │
│    │   NODE   │         │   NODE   │         │   NODE   │  │
│    │  (Large) │         │  (Large) │         │  (Large) │  │
│    │          │         │          │         │          │  │
│    └──────────┘         └──────────┘         └──────────┘  │
│                                                             │
│              (Wide spacing, full effects)                   │
│                                                             │
│                   CLICK TO ACCESS CASE FILE                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- ✅ Wide horizontal layout
- ✅ Large interactive nodes
- ✅ Full hover effects
- ✅ All animations enabled
- ✅ Optimal spacing
- ✅ Mouse-optimized

---

## 🎮 VIDEO PLAYER COMPARISON

### **Mobile (Portrait)**
```
┌─────────────────┐
│ Scene 1/6  100  │ ← Compact HUD
├─────────────────┤
│                 │
│                 │
│     VIDEO       │
│   FULL SCREEN   │
│                 │
│                 │
├─────────────────┤
│  [DECISION 1]   │ ← Stacked
│  [DECISION 2]   │   buttons
└─────────────────┘
```

### **Tablet**
```
┌───────────────────────────┐
│ Scene 1/6        Trust:100│ ← Full HUD
├───────────────────────────┤
│                           │
│         VIDEO             │
│      FULL SCREEN          │
│                           │
├───────────────────────────┤
│ [DECISION 1] [DECISION 2] │ ← Side by side
└───────────────────────────┘
```

### **Desktop**
```
┌─────────────────────────────────────────┐
│ Scene 1/6              Trust: 100       │ ← Detailed HUD
│                        Horror: 0        │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│              VIDEO                      │
│           FULL SCREEN                   │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  [DECISION 1]          [DECISION 2]     │ ← Wide spacing
│  (Detailed text)       (Detailed text)  │
└─────────────────────────────────────────┘
```

---

## 🎯 DECISION OVERLAY COMPARISON

### **Mobile**
```
┌─────────────────┐
│ DECISION POINT  │
│                 │
│ What will you   │
│ do?             │
│                 │
│ ┌─────────────┐ │
│ │  SAFE       │ │ ← Full width
│ │  CHOICE     │ │   stacked
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │  RISKY      │ │
│ │  CHOICE     │ │
│ └─────────────┘ │
│                 │
│ 💡 Tip: ...     │
└─────────────────┘
```

### **Desktop**
```
┌─────────────────────────────────────┐
│         DECISION POINT              │
│                                     │
│    What will you do?                │
│                                     │
│  ┌──────────────┐  ┌──────────────┐ │
│  │   SAFE       │  │   RISKY      │ │ ← Side by side
│  │   CHOICE     │  │   CHOICE     │ │
│  │              │  │              │ │
│  └──────────────┘  └──────────────┘ │
│                                     │
│  💡 Security Tip: Detailed advice   │
│     about this decision...          │
└─────────────────────────────────────┘
```

---

## 🎨 CHAT INTERFACE COMPARISON

### **Mobile**
```
┌─────────────────┐
│                 │
│                 │
│     VIDEO       │
│                 │
│                 │
│                 │
│  ┌───────────┐  │ ← Full width
│  │ CHAT BOX  │  │   chat
│  │           │  │
│  │ Messages  │  │
│  │           │  │
│  │ [Input__] │  │
│  └───────────┘  │
│      [ORB]      │ ← Centered
└─────────────────┘
```

### **Desktop**
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│           VIDEO                 │
│                                 │
│                                 │
│                                 │
│                    ┌─────────┐  │ ← Right side
│                    │ CHAT    │  │   positioned
│                    │ BOX     │  │
│                    │         │  │
│                    │Messages │  │
│                    │         │  │
│                    │[Input_] │  │
│                    └─────────┘  │
│                         [ORB]   │ ← Bottom right
└─────────────────────────────────┘
```

---

## 📊 RESPONSIVE BEHAVIOR SUMMARY

| Feature | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| **Layout** | Stacked | Flexible | Wide |
| **Font Size** | Large | Medium | Standard |
| **Touch Targets** | 48px+ | 44px+ | 44px+ |
| **Hover Effects** | None | Limited | Full |
| **Animations** | Simplified | Standard | Full |
| **Spacing** | Compact | Balanced | Generous |
| **Video** | Full screen | Full screen | Full screen |
| **HUD** | Minimal | Standard | Detailed |
| **Chat** | Full width | Standard | Side panel |

---

## 🎯 ORIENTATION CHANGES

### **Portrait → Landscape**
```
BEFORE (Portrait):          AFTER (Landscape):
┌─────────┐                ┌──────────────────────┐
│  NODE   │                │ [NODE] [NODE] [NODE] │
│  NODE   │      →         │                      │
│  NODE   │                │   (Horizontal)       │
└─────────┘                └──────────────────────┘
```

**What Happens:**
- ✅ Layout automatically reorganizes
- ✅ Elements reposition smoothly
- ✅ No content is cut off
- ✅ Touch targets remain accessible

---

## 🔄 REAL-TIME ADAPTATION

The system adapts **instantly** when:
- 📱 User rotates device
- 🔄 Browser window is resized
- 📏 Zoom level changes
- 🖥️ External monitor is connected

**No page reload required!**

---

## ✨ SPECIAL FEATURES

### **iPhone X+ Notch Support**
```
┌─────────────────────────┐
│ ◀ [Safe Area] ▶         │ ← Content avoids notch
│                         │
│      CONTENT            │
│                         │
│ ◀ [Safe Area] ▶         │ ← Content avoids home bar
└─────────────────────────┘
```

### **Reduced Motion Mode**
For users with motion sensitivity:
- ✅ Animations simplified
- ✅ Transitions shortened
- ✅ No parallax effects
- ✅ Smooth, accessible experience

### **High Contrast Mode**
For users with visual impairments:
- ✅ Thicker borders
- ✅ Higher contrast colors
- ✅ Clearer text
- ✅ Better visibility

---

## 🎉 THE RESULT

**One codebase, infinite devices!**

Data Bleed automatically provides the **perfect experience** for:
- 📱 Your phone
- 📱 Your tablet  
- 💻 Your laptop
- 🖥️ Your desktop

**No matter the screen size, orientation, or device type!**

---

**Status: ✅ FULLY RESPONSIVE**

*Visual Guide - November 10, 2025*
