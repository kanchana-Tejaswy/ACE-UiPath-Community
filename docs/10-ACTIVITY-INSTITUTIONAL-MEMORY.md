# 10 — Activity Institutional Memory Engine

**Product**: ACE UiPath Community Digital Operating System  
**Core Asset**: Permanent Institutional Knowledge Preservation Across Student Generations  

---

## 1. The Institutional Memory Philosophy

> **An activity is an institutional knowledge record, not a temporary marketing card.**

When an event concludes, most college club portals delete the event banner. In the **ACE UiPath Community Digital OS**, concluding an activity transforms it into a permanent, searchable institutional knowledge record.

A student in 2030 can open an event conducted in 2024 or 2026 and access:
1. Exactly what business problems were solved.
2. The minute-by-minute session schedule and speakers.
3. The exact presentation slide deck delivered to the audience.
4. The recorded video lecture.
5. The exact `.xaml` workflow packages and solution files.
6. Student awards and certifications earned during the session.

---

## 2. Institutional Activity Record Schema (PLANNED)

```text
Activity Record (/activities/[slug])
│
├── Event Overview (Title, Category, Event Type, Date, Time, Venue, Status)
├── Pedagogical Core (Summary, Full Markdown Description, Objectives, UiPath Topics, Learning Outcomes)
├── Operational Schedule (Minute-by-Minute Agenda Items)
├── Speaker Profiles (Name, Title, Organization, Avatar, LinkedIn, Bio)
├── Artifacts Vault
│   ├── Presentation Deck (PDF / Slides link)
│   ├── Starter Workflow Package (.XAML / .ZIP)
│   ├── Final Solution Package (.NUPKG / .XAML)
│   ├── Video Lecture Recording (Embedded Video Player)
│   └── GitHub Repository Link
└── Community Recognition
    ├── Photo Gallery & Event Moments
    └── Attendee Achievements & Badge Awards
```

---

## 3. CURRENT vs. PLANNED vs. FUTURE State

### CURRENT (Actually Implemented)
- Complete UI layout rendered at [`src/pages/ActivityDetailPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/ActivityDetailPage.tsx).
- 4 rich historical activity records seeded in [`src/data/initialData.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/data/initialData.ts).

### PLANNED (Decided & Approved)
- Normalized Supabase PostgreSQL tables (`activities`, `activity_agenda`, `activity_speakers`, `activity_achievements`, `activity_media`).
- Slug-based dynamic rendering (`/activities/[slug]`) with OpenGraph preview metadata for social sharing.

### FUTURE (Under Consideration)
- AI-generated semantic indexing of video recordings for instant topic timestamp jumping.
