# 41 — Admin CMS & Multi-Step Activity Creation Wizard

**Product**: ACE UiPath Community Digital Ecosystem  
**Interface**: Admin Cockpit (`/admin`)  

---

## 1. 11-Step Activity Creation Wizard Sequence

```text
01 Basic Information ──► 02 Schedule & Venue ──► 03 Speakers & Mentors
          │
          ▼
04 Session Agenda ─────► 05 UiPath Topics ─────► 06 Gallery & Media
          │
          ▼
07 Artifacts Vault ────► 08 Achievements ──────► 09 Related Knowledge
          │
          ▼
10 Live Preview ───────► 11 Publish & Confirm
```

---

## 2. Features Included

* **Step Progress Rail**: Highlighting completed and current steps.
* **Autosave & Draft Storage**: Local draft persistence so progress is not lost.
* **Live Archival Preview**: Step 10 renders the full institutional memory layout before publishing.
