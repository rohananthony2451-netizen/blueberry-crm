------------------------------------------------------------
-- LEADS
------------------------------------------------------------

CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES public.organizations(id)
        ON DELETE CASCADE,

    client_name TEXT NOT NULL,

    phone TEXT,

    event_type TEXT NOT NULL,

    event_date DATE,

    budget NUMERIC(12, 2),

    source TEXT,

    status TEXT NOT NULL DEFAULT 'New',

    assigned_to UUID
        REFERENCES public.profiles(id)
        ON DELETE SET NULL,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

------------------------------------------------------------
-- INDEXES
------------------------------------------------------------

CREATE INDEX idx_leads_organization
ON public.leads(organization_id);

CREATE INDEX idx_leads_status
ON public.leads(status);

CREATE INDEX idx_leads_event_date
ON public.leads(event_date);

CREATE INDEX idx_leads_assigned_to
ON public.leads(assigned_to);