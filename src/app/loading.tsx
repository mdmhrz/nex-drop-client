"use client";

import { useEffect, useState } from "react";
import { Truck, PackageCheck, MapPin, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/shared/logo";

const stages = [
    { icon: PackageCheck, label: "Order Placed" },
    { icon: Truck, label: "In Transit" },
    { icon: MapPin, label: "Out for Delivery" },
    { icon: CheckCircle2, label: "Delivered" },
];

export default function Loading() {
    const [progress, setProgress] = useState(0);
    const [activeStage, setActiveStage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                const next = prev + 1.2;
                setActiveStage(Math.min(Math.floor((next / 100) * stages.length), stages.length - 1));
                return next;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-background px-6">
            {/* Logo */}
            <Logo />

            {/* Animated parcel journey */}
            <div className="w-full max-w-sm space-y-6">
                {/* Stage icons with connector line */}
                <div className="relative flex items-center justify-between">
                    {/* connector line background */}
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
                    {/* progress fill */}
                    <div
                        className="absolute inset-y-0 left-0 top-1/2 h-px -translate-y-1/2 bg-primary transition-all duration-300"
                        style={{ width: `${Math.min(progress, 95)}%` }}
                    />

                    {stages.map((stage, i) => {
                        const Icon = stage.icon;
                        const isActive = i === activeStage;
                        const isDone = i < activeStage;

                        return (
                            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                                <div
                                    className={[
                                        "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500",
                                        isDone
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : isActive
                                                ? "border-primary bg-primary/10 text-primary animate-pulse"
                                                : "border-border bg-background text-muted-foreground",
                                    ].join(" ")}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                                <span
                                    className={[
                                        "text-[10px] font-medium whitespace-nowrap",
                                        isDone || isActive ? "text-primary" : "text-muted-foreground",
                                    ].join(" ")}
                                >
                                    {stage.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Progress bar */}
                <Progress value={progress} className="h-1.5" />

                {/* Status text */}
                <p className="text-center text-sm text-muted-foreground">
                    {stages[activeStage].label} &mdash; Loading your experience...
                </p>
            </div>
        </div>
    );
}
