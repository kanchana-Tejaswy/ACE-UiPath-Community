# 23 — Architectural Decision Log (ADR)

**Product**: ACE UiPath Community Digital Operating System  
**Format**: Architectural Decision Record (ADR)  

---

## Decision Record Format

Each decision is structured with:
- **ID & Title**
- **Date**
- **Context & Problem Statement**
- **Options Considered**
- **Selected Approach**
- **Technical Rationale**
- **Consequences & Trade-offs**

---

### ADR-001: Zero-Friction Public Student Experience (No Mandatory Login)
* **Date**: 2026-08-31
* **Context**: College websites often force users to create an account before viewing content, creating massive friction that discourages prospective student members.
* **Options Considered**:
  1. Mandatory student authentication before entering the site.
  2. Public unauthenticated access for browsing, reading, and learning, with authentication required only for active identity actions (bot/challenge submissions).
* **Selected Approach**: **Option 2 (Public Exploration)**.
* **Rationale**: Maximizes community reach, SEO indexing, and student discovery.
* **Consequences**: Public endpoints must be read-only and cached heavily at the edge CDN.

---

### ADR-002: Secure Server-Side Authentication for Admin & Core Team
* **Date**: 2026-08-31
* **Context**: Management of community activities, bot moderation, and global site configurations requires strict authorization to prevent unauthorized tampering.
* **Options Considered**:
  1. Client-side role flag in browser localStorage (Prototype model).
  2. Server-side session authentication with cryptographic JWTs and PostgreSQL Row-Level Security.
* **Selected Approach**: **Option 2 (Server-Side RBAC & RLS)**.
* **Rationale**: Prototype client-side checks can be bypassed trivially via DevTools. Production governance requires zero-trust server validation.
* **Consequences**: Requires authenticating backend API requests and setting HTTP-only session cookies.

---

### ADR-003: Zero-Code Content Governance (CMS Cockpit)
* **Date**: 2026-08-31
* **Context**: Traditional college club websites require a developer to edit HTML/TSX files and redeploy Git repositories every time a workshop date or announcement changes.
* **Options Considered**:
  1. Hardcoding event data in static source files.
  2. Dynamic, database-backed CMS allowing non-developer student leads to edit content through an admin dashboard.
* **Selected Approach**: **Option 2 (Dynamic CMS)**.
* **Rationale**: Guarantees institutional sustainability across graduating student leadership batches.
* **Consequences**: All content entities (activities, announcements, stats) must be stored in database tables queried at runtime.

---

### ADR-004: Deep Institutional Memory for Activities
* **Date**: 2026-08-31
* **Context**: Student clubs lose institutional knowledge when senior leads graduate. Event records are typically discarded after the event date passes.
* **Options Considered**:
  1. Transient event listings that disappear after event completion.
  2. Permanent relational database records preserving minute-by-minute agendas, speakers, slide decks, `.xaml` starter packages, video recordings, and student achievements.
* **Selected Approach**: **Option 2 (Permanent Institutional Memory Archive)**.
* **Rationale**: Converts past activities into evergreen learning assets for future student generations.
* **Consequences**: Activity detail pages must support rich multimedia relationships (agendas, speakers, downloads, galleries).

---

### ADR-005: Multi-Year Continuity Across Graduating Batches
* **Date**: 2026-08-31
* **Context**: The software must operate continuously for 5+ years without architectural decay as student leadership transitions annually.
* **Options Considered**:
  1. Monolithic one-off deployment tailored only to the current semester.
  2. Modular, documented, database-driven architecture with automated JSON snapshot export/restore capabilities for semester handovers.
* **Selected Approach**: **Option 2 (Modular Long-Term Architecture)**.
* **Rationale**: Ensures incoming 2nd-year student leads can take ownership of the system smoothly.
* **Consequences**: Requires comprehensive documentation (`/docs`) and disaster recovery backup tools.

---

### ADR-006: Laser-Focused UiPath Technology Identity
* **Date**: 2026-08-31
* **Context**: Technical student communities often suffer from mission creep and dilute into generic coding or AI clubs, losing their corporate partnership advantages.
* **Options Considered**:
  1. Generic technology portal covering web development, mobile apps, and competitive programming.
  2. Strict focus on UiPath Enterprise Automation (Studio, StudioX, REFramework, Document Understanding, Orchestrator, AI Center).
* **Selected Approach**: **Option 2 (UiPath Centricity)**.
* **Rationale**: Maintains alignment with the official **UiPath Academic Alliance** accreditation and positions ACE students for high-demand enterprise RPA careers.
* **Consequences**: Supporting skills (Python, C#, SQL, APIs) are curated strictly as accelerators for UiPath bots.

---

### ADR-007: Preservation of High-Quality Visual Design & UI Layouts
* **Date**: 2026-08-31
* **Context**: The existing React UI features modern typography, custom CSS tokens, glassmorphic cards, and laser timeline rails meeting Apple/Linear/Vercel standards.
* **Options Considered**:
  1. Discarding the existing UI and rebuilding from scratch.
  2. Preserving 100% of the UI components, layouts, and design tokens, and connecting them to a real PostgreSQL backend.
* **Selected Approach**: **Option 2 (Preserve & Connect UI)**.
* **Rationale**: Avoids redundant UI rework; focuses engineering effort on data persistence, real authentication, and cloud media storage.
* **Consequences**: Data-fetching hooks in `src/data/store.ts` will be refactored to fetch from server APIs instead of `localStorage`.

---

### ADR-008: Multi-User Cloud Synchronization Requirement
* **Date**: 2026-08-31
* **Context**: The current prototype persists data in browser `localStorage`, preventing updates made on one device from appearing on other student devices.
* **Options Considered**:
  1. Retain client-side storage with manual JSON export sharing.
  2. Cloud PostgreSQL database (Supabase / Neon) with real-time synchronization and edge cache invalidation.
* **Selected Approach**: **Option 2 (Cloud PostgreSQL Database)**.
* **Rationale**: A real digital operating system requires global multi-user consistency across all student devices.
* **Consequences**: Requires provisioning a managed cloud database and establishing an API data-fetching layer.
