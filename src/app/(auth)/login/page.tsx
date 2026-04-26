import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/layouts/auth/auth-layout";
import { AuthIcon } from "@/components/layouts/auth/auth-icon";
import { LogIn } from "lucide-react";

export default function LoginPage() {
    return (
        <AuthLayout
            leftSideTitle="Welcome Back"
            leftSideDescription="Sign in to your account to track shipments, manage deliveries, and access all your parcel management features."
            backButtonLabel="Back to Register"
            backButtonHref="/register"
        >
            <div className="space-y-6">
                <AuthIcon icon={LogIn} />

                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your credentials to access your account
                    </p>
                </div>

                <LoginForm />

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Don&apos;t have an account? </span>
                    <a href="/register" className="text-primary hover:underline font-medium">
                        Sign up
                    </a>
                </div>
            </div>
        </AuthLayout>
    );
}