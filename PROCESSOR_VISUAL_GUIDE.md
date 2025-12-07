# 🎨 PROCESSOR MONITORING - VISUAL & COLOR REFERENCE

## 🎯 Component Layout

```
┌─────────────────────────────────────────────────────────────┐
│                   CREATOR DASHBOARD                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ╔════════════════════════════════════════════════════════╗│
│  ║         🔵 PROCESSOR STATUS WIDGET                    ║│
│  ║  ┌──────────────┬─────────────┬──────────┐           ║│
│  ║  │ Processor: ✓ │ Health: 🟢  │ Running:1│           ║│
│  ║  ├──────────────┼─────────────┼──────────┤           ║│
│  ║  │ Queued: 5    │ Completed:42│ Failed: 2│           ║│
│  ║  │ Success Rate │ Avg Time    │ Uptime   │           ║│
│  ║  └──────────────┴─────────────┴──────────┘           ║│
│  ╚════════════════════════════════════════════════════════╝│
│                                                              │
│  ╔═══════════════════════════════════╗ ╔════════════════╗ │
│  ║ 📊 LIVE TASK STATUS TABLE         ║ ║ 📈 STATISTICS ║ │
│  ║  ┌─────┬────┬────┬────┬────┬───┐ ║ ║ ┌────────────┐║ │
│  ║  │Name │ 🟡 │500 │10:30│5m3s│ ⋯ │ ║ ║ Total:  150  ║ │
│  ║  │Task1│    │    │     │    │   │ ║ ║ Queued: 5    ║ │
│  ║  ├─────┼────┼────┼────┼────┼───┤ ║ ║ Running: 1   ║ │
│  ║  │Task2│ 🔵 │400 │10:25│12m │ ⋯ │ ║ ║ Completed:42 ║ │
│  ║  │     │    │    │     │    │   │ ║ ║ Failed: 2    ║ │
│  ║  ├─────┼────┼────┼────┼────┼───┤ ║ ║ ├────────────┤║ │
│  ║  │Task3│ 🟢 │300 │09:00│... │ ⋯ │ ║ ║ System Health║ │
│  ║  │     │    │    │     │    │   │ ║ ║ ├────────────┤║ │
│  ║  └─────┴────┴────┴────┴────┴───┘ ║ ║ │ [████████]97%║ │
│  ║                                   ║ ║ └────────────┘║ │
│  ║  Loading... [●●●●○]             ║ ║              ║ │
│  ╚═══════════════════════════════════╝ ╚════════════════╝ │
│                                                              │
│  ╔════════════════════════════════════╗                     │
│  ║ 🟡 QUEUE POSITION INDICATOR        ║                     │
│  ║                                    ║                     │
│  ║ Global Queue: 12 | Your Tasks: 2  ║                     │
│  ║                                    ║                     │
│  ║ Task: "ML Training"                ║                     │
│  ║ Position: #1                       ║                     │
│  ║ Wait Time: 5s                      ║                     │
│  ║ [████████████░░░░░░░] 40%         ║                     │
│  ║                                    ║                     │
│  ║ Task: "Data Analysis"              ║                     │
│  ║ Position: #5                       ║                     │
│  ║ Wait Time: 25s                     ║                     │
│  ║ [████░░░░░░░░░░░░░░░] 20%         ║                     │
│  ╚════════════════════════════════════╝                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│    🎬 EXECUTION HISTORY MODAL (Click "View History")        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Status: ✓ COMPLETED | Attempts: 1 | Duration: 10m 23s    │
│                                                              │
│  Event Timeline:                                            │
│  ├─ ⏳ QUEUED      10:30:00  Task queued for processing    │
│  ├─ 🔵 STARTED     10:30:05  Task started on node-1        │
│  ├─ 🔵 PROCESSING  10:35:00  Execution attempt #1          │
│  └─ ✓ COMPLETED    10:40:23  Task completed successfully   │
│     ├─ Duration: 10m 23s                                    │
│     └─ Result: { ... }                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette

### Status Badge Colors

| Status | Color | Hex | Tailwind | Icon |
|--------|-------|-----|----------|------|
| Queued | Yellow | #EAB308 | `yellow-400` | ⏳ |
| Running | Blue | #3B82F6 | `blue-400` | ▶️ |
| Completed | Green | #22C55E | `green-400` | ✓ |
| Failed | Red | #EF4444 | `red-400` | ✗ |

### Background Colors

| Element | Light | Dark |
|---------|-------|------|
| Card Background | `slate-800/30` | `slate-900/50` |
| Border | `slate-700/50` | `slate-700/30` |
| Text | `slate-300-400` | `white` |
| Accent | Varies | Varies |

### Event Timeline Colors

| Event | Color | Hex | Icon |
|-------|-------|-----|------|
| QUEUED | Yellow | #FBBF24 | ⏳ |
| STARTED | Blue | #60A5FA | ⚡ |
| PROCESSING | Blue | #93C5FD | ⏱️ |
| RECOVERED | Yellow | #FCD34D | ⚠️ |
| COMPLETED | Green | #4ADE80 | ✓ |
| FAILED | Red | #F87171 | ✗ |

---

## 📐 Component Sizes & Spacing

### ProcessorStatusWidget
```
Width: Full (100%)
Height: Auto (~300px)
Padding: 24px (p-6)
Gap: 16px (gap-4)
Grid: 2 cols mobile, 3 cols tablet
```

### LiveTaskStatusTable
```
Width: Full (100%)
Height: Auto (min ~400px)
Cell Padding: 12px (py-3)
Row Height: 60px
Header Height: 50px
```

### QueuePositionIndicator
```
Width: Full (100%)
Card Padding: 24px (p-6)
Item Padding: 16px (p-4)
Item Height: ~120px
Progress Bar: 8px height
```

### ExecutionHistoryModal
```
Width: 896px (max-w-2xl)
Max Height: 80vh
Modal Padding: 24px
Timeline Gap: 12px (space-y-3)
```

---

## 🎯 Responsive Breakpoints

### Mobile (< 640px)
```
- Single column layout
- ProcessorStatusWidget: 2 columns
- Full width tables
- Stack controls vertically
- Smaller padding: 16px
```

### Tablet (640px - 1024px)
```
- 2 column layout for queue
- ProcessorStatusWidget: 3 columns
- Side-by-side for table & stats
- Normal padding: 24px
```

### Desktop (> 1024px)
```
- 3 column layout
- Left 2/3: Tasks + Queue
- Right 1/3: Stats + Health
- Full spacing: 32px
- Hover actions visible
```

---

## 🎬 Animation & Transitions

### Fade & Slide
```css
transition-all duration-500
```

### Pulse (Loading)
```css
animate-pulse
```

### Spin (Loading Indicator)
```css
animate-spin
```

### Auto-refresh Badge
```css
text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded
```

### Hover Effects
```css
group-hover:opacity-100
hover:bg-blue-500/20
hover:text-blue-400
transition-colors
```

### Progress Bar
```css
w-full bg-slate-900/50 rounded-full h-2 overflow-hidden
gradient-to-r from-yellow-400 to-orange-400
transition-all duration-500
```

---

## 📱 Mobile Touch Targets

All interactive elements sized for mobile:
- Buttons: min 8x8 (h-8 w-8)
- Links: min 12x12 (h-12 w-12)
- Spacing: 8px minimum between

---

## 🎨 Icon Set (Lucide React)

| Icon | Use | Size |
|------|-----|------|
| `Activity` | Processor status | w-5 h-5 |
| `CheckCircle2` | Success/completed | w-5 h-5 |
| `AlertCircle` | Warning/error | w-5 h-5 |
| `Zap` | Running/active | w-5 h-5 |
| `Clock` | Time/waiting | w-5 h-5 |
| `Eye` | View details | w-4 h-4 |
| `RotateCcw` | Retry action | w-4 h-4 |
| `Users` | Queue length | w-3 h-3 |
| `Trash2` | Delete action | w-4 h-4 |

---

## 🏗️ Component Hierarchy

```
UpdatedCreatorDashboard
├── ProcessorStatusWidget
├── LiveTaskStatusTable
│   └── Badge (status)
│   └── Button (actions)
├── QueuePositionIndicator
│   └── Progress bar
└── ExecutionHistoryModal
    ├── Badge (status)
    ├── Timeline
    └── Event cards
