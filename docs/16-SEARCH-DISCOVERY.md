# 16 — Search & Global Discovery Architecture

**Product**: ACE UiPath Community Digital Ecosystem  
**Interface**: Universal Command Palette (`Ctrl+K` / `Cmd+K`)  

---

## 1. Purpose

Enable students, core team members, and administrators to locate any activity, REFramework tutorial, bot project, or cheat sheet in under 100 milliseconds.

---

## 2. Global Search Interaction UX

```text
User Presses Ctrl+K (or clicks Search Bar)
                 │
                 ▼
Command Palette Modal Opens (Auto-focused search field)
                 │
                 ▼
User Types Query (e.g., "Document Understanding")
                 │
                 ▼
Instant Categorized Results Displayed:
  ├── Activities: Document Understanding Masterclass 2026
  ├── Learning: Track 4 - Module 1: ML Extractors & DU
  ├── Projects: Automated Invoice Processor Bot
  ├── Resources: DU Invoice Sample Dataset
  └── Challenges: IDP Hackathon Sprint 2026
```

---

## 3. Implementation Specification

* **Keyboard Shortcut**: `Ctrl+K` (Windows/Linux) / `Cmd+K` (macOS) / `Escape` to close.
* **Component**: [`src/components/CommandSearchModal.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/components/CommandSearchModal.tsx).
* **Multi-Entity Indexing**: Scans title, summary, category, topics, and author fields in real time.
