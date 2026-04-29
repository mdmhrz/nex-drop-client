"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const slides = [
    {
        id: 1,
        image: "/banner/slider-1.svg",
        imageAlt: "Warehouse forklift rider with parcels",
        heading: [
            { text: "We Make Sure Your ", highlight: false },
            { text: "Parcel Arrives", highlight: true },
            { text: " On Time – No Fuss.", highlight: false },
        ],
    },
    {
        id: 2,
        image: "/banner/slider-2.svg",
        imageAlt: "Delivery rider on scooter",
        heading: [
            { text: "Fastest ", highlight: false },
            { text: "Delivery", highlight: true },
            { text: " & Easy ", highlight: false },
            { text: "Pickup", highlight: false },
        ],
    },
    {
        id: 3,
        image: "/banner/slider-3.svg",
        imageAlt: "Delivery scooter with GPS pins",
        heading: [
            { text: "Delivery in ", highlight: false },
            { text: "30\nMinutes", highlight: true },
            { text: " at your\ndoorstep", highlight: false },
        ],
    },
];

const INTERVAL = 4500;

export function Banner() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, INTERVAL);
        return () => clearInterval(id);
    }, []);

    const slide = slides[index];

    return (
        <section className="relative w-full overflow-hidden rounded-2xl max-w-7xl mx-auto shadow-lg border border-border dark:border-white/10">
            {/* ── Code-built background ── */}
            <div className="absolute inset-0 bg-background" />
            <div className="banner-bg-diagonal absolute inset-0 bg-primary/30 dark:bg-primary/50" />
            <div className="absolute -right-16 -top-16 dark:inset-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-16 -top-16 light:inset-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

            {/* ── Content row ── */}
            <div className="relative flex flex-col h-80 sm:h-96 md:h-112 lg:h-128 sm:flex-row">

                {/* Left: text column */}
                <div className="flex w-full flex-col justify-center gap-5 px-6 py-10 sm:w-1/2 sm:py-0 sm:px-10 lg:px-16">

                    {/* man.svg — slide 1 only; h-9 placeholder keeps layout stable */}
                    <div className="h-9 shrink-0">

                        <Image
                            src="/banner/man.svg"
                            alt="Delivery person"
                            width={120}
                            height={36}
                            className="h-full w-auto object-contain logo-adaptive"
                        />

                    </div>

                    {/* Animated heading */}
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={slide.id}
                            initial={{ opacity: 0, x: -28 }}
                            animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } }}
                            exit={{ opacity: 0, x: -20, transition: { duration: 0.3, ease: [0.55, 0.055, 0.675, 0.19] as const } }}
                            className="text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl  lg:text-5xl"
                        >
                            {slide.heading.map((part, i) =>
                                part.text.split("\n").map((line, j) => (
                                    <span key={`${i}-${j}`}>
                                        {j > 0 && <br />}
                                        <span className={part.highlight ? "text-primary" : "text-foreground"}>
                                            {line}
                                        </span>
                                    </span>
                                ))
                            )}
                        </motion.h1>
                    </AnimatePresence>

                    {/* Hyphen-style pagination indicators */}
                    <div className="flex items-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`h-0.5 w-7 rounded-sm transition-colors duration-300 ${i === index ? "bg-foreground" : "bg-foreground/30"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: image column — consistent frame via equal inset */}
                <div className="relative h-52 w-full sm:h-full sm:w-1/2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`img-${slide.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.5 } }}
                            exit={{ opacity: 0, transition: { duration: 0.3 } }}
                            className="absolute inset-4 sm:inset-6 lg:inset-8"
                        >
                            <div className="relative h-full w-full">
                                <Image
                                    src={slide.image}
                                    alt={slide.imageAlt}
                                    fill
                                    className="object-contain object-center"
                                    priority={slide.id === 1}
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
