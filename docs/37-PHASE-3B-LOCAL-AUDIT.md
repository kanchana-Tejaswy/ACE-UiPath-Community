# 37 — Phase 3B Local Codebase & Experience Audit

**Product**: ACE UiPath Community Digital Ecosystem  
**Audit Scope**: Routing Architecture, Data Repository Layer, Admin CMS Wizard, Knowledge Graph, Media & Artifacts  
**Date**: 2026-08-31  

---

## 1. Codebase Inspection Results

### 1.1 What Already Works
- **Visual Design System**: Premium dark obsidian palette (`#07080B`) with UiPath Electric Orange (`#FA4616`) accents, typography hierarchy, and glassmorphic cards in `src/index.css`.
- **Public Page Layouts**: 11 complete views rendered (`HomePage`, `ActivitiesPage`, `ActivityDetailPage`, `LearnPage`, `ProjectsPage`, `ChallengesPage`, `ResourcesPage`, `AboutPage`, `JoinPage`, `AdminPage`, `CoreTeamPage`).
- **Command Search Palette**: Instant search modal (`Ctrl+K`) filtering activities, courses, projects, and resources.

### 1.2 Identified Architectural Gaps
1. **Routing URL Sync**: Navigation currently relies on React `useState('home')` in `App.tsx`. Refreshing the browser or using Back/Forward buttons resets to the homepage. Direct URLs like `/#activities/reframework-masterclass-2026` are not synced to state.
2. **Scattered Storage Calls**: Component CRUD logic directly calls `localStorage` functions in `src/data/store.ts`. A clean repository pattern is needed to isolate data persistence behind `activitiesRepository`, `projectsRepository`, etc.
3. **Single Form Admin CMS**: Admin activity creation uses one long vertical form instead of a guided 11-step wizard (`Basic Info` → `Schedule` → `Speakers` → `Agenda` → `Topics` → `Media` → `Artifacts` → `Achievements` → `Related Knowledge` → `Preview` → `Publish`).
4. **Knowledge Graph Links**: Knowledge connections between activities, learning tracks, projects, and hackathons are currently implicit. Relational interlinking needs explicit binding.

---

## 2. Recommended Implementation Roadmap for Phase 3B

```text
Step 1: Local Data Architecture & Repository Pattern (src/data/repositories/)
        │
        ▼
Step 2: Hash & History URL Routing Sync (App.tsx & location.hash)
        │
        ▼
Step 3: Deep Activity Memory Page & Clickable Timeline Navigation
        │
        ▼
Step 4: Media & Artifact Vault UX Polish (.xaml, .nupkg, .pdf, YouTube)
        │
        ▼
Step 5: Admin CMS Multi-Step Activity Creation Wizard
        │
        ▼
Step 6: Core Team Staging Workspace Refinement
        │
        ▼
Step 7: Knowledge Graph Interlinking (Activities <-> Learning <-> Projects)
        │
        ▼
Step 8: Universal Search & Keyboard Navigation
        │
        ▼
Step 9: Documentation Suite (docs/37 to docs/43) & Definition of Done Verification
```
