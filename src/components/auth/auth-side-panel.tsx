"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    PackageCheck,
    MapPin,
    Truck,
    ShieldCheck,
    Bell,
    BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "../shared/logo";

const slides = [
    {
        step: "01",
        icon: PackageCheck,
        title: "Place Your Order",
        description:
            "Schedule a pickup in seconds. Enter the parcel details, choose a delivery type, and confirm — we handle everything else.",
        visual: ["Parcel #NX-00124", "Fragile · 2.3 kg", "Pickup: 12 Gulshan Ave"],
        accent: "from-primary/10 to-primary/5",
    },
    {
        step: "02",
        icon: Truck,
        title: "Real-Time Tracking",
        description:
            "Follow your parcel at every step of the journey, from pickup to doorstep delivery, with live status updates.",
        visual: ["Picked up", "In transit · 14 km away", "Est. arrival: 2:30 PM"],
        accent: "from-blue-500/10 to-blue-500/5",
    },
    {
        step: "03",
        icon: MapPin,
        title: "Last-Mile Delivery",
        description:
            "Our verified riders deliver to the right address, on time. Proof of delivery captured automatically.",
        visual: ["Out for delivery", "Rider: Karim R.", "ETA: 10 minutes"],
        accent: "from-violet-500/10 to-violet-500/5",
    },
    {
        step: "04",
        icon: Bell,
        title: "Instant Notifications",
        description:
            "Customers and senders both get notified at every milestone — no more wondering where a parcel is.",
        visual: ["Order confirmed ✓", "Parcel picked up ✓", "Out for delivery ✓"],
        accent: "from-amber-500/10 to-amber-500/5",
    },
    {
        step: "05",
        icon: ShieldCheck,
        title: "Secure & Insured",
        description:
            "Every parcel is handled with care. Optional insurance coverage and full accountability at each handoff.",
        visual: ["Verified rider", "Contactless handoff", "Insurance available"],
        accent: "from-emerald-500/10 to-emerald-500/5",
    },
    {
        step: "06",
        icon: BarChart3,
        title: "Analytics Dashboard",
        description:
            "Merchants and admins get a full picture: delivery rates, rider performance, and revenue — all in one place.",
        visual: ["98% on-time rate", "50K+ deliveries", "4.9 avg. rating"],
        accent: "from-rose-500/10 to-rose-500/5",
    },
];

const INTERVAL = 4000;

const slideVariants = {
    enter: (dir: number) => ({
        x: dir > 0 ? 48 : -48,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    exit: (dir: number) => ({
        x: dir > 0 ? -48 : 48,
        opacity: 0,
        transition: { duration: 0.35, ease: [0.55, 0.055, 0.675, 0.19] as const },
    }),
};

export function AuthSidePanel({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    const [[index, dir], setSlide] = useState([0, 1]);

    useEffect(() => {
        const id = setInterval(() => {
            setSlide(([prev]) => [(prev + 1) % slides.length, 1]);
        }, INTERVAL);
        return () => clearInterval(id);
    }, []);

    const slide = slides[index];
    const Icon = slide.icon;

    return (
        <div className="flex h-full w-full flex-col bg-muted/20">
            {/* Top: brand + headline */}
            <div className="flex shrink-0 flex-col gap-6 px-10 pb-0 pt-10">
                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <Logo noLink className="h-8 w-auto text-primary" />
                </div>

                {/* Headline */}
                <div className="space-y-2 mt-10">
                    <motion.h2
                        className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        className="max-w-xl text-lg md:text-xl lg:text-2xl leading-relaxed text-muted-foreground"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {description}
                    </motion.p>
                </div>
            </div>

            {/* Middle: sliding card */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-10 py-8">
                <AnimatePresence custom={dir} mode="wait">
                    <motion.div
                        key={index}
                        custom={dir}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full"
                    >
                        <Card className="overflow-hidden rounded-2xl border shadow-sm">
                            {/* Accent gradient header */}
                            <div className={`bg-linear-to-br ${slide.accent} px-6 pt-6 pb-5`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/80 shadow-xs">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="font-nevera text-4xl font-bold text-foreground/10 select-none">
                                        {slide.step}
                                    </span>
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-foreground">
                                    {slide.title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                    {slide.description}
                                </p>
                            </div>

                            {/* Visual list */}
                            <CardContent className="px-6 py-4">
                                <ul className="space-y-2.5">
                                    {slide.visual.map((line, i) => (
                                        <li
                                            key={line}
                                            className="flex items-center gap-2.5 text-sm text-muted-foreground"
                                        >
                                            <span
                                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary"
                                            >
                                                {i + 1}
                                            </span>
                                            {line}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom: step indicators + progress */}
            <div className="shrink-0 px-10 pb-10 space-y-4">
                {/* Dot indicators */}
                <div className="flex items-center gap-1.5">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setSlide([i, i > index ? 1 : -1])}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === index
                                ? "w-6 bg-primary"
                                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                    <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                        {index + 1} / {slides.length}
                    </span>
                </div>

                {/* Auto-advance progress bar */}
                <div className="h-px w-full overflow-hidden rounded-full bg-border">
                    <motion.div
                        key={index}
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                    />
                </div>
            </div>
        </div>
    );
}
