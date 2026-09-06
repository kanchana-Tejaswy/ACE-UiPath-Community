# 28 — Backup, Restore & Semester Handover Protocol

**Product**: ACE UiPath Community Digital Operating System  
**Objective**: Guaranteeing Zero Data Loss Across Graduating Student Generations  

---

## 1. The Handover Problem & Solution
Student leadership rotates every 1–2 years upon graduation. The platform provides a decentralized, 1-click disaster recovery and export engine to ensure new student leads take ownership effortlessly.

---

## 2. Backup & Restore Architecture

### 2.1 1-Click JSON Snapshot Export
* Accessible via `/admin` → **Data Backup & Restore**.
* Generates a single formatted JSON bundle containing all activities, learning modules, bot showcase records, hackathons, resources, leadership members, and site settings.

### 2.2 Restore Protocol
* Incoming administrators paste a previously exported JSON backup into the CMS restore box.
* The system validates schema integrity and updates all relational tables in a single transaction.

---

## 3. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- JSON export (`exportDatabaseJson()`), JSON import (`importDatabaseJson()`), and factory reset (`resetToDefaultData()`) implemented in [`src/data/store.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/data/store.ts).

### PLANNED (Decided & Approved)
- Server-side automated nightly PostgreSQL pg_dump backups saved to isolated cloud storage.

### FUTURE (Under Consideration)
- Automated periodic backup snapshot commits to a private GitHub archive repo.
