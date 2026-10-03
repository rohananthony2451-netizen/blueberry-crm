-- ============================================================
-- Fix workspace invitation crypto function resolution
-- ============================================================
--
-- pgcrypto functions such as gen_random_bytes() and digest()
-- live in the extensions schema in Supabase.
--
-- The invitation RPCs use a restricted search_path, so make
-- the extensions schema available to those functions.
-- ============================================================

ALTER FUNCTION public.create_workspace_invitation(text, text)
SET search_path = extensions, public;

ALTER FUNCTION public.accept_workspace_invitation(text)
SET search_path = extensions, public;