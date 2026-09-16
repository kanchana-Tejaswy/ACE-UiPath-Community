-- ACE UiPath Community Digital Operating System
-- Migration 20260916000001_leadership_media_storage.sql
-- Dedicated Supabase Storage Bucket & Policies for Leadership/Team Member Media

-- 1. Insert/Update leadership-media Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'leadership-media',
  'leadership-media',
  true,
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Public Read Policy
DROP POLICY IF EXISTS "Allow public select on leadership-media" ON storage.objects;
CREATE POLICY "Allow public select on leadership-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'leadership-media');

-- 3. Authenticated Insert/Upload Policy
DROP POLICY IF EXISTS "Allow authenticated uploads to leadership-media" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to leadership-media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'leadership-media' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  );

-- 4. Authenticated Update Policy
DROP POLICY IF EXISTS "Allow authenticated updates to leadership-media" ON storage.objects;
CREATE POLICY "Allow authenticated updates to leadership-media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'leadership-media' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  );

-- 5. Authenticated Delete Policy
DROP POLICY IF EXISTS "Allow authenticated deletes to leadership-media" ON storage.objects;
CREATE POLICY "Allow authenticated deletes to leadership-media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'leadership-media' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  );
