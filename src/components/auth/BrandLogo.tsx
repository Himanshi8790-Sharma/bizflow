"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export function BrandLogo({ size = "md", showTagline = false }: BrandLogoProps) {
  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-11 w-11 text-base",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className="group inline-flex items-center gap-3 transition-opacity hover:opacity-95">
      <div className={`relative flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-black shadow-md shadow-primary/25 transition-transform duration-300 group-hover:scale-105 ${sizeClasses[size]}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/5 h-3/5"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <div className="absolute inset-0 rounded-xl bg-linear-to-tr from-white/20 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-foreground ${textClasses[size]}`}>
          Biz<span className="text-primary">Flow</span>
        </span>
        {showTagline && (
          <span className="text-xs font-medium text-muted-foreground">
            Intelligent Business Suite
          </span>
        )}
      </div>
    </Link>
  );
}
