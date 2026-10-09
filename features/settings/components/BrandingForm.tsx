"use client";

import { FormEvent, useState } from "react";
import {
  Check,
  Image as ImageIcon,
  Link2,
  Sparkles,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

interface BrandingFormProps {
  organizationId: string;
  organizationName: string;
  initialLogoUrl: string;
}

export default function BrandingForm({
  organizationId,
  organizationName,
  initialLogoUrl,
}: BrandingFormProps) {
  const [logoUrl, setLogoUrl] =
    useState(initialLogoUrl);

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setSuccess(false);
    setError("");

    const supabase = createClient();

    const { error: updateError } =
      await supabase
        .from("organizations")
        .update({
          logo_url:
            logoUrl.trim() || null,
        })
        .eq("id", organizationId);

    if (updateError) {
      console.error(
        "Failed to update branding:",
        updateError
      );

      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setSuccess(true);

    window.setTimeout(() => {
      setSuccess(false);
    }, 3000);
  }

  const hasLogo = Boolean(
    logoUrl.trim()
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Sparkles
            size={20}
            strokeWidth={2}
          />
        </div>

        <div>
          <h2 className="text-[22px] font-bold tracking-tight text-slate-950">
            Branding
          </h2>

          <p className="mt-0.5 text-[13px] leading-5 text-slate-500">
            Define the visual identity used across your
            Eventos workspace.
          </p>
        </div>
      </div>

      {/* Main branding card */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Section heading */}
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-[15px] font-bold text-slate-950">
            Brand identity
          </h3>

          <p className="mt-0.5 text-[13px] text-slate-500">
            Add your company logo to make your workspace
            instantly recognizable.
          </p>
        </div>

        {/* Logo controls */}
        <div className="grid gap-5 px-5 py-5 lg:grid-cols-[150px_minmax(0,1fr)]">
          {/* Logo preview */}
          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-slate-700">
              Logo preview
            </p>

            <div className="flex h-[132px] w-[132px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {hasLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={`${organizationName} logo`}
                  className="h-full w-full object-contain p-4"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon
                    size={28}
                    strokeWidth={1.5}
                  />

                  <span className="mt-1.5 text-[12px] font-medium">
                    No logo added
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Logo controls */}
          <div className="flex min-w-0 flex-col justify-center">
            <label
              htmlFor="logo-url"
              className="mb-1.5 block text-[13px] font-semibold text-slate-700"
            >
              Logo URL
            </label>

            <div className="relative">
              <Link2
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="logo-url"
                type="url"
                value={logoUrl}
                onChange={(event) =>
                  setLogoUrl(event.target.value)
                }
                disabled={saving}
                className="h-10.5 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-[14px] font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                placeholder="https://yourcompany.com/logo.png"
              />
            </div>

            <p className="mt-2 max-w-xl text-[12px] leading-5 text-slate-400">
              Use a publicly accessible PNG, JPG or SVG image
              URL. Direct file uploads can be added later
              through Supabase Storage.
            </p>
          </div>
        </div>

        {/* Workspace preview */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
          <div className="mb-2.5">
            <h3 className="text-[14px] font-bold text-slate-950">
              Workspace preview
            </h3>

            <p className="mt-0.5 text-[12px] text-slate-500">
              How your company identity appears inside Eventos.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-600 text-white">
              {hasLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt=""
                  className="h-full w-full object-contain bg-white p-1"
                />
              ) : (
                <Sparkles
                  size={19}
                  strokeWidth={2}
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold text-slate-950">
                {organizationName ||
                  "Your company"}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Event Management CRM
              </p>
            </div>

            <span className="ml-auto hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 sm:block">
              Workspace
            </span>
          </div>
        </div>

        {/* Feedback */}
        {(error || success) && (
          <div className="px-5 pb-4">
            <div
              className={
                error
                  ? "rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700"
                  : "flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[13px] font-medium text-emerald-700"
              }
            >
              {success && (
                <Check
                  size={16}
                  strokeWidth={2.5}
                />
              )}

              {error ||
                "Branding updated successfully."}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-semibold text-slate-700">
              Your workspace identity
            </p>

            <p className="mt-0.5 text-[12px] text-slate-400">
              Changes apply to your organization branding.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="h-10 shrink-0 rounded-xl bg-blue-600 px-5 text-[13px] font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save branding"}
          </button>
        </div>
      </section>
    </form>
  );
}