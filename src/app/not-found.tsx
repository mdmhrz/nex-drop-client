import Link from "next/link";
import { LayoutDashboard, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function NotFound() {
    return (
        <div className="min-h-[100dvh] pb-[env(safe-area-inset-bottom)]  flex flex-col items-center justify-center bg-background px-6 py-16">
            <div className="mb-12">
                <Logo />
            </div>

            <div className="flex flex-col items-center text-center max-w-lg gap-6">
                {/* Large 404 with icon overlay */}
                <div className="relative select-none leading-none">
                    <span className="text-[9rem] md:text-[12rem] font-bold tracking-tighter text-muted/40 dark:text-muted/20">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                            <LayoutDashboard className="h-7 w-7 text-primary" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h1 className="section-heading-text text-3xl md:text-4xl font-bold tracking-tight">
                        Page Not Found
                    </h1>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
                        The page you&apos;re looking for doesn&apos;t exist in this system.
                        It may have been moved, renamed, or the URL might be incorrect.
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                    <Button asChild className="flex-1 rounded-full gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1 rounded-full gap-2">
                        <Link href="/dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                            Go to Dashboard
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


