# 05 — System Architecture & Production Topology

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Component Layers, Execution Pipeline & Data Flow  

---

## 1. Current Architecture vs. Planned Production Architecture

### 1.1 CURRENT (Actually Implemented)
```text
Browser Client
      │
      ▼
React 18 Component Tree (Vite SPA)
      │
      ▼
Local State Hooks (useCommunityStore)
      │
      ▼
Browser localStorage (Isolated to Single Physical Device)
```

**Operational Reality**: All CRUD mutations execute inside the local browser. When an admin edits a record, it updates that admin's personal `localStorage`. Other users visiting from their own laptops or mobile phones cannot see the change.

---

### 1.2 PLANNED (Decided & Approved Production Architecture)

```text
                         ┌──────────────────────┐
                         │     PUBLIC USERS     │
                         │  Students / Visitors │
                         └──────────┬───────────┘
                                    │ (Zero Auth Friction)
                                    ▼
                         ┌──────────────────────┐
                         │   PREMIUM WEB APP    │
                         │      React UI        │
                         └──────────┬───────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                     ▼              ▼              ▼
                Public API     Admin API      Core Team API
                     │              │              │
                     └──────────────┼──────────────┘
                                    ▼
                         ┌──────────────────────┐
                         │    AUTHORIZATION     │
                         │     RBAC / RLS       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Supabase Postgres  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Supabase Storage   │
                         │ Images / PDF / XAML  │
                         │ ZIP / PPT / Documents│
                         └──────────────────────┘
```

---

## 2. Platform Selection: Why Supabase for Production

**Platform Selected**: **Supabase (Managed PostgreSQL)**

### Architectural Rationale:
1. **Unified Infrastructure**: Provides PostgreSQL, Auth, Storage, RLS, and Realtime APIs in a single platform, eliminating the need to stitch together separate DB, Auth, and S3 providers.
2. **Simplified Backend Layer**: The `@supabase/supabase-js` client interacts directly with PostgreSQL tables enforcing Row Level Security (RLS) policies without requiring heavy intermediary Node/Prisma boilerplate for simple CRUD operations.
3. **Built-in Storage Buckets**: Native support for pre-signed file uploads (photos, PDFs, `.xaml`, `.nupkg`, `.zip`) tied directly to database user identity.
4. **Built-in Authentication**: Native support for Google OAuth (`@aceec.ac.in`) and magic link passwordless login.
5. **Dashboard Administration**: Provides a built-in admin GUI for database management and manual maintenance.

---

## 3. Data Flow Topography (PLANNED)

### 3.1 Public Student Browses Activities (Read Path - Unauthenticated)
1. Student requests `/activities` or `/activities/[slug]`.
2. App queries `supabase.from('activities').select('*, activity_speakers(*), activity_agenda(*)')`.
3. Supabase RLS policy `Public activities are viewable by everyone` permits read access without requiring login.
4. UI renders the institutional memory record.

### 3.2 Administrator Updates Site Settings (Write Path - Authenticated)
1. Admin logs in via Supabase Auth; session token saved in HTTP-only cookie.
2. Admin edits headline in `/admin` CMS.
3. App calls `supabase.from('site_settings').update({ value: ... }).eq('key', 'global_config')`.
4. Supabase validates JWT session and executes Postgres RLS policy `Admins can mutate settings`.
5. DB update triggers broadcast; all connected public clients update immediately.
6. Postgres trigger logs action into `audit_logs` table.
