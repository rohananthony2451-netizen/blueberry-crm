"use client";

import { useEffect, useState } from "react";

import {
  cancelInvitation,
  createInvitation,
} from "../services/team.service";

import { PendingInvitation } from "../types";

interface PendingInvitationsProps {
  invitations: PendingInvitation[];
}

export default function PendingInvitations({
  invitations,
}: PendingInvitationsProps) {
  const [visibleInvitations, setVisibleInvitations] =
    useState<PendingInvitation[]>(invitations);

  const [generatingId, setGeneratingId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [generatedLink, setGeneratedLink] =
    useState<string | null>(null);

  const [generatedEmail, setGeneratedEmail] =
    useState<string | null>(null);

  const [copied, setCopied] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    setVisibleInvitations(invitations);
  }, [invitations]);

  async function handleGenerateNewLink(
    invitation: PendingInvitation
  ) {
    setGeneratingId(invitation.id);
    setGeneratedLink(null);
    setGeneratedEmail(null);
    setCopied(false);
    setError("");

    try {
      const result = await createInvitation(
  invitation.fullName,
  invitation.email
);

      const link =
        `${window.location.origin}/invite/${result.token}`;

      setGeneratedLink(link);
      setGeneratedEmail(result.email);

      /*
       * The create invitation RPC replaces the previous
       * pending invitation for the same email.
       *
       * Update local state immediately so the UI does not
       * need to refresh/remount.
       */
      setVisibleInvitations((current) =>
        current.map((item) =>
          item.id === invitation.id
            ? {
                ...item,
                id: result.invitationId,
                expiresAt: result.expiresAt,
              }
            : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not generate a new invitation link."
      );
    } finally {
      setGeneratingId(null);
    }
  }

  async function handleDelete(
    invitation: PendingInvitation
  ) {
    const confirmed =
      window.confirm(
        `Delete the pending invitation for ${invitation.email}?\n\nThe current invitation link will immediately stop working.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(invitation.id);
    setError("");

    try {
      await cancelInvitation(invitation.id);

      setVisibleInvitations((current) =>
        current.filter(
          (item) => item.id !== invitation.id
        )
      );

      setGeneratedLink(null);
      setGeneratedEmail(null);
      setCopied(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete the invitation."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCopy() {
    if (!generatedLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        generatedLink
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Could not copy the link. Please copy it manually from the field."
      );
    }
  }

  if (visibleInvitations.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="font-semibold text-slate-900">
          Pending invitations
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Invitations that have not been accepted yet.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {visibleInvitations.map((invitation) => {
          const generating =
            generatingId === invitation.id;

          const deleting =
            deletingId === invitation.id;

          const busy =
            generating || deleting;

          return (
            <div
              key={invitation.id}
              className="px-6 py-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">
  {invitation.fullName}
</p>

<p className="mt-1 text-xs text-slate-500">
  {invitation.email}
</p>

                  <p className="mt-1 text-xs text-slate-500">
  Staff · Expires{" "}
  {new Date(
    invitation.expiresAt
  ).toLocaleDateString("en-IN")}
</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Pending
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      void handleGenerateNewLink(
                        invitation
                      )
                    }
                    disabled={busy}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {generating
                      ? "Generating..."
                      : "Generate new link"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void handleDelete(
                        invitation
                      )
                    }
                    disabled={busy}
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleting
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {generatedLink && (
        <div className="border-t border-blue-100 bg-blue-50 px-6 py-5">
          <p className="text-sm font-semibold text-blue-900">
            New invitation link generated
          </p>

          {generatedEmail && (
            <p className="mt-1 text-xs text-blue-700">
              For {generatedEmail}
            </p>
          )}

          <p className="mt-1 text-xs text-blue-700">
            The previous pending link has been replaced.
          </p>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={generatedLink}
              readOnly
              className="h-10 min-w-0 flex-1 rounded-lg border border-blue-200 bg-white px-3 text-xs text-slate-700 outline-none"
            />

            <button
              type="button"
              onClick={() => void handleCopy()}
              className="h-10 rounded-lg border border-blue-200 bg-white px-4 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}