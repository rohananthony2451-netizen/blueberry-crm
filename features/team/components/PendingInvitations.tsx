"use client";

import { PendingInvitation } from "../types";

interface PendingInvitationsProps {
  invitations: PendingInvitation[];
}

export default function PendingInvitations({
  invitations,
}: PendingInvitationsProps) {
  if (invitations.length === 0) {
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
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium text-slate-900">
                {invitation.email}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Staff · Expires{" "}
                {new Date(
                  invitation.expiresAt
                ).toLocaleDateString("en-IN")}
              </p>
            </div>

            <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Pending
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}