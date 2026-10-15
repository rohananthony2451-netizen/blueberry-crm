BEGIN;

-- Validate payment relationships on every insert/update.
CREATE OR REPLACE FUNCTION public.validate_payment_relationships()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_client_org uuid;
    v_event_org uuid;
    v_event_client uuid;
    v_quotation_org uuid;
    v_quotation_client uuid;
    v_quotation_event uuid;
BEGIN
    SELECT organization_id
    INTO v_client_org
    FROM public.clients
    WHERE id = NEW.client_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'The selected payment client does not exist.';
    END IF;

    IF v_client_org IS DISTINCT FROM NEW.organization_id THEN
        RAISE EXCEPTION
            'The payment client belongs to a different organization.';
    END IF;

    IF NEW.event_id IS NOT NULL THEN
        SELECT organization_id, client_id
        INTO v_event_org, v_event_client
        FROM public.events
        WHERE id = NEW.event_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'The selected payment event does not exist.';
        END IF;

        IF v_event_org IS DISTINCT FROM NEW.organization_id THEN
            RAISE EXCEPTION
                'The payment event belongs to a different organization.';
        END IF;

        IF v_event_client IS DISTINCT FROM NEW.client_id THEN
            RAISE EXCEPTION
                'The selected event does not belong to the selected client.';
        END IF;
    END IF;

    IF NEW.quotation_id IS NOT NULL THEN
        SELECT organization_id, client_id, event_id
        INTO v_quotation_org, v_quotation_client, v_quotation_event
        FROM public.quotations
        WHERE id = NEW.quotation_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION
                'The selected payment quotation does not exist.';
        END IF;

        IF v_quotation_org IS DISTINCT FROM NEW.organization_id THEN
            RAISE EXCEPTION
                'The payment quotation belongs to a different organization.';
        END IF;

        IF v_quotation_client IS DISTINCT FROM NEW.client_id THEN
            RAISE EXCEPTION
                'The selected quotation does not belong to the selected client.';
        END IF;

        IF v_quotation_event IS DISTINCT FROM NEW.event_id THEN
            RAISE EXCEPTION
                'The payment event must match the quotation event.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS payments_validate_relationships
ON public.payments;

CREATE TRIGGER payments_validate_relationships
BEFORE INSERT OR UPDATE OF
    organization_id,
    client_id,
    event_id,
    quotation_id
ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.validate_payment_relationships();


-- Prevent client organization changes from invalidating payments.
CREATE OR REPLACE FUNCTION public.guard_payment_relationship_updates()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF TG_TABLE_NAME = 'clients' THEN
        IF NEW.organization_id IS DISTINCT FROM OLD.organization_id
           AND EXISTS (
               SELECT 1
               FROM public.payments p
               WHERE p.client_id = OLD.id
                 AND p.organization_id IS DISTINCT FROM NEW.organization_id
           )
        THEN
            RAISE EXCEPTION
                'Cannot move this client to another organization while linked payments exist.';
        END IF;

    ELSIF TG_TABLE_NAME = 'events' THEN
        IF (
            NEW.organization_id IS DISTINCT FROM OLD.organization_id
            OR NEW.client_id IS DISTINCT FROM OLD.client_id
        )
        AND EXISTS (
            SELECT 1
            FROM public.payments p
            WHERE p.event_id = OLD.id
              AND (
                  p.organization_id IS DISTINCT FROM NEW.organization_id
                  OR p.client_id IS DISTINCT FROM NEW.client_id
              )
        )
        THEN
            RAISE EXCEPTION
                'Cannot change this event client or organization while linked payments would become inconsistent.';
        END IF;

    ELSIF TG_TABLE_NAME = 'quotations' THEN
        IF (
            NEW.organization_id IS DISTINCT FROM OLD.organization_id
            OR NEW.client_id IS DISTINCT FROM OLD.client_id
            OR NEW.event_id IS DISTINCT FROM OLD.event_id
        )
        AND EXISTS (
            SELECT 1
            FROM public.payments p
            WHERE p.quotation_id = OLD.id
              AND (
                  p.organization_id IS DISTINCT FROM NEW.organization_id
                  OR p.client_id IS DISTINCT FROM NEW.client_id
                  OR p.event_id IS DISTINCT FROM NEW.event_id
              )
        )
        THEN
            RAISE EXCEPTION
                'Cannot change this quotation client, event or organization while linked payments would become inconsistent.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS clients_guard_payment_relationships
ON public.clients;

CREATE TRIGGER clients_guard_payment_relationships
BEFORE UPDATE OF organization_id
ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.guard_payment_relationship_updates();


DROP TRIGGER IF EXISTS events_guard_payment_relationships
ON public.events;

CREATE TRIGGER events_guard_payment_relationships
BEFORE UPDATE OF organization_id, client_id
ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.guard_payment_relationship_updates();


DROP TRIGGER IF EXISTS quotations_guard_payment_relationships
ON public.quotations;

CREATE TRIGGER quotations_guard_payment_relationships
BEFORE UPDATE OF organization_id, client_id, event_id
ON public.quotations
FOR EACH ROW
EXECUTE FUNCTION public.guard_payment_relationship_updates();

COMMIT;