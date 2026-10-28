import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { teamService } from "@/src/services/team.service";

import type {
  CreateInvitationInput,
  AcceptInvitationInput,
  UpdateTeamRoleInput,
} from "@/src/types/team.types";

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

export function useCreateTeamInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateInvitationInput) =>
      teamService.createInvitation(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teamKeys.all,
      });
    },
  });
}

export function useAcceptTeamInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AcceptInvitationInput) =>
      teamService.acceptInvitation(input),
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
      data,
    }: {
      memberId: string;
      data: UpdateTeamRoleInput;
    }) => teamService.updateMemberRole(memberId, data),

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