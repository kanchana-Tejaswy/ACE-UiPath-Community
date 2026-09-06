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

1. Navigate to **SQL Editor** in the Supabase Dashboard.
2. Open `supabase/migrations/20260831000000_initial_schema.sql`.
3. Paste the contents into the SQL Editor and click **RUN**.
4. Verify that all 14 tables (`users`, `roles`, `activities`, `learning_paths`, `projects`, `challenges`, `resources`, `site_settings`, `audit_logs`, etc.) are created with Row Level Security (RLS) enabled.
5. Open `supabase/migrations/20260831000001_storage_buckets.sql`, paste, and click **RUN** to create the 5 storage buckets (`activities-media`, `resources-files`, `project-artifacts`, `challenge-submissions`, `user-avatars`).

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
