import { redirect } from "next/navigation";

import BrandingForm from "@/features/settings/components/BrandingForm";
import { createClient } from "@/lib/supabase/server";

export default async function BrandingSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } =
    await supabase
      .from("profiles")
      .select(
        "organization_id, role"
      )
      .eq("id", user.id)
      .maybeSingle();

  if (!profile?.organization_id) {
    redirect("/onboarding");
  }

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: organization, error } =
    await supabase
      .from("organizations")
      .select(
        "id, name, logo_url"
      )
      .eq(
        "id",
        profile.organization_id
      )
      .maybeSingle();

  if (error) {
    console.error(
      "Failed to load organization branding:",
      error
    );

    redirect("/dashboard");
  }

  if (!organization) {
    redirect("/onboarding");
  }

  return (
    <BrandingForm
      organizationId={organization.id}
      organizationName={organization.name ?? ""}
      initialLogoUrl={
        organization.logo_url ?? ""
      }
    />
  );
}