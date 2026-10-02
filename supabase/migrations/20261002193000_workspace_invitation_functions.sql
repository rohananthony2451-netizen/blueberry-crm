------------------------------------------------------------
-- EVENTOS / EVENTIFY
-- WORKSPACE INVITATION FUNCTIONS
------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;
------------------------------------------------------------
-- 1. CREATE WORKSPACE INVITATION
------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_workspace_invitation(
    p_email TEXT,
    p_role TEXT DEFAULT 'staff'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$

DECLARE
    v_user_id UUID;
    v_organization_id UUID;
    v_role TEXT;
    v_email TEXT;
    v_existing_profile UUID;
    v_token TEXT;
    v_token_hash TEXT;
    v_invitation_id UUID;
    v_expires_at TIMESTAMPTZ;

BEGIN

    --------------------------------------------------------
    -- 1. Current authenticated user
    --------------------------------------------------------

    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'You must be authenticated.';
    END IF;


    --------------------------------------------------------
    -- 2. Resolve current user's organization
    --------------------------------------------------------

    SELECT
        organization_id,
        role
    INTO
        v_organization_id,
        v_role
    FROM public.profiles
    WHERE id = v_user_id;


    IF v_organization_id IS NULL THEN
        RAISE EXCEPTION 'No workspace found for the current user.';
    END IF;


    --------------------------------------------------------
    -- 3. Only admins can invite members
    --------------------------------------------------------

    IF v_role <> 'admin' THEN
        RAISE EXCEPTION 'Only workspace admins can invite members.';
    END IF;


    --------------------------------------------------------
    -- 4. Normalize input
    --------------------------------------------------------

    v_email := lower(trim(p_email));

    IF v_email = '' THEN
        RAISE EXCEPTION 'Email is required.';
    END IF;

    IF p_role IS NULL OR lower(trim(p_role)) <> 'staff' THEN
        RAISE EXCEPTION 'Only the staff role can be invited.';
    END IF;


    --------------------------------------------------------
    -- 5. Do not invite an existing workspace member
    --------------------------------------------------------

    SELECT id
    INTO v_existing_profile
    FROM public.profiles
    WHERE organization_id = v_organization_id
      AND lower(trim(email)) = v_email
    LIMIT 1;

    IF v_existing_profile IS NOT NULL THEN
        RAISE EXCEPTION 'This user is already a member of your workspace.';
    END IF;


    --------------------------------------------------------
    -- 6. Remove an older pending invitation
    --    for the same email/workspace
    --------------------------------------------------------

    DELETE FROM public.workspace_invitations
    WHERE organization_id = v_organization_id
      AND lower(trim(email)) = v_email
      AND accepted_at IS NULL;


    --------------------------------------------------------
    -- 7. Generate invitation token
    --------------------------------------------------------

    v_token := encode(gen_random_bytes(32), 'hex');

    v_token_hash := encode(
        digest(v_token, 'sha256'),
        'hex'
    );

    v_expires_at := now() + interval '7 days';


    --------------------------------------------------------
    -- 8. Create invitation
    --------------------------------------------------------

    INSERT INTO public.workspace_invitations (
        organization_id,
        email,
        role,
        token_hash,
        invited_by,
        expires_at
    )
    VALUES (
        v_organization_id,
        v_email,
        'staff',
        v_token_hash,
        v_user_id,
        v_expires_at
    )
    RETURNING id
    INTO v_invitation_id;


    --------------------------------------------------------
    -- 9. Return invitation information
    --------------------------------------------------------

    RETURN jsonb_build_object(
        'invitation_id', v_invitation_id,
        'email', v_email,
        'role', 'staff',
        'token', v_token,
        'expires_at', v_expires_at
    );

END;
$function$;


------------------------------------------------------------
-- SECURITY
------------------------------------------------------------

REVOKE ALL
ON FUNCTION public.create_workspace_invitation(TEXT, TEXT)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.create_workspace_invitation(TEXT, TEXT)
TO authenticated;


------------------------------------------------------------
-- 2. ACCEPT WORKSPACE INVITATION
------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.accept_workspace_invitation(
    p_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$

DECLARE
    v_user_id UUID;
    v_user_email TEXT;

    v_token_hash TEXT;

    v_invitation public.workspace_invitations%ROWTYPE;

    v_existing_profile public.profiles%ROWTYPE;

BEGIN

    --------------------------------------------------------
    -- 1. Current authenticated user
    --------------------------------------------------------

    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'You must be authenticated.';
    END IF;


    --------------------------------------------------------
    -- 2. Get authenticated user's email
    --------------------------------------------------------

    SELECT lower(trim(email))
    INTO v_user_email
    FROM auth.users
    WHERE id = v_user_id;


    IF v_user_email IS NULL OR v_user_email = '' THEN
        RAISE EXCEPTION 'Your account does not have a valid email address.';
    END IF;


    --------------------------------------------------------
    -- 3. Hash supplied invitation token
    --------------------------------------------------------

    v_token_hash := encode(
        digest(trim(p_token), 'sha256'),
        'hex'
    );


    --------------------------------------------------------
    -- 4. Find invitation
    --------------------------------------------------------

    SELECT *
    INTO v_invitation
    FROM public.workspace_invitations
    WHERE token_hash = v_token_hash
    FOR UPDATE;


    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invitation is invalid or no longer exists.';
    END IF;


    --------------------------------------------------------
    -- 5. Check invitation status
    --------------------------------------------------------

    IF v_invitation.accepted_at IS NOT NULL THEN
        RAISE EXCEPTION 'This invitation has already been accepted.';
    END IF;


    --------------------------------------------------------
    -- 6. Check expiration
    --------------------------------------------------------

    IF v_invitation.expires_at <= now() THEN
        RAISE EXCEPTION 'This invitation has expired.';
    END IF;


    --------------------------------------------------------
    -- 7. Verify invited email
    --------------------------------------------------------

    IF lower(trim(v_invitation.email)) <> v_user_email THEN
        RAISE EXCEPTION
            'This invitation was sent to a different email address.';
    END IF;


    --------------------------------------------------------
    -- 8. Check whether the user already has a profile
    --------------------------------------------------------

    SELECT *
    INTO v_existing_profile
    FROM public.profiles
    WHERE id = v_user_id
    FOR UPDATE;


    IF FOUND THEN

        IF v_existing_profile.organization_id IS NOT NULL THEN
            RAISE EXCEPTION
                'Your account already belongs to a workspace.';
        END IF;

    END IF;


    --------------------------------------------------------
    -- 9. Create workspace membership
    --------------------------------------------------------

    IF FOUND THEN

        UPDATE public.profiles
        SET
            organization_id = v_invitation.organization_id,
            role = v_invitation.role
        WHERE id = v_user_id;

    ELSE

        INSERT INTO public.profiles (
            id,
            organization_id,
            full_name,
            email,
            role
        )
        SELECT
            v_user_id,
            v_invitation.organization_id,
            COALESCE(
                raw_user_meta_data->>'full_name',
                raw_user_meta_data->>'name',
                ''
            ),
            email,
            v_invitation.role
        FROM auth.users
        WHERE id = v_user_id;

    END IF;


    --------------------------------------------------------
    -- 10. Mark invitation accepted
    --------------------------------------------------------

    UPDATE public.workspace_invitations
    SET accepted_at = now()
    WHERE id = v_invitation.id;


    --------------------------------------------------------
    -- 11. Return membership information
    --------------------------------------------------------

    RETURN jsonb_build_object(
        'organization_id', v_invitation.organization_id,
        'role', v_invitation.role,
        'status', 'accepted'
    );

END;
$function$;


------------------------------------------------------------
-- SECURITY
------------------------------------------------------------

REVOKE ALL
ON FUNCTION public.accept_workspace_invitation(TEXT)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.accept_workspace_invitation(TEXT)
TO authenticated;