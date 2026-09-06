# 22 — Changelog

All notable changes to the **ACE UiPath Community Digital Operating System** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] — 2026-08-31
### Added
- **Phase 0 Documentation Foundation**: Complete `/docs` directory established as the Single Source of Truth across 24 technical specifications (Vision, Architecture, Database, RBAC, Admin CMS, Institutional Memory, APIs, Roadmap, Decisions).
- **Critical Architecture Audit**: Detailed inspection identifying prototype storage boundaries (`localStorage`, `initialData.ts`) and outlining the exact production migration path.

---

## [2.0.0] — 2026-08-31
### Added
- **Complete Visual & Interactive Prototype**:
  - Elite UI/UX Design System with UiPath Electric Orange (`#FA4616`) and Deep Obsidian dark mode (`src/index.css`).
  - **Homepage (`/`)**: Live impact counters, interactive 4-track UiPath journey selector, flagship masterclass countdown, and featured bot showcase.
  - **Activity Timeline (`/activities`)**: Multi-dimensional filtering by Year (2022-2026), Category, Mode, Status, and search with Laser-Rail Timeline and Grid views.
  - **Deep Activity Detail (`/activities/[slug]`)**: Institutional memory record with minute-by-minute agenda, speaker cards, downloadable `.xaml` packages, slide decks, video player, and photo gallery.
  - **Learning Academy (`/learn`)**: 4-track curriculum (Citizen Dev, Associate Dev, Enterprise Architect REFramework, Intelligent Automation) with interactive lesson reader and code snippets.
  - **Automations Vault (`/projects`)**: Student bot repository with ROI metrics, upvoting, inspection modals, and "Submit Your Bot" form.
  - **Hackathons Portal (`/challenges`)**: Active competitions with countdowns, prize pools, and team submission forms.
  - **Resources Vault (`/resources`)**: Curated REFramework templates, cheat sheets, and certification mock exam question banks.
  - **About & Leadership Wall (`/about`)**: Chapter history (2022-2026), faculty advisor statement, and UiPath Academic Alliance accreditation.
  - **Get Involved (`/join`)**: Application forms for Student Membership, Core Team, and Mentors.
  - **Admin Command Center (`/admin`)**: Zero-code CMS for managing activities, site settings, bot moderation, and JSON database backup/restore.
  - **Core Team Workspace (`/core`)**: Session artifact attachment and submission moderation hub.
  - **Universal Command Search (`Ctrl+K`)**: Instant modal search across activities, courses, bots, and resources.
  - **Role Experience Switcher**: Modal to toggle between Student, Core Team, and Admin views.
- **Rich Historical Seed Dataset**: 2022–2026 multi-year activity records, 4 learning tracks, 3 production bots, 2 hackathons, and 4 cheat sheets.

---

## [1.0.0] — 2026-08-20
### Added
- Initial project repository initialization by student leadership (`Kanchana Tejaswy`).
