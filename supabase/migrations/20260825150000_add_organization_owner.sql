------------------------------------------------------------
-- ORGANIZATION OWNERSHIP
------------------------------------------------------------

ALTER TABLE public.organizations
ADD COLUMN owner_id UUID
REFERENCES auth.users(id)
ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_organizations_owner
ON public.organizations(owner_id);

------------------------------------------------------------
-- ORGANIZATIONS: INSERT
------------------------------------------------------------

CREATE POLICY "Users can create their own organization"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.uid()) = owner_id
);

------------------------------------------------------------
-- PROFILES: INSERT
------------------------------------------------------------

CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.uid()) = id
  AND
  organization_id IN (
    SELECT id
    FROM public.organizations
    WHERE owner_id = (SELECT auth.uid())
  )
);