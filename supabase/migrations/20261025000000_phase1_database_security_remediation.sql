-- ====================================================================
-- ACE UiPath Community — Database Security Remediation (Phase 1)
-- Migration: 20261025000000_phase1_database_security_remediation.sql
-- Description:
--   1. Drops broad anonymous UPDATE policies on projects & resources;
--      installs atomic, validated SECURITY DEFINER RPCs for upvotes & downloads.
--   2. Prevents role & status self-promotion on public.users via BEFORE UPDATE
--      trigger, column-level grant revocation, and secure signup trigger.
--   3. Restricts public.users read access to authenticated self-reads and
--      admins; creates sanitized public_user_profiles view for public display.
--   4. Restricts audit_logs INSERT to admins/service_role; provides safe logging RPC.
-- ====================================================================

BEGIN;

-- ====================================================================
-- PART 1: ELIMINATE BROAD ANONYMOUS UPDATE ACCESS (PROJECTS & RESOURCES)
-- ====================================================================

-- 1. Drop open UPDATE policies on projects
DROP POLICY IF EXISTS "Public update project upvotes" ON public.projects;

-- 2. Drop open UPDATE policies on resources
DROP POLICY IF EXISTS "Public increment resource downloads" ON public.resources;

-- 3. Ensure legitimate administrative / core team mutation policies exist
DROP POLICY IF EXISTS "Admin modify projects" ON public.projects;
CREATE POLICY "Admin modify projects" ON public.projects
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin modify resources" ON public.resources;
CREATE POLICY "Admin modify resources" ON public.resources
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Atomic, validated RPC for project upvoting (Public / Rate-Safe)
CREATE OR REPLACE FUNCTION public.increment_project_upvote(target_project_id TEXT)
RETURNS INT AS $$
DECLARE
  new_upvotes INT;
BEGIN
  -- Verify project exists and is approved or featured
  IF NOT EXISTS (SELECT 1 FROM public.projects WHERE id = target_project_id) THEN
    RAISE EXCEPTION 'Target project not found';
  END IF;

  UPDATE public.projects
  SET upvotes = COALESCE(upvotes, 0) + 1
  WHERE id = target_project_id
  RETURNING upvotes INTO new_upvotes;

  RETURN COALESCE(new_upvotes, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public;

GRANT EXECUTE ON FUNCTION public.increment_project_upvote(TEXT) TO anon, authenticated, service_role;

-- 5. Atomic, validated RPC for resource download counter (Public / Safe)
CREATE OR REPLACE FUNCTION public.increment_resource_download(target_resource_id TEXT)
RETURNS INT AS $$
DECLARE
  new_downloads INT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.resources WHERE id = target_resource_id) THEN
    RAISE EXCEPTION 'Target resource not found';
  END IF;

  UPDATE public.resources
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = target_resource_id
  RETURNING download_count INTO new_downloads;

  RETURN COALESCE(new_downloads, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public;

GRANT EXECUTE ON FUNCTION public.increment_resource_download(TEXT) TO anon, authenticated, service_role;


-- ====================================================================
-- PART 2: PREVENT PRIVILEGE SELF-PROMOTION (USERS TABLE HARDENING)
-- ====================================================================

-- 1. Secure new user creation trigger: ALWAYS force STUDENT role regardless of metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, status, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'STUDENT', -- ALWAYS FORCED: Never trust client-supplied role metadata
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Trigger function preventing non-admins from changing role, status, id, or email
CREATE OR REPLACE FUNCTION public.protect_user_profile_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    -- Block role mutation
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Unauthorized: Users cannot modify their assigned role.';
    END IF;

    -- Block status mutation
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Unauthorized: Users cannot modify account activation status.';
    END IF;

    -- Block identity mutation
    IF NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'Prohibited: User ID is immutable.';
    END IF;

    -- Block email mutation in public profile (managed strictly via Supabase auth.users flow)
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

-- 3. Column-Level Grant Hardening: Revoke role and status updates from standard users
REVOKE UPDATE (role, status) ON public.users FROM anon, authenticated;

-- 4. Dedicated Administrator-Only RPC for user management
CREATE OR REPLACE FUNCTION public.admin_update_user_role(target_user_id UUID, new_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Administrator privileges required.';
  END IF;

  IF new_role NOT IN ('STUDENT', 'CORE_TEAM', 'ADMIN') THEN
    RAISE EXCEPTION 'Invalid role specified: %', new_role;
  END IF;

  UPDATE public.users
  SET role = new_role, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public, auth;

REVOKE EXECUTE ON FUNCTION public.admin_update_user_role(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_user_role(UUID, TEXT) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.admin_update_user_status(target_user_id UUID, new_status TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Administrator privileges required.';
  END IF;

  IF new_status NOT IN ('ACTIVE', 'INACTIVE') THEN
    RAISE EXCEPTION 'Invalid status specified: %', new_status;
  END IF;

  UPDATE public.users
  SET status = new_status, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public, auth;

REVOKE EXECUTE ON FUNCTION public.admin_update_user_status(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_user_status(UUID, TEXT) TO authenticated, service_role;


-- ====================================================================
-- PART 3: REMOVE PUBLIC EXPOSURE OF STUDENT PII (USERS TABLE RLS)
-- ====================================================================

-- 1. Drop broad SELECT policies on public.users
DROP POLICY IF EXISTS "Public profiles read" ON public.users;
DROP POLICY IF EXISTS "Public profiles viewable by authenticated users" ON public.users;
DROP POLICY IF EXISTS "Users update own profile" ON public.users;
DROP POLICY IF EXISTS "Admin manage users" ON public.users;
DROP POLICY IF EXISTS "Users read own profile" ON public.users;
DROP POLICY IF EXISTS "Users update own profile fields" ON public.users;
DROP POLICY IF EXISTS "Admins full access users" ON public.users;

-- 2. Authenticated users can ONLY view their own full profile row
CREATE POLICY "Users read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- 3. Authenticated users can update safe profile fields on their own row
CREATE POLICY "Users update own profile fields" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 4. Administrators have full visibility on public.users
CREATE POLICY "Admins full access users" ON public.users
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5. Create Sanitized Public Profile View (Excludes email and roll_number)
CREATE OR REPLACE VIEW public.public_user_profiles AS
  SELECT 
    id, 
    name, 
    avatar_url, 
    branch, 
    graduation_year, 
    role,
    github_url,
    linkedin_url,
    uipath_forum_url
  FROM public.users
  WHERE status = 'ACTIVE';

GRANT SELECT ON public.public_user_profiles TO anon, authenticated, service_role;


-- ====================================================================
-- PART 4: AUDIT LOGS SECURITY HARDENING
-- ====================================================================

-- 1. Drop open insert policy
DROP POLICY IF EXISTS "System insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Authorized insert audit logs" ON public.audit_logs;

-- 2. Restrict direct INSERT to admins and service_role
CREATE POLICY "Authorized insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR public.is_admin());

-- 3. Dedicated safe audit event logging function for client telemetry
CREATE OR REPLACE FUNCTION public.record_audit_event(
  p_action TEXT, 
  p_entity_type TEXT, 
  p_entity_id TEXT, 
  p_description TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    changes_json,
    created_at
  ) VALUES (
    auth.uid(),
    SUBSTRING(p_action FROM 1 FOR 64),
    SUBSTRING(p_entity_type FROM 1 FOR 64),
    SUBSTRING(p_entity_id FROM 1 FOR 128),
    jsonb_build_object('description', p_description, 'client_role', auth.role()),
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public, auth;

GRANT EXECUTE ON FUNCTION public.record_audit_event(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

COMMIT;
