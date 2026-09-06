# 23 — Core Team Workspace & Operational Staging

**Product**: ACE UiPath Community Digital Operating System  
**Interface**: Core Team Staging Hub (`/core`)  

---

## 1. Purpose
Empower student organizers to manage day-to-day workshop logistics, media uploads, and peer project reviews without granting full root administration rights.

---

## 2. Workspace Capabilities
1. **Activity Staging**: Draft upcoming workshops with title, date, venue, and preliminary topics.
2. **Session Artifact Attachments**: Attach YouTube recording URLs, presentation slide deck links, and `.xaml` packages to existing activities.
3. **Student Bot Moderation**: Review code quality and approve submissions to the public Bot Vault.

---

## 3. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- Core Team Hub UI rendered in [`src/pages/CoreTeamPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/CoreTeamPage.tsx).
- Staging forms write to browser `localStorage`.

### PLANNED (Decided & Approved)
- Server-side RBAC guard requiring `CORE_TEAM` or `ADMIN` role.
- Uploads write to PostgreSQL with audit log tracking.

### FUTURE (Under Consideration)
- Real-time workshop attendee check-in scanner via mobile camera.
