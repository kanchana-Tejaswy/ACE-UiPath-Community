# 04 — Authentication & Role-Based Access Control (RBAC)

**Product**: ACE UiPath Community Digital Operating System  
**Security Model**: Zero-Trust Server-Side RBAC + PostgreSQL Row-Level Security (RLS)  

---

## 1. Authentication Strategy

### 1.1 Guiding Principle
**Authentication must never be a wall.** The public student body can freely discover, learn, watch recordings, download `.xaml` files, and explore projects without logging in. Authentication is required only when an action demands verified identity or administrative authority.

### 1.2 Authentication Methods (Production)
1. **Student Login**: Google OAuth / College Student Email (`@aceec.ac.in`) or Magic Link (Passwordless) for frictionless project and challenge submissions.
2. **Core Team & Admin Login**: MFA-enabled OAuth or Secure Email/Password with HTTP-Only encrypted session cookies.

---

## 2. Role-Based Access Control (RBAC) Permission Matrix

| Capability / Resource | Public / Unauth Student | Logged-in Student | Core Team Member | System Administrator |
| :--- | :---: | :---: | :---: | :---: |
| **Browse Activity Timeline & Search** | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| **View Institutional Archive & Download .XAML** | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| **Access Learning Tracks & Lesson Tutorials** | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| **View Automations Vault & Upvote Bots** | ✅ Read | ✅ Read / Upvote | ✅ Read / Upvote | ✅ Read / Upvote |
| **Submit Bot for Showcase / Enter Hackathon** | ❌ (Prompts Login) | ✅ Create (Pending) | ✅ Create (Pending) | ✅ Create & Auto-Approve |
| **Apply for Membership / Core Team / Mentor** | ✅ Public Form | ✅ Public Form | ✅ Public Form | ✅ Review Applications |
| **Draft New Activity Record** | ❌ Forbidden | ❌ Forbidden | ✅ Create (Draft) | ✅ Full CRUD |
| **Attach Slides, Video Links & .XAML to Activity**| ❌ Forbidden | ❌ Forbidden | ✅ Update Media | ✅ Full CRUD |
| **Approve / Moderate Student Bot Submissions** | ❌ Forbidden | ❌ Forbidden | ✅ Approve | ✅ Full CRUD & Feature |
| **Publish / Archive Activities Globally** | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden | ✅ Full Authority |
| **Manage Learning Paths & Lesson Content** | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden | ✅ Full CRUD |
| **Edit Global Site Settings & Banners** | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden | ✅ Full Authority |
| **Export Database JSON & Restore Backups** | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden | ✅ Full Authority |

---

## 3. PostgreSQL Row-Level Security (RLS) Policies

```sql
-- 1. Activities Table: Public can read published/upcoming; Admin/Core can see drafts
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public activities are viewable by everyone" 
ON activities FOR SELECT 
USING (status IN ('Upcoming', 'Ongoing', 'Completed', 'Archived'));

CREATE POLICY "Admins have full CRUD on activities" 
ON activities FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Core Team can update activity media" 
ON activities FOR UPDATE 
TO authenticated 
USING (auth.jwt() ->> 'role' IN ('CORE_TEAM', 'ADMIN'));

-- 2. Projects Table: Public can read approved/featured; Authors can see own; Admin can moderate
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved projects are viewable by everyone" 
ON projects FOR SELECT 
USING (status IN ('Approved', 'Featured'));

CREATE POLICY "Students can insert projects" 
ON projects FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Admins can update project moderation status" 
ON projects FOR UPDATE 
TO authenticated 
USING (auth.jwt() ->> 'role' IN ('CORE_TEAM', 'ADMIN'));
```

---

## 4. Prototype vs. Production Security Reality

* **Prototype State**: The current `RoleSwitcherModal.tsx` simply changes a client-side React state variable. Anyone can open DevTools and set the role to `ADMIN`.
* **Production State**: All mutations will be validated on the server via cryptographic JWT / Session tokens checked by Next.js middleware and Postgres RLS.
