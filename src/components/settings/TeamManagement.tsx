
"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  Loader2,
} from "lucide-react";

import type { TeamRole, TeamMember } from "@/src/types/team.types";

import {
  useTeamMembers,
  useCreateTeamMember,
  useUpdateTeamRole,
  useRemoveTeamMember,
} from "@/src/hooks/useTeam";

type AssignableTeamRole = "MANAGER" | "EMPLOYEE";

function isAssignableTeamRole(role: string): role is AssignableTeamRole {
  return role === "MANAGER" || role === "EMPLOYEE";
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

interface TeamManagementProps {
  currentUserRole: TeamRole;
}

export default function TeamManagement({
  currentUserRole,
}: TeamManagementProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AssignableTeamRole>("EMPLOYEE");

  const {
    data: members = [],
    isLoading,
    isError,
    error: membersError,
  } = useTeamMembers();

  const createMutation = useCreateTeamMember();
  const updateRoleMutation = useUpdateTeamRole();
  const removeMutation = useRemoveTeamMember();

  const isAdmin = currentUserRole === "ADMIN";

  async function handleCreateMember(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      toast.success("Team member created successfully");

      setName("");
      setEmail("");
      setPassword("");
      setRole("EMPLOYEE");
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Failed to create team member"),
      );
    }
  }

  async function handleRoleChange(
    member: TeamMember,
    newRole: AssignableTeamRole,
  ) {
    try {
      await updateRoleMutation.mutateAsync({
         memberId: member.id,
  input: {
    role: newRole,
  },
      });

      toast.success("Team member role updated");
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Failed to update team member role"),
      );
    }
  }

  async function handleRemove(member: TeamMember) {
    const confirmed = window.confirm(
      `Remove ${member.name} from this workspace?`,
    );

    if (!confirmed) return;

    try {
      await removeMutation.mutateAsync(member.id);
      toast.success("Team member deactivated");
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Failed to remove team member"),
      );
    }
  }

  return (
    <section className="space-y-6 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Users size={20} />
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Team Management
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage workspace members and their permissions.
          </p>
        </div>
      </div>

      {isAdmin && (
        <form
          onSubmit={handleCreateMember}
          className="space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800"
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <UserPlus size={16} />
            Add a Team Member
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label
                htmlFor="team-name"
                className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300"
              >
                Full Name
              </label>

              <input
                id="team-name"
                required
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter full name"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="team-email"
                className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300"
              >
                Email Address
              </label>

              <input
                id="team-email"
                type="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="member@example.com"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

          </div>

          <div>
            <label
              htmlFor="team-password"
              className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300"
            >
              Temporary Password
            </label>

            <input
              id="team-password"
              type="password"
              required
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter temporary password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Share this password securely with the team member.
            </p>
          </div>

          <div>
            <label
              htmlFor="team-role"
              className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300"
            >
              Assign Role
            </label>

            <select
              id="team-role"
              value={role}
              onChange={(event) => {
                if (isAssignableTeamRole(event.target.value)) {
                  setRole(event.target.value);
                }
              }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white sm:max-w-xs"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <UserPlus size={16} />
            )}

            {createMutation.isPending
              ? "Creating..."
              : "Add Team Member"}
          </button>
        </form>
      )}

      <div className="space-y-3">

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Workspace Members
          </h3>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {members.filter((member) => member.isActive).length} active
          </span>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 py-8 text-sm text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            Loading team members...
          </div>
        )}

        {isError && (
          <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
            {getErrorMessage(
              membersError,
              "Could not load team members. Please refresh and try again.",
            )}
          </p>
        )}

        {!isLoading && !isError && members.length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No team members found.
          </p>
        )}

        {members.map((member) => (
          <div
            key={member.id}
            className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                {member.name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </p>

                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {member.email}
                </p>

                <span className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Shield size={12} />
                  {member.role}
                  {!member.isActive && " · Inactive"}
                </span>
              </div>

            </div>

            {isAdmin && member.role !== "ADMIN" && member.isActive && (
              <div className="flex items-center gap-2">

                <select
                  aria-label={`Role for ${member.name}`}
                  value={member.role}
                  disabled={updateRoleMutation.isPending}
                  onChange={(event) => {
                    if (isAssignableTeamRole(event.target.value)) {
                      void handleRoleChange(member, event.target.value);
                    }
                  }}
                  className="min-w-0 rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleRemove(member)}
                  disabled={removeMutation.isPending}
                  aria-label={`Remove ${member.name}`}
                  title="Remove member"
                  className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                >
                  <Trash2 size={15} />
                </button>

              </div>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}
