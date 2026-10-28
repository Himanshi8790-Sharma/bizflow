export type TeamRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  isActive: boolean;
  createdAt: string;
}

export interface CreateInvitationInput {
  name: string;
  email: string;
  role: "MANAGER" | "EMPLOYEE";
}

export interface AcceptInvitationInput {
  token: string;
  password: string;
}

export interface UpdateTeamRoleInput {
  role: "MANAGER" | "EMPLOYEE";
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: "MANAGER" | "EMPLOYEE";
  expiresAt: string;
  message: string;
}