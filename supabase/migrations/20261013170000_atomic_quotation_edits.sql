
-- Atomic quotation edits for Eventos
-- Updates quotation header, items, linked event and cost obligations
-- in one transaction.
-- Paid obligations are preserved if their quotation item is removed.

BEGIN;

-- Preserve paid obligations when their quotation items are deleted.
ALTER TABLE public.event_cost_obligations
  ALTER COLUMN quotation_item_id DROP NOT NULL;

ALTER TABLE public.event_cost_obligations
  DROP CONSTRAINT IF EXISTS event_cost_obligations_quotation_item_id_fkey;

ALTER TABLE public.event_cost_obligations
  ADD CONSTRAINT event_cost_obligations_quotation_item_id_fkey
  FOREIGN KEY (quotation_item_id)
  REFERENCES public.quotation_items(id)
  ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.update_quotation_atomically(
  p_quotation_id uuid,
  p_payload jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_org_id uuid;
  v_quote public.quotations%ROWTYPE;
  v_item public.quotation_items%ROWTYPE;
  v_obligation public.event_cost_obligations%ROWTYPE;
  v_input_item jsonb;

  v_item_id uuid;
  v_client_id uuid;
  v_lead_id uuid;
  v_client_name text;
  v_prospect_name text;
  v_event_id uuid;

  v_has_obligation boolean := false;
  v_subtotal numeric(12,2);
  v_discount numeric(12,2);
  v_tax numeric(12,2);
  v_total numeric(12,2);
  v_quantity numeric;
  v_unit_price numeric;
  v_amount numeric(12,2);
  v_our_expense boolean;
  v_item_count integer;
BEGIN
  -- Resolve the signed-in user's organization.
  v_org_id := public.get_user_organization_id();

  IF v_org_id IS NULL THEN
    RAISE EXCEPTION
      'Your account is not linked to an organization.';
  END IF;

  IF p_payload IS NULL
     OR jsonb_typeof(p_payload) <> 'object' THEN
    RAISE EXCEPTION 'Invalid quotation data.';
  END IF;

  IF jsonb_typeof(p_payload->'items') IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Quotation items must be provided as an array.';
  END IF;

  -- Lock the quotation before changing anything.
  SELECT *
    INTO v_quote
    FROM public.quotations
   WHERE id = p_quotation_id
     AND organization_id = v_org_id
   FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'Quotation not found in your organization.';
  END IF;

  v_event_id := v_quote.event_id;
  v_client_id := NULLIF(p_payload->>'client_id', '')::uuid;
  v_lead_id := NULLIF(p_payload->>'lead_id', '')::uuid;

  v_prospect_name :=
    COALESCE(p_payload->>'prospect_name', '');

  -- Validate that the client belongs to this organization.
  IF v_client_id IS NOT NULL THEN
    SELECT c.name
      INTO v_client_name
      FROM public.clients c
     WHERE c.id = v_client_id
       AND c.organization_id = v_org_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION
        'The selected client does not belong to your organization.';
    END IF;
  ELSE
    v_client_name := v_prospect_name;
  END IF;

  -- Validate that the lead belongs to this organization.
  IF v_lead_id IS NOT NULL THEN
    PERFORM 1
      FROM public.leads l
     WHERE l.id = v_lead_id
       AND l.organization_id = v_org_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION
        'The selected lead does not belong to your organization.';
    END IF;
  END IF;

  v_discount :=
    COALESCE(NULLIF(p_payload->>'discount', '')::numeric, 0);

  v_tax :=
    COALESCE(NULLIF(p_payload->>'tax', '')::numeric, 0);

  IF v_discount < 0 OR v_tax < 0 THEN
    RAISE EXCEPTION
      'Discount and tax cannot be negative.';
  END IF;

  -- Validate line items.
  IF EXISTS (
    SELECT 1
      FROM jsonb_array_elements(p_payload->'items') AS x(item)
     WHERE COALESCE(
             NULLIF(x.item->>'quantity', '')::numeric, 0
           ) <= 0
        OR COALESCE(
             NULLIF(x.item->>'unit_price', '')::numeric, -1
           ) < 0
        OR COALESCE(
             NULLIF(x.item->>'amount', '')::numeric, -1
           ) < 0
        OR NULLIF(BTRIM(x.item->>'description'), '') IS NULL
  ) THEN
    RAISE EXCEPTION
      'Each item needs a description, positive quantity, and non-negative price and amount.';
  END IF;

  -- Reject duplicate existing item IDs.
  SELECT COUNT(*)
    INTO v_item_count
    FROM jsonb_array_elements(p_payload->'items') AS x(item)
   WHERE NULLIF(x.item->>'id', '') IS NOT NULL;

  IF v_item_count <> (
    SELECT COUNT(DISTINCT (x.item->>'id')::uuid)
      FROM jsonb_array_elements(p_payload->'items') AS x(item)
     WHERE NULLIF(x.item->>'id', '') IS NOT NULL
  ) THEN
    RAISE EXCEPTION
      'Duplicate quotation item IDs were submitted.';
  END IF;

  -- An existing item ID must belong to this quotation.
  IF EXISTS (
    SELECT 1
      FROM jsonb_array_elements(p_payload->'items') AS x(item)
      LEFT JOIN public.quotation_items qi
        ON qi.id = (x.item->>'id')::uuid
       AND qi.quotation_id = p_quotation_id
     WHERE NULLIF(x.item->>'id', '') IS NOT NULL
       AND qi.id IS NULL
  ) THEN
    RAISE EXCEPTION
      'An item does not belong to this quotation.';
  END IF;

  SELECT COALESCE(
           SUM((x.item->>'amount')::numeric), 0
         )
    INTO v_subtotal
    FROM jsonb_array_elements(p_payload->'items') AS x(item);

  v_subtotal := ROUND(v_subtotal, 2);
  v_total := ROUND(v_subtotal - v_discount + v_tax, 2);

  IF v_total < 0 THEN
    RAISE EXCEPTION
      'Quotation total cannot be negative.';
  END IF;

  -- Make sure an accepted quotation's event still exists in this org.
  IF v_quote.status = 'Accepted' THEN
    IF v_event_id IS NULL THEN
      RAISE EXCEPTION
        'This accepted quotation has no linked event. Fix the event relationship before editing it.';
    END IF;

    PERFORM 1
      FROM public.events e
     WHERE e.id = v_event_id
       AND e.organization_id = v_org_id
     FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION
        'The linked event was not found in your organization.';
    END IF;
  END IF;

  -- Remove omitted quotation items. Detach paid obligations first;
  -- delete only obligations with no payments.
  FOR v_item IN
    SELECT qi.*
      FROM public.quotation_items qi
     WHERE qi.quotation_id = p_quotation_id
       AND NOT EXISTS (
         SELECT 1
           FROM jsonb_array_elements(p_payload->'items') AS x(item)
          WHERE NULLIF(x.item->>'id', '') IS NOT NULL
            AND (x.item->>'id')::uuid = qi.id
       )
     FOR UPDATE
  LOOP
    SELECT eco.*
      INTO v_obligation
      FROM public.event_cost_obligations eco
     WHERE eco.quotation_item_id = v_item.id
     FOR UPDATE;

    v_has_obligation := FOUND;

    IF v_has_obligation THEN
      IF v_obligation.paid > 0 THEN
        UPDATE public.event_cost_obligations
           SET quotation_item_id = NULL,
               updated_at = now()
         WHERE id = v_obligation.id;
      ELSE
        DELETE FROM public.event_cost_obligations
         WHERE id = v_obligation.id;
      END IF;
    END IF;

    DELETE FROM public.quotation_items
     WHERE id = v_item.id
       AND quotation_id = p_quotation_id;
  END LOOP;

  -- Update quotation header.
  UPDATE public.quotations
     SET client_id = v_client_id,
         lead_id = v_lead_id,
         prospect_name = NULLIF(v_prospect_name, ''),
         prospect_phone =
           NULLIF(p_payload->>'prospect_phone', ''),
         prospect_email =
           NULLIF(p_payload->>'prospect_email', ''),
         prospect_address =
           NULLIF(p_payload->>'prospect_address', ''),
         event_name =
           NULLIF(p_payload->>'event_name', ''),
         event_type =
           NULLIF(p_payload->>'event_type', ''),
         event_date =
           NULLIF(p_payload->>'event_date', '')::date,
         venue = NULLIF(p_payload->>'venue', ''),
         guest_count =
           NULLIF(p_payload->>'guest_count', '')::integer,
         quotation_date =
           COALESCE(
             NULLIF(p_payload->>'quotation_date', '')::date,
             v_quote.quotation_date
           ),
         valid_until =
           NULLIF(p_payload->>'valid_until', '')::date,
         subtotal = v_subtotal,
         discount = v_discount,
         tax = v_tax,
         total = v_total,
         notes = NULLIF(p_payload->>'notes', '')
   WHERE id = p_quotation_id
     AND organization_id = v_org_id;

  -- Update or insert submitted line items.
  FOR v_input_item IN
    SELECT x.item
      FROM jsonb_array_elements(p_payload->'items') AS x(item)
  LOOP
    v_item_id := NULLIF(v_input_item->>'id', '')::uuid;
    v_quantity := (v_input_item->>'quantity')::numeric;
    v_unit_price := (v_input_item->>'unit_price')::numeric;
    v_amount := ROUND(
      (v_input_item->>'amount')::numeric, 2
    );
    v_our_expense :=
      COALESCE(
        (v_input_item->>'our_expense')::boolean,
        false
      );

    IF v_item_id IS NULL THEN
      INSERT INTO public.quotation_items (
        quotation_id,
        description,
        quantity,
        unit_price,
        amount,
        our_expense
      )
      VALUES (
        p_quotation_id,
        BTRIM(v_input_item->>'description'),
        v_quantity,
        v_unit_price,
        v_amount,
        v_our_expense
      )
      RETURNING id INTO v_item_id;
    ELSE
      UPDATE public.quotation_items
         SET description = BTRIM(v_input_item->>'description'),
             quantity = v_quantity,
             unit_price = v_unit_price,
             amount = v_amount,
             our_expense = v_our_expense
       WHERE id = v_item_id
         AND quotation_id = p_quotation_id;
    END IF;

    -- Capture FOUND immediately after checking the obligation.
    SELECT eco.*
      INTO v_obligation
      FROM public.event_cost_obligations eco
     WHERE eco.quotation_item_id = v_item_id
     FOR UPDATE;

    v_has_obligation := FOUND;

    IF v_quote.status = 'Accepted' THEN
      IF v_our_expense THEN
        IF v_has_obligation THEN
          IF v_obligation.paid > v_amount THEN
            RAISE EXCEPTION
              'Cannot set "%": its obligation is already paid % and the new amount is %. Increase the amount or resolve the payment first.',
              BTRIM(v_input_item->>'description'),
              v_obligation.paid,
              v_amount;
          END IF;

          UPDATE public.event_cost_obligations
             SET description =
                   BTRIM(v_input_item->>'description'),
                 amount = v_amount,
                 event_id = v_event_id,
                 quotation_id = p_quotation_id,
                 organization_id = v_org_id,
                 updated_at = now()
           WHERE id = v_obligation.id;
        ELSE
          INSERT INTO public.event_cost_obligations (
            organization_id,
            event_id,
            quotation_id,
            quotation_item_id,
            description,
            amount,
            paid
          )
          VALUES (
            v_org_id,
            v_event_id,
            p_quotation_id,
            v_item_id,
            BTRIM(v_input_item->>'description'),
            v_amount,
            0
          );
        END IF;
      ELSIF v_has_obligation THEN
        -- Expense disabled: retain any paid financial history.
        IF v_obligation.paid > 0 THEN
          UPDATE public.event_cost_obligations
             SET quotation_item_id = NULL,
                 updated_at = now()
           WHERE id = v_obligation.id;
        ELSE
          DELETE FROM public.event_cost_obligations
           WHERE id = v_obligation.id;
        END IF;
      END IF;
    END IF;
  END LOOP;

  -- Keep the linked event aligned with the accepted quotation,
  -- including its client relationship.
  IF v_quote.status = 'Accepted' THEN
    UPDATE public.events
       SET event_name =
             COALESCE(p_payload->>'event_name', ''),
           event_type =
             COALESCE(p_payload->>'event_type', ''),
           event_date =
             NULLIF(p_payload->>'event_date', '')::date,
           venue =
             COALESCE(p_payload->>'venue', ''),
           guest_count =
             COALESCE(
               NULLIF(p_payload->>'guest_count', '')::integer,
               0
             ),
           client_id = v_client_id,
           client_name = COALESCE(v_client_name, '')
     WHERE id = v_event_id
       AND organization_id = v_org_id;
  END IF;

  RETURN jsonb_build_object(
    'quotation_id', p_quotation_id,
    'status', v_quote.status,
    'event_id', v_event_id,
    'subtotal', v_subtotal,
    'discount', v_discount,
    'tax', v_tax,
    'total', v_total
  );
END;
$function$;

-- Only authenticated users should call this RPC.
REVOKE ALL ON FUNCTION
  public.update_quotation_atomically(uuid, jsonb)
  FROM PUBLIC;

REVOKE ALL ON FUNCTION
  public.update_quotation_atomically(uuid, jsonb)
  FROM anon;

GRANT EXECUTE ON FUNCTION
  public.update_quotation_atomically(uuid, jsonb)
  TO authenticated;

COMMIT;
