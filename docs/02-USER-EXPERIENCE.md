# 02 — User Experience Architecture & 3-Tier Experience Layers

**Product**: ACE UiPath Community Digital Ecosystem  
**Core UX Goal**: Zero-Friction Student Exploration & Scoped Governance  

---

## 1. The Zero-Friction Principle

> **Curiosity must never encounter an authentication barrier.**

A student discovering the ACE UiPath Community website must never be forced to log in, register, or create an account simply to explore the platform.

```text
Student Journey:
Curiosity → Discovery → Learning → Building → Participation
   (No Auth)   (No Auth)    (No Auth)   (No Auth)   (Auth Gated)
```

### Auth Gating Matrix

| Action | Authentication Status | UX Rationale |
| :--- | :---: | :--- |
| **Browse Homepage & Live Stats** | **NO LOGIN** | Instant discovery & public inspiration. |
| **View Activity Timeline & History** | **NO LOGIN** | Unrestricted access to historical community events. |
| **Read Deep Activity Memory Page** | **NO LOGIN** | Read session notes, agendas, and speaker details. |
| **Watch Video Lecture Recordings** | **NO LOGIN** | Frictionless self-paced learning. |
| **Download .XAML Workflows & Cheat Sheets** | **NO LOGIN** | Immediate access to developer starter kits. |
| **Inspect Student Bots in Automations Vault** | **NO LOGIN** | Showcase student innovation to peers & recruiters. |
| **Explore Learning Academy & Tutorials** | **NO LOGIN** | Structured UiPath learning paths open to all. |
| **Submit Student Bot to Showcase** | **LOGIN REQUIRED** | Binds project submission to student identity. |
| **Register Team for Hackathon** | **LOGIN REQUIRED** | Binds team registration to participant student IDs. |
| **Core Team Artifact Staging Hub (`/core`)** | **LOGIN REQUIRED** | Operational permission guard for student organizers. |
| **Admin Command Center (`/admin`)** | **LOGIN REQUIRED** | System governance and content management. |

---

## 2. Three Experience Layers Breakdown

### Layer A: Public / Student Experience
- Designed like a modern product platform (Apple / Vercel style).
- Instant sub-100ms loading of historical activities, 4-track academy, and bot showcase.
- Universal command palette (`Ctrl+K`) for instant search across all entities.

### Layer B: Core Team Operational Workspace (`/core`)
- Controlled staging area for active student organizers and technical mentors.
- Allows drafting upcoming events, attaching presentation slide links, YouTube video streams, packaged `.xaml` starter files, and reviewing peer bot submissions.
- Operates under permission-based role restrictions (cannot delete system records or modify global site configurations).

### Layer C: Admin Operating System (`/admin`)
- Complete zero-code control center for administrators and faculty coordinators.
- Form-driven management of Site Copy, Activities, Learning Modules, Bot Showcase Moderation, Hackathons, Technical Resources, User Roles, and Database Backups.
- Eliminates the need to open VS Code or modify source code for routine content updates.
