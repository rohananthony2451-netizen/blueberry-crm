
-- 1. Add a disabled flag. Existing users remain enabled.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_disabled BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Disabled users must not resolve to an organisation.
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
    SELECT p.organization_id
    FROM public.profiles AS p
    WHERE p.id = (SELECT auth.uid())
      AND p.is_disabled = FALSE
    LIMIT 1;
$$;

-- 3. Also reject disabled users in the profile membership helper.
CREATE OR REPLACE FUNCTION public.is_profile_in_user_organization(
    profile_id UUID
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles AS target
        WHERE target.id = profile_id
          AND target.organization_id =
              public.get_user_organization_id()
    );
$$;


-- Allows the session proxy to check only the current
-- user's disabled status without exposing profile data.
CREATE OR REPLACE FUNCTION public.is_current_user_disabled()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
    SELECT COALESCE(
        (
            SELECT p.is_disabled
            FROM public.profiles AS p
            WHERE p.id = (SELECT auth.uid())
            LIMIT 1
        ),
        FALSE
    );
$$;

REVOKE ALL ON FUNCTION public.is_current_user_disabled()
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.is_current_user_disabled()
TO authenticated;


-- Restrict workspace helper functions to authenticated users.
REVOKE ALL ON FUNCTION public.get_user_organization_id()
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_user_organization_id()
TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_profile_in_user_organization(UUID)
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.is_profile_in_user_organization(UUID)
TO authenticated, service_role;

-- Prevent users from changing their own disabled status directly.
-- The admin RPC can still update another staff member's status.
CREATE OR REPLACE FUNCTION public.prevent_self_disabled_flag_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF OLD.id = (SELECT auth.uid())
       AND NEW.is_disabled IS DISTINCT FROM OLD.is_disabled THEN
        RAISE EXCEPTION 'You cannot change your own access status.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_self_disabled_flag_change
ON public.profiles;

CREATE TRIGGER prevent_self_disabled_flag_change
BEFORE UPDATE OF is_disabled
ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_self_disabled_flag_change();