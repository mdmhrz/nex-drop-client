import { AuthLayout } from "@/components/layouts/auth/auth-layout";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { AuthIcon } from "@/components/layouts/auth/auth-icon";
import { AuthSkeleton } from "@/components/layouts/auth/auth-skeleton";
import { MailCheck } from "lucide-react";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      leftSideTitle="Verify Your Email"
      leftSideDescription="Complete your registration by verifying your email address with the code sent to you."
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <div className="space-y-6">
        <AuthIcon icon={MailCheck} />

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-sm text-muted-foreground">
            Enter the verification code sent to your email
          </p>
        </div>

        <Suspense fallback={<AuthSkeleton />}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
