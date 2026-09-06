# 18 — Audit Logging & Institutional Accountability

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Mutation Tracking, Multi-Admin Governance & Integrity  

---

## 1. Purpose
Ensure complete institutional accountability by recording an immutable audit trail for all administrative actions (creating an event, modifying site headlines, approving/rejecting a bot, or deleting a resource).

---

## 2. Audit Log Schema
```text
{
  "id": "uuid",
  "user_id": "user_admin_1",
  "user_email": "admin@aceec.ac.in",
  "action": "UPDATE_SITE_SETTINGS",
  "entity_type": "SITE_SETTINGS",
  "entity_id": "global_config",
  "changes": {
    "announcementTicker": { "old": "Old text...", "new": "New text..." }
  },
  "ip_address": "10.0.1.42",
  "created_at": "2026-08-31T22:15:00Z"
}
```

---

## 3. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- No audit logging exists in the prototype; mutations execute directly in local browser state.

### PLANNED (Decided & Approved)
- `audit_logs` table in PostgreSQL automatically populated via server actions and API route middleware.
- Viewable exclusively by verified administrators in the Admin CMS.

### FUTURE (Under Consideration)
- Automated email alerts to faculty advisors for critical actions (e.g. database reset).
