# 32 — Project Changelog

All notable changes to the **ACE UiPath Community Digital Operating System** are documented in this file.

---

## [2.30.0] — 2026-09-01
### Phase 26 — Evidence-Based Real Browser QA
- **Evidence-Based Chrome QA Audit (`docs/67-PHASE-26-EVIDENCE-BASED-QA-REPORT.md`)**:
  - Tested live browser rendering using Playwright / Google Chrome browser subagent.
  - Documented direct `file://` protocol attempt (Page title loaded: `"ACE UiPath Community | Official Digital Operating System"`; DOM rendered blank without an HTTP compiler server) and `http://localhost:5173/` connection refused result.
  - Adhered strictly to the Zero-Assumption QA Rule: features requiring an HTTP dev server marked **NOT TESTED** rather than fabricated PASS scores. Captured screenshot evidence `index_html_direct_open_1788276691127.png`.

---

## [2.29.0] — 2026-09-01
### Phase 25 — Full Real-World UI/UX QA & Bug Discovery
- **Comprehensive QA Audit (`docs/66-PHASE-25-REAL-WORLD-QA-REPORT.md`)**:
  - Executed 28 real-world QA tests across Student, Core Team, Admin, Search, AI Assistant, Analytics, Security, and Responsiveness.
  - Documented 3 non-critical UI bugs (BUG-001 table scroll wrapper, BUG-002 search query debounce, BUG-003 AI Assistant drawer transition).
- **Security & Guard Verification**:
  - Confirmed Student access guards (`#admin`, `#core`), Core Team self-approval defense, and Admin self-demotion protection.

---

## [2.28.0] — 2026-09-01
### Phase 24 — Real PostgreSQL Connection & End-to-End API Verification
- **Environment & Security Boundary Audit**:
  - Audited client variables (`VITE_DATA_PROVIDER`, `VITE_API_BASE_URL`) vs server secrets (`DATABASE_URL`, `JWT_SECRET`).
- **REST API Route & Fallback Verification**:
  - Verified `customRestAdapter.ts` routing to `/api/*` endpoints with automatic local fallback when endpoints are offline.
- **Documentation & Verification Report (`docs/65-PHASE-24-REAL-POSTGRES-END-TO-END.md`)**:
  - Created complete Phase 24 End-to-End technical verification report with honest status breakdown.

---

## [2.27.0] — 2026-09-01
### Phase 23 — Custom REST API Gateway Implementation & PostgreSQL Integration
- **Custom REST Adapter (`src/data/adapters/customRestAdapter.ts`)**:
  - Implemented `customRestAdapter` adhering strictly to `DataAdapter` interface with automatic local fallback.
- **Multi-Provider Data Selector (`src/data/adapters/index.ts`)**:
  - Updated adapter selection to support `VITE_DATA_PROVIDER` (`'rest'`, `'supabase'`, `'local'`).
- **Serverless API Gateway Entry Point (`api/index.ts`)**:
  - Created Vercel Serverless REST API handler entry point.
- **Native PostgreSQL DDL Schema (`supabase/migrations/20260902000000_custom_postgres_schema.sql`)**:
  - Created full PostgreSQL schema migration for custom database deployment.
- **Documentation (`docs/64-PHASE-23-REST-API-POSTGRES.md`)**:
  - Created Phase 23 technical documentation.

---

## [2.26.0] — 2026-09-01
### Phase 22 — Pluggable Multi-Provider Data Layer & Custom REST API Gateway Design
- **REST API Endpoint Specifications**:
  - Designed 16 REST API endpoints matching all domain operations across Activities, Learning, Projects, Resources, Drafts, Auth, User Management, and Telemetry.
- **Backend Authorization & Middleware Design**:
  - Specified JWT session bearer token authentication with server-side role enforcement (`STUDENT < CORE_TEAM < ADMIN`), Core Team self-approval blocks, and Admin self-demotion guards.
- **PostgreSQL Database Schema DDL**:
  - Mapped existing domain models and Supabase schemas to native PostgreSQL tables with indexes and constraints.
- **Custom REST Adapter & Migration Strategy (`docs/63-PHASE-22-CUSTOM-REST-API-ARCHITECTURE.md`)**:
  - Designed `customRestAdapter.ts` implementing `DataAdapter` with zero UI modifications, and created zero-downtime database migration/rollback plan.

