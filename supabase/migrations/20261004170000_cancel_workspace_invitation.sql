CREATE OR REPLACE FUNCTION public.cancel_workspace_invitation(
    p_invitation_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_organization_id UUID;
    v_role TEXT;
    v_deleted_id UUID;
BEGIN
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'You must be signed in.';
    END IF;

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

    IF v_role <> 'admin' THEN
        RAISE EXCEPTION
            'Only workspace admins can cancel invitations.';
    END IF;

    DELETE FROM public.workspace_invitations
    WHERE id = p_invitation_id
      AND organization_id = v_organization_id
      AND accepted_at IS NULL
    RETURNING id INTO v_deleted_id;

    IF v_deleted_id IS NULL THEN
        RAISE EXCEPTION
            'Pending invitation could not be found.';
    END IF;

    RETURN jsonb_build_object(
        'invitation_id', v_deleted_id,
        'status', 'cancelled'
    );
END;
$$;

REVOKE EXECUTE
ON FUNCTION public.cancel_workspace_invitation(UUID)
FROM PUBLIC;

REVOKE EXECUTE
ON FUNCTION public.cancel_workspace_invitation(UUID)
FROM anon;

GRANT EXECUTE
ON FUNCTION public.cancel_workspace_invitation(UUID)
TO authenticated;