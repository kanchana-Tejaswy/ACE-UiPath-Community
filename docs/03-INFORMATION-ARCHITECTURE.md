# 03 — Information Architecture & Knowledge Connections

**Product**: ACE UiPath Community Digital Ecosystem  
**Scope**: Site Map, Navigation Flow & Relational Knowledge Graph  

---

## 1. Relational Knowledge Graph Architecture

> **No page in the ecosystem is an isolated island.**

Every entity in the platform is interlinked to create a connected knowledge graph:

```text
                        ┌────────────────────────┐
                        │   ACTIVITY MEMORY      │
                        │ Document Understanding │
                        └───────────┬────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐            ┌──────────────┐            ┌──────────────┐
│ TOPIC TAGS   │            │ LEARNING     │            │ STUDENT BOT  │
│ AI Center    │            │ MODULE       │            │ SHOWCASE     │
│ DU Extractors│            │ Track 4: DU  │            │ Invoice Bot  │
└──────┬───────┘            └──────┬───────┘            └──────┬───────┘
       │                           │                           │
       └───────────────────────────┼───────────────────────────┘
                                   ▼
                        ┌────────────────────┐
                        │ HACKATHON SPRINT   │
                        │ IDP Challenge 2026 │
                        └────────────────────┘
```

When a student inspects an activity (e.g. *Document Understanding Masterclass*), they can directly click through to:
1. The related **Learning Module** (Track 4: Intelligent Automation).
2. Real **Student Bots** in the Showcase built using Document Understanding.
3. Relevant **Cheat Sheets** & sample invoice datasets in Resources.
4. Active **Hackathons** testing document extraction skills.

---

## 2. Homepage Discovery Flow

The homepage is structured to answer one central question: **"Why should I care about this community?"**

```text
1. Hero Section (Tagline, Mission, Primary CTA "Explore Journey")
   │
   ▼
2. Live Community Impact Pulse (Students Trained, Bots Built, Certifications, Hours Saved)
   │
   ▼
3. Featured Flagship Event (Countdown, Agenda, Speaker Spotlight)
   │
   ▼
4. What Students Can Learn (Interactive 4-Track UiPath Journey Matrix)
   │
   ▼
5. Recent Activity Timeline (Laser-Rail Node Highlights)
   │
   ▼
6. Student-Built Automations (Featured Bots with Measured ROI Metrics)
   │
   ▼
7. Upcoming Challenges & Hackathons (Sprint Badges & Prize Pools)
   │
   ▼
8. Community Achievements & Certification Wall
   │
   ▼
9. Core Team & Faculty Patronage Spotlight
   │
   ▼
10. Get Involved / Join the Community CTA
```

---

## 3. Navigation Topography Map

```text
Public Pages
├── / (Homepage)
├── /activities (Activity Timeline & Filter Rail)
│   └── /activities/[slug] (Deep Institutional Memory Archival Page)
├── /learn (UiPath Learning Academy & Track Roadmap)
│   └── /learn/[trackSlug] (Interactive Module Reader & Starter Code)
├── /projects (Automations Vault & Bot Showcase with Inspection Modals)
├── /challenges (Hackathons, Sprints, Datasets & Winner Leaderboards)
├── /resources (Templates, Cheat Sheets & Exam Question Banks)
├── /about (Chapter Legacy, Faculty Advisors & Leadership Wall)
└── /join (Membership & Core Team Onboarding Forms)

Core Team Workspace (/core)
├── Activity Draft Staging
├── Artifact Attachment Hub (Slides, Videos, .XAML Packages)
└── Showcase Moderation Queue

Admin Operating System (/admin)
├── Site Configuration (Headlines, Marquee Ticker, Impact Counters)
├── Activities & Timeline Full CRUD
├── Learning Academy CMS
├── Projects Showcase Moderation & Featuring
├── Challenges & Hackathons Manager
├── Resources & Question Banks CMS
├── User Role Governance & Core Team Management
└── Backup & Handover Utility (1-Click JSON Snapshot)
```
