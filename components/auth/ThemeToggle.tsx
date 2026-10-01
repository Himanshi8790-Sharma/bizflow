"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme"
        aria-expanded={isOpen}
        className="flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 hover:bg-muted/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background shadow-xs"
      >
        {resolvedTheme === "dark" ? (
          <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-200 rotate-0 hover:-rotate-12" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200 rotate-0 hover:rotate-45" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl bg-card border border-border shadow-xl p-1.5 z-50 animate-fade-in-rise">
          <button
            type="button"
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              theme === "light"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </div>
            {theme === "light" && <Check className="w-3.5 h-3.5 text-primary" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              theme === "dark"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark</span>
            </div>
            {theme === "dark" && <Check className="w-3.5 h-3.5 text-primary" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              theme === "system"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-slate-400" />
              <span>System</span>
            </div>
            {theme === "system" && <Check className="w-3.5 h-3.5 text-primary" />}
          </button>
        </div>
      )}
    </div>
  );
}
