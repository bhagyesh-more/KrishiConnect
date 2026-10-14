-- ==============================================================================
-- Migration 006: Storage Buckets, AI Assistant Audits & Integration Policies
-- Description:
--   1. Defines storage buckets for profiles, community posts, and marketplace.
--   2. Enforces storage access policies (size, mime type, owner update/delete).
--   3. Defines agricultural AI audit log and safety classification table.
--   4. Configures RLS policies and indexes for AI conversations.
-- ==============================================================================

-- 1. Storage Buckets Configuration (via storage.buckets table in Supabase)
-- Note: ON CONFLICT DO NOTHING ensures idempotent execution on existing instances.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('community', 'community', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('marketplace', 'marketplace', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies for 'avatars' bucket
DROP POLICY IF EXISTS "Public can view avatar images" ON storage.objects;
CREATE POLICY "Public can view avatar images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload own avatar" ON storage.objects;
CREATE POLICY "Authenticated users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update or delete own avatar" ON storage.objects;
CREATE POLICY "Users can update or delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Policies for 'community' bucket
DROP POLICY IF EXISTS "Public can view community images" ON storage.objects;
CREATE POLICY "Public can view community images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'community');

DROP POLICY IF EXISTS "Authenticated users can upload community images" ON storage.objects;
CREATE POLICY "Authenticated users can upload community images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'community'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own community images" ON storage.objects;
CREATE POLICY "Users can delete own community images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'community'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Policies for 'marketplace' bucket
DROP POLICY IF EXISTS "Public can view marketplace produce images" ON storage.objects;
CREATE POLICY "Public can view marketplace produce images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'marketplace');

DROP POLICY IF EXISTS "Authenticated sellers can upload marketplace images" ON storage.objects;
CREATE POLICY "Authenticated sellers can upload marketplace images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'marketplace'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Sellers can delete own marketplace images" ON storage.objects;
CREATE POLICY "Sellers can delete own marketplace images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'marketplace'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ==============================================================================
-- 2. AI Agricultural Consultation & Safety Audit Logs
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.ai_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  prompt_text TEXT NOT NULL,
  response_text TEXT NOT NULL,
  crop_context VARCHAR(100),
  district VARCHAR(100),
  language VARCHAR(10) DEFAULT 'mr',
  safety_warnings_triggered TEXT[] DEFAULT ARRAY[]::TEXT[],
  has_harmful_substance_flag BOOLEAN DEFAULT FALSE,
  is_mock_response BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance & auditing
CREATE INDEX IF NOT EXISTS idx_ai_consultations_user ON public.ai_consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_consultations_flag ON public.ai_consultations(has_harmful_substance_flag);
CREATE INDEX IF NOT EXISTS idx_ai_consultations_created_at ON public.ai_consultations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.ai_consultations ENABLE ROW LEVEL SECURITY;

-- AI Consultations RLS Policies
DROP POLICY IF EXISTS "Users can view own AI consultations" ON public.ai_consultations;
CREATE POLICY "Users can view own AI consultations"
  ON public.ai_consultations FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Authenticated users or server actions can insert AI consultations" ON public.ai_consultations;
CREATE POLICY "Authenticated users or server actions can insert AI consultations"
  ON public.ai_consultations FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR auth.uid() IS NULL
  );
