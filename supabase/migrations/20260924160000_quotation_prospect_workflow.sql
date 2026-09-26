-- ============================================================
-- Eventify
-- Quotation Prospect Workflow
--
-- Purpose:
-- A quotation can exist before a confirmed Client/Event exists.
--
-- Workflow:
-- Lead / Walk-in
--      ↓
-- Quotation
--      ↓
-- Draft / Sent / Rejected
--      ↓
-- Accepted
--      ↓
-- Client + Event
-- ============================================================


-- ------------------------------------------------------------
-- 1. Add quotation prospect fields
-- ------------------------------------------------------------

ALTER TABLE public.quotations
  ADD COLUMN IF NOT EXISTS lead_id uuid NULL,
  ADD COLUMN IF NOT EXISTS prospect_name text NULL,
  ADD COLUMN IF NOT EXISTS prospect_phone text NULL,
  ADD COLUMN IF NOT EXISTS prospect_email text NULL,
  ADD COLUMN IF NOT EXISTS prospect_address text NULL,
  ADD COLUMN IF NOT EXISTS event_name text NULL,
  ADD COLUMN IF NOT EXISTS event_type text NULL,
  ADD COLUMN IF NOT EXISTS event_date date NULL,
  ADD COLUMN IF NOT EXISTS venue text NULL,
  ADD COLUMN IF NOT EXISTS guest_count integer NULL;


-- ------------------------------------------------------------
-- 2. Preserve existing quotation information
--
-- Existing quotations already have Client/Event relationships.
-- Copy that information into the new prospect/proposed-event
-- fields before changing client_id to nullable.
-- ------------------------------------------------------------

UPDATE public.quotations AS q
SET
  prospect_name = c.name,
  prospect_phone = c.phone,
  prospect_email = c.email,
  prospect_address = c.address
FROM public.clients AS c
WHERE q.client_id = c.id
  AND q.prospect_name IS NULL;


UPDATE public.quotations AS q
SET
  event_name = e.event_name,
  event_type = e.event_type,
  event_date = e.event_date,
  venue = e.venue,
  guest_count = e.guest_count
FROM public.events AS e
WHERE q.event_id = e.id
  AND q.event_name IS NULL;


-- ------------------------------------------------------------
-- 3. Make confirmed Client relationship optional
--
-- Draft/Sent/Rejected quotations may not have a confirmed
-- Client yet.
--
-- The existing FK remains in place.
-- ------------------------------------------------------------

ALTER TABLE public.quotations
  ALTER COLUMN client_id DROP NOT NULL;


-- ------------------------------------------------------------
-- 4. Add Lead relationship
-- ------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE constraint_name =
      'quotations_lead_id_fkey'
  ) THEN

    ALTER TABLE public.quotations
      ADD CONSTRAINT quotations_lead_id_fkey
      FOREIGN KEY (lead_id)
      REFERENCES public.leads(id)
      ON DELETE SET NULL;

  END IF;
END
$$;


-- ------------------------------------------------------------
-- 5. Organization index
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS
  idx_quotations_organization_id
ON public.quotations(organization_id);


-- ------------------------------------------------------------
-- 6. Useful workflow indexes
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS
  idx_quotations_lead_id
ON public.quotations(lead_id);

CREATE INDEX IF NOT EXISTS
  idx_quotations_client_id
ON public.quotations(client_id);

CREATE INDEX IF NOT EXISTS
  idx_quotations_event_id
ON public.quotations(event_id);


-- ------------------------------------------------------------
-- 7. Documentation
-- ------------------------------------------------------------

COMMENT ON COLUMN public.quotations.client_id IS
  'Confirmed client created/linked when quotation is accepted. NULL while quotation is only a prospect.';

COMMENT ON COLUMN public.quotations.event_id IS
  'Confirmed event created/linked when quotation is accepted. NULL while quotation is only a proposal.';

COMMENT ON COLUMN public.quotations.lead_id IS
  'Optional originating lead. NULL for walk-in prospects.';

COMMENT ON COLUMN public.quotations.prospect_name IS
  'Prospect/customer name captured when quotation is created.';

COMMENT ON COLUMN public.quotations.event_name IS
  'Proposed event name captured before a confirmed Event exists.';

COMMENT ON COLUMN public.quotations.event_type IS
  'Proposed event type captured before a confirmed Event exists.';

COMMENT ON COLUMN public.quotations.event_date IS
  'Proposed event date captured before a confirmed Event exists.';

COMMENT ON COLUMN public.quotations.venue IS
  'Proposed event venue captured before a confirmed Event exists.';

COMMENT ON COLUMN public.quotations.guest_count IS
  'Proposed guest count captured before a confirmed Event exists.';