"use client";

import { TeamMember } from "../types";

interface TeamMembersTableProps {
  members: TeamMember[];
}

export default function TeamMembersTable({
  members,
}: TeamMembersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="font-semibold text-slate-900">
          Team members
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          People who currently have access to this workspace.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left">
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Member
              </th>

              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role
              </th>

              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Joined
              </th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900">
                      {member.fullName}
                    </p>

                    <p className="mt-0.5 text-sm text-slate-500">
                      {member.email}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={
                      member.role === "admin"
                        ? "inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                        : "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                    }
                  >
                    {member.role === "admin"
                      ? "Admin"
                      : "Staff"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(
                    member.createdAt
                  ).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}

            {members.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-sm text-slate-500"
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