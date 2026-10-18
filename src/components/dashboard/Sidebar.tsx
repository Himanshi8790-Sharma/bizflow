"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Boxes,
  Receipt,
  Sparkles,
  Settings,
  Building2,
  LogOut,
} from "lucide-react";
import { useMe, useLogout } from "@/src/hooks/useAuth";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "Inventory",
    href: "/dashboard/inventory",
    icon: Boxes,
  },
  {
    name: "Expenses",
    href: "/dashboard/expenses",
    icon: Receipt,
  },
  {
    name: "AI Assistant",
    href: "/dashboard/ai-assistant",
    icon: Sparkles,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, isError } = useMe();
  const logoutMutation = useLogout();

  const userName = data?.user?.name ?? "User";
  const userRole = data?.user?.role ?? "";
  const organizationName =
    data?.organization?.name ?? "Business Account";

  const initial = userName.charAt(0).toUpperCase();

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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard navigation"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col border-r border-gray-200/80 bg-white/95 px-4 py-5 shadow-lg backdrop-blur-md transition-transform duration-300 ease-in-out dark:border-gray-800/80 dark:bg-gray-950/95 dark:shadow-2xl md:sticky md:top-0 md:z-30 md:h-screen md:w-64 md:max-w-none md:translate-x-0 md:shadow-none md:transition-none ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="mb-6 flex items-center justify-between px-2">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-lg font-bold text-white shadow-md shadow-indigo-500/25 transition-transform duration-200 group-hover:scale-105">
              B
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                  BizFlow
                </span>
                <span className="rounded-sm bg-indigo-50 px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                  Pro
                </span>
              </div>

              <p className="text-[11px] font-medium text-gray-400">
                Business Management
              </p>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Label */}
        <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Main Workspace
        </p>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(`${item.href}/`));

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-xs dark:bg-indigo-500/15 dark:text-indigo-300"
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="shrink-0 border-t border-gray-200/80 pt-3 dark:border-gray-800/80">
          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-150 ${
              pathname.startsWith("/dashboard/settings")
                ? "bg-indigo-50 text-indigo-700 shadow-xs dark:bg-indigo-500/15 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <Settings size={18} className="shrink-0 text-gray-400" />
            <span>Settings</span>
          </Link>

          {/* User Profile Card */}
          <div className="mt-3 flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-gray-100 bg-gray-50/80 p-2.5 dark:border-gray-800 dark:bg-gray-900/60">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-xs font-bold text-white shadow-xs">
                {isLoading ? (
                  "..."
                ) : isError ? (
                  <Building2 size={16} />
                ) : (
                  initial
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-gray-900 dark:text-white">
                  {isLoading
                    ? "Loading..."
                    : isError
                      ? "Profile unavailable"
                      : userName}
                </p>

                <p className="truncate text-[10px] font-medium text-gray-400 dark:text-gray-400">
                  {userRole ? userRole : organizationName}
                </p>
              </div>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              aria-label="Sign out"
              title="Sign out"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}