-- ACE UiPath Community Digital Operating System
-- Migration 20260831000000_initial_schema.sql
-- Production Relational Schema & Row Level Security (RLS) Policies

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================================
-- 1. IDENTITY & ROLES
-- ==================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  roll_number TEXT,
  branch TEXT,
  graduation_year INT,
  avatar_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL -- 'STUDENT', 'CORE_TEAM', 'ADMIN'
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Insert Default Roles
INSERT INTO roles (name) VALUES ('STUDENT'), ('CORE_TEAM'), ('ADMIN') ON CONFLICT (name) DO NOTHING;

-- ==================================================================
-- 2. ACTIVITIES & INSTITUTIONAL MEMORY
-- ==================================================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Workshop', 'Hackathon', 'Certification', 'Bootcamp', 'Guest Lecture')),
  event_type TEXT NOT NULL CHECK (event_type IN ('Offline', 'Online', 'Hybrid')),
  activity_date DATE NOT NULL,
  time_start TEXT NOT NULL,
  time_end TEXT NOT NULL,
  venue TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_description_md TEXT NOT NULL,
  objectives_text TEXT[] DEFAULT '{}',
  uipath_topics TEXT[] DEFAULT '{}',
  learning_outcomes TEXT[] DEFAULT '{}',
  banner_image_url TEXT NOT NULL,
  recording_url TEXT,
  slides_url TEXT,
  github_url TEXT,
  workflow_package_url TEXT,
  status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Completed', 'Archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  time_slot TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  speaker_name TEXT,
  order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  organization TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  linkedin_url TEXT,
  bio TEXT
);

CREATE TABLE IF NOT EXISTS activity_speakers (
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  speaker_id UUID REFERENCES speakers(id) ON DELETE RESTRICT,
  order_index INT DEFAULT 0,
  PRIMARY KEY (activity_id, speaker_id)
);

CREATE TABLE IF NOT EXISTS activity_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  roll_number TEXT,
  badge_type TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('IMAGE', 'VIDEO', 'DOCUMENT')),
  caption TEXT,
  storage_path TEXT,
  order_index INT DEFAULT 0
);

-- ==================================================================
-- 3. LEARNING ACADEMY
-- ==================================================================
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  level TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  estimated_hours INT NOT NULL,
  icon_name TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  level TEXT NOT NULL,
  uipath_tool TEXT NOT NULL,
  content_md TEXT NOT NULL,
  practice_exercise_md TEXT NOT NULL,
  starter_code_url TEXT,
  solution_code_url TEXT,
  order_index INT DEFAULT 0
);

-- ==================================================================
-- 4. PROJECTS & SHOWCASE
-- ==================================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_roll_number TEXT,
  author_branch TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Featured')),
  download_count INT DEFAULT 0,
  upvotes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- 5. CHALLENGES & HACKATHONS
-- ==================================================================
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Upcoming', 'Active', 'Judging', 'Completed')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  prize_pool TEXT NOT NULL,
  description_md TEXT NOT NULL,
  rules_md TEXT NOT NULL,
  evaluation_criteria TEXT[] DEFAULT '{}',
  starter_dataset_url TEXT,
  submission_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  team_name TEXT NOT NULL,
  team_members_text TEXT NOT NULL,
  project_title TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  video_demo_url TEXT NOT NULL,
  score NUMERIC(5,2),
  rank INT,
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- 6. RESOURCES, SETTINGS & AUDIT LOGS
-- ==================================================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Template', 'Cheatsheet', 'Exam Questions', 'Guide')),
  description TEXT NOT NULL,
  uipath_version TEXT NOT NULL,
  download_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  download_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  changes_json JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- 7. INDEXES FOR PERFORMANCE
-- ==================================================================
CREATE INDEX IF NOT EXISTS idx_activities_slug ON activities(slug);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_filters ON activities(category, event_type, status);
CREATE INDEX IF NOT EXISTS idx_learning_modules_path ON learning_modules(path_id, order_index);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);

-- ==================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (Unauthenticated Students / Visitors)
CREATE POLICY "Public activities viewable by everyone" ON activities FOR SELECT USING (status IN ('Upcoming', 'Ongoing', 'Completed', 'Archived'));
CREATE POLICY "Public activity agenda viewable by everyone" ON activity_agenda FOR SELECT USING (true);
CREATE POLICY "Public speakers viewable by everyone" ON speakers FOR SELECT USING (true);
CREATE POLICY "Public activity speakers viewable by everyone" ON activity_speakers FOR SELECT USING (true);
CREATE POLICY "Public achievements viewable by everyone" ON activity_achievements FOR SELECT USING (true);
CREATE POLICY "Public media viewable by everyone" ON activity_media FOR SELECT USING (true);
CREATE POLICY "Public learning paths viewable by everyone" ON learning_paths FOR SELECT USING (is_published = true);
CREATE POLICY "Public learning modules viewable by everyone" ON learning_modules FOR SELECT USING (true);
CREATE POLICY "Public approved projects viewable by everyone" ON projects FOR SELECT USING (status IN ('Approved', 'Featured'));
CREATE POLICY "Public challenges viewable by everyone" ON challenges FOR SELECT USING (true);
CREATE POLICY "Public resources viewable by everyone" ON resources FOR SELECT USING (true);
CREATE POLICY "Public site settings viewable by everyone" ON site_settings FOR SELECT USING (true);

-- AUTHENTICATED MUTATION POLICIES (Core Team & Admin)
CREATE POLICY "Authenticated users can submit projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can submit hackathons" ON challenge_submissions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ADMIN & CORE TEAM MUTATION POLICIES
CREATE POLICY "Admins full authority activities" ON activities FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    JOIN roles r ON ur.role_id = r.id 
    WHERE ur.user_id = auth.uid() AND r.name IN ('CORE_TEAM', 'ADMIN')
  )
);

CREATE POLICY "Admins full authority site_settings" ON site_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    JOIN roles r ON ur.role_id = r.id 
    WHERE ur.user_id = auth.uid() AND r.name = 'ADMIN'
  )
);
