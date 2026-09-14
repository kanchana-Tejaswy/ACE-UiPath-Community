-- ==================================================================
-- ACE UiPath Community — Complete Supabase Production Setup
-- (Schema + Security Policies + Production Seed Data)
-- 
-- Run this script in the Supabase Dashboard:
-- https://supabase.com/dashboard/project/ghspsvybzjamapdnjctj/sql
-- ==================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================================
-- 2. USERS & PROFILES TABLE (Linked with Supabase Auth)
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
-- 3. GLOBAL SITE SETTINGS TABLE
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================
-- 4. ACTIVITIES TABLE
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
-- 5. PROJECTS TABLE
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
-- 6. LEARNING PATHS TABLE
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
-- 7. CHALLENGES & HACKATHONS TABLE
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
-- 8. RESOURCES TABLE
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
-- 9. LEADERSHIP TABLE
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
-- 10. ACTIVITY DRAFTS TABLE
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
-- 11. AUDIT LOGS TABLE
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
-- 12. ANALYTICS EVENTS TABLE
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
-- INDEXES
-- ==================================================================
CREATE INDEX IF NOT EXISTS idx_activities_date ON public.activities(activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_status ON public.activities(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_activity_drafts_status ON public.activity_drafts(status);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at DESC);

-- ==================================================================
-- ROW LEVEL SECURITY (RLS)
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

-- Policies using SECURITY DEFINER role functions to prevent infinite recursion
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify site_settings" ON public.site_settings;
CREATE POLICY "Admin modify site_settings" ON public.site_settings FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read activities" ON public.activities;
CREATE POLICY "Public read activities" ON public.activities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify activities" ON public.activities;
CREATE POLICY "Admin modify activities" ON public.activities FOR ALL USING (public.is_core_or_admin());

DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public update project upvotes" ON public.projects;
CREATE POLICY "Public update project upvotes" ON public.projects FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin modify projects" ON public.projects;
CREATE POLICY "Admin modify projects" ON public.projects FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read learning_paths" ON public.learning_paths;
CREATE POLICY "Public read learning_paths" ON public.learning_paths FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify learning_paths" ON public.learning_paths;
CREATE POLICY "Admin modify learning_paths" ON public.learning_paths FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read challenges" ON public.challenges;
CREATE POLICY "Public read challenges" ON public.challenges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify challenges" ON public.challenges;
CREATE POLICY "Admin modify challenges" ON public.challenges FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read resources" ON public.resources;
CREATE POLICY "Public read resources" ON public.resources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public increment resource downloads" ON public.resources;
CREATE POLICY "Public increment resource downloads" ON public.resources FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin modify resources" ON public.resources;
CREATE POLICY "Admin modify resources" ON public.resources FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read leadership" ON public.leadership;
CREATE POLICY "Public read leadership" ON public.leadership FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify leadership" ON public.leadership;
CREATE POLICY "Admin modify leadership" ON public.leadership FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Core Team and Admin read activity drafts" ON public.activity_drafts;
CREATE POLICY "Core Team and Admin read activity drafts" ON public.activity_drafts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Core Team and Admin modify activity drafts" ON public.activity_drafts;
CREATE POLICY "Core Team and Admin modify activity drafts" ON public.activity_drafts FOR ALL USING (public.is_core_or_admin());

DROP POLICY IF EXISTS "Public profiles read" ON public.users;
CREATE POLICY "Public profiles read" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON public.users;
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin manage users" ON public.users;
CREATE POLICY "Admin manage users" ON public.users FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "System insert audit logs" ON public.audit_logs;
CREATE POLICY "System insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select audit logs" ON public.audit_logs;
CREATE POLICY "Admin select audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Public insert analytics events" ON public.analytics_events;
CREATE POLICY "Public insert analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select analytics events" ON public.analytics_events;
CREATE POLICY "Admin select analytics events" ON public.analytics_events FOR SELECT USING (public.is_admin());

-- ==================================================================
-- 13. SEED INITIAL DATA
-- ==================================================================
INSERT INTO public.site_settings (key, value_json) VALUES (
  'global_config',
  '{
    "heroHeading": "ACE UiPath Community",
    "heroTagline": "A student community at ACE Engineering College focused on learning, building and exploring automation.",
    "heroSubheadline": "Discover UiPath, master REFramework, deploy production software robots, participate in hackathons, and shape your career in Intelligent Automation.",
    "primaryCtaText": "Explore the Community",
    "primaryCtaLink": "activities",
    "secondaryCtaText": "Start Learning",
    "secondaryCtaLink": "learn",
    "announcementTicker": "🚀 Flagship Event: UiPath REFramework Masterclass 2026 scheduled for Sept 12, 2026. Registrations Open!",
    "isAnnouncementActive": true,
    "featuredActivityId": "act_1",
    "featuredProjectIds": ["proj_1", "proj_2"],
    "communityStoryHeading": "Built by Students, Powered by UiPath",
    "communityStoryText": "Founded in 2022 under the department of CSE & IT, the ACE UiPath Community started as a group of 15 students eager to automate routine campus processes. Today, it stands as one of the premier student automation hubs in the region.",
    "communityStoryHighlight": "Recognized by UiPath Academic Alliance with 450+ students trained and 38 software bots deployed across college administration.",
    "communityStoryImageUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    "communityEmail": "uipath.community@aceec.ac.in",
    "communityDiscordUrl": "https://discord.gg/ace-uipath",
    "communityWhatsappUrl": "https://chat.whatsapp.com/ace-uipath-official",
    "communityLinkedinUrl": "https://linkedin.com/company/ace-uipath-community",
    "communityGithubUrl": "https://github.com/ACE-UiPath-Community",
    "uipathAllianceId": "ACE-UIPATH-EDU-ALLIANCE-9421",
    "totalStudentsTrained": 950,
    "totalBotsBuilt": 140,
    "totalCertifications": 95,
    "totalHoursSaved": 3800,
    "statistics": [
      {
        "id": "s1",
        "title": "Students Trained",
        "value": "950+",
        "description": "Workshops across CSE, IT, ECE & allied branches",
        "visible": true,
        "order": 1
      },
      {
        "id": "s2",
        "title": "Automations Built",
        "value": "140+",
        "description": "Production-ready bots deployed for student and campus needs",
        "visible": true,
        "order": 2
      },
      {
        "id": "s3",
        "title": "UiPath Certifications",
        "value": "95+",
        "description": "Certified Associate & Specialist developers",
        "visible": true,
        "order": 3
      },
      {
        "id": "s4",
        "title": "Hours Automated",
        "value": "3,800+",
        "description": "Saved in academic grading and records handling",
        "visible": true,
        "order": 4
      }
    ],
    "announcements": [
      {
        "id": "ann_1",
        "title": "Flagship Masterclass 2026",
        "message": "UiPath REFramework Enterprise Masterclass registrations are now live! Limited 120 seats.",
        "date": "2026-09-01",
        "link": "#activity/reframework-enterprise-masterclass-2026",
        "isActive": true
      },
      {
        "id": "ann_2",
        "title": "UiPath Certification Voucher Drive",
        "message": "UiPath Academic Alliance 50% certification discount vouchers distributed to 25 merit students.",
        "date": "2026-08-15",
        "isActive": true
      }
    ],
    "timelineMilestones": [
      {
        "id": "tm_1",
        "year": "2022",
        "title": "Community Inception & UiPath Alliance Partnership",
        "category": "Founding",
        "description": "ACE Engineering College formally partnered with the UiPath Academic Alliance. 15 founding students led by faculty advisors initiated the first StudioX citizen developer bootcamp.",
        "imageUrl": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
        "order": 1
      },
      {
        "id": "tm_2",
        "year": "2023",
        "title": "First 100 Certified Developers Milestone",
        "category": "Milestone",
        "description": "Over 100 students cleared official UiPath Certified Associate assessments. Community initiated the Student Bot Showcase repository.",
        "imageUrl": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
        "order": 2
      },
      {
        "id": "tm_3",
        "year": "2024",
        "title": "National Hackathon Accolades",
        "category": "Achievement",
        "description": "ACE student team won 2nd runner-up in national UiPath Automation Challenge for the Automated College Grade Extractor Bot.",
        "imageUrl": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
        "order": 3
      },
      {
        "id": "tm_4",
        "year": "2025",
        "title": "Launch of AI Center & Document Understanding Labs",
        "category": "Innovation",
        "description": "Set up dedicated intelligent document processing sandbox environments for students exploring Machine Learning Extractors.",
        "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        "order": 4
      },
      {
        "id": "tm_5",
        "year": "2026",
        "title": "Digital Operating System & Cloud Ecosystem Launch",
        "category": "Transformation",
        "description": "Rolled out the comprehensive ACE UiPath Community Digital Operating System, empowering real-time learning, draft reviews, and open-source packages.",
        "imageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "order": 5
      }
    ]
  }'::jsonb
) ON CONFLICT (key) DO UPDATE SET value_json = EXCLUDED.value_json, updated_at = NOW();

