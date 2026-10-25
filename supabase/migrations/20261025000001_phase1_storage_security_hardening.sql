-- ==============================================================================
-- ACE UiPath Community Digital Operating System
-- Migration: 20261025000001_phase1_storage_security_hardening.sql
-- Description: Storage Bucket Security Lockdown & Stored SVG XSS Elimination
-- Author: Senior Application Security Engineer
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. HARDEN STORAGE BUCKET DEFINITIONS & DISALLOW SVG MIME TYPES
-- ------------------------------------------------------------------------------
-- Disallowing image/svg+xml closes the Stored SVG XSS vector where executable 
-- JavaScript embedded in SVG payloads runs directly in browser context.

-- 1.1 leadership-media (Faculty & Leadership Portraits)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'leadership-media',
  'leadership-media',
  true,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 1.2 blog-media (Articles & Editorial Assets)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-media',
  'blog-media',
  true,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 1.3 activities-media (Event Banners & Presentation Materials)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'activities-media',
  'activities-media',
  true,
  52428800, -- 50MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'application/zip', 'application/x-zip-compressed']
)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 1.4 project-artifacts (Community Showcase Files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-artifacts',
  'project-artifacts',
  true,
  52428800, -- 50MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/zip', 'application/x-zip-compressed']
)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 1.5 user-avatars (Student Profile Photos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-avatars',
  'user-avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 1.6 challenge-submissions (Private Hackathon/Challenge Submissions)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'challenge-submissions',
  'challenge-submissions',
  false, -- Strictly Private
  52428800, -- 50MB
  ARRAY['application/zip', 'application/x-zip-compressed', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 1.7 resources-files (Downloadable PDF/ZIP Learning Assets)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resources-files',
  'resources-files',
  true,
  52428800, -- 50MB
  ARRAY['application/pdf', 'application/zip', 'application/x-zip-compressed', 'application/octet-stream']
)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------------------------
-- 2. HARDEN STORAGE ACCESS CONTROL POLICIES (storage.objects)
-- ------------------------------------------------------------------------------

-- 2.1 LEADERSHIP MEDIA POLICIES
-- Drop all legacy or insecure policies that permitted any authenticated user to modify/delete
DROP POLICY IF EXISTS "Allow public select on leadership-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to leadership-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to leadership-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes to leadership-media" ON storage.objects;
DROP POLICY IF EXISTS "leadership_media_public_read" ON storage.objects;
DROP POLICY IF EXISTS "leadership_media_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "leadership_media_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "leadership_media_admin_delete" ON storage.objects;

-- Public read access
CREATE POLICY "leadership_media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'leadership-media');

-- Only Administrator or Service Role can upload, update, or delete leadership media
CREATE POLICY "leadership_media_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'leadership-media' 
    AND (auth.role() = 'service_role' OR public.is_admin())
  );

CREATE POLICY "leadership_media_admin_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'leadership-media' 
    AND (auth.role() = 'service_role' OR public.is_admin())
  );

CREATE POLICY "leadership_media_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'leadership-media' 
    AND (auth.role() = 'service_role' OR public.is_admin())
  );

-- 2.2 BLOG MEDIA POLICIES
DROP POLICY IF EXISTS "Public read access on blog-media" ON storage.objects;
DROP POLICY IF EXISTS "Core and Admin upload to blog-media" ON storage.objects;
DROP POLICY IF EXISTS "Core and Admin update blog-media" ON storage.objects;
DROP POLICY IF EXISTS "Core and Admin delete blog-media" ON storage.objects;
DROP POLICY IF EXISTS "blog_media_public_read" ON storage.objects;
DROP POLICY IF EXISTS "blog_media_core_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "blog_media_core_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "blog_media_core_admin_delete" ON storage.objects;

CREATE POLICY "blog_media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-media');

CREATE POLICY "blog_media_core_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'blog-media' 
    AND (auth.role() = 'service_role' OR public.is_core_or_admin())
  );

CREATE POLICY "blog_media_core_admin_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'blog-media' 
    AND (auth.role() = 'service_role' OR public.is_core_or_admin())
  );

CREATE POLICY "blog_media_core_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'blog-media' 
    AND (auth.role() = 'service_role' OR public.is_core_or_admin())
  );

