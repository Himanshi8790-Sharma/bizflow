import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamService } from "@/src/services/team.service";
import type { UpdateTeamRoleInput } from "@/src/types/team.types";

export interface CreateTeamMemberInput {
  name: string;
  email: string;
  password: string;
  role: "MANAGER" | "EMPLOYEE";
}

export const teamKeys = {
  all: ["team"] as const,
  members: () => [...teamKeys.all, "members"] as const,
};

export function useTeamMembers() {
  return useQuery({
    queryKey: teamKeys.members(),
    queryFn: () => teamService.getMembers(),
  });
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTeamMemberInput) =>
      teamService.createMember(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teamKeys.all,
      });
    },
  });
}

export function useUpdateTeamRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      input,
    }: {
      memberId: string;
      input: UpdateTeamRoleInput;
    }) => teamService.updateMemberRole(memberId, input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teamKeys.all,
      });
    },
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) =>
      teamService.removeMember(memberId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teamKeys.all,
      });
    },
  });
}