# 34 — Supabase Setup & Production Infrastructure Guide

**Product**: ACE UiPath Community Digital Operating System  
**Engine**: Managed PostgreSQL, Supabase Auth & Storage  
**Status**: Step-by-Step Production Configuration Runbook  

---

## 1. Creating the Supabase Project

1. Log into [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project** and select your organization.
3. **Project Name**: `ace-uipath-community`.
4. **Database Password**: Set a high-entropy secret password and store it securely in a password manager.
5. **Region**: Select `ap-south-1 (Mumbai)` for minimal latency to ACE Engineering College.

---

## 2. Applying Database Migrations & Schemas

1. Navigate to **SQL Editor** in the Supabase Dashboard (`https://supabase.com/dashboard/project/<project-id>/sql`).
2. **Database Hardening**: Execute `supabase/migrations/20261025000000_phase1_database_security_remediation.sql` to apply all critical RLS protections, close open `projects`/`resources` UPDATE policies, prevent role self-promotion triggers, and shield student PII behind `public_user_profiles`.
3. **Storage Hardening**: Execute `supabase/migrations/20261025000001_phase1_storage_security_hardening.sql` to restrict storage buckets (`leadership-media`, `blog-media`, `activities-media`, `resources-files`, `user-avatars`, `challenge-submissions`), eliminate SVG MIME types to prevent Stored SVG XSS, and isolate user avatar folder mutations to respective account owners.
4. For a brand new project setup from scratch, executing `supabase/migrations/full_migration_and_seed.sql` includes the complete hardened relational schema, storage configurations, security triggers, and seed data in a single run.

---

## 3. Populating Initial Historical Seed Data

1. Open `supabase/seed.sql`.
2. Paste into the SQL Editor and click **RUN**.
3. Verify that the 2022–2026 activities, REFramework learning paths, grade extractor bot projects, and certification question banks appear in the Table Editor.

---

## 4. Configuring Client Environment Variables

In your deployment platform (Vercel Project Settings) and `.env.local`:
```text
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_UIPATH_ALLIANCE_ID=ACE-UIPATH-EDU-ALLIANCE-9421
```
