import { AuthLayout } from "@/components/layouts/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthIcon } from "@/components/layouts/auth/auth-icon";
import { KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      leftSideTitle="Reset Your Password"
      leftSideDescription="Recover your account by requesting an OTP via email."
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <div className="space-y-6">
        <AuthIcon icon={KeyRound} />

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Forgot password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a code to reset your password
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  );
}
