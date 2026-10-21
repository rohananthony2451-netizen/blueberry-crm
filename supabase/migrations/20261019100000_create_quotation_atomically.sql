
-- Create a quotation and all its items atomically.
-- If any insert fails, PostgreSQL rolls back the entire operation.

CREATE OR REPLACE FUNCTION public.create_quotation_atomically(
    p_payload jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
    v_org_id uuid;
    v_client_id uuid;
    v_lead_id uuid;
    v_quotation_id uuid;
    v_quotation_number text;

    v_subtotal numeric(12,2);
    v_discount numeric(12,2);
    v_tax numeric(12,2);
    v_total numeric(12,2);

    v_item jsonb;
    v_quantity numeric;
    v_unit_price numeric;
    v_amount numeric;
    v_description text;
BEGIN
    -- Require an authenticated user with a workspace.
    IF (SELECT auth.uid()) IS NULL THEN
        RAISE EXCEPTION 'Authentication is required.';
    END IF;

    v_org_id := public.get_user_organization_id();

    IF v_org_id IS NULL THEN
        RAISE EXCEPTION
            'No organization found for the current user.';
    END IF;

    -- Validate the request shape.
    IF p_payload IS NULL
       OR jsonb_typeof(p_payload) <> 'object' THEN
        RAISE EXCEPTION 'Invalid quotation data.';
    END IF;

    IF jsonb_typeof(p_payload->'items')
       IS DISTINCT FROM 'array' THEN
        RAISE EXCEPTION
            'Quotation items must be provided as an array.';
    END IF;

    v_client_id :=
        NULLIF(p_payload->>'client_id', '')::uuid;

    v_lead_id :=
        NULLIF(p_payload->>'lead_id', '')::uuid;

    -- Both relationships, when supplied, must belong
    -- to the current user's workspace.
    IF v_client_id IS NOT NULL AND NOT EXISTS (
        SELECT 1
        FROM public.clients c
        WHERE c.id = v_client_id
          AND c.organization_id = v_org_id
    ) THEN
        RAISE EXCEPTION
            'The selected client does not belong to your organization.';
    END IF;

    IF v_lead_id IS NOT NULL AND NOT EXISTS (
        SELECT 1
        FROM public.leads l
        WHERE l.id = v_lead_id
          AND l.organization_id = v_org_id
    ) THEN
        RAISE EXCEPTION
            'The selected lead does not belong to your organization.';
    END IF;

    -- Validate each item before inserting anything.
    IF EXISTS (
        SELECT 1
        FROM jsonb_array_elements(p_payload->'items') AS x(item)
        WHERE NULLIF(BTRIM(x.item->>'description'), '') IS NULL
           OR COALESCE(
                NULLIF(x.item->>'quantity', '')::numeric, 0
              ) <= 0
           OR COALESCE(
                NULLIF(x.item->>'unit_price', '')::numeric, -1
              ) < 0
           OR COALESCE(
                NULLIF(x.item->>'amount', '')::numeric, -1
              ) < 0
    ) THEN
        RAISE EXCEPTION
            'Each item needs a description, positive quantity, and non-negative price and amount.';
    END IF;

    v_subtotal := ROUND(
        COALESCE((
            SELECT SUM((x.item->>'amount')::numeric)
            FROM jsonb_array_elements(p_payload->'items') AS x(item)
        ), 0),
        2
    );

    v_discount :=
        COALESCE(NULLIF(p_payload->>'discount', '')::numeric, 0);

    v_tax :=
        COALESCE(NULLIF(p_payload->>'tax', '')::numeric, 0);

    IF v_discount < 0 OR v_tax < 0 THEN
        RAISE EXCEPTION
            'Discount and tax cannot be negative.';
    END IF;

    v_total := ROUND(v_subtotal - v_discount + v_tax, 2);

    IF v_total < 0 THEN
        RAISE EXCEPTION
            'Quotation total cannot be negative.';
    END IF;

    -- Generate the number using the existing workspace-aware function.
    v_quotation_number := public.generate_quotation_number();

    IF v_quotation_number IS NULL THEN
        RAISE EXCEPTION
            'Failed to generate quotation number.';
    END IF;

    -- Insert the quotation header.
    INSERT INTO public.quotations (
        organization_id,
        quotation_number,
        client_id,
        lead_id,
        prospect_name,
        prospect_phone,
        prospect_email,
        prospect_address,
        event_name,
        event_type,
        event_date,
        venue,
        guest_count,
        quotation_date,
        valid_until,
        status,
        subtotal,
        discount,
        tax,
        total,
        notes
    )
    VALUES (
        v_org_id,
        v_quotation_number,
        v_client_id,
        v_lead_id,
        NULLIF(p_payload->>'prospect_name', ''),
        NULLIF(p_payload->>'prospect_phone', ''),
        NULLIF(p_payload->>'prospect_email', ''),
        NULLIF(p_payload->>'prospect_address', ''),
        NULLIF(p_payload->>'event_name', ''),
        NULLIF(p_payload->>'event_type', ''),
        NULLIF(p_payload->>'event_date', '')::date,
        NULLIF(p_payload->>'venue', ''),
        NULLIF(p_payload->>'guest_count', '')::integer,
        (p_payload->>'quotation_date')::date,
        NULLIF(p_payload->>'valid_until', '')::date,
        'Draft',
        v_subtotal,
        v_discount,
        v_tax,
        v_total,
        NULLIF(p_payload->>'notes', '')
    )
    RETURNING id INTO v_quotation_id;

    -- Insert all line items in the same transaction.
    FOR v_item IN
        SELECT x.item
        FROM jsonb_array_elements(p_payload->'items') AS x(item)
    LOOP
        v_description := BTRIM(v_item->>'description');
        v_quantity := (v_item->>'quantity')::numeric;
        v_unit_price := (v_item->>'unit_price')::numeric;
        v_amount := ROUND((v_item->>'amount')::numeric, 2);

        INSERT INTO public.quotation_items (
            quotation_id,
            description,
            quantity,
            unit_price,
            amount,
            our_expense
        )
        VALUES (
            v_quotation_id,
            v_description,
            v_quantity,
            v_unit_price,
            v_amount,
            COALESCE(
                NULLIF(v_item->>'our_expense', '')::boolean,
                false
            )
        );
    END LOOP;

    RETURN v_quotation_id;
END;
$function$;

-- Do not allow anonymous or public execution.
REVOKE ALL
ON FUNCTION public.create_quotation_atomically(jsonb)
FROM PUBLIC, anon;

GRANT EXECUTE
ON FUNCTION public.create_quotation_atomically(jsonb)
TO authenticated;
