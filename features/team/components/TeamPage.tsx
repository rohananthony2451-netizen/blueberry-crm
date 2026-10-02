"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getPendingInvitations,
  getTeamMembers,
} from "../services/team.service";

import { PendingInvitation, TeamMember } from "../types";

import InviteMemberForm from "./InviteMemberForm";
import PendingInvitations from "./PendingInvitations";
import TeamMembersTable from "./TeamMembersTable";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<
    PendingInvitation[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeam = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [teamMembers, pendingInvitations] =
        await Promise.all([
          getTeamMembers(),
          getPendingInvitations(),
        ]);

      setMembers(teamMembers);
      setInvitations(pendingInvitations);
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

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Workspace
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Team
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Manage the people who have access to your EventOS
          workspace.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => void loadTeam()}
            className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      <InviteMemberForm onCreated={() => void loadTeam()} />

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="font-medium text-slate-800">
            Loading team...
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Fetching workspace members.
          </p>
        </div>
      ) : (
        <>
          <PendingInvitations invitations={invitations} />

          <TeamMembersTable members={members} />
        </>
      )}
    </main>
  );
}