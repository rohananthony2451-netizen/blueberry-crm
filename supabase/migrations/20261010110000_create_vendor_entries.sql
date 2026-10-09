-- Vendor Entries
-- A vendor booking/cost record associated with one event.

CREATE TABLE IF NOT EXISTS public.vendor_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  organization_id UUID NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,

  event_id UUID NOT NULL
    REFERENCES public.events(id) ON DELETE CASCADE,

  vendor_id UUID NOT NULL
    REFERENCES public.vendors(id) ON DELETE RESTRICT,

  category TEXT NOT NULL DEFAULT 'Other',
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  entry_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending'
    CHECK (status IN ('Pending', 'Confirmed', 'Paid', 'Cancelled')),
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_entries_organization_id
  ON public.vendor_entries(organization_id);

CREATE INDEX IF NOT EXISTS idx_vendor_entries_event_id
  ON public.vendor_entries(event_id);

CREATE INDEX IF NOT EXISTS idx_vendor_entries_vendor_id
  ON public.vendor_entries(vendor_id);

CREATE INDEX IF NOT EXISTS idx_vendor_entries_organization_status
  ON public.vendor_entries(organization_id, status);

ALTER TABLE public.vendor_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vendor_entries_select" ON public.vendor_entries;
CREATE POLICY "vendor_entries_select"
ON public.vendor_entries
FOR SELECT TO authenticated
USING (
  organization_id = public.get_user_organization_id()
);

DROP POLICY IF EXISTS "vendor_entries_insert" ON public.vendor_entries;
CREATE POLICY "vendor_entries_insert"
ON public.vendor_entries
FOR INSERT TO authenticated
WITH CHECK (
  organization_id = public.get_user_organization_id()
  AND EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_id
      AND e.organization_id = vendor_entries.organization_id
  )
  AND EXISTS (
    SELECT 1 FROM public.vendors v
    WHERE v.id = vendor_id
     AND v.organization_id = vendor_entries.organization_id
  )
);

DROP POLICY IF EXISTS "vendor_entries_update" ON public.vendor_entries;
CREATE POLICY "vendor_entries_update"
ON public.vendor_entries
FOR UPDATE TO authenticated
USING (
  organization_id = public.get_user_organization_id()
)
WITH CHECK (
  organization_id = public.get_user_organization_id()
  AND EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_id
     AND e.organization_id = vendor_entries.organization_id
  )
  AND EXISTS (
    SELECT 1 FROM public.vendors v
    WHERE v.id = vendor_id
      AND v.organization_id = organization_id
  )
);

DROP POLICY IF EXISTS "vendor_entries_delete" ON public.vendor_entries;
CREATE POLICY "vendor_entries_delete"
ON public.vendor_entries
FOR DELETE TO authenticated
USING (
  organization_id = public.get_user_organization_id()
);

CREATE OR REPLACE FUNCTION public.set_vendor_entry_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_vendor_entries_updated_at
  ON public.vendor_entries;

CREATE TRIGGER set_vendor_entries_updated_at
BEFORE UPDATE ON public.vendor_entries
FOR EACH ROW
EXECUTE FUNCTION public.set_vendor_entry_updated_at();

COMMENT ON TABLE public.vendor_entries IS
  'Organization-scoped vendor bookings and costs linked to events. Separate from quotation-generated expense obligations.';