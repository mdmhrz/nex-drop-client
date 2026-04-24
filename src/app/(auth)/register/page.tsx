import { RegisterForm } from "@/components/auth/register-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthIcon } from "@/components/auth/auth-icon";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  return (
    <AuthLayout
      leftSideTitle="Create Your Account"
      leftSideDescription="Join NexDrop to start shipping parcels worldwide. Track your shipments, manage deliveries, and connect with logistics partners effortlessly."
      backButtonLabel="Back to Login"
      backButtonHref="/login"
    >
      <div className="space-y-6">
        <AuthIcon icon={UserPlus} />

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your information to get started
          </p>
        </div>

        <RegisterForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <a href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
