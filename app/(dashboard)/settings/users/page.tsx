import { redirect } from "next/navigation";

import TeamPage from "@/features/team/components/TeamPage";
import { createClient } from "@/lib/supabase/server";

export default async function UsersSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.organization_id) {
    redirect("/onboarding");
  }

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  return <TeamPage embedded />;
}