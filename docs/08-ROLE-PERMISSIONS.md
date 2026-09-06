# 08 — Role & Permissions Matrix

**Product**: ACE UiPath Community Digital Operating System  
**Model**: 3-Tier Role-Based Access Control (RBAC)  

---

## 1. CURRENT Implementation (Audited)

- Role checks are performed exclusively in the React frontend using `currentUser.role` state.
- Selecting "Admin" in `RoleSwitcherModal.tsx` reveals the `/admin` view.
- **Limitation**: No server-side authorization checks exist.

---

## 2. PLANNED Production RBAC Architecture

### 2.1 Role Definitions

#### PUBLIC / STUDENT
* **Read Access**: Browse all activities, read learning tracks, inspect bot projects, view hackathons, download public resources, view community history.
* **Write Access**: Submit a bot project for review (status set to `Pending`), submit a hackathon entry, apply for core team/mentorship.
* **Restricted**: Cannot mutate published site content, edit site settings, view audit logs, or access `/admin` / `/core`.

#### CORE_TEAM
* **Read Access**: Full public read access + access to Core Team Staging Hub (`/core`).
* **Write Access**: Draft upcoming activities, attach session slide decks and video recording links, upload starter `.xaml` packages, moderate student bot submissions (approve to showcase).
* **Restricted**: Cannot modify global site settings, manage user roles, delete system records, view system audit logs, or access root admin features.

#### ADMIN
* **Read/Write Access**: Full authority over all entities (Activities, Learning Modules, Projects, Hackathons, Resources, Site Settings, User Roles, Media, Audit Logs, Database Backup/Restore).

---

## 3. PLANNED RBAC Matrix & RLS Policies

| Entity / Action | PUBLIC / STUDENT | CORE_TEAM | ADMIN | Postgres RLS Policy |
| :--- | :---: | :---: | :---: | :--- |
| **Browse Activities** | ✅ Read | ✅ Read | ✅ Read | `status IN ('Upcoming', 'Ongoing', 'Completed', 'Archived')` |
| **Draft Activity** | ❌ Forbidden | ✅ Create (Draft) | ✅ Full CRUD | `auth.jwt() ->> 'role' IN ('CORE_TEAM', 'ADMIN')` |
| **Publish Activity** | ❌ Forbidden | ❌ Forbidden | ✅ Full CRUD | `auth.jwt() ->> 'role' = 'ADMIN'` |
| **Attach Activity Media** | ❌ Forbidden | ✅ Update Media | ✅ Full CRUD | `auth.jwt() ->> 'role' IN ('CORE_TEAM', 'ADMIN')` |
| **Submit Bot Project** | ✅ Create (Pending) | ✅ Create (Pending) | ✅ Auto-Approve | `auth.role() = 'authenticated'` |
| **Approve Bot Project** | ❌ Forbidden | ✅ Approve | ✅ Full CRUD | `auth.jwt() ->> 'role' IN ('CORE_TEAM', 'ADMIN')` |
| **Manage Site Settings** | ❌ Forbidden | ❌ Forbidden | ✅ Full Authority | `auth.jwt() ->> 'role' = 'ADMIN'` |
| **Manage Users & Roles** | ❌ Forbidden | ❌ Forbidden | ✅ Full Authority | `auth.jwt() ->> 'role' = 'ADMIN'` |
| **View Audit Logs** | ❌ Forbidden | ❌ Forbidden | ✅ Read | `auth.jwt() ->> 'role' = 'ADMIN'` |
