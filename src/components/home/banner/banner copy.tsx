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
            { text: " & Easy", highlight: false },
            { text: "\nPickup", highlight: false },
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
        <section className="relative w-full overflow-hidden rounded-2xl">


        

            {/* Background image layer (fills full banner) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`bg-${slide.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5 } }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    className="relative h-85 w-full md:h-95 lg:h-105"
                >
                    <Image
                        src={slide.image}
                        alt={slide.imageAlt}
                        fill
                        className="object-cover object-right"
                        priority={slide.id === 1}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Text overlay — sits on the left half */}
            <div className="absolute inset-0 flex items-center">
                <div className="w-1/2 px-10 lg:px-16">
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={slide.id}
                            initial={{ opacity: 0, x: -28 }}
                            animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } }}
                            exit={{ opacity: 0, x: -20, transition: { duration: 0.3, ease: [0.55, 0.055, 0.675, 0.19] as const } }}
                            className="text-3xl font-bold leading-tight text-[#0d3b2e] md:text-4xl lg:text-[2.5rem]"
                        >
                            {slide.heading.map((part, i) =>
                                part.text.split("\n").map((line, j) => (
                                    <span key={`${i}-${j}`}>
                                        {j > 0 && <br />}
                                        <span className={part.highlight ? "text-primary" : "text-[#0d3b2e]"}>
                                            {line}
                                        </span>
                                    </span>
                                ))
                            )}
                        </motion.h1>
                    </AnimatePresence>

                    {/* Slide indicators */}
                    <div className="mt-6 flex items-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`h-1 rounded-full transition-all duration-300 ${i === index
                                        ? "banner-dot-active bg-[#0d3b2e]"
                                        : "banner-dot-inactive bg-[#0d3b2e]/30"
                                    }`}
                            >
                                {i === index && (
                                    <motion.span
                                        key={index}
                                        className="block h-full rounded-full bg-primary"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
