'use client';

import Link from "next/link";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { useEffect } from "react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function AuthError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error("Auth error:", error);
    }, [error]);

    return (
        <div className="min-h-[100dvh] pb-[env(safe-area-inset-bottom)]  flex flex-col items-center justify-center bg-background px-6 py-16">
            <div className="mb-12">
                <Logo />
            </div>

            <div className="flex flex-col items-center text-center max-w-lg gap-6">
                {/* Large error icon with background */}
                <div className="relative select-none leading-none">
                    <span className="text-[9rem] md:text-[12rem] font-bold tracking-tighter text-muted/40 dark:text-muted/20">
                        500
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20">
                            <AlertTriangle className="h-7 w-7 text-destructive" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h1 className="section-heading-text text-3xl md:text-4xl font-bold tracking-tight">
                        Authentication Error
                    </h1>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
                        An error occurred with your authentication.
                        Please refresh the page or try logging in again.
                    </p>
                    {error.message && (
                        <p className="text-xs text-muted-foreground/70 bg-muted/30 rounded-lg p-3 mt-4 font-mono">
                            {error.message}
                        </p>
                    )}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                    <Button onClick={reset} className="flex-1 rounded-full gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Try Again
                    </Button>
                    <Button variant="outline" asChild className="flex-1 rounded-full gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                <Button variant="ghost" size="sm" asChild className="text-muted-foreground gap-2">
                    <Link href="javascript:history.back()">
                        <ArrowLeft className="h-4 w-4" />
                        Go back
                    </Link>
                </Button>
            </div>
        </div>
    );
}
