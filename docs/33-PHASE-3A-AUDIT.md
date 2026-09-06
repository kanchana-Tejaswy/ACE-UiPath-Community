# 33 — Phase 3A Architecture Audit & Codebase Inspection

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Codebase Audit, Dependency Analysis & LocalStorage Inventory  
**Date**: 2026-08-31  

---

## 1. Existing Application Audit

### 1.1 Core Framework & Build Infrastructure
- **Framework**: Vite 5.3.1 + React 18.3.1 (Single-Page Application / SPA).
- **TypeScript**: Version 5.4.5 with strict type configurations (`tsconfig.json`, `tsconfig.node.json`).
- **Icons & Styling**: Lucide React 0.395.0 + custom CSS design tokens in `src/index.css` (`#FA4616`, Deep Obsidian dark mode).
- **Routing**: Component-level state router in [`src/App.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/App.tsx) listening to state variable `currentPage` (`'home'`, `'activities'`, `'activity-detail'`, `'learn'`, `'projects'`, `'challenges'`, `'resources'`, `'about'`, `'join'`, `'admin'`, `'core'`).

### 1.2 Data Persistence & Storage Audit
The current prototype stores all data in browser `localStorage` using keys defined in [`src/data/store.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/data/store.ts):
- `ace_uipath_activities_v2`
- `ace_uipath_learning_paths_v2`
- `ace_uipath_projects_v2`
- `ace_uipath_challenges_v2`
- `ace_uipath_resources_v2`
- `ace_uipath_leadership_v2`
- `ace_uipath_settings_v2`
- `ace_uipath_users_v2`
- `ace_uipath_current_user_id_v2`

### 1.3 Audit of Component Dependencies on LocalStorage
1. [`src/data/store.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/data/store.ts): Main store hook `useCommunityStore()` reads and writes to `localStorage` with `notifyDbChange()` dispatching `window.dispatchEvent(new Event('ace_uipath_db_update'))`.
2. [`src/pages/AdminPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/AdminPage.tsx): Invokes `saveActivity`, `deleteActivity`, `updateSettings`, `importDatabaseJson`, `exportDatabaseJson`, `resetToDefaultData`.
3. [`src/pages/CoreTeamPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/CoreTeamPage.tsx): Invokes `saveActivity` to stage media/slides/recordings.
4. [`src/pages/ProjectsPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/ProjectsPage.tsx): Invokes `saveProject` for new bot submissions and `upvoteProject` for upvoting.
5. [`src/pages/ChallengesPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/ChallengesPage.tsx): Invokes `saveChallenge` for team submissions.
6. [`src/pages/ResourcesPage.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/pages/ResourcesPage.tsx): Reads `resources` and invokes `saveResource` for download counter increments.
7. [`src/components/RoleSwitcherModal.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/components/RoleSwitcherModal.tsx): Invokes `setCurrentRole` which sets `ace_uipath_current_user_id_v2`.

---

## 2. Identified Migration Risks

1. **Dual-State Confusion**: Replacing `localStorage` instantly could break prototype UI views if Supabase credentials are missing or offline.
   - *Mitigation Strategy*: Keep `useCommunityStore` as a hybrid store adapter. It will query Supabase APIs when environment keys are present, and fall back to `initialData.ts` / local state when offline.
2. **Type Discrepancies**: Handcrafted frontend TypeScript types in `src/types/index.ts` use camelCase (`fullDescriptionMd`, `uipathTopicsCovered`), whereas SQL columns use snake_case (`full_description_md`, `uipath_topics`).
   - *Mitigation Strategy*: Provide data mapper utility functions in `src/lib/supabase/mappers.ts` to seamlessly convert database snake_case records into frontend camelCase types.
3. **Data Loss on Migration**: Overwriting existing initial data could lose rich historical records from 2022–2026.
   - *Mitigation Strategy*: Produce a complete SQL seed script (`supabase/seed.sql`) containing all 2022–2026 activities, learning modules, projects, and resources from `initialData.ts`.

---

## 3. Recommended Phased Implementation Approach

1. **Step 1**: Install `@supabase/supabase-js` package dependency.
2. **Step 2**: Create complete PostgreSQL migration DDL in `supabase/migrations/20260831000000_initial_schema.sql` defining 14 normalized tables, foreign keys, indexes, and RLS policies.
3. **Step 3**: Create Supabase Storage bucket policy DDL in `supabase/migrations/20260831000001_storage_buckets.sql`.
4. **Step 4**: Generate comprehensive seed data script in `supabase/seed.sql` transforming `initialData.ts` into PostgreSQL `INSERT` queries.
5. **Step 5**: Create Supabase client and data services layer in `src/lib/supabase/`.
6. **Step 6**: Create environment configuration `.env.example` and `.env.local`.
7. **Step 7**: Update documentation (`docs/34-SUPABASE-SETUP.md`, `docs/35-DATABASE-MIGRATION.md`, `docs/36-STORAGE-ARCHITECTURE.md`).
8. **Step 8**: Run build and TypeScript verification to ensure zero errors.
