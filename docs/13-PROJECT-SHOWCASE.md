# 13 — Automations Vault & Projects Showcase

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Student Bot Showcase, ROI Telemetry & Submission Lifecycle  

---

## 1. Purpose
Showcase production-grade software robots built by ACE students to solve genuine campus and industry bottlenecks, providing measurable proof of return on investment (ROI).

---

## 2. Project Entity & Telemetry Architecture
- **Problem Statement & Solution Architecture**: Detailed technical narrative.
- **Measured Business ROI**: Specific impact (e.g. *Saves 45 hours per exam cycle*).
- **Technical Artifacts**: GitHub repository link, downloadable `.nupkg` package, video demo.
- **Engagement**: Community upvotes and download counters.

---

## 3. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- Bot Showcase grid in [`src/pages/ProjectsPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/ProjectsPage.tsx) with tool filters, search, upvote triggers, inspection modals, and "Submit Your Bot" modal.
- 3 real student bots seeded in [`src/data/initialData.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/data/initialData.ts).

### PLANNED (Decided & Approved)
- `projects` PostgreSQL table with `Pending`, `Approved`, `Featured` status lifecycle.
- Authenticated submission pipeline binding the author's student ID.

### FUTURE (Under Consideration)
- Direct Orchestrator package execution demo sandbox.
