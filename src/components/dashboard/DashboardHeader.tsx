"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  LogOut,
  Settings,
  User,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useMe, useLogout } from "@/src/hooks/useAuth";
import { ThemeToggle } from "@/src/components/auth/ThemeToggle";
import { toast } from "sonner";

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
}

function getHeaderInfo(pathname: string): { breadcrumb: string; title: string } {
  if (pathname === "/dashboard") {
    return { breadcrumb: "Workspace / Overview", title: "Dashboard" };
  }
  if (pathname === "/dashboard/customers") {
    return { breadcrumb: "Workspace / CRM", title: "Customers" };
  }
  if (pathname === "/dashboard/products") {
    return { breadcrumb: "Workspace / Catalog", title: "Products" };
  }
  if (pathname === "/dashboard/orders/new") {
    return { breadcrumb: "Workspace / Orders", title: "Create New Order" };
  }
  if (pathname.startsWith("/dashboard/orders/") && pathname !== "/dashboard/orders") {
    return { breadcrumb: "Workspace / Orders", title: "Order Details" };
  }
  if (pathname === "/dashboard/orders") {
    return { breadcrumb: "Workspace / Fulfillment", title: "Orders" };
  }
  if (pathname === "/dashboard/inventory") {
    return { breadcrumb: "Workspace / Operations", title: "Inventory" };
  }
  if (pathname === "/dashboard/expenses") {
    return { breadcrumb: "Workspace / Financials", title: "Expenses" };
  }
  if (pathname === "/dashboard/ai-assistant") {
    return { breadcrumb: "Workspace / Intelligence", title: "AI Assistant" };
  }
  if (pathname === "/dashboard/settings") {
    return { breadcrumb: "Workspace / Preferences", title: "Settings" };
  }

  return { breadcrumb: "Workspace", title: "BizFlow" };
}

export default function DashboardHeader({
  isSidebarOpen,
  onMenuToggle,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, isError } = useMe();
  const logoutMutation = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { breadcrumb, title } = getHeaderInfo(pathname);

  const userName = data?.user?.name ?? "User";
  const userEmail = data?.user?.email ?? "";
  const userRole = data?.user?.role ?? "";
  const orgName = data?.organization?.name ?? "Organization";
  const initial = userName.charAt(0).toUpperCase();

  const formattedRole = userRole
    ? userRole.charAt(0) + userRole.slice(1).toLowerCase()
    : "Member";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Signed out successfully");
      router.replace("/login");
    } catch {
      toast.error("Sign out encountered an issue. Redirecting to login...");
      router.replace("/login");
    }
  }

  return (
    <header className="sticky top-0 z-30 flex min-h-[72px] w-full min-w-0 items-center justify-between gap-3 border-b border-gray-200/80 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6 md:px-8 dark:border-gray-800 dark:bg-gray-950/80">
      {/* Mobile Menu Toggle Button */}
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-controls="dashboard-sidebar"
        aria-expanded={isSidebarOpen}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-card text-gray-700 shadow-xs hover:bg-gray-100 md:hidden dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Dynamic Route Title & Breadcrumb */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
          {breadcrumb}
        </p>

        <h1 className="truncate text-lg font-bold tracking-tight text-gray-900 sm:text-xl dark:text-white">
          {title}
        </h1>
      </div>

      {/* Right Controls: Theme Toggle & User Menu */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Theme Switcher */}
        <ThemeToggle />

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-label="User account menu"
            aria-expanded={isDropdownOpen}
            className="flex items-center gap-2 rounded-xl p-1.5 transition-all hover:bg-gray-100 sm:gap-3 dark:hover:bg-gray-900"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-sm font-bold text-white shadow-xs">
              {isLoading ? "…" : initial}
            </div>

            {/* User Details */}
            <div className="hidden flex-col items-start text-left sm:flex">
              <span className="max-w-[140px] truncate text-xs font-semibold leading-tight text-gray-900 dark:text-white">
                {isLoading ? "Loading..." : isError ? "User" : userName}
              </span>

              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                {isLoading ? "..." : formattedRole}
              </span>
            </div>

            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-gray-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-fade-in-rise dark:border-gray-800 dark:bg-gray-900">
              {/* Account Header */}
              <div className="border-b border-gray-100 p-3 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {userName}
                </p>
                <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                  {userEmail}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                    <Shield size={10} />
                    {formattedRole}
                  </span>

                  <span className="max-w-[120px] truncate text-[11px] text-gray-400">
                    {orgName}
                  </span>
                </div>
              </div>

              {/* Navigation links */}
              <div className="py-1">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Settings size={15} className="text-gray-400" />
                  Account Settings
                </Link>
              </div>

              {/* Logout button */}
              <div className="border-t border-gray-100 pt-1 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    void handleLogout();
                  }}
                  disabled={logoutMutation.isPending}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <LogOut size={15} />
                  {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}