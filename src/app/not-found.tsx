import Link from "next/link";
import { PackageX, Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/shared/logo";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-16">
            {/* Logo */}
            <div className="mb-12">
                <Logo />
            </div>

            {/* Main content */}
            <div className="flex flex-col items-center text-center max-w-md gap-6">
                {/* Parcel icon with pulse ring */}
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                        <PackageX className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Error badge */}
                <Badge variant="outline" className="border-primary/30 text-primary text-xs px-3 py-1">
                    Error 404
                </Badge>

                {/* Heading */}
                <div className="space-y-2">
                    <h1 className="section-heading-text text-4xl md:text-5xl font-bold tracking-tight">
                        Parcel Not Found
                    </h1>
                    <p className="text-muted-foreground text-base leading-relaxed">
                        Looks like this parcel got lost along the way. The page you&apos;re looking for doesn&apos;t exist or may have been moved.
                    </p>
                </div>

                {/* Tracking code style error info */}
                <div className="w-full rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-left">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Route</span>
                        <span className="font-mono text-destructive">URL not found</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="destructive" className="text-[10px]">404</Badge>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Resolution</span>
                        <span className="text-primary text-xs font-medium">Return to homepage</span>
                    </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button asChild className="flex-1 gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1 gap-2">
                        <Link href="/track-order">
                            <Search className="h-4 w-4" />
                            Track a Parcel
                        </Link>
                    </Button>
                </div>

                <Button variant="ghost" asChild className="text-muted-foreground gap-2 text-sm">
                    <Link href="javascript:history.back()">
                        <ArrowLeft className="h-4 w-4" />
                        Go back
                    </Link>
                </Button>
            </div>
        </div>
    );
}
