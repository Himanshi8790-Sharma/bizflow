"use client";

import { Menu, X } from "lucide-react";
import { useMe } from "@/src/hooks/useAuth";

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
}

export default function DashboardHeader({
  isSidebarOpen,
  onMenuToggle,
}: DashboardHeaderProps) {
  const { data, isLoading, isError } = useMe();

  const userName = data?.user?.name ?? "User";
  const userRole = data?.user?.role ?? "";
  const initial = userName.charAt(0).toUpperCase();

  const formattedRole = userRole
    ? userRole.charAt(0) + userRole.slice(1).toLowerCase()
    : "";

  return (
    <header className="flex min-h-[76px] w-full min-w-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6 md:px-8 dark:border-gray-800 dark:bg-gray-950">
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-controls="dashboard-sidebar"
        aria-expanded={isSidebarOpen}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {isSidebarOpen ? <X size={23} /> : <Menu size={23} />}
      </button>

      {/* Page Title */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-gray-500 sm:text-sm dark:text-gray-400">
          Workspace / Overview
        </p>

        <h2 className="mt-1 text-lg font-bold leading-6 text-gray-900 sm:text-xl dark:text-white">
          Dashboard
        </h2>
      </div>

      {/* User Profile */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-sm font-bold text-indigo-700 sm:h-11 sm:w-11 sm:text-base dark:border-indigo-400/20 dark:bg-indigo-500/15 dark:text-indigo-300">
          {isLoading ? "…" : initial}
        </div>

        {/* User Details */}
        <div className="flex min-w-0 flex-col justify-center">
          <p className="max-w-[115px] truncate text-xs font-semibold leading-5 text-gray-900 sm:max-w-[180px] sm:text-sm md:max-w-none dark:text-white">
            {isLoading
              ? "Loading..."
              : isError
                ? "Unavailable"
                : userName}
          </p>

          <p className="text-[11px] font-medium leading-4 text-gray-500 sm:text-xs dark:text-gray-400">
            {isLoading ? " " : formattedRole}
          </p>
        </div>
      </div>
    </header>
  );
}