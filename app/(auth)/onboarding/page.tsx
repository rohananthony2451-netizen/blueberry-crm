"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();

  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const trimmedName = organizationName.trim();

    if (!trimmedName) {
      setError("Please enter your organization name.");
      setLoading(false);
      return;
    }

    const slugBase = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slugBase) {
      setError("Please enter a valid organization name.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/login");
      return;
    }

    /*
     * Add a short unique suffix so two organizations
     * with the same name do not collide on the slug.
     */
    const slug = `${slugBase}-${crypto.randomUUID().slice(0, 8)}`;

    const { error: workspaceError } = await supabase.rpc(
      "create_workspace",
      {
        workspace_name: trimmedName,
        workspace_slug: slug,
      }
    );

    if (workspaceError) {
      setError(workspaceError.message);
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Set up your workspace
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Tell us about your event management business.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="organizationName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Organization name
                </label>

                <input
                  id="organizationName"
                  type="text"
                  value={organizationName}
                  onChange={(event) =>
                    setOrganizationName(event.target.value)
                  }
                  placeholder="Blueberry Events"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating workspace..." : "Create workspace"}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Your workspace keeps your event business data separate and secure.
          </p>
        </div>
      </div>
    </main>
  );
}