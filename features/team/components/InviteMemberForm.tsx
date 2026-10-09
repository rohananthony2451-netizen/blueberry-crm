"use client";

import {
  FormEvent,
  useState,
} from "react";

import { createInvitation } from "../services/team.service";

interface InviteMemberFormProps {
  onCreated: () => void;
}

export default function InviteMemberForm({
  onCreated,
}: InviteMemberFormProps) {
  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [inviteLink, setInviteLink] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setInviteLink("");

    const normalizedName =
      fullName.trim();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedName) {
      setError(
        "Please enter the team member's full name."
      );
      return;
    }

    if (!normalizedEmail) {
      setError(
        "Please enter an email address."
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await createInvitation(
          normalizedName,
          normalizedEmail
        );

      const link =
        `${window.location.origin}/invite/${result.token}`;

      setInviteLink(link);
      setFullName("");
      setEmail("");

      onCreated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not create invitation."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!inviteLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        inviteLink
      );
    } catch {
      setError(
        "Could not copy the link. Please copy it manually."
      );
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
      <div className="mb-3">
        <h2 className="text-[15px] font-bold text-slate-950">
          Invite team member
        </h2>

        <p className="mt-0.5 text-[12px] text-slate-500">
          Add a staff member. Invitations
          expire after 7 days.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-2.5 md:grid-cols-[1fr_1.2fr_auto]"
      >
        <input
          type="text"
          value={fullName}
          onChange={(event) =>
            setFullName(
              event.target.value
            )
          }
          disabled={loading}
          placeholder="Full name"
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
        />

        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
          disabled={loading}
          placeholder="employee@example.com"
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="h-10 rounded-lg bg-blue-600 px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Creating..."
            : "Create invitation"}
        </button>
      </form>

      {(error || inviteLink) && (
        <div className="mt-3">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">
              {error}
            </div>
          )}

          {inviteLink && (
            <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
              <p className="min-w-0 flex-1 truncate text-[12px] text-blue-700">
                {inviteLink}
              </p>

              <button
                type="button"
                onClick={() =>
                  void handleCopy()
                }
                className="shrink-0 rounded-md bg-white px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 shadow-sm"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}