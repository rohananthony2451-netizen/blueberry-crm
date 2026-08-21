------------------------------------------------------------
-- MULTI-TENANT SECURITY FOUNDATION
------------------------------------------------------------

------------------------------------------------------------
-- 1. Helper function:
--    Returns the organization belonging to the
--    currently authenticated user.
------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT organization_id
    FROM public.profiles
    WHERE id = auth.uid()
    LIMIT 1;
$$;


------------------------------------------------------------
-- 2. Helper function:
--    Checks whether a profile belongs to the
--    currently authenticated user's organization.
------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_profile_in_user_organization(
    profile_id UUID
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = profile_id
          AND profiles.organization_id = public.get_user_organization_id()
    );
$$;


------------------------------------------------------------
-- ORGANIZATIONS
------------------------------------------------------------

ALTER TABLE public.organizations
ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can view their organization"
ON public.organizations
FOR SELECT
TO authenticated
USING (
    id = public.get_user_organization_id()
);


------------------------------------------------------------
-- PROFILES
------------------------------------------------------------

ALTER TABLE public.profiles
ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can view profiles in their organization"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    organization_id = public.get_user_organization_id()
);


CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
    id = auth.uid()
)
WITH CHECK (
    id = auth.uid()
    AND organization_id = public.get_user_organization_id()
);


------------------------------------------------------------
-- LEADS
------------------------------------------------------------

ALTER TABLE public.leads
ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can view leads in their organization"
ON public.leads
FOR SELECT
TO authenticated
USING (
    organization_id = public.get_user_organization_id()
);


CREATE POLICY "Users can create leads in their organization"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (
    organization_id = public.get_user_organization_id()
);


CREATE POLICY "Users can update leads in their organization"
ON public.leads
FOR UPDATE
TO authenticated
USING (
    organization_id = public.get_user_organization_id()
)
WITH CHECK (
    organization_id = public.get_user_organization_id()
);


CREATE POLICY "Users can delete leads in their organization"
ON public.leads
FOR DELETE
TO authenticated
USING (
    organization_id = public.get_user_organization_id()
);