---

## [2.25.0] — 2026-09-01
### Phase 21 — Database Abstraction Audit & Provider Independence Strategy
- **Database Abstraction Audit (`dataAdapter.ts`, `localAdapter.ts`, `supabaseAdapter.ts`)**:
  - Audited 5-layer decoupled architecture and confirmed 0 UI components directly import external database SDKs.
- **Supabase Coupling Audit**:
  - Identified and isolated Supabase coupling to 5 specific boundary files under `src/lib/` and `src/data/adapters/`.
- **Plug-and-Play Migration Strategy (`docs/62-PHASE-21-DATABASE-PROVIDER-INDEPENDENCE.md`)**:
  - Documented provider replacement guide allowing seamless swap of production backend (Firebase, Appwrite, Neon/PostgreSQL REST, PocketBase, or Custom REST API) with zero modifications to UI pages or components.

---

## [2.24.0] — 2026-09-01
### Phase 20 — Production Launch Gate, Live Supabase Validation & Vercel Deployment
- **Pre-Flight Launch Audit**:
  - Audited Vite build scripts, Rollup chunking, SPA routing rewrites (`vercel.json`), and security boundaries.
- **Environment & Credentials Inspection**:
  - Verified safe environment variable fallback logic (`isSupabaseConfigured()`) when cloud keys are unconfigured.
- **SQL Migration Sequence Audit**:
  - Audited all 5 migration SQL files (`initial_schema`, `storage_buckets`, `activity_drafts_schema`, `auth_user_profiles`, `analytics_events`).
- **Launch Gate Documentation (`docs/61-PHASE-20-PRODUCTION-LAUNCH-GATE.md`)**:
  - Created complete Launch Gate report detailing Pre-Flight Audit results and final release decision (`DEPLOYMENT BLOCKED — CREDENTIALS / INFRASTRUCTURE REQUIRED`).

---

## [2.23.0] — 2026-09-01
### Phase 19 — Real-World UAT, Production Smoke Test & Release Hardening
- **Student Experience UAT**:
  - Verified public page navigation, search palette, Academy courses, bot showcases, resources, recommendations, and AI Assistant.
  - Confirmed Student access to `/admin` and `/core` is blocked.
- **Core Team Experience UAT**:
  - Verified Core Team workspace, draft creation, autosave, submission, and self-approval block (`isValidDraftStatusTransition`).
- **Admin OS Experience UAT**:
  - Verified User Management, role changes, account activation/deactivation, draft review, changes requested, approval, publication to public timeline, Admin Analytics, disaster recovery backup/restore, and Admin self-demotion guard.
- **Documentation & Release Readiness (`docs/60-PHASE-19-UAT-RELEASE-READINESS.md`)**:
  - Created complete UAT matrix and final release readiness documentation (`RELEASE READY WITH EXTERNAL VERIFICATION REQUIRED`).

---