INSERT INTO public.activities (
  id, slug, title, category, event_type, activity_date, time_start, time_end, venue,
  summary, full_description_md, objectives_text, agenda, uipath_topics, learning_outcomes,
  banner_image_url, gallery_images, recording_url, slides_url, github_url, workflow_package_url,
  status, is_featured, speakers, achievements
) VALUES
(
  'act_1',
  'reframework-enterprise-masterclass-2026',
  'Robotic Enterprise Framework (REFramework) Deep-Dive Masterclass',
  'Workshop',
  'Hybrid',
  '2026-09-12',
  '10:00 AM',
  '04:30 PM',
  'Seminar Hall 3 & Zoom Live Stream',
  'An intensive hands-on bootcamp mastering UiPath State Machines, Transactional Processing, Config.xlsx, Orchestrator Queues, and Auto-Recovery Exception Handling.',
  '# REFramework Enterprise Masterclass 2026\n\nJoin the ACE UiPath Community for a comprehensive architectural deep-dive into the Robotic Enterprise Framework (REFramework).\n\n### What You Will Build\nParticipants will build an enterprise-grade automated invoice reconciliation dispatcher and performer robot using UiPath Studio 2024.x and Orchestrator Queues.',
  ARRAY['Master REFramework State Machine Architecture', 'Configure Orchestrator Queue Dispatcher and Performer bots', 'Implement Business Rule Exceptions vs System Exceptions'],
  '[
    {"time": "10:00 AM - 11:30 AM", "title": "REFramework State Machine Fundamentals & Init State", "speaker": "Tejaswy Kanchana"},
    {"time": "11:45 AM - 01:15 PM", "title": "Orchestrator Queues, Transaction Items & Dispatcher Pattern", "speaker": "Priya Sharma"},
    {"time": "02:00 PM - 03:30 PM", "title": "Hands-on Lab: Config.xlsx, System vs Business Exceptions", "speaker": "Tejaswy Kanchana"},
    {"time": "03:45 PM - 04:30 PM", "title": "Code Review, Testing Checklist & Live Q&A", "speaker": "Dr. K. Srinivas"}
  ]'::jsonb,
  ARRAY['UiPath Studio 2024.x', 'REFramework', 'Orchestrator Queues', 'State Machines', 'JSON/Excel Config'],
  ARRAY['Ability to build enterprise-grade transactional bots', 'Deep understanding of Init, Get Transaction, Process, and End Process states'],
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'https://youtube.com/watch?v=reframework-masterclass-demo',
  'https://slideshare.net/ace-uipath/reframework-2026',
  'https://github.com/ACE-UiPath-Community/REFramework-Masterclass-2026',
  'https://github.com/ACE-UiPath-Community/REFramework-Masterclass-2026/releases/download/v1.0/REFramework_Starter.zip',
  'Upcoming',
  true,
  '[
    {
      "id": "spk_1",
      "name": "Tejaswy Kanchana",
      "roleTitle": "UiPath Certified Professional & Community Lead",
      "organization": "ACE Engineering College",
      "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      "linkedinUrl": "https://linkedin.com/in/tejaswy-kanchana",
      "bio": "Lead architect and mentor for enterprise automation initiatives with 4+ years UiPath hands-on experience."
    }
  ]'::jsonb,
  '[]'::jsonb
),
(
  'act_2',
  'document-understanding-ai-hackathon-2025',
  'Intelligent Document Understanding AI Hackathon 2025',
  'Hackathon',
  'Offline',
  '2025-11-20',
  '09:00 AM',
  '06:00 PM',
  'ACE Innovation & Incubation Center',
  'A 24-hour hackathon where 18 student teams engineered automated invoice extraction and resume parsing workflows using UiPath AI Center and DU ML Extractors.',
  '# Intelligent Document Understanding AI Hackathon 2025\n\nStudents built end-to-end intelligent document processing pipelines using UiPath Document Understanding and ML Extractors.',
  ARRAY['Train ML models in UiPath AI Center', 'Configure Action Center for Human-in-the-loop validation'],
  '[]'::jsonb,
  ARRAY['UiPath AI Center', 'Document Understanding', 'Action Center', 'Form Extractors'],
  ARRAY['18 Production-ready IDP bots deployed', '3 Teams fast-tracked to national UiPath competition'],
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'https://youtube.com/watch?v=du-hackathon-2025',
  'https://slideshare.net/ace-uipath/du-hackathon-slides',
  'https://github.com/ACE-UiPath-Community/DU-Hackathon-2025',
  'https://github.com/ACE-UiPath-Community/DU-Hackathon-2025/releases/download/v1.0/DU_Starter_Kit.zip',
  'Completed',
  false,
  '[]'::jsonb,
  '[
    {
      "id": "ach_1",
      "title": "First Place Winner",
      "recipientName": "Team DocuParse (CSE 3rd Year)",
      "badgeType": "First Place",
      "description": "Engineered a multi-format invoice extractor with 98.4% extraction accuracy across unstructured tables."
    }
  ]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  full_description_md = EXCLUDED.full_description_md,
  agenda = EXCLUDED.agenda,
  speakers = EXCLUDED.speakers,
  updated_at = NOW();

