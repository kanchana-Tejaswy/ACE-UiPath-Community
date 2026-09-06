# PHASE 13 — REAL SUPABASE AUTHENTICATION & USER MANAGEMENT

## 1. Overview
Phase 13 completes the transition from staging local authentication to a production-grade **Supabase Authentication + User Profile + Role Management System** for the **ACE UiPath Community Digital Operating System**.

The authentication pipeline follows a strict unidirectional verification chain:
```
Login → Supabase Auth → User Identity (UUID) → Database Profile (public.users) → Normalized Role → Permission Check → Protected Workspace
```

---

## 2. Supported Role Model
The system enforces three strongly typed application roles:

| Application Role | Database Code | Hierarchy Level | Key Permissions & Workspace Access |
|---|---|---|---|
| **Student** | `STUDENT` | 1 | Public timeline, learning modules, bot showcase download, hackathon registration. Blocked from `/admin` and `/core`. |
| **Core Team** | `CORE_TEAM` | 2 | All Student permissions + `/core` workspace access to create/update activity drafts. Cannot self-approve or publish drafts. Blocked from `/admin`. |
| **Admin OS** | `ADMIN` | 3 | All Core Team permissions + `/admin` OS Cockpit access, draft approval & publishing, site settings, disaster recovery, and User Management. |

---

## 3. Architecture & User Profile Linkage
- **Identity & Secrets Ownership**: User passwords, access tokens, and refresh tokens are owned exclusively by **Supabase Auth** (`auth.users`). Passwords are never duplicated or stored in public database tables.
- **Application Profile**: Metadata, application roles (`STUDENT`, `CORE_TEAM`, `ADMIN`), and account statuses (`ACTIVE`, `INACTIVE`) reside in `public.users`.
- **Database Synchronization**:
  - Migration script `20260901000000_auth_user_profiles.sql` installs an automated trigger `handle_new_user()` on `auth.users` insertion to populate `public.users`.
  - Application profiles include `status` (`'ACTIVE'` / `'INACTIVE'`) and timestamp triggers.

---

## 4. Deactivation & Account Status Enforcement
- If an account has status `INACTIVE`:
  - `authService.getCurrentUser()` immediately terminates the Supabase session, clears authentication state, and logs an `UNAUTHORIZED_ATTEMPT_BLOCKED` audit log.
  - The login attempt returns: *"Your account is deactivated. Please contact an administrator."*
  - Deactivated users are blocked from accessing operational workspaces (`/core`, `/admin`).

---

## 5. Client-Side Role Escalation Protection
When `isCloudAuth === true` (Supabase environment variables configured):
- Frontend-only demo role switchers are disabled.
- LocalStorage role overrides, URL query parameters, or client state mutations cannot escalate user privileges.
- User roles are resolved strictly from `public.users` on the database server.

---

## 6. Admin User Management Cockpit
Added **User & Role Management** tab inside the Admin OS (`AdminPage.tsx` / `UserManagementSection.tsx`):
- View registered user grid with name, email, roll number, role badge, status badge, and creation date.
- Dynamic search filter by name/email/roll number, role filter (`STUDENT`, `CORE_TEAM`, `ADMIN`), and status filter (`ACTIVE`, `INACTIVE`).
- **Role Assignment**: Admins can promote/demote user roles via dynamic dropdown.
- **Status Toggle**: Admins can activate/deactivate accounts with instant status feedback.
- **Safety Guards**:
  - Admins cannot deactivate their own active logged-in account.
  - Admins cannot demote their own active Admin role privileges.

---

## 7. Password Recovery & Reset Flow
- **Forgot Password**: Form in `AuthModal` dispatches `authService.resetPasswordForEmail(email)` generating a Supabase recovery link pointing to `/#reset-password`.
- **Reset Password View**: When `#reset-password` hash location or Supabase `PASSWORD_RECOVERY` event triggers, `AuthModal` opens in password update view to input and validate the new password (`authService.updatePassword(newPassword)`).

---

## 8. Row Level Security (RLS) Policy Audit
- `users`: Authenticated read, owner self-update (excluding role/status), Admin full authority.
- `activity_drafts`: Core Team write/update access; Admin approval, publishing, and deletion authority.
- `activities`: Public SELECT for published activities; Admin full mutation authority.

---

## 9. Audit Logging
Tracked event types:
- `LOGIN_SUCCESS`
- `LOGIN_FAILURE`
- `LOGOUT`
- `SESSION_EXPIRED`
- `ACCOUNT_DEACTIVATED`
- `ROLE_CHANGED`
- `USER_CREATED`
- `PASSWORD_RESET_REQUESTED`
- `PASSWORD_UPDATED`
- `UNAUTHORIZED_ATTEMPT_BLOCKED`

*No passwords, access tokens, or refresh tokens are recorded in audit logs.*

---

## 10. Local-First Fallback Architecture
When Supabase credentials are missing or unconfigured (`isCloudAuth === false`):
- System seamlessly falls back to `localDatabase` user registry (`INITIAL_USERS`).
- Demo role switcher remains available for local staging evaluation.
- All repositories and UI components continue operating smoothly without throwing unhandled network exceptions.
