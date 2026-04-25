"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionWrapperProps {
    children: ReactNode;
    className?: string;
    hasPadding?: boolean;
    topPadding?: boolean;
    bottomPadding?: boolean;
    padding?: string;
    margin?: string;
    marginTop?: string;
    marginBottom?: string;
}

export function SectionWrapper({
    children,
    className = "",
    hasPadding = true,
    topPadding = true,
    bottomPadding = true,
    padding = "",
    margin = "",
    marginTop = "",
    marginBottom = "",
}: SectionWrapperProps) {
    return (
        <section
            className={cn(
                "w-full px-6 lg:px-0",
                hasPadding && "py-16 sm:py-20 md:py-24 lg:py-32",
                topPadding && !hasPadding && "pt-16 sm:pt-20 md:pt-24 lg:pt-28",
                bottomPadding && !hasPadding && "pb-16 sm:pb-20 md:pb-24 lg:pb-28",
                padding && padding,
                margin && margin,
                marginTop && marginTop,
                marginBottom && marginBottom,
                className
            )}
        >
            <div className="mx-auto max-w-7xl">
                {children}
            </div>
        </section>
    );
}
