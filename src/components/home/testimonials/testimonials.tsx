'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/home/section-wrapper';
import { SectionHeader } from '@/components/home/section-header';

const testimonials = [
    {
        name: 'Amir Hossin',
        title: 'Senior Software Engineer',
        message:
            'NexDrop made my delivery seamless. Real-time tracking and fast pickup exceeded my expectations!',
        avatar: 'AH',
    },
    {
        name: 'Rasel Ahamed',
        title: 'CTO',
        message:
            'I trust NexDrop for all business parcels. Efficient, secure, and always on time.',
        avatar: 'RA',
    },
    {
        name: 'Nasir Uddin',
        title: 'CEO',
        message:
            'Incredible customer service. NexDrop has simplified our shipping process entirely.',
        avatar: 'NU',
    },
    {
        name: 'Sarah Jahan',
        title: 'Online Store Owner',
        message:
            "Fastest delivery I've used. They handled fragile items perfectly!",
        avatar: 'SJ',
    },
    {
        name: 'Arman Kabir',
        title: 'Logistics Manager',
        message:
            'Their tracking system is very accurate. Highly recommended for corporate use.',
        avatar: 'AK',
    },
    {
        name: 'Tanvir Hasan',
        title: 'Freelancer',
        message:
            "Needed a parcel sent urgently — NexDrop delivered faster than I expected!",
        avatar: 'TH',
    },
];

const Testimonials = () => {
    return (
        <SectionWrapper
    hasPadding={false}
    topPadding={false}
        >
            <SectionHeader
                highlightWord='customers'
                title="What our customers are saying"
                description="Hear from satisfied users who trust NexDrop for reliable and fast parcel delivery. We're committed to making shipping easier and stress-free!"
            />

            <div className="relative max-w-5xl mx-auto mt-16">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    slidesPerView={3}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: false,
                        el: '.testimonials-pagination',
                    }}
                    className="pb-6"
                    breakpoints={{
                        0: { slidesPerView: 1, spaceBetween: 20 },
                        640: { slidesPerView: 2, spaceBetween: 15 },
                        768: { slidesPerView: 3, spaceBetween: 20 },
                    }}
                >
                    {testimonials.map((item, index) => (
                        <SwiperSlide key={index}>
                            {({ isActive }) => (
                                <motion.div
                                    initial={{ opacity: 0.5, scale: 0.95 }}
                                    animate={{
                                        opacity: isActive ? 1 : 0.5,
                                        scale: isActive ? 1 : 0.85,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={`h-full transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-50'
                                        }`}
                                >
                                    <div className="bg-white dark:bg-card rounded-2xl p-8 h-96 flex flex-col justify-between shadow-sm border border-gray-200 dark:border-border">
                                        {/* Quote Icon */}
                                        <div className="text-5xl text-primary/40 leading-none">
                                            &ldquo;
                                        </div>

                                        {/* Message */}
                                        <p className="text-foreground text-sm md:text-base leading-relaxed grow">
                                            {item.message}
                                        </p>

                                        {/* Divider */}
                                        <div className="border-t-2 border-dashed border-gray-300 dark:border-border/50 my-6" />

                                        {/* Avatar and Info */}
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                <span className="text-sm font-semibold text-primary">{item.avatar}</span>
                                            </div>
                                            <div className="text-left min-w-0">
                                                <h4 className="font-semibold text-foreground text-sm truncate">{item.name}</h4>
                                                <p className="text-xs text-muted-foreground truncate">{item.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Pagination */}
                <div className="flex justify-center mt-10 mb-8">
                    <div className="swiper-pagination testimonials-pagination" />
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Testimonials;
