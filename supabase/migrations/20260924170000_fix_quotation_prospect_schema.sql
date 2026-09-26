-- ============================================================
-- Eventify
-- Fix Quotation Prospect Workflow Schema
--
-- The previous migration is already recorded as applied.
-- This migration ensures the actual remote schema contains
-- the quotation prospect workflow fields.
-- ============================================================


-- ------------------------------------------------------------
-- 1. Add prospect and proposed-event fields
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
-- 2. Confirm client_id can be NULL
-- ------------------------------------------------------------

ALTER TABLE public.quotations
  ALTER COLUMN client_id DROP NOT NULL;


-- ------------------------------------------------------------
-- 3. Add Lead foreign key if missing
-- ------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'quotations_lead_id_fkey'
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
-- 4. Indexes
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
-- 5. Documentation
-- ------------------------------------------------------------

COMMENT ON COLUMN public.quotations.client_id IS
  'Confirmed client. NULL until quotation acceptance creates or links a client.';

COMMENT ON COLUMN public.quotations.event_id IS
  'Confirmed event. NULL until quotation acceptance creates an event.';

COMMENT ON COLUMN public.quotations.lead_id IS
  'Optional originating lead. NULL for walk-in prospects.';

COMMENT ON COLUMN public.quotations.prospect_name IS
  'Prospect name captured when quotation is created.';

COMMENT ON COLUMN public.quotations.prospect_phone IS
  'Prospect phone captured when quotation is created.';

COMMENT ON COLUMN public.quotations.prospect_email IS
  'Prospect email captured when quotation is created.';

COMMENT ON COLUMN public.quotations.prospect_address IS
  'Prospect address captured when quotation is created.';

COMMENT ON COLUMN public.quotations.event_name IS
  'Proposed event name before confirmation.';

COMMENT ON COLUMN public.quotations.event_type IS
  'Proposed event type before confirmation.';

COMMENT ON COLUMN public.quotations.event_date IS
  'Proposed event date before confirmation.';

COMMENT ON COLUMN public.quotations.venue IS
  'Proposed event venue before confirmation.';

COMMENT ON COLUMN public.quotations.guest_count IS
  'Proposed guest count before confirmation.';