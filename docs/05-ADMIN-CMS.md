# 05 — Admin Content Management System (CMS & OS)

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Operational Control Center, Non-Developer Governance & Dynamic Content Mutation  

---

## 1. CMS Core Philosophy

> **The Admin Dashboard is the operating system of the ACE UiPath Community.**  
> Non-developer student leaders and faculty coordinators must be capable of orchestrating the entire platform without touching a single line of TypeScript or redeploying code.

When an administrator performs any update:
```text
Admin Action in CMS
       │
       ▼
Server-Side Zod Validation
       │
       ▼
PostgreSQL Transaction + Audit Log
       │
       ▼
Next.js Cache Invalidation (revalidatePath)
       │
       ▼
All Public Users Globally See Updated Content
```

---

## 2. Admin CMS Operational Modules

### 2.1 Activities & Institutional Memory CMS
- **Create Activity Modal**: Input title, category, delivery mode, date, start/end time, venue, short summary, and full markdown breakdown.
- **Dynamic Agenda Builder**: Add/reorder minute-by-minute session schedule with assigned speakers.
- **Speaker Assignment**: Select existing speaker profiles or author new ones with LinkedIn credentials and avatars.
- **Artifacts Linker**: Attach presentation decks, `.xaml` starter packages, solution packages, and YouTube recording embeds.
- **Publish / Archive Toggles**: Transition event state (`Upcoming` → `Ongoing` → `Completed` → `Archived`).

### 2.2 Global Site Configurator
- **Hero & Headline Copy**: Modify hero taglines, mission statements, and introductory copy.
- **Announcement Ticker Marquee**: Edit alert messages, set target action URLs, and toggle global marquee visibility.
- **Live Impact Counters**: Update or automate student training counts, bots built, certifications, and hours saved.
- **Accreditation & Socials**: Configure Discord, WhatsApp, LinkedIn, GitHub URLs, and UiPath Academic Alliance Partner ID.

### 2.3 Showcase & Hackathon Moderation
- **Moderation Queue**: Review student bot submissions; verify repository links and documentation.
- **One-Click Promotion**: Promote standout bots to `Featured` status for hero prominence.
- **Hackathon Manager**: Post problem statements, upload scoring rubrics, configure countdown timers, and publish winner leaderboards.

### 2.4 Backup, Disaster Recovery & Handover
- **JSON Snapshot Export**: One-click download of the complete database in formatted JSON.
- **JSON Snapshot Restore**: Import a JSON file to restore all activities, bots, and settings.
- **Audit Logs**: Immutable timeline tracking which administrator made which change and when.
