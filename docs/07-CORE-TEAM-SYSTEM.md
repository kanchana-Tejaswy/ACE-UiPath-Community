# 07 — Core Team Operations & Staging Workspace

**Product**: ACE UiPath Community Digital Operating System  
**Role**: Core Team Member (Operational Tier)  

---

## 1. Role Scope & Operational Boundaries

Core Team members are active student organizers and technical mentors. They require scoped operational access to manage day-to-day community workflows without receiving full administrative authority over system infrastructure or database configurations.

```text
               ┌─────────────────────────────────────────┐
               │         CORE TEAM PERMISSIONS           │
               ├─────────────────────────────────────────┤
               │  ✅ Draft Upcoming Workshop Records     │
               │  ✅ Upload / Attach Session Slides      │
               │  ✅ Attach YouTube Video Recordings     │
               │  ✅ Upload Starter / Solution .XAML     │
               │  ✅ Moderate Student Showcase Bots      │
               │  ✅ Review Hackathon Submissions        │
               │  ❌ CANNOT Modify Global Site Settings  │
               │  ❌ CANNOT Delete Core System Records   │
               │  ❌ CANNOT Manage User Roles            │
               │  ❌ CANNOT Reset or Drop Database       │
               └─────────────────────────────────────────┘
```

---

## 2. Core Team Workspace Capabilities (`/core`)

1. **Session Artifact Staging**:
   - Immediately following a workshop, core team members select the corresponding activity record and attach:
     - The Google Slides / PDF presentation URL.
     - The recorded YouTube / Cloud stream URL.
     - The packaged starter/solution `.xaml` archive.
2. **Showcase Moderation Queue**:
   - Inspect bots submitted by students via the public "Submit Your Bot" form.
   - Verify that the workflow adheres to UiPath clean coding standards and does not contain hardcoded secrets.
   - One-click approve for publication in the public Automations Vault.
3. **Hackathon Pipeline Coordination**:
   - Track team registrations and evaluate submitted GitHub repositories against published scoring rubrics.
