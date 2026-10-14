-- ==============================================================================
-- KrishiConnect — Migration 007: Security Hardening & Storage Alignment
--
-- Target: Supabase Project ppwkaaddtjommtesxxsc
--
-- Summary of Operations:
-- 1. Sets fixed search_path = public on trigger and utility functions.
-- 2. Revokes direct PostgREST RPC EXECUTE on trigger-only functions.
-- 3. Hardens ai_consultations INSERT policy to prevent anonymous user ID spoofing.
-- 4. Adds missing storage UPDATE policies for avatars, community, and marketplace.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Lock search_path on Functions with Mutable Search Paths
-- ------------------------------------------------------------------------------

-- 1.1 Timestamp trigger function
ALTER FUNCTION public.set_updated_at() SET search_path = public;

-- 1.2 Denormalized upvotes counter trigger function
ALTER FUNCTION public.sync_post_upvotes_count() SET search_path = public;

-- 1.3 Denormalized comments counter trigger function
ALTER FUNCTION public.sync_post_comments_count() SET search_path = public;


-- ------------------------------------------------------------------------------
-- 2. Revoke Direct PostgREST RPC Execution on Trigger Functions
-- (Triggers continue firing internally; is_admin remains executable by anon)
-- ------------------------------------------------------------------------------

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_post_upvotes_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_post_comments_count() FROM PUBLIC, anon, authenticated;


-- ------------------------------------------------------------------------------
-- 3. Harden AI Consultations INSERT Policy
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS "Authenticated users or server actions can insert AI consultations" ON public.ai_consultations;
CREATE POLICY "Authenticated users or server actions can insert AI consultations"
  ON public.ai_consultations FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );


-- ------------------------------------------------------------------------------
-- 4. Storage UPDATE (Overwrite) Policies
-- ------------------------------------------------------------------------------

-- 4.1 Avatars Bucket Update Policy
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- 4.2 Community Bucket Update Policy
DROP POLICY IF EXISTS "Users can update own community images" ON storage.objects;
CREATE POLICY "Users can update own community images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'community' 
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'community' 
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- 4.3 Marketplace Bucket Update Policy
DROP POLICY IF EXISTS "Sellers can update own marketplace images" ON storage.objects;
CREATE POLICY "Sellers can update own marketplace images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'marketplace' 
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'marketplace' 
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

COMMIT;
