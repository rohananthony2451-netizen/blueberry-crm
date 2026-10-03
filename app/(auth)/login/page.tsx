"use client";

import { FormEvent, Suspense, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const invitationToken = searchParams.get("invite");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const supabase = createClient();

    /*
     * ------------------------------------------------------
     * CREATE ACCOUNT
     * ------------------------------------------------------
     */
    if (isSignUp) {
      const { data, error } =
        await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: invitationToken
              ? `${window.location.origin}/auth/callback?invite=${encodeURIComponent(
                  invitationToken
                )}`
              : `${window.location.origin}/auth/callback`,
          },
        });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      /*
       * If email confirmation is enabled in Supabase,
       * there will be no active session yet.
       */
      if (!data.session) {
        setError(
          "Account created. Check your email to confirm your account, then return to the invitation link."
        );
        setLoading(false);
        return;
      }

      /*
       * If this account came through an invitation,
       * send it back to the invitation page.
       */
      if (invitationToken) {
        router.replace(
          `/invite/${encodeURIComponent(
            invitationToken
          )}`
        );
      } else {
        router.replace("/dashboard");
      }

      router.refresh();
      return;
    }

    /*
     * ------------------------------------------------------
     * SIGN IN
     * ------------------------------------------------------
     */
    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    /*
     * Preserve invitation flow after login.
     */
    if (invitationToken) {
      router.replace(
        `/invite/${encodeURIComponent(
          invitationToken
        )}`
      );
    } else {
      router.replace("/dashboard");
    }

    router.refresh();
  }

  /*
   * --------------------------------------------------------
   * GOOGLE LOGIN
   * --------------------------------------------------------
   */
  async function handleGoogleLogin() {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: invitationToken
            ? `${window.location.origin}/auth/callback?invite=${encodeURIComponent(
                invitationToken
              )}`
            : `${window.location.origin}/auth/callback`,
        },
      });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M18 15L18.8 17.2L21 18L18.8 18.8L18 21L17.2 18.8L15 18L17.2 17.2L18 15Z"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              EventOS
            </h1>

            <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
              {isSignUp
                ? "Create your account"
                : "Welcome back"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {isSignUp
                ? "Create your EventOS account to continue."
                : "Sign in to your event management workspace"}
            </p>

            {invitationToken && (
              <p className="mt-3 text-xs font-medium text-blue-600">
                You are joining an EventOS workspace.
              </p>
            )}
          </div>

          {/* Login / Signup Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-8">

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.98c2.63 0 4.84-.87 6.45-2.33l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.98Z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.54 14.09A5.85 5.85 0 0 1 6.23 12c0-.72.12-1.42.31-2.09V7.38H3.3A9.98 9.98 0 0 0 2.25 12c0 1.66.4 3.23 1.05 4.62l3.24-2.53Z"
                />

                <path
                  fill="#EA4335"
                  d="M12 5.88c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 2.98 14.63 2.02 12 2.02a9.74 9.74 0 0 0-8.7 5.36l3.24 2.53C7.31 7.6 9.46 5.88 12 5.88Z"
                />
              </svg>

              {isSignUp
                ? "Sign up with Google"
                : "Continue with Google"}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                or continue with email
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Email / Password */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          "/forgot-password"
                        )
                      }
                      className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder={
                    isSignUp
                      ? "Create a password"
                      : "Enter your password"
                  }
                  required
                  minLength={6}
                  autoComplete={
                    isSignUp
                      ? "new-password"
                      : "current-password"
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Error / Info */}
              {error && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    error.startsWith(
                      "Account created."
                    )
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? isSignUp
                    ? "Creating account..."
                    : "Signing in..."
                  : isSignUp
                    ? "Create account"
                    : "Sign in"}
              </button>
            </form>

            {/* Sign in / Sign up switch */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp((value) => !value);
                    setError("");
                  }}
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  {isSignUp
                    ? "Sign in"
                    : "Create account"}
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            © 2026 EventOS. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-sm text-slate-500">
            Loading...
          </p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}