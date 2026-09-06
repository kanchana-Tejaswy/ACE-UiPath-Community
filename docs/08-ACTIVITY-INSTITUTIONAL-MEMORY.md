# 08 — Activity Timeline & Institutional Memory Engine

**Product**: ACE UiPath Community Digital Operating System  
**Core Domain Asset**: The Permanent Activity Knowledge Archive (2022–2026+)  

---

## 1. The Institutional Memory Philosophy

> **An activity is not a temporary marketing card. It is a permanent chapter in the institutional history of the ACE UiPath Community.**

Five years from now, when a sophomore joins ACE Engineering College in 2031, they should be able to navigate to an activity conducted in 2024 or 2026 and access:
1. Exactly what business problems were solved.
2. The exact minute-by-minute session breakdown.
3. Who the industry speakers and student organizers were.
4. The exact presentation slide deck delivered to the audience.
5. The full recorded video lecture.
6. The exact `.xaml` workflow packages and solution files.
7. The student attendees who won hackathon prizes or earned official UiPath certifications.

---

## 2. Institutional Activity Record Schema

```text
Activity Entity
├── Identity & Logistics
│   ├── UUID & SEO Slug (/activities/reframework-masterclass-2026)
│   ├── Title & Category (Workshop, Hackathon, Certification, Bootcamp)
│   ├── Event Type (Offline, Online, Hybrid) & Venue / Live Stream Link
│   ├── Date & Start/End Times
│   └── Status (Upcoming, Ongoing, Completed, Archived) & Featured Flag
├── Pedagogical Core
│   ├── Executive Summary
│   ├── Technical Deep-Dive Markdown
│   ├── Session Objectives List
│   ├── UiPath Technologies Covered (e.g. Studio, REFramework, Orchestrator)
│   └── Measurable Learning Outcomes
├── Operational Topography
│   ├── Minute-by-Minute Session Agenda (Time Slot, Title, Description, Speaker)
│   └── Distinguished Speakers & Mentors (Name, Title, Organization, Avatar, LinkedIn, Bio)
├── Downloadable Artifacts Vault
│   ├── Presentation Deck (PDF / Slides link)
│   ├── Starter Workflow (.XAML / .ZIP)
│   ├── Solution Package (.NUPKG / .XAML)
│   ├── Video Lecture Recording (Embedded player / YouTube link)
│   └── GitHub Repository Link
└── Historical Moments & Recognition
    ├── High-Resolution Photo Gallery & Moments
    └── Attendee Achievements (Badge Type, Recipient Name, Roll Number, Description)
```

---

## 3. Timeline Visual System

1. **Laser-Rail Timeline**: Vertical radiant rail with pulsing node states connecting events chronologically from 2022 to the current year.
2. **Responsive Card Grid**: High-density grid view with quick category badges, speaker avatars, and instant detail buttons.
3. **Multi-Dimensional Filter Bar**: Real-time client-side slicing by Academic Year, Category Type, Delivery Mode, and Technical Keyword.
