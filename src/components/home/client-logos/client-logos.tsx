"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const logos = [
    { id: 1, name: "Amazon", src: "/brands/amazon.png" },
    { id: 2, name: "Casio", src: "/brands/casio.png" },
    { id: 3, name: "Moon Star", src: "/brands/moonstar.png" },
    { id: 4, name: "Randstad", src: "/brands/randstad.png" },
    { id: 5, name: "Amazon Vector", src: "/brands/amazon_vector.png" },
    { id: 6, name: "Start People", src: "/brands/start-people 1.png" },
    { id: 7, name: "Start", src: "/brands/start.png" },
];

const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
};

export function ClientLogos() {
    // Duplicate logos for infinite scroll effect
    const scrollingLogos = [...logos, ...logos];

    return (
        <section className="px-4 xl:px-0 pt-10 md:pt-16 lg:pt-20">
            {/* Simple Heading */}
            <div className="mx-auto max-w-6xl text-center">
                <h2 className="text-2xl font-bold tracking-tight section-heading-text">
                    We&apos;ve helped thousands of sales teams
                </h2>
            </div>

            {/* Scrolling Logos Container */}
            <div className="mx-auto mt-4 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="group relative flex gap-8 overflow-hidden rounded-lg p-6"
                >
                    {/* Gradient overlays for smooth edges */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background to-transparent" />

                    {/* Scrolling logos */}
                    <motion.div
                        className="flex gap-12"
                        animate={{ x: [0, -400] }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {scrollingLogos.map((logo, index) => (
                            <motion.div
                                key={`${logo.id}-${index}`}
                                variants={logoVariants}
                                className="flex shrink-0 items-center justify-center"
                            >
                                <div className="relative h-16 w-32 transition-transform duration-300 hover:scale-110">
                                    <Image
                                        src={logo.src}
                                        alt={logo.name}
                                        fill
                                        className="object-contain logo-adaptive"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Second scroll for seamless loop */}
                    <motion.div
                        className="flex gap-12"
                        animate={{ x: [0, -400] }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {scrollingLogos.map((logo, index) => (
                            <motion.div
                                key={`${logo.id}-${index}-2`}
                                variants={logoVariants}
                                className="flex shrink-0 items-center justify-center"
                            >
                                <div className="relative h-16 w-32 transition-transform duration-300 hover:scale-110">
                                    <Image
                                        src={logo.src}
                                        alt={logo.name}
                                        fill
                                        className="object-contain logo-adaptive"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
