-- Native PostgreSQL DDL Migration for ACE UiPath Community REST API Gateway

-- 1. Users Table
CREATE TABLE IF NOT EXISTS custom_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  roll_number VARCHAR(100),
  branch VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Activities Table
CREATE TABLE IF NOT EXISTS custom_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  activity_date VARCHAR(50) NOT NULL,
  time_start VARCHAR(50),
  time_end VARCHAR(50),
  venue VARCHAR(255),
  summary TEXT NOT NULL,
  full_description_md TEXT,
  objectives_text TEXT[],
  uipath_topics TEXT[],
  learning_outcomes TEXT[],
  banner_image_url TEXT,
  recording_url TEXT,
  slides_url TEXT,
  github_url TEXT,
  workflow_package_url TEXT,
  status VARCHAR(50) DEFAULT 'Upcoming',
  is_featured BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects Showcase Table
CREATE TABLE IF NOT EXISTS custom_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  tagline TEXT,
  summary TEXT NOT NULL,
  problem_statement TEXT,
  solution_description TEXT,
  uipath_tools_used TEXT[],
  roi_metrics TEXT,
  repo_url TEXT,
  package_download_url TEXT,
  video_demo_url TEXT,
  author_name VARCHAR(255) NOT NULL,
  author_roll_number VARCHAR(100),
  author_branch VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Approved',
  upvotes INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Resources Table
CREATE TABLE IF NOT EXISTS custom_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  download_url TEXT NOT NULL,
  file_type VARCHAR(50),
  uipath_version VARCHAR(50),
  tags TEXT[],
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Activity Drafts Table
CREATE TABLE IF NOT EXISTS custom_activity_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  created_by_user_id UUID REFERENCES custom_users(id),
  created_by_name VARCHAR(255),
  review_notes TEXT,
  draft_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Analytics Events Table
CREATE TABLE IF NOT EXISTS custom_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  user_id UUID,
  user_role VARCHAR(50),
  entity_type VARCHAR(100),
  entity_id VARCHAR(255),
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_custom_users_email ON custom_users(email);
CREATE INDEX IF NOT EXISTS idx_custom_activities_slug ON custom_activities(slug);
CREATE INDEX IF NOT EXISTS idx_custom_projects_slug ON custom_projects(slug);
CREATE INDEX IF NOT EXISTS idx_custom_drafts_status ON custom_activity_drafts(status);
CREATE INDEX IF NOT EXISTS idx_custom_analytics_type ON custom_analytics_events(event_type);
