"use client";

import { FormEvent, useState } from "react";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

interface CompanyProfileFormProps {
  organizationId: string;
  initialValues: {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
  };
}

export default function CompanyProfileForm({
  organizationId,
  initialValues,
}: CompanyProfileFormProps) {
  const [name, setName] = useState(
    initialValues.name
  );

  const [email, setEmail] = useState(
    initialValues.email
  );

  const [phone, setPhone] = useState(
    initialValues.phone
  );

  const [address, setAddress] = useState(
    initialValues.address
  );

  const [website, setWebsite] = useState(
    initialValues.website
  );

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

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError(
        "Company name is required."
      );

      setSaving(false);
      return;
    }

    const supabase = createClient();

    const { error: updateError } =
      await supabase
        .from("organizations")
        .update({
          name: trimmedName,
          email: email.trim() || null,
          phone: phone.trim() || null,
          address: address.trim() || null,
          website: website.trim() || null,
        })
        .eq("id", organizationId);

    if (updateError) {
      console.error(
        "Failed to update organization:",
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

  const fieldClass =
    "h-10.5 w-full rounded-xl border border-slate-200 bg-white px-4 text-[14px] font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50";

  const iconFieldClass =
    "h-10.5 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[14px] font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50";

  const labelClass =
    "mb-1.5 block text-[13px] font-semibold text-slate-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10.5 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Building2
            size={21}
            strokeWidth={2}
          />
        </div>

        <div>
          <h2 className="text-[22px] font-bold tracking-tight text-slate-950">
            Company Profile
          </h2>

          <p className="mt-0.5 text-[13px] leading-5 text-slate-500">
            Manage the business information used across
            your Eventos workspace.
          </p>
        </div>
      </div>

      {/* Main profile card */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Section heading */}
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-[15px] font-bold text-slate-950">
            Business information
          </h3>

          <p className="mt-1 text-[13px] text-slate-500">
            Keep your company details accurate for your team
            and future client-facing documents.
          </p>
        </div>

        {/* Fields */}
        <div className="grid gap-x-4 gap-y-4 px-5 py-4 md:grid-cols-2">
          {/* Company name */}
          <div>
            <label
              htmlFor="company-name"
              className={labelClass}
            >
              Company name
            </label>

            <input
              id="company-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              disabled={saving}
              required
              className={fieldClass}
              placeholder="Your company name"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="company-email"
              className={labelClass}
            >
              Business email
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="company-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                disabled={saving}
                className={iconFieldClass}
                placeholder="hello@company.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="company-phone"
              className={labelClass}
            >
              Phone
            </label>

            <div className="relative">
              <Phone
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="company-phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                disabled={saving}
                className={iconFieldClass}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="company-website"
              className={labelClass}
            >
              Website
            </label>

            <div className="relative">
              <Globe
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="company-website"
                type="url"
                value={website}
                onChange={(event) =>
                  setWebsite(event.target.value)
                }
                disabled={saving}
                className={iconFieldClass}
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label
              htmlFor="company-address"
              className={labelClass}
            >
              Business address
            </label>

            <div className="relative">
              <MapPin
                size={17}
                className="pointer-events-none absolute left-4 top-4 text-slate-400"
              />

              <textarea
                id="company-address"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                disabled={saving}
                rows={2}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-[13px] font-medium leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                placeholder="Your complete business address"
              />
            </div>
          </div>
        </div>

        {/* Feedback */}
        {(error || success) && (
          <div className="px-5 pb-4">
            <div
              className={
                error
                  ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700"
                  : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-700"
              }
            >
              {error ||
                "Company profile updated successfully."}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-semibold text-slate-700">
              Used across your workspace
            </p>

            <p className="mt-0.5 text-[12px] text-slate-400">
              These details will be available for future
              quotations and client-facing documents.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="h-10 shrink-0 rounded-xl bg-blue-600 px-6 text-[13px] font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save changes"}
          </button>
        </div>
      </section>
    </form>
  );
}