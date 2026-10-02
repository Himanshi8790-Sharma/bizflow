"use client";

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showStrengthMeter?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, id, error, showStrengthMeter = false, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    // Calculate strength score
    const getStrength = (val: string) => {
      let score = 0;
      if (!val) return { score: 0, label: "", color: "bg-muted" };
      if (val.length >= 8) score += 1;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 1;
      if (/[0-9]/.test(val)) score += 1;
      if (/[^A-Za-z0-9]/.test(val)) score += 1;

      switch (score) {
        case 1:
          return { score: 1, label: "Weak", color: "bg-destructive" };
        case 2:
          return { score: 2, label: "Fair", color: "bg-amber-500" };
        case 3:
          return { score: 3, label: "Good", color: "bg-primary" };
        case 4:
          return { score: 4, label: "Strong", color: "bg-emerald-500" };
        default:
          return { score: 0, label: "", color: "bg-muted" };
      }
    };

    const currentValue = (value as string) ?? internalValue;
    const strength = getStrength(currentValue);
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
          <div className="absolute left-3 pointer-events-none text-muted-foreground">
            <Lock className="w-4 h-4" />
          </div>

          <input
            id={id}
            ref={ref}
            type={showPassword ? "text" : "password"}
            value={value}
            aria-invalid={!!error}
            aria-describedby={errorId}
            onChange={handleChange}
            className={`w-full rounded-lg border bg-card pl-9 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? "border-destructive/80 focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                : "border-input hover:border-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-ring/20"
            }`}
            {...props}
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2.5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {showPassword ? (
              <EyeOff className="w-3.5 h-3.5 transition-transform duration-150 scale-100" />
            ) : (
              <Eye className="w-3.5 h-3.5 transition-transform duration-150 scale-100" />
            )}
          </button>
        </div>

        {/* Strength Meter Feedback */}
        {showStrengthMeter && currentValue && (
          <div className="space-y-0.5 pt-0.5 animate-fade-in-rise">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground font-medium">Strength:</span>
              <span className="font-semibold text-foreground">{strength.label}</span>
            </div>
            <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-secondary">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 transition-all duration-300 ${
                    step <= strength.score ? strength.color : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <p id={errorId} className="flex items-center gap-1 mt-1 text-[11px] text-destructive font-medium animate-fade-in-rise">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
