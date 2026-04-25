"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
    title: string;
    description: string;
    highlightWord?: string;
}

export function SectionHeader({
    title,
    description,
    highlightWord
}: SectionHeaderProps) {
    return (
        <div className="mx-auto max-w-3xl text-center">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
                {highlightWord ? (
                    <>
                        {title.split(highlightWord)[0]}
                        <span className="text-primary">{highlightWord}</span>
                        {title.split(highlightWord)[1]}
                    </>
                ) : (
                    title
                )}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="mt-4 text-base text-muted-foreground sm:text-lg"
            >
                {description}
            </motion.p>
        </div>
    );
}
