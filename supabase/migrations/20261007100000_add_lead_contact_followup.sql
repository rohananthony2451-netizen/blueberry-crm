------------------------------------------------------------
-- LEADS: CONTACT + FOLLOW-UP
------------------------------------------------------------

ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS email TEXT;

ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS follow_up_date DATE;

CREATE INDEX IF NOT EXISTS idx_leads_follow_up_date
ON public.leads(follow_up_date);