------------------------------------------------------------
-- CREATE WORKSPACE FUNCTION
------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_workspace(
    workspace_name TEXT,
    workspace_slug TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    current_user_id UUID;
    new_organization_id UUID;
BEGIN
    --------------------------------------------------------
    -- 1. Get authenticated user
    --------------------------------------------------------

    current_user_id := (SELECT auth.uid());

    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'You must be authenticated to create a workspace.';
    END IF;

    --------------------------------------------------------
    -- 2. Prevent duplicate onboarding
    --------------------------------------------------------

    IF EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = current_user_id
    ) THEN
        RAISE EXCEPTION 'User already has a workspace.';
    END IF;

    --------------------------------------------------------
    -- 3. Create organization
    --------------------------------------------------------

    INSERT INTO public.organizations (
        name,
        slug,
        owner_id
    )
    VALUES (
        trim(workspace_name),
        trim(workspace_slug),
        current_user_id
    )
    RETURNING id INTO new_organization_id;

    --------------------------------------------------------
    -- 4. Create owner profile
    --------------------------------------------------------

    INSERT INTO public.profiles (
        id,
        organization_id,
        full_name,
        email,
        role
    )
    SELECT
        current_user_id,
        new_organization_id,
        COALESCE(
            raw_user_meta_data->>'full_name',
            raw_user_meta_data->>'name',
            ''
        ),
        email,
        'admin'
    FROM auth.users
    WHERE id = current_user_id;

    --------------------------------------------------------
    -- 5. Return organization ID
    --------------------------------------------------------

    RETURN new_organization_id;
END;
$$;

------------------------------------------------------------
-- SECURITY
------------------------------------------------------------

REVOKE EXECUTE
ON FUNCTION public.create_workspace(TEXT, TEXT)
FROM PUBLIC;

REVOKE EXECUTE
ON FUNCTION public.create_workspace(TEXT, TEXT)
FROM anon;

GRANT EXECUTE
ON FUNCTION public.create_workspace(TEXT, TEXT)
TO authenticated;