INSERT INTO public.projects (
  id, slug, title, tagline, summary, problem_statement, solution_description,
  uipath_tools_used, roi_metrics, repo_url, package_download_url, author_name,
  author_branch, status, upvotes, download_count
) VALUES
(
  'proj_1',
  'automated-college-grade-extractor-bot',
  'Automated College Exam Grade Extractor Bot',
  'Automated PDF Report Card Extraction & Student Notification Bot',
  'An enterprise UiPath bot built using Studio and REFramework that processes 850+ university PDF grade sheets, calculates SGPA/CGPA, and dispatches personalized WhatsApp/Email grade summaries.',
  'Manual grade sheet extraction for 800+ students took 45 faculty hours per semester with frequent manual calculation errors.',
  'Engineered a dual Dispatcher-Performer REFramework bot that reads raw university PDF gazettes, parses tabular data using Regex & Computer Vision, calculates CGPA, and logs results into Orchestrator Queues.',
  ARRAY['UiPath Studio', 'REFramework', 'PDF Automation', 'Orchestrator Queues', 'Mail Activities'],
  'Saves 45 hours per exam cycle; 100% calculation accuracy across 850 students',
  'https://github.com/ACE-UiPath-Community/Grade-Extractor-Bot',
  'https://github.com/ACE-UiPath-Community/Grade-Extractor-Bot/releases/download/v1.0/GradeExtractor.nupkg',
  'Kanchana Tejaswy',
  'CSE',
  'Featured',
  142,
  380
),
(
  'proj_2',
  'campus-library-book-rfid-reconciliation-bot',
  'Campus Library Book RFID Reconciliation Bot',
  'Automated Overdue Notice & Catalog Sync Bot',
  'A scheduled unattended robot that queries library Koha database tables, reconciles physical RFID return logs, and alerts students on upcoming return dates.',
  'Library staff spent 2.5 hours daily manually identifying overdue book borrowers and drafting individual email notices.',
  'Configured an unattended bot running via UiPath Orchestrator every night at 11 PM. It compares checkout records with RFID scanners and dispatches personalized reminders.',
  ARRAY['UiPath Studio', 'Database Activities', 'Orchestrator Triggers', 'Koha ILS'],
  'Eliminated 75 hours of repetitive monthly manual library clerical tasks',
  'https://github.com/ACE-UiPath-Community/Library-Reconciliation-Bot',
  'https://github.com/ACE-UiPath-Community/Library-Reconciliation-Bot/releases/download/v1.0/LibraryBot.zip',
  'Rahul Varma',
  'IT',
  'Approved',
  89,
  215
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  roi_metrics = EXCLUDED.roi_metrics,
  upvotes = EXCLUDED.upvotes,
  download_count = EXCLUDED.download_count;

INSERT INTO public.learning_paths (
  id, slug, title, tagline, level, target_audience, estimated_hours, icon_name, description, order_index, is_published, modules
) VALUES
(
  'path_1',
  'track-1-citizen-developer-studiox',
  'Track 1: Citizen Developer (StudioX)',
  'Zero-Code Automation for Excel, Web & Email',
  'Beginner',
  'All 1st & 2nd Year Students across all branches',
  8,
  'Zap',
  'Start your automation journey with UiPath StudioX. Learn to automate Excel spreadsheets, scrape web data, process PDFs, and automate Outlook emails without writing complex code.',
  1,
  true,
  '[
    {
      "id": "mod_1",
      "slug": "getting-started-studiox-installation",
      "title": "1. Getting Started with UiPath StudioX & Community Cloud",
      "summary": "Set up your free UiPath Automation Cloud account, configure StudioX in Community Edition, and understand citizen automation concepts.",
      "durationMinutes": 45,
      "level": "Beginner",
      "uipathTool": "StudioX",
      "contentMd": "# Getting Started with StudioX\n\nWelcome to your first step in Intelligent Automation!",
      "practiceExerciseMd": "Download sample student marks spreadsheet and create a robot to highlight distinction holders in green.",
      "orderIndex": 1
    }
  ]'::jsonb
),
(
  'path_2',
  'track-3-enterprise-reframework',
  'Track 3: Enterprise Automation Architect (REFramework)',
  'State Machines, Queue Processing & Auto-Recovery',
  'Advanced',
  '3rd & 4th Year CSE/IT Students',
  25,
  'Cpu',
  'Master the industry-standard Robotic Enterprise Framework (REFramework). Learn transactional processing, Orchestrator queue locks, business rule exception handling, and self-healing bots.',
  3,
  true,
  '[
    {
      "id": "mod_6",
      "slug": "reframework-architecture-state-machines",
      "title": "1. REFramework Architecture & State Machine Deep Dive",
      "summary": "Master the 4 states: Init, Get Transaction Data, Process Transaction, and End Process. Compare sequence workflows vs state machines.",
      "durationMinutes": 90,
      "level": "Advanced",
      "uipathTool": "Studio",
      "contentMd": "# REFramework Architecture Deep Dive\n\nRobotic Enterprise Framework is UiPath standard enterprise design template.",
      "practiceExerciseMd": "Open standard REFramework template in Studio 2024.x and configure Config.xlsx.",
      "orderIndex": 1
    }
  ]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  modules = EXCLUDED.modules;

