
import { api } from "@/src/lib/api";

import type {
  TeamMember,
  UpdateTeamRoleInput,
} from "@/src/types/team.types";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CreateTeamMemberInput {
  name: string;
  email: string;
  password: string;
  role: "MANAGER" | "EMPLOYEE";
}

function getResponseData<T>(
  response: ApiResponse<T>,
  fallbackMessage: string,
): T {
  if (
    !response.success ||
    response.data === undefined ||
    response.data === null
  ) {
    throw new Error(response.message ?? fallbackMessage);
  }

  return response.data;
}

export const teamService = {
  // GET TEAM MEMBERS
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

  // CREATE TEAM MEMBER
  async createMember(
    input: CreateTeamMemberInput,
  ): Promise<TeamMember> {
    const response = await api.post<ApiResponse<TeamMember>>(
      "/team/members",
      input,
    );

    return getResponseData(
      response.data,
      "Failed to create team member.",
    );
  },

  // UPDATE MEMBER ROLE
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

  // REMOVE MEMBER
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
