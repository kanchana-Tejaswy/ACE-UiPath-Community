-- ==================================================================
-- MIGRATION: 20260914000001_leadership_roster_upgrade.sql
-- UPGRADE TEAM & LEADERSHIP ROSTER SCHEMA WITH TENURE & PROFILES
-- ==================================================================

-- 1. ADD NEW COLUMNS TO public.leadership TABLE
ALTER TABLE public.leadership 
  ADD COLUMN IF NOT EXISTS start_year TEXT,
  ADD COLUMN IF NOT EXISTS end_year TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS uipath_profile_url TEXT;

-- 2. BACKFILL EXISTING RECORDS GRACEFULLY WITHOUT DATA LOSS
UPDATE public.leadership
SET 
  start_year = COALESCE(start_year, NULLIF(TRIM(split_part(academic_year, '-', 1)), '')),
  end_year = COALESCE(end_year, NULLIF(TRIM(split_part(academic_year, '-', 2)), '')),
  is_active = COALESCE(is_active, CASE WHEN category ILIKE '%alumni%' THEN FALSE ELSE TRUE END)
WHERE start_year IS NULL;

-- 3. ENSURE ROW LEVEL SECURITY IS MAINTAINED
ALTER TABLE public.leadership ENABLE ROW LEVEL SECURITY;

-- Public can read all leadership members
DROP POLICY IF EXISTS "Public read leadership" ON public.leadership;
CREATE POLICY "Public read leadership" ON public.leadership 
  FOR SELECT USING (true);

-- Admin and Core Team can modify leadership members
DROP POLICY IF EXISTS "Admin modify leadership" ON public.leadership;
CREATE POLICY "Admin modify leadership" ON public.leadership 
  FOR ALL USING (public.is_admin() OR public.is_core_or_admin());
