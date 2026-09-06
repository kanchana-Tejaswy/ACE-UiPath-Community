# 38 — Local Data Architecture & Repository Pattern

**Product**: ACE UiPath Community Digital Ecosystem  
**Layer**: Data Access Layer & Storage Adapters  

---

## 1. Data Layer Topography

```text
React Components (Pages / UI)
          │
          ▼
Store Hook (useCommunityStore)
          │
          ▼
Repository Layer (src/data/repositories/)
  ├── activitiesRepository.ts
  ├── projectsRepository.ts
  ├── learningRepository.ts
  ├── resourcesRepository.ts
  └── settingsRepository.ts
          │
    ┌─────┴─────┐
    ▼           ▼
Local Database  Supabase Client (When Connected)
(localDatabase) (src/lib/supabase/)
```

---

## 2. Future Supabase Migration Path

Because UI components interact exclusively with repository adapters (`activitiesRepository.save()`, `projectsRepository.getAll()`), transitioning to production Supabase PostgreSQL will require updating only the repository implementation files rather than rewriting frontend React views.
