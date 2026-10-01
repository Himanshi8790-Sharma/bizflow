"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowRight, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    const payload = {
      email: data.email,
      password: data.password,
    };

    console.log("[BizFlow Auth] Submitting Login Payload:", payload);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
    } catch (err) {
      setServerError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {serverError && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium animate-fade-in-rise">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 animate-fade-in-rise">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Welcome back!</h3>
          <p className="text-xs text-muted-foreground">
            Authentication successful. Redirecting to your dashboard...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          {/* Email input */}
          <FormInput
            id="email"
            type="email"
            label="Work Email"
            placeholder="name@company.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            disabled={isLoading}
            {...register("email")}
          />

          {/* Password input */}
          <PasswordInput
            id="password"
            label="Password"
            placeholder="••••••••••••"
            error={errors.password?.message}
            disabled={isLoading}
            {...register("password")}
          />

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                disabled={isLoading}
                {...register("rememberMe")}
                className="w-3.5 h-3.5 rounded border-input bg-card text-primary focus:ring-ring accent-primary cursor-pointer"
              />
              <span>Remember device</span>
            </label>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Password reset functionality will send a recovery email.");
              }}
              className="font-medium text-primary hover:underline transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-2.5 px-4 text-xs sm:text-sm font-semibold shadow-sm hover:brightness-110 active:scale-[0.99] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Social Logins Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-background px-2.5 text-muted-foreground font-medium tracking-wider">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Placeholders */}
      <div className="grid grid-cols-1">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => console.log("Google Login placeholder")}
          className="flex items-center justify-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/50 hover:border-muted-foreground/30 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google</span>
        </button>

        {/* <button
          type="button"
          disabled={isLoading}
          onClick={() => console.log("GitHub Login placeholder")}
          className="flex items-center justify-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/50 hover:border-muted-foreground/30 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </button> */}
      </div>

      {/* Switch to Signup Link */}
      <p className="text-center text-xs text-muted-foreground pt-1">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary hover:underline transition-colors"
        >
          Create one now
        </Link>
      </p>
    </div>
  );
}
