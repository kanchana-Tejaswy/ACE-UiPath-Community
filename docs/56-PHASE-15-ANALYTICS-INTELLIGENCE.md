# PHASE 15 — PRODUCT ANALYTICS, ACTIVITY TELEMETRY & ECOSYSTEM EXPANSION

## 1. Executive Summary
Phase 15 introduces a comprehensive, privacy-first **Product Analytics + Community Engagement Intelligence + Operational Monitoring System** for the **ACE UiPath Community Digital Operating System**.

The analytics architecture follows the application's established local-first principles:
```
UI / Event Trigger → Store (useCommunityStore) → DataAdapter (activeAdapter) → Repository / localDatabase / Supabase
```

---

## 2. Telemetry Event Taxonomy
All analytics events are strongly typed via `AnalyticsEventType` in `src/types/index.ts`:

| Event Type | Category | Description / Trigger |
|---|---|---|
| `PAGE_VIEW` | Public | Hash location navigation change (`#activities`, `#learn`, `#projects`, etc.) |
| `ACTIVITY_VIEWED` | Content | User inspects an activity detail modal |
| `LEARNING_MODULE_OPENED` | Academy | User opens a learning module |
| `LESSON_COMPLETED` | Academy | Student toggles module lesson completion |
| `PROJECT_VIEWED` | Showcase | User views a bot showcase project |
| `PROJECT_UPVOTED` | Showcase | Community member upvotes a bot project |
| `CHALLENGE_VIEWED` | Hackathon | User views a hackathon sprint |
| `CHALLENGE_SUBMITTED` | Hackathon | Team submits a hackathon project solution |
| `RESOURCE_VIEWED` | Vault | User inspects a resource asset |
| `RESOURCE_DOWNLOADED` | Vault | Community member downloads a workflow template or cheat sheet |
| `DRAFT_CREATED` | Core Team | Core Team member creates or updates an activity draft |
| `DRAFT_SUBMITTED` | Core Team | Core Team member submits draft for Admin review |
| `DRAFT_REVIEWED` | Admin | Admin reviews draft or requests changes |
| `DRAFT_PUBLISHED` | Admin | Admin approves and publishes draft to public timeline |
| `LOGIN_SUCCESS` | Auth | User signs in successfully |
| `LOGIN_FAILURE` | Auth | User sign in attempt fails |
| `LOGOUT` | Auth | User logs out of active session |
| `ROLE_CHANGED` | Admin | Admin updates user role (`STUDENT`, `CORE_TEAM`, `ADMIN`) |
| `ACCOUNT_DEACTIVATED` | Admin | Admin deactivates user account status |

---

## 3. Privacy & Security Rules
- **Zero Secrets / Zero Tokens**: Telemetry payloads NEVER store passwords, authentication tokens, session secrets, or private message content.
- **Role Isolation**: Admin Analytics Intelligence is strictly protected by `normalizeRole()` and `hasPermission()`. Students and unauthorized users cannot view global community analytics.
- **Bounded Local Storage**: Local storage caps telemetry events at 500 records (`MAX_ANALYTICS_EVENTS = 500`) to prevent memory exhaustion, while snapshot backups prune to the last 200 events.

---

## 4. Supabase Analytics Migration (`20260901000001_analytics_events.sql`)
```sql
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  anonymous_session_id TEXT,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
- **Indexes**: Created on `event_type`, `user_id`, `(entity_type, entity_id)`, and `created_at DESC`.
- **Row Level Security**:
  - `INSERT`: Open to public/authenticated telemetry events (`WITH CHECK (true)`).
  - `SELECT`: Restricted exclusively to active Admin users (`u.role = 'ADMIN' AND u.status = 'ACTIVE'`).

---

## 5. Admin Analytics Intelligence Cockpit (`AdminAnalyticsSection.tsx`)
Features available inside Admin OS:
- **Community Overview KPIs**: Total Registered Members, Total Recorded Events, Resource Downloads, Lessons Completed.
- **Time Window Filters**: Today, Last 7 Days, Last 30 Days, All Time.
- **Native SVG Time-Series Chart**: Displays daily interaction volume without external charting dependencies.
- **Community Engagement Leaderboard**: Ranks members based on completed lessons, resource downloads, and hackathon participation.
- **Content Intelligence**: Highlights top performing activities, most upvoted bot showcases, and top downloaded resources.

---

## 6. Disaster Recovery & Snapshot Backup Integration
- `exportDatabaseJson()` serializes the latest 200 analytics events alongside core collections.
- `importDatabaseJson()` safely parses and restores `analyticsEvents` with array validation.
