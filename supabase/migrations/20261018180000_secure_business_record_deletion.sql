
-- ============================================================
-- Eventos: secure business-record deletion
-- ============================================================
-- Workspace owners can delete business records, subject to
-- relationship safeguards.
-- Staff retain lead deletion access.
-- Paid cost obligations cannot be deleted.
-- Linked payment, quotation, obligation, and vendor history
-- must not be silently disconnected by parent deletion.
-- Users cannot change their own role or organization.
-- ============================================================

-- 1. Trusted workspace owner check.
-- Uses organizations.owner_id, not a mutable profile role.

CREATE OR REPLACE FUNCTION public.is_workspace_owner(
    p_organization_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.organizations o
        WHERE o.id = p_organization_id
          AND o.owner_id = (SELECT auth.uid())
    );
$$;

REVOKE ALL
ON FUNCTION public.is_workspace_owner(uuid)
FROM PUBLIC, anon;

GRANT EXECUTE
ON FUNCTION public.is_workspace_owner(uuid)
TO authenticated;


-- 2. Replace broad DELETE policies.
-- Existing permissive policies must be removed because
-- permissive policies combine with OR logic.

DROP POLICY IF EXISTS
    "Users can delete clients in their organization"
    ON public.clients;

CREATE POLICY "Owners can delete clients"
ON public.clients
FOR DELETE TO authenticated
USING (public.is_workspace_owner(organization_id));


DROP POLICY IF EXISTS
    "Users can delete events in their organization"
    ON public.events;

CREATE POLICY "Owners can delete events"
ON public.events
FOR DELETE TO authenticated
USING (public.is_workspace_owner(organization_id));


DROP POLICY IF EXISTS
    "Users can delete quotations in their organization"
    ON public.quotations;

CREATE POLICY "Owners can delete quotations"
ON public.quotations
FOR DELETE TO authenticated
USING (public.is_workspace_owner(organization_id));


DROP POLICY IF EXISTS
    "Users can delete quotation items in their organization"
    ON public.quotation_items;

CREATE POLICY "Owners can delete quotation items"
ON public.quotation_items
FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.quotations q
        WHERE q.id = quotation_items.quotation_id
          AND public.is_workspace_owner(q.organization_id)
    )
);


DROP POLICY IF EXISTS
    "Users can delete payments in their organization"
    ON public.payments;

CREATE POLICY "Owners can delete payments"
ON public.payments
FOR DELETE TO authenticated
USING (public.is_workspace_owner(organization_id));


DROP POLICY IF EXISTS
    "Users can delete vendors in their organization"
    ON public.vendors;

CREATE POLICY "Owners can delete vendors"
ON public.vendors
FOR DELETE TO authenticated
USING (public.is_workspace_owner(organization_id));


DROP POLICY IF EXISTS vendor_entries_delete
ON public.vendor_entries;

CREATE POLICY vendor_entries_delete
ON public.vendor_entries
FOR DELETE TO authenticated
USING (public.is_workspace_owner(organization_id));


DROP POLICY IF EXISTS expenses_delete
ON public.expenses;

CREATE POLICY expenses_delete
ON public.expenses
FOR DELETE TO authenticated
USING (public.is_workspace_owner(organization_id));


DROP POLICY IF EXISTS event_cost_obligations_delete
ON public.event_cost_obligations;

CREATE POLICY event_cost_obligations_delete
ON public.event_cost_obligations
FOR DELETE TO authenticated
USING (public.is_workspace_owner(organization_id));


-- Intentionally preserve the existing leads DELETE policy.
-- Staff are allowed to delete leads in their own organization.


-- 3. Prevent users from changing their own role or organization.

CREATE OR REPLACE FUNCTION public.prevent_self_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF (SELECT auth.uid()) = OLD.id
       AND (
           NEW.role IS DISTINCT FROM OLD.role
           OR NEW.organization_id IS DISTINCT FROM OLD.organization_id
       )
    THEN
        RAISE EXCEPTION
            'You cannot change your own workspace role or organization.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_self_role_change
ON public.profiles;

CREATE TRIGGER prevent_self_role_change
BEFORE UPDATE OF role, organization_id
ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_self_role_change();


-- 4. Prevent deletion of cost obligations with recorded payments.
-- This also protects against parent-record cascades.

CREATE OR REPLACE FUNCTION public.prevent_paid_obligation_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF OLD.paid > 0 THEN
        RAISE EXCEPTION
            'This cost obligation has recorded payments and cannot be deleted.';
    END IF;

    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS prevent_paid_obligation_delete
ON public.event_cost_obligations;

CREATE TRIGGER prevent_paid_obligation_delete
BEFORE DELETE
ON public.event_cost_obligations
FOR EACH ROW
EXECUTE FUNCTION public.prevent_paid_obligation_delete();


-- 5. Prevent event deletion from disconnecting or removing
-- linked payments, quotations, obligations, or vendor entries.

CREATE OR REPLACE FUNCTION public.guard_event_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.payments p
        WHERE p.event_id = OLD.id
    ) THEN
        RAISE EXCEPTION
            'This event has linked payments. Resolve the payment history before deleting the event.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.quotations q
        WHERE q.event_id = OLD.id
    ) THEN
        RAISE EXCEPTION
            'This event has linked quotations. Resolve the quotation relationship before deleting the event.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.event_cost_obligations o
        WHERE o.event_id = OLD.id
    ) THEN
        RAISE EXCEPTION
            'This event has cost obligations. Resolve them before deleting the event.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.vendor_entries ve
        WHERE ve.event_id = OLD.id
    ) THEN
        RAISE EXCEPTION
            'This event has vendor entries. Resolve them before deleting the event.';
    END IF;

    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS guard_event_delete
ON public.events;

CREATE TRIGGER guard_event_delete
BEFORE DELETE
ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.guard_event_delete();


-- 6. Prevent quotation deletion from disconnecting payment
-- history or deleting linked cost obligations.

CREATE OR REPLACE FUNCTION public.guard_quotation_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.payments p
        WHERE p.quotation_id = OLD.id
    ) THEN
        RAISE EXCEPTION
            'This quotation has linked payments. Resolve the payment history before deleting it.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.event_cost_obligations o
        WHERE o.quotation_id = OLD.id
    ) THEN
        RAISE EXCEPTION
            'This quotation has cost obligations. Resolve them before deleting the quotation.';
    END IF;

    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS guard_quotation_delete
ON public.quotations;

CREATE TRIGGER guard_quotation_delete
BEFORE DELETE
ON public.quotations
FOR EACH ROW
EXECUTE FUNCTION public.guard_quotation_delete();
