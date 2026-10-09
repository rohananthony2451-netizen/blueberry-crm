"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  getPendingInvitations,
  getTeamMembers,
} from "../services/team.service";

import {
  PendingInvitation,
  TeamMember,
} from "../types";

import InviteMemberForm from "./InviteMemberForm";
import PendingInvitations from "./PendingInvitations";
import TeamMembersTable from "./TeamMembersTable";

interface TeamPageProps {
  embedded?: boolean;
}

export default function TeamPage({
  embedded = false,
}: TeamPageProps) {
  const [members, setMembers] =
    useState<TeamMember[]>([]);

  const [invitations, setInvitations] =
    useState<PendingInvitation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadTeam = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        teamMembers,
        pendingInvitations,
      ] = await Promise.all([
        getTeamMembers(),
        getPendingInvitations(),
      ]);

      setMembers(teamMembers);
      setInvitations(
        pendingInvitations
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load team information."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTeam();
  }, [loadTeam]);

  const adminCount = members.filter(
    (member) => member.role === "admin"
  ).length;

  const pendingCount =
    invitations.length;

  return (
    <main
  className={
    embedded
      ? "w-full max-w-[960px] space-y-4"
      : "mx-auto w-full max-w-7xl space-y-4"
  }
>
      {!embedded && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600">
            Workspace
          </p>

          <h1 className="mt-1 text-[24px] font-bold tracking-tight text-slate-950">
            Team
          </h1>

          <p className="mt-1 text-[13px] leading-5 text-slate-500">
            Manage the people who have access
            to your workspace.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          <div className="flex items-center justify-between gap-4">
            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                void loadTeam()
              }
              className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-red-700 hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex h-[72px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
            <Users
              size={17}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Members
            </p>

            <p className="mt-0.5 text-[18px] font-bold leading-5 text-slate-950">
              {members.length}
            </p>
          </div>
        </div>

        <div className="flex h-[72px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
            <ShieldCheck
              size={17}
              strokeWidth={1.9}
            />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Admins
            </p>

            <p className="mt-0.5 text-[18px] font-bold leading-5 text-slate-950">
              {adminCount}
            </p>
          </div>
        </div>

        <div className="flex h-[72px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-amber-600">
            <Mail
              size={17}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Pending invites
            </p>

            <p className="mt-0.5 text-[18px] font-bold leading-5 text-slate-950">
              {pendingCount}
            </p>
          </div>
        </div>
      </div>

      <InviteMemberForm
        onCreated={() =>
          void loadTeam()
        }
      />

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center">
          <p className="text-[13px] font-semibold text-slate-800">
            Loading team...
          </p>

          <p className="mt-1 text-[12px] text-slate-500">
            Fetching workspace members.
          </p>
        </div>
      ) : (
        <>
          <PendingInvitations
            invitations={invitations}
          />

          <TeamMembersTable
            members={members}
          />
        </>
      )}
    </main>
  );
}