-- ACE UiPath Community Digital Operating System
-- Migration 20260831000001_storage_buckets.sql
-- Supabase Storage Buckets & Storage Security Policies

-- Insert Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('activities-media', 'activities-media', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'application/zip', 'application/x-zip-compressed']),
  ('resources-files', 'resources-files', true, 52428800, ARRAY['application/pdf', 'application/zip', 'application/x-zip-compressed', 'application/octet-stream']),
  ('project-artifacts', 'project-artifacts', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/zip', 'application/x-zip-compressed']),
  ('challenge-submissions', 'challenge-submissions', false, 52428800, ARRAY['application/zip', 'application/x-zip-compressed', 'application/pdf']),
  ('user-avatars', 'user-avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Read Policies
CREATE POLICY "Public read access on activities-media" ON storage.objects FOR SELECT USING (bucket_id = 'activities-media');
CREATE POLICY "Public read access on resources-files" ON storage.objects FOR SELECT USING (bucket_id = 'resources-files');
CREATE POLICY "Public read access on project-artifacts" ON storage.objects FOR SELECT USING (bucket_id = 'project-artifacts');
CREATE POLICY "Public read access on user-avatars" ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');

-- Storage Authenticated Upload Policies
CREATE POLICY "Authenticated users can upload to project-artifacts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-artifacts' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload to challenge-submissions" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'challenge-submissions' AND auth.role() = 'authenticated');
