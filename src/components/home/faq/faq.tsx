'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionWrapper } from '@/components/home/section-wrapper';
import { SectionHeader } from '@/components/home/section-header';
import { PrimaryButton } from '@/components/shared/primary-button';

const faqs = [
    {
        question: 'How does NexDrop parcel delivery work?',
        answer:
            'NexDrop makes parcel delivery fast and effortless. You simply book a delivery through our platform, and our professional couriers pick up your parcel from your location and deliver it securely to the destination. You can track the entire process in real-time through our website.',
    },
    {
        question: 'Is NexDrop suitable for all types of packages?',
        answer:
            'Yes! NexDrop handles all standard parcel sizes — from small documents to larger boxes. For oversized or special items, you can contact our support team for custom delivery arrangements.',
    },
    {
        question: 'Does NexDrop offer same-day or express delivery?',
        answer:
            'Absolutely. We provide same-day and express delivery options within supported zones. Just select the desired delivery speed during checkout and we\'ll handle the rest with priority service.',
    },
    {
        question: 'Can I track my parcel in real-time?',
        answer:
            'Yes, every parcel comes with a unique tracking ID that allows you to monitor its status in real-time from pickup to delivery. You\'ll receive live updates via SMS or email as well.',
    },
    {
        question: 'How will I know when my parcel is delivered?',
        answer:
            'You will receive a delivery confirmation via SMS or email once the parcel reaches its destination. We also provide photo proof of delivery for added security and transparency.',
    },
];

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleIndex = (index: number) => {
        setOpenIndex(index === openIndex ? null : index);
    };

    return (
        <SectionWrapper
            hasPadding={false}
            topPadding={false}
        >
            <SectionHeader
                title="Frequently Asked Questions"
                description="Learn everything you need to know about NexDrop's fast, reliable, and secure parcel delivery services. From booking to tracking, we've got you covered!"
            />

            <div className="max-w-3xl mx-auto mt-16 space-y-3">
                {faqs.map((faq, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        viewport={{ once: true, margin: '-50px' }}
                        className={`rounded-xl border transition-all duration-300 ${openIndex === index
                            ? 'bg-primary/5 border-primary/30 dark:bg-primary/10 dark:border-primary/40 shadow-md'
                            : 'bg-white dark:bg-card border-gray-200 dark:border-border hover:border-primary/20 dark:hover:border-primary/30'
                            }`}
                    >
                        <button
                            className="w-full text-left px-6 py-4 font-medium text-foreground focus:outline-none flex justify-between items-center group"
                            onClick={() => toggleIndex(index)}
                        >
                            <span className="text-sm md:text-base">{faq.question}</span>
                            <motion.span
                                animate={{ rotate: openIndex === index ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="shrink-0 ml-4"
                            >
                                <ChevronDown className="w-5 h-5 text-primary group-hover:text-primary/80" />
                            </motion.span>
                        </button>

                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-4 text-sm md:text-base text-muted-foreground leading-relaxed border-t border-primary/10 dark:border-primary/20 pt-4">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* See More Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-3 mt-12"
            >
                <PrimaryButton
                    className='py-6'
                >
                    See More FAQ&apos;s
                </PrimaryButton>
                <motion.div
                    className="bg-foreground dark:bg-muted-foreground p-3 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: -45, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                >
                    <ArrowRight className="w-5 h-5 text-background dark:text-foreground" />
                </motion.div>
            </motion.div>
        </SectionWrapper>
    );
};

// Chevron down icon component
function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    );
}

export default FaqSection;
