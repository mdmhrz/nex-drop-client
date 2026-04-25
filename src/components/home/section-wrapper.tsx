"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionWrapperProps {
    children: ReactNode;
    className?: string;
    hasPadding?: boolean;
}

export function SectionWrapper({ children, className = "", hasPadding = true }: SectionWrapperProps) {
    return (
        <section className={cn(
            "w-full",
            hasPadding && "px-6 py-16 sm:py-20 md:py-24 lg:py-28",
            className
        )}>
            <div className="mx-auto max-w-7xl">
                {children}
            </div>
        </section>
    );
}
