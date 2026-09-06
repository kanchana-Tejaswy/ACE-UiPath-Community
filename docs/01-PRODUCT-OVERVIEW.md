# 01 — Product Overview & Ecosystem Topography

**Product**: ACE UiPath Community Digital Operating System  
**Institution**: ACE Engineering College  
**Target Audience**: Students (CSE, IT, ECE, EEE, Mech, Civil), Faculty Advisors, Core Team Leads, Recruiters  

---

## 1. What the Platform Is

The **ACE UiPath Community Digital Operating System** is the unified web platform for Robotic Process Automation (RPA) education, competitive bot building, event archiving, and community operations at ACE Engineering College.

---

## 2. Who It Serves & Why It Exists

1. **Undergraduate Students**: Provides a clear roadmap to discover automation, master UiPath Studio/REFramework, build portfolio projects, and earn official industry certifications.
2. **Core Team Student Leads**: Provides operational tooling to stage workshops, publish slide decks, upload recordings, and review peer project submissions.
3. **Faculty Coordinators & Administrators**: Provides a single pane of glass to oversee community health, track students trained, calculate hours of manual work saved, and maintain institutional records.
4. **Industry Recruiters**: Provides an authentic, verified showcase of student-built production automations with measurable business ROI.

---

## 3. The Three Primary User Experiences

### 3.1 Public / Student (Unauthenticated)
- **Zero Login Friction**: Unrestricted exploration of historical activities, video lectures, learning tracks, tutorials, downloadable `.xaml` starter kits, and student bots.
- **Identity-Gated Actions**: Authentication is requested strictly when submitting a bot, registering for a hackathon, or applying for mentorship.

### 3.2 Core Team (Authenticated Operational Tier)
- Scoped access to draft upcoming activities, attach session slides and video recordings to past events, and moderate student project submissions.

### 3.3 Admin (Authenticated System Owner Tier)
- Full authority to edit homepage headlines, announcement marquee banners, activity registries, user roles, site settings, and execute database backup/restore snapshots.

---

## 4. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- Complete UI for all 3 experiences (Public pages, Core Hub at `/core`, Admin CMS at `/admin`).
- Interactive role switcher (`RoleSwitcherModal.tsx`) for testing all 3 user views locally.
- Full client-side routing and search command palette (`Ctrl+K`).
- In-memory state store with `localStorage` persistence.

### PLANNED (Decided & Approved)
- Production PostgreSQL database replacing `localStorage`.
- Real session authentication (Supabase Auth / NextAuth) with server-side RBAC middleware.
- Cloud media storage for direct uploads of `.xaml`, `.nupkg`, `.pdf`, and `.jpg` files.

### FUTURE (Under Consideration)
- Single Sign-On (SSO) integration with official college student portal.
- Automated certificate generator with verifiable cryptographic QR codes for workshop attendees.
