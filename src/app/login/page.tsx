import type { Metadata } from "next";
import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { LoginForm } from "@/src/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in | BizFlow SaaS",
  description: "Sign in to manage your revenue, teams, and operations with BizFlow.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your business with BizFlow."
    >
      <LoginForm />
    </AuthLayout>
  );
}