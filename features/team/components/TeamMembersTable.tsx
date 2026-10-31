
"use client";

import { useState } from "react";
import {
  UserRound,
  MoreHorizontal,
  ShieldCheck,
  ShieldOff,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { TeamMember } from "../types";
import { setStaffDisabled } from "../services/team.service";

interface TeamMembersTableProps {
  members: TeamMember[];
  onMemberUpdated: () => Promise<void> | void;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TeamMembersTable({
  members,
  onMemberUpdated,
}: TeamMembersTableProps) {
  const [busyMemberId, setBusyMemberId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(member: TeamMember) {
    const nextDisabled = !member.isDisabled;
    const action = nextDisabled ? "disable" : "re-enable";

    const confirmed = window.confirm(
      nextDisabled
        ? `Disable access for ${member.fullName}? They will no longer be able to access Eventify. Their existing records will be preserved.`
        : `Re-enable access for ${member.fullName}?`
    );

    if (!confirmed) return;

    setBusyMemberId(member.id);
    setError(null);

    try {
      await setStaffDisabled(member.id, nextDisabled);
      await onMemberUpdated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Could not ${action} this staff member.`
      );
    } finally {
      setBusyMemberId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <div>
          <h2 className="text-[15px] font-bold text-slate-950">
            Team members
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            People who have access to this workspace.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
          {members.length} {members.length === 1 ? "member" : "members"}
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 border-b border-red-100 bg-red-50 px-5 py-3 text-[12px] text-red-700"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[660px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
              <th className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                Member
              </th>
              <th className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                Role
              </th>
              <th className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                Joined
              </th>
              <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                Status
              </th>
              <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                Access
              </th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => {
              const isBusy = busyMemberId === member.id;
              const isStaff = member.role === "staff";

              return (
                <tr
                  key={member.id}
                  className={`border-b border-slate-100 last:border-0 ${
                    member.isDisabled ? "bg-slate-50/70" : ""
                  }`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600">
                        {getInitials(member.fullName)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-slate-900">
                          {member.fullName}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-slate-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={
                        member.role === "admin"
                          ? "inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700"
                          : "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                      }
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {member.role === "admin" ? "Admin" : "Staff"}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-[12px] text-slate-500">
                    {new Date(member.createdAt).toLocaleDateString("en-IN")}
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={
                        member.isDisabled
                          ? "inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700"
                          : "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
                      }
                    >
                      {member.isDisabled ? "Disabled" : "Active"}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-right">
                    {isStaff ? (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleStatusChange(member)}
                        className={
                          member.isDisabled
                            ? "inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                            : "inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-[11px] font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                        }
                      >
                        {isBusy ? (
                          <LoaderCircle size={13} className="animate-spin" />
                        ) : member.isDisabled ? (
                          <ShieldCheck size={13} />
                        ) : (
                          <ShieldOff size={13} />
                        )}
                        {isBusy
                          ? "Updating..."
                          : member.isDisabled
                            ? "Re-enable"
                            : "Disable"}
                      </button>
                    ) : (
                      <UserRound
                        size={15}
                        strokeWidth={1.7}
                        className="ml-auto text-slate-300"
                      />
                    )}
                  </td>
                </tr>
              );
            })}

            {members.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-[12px] text-slate-500"
                >
                  No team members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
