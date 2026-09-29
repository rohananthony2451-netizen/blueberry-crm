-- ============================================================
-- Eventify
-- Create event cost obligations when a quotation is accepted
--
-- Workflow:
--
-- Sent Quotation
--      ↓
-- Create / Link Client
--      ↓
-- Create Confirmed Event
--      ↓
-- Create "We Owe" obligations from quotation items
--      ↓
-- Attach Client + Event to quotation
--      ↓
-- Accepted
--
-- Only quotation_items with our_expense = true
-- become event_cost_obligations.
--
-- The entire operation remains inside the existing
-- accept_quotation transaction.
-- ============================================================


CREATE OR REPLACE FUNCTION public.accept_quotation(
  p_quotation_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$

DECLARE
  v_organization_id uuid;
  v_quotation public.quotations%ROWTYPE;
  v_lead public.leads%ROWTYPE;

  v_client_id uuid;
  v_event_id uuid;

  v_client_name text;
  v_client_phone text;
  v_client_email text;
  v_client_address text;

  v_event_name text;
  v_event_type text;
  v_event_date date;
  v_venue text;
  v_guest_count integer;

BEGIN

  -- ----------------------------------------------------------
  -- 1. Resolve current user's organization
  -- ----------------------------------------------------------

  SELECT public.get_user_organization_id()
  INTO v_organization_id;

  IF v_organization_id IS NULL THEN
    RAISE EXCEPTION
      'No workspace found for the current user.';
  END IF;


  -- ----------------------------------------------------------
  -- 2. Load quotation inside the current organization
  -- ----------------------------------------------------------

  SELECT *
  INTO v_quotation
  FROM public.quotations
  WHERE id = p_quotation_id
    AND organization_id = v_organization_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'Quotation could not be found.';
  END IF;


  -- ----------------------------------------------------------
  -- 3. Only Sent quotations can be accepted
  -- ----------------------------------------------------------

  IF v_quotation.status <> 'Sent' THEN
    RAISE EXCEPTION
      'Only Sent quotations can be accepted. Current status: %.',
      v_quotation.status;
  END IF;


  -- ----------------------------------------------------------
  -- 4. Validate prospect/customer information
  -- ----------------------------------------------------------

  IF NULLIF(TRIM(v_quotation.prospect_name), '') IS NULL THEN
    RAISE EXCEPTION
      'Prospect name is required before accepting the quotation.';
  END IF;


  -- ----------------------------------------------------------
  -- 5. Validate proposed event information
  -- ----------------------------------------------------------

  IF NULLIF(TRIM(v_quotation.event_name), '') IS NULL THEN
    RAISE EXCEPTION
      'Event name is required before accepting the quotation.';
  END IF;

  IF NULLIF(TRIM(v_quotation.event_type), '') IS NULL THEN
    RAISE EXCEPTION
      'Event type is required before accepting the quotation.';
  END IF;

  IF v_quotation.event_date IS NULL THEN
    RAISE EXCEPTION
      'Event date is required before accepting the quotation.';
  END IF;

  IF NULLIF(TRIM(v_quotation.venue), '') IS NULL THEN
    RAISE EXCEPTION
      'Venue is required before accepting the quotation.';
  END IF;

  IF v_quotation.guest_count IS NULL
     OR v_quotation.guest_count <= 0 THEN
    RAISE EXCEPTION
      'Guest count must be greater than zero.';
  END IF;


  -- ----------------------------------------------------------
  -- 6. Snapshot customer information from quotation
  -- ----------------------------------------------------------

  v_client_name :=
    TRIM(v_quotation.prospect_name);

  v_client_phone :=
    NULLIF(TRIM(v_quotation.prospect_phone), '');

  v_client_email :=
    NULLIF(TRIM(v_quotation.prospect_email), '');

  v_client_address :=
    NULLIF(TRIM(v_quotation.prospect_address), '');


  -- ==========================================================
  -- 7. RESOLVE CLIENT
  -- ==========================================================


  -- ----------------------------------------------------------
  -- PATH A
  -- Existing confirmed Client is already attached
  -- to the quotation.
  -- ----------------------------------------------------------

  IF v_quotation.client_id IS NOT NULL THEN

    SELECT id
    INTO v_client_id
    FROM public.clients
    WHERE id = v_quotation.client_id
      AND organization_id = v_organization_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION
        'The quotation references a client that could not be found.';
    END IF;


  -- ----------------------------------------------------------
  -- PATH B
  -- Quotation originated from a Lead.
  -- ----------------------------------------------------------

  ELSIF v_quotation.lead_id IS NOT NULL THEN

    SELECT *
    INTO v_lead
    FROM public.leads
    WHERE id = v_quotation.lead_id
      AND organization_id = v_organization_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION
        'The quotation''s originating lead could not be found.';
    END IF;


    -- Existing Lead → Client conversion

    IF v_lead.converted_client_id IS NOT NULL THEN

      SELECT id
      INTO v_client_id
      FROM public.clients
      WHERE id = v_lead.converted_client_id
        AND organization_id = v_organization_id;

      IF NOT FOUND THEN
        RAISE EXCEPTION
          'The lead references a client that could not be found.';
      END IF;


    -- Lead has not yet become a confirmed Client

    ELSE

      INSERT INTO public.clients (
        organization_id,
        name,
        phone,
        email,
        address,
        notes
      )
      VALUES (
        v_organization_id,
        v_client_name,
        v_client_phone,
        v_client_email,
        v_client_address,
        v_quotation.notes
      )
      RETURNING id INTO v_client_id;


      UPDATE public.leads
      SET
        converted_client_id = v_client_id,
        status = 'Converted',
        updated_at = now()
      WHERE id = v_quotation.lead_id
        AND organization_id = v_organization_id;

    END IF;


  -- ----------------------------------------------------------
  -- PATH C
  -- Walk-in prospect.
  -- ----------------------------------------------------------

  ELSE

    INSERT INTO public.clients (
      organization_id,
      name,
      phone,
      email,
      address,
      notes
    )
    VALUES (
      v_organization_id,
      v_client_name,
      v_client_phone,
      v_client_email,
      v_client_address,
      v_quotation.notes
    )
    RETURNING id INTO v_client_id;

  END IF;


  -- ==========================================================
  -- 8. CREATE CONFIRMED EVENT
  -- ==========================================================

  v_event_name :=
    TRIM(v_quotation.event_name);

  v_event_type :=
    TRIM(v_quotation.event_type);

  v_event_date :=
    v_quotation.event_date;

  v_venue :=
    TRIM(v_quotation.venue);

  v_guest_count :=
    v_quotation.guest_count;


  INSERT INTO public.events (
    organization_id,
    client_id,
    client_name,
    event_name,
    event_type,
    event_date,
    venue,
    status,
    guest_count
  )
  VALUES (
    v_organization_id,
    v_client_id,
    v_client_name,
    v_event_name,
    v_event_type,
    v_event_date,
    v_venue,
    'Upcoming',
    v_guest_count
  )
  RETURNING id INTO v_event_id;


  -- ==========================================================
  -- 9. CREATE "WE OWE" OBLIGATIONS
  --
  -- Only quotation items explicitly marked:
  --
  --     our_expense = true
  --
  -- become obligations.
  --
  -- amount is copied from the quotation item.
  -- paid starts at 0.
  -- owed_to starts NULL and can be filled later.
  -- ==========================================================

  INSERT INTO public.event_cost_obligations (
    organization_id,
    event_id,
    quotation_id,
    quotation_item_id,
    description,
    amount,
    paid,
    owed_to
  )
  SELECT
    v_organization_id,
    v_event_id,
    v_quotation.id,
    qi.id,
    qi.description,
    qi.amount,
    0,
    NULL
  FROM public.quotation_items qi
  WHERE qi.quotation_id = v_quotation.id
    AND qi.our_expense = true;


  -- ==========================================================
  -- 10. FINALIZE QUOTATION
  -- ==========================================================

  UPDATE public.quotations
  SET
    client_id = v_client_id,
    event_id = v_event_id,
    status = 'Accepted',
    updated_at = now()
  WHERE id = p_quotation_id
    AND organization_id = v_organization_id;


  -- ==========================================================
  -- 11. RETURN RESULT
  -- ==========================================================

  RETURN jsonb_build_object(
    'quotation_id', p_quotation_id,
    'client_id', v_client_id,
    'event_id', v_event_id,
    'status', 'Accepted'
  );

END;
$function$;


-- ------------------------------------------------------------
-- Security
-- ------------------------------------------------------------

REVOKE ALL
ON FUNCTION public.accept_quotation(uuid)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.accept_quotation(uuid)
TO authenticated;