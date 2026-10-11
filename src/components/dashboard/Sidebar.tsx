"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

import { useMe } from "@/src/hooks/useAuth";

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

  const { data, isLoading, isError } = useMe();

  const userName = data?.user?.name ?? "User";
  const organizationName =
    data?.organization?.name ?? "Business Account";

  const initial = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard navigation"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col border-r border-gray-200 bg-white px-4 py-6 transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950 md:sticky md:top-0 md:z-30 md:h-screen md:w-64 md:max-w-none md:translate-x-0 md:transition-none ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="mb-9 flex items-center justify-between px-2">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
              B
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                BizFlow
              </h1>

              <p className="text-xs text-gray-500">
                Business Management
              </p>
            </div>
          </Link>

          {/* Close button only on mobile */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Label */}
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </p>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
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
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
                }`}
              >
                <Icon size={19} className="shrink-0" />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="shrink-0 border-t border-gray-200 pt-4 dark:border-gray-800">
          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
              pathname.startsWith("/dashboard/settings")
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
            }`}
          >
            <Settings size={19} className="shrink-0" />
            Settings
          </Link>

          {/* User Profile */}
          <div className="mt-4 flex min-w-0 items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              {isLoading ? (
                "..."
              ) : isError ? (
                <Building2 size={18} />
              ) : (
                initial
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {isLoading
                  ? "Loading profile..."
                  : isError
                    ? "Profile unavailable"
                    : userName}
              </p>

              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {organizationName}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}