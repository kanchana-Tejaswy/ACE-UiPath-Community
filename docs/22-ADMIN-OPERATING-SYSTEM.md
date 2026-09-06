# 22 — Admin Operating System & Command Center

**Product**: ACE UiPath Community Digital Operating System  
**Interface**: Admin Dashboard (`/admin`)  

---

## 1. Purpose
Provide a zero-code operational cockpit for administrators to govern site copy, activities, learning materials, student bots, hackathons, resources, media, team roles, and system backups.

---

## 2. Admin OS Operational Architecture (PLANNED)

```text
Admin Dashboard (/admin)
│
├── Website (Hero, Announcement Marquee, Impact Counters)
├── Activities (Create, Edit, Publish, Archive)
├── Learning (Curriculum Paths & Lesson Modules)
├── Projects (Showcase Moderation & Feature Promotion)
├── Challenges (Hackathons, Sprints & Leaderboards)
├── Resources (Templates, Cheatsheets & Exam Banks)
├── Media (Cloud Object Storage Uploads)
├── Team & Users (Role Assignments: Student -> Core Team -> Admin)
├── Analytics (Students Trained, Bots Deployed, Hours Saved)
└── Audit Logs (Immutable Action Trail)
```

---

## 3. CURRENT vs. PLANNED vs. FUTURE State

### CURRENT (Actually Implemented)
- UI Dashboard in [`src/pages/AdminPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/AdminPage.tsx) with form tabs for Site Settings, Activities CRUD, Bot Moderation, and JSON Snapshot Backup.
- Role authenticated via local React state (`currentUser.role`).

### PLANNED (Decided & Approved)
- Authenticated login session verified via Supabase Auth JWT.
- Elimination of `localStorage currentUserId` dependency.
- Server-side authorization checks preventing non-admin access.

### FUTURE (Under Consideration)
- Direct database mutation rollback controls from the audit log viewer.
