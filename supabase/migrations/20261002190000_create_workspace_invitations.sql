------------------------------------------------------------
-- EVENTOS / EVENTIFY
-- WORKSPACE INVITATIONS
------------------------------------------------------------

CREATE TABLE public.workspace_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES public.organizations(id)
        ON DELETE CASCADE,

    email TEXT NOT NULL,

    role TEXT NOT NULL DEFAULT 'staff'
        CHECK (role = 'staff'),

    token_hash TEXT NOT NULL UNIQUE,

    invited_by UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    expires_at TIMESTAMPTZ NOT NULL,

    accepted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


------------------------------------------------------------
-- INDEXES
------------------------------------------------------------

CREATE INDEX idx_workspace_invitations_organization
ON public.workspace_invitations(organization_id);

CREATE INDEX idx_workspace_invitations_email
ON public.workspace_invitations(email);

CREATE INDEX idx_workspace_invitations_expires_at
ON public.workspace_invitations(expires_at);


------------------------------------------------------------
-- ROW LEVEL SECURITY
------------------------------------------------------------

ALTER TABLE public.workspace_invitations
ENABLE ROW LEVEL SECURITY;


------------------------------------------------------------
-- ORGANIZATION MEMBERS CAN VIEW INVITATIONS
------------------------------------------------------------

CREATE POLICY "Users can view invitations in their organization"
ON public.workspace_invitations
FOR SELECT
TO authenticated
USING (
    organization_id = public.get_user_organization_id()
);