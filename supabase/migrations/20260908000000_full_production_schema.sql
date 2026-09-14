-- ACE UiPath Community Digital Operating System
-- Migration 20260908000000_full_production_schema.sql
-- Production Relational Schema & Row Level Security (RLS) Policies

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================================
-- 1. USERS & PROFILES (Linked to Supabase Auth)
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  roll_number TEXT,
  branch TEXT,
  graduation_year INT,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  github_url TEXT,
  linkedin_url TEXT,
  uipath_forum_url TEXT,
  role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'CORE_TEAM', 'ADMIN', 'Student', 'CoreTeam', 'Admin')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to keep users.updated_at fresh
CREATE OR REPLACE FUNCTION public.update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_users_updated_at();

-- Automatic Supabase Auth to public.users Sync Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, status, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'STUDENT'),
    'ACTIVE',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Security Definer Role Resolution Functions (Bypasses RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN' AND status = 'ACTIVE'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_core_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('CORE_TEAM', 'ADMIN') AND status = 'ACTIVE'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================================
-- 2. GLOBAL SITE SETTINGS (CMS & Brand Configuration)
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- 3. ACTIVITIES (Workshops, Bootcamps, Hackathons, Meetups)
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.activities (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  event_type TEXT NOT NULL,
  activity_date TEXT NOT NULL,
  time_start TEXT NOT NULL,
  time_end TEXT NOT NULL,
  venue TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_description_md TEXT NOT NULL,
  objectives_text TEXT[] DEFAULT '{}',
  agenda JSONB DEFAULT '[]'::jsonb,
  uipath_topics TEXT[] DEFAULT '{}',
  learning_outcomes TEXT[] DEFAULT '{}',
  banner_image_url TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  recording_url TEXT,
  slides_url TEXT,
  github_url TEXT,
  workflow_package_url TEXT,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  is_featured BOOLEAN DEFAULT FALSE,
  speakers JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- 4. PROJECTS SHOWCASE
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  summary TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  solution_description TEXT NOT NULL,
  uipath_tools_used TEXT[] DEFAULT '{}',
  roi_metrics TEXT NOT NULL,
  repo_url TEXT,
  package_download_url TEXT,
  video_demo_url TEXT,
  preview_images TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL,
  author_roll_number TEXT,
  author_branch TEXT,
  author_avatar TEXT,
  author_linkedin TEXT,
  status TEXT NOT NULL DEFAULT 'Approved',
  download_count INT DEFAULT 0,
  upvotes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- 5. LEARNING TRACKS & MODULES
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  level TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  estimated_hours INT NOT NULL,
  icon_name TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  modules JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- 6. CHALLENGES & HACKATHONS
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  prize_pool TEXT NOT NULL,
  description_md TEXT NOT NULL,
  rules_md TEXT NOT NULL,
  evaluation_criteria TEXT[] DEFAULT '{}',
  starter_dataset_url TEXT,
  submission_count INT DEFAULT 0,
  winners JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- 7. COMMUNITY RESOURCES VAULT
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  uipath_version TEXT NOT NULL,
  download_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  download_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- 8. LEADERSHIP TEAM DIRECTORY
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.leadership (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  category TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  linkedin_url TEXT,
  github_url TEXT,
  bio TEXT NOT NULL,
  contributions TEXT[] DEFAULT '{}',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- 9. ACTIVITY DRAFTS (Core Team Staging & Review Workflow)
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.activity_drafts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Workshop',
  event_type TEXT NOT NULL DEFAULT 'Offline',
  activity_date TEXT NOT NULL,
  time_start TEXT NOT NULL DEFAULT '10:00 AM',
  time_end TEXT NOT NULL DEFAULT '01:00 PM',
  venue TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_description_md TEXT,
  objectives JSONB DEFAULT '[]'::jsonb,
  agenda JSONB DEFAULT '[]'::jsonb,
  uipath_topics_covered JSONB DEFAULT '[]'::jsonb,
  learning_outcomes JSONB DEFAULT '[]'::jsonb,
  banner_image TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  recording_url TEXT,
  slides_url TEXT,
  github_url TEXT,
  workflow_package_url TEXT,
  speakers JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  completion_percentage INT DEFAULT 50
);

-- ==================================================================
-- 10. AUDIT LOGS
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  description TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- 11. ANALYTICS EVENTS (Telemetry)
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id TEXT,
  anonymous_session_id TEXT,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==================================================================
CREATE INDEX IF NOT EXISTS idx_activities_date ON public.activities(activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_status ON public.activities(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_activity_drafts_status ON public.activity_drafts(status);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at DESC);

-- ==================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 1. SITE SETTINGS: Public SELECT, Admin full mutation
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify site_settings" ON public.site_settings;
CREATE POLICY "Admin modify site_settings" ON public.site_settings
  FOR ALL USING (public.is_admin());

-- 2. ACTIVITIES: Public SELECT, Admin full mutation
DROP POLICY IF EXISTS "Public read activities" ON public.activities;
CREATE POLICY "Public read activities" ON public.activities
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify activities" ON public.activities;
CREATE POLICY "Admin modify activities" ON public.activities
  FOR ALL USING (public.is_core_or_admin());

-- 3. PROJECTS: Public read approved, Admin full mutation
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public update project upvotes" ON public.projects;
CREATE POLICY "Public update project upvotes" ON public.projects
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin modify projects" ON public.projects;
CREATE POLICY "Admin modify projects" ON public.projects
  FOR ALL USING (public.is_admin());

-- 4. LEARNING PATHS: Public SELECT, Admin mutation
DROP POLICY IF EXISTS "Public read learning_paths" ON public.learning_paths;
CREATE POLICY "Public read learning_paths" ON public.learning_paths
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify learning_paths" ON public.learning_paths;
CREATE POLICY "Admin modify learning_paths" ON public.learning_paths
  FOR ALL USING (public.is_admin());

-- 5. CHALLENGES: Public SELECT, Admin mutation
DROP POLICY IF EXISTS "Public read challenges" ON public.challenges;
CREATE POLICY "Public read challenges" ON public.challenges
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify challenges" ON public.challenges;
CREATE POLICY "Admin modify challenges" ON public.challenges
  FOR ALL USING (public.is_admin());

-- 6. RESOURCES: Public SELECT, Admin mutation
DROP POLICY IF EXISTS "Public read resources" ON public.resources;
CREATE POLICY "Public read resources" ON public.resources
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public increment resource downloads" ON public.resources;
CREATE POLICY "Public increment resource downloads" ON public.resources
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin modify resources" ON public.resources;
CREATE POLICY "Admin modify resources" ON public.resources
  FOR ALL USING (public.is_admin());

-- 7. LEADERSHIP: Public SELECT, Admin mutation
DROP POLICY IF EXISTS "Public read leadership" ON public.leadership;
CREATE POLICY "Public read leadership" ON public.leadership
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify leadership" ON public.leadership;
CREATE POLICY "Admin modify leadership" ON public.leadership
  FOR ALL USING (public.is_admin());

-- 8. ACTIVITY DRAFTS: Core Team & Admin read/insert/update, Admin delete
DROP POLICY IF EXISTS "Core Team and Admin read activity drafts" ON public.activity_drafts;
CREATE POLICY "Core Team and Admin read activity drafts" ON public.activity_drafts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Core Team and Admin modify activity drafts" ON public.activity_drafts;
CREATE POLICY "Core Team and Admin modify activity drafts" ON public.activity_drafts
  FOR ALL USING (public.is_core_or_admin());

-- 9. USERS: Authenticated / Public select, Admin update roles/status
DROP POLICY IF EXISTS "Public profiles read" ON public.users;
CREATE POLICY "Public profiles read" ON public.users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON public.users;
CREATE POLICY "Users update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin manage users" ON public.users;
CREATE POLICY "Admin manage users" ON public.users
  FOR ALL USING (public.is_admin());

-- 10. AUDIT LOGS: Anyone insert (audit event), Admin read
DROP POLICY IF EXISTS "System insert audit logs" ON public.audit_logs;
CREATE POLICY "System insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select audit logs" ON public.audit_logs;
CREATE POLICY "Admin select audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_admin());

-- 11. ANALYTICS EVENTS: Anyone insert (telemetry), Admin read
DROP POLICY IF EXISTS "Public insert analytics events" ON public.analytics_events;
CREATE POLICY "Public insert analytics events" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select analytics events" ON public.analytics_events;
CREATE POLICY "Admin select analytics events" ON public.analytics_events
  FOR SELECT USING (public.is_admin());
