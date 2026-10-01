"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, User, Mail, ArrowRight, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";

const signupSchema = z
  .object({
    organizationName: z
      .string()
      .trim()
      .min(2, "Organization name must be at least 2 characters"),

    name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email address is required")
      .email("Please enter a valid work email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(8, "Please confirm your password"),

    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms to create an account",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      organizationName: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setServerError(null);

    const backendPayload = {
      organizationName: data.organizationName,
      name: data.name,
      email: data.email,
      password: data.password,
    };

    console.log("[BizFlow Auth] Submitting Signup Backend Payload:", backendPayload);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsSuccess(true);
    } catch (err) {
      setServerError("An account with this email address already exists.");
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
          <h3 className="text-base font-bold text-foreground">Organization Created!</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your BizFlow workspace is ready. Check your email for verification.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold shadow-sm hover:brightness-110 transition-all"
            >
              Proceed to Sign in <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 sm:space-y-3" noValidate>
          {/* Organization Name */}
          <FormInput
            id="organizationName"
            type="text"
            label="Organization Name"
            placeholder="Acme Corp or BizFlow Inc."
            icon={<Building2 className="w-4 h-4" />}
            error={errors.organizationName?.message}
            disabled={isLoading}
            {...register("organizationName")}
          />

          {/* Full Name */}
          <FormInput
            id="name"
            type="text"
            label="Your Full Name"
            placeholder="Alex Morgan"
            icon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            disabled={isLoading}
            {...register("name")}
          />

          {/* Email */}
          <FormInput
            id="email"
            type="email"
            label="Work Email"
            placeholder="alex@acme.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            disabled={isLoading}
            {...register("email")}
          />

          {/* Password with Strength Meter */}
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Min 8 characters"
            showStrengthMeter
            error={errors.password?.message}
            disabled={isLoading}
            {...register("password")}
          />

          {/* Confirm Password */}
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            disabled={isLoading}
            {...register("confirmPassword")}
          />

          {/* Terms Checkbox */}
          <div className="pt-0.5">
            <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-muted-foreground">
              <input
                type="checkbox"
                disabled={isLoading}
                {...register("agreeToTerms")}
                className="mt-0.5 w-3.5 h-3.5 rounded border-input bg-card text-primary focus:ring-ring accent-primary shrink-0"
              />
              <span>
                I agree to BizFlow&apos;s{" "}
                <a href="#" className="underline font-medium text-foreground hover:text-primary">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline font-medium text-foreground hover:text-primary">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-0.5 text-[11px] text-destructive font-medium">
                {errors.agreeToTerms.message}
              </p>
            )}
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
                <span>Creating workspace...</span>
              </>
            ) : (
              <>
                <span>Create account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Switch to Login Link */}
      <p className="text-center text-xs text-muted-foreground pt-1">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
