# 02 — Information Architecture & Navigation Structure

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Site Map, Route Topography & Experience Navigation  

---

## 1. Information Architecture Map

```text
Public Experience (Zero Auth Barrier)
├── Home (/) [IMPLEMENTED]
│   ├── Live Automation Pulse Stats
│   ├── 4-Track UiPath Journey Matrix
│   ├── Flagship Masterclass Countdown Card
│   ├── Featured Automations Showcase
│   └── Community Milestones
├── Activities & Timeline (/activities) [IMPLEMENTED]
│   ├── Multi-dimensional Filter Bar (Year, Category, Mode, Status, Search)
│   ├── Laser-Rail Timeline View vs Grid View Toggle
│   └── Activity Detail (/activities/[slug]) [IMPLEMENTED]
│       ├── Logistics (Date, Time, Venue, Delivery Mode, Status)
│       ├── Objectives & Learning Outcomes
│       ├── Minute-by-Minute Agenda
│       ├── Speaker & Mentor Profiles
│       ├── Artifacts Vault (.XAML Starter, Solution Package, Slides, Recording)
│       ├── Photo Gallery & Lightbox
│       └── Student Awards & Recognition
├── Learning Academy (/learn) [IMPLEMENTED]
│   ├── Citizen Developer Track (StudioX)
│   ├── Associate Developer Track (Studio)
│   ├── Enterprise Architect Track (REFramework)
│   ├── Intelligent Automation Track (AI Center & DU)
│   └── Interactive Lesson Reader & Starter Code Download
├── Automations Vault (/projects) [IMPLEMENTED]
│   ├── Tool & ROI Filters
│   ├── Project Inspection Modal (Specs, GitHub, .nupkg)
│   └── "Submit Your Bot" Modal
├── Challenges & Hackathons (/challenges) [IMPLEMENTED]
│   ├── Active Sprint Specs & Countdowns
│   ├── Starter Dataset Downloads
│   ├── Team Submission Form
│   └── Hall of Hackathon Champions
├── Resources Vault (/resources) [IMPLEMENTED]
│   ├── Cheat Sheets, REFramework Templates, Question Banks
│   └── Download Counters
├── About & Legacy (/about) [IMPLEMENTED]
│   ├── Chapter Founding Story (2022-2026)
│   ├── Faculty Patronage & UiPath Academic Alliance MoU
│   └── Leadership Directory Wall
└── Get Involved (/join) [IMPLEMENTED]
    ├── Student Member Registration Form
    ├── Core Team Application Form
    └── Peer Mentor / Speaker Onboarding Form

Core Team Workspace (/core)
├── Session Media & Slide Deck Staging [IMPLEMENTED]
├── Student Bot Showcase Review Queue [IMPLEMENTED]
├── Activity Draft Staging [IMPLEMENTED]
└── Participant Attendance Management [PLANNED]

Admin Operating System (/admin)
├── Global Site Configurator (Headlines, Ticker, Stats, Alliance ID) [IMPLEMENTED]
├── Activities Full CRUD Management [IMPLEMENTED]
├── Showcase Moderation & Feature Promotion [IMPLEMENTED]
├── JSON Database Snapshot Backup & Restore [IMPLEMENTED]
├── User Role Management & Promotion [PLANNED]
├── Direct Cloud Media File Uploader [PLANNED]
└── Immutable Audit Log Viewer [PLANNED]
```

---

## 2. Implementation Status Mapping

| Route / Component | Current Implementation Status | Planned Production Enhancement |
| :--- | :---: | :--- |
| **`/` (Homepage)** | **COMPLETE (Prototype)** | Wire live stats and featured items to PostgreSQL SSR/ISR cache. |
| **`/activities`** | **COMPLETE (Prototype)** | Connect to `activities` table with server-side full-text search. |
| **`/activities/[slug]`** | **COMPLETE (Prototype)** | Fetch relational agenda and speakers via slug parameter. |
| **`/learn`** | **COMPLETE (Prototype)** | Add student progress tracking and module completion checkmarks. |
| **`/projects`** | **COMPLETE (Prototype)** | Wire submissions to `projects` table with auth author ID. |
| **`/challenges`** | **COMPLETE (Prototype)** | Connect team submissions to `challenge_submissions` table. |
| **`/resources`** | **COMPLETE (Prototype)** | Connect download clicks to atomic SQL download counter increment. |
| **`/about`** | **COMPLETE (Prototype)** | Wire leadership list to `leadership_members` table. |
| **`/join`** | **COMPLETE (Prototype)** | Connect applications to administrative review queue. |
| **`/core`** | **COMPLETE (Prototype)** | Add server-side session check (`CORE_TEAM` or `ADMIN`). |
| **`/admin`** | **COMPLETE (Prototype)** | Add server-side session check (`ADMIN` only) + RLS enforcement. |
