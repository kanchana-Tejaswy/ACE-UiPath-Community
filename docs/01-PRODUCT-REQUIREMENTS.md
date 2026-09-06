# 01 — Product Requirements Document (PRD)

**Product**: ACE UiPath Community Digital Operating System  
**Document Version**: 2.0  
**Target Audience**: Product Architects, Full-Stack Engineers, Core Team Leads  

---

## 1. Functional Requirements by User Experience Tier

### 1.1 Public / Student Experience (Unauthenticated Tier)
1. **Homepage Experience**:
   - Live Community Impact Counters (Students Trained, Bots Built, Certifications, Hours Saved).
   - Interactive 4-Track UiPath Journey Selector (Citizen Dev, Associate, REFramework, AI Specialist).
   - Flagship Masterclass Countdown Card with direct `.xaml` starter download.
   - Featured Student Automations Showcase spotlight with measured ROI metrics.
   - Global Announcement Marquee Ticker.
2. **Activity Timeline & Archive (`/activities`)**:
   - Multi-dimensional filtering by Academic Year (2022 to 2026+), Category (Workshop, Hackathon, Certification, Bootcamp, Guest Lecture), Delivery Mode (Offline, Online, Hybrid), and Search.
   - Toggle between **Laser-Rail Timeline View** and **Responsive Grid View**.
   - Deep Activity Detail Page (`/activities/[slug]`):
     - Date, Time, Venue, Mode, Status badges.
     - Session objectives and structured learning outcomes.
     - Minute-by-minute session agenda with speaker assignments.
     - Speaker profiles with LinkedIn links and bios.
     - Downloadable Artifacts Vault (Slide deck, starter `.xaml`, solution `.nupkg`/`.zip`, recorded lecture player).
     - Activity Photo Gallery with lightbox inspection.
     - Student recognition & certification awards.
3. **Learning Academy (`/learn`)**:
   - 4 Full Learning Tracks with difficulty badges, target audience, and estimated completion time.
   - Interactive lesson reader with syntax-highlighted code/selectors, practice exercises, and starter workflow `.xaml` downloads.
4. **Automations Vault & Bot Showcase (`/projects`)**:
   - Filter bots by UiPath tool (Studio, StudioX, REFramework, Document Understanding, Orchestrator).
   - Filter by ROI & Complexity.
   - Project inspection modal with problem statement, architecture breakdown, GitHub repository, and `.nupkg` download.
   - Upvoting capability.
   - Interactive "Submit Your Bot" modal for students.
5. **Challenges & Hackathons (`/challenges`)**:
   - Active hackathons and monthly sprints with countdown timers, prize pools, and starter datasets.
   - Submission form for student teams (Team name, members, repo URL, 3-minute video demo URL).
   - Hall of Hackathon Champions leaderboard.
6. **Resources & Cheatsheets Vault (`/resources`)**:
   - Filterable library of production REFramework templates, modern selector guides, and 150+ official UiPath Associate certification practice questions.
   - One-click downloads with live download counters.
7. **Institutional Legacy & Leadership (`/about`)**:
   - Chapter history from 2022 to 2026.
   - Faculty advisor patronage and official **UiPath Academic Alliance accreditation (ID: `ACE-UIPATH-EDU-ALLIANCE-9421`)**.
   - Leadership directory segmented by academic year.
8. **Get Involved Onboarding (`/join`)**:
   - Application forms for Student Membership, Core Team recruitment, and Peer Mentorship.
9. **Universal Command Search (`Ctrl+K`)**:
   - Modal search filtering across all activities, learning modules, bots, and resources.

---

### 1.2 Core Team Experience (Authenticated Operational Tier)
1. **Activity Staging & Media Attachment (`/core`)**:
   - Attach YouTube video recording URLs, Google Slides presentation links, and `.xaml` packages to existing activity records.
   - Draft upcoming workshops and hackathons for Admin review.
2. **Student Showcase Moderation**:
   - View pending student bot submissions and approve with one click.
3. **Attendance & Resource Coordination**:
   - Upload new cheat sheets, templates, and workshop slides.

---

### 1.3 Administrator Experience (Authenticated System Owner Tier)
1. **Global Site Configurator**:
   - Edit hero headlines, subheadlines, announcement ticker text, and toggle ticker visibility without code changes.
   - Edit community contact links (Discord, WhatsApp, LinkedIn, GitHub) and UiPath Alliance Partner ID.
   - Edit live impact metrics.
2. **Activities Full CRUD Management**:
   - Create, edit, publish, archive, and delete activities.
   - Manage agenda items, speaker rosters, learning outcomes, and media links.
3. **Showcase Moderation & Feature Toggles**:
   - Approve, reject, or promote student bots to "Featured" status on the homepage.
4. **Challenges & Hackathons Management**:
   - Launch new competitions, configure rules and evaluation rubrics, and publish winning teams.
5. **Database Snapshot & Disaster Recovery**:
   - One-click export of complete formatted JSON snapshot of all database tables.
   - One-click restore from JSON snapshot.
   - Factory reset to initial default seed dataset.

---

## 2. Non-Functional Requirements (NFRs)

| Metric / Dimension | Target Specification |
| :--- | :--- |
| **Performance (TTFB)** | < 100ms for static/ISR cached pages on Vercel / Edge CDN. |
| **First Contentful Paint (FCP)** | < 0.8s on 4G mobile networks. |
| **Accessibility** | Strict WCAG 2.1 AA compliance (4.5:1 contrast ratio, full keyboard navigation, aria-labels). |
| **Responsiveness** | Fluid adaptive layout from 375px (iPhone SE) to 2560px (4K displays). |
| **Institutional Longevity** | Zero reliance on runtime developer code changes for routine content updates. |
| **Data Integrity & Backup** | ACID transactional compliance in PostgreSQL with exportable JSON snapshots for student batch handovers. |
| **Security** | HTTP-only session cookies, server-side RBAC middleware, Postgres Row-Level Security (RLS), input sanitization against XSS. |

---

## 3. Prototype vs. Production Delta

| Requirement Area | Current Prototype Behavior | Required Production Implementation |
| :--- | :--- | :--- |
| **Persistence** | Browser `localStorage` (single device only) | PostgreSQL relational database (multi-user sync) |
| **Authentication** | Visual dropdown switcher (`RoleSwitcherModal`) | Server-side Supabase Auth / NextAuth session tokens |
| **File Uploads** | String URL inputs only | S3 / Supabase Storage multipart binary uploader |
| **Multi-Admin Sync** | Diverges / isolated to local machine | Server-side mutations with real-time websocket/poll sync |
