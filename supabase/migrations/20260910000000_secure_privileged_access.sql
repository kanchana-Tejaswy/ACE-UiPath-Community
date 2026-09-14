-- ==================================================================
-- ACE UiPath Community Digital Operating System
-- Migration: 20260910000000_secure_privileged_access.sql
-- Phase 3A: Dedicated Privileged Access Membership Tables & RLS Hardening
-- ==================================================================

-- 1. CREATE ADMIN MEMBERSHIP TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  notes TEXT,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_status ON public.admin_users(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- 2. CREATE CORE TEAM MEMBERSHIP TABLE
CREATE TABLE IF NOT EXISTS public.core_team_members (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  designation TEXT NOT NULL DEFAULT 'Core Team Member',
  department TEXT NOT NULL DEFAULT 'Community Operations',
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ALUMNI')),
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_core_team_members_status ON public.core_team_members(status);
CREATE INDEX IF NOT EXISTS idx_core_team_members_email ON public.core_team_members(email);

-- 3. SECURE AUTH TRIGGER: NEVER TRUST SIGNUP CLIENT METADATA FOR PRIVILEGES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, status, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'STUDENT', -- ALWAYS FORCED TO STUDENT: Never trust client-provided role metadata
    'ACTIVE',
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public, auth;

-- Ensure trigger is active on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. SECURE is_admin(): AUTHORIZATION FROM public.admin_users ONLY
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public, auth;

-- 5. SECURE is_core_or_admin(): CHECKS admin_users OR core_team_members
CREATE OR REPLACE FUNCTION public.is_core_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    ) OR
    EXISTS (
      SELECT 1 FROM public.core_team_members
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public, auth;

-- 6. ENABLE RLS AND ATTACH POLICIES FOR admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin view admin_users" ON public.admin_users;
CREATE POLICY "Admin view admin_users" ON public.admin_users
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admin mutate admin_users" ON public.admin_users;
CREATE POLICY "Admin mutate admin_users" ON public.admin_users
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 7. ENABLE RLS AND ATTACH POLICIES FOR core_team_members
ALTER TABLE public.core_team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read core_team_members" ON public.core_team_members;
CREATE POLICY "Public read core_team_members" ON public.core_team_members
  FOR SELECT USING (status = 'ACTIVE');

DROP POLICY IF EXISTS "Admin mutate core_team_members" ON public.core_team_members;
CREATE POLICY "Admin mutate core_team_members" ON public.core_team_members
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 8. HARDEN public.users: PREVENT USERS FROM ALTERING ROLE, STATUS, ID, OR EMAIL
CREATE OR REPLACE FUNCTION public.protect_user_profile_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    -- Non-admins cannot alter their role
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      NEW.role = OLD.role;
    END IF;
    -- Non-admins cannot alter account activation status
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      NEW.status = OLD.status;
    END IF;
    -- Non-admins cannot change their primary identity ID
    IF NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'Modifying user ID is prohibited.';
    END IF;
    -- Non-admins cannot change email directly in public profile (managed by auth.users)
    IF NEW.email IS DISTINCT FROM OLD.email THEN
      NEW.email = OLD.email;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public, auth;

DROP TRIGGER IF EXISTS trg_protect_user_profile ON public.users;
CREATE TRIGGER trg_protect_user_profile
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_user_profile_columns();

-- 9. REMOVE OPEN PROJECT UPDATE & IMPLEMENT RESTRICTED RPC
DROP POLICY IF EXISTS "Public update project upvotes" ON public.projects;

CREATE OR REPLACE FUNCTION public.increment_project_upvote(target_project_id TEXT)
RETURNS INT AS $$
DECLARE
  new_upvotes INT;
BEGIN
  UPDATE public.projects
  SET upvotes = COALESCE(upvotes, 0) + 1
  WHERE id = target_project_id
  RETURNING upvotes INTO new_upvotes;
  RETURN COALESCE(new_upvotes, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public;

GRANT EXECUTE ON FUNCTION public.increment_project_upvote(TEXT) TO anon, authenticated, service_role;

-- 10. REMOVE OPEN RESOURCE UPDATE & IMPLEMENT RESTRICTED RPC
DROP POLICY IF EXISTS "Public increment resource downloads" ON public.resources;

CREATE OR REPLACE FUNCTION public.increment_resource_download(target_resource_id TEXT)
RETURNS INT AS $$
DECLARE
  new_downloads INT;
BEGIN
  UPDATE public.resources
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = target_resource_id
  RETURNING download_count INTO new_downloads;
  RETURN COALESCE(new_downloads, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public;

GRANT EXECUTE ON FUNCTION public.increment_resource_download(TEXT) TO anon, authenticated, service_role;

-- 11. PROTECT ACTIVITY DRAFTS: RESTRICT READ ACCESS TO CORE TEAM & ADMIN ONLY
DROP POLICY IF EXISTS "Core Team and Admin read activity drafts" ON public.activity_drafts;
CREATE POLICY "Core Team and Admin read activity drafts" ON public.activity_drafts
  FOR SELECT USING (public.is_core_or_admin());

DROP POLICY IF EXISTS "Core Team and Admin modify activity drafts" ON public.activity_drafts;
CREATE POLICY "Core Team and Admin modify activity drafts" ON public.activity_drafts
  FOR ALL USING (public.is_core_or_admin()) WITH CHECK (public.is_core_or_admin());

-- 12. HARDEN AUDIT LOGS: PREVENT ANONYMOUS / ARBITRARY AUDIT LOG SPOOFING
DROP POLICY IF EXISTS "System insert audit logs" ON public.audit_logs;
CREATE POLICY "Authorized insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR public.is_admin());

-- ==================================================================
-- END OF MIGRATION 20260910000000_secure_privileged_access.sql
-- ==================================================================
