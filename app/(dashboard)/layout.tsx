import { ReactNode } from "react";
import { redirect } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";

export interface CurrentUser {
  fullName: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  organizationName: string;
  organizationLogoUrl: string | null;
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select(
        "id, organization_id, full_name, email, role, avatar_url"
      )
      .eq("id", user.id)
      .maybeSingle();

  if (profileError) {
    console.error(
      "Failed to load user profile:",
      profileError
    );

    redirect("/login");
  }

  if (!profile || !profile.organization_id) {
    redirect("/onboarding");
  }

  const { data: organization, error: organizationError } =
    await supabase
      .from("organizations")
      .select("name, logo_url")
      .eq("id", profile.organization_id)
      .maybeSingle();

  if (organizationError) {
    console.error(
      "Failed to load organization:",
      organizationError
    );

    redirect("/login");
  }

  if (!organization) {
    redirect("/onboarding");
  }

  const currentUser: CurrentUser = {
    fullName:
      profile.full_name?.trim() ||
      user.email?.split("@")[0] ||
      "User",
    email:
      profile.email?.trim() ||
      user.email ||
      "",
    role: profile.role || "admin",
    avatarUrl: profile.avatar_url,
    organizationName: organization.name,
    organizationLogoUrl: organization.logo_url,
  };

  return (
    <AppShell currentUser={currentUser}>
      {children}
    </AppShell>
  );
}