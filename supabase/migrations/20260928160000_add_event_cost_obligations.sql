-- ============================================================
-- Eventify
-- Event Cost Obligations
--
-- Purpose:
-- Track money that Eventify's business owes to other people
-- or businesses for a confirmed Event.
--
-- This is NOT a general accounting system.
--
-- Example:
--
-- Quotation:
--   Decoration   ₹50,000   Our Expense = ON
--   Catering     ₹80,000   Our Expense = ON
--   Venue        ₹30,000   Our Expense = OFF
--
-- After quotation acceptance:
--
-- Event Cost Obligations:
--   Decoration   ₹50,000
--   Catering     ₹80,000
--
-- Draft/Sent quotations do NOT create obligations.
-- Obligations are created only when a quotation becomes Accepted
-- and a confirmed Event exists.
-- ============================================================


-- ============================================================
-- 1. Create event cost obligations
-- ============================================================

CREATE TABLE IF NOT EXISTS public.event_cost_obligations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  organization_id uuid NOT NULL
    REFERENCES public.organizations(id)
    ON DELETE CASCADE,

  event_id uuid NOT NULL
    REFERENCES public.events(id)
    ON DELETE CASCADE,

  quotation_id uuid NOT NULL
    REFERENCES public.quotations(id)
    ON DELETE CASCADE,

  quotation_item_id uuid NOT NULL
    REFERENCES public.quotation_items(id)
    ON DELETE CASCADE,

  description text NOT NULL,

  amount numeric(12, 2) NOT NULL
    CHECK (amount >= 0),

  paid numeric(12, 2) NOT NULL DEFAULT 0
    CHECK (paid >= 0),

  owed_to text NULL,

  created_at timestamptz NOT NULL DEFAULT now(),

  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT event_cost_obligations_paid_not_greater_than_amount
    CHECK (paid <= amount)
);


-- ============================================================
-- 2. Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS
  idx_event_cost_obligations_organization_id
ON public.event_cost_obligations(organization_id);


CREATE INDEX IF NOT EXISTS
  idx_event_cost_obligations_event_id
ON public.event_cost_obligations(event_id);


CREATE INDEX IF NOT EXISTS
  idx_event_cost_obligations_quotation_id
ON public.event_cost_obligations(quotation_id);


CREATE INDEX IF NOT EXISTS
  idx_event_cost_obligations_quotation_item_id
ON public.event_cost_obligations(quotation_item_id);


-- ============================================================
-- 3. Prevent duplicate obligation for the same quotation item
--
-- One quotation item can create at most one active obligation.
--
-- This protects us from accidentally creating:
--
-- Decoration ₹50,000
-- Decoration ₹50,000
--
-- for the same accepted quotation item.
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS
  uq_event_cost_obligations_quotation_item_id
ON public.event_cost_obligations(quotation_item_id);


-- ============================================================
-- 4. Row Level Security
-- ============================================================

ALTER TABLE public.event_cost_obligations
ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 5. Organization-isolated policies
-- ============================================================

DROP POLICY IF EXISTS
  "event_cost_obligations_select"
ON public.event_cost_obligations;

CREATE POLICY
  "event_cost_obligations_select"
ON public.event_cost_obligations
FOR SELECT
TO authenticated
USING (
  organization_id =
  public.get_user_organization_id()
);


DROP POLICY IF EXISTS
  "event_cost_obligations_insert"
ON public.event_cost_obligations;

CREATE POLICY
  "event_cost_obligations_insert"
ON public.event_cost_obligations
FOR INSERT
TO authenticated
WITH CHECK (
  organization_id =
  public.get_user_organization_id()
);


DROP POLICY IF EXISTS
  "event_cost_obligations_update"
ON public.event_cost_obligations;

CREATE POLICY
  "event_cost_obligations_update"
ON public.event_cost_obligations
FOR UPDATE
TO authenticated
USING (
  organization_id =
  public.get_user_organization_id()
)
WITH CHECK (
  organization_id =
  public.get_user_organization_id()
);


DROP POLICY IF EXISTS
  "event_cost_obligations_delete"
ON public.event_cost_obligations;

CREATE POLICY
  "event_cost_obligations_delete"
ON public.event_cost_obligations
FOR DELETE
TO authenticated
USING (
  organization_id =
  public.get_user_organization_id()
);


-- ============================================================
-- 6. Documentation
-- ============================================================

COMMENT ON TABLE public.event_cost_obligations IS
  'Tracks money the organization owes to other people or businesses for confirmed events.';


COMMENT ON COLUMN public.event_cost_obligations.amount IS
  'Total amount the organization owes for this obligation.';


COMMENT ON COLUMN public.event_cost_obligations.paid IS
  'Amount already paid toward this obligation.';


COMMENT ON COLUMN public.event_cost_obligations.owed_to IS
  'Optional person or business this money is owed to.';


COMMENT ON COLUMN public.event_cost_obligations.quotation_item_id IS
  'The quotation line item that created this obligation.';


-- ============================================================
-- 7. Verification comments
--
-- Remaining amount is intentionally calculated by the
-- application as:
--
-- remaining = amount - paid
--
-- We do not store remaining separately because it can become
-- inconsistent if amount or paid changes.
-- ============================================================