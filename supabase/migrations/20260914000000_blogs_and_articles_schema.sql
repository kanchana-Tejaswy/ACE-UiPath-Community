-- ACE UiPath Community Digital Operating System
-- Migration 20260914000000_blogs_and_articles_schema.sql
-- Blogs & Technical Articles Relational Schema, RLS Security Policies & Media Storage

-- ==================================================================
-- 1. ARTICLES TABLE
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

-- ==================================================================
-- 2. INDEXES FOR PERFORMANCE & INTEGRITY
-- ==================================================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_at ON public.articles(scheduled_at ASC);

-- Enforce single featured article at database level:
-- 1. Partial unique index guaranteeing at most one row with is_featured = TRUE
DROP INDEX IF EXISTS idx_articles_is_featured;
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_featured_article ON public.articles(is_featured) WHERE is_featured = TRUE;

-- 2. Trigger automatically unfeaturing previous article when a new one is featured
CREATE OR REPLACE FUNCTION public.enforce_single_featured_article()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_featured = TRUE THEN
    UPDATE public.articles
    SET is_featured = FALSE
    WHERE id <> NEW.id AND is_featured = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public;

DROP TRIGGER IF EXISTS trg_enforce_single_featured_article ON public.articles;
CREATE TRIGGER trg_enforce_single_featured_article
  BEFORE INSERT OR UPDATE OF is_featured ON public.articles
  FOR EACH ROW
  WHEN (NEW.is_featured = TRUE)
  EXECUTE FUNCTION public.enforce_single_featured_article();

-- ==================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================================
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Row Level Security: Public can read published articles or scheduled articles whose scheduled time has passed
DROP POLICY IF EXISTS "Public read published articles" ON public.articles;
CREATE POLICY "Public read published articles" ON public.articles
  FOR SELECT USING (
    status = 'PUBLISHED' OR 
    (status = 'SCHEDULED' AND scheduled_at <= NOW()) OR
    public.is_core_or_admin()
  );

-- Drop any open update policy. Increments are handled securely via RPC
DROP POLICY IF EXISTS "Public increment article views" ON public.articles;

-- Admin and Core Team can insert, update, and delete articles
DROP POLICY IF EXISTS "Core and Admin modify articles" ON public.articles;
CREATE POLICY "Core and Admin modify articles" ON public.articles
  FOR ALL USING (public.is_core_or_admin());

-- Dedicated SECURITY DEFINER RPC to increment article views without permitting arbitrary UPDATEs
CREATE OR REPLACE FUNCTION public.increment_article_views(target_article_id TEXT)
RETURNS INT AS $$
DECLARE
  new_views INT;
BEGIN
  UPDATE public.articles
  SET views = COALESCE(views, 0) + 1
  WHERE id = target_article_id
  RETURNING views INTO new_views;
  RETURN COALESCE(new_views, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public;

GRANT EXECUTE ON FUNCTION public.increment_article_views(TEXT) TO anon, authenticated, service_role;

-- ==================================================================
-- 4. STORAGE BUCKET CONFIGURATION FOR ARTICLE MEDIA
-- ==================================================================
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
  FOR INSERT WITH CHECK (bucket_id = 'blog-media' AND (auth.role() = 'service_role' OR public.is_core_or_admin()));

DROP POLICY IF EXISTS "Core and Admin update blog-media" ON storage.objects;
CREATE POLICY "Core and Admin update blog-media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'blog-media' AND (auth.role() = 'service_role' OR public.is_core_or_admin()));

DROP POLICY IF EXISTS "Core and Admin delete blog-media" ON storage.objects;
CREATE POLICY "Core and Admin delete blog-media" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-media' AND (auth.role() = 'service_role' OR public.is_core_or_admin()));