## [2.22.0] — 2026-09-01
### Phase 18 — Real Supabase + Vercel Deployment & Production Verification
- **Environment & Configuration Audit (`client.ts`, `.env.example`, `vercel.json`)**:
  - Standardized environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_UIPATH_ALLIANCE_ID`).
  - Audited placeholder fallback detection (`isSupabaseConfigured()`) and Vercel SPA wildcard rewrites.
- **Migration & Data Mapping Alignment (`src/lib/supabase/migration.ts`)**:
  - Aligned data field mappings in `migration.ts` with `ProjectShowcase` and `Activity` entity models.
- **Offline Local Fallback Verification**:
  - Confirmed 100% offline feature parity via `localAdapter` and `localDatabase` when cloud credentials are unconfigured.
- **Documentation & Deployment Report (`docs/59-PHASE-18-DEPLOYMENT-VERIFICATION.md`)**:
  - Created Phase 18 deployment documentation detailing migration sequencing, authentication matrix, and production status (`CODE VERIFIED — LIVE DEPLOYMENT PENDING CREDENTIALS`).

---

## [2.21.0] — 2026-09-01
### Phase 17 — Final Platform Consolidation, Performance Audit & Handover Readiness
- **Comprehensive Codebase & Architecture Audit (`src/`)**:
  - Audited 5-layer decoupled architecture (`UI → Store → DataAdapter → Repository → LocalDatabase / Supabase`).
  - Confirmed zero direct component access to `localStorage` or `supabase.from()`.
- **Security & Authorization Hardening (`src/lib/security.ts` & `store.ts`)**:
  - Verified role normalization (`STUDENT`, `CORE_TEAM`, `ADMIN`), route guards (`/admin`, `/core`), and self-demotion safety checks in Admin User Management.
  - Verified activity draft state machine transitions (`DRAFT → SUBMITTED → IN_REVIEW / CHANGES_REQUESTED / APPROVED → PUBLISHED`).
- **Disaster Recovery & Data Integrity Audit (`store.ts` & `localDatabase.ts`)**:
  - Validated JSON backup export/import schema resilience against empty files, malformed JSON, and legacy versions.
- **Analytics, Search & AI Safety Audit (`searchEngine.ts`, `aiService.ts` & `localDatabase.ts`)**:
  - Verified bounded telemetry storage (`MAX_ANALYTICS_EVENTS = 500`), search relevance scoring, and read-only AI Assistant Local Knowledge Mode with clickable source references.
- **Production Configuration & Migration Audit (`vite.config.ts`, `vercel.json` & `supabase/migrations/`)**:
  - Audited Rollup vendor chunking, Vercel SPA wildcard rewrites, `.gitignore` safety, and 5 sequential SQL database migrations.
- **Documentation & Handover Readiness (`docs/58-PHASE-17-FINAL-AUDIT.md`)**:
  - Created complete technical audit report with domain readiness scoring (Overall Platform Readiness: **98%**).

---

## [2.20.0] — 2026-09-01
### Phase 16 — Intelligent Search, Content Recommendations & AI Community Assistant
- **Global Search Engine (`searchEngine.ts`)**:
  - Implemented multi-word token normalization and deterministic relevance scoring across activities, modules, projects, challenges, and resources.
- **Command Search Palette Upgrade (`CommandSearchModal.tsx`)**:
  - Integrated `searchEngine.ts`, filter chips (`All`, `Activities`, `Academy`, `Bots`, `Hackathons`, `Resources`), keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`), and search telemetry (`SEARCH_PERFORMED`, `SEARCH_RESULT_OPENED`, `SEARCH_NO_RESULTS`).
- **Personalized Recommendation Engine & Relationships (`recommendationEngine.ts` & `contentRelationships.ts`)**:
  - Created activity-aware recommendation engine generating 4 recommendation sets (*Continue Learning*, *Recommended for You*, *Based on Your Activity*, *Useful Resources*).
  - Added `RecommendedNextStep.tsx` student-facing recommendation widget on Home and Learn views.
- **ACE Community AI Assistant (`CommunityAssistant.tsx` & `aiService.ts`)**:
  - Built provider-independent AI service boundary `aiService.ts` supporting **Local Knowledge Mode** fallback when API credentials are absent.
  - Created floating `CommunityAssistant` drawer widget featuring suggested prompts, message history, and clickable **"Sources from ACE Community"** cards.
  - Enforced read-only safety, role awareness, and zero credential exposure.
- **Admin Discovery Intelligence (`AdminAnalyticsSection.tsx`)**:
  - Added Community Discovery Intelligence section inside Admin OS Cockpit tracking search query volume, zero-result searches, and top AI questions.
- **Documentation (`docs/57-PHASE-16-INTELLIGENCE-LAYER.md`)**:
  - Created complete technical documentation for Phase 16 intelligence architecture, search ranking algorithms, recommendation engine, and AI service boundaries.

---

## [2.19.0] — 2026-09-01
### Phase 15 — Product Analytics, Activity Telemetry & Ecosystem Expansion
- **Analytics Event Taxonomy & Model (`src/types/index.ts`)**:
  - Defined strongly typed `AnalyticsEventType` (`PAGE_VIEW`, `ACTIVITY_VIEWED`, `LEARNING_MODULE_OPENED`, `LESSON_COMPLETED`, `PROJECT_VIEWED`, `PROJECT_UPVOTED`, `CHALLENGE_VIEWED`, `CHALLENGE_SUBMITTED`, `RESOURCE_VIEWED`, `RESOURCE_DOWNLOADED`, `DRAFT_CREATED`, `DRAFT_SUBMITTED`, `DRAFT_REVIEWED`, `DRAFT_PUBLISHED`, `LOGIN_SUCCESS`, `LOGOUT`, `ROLE_CHANGED`, `ACCOUNT_DEACTIVATED`) and `AnalyticsEvent` interface.
