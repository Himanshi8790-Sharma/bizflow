import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create an Account | BizFlow SaaS",
  description: "Get started with BizFlow. Organize your workflows, team, and business analytics in one place.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your 14-day free trial. No credit card required."
    >
      <SignupForm />
    </AuthLayout>
  );
}