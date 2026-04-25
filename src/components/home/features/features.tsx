"use client";

import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Headphones } from "lucide-react";
import { SectionWrapper } from "@/components/home/section-wrapper";

const features = [
    {
        id: 1,
        icon: MapPin,
        title: "Live Parcel Tracking",
        description:
            "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    },
    {
        id: 2,
        icon: ShieldCheck,
        title: "100% Safe Delivery",
        description:
            "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    },
    {
        id: 3,
        icon: Headphones,
        title: "24/7 Call Center Support",
        description:
            "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
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

const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
};

export function Features() {
    return (
        <SectionWrapper className="border-t-2 border-b-2 border-dashed section-divider max-w-7xl mx-auto mt-10">
            {/* Features List */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-12 my-0"
            >
                {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div
                            key={feature.id}
                            variants={featureVariants}
                            className="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-6 rounded-xl shadow-sm bg-card border border-border"
                        >
                            {/* Left Icon */}
                            <div className="w-full md:w-auto md:shrink-0 flex justify-center">
                                <div className="h-40 w-40 md:h-48 md:w-48 flex items-center justify-center rounded-lg bg-primary/10">
                                    <Icon className="h-24 w-24 md:h-32 md:w-32 text-primary" strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Divider (hidden on mobile) */}
                            <div className="hidden md:flex h-40 w-px items-stretch">
                                <div className="w-full border-l-2 border-dashed section-divider" />
                            </div>

                            {/* Right Content */}
                            <div className="w-full flex-1 text-center md:text-left flex flex-col justify-center">
                                <h3 className="text-xl md:text-2xl font-bold section-heading-text">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </SectionWrapper>
    );
}