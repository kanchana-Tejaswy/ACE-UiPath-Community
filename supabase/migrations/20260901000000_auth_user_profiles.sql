-- ACE UiPath Community Digital Operating System
-- Migration 20260901000000_auth_user_profiles.sql
-- Supabase Auth User Synchronization, Role Management & Account Status

-- 1. ADD ROLE, STATUS AND TIMESTAMPS TO USERS TABLE
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'CORE_TEAM', 'ADMIN'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create trigger function to keep updated_at current
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_users_updated_at();

-- 2. AUTOMATIC SUPABASE AUTH USER TO PUBLIC PROFILE SYNC
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

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. RLS POLICIES FOR USER PROFILES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can view user profiles
DROP POLICY IF EXISTS "Public profiles viewable by authenticated users" ON users;
CREATE POLICY "Public profiles viewable by authenticated users" ON users
  FOR SELECT USING (true);

-- Users can update their own profile fields except role & status
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins have full access to manage user profiles
DROP POLICY IF EXISTS "Admins full authority users" ON users;
CREATE POLICY "Admins full authority users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'ADMIN' AND u.status = 'ACTIVE'
    )
  );
