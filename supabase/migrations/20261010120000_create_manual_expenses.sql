
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  organization_id UUID NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,

  expense_type TEXT NOT NULL
    CHECK (expense_type IN ('Event', 'Miscellaneous')),

  event_id UUID NULL
    REFERENCES public.events(id) ON DELETE RESTRICT,

  category TEXT NOT NULL
    CHECK (char_length(trim(category)) > 0),

  vendor_payee TEXT NULL,

  amount NUMERIC(12, 2) NOT NULL
    CHECK (amount >= 0),

  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,

  notes TEXT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT expenses_event_type_consistency CHECK (
    (expense_type = 'Event' AND event_id IS NOT NULL)
    OR
    (expense_type = 'Miscellaneous' AND event_id IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_expenses_organization
  ON public.expenses(organization_id);

CREATE INDEX IF NOT EXISTS idx_expenses_organization_date
  ON public.expenses(organization_id, expense_date DESC);

CREATE INDEX IF NOT EXISTS idx_expenses_organization_type
  ON public.expenses(organization_id, expense_type);

CREATE INDEX IF NOT EXISTS idx_expenses_event
  ON public.expenses(event_id);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS expenses_select ON public.expenses;
CREATE POLICY expenses_select
ON public.expenses
FOR SELECT TO authenticated
USING (
  organization_id = public.get_user_organization_id()
);

DROP POLICY IF EXISTS expenses_insert ON public.expenses;
CREATE POLICY expenses_insert
ON public.expenses
FOR INSERT TO authenticated
WITH CHECK (
  organization_id = public.get_user_organization_id()
  AND (
    event_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = expenses.event_id
        AND e.organization_id = expenses.organization_id
    )
  )
);

DROP POLICY IF EXISTS expenses_update ON public.expenses;
CREATE POLICY expenses_update
ON public.expenses
FOR UPDATE TO authenticated
USING (
  organization_id = public.get_user_organization_id()
)
WITH CHECK (
  organization_id = public.get_user_organization_id()
  AND (
    event_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = expenses.event_id
        AND e.organization_id = expenses.organization_id
    )
  )
);

DROP POLICY IF EXISTS expenses_delete ON public.expenses;
CREATE POLICY expenses_delete
ON public.expenses
FOR DELETE TO authenticated
USING (
  organization_id = public.get_user_organization_id()
);

CREATE OR REPLACE FUNCTION public.set_expense_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_expenses_updated_at
  ON public.expenses;

CREATE TRIGGER set_expenses_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION public.set_expense_updated_at();