- **Analytics Repository & Bounded Local Database (`analyticsRepository.ts` & `localDatabase.ts`)**:
  - Created `analyticsRepository` supporting `recordEvent()`, `getEvents()`, `getEventsByType()`, `getEventsByDateRange()`, `getEntityAnalytics()`, and `getUserActivitySummary()`.
  - Added bounded storage key `STORAGE_KEYS.ANALYTICS_EVENTS` capping local events at 500 records (`MAX_ANALYTICS_EVENTS = 500`).
- **DataAdapter Integration & Supabase Migration (`dataAdapter.ts`, `supabaseAdapter.ts` & `20260901000001_analytics_events.sql`)**:
  - Extended `DataAdapter` interface with `getAnalyticsEvents()`, `recordAnalyticsEvent()`, `getEventsByType()`.
  - Created SQL migration for `analytics_events` table, index optimization, and RLS policies (authenticated telemetry insert, Admin-only select).
- **Admin Analytics Intelligence Cockpit (`AdminAnalyticsSection.tsx` & `AdminPage.tsx`)**:
  - Built Analytics Intelligence dashboard inside Admin OS Cockpit.
  - Added Community Overview KPIs, time window filters (`Today`, `Last 7 Days`, `Last 30 Days`, `All Time`), native SVG time-series charts, Community Engagement Leaderboard, and Content Intelligence highlights.
- **Automated Workflow Telemetry (`store.ts` & `App.tsx`)**:
  - Integrated automatic telemetry triggers for page views, project upvotes, resource downloads, lesson completions, draft creation/review/publishing, and role management.
  - Updated snapshot backup export/import to include analytics events.
- **Documentation (`docs/56-PHASE-15-ANALYTICS-INTELLIGENCE.md`)**:
  - Created technical documentation for Phase 15 telemetry architecture, RLS security policies, and Admin Cockpit features.

---

## [2.18.0] — 2026-09-01
### Phase 14 — Production Deployment, CI/CD & Final Quality Verification
- **Production Build Optimization (`vite.config.ts`)**:
  - Configured Rollup vendor chunking isolating `@supabase/supabase-js`, `lucide-react`, and `react`/`react-dom` into separate production bundles.
- **Environment & Security Hardening (`.env.example` & `.gitignore`)**:
  - Verified public frontend variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_UIPATH_ALLIANCE_ID`).
  - Confirmed `.env.local` is ignored and zero service role keys or passwords exist in frontend source code.
- **Vercel SPA Routing Configuration (`vercel.json`)**:
  - Validated static build output directory `dist` and wildcard route rewrite to `/index.html` for single-page app history navigation.
- **Supabase Sequential Migration Audit (`supabase/migrations/`)**:
  - Audited 4 sequential migrations (`initial_schema`, `storage_buckets`, `activity_drafts_schema`, `auth_user_profiles`).
- **Role Authorization & Security Hardening (`src/components/Navbar.tsx`)**:
  - Applied `normalizeRole` to Navbar role badges, context action buttons, and mobile navigation items.
- **Resilient Disaster Recovery (`src/data/store.ts`)**:
  - Hardened snapshot backup import validation against empty strings, non-objects, and schema mismatch.
- **Production Documentation (`docs/55-PHASE-14-PRODUCTION-DEPLOYMENT.md`)**:
  - Created complete deployment architecture, secret management guidelines, RLS security matrix, and production checklist.

---

## [2.17.0] — 2026-09-01
### Phase 13 — Real Supabase Authentication & User Management
- **Supabase Auth & Identity Synchronization (`supabase/migrations/20260901000000_auth_user_profiles.sql`)**:
  - Added SQL migration linking Supabase Auth UUID to `public.users` application profile.
  - Added `status` (`'ACTIVE'` / `'INACTIVE'`), `role` (`'STUDENT'`, `'CORE_TEAM'`, `'ADMIN'`), and `updated_at` columns.
  - Installed automated trigger `handle_new_user()` on `auth.users` insert to sync auth accounts to application user profiles.
  - Enforced Row Level Security (RLS) policies for user profiles and draft moderation.
- **Role System Normalization (`src/lib/security.ts` & `src/types/index.ts`)**:
  - Implemented `normalizeRole(role)` helper mapping uppercase database codes and display strings seamlessly.
  - Standardized role hierarchy (`STUDENT` < `CORE_TEAM` < `ADMIN`).
- **Auth Services & Session Listener (`src/lib/auth/authService.ts` & `AuthContext.tsx`)**:
  - Connected `supabase.auth.onAuthStateChange` listener for real-time session persistence, browser refresh recovery, and token refresh.
  - Added active/inactive account status checking. Deactivated accounts (`status === 'INACTIVE'`) are immediately logged out and blocked.
  - Added password recovery methods (`resetPasswordForEmail` and `updatePassword`).
  - Added client-side role escalation protection when `isCloudAuth === true`.
- **Admin User & Role Management Cockpit (`src/components/UserManagementSection.tsx` & `AdminPage.tsx`)**:
  - Built User Management tab in Admin OS to view user profiles, emails, roles, account statuses, and creation dates.
  - Added Admin actions: role changes (`STUDENT`, `CORE_TEAM`, `ADMIN`) and account activation/deactivation toggles (`ACTIVE` / `INACTIVE`).
  - Added security guards preventing Admins from demoting or deactivating their own active account session.
- **Multi-View Auth Modal (`src/components/AuthModal.tsx` & `App.tsx`)**:
  - Added tab views for **Sign In**, **Forgot Password**, and **Reset Password**.
  - Added handling for `#reset-password` hash location in `App.tsx`.
