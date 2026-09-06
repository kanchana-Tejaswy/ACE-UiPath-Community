# 35 — Prototype to PostgreSQL Database Migration Strategy

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Transitioning from `initialData.ts` / `localStorage` to Production PostgreSQL  

---

## 1. Prototype to Production Table Mapping

| Prototype Data Asset (`initialData.ts`) | Target PostgreSQL Table | Primary Key Strategy |
| :--- | :--- | :--- |
| `INITIAL_ACTIVITIES` | `activities`, `activity_agenda`, `speakers` | UUID (`a1111111-1111...`) |
| `INITIAL_LEARNING_PATHS` | `learning_paths`, `learning_modules` | UUID (`p1111111-1111...`) |
| `INITIAL_PROJECTS` | `projects` | UUID (`b1111111-1111...`) |
| `INITIAL_CHALLENGES` | `challenges` | UUID (`c1111111-1111...`) |
| `INITIAL_RESOURCES` | `resources` | UUID (`r1111111-1111...`) |
| `INITIAL_SETTINGS` | `site_settings` | Text Key (`global_config`) |

---

## 2. Data Migration Verification Checklist

- [x] All 14 relational tables defined with foreign keys and cascade rules.
- [x] Database indexes created on `slug`, `activity_date`, `category`, and `status`.
- [x] Initial seed dataset script (`supabase/seed.sql`) verified.
- [x] Frontend data mapping utilities (`src/lib/supabase/mappers.ts`) handling snake_case to camelCase conversion.
- [x] LocalStorage maintained as a graceful offline/fallback adapter.
