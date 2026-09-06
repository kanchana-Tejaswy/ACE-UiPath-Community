# PHASE 22 — PLUGGABLE MULTI-PROVIDER DATA LAYER & CUSTOM REST API GATEWAY DESIGN

## 1. Executive Summary
Phase 22 specifies the architectural design for a Vercel-deployable **Custom REST API Gateway + PostgreSQL** backend for the **ACE UiPath Community Digital Operating System**.

The target architecture maintains strict provider independence:
```
UI (React Components & Pages)
  ↓
Store (useCommunityStore & AuthContext)
  ↓
DataAdapter Interface
  ↓
customRestAdapter.ts
  ↓
Vercel Serverless / Express REST API Gateway
  ↓
PostgreSQL Database (Neon / Vercel Postgres)
```

---

## 2. Backend Operations & API Endpoints Table

| Category | Endpoint Route | HTTP Method | Auth Required | Allowed Roles | Request Body / Action |
|---|---|---|---|---|---|
| **Activities** | `/api/activities` | `GET` | Public | All | List all activities |
| **Activities** | `/api/activities` | `POST` | Yes | `ADMIN` | Create/Update Activity |
| **Activities** | `/api/activities/:id` | `DELETE` | Yes | `ADMIN` | Remove Activity |
| **Projects** | `/api/projects` | `GET` | Public | All | List bot showcases |
| **Projects** | `/api/projects` | `POST` | Yes | `STUDENT`, `CORE_TEAM`, `ADMIN` | Create/Update Showcase |
| **Projects** | `/api/projects/:id/upvote` | `POST` | Public | All | Increment upvote count |
| **Learning** | `/api/learning-paths` | `GET` | Public | All | Get learning courses |
| **Learning** | `/api/learning-progress` | `GET`, `POST` | Yes | `STUDENT`, `CORE_TEAM`, `ADMIN` | Get / Toggle module completion |
| **Resources** | `/api/resources` | `GET` | Public | All | List vault assets |
| **Resources** | `/api/resources/:id/download` | `POST` | Public | All | Increment download count |
| **Drafts** | `/api/activity-drafts` | `GET` | Yes | `CORE_TEAM`, `ADMIN` | List Core Team drafts |
| **Drafts** | `/api/activity-drafts` | `POST` | Yes | `CORE_TEAM`, `ADMIN` | Create / Edit draft |
| **Drafts** | `/api/activity-drafts/:id/status` | `PATCH` | Yes | `ADMIN` | Review / Approve / Publish draft |
| **User Mgmt** | `/api/admin/users` | `GET`, `PATCH` | Yes | `ADMIN` | Change role / Status |
| **Analytics** | `/api/analytics-events` | `GET`, `POST` | Yes (GET: Admin) | All (POST: Public) | Record / View telemetry |
| **Auth** | `/api/auth/login`, `/api/auth/register` | `POST` | Public | All | Sign In / Register |

---

## 3. Security Model & Role Authorization Middleware

- **Bearer JWT Tokens**: `Authorization: Bearer <jwt_token>` issued upon login.
- **Server-Side Role Checks**: Middleware decodes token and enforces hierarchy:
  `STUDENT` (level 1) < `CORE_TEAM` (level 2) < `ADMIN` (level 3).
- **Core Team Self-Approval Defense**: `PATCH /api/activity-drafts/:id/status` rejects transitions to `APPROVED` or `PUBLISHED` if `req.user.role === 'CORE_TEAM'`.
- **Admin Self-Demotion Defense**: `PATCH /api/admin/users/:id` rejects role changes or account deactivation if `req.user.id === targetUserId`.

---

## 4. Authentication Recommendation

- **Recommended Approach**: **Custom JWT Session Auth with Password Hashing (argon2 / bcrypt)**
- **Why**: Zero external SaaS vendor lock-in, 100% Vercel Serverless compatible, native PostgreSQL connection pooling via `@neondatabase/serverless` or `pg-pool`, and seamless mapping to `AuthContext.tsx`.

---

## 5. PostgreSQL Database Schema

```sql
-- Core Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  roll_number VARCHAR(100),
  branch VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities Table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  activity_date VARCHAR(50) NOT NULL,
  time_start VARCHAR(50),
  time_end VARCHAR(50),
  venue VARCHAR(255),
  summary TEXT NOT NULL,
  full_description_md TEXT,
  objectives_text TEXT[],
  uipath_topics TEXT[],
  learning_outcomes TEXT[],
  banner_image_url TEXT,
  recording_url TEXT,
  slides_url TEXT,
  github_url TEXT,
  workflow_package_url TEXT,
  status VARCHAR(50) DEFAULT 'Upcoming',
  is_featured BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Storage Strategy

- **Recommendation**: **Vercel Blob / Cloudinary CDN**
- Direct HTTPS asset URLs for activity banner images, bot screenshots, and downloadable workflow packages matching `CommunityResource.downloadUrl`.

---

## 7. Custom REST Adapter Design (`customRestAdapter.ts`)

```ts
import { DataAdapter } from './dataAdapter';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const customRestAdapter: DataAdapter = {
  isCloudConnected: () => Boolean(import.meta.env.VITE_API_BASE_URL),
  
  getActivities: async () => {
    const res = await fetch(`${API_BASE}/activities`);
    const json = await res.json();
    return json.data || [];
  },

  saveActivity: async (act) => {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(act)
    });
    const json = await res.json();
    return json.data || [];
  },

  // ... Implements all DataAdapter methods
};
```

---

## 8. Files Impact Analysis

### New Files to Create in Future Implementation Phase:
1. `src/data/adapters/customRestAdapter.ts`
2. `src/lib/auth/customAuthService.ts`
3. `api/index.ts` (Vercel Serverless REST API entry point)

### Files That Must NOT Change:
- `src/pages/*` (All 11 page components)
- `src/components/*` (All 20 UI widgets and modals)
- `src/App.tsx`
- `src/data/store.ts`
- `src/lib/search/searchEngine.ts`
- `src/lib/recommendations/recommendationEngine.ts`

---

## 9. Migration & Rollback Strategy

- **Migration**: Export JSON snapshot via `exportDatabaseJson()` → run server seed script `seedPostgres.ts` → toggle `activeAdapter` in `src/data/adapters/index.ts`.
- **Rollback**: Revert `activeAdapter` selector to `localAdapter` or `supabaseAdapter`. Zero downtime.