INSERT INTO public.challenges (
  id, slug, title, theme, category, status, start_date, end_date, prize_pool,
  description_md, rules_md, evaluation_criteria, starter_dataset_url, submission_count
) VALUES
(
  'chal_1',
  'enterprise-invoice-automation-hackathon-2026',
  'Enterprise Invoice Automation Hackathon 2026',
  'Intelligent Document Extraction & Action Center Human-in-the-Loop',
  'Hackathon',
  'Active',
  '2026-09-01',
  '2026-09-30',
  '₹25,000 + UiPath Swag Kits',
  '# Enterprise Invoice Automation Hackathon 2026\n\nBuild an intelligent robot that parses 50 unstructured supplier invoices and reconciles them with an enterprise ERP ledger.',
  'Teams of 2-4 members. Must use UiPath Studio or StudioX. Workflow must include error handling and logging.',
  ARRAY['Extraction Accuracy (35%)', 'Exception Handling & Clean Code (25%)', 'Speed & Execution Efficiency (20%)', 'Video Demo & Documentation (20%)'],
  'https://github.com/ACE-UiPath-Community/Hackathon-Datasets/releases/download/v1/Invoices_50_Dataset.zip',
  14
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  theme = EXCLUDED.theme,
  status = EXCLUDED.status;

INSERT INTO public.resources (
  id, title, category, description, uipath_version, download_url, file_type, tags, download_count
) VALUES
(
  'res_1',
  'Enterprise REFramework Production Starter Template 2024.x',
  'Template',
  'Battle-tested REFramework boilerplate pre-configured with enhanced Config.xlsx, JSON logging, Teams webhook notification, and Orchestrator queue auto-retry.',
  '2024.10 LTS',
  'https://github.com/ACE-UiPath-Community/REFramework-Starter/archive/refs/heads/main.zip',
  'XAML',
  ARRAY['REFramework', 'Queues', 'Enterprise', 'Template'],
  420
),
(
  'res_2',
  'UiPath Associate Developer (UiARD) Exam Cheat Sheet',
  'Cheatsheet',
  'A condensed 6-page revision guide covering Selector tuning, Regex pattern anchors, Excel activity modern design vs classic, and State machine transitions.',
  '2024.x Compatible',
  'https://github.com/ACE-UiPath-Community/Exam-Cheatsheets/raw/main/UiARD_Exam_Cheatsheet.pdf',
  'PDF',
  ARRAY['Certification', 'Exam Prep', 'UiARD', 'Selectors'],
  850
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  download_count = EXCLUDED.download_count;

INSERT INTO public.leadership (
  id, name, role_title, category, academic_year, avatar_url, linkedin_url, github_url, bio, contributions, order_index
) VALUES
(
  'lead_1',
  'Dr. K. Srinivas Rao',
  'Faculty Advisor & Head of Center for Automation',
  'Faculty Advisor',
  '2022-2026',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://linkedin.com',
  'https://github.com',
  'Professor in CSE department pioneering RPA curriculum integration with UiPath Academic Alliance since 2022.',
  ARRAY['Established UiPath Academic Alliance at ACE', 'Mentored 450+ students through certification', 'Co-authored automation research papers'],
  1
),
(
  'lead_2',
  'Tejaswy Kanchana',
  'Community Lead & Student President',
  'Current Core Lead',
  '2025-2026',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://linkedin.com/in/tejaswy-kanchana',
  'https://github.com/tejaswy',
  'UiPath Certified Advanced Developer and final year CSE student directing workshops, projects, and hackathon teams.',
  ARRAY['Led architecture of ACE UiPath Community OS', 'Delivered 8 REFramework masterclasses', 'Engineered Grade Extractor Bot'],
  2
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role_title = EXCLUDED.role_title,
  bio = EXCLUDED.bio;

-- ==================================================================
-- 10. ARTICLES & TECHNICAL PUBLICATIONS
-- ==================================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'SCHEDULED')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT,
  updated_by TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_at ON public.articles(scheduled_at ASC);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON public.articles(is_featured);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published articles" ON public.articles;
CREATE POLICY "Public read published articles" ON public.articles
  FOR SELECT USING (
    status = 'PUBLISHED' OR 
    (status = 'SCHEDULED' AND scheduled_at <= NOW()) OR
    public.is_core_or_admin()
  );

DROP POLICY IF EXISTS "Public increment article views" ON public.articles;
CREATE POLICY "Public increment article views" ON public.articles
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Core and Admin modify articles" ON public.articles;
CREATE POLICY "Core and Admin modify articles" ON public.articles
  FOR ALL USING (public.is_core_or_admin());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('blog-media', 'blog-media', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read access on blog-media" ON storage.objects;
CREATE POLICY "Public read access on blog-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-media');

DROP POLICY IF EXISTS "Core and Admin upload to blog-media" ON storage.objects;
CREATE POLICY "Core and Admin upload to blog-media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-media' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));

INSERT INTO public.articles (
  id, slug, title, excerpt, content, cover_image, category, author_name, author_role, status, published_at, is_featured, views
) VALUES
(
  'art_1',
  'what-are-activities-in-uipath',
  'What Are Activities in UiPath? The Foundation of Workflow Automation',
  'A deep dive into UiPath activities, how they form the fundamental building blocks of workflow automation, and how to select the right activities for enterprise projects.',
  '# What Are Activities in UiPath?\n\nIn robotic process automation (RPA), **Activities** are the essential building blocks that perform individual discrete actions within a software workflow. From clicking a UI button to querying a SQL database, reading an Excel cell, or classifying an invoice with AI, everything in UiPath executes through an activity.',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  'Tutorial',
  'Tejaswy',
  'UiPath Student Developer Champion',
  'PUBLISHED',
  '2026-09-14T08:00:00.000Z',
  true,
  142
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  status = EXCLUDED.status;

