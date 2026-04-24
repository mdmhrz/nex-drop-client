import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthIcon } from "@/components/auth/auth-icon";
import { Lock } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      leftSideTitle="Reset Your Password"
      leftSideDescription="Secure your account by setting a new password with the verification code."
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <div className="space-y-6">
        <AuthIcon icon={Lock} />

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="text-sm text-muted-foreground">
            Enter the verification code and your new password
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </AuthLayout>
  );
}
