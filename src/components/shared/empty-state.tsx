import React from "react";
import Link from "next/link";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface EmptyStateAction {
    label: string;
    href: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
}

export interface EmptyStateProps {
    icon?: LucideIcon;
    title?: string;
    description?: string;
    actions?: EmptyStateAction[];
    className?: string;
}

export function EmptyState({
    icon: Icon = PackageX,
    title = "Something went wrong",
    description = "We couldn't load the data you requested. Please try again or contact support.",
    actions = [
        { label: "Go Back", href: "javascript:history.back()", variant: "outline" },
        { label: "Contact Support", href: "/contact", variant: "default" },
    ],
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-16 px-6 text-center",
                className
            )}
        >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                <Icon className="size-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">{title}</h2>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
            {actions.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {actions.map((action) => (
                        <Button key={action.href + action.label} variant={action.variant ?? "default"} asChild>
                            <Link href={action.href}>{action.label}</Link>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
