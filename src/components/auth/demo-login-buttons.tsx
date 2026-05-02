"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { authService, type LoginData } from "@/services/auth.service";
import { Zap } from "lucide-react";

interface DemoCredentials {
    email: string;
    password: string;
    label: string;
}

/**
 * Demo Login Buttons Component
 *
 * This component provides quick login buttons for demo/testing purposes.
 * It reads credentials from environment variables:
 * - NEXT_PUBLIC_DEMO_ADMIN_EMAIL
 * - NEXT_PUBLIC_DEMO_ADMIN_PASSWORD
 * - NEXT_PUBLIC_DEMO_RIDER_EMAIL
 * - NEXT_PUBLIC_DEMO_RIDER_PASSWORD
 * - NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL
 * - NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD
 *
 * To disable: Set NEXT_PUBLIC_DEMO_LOGIN_ENABLED=false in .env.local
 * To remove: Delete this component and remove from LoginForm
 */

export function DemoLoginButtons() {
    const [loadingEmail, setLoadingEmail] = useState<string | null>(null);

    // Check if demo login is enabled
    const isEnabled = process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === "true";

    if (!isEnabled) {
        return null;
    }

    const demoCredentials: DemoCredentials[] = [
        {
            label: "Admin Demo",
            email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || "",
            password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "",
        },
        {
            label: "Rider Demo",
            email: process.env.NEXT_PUBLIC_DEMO_RIDER_EMAIL || "",
            password: process.env.NEXT_PUBLIC_DEMO_RIDER_PASSWORD || "",
        },
        {
            label: "Customer Demo",
            email: process.env.NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL || "",
            password: process.env.NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD || "",
        },
    ];

    // Filter out any missing credentials
    const validCredentials = demoCredentials.filter(
        (cred) => cred.email && cred.password
    );

    if (validCredentials.length === 0) {
        return null;
    }

    const handleDemoLogin = async (email: string, password: string, label: string) => {
        setLoadingEmail(email);
        const toastId = toast.loading(`Logging in as ${label}...`);

        try {
            const response = await authService.login({
                email,
                password,
            } as LoginData);

            if (response.success) {
                toast.success(`Welcome ${label}!`, { id: toastId });

                // Get user role from response and redirect accordingly
                const userRole = response.data?.user?.role;
                let redirectPath = "/dashboard";

                if (userRole === "RIDER") {
                    redirectPath = "/rider-dashboard";
                } else if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
                    redirectPath = "/admin-dashboard";
                }

                // Refresh page to pick up cookies, then redirect
                setTimeout(() => {
                    window.location.href = redirectPath;
                }, 500);
            }
        } catch (error: unknown) {
            const errorMessage =
                (error as { message?: string })?.message || `Failed to login as ${label}`;
            toast.error(errorMessage, { id: toastId });
            setLoadingEmail(null);
        }
    };

    return (
        <div className="space-y-3">
            <Separator className="my-4" />

            <div className="text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Zap className="h-3 w-3" />
                    Demo Accounts
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {validCredentials.map((cred) => (
                    <Button
                        key={cred.email}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            handleDemoLogin(cred.email, cred.password, cred.label)
                        }
                        disabled={loadingEmail !== null}
                        className="text-xs h-9"
                    >
                        {loadingEmail === cred.email ? "Logging in..." : `Login as ${cred.label.split(" ")[0]}`}
                    </Button>
                ))}
            </div>

            <p className="text-xs text-muted-foreground text-center">
                Demo credentials for testing
            </p>
        </div>
    );
}
