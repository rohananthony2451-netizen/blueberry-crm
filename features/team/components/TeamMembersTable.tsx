"use client";

import {
  UserRound,
} from "lucide-react";

import { TeamMember } from "../types";

interface TeamMembersTableProps {
  members: TeamMember[];
}

function getInitials(
  name: string
) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

export default function TeamMembersTable({
  members,
}: TeamMembersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <div>
          <h2 className="text-[15px] font-bold text-slate-950">
            Team members
          </h2>

          <p className="mt-0.5 text-[12px] text-slate-500">
            People who currently have
            access to this workspace.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
          {members.length}{" "}
          {members.length === 1
            ? "member"
            : "members"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
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

              <th className="w-10 px-3 py-2.5" />
            </tr>
          </thead>

          <tbody>
            {members.map(
              (member) => (
                <tr
                  key={member.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600">
                        {getInitials(
                          member.fullName
                        )}
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
                        member.role ===
                        "admin"
                          ? "inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700"
                          : "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                      }
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />

                      {member.role ===
                      "admin"
                        ? "Admin"
                        : "Staff"}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-[12px] text-slate-500">
                    {new Date(
                      member.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-3 py-3 text-right">
                    <UserRound
                      size={15}
                      strokeWidth={1.7}
                      className="ml-auto text-slate-300"
                    />
                  </td>
                </tr>
              )
            )}

            {members.length ===
              0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-8 text-center text-[12px] text-slate-500"
                >
                  No team members
                  found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}