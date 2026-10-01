"use client";

import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, id, error, icon, helperText, className = "", ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined;

    return (
      <div className="space-y-1 w-full">
        <label
          htmlFor={id}
          className="block text-[11px] font-semibold tracking-wider text-foreground/80 uppercase select-none"
        >
          {label}
        </label>

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 pointer-events-none text-muted-foreground transition-colors">
              {icon}
            </div>
          )}

          <input
            id={id}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={`w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${
              icon ? "pl-9" : ""
            } ${
              error
                ? "border-destructive/80 focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                : "border-input hover:border-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-ring/20"
            } ${className}`}
            {...props}
          />
        </div>

        {error ? (
          <p id={errorId} className="flex items-center gap-1 mt-1 text-[11px] text-destructive font-medium animate-fade-in-rise">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-muted-foreground mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
