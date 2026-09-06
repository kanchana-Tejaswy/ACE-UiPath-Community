# 15 — Technical Resources & Cheatsheets Vault

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Cheat Sheets, Workflow Templates, Installation Guides & Exam Question Banks  

---

## 1. Purpose
Provide verified, production-ready UiPath assets to accelerate student development and exam preparation.

---

## 2. Resource Catalog
1. **Cheat Sheets**: REFramework best practices manuals and Modern Selector reference sheets.
2. **Workflow Templates**: Production-ready REFramework templates with Queue support.
3. **Official Certification Question Banks**: 150+ multiple-choice questions for the UiRPA Associate exam.
4. **Guides**: Installation walk-throughs for UiPath Studio Community Edition.

---

## 3. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- Resources UI in [`src/pages/ResourcesPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/ResourcesPage.tsx) with category filter chips, search input, and download buttons with local count tracking.
- 4 resources seeded in [`src/data/initialData.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/data/initialData.ts).

### PLANNED (Decided & Approved)
- `resources` PostgreSQL table with atomic increment triggers for download telemetry.
- Cloud object storage for hosting `.pdf` and `.zip` assets directly.

### FUTURE (Under Consideration)
- Community-contributed custom activity package repository.