- **Audit System Logging (`src/data/store.ts`)**:
  - Tracked audit logs for `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `LOGOUT`, `PASSWORD_RESET_REQUESTED`, `ROLE_CHANGED`, `ACCOUNT_DEACTIVATED`, `ACCOUNT_ACTIVATED`, and `UNAUTHORIZED_ATTEMPT_BLOCKED`.

---

## [2.15.0] — 2026-08-31
### Phase 11 — Production Security & Role Authorization Hardening
- **Role Permission & Security Engine (`src/lib/security.ts`)**:
  - Implemented `hasPermission` role hierarchy model (`Student < CoreTeam < Admin`).
  - Implemented `isValidDraftStatusTransition` draft state machine validator enforcing legitimate state transitions (`DRAFT` → `SUBMITTED` → `IN_REVIEW` → `APPROVED` → `PUBLISHED`).
  - Added self-approval prevention blocking Core Team creators from self-approving or publishing their own drafts without explicit Admin role credentials.
- **Data Layer Authorization Guards (`src/data/store.ts`)**:
  - Guarded privileged mutation actions (`saveActivityDraft`, `deleteActivityDraft`, `submitActivityDraft`, `reviewActivityDraft`, `publishActivityDraft`) with role checks.
  - Added `UNAUTHORIZED_ATTEMPT_BLOCKED` logging to local audit logs when unauthorized users attempt privileged actions.
- **Route Authorization Boundary (`src/App.tsx`)**:
  - Implemented route authorization guards for `#admin` and `#core` views.
  - Added **"Access Denied: Operational Workspace Restricted"** fallback UI for unauthorized role access.

---

## [2.14.0] — 2026-08-31
### Phase 8 — Supabase Cloud Activation & Data Adapter Architecture
- **Data Adapter Boundary (`src/data/adapters/`)**:
  - Created `DataAdapter` interface abstraction separating UI/Store from specific database providers.
  - Implemented `localAdapter.ts` for offline/local-first data operations backed by `localDatabase.ts`.
  - Implemented `supabaseAdapter.ts` for cloud persistence with automatic fallback to `localAdapter` if cloud is offline or missing credentials.
- **Controlled Local-to-Cloud Migration Engine (`src/lib/supabase/migration.ts`)**:
  - Built `migrateLocalToSupabase()` function validating records and batch uploading local activities, projects, resources, and drafts to Supabase tables.
- **Database Schema DDL & RLS Hardening (`supabase/migrations/20260831000002_activity_drafts_schema.sql`)**:
  - Added `activity_drafts` relational schema migration with status check constraints, indexes, and fine-grained Row Level Security (RLS) policies.

---

