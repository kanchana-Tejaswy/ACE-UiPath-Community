# 09 — Content Management System (Zero-Code CMS)

**Product**: ACE UiPath Community Digital Operating System  
**Core Goal**: Zero-Code Content Governance via Admin Dashboard  

---

## 1. Zero-Code Content Management Vision

> **If an administrator wants to change website content, they should NOT need to modify source code or open VS Code.**

The CMS is the operational control center of the community ecosystem.

---

## 2. Admin CMS Operational Architecture (PLANNED)

```text
Admin Dashboard (/admin)
│
├── Website & Banner Configuration
│   ├── Hero Headlines & Subheadlines
│   ├── Top Announcement Marquee Ticker & Link
│   └── Live Community Impact Statistics
│
├── Activities & Timeline CMS
│   ├── Create / Edit / Delete Activity Records
│   ├── Manage Session Agendas & Speaker Rosters
│   ├── Attach Slides, Videos, and .XAML Packages
│   └── Publish / Archive Controls
│
├── Learning Academy CMS
│   ├── Create / Edit Learning Paths & Modules
│   └── Upload Lesson Markdown & Practice Exercises
│
├── Projects Showcase Moderation
│   ├── Review Queue for Student-Submitted Bots
│   └── Approve, Reject, or Feature Standout Automations
│
├── Challenges & Hackathons CMS
│   ├── Post Problem Statements & Starter Datasets
│   └── Configure Rules, Rubrics, and Winner Leaderboards
│
├── Resources Vault CMS
│   └── Upload Cheat Sheets, REFramework Templates, Exam Questions
│
├── Team & User Management
│   ├── Core Team Member Accounts
│   └── Role Assignment (Student -> Core Team -> Admin)
│
└── System Governance
    ├── Real-time Analytics & Download Metrics
    └── Immutable Audit Logs
```

---

## 3. CURRENT vs. PLANNED vs. FUTURE State

### CURRENT (Actually Implemented)
- Admin UI rendered at [`src/pages/AdminPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/AdminPage.tsx) with form tabs for Site Settings, Activities CRUD, Bot Moderation, and JSON Snapshot Backup.
- Updates save to browser `localStorage` and trigger a local re-render.

### PLANNED (Decided & Approved)
- Connect all CMS forms to Supabase Client API / Next.js Server Actions.
- Server-side JWT authentication and Postgres RLS enforcement.
- Automated cache revalidation (`revalidatePath('/')`, `revalidatePath('/activities')`) so updates broadcast to all global visitors instantly.

### FUTURE (Under Consideration)
- Visual WYSIWYG editor with inline media drag-and-drop.
