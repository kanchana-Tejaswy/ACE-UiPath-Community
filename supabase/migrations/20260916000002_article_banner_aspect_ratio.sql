-- ACE UiPath Community Digital Operating System
-- Migration 20260916000002_article_banner_aspect_ratio.sql
-- Add aspect_ratio column to articles table with default 'default'

ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS aspect_ratio TEXT DEFAULT 'default' CHECK (aspect_ratio IN ('default', '21/9', '16/9', 'auto'));

-- Normalize existing article records to default
UPDATE public.articles 
SET aspect_ratio = 'default' 
WHERE aspect_ratio IS NULL;