-- 2.3 ACTIVITIES MEDIA POLICIES
DROP POLICY IF EXISTS "Public read access on activities-media" ON storage.objects;
DROP POLICY IF EXISTS "activities_media_public_read" ON storage.objects;
DROP POLICY IF EXISTS "activities_media_core_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "activities_media_core_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "activities_media_core_admin_delete" ON storage.objects;

CREATE POLICY "activities_media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'activities-media');

CREATE POLICY "activities_media_core_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'activities-media' 
    AND (auth.role() = 'service_role' OR public.is_core_or_admin())
  );

CREATE POLICY "activities_media_core_admin_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'activities-media' 
    AND (auth.role() = 'service_role' OR public.is_core_or_admin())
  );

CREATE POLICY "activities_media_core_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'activities-media' 
    AND (auth.role() = 'service_role' OR public.is_core_or_admin())
  );

-- 2.4 RESOURCES FILES POLICIES
DROP POLICY IF EXISTS "Public read access on resources-files" ON storage.objects;
DROP POLICY IF EXISTS "resources_files_public_read" ON storage.objects;
DROP POLICY IF EXISTS "resources_files_core_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "resources_files_core_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "resources_files_core_admin_delete" ON storage.objects;

CREATE POLICY "resources_files_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'resources-files');

CREATE POLICY "resources_files_core_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resources-files' 
    AND (auth.role() = 'service_role' OR public.is_core_or_admin())
  );

CREATE POLICY "resources_files_core_admin_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'resources-files' 
    AND (auth.role() = 'service_role' OR public.is_core_or_admin())
  );

CREATE POLICY "resources_files_core_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'resources-files' 
    AND (auth.role() = 'service_role' OR public.is_core_or_admin())
  );

-- 2.5 USER AVATARS POLICIES (Enforce Path Isolation)
DROP POLICY IF EXISTS "Public read access on user-avatars" ON storage.objects;
DROP POLICY IF EXISTS "user_avatars_public_read" ON storage.objects;
DROP POLICY IF EXISTS "user_avatars_owner_insert" ON storage.objects;
DROP POLICY IF EXISTS "user_avatars_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "user_avatars_owner_delete" ON storage.objects;

CREATE POLICY "user_avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

-- Users may only upload/modify/delete in their own user folder: <user_id>/...
CREATE POLICY "user_avatars_owner_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars' 
    AND (
      auth.role() = 'service_role' 
      OR public.is_admin() 
      OR (
        auth.role() = 'authenticated' 
        AND (storage.foldername(name))[1] = auth.uid()::text
      )
    )
  );

CREATE POLICY "user_avatars_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-avatars' 
    AND (
      auth.role() = 'service_role' 
      OR public.is_admin() 
      OR (
        auth.role() = 'authenticated' 
        AND (storage.foldername(name))[1] = auth.uid()::text
      )
    )
  );

CREATE POLICY "user_avatars_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-avatars' 
    AND (
      auth.role() = 'service_role' 
      OR public.is_admin() 
      OR (
        auth.role() = 'authenticated' 
        AND (storage.foldername(name))[1] = auth.uid()::text
      )
    )
  );

-- 2.6 CHALLENGE SUBMISSIONS POLICIES (Strict Confidentiality)
DROP POLICY IF EXISTS "Authenticated users can upload to challenge-submissions" ON storage.objects;
DROP POLICY IF EXISTS "challenge_submissions_owner_select" ON storage.objects;
DROP POLICY IF EXISTS "challenge_submissions_owner_insert" ON storage.objects;
DROP POLICY IF EXISTS "challenge_submissions_admin_delete" ON storage.objects;

-- Only submitters (own folder) or Core/Admin can read challenge submissions
CREATE POLICY "challenge_submissions_owner_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'challenge-submissions' 
    AND (
      auth.role() = 'service_role' 
      OR public.is_core_or_admin() 
      OR (
        auth.role() = 'authenticated' 
        AND (storage.foldername(name))[1] = auth.uid()::text
      )
    )
  );

CREATE POLICY "challenge_submissions_owner_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'challenge-submissions' 
    AND (
      auth.role() = 'service_role' 
      OR (
        auth.role() = 'authenticated' 
        AND (storage.foldername(name))[1] = auth.uid()::text
      )
    )
  );

CREATE POLICY "challenge_submissions_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'challenge-submissions' 
    AND (auth.role() = 'service_role' OR public.is_admin())
  );
