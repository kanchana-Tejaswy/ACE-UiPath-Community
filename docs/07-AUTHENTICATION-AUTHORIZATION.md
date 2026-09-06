# 07 — Authentication & Authorization Architecture

**Product**: ACE UiPath Community Digital Operating System  
**Status**: PLANNED (Production Architecture)  

---

## 1. Public Access Principle (Unauthenticated Discovery)

> **Public students must NOT be forced to log in simply to explore the community website.**

The public website operates like a modern SaaS platform. Any student or guest visitor can open:
* `/` (Homepage & Live Stats)
* `/activities` & `/activities/[slug]` (Historical Timeline & Institutional Memory Archives)
* `/learn` (4-Track UiPath Academy & Tutorials)
* `/projects` (Automations Vault & Bot Showcase)
* `/challenges` (Hackathons & Sprints)
* `/resources` (Templates, Cheat Sheets, Certification Questions)
* `/about` (Chapter Legacy & Leadership Wall)

...without ever encountering a "Login Required" barrier.

Authentication is introduced strictly when an action genuinely demands personal identity or privileged authorization:
- Submitting a student bot to the showcase
- Registering a team for a hackathon
- Staging activity media (Core Team)
- System administration & CMS updates (Admin)

---

## 2. CURRENT Implementation (Audited)

- **Auth Engine**: **NONE**.
- **Role Control**: Visual dropdown modal ([`src/components/RoleSwitcherModal.tsx`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/components/RoleSwitcherModal.tsx)) that changes the `currentUser.role` React state variable.
- **Security Vulnerability**: Any user can open DevTools and set the role to `ADMIN` in `localStorage`.

---

## 3. PLANNED Production Auth Architecture (Supabase Auth)

```text
Student / Public User                     Core Team & Administrator
        │                                             │
        ▼                                             ▼
Google OAuth / Magic Link                  MFA / Secure Email & Password
(College Student Email @aceec.ac.in)      (Assigned by Super Admin)
        │                                             │
        └──────────────────────┬──────────────────────┘
                               ▼
                    Supabase Auth Engine
                               │
                               ▼
        Signed Cryptographic JWT in HTTP-Only Cookie
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
Next.js Server Middleware              PostgreSQL Row-Level Security
(Route Guards: /admin, /core)          (Table Mutation Policies)
```

- **Sessions**: Cryptographic JWT tokens stored in HTTP-Only cookies.
- **Middleware**: Server-side checks rejecting unauthenticated requests to `/admin` and `/core`.
- **Database Security**: Postgres Row Level Security (RLS) policies enforcing database-level authorization.
