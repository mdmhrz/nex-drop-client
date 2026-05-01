"use client";

import { Package, MapPin, Truck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/home/section-header";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { Card } from "@/components/ui/card";

const steps = [
    {
        id: 1,
        icon: Package,
        title: "Book Your Parcel",
        description: "Easily schedule a pick-up through our online platform or app.",
    },
    {
        id: 2,
        icon: MapPin,
        title: "We Pick It Up",
        description: "Our delivery partner collects your parcel from your doorstep.",
    },
    {
        id: 3,
        icon: Truck,
        title: "In Transit",
        description: "Track your package in real-time while it's on the way.",
    },
    {
        id: 4,
        icon: CheckCircle,
        title: "Delivered",
        description: "Your parcel is delivered safely and securely, on time.",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
};

export function HowItWorks() {
    return (
        <section className="max-w-7xl mx-auto px-4 xl:px-0 py-10 md:py-20 lg:py-28">
            {/* Section Header */}
            <SectionHeader
                title="How It Works"
                description="Simple, fast, and secure delivery in just a few steps."
                highlightWord="Works"
            />

            {/* Steps Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8"
            >
                {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                        <motion.div
                            key={step.id}
                            variants={cardVariants}
                            className="h-full"
                        >
                            <Card className="group border dark:border-0 relative bg-card/50 backdrop-blur-sm p-4 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:bg-card sm:p-5 overflow-hidden cursor-pointer h-full flex flex-col">
                                {/* Icon container */}
                                <div className="mb-3 flex h-16 w-16 items-center justify-center bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20 mx-auto rounded-lg">
                                    <Icon className="h-8 w-8 text-primary" />
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-semibold text-foreground sm:text-lg">
                                    {step.title}
                                </h3>

                                {/* Divider */}
                                <div className="my-2 h-0.5 w-8 bg-primary mx-auto" />

                                {/* Description */}
                                <p className="text-sm leading-relaxed text-muted-foreground grow">
                                    {step.description}
                                </p>

                                {/* Animated bottom bar on hover */}
                                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
