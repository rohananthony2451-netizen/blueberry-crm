------------------------------------------------------------
-- ORGANIZATIONS: ADMIN UPDATE
------------------------------------------------------------

CREATE POLICY "Workspace admins can update their organization"
ON public.organizations
FOR UPDATE
TO authenticated
USING (
    id = public.get_user_organization_id()
    AND owner_id = (SELECT auth.uid())
)
WITH CHECK (
    id = public.get_user_organization_id()
    AND owner_id = (SELECT auth.uid())
);