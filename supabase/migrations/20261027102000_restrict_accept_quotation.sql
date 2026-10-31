
REVOKE EXECUTE ON FUNCTION public.accept_quotation(UUID)
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.accept_quotation(UUID)
TO authenticated, service_role;
