-- ==================================================================
-- MIGRATION: 20260916000000_multi_role_roster.sql
-- MULTI-ROLE ROSTER CATEGORIES UPGRADE
-- ==================================================================

-- 1. ADD roster_categories ARRAY COLUMN TO public.leadership IF NOT EXISTS
ALTER TABLE public.leadership 
  ADD COLUMN IF NOT EXISTS roster_categories TEXT[];

-- 2. BACKFILL EXISTING RECORDS GRACEFULLY WITHOUT DATA LOSS
UPDATE public.leadership
SET roster_categories = ARRAY[
  CASE 
    WHEN category = 'Faculty Advisor' THEN 'Faculty Advisor'
    WHEN category = 'Current Core Lead' THEN 'Core Team Member'
    WHEN category = 'Core Team Member' THEN 'Core Team Member'
    WHEN category = 'Technical Lead' THEN 'Trainer / Technical Lead'
    WHEN category = 'Trainer / Technical Lead' THEN 'Trainer / Technical Lead'
    WHEN category = 'Domain Lead' THEN 'Domain Lead'
    WHEN category = 'Student Developer Champion' THEN 'Student Developer Champion'
    WHEN category = 'Alumni' OR category = 'Alumni Mentor' THEN 'Alumni Mentor'
    WHEN category = 'Honorary Member' THEN 'Honorary Member'
    WHEN category = 'Community Lead' THEN 'Core Team Member'
    WHEN category IS NOT NULL AND TRIM(category) <> '' THEN category
    ELSE 'Core Team Member'
  END
]
WHERE roster_categories IS NULL OR cardinality(roster_categories) = 0;

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
