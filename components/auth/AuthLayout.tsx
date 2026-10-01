"use client";

import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { BrandLogo } from "./BrandLogo";
import { MarketingPanel } from "./MarketingPanel";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-12 bg-background text-foreground overflow-x-hidden">
      {/* Left Column: Visual / Marketing Section (Desktop) */}
      <div className="lg:col-span-6 xl:col-span-7 hidden lg:block">
        <MarketingPanel />
      </div>

      {/* Right Column: Authentication Form */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-4 sm:p-6 lg:p-8 xl:p-10 min-h-screen">
        {/* Top Header Controls */}
        <div className="flex items-center justify-between w-full mb-4 sm:mb-6">
          {/* Mobile Logo */}
          <div className="lg:hidden">
            <BrandLogo size="sm" />
          </div>

          <div className="hidden lg:block">
            {/* Desktop top left indicator */}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] text-muted-foreground hidden sm:inline-block font-medium">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Main Form Content Container */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-2 animate-fade-in-rise">
          {/* Header */}
          <div className="mb-5 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-normal">
              {subtitle}
            </p>
          </div>

          {/* Form Child Component */}
          {children}
        </div>

        {/* Footer info */}
        {/* <div className="mt-6 pt-3 text-center text-[11px] text-muted-foreground border-t border-border/40">
          <p>© {new Date().getFullYear()} BizFlow Inc. All rights reserved.</p>
          <div className="flex items-center justify-center gap-3 mt-1 text-[10px]">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Help Center
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
}
