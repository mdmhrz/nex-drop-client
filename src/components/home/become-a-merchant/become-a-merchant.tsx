"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/shared/primary-button";

export function BecomeAMerchant() {
    return (
        <SectionWrapper>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                viewport={{ once: true }}
                className="merchant-bg relative overflow-hidden rounded-2xl p-6 md:p-10 lg:p-16"
            >
                {/* Background - Wavy pattern */}
                <div className="absolute top-0 left-0 right-0 h-16 md:h-20">
                    <Image
                        src="/become-a-marchent/geometric-bg.svg"
                        alt="Background pattern"
                        fill
                        className="w-full h-full object-cover "
                    />
                </div>

                {/* Main container */}
                <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Left Content */}
                    <div className="flex-1 space-y-6 text-center lg:text-left">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
                        >
                            Merchant and Customer Satisfaction is Our{" "}
                            <span className="text-primary">First Priority</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
                        >
                            We offer the lowest delivery charge with the highest value along with 100% safety of your product. NexDrop delivers your parcels in every corner of Bangladesh right on time.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
                        >
                            <PrimaryButton
                                className="py-6"
                            >
                                Become a Merchant
                            </PrimaryButton>
                            <PrimaryButton variant="outline" className="py-6 border-primary text-primary">
                                Become a Customer
                            </PrimaryButton>

                        </motion.div>
                    </div>

                    {/* Right Image/SVG */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 flex items-center justify-center min-h-80 "
                    >
                        <div className="relative w-64 h-80 md:w-96 md:h-96">
                            <Image
                                src="/become-a-marchent/marchent-location.svg"
                                alt="Merchant illustration"
                                fill
                                className="object-contain "
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </SectionWrapper>
    );
}
