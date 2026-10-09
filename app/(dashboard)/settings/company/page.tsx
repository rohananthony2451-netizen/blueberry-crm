import { redirect } from "next/navigation";

import CompanyProfileForm from "@/features/settings/components/CompanyProfileForm";
import { createClient } from "@/lib/supabase/server";

export default async function CompanySettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
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
        "id, name, email, phone, address, website"
      )
      .eq(
        "id",
        profile.organization_id
      )
      .maybeSingle();

  if (error) {
    console.error(
      "Failed to load organization:",
      error
    );

    redirect("/dashboard");
  }

  if (!organization) {
    redirect("/onboarding");
  }

  return (
    <CompanyProfileForm
      organizationId={organization.id}
      initialValues={{
        name: organization.name ?? "",
        email: organization.email ?? "",
        phone: organization.phone ?? "",
        address:
          organization.address ?? "",
        website:
          organization.website ?? "",
      }}
    />
  );
}