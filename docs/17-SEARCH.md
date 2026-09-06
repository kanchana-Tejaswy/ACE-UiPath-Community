# 17 — Command Search Architecture

**Product**: ACE UiPath Community Digital Operating System  
**Interface**: Universal Command Palette Modal (`Ctrl+K` / `Cmd+K`)  

---

## 1. Purpose
Enable students, core team members, and administrators to find any activity, REFramework tutorial, bot project, or cheat sheet in under 100 milliseconds.

---

## 2. Command Palette Architecture
* **Trigger**: Global hotkey listener (`Ctrl+K` or `Cmd+K`) or search button in navbar.
* **Entities Searched**:
  - **Activities**: Title, summary, venue, topics (e.g. "REFramework", "Queues").
  - **Learning Modules**: Module title, summary, UiPath tool (e.g. "StudioX").
  - **Bot Projects**: Title, summary, tools used, author name.
  - **Resources**: Title, category, tags.

---

## 3. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- Modal in [`src/components/CommandSearchModal.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/components/CommandSearchModal.tsx) with instant multi-entity client-side substring matching and auto-focus.

### PLANNED (Decided & Approved)
- PostgreSQL Full-Text Search with GIN index (`tsvector`) for fuzzy matching and typographical error tolerance.

### FUTURE (Under Consideration)
- AI-powered semantic search with vector embeddings (e.g., pgvector) to query across lecture transcripts.
