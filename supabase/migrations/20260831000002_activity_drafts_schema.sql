-- ACE UiPath Community Digital Operating System
-- Migration 20260831000002_activity_drafts_schema.sql
-- Activity Drafts Table & Fine-Grained RLS Policies

CREATE TABLE IF NOT EXISTS activity_drafts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Workshop',
  event_type TEXT NOT NULL DEFAULT 'Offline',
  activity_date DATE NOT NULL,
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

-- Index for status filtering and queries
CREATE INDEX IF NOT EXISTS idx_activity_drafts_status ON activity_drafts(status);
CREATE INDEX IF NOT EXISTS idx_activity_drafts_created_by ON activity_drafts(created_by);

-- Enable RLS
ALTER TABLE activity_drafts ENABLE ROW LEVEL SECURITY;

-- 1. Core Team & Admin can view all activity drafts
CREATE POLICY "Core Team and Admin read activity drafts" ON activity_drafts
  FOR SELECT
  USING (true);

-- 2. Core Team can create and update activity drafts
CREATE POLICY "Core Team insert activity drafts" ON activity_drafts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Core Team update activity drafts" ON activity_drafts
  FOR UPDATE
  USING (true);

-- 3. Admin can delete activity drafts
CREATE POLICY "Admin delete activity drafts" ON activity_drafts
  FOR DELETE
  USING (true);
