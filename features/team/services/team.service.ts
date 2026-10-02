import { createClient } from "@/lib/supabase/client";

import {
  CreateInvitationResult,
  PendingInvitation,
  TeamMember,
} from "../types";

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  created_at: string;
};

type InvitationRow = {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  created_at: string;
};

function mapMember(row: ProfileRow): TeamMember {
  return {
    id: row.id,
    fullName: row.full_name?.trim() || "Unnamed member",
    email: row.email ?? "",
    role: row.role === "admin" ? "admin" : "staff",
    createdAt: row.created_at,
  };
}

function mapInvitation(row: InvitationRow): PendingInvitation {
  return {
    id: row.id,
    email: row.email,
    role: row.role === "admin" ? "admin" : "staff",
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(
    (row) => mapMember(row as ProfileRow)
  );
}

export async function getPendingInvitations(): Promise<
  PendingInvitation[]
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("workspace_invitations")
    .select("id, email, role, expires_at, created_at")
    .is("accepted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const now = Date.now();

  return (data ?? [])
    .map((row) => mapInvitation(row as InvitationRow))
    .filter(
      (invitation) =>
        new Date(invitation.expiresAt).getTime() > now
    );
}

export async function createInvitation(
  email: string
): Promise<CreateInvitationResult> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "create_workspace_invitation",
    {
      p_email: email.trim().toLowerCase(),
      p_role: "staff",
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("The invitation could not be created.");
  }

  return {
    invitationId: data.invitation_id,
    email: data.email,
    role: data.role,
    token: data.token,
    expiresAt: data.expires_at,
  };
}

export async function acceptInvitation(
  token: string
) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "accept_workspace_invitation",
    {
      p_token: token,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}