
CREATE OR REPLACE FUNCTION public.set_staff_disabled(
    p_member_id UUID,
    p_disabled BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_actor_id UUID;
    v_organization_id UUID;
    v_actor_role TEXT;
    v_target_role TEXT;
    v_target_organization_id UUID;
    v_owner_id UUID;
BEGIN
    v_actor_id := (SELECT auth.uid());

    IF v_actor_id IS NULL THEN
        RAISE EXCEPTION 'You must be logged in.';
    END IF;

    IF p_member_id IS NULL OR p_disabled IS NULL THEN
        RAISE EXCEPTION 'A staff member and status are required.';
    END IF;

    SELECT p.organization_id, p.role
    INTO v_organization_id, v_actor_role
    FROM public.profiles AS p
    WHERE p.id = v_actor_id
      AND p.is_disabled = FALSE;

IF v_organization_id IS NULL
   OR v_actor_role IS DISTINCT FROM 'admin' THEN        RAISE EXCEPTION 'Only an active workspace admin can manage staff access.';
    END IF;

    IF p_member_id = v_actor_id THEN
        RAISE EXCEPTION 'You cannot change your own access status.';
    END IF;

    SELECT p.organization_id, p.role
    INTO v_target_organization_id, v_target_role
    FROM public.profiles AS p
    WHERE p.id = p_member_id
    FOR UPDATE;

    IF NOT FOUND
       OR v_target_organization_id IS DISTINCT FROM v_organization_id THEN
        RAISE EXCEPTION 'Staff member not found in your workspace.';
    END IF;

    IF v_target_role IS DISTINCT FROM 'staff' THEN
        RAISE EXCEPTION 'Only staff accounts can be disabled or re-enabled.';
    END IF;

    SELECT o.owner_id
    INTO v_owner_id
    FROM public.organizations AS o
    WHERE o.id = v_organization_id;

    IF v_owner_id = p_member_id THEN
        RAISE EXCEPTION 'The workspace owner cannot be disabled.';
    END IF;

    UPDATE public.profiles
    SET is_disabled = p_disabled
    WHERE id = p_member_id
      AND organization_id = v_organization_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'member_id', p_member_id,
        'is_disabled', p_disabled
    );
END;
$$;

REVOKE ALL ON FUNCTION public.set_staff_disabled(UUID, BOOLEAN)
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.set_staff_disabled(UUID, BOOLEAN)
TO authenticated;