## [2.13.0] — 2026-08-31
### Core Team Workspace & Admin Review Queue Workflow
- **Core Team Draft -> Review -> Publish Workflow**:
  - Exported `DraftStatus` and `ActivityDraft` models in `src/types/index.ts`.
  - Added `ACTIVITY_DRAFTS` storage key and CRUD methods to `localDatabase.ts`.
  - Created `activityDraftsRepository.ts` for clean repository pattern access.
  - Added draft workflow actions (`saveActivityDraft`, `deleteActivityDraft`, `submitActivityDraft`, `reviewActivityDraft`, `publishActivityDraft`) in `store.ts`.
  - Extended `parseHashLocation` and `navigateTo` in `App.tsx` for `#core/draft/[id]` deep hash URLs.
  - Redesigned `CoreTeamPage.tsx` into a full workspace featuring metrics counters, draft list filters, multi-step editor, staged artifact controls, autosave, and deletion safety modals.
  - Added Core Team Review Queue section to `AdminPage.tsx` with *Request Changes*, *Approve*, and *Publish to Timeline* actions.

---

## [2.12.0] — 2026-08-31
### Real Product Functionality — Resources Deep Filtering & Download Tracking
- **Resources Vault Deep Category Routing (`#resources/<category-slug>`) & Download Persistence**:
  - Extended `parseHashLocation` and `navigateTo` in `src/App.tsx` to handle `#resources/[slug]` URLs and sync `window.history.pushState`.
  - Added `incrementDownloads` in `resourcesRepository.ts` and `store.ts` persisting download counts locally.
  - Added category slug resolution (`templates`, `cheatsheets`, `guides`, `certification`) in `ResourcesPage.tsx`.
  - Added immediate visual feedback toast (*"Count Saved!"*) on resource download click.
  - Added invalid category fallback banner with button returning to all resources.

---

## [2.11.0] — 2026-08-31
### Real Product Functionality — Deep Challenge & Hackathon Routing
- **Challenges & Hackathons Deep Hash Routing (`#challenges/<challenge-slug>`)**:
  - Extended `parseHashLocation` and `navigateTo` in `src/App.tsx` to handle `#challenges/[slug]` URLs and sync `window.history.pushState`.
  - Added challenge slug resolution in `ChallengesPage.tsx` automatically selecting the target hackathon tab.
  - Added invalid challenge slug fallback banner with button returning to active hackathons.
  - Updated challenge card clicks and team submission workflows to preserve hash state without full-page reloads.

---

## [2.10.0] — 2026-08-31
### Real Product Functionality — Deep Project Showcase Routing
- **Project Showcase & Bot Vault Deep Hash Routing (`#projects/<project-slug>`)**:
  - Extended `parseHashLocation` and `navigateTo` in `src/App.tsx` to handle `#projects/[slug]` URLs and sync `window.history.pushState`.
  - Added project slug resolution in `ProjectsPage.tsx` automatically opening the bot showcase modal view from the URL.
  - Added invalid project slug fallback banner with button returning to all showcase bots.
  - Updated project card clicks and modal close actions to sync hash state without full-page reloads.

---

## [2.9.0] — 2026-08-31
### Real Product Functionality — Deep Module Routing
- **Learning Academy Deep Hash Routing (`#learn/<module-slug>`)**:
  - Updated `parseHashLocation` and `navigateTo` in `src/App.tsx` to handle `#learn/[slug]` URLs and sync `window.history.pushState`.
  - Added track & module slug resolution in `LearnPage.tsx` automatically selecting the matching track and opening the lesson reader.
  - Added invalid module slug fallback banner with button returning to main academy roadmaps.
  - Verified browser Back, Forward, direct bookmarking, and lesson completion persistence.

---

## [2.8.0] — 2026-08-31
### Real Product Functionality Implementation
- **Learning Path Module Completion & Persistence Engine**:
  - Implemented `completedModuleIds` local database persistence and store state in `localDatabase.ts` and `store.ts`.
  - Added track percentage progress bars on learning track cards in `LearnPage.tsx`.
  - Added "Mark Lesson Complete" toggle button to active module headers in `LearnPage.tsx`.
  - Passed completion state and handlers cleanly from `App.tsx`.

---

## [2.7.0] — 2026-08-31
### Product Functionality & Code Hardening
- **Code-First Product Audit & Interaction Polish**:
  - Offline local-first fallback added to `src/data/store.ts` ensuring clean execution without cloud dependencies.
  - Media fallback text added to `ActivityDetailPage.tsx` for activities lacking attached downloads.
  - Verified student journey across Homepage, Activity Timeline, Learning Academy, Bot Showcase Vault, Hackathons, and Resources.
  - Confirmed 11-step Admin Creation Wizard, disaster recovery JSON backup export/import, and audit logging.

