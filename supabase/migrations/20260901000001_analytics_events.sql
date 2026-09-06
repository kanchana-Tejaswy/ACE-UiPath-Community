-- ACE UiPath Community Digital Operating System
-- Migration 20260901000001_analytics_events.sql
-- Product Analytics, Activity Telemetry & Engagement Intelligence

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  anonymous_session_id TEXT,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient analytics querying
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_entity ON analytics_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- 1. Anyone (authenticated or anonymous session) can insert telemetry events
DROP POLICY IF EXISTS "Public & authenticated telemetry insert" ON analytics_events;
CREATE POLICY "Public & authenticated telemetry insert" ON analytics_events
  FOR INSERT
  WITH CHECK (true);

-- 2. Only Admins can read full analytics events
DROP POLICY IF EXISTS "Admins select analytics events" ON analytics_events;
CREATE POLICY "Admins select analytics events" ON analytics_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'ADMIN' AND u.status = 'ACTIVE'
    )
  );