```

---

## 🔄 Data Flow Visualization

```
Backend Processor
    ↓
┌─────────────────────┐
│ GET /processor/status
│ GET /detailed-queue
│ GET /execution-history/:id
└─────────────────────┘
    ↓
protocolAPI.processorAPI
    ↓
┌──────────────────────────────────────┐
│ useProcessorStatus()                 │
│ useDetailedQueue()                   │
│ useExecutionHistory()                │
│ (with AbortController & auto-refresh)│
└──────────────────────────────────────┘
    ↓
┌───────────────────────────────────────┐
│ ProcessorStatusWidget                 │
│ LiveTaskStatusTable                   │
│ QueuePositionIndicator                │
│ ExecutionHistoryModal                 │
└───────────────────────────────────────┘
    ↓
User's Screen (Real-time Updates)
```

---

## 📊 Status Badge Reference

### In Table
```
[⏳ Queued] - Yellow badge on hover
[▶️ Running] - Blue badge on hover
[✓ Completed] - Green badge on hover
[✗ Failed] - Red badge on hover
```

### In Queue Indicator
```
#1 Position - Yellow background
#5 Position - Yellow background
#12 Position - Yellow background
```

### In Modal
```
Status: ✓ COMPLETED - Green badge
Status: ✗ FAILED - Red badge
Status: ▶️ RUNNING - Blue badge
```

---

## 💡 Accessibility Features

- ✅ Semantic HTML elements
- ✅ ARIA labels on interactive elements
- ✅ Color not sole indicator (icons + text)
- ✅ Keyboard navigation support
- ✅ Sufficient contrast ratios
- ✅ Focus states visible
- ✅ Loading states announced

---

## 🎨 Dark Mode Support

All components designed for dark theme:
- Background: `slate-900` / `slate-800`
- Text: `white` / `slate-300`
- Borders: `slate-700/50`
- Accents: Bright colors (yellow, blue, green, red)

---

## 🖼️ Screenshot Zones

```
┌─────────────────────────────────────┐
│         Header + Title               │ ← Header zone
├─────────────────────────────────────┤
│                                     │
│    Processor Status Widget          │ ← Widget zone
│                                     │
├──────────────────┬──────────────────┤
│                  │                  │
│   Task Table     │   Right Sidebar  │ ← Main content
│                  │                  │
├──────────────────┴──────────────────┤
│                                     │
│   Queue Position Indicator          │ ← Supplementary
│                                     │
├─────────────────────────────────────┤
│  ℹ️ Info Banner                     │ ← Footer info
└─────────────────────────────────────┘
```

---

## 🎓 Design System Reference

**Spacing Scale:**
- 2px (0.5)
- 4px (1)
- 8px (2)
- 12px (3)
- 16px (4)
- 20px (5)
- 24px (6)
- 32px (8)

**Font Sizes:**
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px

**Border Radius:**
- xs: 2px
- sm: 4px
- base: 6px
- lg: 8px
- xl: 12px
- 2xl: 16px
- full: 9999px

---

## ✅ Quality Checklist

- [ ] All colors contrast properly
- [ ] All icons are visible
- [ ] Text is readable on all backgrounds
- [ ] Hover states are obvious
- [ ] Loading states show clearly
- [ ] Error states are visible
- [ ] Empty states are helpful
- [ ] Mobile layout works
- [ ] Touch targets are large enough
- [ ] Animations are smooth

---

Generated: December 6, 2024  
Design System: Qubitium Protocol Frontend  
Theme: Dark Mode with Accent Colors
