export type TeamRole = "admin" | "staff";

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: TeamRole;
  createdAt: string;
}

export interface PendingInvitation {
  id: string;
  fullName: string;
  email: string;
  role: TeamRole;
  expiresAt: string;
  createdAt: string;
}

export interface CreateInvitationResult {
  invitationId: string;
  fullName: string;
  email: string;
  role: TeamRole;
  token: string;
  expiresAt: string;
}