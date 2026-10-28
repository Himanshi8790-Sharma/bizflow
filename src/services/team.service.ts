import { api } from "@/src/lib/api";

import type {
  TeamMember,
  CreateInvitationInput,
  AcceptInvitationInput,
  UpdateTeamRoleInput,
  TeamInvitation,
} from "@/src/types/team.types";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

function getResponseData<T>(
  response: ApiResponse<T>,
  fallbackMessage: string,
): T {
  if (!response.success || response.data === undefined || response.data === null) {
    throw new Error(response.message ?? fallbackMessage);
  }

  return response.data;
}

export const teamService = {
  async getMembers(): Promise<TeamMember[]> {
    const response = await api.get<ApiResponse<TeamMember[]>>("/team");
    const members = getResponseData(
      response.data,
      "The team API returned an unsuccessful response.",
    );

    if (!Array.isArray(members)) {
      throw new Error("The team API returned an invalid members list.");
    }

    return members;
  },

  async createInvitation(
    input: CreateInvitationInput,
  ): Promise<TeamInvitation> {
    const response = await api.post<ApiResponse<TeamInvitation>>(
      "/team/invitations",
      input,
    );

    return getResponseData(
      response.data,
      "The team invitation API returned an unsuccessful response.",
    );
  },

  async acceptInvitation(
    input: AcceptInvitationInput,
  ): Promise<TeamMember> {
    const response = await api.post<ApiResponse<TeamMember>>(
      "/team/invitations/accept",
      input,
    );

    return getResponseData(
      response.data,
      "The invitation acceptance API returned an unsuccessful response.",
    );
  },

  async updateMemberRole(
    memberId: string,
    input: UpdateTeamRoleInput,
  ): Promise<TeamMember> {
    const response = await api.patch<ApiResponse<TeamMember>>(
      `/team/${encodeURIComponent(memberId)}/role`,
      input,
    );

    return getResponseData(
      response.data,
      "The team role API returned an unsuccessful response.",
    );
  },

  async removeMember(memberId: string): Promise<TeamMember> {
    const response = await api.delete<ApiResponse<TeamMember>>(
      `/team/${encodeURIComponent(memberId)}`,
    );

    return getResponseData(
      response.data,
      "The team removal API returned an unsuccessful response.",
    );
  },
};