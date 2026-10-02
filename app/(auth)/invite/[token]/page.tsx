"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { acceptInvitation } from "@/features/team/services/team.service";

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();

  const token =
    typeof params.token === "string"
      ? params.token
      : "";

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      if (!token) {
        if (mounted) {
          setError("Invalid invitation link.");
          setLoading(false);
        }
        return;
      }

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (mounted) {
          setAuthenticated(false);
          setLoading(false);
        }

        return;
      }

      try {
        await acceptInvitation(token);

        if (mounted) {
          router.replace("/dashboard");
          router.refresh();
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not accept this invitation."
          );
          setLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      mounted = false;
    };
  }, [router, token]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-slate-900">
            Checking invitation...
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Please wait.
          </p>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            You&apos;ve been invited to EventOS
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in or create your account using the email
            address that received this invitation.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              router.push(
                `/login?invite=${encodeURIComponent(token)}`
              )
            }
            className="mt-6 h-11 w-full rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Continue to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Invitation could not be accepted
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {error}
        </p>
      </div>
    </main>
  );
}