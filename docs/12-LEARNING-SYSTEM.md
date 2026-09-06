# 12 — UiPath Learning Academy & Curriculum Architecture

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Structured Learning Paths, Modules, Exercises & Code Snippets  

---

## 1. Purpose
Empower engineering students across all branches and skill levels to master UiPath Enterprise Automation through structured roadmaps aligned with the **UiPath Academic Alliance** and **UiRPA Associate Certification**.

---

## 2. The 4-Track Learning System
1. **Citizen Developer (StudioX)**: Zero-code Excel, email, and web automation for freshers.
2. **Associate RPA Developer (Studio)**: Modern selectors, DataTables, LINQ, and Orchestrator Queues.
3. **Enterprise Architect (REFramework)**: Transactional State Machines, Config.xlsx, and auto-healing error handling.
4. **Intelligent Automation (AI Center & DU)**: ML Extractors, Action Center human-in-the-loop, and GenAI bots.

---

## 3. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- Complete UI reader in [`src/pages/LearnPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/LearnPage.tsx).
- 4 tracks and 6 modules populated in [`src/data/initialData.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/data/initialData.ts) with syntax-highlighted code blocks, XML selectors, and starter `.xaml` download buttons.

### PLANNED (Decided & Approved)
- Normalized `learning_paths` and `learning_modules` PostgreSQL tables.
- Student module completion tracking saved to database when logged in.
- Integration of official UiPath Academy direct resource links.

### FUTURE (Under Consideration)
- Interactive browser-based selector validator tool.