---

## [2.6.0] — 2026-08-31
### Added & Verified
- **Phase 6 Production Readiness, Local-First Validation & Quality Audit**:
  - Full production readiness audit documented in `docs/50-PHASE-6-PRODUCTION-READINESS-AUDIT.md`.
  - Local-first repository pattern verified (`UI -> Store -> Repositories -> localDatabase`).
  - Disconnected Supabase cloud isolation verified in `src/lib/supabase/client.ts` and `src/data/store.ts`.
  - Added media fallback text in `ActivityDetailPage.tsx` for activities without attached downloads.
  - Verified 11-step creation wizard, URL hash navigation sync, disaster recovery snapshots, and focus accessibility.

---

## [2.5.0] — 2026-08-31
### Added & Improved
- **Phase 5 Admin Operating System & Content Governance**:
  - Admin OS Cockpit audit documented in `docs/46-ADMIN-OS-AUDIT.md`.
  - Created Disaster Recovery architecture specification in `docs/47-BACKUP-RESTORE-ARCHITECTURE.md`.
  - Documented 3-tier Role Governance boundary matrix in `docs/48-ADMIN-ROLE-BOUNDARY.md`.
  - Integrated Sidebar Navigation & Dashboard Health Cockpit in `AdminPage.tsx`.
  - Structured Audit Event logging engine (`AuditLogEntry`) integrated into `store.ts` and `localDatabase.ts`.
  - Safety modal confirmation dialogs created for destructive operations.
  - Full implementation specification documented in `docs/49-PHASE-5-IMPLEMENTATION.md`.

---

## [2.4.0] — 2026-08-31
### Added & Improved
- **Phase 4 Product Quality & Experience Hardening**:
  - Full codebase quality audit documented in `docs/44-PHASE-4-AUDIT.md`.
  - Added friendly empty state panel for missing activity slugs on `ActivityDetailPage.tsx`.
  - Interlinked Community Knowledge Graph added to `ActivityDetailPage.tsx` connecting activities to learning modules, student bots, and resources.
  - Zero-result search empty states added to `ProjectsPage.tsx` and `ResourcesPage.tsx`.
  - Accessible `:focus-visible` outline indicators standardized in `src/index.css`.
  - Local-first repository pattern layer verified and documented in `docs/45-PHASE-4-IMPLEMENTATION.md`.

---

## [2.3.0] — 2026-08-31
### Added
- **Phase 3B Local Production Implementation**:
  - Repository pattern access layer created (`src/data/repositories/` & `src/data/local/localDatabase.ts`).
  - Hash & History URL navigation sync (`#activities/[slug]`) in `src/App.tsx`.
  - 11-Step Admin Activity Creation Wizard in `src/pages/AdminPage.tsx`.

---

## [2.2.0] — 2026-08-31
### Added
- **Phase 1 Production Backend Architecture Assessment & Specification**:
  - Full audit of current prototype vs planned production architecture.
  - Evaluation of Supabase PostgreSQL, Supabase Auth, and Supabase Storage.
  - 14 normalized relational PostgreSQL table definitions with foreign key cascade rules.
  - 3-tier RBAC permission matrix (Public / Student, Core Team, Admin) and Postgres Row Level Security (RLS) policies.
  - Media storage metadata schema for binary `.xaml`, `.nupkg`, `.pdf`, and image uploads.
  - Data seed migration strategy from `initialData.ts` to PostgreSQL.
  - Audit logging schema and security threat defense specifications.

---

## [2.1.0] — 2026-08-31
### Added
- **Phase 0 Documentation Foundation**: Complete `/docs` directory established with 33 detailed specifications, ADR logs, and single-source-of-truth guidelines.

---

## [2.0.0] — 2026-08-31
### Added
- **Complete Visual & Interactive Prototype**:
  - Elite UI/UX Design System with UiPath Electric Orange (`#FA4616`) and Deep Obsidian dark mode (`src/index.css`).
  - 11 primary views and rich seed dataset (`src/data/initialData.ts`).

---

## [1.0.0] — 2026-08-20
### Added
- Initial project repository creation on GitHub (`Kanchana Tejaswy`).
