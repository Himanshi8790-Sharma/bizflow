"use client";

import { useRouter } from "next/navigation";
import {
  Settings,
  Building2,
  User,
  Shield,
  Palette,
  Sun,
  Moon,
  Laptop,
  LogOut,
  Check,
} from "lucide-react";

import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import { useMe, useLogout } from "@/src/hooks/useAuth";
import { useTheme } from "@/src/components/providers/ThemeProvider";
import { toast } from "sonner";

import TeamManagement from "@/src/components/settings/TeamManagement";
import type { TeamRole } from "@/src/types/team.types";

function isTeamRole(role: string): role is TeamRole {
  return role === "ADMIN" || role === "MANAGER" || role === "EMPLOYEE";
}

export default function SettingsPage() {
  const router = useRouter();
  const { data, isLoading } = useMe();
  const { theme, setTheme } = useTheme();
  const logoutMutation = useLogout();

  const userName = data?.user?.name ?? "User";
  const userEmail = data?.user?.email ?? "";
  const userRole = data?.user?.role ?? "EMPLOYEE";
  const orgName = data?.organization?.name ?? "Organization";
  const orgId = data?.organization?.id ?? "";

  const normalizedUserRole = userRole.trim().toUpperCase();
  const currentUserRole = isTeamRole(normalizedUserRole)
    ? normalizedUserRole
    : undefined;

  const formattedRole = userRole
    ? userRole.charAt(0) + userRole.slice(1).toLowerCase()
    : "Member";

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Successfully logged out");
      router.replace("/login");
    } catch {
      toast.error("Logout error occurred. Redirecting to login...");
      router.replace("/login");
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-200/80 pb-6 dark:border-gray-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-500/10 dark:text-indigo-400">
            <Settings size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              Account & Workspace Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your personal credentials, organizational details, and display preferences.
            </p>
          </div>
        </div>

        {/* 1. Organization Profile */}
        <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <Building2
              size={18}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Organization Details
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                Organization Name
              </label>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {isLoading ? "Loading..." : orgName}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                Workspace ID
              </label>
              <p className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-300">
                {isLoading ? "..." : orgId || "Standard Workspace"}
              </p>
            </div>

            <div className="sm:col-span-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active Organization
              </span>
            </div>
          </div>
        </section>

        {/* 2. Team Management */}
        {currentUserRole === "ADMIN" && (
          <TeamManagement currentUserRole={currentUserRole} />
        )}

        {/* 3. User Profile */}
        <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <User
              size={18}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              User Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                Full Name
              </label>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {isLoading ? "Loading..." : userName}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                Email Address
              </label>
              <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                {isLoading ? "Loading..." : userEmail}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                Role & Permissions
              </label>
              <div className="mt-1.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <Shield size={13} />
                  {formattedRole}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Theme & Appearance */}
        <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2">
            <Palette
              size={18}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Interface Theme
            </h2>
          </div>

          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            Choose your preferred color theme across the entire application workspace.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Light */}
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                theme === "light"
                  ? "border-indigo-600 bg-indigo-50/50 shadow-xs dark:border-indigo-500"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    Light
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Clean bright background
                  </p>
                </div>
              </div>
              {theme === "light" && (
                <Check size={16} className="text-indigo-600" />
              )}
            </button>

            {/* Dark */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                theme === "dark"
                  ? "border-indigo-600 bg-indigo-50/50 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/30"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    Dark
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Deep obsidian palette
                  </p>
                </div>
              </div>
              {theme === "dark" && (
                <Check size={16} className="text-indigo-600" />
              )}
            </button>

            {/* System */}
            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                theme === "system"
                  ? "border-indigo-600 bg-indigo-50/50 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/30"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Laptop className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    System
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Sync with OS preference
                  </p>
                </div>
              </div>
              {theme === "system" && (
                <Check size={16} className="text-indigo-600" />
              )}
            </button>
          </div>
        </section>

        {/* 5. Session & Security */}
        <section className="rounded-2xl border border-red-200/80 bg-red-50/20 p-6 shadow-xs dark:border-red-950/40 dark:bg-red-950/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Sign Out of Workspace
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Terminate your active browser session on this device.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-red-700 disabled:opacity-50"
            >
              <LogOut size={15} />
              {logoutMutation.isPending
                ? "Signing out..."
                : "Sign Out"}
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}