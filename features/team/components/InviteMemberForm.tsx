"use client";

import { FormEvent, useState } from "react";

import { createInvitation } from "../services/team.service";

interface InviteMemberFormProps {
  onCreated: () => void;
}

export default function InviteMemberForm({
  onCreated,
}: InviteMemberFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setInviteLink("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter an email address.");
      return;
    }

    setLoading(true);

    try {
      const result = await createInvitation(
        normalizedEmail
      );

      const link = `${window.location.origin}/invite/${result.token}`;

      setInviteLink(link);
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
    if (!inviteLink) return;

    await navigator.clipboard.writeText(inviteLink);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Invite team member
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Send a secure invitation to a staff member.
          The invitation expires after 7 days.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="employee@example.com"
          disabled={loading}
          className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create invitation"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {inviteLink && (
        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">
            Invitation created
          </p>

          <p className="mt-1 text-xs text-blue-700">
            Copy this link and send it to the employee.
          </p>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={inviteLink}
              readOnly
              className="h-10 min-w-0 flex-1 rounded-lg border border-blue-200 bg-white px-3 text-xs text-slate-700 outline-none"
            />

            <button
              type="button"
              onClick={handleCopy}
              className="h-10 rounded-lg border border-blue-200 bg-white px-4 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              Copy link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}